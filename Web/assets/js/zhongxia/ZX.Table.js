(function($) {
    //引用子控件的基路径 (设置为 引用该插件的HTML,与该插件位置的相对录几个) 
    $.fn.ZX = $.fn.ZX || {};
    $.fn.ZX.Table = $.fn.ZX.Table || {};
    $.fn.ZX.Table.basePath = "";
    /*加载样式*/
    document.write('<link rel="stylesheet" type="text/css" href="' + $.fn.ZX.Table.basePath + '../plugin/easyui/themes/bootstrap/easyui.css">');
    document.write('<link rel="stylesheet" type="text/css" href="' + $.fn.ZX.Table.basePath + '../plugin/easyui/themes/icon.css">');
    /*加载脚本*/
    document.write('<script type="text/javascript" src="' + $.fn.ZX.Table.basePath + '../plugin/easyui/jquery.easyui.min.js"></script>');
    document.write('<div><script type="text/javascript" src="' + $.fn.ZX.Table.basePath + '../plugin/easyui/locale/easyui-lang-zh_CN.js"></script></div>');

    $.fn.ZX.Table = (function() {
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
            showFooter: true, // 定义是否显示行脚。 
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

        var _editId = "#edit"; //编辑页面ID
        var _tbid = "#tb"; //表格ID
        var _dg; //表格对象
        var _tBconfig;
        var _zx_Form;

        /*=================定义变量 END===================*/

        /*=================定义外部方法 START===================*/
        /*
            控件的入口
            @param  tbid  表格标签ID
            @param  editId  编辑页面ID
            @param  options 表格配置信息
            @param  zxForm  编辑页面JS类对象
        */
        var init = function(tbid, options, editId, zxForm) {
            _tbid = tbid;
            _editId = editId;
            _zx_Form = zxForm;

            options = $.extend({}, defaultOptions, options);

            _tBconfig = options; //20150726  保存配置信息
            console.log(_tBconfig);
            _dg = $(_tbid).datagrid(options);
        }

        /*=================定义外部方法 END===================*/

        /*=================定义内部方法 START===================*/
        /*
            添加数据
        */
        var _add = function() {
            // var columns = plugin_edit.fn_getColumnsConfig(); //获取编辑页面的配置信息
            // plugin_edit.setEditValue(columns);
            _openDialog("添加页面", _addSign);
        }

        /*
            更新数据
        */
        var _update = function() {
            // var columns = plugin_edit.fn_getColumnsConfig(); //获取编辑页面的配置信息
            //选中一个行编辑
            var row = $(_tbid).datagrid('getSelected');
            console.log(row);
            if (row) {
                // plugin_edit.setEditValue(columns, row); //设置编辑页面内容
                _openDialog("编辑页面", _updateSign);
            } else {
                //复选框勾选一个行编辑
                var rows = $(_tbid).datagrid('getChecked');
                if (rows.length != 0) {
                    row = rows[0];
                    // plugin_edit.setEditValue(columns, row); //设置编辑页面内容
                    _openDialog("编辑页面", _updateSign);
                }
            }

        }

        /*
            删除数据
        */
        var _remove = function() {
            var rows = $(_tbid).datagrid('getChecked');
            if (rows) {
                var delIds = "";
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    delIds += row["ID"] + ",";
                    //var index = $('#' + _tBid).datagrid('getRowIndex', row);
                    //$('#' + _tBid).datagrid('deleteRow', index);  //删除一行
                }
                delIds = delIds.substr(0, delIds.length - 1);
                if (delIds) {
                    $.messager.confirm('温馨提示', '您准备删除' + rows.length + '条记录,是否确定?', function(r) {
                        if (r) {
                            var url = _tBconfig.url_delete;
                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    ID: delIds
                                },
                                success: function(json) {
                                    reloadData();
                                },
                                error: function(xhr, textStatus, errorThrown) {
                                    // $.messager.alert('温馨提示', xhr.responseText.split('源文件:')[0], 'error');
                                    $.messager.alert('温馨提示', "Error:删除记录失败!", 'error');
                                }
                            });
                        }
                    });
                }
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

            var $form = $(_editId + " form");

            $(_editId).show();
            $(_editId).dialog({
                width: 700,
                height: 400,
                modal: true,
                title: title,
                maximizable: false,
                minimizable: false,
                collapsible: true,
                onBeforeClose: function() { //关闭窗体之前做的操作
                    $form.validationEngine('hide'); //隐藏验证提示
                    $form.validationEngine("detach"); //关闭验证
                },
                buttons: [{
                    text: btn_text,
                    handler: function(e) {
                        //添加验证信息
                        $form.validationEngine('attach', { //添加上这个方法,就可以输入内容后,提示框没掉
                            scroll: true,
                            focusFirstField: true
                        });

                        fn_PreValidate(this, flag);
                        //验证表单信息
                        if ($form.validationEngine('validate')) {
                            //TODO: 区分添加和删除,添加则弹出是否继续添加  20150722
                            fn_PreSave(this, flag);
                            //保存
                            fn_Save(this, flag);
                            $form.validationEngine('hide'); //隐藏验证提示
                            $form.validationEngine("detach"); //关闭验证
                            fn_NextSave(this, flag);
                        }
                    }
                }, {
                    text: "重置",
                    handler: function() {
                        $form[0].reset(); //Jquery没有重置功能
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

            if (flag == _addSign) url = _tBconfig.url_add;
            else url = _tBconfig.url_update;

            var formId = $(_editId + " form").attr('id');
            var data = _zx_Form.getValue(formId);

            console.log(data);
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(json) {
                    if (flag == _addSign) { //添加
                        $.messager.confirm('温馨提示', '添加成功,是否继续添加?', function(r) {
                            if (r) {

                            } else {
                                $(_editId).dialog("close");
                            }
                            reloadData(); //重新加载表格数据
                        });
                    } else if (flag == _updateSign) { //修改
                        $.messager.alert('温馨提示', '保存成功!', 'info');
                        $(_editId).dialog("close");
                        reloadData();
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    // $.messager.alert('温馨提示', xhr.responseText.split('源文件:')[0], 'error');
                    $.messager.alert('温馨提示', "Error:" + flag + "失败~", 'error');
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
    })();
})(jQuery)
