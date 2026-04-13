
layui.define(function (exports) {

    var TIME_RANGE = {
        "子": "23:00 - 00:59",
        "丑": "01:00 - 02:59",
        "寅": "03:00 - 04:59",
        "卯": "05:00 - 06:59",
        "辰": "07:00 - 08:59",
        "巳": "09:00 - 10:59",
        "午": "11:00 - 12:59",
        "未": "13:00 - 14:59",
        "申": "15:00 - 16:59",
        "酉": "17:00 - 18:59",
        "戌": "19:00 - 20:59",
        "亥": "21:00 - 22:59",
    }

    var monthlyObj = {

        init: function(){
            var that = this;
            that.month = SolarMonth.fromDate(new Date());
            that.render(that.month);
            
            $('#yueli-btn-prev').on("click", function () {
                that.month = that.month.next(-1);
                that.render(that.month);
                var year = that.month.getYear();
                var month = that.month.getMonth();
                document.getElementById("month_date").bindDate = new Date(year, month-1,1);
            });
            
            $('#yueli-btn-next').on("click", function () {
                that.month = that.month.next(1);
                that.render(that.month);
                var year = that.month.getYear();
                var month = that.month.getMonth();
                document.getElementById("month_date").bindDate = new Date(year, month-1,1);
            });
            
            $("#huangli-btn-prev").on("click", function(){
                var curDate = new Date();
                curDate.setFullYear(that.currentSolar.getYear());
                curDate.setMonth(that.currentSolar.getMonth()-1);
                curDate.setDate(that.currentSolar.getDay());
                curDate.setHours(that.currentSolar.getHour());
                curDate.setDate(curDate.getDate()-1);//减一天
                var newSolar = Solar.fromDate(curDate);
                that.huangliInfo(newSolar);
                document.getElementById("huangli-date").bindDate = curDate;
            });
            
            $("#huangli-btn-next").on("click", function(){
                var curDate = new Date();
                curDate.setFullYear(that.currentSolar.getYear());
                curDate.setMonth(that.currentSolar.getMonth()-1);
                curDate.setDate(that.currentSolar.getDay());
                curDate.setHours(that.currentSolar.getHour());
                curDate.setDate(curDate.getDate()+1);//加一天
                var newSolar = Solar.fromDate(curDate);
                that.huangliInfo(newSolar);
                document.getElementById("huangli-date").bindDate = curDate;
            });
            
            $("#yueli").on("click", function(e){
                if( !e || !e.target ) return;
                var dom = null;
                if( e.target.className.split(" ").indexOf("yueli-day")!=-1 ){
                    dom = e.target;
                }else if( e.target.parentNode.className.split(" ").indexOf("yueli-day")!=-1 ){
                    dom = e.target.parentNode;
                }else if( e.target.parentNode.parentNode.className.split(" ").indexOf("yueli-day")!=-1 ){
                    dom = e.target.parentNode.parentNode;
                }
                if( dom ){
                    if( that.last_active_day ){
                        that.last_active_day.removeClass("yueli-day-active");
                        $(that.last_active_day.children()).removeClass("yueli-day-children-active");
                    }
                    that.last_active_day = $(dom);     
                    $(dom).addClass("yueli-day-active");
                    $($(dom).children()).addClass("yueli-day-children-active");

                    var y = parseInt($(dom).attr("y"));
                    var m = parseInt($(dom).attr("m"));
                    var d = parseInt($(dom).attr("d"));
                    var solar = Solar.fromYmd(y,m,d);
                    that.dayInfo(solar);
                }
            });
            
            $(".yueli-hour").on("click", function(e){
                if( !e || !e.target ) return;
                var dom = null;
                if( e.target.className == "yueli-hour" ){
                    dom = e.target;
                }
                if( !dom ) return;
                if( that.last_active_hour ){
                    that.last_active_hour.removeClass("yueli-hour-active");
                }
                that.last_active_hour = $(dom);     
                $(dom).addClass("yueli-hour-active");

                var y = parseInt(that.last_active_day.attr("y"));
                var m = parseInt(that.last_active_day.attr("m"));
                var d = parseInt(that.last_active_day.attr("d"));
                var h = $(dom).attr("hour");
                var nowSolar = Solar.fromYmdHms(y, m, d, h, 0, 0);
                var lunar = nowSolar.getLunar();
                that.currentSolar = nowSolar;
                that.baziInfo(lunar);
            });

            this.gldateRolldate = new Rolldate({
                el: '#month_date',
                isLunar: false,
                format: 'YYYY-MM',
                beginYear: 1800,
                endYear: 2099,
                lang: {title:"月份"},
                confirm: function(date, lunar) {
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    $("#month_title").html(year+"年"+month+"月");
                    that.month = SolarMonth.fromDate(date);
                    that.render(that.month);
                },
            });
            
            $("#month_title").on("click",function(){
                that.gldateRolldate.show();
            });

            this.hldateRolldate = new Rolldate({
                el: '#huangli-date',
                isLunar: false,
                format: 'YYYY-MM-DD',
                beginYear: 1800,
                endYear: 2099,
                lang: {title:"日期"},
                confirm: function(date, lunar) {
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var nowSolar = Solar.fromYmdHms(year,month,day,date.getHours(),0,0);
                    var l = nowSolar.getLunar();
                    $(".huangli-date").html(l.getMonthInChinese()+"月"+l.getDayInChinese());
                    that.huangliInfo(nowSolar);
                },
            });
            
            $("#huangli-ymdw").on("click",function(){
                that.hldateRolldate.show();
            });
        }
        ,
        today: function(){
            var todayMonth = SolarMonth.fromDate(new Date());
            this.render(todayMonth);
        }
        ,
        jinri: function(){
            var now = new Date();
            var solar = Solar.fromDate(now);
            this.dayInfo(solar);
        }
        ,
        baziInfo: function(lunar){
            var bazi = lunar.getEightChar();
            // bazi.setSect(2);
            var bz = [];
            bz[0] = bazi.getYearGan(); bz[1] = bazi.getYearZhi(); //年柱干支
            bz[2] = bazi.getMonthGan(); bz[3] = bazi.getMonthZhi();//月柱干支
            bz[4] = bazi.getDayGan(); bz[5] = bazi.getDayZhi();  //日柱干支
            bz[6] = bazi.getTimeGan(); bz[7] = bazi.getTimeZhi(); //时柱干支
            var gzY = "年<br/><span class='"+wuxingStyle(tianganWuxing(bz[0]))+ " yueli-day-info-gz-style'>"+bz[0]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(bazi.getYearShiShenGan())+"</sup>";
            var gzY = gzY+ "<br/><span class='"+wuxingStyle(dizhiWuxing(bz[1]))+ " yueli-day-info-gz-style'>"+bz[1]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(queryShishen(dizhiCanggan(bz[1])[0], bazi.getDayGan()))+"</sup>";
            $("#yueli-day-gz-y").html(gzY);
            var gzM = "月<br/><span class='"+wuxingStyle(tianganWuxing(bz[2]))+ " yueli-day-info-gz-style'>"+bz[2]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(bazi.getMonthShiShenGan())+"</sup>";
            var gzM = gzM+ "<br/><span class='"+wuxingStyle(dizhiWuxing(bz[3]))+ " yueli-day-info-gz-style'>"+bz[3]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(queryShishen(dizhiCanggan(bz[3])[0], bazi.getDayGan()))+"</sup>";
            $("#yueli-day-gz-m").html(gzM);
            var gzD = "日<br/><span class='"+wuxingStyle(tianganWuxing(bz[4]))+ " yueli-day-info-gz-style'>"+bz[4]+"</span><sup class='yueli-day-info-gz-sh-style'>元</sup>";
            var gzD = gzD+ "<br/><span class='"+wuxingStyle(dizhiWuxing(bz[5]))+ " yueli-day-info-gz-style'>"+bz[5]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(queryShishen(dizhiCanggan(bz[5])[0], bazi.getDayGan()))+"</sup>";
            $("#yueli-day-gz-d").html(gzD);
            var gzH = "时<br/><span class='"+wuxingStyle(tianganWuxing(bz[6]))+ " yueli-day-info-gz-style'>"+bz[6]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(bazi.getTimeShiShenGan())+"</sup>";
            var gzH = gzH+ "<br/><span class='"+wuxingStyle(dizhiWuxing(bz[7]))+ " yueli-day-info-gz-style'>"+bz[7]+"</span><sup class='yueli-day-info-gz-sh-style'>"+shishenJc(queryShishen(dizhiCanggan(bz[7])[0], bazi.getDayGan()))+"</sup>";
            $("#yueli-day-gz-h").html(gzH);
        }
        ,
        huangliInfo: function(solar){
            var now = new Date();
            var hour = now.getHours();
            hour = hour%2==0?hour:hour+1;
            hour = hour==24?0:hour;
            var nowSolar = Solar.fromYmdHms(solar.getYear(), solar.getMonth(), solar.getDay(), hour, 0, 0);
            var lunar = nowSolar.getLunar();
            var bazi = lunar.getEightChar();
            this.currentSolar = nowSolar;

            var yi = lunar.getDayYi();
            if( yi&&yi.length>0 ){
                $('#huangli-day-yiji-yi-txt').html(yi.join(" • "));
            }else{
                $('#huangli-day-yiji-yi-txt').html("无");
            }
            var ji = lunar.getDayJi();
            if( ji&&ji.length>0 ){
                $('#huangli-day-yiji-ji-txt').html(ji.join(" • "));
            }else{
                $('#huangli-day-yiji-ji-txt').html("(无)");
            }

            $("#huangli-ymdw").html(nowSolar.getYear()+"年"+nowSolar.getMonth()+"月"+nowSolar.getDay()+"日 星期"+nowSolar.getWeekInChinese());
            $(".huangli-date").html(lunar.getMonthInChinese()+"月"+lunar.getDayInChinese());
            $(".huangli-bazi").html(
                bazi.getYearGan()+bazi.getYearZhi()+"年 " +
                bazi.getMonthGan()+bazi.getMonthZhi()+"月 " +
                bazi.getDayGan()+bazi.getDayZhi()+"日 " +
                bazi.getTimeGan()+bazi.getTimeZhi()+"时")

            $(".huangli-jieqi").text(lunar.getJieQi()||"");

            $("#huangli-nayin").text(lunar.getDayNaYin());
            $("#huangli-zhishen-type").text(lunar.getDayTianShenType());
            $("#huangli-zhishen").text(lunar.getDayTianShen());
            $("#huangli-12shen").text(lunar.getZhiXing()+"日");
            $("#huangli-xinshu").text(lunar.getXiu()+lunar.getZheng()+lunar.getAnimal());
            $("#huangli-caishen").text(lunar.getDayPositionCaiDesc()+ " " + lunar.getDayPositionCai());
            $("#huangli-xishen").text(lunar.getDayPositionXiDesc()+ " "+lunar.getDayPositionXi());
            $("#huangli-fushen").text(lunar.getDayPositionFuDesc()+ " " + lunar.getDayPositionFu());
            $("#huangli-yanggui").text(lunar.getDayPositionYangGuiDesc()+ " " + lunar.getDayPositionYangGui());
            
            $("#huangli-taishen").text(lunar.getDayPositionTai());
            var tmp = lunar.getDayJiShen();
            var txt = "";
            for (var i=0, j=tmp.length; i<j; i++){
                if( i>5 ) break;
                if( i>0 ) txt+=" "
                if( i==3 ) txt+= "<br/>";
                txt += tmp[i];
            }
            $("#huangli-jishen").html(txt);
            $("#huangli-congsha").text("冲"+lunar.getDayChongShengXiao()+" 煞"+lunar.getDaySha());
            var tmp = lunar.getDayXiongSha();
            var txt = "";
            for (var i=0, j=tmp.length; i<j; i++){
                if( i>5 ) break;
                if( i>0 ) txt+=" "
                if( i==3 ) txt+= "<br/>";
                txt += tmp[i];
            }
            $("#huangli-xiongshen").html(txt);
            var pzgan = lunar.getPengZuGan().split("");
            var pzzhi = lunar.getPengZuZhi().split("");
            $("#huangli-pengzhu").html(pzgan[0]+pzgan[1]+pzgan[2]+pzgan[3]+"<br/>"+
                                        pzgan[4]+pzgan[5]+pzgan[6]+pzgan[7]+"<br/>"+
                                        pzzhi[0]+pzzhi[1]+pzzhi[2]+pzzhi[3]+"<br/>"+
                                        pzzhi[4]+pzzhi[5]+pzzhi[6]+pzzhi[7]);
            for( var i=0;i<24;i+=2 ){
                var timeObj = LunarTime.fromYmdHms(lunar.getYear(), lunar.getMonth(), lunar.getDay(), i , 0,0);
                var hourItem = $(".huangli-shicheng-cell[h='"+i+"'");
                hourItem.html(timeObj.getGan()+"<br/>"+timeObj.getZhi()+"<br/>"+timeObj.getTianShenLuck()+"<br/>");
                hourItem.removeClass("huangli-shicheng-cell-current");
                if( timeObj.getZhi()==lunar.getTimeZhi() ){
                    hourItem.addClass("huangli-shicheng-cell-current");
                }
            }
            $(".huangli-shicheng-hour").html(lunar.getTimeInGanZhi()+"时 "+TIME_RANGE[bazi.getTimeZhi()]+" "+lunar.getTimeTianShenLuck());
            $(".huangli-shicheng-congsha").html("冲"+lunar.getTimeChongShengXiao()+" 煞"+lunar.getTimeSha()+"&nbsp;&nbsp;&nbsp;&nbsp;"+
                "财神"+lunar.getTimePositionCaiDesc() + " "+
                "喜神"+lunar.getTimePositionXiDesc() + " "+
                "福神"+lunar.getTimePositionFuDesc() + " "+
                "阳贵"+lunar.getTimePositionYangGuiDesc()
            );
            $(".huangli-shicheng-yi").html(lunar.getTimeYi().join(" "));
            $(".huangli-shicheng-ji").html(lunar.getTimeJi().join(" "));

        }
        ,
        dayInfo: function(solar){
            var now = new Date();
            var hour = now.getHours();
            hour = hour%2==0?hour:hour+1;
            hour = hour==24?0:hour;
            var nowSolar = Solar.fromYmdHms(solar.getYear(), solar.getMonth(), solar.getDay(), hour, 0, 0);
            var lunar = nowSolar.getLunar();
            this.currentSolar = nowSolar;
            var fest = null;
            if(lunar.getFestivals().length>0){
                fest = lunar.getFestivals()[0];
            }else if( nowSolar.getFestivals().length>0 ){
                fest = nowSolar.getFestivals()[0];
            }else{
                fest = "-";
            }
            if( !!lunar.getJieQi() ){
                fest = lunar.getJieQi();
            }

            this.huangliInfo(solar);

            $("#yueli-day-info-ymd-gl").html(nowSolar.getYear()+"年"+nowSolar.getMonth()+"月"+nowSolar.getDay()+"日 星期"+nowSolar.getWeekInChinese());
            $("#yueli-day-info-ymd-nl").html(lunar.getMonthInChinese()+"月"+lunar.getDayInChinese());
            $("#yueli-day-info-ymd-fest").html(fest)
            
            if( this.last_active_hour ){
                this.last_active_hour.removeClass("yueli-hour-active");
            }
            this.last_active_hour = $(".yueli-hour[hour="+hour+"]");
            this.last_active_hour.addClass("yueli-hour-active");
            
            this.baziInfo(lunar);

            var yi = lunar.getDayYi();
            if( yi&&yi.length>0 ){
                $('#yueli-day-yiji-yi-txt').html(yi.join(" • "));
            }else{
                $('#yueli-day-yiji-yi-txt').html("无");
            }
            var ji = lunar.getDayJi();
            if( ji&&ji.length>0 ){
                $('#yueli-day-yiji-ji-txt').html(ji.join(" • "));
            }else{
                $('#yueli-day-yiji-ji-txt').html("(无)");
            }
            var f = "";
            var fests = [];
            fests = lunar.getJieQi();
            if( fests ) {
                f += "<div class='yueli-day-fest-item' title='"+fests+"'>"+"<span class='yueli-day-fest-item-holiday'> ● "+"</span>"+fests+"</div>";
            };
            fests = lunar.getFestivals();
            fests&&fests.forEach(function(e){
                f += "<div class='yueli-day-fest-item' title='"+e+"'>"+"<span class='yueli-day-fest-item-holiday'> ● "+"</span>"+e+"</div>";
            });
            fests = nowSolar.getFestivals();
            fests&&fests.forEach(function(e){
                f += "<div class='yueli-day-fest-item' title='"+e+"'>"+"<span class='yueli-day-fest-item-holiday'> ● "+"</span>"+e+"</div>";
            });
            fests = lunar.getFoto().getFestivals();
            fests&&fests.forEach(function(e){
                f += "<div class='yueli-day-fest-item' title='(佛)"+e+"'>"+"<span class='yueli-day-fest-item-feastday'> ● "+"</span>(佛)"+e+"</div>";
            });
            if(lunar.getFoto().isDayZhaiTen()){
                f += "<div class='yueli-day-fest-item' title='(佛)十斋日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(佛)十斋日</div>";
            }
            if(lunar.getFoto().isDayZhaiSix()){
                f += "<div class='yueli-day-fest-item' title='(佛)六斋日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(佛)六斋日</div>";
            }
            if(lunar.getFoto().isDayZhaiGuanYin()){
                f += "<div class='yueli-day-fest-item' title='(佛)观音斋'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(佛)观音斋</div>";
            }
            if(lunar.getFoto().isDayZhaiShuoWang()){
                f += "<div class='yueli-day-fest-item' title='(佛)朔望斋'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(佛)朔望斋</div>";
            }
            fests = lunar.getTao().getFestivals();
            fests&&fests.forEach(function(e){
                f += "<div class='yueli-day-fest-item' title='(道)"+e+"'>"+"<span class='yueli-day-fest-item-feastday'> ● "+"</span>(道)"+e+"</div>";
            });
            if(lunar.getTao().isDaySanHui()){
                f += "<div class='yueli-day-fest-item' title='(道)三会日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)三会日</div>";
            }
            if(lunar.getTao().isDaySanYuan()){
                f += "<div class='yueli-day-fest-item' title='(道)三元日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)三元日</div>";
            }
            if(lunar.getTao().isDayBaJie()){
                f += "<div class='yueli-day-fest-item' title='(道)八节日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)八节日</div>";
            }
            if(lunar.getTao().isDayWuLa()){
                f += "<div class='yueli-day-fest-item' title='(道)五腊日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)五腊日</div>";
            }
            if(lunar.getTao().isDayBaHui()){
                f += "<div class='yueli-day-fest-item' title='(道)八会日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)八会日</div>";
            }
            if(lunar.getTao().isDayMingWu()){
                f += "<div class='yueli-day-fest-item' title='(道)明戊日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)明戊日</div>";
            }
            if(lunar.getTao().isDayAnWu()){
                f += "<div class='yueli-day-fest-item' title='(道)暗戊日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)暗戊日</div>";
            }
            if(lunar.getTao().isDayTianShe()){
                f += "<div class='yueli-day-fest-item' title='(道)天赦日'>"+"<span class='yueli-day-fest-item-fastday'> ● "+"</span>(道)天赦日</div>";
            }

            $("#yueli-day-fest-list").html(f);
        }
        ,
        render: function(mm){
            this.month = mm;
            var todaySolar = Solar.fromDate(new Date());
            var days = mm.getDays();
            var currentMonth = mm.getMonth();
            $("#month_title").html(mm.toFullString());
            var w = '';
            var WEEK = '日一二三四五六'.split('');
            for (var i = 0; i < 7; i++) {
                w += '<div class="yueli-week">' + WEEK[i] + '</div>';
            }
            $("#yueli-week-bar").html(w);
            $(".yueli-month").html(this.month.getMonth());

            var s = '';
            var week = days[0].getWeek();
            if( week>0 ){
                var preMonth = mm.next(-1);
                var preDays = preMonth.getDays();
                for( var i=0;i<week; i++ ){
                    days.unshift(preDays[preDays.length-i-1]);
                }
            }
            var restDay = 7-days.length%7;
            if( restDay !=0 ){
                var nextMonth = mm.next(1);
                var nextDays = nextMonth.getDays();
                for( var i=0;i<restDay;i++ ){
                    days.push(nextDays[i]);
                }
            }
            
            for (var i = 0, j = days.length; i < j; i++) {
                var d = days[i];
                var dl = d.getLunar();
                var fest = null;
                if(dl.getFestivals().length>0){//优先显示农历节日
                    fest = dl.getFestivals()[0];
                }else if( d.getFestivals().length>0 ){//再显示公历节日
                    fest = d.getFestivals()[0];
                }
                if( !!dl.getJieQi() ){
                    fest = dl.getJieQi();
                }
                if( fest && fest.length>4 ) fest = fest.substring(0,4);
                var dfDay = !!fest?fest:(1 == dl.getDay()?dl.getMonthInChinese()+"月":dl.getDayInChinese());
                if( d.getMonth()==currentMonth ){
                    s += '<div class="yueli-day '+((d.getWeek()==0||d.getWeek()==6)?"yueli-day-weekend":"")+'" y="'+d.getYear()+'" m="'+d.getMonth()+'" d="'+d.getDay()+'">';
                    s += d.getDay();
                    if( fest ){
                        s += '<span class="yueli-day-lunar-fest">' + dfDay + '</span>';
                    }else{
                        s += '<span class="yueli-day-lunar">' + dfDay + '</span>';
                    }
                    
                    s += '<span class="yueli-day-ganzhi">' + dl.getDayInGanZhi() + '</span>';
                    s += '</div>';
                }else{
                    s += '<div class="yueli-day yueli-day-notcurrent '+((d.getWeek()==0||d.getWeek()==6)?"yueli-day-weekend":"")+'" y="'+d.getYear()+'" m="'+d.getMonth()+'" d="'+d.getDay()+'">';
                    s += d.getDay();
                    if( fest ){
                        s += '<span class="yueli-day-lunar-fest yueli-day-notcurrent">' + dfDay + '</span>';
                    }else{
                        s += '<span class="yueli-day-lunar yueli-day-notcurrent">' + dfDay + '</span>';
                    }
                    s += '<span class="yueli-day-ganzhi yueli-day-notcurrent">' + dl.getDayInGanZhi() + '</span>';
                    s += '</div>';
                }
            }
            $('#yueli').html(s);
            // hightlight today
            if( todaySolar.getMonth()==currentMonth ){
                var y = todaySolar.getYear();
                var m = todaySolar.getMonth();
                var d = todaySolar.getDay();
                var dom = $(".yueli-day[y="+y+"][m="+m+"][d="+d+"]");
                if( dom ){
                    dom.addClass("yueli-day-active");
                    $(dom.children()).addClass("yueli-day-children-active");
                    this.last_active_day = dom;
                    this.dayInfo(todaySolar);
                }
            }

        }

    };

    //输出 monthly 接口
    exports('monthly', monthlyObj);


})