import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // 提供静态文件服务

// Load data files
const questionsPath = path.join(__dirname, '../题库.json');
const authCodesPath = path.join(__dirname, '../授权码.json');

let questions = [];
let authCodes = [];

const loadData = () => {
  try {
    questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8')).questions;
    authCodes = JSON.parse(fs.readFileSync(authCodesPath, 'utf-8')).codes;
  } catch (err) {
    console.error('Error loading data files:', err);
  }
};

const saveAuthCodes = () => {
  try {
    fs.writeFileSync(authCodesPath, JSON.stringify({ codes: authCodes }, null, 2));
  } catch (err) {
    console.error('Error saving auth codes:', err);
  }
};

loadData();

// In-memory exam storage (考试数据存储)
const exams = new Map();
const examResults = []; // 存储考试结果

// ==================== Helper Functions ====================

/**
 * 验证授权码
 */
const verifyAuthCode = (code) => {
  const authCode = authCodes.find(c => c.code === code.toUpperCase());
  if (!authCode) return null;
  if (authCode.status === 'used') return null;
  return authCode;
};

/**
 * 标记授权码为已使用
 */
const markCodeAsUsed = (code) => {
  const authCode = authCodes.find(c => c.code === code.toUpperCase());
  if (authCode) {
    // UHOMES999 永不失效，仅记录日志不标记为 used
    if (authCode.code === 'UHOMES999') {
      console.log('UHOMES999 used, keeping status as unused');
      return;
    }
    authCode.status = 'used';
    authCode.usedAt = new Date().toISOString();
    saveAuthCodes();
  }
};

/**
 * 随机抽取30道题（按10个维度均衡覆盖 + 岗位筛选）
 */
const selectRandomQuestions = (count = 30, position) => {
  const categories = {
    'AI工具认知': [],
    '岗位场景应用': [],
    '思维转变识别': [],
    '实战判断': [],
    '多语言沟通': [],
    '客户服务': [],
    '数据分析': [],
    '流程优化': [],
    '风险控制': [],
    '创新应用': [],
  };

  // 按类别分组，同时过滤岗位相关题目
  questions.forEach(q => {
    if (categories[q.category] !== undefined) {
      // 如果题目有岗位标签，只有匹配的岗位才能看到
      if (q.positions && !q.positions.includes(position)) {
        return; // 跳过不匹配的岗位题目
      }
      categories[q.category].push(q);
    }
  });

  // 按比例抽取（均衡覆盖策略）
  // AI工具认知:3, 岗位场景应用:4, 思维转变识别:2, 实战判断:3
  // 多语言沟通:3, 客户服务:6, 数据分析:3, 流程优化:3, 风险控制:2, 创新应用:1
  const selected = [];
  const counts = {
    'AI工具认知': 3,
    '岗位场景应用': 4,
    '思维转变识别': 2,
    '实战判断': 3,
    '多语言沟通': 3,
    '客户服务': 6,
    '数据分析': 3,
    '流程优化': 3,
    '风险控制': 2,
    '创新应用': 1
  };

  Object.entries(counts).forEach(([cat, num]) => {
    const catQuestions = categories[cat] || [];
    const shuffled = catQuestions.sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, num));
  });

  // 再次随机打乱顺序
  return selected.sort(() => Math.random() - 0.5);
};

/**
 * 计算分数
 */
const calculateScore = (questions, answers) => {
  let score = 0;
  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  questions.forEach(q => {
    const userAnswer = answers[q.id];
    if (!userAnswer) return;

    const isCorrect =
      q.type === 'multiple'
        ? Array.isArray(userAnswer) &&
        userAnswer.sort().join(',') === q.answer.sort().join(',')
        : userAnswer === q.answer;

    if (isCorrect) {
      score += q.score;
    }
  });

  // 标准化到 100 分
  return Math.round((score / totalScore) * 100);
};

const pushToWebhook = async (examData) => {
  if (!process.env.WEBHOOK_URL) {
    console.log('No WEBHOOK_URL configured, skipping webhook push');
    return;
  }

  try {
    console.log('Pushing to webhook:', process.env.WEBHOOK_URL);
    console.log('Exam data:', examData);

    // 企业微信机器人格式
    const payload = {
      msgtype: 'markdown',
      markdown: {
        content: `## AI应用及思考能力测试结果\n\n**姓名:** <font color="info">${examData.name}</font>\n**邮箱:** ${examData.email}\n**岗位:** ${examData.position}\n**分数:** <font color="warning">${examData.score}/100</font>\n**状态:** <font color="${examData.score >= 80 ? 'info' : 'warning'}">${examData.score >= 80 ? '✅ 及格' : '❌ 不及格'}</font>\n**用时:** ${Math.round(examData.duration / 60)}分钟`
      }
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(process.env.WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Webhook response:', response.status, response.data);
    console.log('Webhook pushed successfully');
  } catch (err) {
    console.error('Error pushing to webhook:', err.message);
    console.error('Error details:', err.response?.data);
  }
};

// ==================== Routes ====================

/**
 * POST /api/verify
 * 验证授权码
 */
app.post('/api/verify', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: '授权码不能为空',
    });
  }

  const authCode = verifyAuthCode(code);
  if (!authCode) {
    return res.status(400).json({
      success: false,
      message: '授权码无效或已使用',
    });
  }

  res.json({
    success: true,
    message: '授权码验证成功',
  });
});

