/**
 * 排盘工具，主入口。
 * @author xianbo.chen@gmail.com
 */
function paipan() {
    var profile = layui.data('profile');
    var util = layui.util;
    var nowDate = new Date();
    var initDateTimeVal = util.toDateString(nowDate, "yyyy-MM-dd HH:mm");

    var args = {};//url后面的参数
    args["x"] = "M";
    if (location.search) {
        //从url地址#后读取参数, 
        //格式: 
        //s=1&d=yyyy-MM-dd HH:mm&x=[M|F]&t=[1|2|3]
        //s: 表示显示哪个界面，不指定默认显示首页。0-首页，1-八字，2-档案，3-万年历, 4-老黄历, 5-命理奇门，6-阴盘时盘，7-阴盘刻盘, 9-我的
        //d: 参数只对八字和奇门有作用。
        //t: 表示要显示八字界面的那个标签页(当s=1时才起作用)，1-基本信息，2-基本命盘，3-详细命盘，4-笔记
        //例如：d=1999-09-19 09:48&x=M&t=3
        //(排盘时间为1999-09-19 09:48, x-M性别男，t=3显示详细命盘)
        var searchstring = location.search.substring(1);
        var kv = searchstring.split("&");
        kv.forEach(function (e) {
            if (!e) return;
            var a = e.split("=");
            args[a[0]] = decodeURIComponent(a[1]);
        });
        args["d"] = args["d"] || initDateTimeVal;
        args["x"] = args["x"] || "M";
    } else {
        args["d"] = initDateTimeVal;
    }

    args["t"] = profile && profile.bztab || "2";


    var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d(:[0-5]\d)?$/;
    if (args["d"] && !reg.test(args["d"])) {
        layer.msg("日期参数d的格式必须为yyyy-MM-dd HH:mm。<br/>例如：1999-09-19 09:48");
        return;
    }
    if (args["x"] && (args["x"] != "M" && args["x"] != "F")) {
        layer.msg("性别参数x的值必须为M或F。默认为M");
        return;
    }


    //清除底部导航条活动样式
    function deactiveNav() {
        $(".app-footer-tab").each(function () {
            $(this).removeClass("app-footer-tab-selected");
        });
        $(".app-navbar-icon-paipan").removeClass("app-navbar-icon-paipan-selected");
        $(".app-navbar-icon-files").removeClass("app-navbar-icon-files-selected");
        $(".app-navbar-icon-calendar").removeClass("app-navbar-icon-calendar-selected");
        $(".app-navbar-icon-books").removeClass("app-navbar-icon-books-selected");
        $(".app-navbar-icon-profile").removeClass("app-navbar-icon-profile-selected");
    }

    //底部导航条事件
    var navBarEventBus = {
        paipan: function (othis) {
            var that = this;
            deactiveNav()
            othis.addClass("app-footer-tab-selected");
            $(".app-navbar-icon-paipan").addClass("app-navbar-icon-paipan-selected");
            layui.viewmgr.resetViews();
            layui.viewmgr.showView('view_home');
            $("#modifyButtonPanel").hide();
            $("#paipanButtonPanel").show();
            $("#autosaveSwitch").show();
        },
        filelist: function (othis) {
            layui.viewmgr.loadView('view_filelist', function () {
                deactiveNav();
                filelistView.display();
            });
        },
        calendar: function (othis) {
            layui.viewmgr.loadView('view_wannianli', function () {
                layui.viewmgr.loadView('view_laohuangli', function () {
                    deactiveNav();
                    wannianliView.display();
                });
            });
        },
        books: function (othis) {
            layui.viewmgr.loadView('view_books', function () {
                deactiveNav();
                booksView.display();
            });
        },
        profile: function (othis) {
            layui.viewmgr.loadView('view_profile', function () {
                deactiveNav();
                profileView.display();
            });
        },
    };

    //首页干支日历点击事件
    $(".yueli-day-info-gz").on("click", yuelidayinfogzClickFunc);

    //底部导航条点击事件
    // $(".app-footer-tab").on("click", function () {
    //     var othis = $(this);
    //     var nav = othis.data('nav');
    //     navBarEventBus[nav] && navBarEventBus[nav].call(this, othis);
    //     $("#appframe").scrollTop(0);
    // });

    let lastClick = 0;
    const CLICK_DELAY = 500; // 1秒节流

    $(".app-footer-tab").on("click", function () {
        const now = Date.now();
        if (now - lastClick < CLICK_DELAY) {
            return; // 短时间内的连续点击直接丢弃
        }
        lastClick = now;

        var othis = $(this);
        var nav = othis.data('nav');
        if (navBarEventBus[nav]) {
            navBarEventBus[nav].call(this, othis);
        }
        $("#appframe").scrollTop(0);
    });


    var getListType = function(){
        var listType = 0;
        var curView = layui.viewmgr.currentView();
        if (curView.data("view") === "view_yinpan_qimen"){
            listType = yinpanQimenView.getQimenData().isKepan ? 2 : 1;
        }else if( curView.data("view") === "view_6yao"){
            listType = 3;
        }else if( curView.data("view") === "view_meihuayishu"){
            listType = 4;
        }else if( curView.data("view") === "view_da6ren"){
            listType = 5;
        }else if( curView.data("view") === "view_qimen_da6ren"){
            listType = 6;
        }else if( curView.data("view") === "view_qimen_3shi"){
            listType = 7;
        }else if( curView.data("view") === "view_shanxiang_qimen"){
            listType = 8;
        }else if( curView.data("view") === "view_qimendunjia"){
            listType = 9;
        }else if( curView.data("view") === "view_x6ren"){
            listType = 10;
        }
        return listType;
    }

    var getRecoreOpenListener = function (listType) {
        switch (listType) {
            case 1:
            case 2:
                return yinpanQimenView.doOpen;
            case 3:
                return sixyaoView.doOpen;
            case 4:
                return meihuayishuView.doOpen;
            case 5:
                return da6renView.doOpen;
            case 6:
                return qimen6renView.doOpen;
            case 7:
                return qimen3shiView.doOpen;
            case 8:
                return shanxiangQimenView.doOpen;
        }
    }

    //标题栏左右小按钮点击事件

    //显示今天日历
    var showToday = function () {
        layui.use(['monthly'], function () {
            layui.monthly.today();
        });
    }
    var showJinri = function () {
        layui.use(['monthly'], function () {
            layui.monthly.jinri();
        });
    };

    var showHuangli = function () {
        layui.viewmgr.showView('view_laohuangli');
    }

    var showGongli = function () {
        layui.viewmgr.backView();
    }

    var doRefresh = function () {
        location.href = window.location.origin;
    }

    var headerButtonFunc = function () {
        var othis = $(this);
        var action = othis.attr("action");
        switch (action) {
            case "back":
                layui.viewmgr.backView();
                break;
            case "refresh":
                doRefresh();
                break;
            case "delete":
                filelistView.beginDelete();
                break;
            case "modify":
                layui.viewmgr.loadView('view_bazi', function () {
                    baziView.beginModify();
                });
                break;
            case "bazi":
                layui.viewmgr.loadView('view_bazi', function () {
                    var data = baziView.getCurrentData();
                    var birthArr = data.gldatetime.split("");
                    var yy = parseInt(birthArr[0] + birthArr[1] + birthArr[2] + birthArr[3]);
                    var mm = parseInt(birthArr[5] + birthArr[6]);
                    var dd = parseInt(birthArr[8] + birthArr[9]);
                    var hh = parseInt(birthArr[11] + birthArr[12]);
                    var mi = parseInt(birthArr[14] + birthArr[15]);
                    var ss = 0;
                    var sex = data.sex;//是否男性
                    var realsun = data.realsun;//是否采用真太阳时
                    var wanzishi = data.zhaowanzishi;//是否计算晚子时
                    var summertime = true;//是否计算夏令时
                    var diqu = data.diqu1+data.diqu2;//地区;

                    baziView.doBaziPaipan(yy, mm, dd, hh, mi, ss, sex, realsun, diqu, wanzishi, summertime);
                    
                    $("#rightBtn2").css("visibility", "hidden");
                })
                break;
            case "mingliqimen":
                layui.viewmgr.loadView('view_mingli_qimen', function () {
                    var data = baziView.getCurrentData();
                    var birthArr = data.gldatetime.split("");
                    var yy = parseInt(birthArr[0] + birthArr[1] + birthArr[2] + birthArr[3]);
                    var mm = parseInt(birthArr[5] + birthArr[6]);
                    var dd = parseInt(birthArr[8] + birthArr[9]);
                    var hh = parseInt(birthArr[11] + birthArr[12]);
                    var mi = parseInt(birthArr[14] + birthArr[15]);
                    var ss = 0;
                    var sex = data.sex;//是否男性
                    var realsun = data.realsun;//是否采用真太阳时
                    var wanzishi = data.zhaowanzishi;//是否计算晚子时
                    var summertime = true;//是否计算夏令时
                    var diqu = data.diqu1+data.diqu2;//地区;
                    mingliQimenView.doMingliQimen(yy, mm, dd, hh, mi, ss, sex, realsun, diqu, wanzishi, summertime);
                    $("#rightBtn1").css("visibility", "hidden");
                });
                break;
            case "today":
                showToday();
                break;
            case "jinri":
                showJinri();
                break;
            case "huangli":
                showHuangli();
                break;
            case "gongli":
                showGongli();
                break;
            case "saveRecord":
                var listType = getListType();
                switch(listType){
                    case 1:
                        yinpanQimenView.doSave();
                        break;
                    case 2:
                        yinpanQimenView.doSave();
                        break;
                    case 3:
                        sixyaoView.doSave();
                        break;
                    case 4:
                        meihuayishuView.doSave();
                        break;
                    case 5:
                        da6renView.doSave();
                        break;
                    case 6:
                        qimen6renView.doSave();
                        break;
                    case 7:
                        qimen3shiView.doSave();
                        break;
                    case 8:
                        shanxiangQimenView.doSave();
                        break;
                    case 9:
                        qimendunjiaView.doSave();
                        break;
                    case 10:
                        x6renView.doSave();
                        break;
                }
                break;
            case "listRecord":
                layui.viewmgr.loadView('view_recordlist', function () {
                    var listType = getListType();
                    layui.viewmgr.showView('view_recordlist');
                    if (!$("#recordsearchbox").val()) {
                        recordListView.setRecordHandler({
                            type: listType,
                            openListener: getRecoreOpenListener(listType)
                        });
                        recordListView.resetFilePageNum();
                        recordListView.display();
                    }
                });
                break;
            case "deleteRecord":
                recordListView.beginDeleteRecord();
                break;
            case "share":
                var curView = layui.viewmgr.currentView();
                if (curView.data("view") === "view_bazi") { //八字排盘界面 1
                    var d = encodeURIComponent(baziView.getCurrentData().gldatetime);
                    var x = baziView.getCurrentData().sex? "M" : "F";
                    copy2Clipboard("【吉时雨排盘】点击链接查看八字排盘：" + window.location.origin + "?s=1&d=" + d + "&x=" + x);
                } else if (curView.data("view") === "view_mingli_qimen") { //命理奇门 5
                    var d = encodeURIComponent(mingliQimenView.getMingliQimenData().solar.toYmdHms());
                    var x = mingliQimenView.getMingliQimenData().isman? "M" : "F";
                    copy2Clipboard("【吉时雨排盘】点击链接查看阴盘奇门排盘：" + window.location.origin + "?s=5&d=" + d + "&x=" + x);
                } else if (curView.data("view") === "view_yinpan_qimen") { //阴盘奇门 7,6
                    var d = encodeURIComponent(yinpanQimenView.getQimenData().solar.toYmdHms());
                    if (yinpanQimenView.getQimenData().isKepan) {
                        copy2Clipboard("【吉时雨排盘】点击链接查看阴盘奇门排盘(刻盘)：" + window.location.origin + "?s=7&d=" + d);//刻盘
                    } else {
                        copy2Clipboard("【吉时雨排盘】点击链接查看阴盘奇门排盘(时盘)：" + window.location.origin + "?s=6&d=" + d);//时盘
                    }
                } else if (curView.data("view") === "view_wannianli") { //万年历 3
                    copy2Clipboard("【吉时雨排盘】点击链接查看万年历：" + window.location.origin + "?s=3");
                } else if (curView.data("view") === "view_laohuangli") { //老黄历 4
                    copy2Clipboard("【吉时雨排盘】点击链接查看老黄历：" + window.location.origin + "?s=4");
                } else if( curView.data("view") === "view_mobile_analysis"){ //手机号吉凶 11
                    var m = mobileAnalysisView.getMobileData().mobile;
                    var x = mobileAnalysisView.getMobileData().sex;
                    copy2Clipboard("【吉时雨排盘】点击链接查看手机号吉凶："+window.location.origin+"?s=11&m="+m+"&x="+x);
                }else if( curView.data("view") === "view_qimendunjia"){ //奇门遁甲排盘 9
                    var d = encodeURIComponent(qimendunjiaView.getQimenData().solar.toYmdHms());
                    copy2Clipboard("【吉时雨排盘】点击链接查看奇门遁甲排盘："+window.location.origin+"?s=9&d="+d);
                }else{
                    layer.msg("复制链接失败");
                    return ;
                }
                layer.msg("分享链接已复制，请切换到其他程序粘贴链接进行分享");
                break;
        }
    }
    //标题栏左1按钮
    $("#leftBtn1").on("click", headerButtonFunc);
    //标题栏左2按钮
    $("#leftBtn2").on("click", headerButtonFunc);
    //标题栏右2按钮
    $("#rightBtn2").on("click", headerButtonFunc);
    //标题栏右1按钮
    $("#rightBtn1").on("click", headerButtonFunc);



    $("#appframe").on("click", function (e) {
        if (e && e.target.className == "qimen-4zhu" ||
            e.target.parentNode && e.target.parentNode.className == "qimen-4zhu" ||
            e.target.parentNode && e.target.parentNode.parentNode && e.target.parentNode.parentNode.className == "qimen-4zhu") {
            return;
        }
        layui.use(['qimenhelper'], function () {
            layui.qimenhelper.hide();
        });
    });


    //首页八字排盘按钮
    $("#bzpaipanBtn").on("click", function () {
        layui.viewmgr.loadView('view_bazi', function () {
            baziView.display();
        });
    });
    //首页命理奇门排盘按钮
    $("#mingliqimenBtn").on("click", function () {
        layui.viewmgr.loadView('view_mingli_qimen', function () {
            mingliQimenView.display();
        });
    });
    //首页紫微排盘按钮
    $("#ziweiBtn").on("click", function () {
        layui.viewmgr.loadView('view_ziwei', function () {
            ziweiView.display();
        });
    });
    //首页小六壬排盘按钮
    $("#x6renBtn").on("click", function () {
        layui.viewmgr.loadView('view_x6ren', function () {
            x6renView.display();
        });
    });
    //首页奇门遁甲排盘按钮
    $("#qimendunjiaBtn").on("click", function () {
        layui.viewmgr.loadView('view_qimendunjia', function () {
            qimendunjiaView.display();
        });
    });
    //首页阴盘奇门排盘按钮
    $("#yinpanqimenBtn1").on("click", function () {
        layui.viewmgr.loadView('view_yinpan_qimen', function () {
            yinpanQimenView.display();
        });
    });
    //首页山向奇门排盘按钮
    $("#shanxiangqimenBtn").on("click", function () {
        layui.viewmgr.loadView('view_shanxiang_qimen', function () {
            shanxiangQimenView.display();
        });
    });
    //首页玄空飞星排盘按钮
    $("#xuankongfeixingBtn").on("click", function () {
        layui.viewmgr.loadView('view_xuankong_feixing', function () {
            xuankongfeixingView.display();
        });
    });
    //首页达摩一掌经排盘按钮
    $("#yizhangjingBtn").on("click", function () {
        layui.viewmgr.loadView('view_yizhangjing', function () {
            yizhangjingView.display();
        });
    });
    //首页梅花易数排盘按钮
    $("#meihuaBtn").on("click", function () {
        layui.viewmgr.loadView('view_meihuayishu', function () {
            meihuayishuView.display();
        });
    });
    //首页大六壬排盘按钮
    $("#da6renBtn").on("click", function () {
        layui.viewmgr.loadView('view_da6ren', function () {
            da6renView.display();
        });
    });
    //首页六爻排盘按钮
    $("#6yaoBtn").on("click", function () {
        layui.viewmgr.loadView('view_6yao', function () {
            sixyaoView.display();
        });
    });
    //首页奇门穿壬排盘按钮
    $("#qimen6renBtn").on("click", function () {
        layui.viewmgr.loadView('view_qimen_da6ren', function () {
            qimen6renView.display();
        });
    });
    //首页奇门三式排盘按钮
    $("#qimen3shiBtn").on("click", function () {
        layui.viewmgr.loadView('view_qimen_3shi', function () {
            qimen3shiView.display();
        });
    });
    //首页万年历按钮
    $("#wannianliBtn").on("click", function () {
        layui.viewmgr.loadView('view_wannianli', function () {
            layui.viewmgr.loadView('view_laohuangli', function () {
                deactiveNav();
                wannianliView.display();
            });
        });
    });
    //首页老黄历按钮
    $("#laohuangliBtn").on("click", function () {
        layui.viewmgr.loadView('view_wannianli', function () {
            layui.viewmgr.loadView('view_laohuangli', function () {
                deactiveNav();
                laohuangliView.display();
            });
        });
    });
    //首页手机号吉凶按钮
    $("#mobileBtn").on("click", function () {
        layui.viewmgr.loadView('view_mobile_analysis', function () {
            mobileAnalysisView.display();
        });
    });
    //首页八字合婚按钮
    $("#hehunBtn").on("click", function () {
        layui.viewmgr.loadView('view_hehun', function () {
            hehunView.display();
        });
    });


    function yuelidayinfogzClickFunc() {
        layui.use(['monthly'], function () {
            var calender = Solar.fromDate(new Date());
            var l = calender.getLunar();
            var bz = l.getEightChar();
            var date = new Date(calender.getYear(), calender.getMonth() - 1, calender.getDay(), calender.getHour(), calender.getMinute(), 0);
            var data = {
                id: null,
                name: "",
                sex: true,
                diqu1: "北京",
                diqu2: "市区",
                realsun: true,
                zhaowanzishi: true,
                gldatetime: layui.util.toDateString(date, "yyyy-MM-dd HH:mm:ss"),
                nldatetime: l.getYearInChinese() + "年" + l.getMonthInChinese() + "月" + l.getDayInChinese() + " " + l.getTimeZhi() + "时",
                animal: l.getMonthShengXiaoExact(),
                bazi: [bz.getYearGan(), bz.getYearZhi(), bz.getMonthGan(), bz.getMonthZhi(), bz.getDayGan(), bz.getDayZhi(), bz.getTimeGan(), bz.getTimeZhi()],
                tag: ""
            };
            layui.viewmgr.loadView('view_bazi', function () {
                var birthArr = data.gldatetime.split("");
                var yy = parseInt(birthArr[0] + birthArr[1] + birthArr[2] + birthArr[3]);
                var mm = parseInt(birthArr[5] + birthArr[6]);
                var dd = parseInt(birthArr[8] + birthArr[9]);
                var hh = parseInt(birthArr[11] + birthArr[12]);
                var mi = parseInt(birthArr[14] + birthArr[15]);
                var ss = 0;
    
                var sex = data.sex;//是否男性
                var realsun = data.realsun;//是否采用真太阳时
                var wanzishi = data.zhaowanzishi;//是否计算晚子时
                var summertime = true;//是否计算夏令时
                var diqu = data.diqu1+data.diqu2;//地区;
                baziView.doBaziPaipan(yy, mm, dd, hh, mi, ss, sex, realsun, diqu, wanzishi, summertime);
            });
        });
    }

    //首页登录按钮事件
    $("#app-login-panel").on("click", function (e) {
        layui.viewmgr.loadView('view_login', function () {
            loginView.display();
        });
    });

    //首页下载按钮事件
    $("#download_app_btn").on("click", function (e) {
        layui.viewmgr.loadView('view_download', function () {
            layui.viewmgr.showView('view_download');
        });
    });
        
    var v1 = "&#29256"; var v2 = "&#26435"; var v3 = "&#25152"; var v4 = "&#26377"; var v5 = " "; var v6 = "2"; var v7 = "0"; var v8 = "2";
    var v9 = "3"; var v10 = " "; var v11 = "&#21513"; var v12 = "&#26102"; var v13 = "&#38632"; var v14 = "&#32593"; var v15 = "&#31449"; var v16 = " ";
    var v17 = "&#20445"; var v18 = "&#30041"; var v19 = "&#25152"; var v20 = "&#26377"; var v21 = "&#26435"; var v22 = "&#21033"; var v23 = "。";
    var v24 = "&#30423"; var v25 = "&#29256"; var v26 = "&#24517"; var v27 = "&#31350";


    //首页今日干支日历信息
    function showTodayBaziInfo() {
        var curLunar = Lunar.fromDate(new Date());
        var curBazi = curLunar.getEightChar();
        // bazi.setSect(2);
        var bz = [];
        bz[0] = curBazi.getYearGan(); bz[1] = curBazi.getYearZhi(); //年柱干支
        bz[2] = curBazi.getMonthGan(); bz[3] = curBazi.getMonthZhi();//月柱干支
        bz[4] = curBazi.getDayGan(); bz[5] = curBazi.getDayZhi();  //日柱干支
        bz[6] = curBazi.getTimeGan(); bz[7] = curBazi.getTimeZhi(); //时柱干支
        var gzY = "年<br/><span class='" + wuxingStyle(tianganWuxing(bz[0])) + " yueli-day-info-gz-style'>" + bz[0] + "</span>";
        var gzY = gzY + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[1])) + " yueli-day-info-gz-style'>" + bz[1] + "</span>";
        $("#app-day-gz-y").html(gzY);
        var gzM = "月<br/><span class='" + wuxingStyle(tianganWuxing(bz[2])) + " yueli-day-info-gz-style'>" + bz[2] + "</span>";
        var gzM = gzM + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[3])) + " yueli-day-info-gz-style'>" + bz[3] + "</span>";
        $("#app-day-gz-m").html(gzM);
        var gzD = "日<br/><span class='" + wuxingStyle(tianganWuxing(bz[4])) + " yueli-day-info-gz-style'>" + bz[4] + "</span>";
        var gzD = gzD + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[5])) + " yueli-day-info-gz-style'>" + bz[5] + "</span>";
        $("#app-day-gz-d").html(gzD);
        var gzH = "时<br/><span class='" + wuxingStyle(tianganWuxing(bz[6])) + " yueli-day-info-gz-style'>" + bz[6] + "</span>";
        var gzH = gzH + "<br/><span class='" + wuxingStyle(dizhiWuxing(bz[7])) + " yueli-day-info-gz-style'>" + bz[7] + "</span>";
        $("#app-day-gz-h").html(gzH);

        var curSolar = curLunar.getSolar();
        $(".app-day-num-value").text(curSolar.getDay());
        $(".app-day-month").text(curSolar.getYear() + "年" + curSolar.getMonth() + "月");
        $(".app-day-nongli").text("农历" + curLunar.getMonthInChinese() + "月" + curLunar.getDayInChinese());
        $(".app-day-week").text("星期" + curSolar.getWeekInChinese() + " " + (curLunar.getJieQi() || ""));

    }


    //根据浏览器参数自动跳转到指定屏幕界面
    function gotoView() {
        var d = args["d"] || initDateTimeVal;
        var x = args["x"] || "M";

        if( !args["s"] ) return;

        var yy = parseInt(d[0] + d[1] + d[2] + d[3]);
        var mm = parseInt(d[5] + d[6]);
        var dd = parseInt(d[8] + d[9]);
        var hh = parseInt(d[11] + d[12]);
        var mi = parseInt(d[14] + d[15]);
        var ss = 0;
        if (args["s"] === "1") { //八字
            layui.viewmgr.loadView('view_bazi', function () {
                baziView.doBaziPaipan(yy, mm, dd, hh, mi, ss, x === "M" ? true : false, false, "", true, true);
                $("#rightBtn2").css("visibility", "hidden");
            });
        } else if (args["s"] === "2") { //档案
            layui.viewmgr.loadView('view_filelist', function () {
                deactiveNav();
                filelistView.display();
            });
        } else if (args["s"] === "3") { //万年历
            layui.viewmgr.loadView('view_wannianli', function () {
                layui.viewmgr.loadView('view_laohuangli', function () {
                    deactiveNav();
                    wannianliView.display();
                });
            });
        } else if (args["s"] === "4") { //老黄历
            layui.viewmgr.loadView('view_wannianli', function () {
                layui.viewmgr.loadView('view_laohuangli', function () {
                    deactiveNav();
                    laohuangliView.display();
                });
            });
        } else if (args["s"] === "5") { //命理奇门
            layui.viewmgr.loadView('view_mingli_qimen', function () {
                mingliQimenView.doMingliQimen(yy, mm, dd, hh, mi, ss, x === "M" ? true : false, false, "", true, true);
                $("#rightBtn1").css("visibility", "hidden");
            });
        } else if (args["s"] === "6") { //阴盘奇门(时盘)
            layui.viewmgr.loadView('view_yinpan_qimen', function () {
                var aDate = new Date(yy, mm - 1, dd, hh, mi, ss);
                var data = {
                    "datetime": layui.util.toDateString(aDate, "yyyy-MM-dd HH:mm:ss"),
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "kepan": false,
                    "cusJushu": 0
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                yinpanQimenView.doOpen(record);
            });
        } else if (args["s"] === "7") { //阴盘奇门(刻盘)
            layui.viewmgr.loadView('view_yinpan_qimen', function () {
                var aDate = new Date(yy, mm - 1, dd, hh, mi, ss);
                var data = {
                    "datetime": layui.util.toDateString(aDate, "yyyy-MM-dd HH:mm:ss"),
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "kepan": true,
                    "cusJushu": 0
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                yinpanQimenView.doOpen(record);
            });
        } else if (args["s"] === "9") { //奇门遁甲排盘
            layui.viewmgr.loadView('view_qimendunjia', function () {
                var aDate = new Date(yy, mm - 1, dd, hh, mi, ss);
                var data = {
                    "datetime": layui.util.toDateString(aDate, "yyyy-MM-dd HH:mm:ss"),
                    "realsun": false,
                    "diqu": "",
                    "wanzishi": false,
                    "panMethod": 1,
                    "anganType": 1
                }
                var record = {
                    id: null,
                    desc: "",
                    content: JSON.stringify(data)
                }
                qimendunjiaView.doOpen(record);
            });
        } else if (args["s"] === "99") { //我的
            layui.viewmgr.loadView('view_profile', function () {
                deactiveNav();
                profileView.display();
            });
        } else if (args["s"] === "11") { //手机号
            layui.viewmgr.loadView('view_mobile_analysis', function () {
                mobileAnalysisView.doAnalysisMobile(args["m"], args["x"]);
            });
        }


        var copyright1 = '<div style="text-align: center;margin:0 auto;padding-bottom:20px;"><p style="font-size:12px;color:#939393;">';
        var copyright2 = '</p></div>';
        $("div[data-view='view_home']").append(copyright1 + v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10 + v11 + v12 + v13 + v14 + v15 + v16 + v17 + v18 + v19 + v20 + v21 + v22 + v23 + v24 + v25 + v26 + v27 + v23 + copyright2);

    }

    //显示首页
    layui.viewmgr.showView('view_home');

    if (profile && profile.loginuser) {
        $("#app-login-panel").hide();
    } else {
        $("#app-login-panel").show();
    }


    //注册全局变量或者函数，方便在其它模块中可以直接调用
    globalThis.homeView = {
        navBarEventBus: navBarEventBus,
        args: args
    };

    //显示今日干支日历
    showTodayBaziInfo();    
    //每分钟更新一次干支日历
    setInterval(showTodayBaziInfo, 60000);
    //自动跳转到指定界面
    gotoView();

};

