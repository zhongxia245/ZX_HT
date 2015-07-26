using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using System.Data;
using zhongxia.Common;
using Web.Server.Utility;
using Web.Server.DataHandler.SimpleFactory;
using zhongxia.IBatisDAO;
using System.Configuration;
using zhongxia.DAL;

namespace Web.Server.AjaxHandler
{
    /// <summary>
    /// 通用接口,只需要传入指定的数据库,指定的SQL语句,便可以返回数据
    /// 如果需要做特殊处理,使用接口方法处理.
    /// </summary>
    public class ExecSqlHandler : IHttpHandler
    {
        public Hashtable ht = new Hashtable();   //保存前端传回来的所有参数
        public HttpContext CurContext;       //当前的Context对象

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            CurContext = context;
            //1. 获取前端传过来的所有参数
            ht = WebUtil.Request(context);

            IIBatisDAO DAO = IBatisUitls.GetDao(ht);

            var json = "";
            DataTable dt = null;

            //3. 是否对数据返回的数据有做特殊处理
            bool isHandler = (ht["isHandler"] ?? "").ToString() != "";

            string action = (ht["action"] ?? "").ToString();
            //4. 如果设置了action参数
            if (action != "")
            {
                //未做特殊处理
                if (!isHandler)
                {
                    dt = DAO.GetDataSet(action, ht).Tables[0];
                    json = Web.Server.Utility.JsonHelper.Encode(dt);
                }
                else  //做了特殊处理
                {
                    //调用接口方法处理数据
                    json = DataSimpleFactory.CreateDataProcess(action).DataHandler(DAO, ht); ;
                }
            }
            else
            {
                json = "Error:请设置action参数";
            }
            context.Response.Write(json);
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