
#!/bin/bash

# 快速部署脚本 - 仅更新后端代码和授权码
SERVER="root@188.166.250.114"
REMOTE_PATH="/root/aitest"

echo "🚀 开始部署更新..."

# 1. 上传授权码文件
echo "📤 上传新的授权码文件..."
scp 授权码.json $SERVER:$REMOTE_PATH/授权码.json

# 2. 上传后端代码
echo "📤 上传后端 Server 代码..."
scp exam-backend/server.js $SERVER:$REMOTE_PATH/exam-backend/server.js

# 3. 重启服务
echo "♻️  重启远程服务..."
ssh $SERVER "pm2 restart aitest-backend"

echo "✅ 更新完成！"
echo "👉 永久测试码: UHOMES999"
