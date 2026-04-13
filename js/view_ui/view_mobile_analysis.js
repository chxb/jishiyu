(function() {

    var mobileData = null;
    var form = layui.form;

    function beginAnalysisMobile(){
        var layerIdx = layer.open({
            type: 1,
            title: "手机号吉凶分析",
            closeBtn: 1,
            shadeClose: true,
            anim: 2,
            area: ["var(--max-page-width)", "360px"],
            isOutAnim: false,
            offset: 'b',
            skin: 'popup-mobile-box',
            shade: [0.01, '#000'],
            zIndex: 980,
            content: `
                <form id="sjform" class="layui-form app-form" lay-filter="sjform" action="">
                        <div class="layui-form-item">
                            <label class="layui-form-label">手机号码</label>
                            <div class="layui-input-block">
                                <input type="text" style="font-size: 30px; letter-spacing: 5px;" class="layui-input" name="phoneno"
                                    id="phoneno" lay-verify="required" lay-verType="tips" />
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">性别</label>
                            <div class="layui-input-block">
                                <input type="radio" name="sex" value="M" title="男" checked>
                                <input type="radio" name="sex" value="F" title="女">
                            </div>
                        </div>
                    </form>

                    <div>
                        <center>
                            <button id="sjfxBtn" type="button" class="app-paipan-button" style="width: 205px">开始分析</button>
                        </center>
                    </div>            
            `});
        
        form.render();
        $("#sjfxBtn").on("click", function () {
            var sex = form.val("sjform").sex === "M";
            var mobile = form.val("sjform").phoneno;

            if (mobile && /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(mobile)) {
                layui.viewmgr.loadView("view_mobile_analysis", function () {
                    doAnalysisMobile(mobile, sex);

                    layer.close(layerIdx);
                })
            } else {
                layer.msg('请输入合法的手机号!', { time: 1500 });
                return;
            }
            
        })

    }

    /**
     * 手机号吉凶分析
     * @param {*} sex 性别，男为true，女为false
     * @param {*} mobile 手机号
     */
    function doAnalysisMobile(mobile, sex) {
        mobileData = {mobile:mobile, sex:sex?"M":"F"};
        layui.use('sj', function () {
            layui.viewmgr.showView('view_mobile_analysis');
            $("#sj_title").html((sex ? "♂" : "♀") + "手机号");
            $("#sj_number").html(mobile);
            var sjData = layui.sj.analysis(mobile, sex);
            for (var g = 0; g < sjData.groups.length; g++) {
                $("div[gp='" + g + "']").html(sjData.groups[g]);
            }
            for (var g = 0; g < sjData.groups.length; g++) {
                if (sjData.groups_shen[g]) {
                    $("div[gpsh='" + g + "']").html(sjData.groups_shen[g]);
                    $("div[gpsh='" + g + "']").attr("class", "sj_subgroup_shen_" + sjData.groups_shen_jx[g]);
                } else {
                    $("div[gpsh='" + g + "']").html("空无");
                    $("div[gpsh='" + g + "']").attr("class", "sj_subgroup_shen_ko");
                }
            }

            var results = "";
            for (var r = 0; r < sjData.results.length; r++) {
                results += "<div><span class='sj-result-label-" + sjData.results_jx[r] + "'>" + sjData.results_shen[r] + " <span style='font-size:12px'>x " + sjData.groups_shen_cnt[sjData.results_shen[r]] + "</span></span>" + "&nbsp;&nbsp;<span style='color: #999'>" + sjData.results_shen_type[r] + "</span></div>";
                for (var i = 0; i < sjData.results[r].length; i++) {
                    results += "<div class='sj_result_item'><span class='sj_result_item_" + sjData.results_jx[r] + "'> ● </span><span class='sj_result_item_text'>" + sjData.results[r][i] + "</span></div>";
                }
            }

            if (sjData.results0.length > 0 || sjData.results1.length > 0 || sjData.results2.length > 0) {
                results += "<div><span class='sj-result-label-ko'>空无</span></div>";
                for (var r = 0; r < sjData.results0.length; r++) {
                    results += "<div class='sj_result_item'><span class='sj_result_item_ko'> ● </span><span class='sj_result_item_text'>" + sjData.results0[r] + "</span></div>";
                }
                if (sjData.results1.length > 0)
                    results += "<div class='sj_result_item'><span class='sj_result_item_ko'> ● </span><span class='sj_result_item_text'>" + sjData.results1[0] + "</span></div>";
                if (sjData.results2.length > 0)
                    results += "<div class='sj_result_item'><span class='sj_result_item_ko'> ● </span><span class='sj_result_item_text'>" + sjData.results2[0] + "</span></div>";

            }

            $("#sj_result").html(results);
        });
    }

    globalThis.mobileAnalysisView = {
        display: beginAnalysisMobile,
        doAnalysisMobile: doAnalysisMobile,
        getMobileData: function () { return mobileData; },
    }
    


})();