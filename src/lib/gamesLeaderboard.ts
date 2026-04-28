export type LeaderboardEntry = {
  name: string;
  score: number;
  detail?: string;
  date: number;
};

export type GameMeta = {
  id: string;
  title: string;
  emoji: string;
  unit: string;
  higherIsBetter: boolean;
};

export const GAME_METAS: Record<string, GameMeta> = {
  trivia:   { id: "trivia",   title: "ثقافة كشفية",        emoji: "🧠", unit: "نقطة",  higherIsBetter: true  },
  memory:   { id: "memory",   title: "الذاكرة الكشفية",    emoji: "🃏", unit: "محاولة", higherIsBetter: false },
  word:     { id: "word",     title: "حروف مبعثرة",        emoji: "🧩", unit: "نقطة",  higherIsBetter: true  },
  numguess: { id: "numguess", title: "خمّن الرقم",          emoji: "🎯", unit: "محاولة", higherIsBetter: false },
  color:    { id: "color",    title: "تسلسل الألوان",      emoji: "🎨", unit: "جولة",  higherIsBetter: true  },
};

const STORAGE_KEY = "cheetahs_games_leaderboard";
const NAME_KEY = "cheetahs_games_player_name";
const MAX_PER_GAME = 10;

type Store = Record<string, LeaderboardEntry[]>;

function read(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function recordScore(
  gameId: string,
  name: string,
  score: number,
  detail?: string,
): LeaderboardEntry {
  const meta = GAME_METAS[gameId];
  const entry: LeaderboardEntry = {
    name: name.trim().slice(0, 20) || "لاعب",
    score,
    detail,
    date: Date.now(),
  };
  const store = read();
  const list = store[gameId] ?? [];
  list.push(entry);
  list.sort((a, b) => (meta?.higherIsBetter ? b.score - a.score : a.score - b.score));
  store[gameId] = list.slice(0, MAX_PER_GAME);
  write(store);
  try { localStorage.setItem(NAME_KEY, entry.name); } catch {}
  return entry;
}

export function getLeaderboard(gameId: string): LeaderboardEntry[] {
  return read()[gameId] ?? [];
}

export function getAllLeaderboards(): Store {
  return read();
}

export function getSavedName(): string {
  try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; }
}

export function clearLeaderboard(gameId?: string) {
  const store = read();
  if (gameId) {
    delete store[gameId];
  } else {
    Object.keys(store).forEach(k => delete store[k]);
  }
  write(store);
}

export function getRank(gameId: string, score: number): number {
  const meta = GAME_METAS[gameId];
  const list = getLeaderboard(gameId);
  const better = list.filter(e =>
    meta?.higherIsBetter ? e.score > score : e.score < score
  ).length;
  return better + 1;
}
