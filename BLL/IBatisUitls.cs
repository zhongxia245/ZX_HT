using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using zhongxia.DAL;

namespace BLL
{
    /// <summary>
    /// IBatis实例
    /// </summary>
    class IBatisUitls
    {
        public static zhongxia.IBatisDAO.IIBatisDAO DAO =
            DAOFactory.CreateDAO("MSSQL", "Server/Config/SqlMap_MSSQL.config");
    }
}