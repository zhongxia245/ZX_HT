using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;

namespace BLL.ConfigProxy
{
    /// <summary>
    /// 配置解析 实现类
    /// </summary>
    public class ConfigProxy_V1 : A_ConfigProxy
    {
        /// <summary>
        /// 实例化配置解析对象
        /// </summary>
        /// <param name="config">配置信息对象</param>
        public ConfigProxy_V1(SYS_SQLCore config)
        {
            this.config = config;
        }

        #region 1.解析方法
        /// <summary>
        /// 解析成前端需要的格式
        /// </summary>
        /// <returns></returns>
        public override SYS_SQLCore Proxy2Web()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 解析成服务端需要的格式
        /// </summary>
        /// <returns></returns>
        public override SYS_SQLCore Proxy2HT()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 解析主表(表)配置
        /// </summary>
        /// <returns></returns>
        public void Proxy_TableConfig()
        {
            
        }

        /// <summary>
        /// 解析附表(字段)配置
        /// </summary>
        /// <returns></returns>
        public void Proxy_TableFieldConfig()
        {
        }


        /// <summary>
        /// 把字段实体列对象转换成前端指定格式的实体对象
        /// </summary>
        /// <param name="tfconfig"></param>
        /// <returns></returns>
        public Web_Column TFConfig2Column(TB_TABLEFIELDCONFIG tfconfig)
        {
            Web_Column column = new Web_Column();
            column.field = tfconfig.FCODE;
            column.title = tfconfig.FNAME;
            column.align = tfconfig.ALIGN;
            column.controlType = tfconfig.CONTROLTYPE;
            column.formType = tfconfig.FORMTYPE;
            column.value = tfconfig.DEFAULTVALUE;
            column.colspan = tfconfig.COLSPAN;

            column.width = tfconfig.WIDTH;
            column.isPk = tfconfig.ISPK;
            column.isIdentity = tfconfig.ISIDENTITY;
            column.display = tfconfig.ISADD;

            //TODO:这边需要进行处理(判断是否是必填的,字段类型)
            column.validate = "";

            return column;
        }
        #endregion 1.解析方法
    }
}
