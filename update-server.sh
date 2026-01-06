#!/bin/bash

# AI考试系统 - 服务器更新脚本
# 用于将本地更改推送到服务器并重启服务

set -e

SERVER="root@188.166.250.114"
REMOTE_DIR="/root/aitest"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 开始更新服务器..."

# 1. 推送代码到GitHub
echo "📤 推送代码到GitHub..."
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有新的更改"
git push origin main

# 2. SSH到服务器并更新
echo "🔄 连接服务器并更新..."
ssh $SERVER << 'ENDSSH'
cd /root/aitest

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 更新后端
echo "🔧 更新后端..."
cd exam-backend
npm install --production

# 重启后端服务
echo "♻️  重启后端服务..."
pm2 restart aitest-backend || pm2 start server.js --name aitest-backend

# 更新前端
echo "🎨 构建前端..."
cd ../exam-frontend
npm install
npm run build

# 重启nginx
echo "🌐 重启Nginx..."
sudo systemctl restart nginx

# 检查服务状态
echo "✅ 检查服务状态..."
pm2 status
sudo systemctl status nginx --no-pager

echo "🎉 服务器更新完成！"
ENDSSH

echo "✅ 部署完成！"
echo "🌐 访问地址: http://188.166.250.114:8080/aitest/"
echo "📊 查看日志: ssh $SERVER 'pm2 logs aitest-backend'"
