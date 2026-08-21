/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function(){

    var qiduwengData = null;
    var qiduweng_tpl = null;
    var qiduwengCaseKeys = [];
    var qiduwengCaseIndex = 0;

    function showQiduweng(data) {
        if (!qiduweng_tpl) {
            $.get('templates/qiduweng_tpl.html?_=1234567890', function (template) {
                qiduweng_tpl = template;
                showQiduweng_(data);
            });
        } else {
            showQiduweng_(data);
        }
    }

    function showQiduweng_(data) {
        layui.laytpl(qiduweng_tpl).render(data, function (html) {
            $("#qiduwengpan").html(html);
            bindQiduwengInfoClick(data);
            initQiduwengCaseCard();
        });

        $("#qiduweng_desc").val("");
        $("#qiduweng_date").text(data.date);
        $("#qiduweng_jieqi").text(data.jieqi);
        $("#qiduweng_ju").text(data.ju);
        $("#qiduweng_year").html(data.siZhu[0][0] + "<br/>" + data.siZhu[0][1]);
        $("#qiduweng_month").html(data.siZhu[1][0] + "<br/>" + data.siZhu[1][1]);
        var dayGan = data.siZhu[2][0];
        var dayZhi = data.siZhu[2][1];
        $("#qiduweng_day").html(
            "<span class='" + wuxingStyle(tianganWuxing(dayGan)) + "'>" + dayGan + "</span><br/>" +
            "<span class='" + wuxingStyle(dizhiWuxing(dayZhi)) + "'>" + dayZhi + "</span>"
        );
        $("#qiduweng_hour").html(data.siZhu[3][0] + "<br/>" + data.siZhu[3][1]);
        $("#qiduweng_year_kong").html(data.xunKong.year);
        $("#qiduweng_month_kong").html(data.xunKong.month);
        $("#qiduweng_day_kong").html(data.xunKong.day);
        $("#qiduweng_hour_kong").html(data.xunKong.time);
    }

    function initQiduwengCaseCard() {
        layui.use(['qiduweng_case'], function () {
            qiduwengCaseKeys = Object.keys(layui.qiduweng_case);
            if (!qiduwengCaseKeys.length) return;
            if (qiduwengCaseIndex < 0 || qiduwengCaseIndex >= qiduwengCaseKeys.length) {
                qiduwengCaseIndex = 0;
            }
            renderQiduwengCaseCard();
            $("#qiduweng-case-prev").off("click").on("click", function () {
                qiduwengCaseIndex = (qiduwengCaseIndex - 1 + qiduwengCaseKeys.length) % qiduwengCaseKeys.length;
                renderQiduwengCaseCard();
            });
            $("#qiduweng-case-next").off("click").on("click", function () {
                qiduwengCaseIndex = (qiduwengCaseIndex + 1) % qiduwengCaseKeys.length;
                renderQiduwengCaseCard();
            });
        });
    }

    function renderQiduwengCaseCard() {
        var cases = layui.qiduweng_case;
        var key = qiduwengCaseKeys[qiduwengCaseIndex];
        var lines = cases[key] || [];
        $("#qiduweng-case-title").text(key);
        $("#qiduweng-case-body").html(lines.join("<br/>"));
        $("#qiduweng-case-index").text((qiduwengCaseIndex + 1) + " / " + qiduwengCaseKeys.length);
    }

    function bindQiduwengInfoClick(data) {
        $(".qiduweng-card-clickable").off("click").on("click", function () {
            var role = $(this).attr("data-role");
            var item = role === "ti" ? data.ti : data.yong;
            if (!item || !item.wuxing) return;
            layui.use(['qiduweng_info'], function () {
                var info = layui.qiduweng_info;
                var wuxing = item.wuxing;
                var sections = ["人物形体", "人物性情", "人体部位", "职业"];
                var html = [];
                sections.forEach(function (sec) {
                    html.push("<span style='color: var(--theme-color);'>" + sec + "</span>："
                        + (info[sec][wuxing] || ""));
                });
                var title = role === "ti"
                    ? item.name
                    : item.name + "（" + item.alias + "）";
                layer.open({
                    type: 1,
                    title: title,
                    closeBtn: 1,
                    shadeClose: true,
                    anim: 2,
                    area: ["var(--max-page-width)", "360px"],
                    isOutAnim: false,
                    offset: 'b',
                    skin: 'popup-tip-box',
                    shade: [0.01, '#000'],
                    content: '<div class="popup-tip-content">' + html.join("<br/><br/>") + '</div>'
                });
            });
        });
    }

    function doQiduweng() {
        layui.use(['qiduweng'], function () {
            var layerIdx = layer.open({
                type: 1,
                title: "戚都翁排盘",
                closeBtn: 1,
                shadeClose: true,
                anim: 2,
                area: ["var(--max-page-width)", "360px"],
                isOutAnim: false,
                offset: 'b',
                skin: 'popup-yinpan-box',
                shade: [0.01, '#000'],
                zIndex: 980,
                content: `
                <div class="popup-yinpan-content">
                    <div>
                        <div style="margin-top:5px;margin-bottom: 15px;text-align: left;">
                            排盘时间：<span id="popup-qiduweng-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                            <span id="popup-qiduweng-curtimebtn" class="app-cur-time-btn"></span>
                        </div>
                        <div style="margin-top:5px;margin-bottom: 15px;text-align: left;">
                            起课方式：时间起课（农历月日时）
                        </div>
                    </div>
                    <div>
                        <button id="qiduweng_btn" class="app-paipan-button">开始起课</button>
                    </div>
                    <div>
                        <button id="qiduweng_recordlist_btn" class="app-paipanlist-button">起课记录</button>
                    </div>
                </div>
                `
            });

            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-qiduweng-currenttime").text(currentDate);
            var dateRolldate = new RolldateFull({
                el: '#popup-qiduweng-currenttime',
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
                    $("#popup-qiduweng-currenttime").text(dateStr);
                },
            });

            $("#popup-qiduweng-curtimebtn").off("click");
            $("#popup-qiduweng-curtimebtn").on("click", function () {
                var nowStr = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
                $("#popup-qiduweng-currenttime").text(nowStr);
            });

            $("#qiduweng_btn").off("click");
            $("#qiduweng_btn").on("click", function () {
                var str = $("#popup-qiduweng-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                    currentDate = new Date(str);
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false
                };
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                };
                doOpenQiduweng(record);
                layer.close(layerIdx);
            });

            $("#qiduweng_recordlist_btn").off("click");
            $("#qiduweng_recordlist_btn").on("click", function () {
                var str = $("#popup-qiduweng-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                    currentDate = new Date(str);
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false
                };
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                };
                doOpenQiduweng(record, function () {
                    layui.viewmgr.loadView('view_recordlist', function () {
                        layui.viewmgr.showView('view_recordlist');
                        if (!$("#recordsearchbox").val()) {
                            recordListView.setRecordHandler({
                                type: 11,
                                openListener: doOpenQiduweng
                            });
                            recordListView.resetFilePageNum();
                            recordListView.display();
                        }
                    });
                });
                layer.close(layerIdx);
            });
        });
    }

    var doOpenQiduweng = function (record, callback) {
        layui.use(['qiduweng'], function () {
            var data = JSON.parse(record.content);
            var aDate = new Date(data.datetime);
            var year = aDate.getFullYear();
            var month = aDate.getMonth() + 1;
            var day = aDate.getDate();
            var hour = aDate.getHours();
            var minute = aDate.getMinutes();
            qiduwengData = layui.qiduweng.paipan(year, month, day, hour, minute);
            qiduwengData.id = record.id;
            showQiduweng(qiduwengData);
            layui.viewmgr.showView('view_qiduweng');
            if (callback) {
                callback();
            }
            setTimeout(function () {
                $("#qiduweng_desc").val(record.desc);
            }, 100);
        });
    };

    var doSaveQiduweng = function () {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#qiduweng_desc")) return;
        var desc = $("#qiduweng_desc").val();
        var siZhu = qiduwengData.siZhu;
        var data = {
            "id": qiduwengData.id || "",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 11,
            "content": JSON.stringify({
                "datetime": layui.util.toDateString(qiduwengData.datetime, "yyyy-MM-dd HH:mm:ss"),
                "realsun": false,
                "diqu": "",
                "wanzishi": false,
                "bazi": [siZhu[0][0], siZhu[0][1], siZhu[1][0], siZhu[1][1], siZhu[2][0], siZhu[2][1], siZhu[3][0], siZhu[3][1]]
            })
        };
        var url = qiduwengData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            data,
            function (result) {
                data.id = result.data;
                qiduwengData.id = data.id;
                layer.msg("已保存.", { time: 2000 });
            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    };

    function getQiduwengData() {
        return qiduwengData;
    }

    globalThis.qiduwengView = {
        display: doQiduweng,
        doOpen: doOpenQiduweng,
        doSave: doSaveQiduweng,
        getQiduwengData: getQiduwengData
    };

})();
