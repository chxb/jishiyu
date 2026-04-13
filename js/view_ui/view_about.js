(function() {
    $.ajax({
        url: "changelogs.md",
        success: function (data) {
            document.getElementById('changelog-content').innerHTML = marked.marked(data);
        }
    });
})();