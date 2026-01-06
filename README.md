# AI 能力测试系统

轻量级在线AI能力测试平台，用于评估咨询顾问、渠道BD、KA等非技术岗位候选人的AI应用能力。

## 📋 产品特性

- **30道题目** - 从60道题库中随机抽取
- **4个维度** - AI工具认知、岗位场景应用、思维转变识别、实战判断
- **多题型** - 单选、多选、案例分析
- **60分钟限时** - 自动计时和提交
- **授权码管理** - 50个独立授权码，防止重复作答
- **Webhook推送** - 支持飞书/钉钉机器人实时推送结果
- **无分数反馈** - 保护答题者隐私

## 🏗️ 技术架构

### 前端
- React 18 + TypeScript
- Tailwind CSS（Apple风格）
- Vite 构建工具
- React Router 路由

### 后端
- Node.js + Express
- 轻量级无数据库设计
- JSON 数据文件（易于维护）
- Webhook 推送集成

### 数据存储
- `题库.json` - 60道题目
- `授权码.json` - 50个授权码管理

## 🚀 快速开始

### 前置要求
- Node.js 16+
- npm 或 pnpm

### 本地开发

#### 1. 后端启动

```bash
cd exam-backend
npm install
cp .env.example .env
# 编辑 .env 配置 WEBHOOK_URL（可选）
npm run dev
```

后端运行在 `http://localhost:3001`

#### 2. 前端启动

```bash
cd exam-frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

#### 3. 访问应用

打开浏览器访问 `http://localhost:5173`

## 📝 使用授权码

初始50个授权码在 `授权码.json` 中：

```
EXAM2601A1 - EXAM2601A5
EXAM2601B1 - EXAM2601B5
... 以此类推
EXAM2601K1 - EXAM2601K5
```

每个授权码只能使用一次，使用后自动标记为 `used`。

## 🔧 配置说明

### 后端 `.env` 配置

```env
# 服务器端口
PORT=3001

# Webhook URL（飞书/钉钉机器人）
WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx

# SMTP 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 前端 `.env` 配置

```env
VITE_API_URL=http://localhost:3001/api
```

## 📊 API 接口

### POST /api/verify
验证授权码有效性

```json
请求:
{
  "code": "EXAM2601A1"
}

响应:
{
  "success": true,
  "message": "授权码验证成功"
}
```

### POST /api/start
启动考试，返回随机30道题

```json
请求:
{
  "code": "EXAM2601A1",
  "name": "张三",
  "email": "zhangsan@example.com",
  "position": "咨询顾问"
}

响应:
{
  "success": true,
  "examId": "uuid-xxx",
  "questions": [...],
  "duration": 60
}
```

### POST /api/submit
提交答卷，计分并推送结果

```json
请求:
{
  "examId": "uuid-xxx",
  "answers": {
    1: "A",
    2: ["B", "C"],
    3: "D"
  },
  "duration": 2400
}

响应:
{
  "success": true,
  "message": "答卷已提交",
  "score": 85
}
```

## 📤 Webhook 推送格式

### 飞书机器人

```json
{
  "msg_type": "interactive",
  "card": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "content": "**AI 能力测试结果**\n\n...",
          "tag": "lark_md"
        }
      }
    ]
  }
}
```

推送内容包括：
- 姓名
- 邮箱
- 岗位
- 分数（0-100）
- 及格状态（≥80分为及格）
- 答题用时（秒）

## 🎯 题库结构

```json
{
  "id": 1,
  "type": "single",  // single | multiple | case
  "category": "AI工具认知",
  "question": "题干文本",
  "options": ["A选项", "B选项", "C选项", "D选项"],
  "answer": "A",  // 单选：字符串，多选：数组
  "score": 3
}
```

## 🎨 UI 设计

采用 Apple.com 风格的简洁、克制、高质感设计：
- 最小化干扰
- 清晰的信息层级
- 响应式布局
- 支持手机答题

## 🛠️ 部署指南

### Vercel（推荐）

#### 前端部署

```bash
cd exam-frontend
npm run build
# 连接到 Vercel 并部署
```

环境变量：
```
VITE_API_URL=https://your-api-domain.com/api
```

#### 后端部署

可直接部署到 Vercel Serverless，或使用其他 Node.js 服务：
- Railway
- Render
- Heroku

### Docker 部署

```dockerfile
# 后端 Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY exam-backend ./
RUN npm install
CMD ["npm", "start"]
```

## 🔐 安全考虑

1. **授权码管理**
   - 每个候选人一个独立授权码
   - 授权码一次性使用
   - 建议定期生成新授权码

2. **数据隐私**
   - 考试过程中不显示分数
   - 结果通过 Webhook 推送，无本地存储
   - 支持 HTTPS 部署

3. **防作弊机制**
   - 实时倒计时
   - 一次性授权码
   - IP 限制可选

## 📈 扩展计划

- [ ] 支持题库版本管理
- [ ] 添加后台管理界面
- [ ] 支持批量生成授权码
- [ ] 成绩统计和分析
- [ ] 邮件反馈通知
- [ ] 多语言支持

## 💡 学习机会

这个项目展示了完整的全栈开发流程：

1. **前端**：React Hooks、状态管理、路由、响应式设计
2. **后端**：Express API、数据处理、Webhook 集成
3. **工程化**：Vite、TypeScript、环境配置、部署
4. **产品思维**：用户体验、数据流、系统设计

## 🤝 维护和更新

### 定期更新题库

1. 在 `题库.json` 中添加新题目
2. 保持4个维度的平衡
3. 定期审核题目难度和相关性
4. 更新频率：每季度一次

### 生成新授权码

```bash
# 在 node 中执行
const codes = [];
for (let i = 0; i < 50; i++) {
  codes.push({
    code: `EXAM${Date.now().toString().slice(-4)}${String.fromCharCode(65 + Math.floor(i / 5))}${(i % 5) + 1}`,
    status: 'unused',
    usedAt: null,
    usedBy: null
  });
}
console.log(JSON.stringify(codes, null, 2));
```

## 📞 技术支持

- 问题排查：查看服务器日志和浏览器控制台
- Webhook 推送失败：检查 URL 和网络连接
- 授权码问题：检查 `授权码.json` 文件

## 📄 许可

MIT License

---

**开发时间**: 约 6-8 小时（完整实现包括部署）
**维护周期**: 低维护，主要是题库更新
