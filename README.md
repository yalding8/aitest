# AI应用及思考能力测试系统

> 专为留学租房行业设计的AI能力评估系统

## 📋 项目简介

这是一个针对留学租房行业的AI应用能力测试系统，用于评估候选人在实际业务场景中使用AI工具的能力。系统包含100道精心设计的题目，覆盖10个业务维度，支持岗位差异化评估。

## 🌟 核心特性

### 1. 行业专属题库（100题）
- ✅ 100%基于留学租房真实业务场景
- ✅ 去除纯理论题目，强化实战应用
- ✅ 10个维度全面覆盖业务能力

### 2. 岗位差异化评估
- **咨询顾问**：侧重客户服务、多语言沟通、紧急处理
- **渠道BD**：侧重商务拓展、数据分析、资源整合
- **大客户经理(KA)**：侧重大客户方案、风险控制、批量管理

### 3. 智能抽题系统
- 每次考试随机抽取30题
- 10个维度均衡覆盖
- 根据岗位自动过滤题目
- 题目顺序随机打乱

### 4. 完善的授权机制
- 1000个一次性授权码（UHOMES001-998）
- 1个永久超级码（UHOMES999）
- 授权码使用后自动失效

### 5. 企业微信通知
- 考试结果自动推送到企业微信
- 包含姓名、邮箱、岗位、分数、用时等信息
- Markdown格式美观展示

## 📊 题目分布

### 按维度分类（100题）
| 维度 | 题目数 | 说明 |
|------|--------|------|
| AI工具认知 | 8题 | 实用工具在行业中的应用 |
| 岗位场景应用 | 10题 | 咨询/BD/KA实际业务场景 |
| 思维转变识别 | 8题 | 从传统到AI思维的转变 |
| 实战判断 | 6题 | 复杂场景的决策能力 |
| 多语言沟通 | 8题 | 跨文化、跨语言服务 |
| 客户服务 | 20题 | 投诉处理、紧急应对 |
| 数据分析 | 12题 | 数据驱动决策能力 |
| 流程优化 | 12题 | 效率提升与自动化 |
| 风险控制 | 10题 | 合规意识与风险识别 |
| 创新应用 | 6题 | 前沿AI应用探索 |

### 抽题规则（每次30题）
| 维度 | 抽取数量 | 占比 |
|------|----------|------|
| 客户服务 | 6题 | 20% |
| 岗位场景应用 | 4题 | 13.3% |
| AI工具认知 | 3题 | 10% |
| 实战判断 | 3题 | 10% |
| 多语言沟通 | 3题 | 10% |
| 数据分析 | 3题 | 10% |
| 流程优化 | 3题 | 10% |
| 思维转变识别 | 2题 | 6.7% |
| 风险控制 | 2题 | 6.7% |
| 创新应用 | 1题 | 3.3% |

### 岗位专属题目
- **咨询顾问专属**：11题（客户服务、紧急处理）
- **渠道BD专属**：2题（房东开发、商务拓展）
- **大客户经理专属**：4题（大客户方案、风险控制）
- **BD+KA共享**：6题（数据分析）
- **通用题目**：77题（所有岗位）

## 🏗️ 技术架构

### 前端
- **框架**：React 18 + Vite
- **路由**：React Router v6
- **样式**：Tailwind CSS
- **HTTP客户端**：Axios
- **构建工具**：Vite

### 后端
- **运行时**：Node.js (ES Modules)
- **框架**：Express.js
- **进程管理**：PM2
- **数据存储**：JSON文件

### 部署
- **服务器**：Digital Ocean
- **Web服务器**：Nginx
- **域名/IP**：188.166.250.114
- **端口**：8080

## 📊 查看考试结果

**注意：出于安全考虑，考试结果不再通过网页公开展示。**

管理员可以通过以下方式查看所有考试记录：

1. **终端脚本（推荐）**
   在项目根目录下运行脚本，即可查看服务器上的所有考试记录：
   ```bash
   ./check-results.sh
   ```
   
2. **企业微信通知**
   每当有考生提交试卷，结果会实时推送到企业微信群。

3. **服务器日志**
   ```bash
   ssh root@188.166.250.114 'pm2 logs aitest-backend --lines 50 --nostream'
   ```
