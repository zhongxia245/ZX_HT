<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Web_TableConfig.aspx.cs"
    Inherits="Web.Web_TableConfig" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>添加表</title>
    <style>
        tr
        {
            padding: 5px;
        }
        form
        {
            text-align: center;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    数据库名
                </td>
                <td>
                    <asp:TextBox ID="txt_DBName" runat="server" Text="MSSQL"></asp:TextBox>
                </td>
                <td>
                    表名
                </td>
                <td>
                    <asp:DropDownList ID="dd_TbName" runat="server" OnSelectedIndexChanged="dd_TbName_SelectedIndexChanged">
                    </asp:DropDownList>
                </td>
                <td>
                    表别名
                </td>
                <td>
                    <asp:TextBox ID="txt_TbName" runat="server"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    分页大小
                </td>
                <td>
                    <asp:TextBox ID="txt_PageSize" runat="server" Text="20"></asp:TextBox>
                </td>
                <td>
                    排序字段
                </td>
                <td>
                    <asp:DropDownList ID="dd_SortField" runat="server">
                    </asp:DropDownList>
                </td>
                <td>
                    表类型
                </td>
                <td>
                    <asp:TextBox ID="txt_Type" runat="server"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    编辑页面宽度
                </td>
                <td>
                    <asp:TextBox ID="txt_Width" runat="server" Text="800"></asp:TextBox>
                </td>
                <td>
                    编辑页面高度
                </td>
                <td>
                    <asp:TextBox ID="txt_Height" runat="server" Text="400"></asp:TextBox>
                </td>
                <td>
                </td>
                <td>
                </td>
            </tr>
        </table>
    </div>
    <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="添加表" />
    <asp:Button ID="Button2" runat="server" Text="刷新" OnClick="Button2_Click" />
    </form>
</body>
</html>
