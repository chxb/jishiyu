/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {

    var qimen3shi_tpl = null;
    var qimen3shiData = null;

    function changeYongShen(dateStr){
        var str = dateStr.replace(/-/g, '/').replace(/[^\d/:\s]/g, '');
        var aDate = new Date(str);
        var lr = Lunar.fromDate(aDate);
        var bz = lr.getEightChar();
        var rg = bz.getDayGan();
        var rz = bz.getDayZhi();
        $("#popup-qimen3shi-yongshen-gan-select").val(rg);
        $("#popup-qimen3shi-yongshen-gan-select").change();
        setTimeout(() => {
            $("#popup-qimen3shi-yongshen-zhi-select").val(rz);
        }, 300);
    }

    function showQimen3shi(qimen3shiData){
        if (!qimen3shi_tpl) {
            $.get('templates/qimen3shi_tpl.html?_=1234567890', function (template) {
                qimen3shi_tpl = template;
                showQimen3shi_(qimen3shiData);
            });
        } else {
            showQimen3shi_(qimen3shiData);
        }
    }

    function showQimen3shi_(qimen3shiData) {
        var _qimenData = qimen3shiData.qimen;
        var _6renData = qimen3shiData.da6ren;
        var _taiyiData = qimen3shiData.taiyi;
        var tplData = {
            qimen: _qimenData.qimenPan,
            da6ren: _6renData.data,
            taiyi: _taiyiData,
        }

        $('div.qimen3s-cell-16active').css('opacity', 1);
        layui.laytpl(qimen3shi_tpl).render(tplData, function (html) {
            $("#qimen3shipaipan").html(html);
        });
        $('div.qimen3s-cell-16active:empty').css('opacity', 0);

        // var themeColor = layui.data('profile').theme || "#e54844"; 
        // var aColor = hexToRgba(themeColor, 0.05);
        // $(".qimen3s-cell-16shen").css('background-color', aColor);

        $("#3shi_sym3c").off("click");
        $("#3shi_sym3c").on("click",function(){
            $("#3shi_sym3c").hide();
            $("#3shi_3c4k").show();
            $("#3shi_3c4k").css("display", "grid");
        })
        $("#3shi_3c4k").off("click");
        $("#3shi_3c4k").on("click",function(){
            $("#3shi_3c4k").hide();
            $("#3shi_sym3c").show();
            $("#3shi_sym3c").css("display", "grid");
        })

        $("#qimen3shi_zhifu").text(_qimenData.zhifu);
        $("#qimen3shi_zhishi").text(_qimenData.zhishi);
        $("#qimen3shi_xunshou").text(_qimenData.xunhead);
        $("#qimen3shi_maxing").text(_qimenData.maxing);
        $("#qimen3shi_kongwang").text(_qimenData.kongwang);
        $("#qimen3shi_yangdun").text((_qimenData.yangDun ? "阳遁" : "阴遁") + _qimenData.jushu + "局");
        $("#qimen3shi_date").text(_6renData.date);
        $("#qimen3shi_jieqi").html(_6renData.jieqiInfo.from + " ~ " + _6renData.jieqiInfo.to);
        $("#qimen3shi_year").html(_6renData.siZhu[0][0] + "<br/>" + _6renData.siZhu[0][1]);
        $("#qimen3shi_month").html(_6renData.siZhu[1][0] + "<br/>" + _6renData.siZhu[1][1]);
        $("#qimen3shi_day").html(_6renData.siZhu[2][0] + "<br/>" + _6renData.siZhu[2][1]);
        $("#qimen3shi_hour").html(_6renData.siZhu[3][0] + "<br/>" + _6renData.siZhu[3][1]);

        $("#qimen3shi_yuejiang").html(_6renData.yuejiang);
        $("#qimen3shi_yeargz").html(_6renData.yearGanzhi);
        $("#qimen3shi_yongshen").html(_6renData.yongShen);
        $("#qimen3shi_guiren").html(_6renData.isDaytime ? "阳贵" : "阴贵");
        $("#qimen3shi_sex").html(_6renData.isMan? "男" : "女");

        $("#qimen3shi_jishu").html(_taiyiData.jishu);
        $("#qimen3shi_zhushuan").html(_taiyiData.zhushuan);
        $("#qimen3shi_keshuan").html(_taiyiData.keshuan);
        $("#qimen3shi_tianma").html(_taiyiData.tianma);
        $("#qimen3shi_taiyi").html(_taiyiData.tygongwei+_taiyiData.guan);
    }
    
    // 奇门三式排盘
    function doQimen3shi() {
        var layerIdx = layer.open({
            type: 1,
            title: "太乙三式排盘",
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
                起课时间：<span id="popup-qimen3shi-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                <span id="popup-qimen3shi-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div id="popup-qimen3shi-yearming" style="margin-top:5px; margin-bottom:15px">
                出生年份：
                <select id="popup-qimen3shi-yearming-select" class="popup-meihua-inputctl"></select>
                &nbsp;性别：
                <input type="radio" id="popup-qimen3shi-man" checked name="qimen3shi_sex" value="true" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen3shi-man">男</label>&nbsp;
                <input type="radio" id="popup-qimen3shi-woman" name="qimen3shi_sex" value="false" style="width: 16px!important" class="popup-meihua-inputctl">
                <label for="popup-qimen3shi-woman">女</label>
            </div>
            <div id="popup-qimen3shi-yongshen" style="margin-top:5px; margin-bottom:15px">
                选择用神：
                <select id="popup-qimen3shi-yongshen-gan-select" class="popup-meihua-inputctl" style="width: 50px !important;">
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
                <select id="popup-qimen3shi-yongshen-zhi-select" class="popup-meihua-inputctl" style="width: 50px !important;">
                    <option value="子">子</option>
                    <option value="寅">寅</option>
                    <option value="辰">辰</option>
                    <option value="午">午</option>
                    <option value="申">申</option>
                    <option value="戌">戌</option>
                    <option value="亥">亥</option>
                </select>
            </div>
            <div id="popup-qimen3shi-guishentype" style="margin-top:5px; margin-bottom:15px">
                贵神类型：
                <input type="radio" id="popup-qimen3shi-gs1" checked name="qimen3shi_gs" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen3shi-gs1">卯酉区分</label>&nbsp;
                <input type="radio" id="popup-qimen3shi-gs2" name="qimen3shi_gs" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen3shi-gs2">白昼</label>&nbsp;
                <input type="radio" id="popup-qimen3shi-gs3" name="qimen3shi_gs" value="3" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-qimen3shi-gs3">夜晚</label>
            </div>
            <div style="margin-top:10px;text-align: center;">
                <button class="app-paipan-button" id="popup-qimen3shi-confirm">开始排盘</button>
            </div>
            <div style="text-align: center;">
                <button id="popup-qimen3shi_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
            </div>            
        </div>
        `
        });

        // 排盘记录按钮点击事件
        $("#popup-qimen3shi_recordlist_btn").off("click");
        $("#popup-qimen3shi_recordlist_btn").on("click", function () {
            var data = {
                "datetime": $("#popup-qimen3shi-currenttime").text(),
                "isman": $("input[name='qimen3shi_sex']:checked").val() === "true",
                "yearMing": parseInt($("#popup-qimen3shi-yearming-select").val(), 10),
                "guirenMethod": parseInt($("input[name='qimen3shi_gs']:checked").val(), 10),
                "yongShen": $("#popup-qimen3shi-yongshen-gan-select").val()+$("#popup-qimen3shi-yongshen-zhi-select").val(),
            }
            var record = {
                "id": "",
                "desc": "",
                "type": 7,
                "content": JSON.stringify(data)
            };
            doOpen(record, function () {
                layui.viewmgr.loadView('view_recordlist', function () {
                    layui.viewmgr.showView('view_recordlist');
                    if (!$("#recordsearchbox").val()) {
                        recordListView.setRecordHandler({
                            type: 7,
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
            el: '#popup-qimen3shi-currenttime',
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
                $("#popup-qimen3shi-currenttime").text(dateStr);
                changeYongShen(dateStr);
            },
        });

        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-qimen3shi-currenttime").text(currentDate);

        const currentYear = new Date().getFullYear();
        const startYear = 1950;
        const select = document.getElementById("popup-qimen3shi-yearming-select");

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

        $("#popup-qimen3shi-yongshen-gan-select").off("change");
        $("#popup-qimen3shi-yongshen-gan-select").on("change", function () {
            var selectedGan = $(this).val();
            //如果是阳天干，在#popup-qimen3shi-yongshen-zhi-select中添加阳地支，否则添加阴地支
            if (selectedGan === "甲" || selectedGan === "丙" || selectedGan === "戊" || selectedGan === "庚" || selectedGan === "壬") {
                $("#popup-qimen3shi-yongshen-zhi-select").empty();
                var zhiOptions = ["子", "寅", "辰", "午", "申", "戌"];
                zhiOptions.forEach(function (zhi) {
                    var option = document.createElement("option");
                    option.value = zhi;
                    option.text = zhi;
                    $("#popup-qimen3shi-yongshen-zhi-select").append(option);
                })
            }else{
                $("#popup-qimen3shi-yongshen-zhi-select").empty();
                var zhiOptions = ["丑", "卯", "巳", "未", "酉", "亥"];
                zhiOptions.forEach(function (zhi) {
                    var option = document.createElement("option");
                    option.value = zhi;
                    option.text = zhi;
                    $("#popup-qimen3shi-yongshen-zhi-select").append(option);
                })
            }
        })

        changeYongShen(currentDate);

        $("#popup-qimen3shi-curtimebtn").off("click");
        $("#popup-qimen3shi-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-qimen3shi-currenttime").text(currentDate);
        })

        $("#popup-qimen3shi-confirm").on("click", function () {
            var data = {
                "datetime": $("#popup-qimen3shi-currenttime").text(),
                "isman": $("input[name='qimen3shi_sex']:checked").val() === "true",
                "yearMing": parseInt($("#popup-qimen3shi-yearming-select").val(), 10),
                "guirenMethod": parseInt($("input[name='qimen3shi_gs']:checked").val(), 10),
                "yongShen": $("#popup-qimen3shi-yongshen-gan-select").val()+$("#popup-qimen3shi-yongshen-zhi-select").val(),
            }
            var record = {
                "id": "",
                "desc": "",
                "type": 7,
                "content": JSON.stringify(data)
            };
            doOpen(record);
            layer.close(layerIdx);
        });
    }

    function doOpen(record, callback){
        layui.use(['da6ren', 'qimen', 'taiyi'], function () {
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

            var _qimenData = layui.qimen.paipan(params.datetime, false, false, "", false, false, 0);

            var _taiyiData = layui.taiyi.paipan(params.datetime, false, false, "", false, false, 0, params.yongShen);

            qimen3shiData = {
                params: params,
                qimen: _qimenData,
                da6ren: _6renData,
                taiyi: _taiyiData,
            }
            qimen3shiData.id = record.id;
            showQimen3shi(qimen3shiData);
            layui.viewmgr.showView('view_qimen_3shi');

            if(callback){
                callback(record);
            }
            setTimeout(
                function () {
                    $("#qimen3shi_desc").val(record.desc);
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
        if (!checkItemInput("#qimen3shi_desc")) return;
        var desc = $("#qimen3shi_desc").val();
        var data = {
            "datetime": layui.util.toDateString(qimen3shiData.params.datetime, "yyyy-MM-dd HH:mm:ss"),
            "realsun": false,
            "diqu": "",
            "isman": qimen3shiData.params.isman,
            "yearMing": qimen3shiData.params.yearMing,
            "yueJiangMethod": qimen3shiData.params.yueJiangMethod,
            "guirenMethod": qimen3shiData.params.guirenMethod,
            "guirenSunni": qimen3shiData.params.guirenSunni,
            "zhanbuTime": qimen3shiData.params.zhanbuTime,
            "yongShen": qimen3shiData.params.yongShen,
        };
        var record = {
            "id": qimen3shiData.id||"",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 7,
            "content": JSON.stringify(data)
        };
        var url = qimen3shiData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            record,
            function (result) {
                qimen3shiData.id = result.data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }
    
    globalThis.qimen3shiView = {
        display: doQimen3shi,
        doOpen: doOpen,
        doSave: doSave
    }
    
})();