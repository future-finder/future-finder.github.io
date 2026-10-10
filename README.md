# Hongyuan Zhang · 个人学术网站

网站正式源码为 `src/`，沿用 Astro 7、TypeScript、Markdown / MDX、Pagefind 和 KaTeX。所有页面由源码构建；不要手改 `dist/` 或 `site-preview/`。

## 运行与验证

需要 Node.js 24（或满足现有依赖要求的版本）。

```bash
npm ci
npm run dev
npm run build
npm run preview -- --host 127.0.0.1 --port 4390
```

`npm run build` 执行 Astro 类型检查、静态构建、Pagefind 全文索引和全部内部链接验证。

另开终端运行真实浏览器验收：

```bash
npx playwright install chromium
npm run test:ui
```

测试默认访问 `http://127.0.0.1:4390`；可用 `PREVIEW_URL` 更改。截图和结果保存在 `artifacts/visual-review/`，覆盖 1440、768 和 390px，以及搜索、主题、移动导航、目录、复制代码、项目筛选与旧链接跳转。

## 内容维护

- `src/data/profile.ts`：姓名、身份、简介；`avatar` 仅填写真实个人肖像路径。
- `src/data/social.ts`：Email、GitHub、CV 等有效链接。
- `src/data/news.ts`：有日期依据的真实进展。
- `src/data/research.ts`、`timeline.ts`：研究兴趣、教育与研究经历。
- `src/content/research/`：研究报告与论文阅读。`status` 区分 `reproduction` 和 `reading`。
- `src/content/projects/`：个人项目；设置 `type`、`status`、`featured`、`shortTitle` 和 `visual`。
- `src/content/notes/`：课程与学习笔记。日期不明时使用 `dateLabel`，不要编造精确日期。
- `src/content/blog/`：保留 Markdown / MDX 文章集合与原有写作路由，当前没有正式公开文章。
- `public/CV.md`：由既有真实 CV 整理的可下载版本，未发布电话。

研究示例：

```yaml
---
title: 实验报告标题
description: 报告摘要
tags: [RAG, Evaluation]
kind: 研究实践
dateLabel: 实验于 2026 年 8 月
status: reproduction
---
```

新增文件后，列表、详情页、目录、标签和 RSS 自动更新；构建时更新全文索引。已有研究 URL `/research/lettucedetect/`、`/research/ragtruth/`、`/research/rlseek/` 和笔记 URL 均保留，`/projects/lettuce-detect/` 跳转至完整实验报告。

## 设计系统

- `src/styles/tokens.css`：浅深色语义色、字体、间距、圆角、阴影、容器与阅读宽度。
- `src/styles/global.css`：全站排版、首页布局、卡片、学术列表、正文与响应式。
- 英文标题为本地托管 Source Serif 4，正文为 IBM Plex Sans，代码为 JetBrains Mono；中文使用系统高质量字体回退。
- 主要响应步骤为 540、767、1000px；导航在 700px 以下折叠。原生 CSS 的 media query 不支持使用 CSS 变量作为断点。
- `public/visuals/`：原创山景占位、真实实验 F1 图表、项目功能示意及手机专用版本。未冒用人物照片，项目图不是软件截图。
- 支持浅深主题、键盘焦点和 `prefers-reduced-motion`。

## GitHub Pages

正式仓库为 `future-finder/future-finder.github.io`。当前沿用 GitHub Pages 的 `main` 分支根目录静态发布方式：`main` 保存 `npm run build` 生成的页面，源码保存于 `codex/academic-site-source` 分支。后续开发应检出源码分支，在源码中修改、验证并构建，再把 `dist/` 同步到 `main`；不要直接维护构建后的 HTML。

默认 `SITE_URL=https://future-finder.github.io`、`BASE_PATH=/`。源码分支中的 `.github/workflows/deploy.yml` 可供未来切换到 GitHub Actions 发布时使用；当前不依赖该工作流，也不修改 Pages 设置。

本机原 Git 根目录是 `D:/`。本次发布使用 `artifacts/deploy-repo/` 独立克隆，避免带入整盘其他项目文件。原 remote 的拼写不同，但已确认两个地址返回同一提交，正式发布使用规范仓库名。

七篇既有报告与笔记已完整纳入 `src/content`，正常构建不再读取桌面文件。

## 内容依据与素材待补

内容依据：原站七篇 Markdown、旧生成脚本中的公开内容修订、本人既有 `zhang CV.md`，以及本次明确给出的身份、项目和实验指标。奖项无明确年份，不补造日期。

待补充：真实个人肖像、ELOVERIS 实际截图与公开安装 / 代码链接、NovelST 实际截图与公开仓库；CV 如需 PDF，可另提供正式版。复现实验原始日志未包含在网站目录中，网站改版没有重新训练模型。

完整截图、参考图差异、修改组件与验收结论见 `artifacts/visual-review/REVIEW.md`。搜索交互源文件为 `public/search.js`。
