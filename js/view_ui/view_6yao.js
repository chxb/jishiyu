(function() {
    var lastActiveGua = null;
    var sixYaoData = null;

    // 模拟一次扔三枚铜钱，返回爻类型
    function shakeOnce() {
        // 假设 1 是正面，0 是反面
        let total = 0;
        for (let i = 0; i < 3; i++) {
            total += Math.random() < 0.5 ? 1 : 0;
        }
        // 根据三枚铜钱之和判断爻
        switch (total) {
            case 3:
                return '0x'; // 老阴
            case 2:
                return '0';  // 少阴
            case 1:
                return '1';  // 少阳
            case 0:
                return '1o'; // 老阳
        }
    }

    //六爻排盘
    function do6yao() {
        var layerIdx = layer.open({
            type: 1,
            title: "六爻排盘",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-6yao-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
        <div class="popup-6yao-content">
            <div style="margin-top:5px; margin-bottom:15px">
            起卦时间：<span id="popup-6yao-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
            <span id="popup-6yao-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div id="popup-6yao-method0">起卦方式：
            <input type="radio" id="popup-6yao-method-m1" checked name="6yao_method" value="1" style="width: 16px !important" class="popup-6yao-inputctl">
            <label for="popup-6yao-method-m1">手动指定</label>&nbsp;
            <input type="radio" id="popup-6yao-method-m2" name="6yao_method" value="2" style="width: 16px !important" class="popup-6yao-inputctl">
            <label for="popup-6yao-method-m2">自动摇卦</label>&nbsp;
            <input type="radio" id="popup-6yao-method-m3" name="6yao_method" value="3" style="width: 16px !important" class="popup-6yao-inputctl">
            <label for="popup-6yao-method-m3">手动摇卦</label>
            </div>
            <div id="popup-6yao-method1" style="display:grid;grid-template-columns: 180px auto;margin: 10px;">
                <div>
                    <span>上爻：</span>
                    <select id="popup-6yao-6" class="popup-meihua-inputctl" style="width:120px !important">
                    <option value="1">少阳 ███</option>
                    <option value="0">少阴 █　█</option>
                    <option value="1o">老阳 ███o</option>
                    <option value="0x">老阴 █　█x</option>
                    </select><span id="idx-yao6" style="display:none;color:var(--theme-color);font-weight: 900">←</span><br/>
                    <span>五爻：</span>
                    <select id="popup-6yao-5" class="popup-meihua-inputctl" style="width:120px !important">
                    <option value="1">少阳 ███</option>
                    <option value="0">少阴 █　█</option>
                    <option value="1o">老阳 ███o</option>
                    <option value="0x">老阴 █　█x</option>
                    </select><span id="idx-yao5" style="display:none;color:var(--theme-color);font-weight: 900">←</span><br/>
                    <span>四爻：</span>
                    <select id="popup-6yao-4" class="popup-meihua-inputctl" style="width:120px !important">
                    <option value="1">少阳 ███</option>
                    <option value="0">少阴 █　█</option>
                    <option value="1o">老阳 ███o</option>
                    <option value="0x">老阴 █　█x</option>
                    </select><span id="idx-yao4" style="display:none;color:var(--theme-color);font-weight: 900">←</span><br/>
                    <span>三爻：</span>
                    <select id="popup-6yao-3" class="popup-meihua-inputctl" style="width:120px !important">
                    <option value="1">少阳 ███</option>
                    <option value="0">少阴 █　█</option>
                    <option value="1o">老阳 ███o</option>
                    <option value="0x">老阴 █　█x</option>
                    </select><span id="idx-yao3" style="display:none;color:var(--theme-color);font-weight: 900">←</span><br/>
                    <span>二爻：</span>
                    <select id="popup-6yao-2" class="popup-meihua-inputctl" style="width:120px !important">
                    <option value="1">少阳 ███</option>
                    <option value="0">少阴 █　█</option>
                    <option value="1o">老阳 ███o</option>
                    <option value="0x">老阴 █　█x</option>
                    </select><span id="idx-yao2" style="display:none;color:var(--theme-color);font-weight: 900">←</span><br/>
                    <span>初爻：</span>
                    <select id="popup-6yao-1" class="popup-meihua-inputctl" style="width:120px !important">
                    <option value="1">少阳 ███</option>
                    <option value="0">少阴 █　█</option>
                    <option value="1o">老阳 ███o</option>
                    <option value="0x">老阴 █　█x</option>
                    </select><span id="idx-yao1" style="display:none;color:var(--theme-color);font-weight: 900">←</span>
                </div>
                <div id="popup-6yao-method2" style="display:none; text-align:center; line-height:20px; margin-top:20px">
                    <div id="popup-6yao-autoall" style="cursor:pointer; border: 1px solid gray;border-radius: 8px;padding-top:5px;padding-bottom:5px">
                    <span><img id="popup-6yao1-coin1" src="images/coin1.png" style="width:40px;height:40px"></img></span>
                    <span><img id="popup-6yao1-coin2" src="images/coin1.png" style="width:40px;height:40px"></img></span>
                    <span><img id="popup-6yao1-coin3" src="images/coin1.png" style="width:40px;height:40px"></img></span>
                    <br/>
                    <span>开始自动摇卦</span>
                    </div>
                    <span style="color:gray">起卦前须静心敛神，心中默念所占之事，点击上面按钮开始自动摇卦。</span>
                </div>
                <div id="popup-6yao-method3" style="display:none; text-align:center; line-height:20px;">
                    <div id="popup-6yao-cnt" style="height:20px"></div>
                    <div id="popup-6yao-auto1" style="cursor:pointer; border: 1px solid gray;border-radius: 8px;padding-top:5px;padding-bottom:5px">
                    <span><img id="popup-6yao2-coin1" src="images/coin1.png" style="width:40px;height:40px"></img></span>
                    <span><img id="popup-6yao2-coin2" src="images/coin1.png" style="width:40px;height:40px"></img></span>
                    <span><img id="popup-6yao2-coin3" src="images/coin1.png" style="width:40px;height:40px"></img></span>
                    <br/>
                    <span>手动摇卦</span>
                    </div>
                    <span style="color:gray">起卦前须静心敛神，心中默念所占之事，点击上面按钮开始摇卦，再点一次可得一爻，反复6次。</span>

                
                </div>
            </div>
        
            <div style="margin-top:10px;text-align: center;">
                <button class="app-paipan-button" id="popup-6yao-confirm">开始排盘</button>
            </div>
            <div style="text-align: center;">
                <button id="popup-6yao_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
            </div>
        </div>`
        });

        $("#popup-6yao_recordlist_btn").off("click");
        $("#popup-6yao_recordlist_btn").on("click", function () {
            var data = {
                "datetime": $("#popup-6yao-currenttime").text(),
                "yaoList":["1","1","1","1","1","1"]
            }
            var record = {
                id: null,
                desc: "",
                content: JSON.stringify(data)
            }
            doOpen6Yao(record, function () {
                layui.viewmgr.loadView('view_recordlist', function () {
                    layui.viewmgr.showView('view_recordlist');
                    if (!$("#recordsearchbox").val()) {
                        recordListView.setRecordHandler({
                            type: 3,
                            openListener: doOpen6Yao
                        });
                        recordListView.resetFilePageNum();
                        recordListView.display();
                    }
                });
            });
            layer.close(layerIdx);
        });            

        $("#popup-6yao-method-m1").off("change");
        $("#popup-6yao-method-m1").on("change", function () {
            $("#popup-6yao-method2").hide();
            $("#popup-6yao-method3").hide();
            $("#popup-6yao1-coin1").removeClass("yao-flip-horizontal");
            $("#popup-6yao1-coin2").removeClass("yao-flip-horizontal");
            $("#popup-6yao1-coin3").removeClass("yao-flip-horizontal");
            $("#popup-6yao2-coin1").removeClass("yao-flip-horizontal");
            $("#popup-6yao2-coin2").removeClass("yao-flip-horizontal");
            $("#popup-6yao2-coin3").removeClass("yao-flip-horizontal");
            $("#idx-yao1").hide();
            $("#idx-yao2").hide();
            $("#idx-yao3").hide();
            $("#idx-yao4").hide();
            $("#idx-yao5").hide();
            $("#idx-yao6").hide();
            $("#popup-6yao-1").val("1");
            $("#popup-6yao-2").val("1");
            $("#popup-6yao-3").val("1");
            $("#popup-6yao-4").val("1");
            $("#popup-6yao-5").val("1");
            $("#popup-6yao-6").val("1");
            yao_count = 0;
            yao_processing = false;
            $("#popup-6yao-cnt").text("");
        });
        $("#popup-6yao-method-m2").off("change");
        $("#popup-6yao-method-m2").on("change", function () {
            $("#popup-6yao-method2").show();
            $("#popup-6yao-method3").hide();
            $("#popup-6yao1-coin1").removeClass("yao-flip-horizontal");
            $("#popup-6yao1-coin2").removeClass("yao-flip-horizontal");
            $("#popup-6yao1-coin3").removeClass("yao-flip-horizontal");
            $("#idx-yao1").hide();
            $("#idx-yao2").hide();
            $("#idx-yao3").hide();
            $("#idx-yao4").hide();
            $("#idx-yao5").hide();
            $("#idx-yao6").hide();
            $("#popup-6yao-1").val("");
            $("#popup-6yao-2").val("");
            $("#popup-6yao-3").val("");
            $("#popup-6yao-4").val("");
            $("#popup-6yao-5").val("");
            $("#popup-6yao-6").val("");
            yao_count = 0;
            yao_processing = false;
            $("#popup-6yao-cnt").text("");
        });
        $("#popup-6yao-method-m3").off("change");
        $("#popup-6yao-method-m3").on("change", function () {
            $("#popup-6yao-method2").hide();
            $("#popup-6yao-method3").show();
            $("#popup-6yao2-coin1").removeClass("yao-flip-horizontal");
            $("#popup-6yao2-coin2").removeClass("yao-flip-horizontal");
            $("#popup-6yao2-coin3").removeClass("yao-flip-horizontal");
            $("#idx-yao1").hide();
            $("#idx-yao2").hide();
            $("#idx-yao3").hide();
            $("#idx-yao4").hide();
            $("#idx-yao5").hide();
            $("#idx-yao6").hide();
            $("#popup-6yao-1").val("");
            $("#popup-6yao-2").val("");
            $("#popup-6yao-3").val("");
            $("#popup-6yao-4").val("");
            $("#popup-6yao-5").val("");
            $("#popup-6yao-6").val("");
            yao_count = 0;
            yao_processing = false;
            $("#popup-6yao-cnt").text("");
        });

        var themeColor = layui.data('profile').theme || "#e54844"; 
        var aColor = hexToRgba(themeColor, 0.10);
        $("#popup-6yao-autoall").css('background-color', aColor);

        //自动摇卦
        $("#popup-6yao-autoall").off("click");
        var yao_processing = false;
        $("#popup-6yao-autoall").on("click", function(){
            if( yao_processing ) return;
            yao_processing = true;
            let count = 0;
            $("#popup-6yao-1").val("");
            $("#popup-6yao-2").val("");
            $("#popup-6yao-3").val("");
            $("#popup-6yao-4").val("");
            $("#popup-6yao-5").val("");
            $("#popup-6yao-6").val("");
            $("#idx-yao1").hide();
            $("#idx-yao2").hide();
            $("#idx-yao3").hide();
            $("#idx-yao4").hide();
            $("#idx-yao5").hide();
            $("#idx-yao6").hide();
            $("#idx-yao1").show();
            $("#popup-6yao1-coin1").addClass("yao-flip-horizontal");
            $("#popup-6yao1-coin2").addClass("yao-flip-horizontal");
            $("#popup-6yao1-coin3").addClass("yao-flip-horizontal");
            let timerId = setInterval(() => {
                count++;
                $("#idx-yao1").hide();
                $("#idx-yao2").hide();
                $("#idx-yao3").hide();
                $("#idx-yao4").hide();
                $("#idx-yao5").hide();
                $("#idx-yao6").hide();
                $("#idx-yao"+(count+1)).show();

                var val = shakeOnce();
                $("#popup-6yao-"+count).val(val);
                $("#idx-yao"+count).hide();
                if( val==="1" ){
                    $("#popup-6yao1-coin1").attr("src", "images/coin1.png");
                    $("#popup-6yao1-coin2").attr("src", "images/coin0.png");
                    $("#popup-6yao1-coin3").attr("src", "images/coin1.png");
                }else if( val==="0" ){
                    $("#popup-6yao1-coin1").attr("src", "images/coin0.png");
                    $("#popup-6yao1-coin2").attr("src", "images/coin1.png");
                    $("#popup-6yao1-coin3").attr("src", "images/coin0.png");
                }else if( val==="1o" ){
                    $("#popup-6yao1-coin1").attr("src", "images/coin0.png");
                    $("#popup-6yao1-coin2").attr("src", "images/coin0.png");
                    $("#popup-6yao1-coin3").attr("src", "images/coin0.png");
                }else if( val==="0x" ){
                    $("#popup-6yao1-coin1").attr("src", "images/coin1.png");
                    $("#popup-6yao1-coin2").attr("src", "images/coin1.png");
                    $("#popup-6yao1-coin3").attr("src", "images/coin1.png");
                }

                if (count >= 6) {
                    clearInterval(timerId);
                    yao_processing = false;
                    $("#popup-6yao1-coin1").removeClass("yao-flip-horizontal");
                    $("#popup-6yao1-coin2").removeClass("yao-flip-horizontal");
                    $("#popup-6yao1-coin3").removeClass("yao-flip-horizontal");
                }

            }, 777);

        });

        //手动摇卦
        $("#popup-6yao-auto1").css('background-color', aColor);
        $("#popup-6yao-auto1").off("click");
        var yao_count = 0;
        $("#popup-6yao-auto1").on("click", function(){
            if( yao_processing ){
                var val = shakeOnce();;
                $("#popup-6yao-"+yao_count).val(val);
                $("#idx-yao"+yao_count).hide();
                if( val==="1" ){
                    $("#popup-6yao2-coin1").attr("src", "images/coin1.png");
                    $("#popup-6yao2-coin2").attr("src", "images/coin0.png");
                    $("#popup-6yao2-coin3").attr("src", "images/coin1.png");
                }else if( val==="0" ){
                    $("#popup-6yao2-coin1").attr("src", "images/coin0.png");
                    $("#popup-6yao2-coin2").attr("src", "images/coin1.png");
                    $("#popup-6yao2-coin3").attr("src", "images/coin0.png");
                }else if( val==="1o" ){
                    $("#popup-6yao2-coin1").attr("src", "images/coin0.png");
                    $("#popup-6yao2-coin2").attr("src", "images/coin0.png");
                    $("#popup-6yao2-coin3").attr("src", "images/coin0.png");
                }else if( val==="0x" ){
                    $("#popup-6yao2-coin1").attr("src", "images/coin1.png");
                    $("#popup-6yao2-coin2").attr("src", "images/coin1.png");
                    $("#popup-6yao2-coin3").attr("src", "images/coin1.png");
                }
                yao_processing = false;
                $("#popup-6yao2-coin1").removeClass("yao-flip-horizontal");
                $("#popup-6yao2-coin2").removeClass("yao-flip-horizontal");
                $("#popup-6yao2-coin3").removeClass("yao-flip-horizontal");
                $("#popup-6yao-cnt").text("已摇"+yao_count+"次");
                if( yao_count >= 6 ){
                    yao_count = 0;
                }
                return;
            };
            if( yao_count == 0){
                $("#popup-6yao-1").val("");
                $("#popup-6yao-2").val("");
                $("#popup-6yao-3").val("");
                $("#popup-6yao-4").val("");
                $("#popup-6yao-5").val("");
                $("#popup-6yao-6").val("");
            }
            yao_count++;
            yao_processing = true;
            $("#idx-yao1").hide();
            $("#idx-yao2").hide();
            $("#idx-yao3").hide();
            $("#idx-yao4").hide();
            $("#idx-yao5").hide();
            $("#idx-yao6").hide();
            $("#idx-yao"+(yao_count)).show();
            $("#popup-6yao2-coin1").addClass("yao-flip-horizontal");
            $("#popup-6yao2-coin2").addClass("yao-flip-horizontal");
            $("#popup-6yao2-coin3").addClass("yao-flip-horizontal");
            $("#popup-6yao-cnt").text("开始摇第"+yao_count+"次");
        })

        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-6yao-currenttime").text(currentDate);
        var dateRolldate = new RolldateFull({
            el: '#popup-6yao-currenttime',
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
                $("#popup-6yao-currenttime").text(dateStr);
            },
        });

        $("#popup-6yao-curtimebtn").off("click");
        $("#popup-6yao-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-6yao-currenttime").text(currentDate);
        })

        $("#popup-6yao-confirm").off("click");
        $("#popup-6yao-confirm").on("click", function () {
            if( !$("#popup-6yao-1").val() || !$("#popup-6yao-2").val() || !$("#popup-6yao-3").val() 
                || !$("#popup-6yao-4").val() || !$("#popup-6yao-5").val() || !$("#popup-6yao-6").val() ){
                layui.layer.msg("请先摇完所有卦爻！");
                return;
            }

            var currentDate = $("#popup-6yao-currenttime").text();
            var yaoList = [
                $("#popup-6yao-1").val(),
                $("#popup-6yao-2").val(),
                $("#popup-6yao-3").val(),
                $("#popup-6yao-4").val(),
                $("#popup-6yao-5").val(),
                $("#popup-6yao-6").val(),
            ];

            var data = {
                datetime: currentDate,
                method: $("#popup-6yao-method-m1").prop("checked") ? "手动指定" : $("#popup-6yao-method-m2").prop("checked") ? "自动摇卦" : "手动摇卦",
                yaoList: yaoList,
            }
            var record = {
                id: null,
                desc: "",
                content: JSON.stringify(data)
            }
            show6Yao(record);
            layer.close(layerIdx);
        });

    }

    function show6Yao(record, callback) {
        layui.use(['6yao'], function () {
            var data = JSON.parse(record.content);
            var _6yaoData = layui["6yao"].paipan(new Date(data.datetime), data.yaoList);
            sixYaoData = _6yaoData;

            $("#6yao_desc").val(record.desc);
            $("#6yao_date").text(_6yaoData.date);
            $("#6yao_jieqi").html(_6yaoData.jieqiInfo.from + _6yaoData.jieqiInfo.fromDate + " ~ " + _6yaoData.jieqiInfo.to + _6yaoData.jieqiInfo.toDate);
            $("#6yao_method").html(data.method);
            $("#6yao_year").html(_6yaoData.siZhu[0].join("") + "年");
            $("#6yao_month").html("<span style='color:red'>" + _6yaoData.siZhu[1].join("") + "</span>月");
            $("#6yao_day").html("<span style='color:red'>" + _6yaoData.siZhu[2].join("") + "</span>日");
            $("#6yao_hour").html(_6yaoData.siZhu[3].join("") + "时");
            $("#6yao_niankong").html(_6yaoData.lunar.getEightChar().getYearXunKong());
            $("#6yao_yuekong").html(_6yaoData.lunar.getEightChar().getMonthXunKong());
            $("#6yao_rikong").html(_6yaoData.lunar.getEightChar().getDayXunKong());
            $("#6yao_shikong").html(_6yaoData.lunar.getEightChar().getTimeXunKong());
            $("#6yao_shensha").html(_6yaoData.data["shensha"]);
            //将_6yaoData.data["shensha"]中数组值{"shenSha":x,"zhi":y}转换为“shenSha值-zhi值”用空格连接起来
            $("#6yao_shensha").html(_6yaoData.data["shensha"].map(function (item) {
                return item["shenSha"] + "-" + "<span class='yao-shensha'>" + item["zhi"] + "</span>";
            }).join("　"));

            layui["6yao"].renderPan("6yaopaipan", _6yaoData.data);

            layui.viewmgr.showView('view_6yao');

            layui.use(['6yao_info'], function () {
                //检查_6yaoData.data["base_gua"][index]["isShi"]==true，则显示详细信息
                var yaoInfo = _6yaoData.data["base_gua"]["yao_info"];
                for (var index = 0; index < yaoInfo.length; index++) {
                    if (yaoInfo[index]["isShi"]) {
                        $("#6yao_explain").text(layui["6yao_info"][yaoInfo[index]["6qin"]]);
                    }
                }
            });

            $("#6yao_shensha").removeClass("yao-yima-more");
            $("#6yao_shensha").addClass("yao-yima-less");
            $("#6yao_shen_more").off("click");
            $("#6yao_shen_more").on("click", function () {
                if ($("#6yao_shensha").attr("class") === "yao-yima-more") {
                    $("#6yao_shensha").removeClass("yao-yima-more");
                    $("#6yao_shensha").addClass("yao-yima-less");
                    $("#6yao_shen_more").text("展开");
                } else {
                    $("#6yao_shensha").removeClass("yao-yima-less");
                    $("#6yao_shensha").addClass("yao-yima-more");
                    $("#6yao_shen_more").text("收起");
                }
            });

            if( callback ){
                callback(record);
            }
        })
    }

    var doSave6Yao = function () {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#6yao_desc")) return;
        var desc = $("#6yao_desc").val();
        var method = $("#6yao_method").text();
        var data = {
            "datetime": layui.util.toDateString(sixYaoData.datetime, "yyyy-MM-dd HH:mm:ss"),
            "method": method,
            "yaoList": sixYaoData.yaoList,
        }
        var record = {
            "id": sixYaoData.id||"",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 3,
            "content": JSON.stringify(data)
        }
        var url = sixYaoData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            record,
            function (result) {
                sixYaoData.id = result.data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }

    var doOpen6Yao = function (record, callback) {
        show6Yao(record, function(){
            if( sixYaoData ){
                sixYaoData.id = record.id;
            }
            if(callback){
                callback(record);
            }
            setTimeout(
                function () {
                    $("#6yao_desc").val(record.desc);
                }, 100
            );
        });
    }


    globalThis.sixyaoView = {
        display: do6yao,
        doSave: doSave6Yao,
        doOpen: doOpen6Yao
    }
    

})();


