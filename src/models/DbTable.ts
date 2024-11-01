import axios from 'axios';

type Optional<T, U extends keyof T> = {
  [P in U]+?: T[P];
} & Omit<T, U>;
export class DbTableColumnType {
  /** 名称 */
  name: string;
  /** 小数位数 */
  scale: boolean;
  /** 长度 */
  size: boolean;
  /** C#类型 */
  csType: string;
  /** 是否主键字段 */
  isPrimary: boolean;
  constructor(source: Optional<DbTableColumnType, 'scale' | 'size' | 'isPrimary'>) {
    this.name = source.name;
    this.scale = source.scale ?? false;
    this.size = source.size ?? false;
    this.csType = source.csType;
    this.isPrimary = source.isPrimary ?? false;
  }
  toString() {
    return this.name;
  }
}
export type DbTableColumnSource = Optional<
  Omit<
    DbTableColumn,
    | 'isDefaultProp'
    | 'isPrimaryName'
    | 'isRequiredName'
    | 'isUniqueName'
    | 'isGetPropName'
    | 'isListPropName'
    | 'isFullyMatchName'
    | 'isCreatePropName'
    | 'isUpdatePropName'
    | 'isImportPropName'
  >,
  | 'name'
  | 'desc'
  | 'index'
  | 'type'
  | 'scale'
  | 'size'
  | 'isPrimary'
  | 'isRequired'
  | 'default'
  | 'isUnique'
  | 'isGetProp'
  | 'isListProp'
  | 'isFullyMatch'
  | 'isCreateProp'
  | 'isUpdateProp'
  | 'isImportProp'
  | 'sqlType'
>;
export class DbTableColumn {
  /** 名称 */
  name: string;
  /** 描述 */
  desc: string;
  /** 序号 */
  index: number;
  /** 类型 */
  type?: DbTableColumnType;
  /** 长度 */
  size?: number;
  /** 小数位数 */
  scale?: number;
  /** 是否主键 */
  isPrimary: boolean;
  /** 是否必填 */
  isRequired: boolean;
  /** 默认值 */
  default: string;
  /** 唯一 */
  isUnique: boolean;
  /** 是否搜索字段 */
  isListProp: boolean;
  /** 精确匹配 */
  isFullyMatch: boolean;
  /** 是否获取字段 */
  isGetProp: boolean;
  /** 是否创建字段 */
  isCreateProp: boolean;
  /** 是否更新字段 */
  isUpdateProp: boolean;
  /** 是否导入字段 */
  isImportProp: boolean;

