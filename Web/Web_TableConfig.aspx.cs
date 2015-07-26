using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Web.Server.Utility;
using System.Collections;
using System.Data;

namespace Web
{
    public partial class Web_TableConfig : System.Web.UI.Page
    {
        private DataTable dt = new DataTable();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                dd_TbName.DataTextField = "_TBNAME";
                dd_TbName.DataValueField = "_TBNAME";
                dd_TbName.DataSource = IBatisUitls.DAO.GetDataSet("Tb_TableConfig.GetTableNames", null);
                dd_TbName.DataBind();
            }
        }
        /// <summary>
        /// 添加表
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Button1_Click(object sender, EventArgs e)
        {
            var dbName = txt_DBName.Text.Trim();
            var tbCode = dd_TbName.SelectedValue.Trim();
            var tbName = txt_TbName.Text.Trim();
            var pageSize = txt_PageSize.Text.Trim();
            var sortField = dd_SortField.SelectedValue.Trim();
            var tbType = txt_Type.Text.Trim();
            var width = txt_Width.Text.Trim();
            var height = txt_Height.Text.Trim();

            var ht = new Hashtable();
            ht.Add("DBNAME", dbName);
            ht.Add("TBCODE", tbCode);
            ht.Add("TBNAME", tbName);
            ht.Add("SORTFIELD", sortField);
            ht.Add("PAGESIZE", pageSize);
            ht.Add("TBTYPE", tbType);
            ht.Add("EDITWIDTH", width);
            ht.Add("EDITHEIGHT", height);

            var ht1 = new Hashtable();
            ht1.Add("TBNAME", tbCode);
            dt = IBatisUitls.DAO.GetDataSet("Tb_TableConfig.GetColumnsByTbName", ht1).Tables[0];
            try
            {
                IBatisUitls.DAO.BeginTransaction();
                var tcid = IBatisUitls.DAO.GetSingle("Tb_TableConfig.Add", ht);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    var column = Common.DataTable2Model.GetModelByDataRow<Model.Tb_Colums>(dt.Rows[i]);
                    var ht_field = new Hashtable();
                    ht_field.Add("TCID", tcid);
                    ht_field.Add("FCODE", column._FIELDNAME);
                    ht_field.Add("FNAME", column._FIELDNAME);
                    ht_field.Add("FTYPE", column._TYPE);
                    ht_field.Add("CONTROLTYPE", "form");
                    ht_field.Add("FORMTYPE", "text");
                    ht_field.Add("TBSORT", i * 5 + 1);
                    ht_field.Add("EDITSORT", i * 5 + 1);
                    ht_field.Add("DEFAULTVALUE", column._DEFAULT);
                    ht_field.Add("ISDISPLAY", 0);
                    ht_field.Add("ISADD", 1);
                    ht_field.Add("ISUPDATE", 1);
                    ht_field.Add("ISSEARCH", 0);
                    ht_field.Add("ISMUST", (column._ISPK != "" || column._ISIDENTITY != "") ? 1 : 0);
                    ht_field.Add("ISPK", column._ISPK != "" ? 1 : 0);
                    ht_field.Add("ISIDENTITY", column._ISIDENTITY != "" ? 1 : 0);
                    IBatisUitls.DAO.GetSingle("Tb_TableFieldConfig.Add", ht_field);
                }
                IBatisUitls.DAO.CommitTransaction();
                var alert = "<script>alert('{0}')</script>";
                Response.Write(String.Format(alert, "添加成功!" + tcid));
            }
            catch (Exception)
            {
                IBatisUitls.DAO.RollBackTransaction();
            }
        }

        protected void dd_TbName_SelectedIndexChanged(object sender, EventArgs e)
        {
            var tbName = dd_TbName.SelectedValue;
            var ht = new Hashtable();
            ht.Add("TBNAME", tbName);
            dd_SortField.DataTextField = "_FIELDNAME";
            dd_SortField.DataValueField = "_FIELDNAME";
            dt = IBatisUitls.DAO.GetDataSet("Tb_TableConfig.GetColumnsByTbName", ht).Tables[0];
            dd_SortField.DataSource = dt;
            dd_SortField.DataBind();
        }

        protected void Button2_Click(object sender, EventArgs e)
        {

        }
    }
}