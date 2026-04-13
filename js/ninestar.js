layui.define(['realsuntime'], function (exports) {

    const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const YUEJIAN = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
    const GONG_NAME = ["中", "乾", "兑", "艮", "离", "坎", "坤", "震", "巽"];
    const GONG_NAME2 = ["中", "巽", "震", "坤", "坎", "离", "艮", "兑", "乾"];
    const START_NUMBER = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const START_CODES = ["一","二","三","四","五","六","七","八","九"];
    const START_NAMES = ["一白", "二黑", "三碧", "四绿", "五黄", "六白", "七赤", "八白", "九紫"];

    const HELPER ={
        "一白贪狼星":"吉星。五行属水。一白星在得令的时候，代表官升、名气、中状元、官运和财运。失令的时候，此星为桃花劫，破财损家，甚至性病、绝症，异乡流亡。",
        "二黑巨门星":"凶星。五行属土。二黑星代表病符。此星在得令的时候并非病符，代表位列尊崇，能成霸业。但此星失令的时候，是一极大凶星，破财损家，代表死亡绝症、破财横祸，与五黄星并列为最凶之星。此星亦代表招来阴灵。",
        "三碧禄存星":"凶星。五行属木。三碧星代表是非。此星在得令时代表因口材而成名，大利律师、法官及鬼才等职。但此星失令的时候，代表是非官非，破财招刑。",
        "四绿文曲星":"吉星。五行属木。文曲星在得令的时代表文化艺术、才华、文思敏捷。但失令时为桃花劫星必招酒色之祸。",
        "五黄廉贞星":"凶星。五行属土。廉贞星得令时代表位处终极、威崇无比，如皇帝之最尊最贵。但此星失令的时，称为五黄煞又名正关煞，代表死亡绝症、血光之灾，家破人亡。此星亦必招邪灵之物。",
        "六白武曲星":"吉星。五行属金。六白是偏财星，与一白、八白合称三大财星。六白得令时丁财两旺，失令时，为失财星，可令倾家荡产。",
        "七赤破军星":"凶星。五行属金。七赤星当运的时候，大利以口才工作的人，包括歌星、演说家、占卜家等，大利通讯传播。但七赤星退运时候，代表口舌是非，刀光剑影，世界大战。又代表火险、及身体上呼吸、肺部的毛病。",
        "八白左辅星":"吉星。五行属土。八白星得令时为太白财星，能带来功名富贵。田宅科发，为九星中第一吉星。此星失令的时，为失财失义，瘟疫流行，失财于刹间。",
        "九紫右弼星":"吉星。五行属火。九紫星当令时为一级喜庆星及爱情星，代表桃花人缘及天乙贵人，大利置业及建筑。但此星失令的时为桃花劫星，损丁破财，亦主火灾、爆炸、心脏病、眼疾、流血等。",
        }

    var ninestarObj = {
        _init: function(datetime, realsun, diqu) {
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            this.realsun = realsun;
            this.wanzishi = false;;
            this.diqu = diqu;
            this.datetime = datetime;
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

            this.nianZhu = [this.bazi.getYearGan(), this.bazi.getYearZhi()];
            this.yueZhu = [this.bazi.getMonthGan(), this.bazi.getMonthZhi()];
            this.riZhu = [this.bazi.getDayGan(), this.bazi.getDayZhi()];
            this.shiZhu = [this.bazi.getTimeGan(), this.bazi.getTimeZhi()];
            this.yearYun = LunarYear.fromYear(this.lunar.getYear()).getYun();

        },

        /**
         * 计算每个宫位的飞星。
         * @param {int} centerStar 中宫飞星数
         * @param {boolean} isClockwise  是否顺逆
         * @returns 
         */
        _assignStars: function (centerStar, isClockwise) {
            const palaceOrder = GONG_NAME;//isClockwise ? GONG_NAME : GONG_NAME2;
            let stars = [];
            if (isClockwise) {
                for (let i = 0; i < palaceOrder.length; i++) {
                    stars.push((centerStar + i - 1) % 9 + 1);
                }
            } else {
                for (let i = 0; i < palaceOrder.length; i++) {
                    stars.push((centerStar - i - 1 + 9) % 9 + 1);
                }
            }
            const result = {};
            for (let i = 0; i < palaceOrder.length; i++) {
                result[palaceOrder[i]] = stars[i];
            }
            return result;
        },
        
        /**
         * 计算年飞星
         * @param {int} year 年份
         * @returns 
         */
        _getYearStar: function(year) {
            let yearLastTwoDigits = year % 100;
            let starIndex;

            if (year < 2000) {
                let sum = yearLastTwoDigits.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
                if (sum > 10) {
                    sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
                }
                starIndex = (10 - sum) % 9;
                if (starIndex === 0) {
                    starIndex = 9;
                }
            } else {
                let sum = yearLastTwoDigits.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
                if (sum > 9) {
                    sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
                }
                starIndex = (9 - sum) % 9;
                if (starIndex === 0) {
                    starIndex = 9;
                }
            }

            return START_NUMBER[starIndex - 1];
        },

        /**
         * 计算月飞星
         * @param {string} yearZhi 
         * @param {int} lunarMonth 
         * @returns 
         */
        _getMonthStar: function (yearZhi, lunarMonth) {
            const branchGroups = {
                "子": 8, "午": 8, "卯": 8, "酉": 8, // 子午卯酉年
                "寅": 2, "申": 2, "巳": 2, "亥": 2, // 寅申巳亥年
                "辰": 5, "戌": 5, "丑": 5, "未": 5  // 辰戌丑未年
            };

            if (!(yearZhi in branchGroups)) {
                throw new Error("Invalid year branch");
            }

            const startStar = branchGroups[yearZhi];
            const starIndex = (startStar - lunarMonth + 9) % 9;

            return START_NUMBER[starIndex];
        },

        /**
         * 计算日飞星
         * @returns {int}
         */
        _getDayStar: function(){
            let jieQi = this.lunar.getJieQiTable();

            let dongzhi = jieQi["冬至"];//上年的冬至
            let yushui = jieQi["雨水"];//本年的雨水
            let guyu = jieQi["谷雨"];
            let xiazhi = jieQi["夏至"];
            let chushu = jieQi["处暑"];
            let shuangjiang = jieQi["霜降"];
            let dongzhi2 = jieQi["DONG_ZHI"];//本年冬至

            let dongzhiJiazi = this._getJiaziDay(dongzhi);
            let yushuiJiazi = this._getJiaziDay(yushui);
            let guyuJiazi = this._getJiaziDay(guyu);
            let xiazhiJiazi = this._getJiaziDay(xiazhi);
            let chushuJiazi = this._getJiaziDay(chushu);
            let shuangjiangJiazi = this._getJiaziDay(shuangjiang);
            let dongzhiJiazi2 = this._getJiaziDay(dongzhi2);

            function calculateGanzhiNumber(givenNumber, givenGanzhi, direction) {
                // 定义六十甲子数组
                const sixtyGanzhi = [
                    "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
                    "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
                    "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
                    "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
                    "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
                    "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
                ];

                // 找到甲子在六十甲子中的索引
                const jiaziIndex = sixtyGanzhi.indexOf("甲子");

                // 找到给定干支在六十甲子中的索引
                const givenGanzhiIndex = sixtyGanzhi.indexOf(givenGanzhi);

                // 计算从甲子到给定干支的距离
                const distance = (givenGanzhiIndex - jiaziIndex + 60) % 60;

                // 计算给定干支对应的数字
                let finalNumber;
                if (direction === 1) {
                    finalNumber = (givenNumber + distance - 1) % 9 + 1;
                } else if (direction === -1) {
                    finalNumber = (givenNumber - distance - 1 + 9 * 60) % 9 + 1;
                } else {
                    return "无效的顺逆参数";
                }
                return finalNumber;
            }

            if( this.solar.isAfter(dongzhiJiazi)&&this.solar.isBefore(yushuiJiazi)){//1, 冬至
                return calculateGanzhiNumber(1,this.riZhu.join(""),1);
            }else if(this.solar.isAfter(yushuiJiazi)&&this.solar.isBefore(guyuJiazi)){//7, 雨水
                return calculateGanzhiNumber(7,this.riZhu.join(""),1);
            }else if(this.solar.isAfter(guyuJiazi)&&this.solar.isBefore(xiazhiJiazi)){//4， 谷雨
                return calculateGanzhiNumber(4,this.riZhu.join(""),1);
            }else if(this.solar.isAfter(xiazhiJiazi)&&this.solar.isBefore(chushuJiazi)){//9, 夏至
                return calculateGanzhiNumber(9,this.riZhu.join(""),-1);
            }else if(this.solar.isAfter(chushuJiazi)&&this.solar.isBefore(shuangjiangJiazi)){//3, 处暑
                return calculateGanzhiNumber(3,this.riZhu.join(""),-1);
            }else if(this.solar.isAfter(shuangjiangJiazi)&&this.solar.isBefore(dongzhiJiazi2)){//6, 霜降
                return calculateGanzhiNumber(6,this.riZhu.join(""),-1);
            }else{
                return calculateGanzhiNumber(1,this.riZhu.join(""),1);//年尾冬至到下一年的期间
            }
        },

        /**
         * 计算时飞星。
         * @param {int} season 节气，1-夏至,2-冬至
         * @param {string} dizhi 日支
         * @param {string} shicheng 时辰(时支)
         * @returns 
         */
        _getHourStar: function (season, dizhi, shicheng) {
            // 地支分类
            const dizhiGroups = {
                "子午卯酉": ["子", "午", "卯", "酉"],
                "辰戌丑未": ["辰", "戌", "丑", "未"],
                "寅申巳亥": ["寅", "申", "巳", "亥"]
            };
            
            // 获取当前地支组别
            let group;
            for (let key in dizhiGroups) {
                if (dizhiGroups[key].includes(dizhi)) {
                    group = key;
                    break;
                }
            }
            
            // 计算飞星
            function calculateStar(startStar, isReversed, shicheng) {
                const startIndex = START_NUMBER.indexOf(startStar);
                const offset = DIZHI.indexOf(shicheng);
                let starIndex;
                if (isReversed) {
                    starIndex = (startIndex - offset + 9) % 9;
                } else {
                    starIndex = (startIndex + offset) % 9;
                }
                return START_NUMBER[starIndex];
            }
        
            let startStar;
            let isReversed = season === 1;
        
            if (group === "子午卯酉") {
                startStar = isReversed ? 9 : 1;
            } else if (group === "辰戌丑未") {
                startStar = isReversed ? 6 : 4;
            } else if (group === "寅申巳亥") {
                startStar = isReversed ? 3 : 7;
            }
        
            return calculateStar(startStar, isReversed, shicheng);
        },

        _getJiaziDay: function(solar){
            function distanceToNextZi(dizhi) {
                const currentIndex = DIZHI.indexOf(dizhi);
                if (currentIndex === -1) {
                    throw new Error("无效的地支");
                }
                
                const nextZiIndex = DIZHI.indexOf("子");
                let distance = nextZiIndex - currentIndex;
            
                if (distance < 0) {
                    distance += 12;
                }
            
                return distance;
            };

            var lunar = solar.getLunar();
            var bz = lunar.getEightChar();
            var zi = bz.getDayZhi();
            var distance = distanceToNextZi(zi);
            return solar.nextDay(distance);
        },

        /**
         * 夏至后为阳，冬至后为阴
         * @returns {boolean} 
         */
        _isXiazhi: function(){
            var jieQi = this.lunar.getJieQiTable();
            var xiazhi = jieQi["夏至"];
            var dongzhi = jieQi["DONG_ZHI"];
            return this.solar.isAfter(xiazhi) && this.solar.isBefore(dongzhi);
        },
        /**
         * 是否立春
         * @returns 
         */
        _isLichun: function(){
            var jieQi = this.lunar.getJieQiTable();
            var lichun = jieQi["立春"];
            return this.solar.isAfter(lichun);
        },

        paipan: function(datetime, realsun, diqu){
            this._init(datetime, realsun, diqu);
            var isXiazhi = this._isXiazhi();//是否夏至后
            var isLichun = this._isLichun();
            var yearStar = this._getYearStar(this.solar.getYear()-(isLichun?0:1));
            var monthStar = this._getMonthStar(this.bazi.getYearZhi(), YUEJIAN.indexOf(this.bazi.getMonthZhi())+1);
            var dayStar = this._getDayStar();
            var hourStar = this._getHourStar(isXiazhi?1:2, this.bazi.getDayZhi(), this.bazi.getTimeZhi());
            
            var yearStars = this._assignStars(yearStar, true);
            var monthStars = this._assignStars(monthStar, true);
            var dayStars = this._assignStars(dayStar, !isXiazhi);
            var hourStars = this._assignStars(hourStar, !isXiazhi);

            const mergedStars = {};
            GONG_NAME.forEach(palace => {
                mergedStars[palace] = {
                    "year": { "index": yearStars[palace], "name": START_NAMES[yearStars[palace] - 1], "code": START_CODES[yearStars[palace] - 1] },
                    "month": { "index": monthStars[palace], "name": START_NAMES[monthStars[palace] - 1], "code": START_CODES[monthStars[palace] - 1] },
                    "day": { "index": dayStars[palace], "name": START_NAMES[dayStars[palace] - 1], "code": START_CODES[dayStars[palace] - 1] },
                    "hour": { "index": hourStars[palace], "name": START_NAMES[hourStars[palace] - 1], "code": START_CODES[hourStars[palace] - 1] },
                };
            });

            return {
                "date": this.solar.getYear()+"年"+this.solar.getMonth()+"月"+this.solar.getDay()+"日"+" "+this.solar.getHour()+"时"+this.solar.getMinute()+"分"+"("+this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese()+")"+(this.realsun?"(真太阳)":""),
                "siZhu": [this.nianZhu,this.yueZhu,this.riZhu,this.shiZhu],
                "solar": this.solar,
                "lunar": this.lunar,
                "yearYun": this.yearYun,
                "jieqi": this.lunar.getPrevJieQi(false).getName()+" ~ " + this.lunar.getNextJieQi(false).getName(),
                "gongStars": mergedStars,
                "helper": HELPER
            };


        }

    };

    exports('ninestar', ninestarObj);


})