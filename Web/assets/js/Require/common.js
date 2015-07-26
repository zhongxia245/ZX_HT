/*每个页面都有一个入口,引用都会从这边进入*/
require(['allCSS', 'jquery', 'doT', 'modernizr', 'utility'], function(css,$) {　　　　
	$(document).ready(function() {
            //2. 获取表格的配置
            $.getJSON("../data/tableConfig.txt", function(config) {
                window.tableConfig = config;
            })
            //监听窗体改变事件
            doResize("ifr");
            $(window).resize(function() {
                doResize("ifr");
            });
        });
        /*********************************************
         *       自适应窗体大小
         **********************************************/
        function doResize(id) {
            $("#" + id).height(document.documentElement.offsetHeight - 80);
            $("#" + id).width(document.documentElement.offsetWidth - 195);
        }
});

/*
    RequireJS的配置,配置菜单的位置[这个全局对象]
*/
require.config({　　
    baseUrl: "../assets/js/",
    paths: {　　　　　　
        /*每个页面都需要引用的*/
        "jquery": ["http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min", "libs/jquery.1.11.1"],
        "doT": "libs/doT.min",
        "modernizr": "libs/modernizr.min",

        /*EasyUI,用于弹窗==>后面可能扩展到表格等*/
        "easyui": "plugin/easyui/jquery.easyui.min",

        /*表格控件*/
        "datatable": "plugin/media/js/jquery.dataTables.min",

        /*时间控件*/
        "WdatePicker":"plugin/My97DatePicker/WdatePicker",

        /*富文本框*/
        "umeditor.config":"plugin/umeditor1_2_2/umeditor.config",
        "umeditor":"plugin/umeditor1_2_2/umeditor.min",
        "zh-cn":"plugin/umeditor1_2_2/lang/zh-cn/zh-cn",

        /*自主开发的JS*/
        "utility": "zhongxia/utility",    //工具控件,从地址栏获取参数
        "allCSS": "zhongxia/referenceAllCSS",  //引入所有CSS
        "menu": "zhongxia/menu",  //根据配置生成菜单插件
        "eidtPage": "zhongxia/eidtPage",  //编辑页面插件
		"zx_datatable":"zhongxia/zx_datatable"
    },
    shim: {
        "menu": {
            "deps": ['jquery'] //依赖Jquery
        },
        "easyui": {
            "deps": ["jquery"]
        },
        "datatable": {
            "deps": ["jquery"]
        }
    }
});