  constructor(source: DbTableColumnSource) {
    this.name = source.name ?? '';
    this.desc = source.desc ?? '';
    this.index = source.index ?? 1;
    this.type = source.type;
    this.size = source.size;
    this.scale = source.scale;
    this.isPrimary = source.isPrimary ?? false;
    this.isRequired = source.isRequired ?? false;
    this.default = source.default ?? '';
    this.isUnique = source.isUnique ?? false;
    this.isListProp = source.isListProp ?? false;
    this.isFullyMatch = source.isFullyMatch ?? true;
    this.isGetProp = source.isGetProp ?? false;
    this.isCreateProp = source.isCreateProp ?? true;
    this.isUpdateProp = source.isUpdateProp ?? true;
    this.isImportProp = source.isImportProp ?? true;
  }
  get isDefaultProp() {
    return ['id', 'createby', 'createtime', 'modifyby', 'modifytime', 'deleteflag'].includes(
      this.name.toLowerCase()
    );
  }
  get sqlType() {
    if (!this.type) return '';
    let type = this.type.name;
    if (this.type.size) type += `(${this.size}`;
    if (this.type.scale) type += `, ${this.scale}`;
    if (this.type.size) type += `)`;
    return type;
  }
  get isPrimaryName() {
    return this.isPrimary ? '是' : '否';
  }
  get isRequiredName() {
    return this.isRequired ? '是' : '否';
  }
  get isUniqueName() {
    return this.isUnique ? '是' : '否';
  }
  get isListPropName() {
    return this.isListProp ? '是' : '否';
  }
  get isFullyMatchName() {
    return this.isFullyMatch ? '是' : '否';
  }
  get isGetPropName() {
    return this.isGetProp ? '是' : '否';
  }
  get isCreatePropName() {
    return this.isCreateProp ? '是' : '否';
  }
  get isUpdatePropName() {
    return this.isUpdateProp ? '是' : '否';
  }
  get isImportPropName() {
    return this.isImportProp ? '是' : '否';
  }
}
export type DbTableColumnFormRule = DbTableColumn;
const DbTableColumnTypeNvarchar = new DbTableColumnType({
  name: 'nvarchar',
  csType: 'string',
  size: true,
});
const DbTableColumnTypeBigint = new DbTableColumnType({
  name: 'bigint',
  csType: 'long',
  isPrimary: true,
});
const DbTableColumnTypeInt = new DbTableColumnType({ name: 'int', csType: 'int', isPrimary: true });
const DbTableColumnTypeDatetime = new DbTableColumnType({ name: 'datetime', csType: 'Datetime' });
export const DbTableColumnTypes = [
  new DbTableColumnType({ name: 'uniqueidentifier', csType: 'Guid', isPrimary: true }),
  DbTableColumnTypeNvarchar,
  DbTableColumnTypeBigint,
  DbTableColumnTypeInt,
  new DbTableColumnType({ name: 'bit', csType: 'bool' }),
  new DbTableColumnType({ name: 'decimal', csType: 'decimal', scale: true, size: true }),
  DbTableColumnTypeDatetime,
];
export const ListDefaultDbTableColumn = () => [
  new DbTableColumn({
    name: 'Id',
    desc: '主键Id',
    index: 0,
    type: DbTableColumnTypeBigint,
    isPrimary: true,
    isUnique: true,
    isRequired: true,
    isListProp: false,
    isGetProp: true,
    isCreateProp: false,
    isUpdateProp: true,
    isImportProp: false,
  }),
  new DbTableColumn({
    name: 'CreateBy',
    desc: '创建人',
    index: 100,
    type: DbTableColumnTypeNvarchar,
    size: 50,
    isRequired: true,
    isListProp: false,
    isCreateProp: true,
    isUpdateProp: false,
    isImportProp: false,
  }),
  new DbTableColumn({
    name: 'CreateTime',
    desc: '创建时间',
    index: 101,
    type: DbTableColumnTypeDatetime,
    isRequired: true,
    isListProp: false,
    isCreateProp: true,
    isUpdateProp: false,
    isImportProp: false,
  }),
  new DbTableColumn({
    name: 'ModifyBy',
    desc: '修改人',
    index: 102,
    type: DbTableColumnTypeNvarchar,
    size: 50,
    isRequired: false,
    isListProp: false,
    isCreateProp: false,
    isUpdateProp: true,
    isImportProp: false,
  }),
  new DbTableColumn({
    name: 'ModifyTime',
    desc: '修改时间',
    index: 103,
    type: DbTableColumnTypeDatetime,
    isRequired: false,
    isListProp: false,
    isCreateProp: false,
    isUpdateProp: true,
    isImportProp: false,
  }),
  new DbTableColumn({
    name: 'DeleteFlag',
    desc: '删除标记',
    index: 104,
    type: DbTableColumnTypeInt,
    isRequired: true,
    isListProp: false,
    isCreateProp: false,
    isUpdateProp: false,
    isImportProp: false,
  }),
];
export type DbTableSource = Optional<
  Omit<DbTable, 'getSQLCreation' | 'getCSModel'>,
  'name' | 'db' | 'schema' | 'namespace' | 'desc' | 'dbTableColumns'
>;
export class DbTable {
  /** 名称 */
  name: string;
  /** 数据库 */
  db: string;
  /** 架构 */
  schema: string;
  /** 命名空间 */
  namespace: string;
  /** 描述 */
  desc: string;
  /** 列 */
  dbTableColumns: DbTableColumn[];
  constructor(source: DbTableSource) {
    this.name = source.name ?? '';
    this.db = source.db ?? 'AUXMESDB';
    this.schema = source.schema ?? 'dbo';
    this.namespace = source.namespace ?? 'Siemens.MES.SysMgt.Bus';
    this.desc = source.desc ?? source.name ?? '';
    this.dbTableColumns = ListDefaultDbTableColumn();
    this.dbTableColumns.splice(1, 0, ...(source.dbTableColumns ?? []));
  }
  async getSQLCreation() {
    const res = await axios.post<string>('/api/tables/sql/creation', this);
    if (typeof res === 'string') return res;
    else return '';
  }
  async getCSModel() {
    const res = await axios.post<string>('/api/tables/cs/model', this);
    if (typeof res === 'string') return res;
    else return '';
  }
}
export type DbTableFormRule = Omit<DbTable, 'getSQLCreation' | 'getCSModel'>;
