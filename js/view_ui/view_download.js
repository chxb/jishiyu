/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {
    $(".copyweblinkbutton").on("click", function () {
        copy2Clipboard($(this).data("link"));
        layer.msg("链接已复制");
    });
})();