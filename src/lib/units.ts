import snapshot from '../data/units-snapshot.json';

/**
 * 教材單元清單的來源是姊妹站 edtech-portfolio 的首頁。
 *
 * 為什麼用「抓 HTML 再解析」而不是手動維護一份清單：
 * 手動清單一定會跟不上——他在那邊新增單元時不會記得回來改這裡。
 * 解析 HTML 確實脆弱（對方改版型就會壞），所以配一份 committed 快照，
 * 解析失敗或結果不合理時自動回落，網站顯示稍舊的清單而不是整個 build 掛掉。
 *
 * 長期更穩的做法是請 edtech-portfolio 自己輸出 units.json manifest，
 * 那是跨 repo 改動，要另外提案。
 */
const SRC = 'https://raw.githubusercontent.com/u8961310/edtech-portfolio/main/index.html';
const SITE = 'https://u8961310.github.io/edtech-portfolio';

export interface Unit {
  slug: string;
  grade: string;
  gradeClass: string;
  title: string;
  desc: string;
  skill: string;
  cover: string;
  color: string;
}

const SECTION_RE = /<section class="grade-section (\w+)">([\s\S]*?)<\/section>/g;
const CARD_RE =
  /<a href="\.\/units\/([^/"]+)\/index\.html" class="card"[^>]*?style="--c:\s*([^;"]+);?"[^>]*>([\s\S]*?)<\/a>/g;
const TAG_RE = /<span class="skill-tag">([^<]*)<\/span>/;
const COVER_RE = /<div class="card-cover">([^<]*)<\/div>/;
const TITLE_RE = /<h3 class="card-title">([^<]*)<\/h3>/;
const DESC_RE = /<p class="card-desc">([^<]*)<\/p>/;
const H2_RE = /<h2>([^<]*)<\/h2>/;

function parseUnits(html: string): Unit[] {
  const units: Unit[] = [];

  for (const [, gradeClass, body] of html.matchAll(SECTION_RE)) {
    const h2 = H2_RE.exec(body);
    // h2 形如「🎒 一年級的遊戲」，只留中文再去掉「的遊戲」
    const grade = h2
      ? h2[1].replace(/[^\u4e00-\u9fff]/g, '').replace('的遊戲', '') || '未分類'
      : '未分類';

    for (const [, slug, color, inner] of body.matchAll(CARD_RE)) {
      const pick = (rx: RegExp) => rx.exec(inner)?.[1]?.trim() ?? '';
      units.push({
        slug,
        grade,
        gradeClass,
        title: pick(TITLE_RE),
        desc: pick(DESC_RE),
        skill: pick(TAG_RE),
        cover: pick(COVER_RE),
        color: color.trim(),
      });
    }
  }

  return units.sort(
    (a, b) => Number(a.slug.match(/^unit(\d+)/)?.[1] ?? 0) - Number(b.slug.match(/^unit(\d+)/)?.[1] ?? 0)
  );
}

/**
 * 防呆：解析結果要「像樣」才採用。
 * 對方改版型時 regex 會靜靜地抓到 0 筆或抓到殘缺資料，
 * 頁面會變成空的而沒有任何人發現——所以這裡直接判失敗、走快照。
 */
function assertUsable(units: Unit[]) {
  if (units.length < 5) throw new Error(`只解析到 ${units.length} 個單元，版型可能已改`);
  const noTitle = units.filter((u) => !u.title);
  if (noTitle.length > 0) {
    throw new Error(`${noTitle.length} 個單元沒抓到標題，第一筆：${noTitle[0].slug}`);
  }
}

export async function fetchUnits(): Promise<{ units: Unit[]; source: 'live' | 'snapshot' }> {
  try {
    const res = await fetch(SRC);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const units = parseUnits(await res.text());
    assertUsable(units);

    console.log(`[units] 從 edtech-portfolio 解析到 ${units.length} 個單元`);
    return { units, source: 'live' };
  } catch (err) {
    console.warn(
      `[units] 解析失敗，改用 src/data/units-snapshot.json：${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return { units: snapshot as Unit[], source: 'snapshot' };
  }
}

export const unitUrl = (slug: string) => `${SITE}/units/${slug}/index.html`;
export const portfolioUrl = `${SITE}/`;

/** 依年級分組，維持 index.html 上的出現順序（一年級在前、中年級在後） */
export function groupByGrade(units: Unit[]) {
  const order: string[] = [];
  const map = new Map<string, Unit[]>();

  for (const u of units) {
    if (!map.has(u.grade)) {
      map.set(u.grade, []);
      order.push(u.grade);
    }
    map.get(u.grade)!.push(u);
  }

  // 一年級固定排前面（解析順序已是如此，這裡只是保險）
  order.sort((a, b) => (a === '一年級' ? -1 : b === '一年級' ? 1 : 0));

  return order.map((grade) => ({ grade, units: map.get(grade)! }));
}
