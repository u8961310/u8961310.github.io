# u8961310.github.io

蛋糕（Cake）的個人網站 —— 雙軌並重：**教學**（K12 資訊教育）／**技術**（工具開發）。

🔗 https://u8961310.github.io/

## 技術棧

| 項目 | 版本 |
|---|---|
| [Astro](https://astro.build/) | 7.x（靜態輸出） |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x（Vite plugin） |
| Node | >= 22.12 |
| 部署 | GitHub Actions + `withastro/action@v6` |

## 開發

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 輸出到 dist/
npm run preview  # 預覽 build 產物
```

## 部署

推到 `master` 會自動觸發 `.github/workflows/deploy.yml`，
另有每週一 04:00（台北時間）的排程重建。

GitHub Pages 的 Source 需設為 **GitHub Actions**（不是 Deploy from a branch）。

## ⚠️ base path

這是 **user site**（`<user>.github.io`），掛在網域根目錄，
所以 `astro.config.mjs` 的 `base` 必須是 `'/'`。

只有 project site（`<user>.github.io/<repo>/`）才需要寫 `'/<repo-name>/'`。
**寫錯時本機 dev 完全正常，只有部署後才會整站資源 404。**

## 目前進度

- [x] **P0** 骨架：Astro + Tailwind + 部署 workflow + 雙軌首頁
- [ ] **P1** 技術軌：GitHub API 抓 repo、精選策展、fork／舊作過濾
- [ ] **P2** 教學軌：教學理念、edtech-portfolio 導流、遊戲化成果
- [ ] **P3** 潤飾：OG image、深色模式微調、RSS

完整計畫見記憶庫 `project_personal_site_plan.md`（personal 層）。
