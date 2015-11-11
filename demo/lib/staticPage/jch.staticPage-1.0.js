//2013年12月11日16:47:43
/*  ========staticPage说明==========


***********************
*                     
*      调用方法        
*                     
***********************
$.staticPage({option});

【参数说明】
--页面jquery对象--
name:       "时间"       插件名，
.                       如果一个网页中使用了多次本插件或调用结束后需要在外侧调用/绑定内部函数都需要填写
.                       如果不填写则自动设定为当前时间的数字字符串
jqPages:    $()         所有要切换的静态页jq对象
jqNext:     $()         执行[下一页]动作的jq对象
jqPrev:     $()         执行[上一页]动作的jq对象
jqLast:     $()         执行[最后页]动作的jq对象
jqFirst:    $()         执行[第一页]动作的jq对象
jqNavi:     $()         执行[序号翻页]动作jq对象
--设置--
selNavi:    undefined,  序号翻页导航条内的jq索引
.                       注意：只有当序号索引元素和其他元素在同一元素内才需要设置此参数
.                       例如，<a>第一页</a><a class="p">①</a><a class="p">②</a><a class="p">③</a><a>最后页</a>
.                       如上结构，因为索引序号翻页使用index()函数，而因为有其他元素与之在同一元素内会造成index()错误
.                       此时就需要将此属性设置为".p"，用于index()函数在同级内过滤元素
selPages:   undefined   主内容页的元素内jq索引
.                       功能同上，不冲突时不要填写
event:      "click"     给上述对象绑定的响应jq事件名（默认click事件）
eventNext:  undefined   触发“下一页”的事件。
.                       注：此处如果不填写则默认使用event的事件值，如果填写则按照填写的事件来触发
.                       例：如果焦点图只有导航条是使用鼠标悬停，其他按钮都使用点击，则
.                       代码为：{event:click,eventNavi:mouseover}即可，其他未填写的按照event来执行
eventPrev:  undefined   触发“上一页”的事件。
eventLast:  undefined   触发“最后页”的事件。
eventFirst: undefined   触发“第一页”的事件。
eventNavi:  undefined   触发“导航条”的事件。
effect:     {option}    主页面切换效果（详细说明见下方）
isLoop:     false       是否轮播，即在最后一页继续按下一页是否会跳回第一页
isAutoNavi: false       是否根据主内容页自动生成序号导航（只有jqNavi中至少有一个对象时才有效）
.                       如果为true，则会将原文档的导航对象中除第一个以外的所有对象删除！
.                       并根据主内容页的数量复制第一个导航对象来生成，如果无序号导航对象则不执行
autoNaviFn: $.noop      自动生成序号导航时的调用函数（只在开启了isAutoNavi属性后才生效）
.                       程序默认生成所有节点的InnerHTML为Page页数字，1,2,3,4...
.                       如果要生成[第一页，第二页或首篇，次篇，三篇]等则需要调用此函数来详细定制
.                       函数签名：fn(index)
.                       函数说明：在函数中可以使用this，表示序号导航的副本对象。参数index表示当前的页码
.                       示例，如果要生成[第一页，第二页]此类型的，函数为：
.                       function (i) { var str = "一二三四五"; $(this).html("第" + str[i - 1] + "页"); }
isShowLog:  false       是否显示Log级别的输出，其他级别的不受影响
isAnimeQueue:false      是否允许动画列队，如果设置为true，则动画将累积
--事件--
onNextFocus: $.noop     当点击“下一页”时触发此事件
.                       函数签名：fn(e,sp)
.                       函数说明：函数内this，表示触发事件的元素；参数e表示事件对象；参数sp表示当前staticPage对象。
.                       所有事件前发生的函数均可返回false来阻止事件的发生。
.                       以下foucs类事件使用方法相同
onNextFocused:  $.noop  当点击“下一页”完成后触发此事件
onPrevFocus:    $.noop  当点击“上一页”时触发此事件
onPrevFocused:  $.noop  当点击“上一页”完成后触发此事件
onLastFocus:    $.noop  当点击“最后页”时触发此事件
onLastFocused:  $.noop  当点击“最后页”完成后触发此事件
onFirstFocus:   $.noop  当点击“第一页”时触发此事件
onFirstFocused: $.noop  当点击“第一页”完成后触发此事件
onNaviFocus:    $.noop  当点击“导航项”时触发此事件
onNaviFocused:  $.noop  当点击“导航项”完成后触发此事件
onInit:         $.noop  初始化前触发
.                       函数签名：fn()。函数说明：函数内使用this表示当前staticPage对象
.                       若返回false可阻止init函数执行，即不执行staticPage插件
onInited:       $.noop  初始化完成后触发，同上





***********************
*                     
*      其他说明        
*                     
***********************
【关于插件名称】
本插件可以在一次调用完成后，在外侧多次调用内部函数，也可以在一个页面内多次使用本插件
如果需要多次使用，或外侧调用则必须使用插件名称
从外部调用内部函数方法有2种：
1，window.jch.staticPage.名称.lastPage()
2，$.staticPage({name:"名称"}).naviPage(undefined,0);//跳转至index为0的页面
获取活动对象的设置的名称：
onStart:function(){this.myName};


【关于切换效果】
effect:     {}          主页面切换效果
{
name:       "fade"      效果名称
->          "none"      无任何特效，用户自行设定切换特效
->          "defaultEff"默认特效，直接切换
->          "fadeSync"  同步淡入淡出
->          "fade"      先淡出后淡入
->          "crossHor"  水平穿插
->          "moveHor"   水平移动
->          "moveVer"   垂直移动
->          "shutter"   百叶窗(暂无)
speed:      "normal"    切换速度
speedOut:   undefined   当前页退出时的速度(不填写则按照speed来执行)
speedIn:    undefined   下一页进入时的速度(同上)
easing:     "swing"     动画缓动插件名
easingOut:  undefined   当前页退出时的缓动插件名(不填写则按照easing来执行)
easingIn:   undefined   下一页进入时的缓动插件名(同上)
onPageOut:  $.noop      当当前页退出后执行的函数
.                       函数签名：fn(sp)
.                       函数说明：函数内this，表示执行完成的page对象；参数sp表示当前staticPage对象。
.                       注：当使用特效名称为none时，函数签名为fn(sp, dstIndex, effObj)
.                       第二三个参数分别表示为要切换到的index值与特效选项。none特效不执行任何动作，用于用户自定义切换特效
onPageIn:   $.noop      当下一项进入后执行的函数,函数签名用户同onPageOut。
isReverse:  true        当逆向翻页时是否使用反向动画
.                       （注:①只有部分切换效果有效，②如果使用false，则所有效果只向右/下播放）
defaultEff: "fade"      如果当前浏览器不支持此效果则调用的默认效果（用于部分HTML5效果）
onStart:    $.noop      特效开始执行时触发此事件
.                       函数签名:fn(currIndex,dstIndex)
.                       函数说明：函数内使用this表示当前staticPage对象，currIndex表示当前页index，dstIndex表示要切换到的页index
.                       若返回false可阻止特效执行
onCompleted:$.noop      特效执行完成后触发此事件
.                       函数签名：fn()，函数内使用this表示当前staticPage对象
}



【动态增加主Page页】
使用aja或其他动态增加内容页后是无法进入到播放序列里的，需要执行：
1，window.jch.staticPage.名称.setting.jqPages=<主Page页jq对象>
此时已可以使用上一页和下一页，如需要使用序号导航则执行：
2，window.jch.staticPage.名称.init.autoNavi()
此时已经可以显示序号导航项，但是新增项无法点击跳转，需要执行：
3，<新增项jq对象>.click(function () {  window.jch.staticPage.名称.naviPage.call(this); })




【外层调用函数】
PageEffect  Object  页面切换效果集合	
setting     Object  staticPage插件设置，即参数列表
spEvent	    Object  特殊事件
->mouseRoll Fn      鼠标滚动
->mouseLoca Fn      鼠标坐标
tools	    Object  工具集
->imgSwitch Fn      2张图片切换
init	    Fn      初始化焦点图
->autoNavi	Fn      自动生成导航条项
firstPage	Fn      第一页
.                   函数签名：fn(e)
.                   函数说明：参数e表示触发事件的对象
.                   使用示例：若在外侧添加一个按钮点击可实现“第一页”的效果。
.                   示例代码：window.jch.staticPage.名称.firstPage();
lastPage	Fn      最后页,使用方法同上
nextPage	Fn      下一页,使用方法同上
prevPage	Fn      上一页,使用方法同上
naviPage	Fn      导航跳转(index跳转)
.                   函数签名：fn(e,dstIndex)
.                   函数说明：参数e表示触发事件的对象，参数dstIndex表示要切换到的index值
.                   使用示例：若焦点图有两个导航条
.                   示例代码：window.jch.staticPage.名称.naviPage(undefined,$(this).index());




***********************
*                     
*      工具包说明        
*                     
***********************

1、【imgSwitch】

功能：2张图片交替显示
签名：imgSwitch({data})
参数：data {}
{
.   jqObj:    必须，jq对象，要切换图片的上级jq对象
.   inEvent:  可选，字符串，开始切换事件，默认mouseover
.   outEvent: 可选，字符串，结束切换事件，默认mouseout
.   denyFunc: 可选，函数，满足某个条件则不替换，如果返回true则不执行
.             函数参数包括以上这几个对象，加触发事件的event事件对象
}
页面结构应类似于:<div><img style='display:none' src='...'><img src='...'/></div>

示例1：
鼠标移动到左右两个按钮上更换按钮的背景图片
imgSwitch({ jqObj: $focusItem, inEvent: "mouseover", outEvent: "mouseout", denyFunc: $.noop });

示例2：
若想要鼠标进入不切换而只在移出时切换可传如下denyFunc函数
imgSwitch({ jqObj: $focusItem, inEvent: "mouseover", outEvent: "mouseout", denyFunc: function (data) {
.   if (data.event.type == "mouseover" && $(this).index() == 0) {
.       console.log("移入无变化");
.       return true;
.   } else if (data.event.type == "mouseout" && $(this).index() == 0) {
.       console.log("移出变化");
.       return false;
.   }
});

*/
(function ($) {
    var jch = window.jch = window.jch || {};
    jch.namespace = function (ns) {
        if (!ns || !ns.length) { return null; }
        var levels = ns.split(".");
        var nsroot = jch;
        for (var i = (levels[0] == "jch") ? 1 : 0; i < levels.length; ++i) {
            //如果当前命名空间下不存在，则新建一个关联数组。
            nsroot[levels[i]] = nsroot[levels[i]] || {};
            nsroot = nsroot[levels[i]];
        }
        //返回所申请命名空间的一个引用；
        return nsroot;
    }

    $.staticPage = function (option) {
        if (typeof (this) != "function") return this; //禁止$.staticPage({option})方式以外的所有调用
        option = option || {};
        option.name = option.name || new Date().getTime().toString();
        var spObj = jch.namespace("jch.staticPage");
        var spName = option.name;
        return (!!spObj[spName]) ? spObj[spName] : spObj[spName] = new staticPage(option);
    }
    var staticPage = function (option) {
        var myStaticPage = this;
        //传入设置的默认值
        var setting = this.setting = {
            //页面jQuery对象
            jqPages: $(),
            jqNext: $(),
            jqPrev: $(),
            jqLast: $(),
            jqFirst: $(),
            jqNavi: $(),
            //设置
            selNavi: undefined,
            selPages: undefined,
            event: "click",
            eventNext: undefined,
            eventPrev: undefined,
            eventLast: undefined,
            eventFirst: undefined,
            eventNavi: undefined,
            effect: {
                name: "fade",
                speed: "normal",
                speedOut: undefined,
                speedIn: undefined,
                easing: "swing",
                easingOut: undefined,
                easingIn: undefined,
                onPageOut: $.noop,
                onPageIn: $.noop,
                isReverse: true,
                defaultEff: "fade",
                onStart: $.noop,
                onCompleted: $.noop
            },
            isLoop: false,
            isAutoNavi: false,
            autoNaviFn: $.noop,
            isShowLog: false,
            isAnimeQueue: false,
            //触发事件
            onNextFocus: $.noop,
            onNextFocused: $.noop,
            onPrevFocus: $.noop,
            onPrevFocused: $.noop,
            onLastFocus: $.noop,
            onLastFocused: $.noop,
            onFirstFocus: $.noop,
            onFirstFocused: $.noop,
            onNaviFocus: $.noop,
            onNaviFocused: $.noop,
            onInit: $.noop,
            onInited: $.noop
        };
        //注：setting和this.setting不是一个东西。
        //此处对象合并后并进行对象赋值，引用地址相同，setting和this.setting将同步。
        setting = jQuery.extend(true, setting, option);



        //初始化
        var init = this.init = function () {
            //注：此处由于使用init.call(this);来调用init函数，所以此处this.init指向外层staticPage的init对象
            //如果直接使用“init()”调用，则会导致将autoNavi函数绑定到window.init对象上 

            //触发开始初始化事件
            if (setting.onInit.call(this) === false) { messLog("init stop!"); return; }
            //初始化setting设置
            setting.eventNext = addNameSpace(setting.eventNext || setting.event);
            setting.eventPrev = addNameSpace(setting.eventPrev || setting.event);
            setting.eventLast = addNameSpace(setting.eventLast || setting.event);
            setting.eventFirst = addNameSpace(setting.eventFirst || setting.event);
            setting.eventNavi = addNameSpace(setting.eventNavi || setting.event);
            setting.effect.speedOut = setting.effect.speedOut || setting.effect.speed;
            setting.effect.speedIn = setting.effect.speedIn || setting.effect.speed;
            setting.effect.easingOut = setting.effect.easingOut || setting.effect.easing;
            setting.effect.easingIn = setting.effect.easingIn || setting.effect.easing;
            function addNameSpace(ev) { return (ev.match(setting.name) != null) ? ev : ev += "." + setting.name + ".staticPage.jch"; }

            this["myName"] = setting.name;
            for (var i in this) { this[i]["myName"] = i; }


            //自动生成序号导航           
            var autoNavi = this.init.autoNavi = function () {
                var first;
                if (setting.jqNavi.length == 0)
                { return; }
                else if (setting.jqNavi.length == 1)
                { first = setting.jqNavi.eq(0); }
                else if (setting.jqNavi.length > 1) {
                    first = setting.jqNavi.first(); //除一个全部删除
                    first.siblings(setting.selNavi).remove();
                    setting.jqNavi = first; //重置jqNavi对象（not函数不好用:-(）
                }
                for (var i = 0; i < setting.jqPages.length - 1; i++) {
                    var item = first.clone();
                    var pages = setting.jqPages.length - i;
                    item.html(pages);
                    setting.autoNaviFn.call(item, pages);
                    first.after(item);
                }
                //把重构后的导航对象添加到setting里
                setting.jqNavi = setting.jqNavi.add(first.siblings(setting.selNavi));
            }
            if (!!setting.isAutoNavi && setting.jqNavi.length != 0) autoNavi();


            //如果页面没有当前项设定则把第一个Page设置为当前项
            setCurrentItem(setting.jqPages);
            setCurrentItem(setting.jqNavi);
            getCurrPage().eq(0).siblings(setting.selPages).hide(0);
            getCurrNavi().eq(0).siblings(setting.selNavi).removeClass("current");
            //index不符按照主内容页index为准
            if (getCurrPage() != getCurrNavi()) changeNavi(getCurrPageIndex());


            //注册事件
            eventBind(setting.jqNext, setting.eventNext, function (e) { nextPage.call(this, e); });
            eventBind(setting.jqPrev, setting.eventPrev, function (e) { prevPage.call(this, e); });
            eventBind(setting.jqLast, setting.eventLast, function (e) { lastPage.call(this, e); });
            eventBind(setting.jqFirst, setting.eventFirst, function (e) { firstPage.call(this, e); });
            eventBind(setting.jqNavi, setting.eventNavi, function (e) { naviPage.call(this, e); });
            function eventBind(jqObj, event, fn) {
                jqObj.unbind(event);
                jqObj.bind(event, fn);
            }

            //初始化完成
            setting.onInited.call(this);
        }



        //********************
        //
        //      帮助函数
        //
        //*********************


        //获取窗口宽度
        function getWindowWidth() {
            if (typeof _windowWidth == "string" && _windowWidth == "auto")
                return $(window).width();
            else if (typeof _windowWidth == "number")
                return _windowWidth;
            else
                return $contBox.width();
        }
        //输出错误信息
        function messError(args) {
            if (!window["console"]) return;
            if (!!$.browser.msie)
                console.error(getArgumensArr(arguments).toString());
            else
                console.error.apply(console, getArgumensArr(arguments));
        }

        //输出日志
        function messLog(args) {
            if (!window["console"] || !setting.isShowLog) return;
            if (!!$.browser.msie)
                console.log(getArgumensArr(arguments).toString());
            else
                console.log.apply(console, getArgumensArr(arguments));
        }

        //将arguments转换成控制台输出的格式并添加来源
        function getArgumensArr(arg) {
            return myUnshift(Array.prototype.slice.call(arg), myStaticPage.setting.name + ":");
            function myUnshift(arr, obj) {
                arr.unshift(obj);
                return arr;
            }
        }

        //返回当前数字导航项jq对象
        //如果找不到则返回第一项
        function getCurrNavi() {
            var curr = setting.jqNavi.filter(".current").eq(0);
            if (curr.length == 0) curr = setting.jqNavi.eq(0);
            return curr;
        }

        //返回数字导航栏的当前页index
        //*如果加上参数则返回当前对象在所有导航栏对象中的index
        function getCurrNaviIndex(jqNavi) {
            var jqobj = setting.jqNavi;
            if (!!jqNavi)
                return jqobj.index(jqNavi);
            else
                return jqobj.filter(".current").eq(0).index(setting.selNavi);
        }

        //返回当前内容页jq对象
        function getCurrPage(jqPages) {
            var curr = setting.jqPages.filter(".current").eq(0);
            if (curr.length == 0) curr = setting.jqPages.eq(0);
            return curr;
        }

        //返回内容页面的当前页index
        //*如果加上参数则返回当前对象在所有内容页对象中的index
        var getCurrPageIndex = this.getCurrPageIndex = function(jqPages) {
            var jqobj = setting.jqPages;
            if (!!jqPages)
                return jqobj.index(jqPages);
            else
                return jqobj.filter(".current").eq(0).index(setting.selPages);
        };

        //检查jq对象组中所有元素是否包含指定class，如果不包含则把第一项添加指定class
        function setCurrentItem(jqObj, className) {
            if (!className) className = "current";
            if (jqObj.filter(function () {
                var clas = $(this).attr("class");
                if (!clas) return false;
                return clas.indexOf(className) >= 0;
            }).length == 0)
            { jqObj.eq(0).addClass(className); }
        }


        //********************
        //
        //     功能实现函数
        //
        //*********************


        //切换主内容页面
        function changePage(dstIndex, sender, callback) {
            //messLog("参数序号："+dstIndex);
            if (typeof (dstIndex) == "undefined") dstIndex = 0;
            var last = setting.jqPages.length - 1;
            dstIndex = dstIndex < 0 ? (!!setting.isLoop ? last : 0) : dstIndex;
            dstIndex = dstIndex > last ? (!!setting.isLoop ? 0 : last) : dstIndex;
            //messLog("目标序号"+dstIndex);
            var currIndex = getCurrPageIndex();
            if (dstIndex == currIndex) return;

            //按照设定切换特效来切换页面
            var eff = undefined;
            for (var i in PageEffect)
            { if (i == setting.effect.name) eff = i; }
            setting.effect = jQuery.extend(true, setting.effect, { sender: sender });
            if (setting.effect.onStart.call(myStaticPage, currIndex, dstIndex) === false) { messLog("onStart stop!"); return; }
            PageEffect[(!!eff) ? eff : "defaultEff"](dstIndex, setting.effect, changePageCallBack);

            //变更导航焦点
            //changeNavi(dstIndex);

            function changePageCallBack() {
                //此处this表示myStaticPage对象
                changeNavi(dstIndex);
                setting.effect.onCompleted.call(this);
                callback.call(this);
            }
        }

        //下一页
        var nextPage = this.nextPage = function (e) {
            if (setting.onNextFocus.call(this, e, myStaticPage) === false) { messLog("onNextFocus stop!"); return; }
            changePage(getCurrPageIndex() + 1, myStaticPage.nextPage, function () {
                setting.onNextFocused.call(this, e, myStaticPage);
            });
        }

        //上一页
        var prevPage = this.prevPage = function (e) {
            if (!setting.onPrevFocus.call(this, e, myStaticPage) === false) { messLog("onPrevFocus stop!"); return; }
            changePage(getCurrPageIndex() - 1, myStaticPage.prevPage, function () {
                setting.onPrevFocused.call(this, e, myStaticPage);
            });
        }

        //最后一页
        var lastPage = this.lastPage = function (e) {
            if (!setting.onLastFocus.call(this, e, myStaticPage) === false) { messLog("onLastFocus stop!"); return; }
            changePage(setting.jqPages.length - 1, myStaticPage.lastPage, function () {
                setting.onLastFocused.call(this, e, myStaticPage);
            });
        }

        //第一页
        var firstPage = this.firstPage = function (e) {
            if (!setting.onFirstFocus.call(this, e, myStaticPage) === false) { messLog("onFirstFocus stop!"); return; }
            changePage(0, myStaticPage.firstPage, function () {
                setting.onFirstFocused.call(this, e, myStaticPage);
            });
        }

        //直接跳转至指定Index页
        var naviPage = this.naviPage = function (e, dstIndex) {
            //var index = setting.jqNavi.index($(this));
            if (!setting.onNaviFocus.call(this, e, myStaticPage) === false) { messLog("onNaviFocus stop!"); return; }
            if (!!dstIndex || typeof (dstIndex) == "number")
                changePage(dstIndex, myStaticPage.naviPage, function () {
                    setting.onNaviFocused.call(this, e, myStaticPage);
                });
            else
                changePage(getCurrNaviIndex($(this)), myStaticPage.naviPage, function () {
                    setting.onNaviFocused.call(this, e, myStaticPage);
                });
        }

        //序号导航切换
        var changeNavi = function (dstIndex) {
            var naviBox = getCurrNavi().parent();
            getCurrNavi().removeClass("current");
            naviBox.children(setting.selNavi).eq(dstIndex).addClass("current");
        }

        //主页面切换效果
        var PageEffect = this.PageEffect = {
            //不执行任何动作
            none: function (dstIndex, effObj, callback) {
                effObj.onPageOut.call(this, myStaticPage, dstIndex, effObj);
                effObj.onPageIn.call(this, myStaticPage, dstIndex, effObj);
                callback.call(myStaticPage);
            },
            //默认效果，直接切换
            defaultEff: function (dstIndex, effObj, callback) {
                var pageBox = getCurrPage().parent();
                getCurrPage().removeClass("current").hide(0, function () {
                    effObj.onPageOut.call(this, myStaticPage);
                });
                pageBox.children(setting.selPages).eq(dstIndex).addClass("current").show(0, function () {
                    effObj.onPageIn.call(this, myStaticPage);
                    callback.call(myStaticPage);
                });
            },
            //同步淡入淡出
            fadeSync: function (dstIndex, effObj, callback) {
                var pageBox = getCurrPage().parent();
                if (setting.jqPages.is(":animated") && !setting.isAnimeQueue) return;
                getCurrPage().removeClass("current")
                .fadeOut(effObj.speedOut, effObj.easingOut, function () {
                    effObj.onPageOut.call(this, myStaticPage);
                });
                pageBox.children(setting.selPages).eq(dstIndex).addClass("current")
                .fadeIn(effObj.speedIn, effObj.easingIn, function () {
                    effObj.onPageIn.call(this, myStaticPage);
                    callback.call(myStaticPage);
                });
            },
            //完全淡出后再淡入
            fade: function (dstIndex, effObj, callback) {
                var pageBox = getCurrPage().parent();
                if (setting.jqPages.is(":animated") && !setting.isAnimeQueue) return;
                getCurrPage().removeClass("current")
                .fadeOut(effObj.speedOut, effObj.easingOut, function () {
                    effObj.onPageOut.call(this, myStaticPage);
                    pageBox.children(setting.selPages).eq(dstIndex).addClass("current")
                    .fadeIn(effObj.speedIn, effObj.easingIn, function () {
                        effObj.onPageIn.call(this, myStaticPage);
                        callback.call(myStaticPage);
                    });
                });
            },
            //水平穿插效果
            crossHor: function (dstIndex, effObj, callback) {
                var pageBox = getCurrPage().parent();
                var width = getCurrPage().get(0).offsetWidth;
                var widthMinus = width * -1;
                var currIndex = getCurrPageIndex();
                var pageLast = setting.jqPages.length - 1;
                var sender = effObj.sender.myName;
                if (setting.jqPages.is(":animated") && !setting.isAnimeQueue) return;
                if (dstIndex == 0 && currIndex == pageLast && sender == "nextPage") { }
                else if (effObj.isReverse && dstIndex == pageLast && currIndex == 0 && sender == "prevPage") { getMinus(); }
                else if (effObj.isReverse && dstIndex < currIndex) { getMinus(); }

                getCurrPage().css("z-index", "2")
                .animate({ "left": (widthMinus / 2) + "px" }, effObj.speedOut, effObj.easingOut);
                setting.jqPages.eq(dstIndex).fadeIn(0).css("z-index", "1")
                .animate({ "left": (width / 2) + "px" }, effObj.speedOut, effObj.easingOut, function () {
                    effObj.onPageOut.call(this, myStaticPage);
                    getCurrPage().css("z-index", 1).removeClass("current")
                    .animate({ "left": 0 + "px" }, effObj.speedIn, effObj.easingIn, function () {
                        $(this).css("z-index", "-1");
                    });
                    setting.jqPages.eq(dstIndex).fadeIn(0).css("z-index", "2").addClass("current")
                    .animate({ "left": 0 + "px" }, effObj.speedIn, effObj.easingIn, function () {
                        effObj.onPageIn.call(this, myStaticPage);
                        callback.call(myStaticPage);
                    });
                });
                function getMinus() { var tmp = width; width = widthMinus; widthMinus = tmp; }
            },
            //水平移动
            moveHor: function (dstIndex, effObj, callback) {
                var pageBox = getCurrPage().parent();
                var width = getCurrPage().get(0).offsetWidth;
                var widthMinus = width * -1;
                var currIndex = getCurrPageIndex();
                var pageLast = setting.jqPages.length - 1;
                var sender = effObj.sender.myName;
                if (setting.jqPages.is(":animated") && !setting.isAnimeQueue) return; //*********
                if (dstIndex == 0 && currIndex == pageLast && sender == "nextPage") { }
                else if (effObj.isReverse && dstIndex == pageLast && currIndex == 0 && sender == "prevPage") { getMinus(); }
                else if (effObj.isReverse && dstIndex < currIndex) { getMinus(); }

                getCurrPage().css("left", 0 + "px").removeClass("current")
                .animate({ "left": widthMinus + "px" }, effObj.speedOut, effObj.easingOut, function () {
                    effObj.onPageOut.call(this, myStaticPage);
                });
                setting.jqPages.eq(dstIndex).fadeIn(0).css("left", width + "px").addClass("current")
                .animate({ "left": 0 + "px" }, effObj.speedIn, effObj.easingIn, function () {
                    effObj.onPageIn.call(this, myStaticPage);
                    callback.call(myStaticPage);
                });
                function getMinus() { var tmp = width; width = widthMinus; widthMinus = tmp; }
            },
            //垂直移动
            moveVer: function (dstIndex, effObj, callback) {
                var pageBox = getCurrPage().parent();
                var height = getCurrPage().get(0).offsetHeight;
                var heightMinus = height * -1;
                var currIndex = getCurrPageIndex();
                var pageLast = setting.jqPages.length - 1;
                var sender = effObj.sender.myName;
                if (setting.jqPages.is(":animated") && !setting.isAnimeQueue) return;
                if (dstIndex == 0 && currIndex == pageLast && sender == "nextPage") { }
                else if (effObj.isReverse && dstIndex == pageLast && currIndex == 0 && sender == "prevPage") { getMinus(); }
                else if (effObj.isReverse && dstIndex < currIndex) { getMinus(); }

                getCurrPage().css("top", 0 + "px").removeClass("current")
                .animate({ "top": heightMinus + "px" }, effObj.speedOut, effObj.easingOut, function () {
                    effObj.onPageOut.call(this, myStaticPage);
                });
                setting.jqPages.eq(dstIndex).fadeIn(0).css("top", height + "px").addClass("current")
                .animate({ "top": 0 + "px" }, effObj.speedIn, effObj.easingIn, function () {
                    effObj.onPageIn.call(this, myStaticPage);
                    callback.call(myStaticPage);
                });
                function getMinus() { var tmp = width; width = widthMinus; widthMinus = tmp; }
            },
            //百叶窗效果
            shutter: function (dstIndex, effObj, callback) {

            }
        }


        //特殊事件，用来实现切换主内容页
        var spEvent = this.spEvent = {
            //用鼠标滚轮来上下切换
            mouseRoll: function () {

            },
            mouseLoca: function () {

            }
        }

        //工具包
        var tools = this.tools = {
            //2张图片交替显示
            imgSwitch: function (data) {
                data = $.extend({
                    jqObj: $(),
                    inEvent: "mouseover",
                    outEvent: "mouseout",
                    denyFunc: $.noop
                }, data);
                data.jqObj.bind(data.inEvent, function (e) { fun.call(this, $.extend({ event: e }, data)); });
                data.jqObj.bind(data.outEvent, function (e) { fun.call(this, $.extend({ event: e }, data)); });
                function fun(data) {
                    if (data.denyFunc.call(this, data)) return;
                    var hover = $(this).find("*").filter(function () { return $(this).css("display") == "none" });
                    if (hover.length == 0) hover = $(this).children().eq(0);
                    hover.css("display", "").siblings().css("display", "none");
                }
            }
        }

        //------END-----
        //因为声明时使用：var init=this.init=function(){...}
        //所以此处使用“init.call(this);”或“this.init();”都可以正常调用
        //但不可使用“init();”会导致init函数内部this指向发生错误   
        init.call(this);
        return this;
    }
    //字符串追加方法
    String.prototype.append = function (str) {
        return this + str;
    }
    //Array.prototype.myUnshift = function (obj) {
    //    this.unshift(obj);
    //    return this;
    //}
})(jQuery);







