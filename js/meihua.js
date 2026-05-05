/*
 * 吉时雨 (JiShiYu)
 * Copyright (C) 2026 xianbo.chen@gmail.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the LICENSE file for more details.
 *
 * If you use this software to provide network services (e.g. SaaS, API),
 * you must make your source code available to users.
 *
 * Commercial licensing is available:
 * 📧 xianbo.chen@gmail.com
 */

layui.define(function (exports) {

    const METHOD_TIME = 1; //时间起卦
    const METHOD_NUBMER = 2; //数字起卦
    const METHOD_CUSTOM = 3; //自定义卦

    const _8GUA_CHAR = {
        "乾": "☰",
        "坎": "☵",
        "艮": "☶",
        "震": "☳",
        "巽": "☴",
        "离": "☲",
        "坤": "☷",
        "兑": "☱"
    };

    const _8GUA = [
        "乾",
        "兑",
        "离",
        "震",
        "巽",
        "坎",
        "艮",
        "坤",
    ];

    const _12DIZHI = {
        "子": 1,
        "丑": 2,
        "寅": 3,
        "卯": 4,
        "辰": 5,
        "巳": 6,
        "午": 7,
        "未": 8,
        "申": 9,
        "酉": 10,
        "戌": 11,
        "亥": 12,
    };

    const _64gua = {
        "000000": "坤为地",
        "100000": "山地剥",
        "010000": "水地比",
        "110000": "风地观",
        "001000": "雷地豫",
        "101000": "火地晋",
        "011000": "泽地萃",
        "111000": "天地否",
        "000100": "地山谦",
        "100100": "艮为山",
        "010100": "水山蹇",
        "110100": "风山渐",
        "001100": "雷山小过",
        "101100": "火山旅",
        "011100": "泽山咸",
        "111100": "天山遁",
        "000010": "地水师",
        "100010": "山水蒙",
        "010010": "坎为水",
        "110010": "风水涣",
        "001010": "雷水解",
        "101010": "火水未济",
        "011010": "泽水困",
        "111010": "天水讼",
        "000110": "地风升",
        "100110": "山风蛊",
        "010110": "水风井",
        "110110": "巽为风",
        "001110": "雷风恒",
        "101110": "火风鼎",
        "011110": "泽风大过",
        "111110": "天风姤",
        "000001": "地雷复",
        "100001": "山雷颐",
        "010001": "水雷屯",
        "110001": "风雷益",
        "001001": "震为雷",
        "101001": "火雷噬嗑",
        "011001": "泽雷随",
        "111001": "天雷无妄",
        "000101": "地火明夷",
        "100101": "山火贲",
        "010101": "水火既济",
        "110101": "风火家人",
        "001101": "雷火丰",
        "101101": "离为火",
        "011101": "泽火革",
        "111101": "天火同人",
        "000011": "地泽临",
        "100011": "山泽损",
        "010011": "水泽节",
        "110011": "风泽中孚",
        "001011": "雷泽归妹",
        "101011": "火泽睽",
        "011011": "兑为泽",
        "111011": "天泽履",
        "000111": "地天泰",
        "100111": "山天大畜",
        "010111": "水天需",
        "110111": "风天小畜",
        "001111": "雷天大壮",
        "101111": "火天大有",
        "011111": "泽天夬",
        "111111": "乾为天"
    };



    const hexagrams = {
        "乾": "111",
        "坤": "000",
        "震": "001",
        "巽": "110",
        "坎": "010",
        "离": "101",
        "艮": "100",
        "兑": "011"
    };

    const hexagramColors = {
        "乾": "qian",
        "坤": "kun",
        "震": "zhen",
        "巽": "xun",
        "坎": "kan",
        "离": "li",
        "艮": "gen",
        "兑": "dui"
    };

    var meihuaObj = {

        /**
         * 计算卦象
         * @param {*} upperGua 上卦象
         * @param {*} lowerGua 下卦象
         * @param {*} deltaYao 动爻数，从初爻1开始
         * @returns 卦象
         */
        renderHexagrams: function (upperGua, lowerGua, deltaYao) {
            const upperHex = upperGua;
            const lowerHex = lowerGua;
            const changeLine = deltaYao - 1;
            if (!hexagrams[upperHex] || !hexagrams[lowerHex] || isNaN(changeLine) || changeLine < 0 || changeLine > 5) {
                alert('请输入正确的卦象和变爻数');
                return;
            }

            const upperBinary = hexagrams[upperHex];
            const lowerBinary = hexagrams[lowerHex];
            //本卦
            const originalHex = upperBinary + lowerBinary;
            //互卦
            const mutualHex = originalHex.substring(1, 4) + originalHex.substring(2, 5);
            //变卦
            const changedHex = originalHex.split('').map((bit, index) => (5 - index) === changeLine ? (bit === '1' ? '0' : '1') : bit).join('');
            //错卦
            const cuoHex = originalHex.split('').map((bit, index) => (bit === '1' ? '0' : '1')).join('');
            //综卦
            const zongHex = originalHex.split('').reverse().join('');

            this.guaData = {
                method: this.method,
                upperGua: upperHex,
                lowerGua: lowerHex,
                deltaYao: changeLine,
                baseGua: originalHex,
                huGua: mutualHex,
                bianGua: changedHex,
                cuoGua: cuoHex,
                zongGua: zongHex
            };

            document.getElementById(this.containerId).innerHTML = `
            <div class="meihua-guagap">
                ${this.renderTiyong(deltaYao)}
            </div>
            <div class="meihua-hexagram" id="meihua_bengua" data-guaname="${this.getGuaName(originalHex)}">
                ${this.renderHexagram(originalHex)}
                <div class="meihua-guaname">${this.getGuaName(originalHex)}</div>
                <div class="meihua-guatype">【本卦】</div>
            </div>
            <div class="meihua-guagap">
                ${this.renderYao(deltaYao)}
            </div>
            <div class="meihua-hexagram" data-guaname="${this.getGuaName(mutualHex)}">
                ${this.renderHexagram(mutualHex)}
                <div class="meihua-guaname">${this.getGuaName(mutualHex)}</div>
                <div class="meihua-guatype">【互卦】</div>
            </div>
            <div class="meihua-guagap">
            </div>
            <div class="meihua-hexagram" data-guaname="${this.getGuaName(changedHex)}">
                ${this.renderHexagram(changedHex)}
                <div class="meihua-guaname">${this.getGuaName(changedHex)}</div>
                <div class="meihua-guatype">【变卦】</div>
            </div>
            <div class="meihua-guagap">
            </div>
            <div class="meihua-hexagram" data-guaname="${this.getGuaName(cuoHex)}">
                ${this.renderHexagram(cuoHex)}
                <div class="meihua-guaname">${this.getGuaName(cuoHex)}</div>
                <div class="meihua-guatype">【错卦】</div>
            </div>
            <div class="meihua-guagap">
            </div>
            <div class="meihua-hexagram" data-guaname="${this.getGuaName(zongHex)}">
                ${this.renderHexagram(zongHex)}
                <div class="meihua-guaname">${this.getGuaName(zongHex)}</div>
                <div class="meihua-guatype">【综卦】</div>
            </div>
        `;
        },

        getGuaName: function(guaValue){
            return _64gua[guaValue] || '';
        },

        getTrigramName: function (trigram) {
            return Object.keys(hexagrams).find(key => hexagrams[key] === trigram);
        },

        renderTiyong: function(deltaYao){
            if( deltaYao > 3 ){
                return `<div class='meihua-tiyong'>体</div><div class='meihua-tiyong'>用</div>`;
            }else{
                return `<div class='meihua-tiyong'>用</div><div class='meihua-tiyong'>体</div>`;
            }
        },

        renderYao: function(deltaYao){
            var text = "";
            for(var i=0;i<deltaYao;i++){
                if( i===deltaYao-1 ){
                    text += `<div class='meihua-dongyao'></div>`;
                }else{
                    text += `<div class='meihua-kongyao'></div>`;
                }
            }
            return text;
        },

        renderHexagram: function (trigram) {
            const upperTrigram = trigram.substring(0, 3);
            const lowerTrigram = trigram.substring(3);
            const upperHexName = this.getTrigramName(upperTrigram);
            const lowerHexName = this.getTrigramName(lowerTrigram);

            return trigram.split('').map((bit, index) => {
                const colorClass = index < 3 ? hexagramColors[upperHexName] : hexagramColors[lowerHexName];
                return bit === '1' ? this.renderYang(colorClass) : this.renderYin(colorClass);
            }).reverse().join('');
        },

        renderYang: function (colorClass) {
            return `<div class="meihua-line yang ${colorClass}"></div>`;
        },

        renderYin: function (colorClass) {
            return `<div class="meihua-line meihua-yin ${colorClass}"><div class="meihua-half-line ${colorClass}"></div><div class="meihua-spacer"></div><div class="meihua-half-line ${colorClass}"></div></div>`;
        },

        /**
         * 数字起卦计算
         * @param {Array} digits 一组数字
         * @param {boolean} deltaYaoTime 动爻是否加上时辰
         * @returns 
         */
        calculateDigitsGua: function (digits, deltaYaoTime) {
            const n = digits.length;

            let A, B, C;

            if (n === 1) {
                // 当数组长度为1时
                A = parseInt(digits[0], 10) % 8 || 8;
                B = A;
            } else {
                var half;
                if( n == 2){
                    half = 1;
                }else if( n % 2 === 0){
                    half = Math.floor(n/2);
                }else{
                    half = Math.floor(n/2);
                }

                // 计算前一半的和
                const sum1 = digits.slice(0, half).reduce((acc, num) => acc + parseInt(num,10), 0);

                // 计算后一半的和
                const sum2 = digits.slice(half).reduce((acc, num) => acc + parseInt(num,10), 0);

                // 计算A和B
                A = (sum1>0 && sum1<=8)?sum1:sum1 % 8 || 8;
                B = (sum2>0 && sum2<=8)?sum2:sum2 % 8 || 8;
            }

            // 计算C
            if (deltaYaoTime) {
                const T = this.getLunarHourNumber(new Date());
                C = (A + B + T) % 6 || 6;
            } else {
                C = (A + B) % 6 || 6;
            }

            return { upperGua: A, lowerGua: B, deltaYao: C };
        },

        getLunarHourNumber: function (date) {
            const hour = date.getHours(); // 获取Date对象的小时部分
            // 定义农历时辰对应的数组，索引代表小时区间，值代表农历时辰数
            const lunarHourMap = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 1];
            // 直接通过 hour 访问数组获取农历时辰数
            return lunarHourMap[hour];
        },

        paipan: function (params) {
            var datetime = params.datetime;
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();

            this.containerId = params.containerId; //容器ID

            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
            this.bazi = this.lunar.getEightChar();

            this.nianZhu = [this.bazi.getYearGan(), this.bazi.getYearZhi()];
            this.yueZhu = [this.bazi.getMonthGan(), this.bazi.getMonthZhi()];
            this.riZhu = [this.bazi.getDayGan(), this.bazi.getDayZhi()];
            this.shiZhu = [this.bazi.getTimeGan(), this.bazi.getTimeZhi()];
            this.yearYun = LunarYear.fromYear(this.lunar.getYear()).getYun();

            this.method = params.method;

            switch (params.method) {
                case METHOD_TIME:
                    //起卦方法(月日数为农历)
                    //上卦:(年支数+月数+日数):8 所得余数为上卦
                    //下卦:(年支数+月数+日数+时支数):8 所得余数为下卦
                    //动爻:(年支数+月数+日数+时支数)÷6 所得余数
                    /**
                     * @param {Date} datetime 日期时间对象
                     */
                    var yearNum = _12DIZHI[this.bazi.getYearZhi()];
                    var monthNum = Math.abs(this.lunar.getMonth());
                    var dayNum = this.lunar.getDay();
                    var hourNum = _12DIZHI[this.bazi.getTimeZhi()];
                    var upperNum = (yearNum + monthNum + dayNum) % 8 || 8;
                    var lowerNum = (yearNum + monthNum + dayNum + hourNum) % 8 || 8;
                    var deltaYao = (yearNum + monthNum + dayNum + hourNum) % 6 || 6;
                    this.renderHexagrams(_8GUA[upperNum-1], _8GUA[lowerNum-1], deltaYao);

                    break;
                case METHOD_NUBMER:
                    //起卦算法:
                    //一组数字个数为偶数，则平分为二，以前一半数字之和除以8取余数得上卦，
                    //以后一半数字之和除以8取余数得下卦，上下卦数相加除以6取余数为动爻数。
                    //若一组数其数字个数为奇，划分时前部分数字比后部分少一个数字。
                    //若数字个数仅为1，则上、下卦都用该数字除以8取余数所得。
                    /**
                     * @param {array} digits 一组数字
                     * @param {boolean} deltaYaoTime 动爻是否加上时辰
                     */
                    var result = this.calculateDigitsGua(params.digits.split(""), params.deltaYaoTime);
                    this.renderHexagrams(_8GUA[result.upperGua-1], _8GUA[result.lowerGua-1], result.deltaYao);
                    break;
                case METHOD_CUSTOM:
                    /**
                     * @param {*} upperGua 上卦象
                     * @param {*} lowerGua 下卦象
                     * @param {*} deltaYao 动爻数，从初爻1开始
                     */
                    this.renderHexagrams(params.upperGua, params.lowerGua, params.deltaYao);
                    break;
            }

            return {
                "params": params,
                "method": this.method,
                "date": this.solar.getYear() + "年" + this.solar.getMonth() + "月" + this.solar.getDay() + "日" + " " + this.solar.getHour() + "时" + this.solar.getMinute() + "分" + "(" + this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese() +" " + this.shiZhu[1] + "时)",
                "siZhu": [this.nianZhu, this.yueZhu, this.riZhu, this.shiZhu],
                "solar": this.solar,
                "lunar": this.lunar,
                "jieqi": this.lunar.getPrevJieQi(false).getName() + this.lunar.getPrevJieQi(false).getSolar().toYmdHms().slice(0, -3) + " ~ " + this.lunar.getNextJieQi(false).getName() + this.lunar.getNextJieQi(false).getSolar().toYmdHms().slice(0, -3),
                "guaData": this.guaData,
            };


        }

    }

    exports('meihua', meihuaObj);

})