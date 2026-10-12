export function readStoredValue(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { ok: true, value: fallback, kind: 'empty' };
    try {
      return { ok: true, value: JSON.parse(raw), kind: 'loaded' };
    } catch (error) {
      return { ok: false, value: fallback, kind: 'invalid-json', error };
    }
  } catch (error) {
    return { ok: false, value: fallback, kind: 'read-error', error };
  }
}

export function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
