# 道德经 · 锤子便签风阅读站

一个基于 React + TypeScript + Vite 构建的《道德经》阅读网站：

- 移动端优先
- 锤子便签风格视觉
- GitBook 式左侧目录 / 抽屉切章
- 大字号原文 + 译文并排阅读（桌面端）
- 可直接发布到 GitHub Pages

## 在线访问

已部署地址：

- https://zhaoolee.com/daodejing

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

推荐使用 GitHub Actions 自动发布，项目已内置：

- `.github/workflows/deploy.yml`
- 线上地址：https://zhaoolee.com/daodejing

仓库推送到 `main` 后会自动触发部署。

如果你想手动发布，也可以执行：

```bash
npm run deploy
```

手动发布会把 `dist/` 发布到 `gh-pages` 分支。

## 内容来源

原文与译文整理自：

- https://daodejing.org/

当前项目收录 81 章内容，位于：

- `src/data/chapters.json`
