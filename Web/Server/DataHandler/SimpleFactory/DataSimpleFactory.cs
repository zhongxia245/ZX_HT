using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Server.DataHandler.SimpleFactory
{
    public class DataSimpleFactory
    {
        /// <summary>
        /// 对数据进行特殊处理
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static ADataProcess CreateDataProcess(string type)
        {
            ADataProcess dataProcess = null;
            if (type.Equals("Map_ExecSql.Get0210_DAM"))
            {
                dataProcess = new DAMHandler();
            }
            return dataProcess;
        }
    }
}