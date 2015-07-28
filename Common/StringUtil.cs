using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common
{
    public  class StringUtil
    {
        /// <summary>
        /// 传入一个值,如果为空,设置默认值
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static String DefaultValue(String value, String defaultValue = "")
        {
            return String.IsNullOrEmpty(value) ? defaultValue : value;
        }
    }
}
