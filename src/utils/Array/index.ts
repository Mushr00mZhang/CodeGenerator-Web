Object.defineProperty(Array.prototype, 'remove', {
  writable: false,
  enumerable: false,
  value: function <T>(...items: Array<T>) {
    const removed: T[] = [];
    for (const item of items) {
      const index = this.indexOf(item);
      if (index !== -1) {
        removed.push(...this.splice(index, 1));
      }
    }
    return this;
  },
});
