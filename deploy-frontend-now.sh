#!/bin/bash

echo "🚀 部署前端到服务器..."
echo ""

# 1. 本地构建
echo "步骤 1: 本地构建前端"
echo "----------------------------------------"
cd exam-frontend
npm run build
cd ..

# 2. 上传到服务器
echo ""
echo "步骤 2: 上传构建产物到服务器"
echo "----------------------------------------"
scp -r exam-frontend/dist/* root@188.166.250.114:/var/www/aitest/

echo ""
echo "步骤 3: 验证部署"
echo "----------------------------------------"
ssh root@188.166.250.114 "ls -lh /var/www/aitest/index.html && echo '' && echo '检查 JS 文件:' && ls -lh /var/www/aitest/assets/*.js"

echo ""
echo "✅ 部署完成！"
echo "📱 请访问 https://test.pylosy.com/ 测试"
echo "📖 操作指南页面: https://test.pylosy.com/guide"
