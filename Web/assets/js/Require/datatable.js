//Load common code that includes config, then load the app logic for this page.
require(['common'], function() {
    require(['zhongxia/zx_datatable'], function(zx_Eidt) {
        
        //1. 获取表格配置参数生成表格
        var tcid = getQueryString("TCID");
        var config = parent.window.tableConfig.tableConfig[tcid];
        console.log(config);
        // var config = { // "id": "#table", // "url": "data/objects.txt", // "columns": [{ // "text": "名称", // "data": "name" // }, { // "text": "位置", // "data": "position" // }, { // "text": "办公室", // "data": "office" // }, { // "text": "不懂", // "data": "extn" // }] // }
        zx_Eidt.init(config);


        //生成一个控件(单元格包含着控件)
        zx_Eidt.zx_EditPage.add('#td_ueditor', {
            "data": "ueditor",
            "text": "内容",
            "controlType": "ueditor"
        });

        var columns = [{
            "data": "date",
            "text": "日期(年月日)",
            "controlType": "date"
        }, {
            "data": "date1",
            "formType": "checkbox",
            "text": "复选",
            "controlType": "form"
        }, {
            "data": "date3",
            "formType": "text",
            "text": "文本框",
            "controlType": "form"
        }, {
            "data": "date4",
            "text": "是否",
            "controlType": "yesno"
        }, {
            "data": "date6",
            "formType": "text",
            "text": "密码",
            "controlType": "form",
            "colspan": 3
        }, {
            "data": "date5",
            "text": "内容",
            "controlType": "ueditor"
        }, {
            "data": "date7",
            "text": "内容",
            "controlType": "ueditor"
        }, {
            "data": "date8",
            "text": "内容",
            "controlType": "ueditor"
        }];

        var data = {
            "date": "zhognxia",
            "date1": "zhognxia6666",
            "date2": 0,
            "date3": "zhognxia444",
            "date4": "zhognxia444",
            "date5": "zhognxia2222",
            "date6": "zhognxia111"
        }

        //直接生成一个表格(编辑页面的表格)
        zx_Eidt.zx_EditPage.addEdit("#dlg", columns);
        zx_Eidt.zx_EditPage.setEditValue(data);
        console.log(zx_Eidt.zx_EditPage.getEditValue());
    });
});
