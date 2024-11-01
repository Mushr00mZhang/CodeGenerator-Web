declare interface Date {
  /**
   * 格式化日期
   * @param pattern 格式（YYYY-MM-DD HH:mm:ss）
   * @returns 格式化日期
   */
  format: (pattern?: string) => string;
}
