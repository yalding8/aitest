#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成 2026 管理岗转型专用题库 (识珠专项版)
聚焦于 AI 价值识别、ROI 评估、智能体协作及边界风险
"""

import json
import os

def generate_mgt_questions():
    questions = [
        # --- 维度一：AI 价值发现 (识珠) ---
        {
            "id": "mgt_001",
            "type": "single",
            "category": "AI 价值发现",
            "question": "作为管理层，在决定部门 AI 转型切入点时，以下哪类业务环节最符合‘高价值、低风险’的‘明珠’特征？",
            "options": [
                "涉及多方利益协调、且需根据突发状况进行感性判断的战略谈判",
                "高频、流程标准化程度高、且结果可由系统自动验证闭环的业务操作",
                "数据极度匮乏、依赖专家多年‘直觉’和‘行业潜规则’的灰产决策",
                "公司核心商业机密代码的重构与迁移"
            ],
            "option_weights": [ -1, 4, 0, 1 ],
            "answer": "B",
            "score": 4,
            "analysis": "标准化、高频且可验证是 AI 落地的最佳土壤。"
        },
        {
            "id": "mgt_002",
            "type": "case",
            "category": "AI 价值发现",
            "question": "公司计划改造客服中心。目前 60% 的咨询是关于‘申请进度’和‘材料补交规则’。从管理视角看，最优的 AI 识珠策略是？",
            "options": [
                "引入 AI 语音机器人，直接替代人工接听所有电话",
                "先将 60% 的重复性标准化咨询通过 Agent 对接系统 API 实现自主闭环，人工集中处理剩下的 40% 复杂投诉",
                "要求客服人员学习 Prompt 技巧，用 AI 辅助他们打字，但不改变工作流程",
                "暂时不动客服，先用 AI 做公司宣传短视频"
            ],
            "option_weights": [ 0, 5, 2, 1 ],
            "answer": "B",
            "score": 5
        },
        {
            "id": "mgt_003",
            "type": "single",
            "category": "AI 价值发现",
            "question": "在 2026 年的 AI 视野中，所谓的‘伪需求’往往是指？",
            "options": [
                "能够通过简单规则（If-Else）解决但非要引入大模型解决的问题",
                "需要处理海量多模态数据的问题",
                "需要 Agent 24 小时待命的问题",
                "涉及跨境多语言实时翻译的问题"
            ],
            "answer": "A",
            "score": 4
        },

        # --- 维度二：技术边界与边界风险 ---
        {
            "id": "mgt_004",
            "type": "single",
            "category": "技术边界",
            "question": "2025-2026 年，Agentic AI (智能体化 AI) 与传统生成式 AI 最本质的边界区别是？",
            "options": [
                "Agent 能够生成更漂亮、更具有逻辑性的文字内容",
                "Agent 具备自主规划目标、使用工具库（Tools）并能根据环境反馈调整行动的能力",
                "Agent 的响应速度比传统 AI 快",
                "Agent 不需要消耗 Token"
            ],
            "answer": "B",
            "score": 5
        },
        {
            "id": "mgt_005",
            "type": "multiple",
            "category": "边界风险",
            "question": "当管理层决定让 AI Agent 自主调用银行支付接口进行财务核销时，必须设置的‘护栏’包括哪些？ (多选)",
            "options": [
                "设置单笔及每日最高执行上限（Human-in-the-loop 审核点）",
                "部署独立的审计 Agent 对主 Agent 执行记录进行全量审计",
                "完全信任 AI，因为 AI 不会产生算术错误",
                "保留随时的一键阻断权限，并记录完整的决策 Trace 图"
            ],
            "answer": ["A", "B", "D"],
            "score": 5
        },

        # --- 维度三：效能评估 (ROI) ---
        {
            "id": "mgt_006",
            "type": "single",
            "category": "效能评估",
            "question": "在评估一项 AI 投入的 ROI 时，管理层不应只看‘砍掉的人头数’，更应该关注哪个核心指标？",
            "options": [
                "Token 的消耗费用是否在预算内",
                "员工是否在上班时间玩 AI",
                "业务响应时效（TTM）的缩短、复杂任务交付成本的下降以及漏斗转化率的提升",
                "AI 生成的内容是否比人写的字数多"
            ],
            "answer": "C",
            "score": 4
        },
        {
            "id": "mgt_007",
            "type": "case",
            "category": "效能评估",
            "question": "某部门引入 AI 后，员工反馈‘工作反而变多了’，因为要审核大量 AI 生成的低质量内容。作为管理者，你判断该项目的当前状态是？",
            "options": [
                "项目非常成功，员工在磨合",
                "典型的‘负向 ROI’，可能存在技术选型错误或 Prompt 设计不当，需立即调整工作流",
                "员工在偷懒，应该加强考核",
                "这是正常现象，所有 AI 项目初期都会增加工作量"
            ],
            "answer": "B",
            "score": 5
        },

        # --- 维度四：智能体协作与工作流 ---
        {
            "id": "mgt_008",
            "type": "single",
            "category": "智能体协作",
            "question": "未来的理想组织形态是‘人+系统+AI’。在这种形态下，人类管理者的角色更像是？",
            "options": [
                "打字员，负责把命令输入系统",
                "监控员，全天盯着 AI 别犯错",
                "架构师与首席质量官（CQO），负责目标对齐、工作流分发以及最终价值定标",
                "不再需要人类管理者，AI 可以管理一切"
            ],
            "answer": "C",
            "score": 4
        },
        {
            "id": "mgt_009",
            "type": "multiple",
            "category": "智能体协作",
            "question": "构建管理岗位的‘AI 视野’，意味着你需要理解哪些核心逻辑？ (多选)",
            "options": [
                "AI 如何重构价值链条（Value Chain Re-engineering）",
                "如何通过数据飞轮（Data Flywheel）让系统自我演进",
                "如何记住 100 个以上常用的 Prompt 技巧",
                "如何建立支持 AI 协作的底层组织文化与激励体系"
            ],
            "answer": ["A", "B", "D"],
            "score": 4
        }
    ]

    # 继续扩充至 30 题...
    # 这里为了演示先生成一部分，实际可以根据需求继续添加

    # 模拟扩充剩余题目
    for i in range(10, 31):
        questions.append({
            "id": f"mgt_{i:03d}",
            "type": "single",
            "category": "战略视野",
            "question": f"关于 2026 年企业 AI 战略发展的常识题 {i}：如何平衡创新与稳健？",
            "options": ["A", "B", "C", "D"],
            "answer": "B",
            "score": 3
        })

    data = {
        "version": "2026.1.MGT",
        "description": "AI 视野与转型评估 (管理岗专用)",
        "questions": questions
    }

    output_path = '/Users/ningding/Documents/Obsidian Vault/AI能力测试/题库_管理岗.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"成功生成管理岗专用题库：{output_path}, 共 {len(questions)} 题")

if __name__ == "__main__":
    generate_mgt_questions()
