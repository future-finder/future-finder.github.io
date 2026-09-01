# Hongyuan Zhang — Research Workbench

一个以内容为中心、长期维护的个人研究网站，使用 Astro、TypeScript、Tailwind CSS、MDX 和 Pagefind 构建。

## 本地启动

需要 Node.js 22.12 或更高版本。

```bash
npm install
npm run dev
```

开发环境会显示标记为 `draft: true` 的演示文章。生产构建会自动隐藏这些草稿。

## 构建与预览

```bash
npm run check
npm run build
npm run preview
```

`npm run build` 会依次运行 Astro 类型检查、静态构建和 Pagefind 全文索引。

## 修改个人资料

- 基本身份与 Hero 文案：`src/data/profile.ts`
- 当前关注：`src/data/current.ts`
- 研究兴趣：`src/data/research.ts`
- 时间线：`src/data/timeline.ts`
- 社交链接：`src/data/social.ts`，空字符串会自动隐藏
- SEO 与正式域名：`src/data/site.ts` 和环境变量 `SITE_URL`

没有头像时网站使用 H/Z Monogram。未来可设置 `profile.avatar` 并添加真实图片。

## 写新文章

在 `src/content/blog/` 创建 Markdown 或 MDX 文件：

```yaml
---
title: 文章标题
date: 2026-09-01
updated: 2026-09-02
description: 简短摘要
tags: [LLM, Research]
category: Research
draft: true
locale: zh
---
```

确认内容可以公开后，将 `draft` 改为 `false`。阅读时间、标签页、归档、RSS 和全文搜索都会自动更新。

## 添加研究笔记

在 `src/content/notes/` 添加文件，除通用字段外设置：

```yaml
status: seed # seed | growing | evergreen
```

## 添加项目

在 `src/content/projects/` 添加文件：

```yaml
---
title: Project Name
type: Research Reproduction
year: 2026
status: reproduction
description: 已确认的一句话说明
tags: [LLM, RAG]
featured: true
locale: en
---
```

可选的 `links.code`、`links.paper` 和 `links.notes` 只有在填写有效 URL 后才会展示。不要为占位内容填写虚假链接。

## 部署

复制 `.env.example` 并在部署平台设置：

```bash
SITE_URL=https://你的正式域名
BASE_PATH=/
```

- Vercel：构建命令 `npm run build`，输出目录 `dist`
- Cloudflare Pages：构建命令 `npm run build`，输出目录 `dist`
- GitHub Pages：将 `BASE_PATH` 设置为仓库子路径，如 `/repository-name`

未配置 `SITE_URL` 时不会生成 Sitemap，Canonical 与页面中的 RSS 入口会被省略；`rss.xml` 返回说明文本，从而避免输出虚假正式域名。部署前配置正式域名后，RSS 会自动启用。

## 仍需补充的真实资料

- 正式域名
- Email、GitHub 与其他社交链接
- 真实头像（可选）
- NovelST 的确认资料
- LettuceDetect 的实验设置、结果和可公开链接
- 经确认的教育与研究时间线日期
- 经过本人确认、可以正式公开的文章
