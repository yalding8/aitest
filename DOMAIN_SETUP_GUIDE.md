# test.pylosy.com 域名配置指南

## 📌 概述
本指南说明如何为 AI 考试系统配置 `test.pylosy.com` 域名访问。

## 🎯 配置目标
- **域名**: test.pylosy.com
- **服务器IP**: 188.166.250.114
- **项目**: AI 考试系统
- **前端路径**: /var/www/aitest
- **后端端口**: 3005

## 🔧 配置步骤

### 1. DNS 配置

在域名服务商（如阿里云、腾讯云等）的 DNS 管理界面添加记录：

```
类型: A
主机记录: test
记录值: 188.166.250.114
TTL: 600（或默认值）
```

**验证 DNS 生效**：
```bash
# 在本地执行
ping test.pylosy.com
# 或
nslookup test.pylosy.com
```

### 2. 服务器 Nginx 配置

#### 步骤 2.1: 上传配置文件

```bash
# 将本地的 nginx-test-pylosy.conf 上传到服务器
scp nginx-test-pylosy.conf root@188.166.250.114:/etc/nginx/sites-available/test.pylosy.com
```

#### 步骤 2.2: 启用配置

```bash
# SSH 登录服务器
ssh root@188.166.250.114

# 创建软链接
sudo ln -s /etc/nginx/sites-available/test.pylosy.com /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 步骤 2.3: 验证配置

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 查看错误日志（如有问题）
sudo tail -f /var/log/nginx/error.log
```

### 3. 前端配置更新

如果前端有 API 基础路径配置，需要更新：

```javascript
// 示例：在前端配置文件中
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://test.pylosy.com/api'
  : 'http://localhost:3005';
```

### 4. SSL/HTTPS 配置（推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 自动配置 SSL
sudo certbot --nginx -d test.pylosy.com

# 测试自动续期
sudo certbot renew --dry-run
```

配置完成后，Nginx 配置会自动更新为 HTTPS。

## 🧪 测试验证

### 1. 基础访问测试
```bash
# 测试 HTTP 访问
curl -I http://test.pylosy.com

# 测试 API 接口
curl http://test.pylosy.com/api/
```

### 2. 浏览器测试
- 访问: http://test.pylosy.com
- 检查页面是否正常加载
- 检查浏览器控制台是否有错误
- 测试考试系统的完整流程

### 3. 后端服务检查
```bash
# 检查 PM2 服务状态
ssh root@188.166.250.114 "pm2 status"

# 查看后端日志
ssh root@188.166.250.114 "pm2 logs aitest-backend --lines 50"
```

## 📝 配置文件说明

### Nginx 配置要点

```nginx
server {
    listen 80;
    server_name test.pylosy.com;  # 域名配置
    
    # 前端静态文件
    location / {
        root /var/www/aitest;      # 前端构建产物路径
        try_files $uri $uri/ /index.html;  # SPA 路由支持
    }
    
    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3005/;  # 后端服务地址
        # ... 其他代理配置
    }
}
```

## 🔄 更新部署流程

更新 `update-server.sh` 脚本，添加域名访问提示：

```bash
echo "✅ 部署完成！"
echo "🌐 IP访问: http://188.166.250.114:8080/aitest/"
echo "🌐 域名访问: http://test.pylosy.com"
echo "📊 查看日志: ssh $SERVER 'pm2 logs aitest-backend'"
```

## ⚠️ 常见问题

### Q1: 域名无法访问
**检查项**:
1. DNS 是否生效（`ping test.pylosy.com`）
2. 服务器防火墙是否开放 80/443 端口
3. Nginx 配置是否正确（`sudo nginx -t`）
4. Nginx 是否重启（`sudo systemctl status nginx`）

### Q2: API 请求失败
**检查项**:
1. 后端服务是否运行（`pm2 status`）
2. Nginx 代理配置是否正确
3. 查看 Nginx 错误日志
4. 检查浏览器控制台网络请求

### Q3: 静态资源 404
**检查项**:
1. 前端是否已构建（`npm run build`）
2. 构建产物是否在 `/var/www/aitest`
3. 文件权限是否正确（`ls -la /var/www/aitest`）

### Q4: HTTPS 证书问题
**解决方案**:
```bash
# 重新申请证书
sudo certbot --nginx -d test.pylosy.com --force-renewal

# 检查证书状态
sudo certbot certificates
```

## 🚀 快速部署命令

创建一键部署脚本：

```bash
#!/bin/bash
# 一键配置 test.pylosy.com

SERVER="root@188.166.250.114"

# 上传 Nginx 配置
scp nginx-test-pylosy.conf $SERVER:/etc/nginx/sites-available/test.pylosy.com

# 配置并重启
ssh $SERVER << 'ENDSSH'
# 启用站点
sudo ln -sf /etc/nginx/sites-available/test.pylosy.com /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 显示状态
sudo systemctl status nginx --no-pager
echo "✅ test.pylosy.com 配置完成！"
ENDSSH
```

## 📊 监控建议

### 1. 日志监控
```bash
# 实时查看访问日志
sudo tail -f /var/log/nginx/test.pylosy.com.access.log

# 实时查看错误日志
sudo tail -f /var/log/nginx/test.pylosy.com.error.log
```

### 2. 性能监控
- 使用 PM2 监控后端性能：`pm2 monit`
- 使用 Google Analytics 或其他工具监控前端访问

## 🔐 安全建议

1. **启用 HTTPS**（强烈推荐）
2. **配置防火墙**：只开放必要端口（80, 443, 22）
3. **定期更新**：保持系统和依赖包更新
4. **备份配置**：定期备份 Nginx 配置和数据库

## 📚 相关文档

- [SERVER_UPDATE_GUIDE.md](./SERVER_UPDATE_GUIDE.md) - 服务器更新指南
- [SSH_ACCESS_GUIDE.md](./SSH_ACCESS_GUIDE.md) - SSH 访问指南
- [update-server.sh](./update-server.sh) - 自动更新脚本

## 🆘 紧急联系

如遇问题，请提供：
1. DNS 解析结果：`nslookup test.pylosy.com`
2. Nginx 配置测试：`sudo nginx -t`
3. Nginx 错误日志：`sudo tail -100 /var/log/nginx/error.log`
4. PM2 服务状态：`pm2 status`
5. 浏览器控制台截图
