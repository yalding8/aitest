#!/bin/bash

echo "🔧 修复 GitHub Actions 部署"
echo ""

PUBLIC_KEY=$(cat github_deploy_key.pub)
PRIVATE_KEY=$(cat github_deploy_key)

echo "步骤 1: 将公钥添加到服务器"
echo "----------------------------------------"
echo "公钥内容："
echo "$PUBLIC_KEY"
echo ""
echo "正在连接服务器并添加公钥..."
ssh root@188.166.250.114 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo '✅ 公钥已添加到服务器'"

echo ""
echo "步骤 2: 更新 GitHub Secret"
echo "----------------------------------------"
echo "请手动完成以下操作："
echo ""
echo "1. 访问: https://github.com/yalding8/aitest/settings/secrets/actions"
echo ""
echo "2. 找到 SSH_PRIVATE_KEY，点击 'Update'"
echo ""
echo "3. 复制以下私钥内容（包括 BEGIN 和 END 行）："
echo ""
echo "$PRIVATE_KEY"
echo ""
echo "4. 粘贴到 Secret 值中，点击 'Update secret'"
echo ""
echo "完成后，再次推送代码即可触发自动部署！"
