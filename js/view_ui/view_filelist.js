(function(){

    var filePageNum = 0;
    var filePageSize = 50;
    var filesearchTimeout = null;

    var filelistitem_tpl = null;

    var beginDelete = function () {
        $(".app-file-list-item-uncheck").css("visibility", "visible");
        $("#deleteOkBtn").show();
        $("#deleteCancelBtn").show();
        $("#newBtn").hide();
    };

    var endDelete = function () {
        $(".app-file-list-item-check").addClass("app-file-list-item-uncheck");
        $(".app-file-list-item-uncheck").removeClass("app-file-list-item-check");
        $(".app-file-list-item-uncheck").attr("state", "unchecked");
        $(".app-file-list-item-uncheck").css("visibility", "hidden");
        $("#deleteOkBtn").hide();
        $("#deleteCancelBtn").hide();
        $("#newBtn").show();
    };
    var doDelete = function () {
        $(".app-file-list-item-check").each(function () {
            var that = this;
            var id = $(that.parentNode).data("id");
            layui.dataservice.remove({ "id": id },
                function (result) {
                    if (!result) {
                        layer.msg('数据错误，无法删除!', { time: 2000 });
                        return;
                    }
                    $(that.parentNode).remove();
                    endDelete();
                    doDeleteBaziNote(id);
                },
                function (result) {
                    layer.msg('数据错误，无法删除!' + result.message, { time: 2000 });
                    console.error("[REMOVE] " + result.message);
                });
        });
    };

    //删除笔记
    var doDeleteBaziNote = function (fileId) {
        layui.dataservice.request(
            "bznote/delete",
            { "id": fileId },
            function (result) {
                if (!result) {
                    layer.msg('数据错误，无法删除!', { time: 1500 });
                    return;
                }
            },
            function (result) {
                layer.msg('数据错误，无法删除!' + result.message, { time: 1500 });
                console.error("[REMOVE] " + result.message);
            }
        );
    };

    var toNewPaipan = function () {
        homeView.navBarEventBus.paipan($("#paipanNav"))
    };

    function doOpen(fileId) {
        var data = { id: fileId };
        layui.dataservice.read(data,
            function (result) {
                var result = result;
                if (!result) {
                    layer.msg('数据错误，无法打开!', { time: 2000 });
                    return;
                }

                layui.viewmgr.loadView('view_bazi', function () {
                    var data = result.data;
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
                    baziView.setCurrentData(data);
                    baziView.doOpenBaziNote(fileId);
                });
            },
            function (result) {
                layer.msg('数据错误，无法打开! ' + result.message, { time: 2000 });
                console.error("[READ] " + result.message);
            })
    }

    function doOpenMingliQimen(fileId) {
        var data = { id: fileId };
        layui.dataservice.read(
            data,
            function (result) {
                var result = result;
                if (!result || !result.data) {
                    layer.msg('数据错误，无法打开!', { time: 2000 });
                    return;
                }
                layui.viewmgr.loadView('view_mingli_qimen', function () {
                    var data = result.data;
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
                    mingliQimenView.setCurrentData(data);
                });
            },
            function (result) {
                layer.msg('数据错误，无法打开! ' + result.message, { time: 2000 });
                console.error("[READ] " + result.message);
            })
    }

    function doOpenZiwei(fileId) {
        var data = { id: fileId };
        layui.dataservice.read(
            data,
            function (result) {
                var result = result;
                if (!result || !result.data) {
                    layer.msg('数据错误，无法打开!', { time: 2000 });
                    return;
                }
                layui.viewmgr.loadView('view_ziwei', function () {
                    var data = result.data;
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
                    ziweiView.doZiwei(yy, mm, dd, hh, mi, ss, sex, realsun, diqu, wanzishi, summertime);
                    ziweiView.setCurrentData(data);
                });
            },
            function (result) {
                layer.msg('数据错误，无法打开! ' + result.message, { time: 2000 });
                console.error("[READ] " + result.message);
            })
    }

    function filelistClickFunc(e) {
        var dom = null;
        if (!e || !e.target) return;
        if (e.target.tagName.toUpperCase() == "DIV" &&
            (e.target.className == "app-file-list-item-check" || e.target.className == "app-file-list-item-uncheck")) {
            if ($(e.target).attr("state") == "unchecked") {
                $(e.target).removeClass("app-file-list-item-uncheck");
                $(e.target).addClass("app-file-list-item-check");
                $(e.target).attr("state", "checked");
            } else {
                $(e.target).removeClass("app-file-list-item-check");
                $(e.target).addClass("app-file-list-item-uncheck");
                $(e.target).attr("state", "unchecked");
            }
            return;
        }
        if ($("#deleteOkBtn").css('display') != 'none') return;

        if (e.target.tagName.toUpperCase() == "SPAN" && e.target.className == "app-file-list-item-bzbtn") {
            dom = e.target.parentNode.parentNode;
            var fileItem = $(dom);
            var fileId = fileItem.data("id");
            doOpen(fileId);
            return;
        }

        if (e.target.tagName.toUpperCase() == "SPAN" && e.target.className == "app-file-list-item-qmbtn") {
            dom = e.target.parentNode.parentNode;
            var fileItem = $(dom);
            var fileId = fileItem.data("id");
            doOpenMingliQimen(fileId);
            return;
        }

        if (e.target.tagName.toUpperCase() == "SPAN" && e.target.className == "app-file-list-item-zwbtn") {
            dom = e.target.parentNode.parentNode;
            var fileItem = $(dom);
            var fileId = fileItem.data("id");
            doOpenZiwei(fileId);
            return;
        }

        if (e.target.tagName.toUpperCase() == "DIV" && e.target.className == "app-file-list-item") {
            dom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "app-file-list-item") {
            dom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "app-file-list-item") {
            dom = e.target.parentNode.parentNode;
        } else if (e.target.parentNode.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.parentNode.className == "app-file-list-item") {
            dom = e.target.parentNode.parentNode.parentNode;
        } else {
            return;
        }
        var fileItem = $(dom);
        var fileId = fileItem.data("id");
        doOpen(fileId);
    }

    var filelistContainerScrollHandler = function (e) {
        if (layui.viewmgr.count() > 0) {
            var curView = layui.viewmgr.currentView();
            if (curView.data("view") === "view_filelist") {//当前滚动档案列表界面
                if ($("#deleteOkBtn").is(":visible")) return;
                var clientH = $(this)[0].clientHeight;
                var scrollT = $(this)[0].scrollTop;
                var wholeH = $(this)[0].scrollHeight;
                if (clientH + scrollT + 10 >= wholeH) {
                    $("#appframe").off("scroll", filelistContainerScrollHandler);
                    filePageNum++;
                    console.log("show more");
                    doListAll($("#filesearchbox").val());
                    setTimeout(() => $("#appframe").on("scroll", filelistContainerScrollHandler), 500);
                }
            }
        }
    }
    $("#appframe").on('scroll', filelistContainerScrollHandler);

    //删除
    $("#deleteOkBtn").on("click", doDelete);
    //取消
    $("#deleteCancelBtn").on("click", endDelete);
    //新建
    $("#newBtn").on("click", toNewPaipan);
    //档案列表点击事件
    $("#filelist").on("click", filelistClickFunc);
    //档案列表搜索框输入事件
    $("#filesearchbox").on("input", filesearchInputFunc);


    function filesearchInputFunc() {
        if (filesearchTimeout) {
            clearTimeout(filesearchTimeout);
        }
        filesearchTimeout = setTimeout(function () {
            filePageNum = 0;
            doListAll($("#filesearchbox").val() || "");
        }, 500);
    }


    function doListAll(keyword) {
        var profile = layui.data('profile');
        layui.dataservice.browse(
            {
                "uid": profile && profile.loginuser ? profile.loginuser.id : "",
                "name": keyword ? keyword.trim() : "",
                "page": filePageNum,
                "size": filePageSize
            },
            function (result) {
                var showFileResult_ = function (result) {
                    if (result && result.code == "200" && result.data) {
                        if (result.data.length > 0) {
                            layui.laytpl(filelistitem_tpl).render(result.data, function (html) {
                                if (filePageNum == 0) {
                                    $("#filelist").html(html);
                                } else {
                                    $("#filelist").children().last().after(html);
                                }
                            });
                        } else {
                            if (filePageNum == 0) {
                                $("#filelist").html('<div class="app-file-list-empty">- 暂无数据 -</div>');
                            }
                        }
                    } else {
                        $("#filelist").html('<div class="app-file-list-empty">- ' + result.message + ' -</div>');
                    }
                }

                if ( !filelistitem_tpl ) {
                    $.get('templates/filelistitem_tpl.html?_=1234567890', function (template) {
                        filelistitem_tpl = template;
                        showFileResult_(result);
                    });
                } else {
                    showFileResult_(result);
                }
            },
            function (result) {
                layui.viewmgr.loadView('view_profile', function () {
                    $(".app-file-list-empty").off("click", profileView.showLogin);
                    $("#filelist").html('<div class="app-file-list-empty">- ' + result.message.replace("先登录", "<span style='color:blue;cursor:pointer'>先登录</span>") + ' -</div>');
                    $(".app-file-list-empty").on("click", profileView.showLogin);
                    console.error("[LIST] " + result.message);
                });
                
            });
    }

    function doFilelist() {
        $("#filelistNav").addClass("app-footer-tab-selected");
        $(".app-navbar-icon-files").addClass("app-navbar-icon-files-selected");
        layui.viewmgr.resetViews();
        layui.viewmgr.showView('view_filelist');
        filePageNum = 0;
        if (!$("#filesearchbox").val()) {
            doListAll();
        }
    }

    globalThis.filelistView = {
        display: doFilelist,
        doListAll: doListAll,
        resetFilePageNum: function () { filePageNum = 0; },
        beginDelete: beginDelete
    }

    
})();