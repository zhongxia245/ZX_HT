/*通用的插件*/
document.write('<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/modernizr.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/doT.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/zhongxia/utility.js"></script>');
/*加载样式*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/easyui/themes/bootstrap/easyui.css">');
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/easyui/themes/icon.css">');
/*加载脚本*/
document.write('<script type="text/javascript" src="../assets/js/plugin/easyui/jquery.easyui.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/easyui/locale/easyui-lang-zh_CN.js"></script>');

/*编辑页面插件引用的类库*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/umeditor1_2_2/themes/default/css/umeditor.css">');
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/My97DatePicker/skin/WdatePicker.css">');
document.write('<script type="text/javascript" src="../assets/js/plugin/My97DatePicker/WdatePicker.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/umeditor.config.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/umeditor.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/lang/zh-cn/zh-cn.js"></script>');

/*加载Jquery验证插件*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/formValidator2.2.4/css/validationEngine.jquery.css"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/formValidator2.2.4/js/jquery.validationEngine.min.js"></script>');

/***************************************************************
        @author  zhongxia
        @time    2015-07-20
        功能:
            1. 继承表格插件+自定义编辑页面
            2. 整合所需要的所有插件,然后提供给外部调用(外观模式)
****************************************************************/

/*********************************************************
 *      生成编辑页面插件(by zhongxia in 20150716 )
 *      配置页面
 *  var tableFiledConfig =  [{"data":"date","text":"日期(年月日)","controlType":"date"},{"data":"name","formType":"datetime","text":"复选","controlType":"form"},{"data":"position","formType":"text","text":"文本框","controlType":"form"},{"data":"office","text":"是否","controlType":"form"},{"data":"extn","formType":"password","text":"密码","controlType":"form","colspan":3},{"data":"date5","text":"内容","controlType":"ueditor"}]
 **********************************************************/
