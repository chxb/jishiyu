/*
 * 吉时雨 (JiShiYu)
 * Copyright (C) 2026 xianbo.chen@gmail.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the LICENSE file for more details.
 *
 * If you use this software to provide network services (e.g. SaaS, API),
 * you must make your source code available to users.
 *
 * Commercial licensing is available:
 * 📧 xianbo.chen@gmail.com
 */

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

/**
 * 页面手势缩放（不依赖 viewport / CSS zoom）
 * 双指捏合 / Ctrl|Cmd + 滚轮，比例限制在 [1, 3]
 * 对 #appframe 使用 transform；比例回到 1 时移除 transform，避免影响 layer.tips
 */
(function initPageZoom() {
    var MIN_SCALE = 1;
    var MAX_SCALE = 3;
    var scale = 1;
    var tx = 0;
    var ty = 0;
    var frame = null;
    var pinchStartDist = 0;
    var pinchStartScale = 1;
    var pinchStartTx = 0;
    var pinchStartTy = 0;
    var pinchCenterX = 0;
    var pinchCenterY = 0;
    var panStartX = 0;
    var panStartY = 0;
    var panStartTx = 0;
    var panStartTy = 0;
    var isPinching = false;
    var isPanning = false;

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function applyTransform() {
        if (!frame) return;
        if (scale <= 1.02) {
            scale = MIN_SCALE;
            tx = 0;
            ty = 0;
            frame.style.transform = '';
            frame.classList.remove('is-zooming');
            return;
        }
        constrainTranslate();
        frame.classList.add('is-zooming');
        frame.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + scale + ')';
        $('.jishiyu-follow-tip').remove();
        if (window.layer) layer.closeAll('tips');
    }

    function constrainTranslate() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        tx = clamp(tx, vw - vw * scale, 0);
        ty = clamp(ty, vh - vh * scale, 0);
    }

    function setScaleAround(nextScale, cx, cy) {
        nextScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
        if (nextScale === scale) return;
        var ratio = nextScale / scale;
        tx = cx - (cx - tx) * ratio;
        ty = cy - (cy - ty) * ratio;
        scale = nextScale;
        applyTransform();
    }

    function touchDistance(t0, t1) {
        var dx = t0.clientX - t1.clientX;
        var dy = t0.clientY - t1.clientY;
        return Math.hypot(dx, dy);
    }

    function touchCenter(t0, t1) {
        return {
            x: (t0.clientX + t1.clientX) / 2,
            y: (t0.clientY + t1.clientY) / 2
        };
    }

    function onTouchStart(e) {
        if (e.touches.length === 2) {
            isPinching = true;
            isPanning = false;
            var t0 = e.touches[0];
            var t1 = e.touches[1];
            pinchStartDist = touchDistance(t0, t1) || 1;
            pinchStartScale = scale;
            pinchStartTx = tx;
            pinchStartTy = ty;
            var center = touchCenter(t0, t1);
            pinchCenterX = center.x;
            pinchCenterY = center.y;
            e.preventDefault();
            return;
        }
        if (e.touches.length === 1 && scale > MIN_SCALE) {
            isPanning = true;
            isPinching = false;
            panStartX = e.touches[0].clientX;
            panStartY = e.touches[0].clientY;
            panStartTx = tx;
            panStartTy = ty;
        }
    }

    function onTouchMove(e) {
        if (isPinching && e.touches.length === 2) {
            var dist = touchDistance(e.touches[0], e.touches[1]) || 1;
            var nextScale = clamp(pinchStartScale * (dist / pinchStartDist), MIN_SCALE, MAX_SCALE);
            var ratio = nextScale / pinchStartScale;
            scale = nextScale;
            tx = pinchCenterX - (pinchCenterX - pinchStartTx) * ratio;
            ty = pinchCenterY - (pinchCenterY - pinchStartTy) * ratio;
            applyTransform();
            e.preventDefault();
            return;
        }
        if (isPanning && e.touches.length === 1 && scale > MIN_SCALE) {
            tx = panStartTx + (e.touches[0].clientX - panStartX);
            ty = panStartTy + (e.touches[0].clientY - panStartY);
            applyTransform();
            e.preventDefault();
        }
    }

    function onTouchEnd(e) {
        if (e.touches.length < 2) {
            isPinching = false;
        }
        if (e.touches.length === 0) {
            isPanning = false;
            applyTransform();
        } else if (e.touches.length === 1 && scale > MIN_SCALE) {
            isPanning = true;
            panStartX = e.touches[0].clientX;
            panStartY = e.touches[0].clientY;
            panStartTx = tx;
            panStartTy = ty;
        }
    }

    function onWheel(e) {
        if (!(e.ctrlKey || e.metaKey)) return;
        e.preventDefault();
        setScaleAround(scale * Math.exp(-e.deltaY * 0.002), e.clientX, e.clientY);
    }

    function bind() {
        frame = document.getElementById('appframe');
        if (!frame) return;
        document.addEventListener('touchstart', onTouchStart, { passive: false });
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd, { passive: false });
        document.addEventListener('touchcancel', onTouchEnd, { passive: false });
        document.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('resize', applyTransform);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();
