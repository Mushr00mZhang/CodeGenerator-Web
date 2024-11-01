declare global {
  namespace globalThis {
    /**
     * 判断数据是否为null或者undefined
     * @param source 数据
     */
    function isNullOrUndefined(source: any): boolean;
    /**
     * 判断数据是否为null或者undefined
     *
     * 是，返回默认值
     *
     * 否，返回原数据
     * @param source 数据
     * @param def 默认值
     */
    function getDataWithDefault<T>(source: T, def: T): T;
  }
}
export {};
