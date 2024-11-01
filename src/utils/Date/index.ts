type DatePattern = 'YYYY' | 'MM' | 'DD' | 'HH' | 'mm' | 'ss' | 'M' | 'D' | 'H' | 'm' | 's';
Object.defineProperty(Date.prototype, 'format', {
  writable: false,
  enumerable: false,
  value: function (pattern = '') {
    const year = this.getFullYear(),
      M = this.getMonth() + 1,
      D = this.getDate(),
      H = this.getHours(),
      m = this.getMinutes(),
      s = this.getSeconds();
    const data = {
      YYYY: year,
      MM: `${M}`.padStart(2, '0'),
      DD: `${D}`.padStart(2, '0'),
      HH: `${H}`.padStart(2, '0'),
      mm: `${m}`.padStart(2, '0'),
      ss: `${s}`.padStart(2, '0'),
      M,
      D,
      H,
      m,
      s,
    };
    if (!pattern) {
      pattern = 'YYYY-MM-DD HH:mm:ss';
    }
    for (const key in data) {
      pattern = pattern.replace(new RegExp(key), data[key as DatePattern] as string);
    }
    return pattern;
  },
});
