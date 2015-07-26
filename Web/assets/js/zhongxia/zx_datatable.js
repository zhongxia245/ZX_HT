//引用该控件需要的类
/*通用的插件*/
document.write('<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/modernizr.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/doT.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/zhongxia/utility.js"></script>');
/*生成表格引用的插件*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/media/css/jquery.dataTables.css">');
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/easyui/themes/bootstrap/easyui.css">');
document.write('<script type="text/javascript" src="../assets/js/plugin/media/js/jquery.dataTables.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/easyui/jquery.easyui.min.js"></script>');
/*编辑页面插件引用的类库*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/umeditor1_2_2/themes/default/css/umeditor.css">');
document.write('<script type="text/javascript" src="../assets/js/plugin/My97DatePicker/WdatePicker.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/umeditor.config.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/umeditor.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/lang/zh-cn/zh-cn.js"></script>');

/*加载Jquery验证插件*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/formValidator2.2.4/css/validationEngine.jquery.css"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/formValidator2.2.4/js/jquery.validationEngine.min.js"></script>');
/**************************************************************
*       动态生成表格( author:zhongxia time:20150712)
*       1. 依赖: DataTable.js  DataTable.css doT.js  Jquery.js   main.css(样式可以自己设置)
*       2. 使用方法 zx_datatable.init(config);
        config 格式 :
        var config = {"id":"#table",//表格放置的DIV容器"url":"data/objects.txt",//表格数据获取接口"columns":[{"text":"名称","data":"name"},//显示的字段及表头中文名{"text":"位置","data":"position"},{"text":"办公室","data":"office"},{"text":"不懂","data":"extn"}]}
        
        //动态生成编辑页面的配置参数. 目前支持 各种表单控件,富文本框控件(UEditor),时间控件(MyDate97),是否等  author:zhongxia time:20150715
        后期需要继续添加控件,以及控件的验证.保存事件的编写
        var editConfig = [{"data":"date","text":"日期(年月日)","controlType":"date"},{"data":"name","formType":"datetime","text":"复选","controlType":"form"},{"data":"position","formType":"text","text":"文本框","controlType":"form"},{"data":"office","text":"是否","controlType":"form"},{"data":"extn","formType":"password","text":"密码","controlType":"form","colspan":3}]

        zx_datatable.init(config, editConfig);
***************************************************************/
//define(['jquery', 'doT', 'WdatePicker', 'umeditor', 'zh-cn', 'umeditor.config'], function($, doT) {

