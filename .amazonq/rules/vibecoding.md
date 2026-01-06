# VibeCoding 项目规则与配置指南

## 核心理念与原则 (Core Principles)

- **简洁至上 (KISS)**: 恪守KISS原则，崇尚简洁与可维护性，避免过度工程化与不必要的防御性设计。
- **深度分析 (First Principles)**: 积极运用第一性原理。将复杂问题拆解到最基础、最根本要素/公理，从基石出发推理构建，追求本质与最优解，而非依赖经验、类比或传统假设。
- **事实为本**: 以事实为最高准则。若有任何谬误，坦率斧正。
- **坚守本心**: 时刻记得项目的核心开发诉求，未经充分授权不要做延展。

## 开发工作流 (Development Workflow)

1. **渐进式开发**: 通过多轮对话迭代，明确并实现需求。
2. **结构化流程**: 严格遵循 "构思方案 (Implementation Plan) → 提请审核 → 分解为具体任务 (Task List) → 执行" 的作业顺序。
    - **重大功能设计先讨论**: 不要急着写代码；先理解需求、给出实现思路与需要决策点，确认后再实现。
3. **遇到困难**:
    - **钻研但保持清醒**: 一旦陷入死循环，不要无休止尝试；适时休息，换思路；从 GitHub 等平台和你的知识库中寻找新的解题路径。

## 代码与设计规范 (Coding & Design Standards)

- **设计原则**: 设计与重构遵循 SOLID 原则。
- **UI 设计风格**: 参考 `apple.com` 的简洁、克制、高质感风格（除非需求另有规定）。使用大留白、微交互和系统字体。
- **因地制宜**:
    - **前端**: 默认使用 **中文** 文案与界面。
    - **后端**: 默认使用 **中文** 字段/提示信息（除非协议/标准要求英文）。

## 输出规范 (Output Requirements)

- **语言要求**: 所有回复、思考过程及任务清单，均须使用 **中文**。
- **固定指令**: 每次回复必须包含 `Implementation Plan, Task List and Thought in Chinese` 结构。

## 规则来源

- 本文件汇编自 `AGENTS.md` 及用户核心指令，作为项目的最高行动准则。

## 文档生成规范

### 强制规范 (MUST)

### 文档存放位置

- 所有项目文档必须生成到 `docs/` 目录下
- 禁止在其他目录创建文档文件
- 文档文件名使用 UPPER_SNAKE_CASE: [ARCHITECTURE.md](http://architecture.md/), API_GUIDE.md

### 文档命名规范

- 架构文档: [ARCHITECTURE.md](http://architecture.md/)
- API 文档: API_REFERENCE.md, API_GUIDE.md
- 测试文档: TESTING__.md, E2E_TEST__.md
- 迁移文档: *_MIGRATION_GUIDE.md, *_MIGRATION_STATUS.md
- 集成文档: *_INTEGRATION_GUIDE.md, *_INTEGRATION_SUMMARY.md
- 状态文档: *_STATUS.md, *_SUMMARY.md

### 文档格式

- 使用 Markdown 格式
- 文件编码: UTF-8
- 换行符: LF (Unix 风格)
- 必须包含一级标题 (# 标题)

### 文档内容结构

- 必须包含: 标题, 概述, 主要内容
- 推荐包含: 目录 (TOC), 示例代码, 参考链接
- 代码示例使用代码块标注语言: `go,` yaml, ```json

### 推荐规范 (SHOULD)

### 文档分类

按文档类型组织:

```
docs/
├── ARCHITECTURE.md           # 架构设计
├── API_REFERENCE.md          # API 参考
├── TESTING_QUICK_START.md    # 测试快速开始
├── *_GUIDE.md                # 指南类文档
├── *_SUMMARY.md              # 总结类文档
└── *_STATUS.md               # 状态类文档

```

### 文档更新

- 重大变更必须更新相关文档
- 文档与代码同步提交
- 过时文档及时归档或删除

### 文档链接

- 使用相对路径引用其他文档
- 示例: `[架构设计](./ARCHITECTURE.md)`
- 外部链接使用完整 URL

### 代码示例

- 代码示例必须可运行
- 包含必要的导入和错误处理
- 使用注释说明关键步骤