/*
    Copyright (C) 2026 xianbo.chen@gmail.com
    Licensed under AGPL-3.0
*/

(function(){

    var currentData = null;
    var lunar = null;
    var bazi = null;

    var $go = go.GraphObject.make;
    var zwDiagram =
        $go(go.Diagram, "zw-pan-container",
            {
                initialScale: 1.0,
                scale: 1.0,     //初始视图大小比例
                minScale: .9,     //最小视图的缩小比例
                maxScale: 5.0,     //最大视图的放大比例
                isReadOnly: true,
            }
        );
    zwDiagram.addDiagramListener("ViewportBoundsChanged", function (e) {
        if (zwDiagram.scale < 1) {
            zwDiagram.zoomToFit();
        }
    });

    /**
     * 绘制紫薇盘。
     * @param {String} date       阳历日期【YYYY-M-D】
     * @param {int} time     出生时辰序号【0~12】，对应从早子时（0）一直到晚子时（12）的序号
     * @param {boolean} isman         是否男性
     * @param {String} name 姓名
     */
    function zwpaipan(dateStr, timeIndex, isman, lunar) {

        var astrolabe = iztro.astro.bySolar(dateStr, timeIndex, isman ? "男" : "女", true, 'zh-CN');
        var zwData = JSON.parse(JSON.stringify(astrolabe));//json格式数据
        // console.log(zwData);
        var bazi = lunar.getEightChar();
        var yun = bazi.getYun(isman ? 1 : 0, 2);
        var dayuns = yun.getDaYun(9);
        var dayunsGanzhis = dayuns.map(dayun => {
            const ganzhi = dayun.getGanZhi(); // 获取天干地支
            const gan = ganzhi[0]; // 天干是第一个字符
            const zhi = ganzhi[1]; // 地支是第二个字符
            return { "gan": gan, "zhi": zhi }; // 返回分离后的天干和地支
        })

        var panWidth = $("#zw-pan-container").width();
        var panHeight = $("#zw-pan-container").height();
        var cellWidth = (panWidth - 18) / 4;
        var cellHeight = (panHeight - 18) / 4;

        var gridColor = "lightgray";
        var bgColor = "white";
        var defFont = "黑体";
        var defFontColor = "#585858";
        var titleFont = "黑体";
        var titleFontColor = "#531dab";

        var luColor = "#009029";
        var quanColor = "#9900a9";
        var keColor = "#0462d7";
        var jiColor = "#f20010";

        var sanfangBgColor = "#f1fff6";//三方宫位背景颜色
        var sizhengBgColor = "#f5eaff";//四正宫位背景颜色
        var focusBgColor = "#f4eefa";//点中的宫位背景颜色
        var majorColor = "#b90000"; //主星颜色
        var minorColor = "#7804a6"; //副星颜色
        var adjectiveColor = "#014fab";//流耀颜色
        var lightColor = "gray";//亮度颜色
        var sihuaColor = "red";
        var palaceColor = "#fa0000"; //官位名颜色
        var yunPalaceColor = "#10ab05"; //大限官位名颜色
        var liunianPalaceColor = "#0e6cf0"; //流年官位名颜色
        var bodyTagColor = "#ff6e6b"; //身宫标签颜色
        var boshi12Color = "#2fae8e";

        var bodyTag;

        var lastFocusPalace = null;

        var dxSihuaTagObjs = {};
        var lnSihuaTagObjs = {};

        var palacePanels = {};
        palacePanels["寅"] = buildGong(3, 0, zwData.palaces[0]);
        palacePanels["卯"] = buildGong(2, 0, zwData.palaces[1]);
        palacePanels["辰"] = buildGong(1, 0, zwData.palaces[2]);
        palacePanels["巳"] = buildGong(0, 0, zwData.palaces[3]);
        palacePanels["午"] = buildGong(0, 1, zwData.palaces[4]);
        palacePanels["未"] = buildGong(0, 2, zwData.palaces[5]);
        palacePanels["申"] = buildGong(0, 3, zwData.palaces[6]);
        palacePanels["酉"] = buildGong(1, 3, zwData.palaces[7]);
        palacePanels["戌"] = buildGong(2, 3, zwData.palaces[8]);
        palacePanels["亥"] = buildGong(3, 3, zwData.palaces[9]);
        palacePanels["子"] = buildGong(3, 2, zwData.palaces[10]);
        palacePanels["丑"] = buildGong(3, 1, zwData.palaces[11]);

        palacePanels["寅"].anchorPoint = { x: cellWidth, y: cellHeight * 3 };
        palacePanels["卯"].anchorPoint = { x: cellWidth, y: cellHeight * 2 + cellHeight / 2 };
        palacePanels["辰"].anchorPoint = { x: cellWidth, y: cellHeight + cellHeight / 2 };
        palacePanels["巳"].anchorPoint = { x: cellWidth, y: cellHeight };
        palacePanels["午"].anchorPoint = { x: cellWidth + cellWidth / 2, y: cellHeight };
        palacePanels["未"].anchorPoint = { x: cellWidth * 2 + cellWidth / 2, y: cellHeight };
        palacePanels["申"].anchorPoint = { x: cellWidth * 3, y: cellHeight };
        palacePanels["酉"].anchorPoint = { x: cellWidth * 3, y: cellHeight + cellHeight / 2 };
        palacePanels["戌"].anchorPoint = { x: cellWidth * 3, y: cellHeight * 2 + cellHeight / 2 };
        palacePanels["亥"].anchorPoint = { x: cellWidth * 3, y: cellHeight * 3 };
        palacePanels["子"].anchorPoint = { x: cellWidth * 2 + cellWidth / 2, y: cellHeight * 3 };
        palacePanels["丑"].anchorPoint = { x: cellWidth + cellWidth / 2, y: cellHeight * 3 };

        buildDaxianTable();
        buildLiunianTable(daxianStartAge);

        var zwNode = $go(go.Node, "Auto",
            {
                selectionAdorned: false,
                selectable: false,
            },
            $go(go.Shape, { fill: bgColor, stroke: gridColor, strokeWidth: 1.5 }),
            $go(go.Panel, go.Panel.Table,
                {
                    padding: 1.5,
                    defaultRowSeparatorStroke: gridColor,
                    defaultColumnSeparatorStroke: gridColor
                },

                $go(go.RowColumnDefinition, { column: 0, width: cellWidth }),
                $go(go.RowColumnDefinition, { column: 1, width: cellWidth }),
                $go(go.RowColumnDefinition, { column: 2, width: cellWidth }),
                $go(go.RowColumnDefinition, { column: 3, width: cellWidth }),
                $go(go.RowColumnDefinition, { row: 0, height: cellHeight }),
                $go(go.RowColumnDefinition, { row: 1, height: cellHeight }),
                $go(go.RowColumnDefinition, { row: 2, height: cellHeight }),
                $go(go.RowColumnDefinition, { row: 3, height: cellHeight }),

                palacePanels["巳"],
                palacePanels["午"],
                palacePanels["未"],
                palacePanels["申"],
                palacePanels["辰"],
                $go(go.Panel, "Auto",
                    {
                        row: 1, column: 1, columnSpan: 2, rowSpan: 2, margin: 0, background: bgColor
                    },
                    $go(go.Shape, { fill: bgColor, stroke: gridColor, strokeWidth: 0 }),
                    $go(go.Panel, "Auto",
                        { width: cellWidth * 2, height: cellHeight * 2 },

                        $go(go.Panel, go.Panel.Table,
                            $go(go.RowColumnDefinition, { row: 0, height: 30 }),
                            $go(go.RowColumnDefinition, { row: 1, height: 25 }),
                            $go(go.RowColumnDefinition, { row: 2, height: 18 }),
                            $go(go.RowColumnDefinition, { row: 3, height: 18 }),
                            $go(go.RowColumnDefinition, { row: 4, height: 18 }),
                            $go(go.RowColumnDefinition, { row: 5, height: 18 }),
                            $go(go.RowColumnDefinition, { row: 6, height: 18 }),
                            $go(go.RowColumnDefinition, { row: 7, height: 133 }),

                            $go(go.TextBlock, "吉时雨•紫微",
                                { row: 0, column: 0, margin: 0, stroke: titleFontColor, margin: 10, alignment: go.Spot.Center, font: "bold 16px " + titleFont }),

                            $go(go.TextBlock, (tianganYinyang(zwData.rawDates.chineseDate.yearly[0]) ? "阳" : "阴") + zwData.gender + " " + zwData.fiveElementsClass,
                                { row: 1, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Center, font: "normal 14px " + defFont }),

                            $go(go.TextBlock, "公历：",
                                { row: 2, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                            $go(go.TextBlock, zwData.solarDate + " " + zwData.timeRange,
                                { row: 2, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Right, font: "11px " + defFont }),

                            $go(go.TextBlock, "农历：",
                                { row: 3, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                            $go(go.TextBlock, zwData.lunarDate + " " + zwData.time,
                                { row: 3, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Right, font: "11px " + defFont }),

                            $go(go.TextBlock, "属相：" + zwData.zodiac,
                                { row: 4, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                            $go(go.TextBlock, "星座：" + zwData.sign,
                                { row: 4, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Right, font: "11px " + defFont }),

                            $go(go.TextBlock, "身宫：" + zwData.earthlyBranchOfBodyPalace,
                                { row: 5, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                            $go(go.TextBlock, "命宫：" + zwData.earthlyBranchOfSoulPalace,
                                { row: 5, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Right, font: "11px " + defFont }),

                            $go(go.TextBlock, "命主：" + zwData.soul,
                                { row: 6, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                            $go(go.TextBlock, "身主：" + zwData.body,
                                { row: 6, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Right, font: "11px " + defFont }),

                            $go(go.Panel, "Auto",
                                { row: 7, column: 0, margin: 0, width: cellWidth * 2, height: 133 },
                                $go(go.Panel, "Table",
                                    $go(go.RowColumnDefinition, { row: 0, height: 18 }),
                                    $go(go.RowColumnDefinition, { row: 1, height: 18 }),
                                    $go(go.RowColumnDefinition, { row: 2, height: 14 }),
                                    $go(go.RowColumnDefinition, { row: 3, height: 40 }),
                                    $go(go.RowColumnDefinition, { row: 4, height: 18 }),
                                    $go(go.RowColumnDefinition, { row: 5, height: 5 }),
                                    $go(go.RowColumnDefinition, { column: 0, width: cellWidth / 2 }),
                                    $go(go.RowColumnDefinition, { column: 1, width: cellWidth * 2 * 0.75 / 4 }),
                                    $go(go.RowColumnDefinition, { column: 2, width: cellWidth * 2 * 0.75 / 4 }),
                                    $go(go.RowColumnDefinition, { column: 3, width: cellWidth * 2 * 0.75 / 4 }),
                                    $go(go.RowColumnDefinition, { column: 4, width: cellWidth * 2 * 0.75 / 4 }),

                                    $go(go.TextBlock, "四柱",
                                        { row: 0, column: 0, rowSpan: 2, margin: 0, stroke: "gray", margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.yearly[0],
                                        { row: 0, column: 1, margin: 0, stroke: getWuxinColor(tianganWuxing(zwData.rawDates.chineseDate.yearly[0])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.yearly[1],
                                        { row: 1, column: 1, margin: 0, stroke: getWuxinColor(dizhiWuxing(zwData.rawDates.chineseDate.yearly[1])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.monthly[0],
                                        { row: 0, column: 2, margin: 0, stroke: getWuxinColor(tianganWuxing(zwData.rawDates.chineseDate.monthly[0])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.monthly[1],
                                        { row: 1, column: 2, margin: 0, stroke: getWuxinColor(dizhiWuxing(zwData.rawDates.chineseDate.monthly[1])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.daily[0],
                                        { row: 0, column: 3, margin: 0, stroke: getWuxinColor(tianganWuxing(zwData.rawDates.chineseDate.daily[0])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.daily[1],
                                        { row: 1, column: 3, margin: 0, stroke: getWuxinColor(dizhiWuxing(zwData.rawDates.chineseDate.daily[1])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.hourly[0],
                                        { row: 0, column: 4, margin: 0, stroke: getWuxinColor(tianganWuxing(zwData.rawDates.chineseDate.hourly[0])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, zwData.rawDates.chineseDate.hourly[1],
                                        { row: 1, column: 4, margin: 0, stroke: getWuxinColor(dizhiWuxing(zwData.rawDates.chineseDate.hourly[1])), margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),

                                    //起运
                                    $go(go.TextBlock, '出生后 ' + yun.getStartYear() + '年 ' + yun.getStartMonth() + '月 ' + yun.getStartDay() + '天 八字起运',
                                        { row: 2, column: 0, columnSpan: 5, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "12px " + defFont }),

                                    $go(go.Panel, "Auto",
                                        { row: 3, column: 0, columnSpan: 5, margin: 0, width: cellWidth * 2, height: 40 },
                                        $go(go.Panel, "Table",
                                            $go(go.RowColumnDefinition, { row: 0, height: 14 }),
                                            $go(go.RowColumnDefinition, { row: 1, height: 14 }),
                                            $go(go.RowColumnDefinition, { row: 2, height: 12 }),
                                            $go(go.RowColumnDefinition, { column: 0, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 1, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 2, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 3, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 4, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 5, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 6, width: cellWidth * 2 / 8 }),
                                            $go(go.RowColumnDefinition, { column: 7, width: cellWidth * 2 / 8 }),

                                            //大运
                                            $go(go.TextBlock, dayunsGanzhis[1]["gan"],
                                                { row: 0, column: 0, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[1]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[1]["zhi"],
                                                { row: 1, column: 0, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[1]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[2]["gan"],
                                                { row: 0, column: 1, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[2]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[2]["zhi"],
                                                { row: 1, column: 1, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[2]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[3]["gan"],
                                                { row: 0, column: 2, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[3]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[3]["zhi"],
                                                { row: 1, column: 2, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[3]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[4]["gan"],
                                                { row: 0, column: 3, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[4]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[4]["zhi"],
                                                { row: 1, column: 3, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[4]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[5]["gan"],
                                                { row: 0, column: 4, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[5]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[5]["zhi"],
                                                { row: 1, column: 4, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[5]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[6]["gan"],
                                                { row: 0, column: 5, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[6]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[6]["zhi"],
                                                { row: 1, column: 5, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[6]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[7]["gan"],
                                                { row: 0, column: 6, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[7]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[7]["zhi"],
                                                { row: 1, column: 6, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[7]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),

                                            $go(go.TextBlock, dayunsGanzhis[8]["gan"],
                                                { row: 0, column: 7, margin: 0, stroke: getWuxinColor(tianganWuxing(dayunsGanzhis[8]["gan"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            $go(go.TextBlock, dayunsGanzhis[8]["zhi"],
                                                { row: 1, column: 7, margin: 0, stroke: getWuxinColor(dizhiWuxing(dayunsGanzhis[8]["zhi"])), margin: 10, alignment: go.Spot.Center, font: "13px " + defFont }),
                                            //大运起始岁数
                                            $go(go.TextBlock, dayuns[1].getStartAge() + "岁",
                                                { row: 2, column: 0, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[2].getStartAge() + "岁",
                                                { row: 2, column: 1, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[3].getStartAge() + "岁",
                                                { row: 2, column: 2, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[4].getStartAge() + "岁",
                                                { row: 2, column: 3, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[5].getStartAge() + "岁",
                                                { row: 2, column: 4, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[6].getStartAge() + "岁",
                                                { row: 2, column: 5, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[7].getStartAge() + "岁",
                                                { row: 2, column: 6, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),
                                            $go(go.TextBlock, dayuns[8].getStartAge() + "岁",
                                                { row: 2, column: 7, margin: 0, stroke: defFontColor, margin: 0, alignment: go.Spot.Center, font: "9px " + defFont }),


                                        )),

                                    // for (var i = 1; i < dayun.length; i++) {
                                    //     var dy = dayun[i];
                                    //     var dygz = dy.getGanZhi().split("");
                                    //     var dyGanShen = shishenJc(queryShishen(dygz[0], bazi.getDayGan()));
                                    //     var dyZhiShen = shishenJc(queryShishen(dizhiCanggan(dygz[1])[0], bazi.getDayGan()));
                                    //     $("#dy" + i).html(
                                    //         "<div class='dayunYear'><span>"+
                                    //         dy.getStartYear() + "<br/>" + dy.getStartAge() + "岁"+"</span></div>"+
                                    //         dayunStyle(tianganWuxing(dygz[0])) + dygz[0] + "</span><span class='xShishen'>" + dyGanShen + "</span><br/>" +
                                    //         dayunStyle(dizhiWuxing(dygz[1])) + dygz[1] + "</span><span class='xShishen'>"+dyZhiShen + "</span>" 
                                    //     );
                                    //     $("#dy" + i).attr("ganzhi", dy.getGanZhi());
                                    //     $("#dy" + i).attr("year", dy.getStartYear());
                                    //     $("#dy" + i).attr("age", dy.getStartAge());
                                    // }


                                    $go(go.TextBlock, "自化",
                                        { row: 4, column: 0, margin: 0, stroke: defFontColor, margin: 10, alignment: go.Spot.Left, font: "11px " + defFont }),
                                    $go(go.TextBlock, "→䘵",
                                        { row: 4, column: 1, margin: 0, stroke: luColor, margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, "→权",
                                        { row: 4, column: 2, margin: 0, stroke: quanColor, margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, "→科",
                                        { row: 4, column: 3, margin: 0, stroke: keColor, margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                    $go(go.TextBlock, "→忌",
                                        { row: 4, column: 4, margin: 0, stroke: jiColor, margin: 10, alignment: go.Spot.Center, font: "14px " + defFont }),
                                )
                            )
                        )
                    )
                ),
                palacePanels["酉"],
                palacePanels["卯"],
                palacePanels["戌"],
                palacePanels["寅"],
                palacePanels["丑"],
                palacePanels["子"],
                palacePanels["亥"],

            )
        );
        zwDiagram.add(zwNode);

        /**
         * 构建一个代表宫位的面板，包含星宿信息和交互事件
         * @param {number} row - 面板所在的行
         * @param {number} col - 面板所在的列
         * @param {Object} gongData - 与宫位相关的数据对象
         * @returns {go.Panel} - 创建的面板实例
         */
        function buildGong(row, col, gongData) {

            var addStars = function (parentNode, stars, stroke) {
                for (var i = 0; i < stars.length; i++) {
                    var textblock = new go.TextBlock(stars[i].name.split("").join("\n"),
                        { name: stars[i].name, stroke: stroke, alignment: go.Spot.Top, font: "10px " + defFont, background: "transparent" });
                    textblock.defBgColor = textblock.background;
                    textblock.defStroke = textblock.stroke;
                    parentNode.add(textblock);
                }
            };
            var addStarLights = function (parentNode, stars, stroke) {
                for (var i = 0; i < stars.length; i++) {
                    parentNode.add(new go.TextBlock(stars[i].brightness || "　",
                        { stroke: stroke, alignment: go.Spot.Top, font: "9px " + defFont }));
                }
            };
            var addSihua = function (parentNode, stars, stroke) {
                for (var i = 0; i < stars.length; i++) {
                    parentNode.add(new go.TextBlock(stars[i].mutagen || "　",
                        { stroke: "white", background: stroke, alignment: go.Spot.Top, font: "10px " + defFont }));
                }
            };
            var addPlaceholder = function (objs, parentNode, stars) {
                for (var i = 0; i < stars.length; i++) {
                    var txtObj = new go.TextBlock("　",//
                        { stroke: "white", background: "gray", alignment: go.Spot.Top, font: "10px " + defFont });
                    var obj = parentNode.add(txtObj);
                    objs[stars[i].name] = txtObj;
                }
            };

            var gongNode = new go.Panel("Auto",
                {
                    row: row, column: col, padding: 0, width: cellWidth, height: cellHeight, background: bgColor,
                    name: gongData.earthlyBranch,
                    click: function (e, obj) {
                        resetSihuaGong();
                        resetSanfangsizhengGong();
                        clearLinks();
                        clearActiveCell("dayun");
                        clearActiveCell("liunian");
                        showSihuaTagObjs(false);
                        showDaxianLiuyao(false);
                        showAgeNode(true);

                        var curPalacePanel = palacePanels[obj.name];
                        if (curPalacePanel == lastFocusPalace) {
                            lastFocusPalace = null;
                            return;
                        }
                        var idx = iztro.util.earthlyBranchIndexToPalaceIndex(obj.name);
                        var mutagedPlaces = astrolabe.palace(idx).mutagedPlaces();
                        var luPalace = palacePanels[mutagedPlaces[0].earthlyBranch];
                        var quanPalace = palacePanels[mutagedPlaces[1].earthlyBranch];
                        var kePalace = palacePanels[mutagedPlaces[2].earthlyBranch];
                        var jiPalace = palacePanels[mutagedPlaces[3].earthlyBranch];
                        var mutagedStars = iztro.util.getMutagensByHeavenlyStem(curPalacePanel.gan);
                        var luStarObj = luPalace.findObject(mutagedStars[0]);
                        var quanStarObj = quanPalace.findObject(mutagedStars[1]);
                        var keStarObj = kePalace.findObject(mutagedStars[2]);
                        var jiStarObj = jiPalace.findObject(mutagedStars[3]);
                        sihuaObjs.push(luStarObj);
                        sihuaObjs.push(quanStarObj);
                        sihuaObjs.push(keStarObj);
                        sihuaObjs.push(jiStarObj);
                        luStarObj.setProperties({ "background": luColor, "stroke": "white" });
                        quanStarObj.setProperties({ "background": quanColor, "stroke": "white" });
                        keStarObj.setProperties({ "background": keColor, "stroke": "white" });
                        jiStarObj.setProperties({ "background": jiColor, "stroke": "white" });

                        beep();

                        var sanfang = findSanfangPalace(obj.name);
                        var sanfangPalaceObjs = [];
                        sanfangPalaceObjs[0] = palacePanels[sanfang[0]];
                        sanfangPalaceObjs[1] = palacePanels[sanfang[1]];

                        var sizhengPalaceObj = palacePanels[findSizhengPalace(obj.name)];

                        curPalacePanel.setProperties({ background: focusBgColor });
                        lastFocusPalace = curPalacePanel;
                        sanfangsizhengObjs.push(curPalacePanel);
                        sanfangsizhengObjs.push(sizhengPalaceObj);
                        sanfangsizhengObjs.push(sanfangPalaceObjs[0]);
                        sanfangsizhengObjs.push(sanfangPalaceObjs[1]);

                        var lines = new go.Shape(
                            {
                                geometryString: "F M" + sizhengPalaceObj.anchorPoint.x + " " + sizhengPalaceObj.anchorPoint.y +
                                    " L" + curPalacePanel.anchorPoint.x + " " + curPalacePanel.anchorPoint.y + " "
                                    + sanfangPalaceObjs[0].anchorPoint.x + " " + sanfangPalaceObjs[0].anchorPoint.y + " "
                                    + sanfangPalaceObjs[1].anchorPoint.x + " " + sanfangPalaceObjs[1].anchorPoint.y + " "
                                    + curPalacePanel.anchorPoint.x + " " + curPalacePanel.anchorPoint.y + "Z",
                                stroke: "gray", fill: "transparent", strokeWidth: 1, strokeDashArray: [3, 3]
                            })
                        zwNode.add(lines);
                        links.push(lines);


                    }
                });
            gongNode.palace = gongData;//绑定宫位数据对象。
            gongNode.gan = gongData.heavenlyStem;
            gongNode.zhi = gongData.earthlyBranch;

            var gongGrid = new go.Panel(go.Panel.Table);
            gongGrid.addRowDefinition({ row: 0, height: 13 });//星耀
            gongGrid.addRowDefinition({ row: 1, height: 11 });//亮度
            gongGrid.addRowDefinition({ row: 2, height: 10 });//四化
            gongGrid.addRowDefinition({ row: 3, height: cellHeight - 22 - 11 - 10 - 70 });//ages
            gongGrid.addRowDefinition({ row: 4, height: 70 });//
            gongNode.add(gongGrid);

            if (gongData.isBodyPalace) {
                bodyTag = new go.Panel(go.Panel.Auto, { alignment: go.Spot.Right });
                bodyTag.add(new go.Shape("RoundedRectangle", { stroke: "#ff6e6b", fill: "transparent", margin: 0, padding: 0 }));
                bodyTag.add(new go.TextBlock("身\n宫", { stroke: bodyTagColor, margin: 0, font: "8px " + defFont }));
                gongNode.add(bodyTag);
            }


            //星耀
            var starsNode = new go.Panel(go.Panel.Horizontal, { row: 0, column: 0, width: cellWidth - 10 });
            gongGrid.add(starsNode);
            addStars(starsNode, gongData.majorStars, majorColor);
            addStars(starsNode, gongData.minorStars, minorColor);
            addStars(starsNode, gongData.adjectiveStars, adjectiveColor);
            //亮度
            var lightsNode = new go.Panel(go.Panel.Horizontal, { row: 1, column: 0, width: cellWidth - 10 });
            gongGrid.add(lightsNode);
            addStarLights(lightsNode, gongData.majorStars, lightColor);
            addStarLights(lightsNode, gongData.minorStars, lightColor);
            addStarLights(lightsNode, gongData.adjectiveStars, lightColor);
            //化忌
            var sihuaNode = new go.Panel(go.Panel.Horizontal, { row: 2, column: 0, width: cellWidth - 10 });
            gongGrid.add(sihuaNode);
            addSihua(sihuaNode, gongData.majorStars, sihuaColor);
            addSihua(sihuaNode, gongData.minorStars, sihuaColor);
            addSihua(sihuaNode, gongData.adjectiveStars, sihuaColor);
            //Ages
            var ageNode = new go.Panel(go.Panel.Vertical, { name: "ageNode", row: 3, column: 0, width: cellWidth - 10 });
            gongGrid.add(ageNode);
            ageNode.add(new go.TextBlock(gongData.ages.slice(0, 7).join(","),
                { stroke: defFontColor, alignment: go.Spot.Center, font: "6px " + defFont }));
            ageNode.add(new go.TextBlock(gongData.decadal.range.join(" - "),
                { stroke: defFontColor, alignment: go.Spot.Center, font: "10px " + defFont }));
            //运限四化
            var sihuaNodeGrid = new go.Panel(go.Panel.Table, { name: "sihuaNode", row: 3, column: 0, alignment: new go.Spot(0, 0.5, 5, -2), visible: false });
            gongGrid.add(sihuaNodeGrid);
            var sihuaNode1 = new go.Panel(go.Panel.Horizontal, { row: 0, column: 0 });
            sihuaNodeGrid.add(sihuaNode1);
            addPlaceholder(dxSihuaTagObjs, sihuaNode1, gongData.majorStars);
            addPlaceholder(dxSihuaTagObjs, sihuaNode1, gongData.minorStars);
            addPlaceholder(dxSihuaTagObjs, sihuaNode1, gongData.adjectiveStars);
            var sihuaNode2 = new go.Panel(go.Panel.Horizontal, { row: 1, column: 0 });
            sihuaNodeGrid.add(sihuaNode2);
            addPlaceholder(lnSihuaTagObjs, sihuaNode2, gongData.majorStars);
            addPlaceholder(lnSihuaTagObjs, sihuaNode2, gongData.minorStars);
            addPlaceholder(lnSihuaTagObjs, sihuaNode2, gongData.adjectiveStars);
            //流耀
            var liuyaoNode = new go.Panel(go.Panel.Auto, { name: "liuyaoNode", alignment: new go.Spot(1, 0.5, -5, 0), visible: false });
            gongNode.add(liuyaoNode);
            var liuyaoNode2 = new go.Panel(go.Panel.Horizontal, { name: "liuyaoNode2" });
            liuyaoNode.add(liuyaoNode2);

            //其它
            var subGrid = new go.Panel(go.Panel.Table, { row: 4, column: 0, width: cellWidth - 10 });
            subGrid.addRowDefinition({ row: 0, height: 70 });
            subGrid.addColumnDefinition({ column: 0, width: 20 });
            subGrid.addColumnDefinition({ column: 1, width: cellWidth - 20 - 12 });
            subGrid.addColumnDefinition({ column: 2, width: 12 });
            gongGrid.add(subGrid);

            //底部左侧
            var subLeftNode = new go.Panel(go.Panel.Vertical, { row: 0, column: 0, width: 30, alignment: go.Spot.Bottom });
            subGrid.add(subLeftNode);
            subLeftNode.add(new go.TextBlock(gongData.boshi12,
                { stroke: boshi12Color, alignment: go.Spot.Left, font: "10px " + defFont }));
            subLeftNode.add(new go.TextBlock(gongData.jiangqian12,
                { stroke: defFontColor, alignment: go.Spot.Left, font: "10px " + defFont }));
            subLeftNode.add(new go.TextBlock(gongData.suiqian12,
                { stroke: defFontColor, alignment: go.Spot.Left, font: "10px " + defFont }));
            //底部中间
            var subMidNode = new go.Panel(go.Panel.Vertical, { row: 0, column: 1, width: cellWidth - 30 - 20 - 10, alignment: go.Spot.Bottom });
            subGrid.add(subMidNode);
            //流年
            subMidNode.add(new go.TextBlock("流年",
                { name: "liunianGong", stroke: liunianPalaceColor, alignment: go.Spot.Right, font: "12px " + defFont, visible: false }));
            //大运
            subMidNode.add(new go.TextBlock("大运",
                { name: "yunGong", stroke: yunPalaceColor, alignment: go.Spot.Right, font: "12px " + defFont, visible: false }));
            //宫名
            subMidNode.add(new go.TextBlock(gongData.name,
                { stroke: palaceColor, alignment: go.Spot.Right, font: "bold 12px " + defFont }));

            //底部右侧
            var subRightNode = new go.Panel(go.Panel.Vertical, { row: 0, column: 2, width: 20, alignment: go.Spot.Bottom });
            subGrid.add(subRightNode);
            var changsheng = "　" + gongData.changsheng12;
            //12长生
            subRightNode.add(new go.TextBlock(changsheng.substring(changsheng.length - 2).split("").join("\n"),
                { stroke: "gray", alignment: go.Spot.Right, font: "9px " + defFont }));
            //干支
            subRightNode.add(new go.TextBlock(gongData.heavenlyStem + "\n" + gongData.earthlyBranch,
                { name: gongData.heavenlyStem + gongData.earthlyBranch, stroke: defFontColor, alignment: go.Spot.Right, font: "bold 12px " + defFont }));


            return gongNode;
        }

        //构建大限表格
        var daxianStartAge = 0;
        function buildDaxianTable() {
            var beginIdx = -1;
            for (var i = 0; i <= zwData.palaces.length; i++) {
                if (zwData.palaces[i].name == "命宫") {
                    beginIdx = i;
                    break;
                };
            }
            daxianStartAge = zwData.palaces[beginIdx].decadal.range[0];

            var palaceList = null;
            if (isShun()) {
                palaceList = CircularList(zwData.palaces, beginIdx);
            } else {
                palaceList = ReversedCircularList(zwData.palaces, beginIdx);
            }
            for (var i = 0; i < 12; i++) {
                var palace = palaceList.next();
                $("#zw_dy" + i).html(
                    "<div class='dayunYear'>" + palace.decadal.range.join("-") + "</div>" +
                    dayunStyle(tianganWuxing(palace.decadal.heavenlyStem)) + palace.decadal.heavenlyStem + "</span>" +
                    dayunStyle(dizhiWuxing(palace.decadal.earthlyBranch)) + palace.decadal.earthlyBranch + "</span>"
                );
                $("#zw_dy" + (i)).attr("ganzhi", palace.decadal.heavenlyStem + palace.decadal.earthlyBranch);
                $("#zw_dy" + (i)).attr("startAge", palace.decadal.range[0]);
            }
        }
        $(".dayun-grid-cell").off("click");
        $(".dayun-grid-cell").on("click", function (e) {
            var tdDom = null;
            if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className.indexOf("dayun-grid-cell") > -1) {
                tdDom = e.target;
            } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className.indexOf("dayun-grid-cell") > -1) {
                tdDom = e.target.parentNode;
            } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className.indexOf("dayun-grid-cell") > -1) {
                tdDom = e.target.parentNode.parentNode;
            } else {
                return;
            }
            if (!$(tdDom).text()) return;

            var col = $(tdDom).attr("col");
            var row = $(tdDom).attr("row");
            var dc1 = $("#zwDayunTable>div>div[row=0][col=" + col + "]");
            if (dc1 && lastActiveList["dayun"] && dc1.html() == lastActiveList["dayun"].html()) {
                clearActiveCell("dayun");
                clearActiveCell("liunian");
                hideYungongs();
                hideLiuniangongs();
                resetSihuaGong();
                resetSanfangsizhengGong();
                clearLinks();
                showSihuaTagObjs(false);
                showDaxianLiuyao(false);
                showAgeNode(true);
                buildLiunianTable(parseInt($("#zw_dy0").attr("startAge"), 10));
                return;
            }

            clearActiveCell("dayun");
            clearActiveCell("liunian");
            resetSihuaGong();
            resetSanfangsizhengGong();
            clearLinks();
            showAgeNode(false);

            beep();

            dc1.addClass('cellActive');
            lastActiveList["dayun"] = dc1;
            var startAge = parseInt($(this).attr("startAge"), 10);
            buildLiunianTable(startAge);
            hideLiuniangongs();

            var startYear = zwData.rawDates.lunarDate.lunarYear + startAge - 1;
            var daxian = astrolabe.horoscope(startYear + "-05-05", 5).decadal;

            var yunPalaceNames = daxian.palaceNames;

            palacePanels["寅"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[0].substring(0, 1), visible: true });
            palacePanels["卯"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[1].substring(0, 1), visible: true });
            palacePanels["辰"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[2].substring(0, 1), visible: true });
            palacePanels["巳"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[3].substring(0, 1), visible: true });
            palacePanels["午"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[4].substring(0, 1), visible: true });
            palacePanels["未"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[5].substring(0, 1), visible: true });
            palacePanels["申"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[6].substring(0, 1), visible: true });
            palacePanels["酉"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[7].substring(0, 1), visible: true });
            palacePanels["戌"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[8].substring(0, 1), visible: true });
            palacePanels["亥"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[9].substring(0, 1), visible: true });
            palacePanels["子"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[10].substring(0, 1), visible: true });
            palacePanels["丑"].findObject("yunGong").setProperties({ text: "大" + yunPalaceNames[11].substring(0, 1), visible: true });

            var sanfang = findSanfangPalace(daxian.earthlyBranch);
            var sanfangPalaceObjs = [];
            sanfangPalaceObjs[0] = palacePanels[sanfang[0]];
            sanfangPalaceObjs[1] = palacePanels[sanfang[1]];

            var sizhengPalaceObj = palacePanels[findSizhengPalace(daxian.earthlyBranch)];

            var curPalacePanel = palacePanels[daxian.earthlyBranch];
            curPalacePanel.setProperties({ background: focusBgColor });
            lastFocusPalace = curPalacePanel;
            sanfangsizhengObjs.push(curPalacePanel);
            sanfangsizhengObjs.push(sizhengPalaceObj);
            sanfangsizhengObjs.push(sanfangPalaceObjs[0]);
            sanfangsizhengObjs.push(sanfangPalaceObjs[1]);

            var lines = new go.Shape(
                {
                    geometryString: "F M" + sizhengPalaceObj.anchorPoint.x + " " + sizhengPalaceObj.anchorPoint.y +
                        " L" + curPalacePanel.anchorPoint.x + " " + curPalacePanel.anchorPoint.y + " "
                        + sanfangPalaceObjs[0].anchorPoint.x + " " + sanfangPalaceObjs[0].anchorPoint.y + " "
                        + sanfangPalaceObjs[1].anchorPoint.x + " " + sanfangPalaceObjs[1].anchorPoint.y + " "
                        + curPalacePanel.anchorPoint.x + " " + curPalacePanel.anchorPoint.y + "Z",
                    stroke: "gray", fill: "transparent", strokeWidth: 1, strokeDashArray: [3, 3]
                })
            zwNode.add(lines);
            links.push(lines);

            showSihuaTagObjs(true);
            fillSihuaTagObj(dxSihuaTagObjs, daxian.mutagen, yunPalaceColor);
            fillSihuaTagObj(lnSihuaTagObjs, ["", "", "", ""], liunianPalaceColor);

            showDaxianLiuyao(true);
            fillDaxianLiuyao(daxian.stars);

        });

        $(".liunian2-grid-cell").off("click");
        $(".liunian2-grid-cell").on("click", function (e) {

            if (!lastActiveList["dayun"]) {
                layer.msg("请先选择大限!", { time: 1000 });
                return;
            }

            var tdDom = null;
            if (e && e.target.tagName.toUpperCase() == "DIV" && e.target.className.indexOf("liunian2-grid-cell") > -1) {
                tdDom = e.target;
            } else if (e.target.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.className.indexOf("liunian2-grid-cell") > -1) {
                tdDom = e.target.parentNode;
            } else if (e.target.parentNode.parentNode.tagName.toUpperCase() == "DIV" && e.target.parentNode.parentNode.className.indexOf("liunian2-grid-cell") > -1) {
                tdDom = e.target.parentNode.parentNode;
            } else {
                return;
            }
            if (!$(tdDom).text()) return;

            var col = $(tdDom).attr("col");
            var row = $(tdDom).attr("row");
            var dc1 = $("#zwLiunianTable>div>div[row=0][col=" + col + "]");

            if (dc1 && lastActiveList["liunian"] && dc1.html() == lastActiveList["liunian"].html()) {
                clearActiveCell("liunian");
                resetSihuaGong();
                resetSanfangsizhengGong();
                clearLinks();
                hideLiuniangongs();
                clearLiunianLiuYao();
                fillSihuaTagObj(lnSihuaTagObjs, ["", "", "", ""]);
                return;
            }

            clearActiveCell("liunian");
            resetSihuaGong();
            resetSanfangsizhengGong();
            clearLinks();

            beep();

            dc1.addClass('cellActive');
            lastActiveList["liunian"] = dc1;

            var startYear = $("#zw_ln" + (col)).attr("startYear");
            var liunian = astrolabe.horoscope(startYear + "-05-05", 5).yearly;
            var liunianPalaceNames = liunian.palaceNames;

            palacePanels["寅"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[0].substring(0, 1), visible: true });
            palacePanels["卯"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[1].substring(0, 1), visible: true });
            palacePanels["辰"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[2].substring(0, 1), visible: true });
            palacePanels["巳"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[3].substring(0, 1), visible: true });
            palacePanels["午"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[4].substring(0, 1), visible: true });
            palacePanels["未"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[5].substring(0, 1), visible: true });
            palacePanels["申"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[6].substring(0, 1), visible: true });
            palacePanels["酉"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[7].substring(0, 1), visible: true });
            palacePanels["戌"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[8].substring(0, 1), visible: true });
            palacePanels["亥"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[9].substring(0, 1), visible: true });
            palacePanels["子"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[10].substring(0, 1), visible: true });
            palacePanels["丑"].findObject("liunianGong").setProperties({ text: "年" + liunianPalaceNames[11].substring(0, 1), visible: true });

            var sanfang = findSanfangPalace(liunian.earthlyBranch);
            var sanfangPalaceObjs = [];
            sanfangPalaceObjs[0] = palacePanels[sanfang[0]];
            sanfangPalaceObjs[1] = palacePanels[sanfang[1]];

            var sizhengPalaceObj = palacePanels[findSizhengPalace(liunian.earthlyBranch)];

            var curPalacePanel = palacePanels[liunian.earthlyBranch];
            curPalacePanel.setProperties({ background: focusBgColor });
            lastFocusPalace = curPalacePanel;
            sanfangsizhengObjs.push(curPalacePanel);
            sanfangsizhengObjs.push(sizhengPalaceObj);
            sanfangsizhengObjs.push(sanfangPalaceObjs[0]);
            sanfangsizhengObjs.push(sanfangPalaceObjs[1]);

            var lines = new go.Shape(
                {
                    geometryString: "F M" + sizhengPalaceObj.anchorPoint.x + " " + sizhengPalaceObj.anchorPoint.y +
                        " L" + curPalacePanel.anchorPoint.x + " " + curPalacePanel.anchorPoint.y + " "
                        + sanfangPalaceObjs[0].anchorPoint.x + " " + sanfangPalaceObjs[0].anchorPoint.y + " "
                        + sanfangPalaceObjs[1].anchorPoint.x + " " + sanfangPalaceObjs[1].anchorPoint.y + " "
                        + curPalacePanel.anchorPoint.x + " " + curPalacePanel.anchorPoint.y + "Z",
                    stroke: "gray", fill: "transparent", strokeWidth: 1, strokeDashArray: [3, 3]
                })
            zwNode.add(lines);
            links.push(lines);

            showSihuaTagObjs(true);
            fillSihuaTagObj(lnSihuaTagObjs, liunian.mutagen, liunianPalaceColor);

            fillLiunianLiuyao(liunian.stars);


        });

        //构建流年表格
        function buildLiunianTable(startAge) {
            var startYear = zwData.rawDates.lunarDate.lunarYear + startAge - 1;
            for (var i = 0; i < 10; i++) {
                var ganzhi = getYearGanZhi(startYear + i);
                var gz = ganzhi.split("");
                $("#zw_ln" + i).html(
                    "<div class='liunianYear'>" + (startYear + i) + "年</div>" +
                    "<div class='liunianYear'>" + (startAge + i) + "岁</div>" +
                    liunianStyle(tianganWuxing(gz[0])) + gz[0] + "</span>" +
                    liunianStyle(dizhiWuxing(gz[1])) + gz[1] + "</span>"
                );
                $("#zw_ln" + (i)).attr("ganzhi", ganzhi);
                $("#zw_ln" + (i)).attr("startYear", (startYear + i));
            }
        }

        var curDayun, curLiunian, curLiuyue, curLiuri
        var lastActiveList = { "dayun": null, "liunian": null, "liuyue": null, "liuri": null };
        var clearActiveCell = function (cellType) {
            if (!lastActiveList[cellType]) return;
            lastActiveList[cellType].removeClass('cellActive');
            lastActiveList[cellType] = null;
        }

        //循环列表
        function CircularList(array, curIndex) {
            var currentIndex = curIndex;
            var length = array.length;

            function next() {
                if (length === 0) {
                    return null;
                }

                var currentItem = array[currentIndex];
                currentIndex = (currentIndex + 1) % length;
                return currentItem;
            }

            return {
                next: next
            };
        }
        //反向循环列表
        function ReversedCircularList(array, curIndex) {
            var index = curIndex;
            var length = array.length;

            return {
                next: function () {
                    var currentItem = array[index];
                    index = (index - 1 + length) % length;
                    return currentItem;
                }
            };
        }

        function isShun() {
            return (tianganYinyang(zwData.rawDates.chineseDate.yearly[0]) && zwData.gender == "男") ||
                (!tianganYinyang(zwData.rawDates.chineseDate.yearly[0]) && zwData.gender == "女")
        }

        function fillSihuaTagObj(arr, mutagen, color) {
            for (var key in arr) {
                if (key == mutagen[0]) {
                    arr[key].setProperties({ text: "禄", stroke: "white", background: color });
                } else
                    if (key == mutagen[1]) {
                        arr[key].setProperties({ text: "权", stroke: "white", background: color });
                    } else
                        if (key == mutagen[2]) {
                            arr[key].setProperties({ text: "科", stroke: "white", background: color });
                        } else
                            if (key == mutagen[3]) {
                                arr[key].setProperties({ text: "忌", stroke: "white", background: color });
                            } else {
                                arr[key].setProperties({ text: "空", stroke: "transparent", background: "transparent" });//liuyaoNode
                            }
            }
        }

        function fillDaxianLiuyao(stars) {
            clearLiuYao();
            fillDaxianLiuyao2(palacePanels["寅"], stars[0]);
            fillDaxianLiuyao2(palacePanels["卯"], stars[1]);
            fillDaxianLiuyao2(palacePanels["辰"], stars[2]);
            fillDaxianLiuyao2(palacePanels["巳"], stars[3]);
            fillDaxianLiuyao2(palacePanels["午"], stars[4]);
            fillDaxianLiuyao2(palacePanels["未"], stars[5]);
            fillDaxianLiuyao2(palacePanels["申"], stars[6]);
            fillDaxianLiuyao2(palacePanels["酉"], stars[7]);
            fillDaxianLiuyao2(palacePanels["戌"], stars[8]);
            fillDaxianLiuyao2(palacePanels["亥"], stars[9]);
            fillDaxianLiuyao2(palacePanels["子"], stars[10]);
            fillDaxianLiuyao2(palacePanels["丑"], stars[11]);

        }
        function fillDaxianLiuyao2(palace, liuyaos) {
            for (var i = 0; i < liuyaos.length; i++) {
                var name = liuyaos[i].name.split("");
                name[0] = "大";
                var textblock = new go.TextBlock(name.join("\n"),
                    { name: name.join(""), stroke: yunPalaceColor, alignment: go.Spot.Right, font: "9px " + defFont, background: "transparent" });
                palace.findObject("liuyaoNode2").insertAt(0, textblock);
            }
        }

        function fillLiunianLiuyao(stars) {
            clearLiunianLiuYao();
            fillLiunianLiuyao2(palacePanels["寅"], stars[0]);
            fillLiunianLiuyao2(palacePanels["卯"], stars[1]);
            fillLiunianLiuyao2(palacePanels["辰"], stars[2]);
            fillLiunianLiuyao2(palacePanels["巳"], stars[3]);
            fillLiunianLiuyao2(palacePanels["午"], stars[4]);
            fillLiunianLiuyao2(palacePanels["未"], stars[5]);
            fillLiunianLiuyao2(palacePanels["申"], stars[6]);
            fillLiunianLiuyao2(palacePanels["酉"], stars[7]);
            fillLiunianLiuyao2(palacePanels["戌"], stars[8]);
            fillLiunianLiuyao2(palacePanels["亥"], stars[9]);
            fillLiunianLiuyao2(palacePanels["子"], stars[10]);
            fillLiunianLiuyao2(palacePanels["丑"], stars[11]);

        }
        function fillLiunianLiuyao2(palace, liuyaos) {
            for (var i = 0; i < liuyaos.length; i++) {
                var name = liuyaos[i].name.split("");
                name[0] = "年";
                var textblock = new go.TextBlock(name.join("\n"),
                    { name: "lnly" + name.join(""), stroke: liunianPalaceColor, alignment: go.Spot.Right, font: "9px " + defFont, background: "transparent" });
                palace.findObject("liuyaoNode2").insertAt(0, textblock);
            }
        }

        function clearLiunianLiuYao() {
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                clearLiunianLiuYao2(palacePanels[palaceName]);
            });
        }

        function clearLiunianLiuYao2(palace) {
            var parent = palace.findObject("liuyaoNode2");
            if (parent.elements.count <= 0) return;
            for (var i = 0; i < 10; i++) {
                if (parent.elements.count <= 0) return;
                var el = parent.elt(0);
                if (el.name.startsWith("lnly")) {
                    parent.remove(el);
                }
            }
        }

        function clearLiuYao() {
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                clearLiuYao2(palacePanels[palaceName]);
            });

        }
        function clearLiuYao2(palace) {
            var parent = palace.findObject("liuyaoNode2");
            var elements = parent.elements;
            for (; elements.count > 0;) {
                parent.remove(parent.elt(elements.count - 1));
            }
        }

        function showDaxianLiuyao(vis) {
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                palacePanels[palaceName].findObject("liuyaoNode").setProperties({ visible: vis });
            });
        }

        function showSihuaTagObjs(vis) {
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                palacePanels[palaceName].findObject("sihuaNode").setProperties({ visible: vis });
            });
        }

        var sihuaObjs = [];
        function resetSihuaGong() {
            if (!sihuaObjs) return;
            sihuaObjs.forEach(function (obj) {
                obj.setProperties({ "background": "transparent", "stroke": obj.defStroke });
            });
            sihuaObjs = [];
        }
        var sanfangsizhengObjs = [];
        function resetSanfangsizhengGong() {
            if (!sanfangsizhengObjs) return;
            sanfangsizhengObjs.forEach(function (obj) {
                obj.setProperties({ "background": bgColor });
            });
            sanfangsizhengObjs = [];
        }
        var links = [];
        function clearLinks() {
            if (!links) return;
            links.forEach(function (obj) {
                zwNode.remove(obj);
            });
            links = [];
        }

        function showAgeNode(vis) {
            bodyTag.setProperties({ visible: vis });
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                palacePanels[palaceName].findObject("ageNode").setProperties({ visible: vis });
            });
        }

        function hideYungongs() {
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                palacePanels[palaceName].findObject("yunGong").setProperties({ visible: false });
            });
        }
        function hideLiuniangongs() {
            const palacePanelNames = Object.keys(palacePanels);
            palacePanelNames.forEach(palaceName => {
                palacePanels[palaceName].findObject("liunianGong").setProperties({ visible: false });
            });
        }

        /**
         * 找到地支对应的四正宫位
         * @param {} dizhi 
         */
        function findSizhengPalace(dizhi) {
            var earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
            var index = earthlyBranches.indexOf(dizhi);
            if (index !== -1) {
                var oppositeIndex = (index + 6) % 12;
                return earthlyBranches[oppositeIndex];
            } else {
                return null;
            }
        }
        /**
         * 找到地支对应的三方宫位
         * @param {*} dizhi 
         * @returns 
         */
        function findSanfangPalace(dizhi) {
            var earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
            var index = earthlyBranches.indexOf(dizhi);
            if (index !== -1) {
                var prevIndex = (index + 8) % 12; // 加7取余12，相当于往前数5位
                var nextIndex = (index + 4) % 12; // 加5取余12，相当于往后数5位
                return [earthlyBranches[prevIndex], earthlyBranches[nextIndex]]
            } else {
                return [];
            }
        }

        function beep() {
            navigator.vibrate = navigator.vibrate ||
                navigator.webkitVibrate ||
                navigator.mozVibrate ||
                navigator.msVibrate;
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }

        function getWuxinColor(wx) {
            if (wx == "金") {
                return getComputedStyle(document.documentElement).getPropertyValue("--jin");
            } else if (wx == "水") {
                return getComputedStyle(document.documentElement).getPropertyValue("--shui");
            } else if (wx == "木") {
                return getComputedStyle(document.documentElement).getPropertyValue("--mu");
            } else if (wx == "火") {
                return getComputedStyle(document.documentElement).getPropertyValue("--huo");
            } else if (wx == "土") {
                return getComputedStyle(document.documentElement).getPropertyValue("--tu");
            }
        }

        /**
         * 天干五行 甲乙同属木, 甲为阳, 乙为阴 丙丁同属火, 丙为阳, 丁为阴 戊己同属土, 戊为阳, 己为阴 庚辛同属金, 庚为阳, 辛为阴 壬癸同属水,
         * 壬为阳, 癸为阴
         *
         * @param tiangan
         * @return
         */
        function tianganWuxing(tiangan) {
            if ((tiangan == ("甲")) || (tiangan == ("乙"))) {
                return "木";
            }
            if ((tiangan == ("丙")) || (tiangan == ("丁"))) {
                return "火";
            }
            if ((tiangan == ("戊")) || (tiangan == ("己"))) {
                return "土";
            }
            if ((tiangan == ("庚")) || (tiangan == ("辛"))) {
                return "金";
            }
            if ((tiangan == ("壬")) || (tiangan == ("癸"))) {
                return "水";
            }
            return "";
        }

        function tianganYinyang(tiangan) {
            if ((tiangan == ("甲")) || (tiangan == ("丙")) || (tiangan == ("戊"))
                || (tiangan == ("庚")) || (tiangan == ("壬"))) {
                return true;
            }
            if ((tiangan == ("乙")) || (tiangan == ("丁")) || (tiangan == ("己"))
                || (tiangan == ("辛")) || (tiangan == ("癸"))) {
                return false;
            }
            return false;
        }

        /**
         * 地支五行 亥子属水，巳午属火，寅卯属木，申酉属金，辰丑未戌属土，丑未为阴土，辰戌为阳土，辰丑为湿土，未戌为燥土。
         *
         * @param dizhi
         * @return
         */
        function dizhiWuxing(dizhi) {
            if ((dizhi == ("寅")) || (dizhi == ("卯"))) {
                return "木";
            }
            if ((dizhi == ("巳")) || (dizhi == ("午"))) {
                return "火";
            }
            if ((dizhi == ("丑")) || (dizhi == ("辰")) || (dizhi == ("未"))
                || (dizhi == ("戌"))) {
                return "土";
            }
            if ((dizhi == ("申")) || (dizhi == ("酉"))) {
                return "金";
            }
            if ((dizhi == ("亥")) || (dizhi == ("子"))) {
                return "水";
            }
            return "";
        }

        /**
         * 把年份转换为干支
         * @param  year 
         * @returns 
         */
        function getYearGanZhi(year) {
            // 天干
            var tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
            // 地支
            var diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

            // 计算天干地支
            var ganIndex = (year - 4) % 10; // 4是基准年份，可以根据实际情况调整
            var zhiIndex = (year - 4) % 12; // 4是基准年份，可以根据实际情况调整

            // 获取天干地支
            var gan = tianGan[ganIndex];
            var zhi = diZhi[zhiIndex];

            return gan + zhi;
        }
    }

    //排紫微
    function doZiwei(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime) {
        if (!isValidDateTime(year, month, day, hour, minute, second)) {
            return;
        }

        var baseDate = new Date(year, month - 1, day, hour, minute, second);
        if (summertime) {//调整夏令时
            currentDate = adjustForDST(baseDate);
        } else {
            currentDate = baseDate;
        }

        var realsunDate;
        if (!!realsun) {//转换为真太阳时
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

        var solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
        lunar = solar.getLunar();
        layui.viewmgr.showView('view_ziwei');
        zwpaipan(year + "-" + month + "-" + day, iztro.util.timeToIndex(hour), isman, lunar);
    };

    function beginPaipan() {
        layui.viewmgr.loadComponent('component_basic_data', function () {
            basicDataComponent.display(
                "紫微斗数排盘", 
                function(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime){
                    doZiwei(year, month, day, hour, minute, second, isman, realsun, diqu, wanzishi, summertime);
                },
                globalThis.ziweiView
            );
        });
    }

    globalThis.ziweiView = {
        display: beginPaipan,
        doZiwei: doZiwei,
        getLunar: function(){return lunar},
        getBazi: function(){return lunar.getEightChar()},
        setCurrentData: function (data) { currentData = data;},
        getCurrentData: function () { return currentData; },
    }


})();