var zx_EditPage = (function() {　　　 //注意:UEditor.根目录是最后请求的资源的路径,所以'umeditor','zh-cn','umeditor.config' 位置如下　
    var td = '<td style="text-align:right; padding:5px;">{{=it.title}}</td><td rowspan="{{=it.rowspan}}" colspan="{{=it.colspan}}">';
    //默认的控件类型模板
    var defaultsTemplate = {
        /*表单*/
        'form': td + '<input class="validate[{{=it.validate}}]" style="width:{{=it.width}}px;height:{{=it.height}}px; {{=it.style}} " id="{{=it.field}}" type="{{=it.formType}}" name={{=it.field}} value="{{=it.value}}"/>' + '</td>',
        /*富文本框*/
        'ueditor': td + '<script id="{{=it.field}}" name={{=it.field}}  class="validate[{{=it.validate}}]" type="text/plain" style="width:{{=it.width}}px;height:{{=it.height}}px; {{=it.style}}" >{{=it.value}}</script>' + '</td>',
        /*日期*/
        'date': td + '<input id="{{=it.field}}" name={{=it.field}}  class="validate[{{=it.validate}}] Wdate" style="width:{{=it.width}}px;height:{{=it.height}}px; {{=it.style}}" type="text" onClick="WdatePicker()"/>' + '</td>',
        /*时间*/
        'datetime': td + '<input id="{{=it.field}}" name={{=it.field}} class="validate[{{=it.validate}}] Wdate" style="width:{{=it.width}}px;height:{{=it.height}}px; {{=it.style}}"  type="text" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>' + '</td>',
        /*是否*/
        'yesno': td + '<label><input type="radio" value="1" name={{=it.field}} />是</label><label><input type="radio" value="0" name={{=it.field}} />否</label>' + '</td>'
    };

    //默认的控件配置
    var defaultConfig = {
        "field": "Edit_Id", //控件的ID,数据的字段
        "formType": "text", //表单类型
        "controlType": "form", //控件类型
        "title": "中文字段名", //字段中文名
        "value": "", //默认值
        "width": 160, //控件宽
        "height": 20, //控件高
        "style": "font-size:12px;", //表单的样式(使用方法: )
        "colspan": 1, //控件占的列数
        "rowspan": 1, //控件占的行数
        "validate": "", //验证配置  required ,custom[url],equals[password],funcCall[checkHELLO],minSize[6],maxSize[6],custom[integer],min[-5],custom[integer],max[50],past[2010/01/01],future[NOW]
        "display": "" // 默认展示
    };

    var options, //控件类型的模板,开放给扩展用
        _columns; //编辑页面的配置

    /*
        返回该控件类型的模板
        @param config 根据控件类型,返回模板
    */
    var getTemplate = function(controlType) {
        var controlTypes = $.extend({}, defaultsTemplate, options);
        return controlTypes[controlType] || "";
    };


    /*
        添加编辑页面
        @param selector 编辑页面添加到哪一个容器中
        @param columns  编辑页面展示的字段数组
    */
    var addEdit = function(selector, columns) {
        _columns = columns;
        selector = "#" + selector;
        columns = _fn_configHandler(columns); //对配置信息进行处理(去除不显示的字段)

        var ueditorArray = new Array(); //保存字段中的富文本框
        columns = mergeParam(columns);
        var html = '<form id="tb_EditForm" action=""><table border="1"  style="font-size:12px; border-color: darkgrey;border-collapse:collapse; width:100%;">',
            rowSpanCount = 0;

        for (var i = 0; i < columns.length; i++) {
            if (columns[i].controlType == "ueditor") ueditorArray.push(columns[i].field); //记录下富文本字段,等生成HTMl之后,要实例化
            if (rowSpanCount == 0) html += "<tr>";

            var tpl = getTemplate(columns[i].controlType);
            html += doT.template(tpl)(columns[i]);

            rowSpanCount += columns[i].colspan + 1; //控件占的列数+字段名称占的列数

            if (rowSpanCount >= 4) {
                html += "</tr>";
                rowSpanCount = 0;
            }
        }
        html += '</table></form>';

        $(selector).html(html);

        $(selector).hide(); //隐藏编辑页面

        //实例化富文本框
        for (var i = 0; i < ueditorArray.length; i++) {
            UM.getEditor(ueditorArray[i]);
        }
    };

    /*
        把传进来的参数和默认的参数,合并
        @param columns  编辑字段数组
    */
    var mergeParam = function(columns) {
        columns = _fn_configHandler(columns); //对配置信息进行处理(去除不显示的字段)

        var mergeColumns = new Array();
        for (var i = 0; i < columns.length; i++) {
            //根据不同的类型,设置宽高
            if (columns[i].controlType == "ueditor") { //富文本框,默认宽600,高200
                columns[i].width = columns[i].width || 600;
                columns[i].height = columns[i].height || 200;
                columns[i].colspan = columns[i].colspan || 3;
            }
            if (columns[i].formType == "radio" || columns[i].formType == "checkbox") { //单选框,复选框: 默认宽18  高:无
                columns[i].width = columns[i].width || 18;
                columns[i].height = columns[i].height || ""
            }

            //合并参数(后面两个,合并到第一个空对象里面)
            var config = $.extend({}, defaultConfig, columns[i]);
            mergeColumns.push(config);
        }
        return mergeColumns;
    }

    /*
       根据表格的字段数组来对编辑页面进行赋值
       @param columns  编辑字段数组
       @param rowData  表格的一行记录
    */
    var setEditValue = function(columns, rowData) {
        columns = _fn_configHandler(columns); //对配置信息进行处理(去除不显示的字段)
        rowData = rowData || {};
        for (var i = 0; i < columns.length; i++) {
            var fieldCode = columns[i].field;
            var value = rowData[fieldCode] || "";
            var $control = $("#" + fieldCode);

            if (columns[i].controlType == "ueditor") {
                value = "" + value
                UM.getEditor(fieldCode).setContent(value);
            } else if (columns[i].formType == "checkbox" || columns[i].formType == "radio") {
                $control.attr("checked", true);
            } else {
                $control.val(value);
            }
        }
    };

    /*
       根据表格的字段数组来获取编辑页面的值
       @param rowData  编辑字段数组
    */
    var getEditValue = function() {
        columns = _fn_configHandler(_columns); //对配置信息进行处理(去除不显示的字段)
        var editData = {};
        for (var i = 0; i < columns.length; i++) {
            var fieldCode = columns[i].field;
            var $control = $("#" + fieldCode);
            var value = "";
            if (columns[i].controlType == "ueditor") {
                value = UM.getEditor(fieldCode).getContent();
            } else if (columns[i].formType == "checkbox" || columns[i].formType == "radio") {
                value = $control.attr("checked");
            } else {
                value = $control.val();
            }
            editData[fieldCode] = value;
        }
        return editData;
    }

    var fn_getColumnsConfig = function() {
        return _columns;
    }

    /*
        对编辑页面配置信息进行处理 [去除不编辑的字段]
        @param columns 编辑页面配置信息
    */
    var _fn_configHandler = function(columns) {
        var columns_new = new Array();
        var columns_old = columns || [];

        for (var i = 0; i < columns_old.length; i++) {
            if (!columns_old[i]["display"] && columns_old[i]["display"] != "none") {
                columns_new.push(columns_old[i]);
            }
        }
        return columns_new;
    };

    /*匿名对象对外提供的参数*/
    return {
        options: options,
        addEdit: addEdit,
        setEditValue: setEditValue,
        getEditValue: getEditValue,
        fn_getColumnsConfig: fn_getColumnsConfig
    };
})();

