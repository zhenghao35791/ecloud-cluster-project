//搜索功能开始
		 $("body").keydown(function() {
             if (event.keyCode == "13") {//keyCode=13是回车键
            	 alert("111");
                 $('.search-button').click();
             }
         });
		
        function encode(s){
            return s.replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/([\\\.\*\[\]\(\)\$\^])/g,"\\$1");
        }
        function decode(s){
            return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g,"$1").replace(/>/g,">").replace(/</g,"<").replace(/&/g,"&");
        }
        function highlight(s){
            if (s.length==0){
                alert('搜索关键词未填写！');
                return false;
            }
            s=encode(s);
            var obj=document.getElementsByTagName("body")[0];
            var t=obj.innerHTML.replace(/<span\s+class=.?highlight.?>([^<>]*)<\/span>/gi,"$1");
            obj.innerHTML=t;
            var cnt=loopSearch(s,obj);
            t=obj.innerHTML
            var r=/{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g
            t=t.replace(r,"<span class='highlight'>$1</span>");
            obj.innerHTML=t;
            alert("搜索到关键词"+cnt+"处")
        }
        function loopSearch(s,obj){
            var cnt=0;
            if (obj.nodeType==3){
                cnt=replace(s,obj);
                return cnt;
            }
            for (var i=0,c;c=obj.childNodes[i];i++){
                if (!c.className||c.className!="highlight")
                    cnt+=loopSearch(s,c);
            }
            return cnt;
        }
        function replace(s,dest){
            var r=new RegExp(s,"g");
            var tm=null;
            var t=dest.nodeValue;
            var cnt=0;
            if (tm=t.match(r)){
                cnt=tm.length;
                t=t.replace(r,"{searchHL}"+decode(s)+"{/searchHL}")
                dest.nodeValue=t;
            }
            return cnt;
        }

        //第二部分搜索代码
        function doZoom(size){
            document.getElementById('zoom').style.fontSize=size+'px'
        }

        var DOM = (document.getElementById) ? 1 : 0;
        var NS4 = (document.layers) ? 1 : 0;
        var IE4 = 0;
        if (document.all)
        {
            IE4 = 1;
            DOM = 0;
        }
        var win = window;
        var n   = 0;
        function findIt() {
            if (document.getElementById("searchstr").value != "")
                findInPage(document.getElementById("searchstr").value);
        }

        function findInPage(str) {
            var txt, i, found;
            if (str == "")
                return false;
            if (DOM)
            {
                win.find(str, false, true);
                return true;
            }
            if (NS4) {
                if (!win.find(str))
                    while(win.find(str, false, true))
                        n++;
                else
                    n++;
                if (n == 0)
                    alert("未找到指定内容.");
            }
            if (IE4) {
                txt = win.document.body.createTextRange();
                for (i = 0; i <= n && (found = txt.findText(str)) != false; i++) {
                    txt.moveStart("character", 1);
                    txt.moveEnd("textedit");
                }
                if (found) {
                    txt.moveStart("character", -1);
                    txt.findText(str);
                    txt.select();
                    txt.scrollIntoView();
                    n++;
                }
                else {
                    if (n > 0) {
                        n = 0;
                        findInPage(str);
                    }
                    else
                        alert("未找到指定内容.");
                }
            }
            return false;
        }//第二部分搜索代码结束