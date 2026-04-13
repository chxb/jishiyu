(function() {

    var profile = layui.data('profile');
    var form = layui.form;
    var util = layui.util;

    form.val("myform", {
        "mydate": homeView.args["d"],
    });

    if (!profile || !profile.loginuser) {
        form.val("myform", {
            autosave: false
        });
    }

    form.on('switch(myform)', function (data) {
        if (data.elem.name == "autosave") {
            profile = layui.data('profile');
            if (!profile || !profile.loginuser) {
                layer.msg("您未登录，登录后才能保存.", { time: 2000 });
                form.val("myform", {
                    autosave: false
                });
            }
        }
    });

    form.on('radio(myform)', function (data) {
        if (data.elem.name == "realsun") {
            //如果勾选真太阳时，显示地区选择框
            if (data.value === "true") {
                $("#form-diqu").show();
            } else {
                $("#form-diqu").hide();
            }
        } else if (data.elem.name == "wanzishi") {
            //do somethine
        }
    });
    if (layui.data('profile')) {
        form.val("myform", {
            "realsun": layui.data('profile').realsuntime,
            "wanzishi": layui.data('profile').zhaowanzishi
        });
        if (layui.data('profile').realsuntime) {
            $("#form-diqu").show();
            $('#form-realsun-true').next().trigger('click');
        } else {
            $("#form-diqu").hide();
            $('#form-realsun-false').next().trigger('click');
        }
    }
    
    form.render();

    var dateRolldate = new RolldateFull({
        el: '#mydate',
        value: $("#mydate").val(),
        dateType: 1,
        format: 'YYYY-MM-DD hh:mm',
        beginYear: 1800,
        endYear: 2199,
        zhaowanzhishi: form.val("myform").wanzishi === "true",
        showValue: function () {
            return {
                dateValue: $("#mydate").val(),
                wanzhishi: form.val("myform").wanzishi === "true"
            }
        },
        confirm: function (date) {
            var dateStr = layui.util.toDateString(date, "yyyy-MM-dd HH:mm");
            form.val("myform", {
                "mydate": dateStr,
            });
            dateChanged();
        },
    });

    var switchDateType = function(dateType){
                if (dateType==1) {//切换为公历
                    $(".rolldate-button-date2").removeClass("rolldate-button-date-active");
                    $(".rolldate-button-date-gongli").addClass("rolldate-button-date-active");
                } else if (dateType==2) {//切换为农历
                    $(".rolldate-button-date2").removeClass("rolldate-button-date-active");
                    $(".rolldate-button-date-nongli").addClass("rolldate-button-date-active");
                } else if (dateType==3) { //切换为四柱
                    $(".rolldate-button-date2").removeClass("rolldate-button-date-active");
                    $(".rolldate-button-date-shizhu").addClass("rolldate-button-date-active");
                }
            }

    $(".rolldate-button-date2").on("click", function () {
        if ($(this).attr("class").indexOf("gongli") != -1) {//切换为公历
            switchDateType(1);
            dateRolldate.show(1);
        } else if ($(this).attr("class").indexOf("nongli") != -1) {//切换为农历
            switchDateType(2);
            dateRolldate.show(2);
        } else if ($(this).attr("class").indexOf("shizhu") != -1) { //切换为四柱
            switchDateType(3);
            dateRolldate.show(3);
        }
    });

    var dateChanged = function () {
        $("#mydate").css("color", "var(--theme-color");
        setTimeout(function () {
            $("#mydate").css("color", "rgba(0,0,0,0.85");
        }, 800);
    }

    $(".app-time-btn").on("click", function () {
        var aDate = new Date();
        var nowtime = util.toDateString(aDate, "yyyy-MM-dd HH:mm");
        form.val("myform", {
            "mydate": nowtime,
        });
        dateChanged();
    })

    //初始化地区下拉框
    var initDiquData = function () {
        var tree = {};
        var LOCAL_ARRAY = layui.realsuntime.getLocalArray();
        for (var i = 0; i < LOCAL_ARRAY.length; i++) {
            var diqu = LOCAL_ARRAY[i].split(" ")[0];
            var d1, d2;
            if (diqu.indexOf("内蒙古") == 0 || diqu.indexOf("黑龙江") == 0) {
                d1 = diqu.substring(0, 3);
                d2 = diqu.substring(3, diqu.length);
            } else {
                d1 = diqu.substring(0, 2);
                d2 = diqu.substring(2, diqu.length);
            }
            if (!tree[d1]) {
                tree[d1] = ""; tree[d1] = [];
            }
            tree[d1].push(d2);
        }
        return tree;
    }

    var diquTree = initDiquData();
    var diquList = [];
    for (var diqu in diquTree) {
        if (diqu == "北京" || diqu == "上海" || diqu == "天津" || diqu == "香港" || diqu == "澳门" || diqu == "台湾") continue;
        diquList.push(diqu);
    }
    diquList.unshift("天津");
    diquList.unshift("上海");
    diquList.unshift("北京");
    diquList.push("香港");
    diquList.push("澳门");
    diquList.push("台湾");
    for (var i = 0; i < diquList.length; i++) {
        document.getElementById("diqu1").options.add(new Option(diquList[i], diquList[i]));

    }
    var diquList2 = diquTree[diquList[0]];
    for (var j = 0; j < diquList2.length; j++) {
        document.getElementById("diqu2").options.add(new Option(diquList2[j], diquList2[j]));
    }


    //初始化表单事件。
    var formVal = form.val("myform", {
        "sex": homeView.args["x"].toUpperCase() == "M" ? "true" : "false"
    });
    form.on('select(diqu1)', function (data) {
        document.getElementById("diqu2").options.length = 0;
        var diquList2 = diquTree[data.value];
        for (var j = 0; j < diquList2.length; j++) {
            document.getElementById("diqu2").options.add(new Option(diquList2[j], diquList2[j]));
        }
        form.render("select");
    });

    function fillFormData(data) {
        var birthArr = data.gldatetime.split("");
        var yy = parseInt(birthArr[0] + birthArr[1] + birthArr[2] + birthArr[3]);
        var mm = parseInt(birthArr[5] + birthArr[6]);
        var dd = parseInt(birthArr[8] + birthArr[9]);
        var hh = parseInt(birthArr[11] + birthArr[12]);
        var mi = parseInt(birthArr[14] + birthArr[15]);
        var ss = 0;
        var currentDate = new Date(yy, mm - 1, dd, hh, mi, ss);
        form.val("myform", {
            fileId: data.id,
            myname: data.name,
            mydate: data.gldatetime,
            sex: "" + data.sex,
            diqu1: data.diqu1,
            diqu2: data.diqu2,
            realsun: ""+data.realsun,
            wanzishi: ""+data.zhaowanzishi,
        });
        form.render("select");
        form.render("radio");
        $('#diqu1').siblings("div.layui-form-select")
            .find('dl')
            .find('dd[lay-value="' + data.diqu1 + '"]')
            .click();
        form.val("myform", {
            diqu1: data.diqu1,
            diqu2: data.diqu2
        });
        if( data.realsun ){
            $('#form-realsun-true').next().trigger('click');
        }else{
            $('#form-realsun-false').next().trigger('click');
        }

    }

    function submitForm(callback) {
        try {
            var formData = form.val("myform");
            var birthArr = (formData.mydate).split("");

            var yy = parseInt(birthArr[0] + birthArr[1] + birthArr[2] + birthArr[3]);
            var mm = parseInt(birthArr[5] + birthArr[6]);
            var dd = parseInt(birthArr[8] + birthArr[9]);
            var hh = parseInt(birthArr[11] + birthArr[12]);
            var mi = parseInt(birthArr[14] + birthArr[15]);
            var ss = 0;

            var sex = formData.sex === "true";//是否男性
            var realsun = formData.realsun === "true";//是否采用真太阳时
            var wanzishi = formData.wanzishi === "true";//是否计算晚子时
            var summertime = formData.summertime === "true";//是否计算夏令时
            var diqu = document.getElementById("diqu1").value + document.getElementById("diqu2").value;

            callback(yy, mm, dd, hh, mi, ss, sex, realsun, diqu, wanzishi, summertime);

        } catch (err) {
            console.error(err);
        }
    }

    //保存新数据
    function doSave(viewObj) {
        var formData = form.val("myform");
        var lunar = viewObj.getLunar();
        var bazi = viewObj.getBazi();
        var data = {
            "uid": layui.data('profile').loginuser.id,
            "name": formData.myname,
            "sex": formData.sex,
            "diqu1": formData.diqu1,
            "diqu2": formData.diqu2,
            "realsun": formData.realsun,
            "zhaowanzishi": formData.wanzishi,
            "gldatetime": formData.mydate,
            "nldatetime": lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + " " + lunar.getTimeZhi() + "时",
            "animal": lunar.getYearShengXiaoByLiChun(),
            "bazi": [bazi.getYearGan(), bazi.getYearZhi(), bazi.getMonthGan(), bazi.getMonthZhi(), bazi.getDayGan(), bazi.getDayZhi(), bazi.getTimeGan(), bazi.getTimeZhi()],
            "tag": null
        }
        layui.dataservice.add(
            data,
            function (result) {
                data.id = result.data;
                if( viewObj && viewObj.setCurrentData ){
                    viewObj.setCurrentData(data);
                }
                form.val("myform", { "myname": "", "fileId": "" });
                //存笔记
                if( viewObj && viewObj.doSaveBaziNote ){
                    viewObj.doSaveBaziNote(true);
                }
            }, function (result) {
                console.error("[SAVE] " + result.message);
            }
        );
    }

    //修改数据
    function doModify(viewObj) {
        var formData = form.val("myform");
        var lunar = viewObj.getLunar();
        var bazi = viewObj.getBazi();
        var data = {
            "id": formData.fileId,
            "uid": layui.data('profile').loginuser.id,
            "name": formData.myname,
            "sex": formData.sex,
            "diqu1": formData.diqu1,
            "diqu2": formData.diqu2,
            "realsun": formData.realsun,
            "zhaowanzishi": formData.wanzishi,
            "gldatetime": formData.mydate,
            "nldatetime": lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + " " + lunar.getTimeZhi() + "时",
            "animal": lunar.getYearShengXiaoByLiChun(),
            "bazi": [bazi.getYearGan(), bazi.getYearZhi(), bazi.getMonthGan(), bazi.getMonthZhi(), bazi.getDayGan(), bazi.getDayZhi(), bazi.getTimeGan(), bazi.getTimeZhi()],
            "tag": null
        }
        layui.dataservice.update(//提交服务器保存
            data,
            function (result) {
                if( viewObj && viewObj.setCurrentData ){
                    viewObj.setCurrentData(data);
                }
                form.val("myform", { "myname": "", "fileId": "" });
            },
            function (result) {
                console.error("[UPDATE] " + result.message);
            }
        );
    }

    var checkInput = function () {
        var reg = /^[\w\d\u4e00-\u9fa5]+$/;
        var data = form.val("myform").myname;
        if (data.length > 15 || !data || !reg.test(data)) {
            layer.tips('需要保存时，缘主姓名不能为空，长度不能超过18个字符，也不能包含空格字符', '#myname', {
                tips: [3, 'red'],
                time: 3000
            });
            return false;
        }
        return true;
    }

    function displayModify(title, callback, viewObj) {
        var layerIdx = layer.open({
            type: 1,
            title: title || "选择时间",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "460px"],
            isOutAnim: false,
            offset: 'b',
            zIndex: 980,
            skin: 'popup-tip-box',
            shade: [0.01, '#000'],
            end: function () {
                $("#component_basic_data").hide();
            },
            content: $('#component_basic_data'),
        });

        form.val("myform", {
            myname: ""
        });
        fillFormData(viewObj.getCurrentData());

        $("#submitFormBtn").text("保存并排盘");
        $("#submitFormBtn").off("click");
        $("#submitFormBtn").on("click", function () {
            var isautosave = form.val("myform").autosave;
            if (isautosave && !checkInput()) return;
            layui.viewmgr.popView();
            submitForm(callback);
            isautosave && doModify(viewObj);
            layer.close(layerIdx);
        });
    }

    function display(title, callback, viewObj) {
        var layerIdx = layer.open({
            type: 1,
            title: title || "选择时间",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "460px"],
            isOutAnim: false,
            offset: 'b',
            zIndex: 980,
            skin: 'popup-tip-box',
            shade: [0.01, '#000'],
            end: function () {
                $("#component_basic_data").hide();
            },
            content: $('#component_basic_data'),
        });
        form.val("myform", {
            myname: ""
        });
        $("#submitFormBtn").text("排盘");
        $("#submitFormBtn").off("click");
        $("#submitFormBtn").on("click", function () {
            var isautosave = form.val("myform").autosave;
            if (isautosave && !checkInput()) return;
            submitForm(callback);
            isautosave && doSave(viewObj);
            layer.close(layerIdx);
        });
    }

    globalThis.basicDataComponent = {
        display: display,
        displayModify: displayModify
    };

})();