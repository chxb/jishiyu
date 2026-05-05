/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function(){

    globalThis.qimen12zhangshengVis = false;
    var qimenData = null;
    var qimenObj = null;
    var qimenpan_tpl = null;
    var dipan8shenVis = false;

    function toggle12Zhangshen() {
        if (globalThis.qimen12zhangshengVis) {
            $(".qimendunjia-12zhangsheng").css("visibility", "hidden");
            globalThis.qimen12zhangshengVis = false;
        } else {
            $(".qimendunjia-12zhangsheng").css("visibility", "visible");
            globalThis.qimen12zhangshengVis = true;
        }
        layui.data('profile', {
            key: 'show12zhangshen',
            value: globalThis.qimen12zhangshengVis
        });
        return false;
    }

    function toggleDipan8shenFunc(){
        if( dipan8shenVis ){
            $(".qimendunjia-dishen").css("visibility", "hidden");
            dipan8shenVis = false;
        } else {
            $(".qimendunjia-dishen").css("visibility", "visible");
            dipan8shenVis = true;
        }
    }

    function qimenPrevClickFunc() {
        var qData = qimenObj.prevPaipan();
        qimenObj = layui.qimendunjia;
        qimenData = qData;
        showQimen(qData);
    }

    function qimenCurClickFunc() {
        var qData = qimenObj.nowPaipan();
        qimenObj = layui.qimendunjia;
        qimenData = qData;
        showQimen(qData);
    }

    function qimenNextClickFunc() {
        var qData = qimenObj.nextPaipan();
        qimenObj = layui.qimendunjia;
        qimenData = qData;
        showQimen(qData);
    }

    function showQimen(qimenData) {
        if (!qimenpan_tpl) {
            $.get('templates/qimendunjiapan_tpl.html?_=1234567890', function (template) {
                qimenpan_tpl = template;
                showQimen_(qimenData);
            });
        } else {
            showQimen_(qimenData);
        }
    }

    function showQimen_(qimenData) {
        layui.laytpl(qimenpan_tpl).render(qimenData.qimenPan, function (html) {
            $("#qimendunjiapaipan").html(html);
        });

        globalThis.qimen12zhangshengVis = false;
        var profile = layui.data('profile');
        if (profile) {
            globalThis.qimen12zhangshengVis = profile["show12zhangshen"];
        }
        if (globalThis.qimen12zhangshengVis) {
            $(".qimendunjia-12zhangsheng").css("visibility", "visible");
        } else {
            $(".qimendunjia-12zhangsheng").css("visibility", "hidden");
        }

        $("#qimendunjia_desc").val("");
        $("#qimendunjia_date").text(qimenData.date);
        $("#qimendunjia_jieqi").text(qimenData.jieqi);
        $("#qimendunjia_ju").text((qimenData.panMethod === 1 ? '拆补' : (qimenData.panMethod === 2 ? '置闰' : '茅山')) + " " + qimenData.panJu);
        $("#qimendunjia_zhifu").text(qimenData.zhifuzhishi["值符星宫"][0]);
        $("#qimendunjia_zhishi").text(qimenData.zhifuzhishi["值使门宫"][0]);
        $("#qimendunjia_xunshou").text(qimenData.xunHead);
        $("#qimendunjia_maxing").text(qimenData.maxing["驿马"]);
        $("#qimendunjia_kongwang").text(qimenData.xunKong);
        $("#qimendunjia_year").html(qimenData.siZhu[0][0] + "<br/>" + qimenData.siZhu[0][1]);
        $("#qimendunjia_month").html(qimenData.siZhu[1][0] + "<br/>" + qimenData.siZhu[1][1]);
        $("#qimendunjia_day").html(qimenData.siZhu[2][0] + "<br/>" + qimenData.siZhu[2][1]);
        $("#qimendunjia_hour").html(qimenData.siZhu[3][0] + "<br/>" + qimenData.siZhu[3][1]);

    }

    $("#qimendunjia-12zhangsheng").on("click", toggle12Zhangshen);
    $("#qimendunjia-dipan8shen").on("click", toggleDipan8shenFunc);

    $("#qimendunjia-prevpan").on("click", qimenPrevClickFunc);
    $("#qimendunjia-curpan").on("click", qimenCurClickFunc);
    $("#qimendunjia-nextpan").on("click", qimenNextClickFunc);


    //排阴盘奇门
    function doQimendunjia() {
        layui.use(['qimendunjia'], function () {
            var layerIdx = layer.open({
                type: 1,
                title: "奇门遁甲",
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
                            排盘时间：<span id="popup-qimendunjia-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                            <span id="popup-qimendunjia-curtimebtn" class="app-cur-time-btn"></span>
                        </div>     
                        <div style="margin-top:5px;margin-bottom: 15px;text-align: left;">
                            起局方式：
                            <input type="radio" id="popup-qimendunjia-type1" checked name="qimen_type" value="1" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-qimendunjia-type1">拆补</label>&nbsp;
                            <input type="radio" id="popup-qimendunjia-type2" name="qimen_type" value="2" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-qimendunjia-type2">置闰</label>&nbsp;
                            <input type="radio" id="popup-qimendunjia-type3" name="qimen_type" value="3" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-qimendunjia-type3">茅山</label>
                        </div>  
                        <div style="margin-top:5px;margin-bottom: 15px;text-align: left;">
                            暗干起法：
                            <input type="radio" id="popup-qimendunjia-angantype1" checked name="angan_type" value="1" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-qimendunjia-angantype1">值使门起</label>&nbsp;
                            <input type="radio" id="popup-qimendunjia-angantype2" name="angan_type" value="2" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-qimendunjia-angantype2">门地盘起</label>
                        </div>               
                    </div>
                    <div>
                        <button id="qimendunjia_btn" class="app-paipan-button">开始排盘</button>
                    </div>
                    <div>
                        <button id="qimendunjia_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
                    </div>
                </div>
                `
            });

            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-qimendunjia-currenttime").text(currentDate);
            var dateRolldate = new RolldateFull({
                el: '#popup-qimendunjia-currenttime',
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
                    $("#popup-qimendunjia-currenttime").text(dateStr);
                },
            });

            $("#popup-qimendunjia-curtimebtn").off("click");
            $("#popup-qimendunjia-curtimebtn").on("click", function () {
                dateRolldate.show();
            });

            $("#popup-qimendunjia-curtimebtn").off("click");
            $("#popup-qimendunjia-curtimebtn").on("click", function () {
                var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
                $("#popup-qimendunjia-currenttime").text(currentDate);
            })

            $("#qimendunjia_btn").off("click");
            $("#qimendunjia_btn").on("click", function () {
                var str = $("#popup-qimendunjia-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                var panMethod = parseInt($("input[name='qimen_type']:checked").val(), 10);
                var anganType = parseInt($("input[name='angan_type']:checked").val(), 10);
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "panMethod": panMethod,
                    "anganType": anganType
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                doOpenQimen(record);
                layer.close(layerIdx);
            });
            
            $("#qimendunjia_recordlist_btn").off("click");
            $("#qimendunjia_recordlist_btn").on("click", function () {
                var str = $("#popup-qimendunjia-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                var panMethod = parseInt($("input[name='qimen_type']:checked").val(), 10);
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "panMethod": panMethod,
                    "anganType": parseInt($("input[name='angan_type']:checked").val(), 10)
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
                                type: 9,
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
        layui.use(['qimendunjia'], function () {
            var data = JSON.parse(record.content);
            var aDate = new Date(data.datetime);
            var year = aDate.getFullYear();
            var month = aDate.getMonth() + 1;
            var day = aDate.getDate();
            var hour = aDate.getHours();
            var minute = aDate.getMinutes();    
            
            qimenData = layui.qimendunjia.paipan(year,month,day,hour,minute,data.panMethod,data.anganType);
            dipan8shenVis = false;
            qimenObj = layui.qimendunjia;
            qimenData.id = record.id;
            showQimen(qimenData);
            layui.viewmgr.showView('view_qimendunjia');
            if (callback) {
                callback();
            }
            setTimeout(
                function () {
                    $("#qimendunjia_desc").val(record.desc);
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
        if (!checkItemInput("#qimendunjia_desc")) return;
        var desc = $("#qimendunjia_desc").val();
        var siZhu = qimenData.siZhu;
        var data = {
            "id": qimenData.id || "",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "panMethod": qimenData.panMethod,
            "type": 9,
            "content":JSON.stringify({
                "datetime": layui.util.toDateString(qimenData.datetime, "yyyy-MM-dd HH:mm:ss"),
                "realsun": false,
                "diqu": "",
                "wanzishi": false,
                "bazi": [siZhu[0][0], siZhu[0][1], siZhu[1][0], siZhu[1][1], siZhu[2][0], siZhu[2][1], siZhu[3][0], siZhu[3][1]],
                "panMethod": qimenData.panMethod,
                "anganType": qimenData.anganType || 0
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

    globalThis.qimendunjiaView = {
        display: doQimendunjia,
        doOpen: doOpenQimen,
        doSave: doSaveQimen,
        getQimenData: getQimenData
    }

    

})();