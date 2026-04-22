/**
 * 太乙排盘。
 */
layui.define(["realsuntime"], function (exports) {


    function createArray(dim) {
        if( typeof(dim) == 'number' ) {
            var arr = new Array(dim+1);
            return arr;
        }else if( typeof(dim) == 'string' ) {
            var arr = new Array(parseInt(dim,10)+1);
            return arr;
        }
    }

    function zjzhuan8(d1) {
        var MAP = {8:1,3:2,4:3,9:4,2:5,7:6,6:7,5:9};
        return MAP[d1] || 8;
    }

    function zhuan8(d1) {
        var MAP = {"地主":8,"阳德":8,"和德":3,"吕申":3,"高从":4,"太阳":4,"大炅":9,"大神":9,"大威":2,"天道":2,"大武":7,"武德":7,"太簇":6,"阴主":6};
        return MAP[d1] || 1;
    }

    function ggwy(wys) {
        var r = (8 - wys) % 8;
        return r || 8;
    }

    function gwxc(gsss) {
        return Math.ceil(gsss / 2) % 5 + 1;
    }

    function yys(sw) {
        return Math.abs(sw) % 2;
    }

    function xdj(n, y, r, s, x) {
        var WX_MAP = {"太乙":2,"小游":2,"客参将":2,"君基":4,"文昌":4,"臣基":4,"五福":4,"民基":4,"计神":4,"地乙":4,"始击":3,"飞符":3,"主大将":5,"天乙":5,"客大将":1,"主参将":1,"四神":1};
        var WANG = {1:"申子辰亥",2:"亥卯未寅",3:"寅午戌巳",4:"辰丑戌",5:"酉丑申巳"};
        var XIU  = {1:"丑戌未",2:"申酉",3:"亥子",4:"寅卯",5:"午"};
        var w = WX_MAP[x];
        if (WANG[w].indexOf(y) >= 0) return 1;
        if (XIU[w].indexOf(y) >= 0) return 3;
        return 2;
    }
    function slxwx(g) {
        var MAP = {"太乙":"12","小游":"12","君基":"14","文昌":"14","臣基":"14","五福":"14","始击":"13","主大将":"15","客大将":"11",
            "民基":"04","计神":"04","地乙":"04","主参将":"01","四神":"01","客参将":"02","天乙":"05","飞符":"03"};
        return MAP[g] || "";
    }

    function shishenl(twx, rgwx, twyy, rgyy) {
        var NAMES = [["比","劫"],["枭","印"],["杀","官"],["食","伤"],["才","财"]];
        var diff = (twx - rgwx + 5) % 5;
        return NAMES[diff][twyy == rgyy ? 0 : 1];
    }


    var taiyiObj = {

        /**
         * 
         * @param {Date} datetime       日期时间,Date类型
         * @param {boolean} isman       是否男性
         * @param {boolean} realsun     是否真太阳时
         * @param {string} diqu         地区
         * @param {boolean} wanzishi    是否早晚子时
         * @param {boolean} isKepan     是否刻盘
         * @param {number} cusJushu     自定义局数，数字正负1-9，正为阳遁局，负为阴遁局
         * @param {string} yongShen     用神
         * @returns 
         */
        init: function(datetime, isman, realsun, diqu, wanzishi, isKepan, cusJushu, yongShen){

            this.isShanxiang = false;
            this.shanxiang = null;
            
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            this.isman = isman;
            this.realsun = realsun;
            this.wanzishi = wanzishi;
            this.diqu = diqu;
            this.datetime = datetime;
            this.isKepan = isKepan;
            this.realsunDate;
            this.yongShen =yongShen;
            if (!!realsun) {//转换为真太阳时
                realsunDate = layui.realsuntime.calcRealsuntime(datetime, diqu);
                year = realsunDate.getFullYear();
                month = realsunDate.getMonth() + 1;
                day = realsunDate.getDate();
                hour = realsunDate.getHours();
                minute = realsunDate.getMinutes();
            }
            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
            this.bazi = this.lunar.getEightChar();
            if( this.wanzishi==0 ){
                this.bazi.setSect(1);//按热卜规则，关闭早晚子时。
            }else{
                this.bazi.setSect(!!this.wanzishi ? 2 : 1);
            }
            

            this.nianZhu = [this.bazi.getYearGan(), this.bazi.getYearZhi()];
            this.yueZhu = [this.bazi.getMonthGan(), this.bazi.getMonthZhi()];
            this.riZhu = [this.bazi.getDayGan(), this.bazi.getDayZhi()];
            this.shiZhu = [this.bazi.getTimeGan(), this.bazi.getTimeZhi()];
            if( this.isKepan ){//是否刻盘
                var ke = ((hour+1)%2)*6+Math.floor(minute/10);
                this.keZhu = WU_SHU_DUN[this.bazi.getTimeGan()][ke].split("");
            }

            var jieQi = this.lunar.getJieQiTable();
            var dongzhi = jieQi["DONG_ZHI"];
            var xiazhi = jieQi["夏至"];

            var yIdx = ZHI.indexOf(this.bazi.getYearZhi())+1;
            var mIdx = Math.abs(this.lunar.getMonth());
            var dIdx = this.lunar.getDay()+(hour==23?1:0);//按热卜规则，23点后算第二天。
            var hIdx = ZHI.indexOf(this.bazi.getTimeZhi())+1;
            var kIdx = this.isKepan?ZHI.indexOf(this.keZhu[1])+1:0;
            if( !cusJushu ){//自定义局数
                var jushu = (yIdx+mIdx+dIdx+hIdx+kIdx)%9;
                this.jushu = jushu==0?9:jushu; //局数
                this.yangDun = !(this.solar.isAfter(xiazhi) && this.solar.isBefore(dongzhi)); //阳遁/阴遁, true/false
            }else{
                this.yangDun = cusJushu>0;
                this.jushu = Math.abs(cusJushu);
            }
            this.cusJushu = cusJushu;

            var jieQiTable = this.lunar.getJieQiTable();
            var xiazhi = jieQiTable["夏至"];
            var dongzhi = jieQiTable["DONG_ZHI"];
            this.isYang = !(this.solar.isAfter(xiazhi) && this.solar.isBefore(dongzhi))
            return this;
        }
        ,
        //积数
        _jishu: function(){
            //计算积数
            var jsYear, jsMonth, jsDay, jsHour, jsKe;
            //将六十甲子转为1-60的数字
            jsYear = _jiazhi.indexOf(this.nianZhu.join(""))+1;//年
            jsMonth = _jiazhi.indexOf(this.yueZhu.join(""))+1;//月
            jsDay = _jiazhi.indexOf(this.riZhu.join(""))+1;//日
            jsHour = _jiazhi.indexOf(this.shiZhu.join(""))+1; //时f
            if( this.isKepan ){
                jsKe = _jiazhi.indexOf(this.keZhu.join(""))+1; //刻
            }
            var yIdx = ZHI.indexOf(this.bazi.getYearZhi())+1;
            var mIdx = Math.abs(this.lunar.getMonth());
            var dIdx = this.lunar.getDay()+(this.bazi.getTimeZhi()==23?1:0);//按热卜规则，23点后算第二天。
            var hIdx = ZHI.indexOf(this.bazi.getTimeZhi())+1;
            var kIdx = this.isKepan?ZHI.indexOf(this.keZhu[1])+1:0;
            if (this.isKepan ) {//算积数
                this.jishu = jsYear * jsMonth * jsDay * jsHour * jsKe + (yIdx + mIdx + dIdx + hIdx + kIdx);
            } else {
                this.jishu = jsYear * jsMonth * jsDay * jsHour + (yIdx + mIdx + dIdx + hIdx);
            }
            return this;
        }
        ,
        //太乙宫位
        _tygongwei: function(){
            this.tygongwei = Math.round((((this.jishu * 1) % (((24 * 1))) * 1) % (3) * 1));
            if (this.tygongwei == 0) { this.tygongwei = 3; }
            if (this.tygongwei == 1) {
                this.guan = "管天";
            } else if (this.tygongwei == 2) {
                this.guan = "管地";
            } else {
                this.guan = "管人";
            }
            return this;
        }
        ,
        //小游
        _xiaoyou: function(){
            var tygsjw;
            if (Math.floor((((this.jishu * 1) % (((24 * 1))) * 1) % (3) * 1)) == 0) {
                tygsjw = Math.floor((((this.jishu * 1) % (24 * 1))) / 3);
            } else if (Math.floor(((this.jishu * 1) % (24 * 1))) == 0) {
                if (!this.isYang) { tygsjw = 1; }
                if (this.isYang) { tygsjw = 8; }
            } else {
                tygsjw = Math.floor((((this.jishu * 1) % (24 * 1))) / 3) + 1;
            }
            this.tygspws = (this.isYang?"12346789":"98764321").substring(tygsjw-1, tygsjw);
            this.tygwzj = zjzhuan8(this.tygspws);
            //算小游
            this.xiaoyou = "12345678".substring(tygsjw-1, tygsjw);      
            return this;      
        }
        ,
        //文昌
        _wenchang: function(){
            //找文昌
            var wclg;
            this.wcg = ((this.jishu * 1) % (18 * 1));

            //确定文昌落宫阴阳
            //16宫转装8宫

            //16宫
            this.slgstr = "武德太簇阴主阴德大义地主阳德和德吕申高从太阳大炅大神大威天道大武";//16宫
            this.slgyy = "阴阳阴阳阴阳阴阳阴阳阴阳阴阳阴阳";//16宫阴阳
            if (this.wcg >= 4 || this.wcg >= 16) { this.wcg = this.wcg - 1; }
            if (this.wcg == 0) {
                this.wcg = 16;
                wclg = "大武";
                this.wclgyy = "阳";
            } else {
                wclg = this.slgstr.substring(2 * this.wcg - 1-1, 2 * this.wcg);
                this.wclgyy = this.slgyy.substring(this.wcg-1, this.wcg);
            }
            var wclgz;
            wclgz = zhuan8(wclg);
            this.wclgzj = zjzhuan8(wclgz);
            return this;
        }
        ,
        //计算计神
        _jisheng: function(){
            var jishenstr;
            if( this.isYang ){
                jishenstr = "寅丑子亥戌酉申未午巳辰卯";
            }else{
                jishenstr = "申未午巳辰卯寅丑子亥戌酉";
            }
            this.jishen = jishenstr.substring(ZHI.indexOf(this.bazi.getTimeZhi()), ZHI.indexOf(this.bazi.getTimeZhi())+1);

            //找始计-----------------------------------------
            var zjA;
            //12地支对应宫-------
            var dzgw, jsz, dzgwz;
            dzgw = "武德太簇阴主大义地主阳德吕申高从太阳大神大威天道";
            dzgwz = "申酉戌亥子丑寅卯辰巳午未";
            //计神对应
            for (var i = 1; i <= 12; i++) {
                if (this.jishen == dzgwz.substring(i-1, i)) { break }
            }
            var jsdy;
            jsdy = dzgw.substring(i * 2 - 1-1, i * 2);
            var p;
            for (p = 1; p <= 16; p++) {
                if (this.slgstr.substring(2 * p - 1-1, 2 * p) == jsdy) { break }
            }
            zjA = 9 - p;
            if (zjA > 0) {
                zjA = 9 - p;
            } else {
                zjA = 9 - p + 16;
            }

            //始计
            this.shiji = this.wcg + zjA - 1;
            if (this.shiji > 16) {
                this.shiji = this.wcg + zjA - 16 - 1;
            } else {
                this.shiji = this.wcg + zjA - 1;
            }
            var shijilg;//始计落宫
            shijilg = this.slgstr.substring(2 * this.shiji - 1-1, 2 * this.shiji);
            this.shijilgzj = zhuan8(shijilg);
            this.shijilgyy = this.slgyy.substring(this.shiji-1, this.shiji);
            return this;
        }
        ,
        //主算数和主大将,主参将
        _zhushuan: function(){
            //找主算数
            var gongstr0 = "83492761";
            //太乙后一宫
            var wys, wysp;
            //经过宫位长度
            wys = this.wclgzj - this.tygwzj;
            wysp = ggwy(wys);
            var ttyz16, tqhwz;
            if (wys == 0) {      // 修正太乙和文昌同部下前后问题
                if (this.tygspws == 3) { ttyz16 = 8; }
                if (this.tygspws == 9) { ttyz16 = 12; }
                if (this.tygspws == 7) { ttyz16 = 16; }
                if (this.tygspws == 1) { ttyz16 = 4; }
                tqhwz = this.wcg - ttyz16
                if (tqhwz == 1 || tqhwz == -15) { wysp = 8; }
            }
            var zsp = createArray('16'), u;
            for (var u = 1; u <= 16; u++) {
                zsp[u] = 0;
            }
            for (var u = this.wclgzj; u <= this.wclgzj + wysp - 1; u++) {
                zsp[u] = "1234567812345678".substring(u-1, u);
            }
            var zhusuans, zhusuansp, zspp;;
            zhusuans = Math.floor(zsp[1] + zsp[2] + zsp[3] + zsp[4] + zsp[5] + zsp[6] + zsp[7] + zsp[8] + zsp[9] + zsp[10] + zsp[11] + zsp[12] + zsp[13] + zsp[14] + zsp[15] + zsp[16]);
            zhusuansp = zhusuans.toString().substring(1-1, 8);
            var zhusuanat = createArray('8'), zsgg = createArray('8');
            for (var u = 1; u <= 8; u++) {
                zhusuanat[u] = zhusuansp.substring(u-1, u);
                zsgg[u] = gongstr0.substring(zhusuanat[u]-1, zhusuanat[u]);
                if (zhusuanat[u] == 0) { zsgg[u] = 0; }
            }
            zspp = (zsgg[1] + zsgg[2] + zsgg[3] + zsgg[4] + zsgg[5] + zsgg[6] + zsgg[7] + zsgg[8]).toString();
            var zspppc;
            zspppc = zspp.substring(1-1, wysp);
            var lzpp = createArray('8');
            for (var u = 1; u <= 8; u++) {
                lzpp[u] = 0;
            }
            for (var u = 1; u <= zspppc.length; u++) {
                lzpp[u] = 0;
                lzpp[u] = zspppc.substring(u-1, u);
            }
            var lzp;
            lzp = Math.round(lzpp[1]) + Math.round(lzpp[2]) + Math.round(lzpp[3]) + Math.round(lzpp[4]) + Math.round(lzpp[5]) + Math.round(lzpp[6]) + Math.round(lzpp[7]) + Math.round(lzpp[8]);
            
            //主算数
            if (this.wclgyy == "阳") {
                this.zhusuanstr = lzp + 1;
                if (lzp + 1 == 41) { this.zhusuanstr = 1; }
            } else {
                this.zhusuanstr = lzp;
            }
            //主大将
            if (this.zhusuanstr == 10 || this.zhusuanstr == 20 || this.zhusuanstr == 30 || this.zhusuanstr == 40) {
                this.zdj = Math.floor(((this.zhusuanstr * 1) % (9 * 1)));
            } else if (this.zhusuanstr > 10 && this.zhusuanstr != 20 || this.zhusuanstr != 30 || this.zhusuanstr != 40) {
                this.zdj = (""+this.zhusuanstr).substring(this.zhusuanstr.length-1, this.zhusuanstr.length);
            } else if (this.zdj == 5) {
                this.zdj = 5;
            } else {
                this.zdj = this.zhusuanstr;
            }
            //主参将
            this.zcj = this.zdj * 3;
            if (this.zcj > 9) {
                this.zcj = this.zcj.toString().substring(1, 2);
            }
            return this;
        }
        ,
        //客算数，客大将，客参将
        _keshuan: function(){
            var kss, kswysp, kzsp = createArray('16');
            kss = zjzhuan8(this.shijilgzj) - this.tygwzj;
            kswysp = ggwy(kss);
            var qhwz, tyz16;  // 修正客算始击 大于太乙
            if (kss == 0) {
                if (this.tygspws == 3) { tyz16 = 8; }
                if (this.tygspws == 9) { tyz16 = 12; }
                if (this.tygspws == 7) { tyz16 = 16; }
                if (this.tygspws == 1) { tyz16 = 4; }
                qhwz = this.shiji - tyz16
                if (qhwz == 1 || qhwz == -15) { kswysp = 8; }
            }
            for (var u = 1; u <= 16; u++) {
                kzsp[u] = 0;
            }
            if (kss != 0) {
                for (var u = zjzhuan8(this.shijilgzj); u <= zjzhuan8(this.shijilgzj) + kswysp - 1; u++) {
                    kzsp[u] = "1234567812345678".substring(u-1, u);
                }
            } else {
                for (var u = zjzhuan8(this.shijilgzj); u <= zjzhuan8(this.shijilgzj) - 1 + kswysp; u++) {
                    kzsp[u] = "1234567812345678".substring(u-1, u);
                }
            }
            var kzhusuans, kzhusuansp, kzspp;
            var gongstr0 = "83492761";
            kzhusuans = Math.floor(kzsp[1] + kzsp[2] + kzsp[3] + kzsp[4] + kzsp[5] + kzsp[6] + kzsp[7] + kzsp[8] + kzsp[9] + kzsp[10] + kzsp[11] + kzsp[12] + kzsp[13] + kzsp[14] + kzsp[15] + kzsp[16]);
            kzhusuansp = kzhusuans.toString().substring(1-1, 8);
            var kzhusuanat = createArray('8'), kzsgg = createArray('8');
            for (var u = 1; u <= 8; u++) {
                kzhusuanat[u] = kzhusuansp.substring(u-1, u);
                kzsgg[u] = gongstr0.substring(kzhusuanat[u]-1, kzhusuanat[u]);
                if (kzhusuanat[u] == 0) { kzsgg[u] = 0; }
            }
            kzspp = (kzsgg[1] + kzsgg[2] + kzsgg[3] + kzsgg[4] + kzsgg[5] + kzsgg[6] + kzsgg[7] + kzsgg[8]).toString();

            var kzspppc;
            kzspppc = kzspp.substring(1-1, kswysp);
            var klzp;
            var klzpp = createArray('8');
            for (var u = 1; u <= 8; u++) {
                klzpp[u] = 0;
            }
            for (var u = 1; u <= kzspppc.length; u++) {
                klzpp[u] = 0;
                klzpp[u] = kzspppc.substring(u-1, u);
            }
            klzp = Math.round(klzpp[1]) + Math.round(klzpp[2]) + Math.round(klzpp[3]) + Math.round(klzpp[4]) + Math.round(klzpp[5]) + Math.round(klzpp[6]) + Math.round(klzpp[7]) + Math.round(klzpp[8]);
            //客算数
            if (this.shijilgyy == "阳") {
                this.kzhusuanstr = klzp + 1;
                if (klzp + 1 == 41) { this.kzhusuanstr = 1; }
            } else {
                this.kzhusuanstr = klzp;
            }
            //客大将
            if (this.kzhusuanstr == 10 || this.kzhusuanstr == 20 || this.kzhusuanstr == 30 || this.kzhusuanstr == 40) {
                this.kzdj = Math.floor(((this.kzhusuanstr * 1) % (9 * 1)));
            } else if (this.kzhusuanstr > 10 && this.kzhusuanstr != 20 || this.kzhusuanstr != 30 || this.kzhusuanstr != 40) {
                var ss = (""+this.kzhusuanstr);
                this.kzdj = ss.substring(ss.length-1, ss.length);
            } else {
                this.kzdj = this.kzhusuanstr;
            }
            //计算客参将
            this.kcj = (this.kzdj * 3).toString().substring((this.kzdj * 3).toString().length-1, (this.kzdj * 3).toString().length);
            return this;
        }
        ,
        //五福，三基，四神
        _5fu3ji: function(){
            //求五福
            var wufu,wufus;
            wufu = (((this.jishu * 1) % (((225 * 1))) * 1) % (45 * 1));
            wufus = Math.floor((((this.jishu * 1) % (225 * 1))) / 45);
            if (wufu == 0) {
                wufu = 0;
            } else {
                wufu = 1;
            }
            this.wufugw = wufus + wufu;
            if (wufu == 0) { this.wufugw = 5; }
            //求君基
            var junjis;
            junjis = Math.floor((((this.jishu * 1) % (360 * 1))) / 30);
            this.junjigw = junjis;
            if (this.junjigw > 12) { this.junjigw = junjis - 12; }
            if (Math.floor((((this.jishu * 1) % (((360 * 1))) * 1) % (30) > 0) * 1)) { this.junjigw = this.junjigw + 1; }
            if (this.junjigw == 0) { this.junjigw = 12; }
            //求臣基
            var chenjis;
            chenjis = Math.floor((((this.jishu * 1) % (36 * 1))) / 3);
            this.chenjigw = chenjis;
            if (this.chenjigw > 12) { this.chenjigw = chenjis - 12; }
            if (Math.floor((((this.jishu * 1) % (((36 * 1))) * 1) % (3) > 0) * 1)) { this.chenjigw = this.chenjigw + 1; }
            if (this.chenjigw == 0) { this.chenjigw = 12; }
            //求民基
            this.minji = Math.floor(((this.jishu * 1) % (12 * 1)));
            if (this.minji > 12) { this.minji = this.minji - 12; }
            if (this.minji == 0) { this.minji = 12; }
            
            var yunxingj, stdf, stdfs, stdfgw;
            yunxingj = "亥午寅卯辰酉申子巳戌未丑";
            stdf = Math.floor((((this.jishu * 1) % (((36 * 1))) * 1) % (3) * 1));
            stdfs = Math.floor((((this.jishu * 1) % (36 * 1))) / 3);
            if (stdf > 0) { stdfs = stdfs + 1; }
            stdfgw = stdfs;
            if (stdfgw > 12) { stdfgw = stdfgw - 12; }
            //求四神
            this.sishen = yunxingj.substring(stdfgw-1, stdfgw);
            var tianyigd;
            tianyigd = 6 + stdfgw - 1;
            if (tianyigd > 12) { tianyigd = tianyigd - 12; }
            //天乙
            this.tianyi = yunxingj.substring(tianyigd-1, tianyigd);
            var diyigd;
            diyigd = 9 + stdfgw - 1;
            if (diyigd > 12) { diyigd = diyigd - 12; }
            //地乙
            this.diyi = yunxingj.substring(diyigd-1, diyigd);
            var feifugd;
            feifugd = 5 + stdfgw - 1;
            if (feifugd > 12) { feifugd = feifugd - 12; }
            //飞符
            this.feifu = yunxingj.substring(feifugd-1, feifugd);
            return this;
        }
        ,
        //身宫
        _shengong: function(){
            var sg1;
            if (this.isKepan) {
                sg1 = ZHI.indexOf(this.keZhu[1])+1 - ZHI.indexOf(this.riZhu[1])+1 + ZHI.indexOf(this.shiZhu[1])+1;
            } else {
                sg1 = ZHI.indexOf(this.shiZhu[1])+1 - ZHI.indexOf(this.yueZhu[1])+1 + ZHI.indexOf(this.riZhu[1])+1;
            }
            if (sg1 <= 0) { sg1 = sg1 + 12; }
            if (sg1 > 12) { sg1 = sg1 - 12; }
            this.shengong = ZHI[sg1-1];
            return this;
        }
        ,
        //天马
        _tianma: function () {
            var tmno;
            var mIdx = Math.abs(this.lunar.getMonth());
            tmno = mIdx;
            if (tmno > 6) { tmno = ((mIdx * 1) % (6 * 1)); }
            if (tmno == 0) { tmno = 6; }
            var tmstr = "午申戌子寅辰";
            this.tianma = tmstr.substring(tmno - 1, tmno);
            return this;
        }
        ,
        _shishen: function(){
            //确定十神
            var sqsp = [
                null, "太乙", "小游", "君基", "文昌", "臣基", "五福", "始击", "主大将", 
                "客大将", "民基", "计神", "地乙", "主参将", "四神", "客参将", "天乙", "飞符"
            ];

            var rgwx, rgyy;
            rgwx = gwxc(GAN.indexOf(this.yongShen.substring(0, 1))+1);
            rgyy = yys(GAN.indexOf(this.yongShen.substring(0, 1))+1);
            var shishenc = createArray('17'), shishenp = createArray('17'), rsl = createArray('17'),
            lsl = createArray('17');
            for (var i = 1; i <= 17; i++) {
                var ss = slxwx(sqsp[i]);
                rsl[i] = ss.substring(ss.length-1, ss.length);
                lsl[i] = ss.substring(0, 1);
                shishenc[i] = shishenl(rsl[i], rgwx, lsl[i], rgyy);
                shishenp[i] = shishenc[i] + xdj(this.nianZhu[1], this.yueZhu[1], this.riZhu[1], this.shiZhu[1], sqsp[i]);
            }
            
            var sqxpl = createArray('16'), tysq = createArray('16'), xysq = createArray('16'), 
            jjsq = createArray('16'), wcsq = createArray('16'), cjsq = createArray('16'), 
            wfsq = createArray('16'), sjsq = createArray('16'), zdjsq = createArray('16'),
            kdjsq = createArray('16'), mjsq = createArray('16'), jssq = createArray('16'), 
            dysq = createArray('16'), zcjsq = createArray('16'), sssq = createArray('16'), 
            kcjsq = createArray('16'), tiysq = createArray('16'), ffsq = createArray('16'), 
            sgong = createArray('12');
            for (var i = 1; i <= 9; i++) {
                tysq[i] = "";
                zdjsq[i] = "";
                zcjsq[i] = "";
                kdjsq[i] = "";
                kcjsq[i] = "";
                wfsq[i] = "";
                xysq[i] = "";
            }

            tysq[this.tygwzj] = "<span class='qimen3s-cell-taiyi'>太乙</span>" + shishenp[1] + "<br>";
            zdjsq[zjzhuan8(this.zdj)] = "主大" + shishenp[8] + "<br>";
            zcjsq[zjzhuan8(this.zcj)] = "主参" + shishenp[13] + "<br>";
            kdjsq[zjzhuan8(this.kzdj)] = "客大" + shishenp[9] + "<br>";
            kcjsq[zjzhuan8(this.kcj)] = "客参" + shishenp[15] + "<br>";
            wfsq[this.wufugw] = "五福" + shishenp[6] + "<br>";
            xysq[this.xiaoyou] = "小游" + shishenp[2] + "<br>";
            for (var i = 1; i <= 16; i++) {
                wcsq[i] = "";
                sjsq[i] = "";
            }
            wcsq[this.wcg] = "文昌" + shishenp[4] + "<br>";
            sjsq[this.shiji] = "始击" + shishenp[7] + "<br>";
            for (var i = 1; i <= 12; i++) {
                jssq[i] = "";
                jjsq[i] = "";
                cjsq[i] = "";
                mjsq[i] = "";
                sssq[i] = "";
                tiysq[i] = "";
                dysq[i] = "";
                ffsq[i] = "";
                sgong[i] = ZHI[i-1];
            }
            jssq[ZHI.indexOf(this.jishen)+1] = "计神" + shishenp[11] + "<br>";
            jjsq[this.junjigw] = "君基" + shishenp[3] + "<br>";
            cjsq[this.chenjigw] = "臣基" + shishenp[5] + "<br>";
            mjsq[this.minji] = "民基" + shishenp[10] + "<br>";
            sssq[ZHI.indexOf(this.sishen)+1] = "四神" + shishenp[14] + "<br>";
            tiysq[ZHI.indexOf(this.tianyi)+1] = "天乙" + shishenp[16] + "<br>";
            dysq[ZHI.indexOf(this.diyi)+1] = "地乙" + shishenp[12] + "<br>";
            ffsq[ZHI.indexOf(this.feifu)+1] = "飞符" + shishenp[17] + "<br>";
            sgong[ZHI.indexOf(this.shengong)+1] = "<span style='background-color:#FF0000'><font color=#ffffff>" + "身" + "</font></span>";
            for (var i = 1; i <= 12; i++) {
                sqxpl[i] = sssq[i] + tiysq[i] + dysq[i] + ffsq[i];
            }

            this.shen16 = {
                "sqxpl": sqxpl, 
                "tysq": tysq, 
                "xysq": xysq, 
                "jjsq": jjsq, 
                "wcsq": wcsq, 
                "cjsq": cjsq, 
                "wfsq": wfsq, 
                "sjsq": sjsq, 
                "zdjsq": zdjsq, 
                "kdjsq": kdjsq, 
                "mjsq": mjsq, 
                "jssq": jssq, 
                "dysq": dysq, 
                "zcjsq": zcjsq, 
                "sssq": sssq, 
                "kcjsq": kcjsq, 
                "tiysq": tiysq, 
                "ffsq": ffsq, 
                "sgong": sgong,
            }

            return this;
        }
        ,
        //排太乙盘
        paipan: function(datetime, isman, realsun, diqu, wanzishi, isKepan, jushu, yongShen){
            this.init(datetime, isman, realsun, diqu, wanzishi, isKepan, jushu, yongShen);
            this._jishu()._tygongwei()._xiaoyou()._wenchang()._jisheng()._zhushuan()._keshuan()._5fu3ji()
            ._shengong()._tianma()._shishen();

            return {
                "date": this.solar.getYear()+"年"+this.solar.getMonth()+"月"+this.solar.getDay()+"日"+" "+this.solar.getHour()+"时"+this.solar.getMinute()+"分"+"("+this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese()+")"+(this.realsun?"(真太阳)":""),
                "bazi": this.bazi,
                "siZhu": this.isKepan?[this.yueZhu,this.riZhu,this.shiZhu,this.keZhu]:[this.nianZhu,this.yueZhu,this.riZhu,this.shiZhu],
                "solar": this.solar,
                "lunar": this.lunar,
                "isman": this.isman,
                "datetime": this.datetime,
                "realsun": this.realsun,
                "diqu": this.diqu,
                "wanzishi": this.wanzishi,
                "isKepan": this.isKepan,
                "cusJushu": this.cusJushu,
                "jieqi": this.lunar.getPrevJieQi(false).getName()+" ~ " + this.lunar.getNextJieQi(false).getName(),
                "yangDun": this.yangDun,
                "yueJiang": this.yueJiang,
                "yueJiangName": this.yueJiangName,
                "jushu": this.jushu,//局数
                "yongShen": this.yongShen,

                "jishu": this.jishu,//积数
                "tygongwei": this.tygongwei,//太乙宫位
                "guan": this.guan,//管天/地/人
                "xiaoyou": this.xiaoyou,//小游
                "zhushuan": this.zhusuanstr, //主算
                "keshuan": this.kzhusuanstr, //客算
                "tianma": this.tianma, //天马
                "shen16": this.shen16, //16神

            };
        },

    };

    exports('taiyi', taiyiObj);


})