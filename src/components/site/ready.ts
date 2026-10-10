let ready = false;
const listeners = new Set<() => void>();

export function isReady() {
  return ready;
}

export function resetReady() {
  ready = false;
}

export function markReady() {
  if (ready) return;
  ready = true;
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
