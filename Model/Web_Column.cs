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
        public string field;
        /// <summary>
        /// 字段中文名
        /// </summary>
        public string title;
        /// <summary>
        /// 字段默认值(编辑页面)[可为空]
        /// </summary>
        public string value;


        /// <summary>
        /// 字段控件类型
        /// </summary>
        public string controlType = "form";
        /// <summary>
        /// 表单类型[可为空]
        /// </summary>
        public string formType;


        /// <summary>
        /// 验证规则
        /// </summary>
        public string validate;

        /// <summary>
        /// 字段控件样式
        /// </summary>
        public string style;
        /// <summary>
        /// 字段控件宽度
        /// </summary>
        public int? width;
        /// <summary>
        /// 字段控件高度
        /// </summary>
        public int? height;
        /// <summary>
        /// 字段控件所占列
        /// </summary>
        public int? colspan;
        /// <summary>
        /// 对齐方式
        /// </summary>
        public string align;

        /// <summary>
        /// 是否为主键
        /// </summary>
        public bool isPk;
        /// <summary>
        /// 是否为自增列
        /// </summary>
        public bool isIdentity;
        /// <summary>
        /// 添加页面,是否有该字段
        /// </summary>
        public bool isAdd;
        /// <summary>
        /// 编辑页面是否有该字段
        /// </summary>
        public bool isUpdate;
    }
}
