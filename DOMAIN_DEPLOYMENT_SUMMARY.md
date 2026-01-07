# test.pylosy.com 域名配置完成 ✅

## 🎉 部署状态

**域名**: https://test.pylosy.com  
**状态**: ✅ 完全正常运行  
**部署时间**: 2026-01-07 14:30  
**最后更新**: 2026-01-07 14:32

---

## 📋 配置概览

### 基础信息
- **域名**: test.pylosy.com
- **服务器IP**: 188.166.250.114
- **项目**: AI 应用及思考能力测试系统
- **前端路径**: /var/www/aitest
- **后端端口**: 3005
- **PM2 服务**: aitest-backend

### SSL 证书
- **提供商**: Let's Encrypt
- **证书路径**: `/etc/letsencrypt/live/test.pylosy.com/fullchain.pem`
- **私钥路径**: `/etc/letsencrypt/live/test.pylosy.com/privkey.pem`
- **过期时间**: 2026-04-07
- **自动续期**: ✅ 已配置

### Nginx 配置
- **配置文件**: `/etc/nginx/sites-enabled/pylosy.conf`
- **HTTP**: 自动重定向到 HTTPS
- **HTTPS**: 443 端口
- **前端**: `/` → `/var/www/aitest`
- **API**: `/api/` → `http://127.0.0.1:3005`

---

## 🔧 解决的问题

### 1. 证书错误 (ERR_CERT_COMMON_NAME_INVALID)
**问题**: 域名没有专属的 SSL 证书  
**原因**: 使用了其他域名的证书  
**解决**: 使用 `certbot --nginx -d test.pylosy.com` 申请独立证书  
**验证**: ✅ 证书有效，浏览器显示安全连接

### 2. 502 Bad Gateway
**问题**: 访问域名返回 502 错误  
**原因**: Nginx 配置中代理到错误的端口（3003 而不是 3005）  
**解决**: 修改配置 `proxy_pass http://127.0.0.1:3005`  
**验证**: ✅ 页面正常加载

### 3. Nginx 配置冲突
**问题**: Nginx 启动时警告 `conflicting server name "test.pylosy.com"`  
**原因**: 存在两个 test.pylosy.com 的配置文件  
**解决**: 删除重复的 `/etc/nginx/sites-enabled/test.pylosy.com`  
**验证**: ✅ 警告消除（仍有其他域名的冲突警告，不影响功能）

### 4. 前端无法访问，只返回 API JSON
**问题**: 访问 https://test.pylosy.com 返回 JSON 而不是 HTML  
**原因**: Nginx 配置将所有请求（包括 `/`）都代理到后端  
**解决**: 修改配置，区分前端静态文件和 API 代理：
```nginx
# API 代理（优先匹配）
location /api/ {
    proxy_pass http://127.0.0.1:3005;
}

# 前端静态文件
location / {
    root /var/www/aitest;
    try_files $uri $uri/ /index.html;
}
```
**验证**: ✅ 前端 HTML 正常显示

### 5. API 代理路径错误
**问题**: API 请求返回 `Cannot GET /api/`  
**原因**: 配置中 `proxy_pass http://127.0.0.1:3005/api/;` 导致路径重复  
**解决**: 改为 `proxy_pass http://127.0.0.1:3005;`  
**验证**: ✅ API 请求正常工作

### 6. Mixed Content 错误 ⭐ 关键问题
**问题**: 
```
Mixed Content: The page at 'https://test.pylosy.com/' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://188.166.250.114:8080/api/verify'. 
This request has been blocked; the content must be served over HTTPS.
```

**原因**: 前端代码中 API 基础 URL 配置不当，生产环境仍使用 localhost 地址  
**解决**: 修改 `exam-frontend/src/api/client.ts`：
```typescript
// 修改前
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 修改后
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3005/api');
```

**部署步骤**:
1. 修改代码
2. 重新构建：`npm run build`
3. 部署到服务器：`rsync -avz --delete exam-frontend/dist/ root@188.166.250.114:/var/www/aitest/`
4. 提交代码：`git commit -m "修复 Mixed Content 错误"`

**验证**: ✅ 浏览器测试确认：
- ✅ 不再有 Mixed Content 错误
- ✅ API 请求使用 `https://test.pylosy.com/api/verify`
- ✅ 所有功能正常工作

---

## ✅ 验证结果

### 前端测试
```bash
$ curl -I https://test.pylosy.com
HTTP/1.1 200 OK
Content-Type: text/html
```

### API 测试
```bash
$ curl -s https://test.pylosy.com/api/verify -X POST \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
{"success":false,"message":"授权码无效或已使用"}
```

### 浏览器测试
- ✅ 页面正常加载
- ✅ 表单功能正常
- ✅ API 请求正常（使用 HTTPS）
- ✅ 无 Mixed Content 错误
- ✅ 无重大控制台错误

### 服务状态
```bash
$ ssh root@188.166.250.114 "pm2 status"
┌────┬────────────────┬─────────┬────────┬─────────┬──────────┐
│ id │ name           │ version │ mode   │ status  │ uptime   │
├────┼────────────────┼─────────┼────────┼─────────┼──────────┤
│ 0  │ aitest-backend │ 1.0.0   │ fork   │ online  │ 6h+      │
└────┴────────────────┴─────────┴────────┴─────────┴──────────┘
```

