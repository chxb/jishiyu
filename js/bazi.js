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

layui.define(["realsuntime", "shensha", "chenggu"], function (exports) {

    var DAYUN_NUM = 10;

    function buildPillarCol(bazi, pillarIndex, isman) {
        var gan, zhi, ganShishen, zhiCanggan, zhiShishen, dishi, kongwang, nayin;
        switch (pillarIndex) {
            case 1:
                gan = bazi.getYearGan();
                zhi = bazi.getYearZhi();
                ganShishen = bazi.getYearShiShenGan();
                zhiCanggan = bazi.getYearHideGan();
                zhiShishen = bazi.getYearShiShenZhi();
                dishi = bazi.getYearDiShi();
                kongwang = bazi.getYearXunKong();
                nayin = bazi.getYearNaYin();
                break;
            case 2:
                gan = bazi.getMonthGan();
                zhi = bazi.getMonthZhi();
                ganShishen = bazi.getMonthShiShenGan();
                zhiCanggan = bazi.getMonthHideGan();
                zhiShishen = bazi.getMonthShiShenZhi();
                dishi = bazi.getMonthDiShi();
                kongwang = bazi.getMonthXunKong();
                nayin = bazi.getMonthNaYin();
                break;
            case 3:
                gan = bazi.getDayGan();
                zhi = bazi.getDayZhi();
                ganShishen = bazi.getDayShiShenGan();
                zhiCanggan = bazi.getDayHideGan();
                zhiShishen = bazi.getDayShiShenZhi();
                dishi = bazi.getDayDiShi();
                kongwang = bazi.getDayXunKong();
                nayin = bazi.getDayNaYin();
                break;
            case 4:
                gan = bazi.getTimeGan();
                zhi = bazi.getTimeZhi();
                ganShishen = bazi.getTimeShiShenGan();
                zhiCanggan = bazi.getTimeHideGan();
                zhiShishen = bazi.getTimeShiShenZhi();
                dishi = bazi.getTimeDiShi();
                kongwang = bazi.getTimeXunKong();
                nayin = bazi.getTimeNaYin();
                break;
        }
        var shensha = layui.shensha.queryShenSha(gan + zhi, [bazi.getYearGan(), bazi.getYearZhi(), bazi.getMonthGan(), bazi.getMonthZhi(), bazi.getDayGan(), bazi.getDayZhi(), bazi.getTimeGan(), bazi.getTimeZhi()], isman, pillarIndex, bazi.getYearNaYin());
        return {
            gan: gan,
            zhi: zhi,
            ganWuxing: tianganWuxing(gan),
            zhiWuxing: dizhiWuxing(zhi),
            ganYinyang: tianganYinyang(gan),
            zhiYinyang: dizhiYingyang(zhi) ? "阴" : "阳",
            ganShishen: ganShishen,
            zhiCanggan: zhiCanggan,
            zhiShishen: zhiShishen,
            dishi: dishi,
            zizuo: queryShengwang(gan, zhi),
            kongwang: kongwang,
            nayin: nayin,
            shensha: shensha
        };
    }

    function buildDayunList(bazi, dayun) {
        var dayunList = [];
        for (var i = 1; i < dayun.length; i++) {
            var dy = dayun[i];
            var dygz = dy.getGanZhi().split("");
            var dyGanShen = shishenJc(queryShishen(dygz[0], bazi.getDayGan()));
            var dyZhiShen = shishenJc(queryShishen(dizhiCanggan(dygz[1])[0], bazi.getDayGan()));
            var liunianList = [];
            var liunians = dy.getLiuNian();
            for (var j = 0; j < liunians.length; j++) {
                var lnGanZhi = liunians[j].getGanZhi().split("");
                var lnGan = lnGanZhi[0];
                var lnZhi = lnGanZhi[1];
                var lnGanShen = shishenJc(queryShishen(lnGan, bazi.getDayGan()));
                var lnZhiShen = shishenJc(queryShishen(dizhiCanggan(lnZhi)[0], bazi.getDayGan()));
                liunianList.push({
                    ganzhi: liunians[j].getGanZhi(),
                    gan: lnGan,
                    zhi: lnZhi,
                    ganWuxing: tianganWuxing(lnGan),
                    zhiWuxing: dizhiWuxing(lnZhi),
                    ganShishen: lnGanShen,
                    zhiShishen: lnZhiShen,
                    year: liunians[j].getYear(),
                    age: liunians[j].getAge()
                });
            }
            dayunList.push({
                ganzhi: dy.getGanZhi(),
                gan: dygz[0],
                zhi: dygz[1],
                ganWuxing: tianganWuxing(dygz[0]),
                zhiWuxing: dizhiWuxing(dygz[1]),
                ganShishen: dyGanShen,
                zhiShishen: dyZhiShen,
                startYear: dy.getStartYear(),
                startAge: dy.getStartAge(),
                liunian: liunianList
            });
        }
        return dayunList;
    }

    function buildXiaoyunList(bazi, dayun) {
        var xyLiunian = dayun[0].getLiuNian();
        var xyXiaoyun = dayun[0].getXiaoYun();
        var xiaoyunList = [];
        for (var i = 0; i < xyLiunian.length; i++) {
            var xy = xyLiunian[i];
            var xyGanZhi = xy.getGanZhi().split("");
            var xyGan = xyGanZhi[0];
            var xyZhi = xyGanZhi[1];
            var xyGanShen = shishenJc(queryShishen(xyGan, bazi.getDayGan()));
            var xyZhiShen = shishenJc(queryShishen(dizhiCanggan(xyZhi)[0], bazi.getDayGan()));
            xiaoyunList.push({
                ganzhi: xy.getGanZhi(),
                gan: xyGan,
                zhi: xyZhi,
                ganWuxing: tianganWuxing(xyGan),
                zhiWuxing: dizhiWuxing(xyZhi),
                ganShishen: xyGanShen,
                zhiShishen: xyZhiShen,
                year: xy.getYear(),
                age: xy.getAge(),
                xiaoyunGanzhi: xyXiaoyun[i].getGanZhi(),
                xiaoyunYear: xyXiaoyun[i].getYear(),
                xiaoyunAge: xyXiaoyun[i].getAge()
            });
        }
        return xiaoyunList;
    }

    function buildQiyunInfo(yun, dayun) {
        var curJieqi = yun.getStartSolar().getLunar().getCurrentJieQi();
        var date = new Date(yun.getStartSolar().getYear(), yun.getStartSolar().getMonth() - 1, yun.getStartSolar().getDay(), yun.getStartSolar().getHour(), yun.getStartSolar().getMinute(), 0);
        var d2 = date;
        var jieName = null;
        if (!curJieqi || (!!curJieqi && !curJieqi.isJie())) {
            var yunJie = yun.getStartSolar().getLunar().getPrevJie();
            d2 = new Date(yunJie.getSolar().getYear(), yunJie.getSolar().getMonth() - 1, yunJie.getSolar().getDay(), yunJie.getSolar().getHour(), yunJie.getSolar().getMinute(), 0);
            jieName = yunJie.getName();
        } else {
            jieName = curJieqi.getName();
            d2 = new Date(curJieqi.getSolar().getYear(), curJieqi.getSolar().getMonth() - 1, curJieqi.getSolar().getDay(), curJieqi.getSolar().getHour(), curJieqi.getSolar().getMinute(), 0);
        }
        var d3 = date.getTime() - d2.getTime();
        var days = Math.floor(d3 / (24 * 3600 * 1000));
        return {
            startYear: yun.getStartYear(),
            startMonth: yun.getStartMonth(),
            startDay: yun.getStartDay(),
            startHour: yun.getStartHour(),
            jieName: jieName,
            days: days,
            jiaoyunGan1: dayun[1].getLiuNian()[0].getGanZhi().split("")[0],
            jiaoyunGan2: dayun[1].getLiuNian()[5].getGanZhi().split("")[0]
        };
    }

    function buildLiuyi(bazi) {
        var tianganlist = [bazi.getYearGan(), bazi.getMonthGan(), bazi.getDayGan(), bazi.getTimeGan()];
        var dizhilist = [bazi.getYearZhi(), bazi.getMonthZhi(), bazi.getDayZhi(), bazi.getTimeZhi()];
        return {
            tiangan: {
                wuHe: tiangan5he(tianganlist),
                siCong: tiangan4cong(tianganlist),
                tianKe: tianganKe(tianganlist)
            },
            dizhi: {
                liuHe: dizhi6he(dizhilist),
                siCong: dizhi4cong(dizhilist),
                banSanHe: dizhiBan3he(dizhilist),
                gongSanHe: dizhiGong3he(dizhilist),
                anHe: dizhiAnhe(dizhilist),
                zhiXing: dizhiZhixing(dizhilist),
                liuHai: dizhi6hai(dizhilist),
                liuPo: dizhi6po(dizhilist),
                sanHui: dizhi3hui(dizhilist),
                sanHe: dizhi3he(dizhilist),
                sanXing: dizhi3xing(dizhilist),
                erXing: dizhi2xing(dizhilist),
                duHe: dizhiDuhe(dizhilist)
            }
        };
    }

    function buildXiangPanLiuyi(bazi, dayunGZ, liunianGZ, liuyueGZ, liuriGZ) {
        var tianganlist = [bazi.getYearGan(), bazi.getMonthGan(), bazi.getDayGan(), bazi.getTimeGan()];
        var dizhilist = [bazi.getYearZhi(), bazi.getMonthZhi(), bazi.getDayZhi(), bazi.getTimeZhi()];
        var dygz = dayunGZ && dayunGZ.split("");
        var lngz = liunianGZ && liunianGZ.split("");
        var lygz = liuyueGZ && liuyueGZ.split("");
        var lrgz = liuriGZ && liuriGZ.split("");
        if (dayunGZ && dygz.length > 0) {
            tianganlist.push(dygz[0]);
            dizhilist.push(dygz[1]);
        }
        if (liunianGZ && lngz.length > 0) {
            tianganlist.push(lngz[0]);
            dizhilist.push(lngz[1]);
        }
        if (liuyueGZ && lygz.length > 0) {
            tianganlist.push(lygz[0]);
            dizhilist.push(lygz[1]);
        }
        if (liuriGZ && lrgz.length > 0) {
            tianganlist.push(lrgz[0]);
            dizhilist.push(lrgz[1]);
        }
        return {
            tiangan: {
                wuHe: tiangan5he(tianganlist),
                siCong: tiangan4cong(tianganlist),
                tianKe: tianganKe(tianganlist)
            },
            dizhi: {
                liuHe: dizhi6he(dizhilist),
                siCong: dizhi4cong(dizhilist),
                banSanHe: dizhiBan3he(dizhilist),
                gongSanHe: dizhiGong3he(dizhilist),
                anHe: dizhiAnhe(dizhilist),
                zhiXing: dizhiZhixing(dizhilist),
                liuHai: dizhi6hai(dizhilist),
                liuPo: dizhi6po(dizhilist),
                sanHui: dizhi3hui(dizhilist),
                sanHe: dizhi3he(dizhilist),
                sanXing: dizhi3xing(dizhilist),
                erXing: dizhi2xing(dizhilist),
                duHe: dizhiDuhe(dizhilist)
            }
        };
    }

    function buildXiangPanLiuyiFromLists(tianganlist, dizhilist, dayunGZ, liunianGZ, liuyueGZ, liuriGZ) {
        var dygz = dayunGZ && dayunGZ.split("");
        var lngz = liunianGZ && liunianGZ.split("");
        var lygz = liuyueGZ && liuyueGZ.split("");
        var lrgz = liuriGZ && liuriGZ.split("");
        if (dayunGZ && dygz.length > 0) {
            tianganlist.push(dygz[0]);
            dizhilist.push(dygz[1]);
        }
        if (liunianGZ && lngz.length > 0) {
            tianganlist.push(lngz[0]);
            dizhilist.push(lngz[1]);
        }
        if (liuyueGZ && lygz.length > 0) {
            tianganlist.push(lygz[0]);
            dizhilist.push(lygz[1]);
        }
        if (liuriGZ && lrgz.length > 0) {
            tianganlist.push(lrgz[0]);
            dizhilist.push(lrgz[1]);
        }
        return {
            tiangan: {
                wuHe: tiangan5he(tianganlist),
                siCong: tiangan4cong(tianganlist),
                tianKe: tianganKe(tianganlist)
            },
            dizhi: {
                liuHe: dizhi6he(dizhilist),
                siCong: dizhi4cong(dizhilist),
                banSanHe: dizhiBan3he(dizhilist),
                gongSanHe: dizhiGong3he(dizhilist),
                anHe: dizhiAnhe(dizhilist),
                zhiXing: dizhiZhixing(dizhilist),
                liuHai: dizhi6hai(dizhilist),
                liuPo: dizhi6po(dizhilist),
                sanHui: dizhi3hui(dizhilist),
                sanHe: dizhi3he(dizhilist),
                sanXing: dizhi3xing(dizhilist),
                erXing: dizhi2xing(dizhilist),
                duHe: dizhiDuhe(dizhilist)
            }
        };
    }

    var baziObj = {

        init: function (year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime) {
            if (!isValidDateTime(year, month, day, hour, minute, second)) {
                return null;
            }

            var baseDate = new Date(year, month - 1, day, hour, minute, second);
            var currentDate;
            if (summertime) {
                currentDate = adjustForDST(baseDate);
            } else {
                currentDate = baseDate;
            }

            var realsunDate;
            if (!!realsun) {
                realsunDate = layui.realsuntime.calcRealsuntime(currentDate, diqu);
                year = realsunDate.getFullYear();
                month = realsunDate.getMonth() + 1;
                day = realsunDate.getDate();
                hour = realsunDate.getHours();
                minute = realsunDate.getMinutes();
            } else {
                realsunDate = currentDate;
                year = realsunDate.getFullYear();
                month = realsunDate.getMonth() + 1;
                day = realsunDate.getDate();
                hour = realsunDate.getHours();
                minute = realsunDate.getMinutes();
            }

            this.isman = isman;
            this.realsun = realsun;
            this.diqu = diqu;
            this.wanzishi = wanzishi;
            this.summertime = summertime;
            this.baseDate = baseDate;
            this.currentDate = currentDate;
            this.realsunDate = realsunDate;

            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
            this.bazi = this.lunar.getEightChar();
            this.bazi.setSect(!!wanzishi ? 2 : 1);
            this.yun = this.bazi.getYun(isman ? 1 : 0, 2);
            this.dayun = this.yun.getDaYun(DAYUN_NUM + 1);
            this.xiaoyun = this.dayun[0].getXiaoYun();

            var d1, d2;
            if (diqu.indexOf("内蒙古") == 0 || diqu.indexOf("黑龙江") == 0) {
                d1 = diqu.substring(0, 3);
                d2 = diqu.substring(3, diqu.length);
            } else {
                d1 = diqu.substring(0, 2);
                d2 = diqu.substring(2, diqu.length);
            }
            this.diqu1 = d1;
            this.diqu2 = d2;

            return this;
        },

        getXiangPanLiuyi: function (baziData, dayunGZ, liunianGZ, liuyueGZ, liuriGZ) {
            var tianganlist = [baziData.yearCol.gan, baziData.monthCol.gan, baziData.dayCol.gan, baziData.hourCol.gan];
            var dizhilist = [baziData.yearCol.zhi, baziData.monthCol.zhi, baziData.dayCol.zhi, baziData.hourCol.zhi];
            return buildXiangPanLiuyiFromLists(tianganlist, dizhilist, dayunGZ, liunianGZ, liuyueGZ, liuriGZ);
        },

        getGanzhi12Gods: function (ganzhi, taisuiZhi) {
            return getGanzhi12Gods(ganzhi, taisuiZhi);
        },

        paipan: function (year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime) {
            if (!this.init(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime)) {
                return null;
            }

            var solar = this.solar;
            var lunar = this.lunar;
            var bazi = this.bazi;
            var dayun = this.dayun;
            var yun = this.yun;
            var realsunDate = this.realsunDate;
            var baseDate = this.baseDate;

            var yearCol = buildPillarCol(bazi, 1, isman);
            var monthCol = buildPillarCol(bazi, 2, isman);
            var dayCol = buildPillarCol(bazi, 3, isman);
            var hourCol = buildPillarCol(bazi, 4, isman);

            var taiyuan = bazi.getTaiYuan();
            var taixi = bazi.getTaiXi();
            var minggong = bazi.getMingGong();
            var shengong = bazi.getShenGong();
            var gua = minggua(solar.getYear(), isman);

            var jq = lunar.getCurrentJieQi();
            var jieqiInfo = "";
            if (!!jq) {
                if (!!jq.getName) {
                    jieqiInfo = jq.getName() + "(" + jq.getSolar().toYmdHms() + ")";
                } else {
                    jieqiInfo = jq;
                }
            } else {
                var prejq = lunar.getPrevJieQi(false);
                var nextjq = lunar.getNextJieQi(false);
                jieqiInfo = prejq.getName() + "(" + prejq.getSolar().toYmdHms() + ")之后, " + nextjq.getName() + "(" + nextjq.getSolar().toYmdHms() + ")之前";
            }

            var wuxingwangshuai = WUXING_WANGSHUAI[dizhiWuxing(bazi.getMonthZhi())];
            var wxQty = statWuxingQty(bazi, true);

            var guzong = layui.chenggu.chenggu(_jiazhi.indexOf(bazi.getYearGan() + bazi.getYearZhi()) + 1, Math.abs(lunar.getMonth()), lunar.getDay(), ZHI.indexOf(bazi.getTimeZhi()));

            var siling = getRenYuanSiLing(lunar);

            var dayunList = buildDayunList(bazi, dayun);
            var xiaoyunList = buildXiaoyunList(bazi, dayun);
            var qiyunInfo = buildQiyunInfo(yun, dayun);
            var liuyi = buildLiuyi(bazi);

            var currentData = {
                id: null,
                name: "",
                sex: isman,
                diqu1: this.diqu1,
                diqu2: this.diqu2,
                realsun: realsun,
                zhaowanzishi: wanzishi,
                gldatetime: layui.util.toDateString(realsunDate, "yyyy-MM-dd HH:mm:ss"),
                nldatetime: lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + " " + lunar.getTimeZhi() + "时",
                animal: lunar.getMonthShengXiaoExact(),
                bazi: [bazi.getYearGan(), bazi.getYearZhi(), bazi.getMonthGan(), bazi.getMonthZhi(), bazi.getDayGan(), bazi.getDayZhi(), bazi.getTimeGan(), bazi.getTimeZhi()],
                tag: ""
            };

            return {
                solar: solar,
                lunar: lunar,
                bazi: bazi,
                yun: yun,
                dayun: dayun,
                isman: isman,
                realsun: realsun,
                diqu: diqu,
                wanzishi: wanzishi,
                summertime: summertime,
                baseDate: baseDate,
                realsunDate: realsunDate,
                currentData: currentData,

                baziData: {
                    yearCol: yearCol,
                    monthCol: monthCol,
                    dayCol: dayCol,
                    hourCol: hourCol,

                    taiyuan: taiyuan,
                    taixi: taixi,
                    minggong: minggong,
                    shengong: shengong,
                    taiyuanNayin: bazi.getTaiYuanNaYin(),
                    taixiNayin: bazi.getTaiXiNaYin(),
                    minggongNayin: bazi.getMingGongNaYin(),
                    shengongNayin: bazi.getShenGongNaYin(),
                    minggua: gua,
                    dong4xi4: dong4xi4(gua),

                    riyuan: isman ? "元男" : "元女",
                    shengxiao: lunar.getYearShengXiaoByLiChun(),
                    nongli: lunar.getYearInChinese() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + " " + lunar.getTimeZhi() + "时",
                    gongli: layui.util.toDateString(baseDate, "yyyy-MM-dd HH:mm"),
                    realsunTime: layui.util.toDateString(realsunDate, "yyyy-MM-dd HH:mm"),
                    isDST: summertime && isInDST(baseDate),
                    jieqi: jieqiInfo,
                    diqu: diqu,

                    siling: siling,
                    guzong: guzong,
                    guzongInfo: layui.chenggu.chengguInfo(guzong, isman),
                    guzongDetails: layui.chenggu.chengguDetails(guzong, isman),

                    wuxingwangshuai: wuxingwangshuai,
                    wuxingQty: wxQty,

                    liuyi: liuyi,

                    qiyun: qiyunInfo,
                    dayun: dayunList,
                    xiaoyun: xiaoyunList,

                    xiaoyunStartAge: 1,
                    xiaoyunEndAge: dayun[1].getStartAge() - 1
                }
            };
        }

    };

    exports('bazi', baziObj);
});
