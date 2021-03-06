define(['jquery','doT','WdatePicker','umeditor','zh-cn','umeditor.config'],function($,doT) {　　　 //注意:UEditor.根目录是最后请求的资源的路径,所以'umeditor','zh-cn','umeditor.config' 位置如下　
    var td = '<td style="text-align:right; padding:5px;">{{=it.text}}</td><td rowspan="{{=it.rowspan}}" colspan="{{=it.colspan}}">';
    //默认的控件类型模板
    var defaultsTemplate = {
        /*表单*/
        'form': td + '<input style="width:{{=it.width}}px;height:{{=it.height}}px;" id="{{=it.data}}" type="{{=it.formType}}" name={{=it.data}} value="{{=it.value}}"/>' + '</td>',
        /*富文本框*/
        'ueditor': td + '<div type="text/plain" id="{{=it.data}}" name={{=it.data}} style="width:{{=it.width}}px;height:{{=it.height}}px;">{{=it.value}}</div>' + '</td>',
        /*日期*/
        'date': td + '<input style="width:{{=it.width}}px;height:{{=it.height}}px;" id="{{=it.data}}" name={{=it.data}} class="Wdate" type="text" onClick="WdatePicker()"/>' + '</td>',
        /*时间*/
        'datetime': td + '<input style="width:{{=it.width}}px;height:{{=it.height}}px;" id="{{=it.data}}" name={{=it.data}} class="Wdate" type="text" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>' + '</td>',
        /*是否*/
        'yesno': td + '<label><input type="radio" value="1" name={{=it.data}} />是</label><label><input type="radio" value="0" name={{=it.data}} />否</label>' + '</td>'
    };

    //默认的控件配置
    var defaultConfig = {
        "data": "Edit_Id", //控件的ID,数据的字段
        "formType": "text", //表单类型
        "controlType": "form", //控件类型
        "text": "中文字段名", //字段中文名
        "value": "", //数据值
        "width": "", //控件宽
        "height": "", //控件高
        "colspan": 1, //控件占的列数
        "rowspan": 1 //控件占的行数
    };

    var options, ueditor;

    /*返回该控件类型的模板*/
    var getTemplate = function(controlType) {
        var controlTypes = $.extend({}, defaultsTemplate, options);
        return controlTypes[controlType] || "";
    };

    /*
            生成一个单元格(td),需指定添加这个单元格的位置,以及控件配置
            把生成的模板,添加到指定的ID下  add("#test/body/.class",{data:"name"})
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

    var addEdit = function(selector, columns) {
        var ueditorArray = new Array(); //保存字段中的富文本框
        columns = mergeParam(columns);
        var html = '<form id="tb_EditForm"><table border="1"  style="border-collapse:collapse;">',
            rowSpanCount = 0;

        for (var i = 0; i < columns.length; i++) {
            if (columns[i].controlType == "ueditor") ueditorArray.push(columns[i].data);
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
            ueditor = UM.getEditor(ueditorArray[i]);
        }
    };

    //把传进来的参数和默认的参数,合并
    var mergeParam = function(columns) {
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

    //如何设置编辑页面的值
    var setEditValue = function(data) {

        for (var key in data) {
            var $item = $('#' + key);
            //找到相对应表单,则赋值
            if ($item && $item.attr("type") != "file") {
                $item.val(data[key]);
            }
            if ($item && $item.attr("type") != "radio") {
                if (data[key])
                    $item.attr("checked", true);
            }
            if ($item && $item.attr("type") != "checkbox") {
                if (data[key])
                    $item.attr("checked", true);
            }
            if ($item && $item.attr('class') == " edui-body-container") { //如果是富文本框
                $item.html(data[key]);
            }
            console.log($item);
            if ($item && $item.attr("type") != "yesno") {
                if (data[key])
                    $item.attr("checked", true);
            }
        }

    }

    //获取编辑页面的值
    var getEditValue = function(formId) {
        formId = formId || "tb_EditForm";
        var data = {};
        //获取表单控件的值,如果是多行文本框,富文本框,则需要编写其他方法  time: 20150714 1:30
        for (var i = 0; i < document.forms[formId].length; i++) {
            data[$(document.forms[formId][i]).attr("name")] = $(document.forms[formId][i]).val();
        }
        return data;
    }

    return {
        options: options,
        ueditor: ueditor,
        add: add,
        addEdit: addEdit,
        setEditValue: setEditValue,
        getEditValue: getEditValue
    };
});
