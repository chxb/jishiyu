(function(){

    globalThis.qimen12zhangshengVis = false;
    var qimenTianmendihuShow = false;
    var qimenData = null;
    var qimenObj = null;
    var qimenpan_tpl = null;

    function toggle12Zhangshen() {
        if (globalThis.qimen12zhangshengVis) {
            $(".qimen-9gong-12zhangsheng").css("visibility", "hidden");
            globalThis.qimen12zhangshengVis = false;
        } else {
            $(".qimen-9gong-12zhangsheng").css("visibility", "visible");
            globalThis.qimen12zhangshengVis = true;
        }
        layui.data('profile', {
            key: 'show12zhangshen',
            value: globalThis.qimen12zhangshengVis
        });

        return false;
    }



    function toggleTianmendihu() {
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
            key: 'showtianmendihu',
            value: qimenTianmendihuShow
        });

        return false;
    }

    var show9GongView = function () {
        if ($("#yinpanqimen9gong").children().length == 0) {
            $("#yinpanqimen9gong").html("<img src='images/9gong.png' style='height:330px'>");
        }
        $("#yinpanqimenpaipan").hide();
        $("#yinpanqimen9gong").show();
        $("#qimen-view9gong1").addClass("qimen-view9gong-press");
        return false;
    }

    var hide9GongView = function () {
        $("#yinpanqimen9gong").hide();
        $("#yinpanqimenpaipan").show();
        $("#qimen-view9gong1").removeClass("qimen-view9gong-press");
    }

    function qimen4zhuClickFunc(e) {
        if (qimenData) {
            var gan = $(this).text().split("")[0];
            gongTips(gan);
        }
    }

    function gongTips(gan) {
        var qimenPan = qimenData.qimenPan;
        for (var gong in qimenData.qimenPan) {
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

    function qimenPrevClickFunc() {
        var qData = qimenObj.prevPaipan();
        qimenObj = layui.qimen;
        qimenData = qData;
        showYinpanqimen(qData);
    }

    function qimenCurClickFunc() {
        var qData = qimenObj.nowPaipan();
        qimenObj = layui.qimen;
        qimenData = qData;
        showYinpanqimen(qData);
        if (qData.isKepan) {
            $("#qimen-curpan").text("当前刻盘");
        } else {
            $("#qimen-curpan").text("当前时盘");
        }
    }

    function qimenNextClickFunc() {
        var qData = qimenObj.nextPaipan();
        qimenObj = layui.qimen;
        qimenData = qData;
        showYinpanqimen(qData);
    }

    function customPanFunc() {
        var layerIdx = layer.open({
            type: 1,
            title: "自选局数",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-tip-box',
            shade: [0.01, '#000'],
            content: '<div class="popup-tip-content"><div class="qimen-jushu-item" jushu="0">自动</div><div class="qimen-jushu-item" jushu="1">阳遁1局</div><div class="qimen-jushu-item" jushu="2">阳遁2局</div><div class="qimen-jushu-item" jushu="3">阳遁3局</div><div class="qimen-jushu-item" jushu="4">阳遁4局</div><div class="qimen-jushu-item" jushu="5">阳遁5局</div><div class="qimen-jushu-item" jushu="6">阳遁6局</div><div class="qimen-jushu-item" jushu="7">阳遁7局</div><div class="qimen-jushu-item" jushu="8">阳遁8局</div><div class="qimen-jushu-item" jushu="9">阳遁9局</div><div class="qimen-jushu-item" jushu="-1">阴遁1局</div><div class="qimen-jushu-item" jushu="-2">阴遁2局</div><div class="qimen-jushu-item" jushu="-3">阴遁3局</div><div class="qimen-jushu-item" jushu="-4">阴遁4局</div><div class="qimen-jushu-item" jushu="-5">阴遁5局</div><div class="qimen-jushu-item" jushu="-6">阴遁6局</div><div class="qimen-jushu-item" jushu="-7">阴遁7局</div><div class="qimen-jushu-item" jushu="-8">阴遁8局</div><div class="qimen-jushu-item" jushu="-9">阴遁9局</div></div>'
        });
        $(".qimen-jushu-item").off("click");
        $(".qimen-jushu-item").on("click", function () {
            var jushuText = $(this).text();
            var jushu = $(this).attr("jushu");
            qimenData = qimenObj.customPaipan(parseInt(jushu, 10));
            qimenObj = layui.qimen;
            showYinpanqimen(qimenData);
            layer.close(layerIdx);
            if (jushu != 0) {
                $("#yinpanqiman_jushu").html("<span style='color:red'>自选</span>" + (qimenData.isKepan ? "<span style='color:red'>刻盘</span>" : "") + jushuText);
            }
        });
    };

    function showYinpanqimen(qimenData) {
        if (!qimenpan_tpl) {
            $.get('templates/qimenpan_tpl.html?_=1234567890', function (template) {
                qimenpan_tpl = template;
                showYinpanqimen_(qimenData);
            });
        } else {
            showYinpanqimen_(qimenData);
        }
    }

    function showYinpanqimen_(qimenData) {
        layui.laytpl(qimenpan_tpl).render(qimenData.qimenPan, function (html) {
            $("#yinpanqimenpaipan").html(html);
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

        if (qimenData.isKepan) {
            $("#qimen-curpan").text("当前刻盘");
        } else {
            $("#qimen-curpan").text("当前时盘");
        }

        $("#yinpanqimen_desc").val("");
        $("#yinpanqiman_date").text(qimenData.date);
        $("#yinpanqiman_jieqi").html(qimenData.jieqi + (!qimenData.isKepan ? "&nbsp;&nbsp;月将<b>" + qimenData.yueJiang + "</b>" : ""));
        $("#yinpanqiman_jushu").html((qimenData.isKepan ? "<span style='color:red'>刻盘</span>" : "") + (qimenData.yangDun ? "阳遁" : "阴遁") + qimenData.jushu + "局");
        $("#yinpanqiman_zhifu").text(qimenData.zhifu);//+"("+qimenData.zhifuGong+qimenData.zhifuGongNum+"宫)");
        $("#yinpanqiman_zhishi").text(qimenData.zhishi);//+"("+qimenData.zhishiGong+qimenData.zhishiGongNum+"宫)");
        $("#yinpanqiman_xunshou").text(qimenData.xunhead);
        $("#yinpanqiman_maxing").text(qimenData.maxing);
        $("#yinpanqiman_kongwang").text(qimenData.kongwang);
        if (qimenData.isKepan) {
            $("#yinpanqiman_zhu1").text("月柱");
            $("#yinpanqiman_zhu2").text("日柱");
            $("#yinpanqiman_zhu3").text("时柱");
            $("#yinpanqiman_zhu4").text("刻柱");
        } else {
            $("#yinpanqiman_zhu1").text("年柱");
            $("#yinpanqiman_zhu2").text("月柱");
            $("#yinpanqiman_zhu3").text("日柱");
            $("#yinpanqiman_zhu4").text("时柱");
        }
        $("#yinpanqiman_year").html(qimenData.siZhu[0][0] + "<br/>" + qimenData.siZhu[0][1]);
        $("#yinpanqiman_month").html(qimenData.siZhu[1][0] + "<br/>" + qimenData.siZhu[1][1]);
        $("#yinpanqiman_day").html(qimenData.siZhu[2][0] + "<br/>" + qimenData.siZhu[2][1]);
        $("#yinpanqiman_hour").html(qimenData.siZhu[3][0] + "<br/>" + qimenData.siZhu[3][1]);

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
        });

        $("#yinpanqiman_jushu").off("click");
        $("#yinpanqiman_jushu").on("click", customPanFunc);
        $(".qimen-custompan").off("click");
        $(".qimen-custompan").on("click", customPanFunc);

    }

    $("#qimen-view12zhangsheng").on("click", toggle12Zhangshen);
    $("#qimen-viewtianmendihu").on("click", toggleTianmendihu);

    $("#qimen-view9gong1").on("mousedown", show9GongView);
    $("#qimen-view9gong1").on("touchstart", show9GongView);
    $("#qimen-view9gong1").on("mouseup", hide9GongView);
    $("#qimen-view9gong1").on("touchend", hide9GongView);

    $("#qimen-prevpan").on("click", qimenPrevClickFunc);
    $("#qimen-curpan").on("click", qimenCurClickFunc);
    $("#qimen-nextpan").on("click", qimenNextClickFunc);

    $("#yinpanqiman_year").on("click", qimen4zhuClickFunc);
    $("#yinpanqiman_month").on("click", qimen4zhuClickFunc);
    $("#yinpanqiman_day").on("click", qimen4zhuClickFunc);
    $("#yinpanqiman_hour").on("click", qimen4zhuClickFunc);

    //排阴盘奇门
    function doYinpanQimen() {
        layui.use(['qimen'], function () {
            var layerIdx = layer.open({
                type: 1,
                title: "阴盘奇门",
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
                        <div style="margin-top:5px;margin-bottom: 15px;">
                            排盘时间：<span id="popup-ypqimen-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                            <span id="popup-ypqimen-curtimebtn" class="app-cur-time-btn"></span>
                        </div>     
                        <div style="margin-top:5px;margin-bottom: 15px;">
                            排盘方式：
                            <input type="radio" id="popup-ypqimen-type1" checked name="qimen_type" value="true" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-ypqimen-type1">时盘</label>&nbsp;
                            <input type="radio" id="popup-ypqimen-type2" name="qimen_type" value="false" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-ypqimen-type2">刻盘</label>
                        </div>               
                    </div>
                    <div>
                        <button id="yinpan_btn" class="app-paipan-button">开始排盘</button>
                    </div>
                    <div>
                        <button id="yinpan_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
                    </div>
                </div>
                `
            });

            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-ypqimen-currenttime").text(currentDate);
            var dateRolldate = new RolldateFull({
                el: '#popup-ypqimen-currenttime',
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
                    $("#popup-ypqimen-currenttime").text(dateStr);
                },
            });

            $("#popup-ypqimen-curtimebtn").off("click");
            $("#popup-ypqimen-curtimebtn").on("click", function () {
                var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
                $("#popup-ypqimen-currenttime").text(currentDate);
            })

            $("#yinpan_btn").off("click");
            $("#yinpan_btn").on("click", function () {
                var str = $("#popup-ypqimen-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                var isKepan = $("input[name='qimen_type']:checked").val() != "true";
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "kepan": isKepan,
                    "cusJushu": 0
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                doOpenQimen(record);
                layer.close(layerIdx);
            });
            
            $("#yinpan_recordlist_btn").off("click");
            $("#yinpan_recordlist_btn").on("click", function () {
                var str = $("#popup-ypqimen-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                var isKepan = $("input[name='qimen_type']:checked").val() != "true";
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "kepan": isKepan,
                    "cusJushu": 0
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                doOpenQimen(record, function () {
                    layui.viewmgr.loadView('view_recordlist', function () {
                        layui.viewmgr.showView('view_recordlist');
                        if (!$("#recordsearchbox").val()) {
                            recordListView.setRecordHandler({
                                type: isKepan?2:1,
                                openListener: doOpenQimen
                            });
                            recordListView.resetFilePageNum();
                            recordListView.display();
                        }
                    });
                });
                layer.close(layerIdx);
            });            
        });
    };

    var doOpenQimen = function(record, callback){
        layui.use(['qimen'], function () {
            var data = JSON.parse(record.content);
            qimenData = layui.qimen.paipan(new Date(data.datetime), false, data.realsun, data.diqu, 0, data.kepan);
            qimenObj = layui.qimen;
            qimenData.id = record.id;
            showYinpanqimen(qimenData);
            layui.viewmgr.showView('view_yinpan_qimen');
            if (callback) {
                callback();
            }
            setTimeout(
                function () {
                    $("#yinpanqimen_desc").val(record.desc);
                }, 100
            );
        });
    }

    var doSaveQimen = function () {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#yinpanqimen_desc")) return;
        var desc = $("#yinpanqimen_desc").val();
        var bz = qimenData.bazi;
        var data = {
            "id": qimenData.id || "",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": qimenData.isKepan?2:1,
            "content":JSON.stringify({
                "datetime": layui.util.toDateString(qimenData.datetime, "yyyy-MM-dd HH:mm:ss"),
                "realsun": qimenData.realsun,
                "diqu": qimenData.diqu,
                "wanzishi": qimenData.wanzishi,
                "bazi": [bz.getYearGan(), bz.getYearZhi(), bz.getMonthGan(), bz.getMonthZhi(), bz.getDayGan(), bz.getDayZhi(), bz.getTimeGan(), bz.getTimeZhi()],
                "kepan": qimenData.isKepan,
                "cusJushu": qimenData.cusJushu || 0
            })
        }
        var url = qimenData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            data,
            function (result) {
                data.id = result.data;
                qimenData.id = data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }

    function getQimenData() {
        return qimenData;
    }

    globalThis.yinpanQimenView = {
        display: doYinpanQimen,
        doOpen: doOpenQimen,
        doSave: doSaveQimen,
        getQimenData: getQimenData
    }

    

})();