#!/bin/bash

# test.pylosy.com 域名一键配置脚本
# 用于快速配置 AI 考试系统的域名访问

set -e

SERVER="root@188.166.250.114"
DOMAIN="test.pylosy.com"
NGINX_CONF="nginx-test-pylosy.conf"
REMOTE_CONF_PATH="/etc/nginx/sites-available/$DOMAIN"

echo "🚀 开始配置 $DOMAIN 域名..."

# 检查本地配置文件是否存在
if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ 错误: 找不到 $NGINX_CONF 文件"
    exit 1
fi

# 1. 上传 Nginx 配置文件
echo "📤 上传 Nginx 配置文件..."
scp "$NGINX_CONF" "$SERVER:$REMOTE_CONF_PATH"

# 2. 在服务器上配置并重启
echo "🔧 配置服务器..."
ssh $SERVER << ENDSSH
set -e

echo "🔗 启用站点配置..."
sudo ln -sf $REMOTE_CONF_PATH /etc/nginx/sites-enabled/

echo "✅ 测试 Nginx 配置..."
sudo nginx -t

echo "♻️  重启 Nginx..."
sudo systemctl restart nginx

echo "📊 检查 Nginx 状态..."
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "✅ $DOMAIN 配置完成！"
echo ""
echo "📋 配置信息:"
echo "   域名: $DOMAIN"
echo "   前端路径: /var/www/aitest"
echo "   后端端口: 3005"
echo ""
echo "🧪 测试命令:"
echo "   curl -I http://$DOMAIN"
echo "   curl http://$DOMAIN/api/"
echo ""
ENDSSH

echo ""
echo "🎉 部署完成！"
echo ""
echo "📝 后续步骤:"
echo "1. 确保 DNS 已配置（A 记录: test → 188.166.250.114）"
echo "2. 测试访问: http://$DOMAIN"
echo "3. （可选）配置 SSL: sudo certbot --nginx -d $DOMAIN"
echo ""
echo "📊 查看日志:"
echo "   访问日志: ssh $SERVER 'sudo tail -f /var/log/nginx/$DOMAIN.access.log'"
echo "   错误日志: ssh $SERVER 'sudo tail -f /var/log/nginx/$DOMAIN.error.log'"
echo "   后端日志: ssh $SERVER 'pm2 logs aitest-backend'"
echo ""
