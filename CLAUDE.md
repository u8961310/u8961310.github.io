# u8961310.github.io — 個人網站

Astro 靜態網站，部署到 GitHub Pages（user site）。

## 技術棧

- **Astro 7.x** 靜態輸出（無 adapter、無 SSR）
- **Tailwind CSS 4.x** 走 `@tailwindcss/vite` plugin（不是舊的 `@astrojs/tailwind` integration）
- Node >= 22.12
- 字型 Noto Sans TC，與 `edtech-portfolio` 一致

## 分支與部署

- **主分支是 `master`**（不是 `main`）—— workflow 的 `on.push.branches` 要對應
- `.github/workflows/deploy.yml` → `withastro/action@v6` + `actions/deploy-pages@v5`
- GitHub Pages Source 設為 **GitHub Actions**

## ⚠️ base path 陷阱

`astro.config.mjs` 的 `base` 必須維持 `'/'`。

這是 user site（`u8961310.github.io`），掛在網域根目錄。
只有 project site 才需要 `'/<repo-name>/'`。
**寫錯時本機 dev 完全正常，只有部署後才整站 404** —— 改這個設定前想清楚。

## CSS 順序

`src/styles/global.css` 裡 `@import url(...)`（Google Fonts）**必須排在 `@import 'tailwindcss'` 之前**。
順序顛倒會觸發 CSS optimizer 警告，字型可能不生效。

## 結構

```
src/
├── layouts/Layout.astro    共用外框（含 nav / footer）
├── pages/
│   ├── index.astro         首頁：雙軌入口
│   ├── teaching.astro      教學軌（P2 建置中）
│   └── dev.astro           技術軌（P1 建置中）
└── styles/global.css       Tailwind + 字型 + 主題 token
```

主題色 token 定義在 `global.css` 的 `@theme`：
`--color-teach-*`（教學軌）、`--color-dev-*`（技術軌）。

## 相關

- 姊妹站 `edtech-portfolio`（純 vanilla，零 build）—— 教學軌會導流過去，**不要把兩邊技術棧混在一起**
- 完整計畫見記憶庫 `project_personal_site_plan.md`（personal 層）
