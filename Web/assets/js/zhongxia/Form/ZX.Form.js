(function($) {
    //引用子控件的基路径 (设置为 引用该插件的HTML,与该插件位置的相对录几个) 
    $.fn.ZX = $.fn.ZX || {};
    $.fn.ZX.Form = $.fn.ZX.Form || {};
    $.fn.ZX.Form.basePath = "Form/";
    //这里引用了JS, 还有105行有引用JS, 动态引用的
    document.write('<link rel="stylesheet" href="' + $.fn.ZX.Form.basePath + 'plugin/formValidator2.2.4/css/validationEngine.jquery.css">')
    document.write('<script type="text/javascript" src="' + $.fn.ZX.Form.basePath + 'plugin/My97DatePicker/WdatePicker.js"></script>');
    document.write('<script type="text/javascript" src="' + $.fn.ZX.Form.basePath + 'plugin/formValidator2.2.4/jquery.validationEngine.min.js"></script>');
    document.write('<script type="text/javascript" src="' + $.fn.ZX.Form.basePath + 'plugin/Kindeditor/kindeditor-min.js"></script>');
    /*
        author:zhongxia
        time:2015/08/01 
        version:1.0 --> 尾数偶数表示稳定版本,位数奇数表示测试版本
        表单核心    
            1. 实例化控件(各类型文本框,下拉框,复选框,时间选择,富文本框)
            2. 生成控件
            3. 控件布局
            4. 验证控件
            5. 获取表单值
    */
    $.fn.ZX.Form = (function() {
        //表单默认配置
        var _defaultConfig = {
                form: {
                    id: "form1",
                    name: "form1",
                    method: "POST",
                    action: ""
                },
                items: []
            },
            _editors = []; //当前表单里面的富文本对象数组

        /*=============================初始化控件方法===================================*/
        /*
            1.0 创建控件(入口方法)
        */
        var create = function(config) {
            _currentConfig = $.extend({}, _defaultConfig, config);

            var formConfig = _currentConfig.form || {};
            var formItemsConfig = _currentConfig.items || [];
            return init(formConfig, formItemsConfig);
        }

        /*
            1.1 初始化控件
            @param formConfig 表单Form配置
            @param formItems  表单内控件配置
        */
        var init = function(formConfig, formItems) {

            var defaultConfig = $.fn.ZX.Form.defaultConfig;
            var defaultFormConfig = defaultConfig.defaultFormConfig || {};
            formConfig = $.extend({}, defaultFormConfig, formConfig);

            // 创建一个 form  里面包含一个 table
            var form = $.fn.ZX.Form.createCtl.ctl_from(formConfig);
            var $table = $(defaultConfig.defaulttable);
            $(form).append($table);

            //遍历生成控件
            for (var i = 0; i < formItems.length;) {
                var $tr = $('<tr></tr>');
                var colcount = 0;
                while (colcount < defaultConfig.defaultCols) {

                    //配置参数与默认值合并
                    var defaultCtlConfig = defaultConfig.defaultCtlConfig || {};
                    var itemConfig = $.extend({}, defaultCtlConfig, formItems[i]);

                    //控件ID = 表单ID + 控件字段名
                    itemConfig.id = formConfig.id + "_" + itemConfig.id;
                    colcount += itemConfig.colspan + 1;

                    //创建单元格(是否有必填)
                    if (itemConfig.isMust)
                        var $td_left = $('<td style="padding:0 10px;">' + itemConfig.colTitle + defaultConfig.defaulMustHtml + '</td>');
                    else
                        var $td_left = $('<td style="padding:0 10px;">' + itemConfig.colTitle + '</td>');

                    //创建控件
                    var $td = $('<td colspan="' + itemConfig.colspan + '"></td>');
                    var fn = "$.fn.ZX.Form.createCtl.ctl_" + itemConfig.controlId + "(itemConfig)";
                    var ctl = eval(fn);

                    //添加验证 参数:控件  验证类型
                    validate.create(ctl, itemConfig.validateType);

                    //添加控件到表格中
                    $td.append($(ctl));
                    $tr.append($td_left);
                    $tr.append($td);
                    i++;
                }
                $table.append($tr);
            }

            //加载第三方插件(需要在生成标签后才可生成的  eg: Kindeditor ,ueditor )
            //initControl.init($.fn.Form.createCtl.initCtls);

            return $(form);
        }

        /*
            1.2 实例化控件,在标签到页面上之后
        */
        var initControl = {
            //需要的时候才去加载
            kindeditor: $.fn.ZX.Form.basePath + "plugin/Kindeditor/kindeditor-min.js",
            kindeditorBashPath: $.fn.ZX.Form.basePath + "plugin/Kindeditor/",

            //传入需要实例化的控件ID数组
            init: function(options) {
                options = options || [];
                for (var i = 0; i < options.length; i++) {
                    this.initEditor(options[i].id);
                }
            },
            //加载JS并,实例化富文本编辑器
            initEditor: function(id) {
                // $.getScript(this.kindeditor, function() {
                //KindEditor.basePath = initControl.kindeditorBashPath;
                var editor = KindEditor.create('#' + id, {
                    width: "100%",
                    resizeMode: 1,
                    afterBlur: function() {
                        this.sync();
                    },
                    items: [
                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                        'insertunorderedlist', 'lineheight', '|', 'emoticons', 'image', 'multiimage', 'baidumap', 'link', '|', 'fullscreen'
                    ]
                });
                //添加到富文本框对象集合[获取表单值的时候使用]
                _editors.push(editor);
                // });

            }
        };

        /*
            1.3 验证方法
        */
        var validate = {
            create: function(ctl, validateType) {
                //目前支持表单,下拉框,文本域,并且需要有设置ID,Name属性,才能进行验证(否则会混乱)
                var validateNodes = "INPUT,TEXTAREA,SELECT";
                var validateInfo = this.getValidateInfo(validateType);

                var $ctl = $(ctl);
                var nodeName = $ctl[0].nodeName; //大写的标签名
                if (validateNodes.indexOf(nodeName) != -1) { //是JqueryFormvalidate支持的验证控件
                    if (validateInfo) {
                        $ctl.addClass("validate[" + validateInfo + "]");
                    }
                }
            },
            //根据类型,获取验证配置
            getValidateInfo: function(validateType) {
                validateType = validateType || -1;
                var validateInfo = "";
                switch (validateType) {
                    case 1: //必填
                        validateInfo = "required";
                        break;
                    case 10: //URL地址
                        validateInfo = "custom[url]";
                        break;
                    case 11: //最少选中两项
                        validateInfo = "minCheckbox[2]";
                        break;
                    case 12: //最多选中两项
                        validateInfo = "maxCheckbox[2]";
                        break;

                    case 20: //比当前时间大
                        validateInfo = "custom[date],future[NOW]";
                        break;
                    case 21: //要小于2010/01/01
                        validateInfo = "custom[date],past[2010/01/01]";
                        break;

                    case 30: //验证两个密码框相等
                        validateInfo = "equals[" + $(ctl).attr("id") + "]";
                        break;
                    default:
                        validateInfo = "";
                        break;
                }
                return validateInfo;
            }
        };

        /*
            1.4 获取表单的值
        */
        var getValue = function(formId) {
            formId = formId || "";
            //把富文本框的内容,同步到textarea中
            for (var i = 0; i < _editors.length; i++) {
                _editors[i].sync();
            };
            var dataResult = $('#' + formId).serialize();
            var tmp = dataResult.replace(/&/g, "\",");
            tmp = tmp.replace(/=/g, ":\"");
            var jsonValue = eval("({" + tmp + "\"})");
            return jsonValue;
        };

        /*=============================对外开放的方法===================================*/
        return {
            create: create,
            getValue: getValue,
            initControl: initControl
        }
    })();

    /*默认参数*/
    $.fn.ZX.Form.defaultConfig = {
        //必填项的样式
        defaulMustHtml: '<span style="color:red"> (*) </span>',
        //表单里面表格布局的表格
        defaulttable: '<table id="tblForm" border=1 rules="all" style="width:100%;" class="css_Form"></table>',
        //表格默认列数
        defaultCols: 4,
        //默认表单参数
        defaultFormConfig: {
            id: "form1",
            name: "form1",
            method: "POST",
            action: "",
            border: 1
        },
        //默认控件参数
        defaultCtlConfig: {
            /*=========控件属性=============*/
            controlId: 100, //文本框
            id: "id_1",
            name: "name_1",
            isVisible: true,
            event: [], //[用的较少]
            items: [], //[下拉框,复选框组,单选框组 需配置]
            /*=========表格配置(所占列,字段名等)=============*/
            colTitle: "字段",
            colspan: 1,
            /*=========验证配置================*/
            isMust: 1,
            validateType: 1
        }
    }

    /*表单创建控件方法*/
    $.fn.ZX.Form.createCtl = {
        //需要实例化的控件
        initCtls: [],
        //让name字段等于ID字段
        isId2Name: true,
        /*
            创建表单
        */
        ctl_from: function(option) {
            var form = document.createElement("form");
            this.initCtls = []; //清空之前记录表单的控件
            return this.setProperty(form, option);
        },

        /*
            创建文本框  text
        */
        ctl_100: function(option) {
            var input = document.createElement("input");
            input.type = "text";
            return this.setProperty(input, option);
        },

        /*
            创建文本域 textarea
        */
        ctl_101: function(option) {
            var textarea = document.createElement("textarea");
            return this.setProperty(textarea, option);
        },

        /*
            创建下拉框
        */
        ctl_102: function(option) {
            var lst = document.createElement("select");
            lst = $(this.setProperty(lst, option));
            lst.append("<option value=''>===请选择===</option>");

            var items = option.items || [];
            for (var i = 0; i < items.length; i++) {
                lst.append("<option value='" + items[i].value + "'>" + items[i].text + "</option>");
            }
            return lst;
        },

        /*
            创建单选框组
        */
        ctl_103: function(option) {
            var $sp = $("<span>");
            var items = option.items || [];
            for (var i = 0; i < items.length; i++) {
                //创建控件
                var input = this.ctl_100(option);
                input.id = option.id + "_" + i;
                input.value = items[i].value;
                input.type = "radio";
                $sp.append(input);

                var lbl = '<label for="' + option.id + '"> ' + items[i].text + '</label>';
                $sp.append(lbl);
            }
            return $sp;
        },
        /*
            创建复选框组
        */
        ctl_104: function(option) {
            var $sp = $("<span>");
            var items = option.items || [];
            for (var i = 0; i < items.length; i++) {
                //创建控件
                var input = this.ctl_100(option);
                input.id = option.id + "_" + i;
                input.value = items[i].value;
                input.type = "checkbox";
                $sp.append(input);

                var lbl = '<label for="' + option.id + '"> ' + items[i].text + '</label>';
                $sp.append(lbl);
            }
            return $sp;
        },

        /*
            创建日期选择器
        */
        ctl_200: function(option) {
            var $ctl = $('<input  class="Wdate" type="text" onClick="WdatePicker()"/>');
            return this.setProperty($ctl[0], option);
        },

        /*
            创建日期选择器
        */
        ctl_201: function(option) {
            var $ctl = $('<input class="Wdate" type="text" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>')
            return this.setProperty($ctl[0], option);
        },

        /*
            创建KindEditor文本编辑器
        */
        ctl_202: function(option) {
            var ctl = this.ctl_101(option);
            this.initCtls.push(option);
            return ctl;
        },

        /*======================通用的方法===========================*/
        /*
            为控件设置属性参数,以及绑定事件
        */
        setProperty: function(control, option) {
            //如果是Jquery对象,则转JS对象
            if (control[0]) {
                control = control[0];
            }
            option = option || {};
            if (this.isId2Name)
                option.name = option.id.replace(option.id.split('_')[0] + '_', ''); //设置Name值为ID的值
            for (key in option) {
                if (control.hasOwnProperty(key)) { //该控件是否有该属性
                    if (option[key]) //该属性值,是否不为空
                        control[key] = option[key];
                } else if (key == "event" || key == "Event") { //是否为事件
                    for (index in option[key]) {
                        var eventConfig = option[key][index];
                        $(control).on(eventConfig["type"], eventConfig["handler"])
                    }
                }
            }
            return control;
        }
    }

    /*继承到Jquery中,对外部的接口  调用方式: $('#id').createForm(config);*/
    $.fn.createForm = function(config) {
        $(this).html($.fn.ZX.Form.create(config));
        //加载第三方插件(需要在生成标签后才可生成的  eg: Kindeditor )
        $.fn.ZX.Form.initControl.init($.fn.ZX.Form.createCtl.initCtls);
    }

})(jQuery);
