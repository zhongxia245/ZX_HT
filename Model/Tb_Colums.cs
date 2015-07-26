using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    /// <summary>
    /// 表字段实体
    /// </summary>
    public class Tb_Colums
    {
        /// <summary>
        /// 表名
        /// </summary>
        public String _TBNAME { get; set; }
        /// <summary>
        /// 字段名
        /// </summary>
        public String _FIELDNAME { get; set; }
        /// <summary>
        /// 是否自增
        /// </summary>
        public String _ISIDENTITY { get; set; }
        /// <summary>
        /// 是否主键
        /// </summary>
        public String _ISPK { get; set; }
        /// <summary>
        /// 数据类型
        /// </summary>
        public String _TYPE { get; set; }
        /// <summary>
        /// 字节大小
        /// </summary>
        public int _BYTES { get; set; }
        /// <summary>
        /// 长度
        /// </summary>
        public int _LEGNTH { get; set; }
        /// <summary>
        /// 精度
        /// </summary>
        public int _PRECISION { get; set; }
        /// <summary>
        /// 是否为空
        /// </summary>
        public String _ISNULL { get; set; }
        /// <summary>
        /// 默认值
        /// </summary>
        public String _DEFAULT { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public String _REMARK { get; set; }
    }
}
