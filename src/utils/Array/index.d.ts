declare interface Array<T> {
  /**
   * 删除数组中的子项
   * @param items 子项
   * @returns 原数组
   */
  remove(...items: Array<T>): this;
}
