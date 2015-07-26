//引用该控件需要的类
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/media/css/jquery.dataTables.css">');
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/easyui/themes/easyui.css">');
document.write('<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/modernizr.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/doT.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/media/js/jquery.dataTables.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/zhongxia/utility.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/easyui/jquery.easyui.min.js"></script>');
/**************************************************************
*       动态生成表格( author:zhongxia time:20150712)
*       1. 依赖: DataTable.js  DataTable.css doT.js  Jquery.js   main.css(样式可以自己设置)
*       2. 使用方法 zx_datatable.init(config);
        config 格式 :
        {
            "id": "#table",   //表格放置的DIV容器
            "url": "data/objects.txt",   //表格数据获取接口
            "columns": [   
                {"text": "名称","data": "name"},   //显示的字段及表头中文名
                {"text": "位置","data": "position"},
                {"text": "办公室","data": "office"},
                {"text": "不懂","data": "extn"}]
        }
***************************************************************/
var zx_datatable = (function() {
    var tb_id = "tb_id", //表格放置的容器ID
        win_id = "dlg"; //编辑窗的ID

    var table, tb_config;

    var tpl_table = '<table id="tb_id" class="cell-border stripe hover " cellspacing="0" width="100%"><thead><tr>{{ for (var i = 0; i < it.length; i++) { }} <th name="{{=it[i].value}}">{{=it[i]["text"]}}</th>{{ } }}</tr></thead></table>',
        tpl_dialog = '<div id="dlg" style="-moz-user-select:none;"> </div>',
        tpl_edit = '<table width="95%" style="text-align:center; margin:5px;">{{for (var i = 0; i < it.length; i++) {}}  <tr name="{{=it[i].data}}" style="line-height: 30px;" >  <td style="text-align:right; " ><span style="width:50px;">{{=it[i].text}} :</span></td><td><input id="{{=it[i].data}}" type="text" name="{{=it[i].data}}" />  </td> <td style="text-align:right; " ><span style="width:50px;">{{=it[i].text}} :</span></td><td><input id="{{=it[i].data}}" type="text" name="{{=it[i].data}}" />  </td>  </tr>  {{}}}</table>';

    //初始化表格
    var init = function(config, template, height) {
        tb_id = config.tb_id || tb_id;
        win_id = config.win_id || win_id;
        tb_config = config;

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
        table = $("#" + tb_id).DataTable({
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
                console.log('initComplete');
            },
            "drawCallback": function() {
                drawHandler(this);
            }
        });
    };

    var drawHandler = function(tb_draw) {
        //TODO:表格渲染完成的回调函数
        tb_draw.$('tr').dblclick(function(e) {
            var columns = tb_config.columns;
            //动态生成编辑页面
            // var fn_edit = doT.template(tpl_edit);
            $("#" + win_id).html("");
            // $("#" + win_id).append(fn_edit(columns));

            //获取一行的数据
            var tds = $(this).find("td");
            var rowdata = {};
            for (var i = 0; i < tds.length; i++) {
                var $td = $(tds[i]);
                rowdata[tb_config.columns[i].data] = $td.text();
            }

            zx_EditPage.initHTML(win_id, columns, rowdata);

            //TODO:单元格双击事件
            $("#" + win_id).dialog({
                width: 500,
                height: 220,
                modal: true,
                maximizable: true,
                buttons: [{
                    text: '保存',
                    handler: function(e) {
                        fn_PreSave(e);
                        fn_Save(e);
                        $("#" + win_id).window('close');

                        var tb = $(tb_draw).DataTable(); // $("#tb").DataTable()  返回 API对象   而$('#tb').datatable() 返回JQ对象

                        alert('Data source: ' + tb.ajax.url());
                        tb.ajax.url("../data/data.txt").load(); //重新加载数据源
                        //$(table).DataTable().ajax.reload(null,false);//重新加载数据,分页不会重置
                        fn_NextSave(e);

                    }
                }, {
                    text: '关闭',
                    handler: function(e) {
                        fn_PreClose(e);
                        $("#" + win_id).window('close');
                        fn_NextClose(e);
                    }
                }],
                title: "数据编辑"
            });


        });
    }

    var fn_PreClose = function(e) {
        console.log('fn_PreClose');
    };

    var fn_NextClose = function(e) {
        console.log('fn_NextClose');
    };

    var fn_PreSave = function(e) {
        console.log('fn_PreSave');
    };

    var fn_Save = function(e) {
        console.log('fn_Save');
        console.log(e);
    };

    var fn_NextSave = function(e) {
        console.log('fn_NextSave');
    };

    /****************************************************
     *  Author: zhongxia  time:20150714 
        动态生成表格编辑页面表单
        1. 根据配置生成表单
        2. 控件类型     标识          类库(默认HTML)
            文本框     text
            多行文本框  textarea
            富文本     uediter    ==> UEditer
            下拉框     combobox
            复选框     checkbox
            时间控件    datetime   ==> MyDate97
            日期控件    date       ==> MyDate97
            密码框     password
            邮箱      email
        3. 可以设置多行多列(默认四列展示)
        4. 数据验证,必填,以及指定规则(提示信息可配)

        Examble:
        var config = [{
            "text": "名称",
            "data": "name",
            "controlType": "text",
            "colspan": 1
        }, {
            "text": "年龄(岁)",
            "data": "age",
            "controlType": "text",
            "colspan": 1
        }, {
            "text": "昵称",
            "data": "nickname",
            "controlType": "text",
            "colspan": 1
        }, {
            "text": "备注",
            "data": "remark",
            "controlType": "text",
            "colspan": 1
        }];
        var data = {"name":"zhongxia","age":"15","nickname":"仲夏","remark":"这里是备注..."};
        zx_EditPage.initHTML("demo",config,data);
     ****************************************************/
    var zx_EditPage = (function(self) {
        /*表单ID*/
        var formId = "tb_edit";

        var default_tpl = '<form id="tb_edit"><table width="95%" style="text-align:center; margin:5px;">{{ for (var i = 0; i<it.length/2; i++){var j=i*2;}} <tr name="{{=it[j].data}}" style="line-height: 30px;"><td style="text-align:right; "><label for="{{=it[j].data}}">{{=it[j].text}} :</label></td><td><input id="{{=it[j].data}}" type="{{=it[j].controlType}}"  name="{{=it[j].data}}" /> </td>{{ if(it[++j]){ }}<td style="text-align:right; "><label for="{{=it[j].data}}">{{=it[j].text}} :</label></td><td><input id="{{=it[j].data}}" type="{{=it[j].controlType}}"   name="{{=it[j].data}}" /> </td>{{}}}</tr> {{}}}</table></form>';

        /*
            根据配置生成HTML,并添加到指定ID中  time: 20150714 1:30
        */
        var initHTML = function(id, config, data) {
            var template = default_tpl || "";
            var fn_tpl = doT.template(template);
            $("#" + id).append(fn_tpl(config));
            var formData = getEditFormData();
            setEditFormData(data);
            console.log('设置表单数据完成');
        };

        /*
            获取编辑页面表单的数据[表单,必须指定name 属性]  time: 20150714 1:30
        */
        var getEditFormData = function() {
            var data = {};
            //获取表单控件的值,如果是多行文本框,富文本框,则需要编写其他方法  time: 20150714 1:30
            for (var i = 0; i < document.forms[formId].length; i++) {
                data[$(document.forms[formId][i]).attr("name")] = $(document.forms[formId][i]).val();
            }
            return data;
        };

        /*
            设置表单里面的数据
        */
        var setEditFormData = function(data) {
            try {
                for (var key in data) {
                    var $item = $('#' + key);
                    console.log($item);
                    //找到相对应表单,则赋值
                    if ($item)
                        $item.val(data[key]);
                }
            } catch (e) {
                console.log(e);
            }
        }

        //提供给外部可访问的方法,变量
        return {
            formId: formId,
            initHTML: initHTML,
            getEditFormData: getEditFormData,
            setEditFormData: setEditFormData
        }
    })(zx_EditPage);

    return {
        init: init,
        table: table,
        fn_PreClose: fn_PreClose,
        fn_NextClose: fn_NextClose,
        fn_PreSave: fn_PreSave,
        fn_Save: fn_Save,
        fn_NextSave: fn_NextSave
    }
})();
