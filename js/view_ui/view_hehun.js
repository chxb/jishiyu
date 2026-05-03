(function () {

    var manBaziData = null;
    var womanBaziData = null;

    var manRolldate = null;
    var womanRolldate = null;

    function initRolldate() {
        if (manRolldate) return;

        manRolldate = new RolldateFull({
            el: '#hehun_man_date',
            value: '',
            dateType: 1,
            format: 'YYYY-MM-DD hh:mm',
            beginYear: 1920,
            endYear: 2199,
            zhaowanzhishi: false,
            showValue: function () {
                var v = $("#hehun_man_date").val();
                return { dateValue: v || '', wanzhishi: false };
            },
            confirm: function (date) {
                var dateStr = layui.util.toDateString(date, "yyyy-MM-dd HH:mm");
                $("#hehun_man_date").val(dateStr);
            },
        });

        womanRolldate = new RolldateFull({
            el: '#hehun_woman_date',
            value: '',
            dateType: 1,
            format: 'YYYY-MM-DD hh:mm',
            beginYear: 1920,
            endYear: 2199,
            zhaowanzhishi: false,
            showValue: function () {
                var v = $("#hehun_woman_date").val();
                return { dateValue: v || '', wanzhishi: false };
            },
            confirm: function (date) {
                var dateStr = layui.util.toDateString(date, "yyyy-MM-dd HH:mm");
                $("#hehun_woman_date").val(dateStr);
            },
        });
    }

    function doHehunPaipan() {
        var manDateStr = $("#hehun_man_date").val();
        var womanDateStr = $("#hehun_woman_date").val();

        if (!manDateStr) {
            layer.msg("请选择男方出生日期");
            return;
        }
        if (!womanDateStr) {
            layer.msg("请选择女方出生日期");
            return;
        }

        var reg = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/;
        if (!reg.test(manDateStr)) {
            layer.msg("男方日期格式不正确");
            return;
        }
        if (!reg.test(womanDateStr)) {
            layer.msg("女方日期格式不正确");
            return;
        }

        layui.use(['bazi', 'hehun'], function () {
            var baziObj = layui.bazi;
            var hehunObj = layui.hehun;

            var manArr = manDateStr.split(/[-\s:]+/);
            var womanArr = womanDateStr.split(/[-\s:]+/);

            var manResult = baziObj.paipan(
                parseInt(manArr[0]), parseInt(manArr[1]), parseInt(manArr[2]),
                parseInt(manArr[3]), parseInt(manArr[4]), 0,
                true, false, "", false, false
            );
            if (!manResult) {
                layer.msg("男方日期排盘失败");
                return;
            }

            var womanResult = baziObj.paipan(
                parseInt(womanArr[0]), parseInt(womanArr[1]), parseInt(womanArr[2]),
                parseInt(womanArr[3]), parseInt(womanArr[4]), 0,
                false, false, "", false, false
            );
            if (!womanResult) {
                layer.msg("女方日期排盘失败");
                return;
            }

            manBaziData = manResult.baziData;
            womanBaziData = womanResult.baziData;

            renderBaziTable(manResult, "m");
            renderBaziTable(womanResult, "w");
            renderDayun(manResult, "hh_man_dayun");
            renderDayun(womanResult, "hh_woman_dayun");

            var hehunResult = hehunObj.hehun(manResult.bazi, true, womanResult.bazi, false);
            renderHehunResult(hehunResult);

            $("#hehun_result_panel").show();
        });
    }

    function renderBaziTable(result, prefix) {
        var lunar = result.lunar;
        var bd = result.baziData;
        var yc = bd.yearCol;
        var mc = bd.monthCol;
        var dc = bd.dayCol;
        var hc = bd.hourCol;

        var info = lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + "日 " + lunar.getTimeZhi() + "时";
        info += " <br/> " + lunar.getYearShengXiaoByLiChun();
        info += " | " + result.baseDate.getFullYear() + "-" + (result.baseDate.getMonth() + 1) + "-" + result.baseDate.getDate() + " " + result.baseDate.getHours() + ":" + (result.baseDate.getMinutes() < 10 ? "0" : "") + result.baseDate.getMinutes();

        $("#" + (prefix === "m" ? "hehun_man_basic" : "hehun_woman_basic")).html(info);

        $("#hh_" + prefix + "_yGanSh").html("<span class='shishen-tag'>" + yc.ganShishen + "</span>");
        $("#hh_" + prefix + "_mGanSh").html("<span class='shishen-tag'>" + mc.ganShishen + "</span>");
        $("#hh_" + prefix + "_hGanSh").html("<span class='shishen-tag'>" + hc.ganShishen + "</span>");

        $("#hh_" + prefix + "_yGan").text(yc.gan);
        $("#hh_" + prefix + "_mGan").text(mc.gan);
        $("#hh_" + prefix + "_dGan").text(dc.gan);
        $("#hh_" + prefix + "_hGan").text(hc.gan);

        $("#hh_" + prefix + "_yGan").removeClass().addClass(wuxingStyle(yc.ganWuxing) + " ganzhiStyle");
        $("#hh_" + prefix + "_mGan").removeClass().addClass(wuxingStyle(mc.ganWuxing) + " ganzhiStyle");
        $("#hh_" + prefix + "_dGan").removeClass().addClass(wuxingStyle(dc.ganWuxing) + " ganzhiStyle");
        $("#hh_" + prefix + "_hGan").removeClass().addClass(wuxingStyle(hc.ganWuxing) + " ganzhiStyle");

        $("#hh_" + prefix + "_yZhi").text(yc.zhi);
        $("#hh_" + prefix + "_mZhi").text(mc.zhi);
        $("#hh_" + prefix + "_dZhi").text(dc.zhi);
        $("#hh_" + prefix + "_hZhi").text(hc.zhi);

        $("#hh_" + prefix + "_yZhi").removeClass().addClass(wuxingStyle(dizhiWuxing(yc.zhi)) + " ganzhiStyle");
        $("#hh_" + prefix + "_mZhi").removeClass().addClass(wuxingStyle(dizhiWuxing(mc.zhi)) + " ganzhiStyle");
        $("#hh_" + prefix + "_dZhi").removeClass().addClass(wuxingStyle(dizhiWuxing(dc.zhi)) + " ganzhiStyle");
        $("#hh_" + prefix + "_hZhi").removeClass().addClass(wuxingStyle(dizhiWuxing(hc.zhi)) + " ganzhiStyle");

        $("#hh_" + prefix + "_yNayin").html(nayinStyle(yc.nayin));
        $("#hh_" + prefix + "_mNayin").html(nayinStyle(mc.nayin));
        $("#hh_" + prefix + "_dNayin").html(nayinStyle(dc.nayin));
        $("#hh_" + prefix + "_hNayin").html(nayinStyle(hc.nayin));
    }

    function renderDayun(result, containerId) {
        var dayunList = result.baziData.dayun;
        var html = '<span style="display: flex;align-items: center;font-size:13px;color:#333;font-weight:bold;">大<br/>运</span>';
        for (var i = 0; i < dayunList.length && i < 6; i++) {
            var dy = dayunList[i];
            html += '<span style="display:inline-block;margin-right:4px;text-align:center;vertical-align:top;font-size:13px;">';
            html += '<span style="font-size:10px;color:#555;">' + dy.startAge + '岁</span><br/>';
            html += '<span class="' + wuxingStyle(dy.ganWuxing) + '" style="font-size:13px !important;font-weight:900 !important;">' + dy.gan + '</span><br/>';
            html += '<span class="' + wuxingStyle(dy.zhiWuxing) + '" style="font-size:13px !important;font-weight:900 !important;">' + dy.zhi + '</span>';
            html += '</span>';
        }
        $("#" + containerId).html(html);
    }

    function renderHehunResult(result) {
        var passCount = result.passCount;
        var totalRules = result.totalRules;
        $("#hh_pass_count").html(
            "符合 <b style='font-size:20px;color:" + (passCount >= 10 ? "#52c41a" : passCount >= 7 ? "#faad14" : "#f5222d") + "'>" + passCount + "</b> / " + totalRules + " 条"
        );

        var rulesHtml = "";
        for (var i = 0; i < result.rules.length; i++) {
            var rule = result.rules[i];
            var icon = rule.pass ? "✅" : "❌";
            if (!rule.implemented) {
                icon = "➖";
            }
            rulesHtml += "<tr>";
            rulesHtml += "<td style='font-size:13px;'>" + rule.name + "</td>";
            rulesHtml += "<td style='text-align:center;'>" + icon + "</td>";
            rulesHtml += "<td style='font-size:12px;word-break:break-all;word-wrap:break-word;'>" + rule.passDesc;
            if (rule.detail) rulesHtml += "<br/><span style='color:#888;font-size:11px;'>" + rule.detail + "</span>";
            rulesHtml += "</td>";
            rulesHtml += "</tr>";
        }
        $("#hh_rules_body").html(rulesHtml);
    }

    function beginPaipan() {
        $("#hehun_input_panel").show();
        $("#hehun_result_panel").hide();
        $("#hehun_man_date").val("");
        $("#hehun_woman_date").val("");
        $("#hehun_man_info").html("");
        $("#hehun_woman_info").html("");
        initRolldate();
        layui.viewmgr.showView('view_hehun');
        var aDate = new Date();
        aDate.setFullYear(aDate.getFullYear() - 22);
        var currentDate = layui.util.toDateString(aDate, "yyyy-MM-dd HH:mm");
        $("#hehun_man_date").val(currentDate);
        aDate.setFullYear(aDate.getFullYear() + 2);
        var currentDate = layui.util.toDateString(aDate, "yyyy-MM-dd HH:mm");
        $("#hehun_woman_date").val(currentDate);
    }

    var _pickPageNum = 0;
    var _pickPageSize = 50;
    var _pickLoading = false;
    var _pickLayerIndex = null;
    var _pickSearchKey = "";
    var _pickSearchTimer = null;

    function _renderFileItem(item) {
        var baziArr = item.bazi ? item.bazi.split(",") : [];
        var sexIcon = item.sex ? "♂" : "♀";
        var dateStr = item.gldatetime ? item.gldatetime.substring(0, 13).replace(/-/g, ".") + "时" : "";
        var html = '<div class="layui-card" style="margin:5px 0;cursor:pointer;" data-fileid="' + item.id + '">';
        html += '<div class="layui-card-body" style="padding:8px 12px;display:flex;align-items:center;">';
        html += '<span class="app-file-list-item-sex-' + (item.sex ? 'm' : 'f') + '" style="font-size:18px;margin-right:10px;width:30px;text-align:center;">' + sexIcon + '</span>';
        html += '<div style="flex:1;">';
        html += '<div style="font-size:14px;font-weight:bold;">' + (item.name || "未命名") + '</div>';
        html += '<div style="font-size:12px;color:#999;">' + dateStr + '</div>';
        html += '</div>';
        if (baziArr.length >= 8) {
            html += '<div style="font-size:14px;text-align:center;">';
            for (var j = 0; j < 8; j += 2) {
                html += '<span style="display:inline-block;margin:0 2px;"><span class="' + wuxingStyle(tianganWuxing(baziArr[j])) + ' ganzhiStyle" style="font-size:14px !important;">' + baziArr[j] + '</span><br/><span class="' + wuxingStyle(dizhiWuxing(baziArr[j + 1])) + ' ganzhiStyle" style="font-size:14px !important;">' + baziArr[j + 1] + '</span></span>';
            }
            html += '</div>';
        }
        html += '</div></div>';
        return html;
    }

    function _loadMoreFiles(target) {
        if (_pickLoading) return;
        _pickLoading = true;
        var profile = layui.data('profile');
        layui.dataservice.browse(
            {
                "uid": profile && profile.loginuser ? profile.loginuser.id : "",
                "name": _pickSearchKey,
                "page": _pickPageNum,
                "size": _pickPageSize
            },
            function (result) {
                _pickLoading = false;
                if (!result || result.code != "200" || !result.data || result.data.length === 0) {
                    if (_pickPageNum === 0) {
                        layer.msg("暂无档案数据");
                        layer.close(_pickLayerIndex);
                    }
                    return;
                }
                var container = $("#hehun_file_list");
                for (var i = 0; i < result.data.length; i++) {
                    container.append(_renderFileItem(result.data[i]));
                }
                _pickPageNum++;
            },
            function (result) {
                _pickLoading = false;
                layer.msg("获取档案失败：" + (result.message || "请先登录"));
            }
        );
    }

    function showFilePicker(target) {
        _pickPageNum = 0;
        _pickLoading = false;
        _pickSearchKey = "";

        var content = '<div style="padding:8px 10px 0;">';
        content += '<div style="display:flex;align-items:center;margin-bottom:8px;">';
        content += '<input type="text" id="hehun_file_search" class="layui-input" placeholder="搜索姓名" style="flex:1;height:32px;font-size:14px;border-radius:16px;padding:0 14px;" />';
        content += '</div>';
        content += '</div>';
        content += '<div id="hehun_file_list" style="max-height:44vh;overflow-y:auto;padding:0 5px 5px;"></div>';

        _pickLayerIndex = layer.open({
            type: 1,
            title: "选择八字档案",
            content: content,
            area: ["var(--max-page-width)", "60%"],
            offset: "b",
            shadeClose: true,
            anim: 2,
            isOutAnim: false,
            skin: 'popup-hehun-box',
            success: function (layero, index) {
                _loadMoreFiles(target);

                $(layero).on("click", ".layui-card", function () {
                    var fileId = $(this).data("fileid");
                    pickFile(fileId, target, index);
                });

                $(layero).find("#hehun_file_list").on("scroll", function () {
                    var el = this;
                    if (el.scrollTop + el.clientHeight + 20 >= el.scrollHeight) {
                        _loadMoreFiles(target);
                    }
                });

                $(layero).find("#hehun_file_search").on("input", function () {
                    var val = $(this).val().trim();
                    if (_pickSearchTimer) clearTimeout(_pickSearchTimer);
                    _pickSearchTimer = setTimeout(function () {
                        _pickSearchKey = val;
                        _pickPageNum = 0;
                        _pickLoading = false;
                        $("#hehun_file_list").empty();
                        _loadMoreFiles(target);
                    }, 400);
                });
            }
        });
    }

    function pickFile(fileId, target, layerIndex) {
        layui.dataservice.read(
            { id: fileId },
            function (result) {
                if (!result || !result.data) {
                    layer.msg("读取档案失败");
                    return;
                }
                var data = result.data;
                if (target === "hehun_man" && !data.sex) {
                    layer.msg("男方需选择男性档案");
                    return;
                }
                if (target === "hehun_woman" && data.sex) {
                    layer.msg("女方需选择女性档案");
                    return;
                }
                var birthArr = data.gldatetime.split("");
                var yy = parseInt(birthArr[0] + birthArr[1] + birthArr[2] + birthArr[3]);
                var mm = parseInt(birthArr[5] + birthArr[6]);
                var dd = parseInt(birthArr[8] + birthArr[9]);
                var hh = parseInt(birthArr[11] + birthArr[12]);
                var mi = parseInt(birthArr[14] + birthArr[15]);
                var dateStr = yy + "-" + (mm < 10 ? "0" : "") + mm + "-" + (dd < 10 ? "0" : "") + dd + " " + (hh < 10 ? "0" : "") + hh + ":" + (mi < 10 ? "0" : "") + mi;

                $("#" + target + "_date").val(dateStr);
                layer.close(layerIndex);
            },
            function (result) {
                layer.msg("读取档案失败：" + (result.message || ""));
            }
        );
    }

    $("#hehun_start_btn").on("click", function () {
        doHehunPaipan();
    });

    $("#hehun_man_pick").on("click", function () {
        showFilePicker("hehun_man");
    });

    $("#hehun_woman_pick").on("click", function () {
        showFilePicker("hehun_woman");
    });

    globalThis.hehunView = {
        display: beginPaipan
    };

})();
