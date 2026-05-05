/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {

    var sxQimen = null;
    var sxQimenData = null;
    var qimenpan_tpl = null;

    function sxQimenPrevClickFunc() {
        var qimenData = sxQimen.prevPaipan();
        sxQimen = layui.qimen;
        sxQimenData = qimenData;
        if (qimenData.shanxiang) {
            showShanxiangQimen(qimenData)
        }

    }

    function sxQimenCurClickFunc() {
        var qimenData = sxQimen.nowPaipan();
        sxQimen = layui.qimen;
        sxQimenData = qimenData;
        if (qimenData.shanxiang) {
            showShanxiangQimen(qimenData)
        }
    }

    function sxQimenNextClickFunc() {
        var qimenData = sxQimen.nextPaipan();
        sxQimen = layui.qimen;
        sxQimenData = qimenData;
        if (qimenData.shanxiang) {
            showShanxiangQimen(qimenData)
        }
    }

    function showShanxiangQimen(qimenData) {
        if (!qimenpan_tpl) {
            $.get('templates/qimenpan_tpl.html?_=1234567890', function (template) {
                qimenpan_tpl = template;
                showShanxiangQimen_(qimenData);
            });
        } else {
            showShanxiangQimen_(qimenData);
        }
    }

    function showShanxiangQimen_(qimenData) {
        layui.laytpl(qimenpan_tpl).render(qimenData.qimenPan, function (html) {
            $("#shanxiangqimenpaipan").html(html);
        });
        $("#shanxiangqimen_desc").val("");
        $("#shanxiangqiman_shanxiang").text(qimenData.shanxiang.shan + "山" + qimenData.shanxiang.xiang + "向 度数(" + qimenData.shanxiang.degree + "～" + (qimenData.shanxiang.degree + 4) + ")");
        $("#shanxiangqiman_year").html(qimenData.solar.getYear() + "年");
        $("#shanxiangqiman_ganzhi").html(("<span style='font-weight:bold'>" + qimenData.siZhu[2][0] + qimenData.siZhu[2][1] + "&nbsp;&nbsp;&nbsp;<span style='color:red'>" + qimenData.siZhu[3][0] + qimenData.siZhu[3][1] + "</span></span>&nbsp;&nbsp;&nbsp;黄泉<span style='font-weight:bold'>" + qimenData.shanxiang.huangquan + "</span>&nbsp;&nbsp;&nbsp;") + (qimenData.yangDun ? "阳遁" : "阴遁") + qimenData.jushu + "局");
        $("#shanxiangqiman_zhifu").text(qimenData.zhifu);
        $("#shanxiangqiman_zhishi").text(qimenData.zhishi);
        $("#shanxiangqiman_xunshou").text(qimenData.xunhead);
        $("#shanxiangqiman_maxing").text(qimenData.maxing);
        $("#shanxiangqiman_kongwang").text(qimenData.kongwang);

        $(".qimen-curpan").text("当前盘");

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
    }

    $("#sxqimen-prevpan").on("click", sxQimenPrevClickFunc);
    $("#sxqimen-curpan").on("click", sxQimenCurClickFunc);
    $("#sxqimen-nextpan").on("click", sxQimenNextClickFunc);

    //排山向奇门
    function doShanxiangQimen(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi) {
        if (!isValidDateTime(year, month, day, hour, minute, second)) {
            return;
        }

        var layerIdx = layer.open({
            type: 1,
            title: "山向奇门",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-shanxiang-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
            <div class="popup-shanxiang-content">
                <div style="text-align:left; padding-left:20px;">
                    <span>选择年份：<span>
                    <span id="popup-shanxiang-currentyear" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                    <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                </div>
                <div style="text-align:left; padding-left:20px;">
                    <span>输入度数：</span>
                    <span>
                    <button class="popup-shanxiang-minus">-</button>
                    <input type="number" class="popup-shanxiang-input" id="shanxiang_degree_input" value="180" min="0" max="360"/>
                    <button class="popup-shanxiang-plus">+</button>
                    </span>
                </div>
                <div>
                    <button class="app-paipan-button" id="shanxiang_degree_btn" class="popup-shanxiang-btn">排盘</button>
                </div>
                <div style="text-align: center;">
                    <button id="popup-shanxiang_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
                </div>  
            </div>
            `
        });

        $("#popup-shanxiang_recordlist_btn").off("click");
        $("#popup-shanxiang_recordlist_btn").on("click", function () {
            var d = $("#shanxiang_degree_input").val();
            var degree = parseInt(d, 10);
            if (!d || degree < 0 || degree > 360) {
                layer.msg('必须输入0-360之间的度数', { time: 2000 });
                return false;
            }
            var datetime = new Date();
            datetime.setFullYear(parseInt($("#popup-shanxiang-currentyear").text().replace("年", "")));
            var data = {
                "datetime": layui.util.toDateString(datetime, "yyyy-MM-dd HH:mm:ss"),
                "degree": degree,
            }
            var record = {
                "id": "",
                "desc": "",
                "type": 8,
                "content": JSON.stringify(data)
            };
            doOpen(record, function () {
                layui.viewmgr.loadView('view_recordlist', function () {
                    layui.viewmgr.showView('view_recordlist');
                    if (!$("#recordsearchbox").val()) {
                        recordListView.setRecordHandler({
                            type: 8,
                            openListener: doOpen
                        });
                        recordListView.resetFilePageNum();
                        recordListView.display();
                    }
                });
            });
            layer.close(layerIdx);
        });        

        var currentDate = layui.util.toDateString(new Date(), "yyyy");
        $("#popup-shanxiang-currentyear").text(currentDate+"年");

        shanxiangYearRolldate = new Rolldate({
            el: '#popup-shanxiang-currentyear',
            isLunar: false,
            format: 'YYYY',
            beginYear: 1800,
            endYear: 2199,
            lang: { title: "年份" },
            confirm: function (date, lunar) {
                var year = date.getFullYear();
                $("#popup-shanxiang-currentyear").text(year + "年 ");
            },
        });

        $(".popup-shanxiang-minus").off("click");
        $(".popup-shanxiang-minus").on("click", function () {
            var d = $("#shanxiang_degree_input").val();
            try {
                var degree = parseInt(d, 10);
                if (degree - 1 < 0) degree = 1;
                $("#shanxiang_degree_input").val(degree - 1);
            } catch (e) {
            }
        });
        $(".popup-shanxiang-plus").off("click");
        $(".popup-shanxiang-plus").on("click", function () {
            var d = $("#shanxiang_degree_input").val();
            try {
                var degree = parseInt(d, 10);
                if (degree + 1 > 360) degree = 359;
                $("#shanxiang_degree_input").val(degree + 1);
            } catch (e) {
            }
        });
        $("#shanxiang_degree_btn").off("click");
        $("#shanxiang_degree_btn").on("click", function () {
            var d = $("#shanxiang_degree_input").val();
            var degree = parseInt(d, 10);
            if (!d || degree < 0 || degree > 360) {
                layer.msg('必须输入0-360之间的度数', { time: 2000 });
                return false;
            }
            var datetime = new Date();
            datetime.setFullYear(parseInt($("#popup-shanxiang-currentyear").text().replace("年", "")));
            var data = {
                "datetime": layui.util.toDateString(datetime, "yyyy-MM-dd HH:mm:ss"),
                "degree": degree,
            }
            var record = {
                "id": "",
                "desc": "",
                "type": 8,
                "content": JSON.stringify(data)
            };
            doOpen(record);
            layer.close(layerIdx);
        })
    }

    function doOpen(record, callback){
        layui.use(['qimen'], function () {
            var params = JSON.parse(record.content);
            params.datetime = new Date(params.datetime);
            layui.qimen.originDegree = null;
            sxQimenData = layui.qimen.paipan(params.datetime, false, false, "", false, false, 0, params.degree);
            sxQimenData.params = params;
            sxQimen = layui.qimen;
            sxQimenData.id = record.id;
            showShanxiangQimen(sxQimenData);
            layui.viewmgr.showView('view_shanxiang_qimen');
            if(callback){
                callback(record);
            }
            setTimeout(
                function () {
                    $("#shanxiangqimen_desc").val(record.desc);
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
        if (!checkItemInput("#shanxiangqimen_desc")) return;
        var desc = $("#shanxiangqimen_desc").val();
        var data = {
            "datetime": layui.util.toDateString(sxQimenData.params.datetime, "yyyy-MM-dd HH:mm:ss"),
            "degree": sxQimenData.params.degree,
        };
        var record = {
            "id": sxQimenData.id||"",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 8,
            "content": JSON.stringify(data)
        };
        var url = sxQimenData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            record,
            function (result) {
                sxQimenData.id = result.data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );        
    }

    globalThis.shanxiangQimenView = {
        display: doShanxiangQimen,
        doSave: doSave,
        doOpen: doOpen,
    }   
    
    
})();