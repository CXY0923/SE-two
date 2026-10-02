# 裁判文书法律论证结构标注系统（原型）

一个可运行的桌面 Web 前端原型，用于对司法裁判文书「裁判理由」部分进行**法律论证结构标注**：将裁判理由拆解为命题、建立命题之间的论证关系，并实时生成论证图示。

依据材料：

- 《裁判文书标记需求_按阶段组织》（`裁判文书标记需求_按阶段组织.docx`）
- 《v1.2 中文裁判文书说理部分法律论证结构标注与图示指南》（`v1.2 中文裁判文书说理部分法律论证结构标注与图示指南.pdf`）

> 当前为原型版本：不接真实后端、不做登录鉴权，任务 / 文档 / 标注版本 / 裁定 / 导出全部使用内置 Mock 数据（`src/domain/mockData.ts`）。

## 功能概览

覆盖四阶段主流程：**创建标注任务 → 独立标注 → 冲突裁定 → 结果输出**。

| 页面 | 功能 |
| --- | --- |
| 任务总览 | 表格展示任务、指南版本、阶段、标注/裁定进度，支持筛选进入详情 |
| 创建任务 | 四步向导：基本信息 → 导入文档（自动提取裁判理由范围，可人工修正）→ 标签体系 → 人员分配 |
| 任务详情 | 阶段进度条与不可逆提示、文档与分配情况、阶段操作入口 |
| 标注工作区 | 三栏联动：左栏原文拖选创建命题（自动编号、高亮）；中栏命题属性（字符索引、一级/二级标签）；右栏论证图示（支持 S/A/J/M/I 及嵌套关系、缩放、拖拽） |
| 裁定页 | 并列展示多名标注者的命题、边界、标签与关系，裁定者采用某版本或直接编辑，提交生成最终版本 |
| 结果输出 | 只读命题表、关系表与论证图；Mock 导出 JSON / Excel / PNG / JPG / SVG / ZIP 并记录下载历史 |

任务状态机（只能向前推进）：

```
草稿 → 标注中 → 待裁定 → 已裁定 → 已导出
```

## 标签体系

命题类型（一级标签）：`IS` 争议焦点、`Non` 非论证成分、`GM` 一般规范判断、`SM` 个别规范判断、`GF` 一般事实判断、`SF` 个别事实判断。

二级标签：GM 下含 `GM-L` 法律条文、`GM-I` 法律解释、`GM-C` 合同及合同解释、`GM-U` 习惯与行业惯例、`GM-M` 道德与价值观念、`GM-O` 其他规范判断；SM 下含 `SM-C`。

关系类型：`S` 支持（●）、`A` 反对（○，可反对命题或关系）、`J` 组合（+，缺一不可）、`M` 匹配（+，个别判断 ↔ 一般判断）、`I` 同一（/）。支持关系嵌套，如 `S(M(J(P1,P2),P3),P4)`。

关键校验规则（`src/domain/validation.ts`）：

- 命题使用半开区间字符索引 `[start, end)`，按原文起始位置从 1 起编号；
- 提交前必须完成一级标签，GM / SM 还必须完成二级标签；
- `J`、`I` 至少两个参与对象；`M` 必须连接个别判断与一般判断；
- 提交后版本锁定，裁定后最终版本只读。

## 技术栈

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) 构建，[Vitest](https://vitest.dev/) + Testing Library 测试（jsdom 环境）
- [lucide-react](https://lucide.dev/) 图标；图示与样式为手写实现（`src/components/ArgumentGraph.tsx` + `src/styles.css`）

## 快速开始

```bash
npm install    # 安装依赖
npm run dev    # 启动开发服务器（默认 http://localhost:5173）
npm run build  # 类型检查 + 生产构建
npm test       # 运行 Vitest 测试
```

内置示例任务「劳务合同纠纷论证结构试标」已处于待裁定阶段，包含一份文书、两名标注者的独立版本（含标签差异）和一个含嵌套关系的已裁定版本，可直接体验裁定与导出流程。

## 项目结构

```
docs/                          设计文档
  legal-argumentation-use-case-model.md   用例模型（用例图 + UC-01~03）
  superpowers/specs/...design.md          原型开发 Spec（页面、规则、验收标准）
  superpowers/plans/...plan.md            实施计划
src/
  domain/                       领域层（与 UI 解耦）
    types.ts                    实体类型：Task / Document / AnnotationVersion / Proposition / Relation / Adjudication / ExportRecord
    labels.ts                   标签与关系体系定义
    validation.ts               命题与关系校验规则
    store.ts                    useReducer 状态管理（阶段推进、命题/关系增改、提交版本、导出记录）
    exporters.ts                Mock 导出序列化
    mockData.ts                 内置示例任务与标注数据
  components/                   页面组件（AppShell / TaskOverview / CreateTaskWizard /
                                TaskDetail / AnnotationWorkspace / AdjudicationView /
                                ExportView 等）及对应测试
  App.tsx                       视图切换入口
```

## 非目标（当前版本）

真实登录鉴权与权限持久化、真实 PDF/Word 解析与裁判理由自动抽取、真实文件上传下载、真实 Excel/图片生成、一致性指标计算与自动差异定位、教师/学生教学模式。

## 文档

- [用例模型](docs/legal-argumentation-use-case-model.md)
- [原型开发 Spec](docs/superpowers/specs/2026-09-30-judgment-argumentation-prototype-design.md)
- [实施计划](docs/superpowers/plans/2026-09-30-judgment-argumentation-prototype.md)
