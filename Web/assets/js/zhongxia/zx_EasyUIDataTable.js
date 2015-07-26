document.write('<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min.js"></script>');
/*加载样式*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/easyui/themes/bootstrap/easyui.css">');
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/easyui/themes/icon.css">');
/*加载脚本*/
document.write('<script type="text/javascript" src="../assets/js/plugin/easyui/jquery.easyui.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/easyui/locale/easyui-lang-zh_CN.js"></script>');

/******************************************************************
 *    @author  zhongxia
 *	  @time    2015-07-20
 *    功能:
 *		1. 根据配置生成表格
 *		2. 设置字段的排序,宽高,冻结列,分页,工具栏,弹窗事件等
 ******************************************************************/
var zx_EasyUIDataTable = (function() {
    /*=================定义变量 START===================*/
    //EasyUI 表格的默认配置
    var defaultOptions = {
        columns: undefined, //DataGrid列配置对象，详见列属性说明中更多的细节。
        frozenColumns: undefined, //同列属性，但是这些列将会被冻结在左侧。
        fitColumns: true, //真正的自动展开/收缩列的大小，以适应网格的宽度，防止水平滚动。
        resizeHandle: 'right', //调整列的位置，可用的值有：'left','right','both'。在使用'right'的时候用户可以通过拖动右侧边缘的列标题调整列，等等。（该属性自1.3.2版开始可用）
        autoRowHeight: false, //定义设置行的高度，根据该行的内容。设置为false可以提高负载性能。
        toolbar: null, //顶部工具栏的DataGrid面板
        striped: true, //是否显示斑马线效果
        method: 'post', //该方法类型请求远程数据。
        nowrap: true, //如果为true，则在同一行中显示数据。设置为true可以提高加载性能。
        idField: null, //指明哪一个字段是标识字段。
        url: '', //一个URL从远程站点请求数据。
        data: null, //数据加载
        loadMsg: "正在加载数据,请稍等......", //在从远程站点加载数据的时候显示提示消息。
        pagination: true, //如果为true，则在DataGrid控件底部显示分页工具栏。
        rownumbers: true, //如果为true，则显示一个行号列。
        singleSelect: true, //如果为true，则只允许选择一行。
        checkOnSelect: false, //如果为true，当用户点击行的时候该复选框就会被选中或取消选中。
        selectOnCheck: false, //如果为true，单击复选框将永远选择行。
        pagePosition: 'bottom', //定义分页工具栏的位置。可用的值有：'top','bottom','both'。
        pageList: [10, 20, 30, 40, 50], //在设置分页属性的时候 初始化页面大小选择列表。
        queryParams: {}, //在请求远程数据的时候发送额外的参数。 
        sortName: null, // 定义哪些列可以进行排序。
        remoteSort: true, //定义从服务器对数据进行排序。
        showHeader: true, //定义是否显示行头。
        showFooter: false, // 定义是否显示行脚。	
        scrollbarSize: 18, //滚动条的宽度(当滚动条是垂直的时候)或高度(当滚动条是水平的时候)。

        //自定义工具栏
        toolbar: [{
            id: 'btnadd',
            text: '添加',
            iconCls: 'icon-add',
            handler: function() {
                _add();
            }
        }, {
            id: 'btnedit',
            text: '编辑',
            iconCls: 'icon-remove',
            handler: function() {
                _update();
            }
        }, {
            id: 'btnremove',
            text: '删除',
            iconCls: 'icon-add',
            handler: function() {
                _remove();
            }
        }],
        //双击行
        onDblClickRow: function() {
            _update();
        }
    }

    var editId = "tb_edit"; //编辑页面ID
    var tbId; //表格ID

    /*=================定义变量 END===================*/

    /*=================定义外部方法 START===================*/
    /*
    	控件的入口
    */
    var init = function(tbid, options) {
        tbId = tbid;
        options = $.extend({}, defaultOptions, options);
        $('#' + tbId).datagrid(options);
    }

    /*=================定义外部方法 END===================*/

    /*=================定义内部方法 START===================*/
    /*
    	添加数据
    */
    var _add = function() {
        _openDialog("添加页面");
    }

    /*
    	更新数据
    */
    var _update = function() {
        //选中一个行编辑
        var row = $('#' + tbId).datagrid('getSelected');
        if (row) {
            _openDialog("编辑页面");
            $.messager.alert('Info', row.itemid + ":" + row.productid + ":" + row.attr1);
        } else {
            //复选框勾选一个行编辑
            var rows = $('#' + tbId).datagrid('getChecked');
            if (rows.length!=0) {
                var row = rows[0];
                _openDialog("编辑页面");
                $.messager.alert('Info', row.itemid + ":" + row.productid + ":" + row.attr1);
            }
        }
    }

    /*
    	删除数据
    */
    var _remove = function() {
        var rows = $('#' + tbId).datagrid('getChecked');
        var delIds = "";
        for (var i = 0; i < rows.length; i++) {
            delIds += rows[i].productid + ",";
        }
        delIds = delIds.substr(0, delIds.length - 1);
        if (rows) {
            $.messager.confirm('确认', '您确认想要删除' + delIds + ' 记录吗？', function(r) {
                if (r) {
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var index = $('#' + tbId).datagrid('getRowIndex', row);
                        $('#' + tbId).datagrid('deleteRow', index);
                    }
                }
            });
        }
    }

    /*
		弹出窗体
    */
    var _openDialog = function(title) {
        $('#' + editId).dialog({
            width: 600,
            height: 400,
            modal: true,
            title: title,
            maximizable: false,
            minimizable: false,
            buttons: [{
                text: "保存",
                handler: function() {
                    fn_PreSave(this);
                    alert("保存");
                    $('#' + editId).dialog("close");
                    fn_NextSave(this);
                }
            }, {
                text: "重置",
                handler: function() {
                    alert("重置")
                }
            }]
        });
    }

    /*=================定义内部方法 END===================*/

    return {
        init: init
    }
})();
