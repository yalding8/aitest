#!/bin/bash

echo "🔍 检查并部署前端更新..."
echo ""

SERVER="root@188.166.250.114"

echo "步骤 1: 检查服务器代码版本"
echo "----------------------------------------"
ssh $SERVER "cd /root/aitest && git log --oneline -1"

echo ""
echo "步骤 2: 拉取最新代码"
echo "----------------------------------------"
ssh $SERVER "cd /root/aitest && git pull origin main"

echo ""
echo "步骤 3: 检查 GuidePage 文件是否存在"
echo "----------------------------------------"
ssh $SERVER "cd /root/aitest && ls -la exam-frontend/src/pages/GuidePage.tsx"

echo ""
echo "步骤 4: 重新构建前端"
echo "----------------------------------------"
ssh $SERVER "cd /root/aitest/exam-frontend && npm install && npm run build"

echo ""
echo "步骤 5: 检查构建产物"
echo "----------------------------------------"
ssh $SERVER "cd /root/aitest/exam-frontend && ls -lh dist/index.html && echo '' && echo '检查 guide 路由:' && grep -i 'guide' dist/index.html || echo '未找到 guide 相关内容'"

echo ""
echo "✅ 部署完成！请访问 https://test.pylosy.com/guide 测试"
