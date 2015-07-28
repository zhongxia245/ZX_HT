using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.ConfigProxy
{
    /// <summary>
    /// 配置解析
    /// 1. 把从数据库获取的配置信息,解析成前端需要的配置格式
    /// 2. 把前端的配置信息,解析成服务端需要的配置格式
    /// </summary>
    public abstract class A_ConfigProxy
    {
        /// <summary>
        /// 拥有配置信息,以及增删改查的SQL语句对象
        /// </summary>
        public SYS_SQLCore config { get; set; }
        /// <summary>
        /// 解析成前端需要的格式
        /// </summary>
        /// <returns></returns>
        public abstract object Proxy2Web();
        /// <summary>
        /// 解析成服务端需要的格式
        /// </summary>
        /// <returns></returns>
        public abstract object Proxy2HT();
    }
}
