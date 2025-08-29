// src/lib/likes.ts
// Public like counter via countapi.xyz + per-device guard via localStorage

const NAMESPACE =
  (import.meta.env.VITE_COUNTAPI_NS as string) || "vybcinema";
const BASE = "https://api.countapi.xyz";

const keyFor = (contentId: string) => encodeURIComponent(contentId);
const lsKey = (contentId: string) => `liked:${contentId}`;

async function ensureCounter(contentId: string) {
  const key = keyFor(contentId);
  // If counter doesn’t exist, set it to 0 (ignore errors)
  await fetch(`${BASE}/create?namespace=${NAMESPACE}&key=${key}&value=0`).catch(
    () => {}
  );
}

export async function getLikeCount(contentId: string): Promise<number> {
  const key = keyFor(contentId);
  const res = await fetch(`${BASE}/get/${NAMESPACE}/${key}`);
  if (res.ok) {
    const data = await res.json();
    return typeof data.value === "number" ? data.value : 0;
  }
  await ensureCounter(contentId);
  return 0;
}

export function isLikedLocal(contentId: string): boolean {
  return localStorage.getItem(lsKey(contentId)) === "1";
}

export function setLikedLocal(contentId: string, liked: boolean) {
  if (liked) localStorage.setItem(lsKey(contentId), "1");
  else localStorage.removeItem(lsKey(contentId));
}

export async function likeOnce(contentId: string): Promise<number> {
  if (isLikedLocal(contentId)) return getLikeCount(contentId);
  const key = keyFor(contentId);
  const res = await fetch(`${BASE}/update/${NAMESPACE}/${key}?amount=1`);
  if (!res.ok) {
    await ensureCounter(contentId);
    const res2 = await fetch(`${BASE}/update/${NAMESPACE}/${key}?amount=1`);
    if (!res2.ok) throw new Error("Could not increase like counter");
    const data2 = await res2.json();
    setLikedLocal(contentId, true);
    return data2.value ?? 0;
  }
  const data = await res.json();
  setLikedLocal(contentId, true);
  return data.value ?? 0;
}

export async function unlikeOnce(contentId: string): Promise<number> {
  if (!isLikedLocal(contentId)) return getLikeCount(contentId);
  const key = keyFor(contentId);
  const res = await fetch(`${BASE}/update/${NAMESPACE}/${key}?amount=-1`);
  if (!res.ok) throw new Error("Could not decrease like counter");
  const data = await res.json();
  setLikedLocal(contentId, false);
  return data.value ?? 0;
}
