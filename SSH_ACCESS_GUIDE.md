# SSH访问配置指南

## 当前问题

无法SSH登录到服务器 `188.166.250.114`,提示 `Permission denied (publickey)`

## 原因

服务器的 `/root/.ssh/authorized_keys` 文件中没有您当前电脑的SSH公钥。

## 解决方案

### 方案一: 通过Digital Ocean控制台添加SSH密钥

1. **登录Digital Ocean控制台**
   - 访问: https://cloud.digitalocean.com/
   - 找到您的Droplet (IP: 188.166.250.114)

2. **使用控制台访问**
   - 点击 "Access" → "Launch Droplet Console"
   - 这会打开一个基于浏览器的终端

3. **添加SSH公钥**
   
   在控制台中执行:
   ```bash
   # 编辑authorized_keys文件
   nano ~/.ssh/authorized_keys
   
   # 添加以下公钥(在文件末尾新增一行):
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGOnm14w2H2Tf7TSELbENjNepJVbNpOSIMIQYtdJ5iyw ningding@NingdeMacBook-Pro.local
   
   # 保存并退出 (Ctrl+X, 然后Y, 然后Enter)
   
   # 设置正确的权限
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

4. **测试连接**
   
   在本地Mac终端执行:
   ```bash
   ssh root@188.166.250.114
   ```

### 方案二: 通过Digital Ocean设置中添加SSH密钥

1. 登录Digital Ocean控制台
2. 进入 Settings → Security → SSH Keys
3. 点击 "Add SSH Key"
4. 粘贴您的公钥:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGOnm14w2H2Tf7TSELbENjNepJVbNpOSIMIQYtdJ5iyw ningding@NingdeMacBook-Pro.local
   ```
5. 给密钥命名,如 "MacBook Pro"
6. 在Droplet设置中关联这个SSH密钥

### 方案三: 使用现有的其他密钥

如果您之前用其他密钥访问过这个服务器,可以尝试:

```bash
# 尝试id_rsa
ssh -i ~/.ssh/id_rsa root@188.166.250.114

# 尝试deploy_rsa
ssh -i ~/.ssh/deploy_rsa root@188.166.250.114

# 尝试aifx_deploy
ssh -i ~/.ssh/aifx_deploy root@188.166.250.114
```

## 配置完成后的操作

一旦SSH访问配置成功,执行以下命令更新服务器:

```bash
# 1. 登录服务器
ssh root@188.166.250.114

# 2. 更新代码
cd /root/aitest
git pull origin main

# 3. 检查题库
cat 题库.json | grep -c '"id"'  # 应该显示100

# 4. 更新后端
cd exam-backend
npm install --production
pm2 restart aitest-backend

# 5. 查看日志确认
pm2 logs aitest-backend --lines 20

# 应该看到:
# 🚀 AI Exam Backend running on http://localhost:3005
# 📚 Questions loaded: 100
# 🔐 Auth codes loaded: 1000
```

## 为SSH配置添加别名(可选)

SSH访问成功后,可以在 `~/.ssh/config` 中添加配置:

```bash
# 编辑SSH配置
nano ~/.ssh/config

# 添加以下内容:
Host aitest
    HostName 188.166.250.114
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

之后就可以简单地使用:
```bash
ssh aitest
```

## 快速命令参考

配置完SSH后,可以使用以下快捷命令:

```bash
# 检查服务器状态
./check-server.sh

# 自动更新部署
./update-server.sh

# 查看PM2状态
ssh root@188.166.250.114 "pm2 status"

# 查看后端日志
ssh root@188.166.250.114 "pm2 logs aitest-backend --lines 50"

# 重启服务
ssh root@188.166.250.114 "pm2 restart aitest-backend"
```

## 您的SSH公钥

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGOnm14w2H2Tf7TSELbENjNepJVbNpOSIMIQYtdJ5iyw ningding@NingdeMacBook-Pro.local
```

保存这个公钥,在需要配置新服务器时使用。
