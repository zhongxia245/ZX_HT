using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    /// <summary>
    /// Web前端 的 列配置
    /// </summary>
    public class Web_Column
    {
        /// <summary>
        /// 字段名
        /// </summary>
        public string field { get; set; }
        /// <summary>
        /// 字段中文名
        /// </summary>
        public string title { get; set; }
        /// <summary>
        /// 字段默认值(编辑页面)[可为空]
        /// </summary>
        public string value { get; set; }


        /// <summary>
        /// 字段控件类型
        /// </summary>
        public string controlType { get; set; }
        /// <summary>
        /// 表单类型[可为空]
        /// </summary>
        public string formType { get; set; }


        /// <summary>
        /// 验证规则
        /// </summary>
        public string validate { get; set; }



        /// <summary>
        /// 字段控件样式
        /// </summary>
        public string style { get; set; }
        /// <summary>
        /// 字段控件宽度
        /// </summary>
        public int? width { get; set; }
        /// <summary>
        /// 字段控件高度
        /// </summary>
        public int? height { get; set; }
        /// <summary>
        /// 字段控件所占列
        /// </summary>
        public int? colspan { get; set; }
        /// <summary>
        /// 对齐方式
        /// </summary>
        public string align { get; set; }

        /// <summary>
        /// 是否为主键
        /// </summary>
        public bool isPk { get; set; }
        /// <summary>
        /// 是否为自增列
        /// </summary>
        public bool isIdentity { get; set; }
        /// <summary>
        /// 编辑页面是否显示该字段
        /// </summary>
        public bool display { get; set; }
    }
}
