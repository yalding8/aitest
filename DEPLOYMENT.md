# AI应用及思考能力测试系统 - 部署指南

## Digital Ocean 服务器部署

**服务器IP:** 188.166.250.114  
**GitHub仓库:** https://github.com/yalding8/aitest.git

### 1. 服务器环境准备
```bash
# SSH连接服务器
ssh root@188.166.250.114

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2
npm install -g pm2

# 安装nginx
sudo apt update
sudo apt install nginx
```

### 2. 部署应用
```bash
# 克隆代码
git clone https://github.com/yalding8/aitest.git
cd aitest

# 后端部署
cd exam-backend
npm install
cp .env.example .env
# 编辑 .env 配置
PORT=3001
WEBHOOK_URL=你的企业微信机器人URL
NODE_ENV=production

# 启动后端
pm2 start server.js --name aitest-backend

# 前端构建
cd ../exam-frontend
npm install
echo "VITE_API_URL=http://188.166.250.114:3001/api" > .env
npm run build
```

### 3. Nginx配置
```bash
# 创建nginx配置
sudo nano /etc/nginx/sites-available/aitest

# 配置内容：
server {
    listen 80;
    server_name 188.166.250.114;
    
    # 前端静态文件
    location / {
        root /root/aitest/exam-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 启用配置
sudo ln -s /etc/nginx/sites-available/aitest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. 防火墙配置
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 5. 访问测试
- 前端：http://188.166.250.114
- 后端API：http://188.166.250.114/api
- 结果页面：http://188.166.250.114/api/results

### 6. 部署后检查
```bash
# 检查服务状态
pm2 status
nginx -t
sudo systemctl status nginx

# 查看日志
pm2 logs aitest-backend
```

## 系统状态：✅ 可以上线