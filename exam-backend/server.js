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
// In-memory exam storage (考试数据存储)
let exams = new Map();
const examResults = []; // 存储考试结果

// 持久化考试会话路径
const examsPersistencePath = path.join(__dirname, '../exams_session.json');

// 加载持久化的考试会话
const loadExamsSession = () => {
  try {
    if (fs.existsSync(examsPersistencePath)) {
      const data = fs.readFileSync(examsPersistencePath, 'utf-8');
      const parsed = JSON.parse(data);
      // 将普通对象转换为 Map
      exams = new Map(Object.entries(parsed));
      console.log(`Restore ${exams.size} exam sessions from disk.`);
    }
  } catch (err) {
    console.error('Error loading exams session:', err);
  }
};

// 保存考试会话到磁盘
const saveExamsSession = () => {
  try {
    // 将 Map 转换为普通对象进行序列化
    const data = Object.fromEntries(exams);
    fs.writeFileSync(examsPersistencePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving exams session:', err);
  }
};

loadExamsSession();

// 持久化考试结果路径
const resultsPersistencePath = path.join(__dirname, '../exam_results.json');

// 加载持久化的考试结果
const loadExamResults = () => {
  try {
    if (fs.existsSync(resultsPersistencePath)) {
      const data = fs.readFileSync(resultsPersistencePath, 'utf-8');
      const loadedResults = JSON.parse(data);
      if (Array.isArray(loadedResults)) {
        examResults.push(...loadedResults);
        console.log(`Restore ${examResults.length} exam results from disk.`);
      }
    }
  } catch (err) {
    console.error('Error loading exam results:', err);
  }
};

// 保存考试结果到磁盘
const saveExamResults = () => {
  try {
    fs.writeFileSync(resultsPersistencePath, JSON.stringify(examResults, null, 2));
  } catch (err) {
    console.error('Error saving exam results:', err);
  }
};

loadExamResults();

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
const markCodeAsUsed = (code, userInfo) => {
  const authCode = authCodes.find(c => c.code === code.toUpperCase());
  if (authCode) {
    // UHOMES999 永不失效，仅记录日志不标记为 used
    if (authCode.code === 'UHOMES999') {
      console.log('UHOMES999 used by', userInfo?.name, 'keeping status as unused');
      return;
    }
    authCode.status = 'used';
    authCode.usedAt = new Date().toISOString();
    // 记录使用者信息
    if (userInfo) {
      authCode.usedBy = {
        name: userInfo.name,
        email: userInfo.email,
        position: userInfo.position,
        score: userInfo.score
      };
    }
    saveAuthCodes();
  }
};

/**
 * 随机抽取30道题（按10个维度均衡覆盖 + 岗位筛选）
 */
const selectRandomQuestions = (userPosition) => {
  // 1. 简单的岗位映射归一化
  let targetPos = userPosition || '通用';
  if (targetPos.includes('咨询')) targetPos = '咨询顾问';
  else if (targetPos.includes('BD') || targetPos.includes('渠道')) targetPos = '渠道BD';
  else if (targetPos.includes('KA') || targetPos.includes('大客户')) targetPos = '大客户经理';

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
    '创新应用': 1,
    'AI前沿趋势': 1, // 新增的 2025 考点
    '行业格局': 1    // 新增的 2025 考点
  };

  Object.entries(counts).forEach(([category, count]) => {
    // 筛选出属于该维度，且 (是通用题 OR 匹配当前岗位) 的题目
    const pool = questions.filter(q =>
      q.category === category &&
      (!q.positions || q.positions.length === 0 || q.positions.includes(targetPos))
    );

    // 随机打乱
    const shuffled = pool.sort(() => 0.5 - Math.random());

    // 选取指定数量
    selected.push(...shuffled.slice(0, count));
  });

  return selected.sort(() => Math.random() - 0.5);
};

/**
 * 计算分数
 */
const calculateScore = (questions, answers) => {
  let totalScore = 0;
  let earnedScore = 0;

  // 维度统计
  const dimensionStats = {};

  questions.forEach(q => {
    // 初始化维度统计
    if (!dimensionStats[q.category]) {
      dimensionStats[q.category] = { total: 0, earned: 0, count: 0 };
    }

    dimensionStats[q.category].total += q.score;
    dimensionStats[q.category].count += 1;
    totalScore += q.score;

    const userAnswer = answers[q.id];
    if (!userAnswer) return;

    const isCorrect =
      q.type === 'multiple'
        ? Array.isArray(userAnswer) &&
        userAnswer.sort().join(',') === q.answer.sort().join(',')
        : userAnswer === q.answer;

    if (isCorrect) {
      earnedScore += q.score;
      dimensionStats[q.category].earned += q.score;
    }
  });

  // 计算最终得分 (标准化到 100 分)
  // 如果题目总分不是100，这里会按比例折算
  const finalScore = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;

  return {
    score: finalScore,
    dimensions: dimensionStats
  };
};

