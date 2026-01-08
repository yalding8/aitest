#!/bin/bash

# 检查服务器上的授权码状态
server="root@188.166.250.114"
remote_file="/root/aitest/授权码.json"

echo "🔑 正在获取服务器上的授权码状态..."

ssh $server "if [ -f $remote_file ]; then cat $remote_file; else echo '{\"codes\":[]}'; fi" | \
python3 -c "
import sys, json

try:
    # Handle potential BOM or empty input
    content = sys.stdin.read().strip()
    if not content:
        print('Error: Received empty content from server')
        sys.exit(1)
        
    data = json.loads(content)
    codes = data.get('codes', [])

    used_codes = [c for c in codes if c.get('status') == 'used']
    unused_codes = [c for c in codes if c.get('status') != 'used']

    print(f'\n授权码总数: {len(codes)}')
    print(f'已使用: {len(used_codes)}')
    print(f'未使用: {len(unused_codes)}')

    print('\n--- 最近已使用的授权码 (Top 10) ---')
    if used_codes:
        # Sort by usedAt desc
        used_codes.sort(key=lambda x: x.get('usedAt', ''), reverse=True)
        print(f'{'授权码':<15} {'使用时间':<25}')
        print('-' * 40)
        for c in used_codes[:10]:
            print(f'{c['code']:<15} {c.get('usedAt', 'N/A'):<25}')
    else:
        print('无')
        
    print('\n--- 还可以使用的授权码 (Sample 10) ---')
    if unused_codes:
        print(f'{'授权码':<15}')
        print('-' * 20)
        for c in unused_codes[:10]:
            print(f'{c['code']:<15}')
        if len(unused_codes) > 10:
            print(f'... 等共 {len(unused_codes)} 个可用')
    else:
        print('无可用授权码')

except json.JSONDecodeError as e:
    print(f'无法解析数据文件: {e}')
    # print(f'Raw content: {content[:100]}...') 
except Exception as e:
    print(f'发生错误: {e}')
"