var zx_datatable = (function() {
    var tb_Id = "tb_Id", //表格放置的容器ID
        win_Id = "dlg"; //编辑窗的ID

    var table, //DataTable.js 表格对象
        tb_Config, //表格配置
        edit_Config; //编辑页面配置

    var tpl_table = '<table id="tb_Id" class="cell-border stripe hover " cellspacing="0" width="100%"><thead><tr>{{ for (var i = 0; i < it.length; i++) { }} <th name="{{=it[i].value}}">{{=it[i]["text"]}}</th>{{ } }}</tr></thead></table>',
        tpl_dialog = '<div id="dlg" style="-moz-user-select:none;"> </div>',
        tpl_edit = '<table width="95%" style="text-align:center; margin:5px;">{{for (var i = 0; i < it.length; i++) {}}  <tr name="{{=it[i].data}}" style="line-height: 30px;" >  <td style="text-align:right; " ><span style="width:50px;">{{=it[i].text}} :</span></td><td><input id="{{=it[i].data}}" type="text" name="{{=it[i].data}}" />  </td> <td style="text-align:right; " ><span style="width:50px;">{{=it[i].text}} :</span></td><td><input id="{{=it[i].data}}" type="text" name="{{=it[i].data}}" />  </td>  </tr>  {{}}}</table>';

    /*
        初始化表格,该插件的入口
        @param config 表格的配置
        @param editConfig 编辑页面的配置
        @param template [可选]  表格的模板 默认为 tpl_table
        @param height   [可选]  表格的高度 默认为 172(DataTable.JS中10行数据的高度)
    */
    var init = function(config, editConfig, template, height) {
        tb_Id = config.tb_Id || tb_Id;
        win_Id = config.win_Id || win_Id;
        tb_Config = config;
        edit_Config = editConfig;
        //获取参数
        var id = config.id || "body",
            columns = config.columns || [],
            url = config.url || "../data/objects.txt",
            h = height || 172,
            template = template || tpl_table;

        //根据默认模板生成表格
        var fn = doT.template(template + tpl_dialog);
        $(id).append(fn(columns));

        //获取浏览器的高度
        var tb_Height = $(window).height() - h;

        var oLanguage = { //默认的表格配置
            "sLengthMenu": "显示: _MENU_ 条",
            "sZeroRecords": "对不起，没有匹配的数据",
            "sInfo": "第 _START_ - _END_ 条 / 共 _TOTAL_ 条",
            "sInfoEmpty": "没有匹配的数据",
            "sInfoFiltered": "(数据表中共 _MAX_ 条记录)",
            "sProcessing": "正在加载中...",
            "sSearch": "查询:",
            "oPaginate": {
                "sFirst": "第一页",
                "sPrevious": " 上一页 ",
                "sNext": " 下一页 ",
                "sLast": " 最后一页 "
            }
        };

        //生成表格
        table = $("#" + tb_Id).DataTable({
            "oLanguage": oLanguage,
            "sDom": '<f>rt<ilp><"clear">', //表格的布局
            "bDeferRender": true, //是否启用延迟加载：当你使用AJAX数据源时，可以提升速度。 默认为false
            "bScrollCollapse": false, //当显示的数据不足以支撑表格的默认的高度时，依然显示纵向的滚动条。(默认是false)
            "bPaginate": true, //是否开启分页 默认True
            "bSort": true, //是否开启列排序功能，如果想禁用某一列排序，可以在每列设置使用bSortable参数
            "bProcessing": true, //是否显示加载时进度条，默认为false
            "ajax": url,
            "sScrollY": tb_Height, //固定表格的高度
            "columns": columns,
            "initComplete": function() {
                fn_InitComplete(this);
            },
            "drawCallback": function() {
                drawHandler(this);
            }
        });

        //编辑页面在表格刚生成的时候创建, 但是需要先隐藏起来(因为弹窗的代码还没生成)
        $("#" + win_Id).hide();
        zx_EditPage.addEdit("#" + win_Id, edit_Config);
    };

    /*
        表格创建完成的处理方法
        @param table 表格对象(DataTable.js 对象)
    */
    var fn_InitComplete = function(table) {}

    /*
        绘制表格结束的处理函数
        @param tb_draw 表格对象(DataTable.js 对象)
    */
    var drawHandler = function(tb_draw) {
        //TODO:表格渲染完成的回调函数(绑定行的双击事件)
        tb_draw.$('tr').dblclick(function(e) {
            var columns = tb_Config.columns;

            //获取一行的数据
            var tds = $(this).find("td");
            var rowdata = {};
            for (var i = 0; i < tds.length; i++) {
                var $td = $(tds[i]);
                rowdata[tb_Config.columns[i].data] = $td.text();
            }

            $("#" + win_Id).show(); //显示出编辑框内容(因为在表格生成的时候,编辑页面已经生成,并且隐藏了)
            zx_EditPage.setEditValue(edit_Config); //清除编辑框内容
            zx_EditPage.setEditValue(edit_Config, rowdata); //赋值上最新的内容

            //TODO:弹出编辑框
            $("#" + win_Id).dialog({
                width: 700,
                height: 430,
                modal: true,
                //maximizable: true,
                buttons: [{
                    text: '保存',
                    handler: function(e) {

                        $("#tb_EditForm").validationEngine({ //添加上这个方法,就可以输入内容后,提示框没掉
                            scroll: true,
                            focusFirstField: true
                        });
                        //直接用这个验证的方法,提示框不会跟着你输入内容,就没掉
                        if ($("#tb_EditForm").validationEngine('validate')) {
                            fn_PreSave(e);
                            fn_Save(e);
                            fn_Close();
                            fn_NextSave(e);
                            var data = zx_EditPage.getEditValue(edit_Config);
                            console.log(data);
                        }
                    }
                }, {
                    text: '关闭',
                    handler: function(e) {
                        fn_PreClose(e);
                        fn_Close(tb_draw);
                        fn_NextClose(e);
                    }
                }],
                title: "数据编辑"
            });
        });
    }

    /*编辑框关闭前的处理方法*/
    var fn_PreClose = function(e) {};
    /*编辑框关闭后的处理方法*/
    var fn_NextClose = function(e) {};
    /*编辑框保存前的处理方法*/
    var fn_PreSave = function(e) {};
    /*编辑框保存的处理方法*/
    var fn_Save = function(e) {
        alert("保存成功");
    };
    /*编辑框保存后的处理方法*/
    var fn_NextSave = function(e) {};

    /*
        Time: 2015-7-19 21:00
        关闭窗体,
        隐藏验证提示,
        关闭验证功能(不关闭,则第二次打开弹窗的时候,会出现未输入添加的信息前,就显示验证信息)
        @param tb_draw 表格对象(DataTable.js 对象)
    */
    var fn_Close = function(tb_draw) {
        $("#" + win_Id).window('close');
        $("#tb_EditForm").validationEngine('hide'); //隐藏验证提示
        $("#tb_EditForm").validationEngine("detach"); //关闭验证
        //如果是保存的话,重新加载数据
        if (tb_draw) {
            var tb = $(tb_draw).DataTable(); // $("#tb").DataTable()  返回 API对象   而$('#tb').datatable() 返回JQ对象
            //alert('Data source: ' + tb.ajax.url());
            //tb.ajax.url("../data/data.txt").load(); //重新加载数据源
            $(table).DataTable().ajax.reload(null, false); //重新加载数据,分页不会重置
        }
    };

    /*********************************************************
     *      生成编辑页面插件(by zhongxia in 20150716 )
     *      配置页面
     *  var tableFiledConfig =  [{"data":"date","text":"日期(年月日)","controlType":"date"},{"data":"name","formType":"datetime","text":"复选","controlType":"form"},{"data":"position","formType":"text","text":"文本框","controlType":"form"},{"data":"office","text":"是否","controlType":"form"},{"data":"extn","formType":"password","text":"密码","controlType":"form","colspan":3},{"data":"date5","text":"内容","controlType":"ueditor"}]
     **********************************************************/
    var zx_EditPage = (function() {　　　 //注意:UEditor.根目录是最后请求的资源的路径,所以'umeditor','zh-cn','umeditor.config' 位置如下　
        var td = '<td style="text-align:right; padding:5px;">{{=it.text}}</td><td rowspan="{{=it.rowspan}}" colspan="{{=it.colspan}}">';
        //默认的控件类型模板
        var defaultsTemplate = {
            /*表单*/
            'form': td + '<input class="validate[{{=it.validate}}]" style="width:{{=it.width}}px;height:{{=it.height}}px;" id="{{=it.data}}" type="{{=it.formType}}" name={{=it.data}} value="{{=it.value}}"/>' + '</td>',
            /*富文本框*/
            'ueditor': td + '<script id="{{=it.data}}" name={{=it.data}}  class="validate[{{=it.validate}}]" type="text/plain" style="width:{{=it.width}}px;height:{{=it.height}}px;">{{=it.value}}</script>' + '</td>',
            /*日期*/
            'date': td + '<input id="{{=it.data}}" name={{=it.data}}  class="validate[{{=it.validate}}] Wdate" style="width:{{=it.width}}px;height:{{=it.height}}px;" type="text" onClick="WdatePicker()"/>' + '</td>',
            /*时间*/
            'datetime': td + '<input id="{{=it.data}}" name={{=it.data}} class="validate[{{=it.validate}} Wdate]" style="width:{{=it.width}}px;height:{{=it.height}}px;"  type="text" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>' + '</td>',
            /*是否*/
            'yesno': td + '<label><input type="radio" value="1" name={{=it.data}} />是</label><label><input type="radio" value="0" name={{=it.data}} />否</label>' + '</td>'
        };

        //默认的控件配置
        var defaultConfig = {
            "data": "Edit_Id", //控件的ID,数据的字段
            "formType": "text", //表单类型
            "controlType": "form", //控件类型
            "text": "中文字段名", //字段中文名
            "value": "", //默认值
            "width": "", //控件宽
            "height": "", //控件高
            "colspan": 1, //控件占的列数
            "rowspan": 1, //控件占的行数
            "validate": "", //验证配置
            "display": "" // 默认展示
        };

        var options, ueditor;

        /*
            返回该控件类型的模板
            @param config 根据控件类型,返回模板
        */
        var getTemplate = function(controlType) {
            var controlTypes = $.extend({}, defaultsTemplate, options);
            return controlTypes[controlType] || "";
        };

        /*
            生成一个单元格(td),需指定添加这个单元格的位置,以及控件配置 [目前没用到]
            把生成的模板,添加到指定的ID下  add("#test / body / .class",{data:"name"})
            @param selector 添加到的容器
            @param config   单个字段的配置,JSON对象
        */
        var add = function(selector, config) {
            //根据不同的类型,设置宽高
            if (config.controlType == "ueditor") { //富文本框,默认宽600,高200
                config.width = config.width || 600;
                config.height = config.height || 200;
                config.colspan = config.colspan || 3;
            }
            if (config.formType == "radio" || config.formType == "checkbox") { //单选框,复选框: 默认宽18  高:无
                config.width = config.width || 18;
                config.height = config.height || ""
            }

            //合并参数(后面两个,合并到第一个空对象里面)
            config = $.extend({}, defaultConfig, config);

            //获取模板文件(doT模板)
            var tpl = getTemplate(config.controlType);

            //单选,复选框,则需要在后面加上  单选,复选的名称
            if (config.formType == "radio" || config.formType == "checkbox") tpl += config.text;

            //如果是富文本框的话,需要实例化富文本框
            $(selector).append(doT.template(tpl)(config));
            if (config.controlType == "ueditor") ueditor = UM.getEditor(config.data);

            return doT.template(tpl)(config);
        };

        /*
            添加编辑页面
            @param selector 编辑页面添加到哪一个容器中
            @param columns  编辑页面展示的字段数组
        */
        var addEdit = function(selector, columns) {
            columns = _fn_configHandler(columns); //对配置信息进行处理(去除不显示的字段)

            var ueditorArray = new Array(); //保存字段中的富文本框
            columns = mergeParam(columns);
            var html = '<form id="tb_EditForm" action=""><table border="1"  style="border-collapse:collapse; width:100%;">',
                rowSpanCount = 0;

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].controlType == "ueditor") ueditorArray.push(columns[i].data); //记录下富文本字段,等生成HTMl之后,要实例化
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
            //实例化富文本框
            for (var i = 0; i < ueditorArray.length; i++) {
                // UM.getEditor(ueditorArray[i]).destroy();

                if (!ueditor)
                    ueditor = UM.getEditor(ueditorArray[i]);
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
                var fieldCode = columns[i].data;
                var value = rowData[fieldCode] || "";
                var $control = $("#" + fieldCode);

                if (columns[i].controlType == "ueditor") {
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
        var getEditValue = function(columns) {
            columns = _fn_configHandler(columns); //对配置信息进行处理(去除不显示的字段)

            var editData = {};
            for (var i = 0; i < columns.length; i++) {
                var fieldCode = columns[i].data;
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
            ueditor: ueditor,
            add: add,
            addEdit: addEdit,
            setEditValue: setEditValue,
            getEditValue: getEditValue
        };
    })();


    return {
        init: init,
        table: table,
        fn_PreClose: fn_PreClose,
        fn_NextClose: fn_NextClose,
        fn_PreSave: fn_PreSave,
        fn_Save: fn_Save,
        fn_NextSave: fn_NextSave,
        zx_EditPage: zx_EditPage
    }
})();
