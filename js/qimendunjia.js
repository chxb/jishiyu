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
 * 奇门遁甲排盘算法(阳盘)
 * 依赖: lunar-javascript
 */

layui.define(function (exports) {
    const TIAN_GAN = '甲乙丙丁戊己庚辛壬癸';
    const DI_ZHI = '子丑寅卯辰巳午未申酉戌亥';
    const EIGHT_GUA = ['坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离'];
    const CLOCKWISE_EIGHT_GUA = ['坎', '艮', '震', '巽', '离', '坤', '兑', '乾'];
    const DOOR_R = ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门'];
    const STAR_R = ['天蓬', '天任', '天冲', '天辅', '天英', '天禽', '天柱', '天心'];
    const CNUMBER = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const JIEQI_NAME = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

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

    //十天干在每个宫位12长生状态
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

    function jiazi() {
        const result = [];
        for (let i = 0; i < 60; i++) {
            result.push(TIAN_GAN[i % 10] + DI_ZHI[i % 12]);
        }
        return result;
    }

    function multiKeyDictGet(dict, key) {
        for (const [keys, value] of Object.entries(dict)) {
            if (Array.isArray(keys)) {
                if (keys.includes(key)) {
                    return value;
                }
            } else if (typeof keys === 'string') {
                const keyArray = keys.split(',');
                if (keyArray.includes(key)) {
                    return value;
                }
            } else if (keys === key) {
                return value;
            }
        }
        return null;
    }

    function newList(olist, o) {
        const index = olist.indexOf(o);
        if (index === -1) throw new Error('not in list');
        return olist.slice(index).concat(olist.slice(0, index));
    }

    function newListReverse(olist, o) {
        const index = olist.indexOf(o);
        if (index === -1) return olist;
        const result = [];
        for (let i = 0; i < olist.length; i++) {
            result.push(olist[(index - i + olist.length) % olist.length]);
        }
        return result;
    }

    function splitList(lst, chunkSize) {
        const result = [];
        for (let i = 0; i < lst.length; i += chunkSize) {
            result.push(lst.slice(i, i + chunkSize));
        }
        return result;
    }

    const JIEQI_S2T = {
        '谷雨': '谷雨',
        '小满': '小满',
        '芒种': '芒种',
        '处暑': '处暑'
    };

    function jq(year, month, day, hour, minute) {
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        const lunar = solar.getLunar();
        const jieQi = lunar.getPrevJieQi();
        let result = '';
        if (jieQi) {
            if (typeof jieQi === 'string') {
                result = jieQi;
            } else {
                result = jieQi.getName();
            }
        } else {
            const prevJieQi = lunar.getPrevJieQi();
            result = prevJieQi ? prevJieQi.getName() : '';
        }
        return JIEQI_S2T[result] || result;
    }

    function getJieqiStartDate(year, month, day, hour, minute) {
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        const lunar = solar.getLunar();
        const jieQi = lunar.getPrevJieQi();
        if (jieQi) {
            let jqName, jqSolar;
            jqName = jieQi.getName();
            jqSolar = jieQi.getSolar();
            return {
                year: jqSolar.getYear(),
                month: jqSolar.getMonth(),
                day: jqSolar.getDay(),
                hour: jqSolar.getHour(),
                minute: jqSolar.getMinute(),
                jieqi: jqName
            };
        }
        return null;
    }

    function getJieqiStartDate4zhirun(year, month, day, hour, minute) {
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        const lunar = solar.getLunar();
        const jieQi = lunar.getJieQi();
        if (jieQi) {
            let jqName, jqSolar;
            if (typeof jieQi === 'string') {
                jqName = jieQi;
                const currentJq = lunar.getCurrentJieQi();
                jqSolar = currentJq ? currentJq.getSolar() : solar;
            } else {
                jqName = jieQi.getName();
                jqSolar = jieQi.getSolar();
            }
            return {
                year: jqSolar.getYear(),
                month: jqSolar.getMonth(),
                day: jqSolar.getDay(),
                hour: jqSolar.getHour(),
                minute: jqSolar.getMinute(),
                jieqi: jqName
            };
        }
        const prevJieQi = lunar.getPrevJieQi();
        if (prevJieQi) {
            const jqSolar = prevJieQi.getSolar();
            return {
                year: jqSolar.getYear(),
                month: jqSolar.getMonth(),
                day: jqSolar.getDay(),
                hour: jqSolar.getHour(),
                minute: jqSolar.getMinute(),
                jieqi: prevJieQi.getName()
            };
        }
        return null;
    }

    function gangzhi(year, month, day, hour, minute) {
        let adjustedYear = year;
        let adjustedMonth = month;
        let adjustedDay = day;
        if (hour === 23) {
            adjustedDay = day + 1;
        }
        const solar = Solar.fromYmdHms(adjustedYear, adjustedMonth, adjustedDay, hour === 23 ? 0 : hour, minute, 0);
        const lunar = solar.getLunar();
        var curBazi = lunar.getEightChar();
        const yearGZ = curBazi.getYearGan()+curBazi.getYearZhi();
        const monthGZ = curBazi.getMonthGan()+curBazi.getMonthZhi();
        const dayGZ = curBazi.getDayGan()+curBazi.getDayZhi();
        const hourGZ = curBazi.getTimeGan()+curBazi.getTimeZhi();
        return [yearGZ, monthGZ, dayGZ, hourGZ];
    }

    function getXunhead(hourCol){
        for(var key in _XUNHEAD){
            if(_XUNHEAD[key].indexOf(hourCol)>-1){
                return key;
            }
        }
    }

    function kongwang(xunhead){
        var kongwangs = {"乾":false,"坎":false,"艮":false,"震":false,"巽":false,"离":false,"坤":false,"兑":false};
        if( xunhead=="戊" ){
            kongwangs["乾"] = true;
        }else if( xunhead=="癸" ){
            kongwangs["坎"] = true;
            kongwangs["艮"] = true;
        }else if( xunhead=="壬" ){
            kongwangs["艮"] = true;
            kongwangs["震"] = true;
        }else if( xunhead=="辛" ){
            kongwangs["巽"] = true;
        }else if( xunhead=="庚" ){
            kongwangs["离"] = true;
            kongwangs["坤"] = true;
        }else if( xunhead=="己" ){
            kongwangs["坤"] = true;
            kongwangs["兑"] = true;
        }
        return kongwangs;
    }

    function maxings(hourZhi){
        var maxings = {"巽":false,"艮":false,"坤":false,"乾":false};
        if( "亥卯未".indexOf(hourZhi)!=-1 ){
            maxings["巽"] = true;
        }else if( "申子辰".indexOf(hourZhi)!=-1 ){
            maxings["艮"] = true;
        }else if( "寅午戌".indexOf(hourZhi)!=-1 ){
            maxings["坤"] = true;
        }else if( "巳酉丑".indexOf(hourZhi)!=-1 ){
            maxings["乾"] = true;
        }
        return maxings;
    }

    function liujiashunDict() {
        const jzList = jiazi();
        const liujia = jzList.filter((_, i) => i % 10 === 0);
        const result = {};
        for (let i = 0; i < liujia.length; i++) {
            const startIdx = jzList.indexOf(liujia[i]);
            const group = [];
            for (let j = 0; j < 10; j++) {
                group.push(jzList[(startIdx + j) % 60]);
            }
            result[group.join(',')] = liujia[i];
        }
        return result;
    }

    function findyuenDict() {
        const jzList = jiazi();
        const yuanList = jzList.filter((_, i) => i % 5 === 0);
        const result = {};
        const yuenNames = ['上', '中', '下', '上', '中', '下', '上', '中', '下', '上', '中', '下'];
        for (let i = 0; i < yuanList.length; i++) {
            const startIdx = jzList.indexOf(yuanList[i]);
            const group = [];
            for (let j = 0; j < 5; j++) {
                group.push(jzList[(startIdx + j) % 60]);
            }
            result[group.join(',')] = yuenNames[i % 3];
        }
        return result;
    }

    function findyuen(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const fyDict = findyuenDict();
        return multiKeyDictGet(fyDict, gz[2]);
    }

    function jieqicodeJq(jqName) {
        const jqCodeDict = {
            '冬至': '一七四', '惊蛰': '一七四',
            '小寒': '二八五',
            '大寒': '三九六', '春分': '三九六',
            '立春': '八五二',
            '雨水': '九六三',
            '清明': '四一七', '立夏': '四一七',
            '谷雨': '五二八', '小满': '五二八',
            '芒种': '六三九',
            '夏至': '九三六', '白露': '九三六',
            '小暑': '八二五',
            '大暑': '七一四', '秋分': '七一四',
            '立秋': '二五八',
            '处暑': '一四七',
            '霜降': '五八二', '小雪': '五八二',
            '寒露': '六九三', '立冬': '六九三',
            '大雪': '四七一'
        };
        return jqCodeDict[jqName];
    }

    function yinYangDun(jieqi){
        const yangDun = ['冬至', '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种'];
        const yinYang = yangDun.includes(jieqi) ? '阳遁' : '阴遁';
        return yinYang;
    }

    function qimenJuNameChaibu(year, month, day, hour, minute) {
        const jieqi = jq(year, month, day, hour, minute);
        const yinYang = yinYangDun(jieqi);
        const yuen = findyuen(year, month, day, hour, minute);
        const jieqiCode = jieqicodeJq(jieqi);
        const juNum = yuen === '上' ? jieqiCode[0] : (yuen === '中' ? jieqiCode[1] : jieqiCode[2]);
        return yinYang + juNum + '局' + yuen;
    }

    function qimenJuNameMaoshan(year, month, day, hour, minute) {
        const jieqi = jq(year, month, day, hour, minute);
        const yinYang = yinYangDun(jieqi);
        const jqStartInfo = getJieqiStartDate(year, month, day, hour, minute);
        const jqStartDate = new Date(jqStartInfo.year, jqStartInfo.month - 1, jqStartInfo.day, jqStartInfo.hour, jqStartInfo.minute);
        const currentDate = new Date(year, month - 1, day, hour, minute);
        const hoursElapsed = (currentDate - jqStartDate) / (1000 * 60 * 60);
        const shichenElapsed = Math.max(0, Math.floor(hoursElapsed / 2));
        let yuen;
        if (shichenElapsed < 60) {
            yuen = '上';
        } else if (shichenElapsed < 120) {
            yuen = '中';
        } else {
            yuen = '下';
        }
        const jieqiCode = jieqicodeJq(jieqi);
        const juNum = yuen === '上' ? jieqiCode[0] : (yuen === '中' ? jieqiCode[1] : jieqiCode[2]);
        return yinYang + juNum + '局' + yuen;
    }

    function getQmju(year, month, day, hour, minute, option) {
        if (option === 1) {
            return qimenJuNameChaibu(year, month, day, hour, minute);
        } else if (option === 2) {
            return qimenJuNameZhirun(year, month, day, hour, minute);
        } else {
            return qimenJuNameMaoshan(year, month, day, hour, minute);
        }
    }

    function lunarDateD(year, month, day, hour, minute) {
        const lunarM = ['占位', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
        const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);  
        const lunar = solar.getLunar();
        return {
            "年": lunar.getYear(),
            "农历月": lunarM[lunar.getMonth()],
            "月": lunar.getMonth(),
            "日": lunar.getDay()
        };
    }

    function zhifuTiangan(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const ljsDict = liujiashunDict();
        const chour = multiKeyDictGet(ljsDict, gz[3]);
        const jj = { "甲子": "戊", "甲戌": "己", "甲申": "庚", "甲午": "辛", "甲辰": "壬", "甲寅": "癸" };
        return jj[chour];
    }

    function qimenJuNameZhirunRaw(year, month, day, hour, minute) {
        const Jieqi = jq(year, month, day, hour, minute);
        const jzList = jiazi();
        const jlist = splitList(jzList, 5);
        const newJq = newList(JIEQI_NAME, Jieqi)[1];
        const newJq1 = newList(JIEQI_NAME, Jieqi)[0];
        const newJq2 = newList(JIEQI_NAME, Jieqi)[JIEQI_NAME.length - 1];

        const yangDun = ['冬至', '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种'];
        const yinYang = yangDun.includes(newJq1) ? '阳遁' : '阴遁';

        const jieqiCode = jieqicodeJq(Jieqi);
        const dgz = gangzhi(year, month, day, hour, minute)[2];

        const fuhead = {};
        for (let i = 0; i < jlist.length; i++) {
            fuhead[jlist[i].join(',')] = jzList[i * 5];
        }
        const fd = multiKeyDictGet(fuhead, dgz);

        const zftg = zhifuTiangan(year, month, day, hour, minute);

        const juDayDict = {
            '甲子': '上元', '甲午': '上元', '己卯': '上元', '己酉': '上元',
            '甲寅': '中元', '甲申': '中元', '己巳': '中元', '己亥': '中元',
            '甲辰': '下元', '甲戌': '下元', '己丑': '下元', '己未': '下元'
        };
        const threeYuen = juDayDict[fd];

        const jqStartInfo = getJieqiStartDate4zhirun(year, month, day, hour, minute);
        const jqStartDate = new Date(jqStartInfo.year, jqStartInfo.month - 1, jqStartInfo.day, jqStartInfo.hour, jqStartInfo.minute);
        const currentDate = new Date(year, month - 1, day, hour, minute);
        const difference = Math.floor((currentDate - jqStartDate) / (1000 * 60 * 60 * 24));

        const kooks = { "上元": jieqiCode[0], "中元": jieqiCode[1], "下元": jieqiCode[2] }[threeYuen];

        const jieqiCode1 = jieqicodeJq(newJq);
        const jieqiCode2 = jieqicodeJq(newJq1);
        const jieqiCode0 = jieqicodeJq(newJq2);

        const kooks1 = { "上元": jieqiCode1[0], "中元": jieqiCode1[1], "下元": jieqiCode1[2] }[threeYuen];
        const kooks2 = { "上元": jieqiCode2[0], "中元": jieqiCode2[1], "下元": jieqiCode2[2] }[threeYuen];
        const kooks3 = { "上元": jieqiCode0[0], "中元": jieqiCode0[1], "下元": jieqiCode0[2] }[threeYuen];

        const lr = lunarDateD(year, month, day, hour, minute);
        const newJqYinYang = yangDun.includes(newJq) ? '阳遁' : '阴遁';

        return {
            "日期时间": `${year}年${month}月${day}日${hour}时${minute}分`,
            "农历": lr,
            "节气": Jieqi,
            "距节气差日数": difference,
            "三元": threeYuen,
            "当前节气日期": jqStartDate,
            "值符天干": zftg,
            "节气排局": jieqiCode2,
            "阴阳局": yinYang,
            "当前排局": `${yinYang}${kooks2}局`,
            "超神接气正授排局": `${newJqYinYang}${kooks1}局`,
            "其他排局": `${yinYang}${kooks3}局`,
            "其他排局1": `${newJqYinYang}${kooks}局`
        };
    }

    function qimenJuNameZhirun(year, month, day, hour, minute) {
        const qdict = qimenJuNameZhirunRaw(year, month, day, hour, minute);
        console.log(qdict);
        const jQ = qdict["节气"];
        const d = qdict["距节气差日数"];
        const tgft = qdict["值符天干"];
        const lunarData = qdict["农历"];
        const lunarMonth = lunarData["农历月"];
        const solarMonth = lunarData["月"];
        const lunarDay = lunarData["日"];
        const isWuji = ["戊", "己", "庚", "辛", "壬", "癸"].includes(tgft);

        if (d === 0) {
            if (lunarMonth === "腊月" || lunarMonth === "冬月") {
                const ju = lunarMonth === "腊月" ? qdict["其他排局1"] : qdict["当前排局"];
                return ju + qdict["三元"];
            }
            const ju = solarMonth > 9 ? qdict["超神接气正授排局"] : qdict["当前排局"];
            return ju + qdict["三元"];
        }

        if (d <= 6 && d > 1) {
            if (lunarMonth === "腊月" || lunarMonth === "冬月") {
                let ju;
                if (lunarMonth === "腊月") {
                    ju = qdict["其他排局1"];
                } else {
                    ju = jQ === "冬至" ? qdict["其他排局"] : qdict["当前排局"];
                }
                return ju + qdict["三元"];
            }
            if (solarMonth >= 9) {
                if (lunarDay < 15) {
                    return qdict["其他排局1"] + qdict["三元"];
                }
                return (isWuji ? qdict["当前排局"] : qdict["其他排局"]) + qdict["三元"];
            }
            if (lunarMonth === "正月") {
                if (lunarDay < 10 && !isWuji) {
                    return qdict["其他排局"] + qdict["三元"];
                }
                if (isWuji) {
                    if (lunarDay < 20) {
                        return qdict["其他排局1"] + qdict["三元"];
                    }
                    if (lunarDay > 20 && lunarDay <= 26) {
                        return qdict["其他排局"] + qdict["三元"];
                    }
                    return qdict["其他排局1"] + qdict["三元"];
                }
            }
            if (lunarMonth !== "腊月" && lunarMonth !== "冬月" && lunarMonth !== "正月") {
                if (lunarDay < 15) {
                    return qdict["当前排局"] + qdict["三元"];
                }
            }
            if (lunarDay >= 15) {
                return qdict["其他排局1"] + qdict["三元"];
            }
            return qdict["超神接气正授排局"] + qdict["三元"];
        }

        if (d <= 9 && d > 1) {
            if (lunarMonth === "腊月" || lunarMonth === "冬月") {
                const ju = lunarMonth === "腊月" ? qdict["当前排局"] : qdict["其他排局1"];
                return ju + qdict["三元"];
            }
            if (lunarMonth === "正月") {
                let ju;
                if (solarMonth <= 9 && lunarDay >= 15) {
                    ju = qdict["其他排局1"];
                } else if (isWuji) {
                    ju = qdict["其他排局1"];
                } else {
                    ju = qdict["超神接气正授排局"];
                }
                return ju + qdict["三元"];
            }
            if (solarMonth <= 6) {
                if (lunarDay <= 10) {
                    return qdict["其他排局1"] + qdict["三元"];
                }
                if (isWuji) {
                    const ju = lunarDay < 20 ? qdict["超神接气正授排局"] : qdict["其他排局1"];
                    return ju + qdict["三元"];
                }
                return qdict["当前排局"] + qdict["三元"];
            }
            if (solarMonth <= 9) {
                if (lunarDay < 15) {
                    return qdict["超神接气正授排局"] + qdict["三元"];
                }
                const ju = (isWuji || lunarDay >= 20) ? qdict["其他排局1"] : qdict["当前排局"];
                return ju + qdict["三元"];
            }
            return qdict["超神接气正授排局"] + qdict["三元"];
        }

        if (d <= 15 && d > 1) {
            if (lunarMonth === "腊月" || lunarMonth === "冬月") {
                let ju;
                if (lunarMonth === "腊月" || jQ !== "冬至") {
                    ju = qdict["其他排局1"];
                } else {
                    ju = d <= 12 ? qdict["其他排局1"] : qdict["当前排局"];
                }
                return ju + qdict["三元"];
            }
            if (solarMonth > 9) {
                return qdict["其他排局1"] + qdict["三元"];
            }
            if (lunarMonth === "正月") {
                return qdict["当前排局"] + qdict["三元"];
            }
            if (lunarMonth !== "正月" && lunarMonth !== "腊月" && lunarMonth !== "冬月") {
                return qdict["当前排局"] + qdict["三元"];
            }
            if (lunarDay < 15) {
                return qdict["超神接气正授排局"] + qdict["三元"];
            }
            return qdict["超神接气正授排局"] + qdict["三元"];
        }

        if (d < 0) {
            return qdict["超神接气正授排局"] + qdict["三元"];
        }

        return qdict["当前排局"] + qdict["三元"];
    }

    function panEarth(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju.substring(0, 2);
        const juNum = qmju[2];
        const guaOrder = newList(CNUMBER, juNum);
        const guaMapping = {};
        for (let i = 0; i < CNUMBER.length; i++) {
            guaMapping[CNUMBER[i]] = EIGHT_GUA[i];
        }
        const guaList = guaOrder.map(n => guaMapping[n]);
        const ganList = yinYang === '阳遁'
            ? ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙']
            : ['戊', '乙', '丙', '丁', '癸', '壬', '辛', '庚', '己'];
        const result = {};
        for (let i = 0; i < guaList.length; i++) {
            result[guaList[i]] = ganList[i];
        }
        return result;
    }

    function panEarthReverse(year, month, day, hour, minute, option) {
        const earth = panEarth(year, month, day, hour, minute, option);
        const result = {};
        for (const [k, v] of Object.entries(earth)) {
            result[v] = k;
        }
        return result;
    }

    function zhifuPai(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju[0];
        const kook = qmju[2];
        const paiDict = {
            '阳': {
                '一': '九八七一二三四五六',
                '二': '一九八二三四五六七',
                '三': '二一九三四五六七八',
                '四': '三二一四五六七八九',
                '五': '四三二五六七八九一',
                '六': '五四三六七八九一二',
                '七': '六五四七八九一二三',
                '八': '七六五八九一二三四',
                '九': '八七六九一二三四五'
            },
            '阴': {
                '九': '一二三九八七六五四',
                '八': '九一二八七六五四三',
                '七': '八九一七六五四三二',
                '六': '七八九六五四三二一',
                '五': '六七八五四三二一九',
                '四': '五六七四三二一九八',
                '三': '四五六三二一九八七',
                '二': '三四五二一九八七六',
                '一': '二三四一九八七六五'
            }
        };
        const pai = paiDict[yinYang][kook];
        const jzList = jiazi();
        const liujia = jzList.filter((_, i) => i % 10 === 0);
        const result = {};
        if (yinYang === '阳') {
            const newKook = newList(CNUMBER, kook);
            for (let i = 0; i < 6; i++) {
                result[liujia[i]] = newKook[i] + pai;
            }
        } else {
            const newRkook = newListReverse(CNUMBER, kook);
            for (let i = 0; i < 6; i++) {
                result[liujia[i]] = newRkook[i] + pai;
            }
        }
        return result;
    }

    function zhishiPai(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju[0];
        const kook = qmju[2];
        const jzList = jiazi();
        const yuanList = jzList.filter((_, i) => i % 10 === 0);
        const newKook = newList(CNUMBER, kook);
        const newRkook = newListReverse(CNUMBER, kook);
        const yangList = newKook.join('') + newKook.join('') + newKook.join('');
        const yinList = newRkook.join('') + newRkook.join('') + newRkook.join('');
        const result = {};
        if (yinYang === '阳') {
            for (let i = 0; i < 6; i++) {
                const startIdx = yangList.indexOf(newKook[i]);
                result[yuanList[i]] = newKook[i] + yangList.substring(startIdx + 1, startIdx + 12);
            }
        } else {
            for (let i = 0; i < 6; i++) {
                const startIdx = yinList.indexOf(newRkook[i]);
                result[yuanList[i]] = newRkook[i] + yinList.substring(startIdx + 1, startIdx + 12);
            }
        }
        return result;
    }

    function zhifuNZhishi(year, month, day, hour, minute, option) {
        const gz = gangzhi(year, month, day, hour, minute);
        const hgan = TIAN_GAN.indexOf(gz[3][0]);
        const ljsDict = liujiashunDict();
        const chour = multiKeyDictGet(ljsDict, gz[3]);
        const jj = { '甲子': '戊', '甲戌': '己', '甲申': '庚', '甲午': '辛', '甲辰': '壬', '甲寅': '癸' };
        const zspai = zhishiPai(year, month, day, hour, minute, option);
        const zfpai = zhifuPai(year, month, day, hour, minute, option);
        const eg = ['休门', '死门', '伤门', '杜门', '中', '开门', '惊门', '生门', '景门'];
        const eightGods = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];
        const gongsCode = {};
        for (let i = 0; i < CNUMBER.length; i++) {
            gongsCode[CNUMBER[i]] = EIGHT_GUA[i];
        }
        const cnumToGod = {};
        for (let i = 0; i < CNUMBER.length; i++) {
            cnumToGod[CNUMBER[i]] = eightGods[i];
        }
        const cnumToDoor = {};
        for (let i = 0; i < CNUMBER.length; i++) {
            cnumToDoor[CNUMBER[i]] = eg[i];
        }
        let door = null;
        let star = null;
        let starGong = null;
        let doorGong = null;
        const zspaiValue = zspai[chour];
        const zfpaiValue = zfpai[chour];
        if (zspaiValue) {
            door = cnumToDoor[zspaiValue[0]];
            doorGong = gongsCode[zspaiValue[hgan]];
        }
        if (zfpaiValue) {
            star = cnumToGod[zfpaiValue[0]];
            starGong = gongsCode[zfpaiValue[hgan]];
        }
        if (door === '中') door = '死门';
        return {
            '值符天干': [chour, jj[chour]],
            '值符星宫': [star, starGong],
            '值使门宫': [door, doorGong]
        };
    }

    function panStar(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju[0];
        const zfzs = zhifuNZhishi(year, month, day, hour, minute, option);
        const startingStar = zfzs['值符星宫'][0].replace('天芮', '天禽');
        const startingGong = zfzs['值符星宫'][1];
        const rotate = yinYang === '阳' ? CLOCKWISE_EIGHT_GUA : [...CLOCKWISE_EIGHT_GUA].reverse();
        const starOrder = yinYang === '阳' ? newList(STAR_R, startingStar) : newListReverse(STAR_R, startingStar);
        let gongReorder;
        if (startingGong === '中') {
            gongReorder = newList(rotate, '坤');
        } else {
            gongReorder = newList(rotate, startingGong);
        }
        const result = {};
        for (let i = 0; i < gongReorder.length; i++) {
            result[gongReorder[i]] = starOrder[i];
        }
        const reverseResult = {};
        for (const [k, v] of Object.entries(result)) {
            reverseResult[v] = k;
        }
        return [result, reverseResult];
    }

    function panDoor(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju[0];
        const zfzs = zhifuNZhishi(year, month, day, hour, minute, option);
        const startingDoor = zfzs['值使门宫'][0];
        const startingGong = zfzs['值使门宫'][1];
        const rotate = yinYang === '阳' ? CLOCKWISE_EIGHT_GUA : [...CLOCKWISE_EIGHT_GUA].reverse();
        const doorOrder = yinYang === '阳' ? newList(DOOR_R, startingDoor) : newListReverse(DOOR_R, startingDoor);
        let gongReorder;
        if (startingGong === '中') {
            gongReorder = newList(rotate, '坤');
        } else {
            gongReorder = newList(rotate, startingGong);
        }
        const result = {};
        for (let i = 0; i < gongReorder.length; i++) {
            result[gongReorder[i]] = doorOrder[i];
        }
        return result;
    }

    function panGod(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju[0];
        const zfzs = zhifuNZhishi(year, month, day, hour, minute, option);
        const startingGong = zfzs['值符星宫'][1];
        const rotate = yinYang === '阳' ? CLOCKWISE_EIGHT_GUA : [...CLOCKWISE_EIGHT_GUA].reverse();
        let gongReorder;
        if (startingGong === '中') {
            gongReorder = newList(rotate, '坤');
        } else {
            gongReorder = newList(rotate, startingGong);
        }
        const godList = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
        const result = {};
        for (let i = 0; i < gongReorder.length; i++) {
            result[gongReorder[i]] = godList[i];
        }
        return result;
    }

    /**
     * 根据值符宫，用其天盘找到地盘等于天盘的宫，从該宫开始按阳遁顺阴遁逆的顺序排地八神。
     * @param {object} board 排盘信息
     * @param {string} zhifuGong 值符宫
     * @param {boolean} isYang 是否为阳遁
     * @returns 
     */
    function panDiGod(board, zhifuGong, isYang) {
    const DI_GODS = ["符", "蛇", "阴", "六", "白", "玄", "九", "天"];

        // ===== 1）获取值符宫的天盘干 =====
        const zhifuGan = board[zhifuGong==="中"?"坤":zhifuGong].tianpan;
        if (!zhifuGan) return;

        // ===== 2）找到“地盘=该干”的宫（起点宫）=====
        let startGong = null;

        for (const key in board) {
            if (key === "中") continue;

            if (board[key].dipan === zhifuGan) {
                startGong = key;
                break;
            }
        }

        if (!startGong) return;

        // ===== 3）确定方向 =====
        let sequence = [...CLOCKWISE_EIGHT_GUA];

        if (!isYang) {
            sequence.reverse();
        }

        // ===== 4）找到起点索引 =====
        const startIndex = sequence.indexOf(startGong);
        if (startIndex === -1) return;

        // ===== 5）开始排八神 =====
        for (let i = 0; i < 8; i++) {
            const gongIndex = (startIndex + i) % 8;
            const gong = sequence[gongIndex];
            board[gong].diShen = DI_GODS[i];
        }
    }

    function panSky(year, month, day, hour, minute, option) {
        const qmju = getQmju(year, month, day, hour, minute, option);
        const yinYang = qmju[0];
        const earth = panEarth(year, month, day, hour, minute, option);
        const earthReverse = panEarthReverse(year, month, day, hour, minute, option);
        const zfzs = zhifuNZhishi(year, month, day, hour, minute, option);
        const gz = gangzhi(year, month, day, hour, minute);
        const fuHead = hourganghziZhifu(year, month, day, hour, minute)[2];
        const fuHeadLocation = zfzs['值符星宫'][1];
        const fuHeadLocation2 = earthReverse[fuHead];
        const ganHead = zfzs['值符天干'][1];
        const zhifu = zfzs['值符星宫'][0];
        const fuLocation = earthReverse[gz[3][0]];
        const rotate = yinYang === '阳' ? CLOCKWISE_EIGHT_GUA : [...CLOCKWISE_EIGHT_GUA].reverse();
        const gongReorder = newList(rotate, '坤');
        const earthValues = rotate.map(g => earth[g]);

        if (fuHeadLocation === '中') {
            try {
                const ganReorder = newList(earthValues, fuHead);
                newList(rotate, fuHeadLocation);
                const gongReorder2 = newList(rotate, '坤');
                const result = {};
                for (let i = 0; i < gongReorder2.length; i++) {
                    result[gongReorder2[i]] = ganReorder[i];
                }
                return result;
            } catch (e) {
                const god = panGod(year, month, day, hour, minute, option);
                if (god['坤'] !== '值符') {
                    const result = {};
                    for (let i = 0; i < gongReorder.length; i++) {
                        result[gongReorder[i]] = newList(earthValues, earth['坤'])[i];
                    }
                    return result;
                }
                if (earth['坤'] === ganHead) {
                    const reversed = [...earthValues].reverse();
                    const result = {};
                    for (let i = 0; i < gongReorder.length; i++) {
                        result[gongReorder[i]] = newList(earthValues, reversed[0])[i];
                    }
                    return result;
                } else {
                    try {
                        const ganReorder = newList(earthValues, ganHead);
                        const result = {};
                        for (let i = 0; i < gongReorder.length; i++) {
                            result[gongReorder[i]] = ganReorder[i];
                        }
                        return result;
                    } catch (e2) {
                        const result = {};
                        for (let i = 0; i < gongReorder.length; i++) {
                            result[gongReorder[i]] = newList(earthValues, earth['坤'])[i];
                        }
                        return result;
                    }
                }
            }
        }

        if (fuHeadLocation !== '中' && zhifu !== '天禽' && fuHeadLocation2 !== '中') {
            const newlist = rotate.map(g => earth[g]);
            const ganReorder = newList(newlist, fuHead);
            const gongReorder2 = newList(rotate, fuHeadLocation);
            if (!ganReorder.includes(fuHead)) {
                const cnumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
                const start = Object.fromEntries(cnumber.map((n, i) => [n, ganReorder[i]]))[qmju[2]];
                const rganReorder = newList(ganReorder, start);
                const rgongReorder = newList(gongReorder2, fuLocation);
                const result = {};
                for (let i = 0; i < rgongReorder.length; i++) {
                    result[rgongReorder[i]] = rganReorder[i];
                }
                return result;
            }
            if (ganReorder.includes(fuHead)) {
                if (fuLocation === null || fuLocation === undefined) {
                    return earth;
                }
                const result = {};
                for (let i = 0; i < gongReorder2.length; i++) {
                    result[gongReorder2[i]] = ganReorder[i];
                }
                result['中'] = earth['中'];
                return result;
            }
        }

        if (fuHeadLocation !== '中' && zhifu === '天禽' && fuHeadLocation2 === '中') {
            const gg = rotate.map(g => earth[g]);
            const ganReorder = newList(gg, earth['坤']);
            const gongReorder2 = newList(rotate, fuHeadLocation);
            if (!ganReorder.includes(fuHead)) {
                const rgongReorder = newList(gongReorder2, fuLocation);
                const result = {};
                for (let i = 0; i < rgongReorder.length; i++) {
                    result[rgongReorder[i]] = ganReorder[i];
                }
                return result;
            }
            const result = {};
            for (let i = 0; i < gongReorder2.length; i++) {
                result[gongReorder2[i]] = ganReorder[i];
            }
            result['中'] = earth['中'];
            return result;
        }

        return earth;
    }

    function daykongShikong(year, month, day, hour, minute) {
        const guxu = {
            '甲子': { '孤': '戌亥', '虚': '辰巳' },
            '甲戌': { '孤': '申酉', '虚': '寅卯' },
            '甲申': { '孤': '午未', '虚': '子丑' },
            '甲午': { '孤': '辰巳', '虚': '戌亥' },
            '甲辰': { '孤': '寅卯', '虚': '申酉' },
            '甲寅': { '孤': '子丑', '虚': '午未' }
        };
        const gz = gangzhi(year, month, day, hour, minute);
        const ljsDict = liujiashunDict();
        const dk = multiKeyDictGet(ljsDict, gz[2]);
        const sk = multiKeyDictGet(ljsDict, gz[3]);
        return {
            '日空': guxu[dk]?.['孤'] || '',
            '时空': guxu[sk]?.['孤'] || ''
        };
    }

    function shun(gz) {
        const diZhiValue = {};
        const tianGanValue = {};
        DI_ZHI.split('').forEach((z, i) => diZhiValue[z] = i + 1);
        TIAN_GAN.split('').forEach((g, i) => tianGanValue[g] = i + 1);
        const dValue1 = diZhiValue[gz[1]];
        const dValue2 = tianGanValue[gz[0]];
        let shunValue = dValue1 - dValue2;
        if (shunValue < 0) shunValue += 12;
        const shunDict = { 0: '戊', 10: '己', 8: '庚', 6: '辛', 4: '壬', 2: '癸' };
        return shunDict[shunValue];
    }

    function qimenJuDay(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const juDayDict = {
            '甲': '甲己日', '己': '甲己日',
            '乙': '乙庚日', '庚': '乙庚日',
            '丙': '丙辛日', '辛': '丙辛日',
            '丁': '丁壬日', '壬': '丁壬日',
            '戊': '戊癸日', '癸': '戊癸日'
        };
        return juDayDict[gz[2][0]] || juDayDict[gz[2][1]];
    }

    function hourganghziZhifu(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const jzList = jiazi();
        const liujia = jzList.filter((_, i) => i % 10 === 0);
        const tianGanTail = TIAN_GAN.slice(4, 10);
        for (let i = 0; i < liujia.length; i++) {
            const startIdx = jzList.indexOf(liujia[i]);
            const group = [];
            for (let j = 0; j < 10; j++) {
                group.push(jzList[(startIdx + j) % 60]);
            }
            if (group.includes(gz[3])) {
                return liujia[i] + tianGanTail[i];
            }
        }
        return null;
    }

    function moonhorse(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const horseDict = {
            '寅': '午', '申': '午',
            '卯': '申', '酉': '申',
            '辰': '戌', '戌': '戌',
            '巳': '子', '亥': '子',
            '午': '寅', '子': '寅',
            '丑': '辰', '未': '辰'
        };
        return horseDict[gz[2][1]];
    }

    function dinhorse(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const ljsDict = liujiashunDict();
        const xun = multiKeyDictGet(ljsDict, gz[2]);
        const horseDict = {
            '甲子': '卯', '甲戌': '丑', '甲申': '亥',
            '甲午': '酉', '甲辰': '未', '甲寅': '巳'
        };
        return horseDict[xun];
    }

    function hourhorse(year, month, day, hour, minute) {
        const gz = gangzhi(year, month, day, hour, minute);
        const horseDict = {
            '申': '寅', '子': '寅', '辰': '寅',
            '寅': '申', '午': '申', '戌': '申',
            '亥': '巳', '卯': '巳', '未': '巳',
            '巳': '亥', '酉': '亥', '丑': '亥'
        };
        return horseDict[gz[3][1]];
    }

    //击刑
    function jixing(board) {
        const ruleMap = {
            "艮": "庚",
            "震": "戊",
            "巽": "壬癸",
            "离": "辛",
            "坤": "己"
        };

        const fields = ["dipan", "tianpan", "tianpanJi"];

        for (const key in board) {
            if (key === "中") continue;

            const rule = ruleMap[key];
            if (!rule) continue;

            const item = board[key];

            fields.forEach(field => {
                if (rule.includes(item[field])) {
                    item[`${field}_jixing`] = "jixing";
                }
            });

            // 特殊规则：只对坤宫处理 dipanJi
            if (key === "坤" && rule.includes(item.dipanJi)) {
                item.dipanJi_jixing = "jixing";
            }
        }
    }
    //门破
    function menpo(board) {
        const MENPO = "menpo";

        const ruleMap = {
            "乾": ["景门"],
            "坎": ["生门", "死门"],
            "艮": ["伤门", "杜门"],
            "震": ["开门", "惊门"],
            "巽": ["开门", "惊门"],
            "离": ["休门"],
            "坤": ["伤门", "杜门"],
            "兑": ["景门"]
        };

        for (const key in board) {
            if (key === "中") continue;

            const item = board[key];
            const rules = ruleMap[key];
            if (!rules) continue;

            // 防御式写法
            if (item.men && rules.includes(item.men)) {
                item.men_po = MENPO;
            }
        }
    }
    //入墓
    function rumu(board, zhifuGong, xunhead) {
        const RUMU = "rumu";

        // 基础规则
        const baseRuleMap = {
            "乾": ["乙", "丙", "戊"],
            "艮": ["丁", "己", "庚"],
            "巽": ["辛", "壬"]
        };

        // 统一处理字段
        const fields = ["dipan", "tianpan", "tianpanJi"];

        for (const key in board) {
            if (key === "中") continue;

            const item = board[key];

            // ===== 1）普通宫位 =====
            if (baseRuleMap[key]) {
                const rules = baseRuleMap[key];

                fields.forEach(field => {
                    if (item[field] && rules.includes(item[field])) {
                        item[`${field}_rumu`] = RUMU;
                    }
                });
            }

            // ===== 2）坤宫特殊处理 =====
            if (key === "坤") {
                // 动态规则
                const rules = ["癸"];
                if (zhifuGong === "坤" && xunhead) {
                    rules.push(xunhead);
                }

                // 处理所有字段
                [...fields, "dipanJi"].forEach(field => {
                    if (item[field] && rules.includes(item[field])) {
                        item[`${field}_rumu`] = RUMU;
                    }
                });
            }
        }
    }

    /**
     * 排暗干，某宫的八门在该八门的元旦盘（原始盘）的地盘为该宫的暗干。
     * @param {Object} board 奇门遁甲排盘数据
     */
    function panAnganByMen(board) {
        var menGuaMap = {"休门":"坎","生门":"艮","伤门":"震","杜门":"巽","景门":"离","死门":"坤","惊门":"兑","开门":"乾"};
        CLOCKWISE_EIGHT_GUA.forEach(gua => {
            var srcGua = menGuaMap[board[gua].men];
            if( srcGua ){
                board[gua].yingan = board[srcGua].dipan;
            }
        })
    }

    /**
     * 排暗干，将时干加在值使门或中宫的落宫。
     * 算法参考：http://www.zyqmdj.com/2128.html
     * @param {Object} board 奇门遁甲排盘数据
     * @param {String} shiGan 时干（如：'甲','乙','丙'等）
     * @param {String} xunShou 旬首
     * @param {String} zhiShiMen 值使门（如：'死门','开门'等）
     * @param {Boolean} isYang 是否阳遁（true为阳遁，false为阴遁）
     */
    function panAnganByZhishi(board, shiGan, xunShou, zhiShiMen, isYang) {
        // 1. 定义飞布天干表
        const tianGanTable = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
        
        // 宫位顺序 (1坎 2坤 3震 4巽 5中 6乾 7兑 8艮 9离)
        const gongOrder = isYang
            ? ['坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离']
            : ['离', '艮', '兑', '乾', '中', '巽', '震', '坤', '坎'];

        // 2. 寻找值使门落宫
        let targetGongKey = null;
        for (const key of gongOrder) {
            if (board[key] && board[key].men === zhiShiMen) {
                targetGongKey = key;
                break;
            }
        }

        if (!targetGongKey) {
            return {};
        }

        const targetGongData = board[targetGongKey];
        const targetGongDiPan = targetGongData.dipan; // 值使门落宫地盘
        
        // 获取中宫地盘
        const zhongGongDiPan = board['中'] ? board['中'].dipan : null;

        // 3. 确定起始天干和起始宫位
        let startGan = '';
        let startGongIndex = -1;

        // 特殊处理：时干为甲
        if (shiGan === '甲') {
            // 规则：以旬首为起始暗干
            startGan = xunShou;
            // 检查旬首是否存在于天干表
            if (tianGanTable.indexOf(startGan) === -1) {
                return {};
            }
            // 判断旬首与中宫地盘的关系
            if (xunShou === zhongGongDiPan) {
                // 子规则1：旬首 == 中宫地盘 -> 起始宫位为值使门落宫
                startGongIndex = gongOrder.indexOf(targetGongKey);
            } else {
                // 子规则2：旬首 != 中宫地盘 -> 起始宫位为中宫
                startGongIndex = gongOrder.indexOf('中');
            }
        } 
        // 正常逻辑：时干非甲
        else {
            startGan = shiGan;
            // 检查时干是否存在于天干表
            if (tianGanTable.indexOf(startGan) === -1) {
                return {};
            }
            if (shiGan === targetGongDiPan) {
                // 情形1：时干 == 值使门落宫地盘 -> 起始宫位为中宫
                startGongIndex = gongOrder.indexOf('中');
            } else {
                // 情形2：时干 != 值使门落宫地盘 -> 起始宫位为值使门落宫
                startGongIndex = gongOrder.indexOf(targetGongKey);
            }
        }

        // 4. 飞布计算
        const startGanIndex = tianGanTable.indexOf(startGan);
        
        for (let i = 0; i < 9; i++) {
            let currentGanIdx;
            let currentGongIdx;
            currentGanIdx = (startGanIndex + i) % 9;
            currentGongIdx = (startGongIndex + i) % 9;
            const gongKey = gongOrder[currentGongIdx];
            const gan = tianGanTable[currentGanIdx];
            board[gongKey].yingan = gan;
        }
    }

    var QimenObj ={
        init: function(year, month, day, hour, minute, panMethod, anganType) {
            this.year = year;
            this.month = month;
            this.day = day;
            this.hour = hour;
            this.minute = minute;
            this.panMethod = panMethod;
            this.anganType = anganType;
            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
        },

        /**
         * 排奇门盘
         * @param {*} year 公历年
         * @param {*} month 公历月
         * @param {*} day 公历日
         * @param {*} hour 时
         * @param {*} minute 分
         * @param {*} panMethod 排盘方法，1：拆补，2：置闰，3：茅山
         * @param {*} anganType 暗干排法，1：将时干加在值使门或中宫的落宫， 2：将时干加在八门元旦宫。
         * @returns 
         */
        paipan: function(year, month, day, hour, minute, panMethod, anganType) {
            this.init(year, month, day, hour, minute, panMethod, anganType);
            const gz = gangzhi(this.year, this.month, this.day, this.hour, this.minute);
            const date = this.solar.getYear() + "年" + this.solar.getMonth() + "月" + this.solar.getDay() + "日" + " " + this.solar.getHour() + "时" + this.solar.getMinute() + "分" + "(" + this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese() +" " + gz[3][1] + "时)";
            const qmju = getQmju(this.year, this.month, this.day, this.hour, this.minute, panMethod);
            const shunhead = getXunhead(gz[3]);
            const shunkong = KONGWANG[shunhead]; 
            const kongwangs = kongwang(shunhead);
            const maxing = maxings(gz[3][1]);
            const j_q = jq(this.year, this.month, this.day, this.hour, this.minute);
            const yinYang = yinYangDun(j_q);
            const jqStr = this.lunar.getPrevJieQi(false).getName() + this.lunar.getPrevJieQi(false).getSolar().toYmdHms().slice(0, -3) + " ~ " + this.lunar.getNextJieQi(false).getName() + this.lunar.getNextJieQi(false).getSolar().toYmdHms().slice(0, -3);
            const zfzs = zhifuNZhishi(this.year, this.month, this.day, this.hour, this.minute, panMethod);
            const star = panStar(this.year, this.month, this.day, this.hour, this.minute, panMethod)[0];
            const door = panDoor(this.year, this.month, this.day, this.hour, this.minute, panMethod);
            const god = panGod(this.year, this.month, this.day, this.hour, this.minute, panMethod);
            const sky = panSky(this.year, this.month, this.day, this.hour, this.minute, panMethod);
            const earth = panEarth(this.year, this.month, this.day, this.hour, this.minute, panMethod);
            const board = {}; //九宫排盘
            EIGHT_GUA.forEach(gua => {
                board[gua] = {
                    'tianpan': sky[gua] || '',
                    'dipan': earth[gua] || '',
                    'men': door[gua] || '',
                    'xing': star[gua] || '',
                    'shen': god[gua] || '',
                    'kongwang': kongwangs[gua] || false,
                    'ma': maxing[gua] || false,
                };
            });
            //将中宫的地盘放到坤宫的dipanJi属性上
            board['坤'].dipanJi = board['中'].dipan;
            board['坤'].dipanJi12 = ZHANG_SHENG_12[board['坤'].dipanJi]['坤'];
            //遍历所有宫，
            EIGHT_GUA.forEach(gua => {
                // 如果天盘跟坤宫的地盘一样，将中宫的地盘放到该宫的tianpanJi属性上
                if (board[gua].tianpan === board['坤'].dipan) {
                    board[gua].tianpanJi = board['中'].dipan;
                    board[gua].tianpanJi12 = ZHANG_SHENG_12[board[gua].tianpanJi]['坤'];
                }
                // 设置该宫的12长生属性
                if( gua!="中" ){
                    board[gua].dipan12 = ZHANG_SHENG_12[board[gua].dipan][gua];
                    board[gua].tianpan12 = ZHANG_SHENG_12[board[gua].tianpan][gua];
                }
                // 如果是天禽星，替换为芮禽星
                if (board[gua].xing === '天禽') {
                    board[gua].xing = '芮禽';
                }
            });
            //入墓信息
            rumu(board, zfzs["值符星宫"][1], shunhead);
            //门迫信息
            menpo(board);
            //击刑信息
            jixing(board);
            //排地八神
            panDiGod(board, zfzs["值符星宫"][1], yinYang=="阳遁");
            //排暗干
            anganType===1
            ?panAnganByZhishi(board, gz[3][0], shunhead, zfzs["值使门宫"][0], yinYang=="阳遁")
            :panAnganByMen(board);

            return {
                "lunar": this.lunar,
                "solar": this.solar,
                'panMethod': panMethod,
                "anganType": anganType,
                'date': date,
                "datetime": new Date(year, month - 1, day, hour, minute, 0),
                'siZhu': gz,
                'xunHead': XUNHEAD[shunhead],
                'xunKong': shunkong,
                'juDay': qimenJuDay(this.year, this.month, this.day, this.hour, this.minute),
                'panJu': qmju,
                'jieqi': jqStr,
                'zhifuzhishi': zfzs,
                'qimenPan': board,
                'maxing': {
                    '天马': moonhorse(this.year, this.month, this.day, this.hour, this.minute),
                    '丁马': dinhorse(this.year, this.month, this.day, this.hour, this.minute),
                    '驿马': hourhorse(this.year, this.month, this.day, this.hour, this.minute)
                },
            };
        },
        //上一局
        prevPaipan: function(){
            var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            var aDate = null;
            date.setHours(date.getHours()-2);
            aDate = date;
            return this.paipan(aDate.getFullYear(), aDate.getMonth()+1, aDate.getDate(), aDate.getHours(), aDate.getMinutes(), this.panMethod, this.anganType);
        },
        //当前
        nowPaipan: function(){
            var aDate = new Date();
            return this.paipan(aDate.getFullYear(), aDate.getMonth()+1, aDate.getDate(), aDate.getHours(), aDate.getMinutes(), this.panMethod, this.anganType);
        },
        //下一局
        nextPaipan: function(){
            var date = new Date(this.solar.getYear(), this.solar.getMonth()-1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            var aDate = null;
            date.setHours(date.getHours()+2);
            aDate = date;
            return this.paipan(aDate.getFullYear(), aDate.getMonth()+1, aDate.getDate(), aDate.getHours(), aDate.getMinutes(), this.panMethod, this.anganType);
        },
    }

    exports('qimendunjia', QimenObj);

})
