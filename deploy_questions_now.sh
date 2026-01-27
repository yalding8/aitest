#!/bin/bash
SERVER="root@188.166.250.114"
REMOTE_PATH="/root/aitest"

echo "🚀 Starting direct deployment of Question Banks..."

echo "📤 Uploading Staff Question Bank (题库.json)..."
scp 题库.json $SERVER:$REMOTE_PATH/题库.json

echo "📤 Uploading Management Question Bank (题库_管理岗.json)..."
scp 题库_管理岗.json $SERVER:$REMOTE_PATH/题库_管理岗.json

echo "♻️  Restarting backend service..."
ssh $SERVER "pm2 restart aitest-backend"

echo "✅ Deployment Complete!"
