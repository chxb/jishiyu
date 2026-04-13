(function(){
    $(".yueli-day-info-ymd").on("click", function () {
        layui.viewmgr.showView('view_laohuangli');
    });
    
    var inited = false;
    // 万年历
    function doWannianli() {
        layui.viewmgr.loadView('view_laohuangli', function () {
            $("#calendarNav").addClass("app-footer-tab-selected");
            $(".app-navbar-icon-calendar").addClass("app-navbar-icon-calendar-selected");
            layui.viewmgr.resetViews();
            layui.viewmgr.showView('view_wannianli')
            if( inited ){ return; }
            layui.use(['monthly'], function () {
                layui.monthly.init();
                inited = true;
            });
        });
    }
    
    globalThis.wannianliView = {
        display: doWannianli
    }
    
})();