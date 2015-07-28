using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.ConfigProxy
{
    public static class ValidateEnum
    {

        /// <summary>
        /// 必填
        /// </summary>
        public const String REQUIRED = "required";
        /// <summary>
        /// 数字类型
        /// </summary>
        public const String NUMBER = "number";
        /// <summary>
        /// 整数
        /// </summary>
        public const String INTEGER = "integer";
        /// <summary>
        /// 电话号码
        /// </summary>
        public const String PHONE = "phone";
        /// <summary>
        /// 邮箱
        /// </summary>
        public const String EMAIL = "email";
        /// <summary>
        /// URL
        /// </summary>
        public const String URL = "url";
        /// <summary>
        /// 只接受填数字和空格
        /// </summary>
        public const String ONLYNUMBERSP = "onlyNumberSp";
        /// <summary>
        /// 只接受填英文字母、单引号（'）和空格
        /// </summary>
        public const String ONLYLETTERSP = "onlyLetterSp";
    }
}
