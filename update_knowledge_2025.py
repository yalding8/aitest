import json

file_path = '题库.json'

# 新增的 2025 年里程碑题目
new_questions_2025 = [
    {
        "type": "single",
        "category": "AI前沿趋势",
        "question": "【2025趋势】2025年初，OpenAI发布的'Operator'和Anthropic的'Computer Use'功能标志着AI进入了'Agentic'（智能体）时代。这类产品与传统ChatGPT的主要区别是？",
        "options": [
            "回答速度更快",
            "能直接操控用户的电脑或浏览器，自主完成'打开网页、点击按钮、填写表单'等复杂任务流",
            "支持语音对话",
            "会员价格更便宜"
        ],
        "answer": "B",
        "score": 5
    },
    {
        "type": "single",
        "category": "AI前沿趋势",
        "question": "【模型技术】为什么 OpenAI 的 o3 系列或 DeepSeek-R1 在处理复杂数学证明和代码架构时，比传统的 GPT-4o 更加有效？",
        "options": [
            "模型参数量大了一百倍",
            "采用了'思维链'（Chain of Thought）技术，在回答前会花费'思考时间'进行逻辑推演和自我纠错",
            "完全联网搜索",
            "主要靠运气"
        ],
        "answer": "B",
        "score": 5
    },
    {
        "type": "single",
        "category": "行业格局",
        "question": "【2025行业】2025年，中国模型 DeepSeek-R1 的发布对全球 AI 行业产生了巨大冲击，其核心意义在于？",
        "options": [
            "证明了开源模型可以通过'蒸馏'和高效算法，以极低的训练成本达到甚至超越顶尖闭源模型的效果",
            "它是第一个完全不会 hallucinate（幻觉）的模型",
            "它只能用于中文场景",
            "它完全免费没有任何商业模式"
        ],
        "answer": "A",
        "score": 5
    },
    {
        "type": "single",
        "category": "法律法规",
        "question": "【合规与安全】2024年底全面生效的《欧盟人工智能法案》（EU AI Act）确立了全球主流的AI监管框架。该法案的核心监管逻辑是？",
        "options": [
            "禁止所有AI研发",
            "基于'风险分级'（如高风险应用需严格合规，不可接受风险应用被禁止）",
            "只监管美国的AI公司",
            "要求AI必须拥有人权"
        ],
        "answer": "B",
        "score": 4
    },
    {
        "type": "case",
        "category": "AI前沿趋势",
        "question": "【实战应用】你正在使用支持'CoT'（思维链）推理的模型（如 o1 或 o3）进行任务规划。为了获得最佳效果，你的 Prompt 策略应该是？",
        "options": [
            "要求模型'尽可能简短回答'",
            "给予模型充分的思考空间，不要限制输出长度，只需清晰定义目标和约束条件",
            "反复强调'你必须答对'",
            "像对待搜索引擎一样只给关键词"
        ],
        "answer": "B",
        "score": 5
    }
]

def update_questions():
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        current_max_id = max([q['id'] for q in data['questions']])
        print(f"当前最大ID: {current_max_id}")
        
        # 为新题目分配ID并添加到列表
        added_count = 0
        for q in new_questions_2025:
            current_max_id += 1
            q['id'] = current_max_id
            data['questions'].append(q)
            added_count += 1
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"成功添加 {added_count} 道 2025 年前沿考题！")
        
    except Exception as e:
        print(f"更新失败: {str(e)}")

if __name__ == "__main__":
    update_questions()
