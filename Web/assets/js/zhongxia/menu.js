//引用该控件需要的类
/*通用的插件*/
document.write('<link rel="stylesheet" type="text/css" href="../assets/css/common.css" />');
document.write('<link rel="stylesheet" type="text/css" href="../assets/css/main.css" />');
document.write('<script type="text/javascript" src="http://apps.bdimg.com/libs/jquery/1.7.2/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/modernizr.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/libs/doT.min.js"></script>');
document.write('<script type="text/javascript" src="../assets/js/zhongxia/utility.js"></script>');
	/*************************************************
        菜单控件   by  zhongxia  in 20150712
        功能:
        1. 动态根据配置生成相对应的菜单列表
        2. 生成的菜单能够缩收,能都设置菜单的点击处理方法
        3. 默认会把菜单的列表赋值在中间的Iframe的src上
        数据源格式:
        prefixId: 每个二级菜单 li  的id  prefixId-i-j  //格式
        data:菜单的配置,分为一级菜单和二级菜单
        {
            "prefixId": "item",
            "data": [{
                "title": "常用操作",
                "children": [{
                    "title": "作品管理",
                    "fontIcon": "&#xe008;",
                    "url": "main.html"
                }, {
                    "title": "博文管理",
                    "fontIcon": "&#xe005;",
                    "url": "TableDemo.html"
                }, {
                    "title": "分类管理",
                    "fontIcon": "&#xe006;",
                    "url": "system.html"
                }, {
                    "title": "留言管理",
                    "fontIcon": "&#xe004;",
                    "url": "UnitTest.html"
                }, {
                    "title": "评论管理",
                    "fontIcon": "&#xe012;",
                    "url": "Table.html"
                }]
            }]
            }
    **************************************************/
    var zx_menu = {
        config: {},
        //配置信息
        init: function(id, config) {

            var html = this.initHTML(config);

            //控件初始化
            $('#' + id).append(html);

            //点击缩收操作
            this.menuTitleClick();
        },
        //生成HTML
        initHTML: function(config) {
            var html = "<ul class=\"sidebar-list\">";

            $.each(config.data, function(index, menus) { //生成一级菜单
                html += ("<li>");
                html += ("   <a href=\"#\" class=\"menuItem\"><i class=\"icon-font\">&#xe003;</i>" + menus.title + "</a>");
                html += ("   <ul class=\"sub-menu\">");

                $.each(config.data[index]["children"], function(i, val) { //生成二级菜单
                    var url = val.url || "#";
                    var fontIcon = val.fontIcon || "&#xe003;";
                    var title = val.title || "Title";
                    html += ("       <li id=\"" + config.prefixId + index + "-" + i + "\"><a name=\"" + url + "\" href=\"#\"><i class=\"icon-font\">" + fontIcon + "</i>" + title + "</a></li>");
                });

                html += ("   </ul>");
                html += ("</li>");
            });

            return html;
        },
        //菜单标题点击事件
        menuTitleClick: function(speed) {
            speed = speed || 200;
            var $uls = $(".menuItem");

            $.each($uls, function(i, ul) {
                var $items = $(ul).next().find("li a");

                //绑定二级菜单的点击事件
                $.each($items, function(index, item) {
                    $(item).on("click", function(e) {
                        e = e || window.event;
                        if (e.stopPropagation) { //W3C阻止冒泡方法  
                            e.stopPropagation();
                        } else {
                            e.cancelBubble = true; //IE阻止冒泡方法  
                        }

                        //设置其他菜单项为默认颜色
                        var $lis = $(".sub-menu li a");
                        $.each($lis, function(i, val) {
                            $(val).css("background", "#FFFFFF");
                        });
                        $(e.target).css("background", "darkseagreen");

                        zx_menu.itemClick(e.target);

                        return false; //使用了这个,超链接就不会跳转到指定页面
                    });
                });

                //绑定一级菜单点击事件
                $(ul).on("click", function(e) {
                    zx_menu.itemTitleClick(); //菜单项点击事件

                    var $ul = $(this).next("ul");
                    if ($ul.css("display") != "none")
                        $ul.slideUp(speed);
                    else
                        $ul.slideDown(speed);
                });
            });

        },
        itemTitleClick: function() {
            //菜单标题点击事件
        },
        itemClick: function() {
            //菜单项点击事件
        }
    }
