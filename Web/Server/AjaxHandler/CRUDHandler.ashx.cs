using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using Web.Server.Utility;
using BLL;
using zhongxia.IBatisDAO;

namespace Web.Server.AjaxHandler
{
    /// <summary>
    /// CRUDHandler 的摘要说明
    /// </summary>
    public class CRUDHandler : IHttpHandler
    {
        /// <summary>
        /// 参数对象(参数Key皆为大写)
        /// </summary>
        Hashtable ht;

        /// <summary>
        /// 增删改查SQL语句对象,字段配置,表格配置对象
        /// </summary>
        SYS_SQLCore crud;

        /// <summary>
        /// IBatis实例
        /// </summary>
        IIBatisDAO DAO;

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            ht = WebUtil.Request(context);
            DAO = IBatisUitls.GetDao(ht);
            var json = "";

            //生成对应表的增删改查语句
            var tcid = IsNull(ht["TCID"]);
            if (tcid != "")
            {
                crud = new BLL.SYS_SQLCore(tcid);
                var action = IsNull(ht["ACTION"]).ToLower();
                action = action == "" ? "config" : action;  //默认获取配置信息
                switch (action)
                {
                    case "config": json = JsonHelper.Encode(crud); break;
                    case "insert": json = Insert(context); break;
                    case "delete": json = Delete(context); break;
                    case "update": json = Update(context); break;
                    case "select": json = Select(context); break;
                    default: json = "请设置TCID值...."; break;
                }
            }

            context.Response.Write(json);
        }

        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string Insert(HttpContext context)
        {
            var sql = crud.GetSQL_Insert();
            sql = crud.ReplacePlaceHolder(sql, ht);
            var json = DAO.ExecuteSql(sql);
            return json + "";
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string Delete(HttpContext context)
        {
            var sql = crud.GetSQL_Delete();
            sql = crud.ReplacePlaceHolder(sql, ht);
            var json = DAO.ExecuteSql(sql);
            return json + "";
        }
        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string Update(HttpContext context)
        {
            var sql = crud.GetSQL_Update();
            sql = crud.ReplacePlaceHolder(sql, ht);
            var json = DAO.ExecuteSql(sql);
            return json + "";
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private string Select(HttpContext context)
        {
            var sql = crud.GetSQL_Select();
            var page = Int32.Parse(ht["PAGE"] == null ? "1" : ht["PAGE"].ToString());
            var pageSize = Int32.Parse(ht["ROWS"] == null ? "999999" : ht["ROWS"].ToString());
            var htParam = new Hashtable();
            htParam.Add("SQL", sql);
            htParam.Add("STARTNUM", (page - 1) * pageSize);
            htParam.Add("ENDNUM", (page) * pageSize);
            var json = JsonHelper.Encode(DAO.GetDataTable("Common.Select", htParam));

            var htTbCount = new Hashtable();
            htTbCount.Add("TBCODE", crud.TbConfig.TBCODE);
            var total = DAO.GetSingle("Common.GetTbCount", htTbCount);

            var result = "{\"total\":"+total+",\"rows\":" + json + "}";
            //json = JsonHelper.Encode(DAO.QueryBySql(sql).Tables[0]);
            return result;
        }

        /// <summary>
        /// 如果值为Null,返回空字符串,否则返回值
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private string IsNull(object value)
        {
            return value == null ? "" : value.ToString();
        }



        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}