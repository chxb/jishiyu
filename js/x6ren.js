// 道家小六壬排盘
layui.define(function (exports) {


    // 固定六宫（地盘基础宫位）
    const palaces = ["大安", "留连", "速喜", "赤口", "小吉", "空亡"];
    // 神盘固定顺序（青龙顺排）
    // const gods = ["青龙", "朱雀", "腾蛇", "白虎", "玄武", "勾陈"];

    // 地支 → 青龙起宫: 寅卯为青龙： 巳午为朱雀； 丑辰为勾陈； 未戌为腾蛇： 申酉为白虎： 亥子为玄武
    const godsRule = {
        寅: "青龙", 卯: "青龙",
        巳: "朱雀", 午: "朱雀",
        丑: "勾陈", 辰: "勾陈",
        未: "腾蛇", 戌: "腾蛇",
        申: "白虎", 酉: "白虎",
        亥: "玄武", 子: "玄武"
    };
    // 时辰 => 地支
    const timeToBranch = [
        "子", "丑", "寅", "卯", "辰", "巳",
        "午", "未", "申", "酉", "戌", "亥"
    ];
    // 宫位五行
    const wuxing = {
        "大安": "木", "留连": "土", "速喜": "火", "赤口": "金", "小吉": "水", "空亡": "土"
    }
    // 星五行
    const xingWuxin = {
        "辅木": "木", 
        "英火": "火", 
        "芮土": "土",
        "柱金": "金", 
        "蓬水": "水", 
        "任天": ""
    }


    /**
     * 核心工具：顺时针计数（起点算1）
     * @param {string} start 起始宫位
     * @param {number} step 步数
     * @returns {string} 落点宫位
     */
    function countPalace(start, step) {
        const startIdx = palaces.indexOf(start);
        const targetIdx = (startIdx + step - 1) % 6;
        return palaces[targetIdx];
    }

    /**
     * 排地盘：月上起日 → 日上起时
     * @param {number} month 农历月 / 数字1
     * @param {number} day 农历日 / 数字2
     * @param {number} time 时辰(1-12) / 数字3
     * @returns 月、日、时宫
     */
    function getEarthPlate(month, day, time) {
        if( month <= 0 ){
            const monthPalace = "";
            const dayPalace = countPalace("大安", day);
            const timePalace = countPalace(dayPalace, time);
            return { monthPalace, dayPalace, timePalace };
        }
        const monthPalace = countPalace("大安", month);
        const dayPalace = countPalace(monthPalace, day);
        const timePalace = countPalace(dayPalace, time);
        return { monthPalace, dayPalace, timePalace };
    }


    const BRANCH_WUXING = {
        子: '水', 亥: '水',
        寅: '木', 卯: '木',
        巳: '火', 午: '火',
        申: '金', 酉: '金',
        辰: '土', 戌: '土', 丑: '土', 未: '土'
    };
    const WUXING_RELATION = {
        木: { 生: '火', 克: '土', 被克: '金', 被生: '水' },
        火: { 生: '土', 克: '金', 被克: '水', 被生: '木' },
        土: { 生: '金', 克: '水', 被克: '木', 被生: '火' },
        金: { 生: '水', 克: '木', 被克: '火', 被生: '土' },
        水: { 生: '木', 克: '火', 被克: '土', 被生: '金' }
    };
    // 找“下一个土地支”
    function findNextEarthPalace(palacesBranch, startPalace) {
        const startIdx = palaces.indexOf(startPalace);

        for (let i = 1; i <= palaces.length; i++) {
            const nextPalace = palaces[(startIdx + i) % palaces.length];
            const branch = palacesBranch[nextPalace];
            const element = BRANCH_WUXING[branch];

            if (element === '土') {
                return nextPalace;
            }
        }
    }

    /**
     * 排人盘（六亲）：以时宫为我
     * @param {string} palacesBranch 地支对应六宫映射
     * @param {string} timePalace 时宫
     * @returns 六亲映射
     */
    function getPeoplePlate(palacesBranch, timePalace) {
        const people = {};

        const myBranch = palacesBranch[timePalace];
        const myElement = BRANCH_WUXING[myBranch];

        // ⭐ 找“唯一兄弟宫位”
        const brotherPalace = myElement === '土'
            ? null
            : findNextEarthPalace(palacesBranch, timePalace);

        palaces.forEach((palace) => {
            const branch = palacesBranch[palace];
            const element = BRANCH_WUXING[branch];

            let relation;

            // ⭐ 新兄弟规则（核心）
            if (
                (myElement === '土' && element === '土') ||
                (myElement !== '土' && palace === brotherPalace)
            ) {
                relation = '兄弟';
            }
            else if (WUXING_RELATION[myElement].生 === element) {
                relation = '子孙';
            }
            else if (WUXING_RELATION[myElement].克 === element) {
                relation = '妻财';
            }
            else if (WUXING_RELATION[myElement].被克 === element) {
                relation = '官鬼';
            }
            else if (WUXING_RELATION[myElement].被生 === element) {
                relation = '父母';
            }
            else if (element === myElement) {
                // 是否保留“同类兄弟”，看你体系
                relation = '兄弟';
            }

            if (palace === timePalace) {
                relation = '自身';
            }

            people[palace] = relation;
        });

        return people;
    }

    /**
     * 排神盘
     * @param {string} palacesBranch 宫位地支
     * @returns 六神映射
     */
    function getGodPlate(palacesBranch) {
        // 根据宫位地支，按godsRule关系排神盘
        const map = {};
        palaces.forEach((p, i) => {
            map[p] = godsRule[palacesBranch[p]];
        });
        return map;
    }

    /**
     * 排天盘（地支隔位顺排）
     * @param {string} timePalace 时宫
     * @param {string} timeBranch 时支
     * @returns 天盘地支
     */
    function getHeavenPlate(timePalace, timeBranch) {
        const fixedBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        const branchStartIdx = fixedBranches.indexOf(timeBranch); // 起始地支
        const startIdx = palaces.indexOf(timePalace); // 起始宫位
        const heaven = {};
        palaces.forEach((palace, idx) => {
            // 计算宫位偏移（相对于起始宫）
            const offset = (idx - startIdx + palaces.length) % palaces.length;
            // 每宫推进2个地支
            const branchIdx = (branchStartIdx + offset * 2) % 12;
            heaven[palace] = fixedBranches[branchIdx];
        });

        return heaven;
    }

    /**
     * 排五星， 以日落宫位为准顺起五星，五星顺序为：木星，火星，土星，金星，水星，天空
     */
    function getStarPlate(dayPalace) {
        const stars = ["辅木", "英火", "芮土", "柱金", "蓬水", "任天"];
        const startIdx = palaces.indexOf(dayPalace);
        // 根据宫位地支，按godsRule关系排五星盘
        const map = {};
        palaces.forEach((p, i) => {
            const offset = (i - startIdx + palaces.length) % palaces.length;
            map[p] = stars[offset];
        });
        return map;
    }

    /**
     * 给宫位打标
     * @param {*} monthPalace 月宫
     * @param {*} dayPalace 日宫
     * @param {*} timePalace 时宫
     * @returns 
     */
    function markPalaces(monthPalace, dayPalace, timePalace) {
        const result = {};

        // 初始化
        palaces.forEach(palace => {
            result[palace] = [];
        });

        // 按顺序打标
        palaces.forEach(palace => {
            if (palace === monthPalace) {
                result[palace].push('月');
            }
            if (palace === dayPalace) {
                result[palace].push('日');
            }
            if (palace === timePalace) {
                result[palace].push('时');
            }
        });

        return result;
    }

    var x6renObj = {
        /**
         * 主排盘方法
         * @param {number} year 公历年 
         * @param {number} month 公历月份
         * @param {number} day 公历日
         * @param {number} hour 时
         * @param {number} minute 分
         * @param {number} num 任意数字
         * @returns 完整四盘结果
         */
        paipan: function (year, month, day, hour, minute, num) {
            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
            const yearGZ = this.lunar.getYearInGanZhi();
            const monthGZ = this.lunar.getMonthInGanZhi();
            const dayGZ = this.lunar.getDayInGanZhi();
            const hourGZ = this.lunar.getTimeInGanZhi();
            let siZhu = [yearGZ, monthGZ, dayGZ, hourGZ];

            let juStr = "";
            let m, d, t;
            if (num) {
                // 任意数字排盘
                m = 0;
                d = num%6|6;
                t = timeToBranch.indexOf(hourGZ[1])+1;
                juStr = "数据起课 - "+ num + "+" + hourGZ+"时";
            } else {
                // 时间排盘
                m = Math.abs(this.lunar.getMonth());
                d = this.lunar.getDay();
                t = timeToBranch.indexOf(hourGZ[1])+1;
                juStr = "时间起课 - " + this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese() + "日" + " " + hourGZ[1] + "时";
            }

            // 1. 地盘
            const { monthPalace, dayPalace, timePalace } = getEarthPlate(m, d, t);
            const timeBranch = hourGZ[1];

            // 2. 天盘
            const heaven = getHeavenPlate(timePalace, timeBranch);

            // 3. 人盘（六亲）
            const people = getPeoplePlate(heaven, timePalace);

            // 4. 神盘
            const godsx = getGodPlate(heaven);
            // 5. 五星盘
            const stars = getStarPlate(dayPalace);
            // 6. 打标
            const marks = markPalaces(monthPalace, dayPalace, timePalace);

            // 组装六宫完整信息
            const result = {
                "lunar": this.lunar,
                "solar": this.solar,
                "date": this.solar.getYear() + "年" + this.solar.getMonth() + "月" + this.solar.getDay() + "日" + " " + this.solar.getHour() + "时" + this.solar.getMinute() + "分" + "(" + this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese() +" " + siZhu[3][1] + "时)",
                "jieqi": this.lunar.getPrevJieQi(false).getName() + this.lunar.getPrevJieQi(false).getSolar().toYmdHms().slice(0, -3) + " ~ " + this.lunar.getNextJieQi(false).getName() + this.lunar.getNextJieQi(false).getSolar().toYmdHms().slice(0, -3),
                "ju": juStr,
                "siZhu": siZhu,
                "monthPalace": monthPalace,
                "dayPalace": dayPalace,
                "timePalace": timePalace,
                "timeZhi": timeBranch,
                "self": timePalace,
                "panData": {}
            };

            palaces.forEach(palace => {
                result.panData[palace] = {
                    "zhi": heaven[palace], //天盘地支
                    "gong": palace,     // 六宫宫名
                    "liuqin": people[palace], // 六亲
                    "shen": godsx[palace], // 六神
                    "wuxing": wuxing[palace], // 五行
                    "xing": stars[palace], // 五星
                    "marks": marks[palace].join(''), // 打标
                };
            });
            console.log(result);
            return result;
        }
    }


    exports('x6ren', x6renObj);

});