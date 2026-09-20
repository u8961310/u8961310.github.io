import snapshot from '../data/repos-snapshot.json';
import { FEATURED, type FeaturedEntry } from '../data/featured';

const USER = 'u8961310';
const API = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`;

/** 本站自己的 repo，不列進作品清單 */
const SELF = `${USER}.github.io`;

/** 這一年（含）之後有 push 的算「近期」，之前的收進「早期作品」 */
const RECENT_SINCE = 2025;

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
  fork: boolean;
  archived: boolean;
}

export interface FeaturedRepo extends FeaturedEntry {
  data: Repo;
}

function normalize(raw: any): Repo {
  return {
    name: String(raw.name ?? ''),
    description: raw.description ?? null,
    url: String(raw.url ?? raw.html_url ?? ''),
    language: raw.language ?? null,
    stars: Number(raw.stars ?? raw.stargazers_count ?? 0),
    pushedAt: String(raw.pushedAt ?? raw.pushed_at ?? ''),
    fork: Boolean(raw.fork),
    archived: Boolean(raw.archived),
  };
}

/**
 * build 時抓 GitHub API。
 *
 * 失敗一律回落到 committed 快照 —— GitHub API 未帶 token 時每 IP 每小時只有
 * 60 次，Actions runner 是共用 IP，很容易撞到。API 掛掉不該讓 build 死掉，
 * 網站顯示稍舊的清單遠比整個部署失敗好。
 */
export async function fetchRepos(): Promise<{ repos: Repo[]; source: 'api' | 'snapshot' }> {
  const token =
    typeof process !== 'undefined' ? process.env.GITHUB_TOKEN || process.env.GH_TOKEN : undefined;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': `${USER}-site-build`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(API, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) throw new Error('回應不是非空陣列');

    console.log(`[github] 取得 ${json.length} 個 repo${token ? '（已帶 token）' : '（未帶 token）'}`);
    return { repos: json.map(normalize), source: 'api' };
  } catch (err) {
    console.warn(
      `[github] API 取用失敗，改用 src/data/repos-snapshot.json：${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return { repos: (snapshot as any[]).map(normalize), source: 'snapshot' };
  }
}

export function groupRepos(repos: Repo[]) {
  // fork 不是自己的作品，本站 repo 也不列
  const own = repos.filter((r) => !r.fork && r.name !== SELF);

  const featuredNames = new Set(FEATURED.map((f) => f.repo));

  const featured: FeaturedRepo[] = FEATURED.map((entry) => {
    const data = own.find((r) => r.name === entry.repo);
    return data ? { ...entry, data } : null;
  }).filter((x): x is FeaturedRepo => x !== null);

  const rest = own
    .filter((r) => !featuredNames.has(r.name))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));

  const year = (iso: string) => Number(iso.slice(0, 4)) || 0;

  return {
    featured,
    recent: rest.filter((r) => year(r.pushedAt) >= RECENT_SINCE),
    early: rest.filter((r) => year(r.pushedAt) < RECENT_SINCE),
    counts: { own: own.length, forks: repos.length - own.length - 1 },
  };
}

/** 依 GitHub 官方語言色，找不到就用品牌色 */
export const LANG_COLOR: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Java: '#b07219',
  Astro: '#ff5a03',
};
