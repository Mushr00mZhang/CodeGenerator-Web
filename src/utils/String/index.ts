Object.defineProperty(String.prototype, 'firstLetterToUpperCase', {
  writable: false,
  enumerable: false,
  value: function (): string {
    if (!this) return this;
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
});
