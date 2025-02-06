export class EventEmitter<T = any> {
  private handlers: ((e: T) => void)[] = [];

  on(handler: (e: T) => void): void {
    this.handlers.push(handler);
  }

  off(handler: (e: T) => void): void {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  emit(e: T): void {
    for (const handler of this.handlers) {
      handler(e);
    }
  }
}