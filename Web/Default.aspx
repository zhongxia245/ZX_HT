<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Web.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div style="float: left; margin-right: 50px;">
        <asp:GridView ID="Gridview1" runat="server">
        </asp:GridView>
    </div>
    <p>
        <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
        <asp:TextBox ID="TCID" runat="server"></asp:TextBox>
        <asp:Button ID="Button1" Text="获取表字段" runat="server" OnClick="Unnamed1_Click" />
        <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox>
        <asp:Button ID="Button2" Text="添加表" runat="server" onclick="Button2_Click" />
        <br />
        <asp:GridView ID="Gridview2" runat="server">
        </asp:GridView>
    </p>
    </form>
</body>
</html>
