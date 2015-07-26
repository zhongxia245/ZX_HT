/*每个页面都有一个入口,引用都会从这边进入*/
require(['allCSS', 'jquery', 'doT', 'modernizr', 'datatable', 'easyui', 'menu', 'utility'], function(css, $, doT, modernizr, datatable, zx_menu) {　　　　
    // some code here
    console.log('main start ');
    $(document).ready(function() {
        //2. 获取表格的配置
        $.getJSON("../data/tableConfig.txt", function(config) {
            window.tableConfig = config;
            console.log('tableConfig start ');
        });
        $.getJSON("../data/tableFieldConfig.txt", function(fieldConfig) {
            window.tableFieldConfig = fieldConfig;
            console.log('tableFieldConfig start ');
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
    RequireJS的配置,配置菜单的位置
*/
require.config({　　
    baseUrl: "../assets/js/",
    　　
    paths: {　　　　　　
        "jquery": ["http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min", "libs/jquery.1.11.1"],
        "doT": "libs/doT.min",
        "modernizr": "libs/modernizr.min",
        "utility": "zhongxia/utility",
        "datatable": "plugin/media/js/jquery.dataTables.min",
        "easyui": "plugin/easyui/jquery.easyui.min",
        "allCSS": "zhongxia/referenceAllCSS",
        "menu": "zhongxia/menu"
    },
    shim: {
        "menu": {
            "deps": ['jquery'], //依赖Jquery
            "exports": "menu", //输出名称
            init: function(menu) {
                $.getJSON("../data/menu.txt", function(config) {
                    zx_menu.init("menu", config);
                    zx_menu.itemClick = function(item) {
                        var src = $(item).attr("name");
                        $("#ifr").attr("src", src);
                    };
                });
            }
        },
        "easyui": {
            "deps": ["jquery"]
        },
        "datatable": {
            "deps": ["jquery"]
        }
    }
});
