
#!/bin/bash

# 导出脚本：下载服务器上的授权码文件并生成CSV报表
SERVER="root@188.166.250.114"
REMOTE_FILE="/root/aitest/授权码.json"
LOCAL_JSON="授权码_from_server.json"
DATE_SUFFIX=$(date +%Y%m%d_%H%M%S)

echo "📥 正在从服务器下载授权码数据..."
scp $SERVER:$REMOTE_FILE $LOCAL_JSON

if [ $? -ne 0 ]; then
    echo "❌ 下载失败，请检查网络或SSH连接"
    exit 1
fi

echo "📊 正在处理数据并生成报表..."

python3 -c "
import json
import csv
import sys

try:
    with open('$LOCAL_JSON', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    codes = data.get('codes', [])
    
    used_list = []
    unused_list = []
    
    for c in codes:
        if c.get('status') == 'used':
            info = c.get('usedBy', {})
            row = {
                '授权码': c['code'],
                '城市': c.get('city', '-'),
                '状态': '已使用',
                '使用时间': c.get('usedAt', ''),
                '使用者姓名': info.get('name', ''),
                '邮箱': info.get('email', ''),
                '岗位': info.get('position', ''),
                '分数': info.get('score', '')
            }
            used_list.append(row)
        else:
            row = {
                '授权码': c['code'],
                '城市': c.get('city', '-'),
                '状态': '未使用'
            }
            unused_list.append(row)
            
    # 写入已使用 CSV
    used_filename = '授权码_已使用_$DATE_SUFFIX.csv'
    with open(used_filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
        fieldnames = ['授权码', '城市', '状态', '使用时间', '使用者姓名', '邮箱', '岗位', '分数']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(used_list)
        
    # 写入未使用 CSV
    unused_filename = '授权码_未使用_$DATE_SUFFIX.csv'
    with open(unused_filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
        fieldnames = ['授权码', '城市', '状态']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unused_list)
        
    print(f'✅ 成功导出！')
    print(f'   - 已使用记录: {len(used_list)} 条 -> {used_filename}')
    print(f'   - 未使用记录: {len(unused_list)} 条 -> {unused_filename}')

except Exception as e:
    print(f'❌ 处理失败: {e}')
"

# 清理临时文件
rm $LOCAL_JSON
