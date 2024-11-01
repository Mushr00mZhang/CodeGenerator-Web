export namespace DB {
  /** 基础属性 */
  export interface IModel<T> {
    /** ID */
    id: T;
    /** 是否归档 */
    archiveFlag: number;
    /** 是否删除 */
    deleteFlag: number;
    /** 创建人 */
    createBy?: string;
    /** 创建时间 */
    createTime?: string;
    /** 维护人 */
    modifyBy?: string;
    /** 维护时间 */
    modifyTime?: string;
  }
  /** 分页Dto */
  export interface IPagedListDto {
    /** 分页大小 */
    size: number;
    /** 分页索引 */
    index: number;
  }
  /** 创建Dto */
  export interface ICreateDto {
    /** 创建人 */
    createBy: string;
  }
  /** 更新Dto */
  export interface IUpdateDto<T> {
    /** ID */
    id: T;
    /** 维护人 */
    modifyBy: string;
  }
  /** 删除Dto */
  export interface IDeleteDto<T> {
    /** ID */
    id: T;
    /** 维护人 */
    modifyBy: string;
  }
  /** 自定义字段 */
  export interface IFields {
    /** 自定义字段1 */
    field_1?: number;
    /** 自定义字段2 */
    field_2?: number;
    /** 自定义字段3 */
    field_3?: string;
    /** 自定义字段4 */
    field_4?: string;
    /** 自定义字段5 */
    field_5?: string;
    /** 自定义字段6 */
    field_6?: string;
  }
}
