using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using System.Data;
using System.Collections;

namespace BLL
{
    /// <summary>
    /// 核心类
    /// 1. 动态生成表的增删改查语句
    /// 2. 获取表的配置信息
    /// </summary>
    public class SYS_SQLCore
    {
        #region 1.0 属性
        /// <summary>
        /// 主表标识字段
        /// </summary>
        public String TCID { get; set; }
        /// <summary>
        /// 表字段集合
        /// </summary>
        public List<TB_TABLEFIELDCONFIG> Columns { get; set; }
        /// <summary>
        /// 主表信息
        /// </summary>
        public TB_TABLECONFIG TbConfig { get; set; }

        private string _SQL_Select;
        private string _SQL_Insert;
        private string _SQL_Update;
        private string _SQL_Delete;

        /// <summary>
        /// 获取主表配置信息的SQL语句 KEY
        /// </summary>
        private const string KEY_TABLECONFIG = "Tb_TableConfig.Select_TB_TABLECONFIG";
        /// <summary>
        /// 获取附表配置信息的SQL语句 KEY
        /// </summary>
        private const string KEY_TABLEFIELDCONFIG = "Tb_TableFieldConfig.Select_TB_TABLEFIELDCONFIG";
        #endregion 1.0 属性

        #region 1.1 构造函数

        /// <summary>
        /// 根据TCID进行初始化
        /// </summary>
        /// <param name="tcid"></param>
        public SYS_SQLCore(String tcid)
        {
            this.TCID = tcid;
            if (!String.IsNullOrWhiteSpace(tcid))
            {
                this.Columns = new List<TB_TABLEFIELDCONFIG>();
                initSQL();
            }
        }
        #endregion

