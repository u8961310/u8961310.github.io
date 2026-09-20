/**
 * 精選專案：手動策展。
 *
 * 為什麼不直接吃 GitHub 的 description —— 27 個 repo 裡有 18 個沒寫描述，
 * 有寫的也未必是現況（例如 edtech-portfolio 上面還寫「6 個遊戲」，實際已 21 個）。
 * 這裡的 blurb 會蓋掉 GitHub description。
 *
 * 要新增精選：在陣列加一筆，repo 填 GitHub 上的 repo 名稱即可；
 * 抓不到該 repo（改名或轉私有）時會自動略過，不會讓 build 失敗。
 */
export interface FeaturedEntry {
  repo: string;
  /** 顯示用標題，省略則用 repo 名稱 */
  title?: string;
  /** 一句話說明這東西解決什麼問題 */
  blurb: string;
  /** 額外連結（線上 demo、說明頁） */
  liveUrl?: string;
  liveLabel?: string;
}

export const FEATURED: FeaturedEntry[] = [
  {
    repo: 'edtech-portfolio',
    title: 'K12 資訊教學作品集',
    blurb:
      '21 個互動教材遊戲，涵蓋滑鼠、鍵盤、打字、像素藝術與運算思維。純靜態零依賴，教室電腦打開就能上課。',
    liveUrl: 'https://u8961310.github.io/edtech-portfolio/',
    liveLabel: '線上試玩',
  },
  {
    repo: 'pdf-toolbox',
    title: '離線 PDF 工具箱',
    blurb: '合併 PDF、Word 轉 PDF、PDF 轉 JPG。全程本機處理，檔案不外傳。',
  },
  {
    repo: 'gongwen-fetcher',
    title: '公文附件自動下載器',
    blurb:
      '國尊 Cyberhood 公文系統的 Electron 桌面 App，把一份份點開下載的例行工作變成一鍵完成。',
  },
  {
    repo: 'fb-video-archiver',
    title: 'FB 粉專影片批次備份',
    blurb:
      '指定時間區間把粉專影片整批下載到本機。bookmarklet 收清單 + 桌面程式下載，附非技術使用者說明書。',
  },
  {
    repo: 'book-craw',
    title: '博客來新書爬蟲',
    blurb: '定期抓博客來的最新書單，把要一頁頁翻的新書資訊整理成可直接瀏覽的清單。',
  },
  // TODO：以下幾個 repo 沒有描述，確認用途後可補進精選
  //   SAMS / school-crm / student-roster-converter / line-bot-calendar
];
