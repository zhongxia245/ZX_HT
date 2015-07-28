using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using Common;
using System.Collections;

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
        public override object Proxy2Web()
        {
            var ht = new Hashtable();
            ht.Add("tableConfig", Proxy_TableConfig());
            ht.Add("tableFieldConfig", Proxy_TableFieldConfig());
            return ht;
        }

        /// <summary>
        /// 解析成服务端需要的格式
        /// </summary>
        /// <returns></returns>
        public override object Proxy2HT()
        {
            throw new NotImplementedException();
        }
        #endregion 1.解析方法

        #region 2. 私有方法

        /// <summary>
        /// 解析主表(表)配置
        /// </summary>
        /// <returns></returns>
        private Web_Table Proxy_TableConfig()
        {
            Web_Table webTb = new Web_Table();
            webTb.url = "/Server/AjaxHandler/CRUDHandler.ashx?TCID=" + config.TCID + "&action=select";
            webTb.url_add = "/Server/AjaxHandler/CRUDHandler.ashx?TCID=" + config.TCID + "&action=insert";
            webTb.url_update = "/Server/AjaxHandler/CRUDHandler.ashx?TCID=" + config.TCID + "&action=update";
            webTb.url_delete = "/Server/AjaxHandler/CRUDHandler.ashx?TCID=" + config.TCID + "&action=delete";
            //EasyUI的字段是 [[{xxx:xx},{},{}....]] 二维数组,所以要数组套数组
            List<object> columns = new List<object>();
            webTb.columns = columns;

            List<Web_TableColumn> col = new List<Web_TableColumn>();
            columns.Add(col);

            //添加首页的复选框
            Web_TableColumn ck = new Web_TableColumn();
            ck.checkbox = true;
            col.Add(ck);

            var web_columns = config.Columns;
            for (int i = 0; i < web_columns.Count; i++)
            {
                if (web_columns[i].ISDISPLAY)
                {
                    Web_TableColumn wbTbc = new Web_TableColumn();
                    wbTbc.field = web_columns[i].FCODE;
                    wbTbc.title = web_columns[i].FNAME;
                    wbTbc.align = web_columns[i].ALIGN;
                    wbTbc.width = web_columns[i].WIDTH;
                    col.Add(wbTbc);
                }
            }

            return webTb;
        }

        /// <summary>
        /// 解析附表(字段)配置
        /// </summary>
        /// <returns></returns>
        private List<Web_Column> Proxy_TableFieldConfig()
        {
            List<Web_Column> web_columns = new List<Web_Column>();
            for (int i = 0; i < config.Columns.Count; i++)
            {
                var web_column = TFConfig2Column(config.Columns[i]);
                web_columns.Add(web_column);
            }
            return web_columns;
        }
        /// <summary>
        /// 把字段实体列对象转换成前端指定格式的实体对象
        /// </summary>
        /// <param name="tfconfig"></param>
        /// <returns></returns>
        private Web_Column TFConfig2Column(TB_TABLEFIELDCONFIG tfconfig)
        {
            Web_Column column = new Web_Column();
            column.field = tfconfig.FCODE;
            column.title = tfconfig.FNAME;
            column.align = StringUtil.DefaultValue(tfconfig.ALIGN, "center");
            //默认控件类型为表单
            column.controlType = StringUtil.DefaultValue(tfconfig.CONTROLTYPE, "form");
            column.formType = tfconfig.FORMTYPE;
            column.value = tfconfig.DEFAULTVALUE;

            //所占列数不能为默认的Null,否则前端编辑页面会出问题(变成8列,正常是默认4列)
            column.colspan = tfconfig.COLSPAN == null ? 1 : tfconfig.COLSPAN;

            column.width = tfconfig.WIDTH;
            column.isPk = tfconfig.ISPK;
            column.isIdentity = tfconfig.ISIDENTITY;
            column.isAdd = tfconfig.ISADD;
            column.isUpdate = tfconfig.ISUPDATE;

            //TODO:这边需要进行处理(判断是否是必填的,字段类型)
            var validate = "";
            if (tfconfig.ISMUST) validate += ValidateEnum.REQUIRED + ",";
            switch (tfconfig.FTYPE)
            {
                case "numeric": validate += ValidateEnum.NUMBER + ","; break;
                case "int": validate += ValidateEnum.INTEGER + ","; break;
            }
            if (validate.Length > 1)
                validate = validate.Substring(0, validate.Length - 1);

            column.validate = validate;

            return column;
        }

        #endregion 2. 私有方法
    }
}
