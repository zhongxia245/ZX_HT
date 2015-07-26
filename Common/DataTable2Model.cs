using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;

namespace Common
{
    /// <summary>
    /// DataTable数据转成实体类
    /// </summary>
    public class DataTable2Model
    {
        /// <summary>
        /// 通过DataRow 填充实体
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static T GetModelByDataRow<T>(System.Data.DataRow dr) where T : new()
        {
            T model = new T();
            foreach (PropertyInfo pInfo in model.GetType().GetProperties())
            {
                object val = _GetValueByColumnName(dr, pInfo.Name);
                pInfo.SetValue(model, val, null);
            }
            return model;
        }

        //返回DataRow 中对应的列的值。
        private static object _GetValueByColumnName(System.Data.DataRow dr, string columnName)
        {
            if (dr.Table.Columns.IndexOf(columnName) >= 0)
            {
                if (dr[columnName] == DBNull.Value)
                    return null;
                return dr[columnName];
            }
            return null;
        }
    }
}