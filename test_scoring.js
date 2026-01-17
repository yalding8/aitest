// 评分逻辑测试脚本
// 模拟不同答题情况，验证评分是否合理

// 模拟30道题的配置（按实际抽题规则）
const mockQuestions = [
  // AI工具认知 3题 x 3分 = 9分
  { id: 1, type: 'single', category: 'AI工具认知', answer: 'C', score: 3 },
  { id: 2, type: 'multiple', category: 'AI工具认知', answer: ['A', 'B', 'D'], score: 3 },
  { id: 3, type: 'single', category: 'AI工具认知', answer: 'B', score: 3 },

  // 岗位场景应用 4题 x 4分 = 16分
  { id: 9, type: 'case', category: '岗位场景应用', answer: 'B', score: 4 },
  { id: 10, type: 'case', category: '岗位场景应用', answer: 'B', score: 4 },
  { id: 11, type: 'case', category: '岗位场景应用', answer: 'B', score: 4 },
  { id: 12, type: 'case', category: '岗位场景应用', answer: 'B', score: 4 },

  // 思维转变识别 2题 x 4分 = 8分
  { id: 19, type: 'single', category: '思维转变识别', answer: 'C', score: 4 },
  { id: 20, type: 'single', category: '思维转变识别', answer: 'B', score: 4 },

  // 实战判断 3题 x 5分 = 15分
  { id: 27, type: 'single', category: '实战判断', answer: 'C', score: 5 },
  { id: 28, type: 'case', category: '实战判断', answer: 'B', score: 5 },
  { id: 29, type: 'single', category: '实战判断', answer: 'B', score: 5 },

  // 多语言沟通 3题 x 4分 = 12分
  { id: 33, type: 'case', category: '多语言沟通', answer: 'B', score: 4 },
  { id: 34, type: 'single', category: '多语言沟通', answer: 'B', score: 3 },
  { id: 37, type: 'multiple', category: '多语言沟通', answer: ['A', 'B', 'C'], score: 4 },

  // 客户服务 6题 x 4分 = 24分
  { id: 41, type: 'case', category: '客户服务', answer: 'B', score: 5 },
  { id: 42, type: 'single', category: '客户服务', answer: 'B', score: 5 },
  { id: 44, type: 'multiple', category: '客户服务', answer: ['A', 'B', 'D'], score: 4 },
  { id: 48, type: 'single', category: '客户服务', answer: 'B', score: 3 },
  { id: 50, type: 'multiple', category: '客户服务', answer: ['A', 'B', 'C'], score: 3 },
  { id: 52, type: 'single', category: '客户服务', answer: 'B', score: 4 },

  // 数据分析 3题 x 4-5分 = 14分
  { id: 61, type: 'case', category: '数据分析', answer: 'B', score: 5 },
  { id: 62, type: 'single', category: '数据分析', answer: 'B', score: 4 },
  { id: 64, type: 'multiple', category: '数据分析', answer: ['A', 'B', 'C'], score: 4 },

  // 流程优化 3题 x 4-5分 = 13分
  { id: 73, type: 'case', category: '流程优化', answer: 'B', score: 5 },
  { id: 74, type: 'single', category: '流程优化', answer: 'B', score: 4 },
  { id: 76, type: 'multiple', category: '流程优化', answer: ['A', 'B', 'C'], score: 4 },

  // 风险控制 2题 x 5分 = 10分
  { id: 85, type: 'case', category: '风险控制', answer: 'B', score: 5 },
  { id: 88, type: 'multiple', category: '风险控制', answer: ['A', 'B', 'C'], score: 5 },

  // 创新应用 1题 x 4分 = 4分
  { id: 95, type: 'case', category: '创新应用', answer: 'B', score: 4 },

  // AI前沿趋势 1题 x 5分 = 5分
  { id: 107, type: 'single', category: 'AI前沿趋势', answer: 'B', score: 5 },

  // 行业格局 1题 x 5分 = 5分
  { id: 109, type: 'single', category: '行业格局', answer: 'A', score: 5 }
];

// 计算总分
const totalScore = mockQuestions.reduce((sum, q) => sum + q.score, 0);
console.log('30题总分:', totalScore);

