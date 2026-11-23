/**
 * R2 object keys for user uploads are always `<userId>/<objectId>`.
 * Keeping the ownership rule in one pure module makes it obvious which
 * functions are allowed to touch a key and easy to test.
 */

const MAX_KEY_LENGTH = 512;

export function buildUserUploadKey(userId: string, objectId: string): string {
  if (!userId || userId.includes("/")) {
    throw new Error("Invalid user id for storage key");
  }
  if (!objectId || objectId.includes("/")) {
    throw new Error("Invalid object id for storage key");
  }
  return `${userId}/${objectId}`;
}

export function isUserScopedStorageKey(key: string, userId: string): boolean {
  if (!key || !userId || key.length > MAX_KEY_LENGTH) {
    return false;
  }
  const separator = key.indexOf("/");
  if (separator <= 0 || separator === key.length - 1) {
    return false;
  }
  return key.slice(0, separator) === userId;
}

export function assertUserScopedStorageKey(key: string, userId: string): void {
  if (!isUserScopedStorageKey(key, userId)) {
    throw new Error("Not authorized for this storage key");
  }
}
