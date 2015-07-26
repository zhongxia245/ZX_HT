using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Collections;
using zhongxia.IBatisDAO;

namespace Web.Server.DataHandler.SimpleFactory
{
    public abstract class ADataProcess
    {
        /// <summary>
        /// 对数据库返回的数据处理
        /// </summary>
        /// <returns></returns>
        public abstract String DataHandler(IIBatisDAO DAO,Hashtable ht);
    }
}