/**
 * Deep Research Skill for OpenClaw
 * 深度调研方法论（8步法 + 交叉验证）
 * Version: 2.0.0
 */

const fs = require('fs').promises;
const path = require('path');

// 默认配置
const DEFAULT_CONFIG = {
  workDir: '/tmp/research',
  enableVerification: true,
  maxSources: 10
};

// 调研类型映射
const RESEARCH_TYPES = {
  'concept': '概念对比型',
  'decision': '决策支持型',
  'trend': '趋势分析型',
  'diagnostic': '问题诊断型',
  'knowledge': '知识梳理型',
  'academic': '学术研究型'
};

// 验证级别
const VERIFICATION_LEVELS = {
  'academic': '🟚 独立验证',
  'default': '🔵 轻量验证'
};

/**
 * 创建工作目录结构
 */
async function createWorkspace(topic, config) {
  const workDir = path.join(config.workDir || DEFAULT_CONFIG.workDir, sanitizeTopic(topic));

  // 创建目录
  await fs.mkdir(workDir, { recursive: true });

  return workDir;
}

/**
 * 清理主题名作为目录名
 */
function sanitizeTopic(topic) {
  return topic
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

/**
 * Step 0-1: 问题拆解与边界界定
 */
async function step0ProblemDecomposition(topic, researchType, boundary, workDir) {
  const content = `# 问题拆解

**调研主题**: ${topic}
**问题类型**: ${RESEARCH_TYPES[researchType] || '概念对比型'}
**验证级别**: ${researchType === 'academic' ? VERIFICATION_LEVELS.academic : VERIFICATION_LEVELS.default}
**创建时间**: ${new Date().toISOString()}

---

## 原始问题

${topic}

---

## 研究对象边界

| 维度 | 定义 |
|------|------|
| **人群** | ${boundary?.audience || '未指定'} |
| **地域** | ${boundary?.region || '未指定'} |
| **时间** | ${boundary?.time || '未指定'} |
| **层级** | ${boundary?.level || '未指定'} |

---

## 子问题拆解

1. **子问题 A**: [主题] 是什么、怎么工作的？（定义与机制）
2. **子问题 B**: [主题] 与 [参照物] 的关系/差异？（对比分析）
3. **子问题 C**: [主题] 在什么场景下适用/不适用？（边界条件）
4. **子问题 D**: [主题] 的发展趋势/最佳实践？（延伸分析）

---

## 时效敏感性评估

- **敏感级别**: [待评估]
- **判断依据**: [待补充]
`;

  await fs.writeFile(path.join(workDir, '00_问题拆解.md'), content, 'utf-8');
  return path.join(workDir, '00_问题拆解.md');
}

/**
 * Step 2: 资料来源记录
 */
async function step2Sources(topic, sources, workDir) {
  const filePath = path.join(workDir, '01_资料来源.md');

  let content = await fs.readFile(filePath, 'utf-8').catch(() => `# 资料来源\n\n${topic}\n\n---\n\n`);

  for (const source of sources) {
    content += `## 资料 #${source.index || '?'}

- **标题**: ${source.title || '未知'}
- **链接**: ${source.url || ''}
- **层级**: ${source.level || 'L3'}
- **发布日期**: ${source.date || new Date().toISOString().split('T')[0]}
- **时效状态**: ${source时效状态 || '✅当前有效'}
- **适用对象**: ${source.audience || '未指定'}
- **与研究边界匹配**: ${source.match || '✅完全匹配'}
- **摘要**: ${source.snippet || ''}
- **与子问题关联**: ${source.relatedQuestion || ''}

---

`;
  }

  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Step 3: 事实卡片
 */
async function step3FactCards(topic, facts, workDir) {
  const filePath = path.join(workDir, '02_事实卡片.md');

  let content = await fs.readFile(filePath, 'utf-8').catch(() => `# 事实卡片\n\n主题: ${topic}\n\n---\n\n`);

  for (const fact of facts) {
    const confidenceIcon = fact.confidence === 'high' ? '✅' : fact.confidence === 'medium' ? '⚠️' : '❓';
    content += `## 事实 #${fact.index || '?'}

- **陈述**: ${fact.statement || fact.fact || ''}
- **出处**: ${fact.source || ''}
- **适用对象**: ${fact.audience || '未指定'}
- **置信度**: ${confidenceIcon}
- **验证状态**: 🔵待验证
- **关联维度**: ${fact.dimension || ''}

---

`;
  }

  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Step 4: 对比框架
 */
async function step4ComparisonFramework(topic, framework, workDir) {
  const content = `# 对比框架

**主题**: ${topic}
**框架类型**: ${framework.type || '概念对比型'}
**创建时间**: ${new Date().toISOString()}

---

## 选定的维度

${framework.dimensions?.map((d, i) => `${i + 1}. ${d}`).join('\n') || ''}

---

## 初步填充

| 维度 | 选项A | 选项B | 事实依据 |
|------|-------|-------|----------|
${framework.rows?.map(row => `| ${row.dimension} | ${row.a || ''} | ${row.b || ''} | ${row.evidence || ''} |`).join('\n') || ''}

---

`;

  await fs.writeFile(path.join(workDir, '03_对比框架.md'), content, 'utf-8');
  return path.join(workDir, '03_对比框架.md');
}

/**
 * Step 6: 推导过程
 */
async function step6Derivation(topic, derivations, workDir) {
  const content = `# 推导过程

**主题**: ${topic}
**创建时间**: ${new Date().toISOString()}

---

${derivations.map(d => `
## 维度: ${d.dimension}

### 事实确认
根据 [事实#${d.factA}]，${d.factAContent}

### 对照参照物
而 ${d.reference} 是...（来源：[事实#${d.factB}]）

### 结论
因此，差异是：${d.conclusion}

### 置信度
${d.confidence === 'high' ? '✅' : '⚠️'} ${d.reason || ''}

---`).join('\n')}

`;

  await fs.writeFile(path.join(workDir, '04_推导过程.md'), content, 'utf-8');
  return path.join(workDir, '04_推导过程.md');
}

/**
 * Step 7: 验证记录
 */
async function step7Validation(topic, validation, workDir) {
  const content = `# 验证记录

**主题**: ${topic}
**创建时间**: ${new Date().toISOString()}

---

## 验证场景

${validation.scenario || '待补充'}

---

## 按结论预期

${validation.expectation || '待补充'}

---

## 实际验证结果

${validation.result || '待补充'}

---

## 回查清单

- [ ] 初稿结论与事实卡片一致
- [ ] 无遗漏重要维度
- [ ] 无过度推断
- [ ] 发现问题：${validation.issues || '无'}

---

`;

  await fs.writeFile(path.join(workDir, '05_验证记录.md'), content, 'utf-8');
  return path.join(workDir, '05_验证记录.md');
}

/**
 * Step 8: 最终报告（实用型）
 */
async function generatePracticalReport(topic, workDir) {
  const content = `# ${topic} 调研报告

**生成时间**: ${new Date().toISOString()}
**报告类型**: 🔵 实用/技术型

---

## 摘要

[一句话核心结论]

---

## 1. 概念对齐

### 1.1 [主题] 是什么

**定义**: [待补充]

**为什么存在**: [待补充]

### 1.2 参照物

[如果有对比对象，在此说明]

---

## 2. 工作机制

[核心机制说明]

---

## 3. 联系（共同点）

1. **[共同点1]**: [说明]
2. **[共同点2]**: [说明]

---

## 4. 区别（核心差异）

### 4.1 [维度1]

- **差异**: [说明]
- **影响**: [说明]

### 4.2 决定性差异总结

1. [差异1]
2. [差异2]
3. [差异3]

---

## 5. 用例演示

### 场景: [场景描述]

[具体用例说明]

---

## 6. 总结与建议

### 6.1 一句话总结

[可复述的总结]

### 6.2 适用场景

- [场景1]
- [场景2]

### 6.3 不适用场景

- [场景1]
- [场景2]

---

## 参考资料

### 一手资料 (L1/L2)

[待补充]

### 辅助资料 (L3/L4)

[待补充]

---

*本报告由 Deep Research Skill 生成*
`;

  await fs.writeFile(path.join(workDir, 'FINAL_调研报告.md'), content, 'utf-8');
  return path.join(workDir, 'FINAL_调研报告.md');
}

/**
 * Step 8: 最终报告（学术型）
 */
async function generateAcademicReport(topic, workDir) {
  const content = `# ${topic} 学术研究综述

**生成时间**: ${new Date().toISOString()}
**报告类型**: 🟚 学术研究型

---

## 摘要

[研究问题、核心发现、学术贡献]

---

## 1. 研究背景与问题

### 1.1 研究动机

[待补充]

### 1.2 核心研究问题

[待补充]

### 1.3 研究边界

[待补充]

---

## 2. 文献综述

### 2.1 核心概念与定义

[待补充]

### 2.2 理论框架

[待补充]

### 2.3 研究脉络

[待补充]

---

## 3. 主要观点与论证

### 3.1 主流观点

[待补充]

### 3.2 挑战观点

[待补充]

### 3.3 新兴观点

[待补充]

---

## 4. 学术争议与辩论

### 4.1 争议焦点一

[待补充]

### 4.2 整合评析

[待补充]

---

## 5. 研究方法与证据

### 5.1 主要研究方法

[待补充]

### 5.2 关键证据

[待补充]

### 5.3 证据可信度评估

[待补充]

---

## 6. 结论与展望

### 6.1 主要结论

[待补充]

### 6.2 理论贡献

[待补充]

### 6.3 未来研究方向

[待补充]

---

## 参考文献

[按学术规范格式列出]

---

## 附录：交叉验证报告

[整合 06_交叉验证.md 的核心内容]

---

*本报告由 Deep Research Skill 生成*
`;

  await fs.writeFile(path.join(workDir, 'FINAL_调研报告.md'), content, 'utf-8');
  return path.join(workDir, 'FINAL_调研报告.md');
}

/**
 * 主执行函数 - OpenClaw 入口
 */
async function execute(config, input) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // 解析输入
  const { tool, topic, researchType = 'concept', reportType = 'practical', boundary } = input;

  try {
    // 创建工作空间
    const workDir = await createWorkspace(topic, mergedConfig);

    switch (tool) {
      case 'start_research':
        await step0ProblemDecomposition(topic, researchType, boundary, workDir);
        return {
          success: true,
          message: `调研项目 "${topic}" 已创建`,
          workDir: workDir,
          files: ['00_问题拆解.md']
        };

      case 'save_fact':
        await step3FactCards(topic, [input], workDir);
        return {
          success: true,
          message: '事实卡片已保存',
          file: path.join(workDir, '02_事实卡片.md')
        };

      case 'generate_report':
        if (reportType === 'academic') {
          await generateAcademicReport(topic, workDir);
        } else {
          await generatePracticalReport(topic, workDir);
        }
        return {
          success: true,
          message: '最终报告已生成',
          file: path.join(workDir, 'FINAL_调研报告.md'),
          workDir: workDir
        };

      case 'deep_research':
      default:
        // 完整调研流程
        await step0ProblemDecomposition(topic, researchType, boundary, workDir);

        // 如果有资料来源
        if (input.sources && input.sources.length > 0) {
          await step2Sources(topic, input.sources, workDir);
        }

        // 如果有事实
        if (input.facts && input.facts.length > 0) {
          await step3FactCards(topic, input.facts, workDir);
        }

        // 如果有框架
        if (input.framework) {
          await step4ComparisonFramework(topic, input.framework, workDir);
        }

        // 生成最终报告
        if (researchType === 'academic') {
          await generateAcademicReport(topic, workDir);
        } else {
          await generatePracticalReport(topic, workDir);
        }

        return {
          success: true,
          message: `深度调研 "${topic}" 完成`,
          workDir: workDir,
          files: [
            '00_问题拆解.md',
            input.sources ? '01_资料来源.md' : null,
            input.facts ? '02_事实卡片.md' : null,
            input.framework ? '03_对比框架.md' : null,
            'FINAL_调研报告.md'
          ].filter(Boolean)
        };
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 格式化为 LLM 友好的文本
 */
function formatForLLM(result) {
  if (!result.success) {
    return `❌ 调研失败: ${result.error}`;
  }

  let text = `## 🔍 深度调研结果\n\n`;
  text += `**主题**: ${result.message}\n\n`;

  if (result.workDir) {
    text += `**工作目录**: \`${result.workDir}\`\n\n`;
  }

  if (result.files && result.files.length > 0) {
    text += `**生成的文件**:\n`;
    result.files.forEach(f => {
      text += `  - \`${f}\`\n`;
    });
    text += `\n`;
  }

  text += `---\n\n`;
  text += `**下一步**:\n`;
  text += `1. 收集资料 → 使用 \`save_fact\` 保存事实\n`;
  text += `2. 建立框架 → 分析对比维度\n`;
  text += `3. 完成推导 → 记录推导过程\n`;
  text += `4. 生成报告 → 使用 \`generate_report\`\n`;

  return text;
}

// 导出为 OpenClaw Skill
module.exports = {
  execute,
  formatForLLM,
  // 工具函数
  createWorkspace,
  step0ProblemDecomposition,
  step2Sources,
  step3FactCards,
  step4ComparisonFramework,
  generatePracticalReport,
  generateAcademicReport
};
