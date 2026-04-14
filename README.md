# 道德经 · 锤子便签风阅读站

一个基于 React + TypeScript + Vite 构建的《道德经》阅读网站：

- 移动端优先
- 锤子便签风格视觉
- GitBook 式左侧目录 / 抽屉切章
- 大字号原文 + 译文并排阅读（桌面端）
- 可直接发布到 GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 发布到 GitHub Pages

### 方案 1：手动发布（最简单）

把仓库推到 GitHub 后执行：

```bash
npm run deploy
```

这会把 `dist/` 发布到 `gh-pages` 分支。

### 方案 2：自动发布（推荐）

项目已内置 `.github/workflows/deploy.yml`。

1. 将仓库推送到 GitHub 的 `main` 分支
2. 在仓库设置里启用 GitHub Pages
3. 选择 `GitHub Actions` 作为部署来源
4. 以后每次 push 到 `main` 都会自动发布

## 内容来源

原文与译文整理自：

- https://daodejing.org/

当前项目收录 81 章内容，位于：

- `src/data/chapters.json`
