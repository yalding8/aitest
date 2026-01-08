# GitHub Actions 配置检查清单

## ❌ 当前错误
```
error: missing server host
```

这表明 `SERVER_HOST` Secret 未配置或为空。

## ✅ 需要配置的 Secrets

请访问：https://github.com/yalding8/aitest/settings/secrets/actions

确保以下 3 个 Secrets 都已正确配置：

### 1. SERVER_HOST
- **Name**: `SERVER_HOST`
- **Value**: `188.166.250.114`
- **说明**: 服务器 IP 地址

### 2. SERVER_USER  
- **Name**: `SERVER_USER`
- **Value**: `root`
- **说明**: SSH 登录用户名

### 3. SSH_PRIVATE_KEY
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: 
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACAf95W0/oo7suM2mJUv3LcfC0iveFdQEwZW+xaYOmldWQAAAJiiNx/Iojcf
yAAAAAtzc2gtZWQyNTUxOQAAACAf95W0/oo7suM2mJUv3LcfC0iveFdQEwZW+xaYOmldWQ
AAAEAL M6px4/F62VlKu9NT+a+hBPudJn/K5lspL0WKiG03ax/3lbT+ijuy4zaYlS/ctx8L
SK94V1ATBlb7Fpg6aV1ZAAAAFWdpdGh1Yi1hY3Rpb25zLWRlcGxveQ==
-----END OPENSSH PRIVATE KEY-----
```
- **说明**: SSH 私钥（完整复制，包括 BEGIN 和 END 行）

## 📝 配置步骤

1. 打开 https://github.com/yalding8/aitest/settings/secrets/actions

2. 如果 Secret 已存在，点击右侧的铅笔图标编辑；如果不存在，点击 "New repository secret"

3. 逐个添加/更新上述 3 个 Secrets

4. 配置完成后，推送代码触发部署：
   ```bash
   git commit --allow-empty -m "test: verify secrets configuration"
   git push origin main
   ```

5. 访问 https://github.com/yalding8/aitest/actions 查看部署状态

## 🔍 验证方法

配置完成后，Actions 日志应该显示：
- ✅ 成功连接到服务器
- ✅ 执行 git pull
- ✅ 重启服务

而不是：
- ❌ error: missing server host
