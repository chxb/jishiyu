/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function(){

    globalThis.qimen12zhangshengVis = false;
    var lastMingliTableActiveCell = null;
    var lastMingliLiunianTableActiveCell = null;
    var qimenTianmendihuShow = false;
    var qimenData = null;
    var currentData = null;
    var qimenpan_tpl = null;

    function mlGongTipsByZhi(zhi) {
        var qimenPan = qimenData.qimenPan;
        var g = GONG_12ZHI[zhi];
        for (var gong in qimenPan) {
            if (gong == g) {
                $(".qimen-9gong-grid-cell[gong='" + gong + "']").addClass("cellActive");
                setTimeout(function () {
                    $(".qimen-9gong-grid-cell[gong='" + gong + "']").removeClass("cellActive");
                }, 300);
                return;
            }
        }
    }

    var mingliDayunTableClickFunc = function (e) {
        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className == "dayun-grid-cell") {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "dayun-grid-cell") {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "dayun-grid-cell") {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;
        if (lastMingliTableActiveCell) {
            lastMingliTableActiveCell.removeClass("cellActive");
        }
        $(tdDom).addClass("cellActive");
        lastMingliTableActiveCell = $(tdDom);

        if (lastMingliLiunianTableActiveCell) {
            lastMingliLiunianTableActiveCell.removeClass("cellActive");
            lastMingliLiunianTableActiveCell = null;
        }

        var col = parseInt($(tdDom).attr("col"), 10);
        var isman = qimenData.isman;
        var yun = qimenData.bazi.getYun(isman ? 1 : 0, 1);
        var dayun = yun.getDaYun(11);
        var noXY = dayun[0].getLiuNian().length == 0;//没有小运
        showMingliLiuNianTable(dayun[noXY ? col + 1 : col], qimenData.bazi);

        var bazi = qimenData.bazi;
        var dy = dayun[noXY ? col + 1 : col];
        var dygz = (!dy.getGanZhi()) ? [bazi.getMonthGan(), bazi.getMonthZhi()] : dy.getGanZhi().split("");
        setTimeout(function () { mlGongTips(dygz[0]) }, 10);
        curDayun = dy;
    }

    var mingliLiunianTableClickFunc = function (e) {
        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className == "liunian2-grid-cell") {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "liunian2-grid-cell") {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "liunian2-grid-cell") {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;
        if (lastMingliLiunianTableActiveCell) {
            lastMingliLiunianTableActiveCell.removeClass("cellActive");
        }
        $(tdDom).addClass("cellActive");
        lastMingliLiunianTableActiveCell = $(tdDom);

        var col = $(tdDom).attr("col");

        var dayun = curDayun;
        var ln = dayun.getLiuNian()[col];
        var lnGanZhi = ln.getGanZhi().split("");
        setTimeout(function () { mlGongTipsByZhi(lnGanZhi[1]) }, 10);
    }

    function showMingliLiuNianTable(dayun, bazi) {
        var liunians = dayun.getLiuNian();
        for (var i = 0; i < 10; i++) {
            if (i < liunians.length) {
                var lnGanZhi = liunians[i].getGanZhi().split("");
                var lnGan = lnGanZhi[0];
                var lnZhi = lnGanZhi[1];
                var lnGanShen = shishenJc(queryShishen(lnGan, bazi.getDayGan()));
                var lnZhiShen = shishenJc(queryShishen(dizhiCanggan(lnZhi)[0], bazi.getDayGan()));
                $("#qm_ln" + (i + 1)).html(
                    "<div class='liunianYear'><span>" + liunians[i].getYear() + "</span></div>" +
                    liunianStyle(tianganWuxing(lnGan)) + lnGan + "</span><span class='xShishen'>" + lnGanShen + "</span><br/>" +
                    liunianStyle(dizhiWuxing(lnZhi)) + lnZhi + "</span><span class='xShishen'>" + lnZhiShen + "</span>"
                );
                $("#qm_ln" + (i + 1)).attr("ganzhi", liunians[i].getGanZhi());
                $("#qm_ln" + (i + 1)).attr("year", liunians[i].getYear());
                $("#qm_ln" + (i + 1)).attr("age", liunians[i].getAge());
            } else {
                $("#qm_ln" + (i + 1)).html("");
                $("#qm_ln" + (i + 1)).attr("ganzhi", "");
                $("#qm_ln" + (i + 1)).attr("year", "");
                $("#qm_ln" + (i + 1)).attr("age", "");
            }

        }
    }


    function toggleML12Zhangshen() {
        if (globalThis.qimen12zhangshengVis) {
            $(".qimen-9gong-12zhangsheng").css("visibility", "hidden");
            globalThis.qimen12zhangshengVis = false;
        } else {
            $(".qimen-9gong-12zhangsheng").css("visibility", "visible");
            globalThis.qimen12zhangshengVis = true;
        }
        layui.data('profile', {
            key: 'qimen.show12zhangshen',
            value: globalThis.qimen12zhangshengVis
        });

        return false;
    }



    function toggleMLTianmendihu() {
        if (qimenTianmendihuShow) {
            $(".qimen-9gong-tmdh").css("visibility", "hidden");
            $(".tmdhcolor").hide();
            qimenTianmendihuShow = false;
        } else {
            $(".qimen-9gong-tmdh").css("visibility", "visible");
            $(".tmdhcolor").show();
            qimenTianmendihuShow = true;
        }
        layui.data('profile', {
            key: 'qimen.showtianmendihu',
            value: qimenTianmendihuShow
        });

        return false;
    }

    function mlQimen4zhuClickFunc(e) {
        if (qimenData) {
            var gan = $(this).text().split("")[0];
            mlGongTips(gan);
        }
    }

    function mlGongTips(gan) {
        var qimenPan = qimenData.qimenPan;
        for (var gong in qimenPan) {
            if (qimenPan[gong].tianpan == gan || gan == qimenPan[gong].tianpanJi) {
                $(".qimen-9gong-grid-cell[gong='" + gong + "']").addClass("cellActive");
                setTimeout(function () {
                    $(".qimen-9gong-grid-cell[gong='" + gong + "']").removeClass("cellActive");
                }, 300);
                return;
            } else if (gan == "甲" && qimenPan[gong].bashen == "符") {
                $(".qimen-9gong-grid-cell[gong='" + gong + "']").addClass("cellActive");
                setTimeout(function () {
                    $(".qimen-9gong-grid-cell[gong='" + gong + "']").removeClass("cellActive");
                }, 300);
                return;
            }
        }
    }

    var show9Gong2View = function () {
        if ($("#mingliqimen9gong").children().length == 0) {
            $("#mingliqimen9gong").html("<img src='images/9gong.png' style='height:360px'>");
        }
        $("#mingliqimenpaipan").hide();
        $("#mingliqimen9gong").show();
        $("#qimen-view9gong2").addClass("qimen-view9gong-press");
        return false;
    }

    var hide9Gong2View = function () {
        $("#mingliqimen9gong").hide();
        $("#mingliqimenpaipan").show();
        $("#qimen-view9gong2").removeClass("qimen-view9gong-press");
    }


    $("#mlqimen-view12zhangsheng").on("click", toggleML12Zhangshen);
    $("#mlqimen-viewtianmendihu").on("click", toggleMLTianmendihu);

    $("#qimen-view9gong2").on("mousedown", show9Gong2View);
    $("#qimen-view9gong2").on("touchstart", show9Gong2View);
    $("#qimen-view9gong2").on("mouseup", hide9Gong2View);
    $("#qimen-view9gong2").on("touchend", hide9Gong2View);

    $("#mingliDayunTable").on("click", mingliDayunTableClickFunc);
    $("#mingliLiunianTable").on("click", mingliLiunianTableClickFunc);
    $(".qimen-4zhu").on("click", mlQimen4zhuClickFunc);

    //排命理奇门
    function doMingliQimen(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime) {
        if (!isValidDateTime(year, month, day, hour, minute, second)) {
            return;
        }

        var currentDate = new Date(year, month - 1, day, hour, minute, second);

        if (summertime) {//调整夏令时
            currentDate = adjustForDST(currentDate);
        }
        layui.use(['qimen'], function () {
            var qData = layui.qimen.paipan(currentDate, isman, realsun, diqu, wanzishi);
            qimenData = qData;

            if (!qimenpan_tpl) {
                $.get('templates/qimenpan_tpl.html?_=1234567890', function (template) {
                    qimenpan_tpl = template;
                    doMingliQimen_(qData);
                    if (globalThis.mingliQimenView.afterPaipan) {
                        globalThis.mingliQimenView.afterPaipan();
                    }
                });
            } else {
                doMingliQimen_(qData);
                if (globalThis.mingliQimenView.afterPaipan) {
                    globalThis.mingliQimenView.afterPaipan();
                }
            }
            layui.viewmgr.showView('view_mingli_qimen');
        });
    }

    function doMingliQimen_(qimenData) {
        layui.laytpl(qimenpan_tpl).render(qimenData.qimenPan, function (html) {
            $("#mingliqimenpaipan").html(html);
        });

        globalThis.qimen12zhangshengVis = false;
        var profile = layui.data('profile');
        if (profile) {
            globalThis.qimen12zhangshengVis = profile["show12zhangshen"];
        }
        if (globalThis.qimen12zhangshengVis) {
            $(".qimen-9gong-12zhangsheng").css("visibility", "visible");
        } else {
            $(".qimen-9gong-12zhangsheng").css("visibility", "hidden");
        }

        qimenTianmendihuShow = false;
        var profile = layui.data('profile');
        if (profile) {
            qimenTianmendihuShow = profile["showtianmendihu"];
        }
        if (qimenTianmendihuShow) {
            $(".qimen-9gong-tmdh").css("visibility", "visible");
            $(".tmdhcolor").show();
        } else {
            $(".qimen-9gong-tmdh").css("visibility", "hidden");
            $(".tmdhcolor").hide();
        }
        $("#mingliqimen_name").val("");
        $("#mingliqimen_sex").text(qimenData.isman ? "男" : "女");
        $("#mingliqimen_sex2").text(qimenData.isman ? "乾造" : "坤造");
        $("#mingliqimen_shengxiao").text(qimenData.lunar.getYearShengXiaoByLiChun());
        $("#mingliqiman_date").text(qimenData.date);
        $("#mingliqiman_jieqi").html(qimenData.jieqi + "&nbsp;&nbsp;月将<b>" + qimenData.yueJiang + "</b>");
        $("#mingliqiman_jushu").text((qimenData.yangDun ? "阳遁" : "阴遁") + qimenData.jushu + "局");
        $("#mingliqiman_zhifu").text(qimenData.zhifu);
        $("#mingliqiman_zhishi").text(qimenData.zhishi);
        $("#mingliqiman_xunshou").text(qimenData.xunhead);
        $("#mingliqiman_maxing").text(qimenData.maxing);
        $("#mingliqiman_kongwang").text(qimenData.kongwang);

        var bazi = qimenData.bazi;
        var siZhu = qimenData.siZhu;
        var bz = [];
        bz[0] = siZhu[0][0]; bz[1] = siZhu[0][1]; //年柱干支
        bz[2] = siZhu[1][0]; bz[3] = siZhu[1][1];//月柱干支
        bz[4] = siZhu[2][0]; bz[5] = siZhu[2][1];  //日柱干支
        bz[6] = siZhu[3][0]; bz[7] = siZhu[3][1]; //时柱干支
        var gzY = "<span class='" + wuxingStyle(tianganWuxing(bz[0])) + " yueli-day-info-gz-style'>" + bz[0] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(bazi.getYearShiShenGan()) + "</sup>";
        var gzY = gzY + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[1])) + " yueli-day-info-gz-style'>" + bz[1] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(queryShishen(dizhiCanggan(bz[1])[0], bazi.getDayGan())) + "</sup>";
        $("#mingliqiman_year").html(gzY);
        var gzM = "<span class='" + wuxingStyle(tianganWuxing(bz[2])) + " yueli-day-info-gz-style'>" + bz[2] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(bazi.getMonthShiShenGan()) + "</sup>";
        var gzM = gzM + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[3])) + " yueli-day-info-gz-style'>" + bz[3] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(queryShishen(dizhiCanggan(bz[3])[0], bazi.getDayGan())) + "</sup>";
        $("#mingliqiman_month").html(gzM);
        var gzD = "<span class='" + wuxingStyle(tianganWuxing(bz[4])) + " yueli-day-info-gz-style'>" + bz[4] + "</span><sup class='yueli-day-info-gz-sh-style'>" + (qimenData.isman ? "男" : "女") + "</sup>";
        var gzD = gzD + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[5])) + " yueli-day-info-gz-style'>" + bz[5] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(queryShishen(dizhiCanggan(bz[5])[0], bazi.getDayGan())) + "</sup>";
        $("#mingliqiman_day").html(gzD);
        var gzH = "<span class='" + wuxingStyle(tianganWuxing(bz[6])) + " yueli-day-info-gz-style'>" + bz[6] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(bazi.getTimeShiShenGan()) + "</sup>";
        var gzH = gzH + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[7])) + " yueli-day-info-gz-style'>" + bz[7] + "</span><sup class='yueli-day-info-gz-sh-style'>" + shishenJc(queryShishen(dizhiCanggan(bz[7])[0], bazi.getDayGan())) + "</sup>";
        $("#mingliqiman_hour").html(gzH);

        if (lastMingliTableActiveCell) {
            lastMingliTableActiveCell.removeClass("cellActive");
            lastMingliTableActiveCell = null;
        }
        if (lastMingliLiunianTableActiveCell) {
            lastMingliLiunianTableActiveCell.removeClass("cellActive");
            lastMingliLiunianTableActiveCell = null;
        }
        //大运
        var curYear = new Date().getFullYear();
        var yun = bazi.getYun(qimenData.isman ? 1 : 0, 2);
        var dayun = yun.getDaYun(11);

        $("#qm_qiyun").html(
            '<span>' + '出生' + yun.getStartYear() + '年' + yun.getStartMonth() + '个月' + yun.getStartDay() + '天' + yun.getStartHour() + '时后起运</span>'
        );

        var noXY = dayun[0].getLiuNian().length == 0;//没有小运
        for (var i = 0; i < 10; i++) {
            var dy = noXY ? dayun[i + 1] : dayun[i];
            var dygz = (!dy.getGanZhi()) ? [bazi.getMonthGan(), bazi.getMonthZhi()] : dy.getGanZhi().split("");
            var dyGanShen = shishenJc(queryShishen(dygz[0], bazi.getDayGan()));
            var dyZhiShen = shishenJc(queryShishen(dizhiCanggan(dygz[1])[0], bazi.getDayGan()));
            $("#qm_dy" + i).html(
                "<div class='dayunYear'><span>" +
                dy.getStartYear() + "<br/>" + dy.getStartAge() + "岁" + "</span></div>" +
                dayunStyle(tianganWuxing(dygz[0])) + dygz[0] + "</span><span class='xShishen'>" + dyGanShen + "</span><br/>" +
                dayunStyle(dizhiWuxing(dygz[1])) + dygz[1] + "</span><span class='xShishen'>" + dyZhiShen + "</span>"
            );
            $("#qm_dy" + i).attr("ganzhi", dy.getGanZhi());
            $("#qm_dy" + i).attr("year", dy.getStartYear());
            $("#qm_dy" + i).attr("age", dy.getStartAge());

            if (!lastMingliTableActiveCell && curYear >= dy.getStartYear() && curYear < dy.getStartYear() + 10) {
                lastMingliTableActiveCell = $("#qm_dy" + i);
                $("#qm_dy" + i).addClass("cellActive");
                showMingliLiuNianTable(dy, bazi);
                curDayun = dy;
            }
        }

        if (!lastMingliTableActiveCell) {
            $("#qm_dy0").addClass("cellActive");
            lastMingliTableActiveCell = $("#qm_dy0");
            showMingliLiuNianTable(dayun[0], bazi);
            curDayun = dayun[0];
        }

        //天三门
        $(".qimen-9gong-tmdh").each(function (index, element) {
            var txt = $(this).text().substring(0, 3);
            if (txt === "太冲卯" || txt === "小吉未" || txt === "从魁酉") {
                $(this).addClass("qimen-tian3men");
            }
        });
        //地四户
        $(".qimen-9gong-tmdhjc").each(function (index, element) {
            var txt = $(this).text();
            if (txt === "除" || txt === "危" || txt === "定" || txt === "开") {
                $(this).addClass("qimen-di4hu");
            }
        });

        //点击宫位，显示帮助信息
        $(".qimen-9gong-grid-cell[gong]").off("click");
        $(".qimen-9gong-grid-cell[gong]").on("click", function (e) {
            var gong = $(this).attr("gong");
            var gongData = qimenData.qimenPan[gong];
            gongData.gong = gong;
            layui.use(['qimenhelper'], function () {
                layui.qimenhelper.show(gongData);
            });
            $("#appframe").scrollTop(220);
            e.stopPropagation();
        })
    }

    function beginPaipan() {
        layui.viewmgr.loadComponent('component_basic_data', function () {
            basicDataComponent.display(
                "命理奇门排盘", 
                function(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime){
                    doMingliQimen(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime);
                },
                globalThis.mingliQimenView
            );
        });
    }

    globalThis.mingliQimenView = {
        display: beginPaipan,
        doMingliQimen: doMingliQimen,
        getMingliQimenData: function () { return qimenData; },
        getLunar: function(){return qimenData.lunar},
        getBazi: function(){return qimenData.bazi},
        afterPaipan: null,
        setCurrentData: function (data) { 
            currentData = data;
            $("#mingliqimen_name").val(data.name);
        },
        getCurrentData: function () { return currentData; }
    }

})();