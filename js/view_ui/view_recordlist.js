(function(){

    var filePageNum = 0;
    var filePageSize = 50;
    var recordsearchTimeout = null;

    var recordlistitem_tpl = null;

    var recordHandler = {
        type: 0,
        openListener: null
    };

    function recordsearchInputFunc(e) {
        if (recordsearchTimeout) {
            clearTimeout(recordsearchTimeout);
        }
        recordsearchTimeout = setTimeout(function () {
            filePageNum = 0;
            doRecordList($("#recordsearchbox").val() || "");
        }, 500);

    }

    //排盘记录列表点击事件
    function recordlistClickFunc(e) {
        var dom = null;//点击的dom元素
        if (!e || !e.target) return;
        if (e.target.tagName.toUpperCase() == "DIV" &&
            (e.target.className == "record-list-item-check" || e.target.className == "record-list-item-uncheck")) {
            if ($(e.target).attr("state") == "unchecked") {
                $(e.target).removeClass("record-list-item-uncheck");
                $(e.target).addClass("record-list-item-check");
                $(e.target).attr("state", "checked");
            } else {
                $(e.target).removeClass("record-list-item-check");
                $(e.target).addClass("record-list-item-uncheck");
                $(e.target).attr("state", "unchecked");
            }
            return;
        }
        if ($("#deleteRecordOkBtn").css('display') != 'none') return;

        if (e.target.tagName.toUpperCase() == "DIV" && e.target.className == "record-list-item") {
            dom = e.target;
        } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className == "record-list-item") {
            dom = e.target.parentNode;
        } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className == "record-list-item") {
            dom = e.target.parentNode.parentNode;
        } else if (e.target.parentNode.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.parentNode.className == "record-list-item") {
            dom = e.target.parentNode.parentNode.parentNode;
        } else {
            return;
        }
        var fileItem = $(dom);
        var fileId = fileItem.data("id");
        openRecordFunc(fileId);
    }

    var beginDeleteRecord = function () {
        $(".record-list-item-uncheck").css("visibility", "visible");
        $("#deleteRecordOkBtn").show();
        $("#deleteRecordCancelBtn").show();
    };
    var endDeleteRecordFunc = function () {
        $(".record-list-item-check").addClass("record-list-item-uncheck");
        $(".record-list-item-uncheck").removeClass("record-list-item-check");
        $(".record-list-item-uncheck").attr("state", "unchecked");
        $(".record-list-item-uncheck").css("visibility", "hidden");
        $("#deleteRecordOkBtn").hide();
        $("#deleteRecordCancelBtn").hide();
    };
    var doDeleteRecordFunc = function () {
        $(".record-list-item-check").each(function () {
            var that = this;
            var id = $(that.parentNode).data("id");
            layui.dataservice.request(
                "record/delete",
                { "id": id },
                function (result) {
                    if (!result) {
                        layer.msg('数据错误，无法删除!', { time: 2000 });
                        return;
                    }
                    $(that.parentNode).remove();
                    endDeleteRecordFunc();
                },
                function (result) {
                    layer.msg('数据错误，无法删除!' + result.message, { time: 2000 });
                    console.error("[REMOVE] " + result.message);
                });
        });
    };

    //显示记录列表
    function doRecordList(keyword) {
        profile = layui.data('profile');
        layui.dataservice.request(
            "record/select",
            {
                "uid": profile && profile.loginuser ? profile.loginuser.id : "",
                "name": keyword || "",
                "type": recordHandler.type,
                "page": filePageNum,
                "size": filePageSize
            },
            function (result) {
                var showRecordListResult_ = function (result) {
                    if (result && result.code == "200" && result.data) {
                        if (result.data.length > 0) {
                            layui.laytpl(recordlistitem_tpl).render(result.data, function (html) {
                                if (filePageNum == 0) {
                                    $("#recordlist").html(html);
                                } else {
                                    $("#recordlist").children().last().after(html);
                                }
                            });
                        } else {
                            if (filePageNum == 0) {
                                $("#recordlist").html('<div class="app-file-list-empty">- 暂无数据 -</div>');
                            }
                        }
                    } else {
                        $("#recordlist").html('<div class="app-file-list-empty">- ' + result.message + ' -</div>');
                    }
                }
                
                if (!recordlistitem_tpl) {
                    $.get('templates/recordlistitem_tpl.html?_=1234567890', function (template) {
                        recordlistitem_tpl = template;
                        showRecordListResult_(result);
                    });
                } else {
                    showRecordListResult_(result);
                }
            },
            function (result) {
                layui.viewmgr.loadView('view_profile', function () {
                    $("#app-record-list-empty").off("click", profileView.showLogin);
                    $("#recordlist").html('<div id="app-record-list-empty" class="app-file-list-empty">- ' + result.message.replace("先登录", "<span style='color:blue;cursor:pointer'>先登录</span>") + ' -</div>');
                    $("#app-record-list-empty").on("click", profileView.showLogin);
                    console.error("[LIST] " + result.message);
                });
            });
    }

    var openRecordFunc = function (recordId) {
        var data = { id: recordId };
        layui.dataservice.request(
            "record/get",
            data,
            function (result) {
                var result = result;
                if (!result || !result.data || !result.data.content) {
                    layer.msg('数据错误，无法打开!', { time: 2000 });
                    return;
                }
                if( recordHandler.openListener ){//回调open事件
                    recordHandler.openListener(result.data);
                }
                layui.viewmgr.popView();//把列表界面弹出栈
                layui.viewmgr.popView();
            },
            function (result) {
                layer.msg('数据错误，无法打开! ' + result.message, { time: 2000 });
                console.error("[READ] " + result.message);
            })

    }

    //滚动加载更多记录
    var recordListContainerScrollHandler = function (e) {
        if (layui.viewmgr.count() > 0) {
            var curView = layui.viewmgr.currentView();
            if (curView.data("view") === "view_recordlist") {//当前滚动记录列表界面
                if ($("#deleteRecordOkBtn").is(":visible")) return;
                var clientH = $(this)[0].clientHeight;
                var scrollT = $(this)[0].scrollTop;
                var wholeH = $(this)[0].scrollHeight;
                if (clientH + scrollT + 10 >= wholeH) {
                    $("#appframe").off("scroll", recordListContainerScrollHandler);
                    filePageNum++;
                    console.log("show more.");
                    doRecordList($("#recordsearchbox").val());
                    setTimeout(() => $("#appframe").on("scroll", recordListContainerScrollHandler), 500);
                }
            }
        }
    }
    $("#appframe").on('scroll', recordListContainerScrollHandler);

    recordsearchTimeout = null;
    $("#recordsearchbox").on("input", recordsearchInputFunc);
    $("#recordlist").on("click", recordlistClickFunc);

    //删除
    $("#deleteRecordOkBtn").on("click", doDeleteRecordFunc);
    //取消
    $("#deleteRecordCancelBtn").on("click", endDeleteRecordFunc);

    //设置record处理函数
    var setRecordHandler = function (handler) {
        recordHandler = handler;
    }


    globalThis.recordListView = {
        display: doRecordList,
        beginDeleteRecord: beginDeleteRecord,
        doListAll: doRecordList,
        resetFilePageNum: function () { filePageNum = 0; },
        setRecordHandler: setRecordHandler,
    }
    

})();