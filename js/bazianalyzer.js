layui.define(function (exports) {

    const ganElement = {
        甲: "木", 乙: "木",
        丙: "火", 丁: "火",
        戊: "土", 己: "土",
        庚: "金", 辛: "金",
        壬: "水", 癸: "水"
    };

    const zhiElement = {
        子: "水", 丑: "土", 寅: "木", 卯: "木",
        辰: "土", 巳: "火", 午: "火", 未: "土",
        申: "金", 酉: "金", 戌: "土", 亥: "水"
    };

    const generate = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
    const control = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

    const hiddenStems = {
        子: ["癸"],
        丑: ["己", "癸", "辛"],
        寅: ["甲", "丙", "戊"],
        卯: ["乙"],
        辰: ["戊", "乙", "癸"],
        巳: ["丙", "戊", "庚"],
        午: ["丁", "己"],
        未: ["己", "丁", "乙"],
        申: ["庚", "壬", "戊"],
        酉: ["辛"],
        戌: ["戊", "辛", "丁"],
        亥: ["壬", "甲"]
    };

    const seasonTemp = {
        寅: "warm", 卯: "warm",
        巳: "hot", 午: "hot",
        申: "cool", 酉: "cool",
        亥: "cold", 子: "cold",
        辰: "neutral", 戌: "neutral",
        丑: "cold", 未: "hot"
    };

    // ================= 基础工具 =================

    function parseBazi(arr) {
        const [year, month, day, hour] = arr;
        return {
            year: { gan: year[0], zhi: year[1] },
            month: { gan: month[0], zhi: month[1] },
            day: { gan: day[0], zhi: day[1] },
            hour: { gan: hour[0], zhi: hour[1] }
        };
    }

    function relation(day, other) {
        if (day === other) return "比劫";
        if (generate[other] === day) return "印";
        if (generate[day] === other) return "食伤";
        if (control[day] === other) return "财";
        if (control[other] === day) return "官杀";
    }

    // ================= 基础旺衰 =================

    function getMonthStrength(dayElement, monthZhi) {
        const el = zhiElement[monthZhi];
        if (el === dayElement) return 5;
        if (generate[el] === dayElement) return 3;
        if (control[el] === dayElement) return -4;
        if (generate[dayElement] === el) return -2;
        return 0;
    }

    function calculateBaseStrength(bazi) {
        const dayElement = ganElement[bazi.day.gan];
        let score = 0;
        let detail = [];

        const m = getMonthStrength(dayElement, bazi.month.zhi);
        score += m;
        detail.push({ type: "月令", score: m });

        ["year", "month", "day", "hour"].forEach(pos => {
            let el = zhiElement[bazi[pos].zhi];
            let rel = relation(dayElement, el);

            let s = rel === "比劫" || rel === "印" ? 2 :
                rel === "官杀" ? -2 : -1;

            score += s;
            detail.push({ type: pos + "支", rel, score: s });
        });

        ["year", "month", "hour"].forEach(pos => {
            let el = ganElement[bazi[pos].gan];
            let rel = relation(dayElement, el);

            let s = rel === "比劫" || rel === "印" ? 1 : -1;
            score += s;
            detail.push({ type: pos + "干", rel, score: s });
        });

        return { score, detail, dayElement };
    }

    // ================= 藏干 + 通根 =================

    function getRootScore(dayElement, zhi) {
        let score = 0;

        hiddenStems[zhi].forEach((gan, idx) => {
            let el = ganElement[gan];
            let rel = relation(dayElement, el);

            let w = idx === 0 ? 1.5 : idx === 1 ? 1 : 0.5;

            if (rel === "比劫" || rel === "印") score += 2 * w;
            if (rel === "食伤" || rel === "财") score -= 1 * w;
            if (rel === "官杀") score -= 1.5 * w;
        });

        return score;
    }

    // ================= 从格 =================

    function detectCongGe(bazi) {
        let support = 0, oppose = 0;
        const dayElement = ganElement[bazi.day.gan];

        ["year", "month", "day", "hour"].forEach(pos => {
            hiddenStems[bazi[pos].zhi].forEach(gan => {
                let el = ganElement[gan];
                let rel = relation(dayElement, el);
                if (rel === "比劫" || rel === "印") support++;
                else oppose++;
            });
        });

        if (support >= 8 && oppose <= 2) return "从强";
        if (oppose >= 8 && support <= 2) return "从弱";
        return null;
    }

    // ================= 调候 =================
    function getTiaoHou(bazi) {
        const monthZhi = bazi.month.zhi;
        const dayElement = ganElement[bazi.day.gan];

        // 月令基础温度 
        const baseTemp = seasonTemp[monthZhi];
        // cold / hot / warm / cool / neutral

        // 全局冷热统计
        let hot = 0;
        let cold = 0;

        ["year", "month", "day", "hour"].forEach(pos => {
            const gan = bazi[pos].gan;
            const zhi = bazi[pos].zhi;

            const elGan = ganElement[gan];
            const elZhi = zhiElement[zhi];

            // 天干
            if (elGan === "火") hot += 2;
            if (elGan === "土") hot += 1;
            if (elGan === "水") cold += 2;
            if (elGan === "金") cold += 1;

            // 地支
            if (elZhi === "火") hot += 2;
            if (elZhi === "土") hot += 1;
            if (elZhi === "水") cold += 2;
            if (elZhi === "金") cold += 1;
        });

        // 基础调候 
        let primary = [];
        let secondary = [];

        if (baseTemp === "cold") primary.push("火");
        if (baseTemp === "hot") primary.push("水");

        if (baseTemp === "cool") secondary.push("火");
        if (baseTemp === "warm") secondary.push("水");

        // 全局修正 
        const diff = hot - cold;

        if (diff >= 4) {
            primary = ["水"];
        } else if (diff <= -4) {
            primary = ["火"];
        }

        // 日主调候规则（关键增强）

        // 木：寒需火
        if (dayElement === "木" && (baseTemp === "cold" || diff < -2)) {
            primary.unshift("火");
        }

        // 金：热需水
        if (dayElement === "金" && (baseTemp === "hot" || diff > 2)) {
            primary.unshift("水");
        }

        // 水：寒过需土火
        if (dayElement === "水" && diff < -3) {
            primary.unshift("土", "火");
        }

        // 火：太热需水
        if (dayElement === "火" && diff > 3) {
            primary.unshift("水");
        }
        // primary去重
        primary = [...new Set(primary)];

        // 去重 + 输出 
        const tiaohou = [...new Set([...primary, ...secondary])];

        return {
            tiaohou,          // 调候用神
            primary,           // 一级用神（优先）
            secondary,         // 次级建议
            temperature: {
                baseTemp,
                hotScore: hot,
                coldScore: cold,
                diff,
                trend:
                    diff >= 3 ? "偏热" :
                        diff <= -3 ? "偏寒" : "平衡"
            }
        };
    }

    // ================= 格局 =================

    function detectGeJu(bazi) {
        const dayEl = ganElement[bazi.day.gan];
        const monthEl = ganElement[bazi.month.gan];
        const rel = relation(dayEl, monthEl);

        if (rel === "官杀") return "官格";
        if (rel === "财") return "财格";
        if (rel === "食伤") return "食伤格";

        return null;
    }

    // ================= 用神 =================

    function getYongShen(score, cong, dayElement) {

        // 反查：谁生我
        const beGeneratedBy = Object.keys(generate)
            .find(k => generate[k] === dayElement);

        // 反查：谁克我
        const beControlledBy = Object.keys(control)
            .find(k => control[k] === dayElement);

        // 十神 → 五行
        const map = {
            比劫: dayElement,
            印: beGeneratedBy,
            食伤: generate[dayElement],
            财: control[dayElement],
            官杀: beControlledBy
        };

        let shishenList = [];

        if (cong === "从强") {
            shishenList = ["比劫", "印"];
        } else if (cong === "从弱") {
            shishenList = ["财", "官杀", "食伤"];
        } else {
            if (score >= 5) {
                shishenList = ["食伤", "财", "官杀"];
            } else if (score <= -5) {
                shishenList = ["印", "比劫"];
            } else {
                return ["调和"]; // 保持你原逻辑
            }
        }

        // 转成五行
        const elements = shishenList.map(s => map[s]);

        return [...new Set(elements)];
    }

    // 五行统计
    function getWuxingStats(bazi) {
        let stats = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

        ["year", "month", "day", "hour"].forEach(pos => {
            const gan = bazi[pos].gan;
            const zhi = bazi[pos].zhi;

            stats[ganElement[gan]]++;
            stats[zhiElement[zhi]]++;
        });

        return stats;
    }

    // 十神统计
    function getShiShenStats(bazi, dayElement) {
        let stats = { 比劫: 0, 印: 0, 食伤: 0, 财: 0, 官杀: 0 };

        ["year", "month", "day", "hour"].forEach(pos => {
            const zhi = bazi[pos].zhi;

            hiddenStems[zhi].forEach(gan => {
                const el = ganElement[gan];
                const rel = relation(dayElement, el);
                if (stats[rel] !== undefined) stats[rel]++;
            });
        });

        return stats;
    }

    // 核心人格
    function getCorePersonality(dayElement) {
        const map = {
            木: "成长型人格（理想、上进、直）",
            火: "表达型人格（外向、热情、表现欲）",
            土: "稳定型人格（务实、包容、责任）",
            金: "规则型人格（理性、自律、原则）",
            水: "思考型人格（敏感、灵活、多变）"
        };
        return map[dayElement];
    }

    // 分析人格
    function analyzePersonality(bazi, strength) {

        const dayElement = ganElement[bazi.day.gan];

        const elementStats = getWuxingStats(bazi);
        const shishenStats = getShiShenStats(bazi, dayElement);

        // ===== 主导五行 =====
        const dominantWuxing = Object.keys(elementStats)
            .sort((a, b) => elementStats[b] - elementStats[a])[0];

        // ===== 主导十神 =====
        const dominantShishen = Object.keys(shishenStats)
            .sort((a, b) => shishenStats[b] - shishenStats[a])[0];

        // ===== 行为模式描述 =====
        const shishenDesc = {
            比劫: "自我意识强，独立性高，竞争心强",
            印: "重安全感，偏内向，依赖性较强",
            食伤: "表达欲强，有创造力，略叛逆",
            财: "现实务实，重资源与控制",
            官杀: "自律守规，有压力感，责任强"
        };

        // ===== 旺衰修正 =====
        let style = "";
        if (strength === "strong") {
            style = "外向主动型";
        } else if (strength === "weak") {
            style = "内敛被动型";
        } else {
            style = "平衡型";
        }

        // ===== 风险点 =====
        let risk = [];
        if (shishenStats["食伤"] >= 4) risk.push("情绪外放，易冲动");
        if (shishenStats["官杀"] >= 4) risk.push("压力大，易焦虑");
        if (shishenStats["比劫"] >= 4) risk.push("固执，好胜");
        if (elementStats["火"] >= 4) risk.push("急躁");
        if (elementStats["水"] >= 4) risk.push("多思敏感");

        return {
            core: getCorePersonality(dayElement),  //核心人格
            dominantWuxing,    //主导五行
            dominantShishen,    //主导十神
            behavior: shishenDesc[dominantShishen], //行为模式
            style,                //旺衰修正
            risk
        };
    }

    var baziAnalyzerObj = {

        // ================= 主函数 =================
        analyze: function (baziArr) {
            const bazi = parseBazi(baziArr);

            const base = calculateBaseStrength(bazi);

            let rootScore = 0;
            ["year", "month", "day", "hour"].forEach(pos => {
                rootScore += getRootScore(base.dayElement, bazi[pos].zhi);
            });

            const totalScore = base.score + rootScore;

            const cong = detectCongGe(bazi);
            const geju = detectGeJu(bazi);
            const tiaoHou = getTiaoHou(bazi);

            let yongshen = getYongShen(totalScore, cong, base.dayElement);

            // 调候优先
            yongshen = [...new Set([...tiaoHou.tiaohou, ...yongshen])];

            const personality = analyzePersonality(bazi,
                totalScore >= 5 ? "strong" :
                totalScore <= -5 ? "weak" : "balanced"
            );

            return {
                wangshuai:
                    totalScore >= 5 ? "strong" :
                        totalScore <= -5 ? "weak" : "balanced",
                congge: cong,   //从格
                geju: geju, //格局
                yongshen: yongshen, //旺衰用神
                tiaohou: tiaoHou.tiaohou, //调候用神
                detail: base.detail,
                personality: personality
            };
        }
    };

    exports('bazianalyzer', baziAnalyzerObj);
});