// 六爻排盘
layui.define(function (exports) {

    // 卦象编码
    const guaCodeMap = {
        "111": "乾", "000": "坤",
        "001": "震", "010": "坎",
        "100": "艮", "110": "巽",
        "101": "离", "011": "兑"
    };

    // 归魂卦列表
    const guiHunList = [
        ['离', '乾'], ['震', '兑'], ['乾', '离'], ['兑', '震'],
        ['艮', '巽'], ['坤', '坎'], ['巽', '艮'], ['坎', '坤']
    ];
    // 游魂卦列表
    const youHunList = [
        ['离', '坤'], ['震', '艮'], ['乾', '坎'], ['兑', '巽'],
        ['艮', '震'], ['坤', '离'], ['巽', '兑'], ['坎', '乾']
    ];
    // 六冲卦列表
    const liuChongList = [
        ['乾', '乾'], ['坎', '坎'], ['艮', '艮'], ['震', '震'],
        ['巽', '巽'], ['离', '离'], ['坤', '坤'], ['兑', '兑'],
        ['震', '乾'], ['乾', '震']
    ];
    // 六合卦列表
    const liuHeList = [
        ['坤', '震'], ['震', '坤'], ['坎', '兑'], ['兑', '坎'],
        ['艮', '离'], ['离', '艮'], ['坤', '乾'], ['乾', '坤']
    ];

    // 天干纳甲
    const ganMap = {
        '乾': { inner: '甲', outer: '壬' },
        '坤': { inner: '乙', outer: '癸' },
        '艮': { inner: '丙', outer: '丙' },
        '兑': { inner: '丁', outer: '丁' },
        '坎': { inner: '戊', outer: '戊' },
        '离': { inner: '己', outer: '己' },
        '震': { inner: '庚', outer: '庚' },
        '巽': { inner: '辛', outer: '辛' }
    };

    // 地支纳甲
    const zhiMap = {
        '乾': { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
        '兑': { inner: ['巳', '卯', '丑'], outer: ['亥', '酉', '未'] },
        '离': { inner: ['卯', '丑', '亥'], outer: ['酉', '未', '巳'] },
        '震': { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
        '巽': { inner: ['丑', '亥', '酉'], outer: ['未', '巳', '卯'] },
        '坎': { inner: ['寅', '辰', '午'], outer: ['申', '戌', '子'] },
        '艮': { inner: ['辰', '午', '申'], outer: ['戌', '子', '寅'] },
        '坤': { inner: ['未', '巳', '卯'], outer: ['丑', '亥', '酉'] }
    };

    // 五行生克关系
    const wuXing = {
        '木': { '生': '火', '克': '土', '被生': '水', '被克': '金' },
        '火': { '生': '土', '克': '金', '被生': '木', '被克': '水' },
        '土': { '生': '金', '克': '水', '被生': '火', '被克': '木' },
        '金': { '生': '水', '克': '木', '被生': '土', '被克': '火' },
        '水': { '生': '木', '克': '火', '被生': '金', '被克': '土' }
    };

    // 地支五行
    const zhiWuXing = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };

    // 卦象五行
    const guaWuXingMap = {
        '乾': '金', '兑': '金', '艮': '土', '坤': '土',
        '震': '木', '巽': '木', '坎': '水', '离': '火'
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

    ////////////////////////////////////////////////////////////////////////////////////////////
    //日煞：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：
    //驿马
    function yima(p1) {
        const conditions = {
            "申": "寅", "子": "寅", "辰": "寅", "寅": "申", "午": "申", "戌": "申", "亥": "巳", "卯": "巳", "未": "巳", "巳": "亥", "酉": "亥", "丑": "亥"
        };
        return {shenSha: "驿马", zhi: conditions[p1]}
    }
    //桃花
    function taohua(p1) {
        const conditions = {
            "申": "酉", "子": "酉", "辰": "酉", "寅": "卯", "午": "卯", "戌": "卯", "巳": "午", "酉": "午", "丑": "午", "亥": "子", "卯": "子", "未": "子"
        };

        return {shenSha: "桃花", zhi: conditions[p1]}
    }
    //日禄
    function lushen(p1) {
        const conditions = {
            "甲": "寅", "乙": "卯", "丙": "巳", "丁": "午", "戊": "巳", "己": "午", "庚": "申", "辛": "酉", "壬": "亥", "癸": "子"
        };
        return {shenSha: "日禄", zhi: conditions[p1]}
    }
    //日德：
    function ride(p1) {
        const conditions = {
            "甲": "寅", "乙": "申", "丙": "巳", "丁": "亥", "戊": "巳", "己": "寅", "庚": "申", "辛": "巳", "壬": "亥", "癸": "巳"
        }
        return { shenSha: "日德", zhi: conditions[p1] }
    }
    //破碎: 子午卯酉在巳，辰戌丑未在丑，寅申巳亥在酉
    function poshui(p1) {
        const conditions = {
            "寅": "酉", "申": "酉", "巳": "酉", "亥": "酉", "子": "巳", "午": "巳", "卯": "巳", "酉": "巳", "辰": "丑", "戌": "丑", "丑": "丑", "未": "丑"
        }
        return { shenSha: "破碎", zhi: conditions[p1] }
    }
    //文昌：甲在已 乙在午 丙戊在申，庚在亥 辛在子 丁己在酉，壬在寅 癸在卯
    function wenchang(p1) {
        const conditions = {
            "甲": "已", "乙": "午", "丙": "申", "戊": "申", "庚": "亥", "辛": "子", "丁": "酉", "己": "酉", "壬": "寅", "癸": "卯"
        }
        return { shenSha: "文昌", zhi: conditions[p1] }
    }
    //贵人: 甲戊并牛羊, 乙己鼠猴乡, 丙丁猪鸡位, 壬癸兔蛇藏, 庚辛逢虎马, 此是贵人方
    function guiren(p1, p2) { //p1：日干，p2：时辰
        const conditions1 = {//阳贵
            "甲": ["丑"], "戊": ["丑"], "乙": ["申"], "己": ["申"], "丙": ["亥"], "丁": ["亥"], "壬": ["卯"], "癸": ["卯"], "庚": ["午"], "辛": ["午"]
        }
        const conditions2 = {//阴贵
            "甲": ["未"], "戊": ["未"], "乙": ["子"], "己": ["子"], "丙": ["酉"], "丁": ["酉"], "壬": ["巳"], "癸": ["巳"], "庚": ["寅"], "辛": ["寅"]
        }
        if( ZHI[p2] >=3 && ZHI[p2] <9  ){//卯时-酉时之间
            return { shenSha: "贵人", zhi: conditions1[p1] }
        }else{
            return { shenSha: "贵人", zhi: conditions2[p1] }
        }
    }
    //月煞：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：
    //天医:以月支查
    function tianyi(p1) {
        const conditions = {
            "寅": "辰", "卯": "巳", "辰": "午", "巳": "未", "午": "申", "未": "酉", "申": "戌", "酉": "亥", "戌": "子", "亥": "丑", "子": "寅", "丑": "卯"
        }
        return { shenSha: "天医", zhi: conditions[p1] }
    }
    //地医:与天医对冲的地支
    function diyi(p1) {
        const conditions = {
            "寅": "戌", "卯": "亥", "辰": "子", "巳": "丑", "午": "寅", "未": "卯", "申": "辰", "酉": "巳", "戌": "午", "亥": "未", "子": "申","丑": "酉"
        }
        return { shenSha: "地医", zhi: conditions[p1] }
    }
    //天马：寅申月在午，卯酉月在申，辰戌月在戌，巳亥月在子，午子月在寅，未丑月在辰。
    function tianma(p1) {
        const conditions = {
            "寅": "午", "卯": "申", "辰": "戌", "巳": "子", "午": "寅", "未": "辰", "申": "午", "酉": "申", "戌": "戌", "亥": "子", "子": "寅", "丑": "辰"
        }
        return { shenSha: "天马", zhi: conditions[p1] }
    }
    //天喜: 春戌夏丑为天喜，秋辰冬未二三指；世上遇此必欢欣，百事得之皆有理。
    function tianxi(p1) {
        const conditions = {
            "寅": "戌", "卯": "戌", "辰": "戌", "巳": "丑", "午": "丑", "未": "丑", "申": "辰", "酉": "辰", "戌": "辰", "亥": "未", "子": "未", "丑": "未"
        }
        return { shenSha: "天喜", zhi: conditions[p1] }
    }
    //月德
    function yuede(p1) {
        const conditions = {
            "寅": "丙", "午": "丙", "戌": "丙", "申": "壬", "子": "壬", "辰": "壬", "亥": "甲", "卯": "甲", "未": "甲", "巳": "庚", "酉": "庚", "丑": "庚"
        };
        return { shenSha: "月德", zhi: conditions[p1] }
    }
    //灾煞:岁煞
    function zaisha(p1) {
        const conditions = {
            "寅": "子", "午": "子", "戌": "子", "申": "午", "子": "午", "辰": "午", "亥": "酉", "卯": "酉", "未": "酉", "巳": "卯", "酉": "卯", "丑": "卯"
        };
        return { shenSha: "灾煞", zhi: conditions[p1] }
    }
    //劫煞:岁煞
    function jiesha(p1) {
        const conditions = {
            "寅": "亥", "午": "亥", "戌": "亥", "申": "巳", "子": "巳", "辰": "巳", "亥": "申", "卯": "申", "未": "申", "巳": "寅", "酉": "寅", "丑": "寅"
        };
        return { shenSha: "劫煞", zhi: conditions[p1] }
    }
    //将星：日煞
    function jiangxing(p1) {
        const conditions = {
            "申": "子", "子": "子", "辰":"子", "寅": "午", "午": "午", "戌": "午", "巳": "酉", "酉": "酉", "丑": "酉", "亥": "卯", "卯": "卯", "未": "卯"
        };
        return { shenSha: "将星", zhi: conditions[p1] }
    }
    //华盖：日煞
    function huagai(p1) {
        const conditions = {
            "申": "辰", "子": "辰", "辰": "辰", "寅": "戌", "午": "戌", "戌": "戌", "巳": "丑", "酉": "丑", "丑": "丑", "亥": "未", "卯": "未", "未": "未"
        };
        return { shenSha: "华盖", zhi: conditions[p1] }
    }
    //卦身：阳世起子阴起午，俱从初交数到世
    function guashen(yaoList) {
        //从yaoList找出isShi==true的爻位，
        // 如果yao值为1, 从初爻开始从地支子开始，数到世爻位置对应的地支为卦身
        // 如果yao值为0, 从初爻开始从地支午开始，数到世爻位置对应的地支为卦身
        let shiYao = yaoList.find(y => y["isShi"] === true);
        let shiYaoIndex = yaoList.indexOf(shiYao);
        let startZhi = shiYao["yao"] === 1 ? "子" : "午";
        let zhiList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        let startIndex = zhiList.indexOf(startZhi);
        let endIndex = (startIndex + shiYaoIndex) % 12;
        let endZhi = zhiList[endIndex];
        return { shenSha: "卦身", zhi: endZhi };
    }
    //香闺: 卦身所克者为香闺
    function xianggui(yaoList,guaShen){
        var WUXING_KE = ["金木","木土","土水","水火","火金"];
        //根据guaShen对应的五行（用zhiWuXing方法）
        let guaShenWuXing = zhiWuXing[guaShen];
        //从yaoList中遍历zhi属性，找到对应的五行，找到对应的五行对应的地支，检查guaShenWuXing是否与它相克
        var xg = "";
        yaoList.forEach((y,index) => {
            let yaoZhi = y["zhi"];
            let yaoZhiWuXing = zhiWuXing[yaoZhi];
            if( WUXING_KE.indexOf(guaShenWuXing+yaoZhiWuXing)>-1 ){
                xg+= yaoZhi;
            }
        });
        return { shenSha: "香闺", zhi: xg||"无" }
    }
    //床帐：卦身所生者为床帐
    function chuangzhang(yaoList,guaShen){
        var WUXING_SHENG = ["金水","水木","木火","火土","土金"];
        //根据guaShen对应的五行（用zhiWuXing方法）
        let guaShenWuXing = zhiWuXing[guaShen];
        //从yaoList中遍历zhi属性，找到对应的五行，找到对应的五行对应的地支，检查guaShenWuXing是否与它相生
        var cz = "";
        yaoList.forEach((y,index) => {
            let yaoZhi = y["zhi"];
            let yaoZhiWuXing = zhiWuXing[yaoZhi];
            if( WUXING_SHENG.indexOf(guaShenWuXing+yaoZhiWuXing)>-1 ){
                cz+= yaoZhi;
            }
        });
        return { shenSha: "床帐", zhi: cz||"无" }
    }
    //羊刃
    function yangren(p1){
        const conditions = {
            "甲": "卯", "乙": "寅", "丙": "午", "丁": "巳", "戊": "午", "己": "巳", "庚": "酉", "辛": "申", "壬": "子", "癸": "亥"
        };
        return { shenSha: "羊刃", zhi: conditions[p1] }
    }
    //生气：月煞，正月起子顺行12支，比如午月，生气在辰
    function shengqi(p1){
        const conditions = {
            "寅": "子", "卯": "丑", "辰": "寅", "巳": "卯", "午": "辰", "未": "巳", "申": "午", "酉": "未", "戌": "申", "亥": "酉", "子": "戌", "丑": "亥"
        };
        return { shenSha: "生气", zhi: conditions[p1] }
    }
    //死气:月煞，正月起午顺行12支，比如巳月，死气在酉，代表人事物的消亡
    function siqi(p1){
        const conditions = {
            "寅": "午", "卯": "未", "辰": "申", "巳": "酉", "午": "戌", "未": "亥", "申": "子", "酉": "丑", "戌": "寅", "亥": "卯", "子": "辰", "丑": "巳"
        };
        return { shenSha: "死气", zhi: conditions[p1] }
    }
    //亡神：月煞，正月巳,二月寅,三月亥,四月申,周而复始
    function wangshen(p1){
        const conditions = {
            "寅": "巳", "卯": "寅", "辰": "亥", "巳": "申", "午": "巳", "未": "寅", "申": "亥", "酉": "申", "戌": "巳", "亥": "寅", "子": "亥", "丑": "申"
        };
        return { shenSha: "亡神", zhi: conditions[p1] }
    }
    //病符:岁煞，太岁后一辰 比如酉年 申为病符,
    function bingfu(p1){
        //根据p1，找到它的上一个地支
        let index = ZHI.indexOf(p1);
        let bf = ZHI[(index-1+12)%12];
        return { shenSha: "病符", zhi: bf }
    }
    //丧门:岁煞，太岁前二，比如申年 戌为丧
    function shangmen(p1){
        //根据p1，找到它的下2个地支
        let index = ZHI.indexOf(p1);
        let sm = ZHI[(index+2+12)%12];
        return { shenSha: "丧门", zhi: sm }
        
    }
    //吊客:岁煞，太岁后二 ，比如申年 ，午为吊。
    function diaoke(p1){
        //根据p1，找到它的上2个地支
        let index = ZHI.indexOf(p1);
        let dk = ZHI[(index-2+12)%12];
        return { shenSha: "吊客", zhi: dk }
    }
    //官符:月煞，正月起午顺行 12 辰。
    function guanfu(p1){
        const conditions = {
            "寅": "午", "卯": "未", "辰": "申", "巳": "酉", "午": "戌", "未": "亥", "申": "子", "酉": "丑", "戌": "寅", "亥": "卯", "子": "辰", "丑": "巳"
        };
        return { shenSha: "官符", zhi: conditions[p1] }
    }
    //游都:日煞，甲己在丑，乙庚在子，丙辛在寅，丁壬在巳，戊癸在申。
    function youdu(p1){
        const conditions = {
            "甲": "丑", "己": "丑", "乙": "子", "庚": "子", "丙": "寅", "辛": "寅", "丁": "巳", "壬": "巳", "戊": "申", "癸": "申"
        };
        return { shenSha: "游都", zhi: conditions[p1] }
    }
    //飞符:日煞，甲巳 乙辰 丙卯 丁寅 戊丑 己午 庚未 辛申 壬酉 癸戌，主飞来横祸
    function feifu(p1){
        const conditions = {
            "甲": "巳", "己": "午", "乙": "辰", "庚": "未", "丙": "卯", "辛": "申", "丁": "寅", "壬": "酉", "戊": "丑", "癸": "戌"
        };
        return { shenSha: "飞符", zhi: conditions[p1] }
    }
    //血支:月煞，正月起丑顺行 12 辰
    function xuezhi(p1){
        const conditions = {
            "寅": "丑", "卯": "寅", "辰": "卯", "巳": "辰", "午": "巳", "未": "午", "申": "未", "酉": "申", "戌": "酉", "亥": "戌", "子": "亥", "丑": "子"
        };
        return { shenSha: "血支", zhi: conditions[p1] }
    }
    //寡宿:季煞，春丑夏辰秋未冬戌。
    function guashu(p1){
        const conditions = {
            "寅": "丑", "卯": "丑", "辰": "丑", "巳": "辰", "午": "辰", "未": "辰", "申": "未", "酉": "未", "戌": "未", "亥": "戌", "子": "戌", "丑": "戌"
        };
        return { shenSha: "寡宿", zhi: conditions[p1] }
    }
    //孤辰:季煞，春巳夏申秋亥冬寅。
    function gucheng(p1){
        const conditions = {
            "寅": "巳", "卯": "巳", "辰": "巳", "巳": "申", "午": "申", "未": "申", "申": "亥", "酉": "亥", "戌": "亥", "亥": "寅", "子": "寅", "丑": "寅"
        };
        return { shenSha: "孤辰", zhi: conditions[p1] }
    }
    //死神:月煞，正月起已顺行 12 辰，比如申月，死神在亥，亡神降临等象。
    function sishen(p1){
        const conditions = {
            "寅": "巳", "卯": "午", "辰": "未", "巳": "申", "午": "酉", "未": "戌", "申": "亥", "酉": "子", "戌": "丑", "亥": "寅", "子": "卯", "丑": "辰"
        }
        return { shenSha: "死神", zhi: conditions[p1] }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    // 计算内外卦名称
    function getGuaName(yaoList) {
        let innerCode = yaoList.slice(0, 3).map(y => y.yao).reverse().join('');
        let outerCode = yaoList.slice(3, 6).map(y => y.yao).reverse().join('');
        return { innerGuaName: guaCodeMap[innerCode], outerGuaName: guaCodeMap[outerCode] };
    }

    // 计算世应（含 isShi 与 isYing）
    function calcShiYing2(result) {
        let inner = result["base_gua"]["yao_info"].slice(0, 3).map(y => y.yao).reverse().join('');
        let outer = result["base_gua"]["yao_info"].slice(3, 6).map(y => y.yao).reverse().join('');
        let shiIndex;

        if (inner[0] === outer[0] && inner[1] === outer[1] && inner[2] === outer[2]) {//天地人三爻都相同
            shiIndex = 5;
        } else if (inner[0] !== outer[0] && inner[1] !== outer[1] && inner[2] !== outer[2]) {//天地人三爻都不同
            shiIndex = 2;
        } else if (inner[0] == outer[0] && inner[1] !== outer[1] && inner[2] !== outer[2]) {//只有天爻相同
            shiIndex = 1;
        } else if (inner[0] != outer[0] && inner[1] == outer[1] && inner[2] == outer[2]) {//只有天爻不同
            shiIndex = 4;
        } else if (inner[0] !== outer[0] && inner[1] != outer[1] && inner[2] == outer[2]) {//只有地爻相同
            shiIndex = 3;
        } else if (inner[0] == outer[0] && inner[1] == outer[1] && inner[2] !== outer[2]) {//只有地爻不同
            shiIndex = 0;
        } else if (inner[0] !== outer[0] && inner[1] == outer[1] && inner[2] !== outer[2]) {//只有人爻相同
            shiIndex = 3;
        } else if (inner[0] == outer[0] && inner[1] !== outer[1] && inner[2] == outer[2]) {//只有人爻不同
            shiIndex = 2;
        }

        let yingIndex = shiIndex>2?(shiIndex%3):(shiIndex%3+3);

        result["base_gua"]["yao_info"][shiIndex].isShi = true;
        result["base_gua"]["yao_info"][yingIndex].isYing = true;
        result["bian_gua"]["yao_info"][shiIndex].isShi = true;
        result["bian_gua"]["yao_info"][yingIndex].isYing = true;

        return result;
    }

    function calcShiYing(result) {
        function calcShi(inner, outer) {
            var shiIdx;
            if (inner[0] === outer[0] && inner[1] === outer[1] && inner[2] === outer[2]) { //天地人三爻都相同
                shiIdx = 5;
            } else if (inner[0] !== outer[0] && inner[1] !== outer[1] && inner[2] !== outer[2]) { //天地人三爻都不同
                shiIdx = 2;
            } else if (inner[0] == outer[0] && inner[1] !== outer[1] && inner[2] !== outer[2]) { //只有天爻相同
                shiIdx = 1;
            } else if (inner[0] != outer[0] && inner[1] == outer[1] && inner[2] == outer[2]) { //只有天爻不同
                shiIdx = 4;
            } else if (inner[0] !== outer[0] && inner[1] != outer[1] && inner[2] == outer[2]) { //只有地爻相同
                shiIdx = 3;
            } else if (inner[0] == outer[0] && inner[1] == outer[1] && inner[2] !== outer[2]) { //只有地爻不同
                shiIdx = 0;
            } else if (inner[0] !== outer[0] && inner[1] == outer[1] && inner[2] !== outer[2]) { //只有人爻相同
                shiIdx = 3;
            } else if (inner[0] == outer[0] && inner[1] !== outer[1] && inner[2] == outer[2]) { //只有人爻不同
                shiIdx = 2;
            }
            return shiIdx;
        }

        let inner = result["base_gua"]["yao_info"].slice(0, 3).map(y => y.yao).reverse().join('');
        let outer = result["base_gua"]["yao_info"].slice(3, 6).map(y => y.yao).reverse().join('');
        let shiIndex = calcShi(inner, outer);
        let yingIndex = shiIndex>2?(shiIndex%3):(shiIndex%3+3);
        result["base_gua"]["yao_info"][shiIndex].isShi = true;
        result["base_gua"]["yao_info"][yingIndex].isYing = true;

        let inner2 = result["bian_gua"]["yao_info"].slice(0, 3).map(y => y.yao).reverse().join('');
        let outer2 = result["bian_gua"]["yao_info"].slice(3, 6).map(y => y.yao).reverse().join('');
        let shiIndex2 = calcShi(inner2, outer2);
        let yingIndex2 = shiIndex2>2?(shiIndex2%3):(shiIndex2%3+3);
        result["bian_gua"]["yao_info"][shiIndex2].isShi = true;
        result["bian_gua"]["yao_info"][yingIndex2].isYing = true;

        return result;


    }

    // 装上干支
    function setupGanZhi(yaoList){
        var { innerGuaName, outerGuaName } = getGuaName(yaoList);
        for (let i = 0; i < 6; i++) {
            let gua = (i < 3) ? innerGuaName : outerGuaName;
            let pos = (i < 3) ? 'inner' : 'outer';
            let posIndex = (i < 3) ? i : i - 3;
            let gan = ganMap[gua][pos];
            let zhi = zhiMap[gua][pos][posIndex];
            yaoList[i].gan = gan;
            yaoList[i].zhi = zhi;
        }
    }

    // 装天干地支
    function installGanZhi(result) {
        setupGanZhi(result["base_gua"]["yao_info"]);
        setupGanZhi(result["bian_gua"]["yao_info"]);
        return result;
    }

    // 计算卦宫
    function calcGuaGong(yaoList, innerGuaName, outerGuaName) {

        // 先判断是否归魂卦
        if (guiHunList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)) {
            return innerGuaName;
        }

        // 非归魂卦则按世爻位置计算
        const shiIndex = yaoList.findIndex(y => y.isShi);
        let guaGongName = '';

        if ([0, 1, 2, 5].includes(shiIndex)) {
            guaGongName = outerGuaName;
        } else {
            let reversedInner = yaoList.slice(0, 3).map(y => (y.yao === 1 ? 0 : 1)).reverse().join('');
            guaGongName = guaCodeMap[reversedInner];
        }
        return guaGongName;
    }

    function setupLiuQin(yaoList, guaGong) {
        const selfElement = guaWuXingMap[guaGong];

        const getLiuQin = zhi => {
            const target = zhiWuXing[zhi];
            if (wuXing[selfElement]['生'] === target) return '孙';
            if (wuXing[selfElement]['被生'] === target) return '父';
            if (wuXing[selfElement]['克'] === target) return '财';
            if (wuXing[selfElement]['被克'] === target) return '官';
            if (selfElement === target) return '兄';
        };

        for (let i = 0; i < 6; i++) {
            yaoList[i]['6qin'] = getLiuQin(yaoList[i].zhi);
        }
        return yaoList;
    }

    // 装六亲
    function installLiuQin(result, guaGong) {
        setupLiuQin(result["base_gua"]["yao_info"], guaGong);
        setupLiuQin(result["bian_gua"]["yao_info"], guaGong);
        return result;
    }

    // 装六神
    function installLiuShen(riGan) {
        const shenOrder = ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"];
        const ganMap = { '甲': 0, '乙': 0, '丙': 1, '丁': 1, '戊': 2, '己': 3, '庚': 4, '辛': 4, '壬': 5, '癸': 5 };
        const start = ganMap[riGan];
        return Array.from({ length: 6 }, (_, i) => shenOrder[(start + i) % 6]);
    }

    function renderYao(yaoData, isBase = true, baseYaoData = null) {
        const yaoDiv = document.createElement('div');
        yaoDiv.className = 'yao-row';
        
        // 左侧信息（本卦显示六亲干支）
        const leftInfo = document.createElement('div');
        leftInfo.className = 'yao-info-left';
        if (isBase) {
            leftInfo.innerHTML = `<span>${yaoData["6qin"]}</span> <span class="`+wuxingStyle(tianganWuxing(yaoData.gan))+`">${yaoData.gan}</span><span class="`+wuxingStyle(dizhiWuxing(yaoData.zhi))+`">${yaoData.zhi}</span>`+dizhiWuxing(yaoData.zhi);
            yaoDiv.appendChild(leftInfo);
        }else{
            // 变卦左侧显示变卦标识
            if (baseYaoData && (baseYaoData.type.includes('o') || baseYaoData.type.includes('x'))) {
                if (baseYaoData.type.includes('o')) {
                    leftInfo.innerHTML = '<span style="color: red; font-weight: bold;font-size: 12px">○→</span>';
                } else if (baseYaoData.type.includes('x')) {
                    leftInfo.innerHTML = '<span style="color: red; font-weight: bold;font-size: 12px">ⅹ→</span>';
                }
            }
        }
        yaoDiv.appendChild(leftInfo);

        // 爻线
        const yaoLine = document.createElement('div');
        yaoLine.className = 'yao-line';
        
        if (yaoData.yao === 1) {
            yaoLine.classList.add('yao-solid');
        } else {
            yaoLine.classList.add('yao-broken');
        }
        
        yaoDiv.appendChild(yaoLine);

        // 右侧信息
        const rightInfo = document.createElement('div');
        rightInfo.className = 'yao-info-right';
        
        if (isBase) {
            // 本卦右侧显示世应
            if (yaoData.isShi) {
                rightInfo.innerHTML = '<span">世</span>';
            } else if (yaoData.isYing) {
                rightInfo.innerHTML = '<span">应</span>';
            }
        } else {
            // 变卦右侧显示六亲干支wuxingStyle(tianganWuxing(
            rightInfo.innerHTML = `<span>${yaoData["6qin"]}</span> <span class="`+wuxingStyle(tianganWuxing(yaoData.gan))+`">${yaoData.gan}</span><span class="`+wuxingStyle(dizhiWuxing(yaoData.zhi))+`">${yaoData.zhi}</span>`+dizhiWuxing(yaoData.zhi);
        }
        
        yaoDiv.appendChild(rightInfo);
        
        return yaoDiv;
    }

    const _6yaoObj = {
        /**
         * 渲染卦盘
         * @param {HTMLElement} container 容器
         * @param {Object} panInfo 排盘信息
         */
        renderPan: function (container, panInfo) {
            var frame = `
            <div class="yao-main" id="liushen-main">
                <!-- 六神 -->
                <div class="liushen-column">
                    <div class="gua-title">六神</div>
                    <div>&nbsp;</div>
                    <div class="yao-container _6shen" id="liushen-container"></div>
                </div>
                <!-- 本卦 -->
                <div class="gua-column" id="base-main">
                    <div class="gua-title">本卦</div>
                    <div id="base_guaname">&nbsp;</div>
                    <div class="yao-container" id="base-gua"></div>
                </div>

                <!-- 变卦 -->
                <div class="gua-column" id="bian-main">
                    <div class="gua-title">变卦</div>
                    <div id="bian_guaname">&nbsp;</div>
                    <div class="yao-container" id="bian-gua"></div>
                </div>
            </div>
            `;
            //如果 container 是字符串，就用 jQuery 查找并设置 HTML；否则直接设置 HTML 到 container 元素
            if (typeof container === 'string') {
                container = $("#"+container);
            }
            $(container).html(frame);

            const baseGuaContainer = document.getElementById('base-gua');
            const bianGuaContainer = document.getElementById('bian-gua');
            const sixShenContainer = document.getElementById('liushen-container');

            // 渲染六神
            panInfo["6shen"].forEach(shen => {
                const div_sub = document.createElement('div');
                div_sub.className = 'yao-row-sub';
                div_sub.textContent = " ";
                sixShenContainer.appendChild(div_sub);
                
                const div = document.createElement('div');
                div.className = 'yao-row';
                div.textContent = shen;
                sixShenContainer.appendChild(div);

            });

            // 渲染本卦（从下到上，所以不需要reverse）
            panInfo["base_gua"]["yao_info"].forEach(yaoData => {
                const div_sub = document.createElement('div');
                div_sub.className = 'yao-row-sub';
                if( yaoData["fushen"] ){
                    div_sub.textContent = "伏神："+yaoData["fushen"]["6qin"]+" "+yaoData["fushen"]["gan"]+yaoData["fushen"]["zhi"]+dizhiWuxing(yaoData["fushen"]["zhi"]);
                    div_sub.classList.add('yao-fushen');
                }else{
                    div_sub.textContent = " ";
                }
                baseGuaContainer.appendChild(div_sub); 

                baseGuaContainer.appendChild(renderYao(yaoData, true));

            });
            $("#base_guaname").html(panInfo["base_gua"]["name"]+"("+panInfo["base_gua"]["guagong"]+((panInfo["base_gua"]["alias"])?("·<span style='color:var(--theme-color)'>"+panInfo["base_gua"]["alias"]):"")+"</span>)");
            
            // 渲染变卦
            if( this.hasBianYao ){
                $("#bian-main").show();
                panInfo["bian_gua"]["yao_info"].forEach((yaoData, index) => {
                    const div_sub = document.createElement('div');
                    div_sub.className = 'yao-row-sub';
                    div_sub.textContent = " ";
                    bianGuaContainer.appendChild(div_sub);

                    const baseYaoData = panInfo["base_gua"]["yao_info"][index];
                    bianGuaContainer.appendChild(renderYao(yaoData, false, baseYaoData));

                });
                $("#bian_guaname").html(panInfo["bian_gua"]["name"]+"("+panInfo["bian_gua"]["guagong"]+((panInfo["bian_gua"]["alias"])?("·<span style='color:var(--theme-color)'>"+panInfo["bian_gua"]["alias"]):"")+"</span>)");
            }else{
                $("#bian-main").hide();
            }
        

        }
        ,

        /**主排盘入口
         * @param {Date} datetime 日期
         * @param {string[]} yaoList 爻列表，取值范围为少阳1，少阴0，老阳1o，老阴0x
         * @returns
         */
        paipan: function (datetime, yaoList) {
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            this.diqu = "";
            this.datetime = datetime;
            this.realsunDate;
            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
            this.bazi = this.lunar.getEightChar();

            this.nianZhu = [this.bazi.getYearGan(), this.bazi.getYearZhi()];
            this.yueZhu = [this.bazi.getMonthGan(), this.bazi.getMonthZhi()];
            this.riZhu = [this.bazi.getDayGan(), this.bazi.getDayZhi()];
            this.shiZhu = [this.bazi.getTimeGan(), this.bazi.getTimeZhi()];

            this.hasBianYao = false;
            const baseList = yaoList.map(tp => {
                let yao = (tp === "1" || tp === "1o") ? 1 : 0;
                return { "yao": yao, "type": tp, "isShi": false, "isYing": false, "gan": '', "zhi": '', "6qin": '' };
            });
            //检查baseList中是否有老阳老阴
            if( baseList.some(tp => tp.type.includes('o') || tp.type.includes('x')) ){
                this.hasBianYao = true;
            }
            const bianList = yaoList.map(tp => {
                let yao = (tp === "1o") ? 0 : (tp === "0x" ? 1 : ((tp === "1") ? 1 : 0));
                return { "yao": yao, "type": tp, "isShi": false, "isYing": false, "gan": '', "zhi": '', "6qin": '' };
            });

            var { innerGuaName, outerGuaName } = getGuaName(baseList);
            let result = { 
                "base_gua": {
                    "yao_info": baseList
                }, 
                "bian_gua": {
                    "yao_info": bianList
                }, 
                "6shen": [] };

            result = calcShiYing(result);
            result = installGanZhi(result);
            const guaGong = calcGuaGong(baseList, innerGuaName, outerGuaName);
            if (guiHunList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)){
                result["base_gua"]["alias"] = "归魂";
            }
            if (youHunList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)){
                result["base_gua"]["alias"] = "游魂";
            }
            if (liuHeList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)){
                result["base_gua"]["alias"] = "六合";
            }
            if (liuChongList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)){
                result["base_gua"]["alias"] = "六冲";
            }
            result = installLiuQin(result, guaGong);
            result["6shen"] = installLiuShen(this.riZhu[0]);
            result["base_gua"]["guagong"] = guaGong;//本卦卦宫
            result["bian_gua"]["name"] = _64gua[bianList.map(y => y.yao).reverse().join('')];

            var { innerGuaName, outerGuaName } = getGuaName(bianList);
            const guaGong2 = calcGuaGong(bianList, innerGuaName, outerGuaName);
            result["bian_gua"]["guagong"] = guaGong2;//变卦卦宫
            result["base_gua"]["name"] = _64gua[baseList.map(y => y.yao).reverse().join('')];
            if (guiHunList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)){
                result["bian_gua"]["alias"] = "归魂";
            }
            if (youHunList.some(pair => pair[0] === innerGuaName && pair[1] === outerGuaName)){
                result["bian_gua"]["alias"] = "游魂";
            }

            //找伏神
            let guaCode = Object.keys(guaCodeMap).find(key => guaCodeMap[key] === guaGong);//本卦宫的卦代码
            guaCode = guaCode+guaCode;
            //将guaCode每一位代码转成对应的爻1或0，变成一个长度为6的数组，格式为[{yao:1},{yao:1}]}
            const baseGongYaoList = guaCode.split('').map(tp => {
                return { "yao": (tp === "1" || tp === "1o")? 1 : 0 };
            });
            baseGongYaoList.reverse();
            setupGanZhi(baseGongYaoList);
            setupLiuQin(baseGongYaoList, guaGong);
            const sixQinList = ["孙", "父", "兄", "财", "官"];
            sixQinList.forEach((q) => {
                //从[子孙，兄弟，妻财，官鬼，父母]中找出哪些个六亲没有出现在result["base_gua"]["yao_info"]
                if( !result["base_gua"]["yao_info"].some(y => y["6qin"] === q) ){
                    //两从baseGongYaoList中找到6qin为q的爻，放到本卦相应的爻信息中
                    baseGongYaoList.forEach((yao, index) => {
                        if(yao["6qin"] === q){
                            result["base_gua"]["yao_info"][index]["fushen"] = {};
                            result["base_gua"]["yao_info"][index]["fushen"]["6qin"] = q;
                            result["base_gua"]["yao_info"][index]["fushen"]["gan"] = yao["gan"];
                            result["base_gua"]["yao_info"][index]["fushen"]["zhi"] = yao["zhi"];
                        }
                    })
                }
            })

            //神煞
            var shenSha = [];
            var guaShen = guashen(result["base_gua"]["yao_info"]);
            shenSha.push(guaShen);
            shenSha.push(yima(this.riZhu[1]));
            shenSha.push(taohua(this.riZhu[1]));
            shenSha.push(lushen(this.riZhu[0]));
            shenSha.push(ride(this.riZhu[0]));
            shenSha.push(poshui(this.riZhu[1]));
            shenSha.push(wenchang(this.riZhu[0]));
            shenSha.push(guiren(this.riZhu[0]));
            shenSha.push(tianyi(this.yueZhu[1]));
            shenSha.push(diyi(this.yueZhu[1]));
            shenSha.push(tianma(this.yueZhu[1]));
            shenSha.push(tianxi(this.yueZhu[1]));
            shenSha.push(yuede(this.yueZhu[1]));
            shenSha.push(zaisha(this.nianZhu[1]));
            shenSha.push(jiesha(this.nianZhu[1]));
            shenSha.push(jiangxing(this.riZhu[1]));
            shenSha.push(huagai(this.riZhu[1]));
            shenSha.push(xianggui(result["base_gua"]["yao_info"],guaShen));
            shenSha.push(chuangzhang(result["base_gua"]["yao_info"],guaShen));
            shenSha.push(yangren(this.riZhu[0]));
            shenSha.push(shengqi(this.yueZhu[1]));
            shenSha.push(siqi(this.yueZhu[1]));
            shenSha.push(wangshen(this.yueZhu[1]));
            shenSha.push(bingfu(this.nianZhu[1]));
            shenSha.push(shangmen(this.nianZhu[1]));
            shenSha.push(diaoke(this.nianZhu[1]));
            shenSha.push(guanfu(this.yueZhu[1]));
            shenSha.push(youdu(this.riZhu[0]));
            shenSha.push(feifu(this.riZhu[0]));
            shenSha.push(xuezhi(this.yueZhu[1]));
            shenSha.push(gucheng(this.yueZhu[1]));
            shenSha.push(guashu(this.yueZhu[1]));
            shenSha.push(sishen(this.yueZhu[1]));

            result["shensha"] = shenSha;

            return {
                "datetime": this.datetime,
                "yaoList": yaoList,//起卦的爻列表
                "date": this.solar.getYear() + "年" + this.solar.getMonth() + "月" + this.solar.getDay() + "日" + " " + this.solar.getHour() + "时" + this.solar.getMinute() + "分" + "(" + this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese() + " " + this.shiZhu[1] + "时)",
                "siZhu": [this.nianZhu, this.yueZhu, this.riZhu, this.shiZhu],
                "solar": this.solar,
                "lunar": this.lunar,
                "jieqiInfo": {
                    "from": this.lunar.getPrevJieQi(false).getName(),
                    "fromDate": this.lunar.getPrevJieQi(false).getSolar().toYmdHms().slice(0, -3),
                    "to": this.lunar.getNextJieQi(false).getName(),
                    "toDate": this.lunar.getNextJieQi(false).getSolar().toYmdHms().slice(0, -3)
                },
                "data": result
            };
        }

    }
    
    exports('6yao', _6yaoObj);

});