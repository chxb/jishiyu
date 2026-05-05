/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {

    var da6ren = null;
    var da6renData = null;
    var da6ren_tpl = null;

    $("#da6ren-prev-btn").on("click", function () {
        var prevData = da6ren.prevPaipan();
        showDa6renPan(prevData);
    });

    $("#da6ren-next-btn").on("click", function () {
        var nextData = da6ren.nextPaipan();
        showDa6renPan(nextData);
    });

    function showDa6renPan(da6renData) {
        if (!da6ren_tpl) {
            $.get('templates/da6ren_tpl.html?_=1234567890', function (template) {
                da6ren_tpl = template;
                showDa6renPan_(da6renData);
            });
        } else {
            showDa6renPan_(da6renData);
        }
    }

    function showDa6renPan_(da6renData) {
        layui.laytpl(da6ren_tpl).render(da6renData.data, function (html) {
            $("#da6renpaipan").html(html);
        });

        $('.da6ren-9gong-grid div:contains("贵")').each(function () {
            $(this).css("color", "red");
        });
        $('.da6ren-9gong-grid div:contains("' + da6renData.siZhu[2][0] + '")').each(function () {
            $(this).css("color", "red");
        });
        $('.da6ren-4ke-grid div:contains("贵")').each(function () {
            $(this).css("color", "red");
        });
        $('.da6ren-4ke-grid div:contains("' + da6renData.siZhu[2][0] + '")').each(function () {
            $(this).css("color", "red");
        });
        $('.da6ren-3chuan-grid div:contains("贵")').each(function () {
            $(this).css("color", "red");
        });

        $("#da6ren_date").text(da6renData.date);
        $("#da6ren_jieqi").html(da6renData.jieqiInfo.from + da6renData.jieqiInfo.fromDate + " ~ " + da6renData.jieqiInfo.to + da6renData.jieqiInfo.toDate);
        $("#da6ren_method").html(da6renData.zhanbuTime + "时占");
        $("#da6ren_year").html(da6renData.siZhu[0][0] + "<br/>" + da6renData.siZhu[0][1]);
        $("#da6ren_month").html(da6renData.siZhu[1][0] + "<br/>" + da6renData.siZhu[1][1]);
        $("#da6ren_day").html("<span style='color:red'>" + da6renData.siZhu[2][0] + "<br/>" + da6renData.siZhu[2][1] + "</span>");
        $("#da6ren_hour").html("<span style='color:red'>" + da6renData.siZhu[3][0] + "<br/>" + da6renData.siZhu[3][1] + "</span>");

        $("#da6ren_yuejiang").html(da6renData.yuejiang);
        $("#da6ren_isman").html(da6renData.isMan ? "男" : "女");
        $("#da6ren_yeargz").html(da6renData.yearGanzhi);
        $("#da6ren_xingyear").html(da6renData.xingYear);
        $("#da6ren_kongwang").html(da6renData.kongwang);
    }

    function doDa6ren() {
        var layerIdx = layer.open({
            type: 1,
            title: "大六壬起课",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-da6ren-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
        <div class="popup-da6ren-content">
            <div style="margin-top:5px; margin-bottom:15px">
            起课时间：<span id="popup-da6ren-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
            <span id="popup-da6ren-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div id="popup-da6ren-yearming" style="margin-top:5px; margin-bottom:15px">
            出生年份：
            <select id="popup-da6ren-yearming-select" class="popup-meihua-inputctl">
            </select>
            &nbsp;性别：
                <input type="radio" id="popup-da6ren-man" checked name="da6ren_sex" value="true" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-da6ren-man">男</label>&nbsp;
                <input type="radio" id="popup-da6ren-woman" name="da6ren_sex" value="false" style="width: 16px!important" class="popup-meihua-inputctl">
                <label for="popup-da6ren-woman">女</label>
            </div>
            <div id="popup-da6ren-zhanputime" style="margin-top:5px; margin-bottom:15px">
            占事时辰：
            <select id="popup-da6ren-zhanputime-select" class="popup-meihua-inputctl">
                <option value="">当前时间</option>
                <option value="子">子时</option>
                <option value="丑">丑时</option>
                <option value="寅">寅时</option>
                <option value="卯">卯时</option>
                <option value="辰">辰时</option>
                <option value="巳">巳时</option>
                <option value="午">午时</option>
                <option value="未">未时</option>
                <option value="申">申时</option>
                <option value="酉">酉时</option>
                <option value="戌">戌时</option>
                <option value="亥">亥时</option>
            </select>
            </div>
            <div id="popup-da6ren-yuejiangtype" style="margin-top:5px; margin-bottom:15px">
            换将方式：
            <input type="radio" id="popup-da6ren-yj1" checked name="da6ren_yj" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-yj1">节气</label>&nbsp;
            <input type="radio" id="popup-da6ren-yj2" name="da6ren_yj" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-yj2">年月日时取余</label>
            </div>
            <div id="popup-da6ren-guishentype" style="margin-top:5px; margin-bottom:15px">
            贵神类型：
            <input type="radio" id="popup-da6ren-gs1" checked name="da6ren_gs" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-gs1">卯酉区分</label>&nbsp;
            <input type="radio" id="popup-da6ren-gs2" name="da6ren_gs" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-gs2">白昼</label>&nbsp;
            <input type="radio" id="popup-da6ren-gs3" name="da6ren_gs" value="3" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-gs3">夜晚</label>
            </div>
            <div id="popup-da6ren-guishensunni" style="margin-top:5px; margin-bottom:15px">
            贵神顺逆：
            <input type="radio" id="popup-da6ren-gssl1" checked name="da6ren_gssl" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-gssl1">自动</label>&nbsp;
            <input type="radio" id="popup-da6ren-gssl2" name="da6ren_gssl" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-da6ren-gssl2">男顺女逆</label>&nbsp;
            </div>
            <div style="margin-top:10px;text-align: center;">
                <button class="app-paipan-button" id="popup-da6ren-confirm">开始起课</button>
            </div>
            <div style="text-align: center;">
                <button id="popup-da6ren_recordlist_btn" class="app-paipanlist-button">起课记录</button>
            </div>
        </div>
        `
        });

        $("#popup-da6ren_recordlist_btn").off("click");
        $("#popup-da6ren_recordlist_btn").on("click", function () {
            var data = {
                "datetime": $("#popup-da6ren-currenttime").text(),
                "realsun": false,
                "diqu": "",
                "isman": $("input[name='da6ren_sex']:checked").val() === "true",
                "yearMing": parseInt($("#popup-da6ren-yearming-select").val(), 10),
                "yueJiangMethod": parseInt($("input[name='da6ren_yj']:checked").val(), 10),
                "guirenMethod": parseInt($("input[name='da6ren_gs']:checked").val(), 10),
                "guirenSunni": parseInt($("input[name='da6ren_gssl']:checked").val(), 10),
                "zhanbuTime": $("#popup-da6ren-zhanputime-select").val(),
                "yongShen": ""
            };
            var record = {
                id: null,
                desc: "",
                content: JSON.stringify(data)
            };
            doOpen(record, function () {
                layui.viewmgr.loadView('view_recordlist', function () {
                    layui.viewmgr.showView('view_recordlist');
                    if (!$("#recordsearchbox").val()) {
                        recordListView.setRecordHandler({
                            type: 5,
                            openListener: doOpen
                        });
                        recordListView.resetFilePageNum();
                        recordListView.display();
                    }
                });
            });
            layer.close(layerIdx);
        });

        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-da6ren-currenttime").text(currentDate);

        var dateRolldate = new RolldateFull({
            el: '#popup-da6ren-currenttime',
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
                $("#popup-da6ren-currenttime").text(dateStr);
            },
        });

        const currentYear = new Date().getFullYear();
        const startYear = 1950;
        const select = document.getElementById("popup-da6ren-yearming-select");

        // 遍历从1950到当前年份，并生成option元素
        for (let year = startYear; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.text = year + "年(" + getGanzhiYear(year) + ")";
            if (year === 1990) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        $("#popup-da6ren-curtimebtn").off("click");
        $("#popup-da6ren-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-da6ren-currenttime").text(currentDate);
        })

        $("#popup-da6ren-confirm").on("click", function () {
            var data ={
                "datetime": $("#popup-da6ren-currenttime").text(),
                "realsun": false,
                "diqu": "",
                "isman": $("input[name='da6ren_sex']:checked").val() === "true",
                "yearMing": parseInt($("#popup-da6ren-yearming-select").val(), 10),
                "yueJiangMethod": parseInt($("input[name='da6ren_yj']:checked").val(), 10),
                "guirenMethod": parseInt($("input[name='da6ren_gs']:checked").val(), 10),
                "guirenSunni": parseInt($("input[name='da6ren_gssl']:checked").val(), 10),
                "zhanbuTime": $("#popup-da6ren-zhanputime-select").val(),
                "yongShen": ""
            };
            var record = {
                "id": "",
                "desc": "",
                "type": 5,
                "content": JSON.stringify(data)
            };
            doOpen(record);
            layer.close(layerIdx);
        });
    }
    
    function doSave(){
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#da6ren_desc")) return;
        var desc = $("#da6ren_desc").val();
        var data = {
            "datetime": layui.util.toDateString(da6renData.params.datetime, "yyyy-MM-dd HH:mm:ss"),
            "realsun": false,
            "diqu": "",
            "isman": da6renData.params.isman,
            "yearMing": da6renData.params.yearMing,
            "yueJiangMethod": da6renData.params.yueJiangMethod,
            "guirenMethod": da6renData.params.guirenMethod,
            "guirenSunni": da6renData.params.guirenSunni,
            "zhanbuTime": da6renData.params.zhanbuTime,
            "yongShen": da6renData.params.yongShen,
        };
        var record = {
            "id": da6renData.id||"",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 5,
            "content": JSON.stringify(data)
        };
        var url = da6renData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            record,
            function (result) {
                da6renData.id = result.data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }

    function doOpen(record, callback){
        layui.use(['da6ren'], function () {
            var params = JSON.parse(record.content);
            params.datetime = new Date(params.datetime);
            da6renData = layui.da6ren.paipan(params);
            da6ren = layui.da6ren;
            da6renData.id = record.id;
            showDa6renPan(da6renData);
            layui.viewmgr.showView('view_da6ren');

            if(callback){
                callback(record);
            }
            setTimeout(
                function () {
                    $("#da6ren_desc").val(record.desc);
                }, 100
            );
        })
    }

    globalThis.da6renView = {
        display: doDa6ren,
        doOpen: doOpen,
        doSave: doSave,
    };
    


})();