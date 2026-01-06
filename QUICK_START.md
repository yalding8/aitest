# 🚀 快速启动指南

## 5分钟内本地运行完整系统

### 前置准备

```bash
# 确保已安装 Node.js 16+ 和 npm
node --version  # v16.0.0 或更高
npm --version   # v8.0.0 或更高
```

### 方式一：同时运行前后端（推荐）

#### 终端1 - 启动后端

```bash
cd AI能力测试/exam-backend
npm install
npm run dev
```

✅ 看到以下输出表示成功：
```
🚀 AI Exam Backend running on http://localhost:3001
📚 Questions loaded: 60
🔐 Auth codes loaded: 50
```

#### 终端2 - 启动前端

```bash
cd AI能力测试/exam-frontend
npm install
npm run dev
```

✅ 看到以下输出表示成功：
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### 打开浏览器

访问 **http://localhost:5173**

---

## 📝 测试流程

### 1️⃣ 身份验证页

![](步骤1.png)

**输入以下信息：**
- 授权码：`EXAM2601A1`（或其他任何 EXAM2601* 开头的码）
- 姓名：张三
- 邮箱：zhangsan@example.com
- 岗位：咨询顾问

点击 **"开始考试"** 按钮

### 2️⃣ 考试页面

![](步骤2.png)

**特点：**
- ✅ 60分钟倒计时（可快速测试，只需答几题）
- ✅ 一次显示一题（更专注）
- ✅ 题目导航面板（快速跳转）
- ✅ 实时进度条

**操作：**
- 点击选项选择答案
- 点击"上一题"/"下一题"切换题目
- 或在右侧面板快速跳转
- 绿色方块 = 已作答，灰色 = 未作答

### 3️⃣ 完成页面

![](步骤3.png)

**收到消息：**
- "答卷已提交"
- 不显示分数（设计如此）
- 结果已推送到配置的 Webhook

---

## 🧪 快速测试（5题版本）

如果想快速验证系统，只需答5题：

1. 进入考试页面
2. 快速答5题题目
3. 跳转到最后一题（第30题）
4. 点击"提交答卷"

✅ 系统会完整计分并推送结果

---

## 🔐 可用的授权码

前50个码都可以用，第一次使用后会被标记为 `used`：

```
EXAM2601A1  ✅
EXAM2601A2  ✅
EXAM2601A3  ✅
... 以此类推
```

⚠️ **注意**：每个授权码仅能使用一次。使用过的码会被自动锁定。

---

## 📊 结果推送（可选配置）

### 如果要收到飞书/钉钉通知

1. 在后端目录创建 `.env` 文件：

```bash
cd exam-backend
cat > .env << EOF
PORT=3001
WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxx
EOF
```

2. 替换 `xxxxxxx` 为你的飞书机器人 Webhook URL

3. 重启后端服务，提交答卷时会自动推送到飞书

---

## 🐛 常见问题排查

### Q：后端启动失败 "EADDRINUSE"
**A：** 端口 3001 被占用。改用其他端口：
```bash
PORT=3002 npm run dev
```

### Q：前端连接不到后端
**A：** 检查前端 vite.config.ts 中的 proxy 配置指向 localhost:3001

### Q：授权码显示"无效或已使用"
**A：** 重置授权码文件：
```bash
cp 授权码.json.bak 授权码.json
```

或手动编辑 `授权码.json`，把所有 `used` 改回 `unused`

### Q：倒计时到0后没有自动提交
**A：** 这是正常的。可以手动点击"提交答卷"，或刷新页面

---

## 📦 生产部署

### 部署到 Vercel（推荐）

#### 前端部署

```bash
cd exam-frontend
npm run build
# 连接 Vercel 仓库，自动部署
```

#### 后端部署

使用 Vercel Serverless：
```bash
vercel deploy
```

或使用其他平台（Railway、Render等）

---

## 🎯 系统验收检查表

- [ ] 后端正常启动，加载60道题和50个授权码
- [ ] 前端可以正常访问
- [ ] 无效授权码被拒绝
- [ ] 有效授权码可以启动考试
- [ ] 考试页面显示30道随机题
- [ ] 倒计时正常运行
- [ ] 可以选择答案和切换题目
- [ ] 点击"提交答卷"后进入完成页面
- [ ] 完成页面显示"答卷已提交"
- [ ] 已使用的授权码被标记为 used（检查 授权码.json）

---

## 💡 提示

### 开发时有用的命令

```bash
# 清除所有使用过的授权码
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('授权码.json')); data.codes.forEach(c=>c.status='unused'); fs.writeFileSync('授权码.json', JSON.stringify(data,null,2));"

# 查看当前授权码状态
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('授权码.json')); console.log(data.codes.filter(c=>c.status=='used').length + ' used codes');"

# 快速重启后端
npm run dev
```

### 查看题库统计

```bash
node -e "const fs=require('fs'); const q=JSON.parse(fs.readFileSync('题库.json')).questions; const cats={}; q.forEach(x=>cats[x.category]=(cats[x.category]||0)+1); console.log(cats);"
```

---

## 🎉 成功标志

当你看到这个页面，说明系统已经完全就绪：

```
✨ 60道题库已加载
🔐 50个授权码已加载
📱 前端正常运行
⚙️  后端正常运行
🎯 随机抽题和计分算法已实现
🚀 Webhook推送已配置
```

**现在可以开始使用了！** 🎊

---

**问题反馈？** 检查 README.md 中的技术支持部分
