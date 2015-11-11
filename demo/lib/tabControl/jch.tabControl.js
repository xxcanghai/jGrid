/*
    create:2014‎年‎9‎月‎12‎日‏18:59:24
    update:2014年9月18日20:28:59
    author:jch

    说明：在页面任意位置构造以下HTML结构，即可自动格式化成tab标签页
    <div class="tabControl">
        <div class="tabTitleList">
            <div class="tabTitle"><a class="active">标签页标题1</a></div>
            <div class="tabTitle"><a class="">标签页标题2</a></div>
        </div>
        <div class="tabPageList">
            <div class="tabPage">标签页页面1</div>
            <div class="tabPage">标签页页面2</div>
        </div>
    </div>

    【注意】
    本函数在每个子页面只能执行一次。
*/
(function ($) {
    window.jch = window.jch || {};
    window.jch.tabControl = function (pageurl) {
        var $tabConArr = $(".tabControl");
        $.each($tabConArr, function (i, tab) {
            var $tab = $(tab);
            var tabName = "tabControl_" + getRandomTimeStr();
            $tab.attr("tabControlName", tabName);
            var sp = $.staticPage({
                name: tabName,
                jqPages: $tab.children(".tabPageList").children(".tabPage"),
                jqNavi: $tab.children(".tabTitleList").children(".tabTitle"),
                effect: { name: "defaultEff" }
            });
            $tab.data("tabControl", sp);
        });

        function getRandomTimeStr() {
            var sum = 0;
            for (var i = 0; i < 10000; i++) {
                sum += parseInt(new Date().getTime());
            }
            return sum / 10000;
        }
    };
})(jQuery);