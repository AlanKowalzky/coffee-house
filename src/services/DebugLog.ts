export function apiLog(...args: unknown[]): void {
  // Simple wrapper to centralize logging. All logs go to the browser console (F12).
  // Keeping this wrapper makes it easy to re-enable on-page logs later if needed.
  try {
    console.log(...args);
  } catch {
    // best-effort fallback — be defensive about window.console
    try {
      const w = window as unknown;
      // fallback: narrow to any only here to access console safely
      (w as { console?: { log?: (...a: unknown[]) => void } })?.console?.log?.(...args);
    } catch {
      // swallow
    }
  }
}
