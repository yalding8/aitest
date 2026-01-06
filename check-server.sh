#!/bin/bash

# 服务器状态诊断脚本
# 用于快速检查服务器上的考试系统运行状态

SERVER="root@188.166.250.114"

echo "🔍 正在检查服务器状态..."
echo "================================"

# 检查SSH连接
echo ""
echo "1️⃣ 检查SSH连接..."
if ssh -o ConnectTimeout=5 $SERVER "echo '✅ SSH连接成功'" 2>/dev/null; then
    echo "✅ SSH连接正常"
else
    echo "❌ SSH连接失败"
    echo "请检查:"
    echo "  - SSH密钥是否配置正确"
    echo "  - 服务器是否在线"
    echo "  - 网络连接是否正常"
    exit 1
fi

# 检查PM2服务
echo ""
echo "2️⃣ 检查PM2服务状态..."
ssh $SERVER << 'ENDSSH'
if command -v pm2 &> /dev/null; then
    echo "✅ PM2已安装"
    pm2 status | grep aitest-backend
    if [ $? -eq 0 ]; then
        echo "✅ aitest-backend服务存在"
    else
        echo "❌ aitest-backend服务不存在"
        echo "需要启动服务: cd /root/aitest/exam-backend && pm2 start server.js --name aitest-backend"
    fi
else
    echo "❌ PM2未安装"
fi
ENDSSH

# 检查后端端口
echo ""
echo "3️⃣ 检查后端端口..."
ssh $SERVER << 'ENDSSH'
if lsof -i :3005 &> /dev/null; then
    echo "✅ 端口3005正在监听"
    lsof -i :3005 | grep LISTEN
else
    echo "❌ 端口3005未监听"
    echo "后端服务可能未运行"
fi
ENDSSH

# 检查Nginx
echo ""
echo "4️⃣ 检查Nginx状态..."
ssh $SERVER << 'ENDSSH'
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx正在运行"
else
    echo "❌ Nginx未运行"
fi
ENDSSH

# 检查代码版本
echo ""
echo "5️⃣ 检查代码版本..."
ssh $SERVER << 'ENDSSH'
cd /root/aitest
echo "当前Git提交:"
git log -1 --oneline
echo ""
echo "题库题目数量:"
cat 题库.json | grep -c "\"id\""
ENDSSH

# 检查后端日志
echo ""
echo "6️⃣ 最近的后端日志..."
ssh $SERVER "pm2 logs aitest-backend --lines 10 --nostream" 2>/dev/null || echo "无法获取日志"

echo ""
echo "================================"
echo "🎯 诊断完成！"
echo ""
echo "📝 建议操作:"
echo "  - 如果服务未运行: ssh $SERVER 'cd /root/aitest/exam-backend && pm2 start server.js --name aitest-backend'"
echo "  - 如果需要更新: ./update-server.sh"
echo "  - 查看详细日志: ssh $SERVER 'pm2 logs aitest-backend'"
