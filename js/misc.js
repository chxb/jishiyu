
function isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
    } else {
        return false; // PC端
    }
}
if( isMobile() ){
    document.body.style.setProperty('--max-page-width', '100%');
}


function supportsCSSFeature(feature) {
    try {
        document.createElement('div').style[feature] = 'initial';
        return true;
    } catch (e) {
        return false;
    }
}

//屏蔽键盘事件
document.onkeydown = function () {
    var e = window.event || arguments[0];
    //F12
    if (e.keyCode == 123) {
        return false;
        //Ctrl+Shift+I
    } else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
        return false;
        //Cmd+Option+I
    } else if ((e.metaKey) && (e.altKey) && (e.keyCode == 73)) {
        return false; //DEBUG
        //Shift+F10
    } else if ((e.shiftKey) && (e.keyCode == 121)) {
        return false;
        //Ctrl+U
    } else if ((e.ctrlKey) && (e.keyCode == 85)) {
        return false;
    }
};
//屏蔽鼠标右键
document.oncontextmenu = function () {
    return false;
}

function fullscreen() {
    var ele = document.body;
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    }
}

//设置主题色
var currentTheme = layui.data('profile').theme;
if (currentTheme) {
    document.body.style.setProperty("--theme-color", currentTheme);
    var meta = document.querySelector('meta[name="theme-color"]');  
    meta.setAttribute('content', currentTheme); 
}

var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
if (issafariBrowser) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = ".yueli-day-fest {" +
        "display: block;" +
        "font-style: normal;" +
        "color: #C40000;" +
        "font-weight: normal;" +
        "line-height: 14px;" +
        "font-size: 10px;" +
        "}"
        //  +
        // ".font10px {" +
        // "display: inline-block;" +
        // "font-size: 10px;" +
        // "}"
        ;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);
}

const copy2Clipboard = (str) => {
    const copyDom = document.createElement("textarea");
    copyDom.value = str;
    document.body.appendChild(copyDom);
    return new Promise((resolve) => {
        setTimeout(() => {
        try {
            copyDom.select();
            document.execCommand("Copy");
            document.body.removeChild(copyDom);
            resolve(true);
        } catch (err) {
            resolve(false);
        }
        }, 100);
    });
};

//微信中重设字体大小
(function() {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    }
    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke("setFontSizeCallback&", { "fontSize" : 0 });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on("menu:setfont", function() {
            WeixinJSBridge.invoke("setFontSizeCallback", { "fontSize&" : 0 });
        });
    }
})();


function parseRGB(colorStr) {
    // 正则匹配 rgb(...) 或 rgba(...)
    const match = colorStr.match(
        /^rgba?\(\s*([\d.%]+)\s*[, ]\s*([\d.%]+)\s*[, ]\s*([\d.%]+)(?:\s*[,/]\s*([\d.%]+))?\s*\)$/i
    );

    if (!match) return null;

    // 解析 r, g, b（支持百分比和整数值）
    const parseValue = (val) => {
        if (val.includes('%')) {
            return Math.round(parseFloat(val) * 2.55); // 50% -> 127.5 -> 128
        }
        return parseInt(val, 10);
    };

    // 解析 alpha（默认 1）
    const parseAlpha = (val) => {
        if (!val) return 1;
        if (val.includes('%')) {
            return parseFloat(val) / 100; // 50% -> 0.5
        }
        return parseFloat(val);
    };

    const r = parseValue(match[1]);
    const g = parseValue(match[2]);
    const b = parseValue(match[3]);
    const a = parseAlpha(match[4]);

    return { r, g, b, a };
}

// 转换十六进制到RGBA
function hexToRgba(hex, alpha) {
    if( hex.indexOf('rgb') >-1 ) {
        const rgbVal = parseRGB(hex);
        return `rgba(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}, ${alpha})`;
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 检查预测事项是否符合要求
var checkItemInput = function (bindEl) {
    var reg = /^[\w\d\-\，,。\.\?？\u4e00-\u9fa5]+$/;
    var data = $(bindEl).val();
    if (data.length > 30 || !data || !reg.test(data)) {
        layer.tips('需要保存时，预测事项不能为空，至少2个字，长度不能超过30个字符，也不能包含空格字符', bindEl, {
            tips: [3, 'red'],
            time: 4000
        });
        return false;
    }
    return true;
}
