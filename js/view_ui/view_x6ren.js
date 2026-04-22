(function(){

    var x6renData = null;
    var x6renObj = null;
    var x6ren_tpl = null;


    function showX6ren(x6renData) {
        if (!x6ren_tpl) {
            $.get('templates/x6ren_tpl.html?_=1234567890', function (template) {
                x6ren_tpl = template;
                showX6ren_(x6renData);
            });
        } else {
            showX6ren_(x6renData);
        }
    }

    function showX6ren_(x6renData) {
        layui.laytpl(x6ren_tpl).render(x6renData.panData, function (html) {
            $("#x6renpan").html(html);
        });

        $("#x6ren_desc").val("");
        $("#x6ren_date").text(x6renData.date);
        $("#x6ren_jieqi").text(x6renData.jieqi);
        $("#x6ren_ju").text(x6renData.ju);
        $("#x6ren_year").html(x6renData.siZhu[0][0] + "<br/>" + x6renData.siZhu[0][1]);
        $("#x6ren_month").html(x6renData.siZhu[1][0] + "<br/>" + x6renData.siZhu[1][1]);
        $("#x6ren_day").html(x6renData.siZhu[2][0] + "<br/>" + x6renData.siZhu[2][1]);
        $("#x6ren_hour").html(x6renData.siZhu[3][0] + "<br/>" + x6renData.siZhu[3][1]);
        $("#x6ren_year_kong").html(x6renData.lunar.getEightChar().getYearXunKong());
        $("#x6ren_month_kong").html(x6renData.lunar.getEightChar().getMonthXunKong());
        $("#x6ren_day_kong").html(x6renData.lunar.getEightChar().getDayXunKong());
        $("#x6ren_hour_kong").html(x6renData.lunar.getEightChar().getTimeXunKong());

        $(".x6ren-6gong-grid-cell").off("click");
        $(".x6ren-6gong-grid-cell").on("click", function (e) {
            var othis = $(this);
            var gongName = othis.attr("gong");
            if( !gongName ) {
                gongName = $($(this)[0].parentNode).attr("gong");
            }
            if( !gongName ) return;
            layui.use(['x6ren_info'], function () {
                var gongData = x6renData.panData[gongName];
                var gongInfo = [];
                gongInfo.push("<span style='color: var(--theme-color);'>" + gongName+"</span>："+
                    layui.x6ren_info.palaces[gongName].join("<br/>"));
                gongInfo.push("<span style='color: var(--theme-color);'>" + gongData.liuqin+"</span>："+
                    layui.x6ren_info.liuqins[gongData.liuqin]);
                gongInfo.push("<span style='color: var(--theme-color);'>" + gongData.shen+"</span>："+
                    layui.x6ren_info.gods[gongData.shen]);
                gongInfo.push("<span style='color: var(--theme-color);'>" + gongData.xing+"</span>："+
                    layui.x6ren_info.stars[gongData.xing]);   

                layer.open({
                    type: 1,
                    title: "宫位信息 - [" + gongName + "]",
                    closeBtn: 1,
                    shadeClose: true,
                    anim: 2,
                    area: ["var(--max-page-width)", "360px"],
                    isOutAnim: false,
                    offset: 'b',
                    skin: 'popup-tip-box',
                    shade: [0.01, '#000'],
                    content: '<div class="popup-tip-content">' + gongInfo.join("<br/>") + '</div>'
                });
            });
        })

    }


    //排阴盘奇门
    function doX6ren() {
        layui.use(['x6ren'], function () {
            var layerIdx = layer.open({
                type: 1,
                title: "小六壬排盘",
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
                            排盘时间：<span id="popup-x6ren-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
                            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
                            <span id="popup-x6ren-curtimebtn" class="app-cur-time-btn"></span>
                        </div>     
                        <div style="margin-top:5px;margin-bottom: 15px;text-align: left;">
                            起课方式：
                            <input type="radio" id="popup-x6ren-type1" checked name="x6ren_type" value="1" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-x6ren-type1">时间起课</label>&nbsp;
                            <input type="radio" id="popup-x6ren-type2" name="x6ren_type" value="2" style="width: 16px!important" class="popup-meihua-inputctl">
                            <label for="popup-x6ren-type2">报数起课</label>&nbsp;
                        </div>  
                        <div id="popup-x6ren-numdiv" style="display:none;margin-top:5px;margin-bottom: 15px;text-align: left;">
                            起课数字：
                            <input type="number" id="popup-x6ren-num" name="num" value="" style="width: 100px!important" class="popup-meihua-inputctl">
                        </div>               
                    </div>
                    <div>
                        <button id="x6ren_btn" class="app-paipan-button">开始排盘</button>
                    </div>
                    <div>
                        <button id="x6ren_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
                    </div>
                </div>
                `
            });

            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-x6ren-currenttime").text(currentDate);
            var dateRolldate = new RolldateFull({
                el: '#popup-x6ren-currenttime',
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
                    $("#popup-x6ren-currenttime").text(dateStr);
                },
            });

            $("#popup-x6ren-curtimebtn").off("click");
            $("#popup-x6ren-curtimebtn").on("click", function () {
                dateRolldate.show();
            });

            $("#popup-x6ren-curtimebtn").off("click");
            $("#popup-x6ren-curtimebtn").on("click", function () {
                var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
                $("#popup-x6ren-currenttime").text(currentDate);
            })

            $("#popup-x6ren-type1").off("click");
            $("#popup-x6ren-type1").on("click", function () {
                $("#popup-x6ren-numdiv").hide();
                $("#popup-x6ren-num").val("");
            });

            $("#popup-x6ren-type2").off("click");
            $("#popup-x6ren-type2").on("click", function () {
                $("#popup-x6ren-numdiv").show();
            });

            $("#x6ren_btn").off("click");
            $("#x6ren_btn").on("click", function () {
                var str = $("#popup-x6ren-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                var panType = parseInt($("input[name='x6ren_type']:checked").val(), 10);
                var num = parseInt($("#popup-x6ren-num").val(), 10);

                if( panType == 2) {
                    if( !num) {
                        layer.msg("请输入大于0的整数！");
                        return;
                    }
                }

                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "num": num,
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                doOpenX6ren(record);
                layer.close(layerIdx);
            });
            
            $("#x6ren_recordlist_btn").off("click");
            $("#x6ren_recordlist_btn").on("click", function () {
                var str = $("#popup-x6ren-currenttime").text().replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
                currentDate = new Date(str);
                var panType = parseInt($("input[name='x6ren_type']:checked").val(), 10);
                var num = parseInt($("#popup-x6ren-num").val(), 10);
                if( panType == 2) {
                    if( !num) {
                        layer.msg("请输入大于0的起课数字");
                        return;
                    }
                }
                var data = {
                    "datetime": currentDate,
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "num": num,
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                doOpenX6ren(record, function () {
                    layui.viewmgr.loadView('view_recordlist', function () {
                        layui.viewmgr.showView('view_recordlist');
                        if (!$("#recordsearchbox").val()) {
                            recordListView.setRecordHandler({
                                type: 10,
                                openListener: doOpenX6ren
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

    var doOpenX6ren = function(record, callback){
        layui.use(['x6ren'], function () {
            var data = JSON.parse(record.content);
            var aDate = new Date(data.datetime);
            var year = aDate.getFullYear();
            var month = aDate.getMonth() + 1;
            var day = aDate.getDate();
            var hour = aDate.getHours();
            var minute = aDate.getMinutes();    
            x6renData = layui.x6ren.paipan(year,month,day,hour,minute,data.num);
            x6renObj = layui.x6ren;
            x6renData.id = record.id;
            showX6ren(x6renData);
            layui.viewmgr.showView('view_x6ren');
            if (callback) {
                callback();
            }
            setTimeout(
                function () {
                    $("#x6ren_desc").val(record.desc);
                }, 100
            );
        });
    }

    var doSaveX6ren = function () {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#x6ren_desc")) return;
        var desc = $("#x6ren_desc").val();
        var siZhu = x6renData.siZhu;
        var data = {
            "id": x6renData.id || "",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 10,
            "content":JSON.stringify({
                "datetime": layui.util.toDateString(x6renData.datetime, "yyyy-MM-dd HH:mm:ss"),
                "realsun": false,
                "diqu": "",
                "wanzishi": false,
                "bazi": [siZhu[0][0], siZhu[0][1], siZhu[1][0], siZhu[1][1], siZhu[2][0], siZhu[2][1], siZhu[3][0], siZhu[3][1]],
                "num": x6renData.num,
            })
        }
        var url = x6renData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            data,
            function (result) {
                data.id = result.data;
                x6renData.id = data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }

    function getX6renData() {
        return x6renData;
    }

    globalThis.x6renView = {
        display: doX6ren,
        doOpen: doOpenX6ren,
        doSave: doSaveX6ren,
        getX6renData: getX6renData
    }

    

})();