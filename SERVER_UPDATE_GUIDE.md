# 服务器手动更新指南

## 问题描述
用户在考试系统提交答案时出现 "JavaScript 提交失败,请重试" 错误。

## 原因分析
服务器端的后端服务可能:
1. 未运行
2. 运行的是旧版本代码
3. 题库文件未更新

## 解决方案

### 方式一: SSH登录服务器手动更新

```bash
# 1. SSH登录服务器
ssh root@188.166.250.114

# 2. 进入项目目录
cd /root/aitest

# 3. 拉取最新代码
git pull origin main

# 4. 更新后端
cd exam-backend
npm install --production

# 5. 重启后端服务
pm2 restart aitest-backend

# 如果服务不存在,则启动:
# pm2 start server.js --name aitest-backend

# 6. 检查服务状态
pm2 status
pm2 logs aitest-backend --lines 50

# 7. 更新前端(如果需要)
cd ../exam-frontend
npm install
npm run build

# 8. 重启Nginx
sudo systemctl restart nginx
```

### 方式二: 使用自动更新脚本

```bash
# 在本地执行
chmod +x update-server.sh
./update-server.sh
```

## 验证步骤

### 1. 检查后端服务状态
```bash
ssh root@188.166.250.114 "pm2 status"
```

应该看到 `aitest-backend` 服务状态为 `online`

### 2. 检查后端日志
```bash
ssh root@188.166.250.114 "pm2 logs aitest-backend --lines 20"
```

应该看到类似:
```
🚀 AI Exam Backend running on http://localhost:3005
📚 Questions loaded: 100
🔐 Auth codes loaded: 1000
```

### 3. 测试API接口
```bash
curl https://test.pylosy.com/api/
```

应该返回API信息

### 4. 访问前端页面
浏览器打开: https://test.pylosy.com/

## 常见问题

### Q1: PM2服务未运行
```bash
cd /root/aitest/exam-backend
pm2 start server.js --name aitest-backend
pm2 save
```

### Q2: 端口冲突
```bash
# 检查端口占用
lsof -i :3005

# 如果有其他进程占用,杀掉进程
kill -9 <PID>
```

### Q3: Nginx配置问题
```bash
# 检查Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

### Q4: 题库文件未更新
```bash
cd /root/aitest
cat 题库.json | grep -c "\"id\"" # 应该显示100

# 如果不是100,说明题库未更新,需要重新拉取
git fetch origin
git reset --hard origin/main
```

## 当前配置信息

- **服务器IP**: 188.166.250.114
- **访问地址**: https://test.pylosy.com/
- **后端端口**: 3005
- **前端路径**: /var/www/aitest
- **后端路径**: /root/aitest/exam-backend
- **PM2服务名**: aitest-backend
- **Nginx配置**: /etc/nginx/sites-available/aitest

## 紧急联系

如果以上方法都无法解决,请提供:
1. PM2日志: `pm2 logs aitest-backend --lines 50`
2. Nginx错误日志: `sudo tail -100 /var/log/nginx/error.log`
3. 浏览器控制台错误截图
