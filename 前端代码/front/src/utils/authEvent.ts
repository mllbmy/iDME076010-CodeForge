type AuthEventCallback = () => void;

const listeners = new Set<AuthEventCallback>();

export function onUnauthorized(callback: AuthEventCallback): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function emitUnauthorized(): void {
  listeners.forEach((cb) => cb());
}
