// src/utils/likes.ts
// Pure localStorage likes — no network, no Supabase.

const COUNT_KEY = (id: string) => `vyb:likes:count:${id}`;
const MINE_KEY  = (id: string) => `vyb:likes:mine:${id}`;

const readCount = (id: string): number =>
  Math.max(0, Number(localStorage.getItem(COUNT_KEY(id)) ?? 0));

const writeCount = (id: string, n: number) =>
  localStorage.setItem(COUNT_KEY(id), String(Math.max(0, n)));

export async function getLikeCount(id: string): Promise<number> {
  return readCount(id);
}

export function isLikedLocal(id: string): boolean {
  return localStorage.getItem(MINE_KEY(id)) === "1";
}

export async function likeOnce(id: string): Promise<number> {
  if (isLikedLocal(id)) return readCount(id);
  const n = readCount(id) + 1;
  writeCount(id, n);
  localStorage.setItem(MINE_KEY(id), "1");
  return n;
}

export async function unlikeOnce(id: string): Promise<number> {
  if (!isLikedLocal(id)) return readCount(id);
  const n = Math.max(0, readCount(id) - 1);
  writeCount(id, n);
  localStorage.removeItem(MINE_KEY(id));
  return n;
}
