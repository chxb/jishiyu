/**
 * 奇门帮助弹框
 */
layui.define(["qimen_info","qimen_jibing"], function (exports) {


    var _8SHEN = {"符":"值符","蛇":"腾蛇","阴":"太阴“","六":"六合","白":"白虎","玄":"玄武", "地":"九地","天":"九天"};

    var helper = {
        _initUI: function(){
            var domContent ="<div class='qimen-help-panel fadeIn2'>" +
                "<header><div></div><b>宫位象意</b>" +
                "<div class='qimen-help-close'></div>" +
                "</header>" +
                "<section class='qimen-help-content'>" +
                "<div class='qimen-help-index-bar'></div>" +
                "<div class='qimen-help-wrapper'></div" +
                "</section>" +
            "</div>";
            var box = document.createElement("div");
            box.className = 'qimen-help-container';
            box.innerHTML = domContent;
            document.body.appendChild(box);
        },
        _tap: function(el, fn){
            el.on('click', function (e) {
                fn.call(this, e);
            });
        },
        event: function event() {
            var _this = this;
            var close = $('.qimen-help-close');
            _this._tap(close, function () {
                _this.hide();
            });
        },
        show: function(gongData){
            if( $(".qimen-help-container").length==0 ){
                this._initUI();
                this.event();
            }
            var el = $('.qimen-help-panel');
            el.removeClass("fadeOut2");
            el.addClass('fadeIn2');
            $(".qimen-help-container").show();
            $(".qimen-gap").show();
            $(".qimen-9gong-grid-cell[gong]").removeClass("cellActive");
            $(".qimen-9gong-grid-cell[gong='"+gongData.gong+"']").addClass("cellActive");
            gongData && this.showHelper(gongData);
        },
        showHelper: function(gongData){
            var that = this;
            var gong = gongData.gong;
            var shen = gongData.bashen;
            var tian = gongData.tianpan;
            var tianJi = gongData.tianpanJi;
            var di = gongData.dipan;
            var diJi = gongData.dipanJi;
            var xing = gongData.jiuxing;
            var men = gongData.men;
            var yingan = gongData.yingan;
            var yinganJi = gongData.yinganJi;
            var gans = [];
            gans.push(tian);
            if( tianJi&&gans.indexOf(tianJi)==-1 ){
                gans.push(tianJi);
            }
            if( gans.indexOf(di)==-1 ){
                gans.push(di);
            }
            if( diJi&&gans.indexOf(diJi)==-1 ){
                gans.push(diJi);
            }
            if( yingan&&gans.indexOf(yingan)==-1){
                gans.push(yingan);
            }
            if( yinganJi&&gans.indexOf(yinganJi)==-1){
                gans.push(yinganJi);
            }
            var html = "<span class='qimen-help-index'>"+gong+"</span>";//宫
            html += "<span class='qimen-help-index'>"+shen+"</span>";//神
            html += "<span class='qimen-help-index'>"+xing+"</span>";//星
            html += "<span class='qimen-help-index'>"+men+"</span>";//门
            gans.forEach(function(gan){//干
                html += "<span class='qimen-help-index'>"+gan+"</span>";
            });
            html += "<span class='qimen-help-index' style='background-color:#dba900'>疾病</span>";
            if( globalThis.qimen12zhangshengVis ){
                html += "<span class='qimen-help-index' style='background-color:#05b07a'>长生</span>";
            }

            $(".qimen-help-index-bar").html(html);

            var QIMEN_INFO = layui.qimen_info.qimen_info();
            var BA_SHEN_INFO = layui.qimen_info.bashen_info();
            var infos = "";
            var gongInfo = QIMEN_INFO["八卦"][gong];
            infos += "<p><span class='qimen-help-index' label='"+gong+"'>"+gong+"宫</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(gongInfo,"qimen-help-item-label")+"</span></p>";
            
            var gj = tian+"+"+di;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-index'>格局</span></p><p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            var gj = tianJi+"+"+di;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            var gj = tian+"+"+diJi;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            var gj = tianJi+"+"+diJi;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            
            var shenInfo = QIMEN_INFO["八神"][BA_SHEN_INFO[shen]];
            infos += "<p><span class='qimen-help-index' label='"+shen+"'>"+BA_SHEN_INFO[shen]+"</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(shenInfo,"qimen-help-item-label")+"</span></p>";
            var xingInfo = QIMEN_INFO["九星"]["天"+xing];
            infos += "<p><span class='qimen-help-index' label='"+xing+"'>"+"天"+xing+"</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(xingInfo,"qimen-help-item-label")+"</span></p>";
            var menInfo = QIMEN_INFO["八门"][men+"门"];
            infos += "<p><span class='qimen-help-index' label='"+men+"'>"+men+"门"+"</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(menInfo,"qimen-help-item-label")+"</span></p>";
            gans.forEach(function(gan){
                var ganInfo = QIMEN_INFO["天干"][gan];
                infos += "<p><span class='qimen-help-index' label='"+gan+"'>"+gan+"</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(ganInfo,"qimen-help-item-label")+"</span></p>";
            });

            var gj = tian+"+"+di;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-index'>格局</span></p><p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            var gj = tianJi+"+"+di;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            var gj = tian+"+"+diJi;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }
            var gj = tianJi+"+"+diJi;
            var gjInfo = QIMEN_INFO["格局"][gj];
            if( gjInfo ){
                infos += "<p><span class='qimen-help-item-text'><p><span class='qimen-help-item-label'>"+gj+"：</span><span class='qimen-help-item-text'>"+gjInfo+"</span></p></span></p>";
            }

            infos += this._jibingInfo(gongData, gans);//疾病
            if( globalThis.qimen12zhangshengVis ){
                infos += this._zhangshengInfo();//12长生
            }

            $(".qimen-help-wrapper").html(infos);
            $(".qimen-help-wrapper").scrollTop(0);
            $(".qimen-help-index").off("click");
            $(".qimen-help-index").on("click", function(){
                var label = $(this).text();
                $(".qimen-help-index[label='"+label+"']").get(0).scrollIntoView({
                    behavior: "smooth",  // 平滑过渡
                    block:    "start"    // 上边框与视窗顶部平齐
                });
            });
        },
        _helpInfo: function(infos, style){
            var html = "";
            for( var info in infos ){
                html += "<p><span class='"+style+"'>"+info+"：</span><span class='qimen-help-item-text'>"+infos[info]+"</span></p>";
            };
            return html;
        },
        _jibingInfo: function(gongData, gans){
            var that = this;
            var HELP_QIMEN_JIBING = layui.qimen_jibing.qimen_jibin_info();
            var gongInfo = HELP_QIMEN_JIBING["八卦"][gongData.gong];
            var jibingInfo = "<p><span class='qimen-help-index qimen-help-index-jb' label='疾病'>疾病</span></p>";
            gans.forEach(function(gan){
                jibingInfo += "<p><span class='qimen-help-index-jb' label='"+gan+"'>"+gan+"</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(gongInfo[gan],'qimen-help-item-label-jb')+"</span></p>";
            });
            var bashen = gongData.bashen;
            jibingInfo += "<p><span class='qimen-help-index-jb'>"+_8SHEN[bashen]+"</span></p><p><span class='qimen-help-item-text'>"+HELP_QIMEN_JIBING["八神"][_8SHEN[bashen]]+"</span></p>";
            var jiuxing = "天"+gongData.jiuxing;
            jibingInfo += "<p><span class='qimen-help-index-jb'>"+jiuxing+"</span></p><p><span class='qimen-help-item-text'>"+HELP_QIMEN_JIBING["九星"][jiuxing]+"</span></p>";
            var bamen = gongData.men+"门";
            jibingInfo += "<p><span class='qimen-help-index-jb'>"+bamen+"</span></p><p><span class='qimen-help-item-text'>"+HELP_QIMEN_JIBING["八门"][bamen]+"</span></p>";
            var label = "疾病参考";
            var jbInfo = HELP_QIMEN_JIBING[label];
            jibingInfo += "<p><span class='qimen-help-index-jb' label='"+label+"'>"+label+"</span></p><p><span class='qimen-help-item-text'>"+that._helpInfo(jbInfo,'qimen-help-item-label-jb')+"</span></p>";
            return jibingInfo;
        },
        _zhangshengInfo: function(){
            var ZHANGSHENG12_INFO = layui.qimen_info.zhangsheng12_info();
            var zhangshengInfo = "<p><span class='qimen-help-index qimen-help-index-zs' label='长生'>十二长生</span></p>";
            Object.keys(ZHANGSHENG12_INFO).forEach(function(zs){
                zhangshengInfo += "<p><span class='qimen-help-index-zs' label='"+zs+"'>"+zs+"</span></p><p><span class='qimen-help-item-text'>"+ZHANGSHENG12_INFO[zs]+"</span></p>";
            });
            return zhangshengInfo;
        },
        hide: function(){
            var el = $('.qimen-help-panel');
            el.removeClass("fadeIn2");
            el.addClass('fadeOut2');
            setTimeout(function () {
                $(".qimen-help-mask").hide();
                $(".qimen-help-container").hide();
            }, 300);
            $(".qimen-gap").hide();
            $(".qimen-9gong-grid-cell[gong]").removeClass("cellActive");
        }
    }

    exports('qimenhelper', helper);


})