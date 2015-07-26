using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL
{
    /// <summary>
    /// 一些固定的SQL语句枚举类
    /// </summary>
    public static class SQLEnum
    {
        /// <summary>
        /// 获取表的所有字段,以及字段属性
        /// </summary>
        public const String SQL_COLUMNS = @"SELECT 
                _TBNAME= UPPER(D.NAME),_FIELDNAME=UPPER(A.NAME), 
                _ISIDENTITY=CASE WHEN COLUMNPROPERTY(A.ID,A.NAME,'ISIDENTITY')=1 THEN '√' ELSE '' END, 
                _ISPK=CASE WHEN EXISTS(SELECT 1 FROM SYSOBJECTS WHERE XTYPE= 'PK' AND NAME IN ( 
            SELECT NAME FROM SYSINDEXES WHERE INDID IN( 
            SELECT INDID FROM SYSINDEXKEYS WHERE ID = A.ID AND COLID=A.COLID 
            ))) THEN '√' ELSE '' END, 
                _TYPE=B.NAME, 
                _BYTES=A.LENGTH, 
                _LEGNTH=COLUMNPROPERTY(A.ID,A.NAME, 'PRECISION'), 
                _PRECISION=ISNULL(COLUMNPROPERTY(A.ID,A.NAME, 'SCALE'),0), 
                _ISNULL=CASE WHEN A.ISNULLABLE=1 THEN '√'ELSE '' END, 
                _DEFAULT=ISNULL(E.TEXT, ''), 
                _REMARK=ISNULL(G.[VALUE], '') 
            FROM SYSCOLUMNS A 
                LEFT JOIN SYSTYPES B ON A.XTYPE=B.XUSERTYPE 
                INNER JOIN SYSOBJECTS D ON A.ID=D.ID AND D.XTYPE= 'U' AND D.NAME <> 'DTPROPERTIES' AND D.NAME = '{0}'
                LEFT JOIN SYSCOMMENTS E ON A.CDEFAULT=E.ID 
                LEFT JOIN SYS.EXTENDED_PROPERTIES G ON A.ID=G.MAJOR_ID AND A.COLID=G.MINOR_ID AND G.NAME='MS_DESCRIPTION' 
            ORDER BY A.ID,A.COLORDER ";
    }
}
