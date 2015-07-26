using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using System.Data;

namespace BLL
{
    /// <summary>
    /// 动态生成SQL语句[未使用]
    /// </summary>
    public class NoUse_SYS_SQL
    {
        #region 0.0 构造函数
        /// <summary>
        /// 实例化
        /// </summary>
        /// <param name="tbName">表名</param>
        public NoUse_SYS_SQL(String tbName)
        {
            this.TbName = tbName;
            initSQL();
        }
        /// <summary>
        /// 实例化
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="orderField">排序字段</param>
        public NoUse_SYS_SQL(String tbName, String orderField, bool isDesc = false)
        {
            this.TbName = tbName;
            this.OrderField = orderField;
            this.IsDesc = IsDesc;
            initSQL();
        }
        #endregion

        #region 1.0 属性
        /// <summary>
        /// 表名
        /// </summary>
        public string TbName { get; set; }
        /// <summary>
        /// 排序字段
        /// </summary>
        public string OrderField { get; set; }
        /// <summary>
        /// 是否降序
        /// </summary>
        public bool IsDesc { get; set; }
        /// <summary>
        /// 表字段集合
        /// </summary>
        public List<Tb_Colums> Columns { get; set; }

        public string SelectSQL { get; set; }
        public string InsertSQL { get; set; }
        public string UpdateSQL { get; set; }
        public string DeleteSQL { get; set; }
        #endregion 1.0 属性

        #region 1.1 私有字段
        /// <summary>
        /// 根据表名,获取表的所有字段
        /// </summary>
        private string _sql_Columns = SQLEnum.SQL_COLUMNS;

        #endregion

        #region 2.0 ISQL 成员(实现接口)
        /// <summary>
        /// 根据表名,生成添加的SQL语句
        /// </summary>
        /// <param name="TbName"></param>
        /// <returns></returns>
        private string _InitInsertSQL(string TbName, List<Tb_Colums> columns)
        {
            var sql = @"INSERT INTO {0}({1}) VALUES({2}) ";

            var fields = "";  //字段集合   ID,Name...
            var paramField = ""; //IBatis字段参数形式 #ID#,"Name"....

            //遍历字段,生成字段集合
            foreach (var column in columns)
            {
                //是主键自增长,则不把该字段算到字段集合里面
                if (String.IsNullOrEmpty(column._ISIDENTITY))
                {
                    fields += column._FIELDNAME + ",";
                    paramField += "#" + column._FIELDNAME + "#,";
                }
            }
            //清楚字段集合末尾的 逗号
            fields = fields.Substring(0, fields.Length - 1);
            paramField = paramField.Substring(0, paramField.Length - 1);

            sql = String.Format(sql, TbName, fields, paramField);
            return sql;
        }
        /// <summary>
        /// 根据表名,生成更新的SQL语句
        /// </summary>
        /// <param name="TbName"></param>
        /// <returns></returns>
        private string _InitUpdateSQL(string TbName, List<Tb_Colums> columns)
        {
            var sql = "UPDATE {0} {1} WHERE {2} IN #{2}#";
            var pk_field = "";  //主键
            var updateFields = "";  //更新字段   ID=#ID#,Name=#Name#...
            //遍历字段,生成字段集合
            foreach (var column in columns)
            {
                if (!String.IsNullOrEmpty(column._ISPK) || !String.IsNullOrEmpty(column._ISIDENTITY)) pk_field = column._FIELDNAME;
                updateFields += column._FIELDNAME + " = #" + column._FIELDNAME + "#,";
            }
            updateFields = updateFields.Substring(0, updateFields.Length - 1);
            sql = String.Format(sql, TbName, updateFields, pk_field);
            return sql;
        }
        /// <summary>
        /// 根据表名,生成删除的SQL语句
        /// </summary>
        /// <param name="TbName">表名</param>
        /// <param name="pk_Filed">主键</param>
        /// <returns></returns>
        private string _InitDelSQL(string TbName, string pk_Filed)
        {
            var sql = "DELETE {0} WHERE {1} IN #{1}#";
            sql = String.Format(sql, TbName, pk_Filed);
            return sql;
        }

        /// <summary>
        /// 根据表名,生成查询的SQL语句
        /// </summary>
        /// <param name="TbName"></param>
        /// <returns></returns>
        private string _InitSelectSQL(string TbName, string orderField = null, bool isDesc = false)
        {
            //生成查询语句
            var sql = "SELECT * FROM {0}";
            sql = String.Format(sql, TbName);

            //有排序字段,则进行排序
            if (orderField != null)
            {
                sql += " ORDER BY {0} ";
                if (isDesc) sql += " DESC";
                sql = String.Format(sql, orderField);
            }

            return sql;
        }
        #endregion

        #region 3.0 通用方法
        /// <summary>
        /// 根据传入的属性,初始化SQL语句
        /// </summary>
        private void initSQL()
        {
            #region 3.1 初始化表字段

            this.Columns = new List<Tb_Colums>();
            var sql_columns = String.Format(_sql_Columns, TbName);
            DataTable dt = IBatisUitls.DAO.QueryBySql(sql_columns).Tables[0];
            for (int i = 0; i < dt.Rows.Count; i++)
                Columns.Add(Common.DataTable2Model.GetModelByDataRow<Tb_Colums>(dt.Rows[i]));

            #endregion 3.1 初始化表字段3.1 初始化表字段

            #region 3.2 初始化SQL语句
            this.SelectSQL = _InitSelectSQL(TbName, OrderField, IsDesc);

            this.InsertSQL = _InitInsertSQL(TbName, Columns);

            this.UpdateSQL = _InitUpdateSQL(TbName, Columns);

            var pk_Filed = GetPk_Field(Columns);
            this.DeleteSQL = _InitDelSQL(TbName, pk_Filed);
            #endregion 3.2 初始化SQL语句
        }

        /// <summary>
        /// 获取主键
        /// </summary>
        /// <param name="columns"></param>
        /// <returns></returns>
        private string GetPk_Field(List<Tb_Colums> columns)
        {
            var pk_Filed = "";
            foreach (var column in columns)
            {
                //获取主键
                if (!String.IsNullOrEmpty(column._ISPK)) pk_Filed = column._FIELDNAME;
                else if (!String.IsNullOrEmpty(column._ISIDENTITY)) pk_Filed = column._FIELDNAME;
                break;
            }
            return pk_Filed;
        }
        #endregion
    }
}