- **在线演示**: [https://test.pylosy.com/](https://test.pylosy.com/)

## 🚀 快速开始

### 本地开发

#### 1. 克隆项目
```bash
git clone https://github.com/yalding8/aitest.git
cd aitest
```

#### 2. 安装依赖

**后端**：
```bash
cd exam-backend
npm install
```

**前端**：
```bash
cd exam-frontend
npm install
```

#### 3. 配置环境变量

**后端** (`exam-backend/.env`)：
```env
PORT=3005
NODE_ENV=development
WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY
```

**前端** (`exam-frontend/.env.development`)：
```env
VITE_API_URL=http://localhost:3005/api
```

#### 4. 启动服务

**后端**：
```bash
cd exam-backend
npm start
```

**前端**：
```bash
cd exam-frontend
npm run dev
```

访问：`http://localhost:5173`

### 生产部署

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 项目结构

```
aitest/
├── exam-backend/          # 后端服务
│   ├── server.js         # Express服务器
│   └── package.json
├── exam-frontend/         # 前端应用
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── api/          # API客户端
│   │   └── App.tsx       # 根组件
│   ├── vite.config.ts    # Vite配置
│   └── package.json
├── 题库.json             # 题库数据（100题）
├── 授权码.json           # 授权码数据（1000个）
├── check-results.sh      # 查看结果脚本
├── deploy.sh             # 部署脚本
└── README.md             # 项目文档
```

## 🔑 授权码管理

### 授权码格式
- **普通码**：`UHOMES001` - `UHOMES998`（一次性使用）
- **超级码**：`UHOMES999`（永久可用，用于测试）

### 授权码状态
```json
{
  "code": "UHOMES001",
  "status": "unused",      // unused | used
  "usedAt": null,          // 使用时间
  "usedBy": null           // 使用者邮箱
}
```

### 生成新授权码
```bash
# 生成1000个授权码
python3 generate_codes.py
```

## 📝 题库管理

### 题目格式
```json
{
  "id": 1,
  "type": "single",                    // single | multiple | case
  "category": "客户服务",
  "question": "题目内容",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "answer": "B",                       // 单选：A/B/C/D，多选：["A", "B"]
  "score": 4,
  "positions": ["咨询顾问"]            // 可选，岗位标签
}
```

### 添加新题目
1. 编辑 `题库.json`
2. 按照上述格式添加题目
3. 确保JSON格式正确
4. 重启后端服务

## 🎯 评分规则

- **总分**：100分
- **及格线**：70分
- **计分方式**：
  - 单选题：答对得分，答错不得分
  - 多选题：完全正确得分，部分正确或错误不得分
  - 案例题：同单选题

## 📊 考试流程

1. **输入授权码**：候选人输入授权码、姓名、邮箱、岗位
2. **验证授权**：系统验证授权码有效性
3. **开始考试**：系统根据岗位抽取30题
4. **答题**：60分钟限时答题
5. **提交答卷**：系统自动计分
6. **推送结果**：结果推送到企业微信
7. **显示完成**：候选人看到完成页面（不显示分数）

## 🔧 配置说明

### Nginx配置
```nginx
server {
    listen 443 ssl;
    server_name test.pylosy.com;
    
    location / {
        root /var/www/aitest;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3005/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### PM2配置
```bash
# 启动后端
pm2 start exam-backend/server.js --name aitest-backend

# 查看日志
pm2 logs aitest-backend

# 重启服务
pm2 restart aitest-backend
```

## 📱 移动端优化

- ✅ 响应式设计，支持手机/平板
- ✅ 移动端键盘优化
- ✅ 触摸友好的UI
- ✅ 自动保存答题进度

## 🔐 安全特性

- ✅ 授权码一次性使用
- ✅ 考试时间限制
- ✅ 防止刷新丢失进度
- ✅ 敏感数据加密传输
- ✅ 结果不公开展示

## 📈 数据统计

系统自动记录：
- 考试结果（姓名、邮箱、岗位、分数、用时）
- 授权码使用情况
- 考试完成率

## 🤝 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目仅供内部使用。

## 📞 联系方式

- **项目地址**：https://github.com/yalding8/aitest
- **在线访问**：https://test.pylosy.com

## 🎉 更新日志

### v2.1.0 (2026-01-07)
- 🔒 **安全性增强**：移除前端结果展示页面
- 💾 **数据持久化**：考试结果保存至服务器文件，防止重启丢失
- 🛠 **管理工具**：新增终端结果查看脚本 `check-results.sh`
- 🌐 **域名更新**：正式启用 test.pylosy.com

### v2.0.0 (2026-01-06)
- ✨ 题库扩充到100题
- ✨ 新增岗位差异化评估
- ✨ 10个维度全面覆盖
- ✨ 优化抽题算法
- 🐛 修复移动端输入问题
- 🐛 修复返回首页功能

### v1.0.0 (2026-01-05)
- 🎉 初始版本发布
- ✨ 40题行业化题库
- ✨ 授权码系统
- ✨ 企业微信通知

---

**Made with ❤️ for UHOMES**
