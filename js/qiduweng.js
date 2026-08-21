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

/**
 * 戚都翁未卜先知排盘（时间起课）
 *
 * 规则：
 * 1. 地支顺序：寅、卯、辰、巳、午、未、申、酉、戌、亥、子、丑
 * 2. 农历一月建寅，二月建卯，以此类推
 * 3. 从月地支起（含），顺数农历日数，定位日地支
 * 4. 从日地支起（含），按「水、火、木、金、土」循环，顺数到时辰地支，得五星
 * 5. 时辰为体（地支+本气五行，如巳火），五星为用（如木星）
 * 6. 以农历月建为月令，取体、用的旺相休囚死
 *
 * 例：农历三月初七日巳时
 *   三月→辰；从辰顺数7→戌（日）
 *   从戌起水火木金土，顺数到巳→木星
 *   体=巳火，用=木星
 */
layui.define(function (exports) {

    // 建寅地支序（夏历月建序）
    const DIZHI_ORDER = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];

    // 五星循环
    const WUXING_STARS = ["水", "火", "木", "金", "土"];

    // 五星古名：水辰星、火荧惑、木岁星、金太白、土镇星
    const STAR_ALIAS = {
        水: "辰星",
        火: "荧惑",
        木: "岁星",
        金: "太白",
        土: "镇星"
    };

    const DIZHI_WUXING = {
        子: "水", 亥: "水",
        寅: "木", 卯: "木",
        巳: "火", 午: "火",
        申: "金", 酉: "金",
        辰: "土", 戌: "土", 丑: "土", 未: "土"
    };

    // 月令当令者旺，我生者相，生我者休，克我者囚，我克者死
    const WUXING_SHENG = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
    const WUXING_KE = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };

    const STATE_DESC = {
        旺: "当令得时，气势最盛",
        相: "得令所生，气势次旺",
        休: "生助月令，自身气泄",
        囚: "克制月令，反受其制",
        死: "被月令所克，气势最衰"
    };

    function pad2(n) {
        return (n < 10 ? "0" : "") + n;
    }

    function parseDateTime(year, month, day, hour, minute, second) {
        var date;
        if (year == null || year === "") {
            date = new Date();
        } else if (year instanceof Date) {
            date = year;
        } else if (typeof year === "string") {
            date = new Date(year.replace(/-/g, "/").replace(/[^\d/:\s]/g, ""));
        } else if (typeof year === "object" && year.year != null) {
            return {
                year: year.year,
                month: year.month,
                day: year.day,
                hour: year.hour || 0,
                minute: year.minute || 0,
                second: year.second || 0
            };
        } else {
            return {
                year: year,
                month: month,
                day: day,
                hour: hour || 0,
                minute: minute || 0,
                second: second || 0
            };
        }
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
    }

    function zhiIndex(zhi) {
        return DIZHI_ORDER.indexOf(zhi);
    }

    /**
     * 从起点地支（含）顺数 n 步
     */
    function countZhi(startZhi, n) {
        var idx = zhiIndex(startZhi);
        return DIZHI_ORDER[(idx + n - 1) % 12];
    }

    /**
     * 从日起支到时支（含两端）的步数
     */
    function stepsFromTo(fromZhi, toZhi) {
        return (zhiIndex(toZhi) - zhiIndex(fromZhi) + 12) % 12 + 1;
    }

    /**
     * 旺相休囚死：以月令五行为「我」
     */
    function getWangXiangState(wuxing, yueLingWuxing) {
        if (wuxing === yueLingWuxing) {
            return "旺";
        }
        if (WUXING_SHENG[yueLingWuxing] === wuxing) {
            return "相";
        }
        if (WUXING_SHENG[wuxing] === yueLingWuxing) {
            return "休";
        }
        if (WUXING_KE[wuxing] === yueLingWuxing) {
            return "囚";
        }
        return "死";
    }

    function getTiYongRelation(tiWx, yongWx) {
        if (tiWx === yongWx) {
            return { name: "比和", desc: "体用同类，力量相当" };
        }
        if (WUXING_SHENG[tiWx] === yongWx) {
            return { name: "体生用", desc: "体生气泄于用" };
        }
        if (WUXING_SHENG[yongWx] === tiWx) {
            return { name: "用生体", desc: "用生体，用助体" };
        }
        if (WUXING_KE[tiWx] === yongWx) {
            return { name: "体克用", desc: "体克用，体制服用" };
        }
        return { name: "用克体", desc: "用克体，体受用制" };
    }

    /**
     * 从日地支起安五星，顺布十二地支
     */
    function buildStarPlate(dayZhi) {
        var startIdx = zhiIndex(dayZhi);
        var plate = [];
        var map = {};
        for (var i = 0; i < 12; i++) {
            var zhi = DIZHI_ORDER[(startIdx + i) % 12];
            var star = WUXING_STARS[i % 5];
            var item = {
                zhi: zhi,
                wuxing: DIZHI_WUXING[zhi],
                star: star,
                starName: star + "星",
                starAlias: STAR_ALIAS[star]
            };
            plate.push(item);
            map[zhi] = item;
        }
        return { list: plate, map: map };
    }

    var qiduwengObj = {
        DIZHI_ORDER: DIZHI_ORDER,
        WUXING_STARS: WUXING_STARS,
        STAR_ALIAS: STAR_ALIAS,

        /**
         * 戚都翁排盘
         * @param {number|Date|string|object} [year] 公历年，或 Date，或 "yyyy-MM-dd HH:mm"；缺省为当前时间
         * @param {number} [month] 公历月
         * @param {number} [day] 公历日
         * @param {number} [hour] 时
         * @param {number} [minute] 分
         * @param {number} [second] 秒
         * @returns {object} 排盘结果（可直接 JSON.stringify）
         */
        paipan: function (year, month, day, hour, minute, second) {
            var dt = parseDateTime(year, month, day, hour, minute, second);
            var solar = Solar.fromYmdHms(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second);
            var lunar = solar.getLunar();

            var lunarMonth = Math.abs(lunar.getMonth());
            var lunarDay = lunar.getDay();
            var isLeapMonth = lunar.getMonth() < 0;
            var hourZhi = lunar.getTimeZhi();

            var yearGZ = lunar.getYearInGanZhi();
            var monthGZ = lunar.getMonthInGanZhi();
            var dayGZ = lunar.getDayInGanZhi();
            var hourGZ = lunar.getTimeInGanZhi();

            // 1. 农历月 → 月地支（一月寅、二月卯…）
            var monthZhi = DIZHI_ORDER[lunarMonth - 1];

            // 2. 从月地支起（含），顺数农历日数 → 日地支
            var dayZhi = countZhi(monthZhi, lunarDay);

            // 3. 从日地支起安五星，顺数到时辰地支
            var starPlate = buildStarPlate(dayZhi);
            var hourStarItem = starPlate.map[hourZhi];
            var hourStar = hourStarItem.star;
            var hourSteps = stepsFromTo(dayZhi, hourZhi);

            // 4. 体：时辰地支+本气；用：五星
            var tiZhi = hourZhi;
            var tiWuxing = DIZHI_WUXING[tiZhi];
            var yongWuxing = hourStar;

            // 5. 月令：农历月建五行
            var yueLingZhi = monthZhi;
            var yueLingWuxing = DIZHI_WUXING[yueLingZhi];
            var tiState = getWangXiangState(tiWuxing, yueLingWuxing);
            var yongState = getWangXiangState(yongWuxing, yueLingWuxing);
            var tiYong = getTiYongRelation(tiWuxing, yongWuxing);

            var solarText = solar.getYear() + "年" + solar.getMonth() + "月" + solar.getDay() + "日 "
                + pad2(solar.getHour()) + "时" + pad2(solar.getMinute()) + "分";
            var monthCn = lunar.getMonthInChinese();
            var lunarText = "农历" + monthCn + "月" + lunar.getDayInChinese() + " " + hourZhi + "时";
            var juStr = "时间起课 - " + monthCn + "月" + lunar.getDayInChinese() + "日 " + hourZhi + "时";
            var dateStr = solar.getYear() + "年" + solar.getMonth() + "月" + solar.getDay() + "日 "
                + solar.getHour() + "时" + solar.getMinute() + "分(" + monthCn + "月"
                + lunar.getDayInChinese() + " " + hourZhi + "时)";
            var prevJq = lunar.getPrevJieQi(false);
            var nextJq = lunar.getNextJieQi(false);
            var jieqiStr = prevJq.getName() + prevJq.getSolar().toYmdHms().slice(0, -3)
                + " ~ " + nextJq.getName() + nextJq.getSolar().toYmdHms().slice(0, -3);
            var eightChar = lunar.getEightChar();

            var result = {
                name: "戚都翁",
                method: "时间起课",
                datetime: new Date(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second),
                date: dateStr,
                jieqi: jieqiStr,
                ju: juStr,
                solar: {
                    year: solar.getYear(),
                    month: solar.getMonth(),
                    day: solar.getDay(),
                    hour: solar.getHour(),
                    minute: solar.getMinute(),
                    second: solar.getSecond(),
                    text: solarText,
                    ymdhms: solar.toYmdHms()
                },
                lunar: {
                    year: lunar.getYear(),
                    month: lunarMonth,
                    day: lunarDay,
                    leap: isLeapMonth,
                    yearGanZhi: yearGZ,
                    monthChinese: monthCn,
                    dayChinese: lunar.getDayInChinese(),
                    timeZhi: hourZhi,
                    text: lunarText
                },
                siZhu: [yearGZ, monthGZ, dayGZ, hourGZ],
                xunKong: {
                    year: eightChar.getYearXunKong(),
                    month: eightChar.getMonthXunKong(),
                    day: eightChar.getDayXunKong(),
                    time: eightChar.getTimeXunKong()
                },
                dizhiOrder: DIZHI_ORDER.slice(),
                wuxingStars: WUXING_STARS.slice(),
                monthZhi: {
                    lunarMonth: lunarMonth,
                    leap: isLeapMonth,
                    zhi: monthZhi,
                    wuxing: DIZHI_WUXING[monthZhi],
                    desc: monthCn + "月建" + monthZhi
                },
                dayZhi: {
                    lunarDay: lunarDay,
                    zhi: dayZhi,
                    wuxing: DIZHI_WUXING[dayZhi],
                    count: lunarDay,
                    desc: "从" + monthZhi + "起顺数" + lunarDay + "至" + dayZhi
                },
                hourZhi: {
                    zhi: hourZhi,
                    wuxing: DIZHI_WUXING[hourZhi],
                    star: hourStar,
                    starName: hourStar + "星",
                    starAlias: STAR_ALIAS[hourStar],
                    count: hourSteps,
                    desc: "从" + dayZhi + "起按水火木金土顺数至" + hourZhi + "，得" + hourStar + "星"
                },
                yueLing: {
                    zhi: yueLingZhi,
                    wuxing: yueLingWuxing,
                    name: yueLingZhi + yueLingWuxing + "月",
                    desc: "农历" + monthCn + "月，月令" + yueLingWuxing + "旺"
                },
                ti: {
                    role: "体",
                    zhi: tiZhi,
                    wuxing: tiWuxing,
                    name: tiZhi + tiWuxing,
                    state: tiState,
                    stateDesc: STATE_DESC[tiState]
                },
                yong: {
                    role: "用",
                    xing: yongWuxing,
                    wuxing: yongWuxing,
                    name: yongWuxing + "星",
                    alias: STAR_ALIAS[yongWuxing],
                    state: yongState,
                    stateDesc: STATE_DESC[yongState]
                },
                tiYong: {
                    ti: tiZhi + tiWuxing,
                    yong: yongWuxing + "星（" + STAR_ALIAS[yongWuxing] + "）",
                    tiState: tiState,
                    yongState: yongState,
                    relation: tiYong.name,
                    relationDesc: tiYong.desc,
                    summary: "体" + tiZhi + tiWuxing + tiState + "，用" + yongWuxing + "星" + yongState + "，" + tiYong.name
                },
                plate: starPlate.list.map(function (item) {
                    return {
                        zhi: item.zhi,
                        wuxing: item.wuxing,
                        star: item.star,
                        starName: item.starName,
                        starAlias: item.starAlias,
                        isMonth: item.zhi === monthZhi,
                        isDay: item.zhi === dayZhi,
                        isHour: item.zhi === hourZhi,
                        isTi: item.zhi === tiZhi
                    };
                }),
                process: [
                    lunarText,
                    "月：" + monthCn + "月对应地支「" + monthZhi + "」",
                    "日：从「" + monthZhi + "」起顺数" + lunarDay + "，定位日地支「" + dayZhi + "」",
                    "时：从「" + dayZhi + "」起按水、火、木、金、土循环，顺数至「" + hourZhi + "」时，得「" + hourStar + "星」",
                    "体：" + tiZhi + tiWuxing + "（时辰），用：" + yongWuxing + "星（" + STAR_ALIAS[yongWuxing] + "）",
                    "月令：" + yueLingZhi + yueLingWuxing + "月，体" + tiState + "、用" + yongState
                ]
            };

            return result;
        },

        /**
         * 排盘并返回 JSON 字符串
         */
        paipanJson: function (year, month, day, hour, minute, second) {
            var r = this.paipan(year, month, day, hour, minute, second);
            var copy = {};
            Object.keys(r).forEach(function (key) {
                if (key !== "datetime") {
                    copy[key] = r[key];
                }
            });
            return JSON.stringify(copy);
        }
    };

    exports("qiduweng", qiduwengObj);
});