/**
 * 生成智能总结
 */
const generateSmartSummary = (score, dimensions) => {
  // 1. 总体评价
  let summary = "";
  if (score >= 90) summary += "🌟 **总体评价**：卓越！该候选人展现了极高的 AI 应用能力和业务理解力。\n";
  else if (score >= 80) summary += "✨ **总体评价**：优秀。具备扎实的 AI 技能，能很好地应对业务场景。\n";
  else if (score >= 70) summary += "✅ **总体评价**：合格。基本掌握 AI 工具，但在部分复杂场景下需加强。\n";
  else summary += "⚠️ **总体评价**：未达标。建议系统学习 AI 工具并在业务中多加实践。\n";

  // 2. 维度分析
  const dimArray = Object.entries(dimensions).map(([name, data]) => ({
    name,
    rate: data.total > 0 ? (data.earned / data.total) : 0
  }));

  // 找出优势 (得分率 100% 或 > 80%)
  const strengths = dimArray.filter(d => d.rate >= 0.8).map(d => d.name);
  // 找出弱势 (得分率 < 60%)
  const weaknesses = dimArray.filter(d => d.rate < 0.6).map(d => d.name);

  if (strengths.length > 0) {
    summary += `> 💪 **优势领域**：${strengths.slice(0, 3).join('、')}${strengths.length > 3 ? '等' : ''}\n`;
  }

  if (weaknesses.length > 0) {
    summary += `> 💡 **提升建议**：建议重点加强 **${weaknesses.slice(0, 3).join('、')}** 方面的能力，提升解决复杂问题的效率。`;
  } else if (score < 100) {
    summary += `> 📈 **提升建议**：整体表现均衡，可在细节处理上追求极致。`;
  } else {
    summary += `> 🏆 **完美表现**：无可挑剔，建议将其经验在团队内推广。`;
  }

  return summary;
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
        content: `## AI应用及思考能力测试结果\n\n**姓名:** <font color="info">${examData.name}</font>\n**邮箱:** ${examData.email}\n**岗位:** ${examData.position}\n**分数:** <font color="warning">${examData.score}/100</font>\n**状态:** <font color="${examData.score >= 70 ? 'info' : 'warning'}">${examData.score >= 70 ? '✅ 及格' : '❌ 不及格'}</font>\n**用时:** ${Math.round(examData.duration / 60)}分钟\n\n----------\n\n${examData.summary || '暂无智能总结'}`
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
  const selectedQuestions = selectRandomQuestions(position);

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
  saveExamsSession(); // 保存会话

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
  const { score, dimensions } = calculateScore(examData.questions, answers);
  // 及格线调整为 70 分
  const passed = score >= 70;

  // 生成智能总结
  const aiSummary = generateSmartSummary(score, dimensions);

  // 标记授权码为已使用
  // 标记授权码为已使用
  markCodeAsUsed(examData.code, {
    name: examData.name,
    email: examData.email,
    position: examData.position,
    score: score
  });

  // 准备推送数据
  const resultData = {
    name: examData.name,
    email: examData.email,
    position: examData.position,
    score,
    passed,
    summary: aiSummary,
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
  saveExamResults(); // 保存结果到磁盘

  // 清理考试数据
  examData.status = 'completed';
  examData.score = score;
  exams.delete(examId);
  saveExamsSession(); // 保存会话

  res.json({
    success: true,
    message: '答卷已提交',
    score,
    summary: aiSummary,
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
  const { score, dimensions } = calculateScore(mockExamData.questions, answers || {
    1: 'B', 2: 'B', 3: 'C', 4: 'D', 5: ['A', 'B', 'D'],
    6: 'B', 7: 'B', 8: 'D', 9: ['A', 'B', 'C'], 10: 'B'
  });
  const passed = score >= 70;

  // 生成智能总结
  const aiSummary = generateSmartSummary(score, dimensions);

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
  saveExamResults(); // 保存结果到磁盘

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

// Endpoint removed for security

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