/**
 * POST /api/start
 * 开始考试，返回随机30道题
 */
app.post('/api/start', (req, res) => {
  const { code, name, email, position } = req.body;

  if (!code || !name || !email || !position) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
    });
  }

  // 验证授权码
  const authCode = verifyAuthCode(code);
  if (!authCode) {
    return res.status(400).json({
      success: false,
      message: '授权码无效或已使用',
    });
  }

  // 生成考试 ID
  const examId = uuidv4();

  // 随机选择题目
  const selectedQuestions = selectRandomQuestions(30, position);

  // 保存考试信息
  exams.set(examId, {
    examId,
    code,
    name,
    email,
    position,
    questions: selectedQuestions,
    startTime: Date.now(),
    status: 'in_progress',
  });

  // 返回题目（不包含答案）
  const questionsForClient = selectedQuestions.map(q => ({
    id: q.id,
    type: q.type,
    category: q.category,
    question: q.question,
    options: q.options,
    score: q.score,
  }));

  res.json({
    success: true,
    examId,
    questions: questionsForClient,
    duration: 60, // 60 分钟
  });
});

/**
 * POST /api/submit
 * 提交答卷，计分并推送结果
 */
app.post('/api/submit', async (req, res) => {
  const { examId, answers, duration } = req.body;

  if (!examId || !answers) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数',
    });
  }

  const examData = exams.get(examId);
  if (!examData) {
    return res.status(400).json({
      success: false,
      message: '考试不存在或已过期',
    });
  }

  // 计算分数
  const score = calculateScore(examData.questions, answers);
  const passed = score >= 80;

  // 标记授权码为已使用
  markCodeAsUsed(examData.code);

  // 准备推送数据
  const resultData = {
    name: examData.name,
    email: examData.email,
    position: examData.position,
    score,
    passed,
    duration: duration || 0,
    timestamp: new Date().toISOString(),
  };

  // 推送到 Webhook
  await pushToWebhook(resultData);

  // 保存结果到内存
  examResults.push({
    ...resultData,
    examId,
    submittedAt: new Date().toISOString()
  });

  // 清理考试数据
  examData.status = 'completed';
  examData.score = score;
  exams.delete(examId);

  res.json({
    success: true,
    message: '答卷已提交',
    score,
  });
});

/**
 * POST /api/test-submit
 * 测试提交答卷（模拟完整流程）
 */
app.post('/api/test-submit', async (req, res) => {
  // 模拟考试数据
  const mockExamData = {
    examId: 'test-exam-123',
    code: 'EXAM2601A3',
    name: '张三',
    email: 'zhangsan@example.com',
    position: '咨询顾问',
    questions: questions.slice(0, 10), // 取前10道题作为测试
    startTime: Date.now() - 2400000, // 40分钟前开始
    status: 'in_progress',
  };

  const { answers, duration = 2400 } = req.body;

  // 计算分数
  const score = calculateScore(mockExamData.questions, answers || {
    1: 'B', 2: 'B', 3: 'C', 4: 'D', 5: ['A', 'B', 'D'],
    6: 'B', 7: 'B', 8: 'D', 9: ['A', 'B', 'C'], 10: 'B'
  });
  const passed = score >= 80;

  // 准备推送数据
  const resultData = {
    name: mockExamData.name,
    email: mockExamData.email,
    position: mockExamData.position,
    score,
    passed,
    duration,
    timestamp: new Date().toISOString(),
  };

  // 推送到 Webhook
  await pushToWebhook(resultData);

  // 保存结果到内存
  examResults.push({
    ...resultData,
    examId: mockExamData.examId,
    submittedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: '测试答卷已提交',
    score,
    mockData: resultData
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Exam Backend API',
    version: '1.0.0',
    endpoints: {
      'POST /api/verify': '验证授权码',
      'POST /api/start': '开始考试',
      'POST /api/submit': '提交答卷',
      'GET /api/results': '查看考试结果',
      'GET /health': '健康检查'
    }
  });
});

/**
 * GET /api/results
 * 查看所有考试结果（管理员使用）
 */
app.get('/api/results', (req, res) => {
  const results = examResults.map(result => ({
    name: result.name,
    email: result.email,
    position: result.position,
    score: result.score,
    passed: result.passed,
    duration: result.duration,
    submittedAt: result.submittedAt
  }));

  res.json({
    success: true,
    total: results.length,
    results: results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  });
});

// Test webhook
app.post('/api/test-webhook', async (req, res) => {
  const testData = {
    name: '测试用户',
    email: 'test@example.com',
    position: '测试岗位',
    score: 85,
    passed: true,
    duration: 1800,
    timestamp: new Date().toISOString(),
  };

  await pushToWebhook(testData);

  res.json({
    success: true,
    message: '测试Webhook已发送',
    data: testData
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Exam Backend running on http://localhost:${PORT}`);
  console.log(`📚 Questions loaded: ${questions.length}`);
  console.log(`🔐 Auth codes loaded: ${authCodes.length}`);
});
