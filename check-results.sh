#!/bin/bash

# 检查服务器上的考试结果
server="root@188.166.250.114"
remote_file="/root/aitest/exam_results.json"

echo "📊 正在获取服务器上的考试结果..."

ssh $server "if [ -f $remote_file ]; then cat $remote_file; else echo '[]'; fi" | \
python3 -c "
import sys, json
from datetime import datetime

try:
    data = json.load(sys.stdin)
    if not data:
        print('暂无考试记录')
        sys.exit(0)

    # 按时间倒序排序
    data.sort(key=lambda x: x.get('submittedAt', ''), reverse=True)

    print(f'\n{'姓名':<10} {'分数':<5} {'状态':<8} {'用时(分)':<8} {'提交时间':<20} {'岗位'}')
    print('-' * 80)

    for r in data:
        score = r.get('score', 0)
        status = '✅ 及格' if r.get('passed') else '❌ 不及格'
        name = r.get('name', 'Unknown')
        duration = round(r.get('duration', 0) / 60)
        time_str = r.get('submittedAt', '')
        if time_str:
            try:
                dt = datetime.fromisoformat(time_str.replace('Z', '+00:00'))
                time_str = dt.strftime('%Y-%m-%d %H:%M')
            except:
                pass
        position = r.get('position', '-')
        
        print(f'{name:<12} {score:<7} {status:<10} {duration:<11} {time_str:<22} {position}')
    
    print(f'\n总计: {len(data)} 条记录')

except json.JSONDecodeError:
    print('无法解析数据文件')
except Exception as e:
    print(f'发生错误: {e}')
"
