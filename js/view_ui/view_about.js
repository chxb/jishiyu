/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function() {
    $.ajax({
        url: "changelogs.md",
        success: function (data) {
            document.getElementById('changelog-content').innerHTML = marked.marked(data);
        }
    });
})();