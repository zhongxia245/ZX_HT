using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace Web.Server.Utility
{
    public class JsonHelper
    {
     //   public static string DateTimeFormat = "MM'月'dd'日 'HH'时'";
        public static string DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
        /// <summary>
        /// 将对象编码为JSON字符串
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        public static string Encode(object o)
        {
            if (o == null || o.ToString() == "null") return null;

            if (o != null && (o.GetType() == typeof(String) || o.GetType() == typeof(string)))
            {
                return o.ToString();
            }
            IsoDateTimeConverter dt = new IsoDateTimeConverter();
            dt.DateTimeFormat = DateTimeFormat;

            return JsonConvert.SerializeObject(o, dt);
        }
        /// <summary>
        /// 把对象转换成JSON字符串
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns></returns>
        public static string ToJson(object obj)
        {
            try
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            }
            catch (Exception)
            {
                throw;
            }
           
        }

        /// <summary>
        /// 把JSON字符串转换成DataTable对象
        /// </summary>
        /// <param name="json">JSON格式的字符串</param>
        /// <returns></returns>
        public static DataTable ToDataTable(string json) {
            try
            {
                return Newtonsoft.Json.JsonConvert.DeserializeObject<DataTable>(json);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}