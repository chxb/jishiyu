/**
 * 阴盘奇门排盘。
 */
layui.define(["realsuntime"], function (exports) {

    //三奇六仪
    var _3Q6Y = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
    //九星（按原始宫位数字顺序）
    var _9STAR = ["蓬","芮","冲","辅","禽","心","柱","任","英"];
    //九星(按原始宫位顺序)
    var _9STAR_S = ['蓬',"任","冲","辅","英","芮","柱","心"];
    //八门(按原始宫位数字顺序）
    var _8MEN = ["休","死","伤","杜","","开","惊","生","景"];
    //八门(按原始宫位顺序)
    var _8MEN_S = ["休","生","伤","杜","景","死","惊","开"];
    //八神
    var _8SHEN_S = ["符","蛇","阴","六","白","玄","地","天"];
    var _8SHEN_N = ["符","天","地","玄","白","六","阴","蛇"];
    //八卦宫位（按宫位数字顺序）
    var _8GUA = ["坎","坤","震","巽","中","乾","兑","艮","离"];
    //八卦宫位(顺)
    var _8GUA_S = ["坎","艮","震","巽","离","坤","兑","乾"];
    //八卦宫位(逆)
    var _8GUA_N = ["坎","乾","兑","坤","离","巽","震","艮"];

    var _XUNHEAD = {
        "戊":["甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉"],
        "己":["甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛巳","壬午","癸未"],
        "庚":["甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳"],
        "辛":["甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯"],
        "壬":["甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑"],
        "癸":["甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"]
    };
    var XUNHEAD = {
        "戊":"甲子戊",
        "己":"甲戌己",
        "庚":"甲申庚",
        "辛":"甲午辛",
        "壬":"甲辰壬",
        "癸":"甲寅癸",
    };
    var KONGWANG = {
        "戊":"戌亥",
        "己":"申酉",
        "庚":"午未",
        "辛":"辰巳",
        "壬":"寅卯",
        "癸":"子丑",
    };
    //十天干在每个宫位12长生
    var ZHANG_SHENG_12 = {
        "甲":{
            "乾":"养生",
            "坎":"沐",
            "艮":"冠临",
            "震":"旺",
            "巽":"衰病",
            "离":"死",
            "坤":"墓绝",
            "兑":"胎"
        },
        "乙":{
            "乾":"死墓",
            "坎":"病",
            "艮":"旺衰",
            "震":"临",
            "巽":"沐冠",
            "离":"生",
            "坤":"胎养",
            "兑":"绝"
        },
        "丙":{
            "乾":"墓绝",
            "坎":"胎",
            "艮":"养生",
            "震":"沐",
            "巽":"冠临",
            "离":"旺",
            "坤":"衰病",
            "兑":"死"
        },
        "丁":{
            "乾":"胎养",
            "坎":"绝",
            "艮":"死墓",
            "震":"病",
            "巽":"旺衰",
            "离":"临",
            "坤":"沐冠",
            "兑":"生"
        },
        "戊":{
            "乾":"墓绝",
            "坎":"胎",
            "艮":"养生",
            "震":"沐",
            "巽":"冠临",
            "离":"旺",
            "坤":"衰病",
            "兑":"死"
        },
        "己":{
            "乾":"胎养",
            "坎":"绝",
            "艮":"死墓",
            "震":"病",
            "巽":"旺衰",
            "离":"临",
            "坤":"沐冠",
            "兑":"生"
        },
        "庚":{
            "乾":"衰病",
            "坎":"死",
            "艮":"墓绝",
            "震":"胎",
            "巽":"养生",
            "离":"沐",
            "坤":"冠临",
            "兑":"旺"
        },
        "辛":{
            "乾":"沐冠",
            "坎":"生",
            "艮":"胎养",
            "震":"绝",
            "巽":"死墓",
            "离":"病",
            "坤":"旺衰",
            "兑":"临"
        },
        "壬":{
            "乾":"冠临",
            "坎":"旺",
            "艮":"衰病",
            "震":"死",
            "巽":"墓绝",
            "离":"胎",
            "坤":"养生",
            "兑":"沐"
        },
        "癸":{
            "乾":"旺衰",
            "坎":"临",
            "艮":"沐冠",
            "震":"生",
            "巽":"胎养",
            "离":"绝",
            "坤":"死墓",
            "兑":"病"
        }
    };
    //月将. 根据节气
    var YUE_JIANG = {
        "雨水":["亥","登明"],
        "春分":["戌","河魁"],
        "谷雨":["酉","从魁"],
        "小满":["申","传送"],
        "夏至":["未","小吉"],
        "大暑":["午","胜光"],
        "处暑":["巳","太乙"],
        "秋分":["辰","天罡"],
        "霜降":["卯","太冲"],
        "小雪":["寅","功曹"],
        "冬至":["丑","大吉"],
        "大寒":["子","神后"],
    };
    //月将
    var _12YUEJIANG = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    var _12YUEJIANGNAME = ['神后', '大吉', '功曹', '太冲', '天罡', '太乙', '胜光', '小吉', '传送', '从魁', '河魁', '登明'];
    //十二建除
    var _12JIANCHU = ["建","除","满","平","定","执","破","危","成","收","开","闭"];
    //十二地支
    var _12DIZHI = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
    //二址四山向
    var _24SAN =    ["巳", "丙", "午",  "丁", "未", "坤",  "申", "庚", "酉",  "辛", "戌", "乾",  "亥", "壬", "子",  "癸", "丑", "艮",  "寅", "甲", "卯",  "乙", "辰", "巽"];
    var _24XIANG =  ["亥", "壬", "子",  "癸", "丑", "艮",  "寅", "甲", "卯",  "乙", "辰", "巽",  "巳", "丙", "午",  "丁", "未", "坤",  "申", "庚", "酉",  "辛", "戌", "乾"];
    //每个向上的黄泉煞
    var HUANGQUANSHA = ["酉","亥","亥","亥","卯","卯","卯","巳","巳","巳","午","午","午","辰","辰","辰","寅","寅","寅","申","申","申","酉","酉"];
    //72局，向的度数表
    var _72JU = {
        "亥":[{"315":-6},{"320":-3},{"325":-9}],
        "壬":[{"330":-9},{"335":-3},{"340":-6}],
        "子":[{"345":-8},{"350":-2},{"355":-5}], 
        
        "癸":[{"0":-7},{"5":-1},{"10":-4}],
        "丑":[{"15":-2},{"20":-5},{"25":-8}],
        "艮":[{"30":-1},{"35":-4},{"40":-7}],
        
        "寅":[{"45":-9},{"50":-3},{"55":-6}],
        "甲":[{"60":-7},{"65":-1},{"70":-4}],
        "卯":[{"75":-6},{"80":-9},{"85":-3}],
        
        "乙":[{"90":-5},{"95":-8},{"100":-2}],
        "辰":[{"105":-6},{"110":-9},{"115":-3}],
        "巽":[{"120":-5},{"125":-8},{"130":-2}],

        "巳":[{"135":4},{"140":7},{"145":1}],
        "丙":[{"150":1},{"155":7},{"160":4}],
        "午":[{"165":2},{"170":8},{"175":5}],
        
        "丁":[{"180":3},{"185":9},{"190":6}],
        "未":[{"195":8},{"200":5},{"205":2}],
        "坤":[{"210":9},{"215":6},{"220":3}],
        
        "申":[{"225":1},{"230":7},{"235":4}],
        "庚":[{"240":3},{"245":9},{"250":6}],
        "酉":[{"255":4},{"260":1},{"265":7}],
        
        "辛":[{"270":5},{"275":2},{"280":8}],
        "戌":[{"285":4},{"290":1},{"295":7}],
        "乾":[{"300":5},{"305":2},{"310":8}]
    };
    //双山五行
    var _2SAN5XING = [
        "壬子",
        "癸丑",
        "艮寅",
        "甲卯",
        "乙辰",
        "巽巳",
        "丙午",
        "丁未",
        "坤申",
        "庚酉",
        "辛戌",
        "乾亥"
    ];

    function findSanxiangDataByDegree(degree) {
        if( degree>360||degree<0)
            degree = 0;
        // 根据度数计算对应的 key
        var degree = Math.floor(degree / 5) * 5;
        degree = degree==360?0:degree;
        // 查找对应度数的值
        var zodiac = Object.keys(_72JU);
        for (var i = 0; i < zodiac.length; i++) {
            var data = _72JU[zodiac[i]];
            for (var j = 0; j < data.length; j++) {
                var dataDegree = parseInt(Object.keys(data[j])[0]);
                if (degree === dataDegree) {
                    return { "shan": findSanByXiang(zodiac[i]),
                            "xiang": zodiac[i], 
                            "degree": dataDegree,
                            "ju": data[j][dataDegree],
                            "huangquan": HUANGQUANSHA[_24XIANG.indexOf(zodiac[i])]};
                }
            }
        }
        return null;
    }
    //根据向查山
    function findSanByXiang(xiang){
        return _24SAN[_24XIANG.indexOf(xiang)];
    }
    //根据双山五行查对应五行地支
    function findZhi(x){
        for (var i = 0; i < _2SAN5XING.length; i++) {
            if( _2SAN5XING[i].indexOf(x)!=-1 ){
                return _2SAN5XING[i].substring(1,2);
            }
        }
        return null;
    }
    //根据五鼠遁，用年天干当作日天干查指定地支的天干
    function findGanZhi(gan, zhi){
        var ganzhis = WU_SHU_DUN[gan];
        for( var i=0;i<ganzhis.length;i++ ){
            if( ganzhis[i].indexOf(zhi)!=-1 ){
                return ganzhis[i];
            }
        }
        return null;
    }

    //循环列表
    function CircularList(array, curIndex) {
        var currentIndex = curIndex;
        var length = array.length;

        function next() {
            if (length === 0) {
                return null;
            }

            var currentItem = array[currentIndex];
            currentIndex = (currentIndex + 1) % length;
            return currentItem;
        }

        return {
            next: next
        };
    }

    /**
	 * 把年份转换为干支
	 * @param  year 
	 * @returns 
	 */
	function getYearGanZhi(year) {
        var tianGan = '甲乙丙丁戊己庚辛壬癸';
        var diZhi = '子丑寅卯辰巳午未申酉戌亥';
		// 计算天干地支
		var ganIndex = (year - 4) % 10; // 4是基准年份，可以根据实际情况调整
		var zhiIndex = (year - 4) % 12; // 4是基准年份，可以根据实际情况调整
		return tianGan[ganIndex] + diZhi[zhiIndex];
	}

    var qimenObj = {

        /**
         * 
         * @param {Date} datetime       日期时间,Date类型
         * @param {boolean} isman       是否男性
         * @param {boolean} realsun     是否真太阳时
         * @param {string} diqu         地区
         * @param {boolean} wanzishi    是否早晚子时
         * @param {boolean} isKepan     是否刻盘
         * @param {number} cusJushu     自定义局数，数字正负1-9，正为阳遁局，负为阴遁局
         * @param {number} degree       山向奇门的度数, 0-360
         * @returns 
         */
        init: function(datetime, isman, realsun, diqu, wanzishi, isKepan, cusJushu, degree){

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
            this.yueJiang = YUE_JIANG[this.lunar.getPrevQi()][0]; //月将
            this.yueJiangName = YUE_JIANG[this.lunar.getPrevQi()][1]; //月将名
            this.cusJushu = cusJushu;

            if( arguments.length==8 && arguments[7] !==undefined ){ // 山向奇门度数degree参数
                if( !this.originDegree )
                    this.originDegree = "D"+degree;
                this.shanxiang = findSanxiangDataByDegree(degree);
                this.riZhu = getYearGanZhi(year);
                this.shiZhu = findGanZhi(this.riZhu[0], findZhi(this.shanxiang["xiang"])).split("");
                this.jushu = Math.abs(this.shanxiang["ju"]);
                this.yangDun = this.shanxiang["ju"]>0;
                this.isShanxiang = true;
            }

            this.qimenPan = {};//九宫排盘
            this.tianmanDihu = {};//天门地户
            return this;
        }
        ,
        _getOriginDegree: function(){
            return this.originDegree;
        }
        ,
        //地盘
        _dipan: function(){
            if( this.yangDun ){//阳遁局
                for(var i=0,d=this.jushu;i<9;i++,d++){
                    var gong = _8GUA[d-1];
                    this.qimenPan[gong] = {};
                    this.qimenPan[gong].dipan = _3Q6Y[i];
                    if( gong!="中" ){
                        this.qimenPan[gong].dipan12 = ZHANG_SHENG_12[_3Q6Y[i]][gong];
                    }
                    if( d>=9) d = 0;
                }
            }else{//阴遁局
                for(var i=0,d=this.jushu;i<9;i++,d--){
                    var gong = _8GUA[d-1];
                    this.qimenPan[gong] = {};
                    this.qimenPan[gong].dipan = _3Q6Y[i];
                    if( gong!="中" ){
                        this.qimenPan[gong].dipan12 = ZHANG_SHENG_12[_3Q6Y[i]][gong];
                    }
                    if( d<=1) d = 10;
                }
            }
            if( this.qimenPan["中"].dipan ){
                this.qimenPan["坤"].dipanJi = this.qimenPan["中"].dipan;
                this.qimenPan["坤"].dipanJi12 =  ZHANG_SHENG_12[this.qimenPan["中"].dipan]["坤"];
            }
            return this;
        }
        ,
        //旬首
        _xunhead: function(){
            var that = this;
            var hourCol = this.isKepan?(this.keZhu.join("")):(this.shiZhu.join(""));
            for(var key in _XUNHEAD){
                if(_XUNHEAD[key].indexOf(hourCol)>-1){
                    this.xunhead = key;
                    break;
                }
            }
            return this;
        }
        ,
        //值符&值使
        _zhifuZhishi: function(){
            for(var key in this.qimenPan){
                if( this.qimenPan[key].dipan == this.xunhead){
                    var idx = _8GUA.indexOf(key);
                    this.zhifu = _9STAR[idx];
                    if(idx==4) idx = 1;//中宫转寄宫
                    this.zhishi = _8MEN[idx];
                    break;
                }
            }
            return this;
        }
        ,
        //八神
        _8shen: function(){
            var hourGan = this.isKepan?this.keZhu[0]:this.shiZhu[0];//时干
            for(var key in this.qimenPan){
                if( this.qimenPan[key].dipan == (hourGan=="甲"?this.xunhead:hourGan) ){//找到时干对应的地盘落宫
                    if( this.yangDun ){
                        var idx = _8GUA_S.indexOf(key=="中"?"坤":key);
                        for( var i=idx,j=0;i<8;i++,j++ ){
                            this.qimenPan[_8GUA_S[i]].bashen = {};
                            this.qimenPan[_8GUA_S[i]].bashen = _8SHEN_S[j];
                            if( _8SHEN_S[j]=="符" )
                                this.zhifuGong = _8GUA_S[i];
                        }
                        if( idx>0 ){
                            for(var i=0,j=8-idx;i<idx;i++,j++){
                                this.qimenPan[_8GUA_S[i]].bashen = _8SHEN_S[j];
                                if( _8SHEN_S[j]=="符" )
                                this.zhifuGong = _8GUA_S[i];
                            }
                        }
                    }else{
                        var idx = _8GUA_N.indexOf(key=="中"?"坤":key);
                        for( var i=idx,j=0;i<8;i++,j++ ){
                            this.qimenPan[_8GUA_N[i]].bashen = {};
                            this.qimenPan[_8GUA_N[i]].bashen = _8SHEN_S[j];
                            if( _8SHEN_N[j]=="符" )
                                this.zhifuGong = _8GUA_N[i];
                        }
                        if( idx>0 ){
                            for(var i=0,j=8-idx;i<idx;i++,j++){
                                this.qimenPan[_8GUA_N[i]].bashen = {};
                                this.qimenPan[_8GUA_N[i]].bashen = _8SHEN_S[j];
                                if( _8SHEN_N[j]=="符" )
                                this.zhifuGong = _8GUA_N[i];
                            }
                        }
                    }
                    break;
                }
            }
            return this;
        }
        ,
        //天盘&九星
        _tianpanJiuxing: function(){
            var hourGan = this.isKepan?this.keZhu[0]:this.shiZhu[0];//时干
            var dipan = [];
            var midx = -1;
            for(var key in this.qimenPan){
                if( this.qimenPan[key].dipan == this.xunhead ){//找到旬首落宫对应的地盘
                    var idx = _8GUA_S.indexOf(key);
                    if( key=="中") {
                        idx = _8GUA_S.indexOf("坤");
                    }
                    midx = idx;
                    for(var i=idx;i<8;i++){
                        dipan.push(this.qimenPan[_8GUA_S[i]].dipan);
                    }
                    if( idx>0 ){
                        for(var i=0;i<idx;i++){
                            dipan.push(this.qimenPan[_8GUA_S[i]].dipan);
                        }
                    }
                    break;
                }
            }
            for(var key in this.qimenPan){ //天盘
                if( this.qimenPan[key].dipan == (hourGan=="甲"?this.xunhead:hourGan) ){//找到时干对应的地盘落宫
                    var idx = _8GUA_S.indexOf(key);
                    if( key=="中") {
                        idx = _8GUA_S.indexOf("坤");
                    }
                    
                    for(var i=idx;i<8;i++,j++){
                        this.qimenPan[_8GUA_S[i]].tianpan = {};
                        this.qimenPan[_8GUA_S[i]].tianpan = dipan.shift();
                        if( _8GUA_S[i]!="中" ){
                            this.qimenPan[_8GUA_S[i]].tianpan12 = ZHANG_SHENG_12[this.qimenPan[_8GUA_S[i]].tianpan][_8GUA_S[i]];
                        }                        
                        if( this.qimenPan[_8GUA_S[i]].tianpan==this.qimenPan["坤"].dipan ){
                            this.qimenPan[_8GUA_S[i]].tianpanJi = this.qimenPan["中"].dipan;
                            this.qimenPan[_8GUA_S[i]].tianpanJi12 = ZHANG_SHENG_12[this.qimenPan[_8GUA_S[i]].tianpanJi][_8GUA_S[i]];
                        }
                    }
                    if( idx>0 ){
                        for(var i=0;i<idx;i++,j++){
                            this.qimenPan[_8GUA_S[i]].tianpan = {};
                            this.qimenPan[_8GUA_S[i]].tianpan = dipan.shift();
                            if( _8GUA_S[i]!="中" ){
                                this.qimenPan[_8GUA_S[i]].tianpan12 = ZHANG_SHENG_12[this.qimenPan[_8GUA_S[i]].tianpan][_8GUA_S[i]];
                            }  
                            if( this.qimenPan[_8GUA_S[i]].tianpan==this.qimenPan["坤"].dipan ){
                                this.qimenPan[_8GUA_S[i]].tianpanJi = this.qimenPan["中"].dipan;
                                this.qimenPan[_8GUA_S[i]].tianpanJi12 = ZHANG_SHENG_12[this.qimenPan[_8GUA_S[i]].tianpanJi][_8GUA_S[i]];
                            }
                        }
                    }
                    break;
                }
            }
            for( var key in this.qimenPan ){ //九星
                if( this.qimenPan[key].dipan == (hourGan=="甲"?this.xunhead:hourGan) ){//找到时干对应的地盘落宫
                    idx = _8GUA_S.indexOf(key);
                    if( key=="中") {
                        idx = _8GUA_S.indexOf("坤");
                    }
                    var arr1 = _9STAR_S.slice(midx);
                    var arr2 = _9STAR_S.slice(0,midx);
                    var arr = arr1.concat(arr2);
                    var j = 0;
                    for(var i=idx,j=0;i<8;i++,j++){
                        this.qimenPan[_8GUA_S[i]].jiuxing = arr[j];
                    }
                    if( idx>0 ){
                        for(var i=0;i<idx;i++,j++){
                            this.qimenPan[_8GUA_S[i]].jiuxing = arr[j];
                        }
                    }
                    break;
                }
            }
            return this;
        }
        ,
        //八门
        _8men: function(){
            var hourCol = this.isKepan?(this.keZhu.join("")):(this.shiZhu.join(""));
            for(var key in this.qimenPan){
                if( this.qimenPan[key].dipan == this.xunhead ){//找到旬首落宫对应的地盘
                    var $8gua = _8GUA;
                    if( !this.yangDun ){//阴遁局，反查
                        $8gua = _8GUA.join("").split("").reverse();
                    }
                    var idx = $8gua.indexOf(key); //旬首落宫
                    var xidx = _XUNHEAD[this.xunhead].indexOf(hourCol);//时柱在旬首表的位置
                    var mgidx = idx+xidx;
                    if( mgidx > 8 ) {
                        mgidx = mgidx%9;
                    }
                    this.zhishiGong = $8gua[mgidx];//值使门落宫
                    if( mgidx==4 ) mgidx = 1; //中宫转寄宫

                    var idx = _8GUA_S.indexOf($8gua[mgidx])
                    if( !this.yangDun && this.zhishiGong=="中" ){
                        idx = _8GUA_S.indexOf("坤");
                    }
                    var midx = _8GUA_S.indexOf(key=="中"?"坤":key);//门落宫起始位置
                    var j = midx;
                    for( var i=idx;i<8;i++,j++ ) {
                        if(j>=8)j=0;
                        this.qimenPan[_8GUA_S[i]].men = _8MEN_S[j];
                    }
                    if( idx>0 ){
                        for( var i=0;i<idx;i++,j++ ) {
                            if(j>=8)j=0;
                            this.qimenPan[_8GUA_S[i]].men = _8MEN_S[j];
                        }
                    }
                    break;
                }
            }
            return this;
        }
        ,
        //隐干
        _yingan: function(){
            var hourGan = this.isKepan?this.keZhu[0]:this.shiZhu[0];
            var isFuyin = this.qimenPan["乾"].tianpan == this.qimenPan["乾"].dipan;
            var isFullFuyin = isFuyin && this.qimenPan["坎"].men == "休" && this.qimenPan["坎"].jiuxing == "蓬";
            var isZongGong = this.qimenPan["中"].dipan==hourGan;
            var qiyi = _3Q6Y;
            if ( !this.yangDun ){
                qiyi = _3Q6Y.join("").split("").reverse();
            }
            if( !isFuyin ){ //非伏吟局
                this.__yinggan1();
                return this;
            }else if( isFuyin &&  hourGan=="甲" && this.zhishiGong!="中" ){//伏吟盘，时干为六甲元帅, 值使未落中宫
                var idx = qiyi.indexOf(hourGan=="甲"?this.xunhead:hourGan);//时干按中5宫算
                var ji = qiyi[idx];
                var arr1 = qiyi.slice(idx+1);
                var arr2 = qiyi.slice(0,idx);
                qiyi = arr1.concat(arr2);
                var j=0;
                for( var i=5;i<9;i++,j++ ){
                    this.qimenPan[_8GUA[i]].yingan = qiyi[j];
                    if( _8GUA[i]=="坤" ){
                        this.qimenPan[_8GUA[i]].yinganJi = ji;
                    }
                }
                for( var i=0;i<4;i++,j++ ){
                    this.qimenPan[_8GUA[i]].yingan = qiyi[j];
                    if( _8GUA[i]=="坤" ){
                        this.qimenPan[_8GUA[i]].yinganJi = ji;
                    }
                }
                return this;
            }else if( ( isFuyin &&  (hourGan=="甲" && this.zhishiGong=="中") ||  /*伏吟盘，时干为六甲元帅, 值使落中宫*/
                (isFullFuyin &&  this.zhishiGong=="中") ) ){ /* 或者全伏吟， 值使落中宫*/
                var idx = qiyi.indexOf(this.qimenPan["坤"].dipan);//坤2宫地盘按中5宫算
                var ji = qiyi[idx];
                var arr1 = qiyi.slice(idx+1);
                var arr2 = qiyi.slice(0,idx);
                qiyi = arr1.concat(arr2);
                var j=0;
                for( var i=5;i<9;i++,j++ ){
                    this.qimenPan[_8GUA[i]].yingan = qiyi[j];
                    if( _8GUA[i]=="坤" ){
                        this.qimenPan[_8GUA[i]].yinganJi = ji;
                    }
                }
                for( var i=0;i<4;i++,j++ ){
                    this.qimenPan[_8GUA[i]].yingan = qiyi[j];
                    if( _8GUA[i]=="坤" ){
                        this.qimenPan[_8GUA[i]].yinganJi = ji;
                    }
                }
                return this;
            }else if( isFullFuyin &&  hourGan!="甲" && this.zhishiGong!="中" ){//全伏吟盘，时干非六甲元帅, 值使未落中宫
                var idx = qiyi.indexOf(hourGan);//时干按中5宫算
                var ji = qiyi[idx];
                var arr1 = qiyi.slice(idx+1);
                var arr2 = qiyi.slice(0,idx);
                qiyi = arr1.concat(arr2);
                var j=0;
                for( var i=5;i<9;i++,j++ ){
                    this.qimenPan[_8GUA[i]].yingan = qiyi[j];
                    if( _8GUA[i]=="坤" ){
                        this.qimenPan[_8GUA[i]].yinganJi = ji;
                    }
                }
                for( var i=0;i<4;i++,j++ ){
                    this.qimenPan[_8GUA[i]].yingan = qiyi[j];
                    if( _8GUA[i]=="坤" ){
                        this.qimenPan[_8GUA[i]].yinganJi = ji;
                    }
                }
                return this;
            }else{ //其他情况，按普通局
                this.__yinggan1();
            }
        
            return this;
        }
        ,
        __yinggan1: function(){
            var gans = [], tp,tpj;
            var hourGan = this.isKepan?this.keZhu[0]:this.shiZhu[0];
            for(var key in this.qimenPan){
                if( this.qimenPan[key].tianpan == hourGan || this.qimenPan[key].tianpanJi == hourGan ){//找到旬首落宫对应的地盘(非伏吟局)
                        var idx = _8GUA_S.indexOf(key);
                    if( key == "中") {
                        idx = _8GUA_S.indexOf("坤");
                    }
                    for(var i=idx;i<8;i++){
                        gans.push(this.qimenPan[_8GUA_S[i]].tianpan);
                        if( !!this.qimenPan[_8GUA_S[i]].tianpanJi ){
                            tp = this.qimenPan[_8GUA_S[i]].tianpan;
                            tpj = this.qimenPan[_8GUA_S[i]].tianpanJi;
                        }
                    }
                    if( idx>0 ){
                        for(var i=0;i<idx;i++){
                            gans.push(this.qimenPan[_8GUA_S[i]].tianpan);
                            if( !!this.qimenPan[_8GUA_S[i]].tianpanJi ){
                                tp = this.qimenPan[_8GUA_S[i]].tianpan;
                                tpj = this.qimenPan[_8GUA_S[i]].tianpanJi;
                            }
                        }
                    }
                    break;
                }
            }
            var idx = _8GUA_S.indexOf(this.zhishiGong=="中"?"坤":this.zhishiGong);
            for(var i=idx,j=0;i<8;i++,j++){
                this.qimenPan[_8GUA_S[i]].yingan = gans[j];
                if( gans[j]==tp ){
                    this.qimenPan[_8GUA_S[i]].yinganJi = tpj;
                }
            }
            if( idx>0 ){
                for(var i=0,j=8-idx;i<idx;i++,j++){
                    this.qimenPan[_8GUA_S[i]].yingan = gans[j];
                    if( gans[j]==tp ){
                        this.qimenPan[_8GUA_S[i]].yinganJi = tpj;
                    }
                }
            }
        }
        ,
        _jixing: function(){
            for(var key in this.qimenPan){
                if( key=="中" ) continue;
                if( key=="艮" && "庚".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_jixing = "jixing";
                }else if( key=="震" && "戊".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_jixing = "jixing";
                }else if( key=="巽" && "壬癸".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_jixing = "jixing";
                }else if( key=="离" && "辛".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_jixing = "jixing";
                }else if( key=="坤" && "己".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_jixing = "jixing";
                }
                if( key=="艮" && "庚".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_jixing = "jixing";
                }else if( key=="震" && "戊".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_jixing = "jixing";
                }else if( key=="巽" && "壬癸".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_jixing = "jixing";
                }else if( key=="离" && "辛".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_jixing = "jixing";
                }else if( key=="坤" && "己".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_jixing = "jixing";
                }
                if( key=="艮" && "庚".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_jixing = "jixing";
                }else if( key=="震" && "戊".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_jixing = "jixing";
                }else if( key=="巽" && "壬癸".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_jixing = "jixing";
                }else if( key=="离" && "辛".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_jixing = "jixing";
                }else if( key=="坤" && "己".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_jixing = "jixing";
                }
                if( key=="坤" && "己".indexOf(this.qimenPan[key].dipanJi)!=-1 ){
                    this.qimenPan[key].dipanJi_jixing = "jixing";
                }
            }
            return this;
        }
        ,
        _menpo: function(){
            for(var key in this.qimenPan){
                if( key=="中" ) continue;
                if( key=="乾" && "景".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="坎" && "生死".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="艮" && "伤杜".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="震" && "开惊".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="巽" && "开惊".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="离" && "休".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="坤" && "伤杜".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }else if( key=="兑" && "景".indexOf(this.qimenPan[key].men)!=-1 ){
                    this.qimenPan[key].men_po = "menpo";
                }
            }
            return this;
        }
        ,
        _rumu: function(){
            for(var key in this.qimenPan){
                if( key=="中" ) continue;
                if( key=="乾" && "乙丙戊".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_rumu = "rumu";
                }else if( key=="艮" && "丁己庚".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_rumu = "rumu";
                }else if( key=="巽" && "辛壬".indexOf(this.qimenPan[key].dipan)!=-1 ){
                    this.qimenPan[key].dipan_rumu = "rumu";
                }else if( key=="坤" && ((this.zhifuGong=="坤"?this.xunhead:"")+"癸").indexOf(this.qimenPan[key].dipan)!=-1 ){//甲癸
                    this.qimenPan[key].dipan_rumu = "rumu";
                }
                if( key=="乾" && "乙丙戊".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_rumu = "rumu";
                }else if( key=="艮" && "丁己庚".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_rumu = "rumu";
                }else if( key=="巽" && "辛壬".indexOf(this.qimenPan[key].tianpan)!=-1 ){
                    this.qimenPan[key].tianpan_rumu = "rumu";
                }else if( key=="坤" && ((this.zhifuGong=="坤"?this.xunhead:"")+"癸").indexOf(this.qimenPan[key].tianpan)!=-1 ){//甲癸
                    this.qimenPan[key].tianpan_rumu = "rumu";
                }
                if( key=="乾" && "乙丙戊".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_rumu = "rumu";
                }else if( key=="艮" && "丁己庚".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_rumu = "rumu";
                }else if( key=="巽" && "辛壬".indexOf(this.qimenPan[key].tianpanJi)!=-1 ){
                    this.qimenPan[key].tianpanJi_rumu = "rumu";
                }else if( key=="坤" && ((this.zhifuGong=="坤"?this.xunhead:"")+"癸").indexOf(this.qimenPan[key].tianpanJi)!=-1 ){//甲癸
                    this.qimenPan[key].tianpanJi_rumu = "rumu";
                }
                if( key=="坤" && ((this.zhifuGong=="坤"?this.xunhead:"")+"癸").indexOf(this.qimenPan[key].dipanJi)!=-1 ){//甲癸
                    this.qimenPan[key].dipanJi_rumu = "rumu";
                }
            }
            return this;
        }
        ,
        _ma: function(){
            var hourZhi = this.isKepan?this.keZhu[1]:this.shiZhu[1];//时支
            if( "亥卯未".indexOf(hourZhi)!=-1 ){
                this.qimenPan["巽"].ma = true;
                this.maxing = "巳";
            }else if( "申子辰".indexOf(hourZhi)!=-1 ){
                this.qimenPan["艮"].ma = true;
                this.maxing = "寅";
            }else if( "寅午戌".indexOf(hourZhi)!=-1 ){
                this.qimenPan["坤"].ma = true;
                this.maxing = "申";
            }else if( "巳酉丑".indexOf(hourZhi)!=-1 ){
                this.qimenPan["乾"].ma = true;
                this.maxing = "亥";
            }
            
            return this;
        }
        ,
        _kongwang: function(){
            if( this.xunhead=="戊" ){
                this.qimenPan["乾"].kongwang = true;
            }else if( this.xunhead=="癸" ){
                this.qimenPan["坎"].kongwang = true;
                this.qimenPan["艮"].kongwang = true;
            }else if( this.xunhead=="壬" ){
                this.qimenPan["艮"].kongwang = true;
                this.qimenPan["震"].kongwang = true;
            }else if( this.xunhead=="辛" ){
                this.qimenPan["巽"].kongwang = true;
            }else if( this.xunhead=="庚" ){
                this.qimenPan["离"].kongwang = true;
                this.qimenPan["坤"].kongwang = true;
            }else if( this.xunhead=="己" ){
                this.qimenPan["坤"].kongwang = true;
                this.qimenPan["兑"].kongwang = true;
            }
            return this;
        }
        ,
        _tianmendihu: function(){
            var shiZhi = this.bazi.getTimeZhi();
            var idx = this.isKepan?_12DIZHI.indexOf(this.keZhu[1]):_12DIZHI.indexOf(shiZhi);
            var yjIdx = _12YUEJIANG.indexOf(this.yueJiang);
            var yuejiangList  = CircularList(_12YUEJIANG, yjIdx);
            var yuejiangNameList  = CircularList(_12YUEJIANGNAME, yjIdx);
            var jianchuList  = CircularList(_12JIANCHU, 0);
            for( var i=idx;i<12;i++ ){
                var dz = _12DIZHI[i];
                this.tianmanDihu[dz] = {};
                this.tianmanDihu[dz].yueJiang = yuejiangList.next();
                this.tianmanDihu[dz].yueJiangName = yuejiangNameList.next();
                this.tianmanDihu[dz].jianChu = jianchuList.next();
            }
            for( var i=0;i<idx;i++ ){
                var dz = _12DIZHI[i];
                this.tianmanDihu[dz] = {};
                this.tianmanDihu[dz].yueJiang = yuejiangList.next();
                this.tianmanDihu[dz].yueJiangName = yuejiangNameList.next();
                this.tianmanDihu[dz].jianChu = jianchuList.next();
            }
            return this;
        }
        ,

        //排阴盘奇门
        paipan: function(datetime, isman, realsun, diqu, wanzishi, isKepan, jushu, degree){
            this.init(datetime, isman, realsun, diqu, wanzishi, isKepan, jushu, degree);
            this._dipan()._xunhead()._zhifuZhishi()._8shen()
            ._tianpanJiuxing()._8men()._yingan()._menpo()._jixing()._rumu()._ma()._kongwang()._tianmendihu();
            this.qimenPan.tmdh = this.tianmanDihu;

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
                "tianmenDihu": this.tianmanDihu,
                "jieqi": this.lunar.getPrevJieQi(false).getName()+" ~ " + this.lunar.getNextJieQi(false).getName(),
                "yangDun": this.yangDun,
                "yueJiang": this.yueJiang,
                "yueJiangName": this.yueJiangName,
                "jushu": this.jushu,
                "maxing": this.maxing,
                "xunhead": XUNHEAD[this.xunhead],
                "kongwang": KONGWANG[this.xunhead],
                "zhifu": "天"+this.zhifu,
                "zhishi": this.zhishi+"门",
                "zhifuGong": this.zhifuGong,
                "zhifuGongNum": _8GUA.indexOf(this.zhifuGong)+1,
                "zhishiGong": this.zhishiGong,
                "zhishiGongNum": _8GUA.indexOf(this.zhishiGong)+1,
                "qimenPan": this.qimenPan,
                "shanxiang": this.shanxiang,
            };
        },

        //上一局
        prevPaipan: function(){
            if( !this.isShanxiang ){
                var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
                var aDate = null;
                if( this.isKepan ){
                    date.setMinutes(date.getMinutes()-10);
                    aDate = date;
                }else{
                    date.setHours(date.getHours()-2);
                    aDate = date;
                }
                return this.paipan(aDate, false, this.realsun, this.diqu, this.wanzishi, this.isKepan);
            }else{
                var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
                var degree = this.shanxiang.degree - 5;
                if( degree<0 ) degree = 0;
                return this.paipan(date, false, this.realsun, this.diqu, this.wanzishi, this.isKepan, 0, degree);
            }
        },
        //当前
        nowPaipan: function(){
            if( !this.isShanxiang ){
                var aDate = new Date();
                return this.paipan(aDate, false, this.realsun, this.diqu, this.wanzishi, this.isKepan);
            }else{
                var aDate = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
                var degree = parseInt(this._getOriginDegree().substring(1), 10);
                return this.paipan(aDate, false, this.realsun, this.diqu, this.wanzishi, false, 0, degree);
            }
            
        },
        //下一局
        nextPaipan: function(){
            if( !this.isShanxiang ){
                var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
                var aDate = null;
                if( this.isKepan ){
                    date.setMinutes(date.getMinutes()+10);
                    aDate = date;
                }else{
                    date.setHours(date.getHours()+2);
                    aDate = date;
                }
                return this.paipan(aDate, false, this.realsun, this.diqu, this.wanzishi, this.isKepan);
            }else{
                var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
                var degree = this.shanxiang.degree + 5;
                if( degree>=360 ) degree = 0;
                return this.paipan(date, false, this.realsun, this.diqu, this.wanzishi, this.isKepan, 0, degree);
            }
        },
        //自选局
        customPaipan: function(js){
            var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            return this.paipan(date, false, this.realsun, this.diqu, this.wanzishi, this.isKepan, js);
        },

    };

    exports('qimen', qimenObj);


})