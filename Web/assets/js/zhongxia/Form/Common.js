var zhongxia = (function() {
    //合并对象[JS方法]
    var extend = function(defaultParams, params) {
        var value = new Object();
        //0. 如果没传值,则默认为空对象
        defaultParams = defaultParams || {};
        params = params || {};

        //1. 遍历默认的参数,放到新建的对象中
        for (key in defaultParams) {
            value[key] = defaultParams[key];
        }

        //2. 把最新的数据替换掉默认的数据(同时存在遍替换,否则都添加到对象中)
        for (key in params) {
            value[key] = params[key];
        }
        return value;
    };

    /*
        事件管理器
        */
    var EventManage = (function() {
        var addEvent = function(element, type, handler) {
            //为每一个事件处理函数分派一个唯一的ID
            if (!handler.$$guid) handler.$$guid = addEvent.guid++;
            //为元素的事件类型创建一个哈希表
            if (!element.events) element.events = {};
            //为每一个"元素/事件"对创建一个事件处理程序的哈希表
            var handlers = element.events[type];
            if (!handlers) {
                handlers = element.events[type] = {};
                //存储存在的事件处理函数(如果有)
                if (element["on" + type]) {
                    handlers[0] = element["on" + type];
                }
            }
            //将事件处理函数存入哈希表
            handlers[handler.$$guid] = handler;
            //指派一个全局的事件处理函数来做所有的工作
            element["on" + type] = handleEvent;
        };
        //用来创建唯一的ID的计数器
        addEvent.guid = 1;

        var removeEvent = function(element, type, handler) {
            //从哈希表中删除事件处理函数
            if (element.events && element.events[type]) {
                delete element.events[type][handler.$$guid];
            }
        };

        var handleEvent = function(event) {
            var returnValue = true;
            //抓获事件对象(IE使用全局事件对象)
            event = event || fixEvent(window.event);
            //取得事件处理函数的哈希表的引用
            var handlers = this.events[event.type];
            //执行每一个处理函数
            for (var i in handlers) {
                this.$$handleEvent = handlers[i];
                if (this.$$handleEvent(event) === false) {
                    returnValue = false;
                }
            }
            return returnValue;
        };
        //为IE的事件对象添加一些“缺失的”函数
        var fixEvent = function(event) {
            //添加标准的W3C方法
            event.preventDefault = fixEvent.preventDefault;
            event.stopPropagation = fixEvent.stopPropagation;
            return event;
        };
        fixEvent.preventDefault = function() {
            this.returnValue = false;
        };
        fixEvent.stopPropagation = function() {
            this.cancelBubble = true;
        };

        return {
            addEvent: addEvent,
            removeEvent: removeEvent,
            handleEvent: handleEvent,
            preventDefault: fixEvent.preventDefault,
            stopPropagation: fixEvent.stopPropagation
        }
    })();


    return {
        extend: extend,
        EventManage: EventManage
    }
})();
