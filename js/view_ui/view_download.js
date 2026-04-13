(function() {
    $(".copyweblinkbutton").on("click", function () {
        copy2Clipboard($(this).data("link"));
        layer.msg("链接已复制");
    });
})();