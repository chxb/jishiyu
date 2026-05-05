/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {
    

    function formEvent(){
        var data = form.val("bazi.perferenceform");
        var zhaowanzishi = data["zhaowanzishi"];
        var realsuntime = data["realsuntime"];
        var ganzhiyinyang = data["ganzhiyinyang"];
        var showshensha = data["showshensha"];
        var showallliunian = data["showallliunian"];
        var show12shen = data["show12shen"];
        var dayunliunianstyle = data["dayunliunianstyle"];
        var bztab = data["bztab"];

        var data = form.val("qimen.perferenceform");
        var show12zhangshen = data["show12zhangshen"];
        var showtianmendihu = data["showtianmendihu"];

        layui.data('profile', {
            key: 'zhaowanzishi',
            value: zhaowanzishi=="true"
        });
        layui.data('profile', {
            key: 'realsuntime',
            value: realsuntime=="true"
        });
        layui.data('profile', {
            key: 'ganzhiyinyang',
            value: ganzhiyinyang=="true"
        });
        layui.data('profile', {
            key: 'showshensha',
            value: showshensha=="true"
        });
        layui.data('profile', {
            key: 'show12shen',
            value: show12shen=="true"
        });
        layui.data('profile', {
            key: 'showallliunian',
            value: showallliunian=="true"
        });
        layui.data('profile', {
            key: 'dayunliunianstyle',
            value: dayunliunianstyle
        })
        layui.data('profile', {
            key: 'bztab',
            value: bztab
        })
        layui.data('profile', {
            key: 'show12zhangshen',
            value: show12zhangshen
        });
        layui.data('profile', {
            key: 'showtianmendihu',
            value: showtianmendihu
        });
        
    }

    var form = layui.form;
    form.on('switch(perferenceform)', formEvent);
    form.on('radio(perferenceform)', formEvent);


    function doDisplay() {
        layui.viewmgr.showView('view_perference');

        var profile = layui.data('profile');
        if (!profile ) return;
        
        var zhaowanzishi = profile["zhaowanzishi"];
        var realsuntime = profile["realsuntime"];
        var ganzhiyinyang = profile["ganzhiyinyang"];
        var showshensha = profile["showshensha"];
        var showallliunian = profile["showallliunian"];
        var show12shen = profile["show12shen"];
        var dayunliunianstyle = profile["dayunliunianstyle"];
        var bztab = profile["bztab"];

        var show12zhangshen = profile["show12zhangshen"];
        var showtianmendihu = profile["showtianmendihu"];

        if (showshensha == undefined) {
            showshensha = true;
        }
        if (show12shen == undefined) {
            show12shen = false;
        }
        if (ganzhiyinyang == undefined) {
            ganzhiyinyang = true;
        }
        if (showallliunian == undefined) {
            showallliunian = false;
        }

        form.val("bazi.perferenceform", {
            "zhaowanzishi": zhaowanzishi||false,
        });
        form.val("bazi.perferenceform", {
            "realsuntime": realsuntime||false,
        });
        form.val("bazi.perferenceform", {
            "ganzhiyinyang": ganzhiyinyang,
        });
        form.val("bazi.perferenceform", {
            "showshensha": showshensha,
        });
        form.val("bazi.perferenceform", {
            "showallliunian": showallliunian || false,
        });
        form.val("bazi.perferenceform", {
            "show12shen": show12shen || false,
        });
        form.val("bazi.perferenceform", {
            "dayunliunianstyle": dayunliunianstyle||4
        });
        form.val("bazi.perferenceform", {
            "bztab": bztab||2
        });
        form.val("qimen.perferenceform", {
            "show12zhangshen": show12zhangshen||false,
        });
        form.val("qimen.perferenceform", {
            "showtianmendihu": showtianmendihu||false,
        });


        form.render();

    }

    globalThis.perferenceView = {
        display: doDisplay
    };

})();