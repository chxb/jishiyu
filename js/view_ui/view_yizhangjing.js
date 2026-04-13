(function() {

    var yizhangjing = null;
    var yizhangjingData = null;

    $("#yizhangjing-prev-btn").on("click", function () {
        var prevData = yizhangjing.prevPaipan();
        showYizhangjingPan(prevData);
    });

    $("#yizhangjing-next-btn").on("click", function () {
        var nextData = yizhangjing.nextPaipan();
        showYizhangjingPan(nextData);
    });

    function showYizhangjingPan(yizhangjingData) {
        $("#yizhangjing_date").text(yizhangjingData.date);
        $("#yizhangjing_jieqi").html(yizhangjingData.jieqiInfo.from + yizhangjingData.jieqiInfo.fromDate + " ~ " + yizhangjingData.jieqiInfo.to + yizhangjingData.jieqiInfo.toDate);
        $("#yizhangjing_year").html(yizhangjingData.siZhu[0][0] + "<br/>" + yizhangjingData.siZhu[0][1]);
        $("#yizhangjing_month").html(yizhangjingData.siZhu[1][0] + "<br/>" + yizhangjingData.siZhu[1][1]);
        $("#yizhangjing_day").html(yizhangjingData.siZhu[2][0] + "<br/>" + yizhangjingData.siZhu[2][1]);
        $("#yizhangjing_hour").html(yizhangjingData.siZhu[3][0] + "<br/>" + yizhangjingData.siZhu[3][1]);

        $("#nianGong_info_zhi").text(yizhangjingData.data["year"]["zhi"]);
        $("#nianGong_info_shensha").text(yizhangjingData.data["year"]["shensha"]);
        $("#nianGong_info_liudao").text(yizhangjingData.data["year"]["liudao"]);
        $("#nianGong_info_gong").html(yizhangjingData.data["year"]["shensha_info"]);
        
        $("#moonGong_info_zhi").text(yizhangjingData.data["month"]["zhi"]);
        $("#moonGong_info_shensha").text(yizhangjingData.data["month"]["shensha"]);
        $("#moonGong_info_liudao").text(yizhangjingData.data["month"]["liudao"]);
        $("#moonGong_info_gong").html(yizhangjingData.data["month"]["shensha_info"]);
        
        $("#riGong_info_zhi").text(yizhangjingData.data["day"]["zhi"]);
        $("#riGong_info_shensha").text(yizhangjingData.data["day"]["shensha"]);
        $("#riGong_info_liudao").text(yizhangjingData.data["day"]["liudao"]);
        $("#riGong_info_gong").html(yizhangjingData.data["day"]["shensha_info"]);
        
        $("#shiGong_info_zhi").text(yizhangjingData.data["hour"]["zhi"]);
        $("#shiGong_info_shensha").text(yizhangjingData.data["hour"]["shensha"]);
        $("#shiGong_info_liudao").text(yizhangjingData.data["hour"]["liudao"]);
        $("#shiGong_info_gong").html(yizhangjingData.data["hour"]["shensha_info"]);

        $("#niangong_zhi").html(yizhangjingData.data["year"]["zhi"]);
        $("#yuegong_zhi").html(yizhangjingData.data["month"]["zhi"]);
        $("#rigong_zhi").html(yizhangjingData.data["day"]["zhi"]);
        $("#shigong_zhi").html(yizhangjingData.data["hour"]["zhi"]);

        $("#niangong_shensha").html(yizhangjingData.data["year"]["shensha"]);
        $("#yuegong_shensha").html(yizhangjingData.data["month"]["shensha"]);
        $("#rigong_shensha").html(yizhangjingData.data["day"]["shensha"]);
        $("#shigong_shensha").html(yizhangjingData.data["hour"]["shensha"]);

        $("#niangong_liudao").html(yizhangjingData.data["year"]["liudao"].substring(0,2));
        $("#yuegong_liudao").html(yizhangjingData.data["month"]["liudao"].substring(0,2));
        $("#rigong_liudao").html(yizhangjingData.data["day"]["liudao"].substring(0,2));
        $("#shigong_liudao").html(yizhangjingData.data["hour"]["liudao"].substring(0,2));

    }

    function doYizhangjing() {
        var layerIdx = layer.open({
            type: 1,
            title: "达摩一掌经排盘",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-yizhangjing-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
        <div class="popup-yizhangjing-content">
            <div style="margin-top:5px; margin-bottom:15px">
            出生时间：<span id="popup-yizhangjing-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
            <span id="popup-yizhangjing-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div style="margin-top:5px; margin-bottom:15px">
            　　性别：
                <input type="radio" id="popup-yizhangjing-man" checked name="yizhangjing_sex" value="true" style="width: 16px !important" class="popup-meihua-inputctl">
                <label for="popup-yizhangjing-man">男</label>&nbsp;
                <input type="radio" id="popup-yizhangjing-woman" name="yizhangjing_sex" value="false" style="width: 16px!important" class="popup-meihua-inputctl">
                <label for="popup-yizhangjing-woman">女</label>
            </div>
            <div id="popup-yizhangjing-guishensunni" style="margin-top:5px; margin-bottom:15px">
            顺逆方式：
            <input type="radio" id="popup-yizhangjing-sl1" checked name="yizhangjing_sl" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-yizhangjing-sl1">男顺女逆</label>&nbsp;
            <input type="radio" id="popup-yizhangjing-sl2" name="yizhangjing_sl" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-yizhangjing-sl2">阳男阴女顺，阴男阳女逆</label>&nbsp;
            </div>
            <div style="margin-top:10px;text-align: center;">
                <button class="app-paipan-button" id="popup-yizhangjing-confirm">开始排盘</button>
            </div>
        </div>
        `
        });


        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-yizhangjing-currenttime").text(currentDate);

        var dateRolldate = new RolldateFull({
            el: '#popup-yizhangjing-currenttime',
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
                $("#popup-yizhangjing-currenttime").text(dateStr);
            },
        });

        $("#popup-yizhangjing-curtimebtn").off("click");
        $("#popup-yizhangjing-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-yizhangjing-currenttime").text(currentDate);
        })


        $(".yizhangjing-info-shensha").off("click");
        $(".yizhangjing-info-shensha").on("click", function (e) {
            var othis = $(this);
            var shensha = othis.text();
            if( !shensha ) return;
            layer.open({
                type: 1,
                title: "神煞信息",
                closeBtn: 1,
                shadeClose: true,
                anim: 2,
                area: ["var(--max-page-width)", "360px"],
                isOutAnim: false,
                offset: 'b',
                skin: 'popup-tip-box',
                shade: [0.01, '#000'],
                content: '<div class="popup-tip-content">' + layui.yizhangjing.getShenshaInfo(shensha)  + '</div>'
            });
        })

        $(".yizhangjing-info-liudao").off("click");
        $(".yizhangjing-info-liudao").on("click", function (e) {
            var othis = $(this);
            var liudao = othis.text();
            if( !liudao ) return;
            layer.open({
                type: 1,
                title: "六道信息",
                closeBtn: 1,
                shadeClose: true,
                anim: 2,
                area: ["var(--max-page-width)", "360px"],
                isOutAnim: false,
                offset: 'b',
                skin: 'popup-tip-box',
                shade: [0.01, '#000'],
                content: '<div class="popup-tip-content">' + layui.yizhangjing.getLiudaoInfo(liudao)  + '</div>'
            });
        })

        $(".yizhangjing-grid-cell").off("click");
        $(".yizhangjing-grid-cell").on("click", function (e) {
            var othis = $(this);
            var gongName = othis.data("name");
            if( !gongName ) {
                gongName = $($(this)[0].parentNode).data("name");
            }
            if( !gongName ) return;
            layer.open({
                type: 1,
                title: "宫位信息",
                closeBtn: 1,
                shadeClose: true,
                anim: 2,
                area: ["var(--max-page-width)", "360px"],
                isOutAnim: false,
                offset: 'b',
                skin: 'popup-tip-box',
                shade: [0.01, '#000'],
                content: '<div class="popup-tip-content">' + layui.yizhangjing.getGongInfo(gongName)  + '</div>'
            });
        })


        $("#popup-yizhangjing-confirm").on("click", function () {
            var data ={
                "datetime": $("#popup-yizhangjing-currenttime").text(),
                "realsun": false,
                "diqu": "",
                "isman": $("input[name='yizhangjing_sex']:checked").val() === "true",
                "sunni": parseInt($("input[name='yizhangjing_sl']:checked").val(), 10),
            };
            
            doOpen(data);
            layer.close(layerIdx);
        });
    }
    
    function doOpen(params){
        layui.use(['yizhangjing'], function () {
            params.datetime = new Date(params.datetime);
            yizhangjingData = layui.yizhangjing.paipan(params);
            yizhangjing = layui.yizhangjing;
            showYizhangjingPan(yizhangjingData);
            layui.viewmgr.showView('view_yizhangjing');

        })
    }

    globalThis.yizhangjingView = {
        display: doYizhangjing,
        doOpen: doOpen,
    };
    


})();