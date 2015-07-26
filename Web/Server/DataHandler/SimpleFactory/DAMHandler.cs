using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using zhongxia.IBatisDAO;
using System.Data;
using Web.Server.Utility;

namespace Web.Server.DataHandler.SimpleFactory
{
    public class DAMHandler : ADataProcess
    {
        /// <summary>
        /// 批量添加预警
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="ht"></param>
        /// <returns></returns>
        public override string DataHandler(IIBatisDAO DAO, System.Collections.Hashtable ht)
        {
            DataTable dt = null;
            dt = DAO.GetDataTable(ht["action"].ToString(), ht);
            foreach (DataRow row in dt.Rows)
            {
                if (row["daleln"] != null)
                {
                      row["daleln"].ToString();

                }
                if (row["dalelt"] != null)
                {

                }
            }
            return JsonHelper.Encode(dt);
        }
    }
}