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
 * ShizhuDate 1.0.1
 * Copyright 2025 xianbo.chen@gmail.com
 *  
 * 四柱八字选择控件。
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.ShizhuDate = factory());
}(this, function () {
    'use strict';

    /**
     * 四柱日期选择器组件
     * @param {*} config  {bazi:"xxxxxxxx"}
     */
    function ShizhuDate(options) {
        this.config = {};
        var bz = "";
        if( options ){
            if( options.bazi ){
                if( Array.isArray(options.bazi) ){
                    bz = options.bazi.join("").split("");
                }else{
                    bz = options.bazi.split(/,|\s|/g);
                }
                this.config.bazi = bz;//8个字的数组
            }
            if( options.confirm ){
                this.config.confirm = options.confirm;
            }
            if( options.zhaowanzhishi ){
                this.config.zhaowanzhishi = options.zhaowanzhishi;
            }
        }


    };

    ShizhuDate.prototype = {

        createUI: function createUI(){
            var domContent ="<div class='shizhudate-panel fadeIn'>" +
                                "<header>" +
                                    "<span class='shizhudate-btn shizhudate-cancel'>取消</span>" +
                                    "四柱" +
                                    "<span class='shizhudate-btn shizhudate-confirm'>确认</span>" +
                                "</header>" +
                                "<section class='shizhudate-content'>" +
                                    "<div class='shizhudate-subtitle'>"+
                                        "<div class='shizhudate-subtitle-cell'>年柱</div>"+
                                        "<div class='shizhudate-subtitle-cell'>月柱</div>"+
                                        "<div class='shizhudate-subtitle-cell'>日柱</div>"+
                                        "<div class='shizhudate-subtitle-cell'>时柱</div>"+
                                    "</div>"+
                                    "<div class='shizhudate-ganzhigrid'>"+
                                        "<div id='bz1' data-type='gan' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz3' data-type='gan' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz5' data-type='gan' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz7' data-type='gan' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz2' data-type='zhi' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz4' data-type='zhi' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz6' data-type='zhi' class='shizhudate-ganzhi-cell'></div>"+
                                        "<div id='bz8' data-type='zhi' class='shizhudate-ganzhi-cell'></div>"+
                                    "</div>"+
                                    "<div class='shizhudate-ganzhi-range'>从1800年开始查找</div>"+
                                "</section>" +
                            "</div>";
            var mask = document.createElement("div");
            mask.className = 'shizhudate-mask';
            document.body.appendChild(mask);
            var box = document.createElement("div");
            box.className = 'shizhudate-container';
            box.innerHTML = domContent;
            document.body.appendChild(box);

            var ganList = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
            var ganHtml = "";
            for (var i = 0; i < ganList.length; i++) {
                ganHtml += "<div class='shizhudate-picker-cell " + wuxingStyle(tianganWuxing(ganList[i])) + "'>" + ganList[i] + "</div>";
            }
            var ganpick =document.createElement("div");
            ganpick.className = 'shizhudate-gan-picker';
            ganpick.style.display = "none";
            ganpick.innerHTML = ganHtml;
            document.body.appendChild(ganpick);
            var zhiList = ["子","寅","辰","午","申","戌"];
            var zhiHtml = "";
            for (var j = 0; j < zhiList.length; j++) {
                zhiHtml += "<div class='shizhudate-picker-cell " + wuxingStyle(dizhiWuxing(zhiList[j])) + "'>" + zhiList[j] + "</div>";
            }
            var zhipick =document.createElement("div");
            zhipick.className = 'shizhudate-zhi-picker';
            zhipick.innerHTML = zhiHtml;
            zhipick.style.display = "none";
            document.body.appendChild(zhipick);


        }
        ,
        show: function show(zwzs){
            if( $(".shizhudate-container").length==0 ){
                this.createUI();
                this.event();
            }
            var el = $('.shizhudate-panel');
            el.removeClass("fadeOut");
            el.addClass('fadeIn');
            $(".shizhudate-mask").show();
            $(".shizhudate-container").show();
            this.config.zhaowanzhishi = zwzs||false;
            if( this.config.bazi ){
                var bazi = this.config.bazi;
                $("#bz1").text(bazi[0]);
                $("#bz2").text(bazi[1]);
                $("#bz3").text(bazi[2]);
                $("#bz4").text(bazi[3]);
                $("#bz5").text(bazi[4]);
                $("#bz6").text(bazi[5]);
                $("#bz7").text(bazi[6]);
                $("#bz8").text(bazi[7]);
            }
        }
        ,
        hide: function hide() {
            $(".shizhudate-gan-picker").hide();
            $(".shizhudate-zhi-picker").hide();
            $(".shizhudate-result-panel").hide();
            $(".shizhudate-ganzhi-cell").removeClass("shizhudate-ganzhi-cell-filled");
            $(".shizhudate-ganzhi-cell").removeClass("shizhudate-ganzhi-cell-current");
            this.currentGanzhi = null;
            var el = $('.shizhudate-panel');
            el.removeClass("fadeIn");
            el.addClass('fadeOut');
            setTimeout(function () {
                $(".shizhudate-mask").hide();
                $(".shizhudate-container").hide();
            }, 300);
            
        }
        ,
        tap: function(el, fn){
            el.on('click', function (e) {
                fn.call(this, e);
            });
        }
        ,
        event: function event() {
            var _this = this,
                mask = $('.shizhudate-mask'),
                cancel = $('.shizhudate-cancel'),
                confirm = $('.shizhudate-confirm'),
                ganzhi = $('.shizhudate-ganzhi-cell'),
                gzpick = $(".shizhudate-picker-cell");

            _this.tap(mask, function () {
                _this.hide();
            });
            _this.tap(cancel, function () {
                _this.hide();
            });
            _this.tap(confirm, function () {
                $(".shizhudate-gan-picker").hide();
                $(".shizhudate-zhi-picker").hide();
                var days = Solar.fromBaZi(
                    $("#bz1").text()+$("#bz2").text(), 
                    $("#bz3").text()+$("#bz4").text(), 
                    $("#bz5").text()+$("#bz6").text(), 
                    $("#bz7").text()+$("#bz8").text(), _this.config.zhaowanzhishi?2:1, 1800);
                if( !days || days.length==0 ){
                    layer.msg('找不到符合的日期！请重新调整八字。');
                    return;
                }

                var resultPanel = $(".shizhudate-result-panel");
                if( resultPanel.length==0 ){
                    var dom = document.createElement("div");
                    dom.className = "shizhudate-result-panel";
                    document.body.appendChild(dom);
                }
                var itemHtml = "";
                days.reverse().forEach(function(d){
                    itemHtml += "<div class='shizhudate-result-item'>"+d.toYmdHms()+"</div>";
                });
                $(".shizhudate-result-item").off("click", confirmResult.bind(_this));
                $(".shizhudate-result-panel").html(itemHtml);
                $(".shizhudate-result-panel").show();
                $(".shizhudate-result-item").on("click", confirmResult.bind(_this));
            });
            _this.tap(ganzhi, function(){
                showGanzhiPicker(_this, this);
            });
            _this.tap(gzpick, function(){
                if ( _this.currentGanzhi ){
                    $(_this.currentGanzhi).text($(this).text());
                    $(_this.currentGanzhi).removeClass("shizhudate-ganzhi-cell-current");
                    $(_this.currentGanzhi).addClass("shizhudate-ganzhi-cell-filled");
                    if ($(_this.currentGanzhi).attr("id")=="bz1"){
                        showGanzhiPicker(_this, $("#bz2"));
                    }else if ($(_this.currentGanzhi).attr("id")=="bz2"){
                        showGanzhiPicker(_this, $("#bz3"));
                    }else if ($(_this.currentGanzhi).attr("id")=="bz3"){
                        showGanzhiPicker(_this, $("#bz4"));
                    }else if ($(_this.currentGanzhi).attr("id")=="bz4"){
                        showGanzhiPicker(_this, $("#bz5"));
                    }else if ($(_this.currentGanzhi).attr("id")=="bz5"){
                        showGanzhiPicker(_this, $("#bz6"));
                    }else if ($(_this.currentGanzhi).attr("id")=="bz6"){
                        showGanzhiPicker(_this, $("#bz7"));
                    }else if ($(_this.currentGanzhi).attr("id")=="bz7"){
                        showGanzhiPicker(_this, $("#bz8"));
                    }else{
                        $(".shizhudate-gan-picker").hide();
                        $(".shizhudate-zhi-picker").hide();
                        $(".shizhudate-result-panel").hide();
                    }
                }
            });

            var confirmResult = function(e){
                var selectDate = $(e.target).text();
                
                if (this.config.confirm) {
                    var flag = this.config.confirm.call(this, selectDate);
                    if (flag === false) {
                        return false;
                    } else if (flag) {
                        date = flag;
                    }
                }
                this.hide();
            }

            var showGanzhiPicker = function(that, dom){
                $(".shizhudate-result-panel").hide();
                if($(dom).data("type")=="gan" ){
                    $(".shizhudate-gan-picker").show();
                    $(".shizhudate-zhi-picker").hide();
                    that.currentGanzhi = dom;
                    $(".shizhudate-ganzhi-cell").removeClass("shizhudate-ganzhi-cell-current");
                    $(dom).addClass("shizhudate-ganzhi-cell-current");
                }else if($(dom).data("type")=="zhi" ){
                    var id = $(dom).attr("id");
                    var yy = "";
                    if( id=="bz2" ) {
                        yy = tianganYinYang($("#bz1").text());
                    }else if( id=="bz4" ) {
                        yy = tianganYinYang($("#bz3").text());
                    }else if( id=="bz6" ) {
                        yy = tianganYinYang($("#bz5").text());
                    }else if( id=="bz8" ) {
                        yy = tianganYinYang($("#bz7").text());
                    }
                    var zhiArr = ("阳"==yy) ? ["子","寅","辰","午","申","戌"] : ["丑","卯","巳","未","酉","亥"];
                    $(".shizhudate-zhi-picker").children().each(function(index, element){
                        var zhi = zhiArr[index];
                        $(element).text(zhi)
                            .removeClass("wxjin wxshui wxmu wxhuo wxtu")
                            .addClass(wuxingStyle(dizhiWuxing(zhi)));
                    });

                    $(".shizhudate-zhi-picker").show();
                    $(".shizhudate-gan-picker").hide();
                    that.currentGanzhi = dom;
                    $(".shizhudate-ganzhi-cell").removeClass("shizhudate-ganzhi-cell-current");
                    $(dom).addClass("shizhudate-ganzhi-cell-current");
                }
            }
        }
        ,
        putData: function(bazi){
            var bz = "";
            if( Array.isArray(bazi) ){
                bz = bazi.join("").split("");
            }else{
                bz = bazi.split(/,|\s|/g);
            }
            this.config.bazi = bz;
            
        }


    };

    ShizhuDate.version = "1.0.1";

    return ShizhuDate;


}));
