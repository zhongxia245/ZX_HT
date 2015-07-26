using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;

namespace Web.Server.Utility
{
    public class WebUtil
    {
        /// <summary>
        /// 获取前端传递过来的所有参数(参数Key皆为大写)
        /// </summary>
        /// <param name="context">当前流对象</param>
        /// <returns>Hashtable对象</returns>
        public static Hashtable Request(HttpContext context)
        {
            var ht = new Hashtable();
            for (int i = 0; i < context.Request.Form.Count; i++)
            {
                ht.Add(context.Request.Form.AllKeys[i].ToUpper(), context.Request.Form[i]);
            }

            for (int i = 0; i < context.Request.QueryString.Count; i++)
            {
                ht.Add(context.Request.QueryString.AllKeys[i].ToUpper(), context.Request.QueryString[i]);
            }
            return ht;
        }
    }
}