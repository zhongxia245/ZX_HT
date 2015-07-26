//Load common code that includes config, then load the app logic for this page.
require(['common'], function() {
    //加载菜单
    require(['menu'], function() {
        $.getJSON("../data/menu.txt", function(config) {
            zx_menu.init("menu", config);
            zx_menu.itemClick = function(item) {
                var src = $(item).attr("name");
                $("#ifr").attr("src", src);
            };
        });
    });
});
