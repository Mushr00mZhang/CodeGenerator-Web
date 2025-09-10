type Optional<T, U extends keyof T> = {
  [P in U]+?: T[P];
} & Omit<T, U>;
/**
 * @type T 基类
 * @type U 排除的key
 * @type V 可选的key
 */
type OmitAndOptional<T, U extends keyof T, V extends keyof Omit<T, U>> = Optional<Omit<T, U>, V>;
export type DbTableColumnTypeSource = OmitAndOptional<
  DbTableColumnType,
  'csNullableType',
  'scale' | 'size' | 'isPrimary'
>;
export class DbTableColumnType {
  /** 名称 */
  name: string;
  /** 小数位数 */
  scale: boolean;
  /** 长度 */
  size: boolean;
  /** C#类型 */
  csType: string;
  /** JS类型 */
  jsType: string;
  /** 是否主键字段 */
  isPrimary: boolean;
  constructor(source?: DbTableColumnTypeSource) {
    this.name = source?.name ?? '';
    this.scale = source?.scale ?? false;
    this.size = source?.size ?? false;
    this.csType = source?.csType ?? 'string';
    this.jsType = source?.jsType ?? 'string';
    this.isPrimary = source?.isPrimary ?? false;
  }
  get csNullableType() {
    switch (this.csType) {
      case 'string':
        return 'string';
      default:
        return `${this.csType}?`;
    }
  }
  toString() {
    return this.name;
  }
}
export type DbTableColumnSource = OmitAndOptional<
  DbTableColumn,
  | 'camelName'
  | 'sqlType'
  | 'csProp'
  | 'csPropWithJsonProperty'
  | 'csNullableProp'
  | 'isDefaultProp'
  | 'isPrimaryName'
  | 'isRequiredName'
  | 'isUniqueName'
  | 'isGetPropName'
  | 'isListPropName'
  | 'isFullyMatchName'
  | 'isCreatePropName'
  | 'isUpdatePropName'
  | 'isImportPropName',
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

  constructor(source?: DbTableColumnSource) {
    this.name = source?.name ?? '';
    this.desc = source?.desc ?? '';
    this.index = source?.index ?? 1;
    this.type = source?.type;
    this.size = source?.size;
    this.scale = source?.scale;
    this.isPrimary = source?.isPrimary ?? false;
    this.isRequired = source?.isRequired ?? false;
    this.default = source?.default ?? '';
    this.isUnique = source?.isUnique ?? false;
    this.isListProp = source?.isListProp ?? false;
    this.isFullyMatch = source?.isFullyMatch ?? true;
    this.isGetProp = source?.isGetProp ?? false;
    this.isCreateProp = source?.isCreateProp ?? true;
    this.isUpdateProp = source?.isUpdateProp ?? true;
    this.isImportProp = source?.isImportProp ?? true;
  }
  get camelName() {
    return `${this.name[0]?.toLowerCase()}${this.name.slice(1)}`;
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
  get csProp() {
    return `        /// <summary>
        /// ${this.desc}
        /// </summary>
        public ${this.type?.csType} ${this.name} { get; set; }
`;
  }
  get csPropWithJsonProperty() {
    return `        /// <summary>
        /// ${this.desc}
        /// </summary>
        [JsonProperty("${this.camelName}")]
        public ${this.type?.csType} ${this.name} { get; set; }
`;
  }
  get csNullableProp() {
    return `        /// <summary>
        /// ${this.desc}
        /// </summary>
        public ${this.type?.csNullableType} ${this.name} { get; set; }
`;
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
    return this.isListProp ? `是${this.isFullyMatch ? '(精确)' : '(模糊)'}` : '否';
  }
  get isFullyMatchName() {
    if (!this.isListProp) return '-';
    return this.isFullyMatch ? '是' : '否';
  }
  get isGetPropName() {
    return this.isRequired && this.isUnique && this.isGetProp ? '是' : '否';
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
const DbTableColumnTypeUniqueidenfier = new DbTableColumnType({
  name: 'uniqueidentifier',
  csType: 'Guid',
  jsType: 'string',
  isPrimary: true,
});
const DbTableColumnTypeBigint = new DbTableColumnType({
  name: 'bigint',
  csType: 'long',
  jsType: 'bigint',
  isPrimary: true,
});
const DbTableColumnTypeInt = new DbTableColumnType({
  name: 'int',
  csType: 'int',
  jsType: 'number',
  isPrimary: true,
});
const DbTableColumnTypeBit = new DbTableColumnType({
  name: 'bit',
  csType: 'bool',
  jsType: 'boolean',
});
const DbTableColumnTypeDecimal = new DbTableColumnType({
  name: 'decimal',
  csType: 'decimal',
  jsType: 'number',
  scale: true,
  size: true,
});
const DbTableColumnTypeNvarchar = new DbTableColumnType({
  name: 'nvarchar',
  csType: 'string',
  jsType: 'string',
  size: true,
});
const DbTableColumnTypeDatetime = new DbTableColumnType({
  name: 'datetime',
  csType: 'Datetime',
  jsType: 'string',
});
const DbTableColumnTypeDate = new DbTableColumnType({
  name: 'date',
  csType: 'Datetime',
  jsType: 'string',
});

export const DbTableColumnTypes = [
  DbTableColumnTypeUniqueidenfier,
  DbTableColumnTypeBigint,
  DbTableColumnTypeInt,
  DbTableColumnTypeBit,
  DbTableColumnTypeDecimal,
  DbTableColumnTypeNvarchar,
  DbTableColumnTypeDatetime,
  DbTableColumnTypeDate,
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
    desc: '是否删除',
    index: 104,
    type: DbTableColumnTypeInt,
    isRequired: true,
    isListProp: false,
    isCreateProp: false,
    isUpdateProp: false,
    isImportProp: false,
  }),
];
export type DbTableSource = OmitAndOptional<
  DbTable,
  | 'primaryKey'
  | 'csModelName'
  | 'nonDefaultColumns'
  | 'creationSql'
  | 'csModel'
  | 'listColumns'
  | 'uniqueColumns'
  | 'getColumns'
  | 'createColumns'
  | 'updateColumns',
  'name' | 'db' | 'schema' | 'namespace' | 'desc' | 'columns'
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
  columns: DbTableColumn[];
  constructor(source?: DbTableSource) {
    this.name = source?.name ?? '';
    this.db = source?.db ?? 'AUXMESDB';
    this.schema = source?.schema ?? 'dbo';
    this.namespace = source?.namespace ?? 'Siemens.MES.SysMgt.Bus';
    this.desc = source?.desc ?? source?.name ?? '';
    this.columns = ListDefaultDbTableColumn();
    this.columns.splice(1, 0, ...(source?.columns ?? []));
  }
  get primaryKey() {
    return this.columns.find((i) => i.isPrimary);
  }
  get csModelName() {
    return this.name.replaceAll('_', '');
  }
  get nonDefaultColumns() {
    return this.columns.filter((i) => !i.isDefaultProp).sort((a, b) => a.index - b.index);
  }
  get listColumns() {
    return this.nonDefaultColumns.filter((i) => i.isListProp);
  }
  get uniqueColumns() {
    return this.nonDefaultColumns.filter((i) => !i.isPrimary && i.isRequired && i.isUnique);
  }
  get getColumns() {
    return this.nonDefaultColumns.filter(
      (i) => !i.isPrimary && i.isRequired && i.isUnique && i.isGetProp
    );
  }
  get createColumns() {
    return this.nonDefaultColumns.filter((i) => i.isCreateProp);
  }
  get updateColumns() {
    return this.nonDefaultColumns.filter((i) => i.isUpdateProp);
  }
  /** 获取创建表SQL */
  get creationSql() {
    return `SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [${this.db}].[${this.schema}].[${this.name}](
${this.columns
  .map(
    (i) =>
      `  [${i.name}] ${i.sqlType}${
        (i.isPrimary && i.type?.name === 'bigint' && ' IDENTITY(1,1)') || ''
      } ${i.isRequired ? 'NOT NULL' : 'NULL'},`
  )
  .join('\n')}
  CONSTRAINT [PK_${this.name}] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
${this.columns
  .map(
    (i) => `EXEC sys.sp_addextendedproperty @name = N'MS_Description',
  @value = N'${i.desc}',
  @level0type = N'SCHEMA',
  @level0name = N'${this.schema}',
  @level1type = N'TABLE',
  @level1name = N'${this.name}',
  @level2type = N'COLUMN',
  @level2name = N'${i.name}'
GO
`
  )
  .join('')}`;
  }
  /** 获取C#模型 */
  get csModel() {
    return `using Dapper;
using Dapper.Contrib.Extensions;
using Newtonsoft.Json;
using Siemens.MES.Public;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ${this.namespace}
{
    /// <summary>
    /// ${this.desc}
    /// </summary>
    [Table("${this.db}.${this.schema}.${this.name}")]
    public class ${this.csModelName}
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        ${this.primaryKey?.type?.csType === 'long' ? '[Key]' : '[ExplicitKey]'}
        public ${this.primaryKey?.type?.csType} Id { get; set; }
${this.nonDefaultColumns.map((i) => i.csProp).join('')}        /// <summary>
        /// 创建人
        /// </summary>
        public string CreateBy { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 修改人
        /// </summary>
        public string ModifyBy { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime? ModifyTime { get; set; }
        /// <summary>
        /// 是否删除
        /// </summary>
        public int DeleteFlag { get; set; } = 0;
    }
    /// <summary>
    /// ${this.desc}Dto
    /// </summary>
    public class ${this.csModelName}Dto : ${this.csModelName}, IDtoWithRCount
    {
        /// <summary>
        /// 创建人名称
        /// </summary>
        public string CreateByName { get; set; }
        /// <summary>
        /// 修改人名称
        /// </summary>
        public string ModifyByName { get; set; }
        public int RCount { get; set; }
    }
    /// <summary>
    /// ${this.desc}列表Dto
    /// </summary>
    public class List${this.csModelName}Dto
    {
${this.listColumns.map((i) => i.csNullableProp).join('')}        /// <summary>
        /// 包含已删除
        /// </summary>
        public bool IncludeDeleted { get; set; } = false;
        /// <summary>
        /// 数据验证
        /// </summary>
        /// <returns>是否合法, 错误信息</returns>
        public virtual Tuple<bool, string> Validate()
        {
            var errors = new List<string>();
            return Tuple.Create(errors.Count == 0, string.Join(", ", errors));
        }
    }
    /// <summary>
    /// ${this.desc}分页列表Dto
    /// </summary>
    public class PagedList${this.csModelName}Dto : List${this.csModelName}Dto, IPagedListDto
    {
        public int Index { get; set; } = 0;
        public int Size { get; set; } = 20;
    }
    /// <summary>
    /// ${this.desc}获取Dto
    /// </summary>
    public class Get${this.csModelName}Dto
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        public ${this.primaryKey?.type?.csNullableType} Id { get; set; }
${this.getColumns.map((i) => i.csNullableProp).join('')}        /// <summary>
        /// 数据验证
        /// </summary>
        /// <returns>是否合法, 错误信息</returns>
        public virtual Tuple<bool, string> Validate()
        {
            var errors = new List<string>();
            if (!Id.HasValue${this.getColumns
              .filter((i) => i.isRequired && i.type?.csType === 'string')
              .map((i) => `\n                && string.IsNullOrWhiteSpace(${i.name})`)
              .join('')})
                errors.Add("条件为空");
            return Tuple.Create(errors.Count == 0, string.Join(", ", errors));
        }
    }
${
  this.uniqueColumns.length
    ? `    /// <summary>
    /// ${this.desc}唯一性校验Dto
    /// </summary>
    public class UniqueValidate${this.csModelName}Dto
    {
        /// <summary>
        /// 排除主键Id
        /// </summary>
        public ${this.primaryKey?.type?.csNullableType} ExcludeId { get; set; }
${this.uniqueColumns.map((i) => i.csNullableProp).join('')}        /// <summary>
        /// 数据验证
        /// </summary>
        /// <returns>是否合法, 错误信息</returns>
        public Tuple<bool, string> Validate()
        {
            var errors = new List<string>();
            if (${this.uniqueColumns
              .map((i) =>
                i.type?.csType === 'string'
                  ? `string.IsNullOrWhiteSpace(${i.name})`
                  : `!${i.name}.HasValue`
              )
              .join(' &&\n                ')})
                errors.Add("条件为空");
            return Tuple.Create(errors.Count == 0, string.Join(", ", errors));
        }
    }
`
    : ''
}    /// <summary>
    /// ${this.desc}创建Dto
    /// </summary>
    [Table("${this.db}.${this.schema}.${this.name}")]
    public class Create${this.csModelName}Dto
    {
${
  this.primaryKey?.type?.csType === 'Guid'
    ? `        /// <summary>
        /// 主键Id
        /// </summary>
        [ExplicitKey]
        public Guid Id { get; set; } = Guid.NewGuid()
`
    : ''
}${this.createColumns.map((i) => i.csProp).join('')}        /// <summary>
        /// 创建人
        /// </summary>
        public string CreateBy { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime => DateTime.Now;
        /// <summary>
        /// 是否删除
        /// </summary>
        public int DeleteFlag => 0;
        /// <summary>
        /// 数据验证
        /// </summary>
        /// <returns>是否合法, 错误信息</returns>
        public Tuple<bool, string> Validate()
        {
            var errors = new List<string>();
${this.createColumns
  .filter((i) => i.isRequired)
  .map(
    (i) => `            if (${
      i.type?.csType === 'string' ? `string.IsNullOrWhiteSpace(${i.name})` : `!${i.name}.HasValue`
    })
                errors.Add("${i.desc}为空");
`
  )
  .join('')}            if (string.IsNullOrWhiteSpace(CreateBy))
                errors.Add("创建人为空");
            return Tuple.Create(errors.Count == 0, string.Join(", ", errors));
        }
    }
    /// <summary>
    /// ${this.desc}更新Dto
    /// </summary>
    [Table("${this.db}.${this.schema}.${this.name}")]
    public class Update${this.csModelName}Dto
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        public ${this.primaryKey?.type?.csType} Id { get; set; }
${this.updateColumns.map((i) => i.csProp).join('')}        /// <summary>
        /// 修改人
        /// </summary>
        public string ModifyBy { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime ModifyTime => DateTime.Now;
        /// <summary>
        /// 数据验证
        /// </summary>
        /// <returns>是否合法, 错误信息</returns>
        public Tuple<bool, string> Validate()
        {
            var errors = new List<string>();
${this.updateColumns
  .filter((i) => i.isRequired && i.type?.csType === 'string')
  .map(
    (i) => `            if (string.IsNullOrWhiteSpace(${i.name}))
                errors.Add("${i.desc}为空");
`
  )
  .join('')}            if (string.IsNullOrWhiteSpace(ModifyBy))
                errors.Add("修改人为空");
            return Tuple.Create(errors.Count == 0, string.Join(", ", errors));
        }
    }
    /// <summary>
    /// ${this.desc}删除Dto
    /// </summary>
    [Table("${this.db}.${this.schema}.${this.name}")]
    public class Delete${this.csModelName}Dto
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        public ${this.primaryKey?.type?.csType} Id { get; set; }
        /// <summary>
        /// 修改人
        /// </summary>
        public string ModifyBy { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime ModifyTime => DateTime.Now;
        /// <summary>
        /// 是否删除
        /// </summary>
        public int DeleteFlag => 1;
        /// <summary>
        /// 数据验证
        /// </summary>
        /// <returns>是否合法, 错误信息</returns>
        public Tuple<bool, string> Validate()
        {
            var errors = new List<string>();
            if (string.IsNullOrWhiteSpace(ModifyBy))
                errors.Add("修改人为空");
            return Tuple.Create(errors.Count == 0, string.Join(", ", errors));
        }
    }
    public class ${this.csModelName}Service
    {
        /// <summary>
        /// 过滤${this.desc}
        /// </summary>
        /// <param name="dto">${this.desc}列表Dto</param>
        /// <returns>过滤条件</returns>
        private string Filter${this.csModelName}(List${this.csModelName}Dto dto)
        {
            var conditions = new List<string>();
${this.listColumns
  .map(
    (i) =>
      (i.type?.csType === 'string'
        ? `            if (!string.IsNullOrWhiteSpace(dto.${i.name}))`
        : `            if (dto.${i.name}.HasValue)`) +
      (i.isFullyMatch
        ? `\n                conditions.Add("i.${i.name}=@${i.name}");\n`
        : `\n                conditions.Add("i.${i.name} LIKE CONCAT(N'%',@${i.name},N'%')");\n`)
  )
  .join('')}            if (!dto.IncludeDeleted)
                conditions.Add("i.DeleteFlag=0");
            return conditions.Count > 0 ? $"WHERE {string.Join(" AND \\n      ", conditions)}" : "";
        }
        /// <summary>
        /// 获取${this.desc}列表
        /// </summary>
        /// <param name="dto">${this.desc}列表Dto</param>
        /// <returns>${this.desc}列表, 错误信息</returns>
        public Tuple<IEnumerable<${this.csModelName}Dto>, string> List${this.csModelName}(List${
      this.csModelName
    }Dto dto)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1)
                    return Tuple.Create((IEnumerable<${this.csModelName}Dto>)null, valid.Item2);
                using (var db = ConnectionFactory.${this.db}Connection())
                {
                    if (db.Status == ConnectionStatus.Closed)
                        db.Open();
                    var filter = Filter${this.csModelName}(dto);
                    var sql = $@"
SELECT COUNT(1) OVER() RCount
      ,i.*
INTO #i
FROM ${this.db}.${this.schema}.${this.name} i WITH(NOLOCK)
{filter}
ORDER BY i.Id DESC
--OFFSET @Index*@Size ROWS
--FETCH NEXT @Size ROWS ONLY;
SELECT UserName Code
      ,UserNumber Name
INTO #u
FROM AUXMESDB.dbo.Client_User WITH(NOLOCK)
WHERE UserName IN(
          SELECT DISTINCT CreateBy FROM #i
          UNION ALL
          SELECT DISTINCT ModifyBy FROM #i
          WHERE ModifyBy IS NOT NULL
      )
--AND DeleteFlag=0;
SELECT i.*
      ,ISNULL(cu.Name,i.CreateBy) CreateByName
      ,ISNULL(mu.Name,i.ModifyBy) ModifyByName
LEFT JOIN #u cu ON cu.Code=i.CreateBy
LEFT JOIN #u mu ON mu.Code=i.ModifyBy;";
                    var res = db.Query<${this.csModelName}Dto>(sql, dto);
                    return Tuple.Create(res, "");
                }
            }
            catch (Exception ex) {
                return Tuple.Create((IEnumerable<${this.csModelName}Dto>)null, ex.Message);
            }
        }
        /// <summary>
        /// 获取${this.desc}分页列表
        /// </summary>
        /// <param name="dto">${this.desc}分页列表Dto</param>
        /// <returns>${this.desc}分页列表, 错误信息</returns>
        public Tuple<PagedList<${this.csModelName}Dto>, string> PagedList${
      this.csModelName
    }(PagedList${this.csModelName}Dto dto)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1)
                    return Tuple.Create((PagedList<${this.csModelName}Dto>)null, valid.Item2);
                using (var db = ConnectionFactory.${this.db}Connection())
                {
                    if (db.Status == ConnectionStatus.Closed)
                        db.Open();
                    var filter = Filter${this.csModelName}(dto);
                    var sql = $@"
SELECT COUNT(1) OVER() RCount
      ,i.*
INTO #i
FROM ${this.db}.${this.schema}.${this.name} i WITH(NOLOCK)
{filter}
ORDER BY i.Id DESC
OFFSET @Index*@Size ROWS
FETCH NEXT @Size ROWS ONLY;
SELECT UserName Code
      ,UserNumber Name
INTO #u
FROM AUXMESDB.dbo.Client_User WITH(NOLOCK)
WHERE UserName IN(
          SELECT DISTINCT CreateBy FROM #i
          UNION ALL
          SELECT DISTINCT ModifyBy FROM #i
          WHERE ModifyBy IS NOT NULL
      )
--AND DeleteFlag=0;
SELECT i.*
      ,ISNULL(cu.Name,i.CreateBy) CreateByName
      ,ISNULL(mu.Name,i.ModifyBy) ModifyByName
LEFT JOIN #u cu ON cu.Code=i.CreateBy
LEFT JOIN #u mu ON mu.Code=i.ModifyBy;";
                    var items = db.Query<${this.csModelName}Dto>(sql, dto);
                    var res = new PagedList<${this.csModelName}Dto>
                    {
                        Total = items.Any() ? items.First().RCount : 0,
                        Items = items,
                    };
                    return Tuple.Create(res, "");
                }
            }
            catch (Exception ex) {
                return Tuple.Create((PagedList<${this.csModelName}Dto>)null, ex.Message);
            }
        }
        /// <summary>
        /// 获取${this.desc}
        /// </summary>
        /// <param name="dto">${this.desc}获取Dto</param>
        /// <returns>${this.desc}, 错误信息</returns>
        public Tuple<${this.csModelName}Dto, string> Get${this.csModelName}(Get${
      this.csModelName
    }Dto dto)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1)
                    return Tuple.Create((${this.csModelName}Dto)null, valid.Item2);
                using (var db = ConnectionFactory.${this.db}Connection())
                {
                    if (db.Status == ConnectionStatus.Closed)
                        db.Open();
                    var filter = "";
                    if (dto.Id.HasValue)
                        filter = "WHERE i.Id=@Id";${
                          this.getColumns.length
                            ? `
                    else {
                        filter = @"WHERE ${this.getColumns
                          .map((i) => `i.${i.name}=@${i.name}`)
                          .join('\n  AND ')}
  AND i.DeleteFlag=0";
                    }`
                            : ''
                        }
                    var sql = $@"
SELECT COUNT(1) OVER() RCount
      ,i.*
INTO #i
FROM ${this.db}.${this.schema}.${this.name} i WITH(NOLOCK)
{filter}
--ORDER BY i.Id DESC
--OFFSET @Index*@Size ROWS
--FETCH NEXT @Size ROWS ONLY;
SELECT UserName Code
      ,UserNumber Name
INTO #u
FROM AUXMESDB.dbo.Client_User WITH(NOLOCK)
WHERE UserName IN(
          SELECT DISTINCT CreateBy FROM #i
          UNION ALL
          SELECT DISTINCT ModifyBy FROM #i
          WHERE ModifyBy IS NOT NULL
      )
--AND DeleteFlag=0;
SELECT i.*
      ,ISNULL(cu.Name,i.CreateBy) CreateByName
      ,ISNULL(mu.Name,i.ModifyBy) ModifyByName
LEFT JOIN #u cu ON cu.Code=i.CreateBy
LEFT JOIN #u mu ON mu.Code=i.ModifyBy;";
                var res = db.QueryFirstOrDefault<${this.csModelName}Dto>(sql, dto);
                    return Tuple.Create(res, "");
                }
            }
            catch (Exception ex) {
                return Tuple.Create((${this.csModelName}Dto)null, ex.Message);
            }
        }
${
  this.uniqueColumns.length
    ? `        /// <summary>
        /// 唯一性校验${this.desc}
        /// </summary>
        /// <param name="dto">唯一性校验${this.desc}Dto</param>
        /// <returns>校验结果, 错误信息</returns>
        public Tuple<bool, string> UniqueValidate${this.csModelName}(UniqueValidate${
        this.csModelName
      }Dto dto)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1)
                    return valid;
                using (var db = ConnectionFactory.${this.db}Connection())
                {
                    if (db.Status == ConnectionStatus.Closed)
                        db.Open();
                    var name = "${this.uniqueColumns.map((i) => i.desc).join('')}";
                    var sql = @"SELECT COUNT(1)
FROM ${this.db}.${this.schema}.${this.name} WITH(NOLOCK)
WHERE ${this.uniqueColumns.map((i) => `${i.name}=@${i.name}`).join('\n  AND ')}";
                    if (dto.ExcludeId.HasValue)
                        sql += "\\n  AND Id<>@ExcludeId";
                    sql += "\\n  AND DeleteFlag=0";
                    var cnt = db.QueryFirst<int>(sql, dto);
                    if (cnt > 0)
                        return Tuple.Create(false, $"{name}重复");
                    return Tuple.Create(true, "");
                }
            }
            catch (Exception ex) {
                return Tuple.Create(false, ex.Message);
            }
        }
