(function() {
    var feixingData;
    var xuankongfeixing_tpl;
    var xuankongfeixing_small_tpl;

    function doXuankongFeixing_() {

        var layerIdx = layer.open({
            type: 1,
            title: "玄空飞星",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-xuankong-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
        <div class="popup-xuankong-content">
            <div style="margin-top:5px; margin-bottom:5px">
            选择时间：<span id="popup-xuankong-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
            <span id="popup-xuankong-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div style="margin-top:10px;text-align: center;">
            <button class="app-paipan-button" id="popup-xuankong-confirm">排盘</button>
            </div>
        </div>
        `
        });

        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-xuankong-currenttime").text(currentDate);

        var dateRolldate = new RolldateFull({
            el: '#popup-xuankong-currenttime',
            value: currentDate,
            dateType: 1,
            format: 'YYYY-MM-DD hh:mm',
            beginYear: 1800,
            endYear: 2199,
            zhaowanzhishi: false,
            showValue: function () {
                return {
                    dateValue: currentDate,
                    wanzhishi: false
                }
            },
            confirm: function (date) {
                var dateStr = layui.util.toDateString(date, "yyyy-MM-dd HH:mm");
                $("#popup-xuankong-currenttime").text(dateStr);
            },
        });

        $("#popup-xuankong-curtimebtn").off("click");
        $("#popup-xuankong-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-xuankong-currenttime").text(currentDate);
        })

        $("#popup-xuankong-confirm").on("click", function () {
            layui.use(['ninestar'], function () {
                var str = $("#popup-xuankong-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                feixingData = layui.ninestar.paipan(currentDate, false, "");
                layui.laytpl(xuankongfeixing_tpl).render(feixingData.gongStars, function (html) {
                    $("#feixingpaipan").html(html);
                });
                feixingData.gongStars.ftype = "year";
                layui.laytpl(xuankongfeixing_small_tpl).render(feixingData.gongStars, function (html) {
                    $("#feixingpaipan_year").html(html);
                });
                feixingData.gongStars.ftype = "month";
                layui.laytpl(xuankongfeixing_small_tpl).render(feixingData.gongStars, function (html) {
                    $("#feixingpaipan_month").html(html);
                });
                feixingData.gongStars.ftype = "day";
                layui.laytpl(xuankongfeixing_small_tpl).render(feixingData.gongStars, function (html) {
                    $("#feixingpaipan_day").html(html);
                });
                feixingData.gongStars.ftype = "hour";
                layui.laytpl(xuankongfeixing_small_tpl).render(feixingData.gongStars, function (html) {
                    $("#feixingpaipan_hour").html(html);
                });
    
                $("#feixing_date").text(feixingData.date);
                $("#feixing_jieqi").html(feixingData.jieqi);
                $("#feixing_dayun").html(feixingData.yearYun);
                $("#feixing_year").html(feixingData.siZhu[0][0] + "<br/>" + feixingData.siZhu[0][1]);
                $("#feixing_month").html(feixingData.siZhu[1][0] + "<br/>" + feixingData.siZhu[1][1]);
                $("#feixing_day").html(feixingData.siZhu[2][0] + "<br/>" + feixingData.siZhu[2][1]);
                $("#feixing_hour").html(feixingData.siZhu[3][0] + "<br/>" + feixingData.siZhu[3][1]);
    
                layui.viewmgr.showView('view_xuankong_feixing');
                layer.close(layerIdx);
            });
        });

    }

    var feixingHelpFunc = function (e) {
        var buildHelpInfo = function () {
            var helperData = feixingData.helper;
            var html = [];
            for (const key in helperData) {
                html.push("<div style='font-weight: bold; font-size: 14px'>");
                html.push(key);
                html.push("</div>");
                html.push("<div style='font-size: 14px'>");
                html.push(helperData[key]);
                html.push("</div>");
            }
            return html.join("");
        }
        if (e && e.target.className.indexOf("feixing-9gong-grid-cell") != -1) {
            layer.open({
                type: 1,
                title: "飞星象意",
                closeBtn: 1,
                shadeClose: true,
                anim: 2,
                area: ["var(--max-page-width)", "360px"],
                isOutAnim: false,
                offset: 'b',
                skin: 'popup-tip-box',
                shade: [0.01, '#000'],
                content: '<div class="popup-tip-content">' + buildHelpInfo() + '</div>'
            });

        }
    }

    $("#feixingpaipan").on("click", feixingHelpFunc);
    $("#feixingpaipan_year").on("click", feixingHelpFunc);
    $("#feixingpaipan_month").on("click", feixingHelpFunc);
    $("#feixingpaipan_day").on("click", feixingHelpFunc);
    $("#feixingpaipan_hour").on("click", feixingHelpFunc);


    function doXuankongFeixing() {

        if (!xuankongfeixing_tpl) {
            $.get('templates/xuankongfeixing_tpl.html?_=1234567890', function (template1) {
                xuankongfeixing_tpl = template1;

                $.get('templates/xuankongfeixing_small_tpl.html?_=1234567890', function (template2) {
                    xuankongfeixing_small_tpl = template2;
                    doXuankongFeixing_();
                });
            });
        } else {
            doXuankongFeixing_();
        }
    }

    globalThis.xuankongfeixingView = {
        display: doXuankongFeixing
    }


})();
