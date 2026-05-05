/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {
    var lastActiveGua = null;
    var meihuaData = null;

    $("#meihuapaipan").on("click", function (e) {
        var clickDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className.indexOf("meihua-hexagram") > -1) {
            clickDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className.indexOf("meihua-hexagram") > -1) {
            clickDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className.indexOf("meihua-hexagram") > -1) {
            clickDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!clickDom) return;

        var guaName = $(clickDom).data("guaname");
        if (!guaName) return;

        $.ajax({
            url: "assets/64gua/" + guaName + ".txt",
            success: function (result) {
                $("#meihua_detail").text(result)
            }
        });

        if (lastActiveGua) {
            lastActiveGua.removeClass("cellActive");
        }
        $(clickDom).addClass("cellActive");
        lastActiveGua = $(clickDom);

    });

    //梅花易数排盘
    function doMeihuayishu() {
        var layerIdx = layer.open({
            type: 1,
            title: "梅花易数",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-meihua-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
        <div class="popup-meihua-content">
            <div id="popup-meihua-method0">起卦方式：
            <input type="radio" id="popup-meihua-method-m1" checked name="meihua_method" value="1" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-meihua-method-m1">时间起卦</label>&nbsp;
            <input type="radio" id="popup-meihua-method-m2" name="meihua_method" value="2" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-meihua-method-m2">数字起卦</label>&nbsp;
            <input type="radio" id="popup-meihua-method-m3" name="meihua_method" value="3" style="width: 16px !important" class="popup-meihua-inputctl">
            <label for="popup-meihua-method-m3">手动起卦</label>
        </div>
        <div id="popup-meihua-method1">
            <div style="margin-top:5px;margin-bottom: 5px;">
            当前时间：<span id="popup-meihua-currenttime" style="color: var(--theme-color);line-height: 1.3; border: 1px solid lightgray;padding: 3px;padding-right:20px;border-radius: 2px;"></span>
            <span style="font-size: 10px;margin-left: -18px;pointer-events: none;">▼</span>
            <span id="popup-meihua-curtimebtn" class="app-cur-time-btn"></span>
            </div>
            <div id="popup-meihua-info" style="padding:5px">
            起卦方法(月日数为农历)：<br/>
            上卦:(年支数+月数+日数)÷8 所得余数为上卦<br/>
            下卦:(年支数+月数+日数+时支数)÷8 所得余数为下卦<br/>
            动爻:(年支数+月数+日数+时支数)÷6 所得余数<br/>
            </div>
        </div>
        <div id="popup-meihua-method2" class="layui-hide">
            <div style="margin-top:5px">
            输入数字：<input type="number" id="popup-meihua-digits" value="" min="1" max="9999999999" class="popup-meihua-inputctl"/>
                    &nbsp;<label><input type="checkbox" id="popup-meihua-deltayaotime" value="true" style="width: 16px !important" class="popup-meihua-inputctl"/> 动爻加时辰</label>
            </div>
            <div id="popup-meihua-info">
            起卦方法：若一组数字位数为偶数，则平分为二，以前一半数字之和除以8取余数得上卦，
            以后一半数字之和除以8取余数得下卦，上下卦数相加除以6取余数为动爻数。
            若一组数其数字位数为奇数，划分时前部分数字比后部分少一个数字。
            若数字位数仅为1，则上、下卦都用该数字除以8取余数而得。
            </div>
        </div>
        <div id="popup-meihua-method3" class="layui-hide">
            <div style="margin-top:5px">
            选择上卦：
            <select id="popup-meihua-uppergua" class="popup-meihua-inputctl">
            <option value="乾">乾1(☰)</option>
            <option value="兑">兑2(☱)</option>
            <option value="离">离3(☲)</option>
            <option value="震">震4(☳)</option>
            <option value="巽">巽5(☴)</option>
            <option value="坎">坎6(☵)</option>
            <option value="艮">艮7(☶)</option>
            <option value="坤">坤8(☷)</option>
            </select>
            </div>
            <div style="margin-top:5px">
            选择下卦：
            <select id="popup-meihua-lowergua" class="popup-meihua-inputctl">
            <option value="乾">乾1(☰)</option>
            <option value="兑">兑2(☱)</option>
            <option value="离">离3(☲)</option>
            <option value="震">震4(☳)</option>
            <option value="巽">巽5(☴)</option>
            <option value="坎">坎6(☵)</option>
            <option value="艮">艮7(☶)</option>
            <option value="坤">坤8(☷)</option>
            </select>
            </div>
            <div style="margin-top:5px">
            选择动爻：
            <select id="popup-meihua-deltayao" class="popup-meihua-inputctl">
            <option value="6">上爻</option>
            <option value="5">五爻</option>
            <option value="4">四爻</option>
            <option value="3">三爻</option>
            <option value="2">二爻</option>
            <option value="1" selected>初爻</option>
            </select>
            </div>
        </div>
        <div style="margin-top:10px;text-align: center;">
            <button class="app-paipan-button" id="popup-meihua-confirm">开始排盘</button>
        </div>
        <div style="text-align: center;">
            <button id="popup-meihua_recordlist_btn" class="app-paipanlist-button">排盘记录</button>
        </div>
        </div>`
        });

        $("#popup-meihua_recordlist_btn").off("click");
        $("#popup-meihua_recordlist_btn").on("click", function () {
            var data = {
                "datetime": $("#popup-meihua-currenttime").text(),
                "method": 1,
                "containerId": "meihuapaipan",
                "digits": null,
                "deltaYaoTime": null,
                "upperGua": null,
                "lowerGua": null,
                "deltaYao": null
            }
            var record = {
                id: null,
                desc: "",
                content: JSON.stringify(data)
            }
            doOpen(record, function () {
                layui.viewmgr.loadView('view_recordlist', function () {
                    layui.viewmgr.showView('view_recordlist');
                    if (!$("#recordsearchbox").val()) {
                        recordListView.setRecordHandler({
                            type: 4,
                            openListener: doOpen
                        });
                        recordListView.resetFilePageNum();
                        recordListView.display();
                    }
                });
            });
            layer.close(layerIdx);
        });

        $("#popup-meihua-method-m1").on("change", function () {
            $("#popup-meihua-method1").removeClass("layui-hide");
            $("#popup-meihua-method2").addClass("layui-hide");
            $("#popup-meihua-method3").addClass("layui-hide");
        });
        $("#popup-meihua-method-m2").on("change", function () {
            $("#popup-meihua-method1").removeClass("layui-hide");
            $("#popup-meihua-method1").addClass("layui-hide");
            $("#popup-meihua-method2").removeClass("layui-hide");
            $("#popup-meihua-method3").addClass("layui-hide");
        });
        $("#popup-meihua-method-m3").on("change", function () {
            $("#popup-meihua-method1").addClass("layui-hide");
            $("#popup-meihua-method2").addClass("layui-hide");
            $("#popup-meihua-method3").removeClass("layui-hide");
        });

        var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
        $("#popup-meihua-currenttime").text(currentDate);
        var dateRolldate = new RolldateFull({
            el: '#popup-meihua-currenttime',
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
                $("#popup-meihua-currenttime").text(dateStr);
            },
        });

        $("#popup-meihua-curtimebtn").off("click");
        $("#popup-meihua-curtimebtn").on("click", function () {
            var currentDate = layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm");
            $("#popup-meihua-currenttime").text(currentDate);
        })

        $("#popup-meihua-confirm").off("click");
        $("#popup-meihua-confirm").on("click", function () {
            var currentDate = new Date($("#popup-meihua-currenttime").text());
            var data = null;

            if ($("#popup-meihua-method-m1").prop("checked")) {//按时间
                data = {
                    "containerId": "meihuapaipan",
                    "method": 1,
                    "datetime": currentDate
                };
            } else if ($("#popup-meihua-method-m2").prop("checked")) {//按数字
                var currentDigits = $("#popup-meihua-digits").val();
                if (!currentDigits || currentDigits.length === 0) {
                    layer.msg("请输入起卦数字!");
                    return;
                }
                var yes = $("#popup-meihua-deltayaotime").prop("checked");
                data = {
                    "containerId": "meihuapaipan",
                    "method": 2,
                    "datetime": currentDate,
                    "digits": currentDigits,
                    "deltaYaoTime": yes
                };
            } else { //手动
                data = {
                    "containerId": "meihuapaipan",
                    "method": 3,
                    "datetime": currentDate,
                    "upperGua": $("#popup-meihua-uppergua").val(),
                    "lowerGua": $("#popup-meihua-lowergua").val(),
                    "deltaYao": $("#popup-meihua-deltayao").val()
                };
            }

            var record = {
                id: null,
                desc: "",
                type: 4,
                content: JSON.stringify(data)
            }
            showMeihuayishu(record);
            layer.close(layerIdx);
        });

    }

    function showMeihuayishu(record, callback) {
        layui.use(['meihua'], function () {
            var params = JSON.parse(record.content);
            params.datetime = new Date(params.datetime);
            meihuaData = layui.meihua.paipan(params);

            $("#meihua_desc").val(record.desc);
            $("#meihua_date").text(meihuaData.date);
            $("#meihua_jieqi").html(meihuaData.jieqi);
            $("#meihua_method").html(meihuaData.method === 1 ? "时间起卦" : meihuaData.method === 2 ? "数字起卦【" + meihuaData.params.digits + "】" : "手动起卦")
            $("#meihua_year").html(meihuaData.siZhu[0][0] + "<br/>" + meihuaData.siZhu[0][1]);
            $("#meihua_month").html(meihuaData.siZhu[1][0] + "<br/>" + meihuaData.siZhu[1][1]);
            $("#meihua_day").html(meihuaData.siZhu[2][0] + "<br/>" + meihuaData.siZhu[2][1]);
            $("#meihua_hour").html(meihuaData.siZhu[3][0] + "<br/>" + meihuaData.siZhu[3][1]);

            layui.viewmgr.showView('view_meihuayishu');

            $("#meihua_bengua").addClass("cellActive");
            lastActiveGua = $("#meihua_bengua");
            $.ajax({
                url: "assets/64gua/" + $("#meihua_bengua").data("guaname") + ".txt",
                success: function (result) {
                    $("#meihua_detail").text(result)
                }
            });

            if( callback ){
                callback(record);
            }
        });
    }

    function doSave() {
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        if (!checkItemInput("#meihua_desc")) return;
        var desc = $("#meihua_desc").val();
        var data = {
            "datetime": layui.util.toDateString(meihuaData.params.datetime, "yyyy-MM-dd HH:mm:ss"),
            "method": meihuaData.params.method,
            "containerId": "meihuapaipan",
            "digits": meihuaData.params.digits,
            "deltaYaoTime": meihuaData.params.deltaYaoTime,
            "upperGua": meihuaData.params.upperGua,
            "lowerGua": meihuaData.params.lowerGua,
            "deltaYao": meihuaData.params.deltaYao
        }
        var record = {
            "id": meihuaData.id||"",
            "uid": layui.data('profile').loginuser.id,
            "desc": desc,
            "type": 4,
            "content": JSON.stringify(data)
        }
        var url = meihuaData.id ? "record/update" : "record/add";
        layui.dataservice.request(
            url,
            record,
            function (result) {
                meihuaData.id = result.data.id;
                layer.msg("已保存.", { time: 2000 });

            },
            function (result) {
                console.error("[SAVE] " + result.message);
            }
        );   
    }

    function doOpen(record, callback) {
        showMeihuayishu(record, function(){
            if( meihuaData ){
                meihuaData.id = record.id;
            }
            if(callback){
                callback(record);
            }
            setTimeout(
                function () {
                    $("#meihua_desc").val(record.desc);
                }, 100
            );
        });
        
    }


    globalThis.meihuayishuView = {
        display: doMeihuayishu,
        doSave: doSave,
        doOpen: doOpen,
    }
    

})();