`
    : ''
}        /// <summary>
        /// 创建${this.desc}
        /// </summary>
        /// <param name="dto">创建${this.desc}Dto</param>
        /// <returns>主键Id, 错误信息</returns>
        public Tuple<${this.primaryKey?.type?.csNullableType}, string> Create${
      this.csModelName
    }(Create${this.csModelName}Dto dto, IDbConnection db = null, IDbTransaction tran = null)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1)
                    return Tuple.Create((${
                      this.primaryKey?.type?.csNullableType
                    })null, valid.Item2);
${
  this.uniqueColumns.filter((i) => this.createColumns.includes(i)).length
    ? `                var validDto = new UniqueValidate${this.csModelName}Dto
                {
${this.uniqueColumns
  .filter((i) => this.createColumns.includes(i))
  .map(
    (i) => `                    ${i.name} = dto.${i.name},
`
  )
  .join('')}                };
                valid = UniqueValidate${this.csModelName}(validDto);
                if (!valid.Item1)
                    return Tuple.Create((${
                      this.primaryKey?.type?.csNullableType
                    })null, valid.Item2);
`
    : ''
}                if (db == null)
                {
                    using (db = ConnectionFactory.${this.db}Connection())
                    {
                        if (db.Status == ConnectionStatus.Closed)
                            db.Open();
                        var res = db.Insert(dto);
                        return Tuple.Create((${this.primaryKey?.type?.csNullableType})res, "");
                    }
                }
                else
                {
                    var res = db.Insert(dto, tran);
                    return Tuple.Create((${this.primaryKey?.type?.csNullableType})res, "");
                }
            }
            catch (Exception ex) {
                return Tuple.Create((${this.primaryKey?.type?.csNullableType})null, ex.Message);
            }
        }
        /// <summary>
        /// 更新${this.desc}
        /// </summary>
        /// <param name="dto">更新${this.desc}Dto</param>
        /// <returns>是否成功, 错误信息</returns>
        public Tuple<bool, string> Update${this.csModelName}(Update${
      this.csModelName
    }Dto dto, IDbConnection db = null, IDbTransaction tran = null)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1) return valid;
${
  this.uniqueColumns.filter((i) => this.updateColumns.includes(i)).length
    ? `                var validDto = new UniqueValidate${this.csModelName}Dto
                {
                    ExcludeId = dto.Id,
${this.uniqueColumns
  .filter((i) => this.updateColumns.includes(i))
  .map(
    (i) => `                    ${i.name} = dto.${i.name},
`
  )
  .join('')}                };
                valid = UniqueValidate${this.csModelName}(validDto);
                if (!valid.Item1) return valid;
