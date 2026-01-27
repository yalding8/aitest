#!/bin/bash

# AI应用及思考能力测试系统 - 自动部署脚本
# 服务器: 188.166.250.114

echo "🚀 开始部署 AI应用及思考能力测试系统..."

# 1. 更新系统
sudo apt update

# 2. 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安装PM2和nginx
npm install -g pm2
sudo apt install -y nginx

# 4. 克隆代码
git clone https://github.com/yalding8/aitest.git
cd aitest

# 5. 后端部署
cd exam-backend
npm install
cp .env.example .env

# 提示用户配置环境变量
echo "⚠️  请编辑 .env 文件配置 WEBHOOK_URL"
echo "PORT=3001"
echo "WEBHOOK_URL=你的企业微信机器人URL"
echo "NODE_ENV=production"

read -p "按回车键继续..."

# 启动后端
pm2 start server.js --name aitest-backend

# 6. 前端构建
cd ../exam-frontend
npm install
echo "VITE_API_URL=http://188.166.250.114:3001/api" > .env
npm run build

# 7. 配置nginx
sudo tee /etc/nginx/sites-available/aitest > /dev/null <<EOF
server {
    listen 80;
    server_name 188.166.250.114;
    
    location / {
        root $(pwd)/dist;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# 启用配置
sudo ln -sf /etc/nginx/sites-available/aitest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. 配置防火墙
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ 部署完成！"
echo "🌐 访问地址: https://test.pylosy.com"
echo "📊 结果页面: https://test.pylosy.com/api/results"
echo "🔧 管理命令:"
echo "  pm2 status"
echo "  pm2 logs aitest-backend"
echo "  sudo systemctl status nginx"