/******************************************************************
 *    @author  zhongxia
 *    @time    2015-07-20
 *    功能:
 *      1. 根据配置生成表格
 *      2. 设置字段的排序,宽高,冻结列,分页,工具栏,弹窗事件等
 ******************************************************************/
var zx_EasyUIDataTable = (function(plugin_edit) {
    /*=================定义变量 START===================*/
    //添加,或编辑的标记
    var _addSign = "add",
        _updateSign = "update";

    //EasyUI 表格的默认配置
    var defaultOptions = {
        columns: undefined, //DataGrid列配置对象，详见列属性说明中更多的细节。
        frozenColumns: undefined, //同列属性，但是这些列将会被冻结在左侧。
        fit: true, //自适应父容器宽度(父容器必须设置宽高)
        //fitColumns: true, //真正的自动展开/收缩列的大小，以适应网格的宽度，防止水平滚动。
        title: '<a href="./index.html">首页</a> &gt <span>表格生成</span> &gt <span>用户表<span>',
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
        pageSize: 20,
        pageList: [20, 50, 100, 150], //在设置分页属性的时候 初始化页面大小选择列表。
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
    var _dg;   //表格对象
    var tbConfig;

    /*=================定义变量 END===================*/

    /*=================定义外部方法 START===================*/
    /*
        控件的入口
    */
    var init = function(tbid, options) {
        tbId = tbid;
        tbConfig = options; //20150726  保存配置信息
        options = $.extend({}, defaultOptions, options);
        _dg = $('#' + tbId).datagrid(options);
    }

    /*=================定义外部方法 END===================*/

    /*=================定义内部方法 START===================*/
    /*
        添加数据
    */
    var _add = function() {
        var columns = plugin_edit.fn_getColumnsConfig(); //获取编辑页面的配置信息
        plugin_edit.setEditValue(columns);
        _openDialog("添加页面", _addSign);
    }

    /*
        更新数据
    */
    var _update = function() {
        var columns = plugin_edit.fn_getColumnsConfig(); //获取编辑页面的配置信息
        //选中一个行编辑
        var row = $('#' + tbId).datagrid('getSelected');
        if (row) {
            plugin_edit.setEditValue(columns, row); //设置编辑页面内容
            _openDialog("编辑页面", _updateSign);
        } else {
            //复选框勾选一个行编辑
            var rows = $('#' + tbId).datagrid('getChecked');
            if (rows.length != 0) {
                row = rows[0];
                plugin_edit.setEditValue(columns, row); //设置编辑页面内容
                _openDialog("编辑页面", _updateSign);
            }
        }

    }

    /*
        删除数据
    */
    var _remove = function() {
        var rows = $('#' + tbId).datagrid('getChecked');
        if (rows) {
            $.messager.confirm('温馨提示', '您准备删除' + rows.length + '条记录,是否确定?', function(r) {
                if (r) {
                    var delIds = "";
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        delIds += row["ID"] + ",";

                        //var index = $('#' + tbId).datagrid('getRowIndex', row);
                        //$('#' + tbId).datagrid('deleteRow', index);  //删除一行
                    }
                    delIds = delIds.substr(0, delIds.length - 1);
                    console.log(delIds);
                    var url = tbConfig.url_del;
                    $.post(url, {
                        ID: delIds
                    }, function(json) {

                        reloadData(); //重新加载表格数据
                    });
                }
            });
        }
    }

    /*
            弹出窗体
            @param title 标题
            @param flag  标记(add,update) //是添加,还是编辑
        */
    var _openDialog = function(title, flag) {
        var btn_text = "";
        if (flag == _addSign) btn_text = "添加";
        else if (flag == _updateSign) btn_text = "保存";

        $('#' + editId).show();
        $('#' + editId).dialog({
            width: 700,
            height: 400,
            modal: true,
            title: title,
            maximizable: false,
            minimizable: false,
            collapsible: true,
            onBeforeClose: function() { //关闭窗体之前做的操作
                $("#tb_EditForm").validationEngine('hide'); //隐藏验证提示
                $("#tb_EditForm").validationEngine("detach"); //关闭验证
            },
            buttons: [{
                text: btn_text,
                handler: function(e) {
                    //添加验证信息
                    $("#tb_EditForm").validationEngine('attach', { //添加上这个方法,就可以输入内容后,提示框没掉
                        scroll: true,
                        focusFirstField: true
                    });

                    fn_PreValidate(this, flag);
                    //验证表单信息
                    if ($("#tb_EditForm").validationEngine('validate')) {
                        //TODO: 区分添加和删除,添加则弹出是否继续添加  20150722
                        fn_PreSave(this, flag);
                        //保存
                        fn_Save(this, flag);
                        $("#tb_EditForm").validationEngine('hide'); //隐藏验证提示
                        $("#tb_EditForm").validationEngine("detach"); //关闭验证
                        fn_NextSave(this, flag);
                    }
                }
            }, {
                text: "重置",
                handler: function() {
                    alert("重置")
                }
            }]
        });
    }

    /*验证前的操作*/
    var fn_PreValidate = function() {};

    /*保存前的操作*/
    var fn_PreSave = function(e, flag) {};

    /*保存/添加*/
    var fn_Save = function(e, flag) {
        var url = "";

        if (flag == _addSign) url = tbConfig.url_add;
        else url = tbConfig.url_update;

        var data = plugin_edit.getEditValue();

        $.post(url, data, function(json) {
            if (flag == _addSign) { //添加
                $.messager.confirm('温馨提示', '添加成功,是否继续添加?', function(r) {
                    if (r) {

                    } else {
                        $('#' + editId).dialog("close");
                    }
                    reloadData(); //重新加载表格数据
                });
            } else if (flag == _updateSign) { //修改
                $.messager.alert('温馨提示', '保存成功!');
                $('#' + editId).dialog("close");
                reloadData();
            }
        });
    }

    /*保存后的操作*/
    var fn_NextSave = function(e, flag) {};
    /*重新加载数据*/
    var reloadData = function() {
        _dg.datagrid('reload');
    }

    /*=================定义内部方法 END===================*/

    return {
        init: init
    }
})(zx_EditPage);


var zx_ALL = (function(plugin_table, plugin_edit) {
    //入口
    var init = function(tableId, tableConfig, tb_EditId, editConfig) {
        plugin_table.init(tableId, tableConfig);
        plugin_edit.addEdit(tb_EditId, editConfig);
    }
    return {
        plugin_table: plugin_table,
        plugin_edit: plugin_edit,
        init: init
    }
})(zx_EasyUIDataTable, zx_EditPage);
