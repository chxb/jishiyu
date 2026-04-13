(function(){

    //八字界面初始化相关
    

    var solar = null;
    var lunar = null;
    var bazi = null;
    var dayun = null;
    var yun = null;
    var isMan = null;
    
    var currentData = null;

    var DAYUN_NUM = 10; //显示10个大运
    
    var taisuiType = 1; //1：以流年地支起太岁；2：以大运地支起太岁；3：以日干起太岁

    var profile = layui.data('profile');
    var dayunliunianstyle = "4";
    if( profile && profile.dayunliunianstyle ){
        dayunliunianstyle = profile.dayunliunianstyle;//流年显示风格
    }

    //笔记界面年份滚动控件
    var bazinoteYearRolldate = null;
    function initBazinoteYearRolldate() {
        if (bazinoteYearRolldate) return;
        bazinoteYearRolldate = new Rolldate({
            el: '#bazinoteYearDiv',
            isLunar: false,
            format: 'YYYY',
            beginYear: 1800,
            endYear: 2199,
            lang: { title: "年份" },
            confirm: function (date, lunar) {
                var year = date.getFullYear();
                var d = Lunar.fromYmd(year, 5, 1);
                $(curBazinoteYearCell).text(year + "年 " + d.getYearGan() + d.getYearZhi());
            },
        });
    }

    //显示某标签页, 1-基本,2-命盘,3-详盘,4-笔记
    var showBaziPaipanTab = function (t) {
        layui.element.tabChange('bazipaipantab', "tab" + t);
        if (t == 3) {
            $("#app-toggle-table").show();
        } else {
            $("#app-toggle-table").hide();
        }
        $("#appframe").scrollTop(0);
    }

    //初始化参数控制参数
    var initParamsCtlMenuDropdowned = false;
    function initParamsCtlDropdown() {
        if (initParamsCtlMenuDropdowned) return;
        var dropdown  = layui.dropdown;
        dropdown.render({
            elem: '.app-params-ctrl',
            trigger: 'click',
            isAllowSpread: false,
            data: [{
                title: '胎命身',
                id: 101,
                }, {
                title: '神煞',
                id: 102,
                },{
                title: '串宫压运',
                id: 103,
                type: 'group',
                child: [{
                    title: '流年起太岁',
                    id: 1031
                },{
                    title: '大运起太岁',
                    id: 1032
                },{
                    title: '日干起太岁',
                    id: 1033
                }],
                },{
                title: '流年表格',
                id:104,
            }],
            click: function (obj, othis) {
                switch(obj.id){
                    case 101:
                        switchTaimingshenFunc();
                        break;
                    case 102:
                        toggleShenshaTableClickFunc();
                        break;
                    case 1031:
                        toggle12Shen(true);
                        showChuanGong12Gods(1);
                        break;
                    case 1032:
                        toggle12Shen(true);
                        showChuanGong12Gods(2);
                        break;
                    case 1033:
                        toggle12Shen(true);
                        showChuanGong12Gods(3);
                        break;
                    case 104:
                        switchLiunianTableFunc();
                        break;
                }
            },
        })

    }

    //初始化笔记界面下拉框组件
    var initBaziNoteDropdowned = false;
    function initBaziNoteDropdown() {
        if (initBaziNoteDropdowned) return;
        var dropdown = layui.dropdown;
        dropdown.render({
            elem: '#popmenu_wangshuai',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 100px',
            align: 'right',
            data: [{
                title: '旺极',
            }, {
                title: '太旺',
            }, {
                title: '旺',
            }, {
                title: '均衡',
            }, {
                title: '弱',
            }, {
                title: '太弱',
            }, {
                title: '弱极',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "wangshuai": obj.title
                });
            },
        });
        dropdown.render({
            elem: '#popmenu_geju',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 100px',
            align: 'right',
            data: [{
                title: '正官格',
            }, {
                title: '七杀格',
            }, {
                title: '正财格',
            }, {
                title: '偏财格',
            }, {
                title: '正印格',
            }, {
                title: '偏印格',
            }, {
                title: '食神格',
            }, {
                title: '伤官格',
            }, {
                title: '劫财格',
            }, {
                title: '建禄格',
            }, {
                title: '曲直格',
            }, {
                title: '炎上格',
            }, {
                title: '润下格',
            }, {
                title: '稼樯格',
            }, {
                title: '从革格',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "geju": obj.title
                });
            },
        });
        dropdown.render({
            elem: '#popmenu_xiji',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 100px',
            align: 'right',
            data: [{
                title: '喜金',
            }, {
                title: '喜水',
            }, {
                title: '喜木',
            }, {
                title: '喜火',
            }, {
                title: '喜土',
            }, {
                title: '忌金',
            }, {
                title: '忌水',
            }, {
                title: '忌木',
            }, {
                title: '忌火',
            }, {
                title: '忌土',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "xiji": form.val('bazinoteform').xiji + obj.title
                });
            },
        });
        dropdown.render({
            elem: '#popmenu_zhiye',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 100px',
            align: 'right',
            data: [{
                title: '经商',
            }, {
                title: '从政',
            }, {
                title: '公检法',
            }, {
                title: '职工',
            }, {
                title: '农民',
            }, {
                title: '医生',
            }, {
                title: '教师',
            }, {
                title: '技术',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "zhiye": obj.title
                });
            },
        });
        dropdown.render({
            elem: '#popmenu_xueli',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 200px',
            align: 'right',
            data: [{
                title: '低学历(小学～大专)',
            }, {
                title: '一般学历(大专～二本)',
            }, {
                title: '高学历(一本～博士)',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "xueli": obj.title
                });
            },
        });
        dropdown.render({
            elem: '#popmenu_caifu',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 150px',
            align: 'right',
            data: [{
                title: '温饱(20万以下)',
            }, {
                title: '小康(20万以上)',
            }, {
                title: '小富(100万以上)',
            }, {
                title: '中富(1000万以上)',
            }, {
                title: '大富(1亿以上)',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "caifu": obj.title
                });
            },
        });
        dropdown.render({
            elem: '#popmenu_hunyin',
            trigger: 'click',
            isAllowSpread: false,
            style: 'width: 100px',
            align: 'right',
            data: [{
                title: '未婚',
            }, {
                title: '已婚',
            }, {
                title: '二婚',
            }, {
                title: '三婚',
            }, {
                title: '离异',
            }, {
                title: '丧偶',
            }],
            click: function (obj, othis) {
                var form = layui.form;
                form.val('bazinoteform', {
                    "hunyin": obj.title
                });
            },
        });
    }

    /**
     * 画五行统计图
     * @param bazi bazi对象
     * @param iscg 是否计算藏干
     */
    var wxQty = 0;
    function wuxingChart(bazi, iscg) {
        wxQty = statWuxingQty(bazi, iscg);
        var disTxt = wxQty["金"] + "个" + queryShishenByWuxing("金", tianganWuxing(bazi.getDayGan()));
        $("#chartBarValueJin").html(disTxt);
        disTxt = wxQty["水"] + "个" + queryShishenByWuxing("水", tianganWuxing(bazi.getDayGan()));
        $("#chartBarValueShui").html(disTxt);
        disTxt = wxQty["木"] + "个" + queryShishenByWuxing("木", tianganWuxing(bazi.getDayGan()));
        $("#chartBarValueMu").html(disTxt);
        disTxt = wxQty["火"] + "个" + queryShishenByWuxing("火", tianganWuxing(bazi.getDayGan()));
        $("#chartBarValueHuo").html(disTxt);
        disTxt = wxQty["土"] + "个" + queryShishenByWuxing("土", tianganWuxing(bazi.getDayGan()));
        $("#chartBarValueTu").html(disTxt);
        setTimeout(chartResize, 200);
    }

    function chartResize() {
        var width = $("#chartBarJin").parent().width();
        $("#chartBarJin").width((wxQty["金"] / 15) * width);
        width = $("#chartBarJin").parent().width();
        $("#chartBarShui").width((wxQty["水"] / 15) * width);
        width = $("#chartBarJin").parent().width();
        $("#chartBarMu").width((wxQty["木"] / 15) * width);
        width = $("#chartBarJin").parent().width();
        $("#chartBarHuo").width((wxQty["火"] / 15) * width);
        width = $("#chartBarJin").parent().width();
        $("#chartBarTu").width((wxQty["土"] / 15) * width);
    }

    //八字界面标签页切换事件
    function bazipaipantabChangeFunc(data) {
        if (data.index == 0) {
            setTimeout(chartResize, 200);
        }
        if (data.index == 2) {//详盘
            $(".app-params-ctrl").show();
        } else {
            $(".app-params-ctrl").hide();
        }
        if (data.index == 3) { //笔记

        }
        $("#appframe").scrollTop(0);
    }

    //点击神煞、十神、纳音的事件
    function shenshaTagClickFunc(e) {
        //点击神煞
        if (e && e.target.className.indexOf("shensha-tag") != -1) {
            var shensha = $(e.target).text();
            layer.open({
                type: 1,
                title: shensha,
                closeBtn: 1,
                shadeClose: true,
                anim: 2,
                area: ["var(--max-page-width)", "360px"],
                isOutAnim: false,
                offset: 'b',
                skin: 'popup-tip-box',
                shade: [0.01, '#000'],
                content: '<div class="popup-tip-content">' + layui.shensha.getShenshaInfos()[shensha] + '</div>'
            });
        } else ////点击十神
            if (e && e.target.className.indexOf("shishen-tag") != -1) {
                var shishen = $(e.target).text();
                layer.open({
                    type: 1,
                    title: shishen,
                    closeBtn: 1,
                    shadeClose: true,
                    anim: 2,
                    area: ["var(--max-page-width)", "360px"],
                    isOutAnim: false,
                    offset: 'b',
                    skin: 'popup-tip-box',
                    shade: [0.01, '#000'],
                    content: '<div class="popup-tip-content">' + HELP_SHISHEN_INFO[shishen] + '</div>'
                });
            } else ////点击纳音
                if (e && e.target.className.indexOf("nayin") != -1) {
                    var nayin = $(e.target).text();
                    layer.open({
                        type: 1,
                        title: nayin,
                        closeBtn: 1,
                        shadeClose: true,
                        anim: 2,
                        area: ["var(--max-page-width)", "360px"],
                        isOutAnim: false,
                        offset: 'b',
                        skin: 'popup-tip-box',
                        shade: [0.01, '#000'],
                        content: '<div class="popup-tip-content">' + HELP_NAYIN_INFO[nayin] + '</div>'
                    });
                } else
                    if (e && e.target.className.indexOf("_12shen") != -1) {
                        var _12shen = $(e.target).text();
                        if( _12shen!="-" ){
                            layer.open({
                                type: 1,
                                title: _12shen,
                                closeBtn: 1,
                                shadeClose: true,
                                anim: 2,
                                area: ["var(--max-page-width)", "360px"],
                                isOutAnim: false,
                                offset: 'b',
                                skin: 'popup-tip-box',
                                shade: [0.01, '#000'],
                                content: '<div class="popup-tip-content">' + HELP_12SHEN_INFO[_12shen] + '</div>'
                            });
                        }
                        
                    }
    }

    //折叠/展开神煞表格的事件
    function toggleShenshaTableClickFunc() {
        var cls = $("#app-toggle-table").attr("class");
        if (cls.indexOf("table-max") != -1) {
            toggelShenshaTable(false);
        } else {
            toggelShenshaTable(true);
        }
    }

    //切换是否显示神煞表
    function toggelShenshaTable(vis) {
        if (!vis) {
            $("#app-toggle-table").removeClass("app-toggle-table-max");
            $("#app-toggle-table").addClass("app-toggle-table-min");
            $("#XPshenshaRow").hide();
            $(".xp-ymd-more").hide();
        } else {
            $("#app-toggle-table").removeClass("app-toggle-table-min");
            $("#app-toggle-table").addClass("app-toggle-table-max");
            $("#XPshenshaRow").show();
            $(".xp-ymd-more").show();
        }
    }
    //折叠/展开串宫12神的事件
    function toggle12ShenFunc() {
        //取得行的display样式
        var dis = !($("#XPgan12shenRow").css("display")==="none");
        if (dis) {
            toggle12Shen(false);
        } else {
            toggle12Shen(true);
        }
    }
    //显示串宫12神
    function toggle12Shen(vis) {
        if (!vis) {
            $("#XPgan12shenRow").hide();
            $("#XPzhi12shenRow").hide();
            $("#chuangongSwitchBtnSpan").removeClass("app-chuangong-switch-on");
            $("#chuangongSwitchBtnSpan").addClass("app-chuangong-switch-off");
            chuangongSwitch = false;
        }else{
            $("#XPgan12shenRow").show();
            $("#XPzhi12shenRow").show();
            $("#chuangongSwitchBtnSpan").removeClass("app-chuangong-switch-off");
            $("#chuangongSwitchBtnSpan").addClass("app-chuangong-switch-on");
            chuangongSwitch = true;
        }
    }
    //保存笔记
    var doSaveBaziNote = function (isNew) {
        if (typeof isNew === 'boolean' && isNew) {
            doClearBaziNoteTable();
            bazinotetableAddRowFunc();
        }

        var form = layui.form;
        var formData = form.val("myform");
        var isautosave = formData.autosave;
        if (!isautosave) {
            layer.msg("‘保存’开关未开启，无法保存.", { time: 1500 });
            return;
        };
        var profile = layui.data('profile');
        if (!profile || !profile.loginuser) {
            layer.msg("您未登录，登录后才能保存.", { time: 2000 });
            return;
        }
        var formData = form.val("bazinoteform");
        var noteData = {
            "wangshuai": formData.wangshuai,
            "geju": formData.geju,
            "xiji": formData.xiji,
            "zhiye": formData.zhiye,
            "xueli": formData.xueli,
            "caifu": formData.caifu,
            "hunyin": formData.hunyin,
            "summary": formData.summary,
            "history": []
        }
        var rows = $("#bazinotetable")[0].rows;
        for (var i = 0; i < rows.length; i++) {
            var yearData = rows[i].cells[0].innerText;
            var eventData = rows[i].cells[1].innerText;
            var item = {};
            item["year"] = yearData;
            item["event"] = eventData;
            if ((item["year"] == "年份" && item["event"] == "输入事项")) {
                continue;
            }
            if ((item["year"] && item["event"])) {
                noteData.history.push(item);
            }
        }
        var data = {
            id: currentData.id || "",
            note: JSON.stringify(noteData)
        };
        var url = "bznote/save"; //isNew===true?"bznote/add":"bznote/update";
        layui.dataservice.request(
            url,
            data,
            function (result) {
                data.id = result.data;
                layer.msg("已保存.", { time: 1000 });
            },
            function (result) {
                layer.msg(result.message, { time: 1500 });
                console.error("[SAVE] " + result.message);
            });
    }

    //清除笔记界面的表格
    var doClearBaziNoteTable = function () {
        var table = $("#bazinotetable")[0];
        var rowNum = table.rows.length;
        var i = 0;
        for (i = 0; i < rowNum; i++) {
            table.deleteRow(i);
            rowNum = rowNum - 1;
            i = i - 1;
        }
        var form = layui.form;
        form.val("bazinoteform", {
            "wangshuai": "",
            "geju": "",
            "xiji": "",
            "zhiye": "",
            "xueli": "",
            "caifu": "",
            "hunyin": "",
            "summary": "",
        });
    }
    //打开笔记
    var doOpenBaziNote = function (fileId) {
        var table = $("#bazinotetable")[0];
        doClearBaziNoteTable();
        var data = { id: fileId };
        layui.dataservice.request(
            "bznote/get",
            data,
            function (result) {
                var result = result;
                if (!result || !result.data) {
                    //layer.msg('数据错误，无法打开!',{time:2000});
                    bazinotetableAddRowFunc();
                    return;
                }
                var noteData = JSON.parse(result.data.note);
                var form = layui.form;
                form.val("bazinoteform", {
                    "wangshuai": noteData.wangshuai,
                    "geju": noteData.geju,
                    "xiji": noteData.xiji,
                    "zhiye": noteData.zhiye,
                    "xueli": noteData.xueli,
                    "caifu": noteData.caifu,
                    "hunyin": noteData.hunyin,
                    "summary": noteData.summary,
                });

                if (noteData.history && noteData.history.length > 0) {
                    for (var i = 0; i < noteData.history.length; i++) {
                        bazinotetableAddRowFunc();
                        var rows = table.rows;
                        rows[rows.length - 1].cells[0].innerText = noteData.history[i]["year"];
                        rows[rows.length - 1].cells[1].innerText = noteData.history[i]["event"];
                    }
                }
                setTimeout(function () {
                    var textarea = $("#bazinotesummary")[0];
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }, 500);

            },
            function (result) {
                //layer.msg('数据错误，无法打开! '+result.message,{time:2000});
                console.error("[READ] " + result.message);
            })

    }


    //八字笔记
    //删除一行事件
    var bazinotetableRemoveRowFunc = function () {
        var index = $(this)[0].parentNode.rowIndex;
        $("#bazinotetable")[0].deleteRow(index);
    }

    var bazinotetableAddRowBtnFunc = function (e) {
        if (e.offsetX > $(e.target).width() - 30) {
            bazinotetableAddRowFunc();
        }
    }

    //添加一行事项
    var bazinotetableAddRowFunc = function (e) {
        var table = $("#bazinotetable")[0];
        var row = table.insertRow(-1);
        row.insertCell(-1);
        $(row.cells[0]).addClass("app-savenote-yearcell");
        $(row.cells[0]).html("年份");
        row.insertCell(-1);
        $(row.cells[1]).attr('contenteditable', true);
        $(row.cells[1]).addClass("app-savenote-txtcell");
        $(row.cells[1]).html("输入事项");
        row.insertCell(-1);
        $(row.cells[2]).addClass("app-savenote-btncell");

        $(".app-savenote-btncell").off("click", bazinotetableRemoveRowFunc);
        $(".app-savenote-btncell").on("click", bazinotetableRemoveRowFunc);
        $(".app-savenote-yearcell").off("click", bazinoteYearShowFunc);
        $(".app-savenote-yearcell").on("click", bazinoteYearShowFunc);
    }

    function bazinotetableKeydownFunc(e) {
        var cell = $(e.target);
        if (cell.index() == 1) {
            if (e.keyCode == 8) return;
            if ((e.target.innerText && e.target.innerText.length > 30) || e.keyCode == 13) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            }
        }
    }

    function bazinotetableCompositionendFunc(e) {
        var cell = $(e.target);
        if (cell.index() == 1) {//限制最长50字符
            if ((e.target.innerText && e.target.innerText.length > 50)) {
                e.target.innerText = e.target.innerText.substring(0, 50);
            }
        }
    }

    function bazinotesummaryInputFunc(e) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    function bazinotesummaryChangeFunc(e) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    var curBazinoteYearCell = null;
    var bazinoteYearShowFunc = function () {
        curBazinoteYearCell = this;
        bazinoteYearRolldate.show();
    };

    var curDayun, curLiunian, curLiuyue, curLiuri;
    var lastActiveList = { "dayun": null, "liunian": null, "liunian2": null, "liuyue": null, "liuri": null };
    var clearActiveCell = function (cellType) {
        if (!lastActiveList[cellType]) return;
        lastActiveList[cellType].removeClass('cellActive');
        lastActiveList[cellType] = null;
    }
    
    //大运表格点击事件
    var dayunTableClickFunc = function (e) {
        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className == "dayun-grid-cell") {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "dayun-grid-cell") {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "dayun-grid-cell") {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;

        clearActiveCell("dayun");
        clearActiveCell("liunian");
        clearActiveCell("liunian2");
        clearActiveCell("liuyue");
        clearActiveCell("liuri");
        hideLiuYueCol();
        hideLiuriCol();
        hideLiuriTable();

        $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
        $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
        taishenmingSwitch = false;

        $("#MPtianganliuyi").html("(无)");
        $("#MPdizhiliuyi").html("(无)");
        var col = $(tdDom).attr("col");
        var row = $(tdDom).attr("row");

        //刷新流年(小表)
        showLiuNianTable2(bazi, dayun[col]);//第n个大运的流年
        //刷新流月表
        showLiuYueTable(bazi, dayun[col].getLiuNian()[0]);//第n个大运第1个流年

        if (!dayun[col] || dayun[col].getLiuNian().length == 0) {
            curDayun = dayun[col];
            return;
        }

        var dc1 = null;
        var dc2 = null;
        var dc3 = null;
        var dc4 = null;
        dc1 = $("#dayunTable>div>div[row=0][col=" + col + "]");
        dc1.addClass('cellActive');
        lastActiveList["dayun"] = (dc1);
        dc2 = $("#liunianTable>div>div[row=0][col=" + col + "]");
        dc2.addClass('cellActive');
        lastActiveList["liunian"] = (dc2);
        dc3 = $("#liunianTable2>div>div[row=0][col=0]");
        dc3.addClass('cellActive');
        lastActiveList["liunian2"] = (dc3);

        curDayun = dayun[col];
        curLiunian = curDayun.getLiuNian()[0];
        curLiuyue = null;

        if (col > 0) {
            showDayunCol(dc1.attr("ganzhi"), 5, dc1.attr("year"), dc1.attr("age"));
            showDayunLiunian12Gods(dc1.attr("ganzhi"), dc2.attr("ganzhi"), getTaisuiZhi());
        } else if (col == 0) {
            showDayunCol(dc2.attr("xiaoyun"), 15, dc2.attr("xyyear"), dc2.attr("xyage"));
            showDayunLiunian12Gods(dc2.attr("xiaoyun"), dc2.attr("ganzhi"), taisuiType==2? dc2.attr("xiaoyun")[1] :getTaisuiZhi());
        }

        showLiuNianCol(dc2.attr("ganzhi"), 6, dc2.attr("year"), dc2.attr("age"));
        showXiangPanLiuYi(bazi, dc1.attr("ganzhi"), dc2.attr("ganzhi"));
        show4Zhu12Gods(bazi, getTaisuiZhi());
        

    }

    //流年大表格点击事件
    var liunianTableClickFunc = function (e) {
        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className.indexOf("liunian-grid-cell") != -1) {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className.indexOf("liunian-grid-cell") != -1) {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className.indexOf("liunian-grid-cell") != -1) {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;

        clearActiveCell("dayun");
        clearActiveCell("liunian");
        clearActiveCell("liunian2");
        clearActiveCell("liuyue");
        clearActiveCell("liuri");
        hideLiuYueCol();
        hideLiuriCol();
        hideLiuriTable();

        $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
        $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
        taishenmingSwitch = false;

        var col = $(tdDom).attr("col");
        var row = $(tdDom).attr("row");

        //刷新流年(小表)
        showLiuNianTable2(bazi, dayun[col]);//第n个大运的流年
        //刷新流月表
        showLiuYueTable(bazi, dayun[col].getLiuNian()[row]);//第n个大运第n流年

        var dc1 = null;
        var dc2 = null;
        var dc3 = null;
        var dc4 = null;
        dc1 = $("#dayunTable>div>div[row=0][col=" + col + "]");
        dc1.addClass('cellActive');
        lastActiveList["dayun"] = (dc1);
        dc2 = $("#liunianTable>div>div[row=" + row + "][col=" + col + "]");
        dc2.addClass('cellActive');
        lastActiveList["liunian"] = (dc2);
        dc3 = $("#liunianTable2>div>div[row=0][col=" + row + "]");
        dc3.addClass('cellActive');
        lastActiveList["liunian2"] = (dc3);

        curDayun = dayun[col];
        curLiunian = curDayun.getLiuNian()[row];
        curLiuyue = null

        if (col > 0) {
            showDayunCol(dc1.attr("ganzhi"), 5, dc1.attr("year"), dc1.attr("age"));
            showDayunLiunian12Gods(dc1.attr("ganzhi"), dc2.attr("ganzhi"), getTaisuiZhi());
        } else if (col == 0) {
            showDayunCol(dc2.attr("xiaoyun"), 15, dc2.attr("xyyear"), dc2.attr("xyage"));
            showDayunLiunian12Gods(dc2.attr("xiaoyun"), dc2.attr("ganzhi"), taisuiType==2? dc2.attr("xiaoyun")[1] :getTaisuiZhi());
        }
        showLiuNianCol(dc2.attr("ganzhi"), 6, dc2.attr("year"), dc2.attr("age"));
        showXiangPanLiuYi(bazi, dc1.attr("ganzhi"), dc2.attr("ganzhi"));
        show4Zhu12Gods(bazi, getTaisuiZhi());
        

    }

    //流年小表格点击事件
    var liunianTable2ClickFunc = function (e) {
        if (taishenmingSwitch) {
            clearActiveCell("liunian2");
            clearActiveCell("liuyue");
            clearActiveCell("liuri");
            hideLiuYueCol();
            hideLiuriCol();
            hideLiuriTable();
            showDefaultDayunLiunian(bazi, dayun);
            $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
            $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
            taishenmingSwitch = false;
            return;
        }

        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className == "liunian2-grid-cell") {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "liunian2-grid-cell") {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "liunian2-grid-cell") {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;

        clearActiveCell("liunian2");
        clearActiveCell("liuyue");
        clearActiveCell("liuri");
        hideLiuYueCol();
        hideLiuriCol();
        hideLiuriTable();

        $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
        $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
        taishenmingSwitch = false;

        var col = $(tdDom).attr("col");
        var row = $(tdDom).attr("row");

        //刷新流月表
        showLiuYueTable(bazi, curDayun.getLiuNian()[col]);//当前大运第n流年

        var dc1 = null;
        var dc2 = null;
        var dc3 = null;
        var dc4 = null;
        dc1 = lastActiveList["dayun"];
        dc2 = lastActiveList["liunian"];
        clearActiveCell("liunian");

        var lncol = dc2.attr("col");
        dc2 = $("#liunianTable>div>div[row=" + col + "][col=" + lncol + "]");
        dc2.addClass('cellActive');
        lastActiveList["liunian"] = dc2;
        dc3 = $("#liunianTable2>div>div[row=" + row + "][col=" + col + "]");
        dc3.addClass('cellActive');
        lastActiveList["liunian2"] = dc3;

        curLiunian = curDayun.getLiuNian()[col];
        curLiuyue = null;

        if (dc2.attr("xiaoyun")) {
            showDayunCol(dc2.attr("xiaoyun"), 15, dc2.attr("xyyear"), dc2.attr("xyage"));
            showDayunLiunian12Gods(dc2.attr("xiaoyun"), dc3.attr("ganzhi"), taisuiType==2? dc2.attr("xiaoyun")[1] :getTaisuiZhi());
        }else{
            showDayunLiunian12Gods(dc1.attr("ganzhi"), dc3.attr("ganzhi"), getTaisuiZhi());
        }
        showLiuNianCol(dc3.attr("ganzhi"), 6, dc3.attr("year"), dc3.attr("age"));
        showXiangPanLiuYi(bazi, dc1.attr("ganzhi"), dc2.attr("ganzhi"));
        show4Zhu12Gods(bazi, getTaisuiZhi());

    }

    //流月表格点击事件
    var liuyueTableClickFunc = function (e) {
        if (taishenmingSwitch) {
            clearActiveCell("liunian2");
            clearActiveCell("liuyue");
            clearActiveCell("liuri");
            hideLiuYueCol();
            hideLiuriCol();
            hideLiuriTable();
            showDefaultDayunLiunian(bazi, dayun);
            $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
            $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
            taishenmingSwitch = false;
            return;
        }

        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className == "liuyue-grid-cell") {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "liuyue-grid-cell") {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "liuyue-grid-cell") {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;

        clearActiveCell("liuyue");
        clearActiveCell("liuri");
        hideLiuriCol();

        var col = $(tdDom).attr("col");
        var row = $(tdDom).attr("row");

        var dc1 = lastActiveList["dayun"];
        var dc2 = lastActiveList["liunian"];
        var dc3 = lastActiveList["liunian2"];
        var dc4 = $("#liuyueTable>div>div[row=" + row + "][col=" + col + "]");
        dc4.addClass('cellActive');
        lastActiveList["liuyue"] = (dc4);
        showLiuYueCol(dc4.attr("ganzhi"), 7, dc4.attr("lunarmonth"), dc4.attr("month"));
        showLiuriTable(dc4.attr("year"), dc4.attr("month"), dc4.attr("day"));
        showXiangPanLiuYi(bazi, dc1.attr("ganzhi"), dc2.attr("ganzhi"), dc4.attr("ganzhi"));
        curLiuyue = curLiunian.getLiuYue(col);
        $("span[ln=y]").html(dc4.attr("year"));
    }

    //流日表格点击事件
    var liuriTableClickFunc = function (e) {
        if (taishenmingSwitch) {
            clearActiveCell("liunian2");
            clearActiveCell("liuyue");
            clearActiveCell("liuri");
            hideLiuYueCol();
            hideLiuriCol();
            hideLiuriTable();
            showDefaultDayunLiunian(bazi, dayun);
            $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
            $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
            taishenmingSwitch = false;
            return;
        }

        var tdDom = null;
        if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className == "liuri-grid-cell") {
            tdDom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "liuri-grid-cell") {
            tdDom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "liuri-grid-cell") {
            tdDom = e.target.parentNode.parentNode;
        } else {
            return;
        }
        if (!$(tdDom).text()) return;

        clearActiveCell("liuri");

        var col = $(tdDom).attr("col");
        var row = $(tdDom).attr("row");

        var dc1 = lastActiveList["dayun"];
        var dc2 = lastActiveList["liunian"];
        var dc3 = lastActiveList["liunian2"];
        var dc4 = lastActiveList["liuyue"];
        var dc5 = $("#liuriTable>div>div[row=" + row + "][col=" + col + "]")
        dc5.addClass('cellActive');
        lastActiveList["liuri"] = (dc5);
        showLiuRiCol(dc5.attr("ganzhi"), 8, dc5.attr("lunarday"), dc5.attr("day"));
        showXiangPanLiuYi(bazi, dc1.attr("ganzhi"), dc2.attr("ganzhi"), dc4.attr("ganzhi"), dc5.attr("ganzhi"));
        $("span[ln=y]").html(dc5.attr("year"));
        $("span[ly=m]").html(dc5.attr("month"));
    }

    //显示指定大运的流年
    function showLiuNianTable2(bazi, dayun) {
        var liunians = dayun.getLiuNian();
        for (var i = 0; i < 10; i++) {
            if (i < liunians.length) {
                var lnGanZhi = liunians[i].getGanZhi().split("");
                var lnGan = lnGanZhi[0];
                var lnZhi = lnGanZhi[1];
                var lnGanShen = shishenJc(queryShishen(lnGan, bazi.getDayGan()));
                var lnZhiShen = shishenJc(queryShishen(dizhiCanggan(lnZhi)[0], bazi.getDayGan()));
                if( dayunliunianstyle == "1" || dayunliunianstyle == "2" ){
                    $("#ln" + (i + 1)).html(
                        "<div class='liunianYear'><span>" + liunians[i].getYear() + "</span></div>" +
                        liunianStyle(tianganWuxing(lnGan)) + lnGan + "</span><span class='xShishen'>" + lnGanShen + "</span><br/>" +
                        liunianStyle(dizhiWuxing(lnZhi)) + lnZhi + "</span><span class='xShishen'>" + lnZhiShen + "</span>"
                    );
                }else if( dayunliunianstyle == "3" || dayunliunianstyle == "4" ){
                    $("#ln" + (i + 1)).html(
                        "<div class='liunianYear'><span>" + liunians[i].getYear() + "</span></div>" +
                        lnGan + "</span><span style='font-size:10px;color:red'>" + lnGanShen + "</span><br/>" +
                        lnZhi + "</span><span style='font-size:10px;color:red'>" + lnZhiShen + "</span>"
                    );
                }
                $("#ln" + (i + 1)).attr("ganzhi", liunians[i].getGanZhi());
                $("#ln" + (i + 1)).attr("year", liunians[i].getYear());
                $("#ln" + (i + 1)).attr("age", liunians[i].getAge());
            } else {
                $("#ln" + (i + 1)).html("");
                $("#ln" + (i + 1)).attr("ganzhi", "");
                $("#ln" + (i + 1)).attr("year", "");
                $("#ln" + (i + 1)).attr("age", "");
            }

        }
    }
    //显示指定流年的流月表格
    function showLiuYueTable(bazi, liunian) {
        if (liunian) {
            var curYear = liunian.getYear();
            var curLunar = Lunar.fromYmd(curYear, 7, 7);
            var jqTable = curLunar.getJieQiTable();
            var jqList = curLunar.getJieQiList();
            var liuyues = liunian.getLiuYue();
            var jqIdx = jqList.indexOf("立春");
            for (var i = 0; i < liuyues.length; i++) {
                var lyGanZhi = liuyues[i].getGanZhi().split("");
                var lyGan = lyGanZhi[0];
                var lyZhi = lyGanZhi[1];
                var lyGanShen = shishenJc(queryShishen(lyGan, bazi.getDayGan()));
                var lyZhiShen = shishenJc(queryShishen(dizhiCanggan(lyZhi)[0], bazi.getDayGan()));
                var jq = jqList[jqIdx];
                var y = jqTable[jq].getYear();
                var m = jqTable[jq].getMonth();
                var d = jqTable[jq].getDay();
                if( dayunliunianstyle == "1" || dayunliunianstyle == "2" ){
                    $("#ly" + (i + 1)).html(
                        "<div class='liuyueMonth'><span>" + JIE_LIST[i] + "<br/>" + m + "/" + d + "</span></div>" +
                        liuyueStyle(tianganWuxing(lyGan)) + lyGan + "</span><span class='xShishen'>" + lyGanShen + "</span><br/>" +
                        liuyueStyle(dizhiWuxing(lyZhi)) + lyZhi + "</span><span class='xShishen'>" + lyZhiShen + "</span>"
                    );
                }else if( dayunliunianstyle == "3" || dayunliunianstyle == "4" ){
                    $("#ly" + (i + 1)).html(
                        "<div class='liuyueMonth'><span>" + JIE_LIST[i] + "<br/>" + m + "/" + d + "</span></div>" +
                        lyGan + "</span><span style='font-size:10px;color:red'>" + lyGanShen + "</span><br/>" +
                        lyZhi + "</span><span style='font-size:10px;color:red'>" + lyZhiShen + "</span>"
                    );
                }
                $("#ly" + (i + 1)).attr("ganzhi", liuyues[i].getGanZhi());
                $("#ly" + (i + 1)).attr("lunarmonth", liuyues[i].getMonthInChinese());
                $("#ly" + (i + 1)).attr("year", y);
                $("#ly" + (i + 1)).attr("month", m);
                $("#ly" + (i + 1)).attr("day", d);
                $("#ly" + (i + 1)).attr("jie", JIE_LIST[i]);
                jqIdx += 2;
            }
        } else {
            for (var i = 0; i < 12; i++) {
                $("#ly" + (i + 1)).html("");
                $("#ly" + (i + 1)).attr("ganzhi", "");
                $("#ly" + (i + 1)).attr("lunarmonth", "");
                $("#ly" + (i + 1)).attr("month", "");
            }
        }
    }

    var lunianTableSwitch = false;
    var switchLiunianTableFunc = function () {
        if (!lunianTableSwitch) {
            $("#liunianSwitchBtn").removeClass("app-liunian-switch-off");
            $("#liunianSwitchBtn").addClass("app-liunian-switch-on");
            $("#liunianTable").show();//流年大表
            $("#liunianTable2").hide();//流年小表
            lunianTableSwitch = true;
        } else {
            $("#liunianSwitchBtn").removeClass("app-liunian-switch-on");
            $("#liunianSwitchBtn").addClass("app-liunian-switch-off");
            $("#liunianTable2").show();
            $("#liunianTable").hide();
            lunianTableSwitch = false;
        }
    }

    var taishenmingSwitch = false;
    var switchTaimingshenFunc = function (e) {
        if (!taishenmingSwitch) {
            $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-off");
            $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-on");
            clearActiveCell("liuyue");
            clearActiveCell("liuri");
            hideLiuYueCol();
            hideLiuriCol();
            hideLiuriTable();
            showTaiyuanCol(bazi.getTaiYuan());
            showMinggongCol(bazi.getMingGong());
            showShengongCol(bazi.getShenGong());
            taishenmingSwitch = true;
        } else {
            $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
            $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
            showDefaultDayunLiunian(bazi, dayun);
            taishenmingSwitch = false;
        }
    }

    var chuangongSwitch = false;
    var switchChuangongFunc = function (e) {
        if (!chuangongSwitch) {
            $("#chuangongSwitchBtnSpan").removeClass("app-chuangong-switch-off");
            $("#chuangongSwitchBtnSpan").addClass("app-chuangong-switch-on");
            toggle12Shen(true);
            chuangongSwitch = true;
        } else {
            $("#chuangongSwitchBtnSpan").removeClass("app-chuangong-switch-on");
            $("#chuangongSwitchBtnSpan").addClass("app-chuangong-switch-off");
            toggle12Shen(false);
            chuangongSwitch = false;
        }
    }

    function hideLiuriTable() {
        $("#liuriTableDiv").hide();
        $(".liuri-grid-cell").html("");
        $(".liuri-grid-cell").hide();
    }
    //显示流日表格
    function showLiuriTable(year, month, day) {
        $("#liuriTableDiv").show();
        $(".liuri-grid-cell").html("");
        var startDate = new Date(year, month - 1, day);
        var nextJie = Lunar.fromDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1)).getNextJie(true);
        var endDate = new Date(nextJie.getSolar().getYear(), nextJie.getSolar().getMonth() - 1, nextJie.getSolar().getDay(), nextJie.getSolar().getHour(), nextJie.getSolar().getMinute(), 0);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        var i = 0;
        for (i = 0; startDate.getTime() < endDate.getTime(); i++) {
            var lunarDay = Lunar.fromDate(startDate);
            var y = startDate.getFullYear();
            var m = startDate.getMonth() + 1;
            var d = startDate.getDate();
            var lrGanZhi = lunarDay.getDayInGanZhi();;
            var lrGan = lrGanZhi[0];
            var lrZhi = lrGanZhi[1];
            var lrGanShen = shishenJc(queryShishen(lrGan, bazi.getDayGan()));
            var lrZhiShen = shishenJc(queryShishen(dizhiCanggan(lrZhi)[0], bazi.getDayGan()));
            if( dayunliunianstyle == "1" || dayunliunianstyle == "2" ){
                $("#lr" + (i + 1)).html(
                    "<div class='liuriMonth'><span>" + lunarDay.getDayInChinese() + "<br/>" + m + "/" + d + "</span></div>" +
                    liuriStyle(tianganWuxing(lrGan)) + lrGan + "</span><span class='xShishen'>" + lrGanShen + "</span><br/>" +
                    liuriStyle(dizhiWuxing(lrZhi)) + lrZhi + "</span><span class='xShishen'>" + lrZhiShen + "</span>"
                );
            }else if( dayunliunianstyle == "3" || dayunliunianstyle == "4" ){
                $("#lr" + (i + 1)).html(
                    "<div class='liuriMonth'><span>" + lunarDay.getDayInChinese() + "<br/>" + m + "/" + d + "</span></div>" +
                    lrGan + "</span><span style='font-size:10px;color:red'>" + lrGanShen + "</span><br/>" +
                    lrZhi + "</span><span style='font-size:10px;color:red'>" + lrZhiShen + "</span>"
                );
            }
            $("#lr" + (i + 1)).show();
            $("#lr" + (i + 1)).attr("ganzhi", lrGanZhi);
            $("#lr" + (i + 1)).attr("lunarday", lunarDay.getDayInChinese());
            $("#lr" + (i + 1)).attr("year", y);
            $("#lr" + (i + 1)).attr("month", m);
            $("#lr" + (i + 1)).attr("day", d);
            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
        }
    }
    //显示大运1柱
    var showDayunCol = function (ganzhi, witch, year, age) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, witch, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        $("#XPyunGanSh").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#XPyunGan").text(gz[0]);
        $("#XPyunGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyunGan").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#XPyunZhi").text(gz[1]);
        $("#XPyunZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyunZhi").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#XPyunZhiCang").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#XPyunShi").text(shengwang);
        $("#XPyunZuo").text(zizuo);
        $("#XPyunKong").text(kongwang);
        $("#XPyunNayin").html(nayinStyle(nayin));
        $("#XPyunShansha").html(shensha);
        if (witch == 15) {
            $("#XPDayun").html("<div>小运</div><div class='xp-ymd-more'>" + year + "</div><div class='xp-ymd-more'>" + age + "岁</div>");
        } else {
            $("#XPDayun").html("<div>大运</div><div class='xp-ymd-more'>" + year + "</div><div class='xp-ymd-more'>" + age + "岁</div>");
        }
        var cls = $("#app-toggle-table").attr("class");
        if (cls.indexOf("table-max") != -1) {
            toggelShenshaTable(true);
        } else {
            toggelShenshaTable(false);
        }
    }
    //显示流年1柱
    var showLiuNianCol = function (ganzhi, witch, year, age) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, witch, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        $("#XPliuGanSh").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#XPliuGan").text(gz[0]);
        $("#XPliuGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPliuGan").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#XPliuZhi").text(gz[1]);
        $("#XPliuZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPliuZhi").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#XPliuZhiCang").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#XPliuShi").text(shengwang);
        $("#XPliuZuo").text(zizuo);
        $("#XPliuKong").text(kongwang);
        $("#XPliuNayin").html(nayinStyle(nayin));
        $("#XPliuShansha").html(shensha);
        $("#XPliunian").html("<div>流年</div><div class='xp-ymd-more'><span ln='y'>" + year + "</span></div><div class='xp-ymd-more'>" + age + "岁</div>");
        $("#suishu").html(age + "虚岁");
        var siling = getRenYuanSiLing(lunar);
        var silingStyle = wuxingStyle(tianganWuxing(siling));
        $("#siling").html("司令：" + "<span class='"+silingStyle+"'>"+siling+"</span>");
        var cls = $("#app-toggle-table").attr("class");
        if (cls.indexOf("table-max") != -1) {
            toggelShenshaTable(true);
        } else {
            toggelShenshaTable(false);
        }
    }
    //显示流月1柱
    var showLiuYueCol = function (ganzhi, witch, lunarmonth, month) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        $("#XPliuyue").show();
        $("#XPyueGanSh").show();
        $("#XPyueGan").show();
        $("#XPyueGan12shen").show();
        $("#XPyueZhi").show();
        $("#XPyueZhi12shen").show();
        $("#XPyueZhiCang").show();
        $("#XPyueShi").show();
        $("#XPyueZuo").show();
        $("#XPyueKong").show();
        $("#XPyueNayin").show();
        $("#XPyueShansha").show();
        $("#col1").width("9%");
        $("#col2").width("13%"); $("#col2").show();
        $("#col3").width("13%");
        $("#col4").width("13%");
        $("#col5").width("13%");
        $("#col6").width("13%");
        $("#col7").width("13%");
        $("#col8").width("13%");
        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, witch, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        $("#XPyueGanSh").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#XPyueGan").text(gz[0]);
        $("#XPyueGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyueGan").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#XPyueZhi").text(gz[1]);
        $("#XPyueZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyueZhi").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#XPyueZhiCang").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#XPyueShi").text(shengwang);
        $("#XPyueZuo").text(zizuo);
        $("#XPyueKong").text(kongwang);
        $("#XPyueNayin").html(nayinStyle(nayin));
        $("#XPyueShansha").html(shensha);
        $("#XPliuyue").html("<div>流月</div><div class='xp-ymd-more'><span ly='m'>" + month + "</span>月</div><div class='xp-ymd-more'>" + lunarmonth + "月</div>");
        var cls = $("#app-toggle-table").attr("class");
        if (cls.indexOf("table-max") != -1) {
            toggelShenshaTable(true);
        } else {
            toggelShenshaTable(false);
        }
    }
    //显示流日1柱
    var showLiuRiCol = function (ganzhi, witch, lunarday, day) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, witch, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        $("#colrow01").html("<div>流日</div><div class='xp-ymd-more'>" + day + "日</div><div class='xp-ymd-more'>" + lunarday + "</div>");
        $("#colrow02").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#colrow02").removeClass("subtitle");
        $("#colrow03").text(gz[0]);
        $("#colrow0312shen").text("-");
        $("#colrow0312shen").removeClass("subtitle");
        $("#colrow0312shen").addClass("_12shen");
        $("#colrow03").removeClass("subtitle wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#colrow03").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#colrow04").text(gz[1]);
        $("#colrow0412shen").text("-");
        $("#colrow0412shen").removeClass("subtitle");
        $("#colrow0412shen").addClass("_12shen");
        $("#colrow04").removeClass("subtitle wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#colrow04").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#colrow05").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#colrow05").removeClass("subtitle");
        $("#colrow05").css("vertical-align", "top");
        $("#colrow06").text(shengwang);
        $("#colrow06").removeClass("subtitle");
        $("#colrow061").text(zizuo);
        $("#colrow061").removeClass("subtitle");
        $("#colrow07").text(kongwang);
        $("#colrow07").removeClass("subtitle");
        $("#colrow08").html(nayinStyle(nayin));
        $("#colrow08").removeClass("subtitle");
        $("#colrow09").html(shensha);
        $("#colrow09").removeClass("subtitle");
        $("#colrow09").addClass("shensha")
        var cls = $("#app-toggle-table").attr("class");
        if (cls.indexOf("table-max") != -1) {
            toggelShenshaTable(true);
        } else {
            toggelShenshaTable(false);
        }
    }
    //显示胎元1柱
    var showTaiyuanCol = function (ganzhi) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        $("#XPliuyue").show();
        $("#XPyueGanSh").show();
        $("#XPyueGan").show();
        $("#XPyueGan12shen").show();
        $("#XPyueZhi").show();
        $("#XPyueZhi12shen").show();
        $("#XPyueZhiCang").show();
        $("#XPyueShi").show();
        $("#XPyueZuo").show();
        $("#XPyueKong").show();
        $("#XPyueNayin").show();
        $("#XPyueShansha").show();
        $("#col1").width("9%");
        $("#col2").width("13%"); $("#col2").show();
        $("#col3").width("13%");
        $("#col4").width("13%");
        $("#col5").width("13%");
        $("#col6").width("13%");
        $("#col7").width("13%");
        $("#col8").width("13%");
        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, 7, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        showTaiyuan12Gods(gz, getTaisuiZhi());
        $("#XPyueGanSh").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#XPyueGan").text(gz[0]);
        $("#XPyueGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyueGan").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#XPyueZhi").text(gz[1]);
        $("#XPyueZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyueZhi").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#XPyueZhiCang").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#XPyueShi").text(shengwang);
        $("#XPyueZuo").text(zizuo);
        $("#XPyueKong").text(kongwang);
        $("#XPyueNayin").html(nayinStyle(nayin));
        $("#XPyueShansha").html(shensha);
        $("#XPliuyue").html("<div>胎元</div>");
    }
    //显示命宫1柱
    var showMinggongCol = function (ganzhi) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, 6, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        showMinggong12Gods(gz, getTaisuiZhi());
        $("#XPliuGanSh").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#XPliuGan").text(gz[0]);
        $("#XPliuGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPliuGan").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#XPliuZhi").text(gz[1]);
        $("#XPliuZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPliuZhi").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#XPliuZhiCang").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#XPliuShi").text(shengwang);
        $("#XPliuZuo").text(zizuo);
        $("#XPliuKong").text(kongwang);
        $("#XPliuNayin").html(nayinStyle(nayin));
        $("#XPliuShansha").html(shensha);
        $("#XPliunian").html("<div>命宫</div>");
        $("#suishu").html("");
        $("#siling").html("");
    }
    //显示身宫1柱
    var showShengongCol = function (ganzhi) {
        if (!ganzhi) return;

        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        var gz = ganzhi.split("");
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var ganShen = queryShishen(gz[0], bazi.getDayGan());
        var canggan = dizhiCanggan(gz[1]);
        var zhiShen = dizhiShishen(canggan, bazi.getDayGan());
        var shengwang = queryShengwang(bz[4], gz[1]);
        var zizuo = queryShengwang(gz[0], gz[1]);
        var kongwang = queryKongwang(ganzhi);
        var nayin = queryNayin(ganzhi);
        var shensha = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(ganzhi, bz, isMan, 5, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        showShengong12Gods(gz, getTaisuiZhi());
        $("#XPyunGanSh").html("<span class='shishen-tag'>" + ganShen + "</span>");
        $("#XPyunGan").text(gz[0]);
        $("#XPyunGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyunGan").addClass(wuxingStyle(tianganWuxing(gz[0])) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(gz[0]):""));
        $("#XPyunZhi").text(gz[1]);
        $("#XPyunZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyunZhi").addClass(wuxingStyle(dizhiWuxing(gz[1])) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(gz[1]):""));
        $("#XPyunZhiCang").html(cangganStyle(canggan, zhiShen).join("<br/>"));
        $("#XPyunShi").text(shengwang);
        $("#XPyunZuo").text(zizuo);
        $("#XPyunKong").text(kongwang);
        $("#XPyunNayin").html(nayinStyle(nayin));
        $("#XPyunShansha").html(shensha);
        $("#XPDayun").html("<div>身宫</div>");
    }
    var hideLiuriCol = function () {
        $("#colrow01").html("日期");
        $("#colrow02").text("十神");
        $("#colrow02").addClass("subtitle");
        $("#colrow0312shen").text("串宫");
        $("#colrow0312shen").removeClass("_12shen");
        $("#colrow0312shen").addClass("subtitle");
        $("#colrow03").text("天干");
        $("#colrow03").removeClass("subtitle wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#colrow03").addClass("subtitle");
        $("#colrow04").text("地支");
        $("#colrow04").removeClass("subtitle wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#colrow04").addClass("subtitle");
        $("#colrow0412shen").text("串宫");
        $("#colrow0412shen").removeClass("_12shen");
        $("#colrow0412shen").addClass("subtitle");
        $("#colrow05").html("藏干");
        $("#colrow05").addClass("subtitle");
        $("#colrow05").css("vertical-align", "middle");
        $("#colrow06").text("地势");
        $("#colrow06").addClass("subtitle");
        $("#colrow061").text("自坐");
        $("#colrow061").addClass("subtitle");
        $("#colrow07").text("空亡");
        $("#colrow07").addClass("subtitle");
        $("#colrow08").html("纳音");
        $("#colrow08").addClass("subtitle");
        $("#colrow09").html("神煞");
        $("#colrow09").removeClass("shensha")
        $("#colrow09").addClass("subtitle");
    }

    var hideLiuYueCol = function () {
        $("#XPliuyue").hide();
        $("#XPyueGanSh").hide();
        $("#XPyueGan").hide();
        $("#XPyueGan12shen").hide();
        $("#XPyueZhi").hide();
        $("#XPyueZhi12shen").hide();
        $("#XPyueZhiCang").hide();
        $("#XPyueShi").hide();
        $("#XPyueZuo").hide();
        $("#XPyueKong").hide();
        $("#XPyueNayin").hide();
        $("#XPyueShansha").hide();
        $("#col1").width("10%");
        $("#col2").width("1px"); $("#col2").hide();
        $("#col3").width("15%");
        $("#col4").width("15%");
        $("#col5").width("15%");
        $("#col6").width("15%");
        $("#col7").width("15%");
        $("#col8").width("15%");
    }

    var clearDaYunCol = function () {
        $("#XPyunGanSh").text("*");
        $("#XPyunGan").text("*");
        $("#XPyunGan12shen").text("-");
        $("#XPyunGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#XPyunGan").addClass("ganzhiStyle");
        $("#XPyunZhi").text("*");
        $("#XPyunZhi12shen").text("-");
        $("#XPyunZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#XPyunZhi").addClass("ganzhiStyle");
        $("#XPyunZhiCang").html("*");
        $("#XPyunShi").text("*");
        $("#XPyunZuo").text("*");
        $("#XPyunKong").text("*");
        $("#XPyunNayin").html("*");
        $("#XPyunShansha").html("*");
        $("#XPDayun").text("大运");
    }
    var clearLiuNianCol = function () {
        $("#XPliuGanSh").text("*");
        $("#XPliuGan").text("*");
        $("#XPliuGan12shen").text("-");
        $("#XPliuGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#XPliuGan").addClass("ganzhiStyle");
        $("#XPliuZhi").text("*");
        $("#XPliuZhi12shen").text("-");
        $("#XPliuZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#XPliuZhi").addClass("ganzhiStyle");
        $("#XPliuZhiCang").html("*");
        $("#XPliuShi").text("*");
        $("#XPliuZuo").text("*");
        $("#XPliuZuo").text("*");
        $("#XPliuKong").text("*");
        $("#XPliuNayin").html("*");
        $("#XPliuShansha").html("*");
        $("#XPliunian").html("流年");
    }
    var clearLiuYueCol = function () {
        $("#XPyueGanSh").text("*");
        $("#XPyueGan").text("*");
        $("#XPyueGan12shen").text("-");
        $("#XPyueGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#XPyueGan").addClass("ganzhiStyle");
        $("#XPyueZhi").text("*");
        $("#XPyueZhi12shen").text("-");
        $("#XPyueZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle");
        $("#XPyueZhi").addClass("ganzhiStyle");
        $("#XPyueZhiCang").html("*");
        $("#XPyueShi").text("*");
        $("#XPyueZuo").text("*");
        $("#XPyueKong").text("*");
        $("#XPyueNayin").html("*");
        $("#XPyueShansha").html("*");
        $("#XPliuyue").html("流年");
    }

    function showMingPanLiuYi(bazi) {
        //天干留意
        var tianganlist = [];
        tianganlist.push(bazi.getYearGan()); tianganlist.push(bazi.getMonthGan());
        tianganlist.push(bazi.getDayGan()); tianganlist.push(bazi.getTimeGan());
        var tglst = tiangan5he(tianganlist);
        var liuyitag = "";
        if (tglst.length > 0) {
            liuyitag = "<span class='liuyitag_he'>" + tglst.join("</span><span class='liuyitag_he'>") + "</span>";
        }
        tglst = tiangan4cong(tianganlist);
        if (tglst.length > 0) {
            liuyitag += "<span class='liuyitag_cong'>" + tglst.join("</span><span class='liuyitag_cong'>") + "</span>";
        }
        tglst = tianganKe(tianganlist);
        if (tglst.length > 0) {
            liuyitag += "<span class='liuyitag_cong'>" + tglst.join("</span><span class='liuyitag_cong'>") + "</span>";
        }
        if (liuyitag.length > 0) {
            $("#MPtianganliuyi").html(liuyitag);
        } else {
            $("#MPtianganliuyi").html("(无)");
        }

        //地支留意
        liuyitag = "";
        var dizhilist = [];
        dizhilist.push(bazi.getYearZhi()); dizhilist.push(bazi.getMonthZhi());
        dizhilist.push(bazi.getDayZhi()); dizhilist.push(bazi.getTimeZhi());
        var dzlst = dizhi6he(dizhilist);
        if (dzlst.length) {
            liuyitag = "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhi4cong(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhiBan3he(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhiGong3he(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhiAnhe(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhiZhixing(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhi6hai(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhi6po(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhi3hui(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_hui'>" + dzlst.join("</span><span class='liuyitag_hui'>") + "</span>"
        }
        dzlst = dizhi3he(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhi3xing(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_xing'>" + dzlst.join("</span><span class='liuyitag_xing'>") + "</span>"
        }
        dzlst = dizhi2xing(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhiDuhe(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        if (liuyitag.length > 0) {
            $("#MPdizhiliuyi").html(liuyitag);
        } else {
            $("#MPdizhiliuyi").html("(无)");
        }
    }

    /**
     * 显示详盘的天干地支合化提示。
     * @param bazi 
     * @param dayunGZ 大运干支
     * @param liunianGZ 流年干支
     * @param liunianGZ 流月干支
     * @param liuriGZ 流日干支
     */
    function showXiangPanLiuYi(bazi, dayunGZ, liunianGZ, liuyueGZ, liuriGZ) {
        //天干留意
        var tianganlist = [];
        var dygz = dayunGZ && dayunGZ.split("");
        var lngz = liunianGZ && liunianGZ.split("");
        var lygz = liuyueGZ && liuyueGZ.split("");
        var lrgz = liuriGZ && liuriGZ.split("");
        tianganlist.push(bazi.getYearGan()); tianganlist.push(bazi.getMonthGan());
        tianganlist.push(bazi.getDayGan()); tianganlist.push(bazi.getTimeGan());
        var dizhilist = [];
        dizhilist.push(bazi.getYearZhi()); dizhilist.push(bazi.getMonthZhi());
        dizhilist.push(bazi.getDayZhi()); dizhilist.push(bazi.getTimeZhi());
        if (dayunGZ && dygz.length > 0) {
            tianganlist.push(dygz[0]);
            dizhilist.push(dygz[1]);
        }
        if (liunianGZ && lngz.length > 0) {
            tianganlist.push(lngz[0]);
            dizhilist.push(lngz[1]);
        }
        if (liuyueGZ && lygz.length > 0) {
            tianganlist.push(lygz[0]);
            dizhilist.push(lygz[1]);
        }
        if (liuriGZ && lrgz.length > 0) {
            tianganlist.push(lrgz[0]);
            dizhilist.push(lrgz[1]);
        }
        var tglst = tiangan5he(tianganlist);
        var liuyitag = "";
        if (tglst.length > 0) {
            liuyitag = "<span class='liuyitag_he'>" + tglst.join("</span><span class='liuyitag_he'>") + "</span>";
        }
        tglst = tiangan4cong(tianganlist);
        if (tglst.length > 0) {
            liuyitag += "<span class='liuyitag_cong'>" + tglst.join("</span><span class='liuyitag_cong'>") + "</span>";
        }
        tglst = tianganKe(tianganlist);
        if (tglst.length > 0) {
            liuyitag += "<span class='liuyitag_cong'>" + tglst.join("</span><span class='liuyitag_cong'>") + "</span>";
        }
        if (liuyitag.length > 0) {
            $("#XPtianganliuyi").html(liuyitag);
        } else {
            $("#XPtianganliuyi").html("(无)");
        }

        //地支留意
        liuyitag = "";
        var dzlst = dizhi6he(dizhilist);
        if (dzlst.length) {
            liuyitag = "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhi4cong(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhiBan3he(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhiGong3he(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhiAnhe(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhiZhixing(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhi6hai(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhi6po(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhi3hui(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_hui'>" + dzlst.join("</span><span class='liuyitag_hui'>") + "</span>"
        }
        dzlst = dizhi3he(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        dzlst = dizhi3xing(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_xing'>" + dzlst.join("</span><span class='liuyitag_xing'>") + "</span>"
        }
        dzlst = dizhi2xing(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_cong'>" + dzlst.join("</span><span class='liuyitag_cong'>") + "</span>"
        }
        dzlst = dizhiDuhe(dizhilist);
        if (dzlst.length) {
            liuyitag += "<span class='liuyitag_he'>" + dzlst.join("</span><span class='liuyitag_he'>") + "</span>"
        }
        if (liuyitag.length > 0) {
            $("#XPdizhiliuyi").html(liuyitag);
        } else {
            $("#XPdizhiliuyi").html("(无)");
        }
    }

    //显示默认大运流年
    function showDefaultDayunLiunian(bazi, dayun) {
        clearActiveCell("dayun");
        clearActiveCell("liunian");
        clearActiveCell("liunian2");
        clearActiveCell("liuyue");
        clearActiveCell("liuri");
        hideLiuYueCol();
        //默认选择当前大运流年，如果不在范围内，小于范围，取最后1个大运，大于范围，取第一个大运。
        var curYear = new Date().getFullYear(); var foundYear = false;
        if (curYear >= dayun[1].getStartYear() && curYear <= dayun[DAYUN_NUM].getStartYear() + 10) {
            for (var i = 1; i < dayun.length && !foundYear; i++) {
                if (curYear >= dayun[i].getStartYear() && curYear <= dayun[i].getStartYear() + 10) {
                    var liunians = dayun[i].getLiuNian();
                    for (var j = 0; j < liunians.length; j++) {
                        if (curYear == liunians[j].getYear()) {
                            //刷新流年(小表)
                            showLiuNianTable2(bazi, dayun[i]);//第n个大运的流年
                            //刷新流月表
                            showLiuYueTable(bazi, dayun[i].getLiuNian()[j]);//第n个大运第1个流年

                            var dc1 = null;
                            var dc2 = null;
                            var dc3 = null;
                            dc1 = $("#dayunTable>div>div[row=" + 0 + "][col=" + i + "]");
                            dc1.addClass('cellActive');
                            lastActiveList["dayun"] = (dc1);
                            dc2 = $("#liunianTable>div>div[row=" + j + "][col=" + i + "]");
                            dc2.addClass('cellActive');
                            lastActiveList["liunian"] = (dc2);
                            dc3 = $("#liunianTable2>div>div[row=" + 0 + "][col=" + j + "]");
                            dc3.addClass('cellActive');
                            lastActiveList["liunian2"] = (dc3);

                            curDayun = dayun[i];
                            curLiunian = curDayun.getLiuNian()[j];
                            curLiuyue = null;

                            showDayunCol(dayun[i].getGanZhi(), 5, dayun[i].getStartYear(), dayun[i].getStartAge());
                            showLiuNianCol(dayun[i].getLiuNian()[j].getGanZhi(), 6, dayun[i].getLiuNian()[j].getYear(), dayun[i].getLiuNian()[j].getAge());
                            showXiangPanLiuYi(bazi, dayun[i].getGanZhi(), dayun[i].getLiuNian()[j].getGanZhi());
                            show4Zhu12Gods(bazi,getTaisuiZhi());
                            showDayunLiunian12Gods(dayun[i].getGanZhi(), dayun[i].getLiuNian()[j].getGanZhi(), getTaisuiZhi());

                            foundYear = true;
                            break;
                        }
                    }
                }
            }
        } else if (curYear > dayun[DAYUN_NUM].getStartYear() + 10) {
            //刷新流年(小表)
            showLiuNianTable2(bazi, dayun[DAYUN_NUM]);//第n个大运的流年
            //刷新流月表
            showLiuYueTable(bazi, dayun[DAYUN_NUM].getLiuNian()[0]);//第n个大运第1个流年

            var dc1 = null;
            var dc2 = null;
            var dc3 = null;
            dc1 = $("#dayunTable>div>div[row=" + 0 + "][col=" + 10 + "]");
            dc1.addClass('cellActive');
            lastActiveList["dayun"] = (dc1);
            dc2 = $("#liunianTable>div>div[row=" + 0 + "][col=" + 10 + "]");
            dc2.addClass('cellActive');
            lastActiveList["liunian"] = (dc2);
            dc3 = $("#liunianTable2>div>div[row=" + 0 + "][col=" + 0 + "]");
            dc3.addClass('cellActive');
            lastActiveList["liunian2"] = (dc3);

            curDayun = dayun[DAYUN_NUM];
            curLiunian = curDayun.getLiuNian()[0];
            curLiuyue = null;

            showDayunCol(dayun[DAYUN_NUM].getGanZhi(), 5, dayun[DAYUN_NUM].getStartYear(), dayun[DAYUN_NUM].getStartAge());
            showLiuNianCol(dayun[DAYUN_NUM].getLiuNian()[0].getGanZhi(), 6, dayun[DAYUN_NUM].getLiuNian()[0].getYear(), dayun[DAYUN_NUM].getLiuNian()[0].getAge());
            showXiangPanLiuYi(bazi, dayun[DAYUN_NUM].getGanZhi(), dayun[DAYUN_NUM].getLiuNian()[0].getGanZhi());
            show4Zhu12Gods(bazi,getTaisuiZhi());
            showDayunLiunian12Gods(dayun[DAYUN_NUM].getGanZhi(), dayun[DAYUN_NUM].getLiuNian()[0].getGanZhi(), getTaisuiZhi());

        } else {
            //刷新流年(小表)
            showLiuNianTable2(bazi, dayun[1]);//第n个大运的流年
            //刷新流月表
            showLiuYueTable(bazi, dayun[1].getLiuNian()[0]);//第n个大运第1个流年
            var dc1 = null;
            var dc2 = null;
            var dc3 = null;
            dc1 = $("#dayunTable>div>div[row=" + 0 + "][col=" + 1 + "]");
            dc1.addClass('cellActive');
            lastActiveList["dayun"] = (dc1);
            dc2 = $("#liunianTable>div>div[row=" + 0 + "][col=" + 1 + "]");
            dc2.addClass('cellActive');
            lastActiveList["liunian"] = (dc2);
            dc3 = $("#liunianTable2>div>div[row=" + 0 + "][col=" + 0 + "]");
            dc3.addClass('cellActive');
            lastActiveList["liunian2"] = (dc3);

            curDayun = dayun[1];
            curLiunian = curDayun.getLiuNian()[0];
            curLiuyue = null;

            showDayunCol(dayun[1].getGanZhi(), 5, dayun[1].getStartYear(), dayun[1].getStartAge());
            showLiuNianCol(dayun[1].getLiuNian()[0].getGanZhi(), 6, dayun[1].getLiuNian()[0].getYear(), dayun[1].getLiuNian()[0].getAge());
            showXiangPanLiuYi(bazi, dayun[1].getGanZhi(), dayun[1].getLiuNian()[0].getGanZhi());
            show4Zhu12Gods(bazi,getTaisuiZhi());
            showDayunLiunian12Gods(dayun[1].getGanZhi(), dayun[1].getLiuNian()[0].getGanZhi(), getTaisuiZhi());

        }
    }

    initBazinoteYearRolldate();
    initBaziNoteDropdown();
    initParamsCtlDropdown();
    layui.element.on('tab(bazipaipantab)', bazipaipantabChangeFunc);
    $(".layui-card-body").on("click", shenshaTagClickFunc);
    $("#app-toggle-table").on("click", toggleShenshaTableClickFunc);
    $("#dayun-qiyun-row").on("click", toggleShenshaTableClickFunc);
    $(".app-savenote-btn").on("click", doSaveBaziNote);
    $(".app-savenote-btncell").on("click", bazinotetableRemoveRowFunc);
    $("#bazinotesubtitle").on("click", bazinotetableAddRowBtnFunc);
    $("#bazinotetable").on("keydown", bazinotetableKeydownFunc);
    $("#bazinotetable").on("compositionend", bazinotetableCompositionendFunc);
    $("#bazinotesummary").on("input", bazinotesummaryInputFunc);
    $("#bazinotesummary").on("change", bazinotesummaryChangeFunc);
    $(".app-savenote-yearcell").on("click", bazinoteYearShowFunc);
    $("#dayunTable").on("click", dayunTableClickFunc);
    $("#liunianTable").on("click", liunianTableClickFunc);
    $("#liunianTable2").on("click", liunianTable2ClickFunc);
    $("#liuyueTable").on("click", liuyueTableClickFunc);
    $("#liuriTable").on("click", liuriTableClickFunc);
    $("#liunianSwitchBtn").on("click", switchLiunianTableFunc);
    $("#taimingshenSwitchBtn").on("click", switchTaimingshenFunc);
    $("#chuangongSwitchBtn").on("click", switchChuangongFunc);

    /**
     * 排八字盘
     */
    function doBaziPaipan(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime) {
        if (!isValidDateTime(year, month, day, hour, minute, second)) {
            return;
        }
        var util = layui.util;

        var baseDate = new Date(year, month - 1, day, hour, minute, second);
        if (summertime) {//调整夏令时
            currentDate = adjustForDST(baseDate);
        } else {
            currentDate = baseDate;
        }

        profile = layui.data('profile');
        dayunliunianstyle = "4";
        if( profile && profile.dayunliunianstyle ){
            dayunliunianstyle = profile.dayunliunianstyle;//流年显示风格
        }

        var realsunDate;
        if (!!realsun) {//转换为真太阳时
            realsunDate = layui.realsuntime.calcRealsuntime(currentDate, diqu);
            year = realsunDate.getFullYear();
            month = realsunDate.getMonth() + 1;
            day = realsunDate.getDate();
            hour = realsunDate.getHours();
            minute = realsunDate.getMinutes();
        } else {
            realsunDate = currentDate;
            year = realsunDate.getFullYear();
            month = realsunDate.getMonth() + 1;
            day = realsunDate.getDate();
            hour = realsunDate.getHours();
            minute = realsunDate.getMinutes();
        }

        isMan = isman;
        solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        lunar = solar.getLunar();
        bazi = lunar.getEightChar();
        bazi.setSect(!!wanzishi ? 2 : 1);
        yun = bazi.getYun(isman ? 1 : 0, 2);
        dayun = yun.getDaYun(DAYUN_NUM+1);//显示12个大运+1小运
        xiaoyun = dayun[0].getXiaoYun();

        $("#taimingshenSwitchBtnSpan").removeClass("app-taimingshen-switch-on");
        $("#taimingshenSwitchBtnSpan").addClass("app-taimingshen-switch-off");
        taishenmingSwitch = false;

        var d1,d2;
        if (diqu.indexOf("内蒙古") == 0 || diqu.indexOf("黑龙江") == 0) {
            d1 = diqu.substring(0, 3);
            d2 = diqu.substring(3, diqu.length);
        } else {
            d1 = diqu.substring(0, 2);
            d2 = diqu.substring(2, diqu.length);
        }
            
        currentData = {
            id: null,
            name: "",
            sex: isMan,
            diqu1: d1,
            diqu2: d2,
            realsun: realsun,
            zhaowanzishi: wanzishi,
            gldatetime: layui.util.toDateString(realsunDate, "yyyy-MM-dd HH:mm:ss"),
            nldatetime: lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + " " + lunar.getTimeZhi() + "时",
            animal: lunar.getMonthShengXiaoExact(),
            bazi: [bazi.getYearGan(), bazi.getYearZhi(), bazi.getMonthGan(), bazi.getMonthZhi(), bazi.getDayGan(), bazi.getDayZhi(), bazi.getTimeGan(), bazi.getTimeZhi()],
            tag: ""
        };

        //////////////////////////////////////////////////////////////////////////////////////////////    
        //基本命盘
        //基本信息
        $(".app-bazi-name").text("");
        var shengxiaoInfo = "url(images/" + (SHENGXIAO.indexOf(lunar.getYearShengXiaoByLiChun()) + 1) + ".png)";
        document.getElementById("shengxiaoImg").style.backgroundImage = shengxiaoInfo;
        document.getElementById("MPshengxiaoImg").style.backgroundImage = shengxiaoInfo;
        document.getElementById("XPshengxiaoImg").style.backgroundImage = shengxiaoInfo;
        document.getElementById("BJshengxiaoImg").style.backgroundImage = shengxiaoInfo;
        
        var nongliInfo = lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + " " + lunar.getTimeZhi() + "时" + " (" + (isman ? "<span class=qianzhao>乾造</span>" : "<span class=kunzhao>坤造</span>") + ")";
        $("#nongli").html(nongliInfo);
        $("#MPnongli").html(nongliInfo);
        $("#XPnongli").html(nongliInfo);
        $("#BJnongli").html(nongliInfo);
        var xialingInfo = (summertime && isInDST(baseDate) ? "<span class='app-time-summertime'>夏令时</span>" : "");
        var beijingInfo = layui.util.toDateString(baseDate, "yyyy-MM-dd HH:mm");
        $("#gongli").html(beijingInfo + xialingInfo);
        $("#XPgongli").html(beijingInfo + xialingInfo);
        $("#MPgongli").html(beijingInfo + xialingInfo);
        $("#BJgongli").html(beijingInfo + xialingInfo);
        var realsunInfo = util.toDateString(realsunDate, "yyyy-MM-dd HH:mm");
        $("#realsun").text(realsunInfo);
        $("#XPrealsun").text(realsunInfo);
        $("#MPrealsun").text(realsunInfo);
        $("#BJrealsun").text(realsunInfo);
        var jq = lunar.getCurrentJieQi();
        var jqInfo = "";
        if (!!jq)
            if (!!jq.getName) {
                jqInfo = jq.getName() + "(" + jq.getSolar().toYmdHms() + ")";
            } else {
                jqInfo = jq;
            }
        else {
            var prejq = lunar.getPrevJieQi(false);
            var nextjq = lunar.getNextJieQi(false);
            var jqInfo = prejq.getName() + "(" + prejq.getSolar().toYmdHms() + ")之后, " + "" + nextjq.getName() + "(" + nextjq.getSolar().toYmdHms() + ")之前";
        }
        $("#jieqi").text(jqInfo);
        $("#birtharea").text(diqu);
        $("#taiyuan").text(bazi.getTaiYuan() + ' (' + bazi.getTaiYuanNaYin() + ')');
        $("#taixi").text(bazi.getTaiXi() + ' (' + bazi.getTaiXiNaYin() + ')');
        $("#minggong").text(bazi.getMingGong() + ' (' + bazi.getMingGongNaYin() + ')');
        $("#shengong").text(bazi.getShenGong() + ' (' + bazi.getShenGongNaYin() + ')');
        var gua = minggua(year, isman);
        $("#minggua").text(gua + "卦 (" + dong4xi4(gua) + ")");

        layui.use(['chenggu'], function () {
            var guzong = layui.chenggu.chenggu(_jiazhi.indexOf(bazi.getYearGan() + bazi.getYearZhi()) + 1, Math.abs(lunar.getMonth()), lunar.getDay(), ZHI.indexOf(bazi.getTimeZhi()));
            $("#chengguwht").html(guzong);
            $("#chengguinfo").html(layui.chenggu.chengguInfo(guzong, isman));
            $("#chenggudetail").html(layui.chenggu.chengguDetails(guzong, isman));
        });

        $("#riyuan").text(isman ? "元男" : "元女")
        $("#XPriyuan").text(isman ? "元男" : "元女")

        $("#XPyearCol").html("<div>年柱</div><div class='xp-ymd-more'>" + solar.getYear() + "</div><div class='xp-ymd-more'><span class='thin_font10px'>" + lunar.getYearInChinese() + "</span></div>");
        $("#XPmonthCol").html("<div>月柱</div><div class='xp-ymd-more'>" + solar.getMonth() + "月</div><div class='xp-ymd-more'>" + lunar.getMonthInChinese() + "月</div>");
        $("#XPdayCol").html("<div>日柱</div><div class='xp-ymd-more'>" + solar.getDay() + "日</div><div class='xp-ymd-more'>" + lunar.getDayInChinese() + "</div>");
        $("#XPhourCol").html("<div>时柱</div><div class='xp-ymd-more'>" + solar.getHour() + "时</div><div class='xp-ymd-more'>" + lunar.getTimeZhi() + "时</div>");

        $("#yGanSh").html("<span class='shishen-tag'>" + bazi.getYearShiShenGan() + "</span>");
        $("#XPyGanSh").html("<span class='shishen-tag'>" + bazi.getYearShiShenGan() + "</span>");
        $("#mGanSh").html("<span class='shishen-tag'>" + bazi.getMonthShiShenGan() + "</span>");
        $("#XPmGanSh").html("<span class='shishen-tag'>" + bazi.getMonthShiShenGan() + "</span>");
        $("#dGanSh").html("<span class='shishen-tag'>" + bazi.getDayShiShenGan() + "</span>");
        $("#XPdGanSh").html("<span class='shishen-tag'>" + bazi.getDayShiShenGan() + "</span>");
        $("#hGanSh").html("<span class='shishen-tag'>" + bazi.getTimeShiShenGan() + "</span>");
        $("#XPhGanSh").html("<span class='shishen-tag'>" + bazi.getTimeShiShenGan() + "</span>");
        //天干
        var profile = layui.data('profile');
        var ganzhiyinyang = true;
        if( profile ){
            ganzhiyinyang = profile.ganzhiyinyang;
        }

        $("#yGan").html(bazi.getYearGan() + " <img style='" + wuxingIconFilter(tianganWuxing(bazi.getYearGan())) + "' src='" + wuxingIcon(tianganWuxing(bazi.getYearGan())) + "'/>");
        $("#yGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#yGan").addClass(wuxingStyle(tianganWuxing(bazi.getYearGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getYearGan()):""));
        $("#XPyGan").text(bazi.getYearGan());
        $("#XPyGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyGan").addClass(wuxingStyle(tianganWuxing(bazi.getYearGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getYearGan()):""));

        $("#mGan").html(bazi.getMonthGan() + " <img style='" + wuxingIconFilter(tianganWuxing(bazi.getMonthGan())) + "' src='" + wuxingIcon(tianganWuxing(bazi.getMonthGan())) + "'/>");
        $("#mGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#mGan").addClass(wuxingStyle(tianganWuxing(bazi.getMonthGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getMonthGan()):""));
        $("#XPmGan").text(bazi.getMonthGan());
        $("#XPmGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPmGan").addClass(wuxingStyle(tianganWuxing(bazi.getMonthGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getMonthGan()):""));

        $("#dGan").html(bazi.getDayGan() + " <img style='" + wuxingIconFilter(tianganWuxing(bazi.getDayGan())) + "' src='" + wuxingIcon(tianganWuxing(bazi.getDayGan())) + "'/>");
        $("#dGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#dGan").addClass(wuxingStyle(tianganWuxing(bazi.getDayGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getDayGan()):""));
        $("#XPdGan").text(bazi.getDayGan());
        $("#XPdGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPdGan").addClass(wuxingStyle(tianganWuxing(bazi.getDayGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getDayGan()):""));

        $("#hGan").html(bazi.getTimeGan() + " <img style='" + wuxingIconFilter(tianganWuxing(bazi.getTimeGan())) + "' src='" + wuxingIcon(tianganWuxing(bazi.getTimeGan())) + "'/>");
        $("#hGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#hGan").addClass(wuxingStyle(tianganWuxing(bazi.getTimeGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getTimeGan()):""));
        $("#XPhGan").text(bazi.getTimeGan());
        $("#XPhGan").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPhGan").addClass(wuxingStyle(tianganWuxing(bazi.getTimeGan())) + " ganzhiStyle " + (ganzhiyinyang?tianganYinyangStyle(bazi.getTimeGan()):""));

        //地支
        $("#yZhi").html(bazi.getYearZhi() + " <img style='" + wuxingIconFilter(dizhiWuxing(bazi.getYearZhi())) + "' src='" + wuxingIcon(dizhiWuxing(bazi.getYearZhi())) + "'/>");
        $("#yZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#yZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getYearZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getYearZhi()):""));
        $("#XPyZhi").text(bazi.getYearZhi());
        $("#XPyZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPyZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getYearZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getYearZhi()):""));

        $("#mZhi").html(bazi.getMonthZhi() + " <img style='" + wuxingIconFilter(dizhiWuxing(bazi.getMonthZhi())) + "' src='" + wuxingIcon(dizhiWuxing(bazi.getMonthZhi())) + "'/>");
        $("#mZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#mZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getMonthZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getMonthZhi()):""));
        $("#XPmZhi").text(bazi.getMonthZhi());
        $("#XPmZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPmZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getMonthZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getMonthZhi()):""));

        $("#dZhi").html(bazi.getDayZhi() + " <img style='" + wuxingIconFilter(dizhiWuxing(bazi.getDayZhi())) + "' src='" + wuxingIcon(dizhiWuxing(bazi.getDayZhi())) + "'/>");
        $("#dZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#dZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getDayZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getDayZhi()):""));
        $("#XPdZhi").text(bazi.getDayZhi());
        $("#XPdZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPdZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getDayZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getDayZhi()):""));

        $("#hZhi").html(bazi.getTimeZhi() + " <img style='" + wuxingIconFilter(dizhiWuxing(bazi.getTimeZhi())) + "' src='" + wuxingIcon(dizhiWuxing(bazi.getTimeZhi())) + "'/>");
        $("#hZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#hZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getTimeZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getTimeZhi()):""));
        $("#XPhZhi").text(bazi.getTimeZhi());
        $("#XPhZhi").removeClass("wxjin wxshui wxmu wxhuo wxtu ganzhiStyle wxyin wxyang");
        $("#XPhZhi").addClass(wuxingStyle(dizhiWuxing(bazi.getTimeZhi())) + " ganzhiStyle " + (ganzhiyinyang?dizhiYinyangStyle(bazi.getTimeZhi()):""));

        //地支藏干十神
        var yZhiCangInfo = cangganStyle(bazi.getYearHideGan(), bazi.getYearShiShenZhi()).join("<br/>");
        var mZhiCangInfo = cangganStyle(bazi.getMonthHideGan(), bazi.getMonthShiShenZhi()).join("<br/>");
        var dZhiCangInfo = cangganStyle(bazi.getDayHideGan(), bazi.getDayShiShenZhi()).join("<br/>");
        var hZhiCangInfo = cangganStyle(bazi.getTimeHideGan(), bazi.getTimeShiShenZhi()).join("<br/>");
        $("#yZhiCang").html(yZhiCangInfo);
        $("#mZhiCang").html(mZhiCangInfo);
        $("#dZhiCang").html(dZhiCangInfo);
        $("#hZhiCang").html(hZhiCangInfo);
        $("#XPyZhiCang").html(yZhiCangInfo);
        $("#XPmZhiCang").html(mZhiCangInfo);
        $("#XPdZhiCang").html(dZhiCangInfo);
        $("#XPhZhiCang").html(hZhiCangInfo);
        //地势
        $("#yShi").text(bazi.getYearDiShi());
        $("#mShi").text(bazi.getMonthDiShi());
        $("#dShi").text(bazi.getDayDiShi());
        $("#hShi").text(bazi.getTimeDiShi());
        $("#XPyShi").text(bazi.getYearDiShi());
        $("#XPmShi").text(bazi.getMonthDiShi());
        $("#XPdShi").text(bazi.getDayDiShi());
        $("#XPhShi").text(bazi.getTimeDiShi());
        //自坐
        $("#yZuo").text(queryShengwang(bazi.getYearGan(), bazi.getYearZhi()));
        $("#mZuo").text(queryShengwang(bazi.getMonthGan(), bazi.getMonthZhi()));
        $("#dZuo").text(queryShengwang(bazi.getDayGan(), bazi.getDayZhi()));
        $("#hZuo").text(queryShengwang(bazi.getTimeGan(), bazi.getTimeZhi()));
        $("#XPyZuo").text(queryShengwang(bazi.getYearGan(), bazi.getYearZhi()));
        $("#XPmZuo").text(queryShengwang(bazi.getMonthGan(), bazi.getMonthZhi()));
        $("#XPdZuo").text(queryShengwang(bazi.getDayGan(), bazi.getDayZhi()));
        $("#XPhZuo").text(queryShengwang(bazi.getTimeGan(), bazi.getTimeZhi()));
        //空亡
        $("#yKong").text(bazi.getYearXunKong());
        $("#mKong").text(bazi.getMonthXunKong());
        $("#dKong").html("<span class='kongwang'>" + bazi.getDayXunKong() + "</span>");
        $("#hKong").text(bazi.getTimeXunKong());
        $("#XPyKong").text(bazi.getYearXunKong());
        $("#XPmKong").text(bazi.getMonthXunKong());
        $("#XPdKong").html("<span class='kongwang'>" + bazi.getDayXunKong() + "</span>");
        $("#XPhKong").text(bazi.getTimeXunKong());
        //纳音
        $("#yNayin").html(nayinStyle(bazi.getYearNaYin()));
        $("#mNayin").html(nayinStyle(bazi.getMonthNaYin()));
        $("#dNayin").html(nayinStyle(bazi.getDayNaYin()));
        $("#hNayin").html(nayinStyle(bazi.getTimeNaYin()));
        $("#XPyNayin").html(nayinStyle(bazi.getYearNaYin()));
        $("#XPmNayin").html(nayinStyle(bazi.getMonthNaYin()));
        $("#XPdNayin").html(nayinStyle(bazi.getDayNaYin()));
        $("#XPhNayin").html(nayinStyle(bazi.getTimeNaYin()));
        //神煞
        var bz = [];
        bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
        bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
        bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
        bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
        var yShanshaInfo = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(bz[0] + bz[1], bz, isman, 1, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        var mShanshaInfo = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(bz[2] + bz[3], bz, isman, 2, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        var dShanshaInfo = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(bz[4] + bz[5], bz, isman, 3, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        var hShanshaInfo = "<span class='shensha-tag'>" + layui.shensha.queryShenSha(bz[6] + bz[7], bz, isman, 4, bazi.getYearNaYin()).join("</span><br/><span class='shensha-tag'>") + "</span>";
        $("#yShansha").html(yShanshaInfo);
        $("#mShansha").html(mShanshaInfo);
        $("#dShansha").html(dShanshaInfo);
        $("#hShansha").html(hShanshaInfo);
        $("#XPyShansha").html(yShanshaInfo);
        $("#XPmShansha").html(mShanshaInfo);
        $("#XPdShansha").html(dShanshaInfo);
        $("#XPhShansha").html(hShanshaInfo);

        //五行旺衰
        var wuxingwangshuai = WUXING_WANGSHUAI[dizhiWuxing(bazi.getMonthZhi())];
        $("div[ws='app-wuxingwangshuai-wang']").html(wuxingwangshuai[0] + "旺");
        $("div[ws='app-wuxingwangshuai-wang']").removeClass();
        $("div[ws='app-wuxingwangshuai-wang']").addClass(wuxingBgStyle(wuxingwangshuai[0]));
        $("div[ws='app-wuxingwangshuai-xiang']").html(wuxingwangshuai[1] + "相");
        $("div[ws='app-wuxingwangshuai-xiang']").removeClass();
        $("div[ws='app-wuxingwangshuai-xiang']").addClass(wuxingBgStyle(wuxingwangshuai[1]));
        $("div[ws='app-wuxingwangshuai-xiu']").html(wuxingwangshuai[2] + "休");
        $("div[ws='app-wuxingwangshuai-xiu']").removeClass();
        $("div[ws='app-wuxingwangshuai-xiu']").addClass(wuxingBgStyle(wuxingwangshuai[2]));
        $("div[ws='app-wuxingwangshuai-qiu']").html(wuxingwangshuai[3] + "囚");
        $("div[ws='app-wuxingwangshuai-qiu']").removeClass();
        $("div[ws='app-wuxingwangshuai-qiu']").addClass(wuxingBgStyle(wuxingwangshuai[3]));
        $("div[ws='app-wuxingwangshuai-si']").html(wuxingwangshuai[4] + "死");
        $("div[ws='app-wuxingwangshuai-si']").removeClass();
        $("div[ws='app-wuxingwangshuai-si']").addClass(wuxingBgStyle(wuxingwangshuai[4]));


        //显示天干地支留意信息
        showMingPanLiuYi(bazi);
        showXiangPanLiuYi(bazi);

        clearDaYunCol();
        clearLiuNianCol();
        clearLiuYueCol();

        clearActiveCell("dayun");
        clearActiveCell("liunian");
        clearActiveCell("liunian2");
        clearActiveCell("liuyue");
        clearActiveCell("liuri");
        hideLiuYueCol();
        hideLiuriCol();
        hideLiuriTable();

        //////////////////////////////////////////////////////////////////////////////////////////////
        //起运信息
        var curJieqi = yun.getStartSolar().getLunar().getCurrentJieQi();
        var date = new Date(yun.getStartSolar().getYear(), yun.getStartSolar().getMonth() - 1, yun.getStartSolar().getDay(), yun.getStartSolar().getHour(), yun.getStartSolar().getMinute(), 0);
        var d1 = date;
        var d2 = date;
        var jieName = null;
        if (!curJieqi || (!!curJieqi && !curJieqi.isJie())) {
            var yunJie = yun.getStartSolar().getLunar().getPrevJie();
            d2 = new Date(yunJie.getSolar().getYear(), yunJie.getSolar().getMonth() - 1, yunJie.getSolar().getDay(), yunJie.getSolar().getHour(), yunJie.getSolar().getMinute(), 0);
            jieName = yunJie.getName();
        } else {
            jieName = curJieqi.getName();
            d2 = new Date(curJieqi.getSolar().getYear(), curJieqi.getSolar().getMonth() - 1, curJieqi.getSolar().getDay(), curJieqi.getSolar().getHour(), curJieqi.getSolar().getMinute(), 0);
        }
        var d3 = d1.getTime() - d2.getTime();
        var days = Math.floor(d3 / (24 * 3600 * 1000));
        $("#qiyun").html(
            '<span>' + '起运：出生' + yun.getStartYear() + '年' + yun.getStartMonth() + '月' + yun.getStartDay() + '天' + yun.getStartHour() + '时后起运</span>'
            + '<br/>' +
            '<span>交运：逢' + dayun[1].getLiuNian()[0].getGanZhi().split("")[0] + '、' +
            dayun[1].getLiuNian()[5].getGanZhi().split("")[0] + '年 ' +
            jieName + '后' + (days) + '天交大运</span>'
        );



        //大运
        for (var i = 1; i < dayun.length; i++) {
            var dy = dayun[i];
            var dygz = dy.getGanZhi().split("");
            var dyGanShen = shishenJc(queryShishen(dygz[0], bazi.getDayGan()));
            var dyZhiShen = shishenJc(queryShishen(dizhiCanggan(dygz[1])[0], bazi.getDayGan()));
            if( dayunliunianstyle == "1" || dayunliunianstyle == "2" ){
                //多彩风格
                $("#dy" + i).html(
                    "<div class='dayunYear'><span>" +
                    dy.getStartYear() + "<br/>" + dy.getStartAge() + "岁" + "</span></div>" +
                    dayunStyle(tianganWuxing(dygz[0])) + dygz[0] + "</span><span class='xShishen'>" + dyGanShen + "</span><br/>" +
                    dayunStyle(dizhiWuxing(dygz[1])) + dygz[1] + "</span><span class='xShishen'>" + dyZhiShen + "</span>"
                );
            }else if( dayunliunianstyle == "3" || dayunliunianstyle == "4" ){
                //简洁风格
                $("#dy" + i).html(
                    "<div class='dayunYear'><span>" +
                    dy.getStartYear() + "<br/>" + dy.getStartAge() + "岁" + "</span></div>" +
                    dygz[0] + "</span><span style='font-size:12px;color:red'>" + dyGanShen + "</span><br/>" +
                    dygz[1] + "</span><span style='font-size:12px;color:red'>" + dyZhiShen + "</span>"
                );
            }
            $("#dy" + i).attr("ganzhi", dy.getGanZhi());
            $("#dy" + i).attr("year", dy.getStartYear());
            $("#dy" + i).attr("age", dy.getStartAge());
        }
        //小运
        var xyStartAge = 1;
        var xyEndAge = dayun[1].getStartAge() - 1;
        if (xyEndAge >= xyStartAge) {
            $("#xy").html("<div class='dayunYear'><span class='dayunYear'>" + dayun[0].getStartYear() + "<br/>" + (xyStartAge == xyEndAge ? "1" : xyStartAge + "-" + xyEndAge) + "岁</span></div>小<br/>运");
        } else {
            $("#xy").html("<div class='dayunYear'><span class='dayunYear'>" + "<br/>0岁</span></div>小<br/>运");
        }


        var xyLiunian = dayun[0].getLiuNian();
        var xyXiaoyun = dayun[0].getXiaoYun();
        for (var i = 0; i < xyLiunian.length; i++) {
            var xy = xyLiunian[i];
            var xyGanZhi = xy.getGanZhi().split("");
            var xyGan = xyGanZhi[0];
            var xyZhi = xyGanZhi[1];
            var xyGanShen = shishenJc(queryShishen(xyGan, bazi.getDayGan()));
            var xyZhiShen = shishenJc(queryShishen(dizhiCanggan(xyZhi)[0], bazi.getDayGan()));

            if( dayunliunianstyle == "1" ){
                //多彩风格
                $("#xy" + (i + 1)).html(
                    (i==0?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"") +
                    xliunianStyle(tianganWuxing(xyGan)) + xyGan + "</span><span class='xxShishen'>" + xyGanShen + "</span><br/>" +
                    xliunianStyle(dizhiWuxing(xyZhi)) + xyZhi + "</span><span class='xxShishen'>" + xyZhiShen + "</span>" +
                    (i==9?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"")
                );
            }
            else if (dayunliunianstyle == "2") {
                //多彩精简风格
                $("#xy" + (i + 1)).html(
                    (i==0?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"") +
                    xliunianStyle(tianganWuxing(xyGan)) + xyGan + "</span>" + xliunianStyle(dizhiWuxing(xyZhi)) + xyZhi + "</span>" +
                    (i==9?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"")
                );      
            }
            else if (dayunliunianstyle == "3") {
                //黑白风格
                $("#xy" + (i + 1)).html(
                    (i==0?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"") +
                    "<span class='xliunianStyle' style='color:#000'>" +  xyGan + "</span><span style='font-size:10px;color:red'>" + xyGanShen + "</span><br/>" +
                    "<span class='xliunianStyle' style='color:#000'>" +  xyZhi + "</span><span style='font-size:10px;color:red'>" + xyZhiShen + "</span>" +
                    (i==9?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"")
                );
            }
            else if (dayunliunianstyle == "4") {
                //黑白精简风格
                $("#xy" + (i + 1)).html(
                    (i==0?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"") +
                    "<span class='xliunianStyle' style='color:#000'>" +  xyGan + "</span><span class='xliunianStyle' style='color:#000'>" +  xyZhi + "</span>" +
                    (i==9?"<div class='liunianYear'><span>" + xyLiunian[i].getYear() + "</span></div>":"")
                );
            }
            $("#xy" + (i + 1)).attr("ganzhi", xy.getGanZhi());
            $("#xy" + (i + 1)).attr("year", xy.getYear());
            $("#xy" + (i + 1)).attr("age", xy.getAge());
            $("#xy" + (i + 1)).attr("xiaoyun", xyXiaoyun[i].getGanZhi());
            $("#xy" + (i + 1)).attr("xyyear", xyXiaoyun[i].getYear());
            $("#xy" + (i + 1)).attr("xyage", xyXiaoyun[i].getAge());
        }
        for (var i = xyLiunian.length; i < 10; i++) {
            $("#xy" + (i + 1)).html("");
            if( i== 9 && xyLiunian.length > 0 ){
                $("#xy" + (i + 1)).html(
                    "<span class='xliunianStyle' style='color:#000'>&nbsp;</span><span class='xliunianStyle' style='color:#000'>&nbsp;</span>" +
                    "<div class='liunianYear'><span>" + xyLiunian[xyLiunian.length-1].getYear() + "</span></div>" 
                );
            }
        }

        //流年(大表)
        for (var i = 1; i < dayun.length; i++) {
            var liunian = dayun[i].getLiuNian();
            for (var j = 0; j < liunian.length; j++) {
                var lnGanZhi = liunian[j].getGanZhi().split("");
                var lnGan = lnGanZhi[0];
                var lnZhi = lnGanZhi[1];
                var lnGanShen = shishenJc(queryShishen(lnGan, bazi.getDayGan()));
                var lnZhiShen = shishenJc(queryShishen(dizhiCanggan(lnZhi)[0], bazi.getDayGan()));
                if( dayunliunianstyle == "1" ){
                    //多彩风格
                    $("#ln" + (i) + "_" + (j + 1)).html(
                        (j==0?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"") +
                        xliunianStyle(tianganWuxing(lnGan)) + lnGan + "</span><span class='xxShishen'>" + lnGanShen + "</span><br/>" +
                        xliunianStyle(dizhiWuxing(lnZhi)) + lnZhi + "</span><span class='xxShishen'>" + lnZhiShen + "</span>" +
                        (j==9?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"") 
                    );
                }
                else if( dayunliunianstyle == "2" ){
                    //多彩精简风格
                    $("#ln" + (i) + "_" + (j + 1)).html(
                        (j==0?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"") +
                        xliunianStyle(tianganWuxing(lnGan)) + lnGan + "</span>"+xliunianStyle(dizhiWuxing(lnZhi)) + lnZhi + "</span>" +
                        (j==9?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"")
                    );
                }
                else if( dayunliunianstyle == "3" ){
                    //黑白风格
                    $("#ln" + (i) + "_" + (j + 1)).html(
                        (j==0?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"") +
                        "<span class='xliunianStyle' style='color:#000'>" + lnGan + "</span><span style='font-size:10px;color:red'>" + lnGanShen + "</span><br/>" +
                        "<span class='xliunianStyle' style='color:#000'>" + lnZhi + "</span><span style='font-size:10px;color:red'>" + lnZhiShen + "</span>" +
                        (j==9?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"")
                    );
                }
                else if( dayunliunianstyle == "4" ){
                    //黑白精简风格
                    $("#ln" + (i) + "_" + (j + 1)).html(
                        (j==0?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"") +
                        "<span class='xliunianStyle' style='color:#000'>" + lnGan + "</span><span class='xliunianStyle' style='color:#000'>" + lnZhi + "</span>" +
                        (j==9?"<div class='liunianYear'><span>" + liunian[j].getYear() + "</span></div>":"")
                    );
                }
                $("#ln" + (i) + "_" + (j + 1)).attr("ganzhi", liunian[j].getGanZhi());
                $("#ln" + (i) + "_" + (j + 1)).attr("year", liunian[j].getYear());
                $("#ln" + (i) + "_" + (j + 1)).attr("age", liunian[j].getAge());
            }
        }
    
        //显示指定标签页, 1-基本,2-命盘,3-详盘,4-笔记
        var profile = layui.data('profile');
        var bztab = profile && profile.bztab || "2";
        showBaziPaipanTab(bztab == "4" ? 3 : bztab);

        //显示神煞
        var showshensha = profile?profile.showshensha:true;
        toggelShenshaTable(showshensha);
        //显示串宫12神
        var show12shen = profile?profile.show12shen:false;
        toggle12Shen(show12shen);

        //流年(小表)
        showLiuNianTable2(bazi, dayun[1]);//第一个大运的流年
        //流月
        showLiuYueTable(bazi, dayun[1].getLiuNian()[0]);//第一个大运流年的流月
        //统计图
        wuxingChart(bazi, true);
        //显示默认大运流年
        showDefaultDayunLiunian(bazi, dayun);
        //是否显示所有流年
        var showallliunian = profile?profile.showallliunian:false;
        lunianTableSwitch = !showallliunian;
        switchLiunianTableFunc();
        layui.viewmgr.showView('view_bazi');
        setTimeout(chartResize, 200);
    }

    //显示四柱的串宫12神
    function show4Zhu12Gods(bazi, taisuiZhi){
        var ygz12gods = getGanzhi12Gods(bazi.getYearGan()+bazi.getYearZhi(), taisuiZhi);
        var mgz12gods = getGanzhi12Gods(bazi.getMonthGan()+bazi.getMonthZhi(), taisuiZhi);
        var dgz12gods = getGanzhi12Gods(bazi.getDayGan()+bazi.getDayZhi(), taisuiZhi);
        var hgz12gods = getGanzhi12Gods(bazi.getTimeGan()+bazi.getTimeZhi(), taisuiZhi);
        $("#XPyGan12shen").html("<span class='_12shen'>"+ygz12gods[0]+"</span>");
        $("#XPyZhi12shen").html("<span class='_12shen'>"+ygz12gods[1]+"</span>");
        $("#XPmGan12shen").html("<span class='_12shen'>"+mgz12gods[0]+"</span>");
        $("#XPmZhi12shen").html("<span class='_12shen'>"+mgz12gods[1]+"</span>");
        $("#XPdGan12shen").html("<span class='_12shen"+(taisuiType==3?" app-chuangong-taisui":'')+"'>"+dgz12gods[0]+"</span>");
        $("#XPdZhi12shen").html("<span class='_12shen'>"+dgz12gods[1]+"</span>");
        $("#XPhGan12shen").html("<span class='_12shen'>"+hgz12gods[0]+"</span>");
        $("#XPhZhi12shen").html("<span class='_12shen'>"+hgz12gods[1]+"</span>");
    }
    //显示大运流年的12神
    function showDayunLiunian12Gods(dayunGz, liunianGz, taisuiZhi){
        var dygz12gods = getGanzhi12Gods(dayunGz, taisuiZhi);
        var lngz12gods = getGanzhi12Gods(liunianGz, taisuiZhi);

        $("#XPyunGan12shen").html("<span class='_12shen'>"+dygz12gods[0]+"</span>");
        $("#XPyunZhi12shen").html("<span class='_12shen"+(taisuiType==2?"  app-chuangong-taisui":'')+"'>"+dygz12gods[1]+"</span>");
    
        $("#XPliuGan12shen").html("-");
        if( taisuiType == 1 ){
            $("#XPliuZhi12shen").html("<span class='_12shen app-chuangong-taisui'>"+lngz12gods[1]+"</span>");    
        }else{
            $("#XPliuZhi12shen").html("-");
        }
    }
    //显示胎元的12神
    function showTaiyuan12Gods(tygz,taisuiZhi){
        var tygz12shen = getGanzhi12Gods(tygz, taisuiZhi);
        $("#XPyueGan12shen").html("<span class='_12shen'>"+tygz12shen[0]+"</span>");
        $("#XPyueZhi12shen").html("<span class='_12shen'>"+tygz12shen[1]+"</span>");
    }
    //显示命宫的12神
    function showMinggong12Gods(mggz, taisuiZhi){
        var mggz12shen = getGanzhi12Gods(mggz, taisuiZhi);
        $("#XPliuGan12shen").html("<span class='_12shen'>"+mggz12shen[0]+"</span>");
        $("#XPliuZhi12shen").html("<span class='_12shen'>"+mggz12shen[1]+"</span>");
    }
    //显示身宫的12神
    function showShengong12Gods(sggz, taisuiZhi){
        var sggz12shen = getGanzhi12Gods(sggz, taisuiZhi);
        $("#XPyunGan12shen").html("<span class='_12shen'>"+sggz12shen[0]+"</span>");
        $("#XPyunZhi12shen").html("<span class='_12shen'>"+sggz12shen[1]+"</span>");
    }
    //显示串宫12神
    function showChuanGong12Gods(type){
        taisuiType = type;
        var dygz = curDayun.getGanZhi();//大运干支
        var lngz = curLiunian.getGanZhi();//流年干支
        var tygz = bazi.getTaiYuan();//胎元干支
        var mggz = bazi.getMingGong();//命宫干支
        var sggz = bazi.getShenGong();//身宫干支

        var taisuiZhi = getTaisuiZhi();

        show4Zhu12Gods(bazi, taisuiZhi);
        showDayunLiunian12Gods(dygz, lngz, taisuiZhi);
        if( taishenmingSwitch ){
            showTaiyuan12Gods(tygz, taisuiZhi);
            showMinggong12Gods(mggz, taisuiZhi);
            showShengong12Gods(sggz, taisuiZhi);
        }
    }

    function getTaisuiZhi(){
        if( taisuiType == 1 ){
            return curLiunian.getGanZhi()[1];
        }else if( taisuiType == 2 ){
            return curDayun.getGanZhi()[1];
        }else{
            return GAN2ZHI[bazi.getDayGan()];
        }
    }

    function beginModify(){
        layui.viewmgr.loadComponent(
            'component_basic_data', 
            function () {
                basicDataComponent.displayModify(
                    "修改信息", 
                    function(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime){
                        doBaziPaipan(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime);
                    },
                    globalThis.baziView
                );
            }
        );
    }

    function beginPaipan() {
        layui.viewmgr.loadComponent(
            'component_basic_data', 
            function () {
                basicDataComponent.display(
                    "八字排盘", 
                    function(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime){
                        doBaziPaipan(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime);
                    },
                    globalThis.baziView
                );
            }
        );
    }

    globalThis.baziView = {
        display: beginPaipan,
        beginModify: beginModify,
        doBaziPaipan: doBaziPaipan,
        doOpenBaziNote: doOpenBaziNote,
        doSaveBaziNote: doSaveBaziNote,
        getLunar: function(){return lunar},
        getBazi: function(){return bazi},
        setCurrentData: function (data) { 
            currentData = data;
            $(".app-bazi-name").text(data.name);
        },
        getCurrentData: function () { return currentData;}
    };
    

})();