        #region 2.0 增删改查方法
        /// <summary>
        /// 根据表名,生成添加的SQL语句
        /// </summary>
        /// <param name="TbName"></param>
        /// <returns></returns>
        private string _InitSQL_Insert(string TbName, List<TB_TABLEFIELDCONFIG> Columns)
        {
            var sql = @"INSERT INTO {0}({1}) VALUES({2}) ";

            var fields = " ";  //字段集合   ID,Name...
            var paramField = " "; //IBatis字段参数形式 #ID#,"Name"....

            //遍历字段,生成字段集合
            foreach (var column in Columns)
            {
                //是主键自增长字段,隐藏字段,则不把该字段算到字段集合里面
                if (!column.ISPK && !column.ISIDENTITY && column.ISDISPLAY)
                {
                    fields += column.FCODE + ",";
                    paramField += "#" + column.FCODE + "#,";
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
        private string _InitSQL_Update(string TbName, List<TB_TABLEFIELDCONFIG> Columns)
        {
            var sql = "UPDATE {0} SET {1} WHERE {2} IN (#{2}#)";
            var pk_field = "";  //主键
            var updateFields = " ";  //更新字段   ID=#ID#,Name=#Name#...
            //遍历字段,生成字段集合
            foreach (var column in Columns)
            {
                if (column.ISPK || column.ISIDENTITY) pk_field = column.FCODE;
                //主键自增长字段,隐藏字段不添加到SQL语句中
                if (!column.ISPK && !column.ISIDENTITY && column.ISDISPLAY)
                {
                    updateFields += column.FCODE + " = #" + column.FCODE + "#,";
                }

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
            var sql = "DELETE {0} WHERE {1} IN (${1}$)";
            sql = String.Format(sql, TbName, pk_Filed);
            return sql;
        }

        /// <summary>
        /// 根据表名,生成查询的SQL语句
        /// </summary>
        /// <param name="TbName"></param>
        /// <returns></returns>
        private string _InitSQL_Select(string TbName, string orderField = null, List<TB_TABLEFIELDCONFIG> Columns = null)
        {
            //生成查询语句
            var sql = "SELECT {0} FROM {1}";
            var fields = " ";
            //遍历字段,生成字段集合
            if (Columns != null && Columns.Count != 0)
            {
                foreach (var column in Columns)
                    fields += column.FCODE + ",";
                fields = fields.Substring(0, fields.Length - 1);

                sql = String.Format(sql, fields, TbName);
            }
            else
            {
                sql = String.Format(sql, "*", TbName);
            }


            //有排序字段,则进行排序
            if (orderField != null)
            {
                sql += " ORDER BY {0} ";
                sql = String.Format(sql, orderField);
            }
            return sql;
        }
        #endregion 2.0 增删改查方法

        #region 3.0 通用方法
        /// <summary>
        /// 根据传入的属性,初始化SQL语句
        /// </summary>
        private void initSQL()
        {
            #region 3.1 初始化表字段

            //获取主表信息
            var ht_TbConfig = new Hashtable();
            ht_TbConfig.Add("ID", this.TCID);
            DataTable dt_tbConfig = IBatisUitls.DAO.GetDataTable(KEY_TABLECONFIG, ht_TbConfig);
            TbConfig = Common.DataTable2Model.GetModelByDataRow<TB_TABLECONFIG>(dt_tbConfig.Rows[0]);

            //获取附表数据
            var ht_TBFieldConfig = new Hashtable();
            ht_TBFieldConfig.Add("TCID", this.TCID);
            DataTable dt = IBatisUitls.DAO.GetDataTable(KEY_TABLEFIELDCONFIG, ht_TBFieldConfig);

            //把附表的DataTable转换成MODEL列表
            for (int i = 0; i < dt.Rows.Count; i++)
                Columns.Add(Common.DataTable2Model.GetModelByDataRow<TB_TABLEFIELDCONFIG>(dt.Rows[i]));

            #endregion 3.1 初始化表字段3.1 初始化表字段

            #region 3.2 初始化SQL语句

            if (Columns.Count > 0)
            {
                //查询的SQL语句(有自定义的SQL语句,以自定义的为主)
                if (!String.IsNullOrWhiteSpace(TbConfig.SELECTSQL)) this._SQL_Select = TbConfig.SELECTSQL;
                else this._SQL_Select = _InitSQL_Select(TbConfig.TBCODE, null, Columns);

                //添加的SQL语句
                if (!String.IsNullOrWhiteSpace(TbConfig.INSERTSQL)) this._SQL_Insert = TbConfig.INSERTSQL;
                else this._SQL_Insert = _InitSQL_Insert(TbConfig.TBCODE, Columns);

                //修改的SQL语句
                if (!String.IsNullOrWhiteSpace(TbConfig.UPDATESQL)) this._SQL_Update = TbConfig.UPDATESQL;
                else this._SQL_Update = _InitSQL_Update(TbConfig.TBCODE, Columns);

                //删除的SQL语句
                if (!String.IsNullOrWhiteSpace(TbConfig.DELETESQL)) this._SQL_Delete = TbConfig.DELETESQL;
                else
                {
                    var pk_Filed = GetPk_Field(Columns);
                    this._SQL_Delete = _InitDelSQL(TbConfig.TBCODE, pk_Filed);
                }
            }
            else
            {
                //查询的SQL语句(有自定义的SQL语句,以自定义的为主)
                if (!String.IsNullOrWhiteSpace(TbConfig.SELECTSQL)) this._SQL_Select = TbConfig.SELECTSQL;
                else this._SQL_Select = _InitSQL_Select(TbConfig.TBCODE, null, null);
            }
            #endregion 3.2 初始化SQL语句
        }

        /// <summary>
        /// 获取主键
        /// </summary>
        /// <param name="Columns"></param>
        /// <returns></returns>
        private string GetPk_Field(List<TB_TABLEFIELDCONFIG> Columns)
        {
            var pk_Filed = "";
            foreach (var column in Columns)
            {
                //获取主键
                if (column.ISPK) pk_Filed = column.FCODE;
                else if (column.ISIDENTITY) pk_Filed = column.FCODE;
                break;
            }
            return pk_Filed;
        }

        /// <summary>
        /// 传入参数,替换掉SQL语句中的占位符号
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <param name="ht">参数集合</param>
        /// <param name="field">该字段不加 引号 </param>
        /// <returns>可执行的SQL语句</returns>
        public string ReplacePlaceHolder(String sql, Hashtable ht)
        {
            foreach (var item in ht.Keys)
            {
                //如果是 #  号标识的字段, 则在值得首尾加上引号
                var key = "#" + item + "#";
                sql = sql.Replace(key, "'" + ht[item].ToString() + "'");
                //如果是用$符号占位,则只把值替换进去
                var key_dollor = "$" + item + "$";
                sql = sql.Replace(key_dollor, ht[item].ToString());
            }
            return sql;
        }

        /// <summary>
        /// 返回查询语句
        /// </summary>
        /// <returns></returns>
        public string GetSQL_Select()
        {
            return this._SQL_Select;
        }

        /// <summary>
        /// 返回查询语句
        /// </summary>
        /// <returns></returns>
        public string GetSQL_Delete()
        {
            return this._SQL_Delete;
        }

        /// <summary>
        /// 返回查询语句
        /// </summary>
        /// <returns></returns>
        public string GetSQL_Insert()
        {
            return this._SQL_Insert;
        }

        /// <summary>
        /// 返回查询语句
        /// </summary>
        /// <returns></returns>
        public string GetSQL_Update()
        {
            return this._SQL_Update;
        }
        #endregion
    }
}
