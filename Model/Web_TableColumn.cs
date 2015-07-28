using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    /// <summary>
    /// EasyUI表格展示的字段
    /// </summary>
    public class Web_TableColumn
    {
        /// <summary>
        /// 字段
        /// </summary>
        public string field="ck";
        /// <summary>
        /// 字段名
        /// </summary>
        public string title;
        /// <summary>
        /// 对齐方式
        /// </summary>
        public string align;
        /// <summary>
        /// 是否排序
        /// </summary>
        public bool sortable = true;
        /// <summary>
        /// 复选框(首列)
        /// </summary>
        public bool checkbox = false;
        /// <summary>
        /// 字段宽度
        /// </summary>
        public int? width=30;
    }
}
