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

    var qiduweng_case = {
        "占天时": [
            "占天晴雨有玄微，体用看作天地推。",
            "天克地兮须亢旱，地克天兮必淋漓。",
            "体来生用连阴天，用如生体久纷飞。",
            "风调雨顺何如取，比和天地报君知。"
        ],
        "占失物": [
            "欲占失物在何方，只将用位细推详。",
            "岁德在东辰在北，太白西位荧惑南。",
            "用生体位财还在，我若生他物已亡。",
            "唯有比和及克用，财星隐似太行山。"
        ],
        "占婚姻": [
            "占婚体用忌相刑，我克他兮亦易成。",
            "体受用生因嫁发，体如生用为婚倾。",
            "日主是媒宜我克，若还生我定为荣。",
            "比和体用比和日，笑看同谐秦晋盟。"
        ],
        "占六甲": [
            "占胎数内理玄微，体为产母用为儿。",
            "合则临盆而有庆，生兮坐草以无危。",
            "用受体伤儿不育，用来克体母非宜。",
            "生时年月详星断，男女阴阳数可推。"
        ],
        "占求名": [
            "占名何日覆金瓯，日干生体占龙头。",
            "克我刘蕡还下第，生他季子且包羞。",
            "体克用兮登虎榜，用生体兮步瀛洲。",
            "若逢体用比和数，一日声名遍九洲。"
        ],
        "占求利": [
            "占财何日得欣欢，妙诀仍归一掌间。",
            "体旺遇生千贯易，体衰逢克一文难。",
            "用受体生伤本去，体如克用得财还。",
            "日干生体比和用，定知财宝积如山。"
        ],
        "占交易": [
            "交易欲知成与否，体如生用事难成。",
            "体克用兮成且利，用来伤体不须行。",
            "体受用生为大吉，比和体用也全亨。",
            "更推日主如生我，抚掌欢看金满籯。"
        ],
        "占行人": [
            "占行何日是归期，体用将来数上推。",
            "用克体兮人易至，体伤用位客归迟。",
            "体如生用无消息，用若生身可返闾。",
            "比和即日相欢会，万里行人也可期。"
        ],
        "占疾病": [
            "占病须宜体得生，比和即日可安宁。",
            "用如伤体应难疗，体若生他病转增。",
            "用受体伤疾自好，日辰克用药通灵。",
            "要知全愈如何论，用逢克日体逢生。"
        ],
        "占词讼": [
            "占讼惟宜我克他，他来克我即非佳。",
            "用如生体他亏理，体若生他我坏家。",
            "日干生我官扶我，支若伤他吏害他。",
            "只有比和去解散，识破玄关非浪夸。"
        ]
    };

    exports("qiduweng_case", qiduweng_case);

});
