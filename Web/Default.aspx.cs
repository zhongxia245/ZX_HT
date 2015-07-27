using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Web.Server.Utility;
using System.Collections;

namespace Web
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Gridview1.DataSource = IBatisUitls.DAO.GetDataSet("Tb_TableConfig.GetTableNames", null);
            Gridview1.DataBind();
        }
        protected void Unnamed1_Click(object sender, EventArgs e)
        {
            var tbName = TextBox1.Text;
            var ht = new Hashtable();
            ht.Add("TBNAME", tbName);
            Gridview2.DataSource = IBatisUitls.DAO.GetDataSet("Tb_TableConfig.GetColumnsByTbName", ht);
            Gridview2.DataBind();
            //BLL.SYS_SQL sqls = new BLL.SYS_SQL(tbName);
            BLL.SYS_SQLCore sqls = new BLL.SYS_SQLCore(TCID.Text);
            var sql = sqls.GetSQL_Select() + "</br></br>"
                + sqls.GetSQL_Insert() + "</br></br>"
                + sqls.GetSQL_Delete() + "</br></br>"
                + sqls.GetSQL_Update();
            Response.Write(sql);
        }

        /// <summary>
        /// 添加表
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Button2_Click(object sender, EventArgs e)
        {
            var tbName = TextBox1.Text;
            var ht = new Hashtable();
            ht.Add("TBNAME", tbName);
        }
    }
}