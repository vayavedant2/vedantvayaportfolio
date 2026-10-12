let ready = false;
let pending = false;
const listeners = new Set<() => void>();
const pendingListeners = new Set<(isPending: boolean) => void>();

export function isReady() {
  return ready;
}

export function isPending() {
  return pending;
}

export function resetReady() {
  ready = false;
  pending = true;
  pendingListeners.forEach((listener) => listener(true));
}

export function markReady() {
  if (ready) return;
  ready = true;
  pending = false;
  pendingListeners.forEach((listener) => listener(false));
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function onReady(listener: () => void) {
  if (ready) {
    listener();
    return () => {};
  }

  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function onPendingChange(listener: (isPending: boolean) => void) {
  pendingListeners.add(listener);
  return () => pendingListeners.delete(listener);
}
