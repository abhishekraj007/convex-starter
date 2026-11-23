export const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60;
export const MAX_SIGNED_URL_TTL_SECONDS = 7 * 24 * 60 * 60;

export function clampSignedUrlTtl(
  expiresInSeconds: number = DEFAULT_SIGNED_URL_TTL_SECONDS,
): number {
  if (!Number.isFinite(expiresInSeconds)) {
    return DEFAULT_SIGNED_URL_TTL_SECONDS;
  }
  return Math.min(
    Math.max(1, Math.floor(expiresInSeconds)),
    MAX_SIGNED_URL_TTL_SECONDS,
  );
}

export async function getSignedStorageUrl(
  getUrl: (key: string, options: { expiresIn: number }) => Promise<string>,
  key: string,
  expiresInSeconds: number = DEFAULT_SIGNED_URL_TTL_SECONDS,
): Promise<{ url: string; expiresInSeconds: number }> {
  const expiresIn = clampSignedUrlTtl(expiresInSeconds);
  const url = await getUrl(key, { expiresIn });
  return { url, expiresInSeconds: expiresIn };
}
