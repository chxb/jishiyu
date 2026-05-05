/*
 * 吉时雨 (JiShiYu)
 * Copyright (C) 2026 xianbo.chen@gmail.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the LICENSE file for more details.
 *
 * If you use this software to provide network services (e.g. SaaS, API),
 * you must make your source code available to users.
 *
 * Commercial licensing is available:
 * 📧 xianbo.chen@gmail.com
 */

/**
 * 界面视图切换管理。
 */
layui.define(function (exports) {

    //界面访问记录栈
    var viewStack = [];

    var viewmgrObj = {

        loadComponent: function (widgetId, callback) {
            if( $("#"+widgetId).length > 0 ){
                if( callback) {
                    callback();
                }
                return;
            }
            var url = "views/components/"+widgetId+".html?_=1234567890";
            if( callback ){
                $.get(url, function (widget) {
                    $(document.body).append(widget);
                    $("div[id='"+widgetId+"'] script").each(function() {
                        eval($(this).text());
                    });
                    callback();
                });
            }
        },

        /**
         * 加载界面
         * @param {String} viewId 界面ID
         * @param {Function} callback 异步加载完成时调用的回调函数。不指定时，采用同步加载。
         */
        loadView: function (viewId, callback) {
            if( $("div[data-view='"+viewId+"']").length > 0 ){
                if( callback) {
                    callback();
                }
                return;
            }
            var url = "views/"+viewId+".html?_=1234567890";
            if( callback ){
                $.get(url, function (view) {
                    $("#appbody").append(view);
                    $("div[data-view='"+viewId+"'] script").each(function() {
                        eval($(this).text());
                    });
                    callback();
                });
            }else{
                var view = $.ajax({url: url, async: false}).responseText;
                $("#appbody").append(view);
                $("div[data-view='"+viewId+"'] script").each(function() {
                    eval($(this).text());
                });
            }
        },
        
        /**
         * 显示指定界面
         * @param {*} viewId 界面ID或者界面jquery对象。
         */
        showView : function (viewId) {
            var view = null;
            if( typeof viewId === 'string' ){
                view = $("div[data-view='"+viewId+"']");
            }else{
                view = viewId;
            }
            $("#appTitle").html(view.data("title"));
            this.hideAllView();
            view.show();
            viewStack.push(view);
            view.data("showfooter") ? $("#appfooter").show() : $("#appfooter").hide();
            var leftActions = view.data("left-actions").split(",");
            for (var i = 1; i <= 2; i++) {
                if (leftActions.length >= i && leftActions[i - 1]) {
                    $("#leftBtn" + i).removeClass();
                    $("#leftBtn" + i).addClass("app-header-button app-header-button-" + leftActions[i - 1]);
                    $("#leftBtn" + i).css("visibility", "visible");
                    $("#leftBtn" + i).attr("action", leftActions[i - 1]);
                } else {
                    $("#leftBtn" + i).css("visibility", "hidden");
                }
            }
            var rightActions = view.data("right-actions").split(",");
            for (var i = 1; i <= 2; i++) {
                if (rightActions.length >= i && rightActions[i - 1]) {
                    $("#rightBtn" + i).removeClass();
                    $("#rightBtn" + i).addClass("app-header-button app-header-button-" + rightActions[i - 1]);
                    $("#rightBtn" + i).css("visibility", "visible");
                    $("#rightBtn" + i).attr("action", rightActions[i - 1]);
                } else {
                    $("#rightBtn" + i).css("visibility", "hidden");
                    $("#rightBtn" + i).attr("action", "");
                }
            }
        },
    
        //后退界面
        backView : function () {
            viewStack.pop();
            var view = viewStack.pop();
            this.showView(view);
        },
    
        //隐藏所有显示界面
        hideAllView : function () {
            $("div[data-view]").each(function () {
                $(this).hide();
            });
        },
        //重置界面
        resetViews: function(){
            viewStack = [];
        },
        //获取界面总数量
        count: function(){
            return viewStack.length;
        },
        //获取当前界面
        currentView: function(){
            return viewStack[viewStack.length - 1]
        },
        //弹出当前界面
        popView: function(){
            return viewStack.pop();
        },
        pushView: function(viewId){
            var view = null;
            if( typeof viewId === 'string' ){
                view = $("div[data-view='"+viewId+"']");
            }else{
                view = viewId;
            }
            return viewStack.push(view);
        }


    }


    exports("viewmgr", viewmgrObj);

})