---

## 🌐 访问地址

- **主页**: https://test.pylosy.com
- **API 端点**: https://test.pylosy.com/api/*
  - POST `/api/verify` - 验证授权码
  - POST `/api/start` - 开始考试
  - POST `/api/submit` - 提交答卷
  - GET `/api/results` - 查看结果

---

## 📝 维护命令

### 查看日志
```bash
# Nginx 访问日志
ssh root@188.166.250.114 'sudo tail -f /var/log/nginx/test.pylosy.com.access.log'

# Nginx 错误日志
ssh root@188.166.250.114 'sudo tail -f /var/log/nginx/test.pylosy.com.error.log'

# 后端日志
ssh root@188.166.250.114 'pm2 logs aitest-backend'
```

### 重启服务
```bash
# 重启后端
ssh root@188.166.250.114 'pm2 restart aitest-backend'

# 重启 Nginx
ssh root@188.166.250.114 'sudo systemctl restart nginx'

# 重新加载 Nginx 配置（不中断服务）
ssh root@188.166.250.114 'sudo systemctl reload nginx'
```

### 更新部署
```bash
# 方式一：使用自动脚本（推荐）
./update-server.sh

# 方式二：手动更新
cd exam-frontend
npm run build
rsync -avz --delete dist/ root@188.166.250.114:/var/www/aitest/
```

### 证书管理
```bash
# 查看证书状态
ssh root@188.166.250.114 'sudo certbot certificates'

# 手动续期（通常不需要，已配置自动续期）
ssh root@188.166.250.114 'sudo certbot renew'

# 测试续期
ssh root@188.166.250.114 'sudo certbot renew --dry-run'
```

---

## 🔐 安全配置

- ✅ HTTPS 强制跳转
- ✅ SSL 证书有效
- ✅ 自动续期已配置
- ✅ 安全响应头已配置
- ✅ Mixed Content 问题已解决
- ✅ API 请求全部通过 HTTPS

---

## 📊 性能优化

当前配置已包含：
- ✅ HTTP/1.1 支持
- ✅ WebSocket 支持（Upgrade 头）
- ✅ 代理缓存绕过配置
- ✅ 真实 IP 转发
- ✅ 静态资源缓存（30天）
- ✅ Gzip 压缩（Nginx 默认）

---

## 🎯 后续建议

### 1. 监控配置
- [ ] 配置 Uptime 监控（如 UptimeRobot）
- [ ] 设置证书过期提醒
- [ ] 配置日志分析（如 GoAccess）
- [ ] 配置性能监控（如 New Relic）

### 2. 性能优化
- [ ] 考虑添加 CDN 加速
- [ ] 优化图片资源（WebP 格式）
- [ ] 实现服务端缓存
- [ ] 考虑 HTTP/2 或 HTTP/3

### 3. 安全加固
- [ ] 配置 fail2ban 防暴力破解
- [ ] 添加 WAF 规则
- [ ] 定期安全审计
- [ ] 配置备份策略

### 4. 功能增强
- [ ] 添加 favicon.ico 和 vite.svg
- [ ] 配置 robots.txt
- [ ] 添加 sitemap.xml
- [ ] 配置 Google Analytics

---

## 📚 相关文档

- [DOMAIN_SETUP_GUIDE.md](./DOMAIN_SETUP_GUIDE.md) - 域名配置详细指南
- [SERVER_UPDATE_GUIDE.md](./SERVER_UPDATE_GUIDE.md) - 服务器更新指南
- [setup-domain.sh](./setup-domain.sh) - 域名配置脚本
- [fix-nginx-config.sh](./fix-nginx-config.sh) - Nginx 配置修复脚本
- [update-server.sh](./update-server.sh) - 服务器更新脚本

---

## 🛠️ 故障排查

### 问题：页面无法访问
**检查项**:
1. DNS 是否生效：`ping test.pylosy.com`
2. 服务器防火墙：`sudo ufw status`
3. Nginx 状态：`sudo systemctl status nginx`
4. 后端服务：`pm2 status`

### 问题：API 请求失败
**检查项**:
1. 后端服务是否运行：`pm2 status`
2. Nginx 代理配置：`sudo nginx -t`
3. 查看错误日志：`sudo tail -f /var/log/nginx/error.log`
4. 浏览器控制台网络请求

### 问题：Mixed Content 错误
**检查项**:
1. 前端代码是否使用相对路径
2. 是否重新构建并部署了前端
3. 浏览器缓存是否清除（硬刷新 Ctrl+Shift+R）

### 问题：SSL 证书错误
**解决方案**:
```bash
# 重新申请证书
ssh root@188.166.250.114 'sudo certbot --nginx -d test.pylosy.com --force-renewal'

# 检查证书状态
ssh root@188.166.250.114 'sudo certbot certificates'
```

---

## 🎉 部署成功！

**test.pylosy.com** 已成功配置并完全正常运行！

所有问题已解决：
- ✅ SSL 证书配置完成
- ✅ Nginx 配置正确
- ✅ 前端正常显示
- ✅ API 正常工作
- ✅ Mixed Content 问题已修复
- ✅ 所有功能测试通过

可以开始使用了！🚀
