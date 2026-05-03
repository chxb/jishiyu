
layui.define(['bazianalyzer'], function (exports) {

    var _WX_SHENG = { "金": "水", "水": "木", "木": "火", "火": "土", "土": "金" };
    var _WX_KE = { "金": "木", "木": "土", "土": "水", "水": "火", "火": "金" };

    function _extractNayinWuxing(nayin) {
        if (nayin.indexOf("金") != -1) return "金";
        if (nayin.indexOf("木") != -1) return "木";
        if (nayin.indexOf("水") != -1) return "水";
        if (nayin.indexOf("火") != -1) return "火";
        if (nayin.indexOf("土") != -1) return "土";
        return "";
    }

    function _wuxingRelation(wx1, wx2) {
        if (wx1 === wx2) return "比和";
        if (_WX_SHENG[wx1] === wx2) return "相生";
        if (_WX_KE[wx1] === wx2) return "我克";
        if (_WX_SHENG[wx2] === wx1) return "相生";
        if (_WX_KE[wx2] === wx1) return "克我";
        return "";
    }

    var _3_XING_PAIRS = [
        ["丑", "未"], ["未", "戌"], ["戌", "丑"],
        ["寅", "巳"], ["巳", "申"], ["申", "寅"]
    ];
    var _2_XING_PAIRS = [["子", "卯"]];

    function _hasXing(zhi1, zhi2) {
        var pair = zhi1 + zhi2;
        var pairR = zhi2 + zhi1;
        for (var i = 0; i < _3_XING_PAIRS.length; i++) {
            if (_3_XING_PAIRS[i][0] + _3_XING_PAIRS[i][1] === pair ||
                _3_XING_PAIRS[i][0] + _3_XING_PAIRS[i][1] === pairR) return true;
        }
        for (var j = 0; j < _2_XING_PAIRS.length; j++) {
            if (_2_XING_PAIRS[j][0] + _2_XING_PAIRS[j][1] === pair ||
                _2_XING_PAIRS[j][0] + _2_XING_PAIRS[j][1] === pairR) return true;
        }
        if (zhi1 === zhi2 && (zhi1 === "辰" || zhi1 === "午" || zhi1 === "酉" || zhi1 === "亥")) return true;
        return false;
    }

    var _4_CONG_MAP = { "子": "午", "午": "子", "丑": "未", "未": "丑", "寅": "申", "申": "寅", "卯": "酉", "酉": "卯", "辰": "戌", "戌": "辰", "巳": "亥", "亥": "巳" };
    function _hasChong(zhi1, zhi2) {
        return _4_CONG_MAP[zhi1] === zhi2;
    }

    var _6_HAI_MAP = { "寅": "巳", "巳": "寅", "卯": "辰", "辰": "卯", "丑": "午", "午": "丑", "子": "未", "未": "子", "酉": "戌", "戌": "酉", "申": "亥", "亥": "申" };
    function _hasHai(zhi1, zhi2) {
        return _6_HAI_MAP[zhi1] === zhi2;
    }

    function _hasXingChongHai(zhi1, zhi2) {
        return _hasXing(zhi1, zhi2) || _hasChong(zhi1, zhi2) || _hasHai(zhi1, zhi2);
    }

    var _6_HE_MAP = { "子": "丑", "丑": "子", "寅": "亥", "亥": "寅", "卯": "戌", "戌": "卯", "辰": "酉", "酉": "辰", "巳": "申", "申": "巳", "午": "未", "未": "午" };
    function _has6he(zhi1, zhi2) {
        return _6_HE_MAP[zhi1] === zhi2;
    }

    var _5_HE_MAP = { "甲": "己", "己": "甲", "乙": "庚", "庚": "乙", "丙": "辛", "辛": "丙", "丁": "壬", "壬": "丁", "戊": "癸", "癸": "戊" };
    function _has5he(gan1, gan2) {
        return _5_HE_MAP[gan1] === gan2;
    }

    var _4_CONG_GAN_MAP = { "甲": "庚", "庚": "甲", "乙": "辛", "辛": "乙", "丙": "壬", "壬": "丙", "丁": "癸", "癸": "丁" };
    function _hasGanChong(gan1, gan2) {
        return _4_CONG_GAN_MAP[gan1] === gan2;
    }

    function _hasGanKe(gan1, gan2) {
        var wx1 = tianganWuxing(gan1);
        var wx2 = tianganWuxing(gan2);
        return _WX_KE[wx1] === wx2;
    }

    var _TAOHUA_MAP = {
        "申": ["酉"], "子": ["酉"], "辰": ["酉"],
        "寅": ["卯"], "午": ["卯"], "戌": ["卯"],
        "巳": ["午"], "酉": ["午"], "丑": ["午"],
        "亥": ["子"], "卯": ["子"], "未": ["子"]
    };

    var _YINYANGCHACUO_LIST = [
        "丙子", "丁丑", "戊寅", "辛卯", "壬辰", "癸巳",
        "丙午", "丁未", "戊申", "辛酉", "壬戌", "癸亥"
    ];

    function _isYingyangchacuo(dayGan, dayZhi) {
        return _YINYANGCHACUO_LIST.indexOf(dayGan + dayZhi) != -1;
    }

    var _TIANYIGUIREN_MAP = {
        "甲": ["丑", "未"], "戊": ["丑", "未"],
        "乙": ["申", "子"], "己": ["申", "子"],
        "丙": ["亥", "酉"], "丁": ["亥", "酉"],
        "壬": ["卯", "巳"], "癸": ["卯", "巳"],
        "庚": ["午", "寅"], "辛": ["午", "寅"]
    };

    function _isTianyiguiren(gan, zhi) {
        var list = _TIANYIGUIREN_MAP[gan];
        if (!list) return false;
        return list.indexOf(zhi) != -1;
    }

    var _HONGYAN_MAP = {
        "甲": ["午"], "乙": ["午"], "丙": ["寅"], "丁": ["未"],
        "戊": ["辰"], "己": ["辰"], "庚": ["戌"], "辛": ["酉"],
        "壬": ["子"], "癸": ["申"]
    };

    function _isHongyan(dayGan, zhi) {
        var list = _HONGYAN_MAP[dayGan];
        if (!list) return false;
        return list.indexOf(zhi) != -1;
    }

    var _LIUXIA_MAP = {
        "甲": ["酉"], "乙": ["戌"], "丙": ["未"], "丁": ["申"],
        "戊": ["巳"], "己": ["午"], "庚": ["辰"], "辛": ["卯"],
        "壬": ["亥"], "癸": ["寅"]
    };

    function _isLiuxia(dayGan, zhi) {
        var list = _LIUXIA_MAP[dayGan];
        if (!list) return false;
        return list.indexOf(zhi) != -1;
    }

    function _countShishen(bazi, shishenName) {
        var count = 0;
        var rigan = bazi.getDayGan();
        var gans = [bazi.getYearGan(), bazi.getMonthGan(), bazi.getDayGan(), bazi.getTimeGan()];
        var zhis = [bazi.getYearZhi(), bazi.getMonthZhi(), bazi.getDayZhi(), bazi.getTimeZhi()];

        for (var i = 0; i < gans.length; i++) {
            if (i != 2) {
                var ss = queryShishen(gans[i], rigan);
                if (ss === shishenName) count++;
            }
        }
        for (var j = 0; j < zhis.length; j++) {
            var cg = dizhiCanggan(zhis[j]);
            for (var k = 0; k < cg.length; k++) {
                var ss2 = queryShishen(cg[k], rigan);
                if (ss2 === shishenName) count++;
            }
        }
        return count;
    }

    function _findSpouseStar(bazi, isMan) {
        var rigan = bazi.getDayGan();
        var targetShishen = isMan ? "正财" : "正官";
        var gans = [bazi.getYearGan(), bazi.getMonthGan(), bazi.getDayGan(), bazi.getTimeGan()];
        var zhis = [bazi.getYearZhi(), bazi.getMonthZhi(), bazi.getDayZhi(), bazi.getTimeZhi()];
        var found = [];

        for (var i = 0; i < gans.length; i++) {
            if (queryShishen(gans[i], rigan) === targetShishen) {
                found.push({ type: "天干", pos: _pillarName(i), gan: gans[i] });
            }
        }
        for (var j = 0; j < zhis.length; j++) {
            var cg = dizhiCanggan(zhis[j]);
            for (var k = 0; k < cg.length; k++) {
                if (queryShishen(cg[k], rigan) === targetShishen) {
                    found.push({ type: "地支藏干", pos: _pillarName(j), zhi: zhis[j], gan: cg[k] });
                }
            }
        }
        return found;
    }

    function _pillarName(idx) {
        return ["年柱", "月柱", "日柱", "时柱"][idx] || "";
    }

    function _getTaohuaCount(bazi) {
        var count = 0;
        var nianzhi = bazi.getYearZhi();
        var rizhi = bazi.getDayZhi();
        var thRizhi = _TAOHUA_MAP[rizhi] ? _TAOHUA_MAP[rizhi][0] : "";
        var thNianzhi = _TAOHUA_MAP[nianzhi] ? _TAOHUA_MAP[nianzhi][0] : "";
        var zhis = [bazi.getYearZhi(), bazi.getMonthZhi(), bazi.getDayZhi(), bazi.getTimeZhi()];
        for (var i = 0; i < zhis.length; i++) {
            if (thRizhi && zhis[i] === thRizhi) count++;
            if (thNianzhi && nianzhi !== rizhi && zhis[i] === thNianzhi) count++;
        }
        return count;
    }

    function _judgeGrade(passCount) {
        if (passCount <= 3) return { grade: "坚决不可", desc: "0-3条：存在严重不合，应坚决避免" };
        if (passCount <= 6) return { grade: "下等婚", desc: "4-6条：有离婚的可能" };
        if (passCount <= 9) return { grade: "中等婚", desc: "7-9条：算是不错的婚姻组合" };
        return { grade: "上等婚", desc: "10-12条：非常难得，一般命局难以达到" };
    }

    function _unique(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i]) === -1) result.push(arr[i]);
        }
        return result;
    }

    var hehunObj = {

        hehun: function (bazi1, isMan1, bazi2, isMan2) {
            var man = isMan1 ? bazi1 : bazi2;
            var woman = isMan1 ? bazi2 : bazi1;

            var results = [];

            var arr1 = [bazi1.getYearGan() + bazi1.getYearZhi(), bazi1.getMonthGan() + bazi1.getMonthZhi(), bazi1.getDayGan() + bazi1.getDayZhi(), bazi1.getTimeGan() + bazi1.getTimeZhi()];
            var arr2 = [bazi2.getYearGan() + bazi2.getYearZhi(), bazi2.getMonthGan() + bazi2.getMonthZhi(), bazi2.getDayGan() + bazi2.getDayZhi(), bazi2.getTimeGan() + bazi2.getTimeZhi()];

            this.a1 = layui.bazianalyzer.analyze(arr1);
            this.a2 = layui.bazianalyzer.analyze(arr2);

            results.push(this.rule1_shengxiao(bazi1, bazi2));
            results.push(this.rule2_nayin(bazi1, bazi2));
            results.push(this.rule3_hungong(bazi1, bazi2));
            results.push(this.rule4_shizhu_wuxing(bazi1, bazi2));
            results.push(this.rule12_nianzhu(bazi1, bazi2));
            results.push(this.rule5_yongshen(bazi1, bazi2));
            results.push(this.rule6_shishen(man, true, woman, false));
            results.push(this.rule7_tiaohou(bazi1, bazi2));
            results.push(this.rule8_kongwang(bazi1, isMan1, bazi2, isMan2));
            results.push(this.rule9_xingge(bazi1, bazi2));
            results.push(this.rule10_taohua(bazi1, bazi2));
            results.push(this.rule11_shensha(bazi1, bazi2));

            var passCount = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i].pass) passCount++;
            }

            return {
                rules: results,
                passCount: passCount,
                totalRules: results.length,
                grade: _judgeGrade(passCount)
            };
        },

        rule1_shengxiao: function (bazi1, bazi2) {
            var zhi1 = bazi1.getYearZhi();
            var zhi2 = bazi2.getYearZhi();
            var sx1 = queryShengXiao(zhi1);
            var sx2 = queryShengXiao(zhi2);

            var conflicts = [];
            if (_hasXing(zhi1, zhi2)) conflicts.push(zhi1 + zhi2 + "相刑");
            if (_hasChong(zhi1, zhi2)) conflicts.push(zhi1 + zhi2 + "相冲");
            if (_hasHai(zhi1, zhi2)) conflicts.push(zhi1 + zhi2 + "相害");

            var pass = conflicts.length === 0;

            return {
                name: "生肖",
                desc: "双方生肖不能犯刑、冲、穿（害）",
                detail: "男方生肖" + sx1 + "(" + zhi1 + ")，女方生肖" + sx2 + "(" + zhi2 + ")",
                conflicts: conflicts,
                pass: pass,
                passDesc: pass ? "双方生肖无刑冲穿害，为吉" : "双方生肖犯" + conflicts.join("、") + "，为凶",
                implemented: true
            };
        },

        rule2_nayin: function (bazi1, bazi2) {
            var gz1 = bazi1.getYearGan() + bazi1.getYearZhi();
            var gz2 = bazi2.getYearGan() + bazi2.getYearZhi();
            var ny1 = queryNayin(gz1);
            var ny2 = queryNayin(gz2);
            var wx1 = _extractNayinWuxing(ny1);
            var wx2 = _extractNayinWuxing(ny2);
            var rel = _wuxingRelation(wx1, wx2);

            var pass = (rel === "比和") || (rel === "相生");

            return {
                name: "纳音",
                desc: "双方年柱纳音不能相克，纳音相生为吉",
                detail: "男方年柱纳音" + ny1 + "(" + wx1 + ")，女方年柱纳音" + ny2 + "(" + wx2 + ")，关系：" + rel,
                pass: pass,
                passDesc: pass ? "纳音" + rel + "，为吉" : "纳音" + rel + "，为凶",
                implemented: true
            };
        },

        rule3_hungong: function (bazi1, bazi2) {
            var zhi1 = bazi1.getYearZhi();
            var zhi2 = bazi2.getYearZhi();
            var rz1 = bazi1.getDayZhi();
            var rz2 = bazi2.getDayZhi();

            var conflicts = [];
            if (_hasXingChongHai(zhi1, rz2)) {
                var type1 = _hasXing(zhi1, rz2) ? "刑" : _hasChong(zhi1, rz2) ? "冲" : "害";
                conflicts.push("男方属相" + zhi1 + "与女方婚宫" + rz2 + "犯" + type1);
            }
            if (_hasXingChongHai(zhi2, rz1)) {
                var type2 = _hasXing(zhi2, rz1) ? "刑" : _hasChong(zhi2, rz1) ? "冲" : "害";
                conflicts.push("女方属相" + zhi2 + "与男方婚宫" + rz1 + "犯" + type2);
            }
            if (_hasXingChongHai(rz1, rz2)) {
                var type3 = _hasXing(rz1, rz2) ? "刑" : _hasChong(rz1, rz2) ? "冲" : "害";
                conflicts.push("双方婚宫" + rz1 + rz2 + "犯" + type3);
            }

            var pass = conflicts.length === 0;

            return {
                name: "婚宫",
                desc: "双方属相与日支（婚宫）之间，不能犯刑、冲、穿、克",
                detail: "男方属相" + zhi1 + "，婚宫" + rz1 + "；女方属相" + zhi2 + "，婚宫" + rz2,
                conflicts: conflicts,
                pass: pass,
                passDesc: pass ? "属相与婚宫无刑冲穿害，为吉" : conflicts.join("；") + "，为凶",
                implemented: true
            };
        },

        rule4_shizhu_wuxing: function (bazi1, bazi2) {
            var sz1 = bazi1.getTimeZhi();
            var sz2 = bazi2.getTimeZhi();
            var wx1 = dizhiWuxing(sz1);
            var wx2 = dizhiWuxing(sz2);

            var xingChongHai = [];
            if (_hasXing(sz1, sz2)) xingChongHai.push("刑");
            if (_hasChong(sz1, sz2)) xingChongHai.push("冲");
            if (_hasHai(sz1, sz2)) xingChongHai.push("害");

            var rel = _wuxingRelation(wx1, wx2);
            var wuxingKe = (rel === "我克" || rel === "克我");

            var pass = xingChongHai.length === 0 && !wuxingKe;

            var detail = "男方时支" + sz1 + "(" + wx1 + ")，女方时支" + sz2 + "(" + wx2 + ")，五行关系：" + rel;
            if (xingChongHai.length > 0) detail += "，犯" + xingChongHai.join("、");

            return {
                name: "时柱",
                desc: "双方时柱的五行，不能犯刑、冲、穿、害",
                detail: detail,
                pass: pass,
                passDesc: pass ? "时柱五行无刑冲穿害克，为吉" : (xingChongHai.length > 0 ? "时支犯" + xingChongHai.join("、") + "，" : "") + (wuxingKe ? "五行相克，" : "") + "为凶",
                implemented: true
            };
        },

        rule5_yongshen: function (bazi1, bazi2) {
            var ys1 = this.a1.yongshen;
            var ys2 = this.a2.yongshen;
            var ws1 = this.a1.wangshuai;
            var ws2 = this.a2.wangshuai;

            var complement = false;
            for (var m = 0; m < ys1.length; m++) {
                for (var n = 0; n < ys2.length; n++) {
                    if (_WX_SHENG[ys2[n]] === ys1[m] || _WX_SHENG[ys1[m]] === ys2[n]) complement = true;
                }
            }

            var sameYongshen = false;
            for (var t = 0; t < ys1.length; t++) {
                if (ys2.indexOf(ys1[t]) != -1) sameYongshen = true;
            }

            for (var p = 0; p < ys1.length; p++) {
                for (var q = 0; q < ys2.length; q++) {
                    if (ys1[p] !== ys2[q] && _WX_SHENG[ys2[q]] === ys1[p]) complement = true;
                }
            }

            var conflict = false;
            for (var r = 0; r < ys1.length; r++) {
                for (var s = 0; s < ys2.length; s++) {
                    if (_WX_KE[ys1[r]] === ys2[s] || _WX_KE[ys2[s]] === ys1[r]) {
                        conflict = true;
                    }
                }
            }

            var pass = (complement || sameYongshen) && !conflict;

            var wsLabel1 = ws1 === "strong" ? "身强" : ws1 === "weak" ? "身弱" : "平衡";
            var wsLabel2 = ws2 === "strong" ? "身强" : ws2 === "weak" ? "身弱" : "平衡";

            var detail = "男方" + wsLabel1 + "，用神" + ys1.join("") + "；";
            detail += "女方" + wsLabel2 + "，用神" + ys2.join("");

            var passDesc = "";
            if (pass) {
                if (sameYongshen && complement) passDesc = "双方用神一致且互补，为吉";
                else if (sameYongshen) passDesc = "双方用神一致，为吉";
                else passDesc = "双方用神互补，为吉";
            } else {
                if (conflict && complement) passDesc = "双方用神虽有互补但存在冲克，为凶";
                else if (conflict) passDesc = "双方用神互相排斥，为凶";
                else passDesc = "双方用神既不一致也不互补，为凶";
            }

            return {
                name: "用神",
                desc: "双方用神一致或互补为吉，互相排斥为凶",
                detail: detail,
                pass: pass,
                passDesc: passDesc,
                implemented: true
            };
        },

        rule6_shishen: function (man, manIsMan, woman, womanIsMan) {
            var manBijieCount = _countShishen(man, "比肩") + _countShishen(man, "劫财");
            var womanBijieCount = _countShishen(woman, "比肩") + _countShishen(woman, "劫财");
            var womanShangguanCount = _countShishen(woman, "伤官") + _countShishen(woman, "食神");
            var manGuanshaCount = _countShishen(man, "正官") + _countShishen(man, "七杀");

            var manKeWife = manBijieCount >= 3;
            var womanKeHusband = womanBijieCount >= 3;

            var detail = "男方比劫" + manBijieCount + "个" + (manKeWife ? "（重）" : "（轻）") + "；";
            detail += "女方比劫" + womanBijieCount + "个" + (womanKeHusband ? "（重）" : "（轻）") + "；";

            var hardMatch = false;
            if (manKeWife && womanKeHusband) {
                hardMatch = true;
                detail += "双方互克，属于硬配；";
            }

            if (womanShangguanCount >= 3 && womanBijieCount >= 3) {
                detail += "女方伤官旺且比劫重，主固执霸道克夫；";
            }
            if (manGuanshaCount >= 3 && manBijieCount >= 3) {
                detail += "男方官杀旺且比劫重，主固执霸道克妻；";
            }

            var pass = !manKeWife && !womanKeHusband;
            if (hardMatch) pass = false;

            return {
                name: "十神",
                desc: "比劫重、伤官旺（女方克夫）或比劫重、官杀旺（男方克妻），为凶；硬配为不得已",
                detail: detail,
                pass: pass,
                passDesc: hardMatch ? "硬配（双方互克），为不得已的选择" : pass ? "双方十神配置平和，为吉" : "一方克性较重，为凶",
                implemented: true
            };
        },

        rule7_tiaohou: function (bazi1, bazi2) {

            var th1 = this.a1.tiaohou;
            var th2 = this.a2.tiaohou;

            var detail = "男方调候用神" + (!!th1&&th1.length>0? th1.join(""):"无") + "；";
            detail += "女方调候用神" + (!!th2&&th2.length>0? th2.join(""):"无");  

            if (!th1 || th1.length === 0 || !th2 || th2.length === 0) {
                
                return {
                    name: "调候",
                    desc: "双方调候用神要能互补",
                    detail: detail,
                    pass: false,
                    passDesc: "无法判断",
                    implemented: false
                };
            }

            var complement = false;
            for (var m = 0; m < th1.length; m++) {
                for (var n = 0; n < th2.length; n++) {
                    if (th1[m] !== th2[n] && (_WX_SHENG[th1[m]] === th2[n] || _WX_SHENG[th2[n]] === th1[m])) complement = true;
                }
            }

            var sameTiaohou = false;
            for (var i = 0; i < th1.length; i++) {
                if (th2.indexOf(th1[i]) != -1) sameTiaohou = true;
            }

            var conflict = false;
            for (var r = 0; r < th1.length; r++) {
                for (var s = 0; s < th2.length; s++) {
                    if (_WX_KE[th1[r]] === th2[s] || _WX_KE[th2[s]] === th1[r]) {
                        conflict = true;
                    }
                }
            }

            var pass = (complement || sameTiaohou) && !conflict;

            var passDesc = "";
            if (pass) {
                if (sameTiaohou && complement) passDesc = "调候用神一致且互补，为吉";
                else if (sameTiaohou) passDesc = "调候用神一致，为吉";
                else passDesc = "调候互补，为吉";
            } else {
                if (conflict && complement) passDesc = "调候虽有互补但存在冲克，为凶";
                else if (conflict) passDesc = "调候用神互相排斥，为凶";
                else passDesc = "调候不能互补，为凶";
            }

            return {
                name: "调候",
                desc: "双方调候用神要能互补",
                detail: detail,
                pass: pass,
                passDesc: passDesc,
                implemented: true
            };
        },

        rule8_kongwang: function (bazi1, isMan1, bazi2, isMan2) {
            var spouse1 = _findSpouseStar(bazi1, isMan1);
            var spouse2 = _findSpouseStar(bazi2, isMan2);

            var noSpouse1 = spouse1.length === 0;
            var noSpouse2 = spouse2.length === 0;

            var kw1 = queryKongwang(bazi1.getDayGan() + bazi1.getDayZhi());
            var kw2 = queryKongwang(bazi2.getDayGan() + bazi2.getDayZhi());

            var rz1 = bazi1.getDayZhi();
            var rz2 = bazi2.getDayZhi();
            var hunGongKong1 = kw1 && kw1.indexOf(rz1) != -1;
            var hunGongKong2 = kw2 && kw2.indexOf(rz2) != -1;

            var spouseKong1 = false;
            if (kw1) {
                for (var i = 0; i < spouse1.length; i++) {
                    if (spouse1[i].zhi && kw1.indexOf(spouse1[i].zhi) != -1) spouseKong1 = true;
                }
            }
            var spouseKong2 = false;
            if (kw2) {
                for (var j = 0; j < spouse2.length; j++) {
                    if (spouse2[j].zhi && kw2.indexOf(spouse2[j].zhi) != -1) spouseKong2 = true;
                }
            }

            var detail = "";
            detail += "男方" + (isMan1 ? "财星(妻星)" : "官星(夫星)") + (noSpouse1 ? "无" : "有" + spouse1.length + "个") + "，";
            detail += "日柱空亡" + (kw1 || "无") + "，";
            detail += "婚宫坐空亡" + (hunGongKong1 ? "是" : "否") + "，";
            detail += "夫妻星坐空亡" + (spouseKong1 ? "是" : "否") + "；";
            detail += "女方" + (isMan2 ? "财星(妻星)" : "官星(夫星)") + (noSpouse2 ? "无" : "有" + spouse2.length + "个") + "，";
            detail += "日柱空亡" + (kw2 || "无") + "，";
            detail += "婚宫坐空亡" + (hunGongKong2 ? "是" : "否") + "，";
            detail += "夫妻星坐空亡" + (spouseKong2 ? "是" : "否");

            var pass = !noSpouse1 && !noSpouse2 && !hunGongKong1 && !hunGongKong2 && !spouseKong1 && !spouseKong2;

            var failReasons = [];
            if (noSpouse1) failReasons.push("男方无" + (isMan1 ? "财" : "官") + "星");
            if (noSpouse2) failReasons.push("女方无" + (isMan2 ? "财" : "官") + "星");
            if (hunGongKong1 || hunGongKong2) failReasons.push("婚宫坐空亡");
            if (spouseKong1 || spouseKong2) failReasons.push("夫妻星坐空亡");

            return {
                name: "空亡",
                desc: "无财星/官星、夫妻星或婚姻宫坐空亡为凶",
                detail: detail,
                pass: pass,
                passDesc: pass ? "夫妻星俱在且不坐空亡，为吉" : failReasons.join("，") + "，为凶",
                implemented: true
            };
        },

        rule9_xingge: function (bazi1, bazi2) {

            var p1 = this.a1.personality;
            var p2 = this.a2.personality;

            const generate = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
            const control = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
            function calcSimilarity(p1, p2) {
                let score = 0;
                if (p1.core === p2.core) score += 30;
                if (p1.dominantWuxing === p2.dominantWuxing) score += 30;
                if (p1.dominantShishen === p2.dominantShishen) score += 20;
                if (p1.style === p2.style) score += 20;
                return score; // 0~100
            }
            function calcComplement(p1, p2) {
                let score = 0;

                // p1生p2
                if (generate[p1.dominantWuxing] === p2.dominantWuxing) {
                    score += 40;
                }

                // p2生p1
                if (generate[p2.dominantWuxing] === p1.dominantWuxing) {
                    score += 40;
                }

                // 一强一弱 → 加分
                if (p1.style !== p2.style) {
                    score += 20;
                }

                return score;
            }
            function calcConflict(p1, p2) {
                let score = 0;

                // 五行相克
                if (control[p1.dominantWuxing] === p2.dominantWuxing) {
                    score += 40;
                }

                if (control[p2.dominantWuxing] === p1.dominantWuxing) {
                    score += 40;
                }

                // 行为冲突
                if (
                    (p1.dominantShishen === "食伤" && p2.dominantShishen === "官杀") ||
                    (p2.dominantShishen === "食伤" && p1.dominantShishen === "官杀")
                ) {
                    score += 30;
                }

                if (
                    (p1.dominantShishen === "比劫" && p2.dominantShishen === "财") ||
                    (p2.dominantShishen === "比劫" && p1.dominantShishen === "财")
                ) {
                    score += 20;
                }

                return score;
            }            
            function buildExplanation(p1, p2) {
                let highlights = [];
                let risks = [];

                if (p1.dominantWuxing === p2.dominantWuxing) {
                    highlights.push("性格气质相近，容易相互理解");
                }

                if (generate[p1.dominantWuxing] === p2.dominantWuxing) {
                    highlights.push("一方对另一方有支持作用");
                }

                if (control[p1.dominantWuxing] === p2.dominantWuxing) {
                    risks.push("容易产生控制或压制关系");
                }

                return { highlights, risks };
            }
            function analyzeCompatibility(p1, p2) {

                const sim = calcSimilarity(p1, p2);
                const comp = calcComplement(p1, p2);
                const conflict = calcConflict(p1, p2);

                let total = sim * 0.4 + comp * 0.3 - conflict * 0.3;

                total = Math.max(0, Math.min(100, total));

                let level =
                    total >= 80 ? "高度契合" :
                        total >= 60 ? "较合适" :
                            total >= 40 ? "一般" :
                                "较多冲突";

                return {
                    score: Math.round(total),
                    level,
                    detail: {
                        similarity: sim,
                        complement: comp,
                        conflict
                    }
                };
            }

            var result = analyzeCompatibility(p1, p2);
            var exp = buildExplanation(p1, p2);

            var detail = "男方" + p1.core + "，主导" + p1.dominantWuxing + p1.dominantShishen + "，" + p1.style + "；";
            detail += "女方" + p2.core + "，主导" + p2.dominantWuxing + p2.dominantShishen + "，" + p2.style + "；";
            detail += "契合度" + result.score + "分（" + result.level + "）";
            if (exp.highlights.length > 0) detail += "，亮点：" + exp.highlights.join("；");
            if (exp.risks.length > 0) detail += "，风险：" + exp.risks.join("；");

            var pass = result.score >= 40;

            return {
                name: "性格",
                desc: "双方脾气不合的，不能结婚",
                detail: detail,
                pass: pass,
                passDesc: pass ? "性格契合度" + result.score + "分（" + result.level + "），为吉" : "性格契合度仅" + result.score + "分（" + result.level + "），为凶",
                implemented: true
            };
        },

        rule10_taohua: function (bazi1, bazi2) {
            var count1 = _getTaohuaCount(bazi1);
            var count2 = _getTaohuaCount(bazi2);

            var bothSevere = count1 >= 2 && count2 >= 2;

            var detail = "男方桃花" + count1 + "个，女方桃花" + count2 + "个";

            return {
                name: "桃花",
                desc: "双方桃花都特别严重的，不能结婚",
                detail: detail,
                pass: !bothSevere,
                passDesc: bothSevere ? "双方桃花均较重，为凶" : (count1 >= 2 || count2 >= 2 ? "一方桃花较重，需注意" : "双方桃花不重，为吉"),
                implemented: true
            };
        },

        rule11_shensha: function (bazi1, bazi2) {
            var rigan1 = bazi1.getDayGan();
            var rizhi1 = bazi1.getDayZhi();
            var rigan2 = bazi2.getDayGan();
            var rizhi2 = bazi2.getDayZhi();
            var niangan1 = bazi1.getYearGan();
            var nianzhi1 = bazi1.getYearZhi();
            var niangan2 = bazi2.getYearGan();
            var nianzhi2 = bazi2.getYearZhi();

            var badSha1 = [];
            var badSha2 = [];

            var zhis1 = [bazi1.getYearZhi(), bazi1.getMonthZhi(), bazi1.getDayZhi(), bazi1.getTimeZhi()];
            var zhis2 = [bazi2.getYearZhi(), bazi2.getMonthZhi(), bazi2.getDayZhi(), bazi2.getTimeZhi()];

            for (var i = 0; i < zhis1.length; i++) {
                if (_isHongyan(rigan1, zhis1[i])) badSha1.push("红艳");
                if (_isLiuxia(rigan1, zhis1[i])) badSha1.push("流霞");
            }
            if (_isYingyangchacuo(rigan1, rizhi1)) badSha1.push("阴阳差错");

            for (var j = 0; j < zhis2.length; j++) {
                if (_isHongyan(rigan2, zhis2[j])) badSha2.push("红艳");
                if (_isLiuxia(rigan2, zhis2[j])) badSha2.push("流霞");
            }
            if (_isYingyangchacuo(rigan2, rizhi2)) badSha2.push("阴阳差错");

            badSha1 = _unique(badSha1);
            badSha2 = _unique(badSha2);

            var hasBadSha = badSha1.length > 0 || badSha2.length > 0;

            var goodSha = _isTianyiguiren(niangan1, nianzhi2) && _isTianyiguiren(niangan2, nianzhi1);

            var detail = "男方不利神煞" + (badSha1.length > 0 ? badSha1.join("、") : "无") + "；";
            detail += "女方不利神煞" + (badSha2.length > 0 ? badSha2.join("、") : "无") + "；";
            detail += "年柱互为天乙贵人" + (goodSha ? "是" : "否");

            var pass = !hasBadSha || goodSha;

            return {
                name: "神煞",
                desc: "女命忌红艳、流霞；男女忌阴阳差错日；年柱互为天乙贵人为吉",
                detail: detail,
                pass: pass,
                passDesc: goodSha ? "年柱互为天乙贵人，为吉" : hasBadSha ? "带有不利婚姻的神煞" + _unique(badSha1.concat(badSha2)).join("、") + "，为凶" : "无不利婚姻神煞，为吉",
                implemented: true
            };
        },

        rule12_nianzhu: function (bazi1, bazi2) {
            var ng1 = bazi1.getYearGan();
            var nz1 = bazi1.getYearZhi();
            var ng2 = bazi2.getYearGan();
            var nz2 = bazi2.getYearZhi();

            var ganHe = _has5he(ng1, ng2);
            var ganChong = _hasGanChong(ng1, ng2);
            var ganKe = _hasGanKe(ng1, ng2);
            var zhiHe = _has6he(nz1, nz2);
            var zhiChong = _hasChong(nz1, nz2);

            var tianHeDiHe = ganHe && !zhiChong;
            var tianKeDiChong = (ganKe || ganChong) && zhiChong;

            var detail = "男方年柱" + ng1 + nz1 + "，女方年柱" + ng2 + nz2 + "；";
            detail += "天干" + (ganHe ? "五合" : ganChong ? "相冲" : ganKe ? "相克" : "无特殊关系") + "，";
            detail += "地支" + (zhiHe ? "六合" : zhiChong ? "相冲" : "无特殊关系");

            var pass = tianHeDiHe || (!tianKeDiChong && (ganHe || zhiHe));

            var passDesc = tianHeDiHe ? "天合地合，最吉" : 
                                        tianKeDiChong ? "天克地冲，最凶" : 
                                        (ganHe || zhiHe)  ? (ganHe ? "天干五合" : "") + (zhiHe ? "地支六合" : "") + (pass ? "，为吉" : "，为凶")
                                        : "无冲克或相合关系";

            return {
                name: "年柱",
                desc: "天合地合为吉，天克地冲为凶",
                detail: detail,
                pass: pass,
                passDesc: passDesc,
                implemented: passDesc !== "无冲克或相合关系"
            };
        }
    };

    exports('hehun', hehunObj);
});
