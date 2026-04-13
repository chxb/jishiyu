layui.define(function (exports) {

    //吉神象义
    var JI_SHEN = {
        "延年": [
            "有能力，有领导力，德高望重，有远见和格局，爱操心，凡事喜欢亲力亲为",
            "做事情具有运筹帷幄的能力，能挣钱，一吉多者，不是老板就是高管",
            "有责任心，喜欢照顾人，爱操心，有些大男子主义平时压力大，注意颈椎病",
            "女人在此磁场比较强势，不利婚姻感情",
        ],
        "天医": [
            "天医磁场代表婚姻，健康，财富，此磁场多者，心地善良，但是容易被骗",
            "人很好，乐于助人，人际关系好",
            "小孩在此磁场学习较好",
            "此磁场多者也要多注意血压和血液循环方面的疾病",
        ],
        "生气": [
            "爱面子，讲诚信，重名不重利，对朋友够义气",
            "爱学习，易清高，容易自以为是",
            "乐观主义，随缘心比较强，缺乏理财观念",
            "事业上容易有贵人相助",
            "此磁场多者，易发胖，易有糖尿病等富贵病",
        ]
    };
    //凶神象义
    var XIONG_SHEN = {
        "六煞": [
            "财运：生活开支大，不存钱，攒不住钱。 有钱就有事，一年到头白忙",
            "健康：容易手脚冰凉，肠胃疾病，泌尿系统疾病，肾病，妇科疾病",
            "事业：情商高，适合做服务性行业，抗压能力弱",
            "职业：适合服务性行业，与客户直接接触的行业，客服，售后，接待等",
            "性格：容易情绪化，感性，抑郁，容易为情所困，异性缘好",
            "正派女人对孩子有影响(流产，孩子走丢，家人走失)，容易有血光之灾(手术，意外，红伤等)"
        ],
        "五鬼": [
            "财运：容易出现投资失误，债务纠纷，负债，官司，借出去的钱收不回来",
            "健康：容易有心脑血管疾病。女性的妇科:盆腔炎，附件炎，等各种炎症问题，严重的导致癌变",
            "事业：付出多收获少，有志难伸，能看到钱但是拿不到钱",
            "职业：适合从事思考类型的工作，律师、会计、设计师、编辑等等",
            "性格：聪明，应变能力强。对家人容易发脾气属于无名火"
        ],
        "祸害": [
            "财运：适合以口来财，但是财运不佳",
            "健康：口腔，咽喉，淋巴，属于药罐子老年人慎用",
            "事业：百事不顺，犯小人，遭人暗算，被别人打小报告，抢客户等等",
            "职业：适合以口为业，讲师、销售、老师、律师等",
            "性格：爱面子，说话直来直去不考虑别人感受，较真，钻牛角尖，很难接受别人的意见，只认可自己的想法",
        ],
        "绝命": [
            "财运：大的投资失误，最后竹篮打水一场空",
            "健康：颈椎病，肝肾疾病，泌尿系统疾病，糖尿病，以及各种癌症",
            "事业：白手起家，大起大落，事业不稳定，容易丢官罢职，破财伤人",
            "性格：容易冲动，脾气不好，讲义气，重感情，容易在朋友身上吃亏",
            "婚姻不和睦（分居离婚 丧偶等情况）"
        ]
    };

    //结尾为0的象义
    var TAIL_ZERO = [
        "孩子不听话，或者孩子身体差，容易生病",
        "夫妻之间总吵架，容易离婚，易单身",
        "自己付出多，到头一场空，或自己身体容易出问题",
        "兄妹手足之间无助力，靠自己打拼",
        "双方父母辈身体差，易出现先走一方"
    ];

    //天医中间有0
    var TY_MID_ZERO = [
        "资金被套，夫妻容易短暂异地分居"
    ];
    //延年中间有0
    var YN_MID_ZERO = [
        "事业停止，卡顿，难以突破"
    ];

    //吉数
    var JI_DIGIT = {
        "19": "延年",
        "91": "延年",
        "78": "延年",
        "87": "延年",
        "34": "延年",
        "43": "延年",
        "26": "延年",
        "62": "延年",

        "13": "天医",
        "31": "天医",
        "68": "天医",
        "86": "天医",
        "49": "天医",
        "94": "天医",
        "27": "天医",
        "72": "天医",

        "14": "生气",
        "41": "生气",
        "67": "生气",
        "76": "生气",
        "39": "生气",
        "93": "生气",
        "28": "生气",
        "82": "生气",
    };

    //凶数
    var XIONG_DIGIT = {
        "16": "六煞",
        "61": "六煞",
        "29": "六煞",
        "92": "六煞",
        "47": "六煞",
        "74": "六煞",
        "38": "六煞",
        "83": "六煞",

        "18": "五鬼",
        "81": "五鬼",
        "79": "五鬼",
        "97": "五鬼",
        "63": "五鬼",
        "36": "五鬼",
        "42": "五鬼",
        "24": "五鬼",

        "17": "祸害",
        "71": "祸害",
        "89": "祸害",
        "98": "祸害",
        "46": "祸害",
        "64": "祸害",
        "23": "祸害",
        "32": "祸害",

        "12": "绝命",
        "21": "绝命",
        "37": "绝命",
        "73": "绝命",
        "48": "绝命",
        "84": "绝命",
        "96": "绝命",
        "69": "绝命",
    };

    var SHEN_TYPE = {
        "延年": "事业/健康",
        "天医": "财富/婚姻",
        "生气": "贵人/人脉",
        "六煞": "情商/桃花",
        "五鬼": "智慧/灵性",
        "祸害": "口才/疾病",
        "绝命": "投资/情绪",

    }




    var sjObj = {

        init: function(phoneNo, isman){
            this.phoneNo = phoneNo;
            this.isman = isman;
            return this;
        },

        parse: function(){
            if( this.isman ){
                this.phoneNo = this.phoneNo.replace(/5/gi, "2");
            }else{
                this.phoneNo = this.phoneNo.replace(/5/gi, "8");
            }
            
            this.results1 = [];
            this.results2 = [];
            var numbers = this.phoneNo.split("");
            var groups = [];
            var i = 1;
            while (i < numbers.length) {
                if( numbers[i]!=0 && numbers[i-1]!=numbers[i] ){
                    groups.push(""+numbers[i-1]+""+numbers[i]);
                }
                //伏位
                else if( i!=1 && numbers[i-1]===numbers[i] ){
                    groups.push(groups[groups.length-1]);
                }
                //中间为0
                else if( numbers[i]==="0" ){
                    var d = numbers[i-1];
                    var z = 0;
                    for( ;i<numbers.length; ){
                        if( numbers[i]==="0" ){
                            z++;
                            if( i==numbers.length-1 ){
                                break;
                            }
                        }else{
                            if( numbers[i]===d ){
                                //又伏吟0前面的数字了
                                for( var c=0;c<=z;c++ ){
                                    groups.push(groups[groups.length-1]);
                                }
                                break;
                            }else{
                                var d2 = numbers[i];
                                var dit = ""+d+""+d2;
                                if( JI_DIGIT[dit]==="天医" && this.results1.length==0 ){
                                    this.results1.push(TY_MID_ZERO[0]);
                                }else if( JI_DIGIT[dit]==="延年" && this.results2.length==0 ){
                                    this.results2.push(YN_MID_ZERO[0]);
                                }
                                for( var c=0;c<=z;c++ ){
                                    groups.push(""+d+""+numbers[i]);
                                }
                                break;
                            }
                        }
                        i++;
                    }
                }
                i++;
            }

            var delta = 10 - groups.length;
            if( delta==1 ){
                groups.push(this.phoneNo.substring(numbers.length-2,numbers.length));
            }else if( delta>1 ){
                groups.push(this.phoneNo.substring(numbers.length-(delta+1),numbers.length-(delta+1-2)));
                for( var d=1;d<delta;d++ ){
                    groups.push("00");
                }
            }

            this.groups = groups;
            return this;
        },

        analysis: function(phoneNo, isman){
            this.init(phoneNo, isman).parse();

            this.groups_shen = [];
            this.groups_shen_jx = [];
            this.groups_shen_cnt = {};
            
            this.results = [];
            this.results_jx = [];
            this.results_shen = [];
            this.results_shen_type = [];
            for( var i = this.groups.length-1; i>=0;i-- ){
                var itemJi = JI_SHEN[JI_DIGIT[this.groups[i]]];
                if( itemJi && this.results.indexOf(itemJi)==-1 ){
                    this.results.push(itemJi);
                    this.results_jx.push("ji");
                    this.results_shen.push(JI_DIGIT[this.groups[i]]);
                    this.results_shen_type.push(SHEN_TYPE[JI_DIGIT[this.groups[i]]])
                }
                var itemXi = XIONG_SHEN[XIONG_DIGIT[this.groups[i]]];
                if( itemXi && this.results.indexOf(itemXi)==-1 ){
                    this.results.push(itemXi);
                    this.results_jx.push("xi");
                    this.results_shen.push(XIONG_DIGIT[this.groups[i]]);
                    this.results_shen_type.push(SHEN_TYPE[XIONG_DIGIT[this.groups[i]]])
                }
            }
            for( var i = 0; i<this.groups.length;i++ ){
                var itemJi = JI_SHEN[JI_DIGIT[this.groups[i]]];
                if( itemJi ){
                    this.groups_shen.push(JI_DIGIT[this.groups[i]]);
                    this.groups_shen_jx.push("ji");
                }
                var itemXi = XIONG_SHEN[XIONG_DIGIT[this.groups[i]]];
                if( itemXi ){
                    this.groups_shen.push(XIONG_DIGIT[this.groups[i]]);
                    this.groups_shen_jx.push("xi");
                }
                if( !itemJi && !itemXi ){
                    this.groups_shen.push("");
                }
                if( !this.groups_shen_cnt[JI_DIGIT[this.groups[i]]]){
                    this.groups_shen_cnt[JI_DIGIT[this.groups[i]]] = 1;
                }else{
                    this.groups_shen_cnt[JI_DIGIT[this.groups[i]]] = this.groups_shen_cnt[JI_DIGIT[this.groups[i]]]+1;
                }
                if( !this.groups_shen_cnt[XIONG_DIGIT[this.groups[i]]]){
                    this.groups_shen_cnt[XIONG_DIGIT[this.groups[i]]] = 1;
                }else{
                    this.groups_shen_cnt[XIONG_DIGIT[this.groups[i]]] = this.groups_shen_cnt[XIONG_DIGIT[this.groups[i]]]+1;
                }
            }
            this.results0 = [];
            var numbers = this.phoneNo.split("");
            for( var i=1;i<6;i++ ){
                if( numbers[numbers.length-i]==="0" ){
                    this.results0.push(TAIL_ZERO[i-1]);
                }
            }
            return this;
        },

    }

    exports('sj', sjObj);

});