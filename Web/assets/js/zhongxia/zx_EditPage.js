/*通用的插件*/
document.write('<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/modernizr.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/doT.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/zhongxia/utility.js"></script>');

/*编辑页面插件引用的类库*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/umeditor1_2_2/themes/default/css/umeditor.css">');
document.write('<script type="text/javascript" src="../assets/js/plugin/My97DatePicker/WdatePicker.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/umeditor.config.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/umeditor.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/umeditor1_2_2/lang/zh-cn/zh-cn.js"></script>');

/*加载Jquery验证插件*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/js/plugin/formValidator2.2.4/css/validationEngine.jquery.css"></script>');
document.write('<script type="text/javascript" src="../assets/js/plugin/formValidator2.2.4/js/jquery.validationEngine.min.js"></script>');

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
