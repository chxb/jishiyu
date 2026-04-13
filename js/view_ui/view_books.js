(function(){

    // 书库
    function doBooks() {
        layui.viewmgr.loadView('view_books', function () {
            $("#booksNav").addClass("app-footer-tab-selected");
            $(".app-navbar-icon-books").addClass("app-navbar-icon-books-selected");
            layui.viewmgr.resetViews();
            layui.viewmgr.showView('view_books');

            var tabIdx = 3;
            layui.element.on('tab(bookstab)', function(data){
                var idx = data.index;
                tabIdx = idx+1;
                var iframeId = 'bookstab' + (idx + 1) + 'Frame';
                resizeIframe(iframeId);
                $("#appframe").scrollTop(0);
            });

            layui.element.tabChange('bookstab', "bookstab3");


            function resizeIframe(iframeId) {
                const iframe = document.getElementById(iframeId);
                try {
                    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframe.style.height = innerDoc.body.scrollHeight + "px";

                    var ctxWin = iframe.contentWindow;
                    if( ctxWin.location.href.indexOf("books_index.html")>-1 ){
                        document.getElementById('booksbackBtn').style.display = 'none';
                        document.getElementById('booksTabContent').style.paddingLeft = '0px';
                        document.getElementById('booksTabContent').style.paddingRight = '0px';
                        document.getElementById('booksTabContent').style.paddingBottom = '0px';
                        document.getElementById('booksTabContent').style.paddingTop = '30px';
                    }else{
                        document.getElementById('booksbackBtn').style.display = '';
                        document.getElementById('booksTabContent').style.paddingLeft = '0px';
                        document.getElementById('booksTabContent').style.paddingRight = '0px';
                        document.getElementById('booksTabContent').style.paddingBottom = '0px';
                        document.getElementById('booksTabContent').style.paddingTop = '0px';
                    }

                } catch (e) {
                    console.warn("跨域了，没法获取iframe内容高度");
                }
            }

            document.getElementById('bookstab1Frame').onload = function() { resizeIframe('bookstab1Frame'); };
            document.getElementById('bookstab2Frame').onload = function() { resizeIframe('bookstab2Frame'); };
            document.getElementById('bookstab3Frame').onload = function() { resizeIframe('bookstab3Frame'); };
            document.getElementById('bookstab4Frame').onload = function() { resizeIframe('bookstab4Frame'); };
            document.getElementById('bookstab5Frame').onload = function() { resizeIframe('bookstab5Frame'); };
            document.getElementById('bookstab6Frame').onload = function() { resizeIframe('bookstab6Frame'); };

            document.getElementById('booksbackBtn').onclick = function() {
                var frm = document.getElementById('bookstab'+tabIdx+'Frame');
                if( frm ){
                    var ctxWin = frm.contentWindow;
                    if( ctxWin ){
                        if( ctxWin.location.href.indexOf("books_index.html")>-1 ){
                            // do nothing
                        }else{
                            ctxWin.history.back();
                        }
                    }
                }
            }

        });
    }
    
    globalThis.booksView = {
        display: doBooks
    }
    
})();