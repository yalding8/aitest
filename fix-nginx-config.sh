#!/bin/bash

# 修复 test.pylosy.com 的 Nginx 配置
# 将代理配置改为前端静态文件 + API 代理

set -e

SERVER="root@188.166.250.114"

echo "🔧 修复 test.pylosy.com Nginx 配置..."

ssh $SERVER << 'ENDSSH'
set -e

# 备份当前配置
sudo cp /etc/nginx/sites-enabled/pylosy.conf /etc/nginx/sites-enabled/pylosy.conf.backup.$(date +%Y%m%d_%H%M%S)

# 创建临时文件用于修改配置
cat > /tmp/test_pylosy_block.conf << 'EOF'
server {
    server_name test.pylosy.com;

    # 访问日志
    access_log /var/log/nginx/test.pylosy.com.access.log;
    error_log /var/log/nginx/test.pylosy.com.error.log;

    # API 代理 - 必须在前面，优先匹配
    location /api/ {
        proxy_pass http://127.0.0.1:3005/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:3005/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # 前端静态文件
    location / {
        root /var/www/aitest;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        root /var/www/aitest;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/test.pylosy.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/test.pylosy.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
EOF

# 查找并替换 test.pylosy.com 的 server 块
echo "📝 更新配置文件..."

# 使用 Python 脚本来精确替换 server 块
python3 << 'PYTHON'
import re

# 读取当前配置
with open('/etc/nginx/sites-enabled/pylosy.conf', 'r') as f:
    content = f.read()

# 读取新的 server 块
with open('/tmp/test_pylosy_block.conf', 'r') as f:
    new_block = f.read()

# 匹配 test.pylosy.com 的 HTTPS server 块（包含 SSL 配置的那个）
pattern = r'server\s*\{[^}]*server_name\s+test\.pylosy\.com;.*?listen\s+443\s+ssl;.*?\n\}'

# 替换
new_content = re.sub(pattern, new_block.strip(), content, flags=re.DOTALL)

# 写回文件
with open('/etc/nginx/sites-enabled/pylosy.conf', 'w') as f:
    f.write(new_content)

print("✅ 配置文件已更新")
PYTHON

# 测试配置
echo "🧪 测试 Nginx 配置..."
sudo nginx -t

# 重启 Nginx
echo "♻️  重启 Nginx..."
sudo systemctl reload nginx

echo "✅ 配置修复完成！"
ENDSSH

echo ""
echo "🎉 修复完成！"
echo ""
echo "🧪 测试访问:"
echo "   前端: https://test.pylosy.com"
echo "   API:  https://test.pylosy.com/api/"
echo ""
