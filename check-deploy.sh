#!/bin/bash

echo "🔍 检查部署状态..."
echo ""

# 1. 检查本地 Git 状态
echo "1️⃣ 本地 Git 状态:"
git log --oneline -3
echo ""

# 2. 检查远程分支
echo "2️⃣ 远程分支状态:"
git ls-remote --heads origin main
echo ""

# 3. 检查服务器代码版本
echo "3️⃣ 服务器代码版本:"
echo "正在连接服务器..."
ssh root@188.166.250.114 "cd /root/aitest && echo '当前版本:' && git log --oneline -1 && echo '' && echo '文件检查:' && ls -la exam-frontend/src/pages/ | grep -i guide"

echo ""
echo "✅ 检查完成"
