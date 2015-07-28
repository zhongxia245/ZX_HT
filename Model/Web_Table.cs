using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class Web_Table
    {
        /// <summary>
        /// 表格的数据请求地址
        /// </summary>
        public string url;
        /// <summary>
        /// 添加的接口
        /// </summary>
        public string url_add;
        /// <summary>
        /// 编辑的接口
        /// </summary>
        public string url_update;
        /// <summary>
        /// 删除的接口
        /// </summary>
        public string url_delete;
        /// <summary>
        /// 请求方式
        /// </summary>
        public string method = "get";
        /// <summary>
        /// 表格字段
        /// </summary>
        public List<object> columns;
    }
}
