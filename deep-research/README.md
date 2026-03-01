# Deep Research Skill for OpenClaw

深度调研方法论（8步法 + 交叉验证）- 将模糊主题转化为高质量调研报告。

## 概述

这个 Skill 将 Claude Code 的 `deep-research` 移植到 OpenClaw 框架，使 Claw02 飞书机器人具备深度调研能力。

## 功能特点

- **8 步调研法**: 问题拆解 → 资料分层 → 事实抽取 → 框架对比 → 参照对齐 → 推导链 → 用例验证 → 交付化
- **交叉验证**: 支持轻量验证（实用型）和独立验证（学术型）
- **多种报告类型**: 概念对比、决策支持、趋势分析、问题诊断、知识梳理、学术研究
- **结构化输出**: 自动生成中间文件和最终报告

## 触发词

在飞书中向 Claw02 发送以下关键词可触发深度调研：

- "深度调研"、"深度研究"、"深入分析"
- "帮我调研"、"调研一下"、"研究一下"
- "对比分析"、"概念对比"、"技术对比"
- "写调研报告"、"出调研报告"
- "深度学术调研"、"学术综述"、"文献研究"

## 安装

### 1. 复制到 OpenClaw Skills 目录

```bash
cp -r deep-research ~/.openclaw/skills/
```

### 2. 重启 OpenClaw Gateway

```bash
# 停止现有服务
docker stop claw02-v3

# 重新启动
docker start claw02-v3
```

## 使用方法

### 方式一：通过飞书机器人

直接在飞书中向 Claw02 发送调研请求：

```
深度调研：REST API vs GraphQL 的区别
```

### 方式二：通过 OpenClaw API

```javascript
const result = await skill.execute(config, {
  tool: 'deep_research',
  topic: 'REST API vs GraphQL',
  researchType: 'concept',
  comparisonTarget: 'GraphQL',
  boundary: {
    audience: '开发者',
    region: '全球',
    time: '2024-2025',
    level: 'API设计'
  }
});
```

## 输出文件

调研完成后会在工作目录生成以下文件：

```
/tmp/research/<topic>/
├── 00_问题拆解.md          # Step 0-1 产出
├── 01_资料来源.md          # Step 2 产出
├── 02_事实卡片.md          # Step 3 产出
├── 03_对比框架.md          # Step 4 产出
├── 04_推导过程.md          # Step 6 产出
├── 05_验证记录.md          # Step 7 产出
├── 06_交叉验证.md          # Step 7.5 产出（学术型）
└── FINAL_调研报告.md       # Step 8 产出
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| workDir | string | /tmp/research | 工作目录 |
| enableVerification | boolean | true | 是否启用交叉验证 |
| maxSources | number | 10 | 最大查阅资料数量 |

## 调研类型

| 类型 | 说明 | 验证级别 |
|------|------|----------|
| concept | 概念对比型 | 🔵 轻量验证 |
| decision | 决策支持型 | 🔵 轻量验证 |
| trend | 趋势分析型 | 🔵 轻量验证 |
| diagnostic | 问题诊断型 | 🔵 轻量验证 |
| knowledge | 知识梳理型 | 🔵 轻量验证 |
| academic | 学术研究型 | 🟚 独立验证 |

## 版本历史

- **v2.0.0** (2025-03-01) - 移植到 OpenClaw 框架
- 原 Claude Code skill 由 jonejiang 创建

## 许可证

MIT License

## 作者

jonejiang

## 相关链接

- 原始 Skill: https://github.com/jonejiang/skills/deep-research
- OpenClaw: https://openclaw.dev/
- Claw02 飞书机器人