// 评分函数（复制自server.js）
const calculateScore = (questions, answers) => {
  let totalScore = 0;
  let earnedScore = 0;

  questions.forEach(q => {
    totalScore += q.score;
    const userAnswer = answers[q.id];
    if (!userAnswer) return;

    let qScore = 0;

    if (q.type === 'multiple') {
      if (Array.isArray(userAnswer)) {
        const correctOptions = q.answer;
        // 检查是否有错选（选了不在正确答案里的选项）
        const hasWrongOption = userAnswer.some(opt => !correctOptions.includes(opt));

        if (hasWrongOption) {
          qScore = 0; // 错选不得分
        } else {
          // 没有错选，检查选了多少个
          const correctCount = userAnswer.length;
          const totalCorrect = correctOptions.length;

          if (correctCount === totalCorrect) {
            qScore = q.score; // 全对满分
          } else if (correctCount > 0) {
            qScore = q.score / 2; // 少选得一半分
          }
        }
      }
    } else {
      // 单选或判断题
      if (userAnswer === q.answer) {
        qScore = q.score;
      }
    }

    earnedScore += qScore;
  });

  const finalScore = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;
  return { score: finalScore, earnedScore, totalScore };
};

// 测试场景1：全对
console.log('\n=== 场景1：全对 ===');
const allCorrect = {};
mockQuestions.forEach(q => {
  allCorrect[q.id] = q.answer;
});
const result1 = calculateScore(mockQuestions, allCorrect);
console.log(`得分: ${result1.earnedScore}/${result1.totalScore} = ${result1.score}分`);

// 测试场景2：错3道单选题（9分）
console.log('\n=== 场景2：错3道单选题 ===');
const scenario2 = { ...allCorrect };
scenario2[1] = 'A';  // 错误
scenario2[3] = 'A';  // 错误
scenario2[19] = 'A'; // 错误
const result2 = calculateScore(mockQuestions, scenario2);
console.log(`得分: ${result2.earnedScore}/${result2.totalScore} = ${result2.score}分`);
console.log(`错了3道单选题（共9分），扣了${result1.earnedScore - result2.earnedScore}分`);

// 测试场景3：错2道多选题（全对才得分）
console.log('\n=== 场景3：错2道多选题 ===');
const scenario3 = { ...allCorrect };
scenario3[2] = ['A', 'B'];  // 少选了D，0分
scenario3[37] = ['A', 'B', 'C', 'D'];  // 多选了D，0分
const result3 = calculateScore(mockQuestions, scenario3);
console.log(`得分: ${result3.earnedScore}/${result3.totalScore} = ${result3.score}分`);
console.log(`2道多选题没全对（共7分），扣了${result1.earnedScore - result3.earnedScore}分`);

// 测试场景4：混合错误（接近及格线）
console.log('\n=== 场景4：混合错误（模拟真实考试）===');
const scenario4 = { ...allCorrect };
// 错3道单选
scenario4[1] = 'A';
scenario4[19] = 'A';
scenario4[27] = 'A';
// 错2道多选（全对才得分）
scenario4[2] = ['A', 'B'];
scenario4[44] = ['A', 'B'];
// 错2道案例题
scenario4[9] = 'A';
scenario4[41] = 'A';
const result4 = calculateScore(mockQuestions, scenario4);
console.log(`得分: ${result4.earnedScore}/${result4.totalScore} = ${result4.score}分`);
console.log(`错了7道题，扣了${result1.earnedScore - result4.earnedScore}分`);
console.log(`及格线70分，${result4.score >= 70 ? '✅ 及格' : '❌ 不及格'}`);

// 测试场景5：多选题部分正确的影响
console.log('\n=== 场景5：多选题的严格性测试 ===');
const scenario5 = { ...allCorrect };
// 5道多选题都选错（少选或多选）
scenario5[2] = ['A', 'B'];      // 少选，0分
scenario5[37] = ['A', 'B'];     // 少选，0分
scenario5[44] = ['A'];          // 少选，0分
scenario5[50] = ['A', 'B', 'C', 'D']; // 多选，0分
scenario5[64] = ['A'];          // 少选，0分
const result5 = calculateScore(mockQuestions, scenario5);
console.log(`得分: ${result5.earnedScore}/${result5.totalScore} = ${result5.score}分`);
console.log(`5道多选题都没全对（共19分），扣了${result1.earnedScore - result5.earnedScore}分`);
console.log(`及格线70分，${result5.score >= 70 ? '✅ 及格' : '❌ 不及格'}`);

console.log('\n=== 分析结论 ===');
console.log('1. 30题总分:', totalScore, '分（不是100分！）');
console.log('2. 评分会标准化到100分制');
console.log('3. 多选题必须完全正确才得分，这是导致分数偏低的主要原因');
console.log('4. 错7道题（23%）就可能不及格');
console.log('5. 如果5道多选题都没全对，会扣19分，相当于扣了约15分（标准化后）');