`
    : ''
}                if (db == null)
                {
                    using (db = ConnectionFactory.${this.db}Connection())
                    {
                        if (db.Status == ConnectionStatus.Closed)
                            db.Open();
                        var res = db.Update(dto);
                        return Tuple.Create(res, "");
                    }
                }
                else
                {
                    var res = db.Update(dto, tran);
                    return Tuple.Create(res, "");
                }
            }
            catch (Exception ex) {
                return Tuple.Create(false, ex.Message);
            }
        }
        /// <summary>
        /// 删除${this.desc}
        /// </summary>
        /// <param name="dto">删除${this.desc}Dto</param>
        /// <returns>是否成功, 错误信息</returns>
        public Tuple<bool, string> Delete${this.csModelName}(Delete${
      this.csModelName
    }Dto dto, IDbConnection db = null, IDbTransaction tran = null)
        {
            try
            {
                var valid = dto.Validate();
                if (!valid.Item1) return valid;
                if (db == null)
                {
                    using (db = ConnectionFactory.${this.db}Connection())
                    {
                        if (db.Status == ConnectionStatus.Closed)
                            db.Open();
                        var res = db.Update(dto);
                        return Tuple.Create(res, "");
                    }
                }
                else
                {
                    var res = db.Update(dto, tran);
                    return Tuple.Create(res, "");
                }
            }
            catch (Exception ex)
            {
                return Tuple.Create(false, ex.Message);
            }
        }
    }
}`;
  }
}
export type DbTableFormRule = Omit<DbTable, 'creationSql' | 'getCSModel'>;
