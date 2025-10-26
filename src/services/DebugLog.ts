export function apiLog(...args: any[]) {
  // Simple wrapper to centralize logging. All logs go to the browser console (F12).
  // Keeping this wrapper makes it easy to re-enable on-page logs later if needed.
  try {
    console.log(...args);
  } catch (e) {
    // best-effort fallback
    try { (window as any).console && (window as any).console.log && (window as any).console.log(...args); } catch (_) {}
  }
}
