import json

# 读取现有题库
with open('题库.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

current_max_id = max([q['id'] for q in data['questions']])
print(f"当前最大ID: {current_max_id}")

new_questions = [
    {
        "id": current_max_id + 1,
        "type": "single",
        "category": "AI工具认知",
        "question": "【AI应用】涉及到一份长达20万字的公寓招投标文件分析，需要快速提炼关键条款。以下哪个模型因其超长上下文窗口（Context Window）优势最适合？",
        "options": [
            "GPT-3.5",
            "Midjourney",
            "Claude 3 (200k+ context) 或 Gemini 1.5 Pro",
            "Sora"
        ],
        "answer": "C",
        "score": 4
    },
    {
        "id": current_max_id + 2,
        "type": "single",
        "category": "AI工具认知",
        "question": "【AI应用】你需要为公寓的春节活动快速生成宣传海报，且海报中必须准确包含“龙年大吉”这四个汉字。以下哪个绘图模型处理文字嵌入（Text Rendering）的能力通常被认为最强？",
        "options": [
            "Stable Diffusion 1.5",
            "DALL-E 3",
            "Midjourney V5",
            "Photoshop 2020"
        ],
        "answer": "B",
        "score": 4
    },
    {
        "id": current_max_id + 3,
        "type": "single",
        "category": "创新应用",
        "question": "【Vibe Coding】近期流行的“Vibe Coding”（氛围编码）理念，强调的核心逻辑是？",
        "options": [
            "必须精通汇编语言才能写出好代码",
            "完全不写代码，只靠意念控制",
            "不纠结于底层语法细节，通过自然语言与AI协作，快速将想法转化为可运行的产品",
            "代码必须写得像诗歌一样优美"
        ],
        "answer": "C",
        "score": 5
    },
    {
        "id": current_max_id + 4,
        "type": "case",
        "category": "创新应用",
        "question": "【Vibe Coding】作为非技术背景的运营，你想开发一个简单的“汇率换算器”网页。在使用 Cursor 等 AI 编程工具时，遇到报错的最佳处理方式是？",
        "options": [
            "立即放弃，认为自己没有编程天赋",
            "去买一本《JavaScript从入门到精通》从头学起",
            "直接将报错信息粘贴给 AI，让它解释原因并提供修复代码（Fix it for me）",
            "找技术部同事帮忙写"
        ],
        "answer": "C",
        "score": 5
    },
    {
        "id": current_max_id + 5,
        "type": "single",
        "category": "AI工具认知",
        "question": "【Prompt技巧】在让 AI 处理复杂的房源匹配逻辑时，为了提高准确率，你在提示词中加上了“请一步步思考 (Let's think step by step)”。这种技巧在 AI 领域被称为什么？",
        "options": [
            "思维链 (Chain of Thought, CoT)",
            "情感计算 (Affective Computing)",
            "强化学习 (RLHF)",
            "对抗生成 (GAN)"
        ],
        "answer": "A",
        "score": 4
    },
    {
        "id": current_max_id + 6,
        "type": "case",
        "category": "岗位场景应用",
        "question": "【提示词工程】AI 生成的公寓营销文案虽然没有语法错误，但感觉“味儿不对”，不够吸引留学生。为了让 AI 写出更地道的文案，最有效的 Prompt 策略是？",
        "options": [
            "反复告诉 AI “你写得不好，重写”",
            "提供几篇你认为优秀的过往爆款推文作为“样本”（Few-Shot Learning），让 AI 学习这种风格并模仿",
            "调整 AI 的参数（Temperature）",
            "换一个更贵的 AI 模型"
        ],
        "answer": "B",
        "score": 4
    }
]

data['questions'].extend(new_questions)

with open('题库.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"成功添加 {len(new_questions)} 道新题目！")
