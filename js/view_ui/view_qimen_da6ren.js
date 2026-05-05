/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {

    var qimen6ren_tpl = null;
    var qimen6renData = null;

    function changeYongShen(dateStr){
        var str = dateStr.replace(/-/g, '/').replace(/[^\d/:\s]/g, '');
        var aDate = new Date(str);
        var lr = Lunar.fromDate(aDate);
        var bz = lr.getEightChar();
        var rg = bz.getDayGan();
        var rz = bz.getDayZhi();
        $("#popup-qimen6ren-yongshen-gan-select").val(rg);
        $("#popup-qimen6ren-yongshen-gan-select").change();
        setTimeout(() => {
            $("#popup-qimen6ren-yongshen-zhi-select").val(rz);
        }, 300);
    }

    function showQimen6ren(qimen6renData){
        if (!qimen6ren_tpl) {
            $.get('templates/qimen6ren_tpl.html?_=1234567890', function (template) {
                qimen6ren_tpl = template;
                showQimen6ren_(qimen6renData);
            });
        } else {
            showQimen6ren_(qimen6renData);
        }
    }

    function showQimen6ren_(qimen6renData) {
        var _qimenData = qimen6renData.qimen;
        var _6renData = qimen6renData.da6ren;
        tplData = {
            qimen: _qimenData.qimenPan,
            da6ren: _6renData.data,
        }
        layui.laytpl(qimen6ren_tpl).render(tplData, function (html) {
            $("#qimen6renpaipan").html(html);
        });

        $("#6ren_sym3c").off("click");
        $("#6ren_sym3c").on("click",function(){
            $("#6ren_sym3c").hide();
            $("#6ren_3c4k").show();
            $("#6ren_3c4k").css("display", "grid");
        })
        $("#6ren_3c4k").off("click");
        $("#6ren_3c4k").on("click",function(){
            $("#6ren_3c4k").hide();
            $("#6ren_sym3c").show();
            $("#6ren_sym3c").css("display", "grid");
        })

        $("#qimen6ren_zhifu").text(_qimenData.zhifu);
        $("#qimen6ren_zhishi").text(_qimenData.zhishi);
        $("#qimen6ren_xunshou").text(_qimenData.xunhead);
        $("#qimen6ren_maxing").text(_qimenData.maxing);
        $("#qimen6ren_kongwang").text(_qimenData.kongwang);
        $("#qimen6ren_yangdun").text((_qimenData.yangDun ? "阳遁" : "阴遁") + _qimenData.jushu + "局");
        $("#qimen6ren_date").text(_6renData.date);
        $("#qimen6ren_jieqi").html(_6renData.jieqiInfo.from + " ~ " + _6renData.jieqiInfo.to);
        $("#qimen6ren_year").html(_6renData.siZhu[0][0] + "<br/>" + _6renData.siZhu[0][1]);
        $("#qimen6ren_month").html(_6renData.siZhu[1][0] + "<br/>" + _6renData.siZhu[1][1]);
        $("#qimen6ren_day").html(_6renData.siZhu[2][0] + "<br/>" + _6renData.siZhu[2][1]);
        $("#qimen6ren_hour").html(_6renData.siZhu[3][0] + "<br/>" + _6renData.siZhu[3][1]);

        $("#qimen6ren_yuejiang").html(_6renData.yuejiang);
        $("#qimen6ren_yeargz").html(_6renData.yearGanzhi);
        $("#qimen6ren_yongshen").html(_6renData.yongShen);
        $("#qimen6ren_guiren").html(_6renData.isDaytime ? "阳贵" : "阴贵");
        $("#qimen6ren_sex").html(_6renData.isMan? "男" : "女");
    }
    
    // 奇门穿壬排盘
    function doQimen6ren() {
        var layerIdx = layer.open({
            type: 1,
            title: "奇门穿壬",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-qimen6ren-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
        <div class="popup-qimen6ren-content">
            <div style="margin-top:5px;margin-bottom: 15px;">
                起课时间：<span id="popup-qimen6ren-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                <span id="popup-qimen6ren-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div id="popup-qimen6ren-yearming" style="margin-top:5px; margin-bottom:15px">
                出生年份：
                <select id="popup-qimen6ren-yearming-select" class="popup-meihua-inputctl"></select>
                &nbsp;性别：
                <input type="radio" id="popup-qimen6ren-man" checked name="qimen6ren_sex" value="true" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen6ren-man">男</label>&nbsp;
                <input type="radio" id="popup-qimen6ren-woman" name="qimen6ren_sex" value="false" style="width: 16px!important" class="popup-meihua-inputctl">
                <label for="popup-qimen6ren-woman">女</label>
            </div>
            <div id="popup-qimen6ren-yongshen" style="margin-top:5px; margin-bottom:15px">
                选择用神：
                <select id="popup-qimen6ren-yongshen-gan-select" class="popup-meihua-inputctl" style="width: 50px !important;">
                    <option value="甲">甲</option>
                    <option value="乙">乙</option>
                    <option value="丙">丙</option>
                    <option value="丁">丁</option>
                    <option value="戊">戊</option>
                    <option value="己">己</option>
                    <option value="庚">庚</option>
                    <option value="辛">辛</option>
                    <option value="壬">壬</option>
                    <option value="癸">癸</option>
                </select>
                <select id="popup-qimen6ren-yongshen-zhi-select" class="popup-meihua-inputctl" style="width: 50px !important;">
                    <option value="子">子</option>
                    <option value="寅">寅</option>
                    <option value="辰">辰</option>
                    <option value="午">午</option>
                    <option value="申">申</option>
                    <option value="戌">戌</option>
                    <option value="亥">亥</option>
                </select>
            </div>
            <div id="popup-qimen6ren-guishentype" style="margin-top:5px; margin-bottom:15px">
                贵神类型：
                <input type="radio" id="popup-qimen6ren-gs1" checked name="qimen6ren_gs" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen6ren-gs1">卯酉区分</label>&nbsp;
                <input type="radio" id="popup-qimen6ren-gs2" name="qimen6ren_gs" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen6ren-gs2">白昼</label>&nbsp;
                <input type="radio" id="popup-qimen6ren-gs3" name="qimen6ren_gs" value="3" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen6ren-gs3">夜晚</label>
            </div>
            <div style="margin-top:10px;text-align: center;">
                <button class="app-paipan-button" id="popup-qimen6ren-confirm">开始排盘</button>
            </div>
            <div style="text-align: center;">
                <button id="popup-qimen6ren_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
            </div>            
        </div>
        `
        });

        // 排盘记录按钮点击事件
        $("#popup-qimen6ren_recordlist_btn").off("click");
        $("#popup-qimen6ren_recordlist_btn").on("click", function () {
            var data = {
                "datetime": $("#popup-qimen6ren-currenttime").text(),
                "isman": $("input[name='qimen6ren_sex']:checked").val() === "true",
                "yearMing": parseInt($("#popup-qimen6ren-yearming-select").val(), 10),
                "guirenMethod": parseInt($("input[name='qimen6ren_gs']:checked").val(), 10),
                "guirenSunni": 1,
                "zhanbuTime": "",
                "yongShen": $("#popup-qimen6ren-yongshen-gan-select").val()+$("#popup-qimen6ren-yongshen-zhi-select").val(),
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
                            type: 6,
                            openListener: doOpen
                        });
                        recordListView.resetFilePageNum();
                        recordListView.display();
                    }
                });
            });
            layer.close(layerIdx);
        });


        var dateRolldate = new RolldateFull({
            el: '#popup-qimen6ren-currenttime',
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
                $("#popup-qimen6ren-currenttime").text(dateStr);
                changeYongShen(dateStr);
            },
        });

        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-qimen6ren-currenttime").text(currentDate);

        const currentYear = new Date().getFullYear();
        const startYear = 1950;
        const select = document.getElementById("popup-qimen6ren-yearming-select");

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

        $("#popup-qimen6ren-yongshen-gan-select").off("change");
        $("#popup-qimen6ren-yongshen-gan-select").on("change", function () {
            var selectedGan = $(this).val();
            //如果是阳天干，在#popup-qimen6ren-yongshen-zhi-select中添加阳地支，否则添加阴地支
            if (selectedGan === "甲" || selectedGan === "丙" || selectedGan === "戊" || selectedGan === "庚" || selectedGan === "壬") {
                $("#popup-qimen6ren-yongshen-zhi-select").empty();
                var zhiOptions = ["子", "寅", "辰", "午", "申", "戌"];
                zhiOptions.forEach(function (zhi) {
                    var option = document.createElement("option");
                    option.value = zhi;
                    option.text = zhi;
                    $("#popup-qimen6ren-yongshen-zhi-select").append(option);
                })
            }else{
                $("#popup-qimen6ren-yongshen-zhi-select").empty();
                var zhiOptions = ["丑", "卯", "巳", "未", "酉", "亥"];
                zhiOptions.forEach(function (zhi) {
                    var option = document.createElement("option");
                    option.value = zhi;
                    option.text = zhi;
                    $("#popup-qimen6ren-yongshen-zhi-select").append(option);
                })
            }
        })

        changeYongShen(currentDate);

        $("#popup-qimen6ren-curtimebtn").off("click");
        $("#popup-qimen6ren-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-qimen6ren-currenttime").text(currentDate);
        })

        $("#popup-qimen6ren-confirm").on("click", function () {
            var data = {
                "datetime": $("#popup-qimen6ren-currenttime").text(),
                "isman": $("input[name='qimen6ren_sex']:checked").val() === "true",
                "yearMing": parseInt($("#popup-qimen6ren-yearming-select").val(), 10),
                "guirenMethod": parseInt($("input[name='qimen6ren_gs']:checked").val(), 10),
                "guirenSunni": 1,
                "zhanbuTime": "",
                "yongShen": $("#popup-qimen6ren-yongshen-gan-select").val()+$("#popup-qimen6ren-yongshen-zhi-select").val(),
            }
            var record = {
                "id": "",
                "desc": "",
                "type": 6,
                "content": JSON.stringify(data)
            };
            doOpen(record);
            layer.close(layerIdx);
        });
    }

    function doOpen(record, callback){
        layui.use(['da6ren', 'qimen'], function () {
            var params = JSON.parse(record.content);
            params.datetime = new Date(params.datetime);

            var _6renData = layui.da6ren.paipan({
                "datetime": params.datetime,
                "realsun": false,
                "diqu": '',
                "isman": params.isman,
                "yearMing": params.yearMing,
                "yueJiangMethod": 1,
                "guirenMethod": params.guirenMethod,
                "guirenSunni": 1,
                "zhanbuTime": "",
                "yongShen": params.yongShen,
            });

            var _qimenData = layui.qimen.paipan(params.datetime, false, false, "", 0, false);
            qimen6renData = {
                params: params,
                qimen: _qimenData,
                da6ren: _6renData,
            }
            qimen6renData.id = record.id;
            showQimen6ren(qimen6renData);
            layui.viewmgr.showView('view_qimen_da6ren');

            if(callback){
                callback(record);
            }
            setTimeout(
                function () {
                    $("#qimen6ren_desc").val(record.desc);
                }, 100
            );
        })
    }

    function doSave(){
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#qimen6ren_desc")) return;
        var desc = $("#qimen6ren_desc").val();
        var data = {
            "datetime": layui.util.toDateString(qimen6renData.params.datetime, "yyyy-MM-dd HH:mm:ss"),
            "realsun": false,
            "diqu": "",
            "isman": qimen6renData.params.isman,
            "yearMing": qimen6renData.params.yearMing,
            "yueJiangMethod": qimen6renData.params.yueJiangMethod,
            "guirenMethod": qimen6renData.params.guirenMethod,
            "guirenSunni": qimen6renData.params.guirenSunni,
            "zhanbuTime": qimen6renData.params.zhanbuTime,
            "yongShen": qimen6renData.params.yongShen,
        };
        var record = {
            "id": qimen6renData.id||"",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 6,
            "content": JSON.stringify(data)
        };
        var url = qimen6renData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            record,
            function (result) {
                qimen6renData.id = result.data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }
    
    globalThis.qimen6renView = {
        display: doQimen6ren,
        doOpen: doOpen,
        doSave: doSave,
    }
    
})();