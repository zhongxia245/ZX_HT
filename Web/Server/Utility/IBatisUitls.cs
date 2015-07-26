using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using zhongxia.DAL;
using System.Configuration;
using System.Collections;

namespace Web.Server.Utility
{
    public class IBatisUitls
    {
        public static zhongxia.IBatisDAO.IIBatisDAO DAO =
            DAOFactory.CreateDAO("MSSQL", "Server/Config/SqlMap_MSSQL.config");

        /// <summary>
        /// 获取指定的IBatis实例(没有传入值,返回默认)
        /// </summary>
        /// <param name="ht">配置参数</param>
        /// <returns></returns>
        public static zhongxia.IBatisDAO.IIBatisDAO GetDao(Hashtable ht)
        {
             //2. 指定数据库类型，与数据库
            String configPath = ConfigurationManager.AppSettings["DBConfig"] ?? "Server/Config/";

            configPath += (ht["DBConfig"] ?? "SqlMap_MSSQL") + ".config";

            String dbType = ConfigurationManager.AppSettings["DBType"] ?? "MSSQL";

            dbType = (ht["DBType"] ?? dbType).ToString();   //数据库类型，默认MSSQL

            zhongxia.IBatisDAO.IIBatisDAO DAO = DAOFactory.CreateDAO(dbType, configPath);
            return DAO;
        }
    }
}