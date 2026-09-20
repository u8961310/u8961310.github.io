// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://u8961310.github.io',

  // ⚠️ user site（<user>.github.io）掛在網域根目錄，base 必須是 '/'。
  // 只有 project site（<user>.github.io/<repo>/）才需要寫成 '/<repo-name>/'。
  // 寫錯時本機 dev 完全正常，只有部署後才會整站資源 404。
  base: '/',

  vite: {
    plugins: [tailwindcss()],
  },
});