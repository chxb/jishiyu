layui.define(['realsuntime'], function (exports) {

    //六道信息
    const LIUDAO_INFO = {
        "佛道": "主要习性特因所以对不曾染红尘之苦，在福报的羽翼庇佑之下，生活质量的要求超高，有洁癖、心软、爱打抱不平，也喜大自然爱云游四海，深入到山海间，虽然天道来的福报很大，但是一生易大起大落，属精神层次感性保守的特性。",
        "修罗道": "主要习性特质每天生活的汲汲盈盈，心机用尽、叛逆、爱现、我，不按牌理出牌，我行我素、不爱受人管，有勇往直前的个性，属开创性格相会之才的特性。瞋心重、个性暴燥冲动，是此生最重要的修行功课。因原本灵性也非俗世之肉体，会有偏重灵性易入禅宗，也较易有灵异体质。不屑人间的世俗礼仪假面具，因此会给人很高傲孤僻的感觉。",
        "仙道": "主要习性特质介于天人道和修罗道的特性，有天人的福报慈悲，但仍有修罗道的贪嗔欲望心性，一般仙道会有更强烈的脱俗离世的灵性，喜爱美的事物，也会有明显的专业才华，对于艺术、音乐、雕刻等，会有天生的能力和敏锐的感觉。对于世俗的利益常不屑一顾认为很庸俗，对传统道德礼俗也很叛逆或超脱，对于男女感情有其虚幻理想性，若是因为犯了色戒被降级转世，今世会受到感情很大的折磨，极易爱上不该爱的人，或是执着于莫明不理性的感情困扰中。",
        "人道": "主要习性特质介于天人道和修罗道的特性，有天人的福报慈悲，但仍有修罗道的贪嗔欲望心性，一般仙道会有更强烈的脱俗离世的灵性，喜爱美的事物，也会有明显的专业才华，对于艺术、音乐、雕刻等，会有天生的能力和敏锐的感觉。对于世俗的利益常不屑一顾认为很庸俗，对传统道德礼俗也很叛逆或超脱，对于男女感情有其虚幻理想性，若是因为犯了色戒被降级转世，今世会受到感情很大的折磨，极易爱上不该爱的人，或是执着于莫明不理性的感情困扰中。",
        "畜牲道": "主要习性特质易沈溺感情，我执非常重、固执不通，要修痴的习性，及接受别人的意见，多听朋友的建议。随遇而安，一身憨胆，无力改变现况，这世主要来修感情的功课，要学会如何放下。",
        "鬼道": "主要习性特质永不满足、好还要更好、多还要更多、贪欲难满，胆小没安全感。聪明善辩，会看人脸色讨好人，缺乏独立自主性、太过依赖，会希望别人给予物质上的支援，别人对自己的付出会认为是理所当然。要学习主动去付出及人格的独立，因过去世有着受苦的灵魂，和贫乏的物质生活，所以此生做事提不起劲，较慵懒只想休闲，但很容易满足。",
    };

    //神煞信息
    const SHENSHA_INFO = {
        "天贵": "志向高远。初限辛苦，中年有四方财，老运平吉有福。为人文雅，志气非凡，心性达观，高尚文雅，主观较强，立性坚定，进取努力。与人多有长远之情感，为人多情，朋友相交情深有持久之厚爱，可以不存积怨，坦诚，有度量。身防暗疾。",
        "天厄": "先难后易。此乃劳碌之命，做事大都先难后易。离祖成功，早年辛苦，晚年吉祥。小人常犯，志趣远大，性喜立功，为人举止文雅、静默。一生要防处事待人因为锋芒太露，乃致中挫之憾。",
        "天权": "大器晚成。中年有权柄，是可造大器之人才。利官近贵，能招四方财。胸有志向，生性聪敏，有才能，重性刚毅，富冲动力，富行动力，做事仔细小心，人缘多佳，为人机灵，精神活泼，谈吐顺畅。",
        "天破": "多情破耗。少年体弱，青年后较好。中限发高能荣，六亲少助，独立开花，克勤自立，自立更生。神经敏锐，易怒易喜，观察力强，为人多情。此人心性慷慨，疏财大方，一生要防钱财有若蛀泄漏。",
        "天奸": "事多反覆。技艺成功，有专技。做事常见反覆、缓慢，乏果断力，一生多见劳碌。为人有礼，人缘佳，性情温和，举止文雅，思绪周到。为人有机谋，多能多巧。毕生注意脾、胃、肾之疾。",
        "天文": "文采振发。初限平凡，中限平步青云，晚年荣富，自立家风。心性不定，好交朋友，口才多佳。人命逢此必有文采。",
        "天福": "风流之命。此乃荣贵之命，一生有财运，可谓百福齐聚，命多贵人接引。权势威风，性情自我，心性伶俐，多见男女情爱。傲气较盛，能屈能伸之人。只是生性稍有自私，多利己。",
        "天驿": "离祖成功。此命一生多见劳苦，离祖平安之命，身有艺业，初限有财，中限吉祥，末限能高。为人谦让，敏感，容易发怒。外柔内刚，机谋太重，做事谨慎，有时候很难接受他人意见。",
        "天孤": "修行造福。此命先天六亲缘疏，兄弟朋友少见助益，初限平平，中年能见吉顺亨通之命。不宜早婚。口才好，多具语言表达能力，思想敏锐。心性比较孤独，大都具有双重个性，有时达观，有时悲愁。",
        "天刃": "自立自成。此命离祖成功，眼目有神，多情破败，性情刚毅难屈，比较固执己见，主观强。爱好大自然，沉静，达观。命理小人常见，时有是非、纷争，此事要防。",
        "天艺": "艺道扬名。此命一生六亲难靠，不如朋友有情，但防招人是非。性好立功，权威近贵，多智多能，干练果断，做事勤奋，具有工作热忱。举止灵敏热忱，稍乏耐性，宜培养冷静处事态度。姻缘命理刑克，晚婚大吉。",
        "天寿": "克己助人。一生衣禄，末限充足有余。不动先懒，做事先难后易。神经敏锐，行为热情，重义轻财，多费力劳心。性如大海之心，心性和谐，能够克己助人，为人有情义，热忱有礼。大体来说，这是一个比较操劳型的人。"
    };

    //12宫信息
    const GONG_INFO = {
        "天贵": {
            "年": "年入天贵，心性柔顺。言语忠直，少有固执。修学方章，少年登科。若非官位，农事大吉。不犯凶患，注意身体。",
            "月": "月入天贵，中年荣华。吉人天相，人缘堪夸。口辨出众，财源生发。商贾为业，四海为家。莫入花街，损财毁誉。",
            "日": "日入天贵，守旧安常。每当危处，有人扶帮。性急如火，又有固执。未年运势，平顺安康。不追功名，最好从商。",
            "时": "时入天贵，子女成名。刚柔相济，其乐无穷。秋鼠入仓，衣食丰足。少年虽困，苦尽甘来。莫进酒色，损财伤身。",
            "年_": "年逢天贵，祖上小贵。月逢天贵，夫妻有贵。日逢天贵，本人近贵。时逢天贵，后代一贵。一贵衣禄，二贵有余，三贵定贵，四贵克子孙。"
        },
        "天厄": {
            "年": "年入天厄，初年有灾。伤兄克弟，劳心伤财。祖业难守，凡事阻碍。带疾延寿，口舌成灾。若无此厄，早别尘埃。",
            "月": "月入天厄，凶多吉少。性多固执，亲人无靠。世业如云，自立生涯。若无身厄，妻兄不合。带疾延年，可免灾祸。",
            "日": "日入天厄，疾厄常随。登舟必慎，难免水厄。明珠沉海，失意兴叹。若不伤妻，克子无疑。带疾延年，逆境行运。",
            "时": "时入天厄，运气不通。根基破败，祖业难承。雪上加霜，鱼游浅滩。造化难施，不信人言。世上万事，画中之饼。",
            "年_": "年逢天厄，父母难合。月逢天厄，婚姻压抑。日逢天厄，中年病多。时逢天厄，生时母弱。一厄离别，二厄克破，三厄衣禄，四厄得子孙。"
        },
        "天权": {
            "年": "年入天权，少年奔走。公平仗义，聪明俊秀。勤奋学习，官禄之人。广交朋友，权在四方。贵格虽好，困厄必防。",
            "月": "月入天权，丰衣足食。修身善德，可称君子。立身扬名，千金资产。荣华无穷，宏扬四海。贵格如此，以德立命。",
            "日": "日入天权，官禄之人。旱苗得雨，万事更新。文武之财，权道用之。凡事称心，欲求财物。妻室专权，亦欠全吉。",
            "时": "时入天权，公正豁达。气量宽宏，主宰有成。身书驭路，权在四方。若非官禄，以商为业。若谈人非，口舌难免。",
            "年_": "年见天权，祖父不寒。月遇天权，兄弟有权。日遇天权，霸掌家权。时遇天权，一子有权。一权平安，二权不美，三权有权，四权损伤。"
        },
        "天破": {
            "年": "年入天破，运气不通。父缘不深，祖业难承。虽有事业，胜败不平。桃花侵命，酒色成凶。东奔西走，虚度飘零。",
            "月": "月入天破，事烦心乱。亲朋无靠，多学少成。官厄相随，疾病长生。中年之运，破家败名。爬山涉水，孤苦伶仃。",
            "日": "日入天破，家境有困。事不如意，心思不顺。财帛耗散，养虎为患。不有官厄，必有病缠。亲朋无靠，祖业失传。",
            "时": "时入天破，运气不通。根基破败，祖业难承。晚年命运，始得安宁。老来富豪，膝下增荣。阅进白首，风霜如梦。",
            "年_": "年逢天破，父母远隔。月遇天破，夫妻有破。日遇天破，易发外财。时遇天破，外乡死过。一破平常，二破衣食，三破下贱，四破无子孙。"
        },
        "天奸": {
            "年": "年入天奸，智谋过人。刚柔相济，变化多端。以财取胜．名振四方。奸狡过头，反遭失败。琴官论之，妻妾可知。",
            "月": "月入天奸，中年有厄。智谋过人，刚腹自用。虽无败杀，千金自散。若无官厄，堂上有忧。不学无术，身遭困苦。",
            "日": "日入天奸，坐谋平生。蛟龙得水，变化无穷。天恩厚重，必及高官。或有灾祸，自然消减。莫近酒色，恐为祸患。",
            "时": "时入天奸，狡猾机谋。口辨有余，智慧出众。在家有利，出门操劳。进出官门，难免蹊跷。从业商贾，丰衣足食。",
            "年_": "年遇天合，父母不和。月遇天合，婚姻多散。日遇天合，兄弟有伤。时遇天合，风流倜傥。一奸多散，二奸随缘，三奸有机谋，四奸保平稳。",
        },
        "天文": {
            "年_": "年入天文，容貌端正。若勤学习，早年出仕。若废学业，劳力生涯。琴瑟和乐，亦有别难。早婚不利，晚婚皆老。",
            "月": "月入天文，文笔相应。兄文弟武，比翼双腾。虽无祖业，赤手致富。官位一品，众人仰慕。若非官禄，医艺生涯。",
            "日": "日入天文，未年荣华。用心正直，声誉堪夸。若勤学问，名列龙门。不学无术，庸碌无为。衣食有余，安渡平生。",
            "时": "时入天文，斯文之人。出入聚财，衣食富足。博学多识，人人夸好。平生所忌，火上有厄。若非官禄，妻儿双克。",
            "年_": "年见天文，聪明多能。月见天文，兄文弟武。日遇天文，必有文化。时遇天文，儿女聪明。一文聪明，二文禄缺，三文是贵，四文损眼目。",
        },
        "天福": {
            "年": "年入天福，早年富贵。人人称赞，贵人来助。每事如意，有德有信。出入官门，聪明多财。贪财太过，反有损伤。",
            "月": "月入天福，秋鼠入库。财源广进，中年发福。禄马有余，救济贫穷。莫叹配宫，不然多病。猛虎出林，权利享通。",
            "日": "日入天福，荣禄昌盛。才艺非凡，乡里留名。商贾为业，手弄千金。门庭若市，妻坐福宫。福无双至，乐极生悲。",
            "时": "时入天福，富豪之命。高台楼阁，锦衣玉食。德高望重，一身荣耀。体魄虽佳，亦有病厄。未年之运，游闲消遥。",
            "年_": "年逢天福，祖父不穷。月见天福，兄弟富足。日见天福，自有满足。时见天福，子女成群。一福多福，二福有贵，三福大贵，四福为僧。",
        },
        "天驿": {
            "年": "年入天驿，食少事烦。在家困忧，出处得利。心中有苦，世事浮云。月落琴床，婚灾亦临。周游天下，以商为本。",
            "月": "月入天驿，虚度世事。居家难安，出外可闲。有始无终，行如浮云。乐极生悲，一败一成。贫困相伴，始得安宁。",
            "日": "日入天驿，为人孤独。夫妻难合，极易反目。春林独鸟，花无叶枝。才智虽佳，每叹失数。莫恨初困，晚岁得福。",
            "时": "时入天驿，南走北奔。异城风霜，亲自历尽。心神不定，世事浮云。六亲无德，投靠无门。周游天下，以商为本。",
            "年_": "年见天驿，定有远亲。月见天驿，兄东弟西。日见天驿，走东窜西。时见天驿，外乡圆寂。一驿难存，二驿安宁，三驿下贱，四驿主奔波。",
        },
        "天孤": {
            "年": "年入天孤，心胜性闲。塞北归雁，秋夜孤飞。若非风霜，疾病罹身。鸳鸯难配，东西各飞。身虽孤独，财帛宜人。",
            "月": "月入天孤，一身孤单。兄弟无靠，独立月下。身如秋萍，四海漂泊。妄动不利，安分为营。命带香火，奉祀可宁。",
            "日": "日入天孤，为人孤独。夫妻难合，极易反目。春林孤鸟，春兰秋菊。自有其时，财智聪明。莫恨初困，未运逢贵。",
            "时": "时入天孤，骨肉情疏。一身孤单，六亲无助。手段虽好，难以如愿。恩人为仇，劳而无功。伤偶克子，晚景凄凉。",
            "年_": "年见天孤，父母远住。月见天孤，性格孤独。日占天孤，夫妻不和。时占天孤，子必刑伤。一孤不孤，二孤有子，三孤克妻，四孤主贫贱。",
        },
        "天刃": {
            "年": "年入天刃，性格固执。道观僧堂，是其去处。平生隐愁，何人可知。幼无疾患，厄加手足。权刃相逢，反而为福。",
            "月": "月入天刃，身有病痛。若无重患，落伤难免。匠工生涯，可免此厄。守旧安静，始得安身。权贵相加，必有重任。",
            "日": "日入天刃，飞鸟伤翼。蒙人之害，风波频起。出入酒间，伤财克妻。祖基不利，离乡趋吉。若无身厄，手足有疾。",
            "时": "时入天刃，为人刚直。争强好胜，不受人欺。踏遍青山，四海留名。行善积德，厄运自消。必有功名，后岁峥嵘。",
            "年_": "年见天刃，父母多气。月占天刃，兄弟有气。日见天刃，夫妻气多。时见天刃，孤独难眠。一刃不永，二刃衣禄，三刃有禄，四刃主富贵。",
        },
        "天艺": {
            "年": "年入天艺，智谋过人。心巧手技，衣食丰足。安度岁月，技艺生财。不调之叹，亦有可能。早子难养，财源茂盛。",
            "月": "月入天艺，才艺超群。兄巧弟灵，共享盛名。匠艺养身，白手可成。若非功名，才华可夸。东西流离，艺术可成。",
            "日": "日入天艺，性巧才博。文武双全，必有功名。神通之才，经国济世。东西出入，警惕风波。自身富贵，家内多厄。",
            "时": "时入天艺，学业有成。机动灵利，以才成功。六亲难靠，弱马负重。居所多移，自立为生。文武相宜，技艺驰名。",
            "年_": "年见天艺，祖上有艺。月占天艺，办事讲艺。日占天艺，本人精艺。时占天艺，子孙会艺。一艺寿高，二艺克夫，三艺文武全，四艺主贫贱。",
        },
        "天寿": {
            "年": "年入天寿，漂零孤单。若非独身，风霜尽染。仙道有缘，口舌损财。莫恨初苦，后运荣华。福寿双全，浪迹天涯。",
            "月": "月入天寿，健康有寿。欲寡神爽，东奔西走。有仁有义，聪明俊秀。一喜一悲，吉凶交流。胸怀坦荡，心有意守。",
            "日": "日入天寿，闲寂之人。天上得罪，人间谪下。每事公平，宽以待人。官非口舌，在所难免。兄耶弟耶，争则必失。",
            "时": "时入天寿，白首闲暇。丰衣足食，无忧无愁。寿过九旬，功德自有。琴瑟不调，或有妻妾。莫恨初困，晚景悠悠。",
            "年_": "年占天寿，祖上有寿。月占天寿，父母一寿。日占天寿，子孙有寿。时占天寿，不死故土。一寿有寿，二寿大寿，三寿为僧，四寿必远离。",
        }
    };

    // 12神煞
    const SHEN_SHA = {
        子: "天贵",
        丑: "天厄",
        寅: "天权",
        卯: "天破",
        辰: "天奸",
        巳: "天文",
        午: "天福",
        未: "天驿",
        申: "天孤",
        酉: "天刃",
        戌: "天艺",
        亥: "天寿"
    };

    // 六道
    const LIUDAO = {
        子: "佛道",
        丑: "鬼道",
        寅: "人道",
        卯: "畜牲道",
        辰: "修罗道",
        巳: "仙道",
        午: "佛道",
        未: "鬼道",
        申: "人道",
        酉: "畜牲道",
        戌: "修罗道",
        亥: "仙道"
    };


    function moveZhi(startZhi, step) {
        let index = ZHI.indexOf(startZhi);
        let newIndex = (index + step + 12) % 12;
        if (newIndex < 0) {
            newIndex += 12;
        }
        return ZHI[newIndex]
    }

    function calcMonthGong(yearZhi, month, isSun) {
        let step = month - 1
        if (!isSun) {
            step = -step
        }
        return moveZhi(yearZhi, step)
    }

    function calcDayGong(monthGong, day, isSun) {
        let step = day - 1
        if (!isSun) {
            step = -step
        }
        return moveZhi(monthGong, step)
    }

    function calcHourGong(dayGong, hourZhi, isSun) {
        let hourIndex = ZHI.indexOf(hourZhi)
        let step = hourIndex
        if (!isSun) {
            step = -step
        }
        return moveZhi(dayGong, step)

    }



    var yizhangjingObj = {

        /**
         * 
         * @param {date} datetime 时间对象
         * @param {boolean} realsun 是否真太阳时
         * @param {string} diqu 地区
         * @param {boolean} isMan 是否男的
         * @param {int} sunni 顺逆方式，1为按男顺女逆, 2为阳男阴女顺，阴男阳女逆
         */
        _init: function (datetime, realsun, diqu, isMan, sunni = 1) {

            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            this.realsun = realsun;
            this.isMan = isMan;
            this.sunni = sunni;
            this.datetime = datetime;
            this.realsunDate;
            if (!!realsun) {//转换为真太阳时
                var realsunDate = layui.realsuntime.calcRealsuntime(datetime, diqu);
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

            return this;
        },

        // 计算年、月、日、时宫的神煞和六道信息。
        _4gong: function () {

            const yinyangGan = {
                "甲": "阳", "乙": "阴", "丙": "阳", "丁": "阴", "戊": "阳",
                "己": "阴", "庚": "阳", "辛": "阴", "壬": "阳", "癸": "阴"
            };

            var isSun = true;
            if (this.sunni == 1) { // 男顺女逆
                isSun = this.isMan;
            } else if (this.sunni == 2) { // 阳男阴女顺，阴男阳女逆
                isSun = this.isMan && yinyangGan[this.lunar.getYearGan()] == "阳" || !this.isMan && yinyangGan[this.lunar.getYearGan()] == "阴";
            } else {
                throw new Error("顺逆参数错误");
            }

            this.nianGong = this.lunar.getYearZhi();
            this.yueGong = calcMonthGong(this.lunar.getYearZhi(), this.lunar.getMonth() < 0 && this.lunar.getDay() >= 15 ? Math.abs(this.lunar.getMonth()) + 1 : Math.abs(this.lunar.getMonth()), isSun);
            this.riGong = calcDayGong(this.yueGong, this.lunar.getDay(), isSun);
            this.shiGong = calcHourGong(this.riGong, this.lunar.getTimeZhi(), isSun);

            return {
                "year": {
                    "zhi": this.nianGong,
                    "shensha": SHEN_SHA[this.nianGong],
                    "liudao": LIUDAO[this.nianGong],
                    "liudao_info": LIUDAO_INFO[LIUDAO[this.nianGong]],
                    "gong_info": GONG_INFO[SHEN_SHA[this.nianGong]]["年"],
                    "gong_info_": GONG_INFO[SHEN_SHA[this.nianGong]]["年_"],
                    "shensha_info": SHENSHA_INFO[SHEN_SHA[this.nianGong]]
                },
                "month": {
                    "zhi": this.yueGong,
                    "shensha": SHEN_SHA[this.yueGong],
                    "liudao": LIUDAO[this.yueGong],
                    "liudao_info": LIUDAO_INFO[LIUDAO[this.yueGong]],
                    "gong_info": GONG_INFO[SHEN_SHA[this.yueGong]]["月"],
                    "shensha_info": SHENSHA_INFO[SHEN_SHA[this.yueGong]]
                },
                "day": {
                    "zhi": this.riGong,
                    "shensha": SHEN_SHA[this.riGong],
                    "liudao": LIUDAO[this.riGong],
                    "liudao_info": LIUDAO_INFO[LIUDAO[this.riGong]],
                    "gong_info": GONG_INFO[SHEN_SHA[this.riGong]]["日"],
                    "shensha_info": SHENSHA_INFO[SHEN_SHA[this.riGong]]
                },
                "hour": {
                    "zhi": this.shiGong,
                    "shensha": SHEN_SHA[this.shiGong],
                    "liudao": LIUDAO[this.shiGong],
                    "liudao_info": LIUDAO_INFO[LIUDAO[this.shiGong]],
                    "gong_info": GONG_INFO[SHEN_SHA[this.shiGong]]["时"],
                    "shensha_info": SHENSHA_INFO[SHEN_SHA[this.shiGong]]
                }
            }
        },

        getGongInfo: function(gongName){
            return [
                "<span style='font-weight:bold'>"+SHEN_SHA[gongName] + "宫</span>",
                GONG_INFO[SHEN_SHA[gongName]]["年"],
                GONG_INFO[SHEN_SHA[gongName]]["月"],
                GONG_INFO[SHEN_SHA[gongName]]["日"],
                GONG_INFO[SHEN_SHA[gongName]]["时"],
                GONG_INFO[SHEN_SHA[gongName]]["年_"],
                "",
                "<span style='font-weight:bold'>"+LIUDAO[gongName] + "</span>",
                LIUDAO_INFO[LIUDAO[gongName]],
            ].join("<br/>");
        },
        getLiudaoInfo: function(liudao){
            return [
                "<span style='font-weight:bold'>"+liudao + "</span>",
                "",
                LIUDAO_INFO[liudao],
            ].join("<br/>");
        },
        getShenshaInfo: function(shensha){
            return [
                "<span style='font-weight:bold'>"+shensha + "宫</span>",
                "",
                SHENSHA_INFO[shensha],
            ].join("<br/>");
        },

        paipan: function (params) {
            this._init(params["datetime"], params["realsun"], params["diqu"], params["isman"], params["sunni"]);
            var data = this._4gong();

            return {
                "params": params,
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
                "data": data,
            };
        },

        //上一局
        prevPaipan: function () {
            var date = new Date(this.solar.getYear(), this.solar.getMonth() - 1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            date.setHours(date.getHours() - 2);
            var aDate = date;
            return this.paipan(
                {
                    "datetime": aDate,
                    "realsun": false,
                    "diqu": this.diqu,
                    "isman": this.isMan,
                    "sunni": this.sunni,
                }
            );

        },

        //下一局
        nextPaipan: function () {
            var date = new Date(this.solar.getYear(), this.solar.getMonth() - 1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            date.setHours(date.getHours() + 2);
            var aDate = date;
            return this.paipan(
                {
                    "datetime": aDate,
                    "realsun": false,
                    "diqu": this.diqu,
                    "isman": this.isMan,
                    "sunni": this.sunni,
                }
            );

        },

    }

    exports('yizhangjing', yizhangjingObj);

})
