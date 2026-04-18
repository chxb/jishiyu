# 简介 Introduction

吉时雨排盘一款综合性中国传统命理排盘工具，涵盖八字、奇门遁甲、六爻、梅花易数、大六壬、紫微斗数等多种术数体系。

## 功能模块 Modules

| 模块 | 说明 |
|------|------|
| 八字排盘 | 四柱八字排盘，含十神、神煞、串宫压运等分析 |
| 阴盘奇门 | 支持时盘、刻盘排法，可自定义局数，显示天门地户等信息 |
| 奇门遁甲 | 支持拆补法、置闰法、茅山法三种起局方式 |
| 山向奇门 | 阴宅阳宅山向奇门排盘 |
| 六爻 | 六爻排盘，含纳甲、六亲、归魂/游魂/六冲/六合卦 |
| 梅花易数 | 支持时间起卦、数字起卦、自定义起卦 |
| 大六壬 | 大六壬排盘，含720课、十二天将、四课三传 |
| 奇门穿壬 | 奇门遁甲与大六壬结合排盘 |
| 太乙三式 | 太乙神数与奇门遁甲、大六壬三式排盘 |
| 紫微斗数 | 紫微斗数排盘 |
| 达摩一掌经 | 达摩一掌经排盘，六道、神煞、十二宫排盘 |
| 万年历 | 农历/阳历对照查询 |
| 老黄历 | 每日宜忌、吉凶查询 |
| 称骨算命 | 袁天罡称骨算命法 |
| 数字吉凶 | 延年/天医/生气等数字吉凶分析 |
| 真太阳时 | 基于城市经度的真太阳时校正 |

## 项目结构 Project Structure

```
jishiyu/
├── index.html              # 主入口页面
├── js/
│   ├── paipan.js           # 应用主入口，路由与导航
│   ├── qimendunjia.js      # 奇门遁甲核心算法
│   ├── qimen.js            # 阴盘奇门排盘
│   ├── qimenhelper.js      # 奇门帮助弹框
│   ├── qimen_jibing.js     # 奇门吉病分析
│   ├── qimen_info.js       # 奇门八卦宫位信息
│   ├── 6yao.js             # 六爻排盘算法
│   ├── 6yao_info.js        # 六爻持世信息
│   ├── meihua.js           # 梅花易数算法
│   ├── da6ren.js           # 大六壬算法
│   ├── taiyi.js            # 太乙神数算法
│   ├── ninestar.js         # 九星/紫微斗数
│   ├── yizhangjing.js      # 达摩一掌经
│   ├── chenggu.js          # 称骨算命
│   ├── sj.js               # 数字吉凶
│   ├── shishen.js          # 十神详解
│   ├── shensha.js          # 神煞详解
│   ├── baziutils.js        # 八字工具方法
│   ├── realsuntime.js      # 真太阳时计算
│   ├── monthly.js          # 月历渲染
│   ├── dataservice.js      # 数据持久化
│   ├── view_ui/            # UI视图交互模块
│   │   ├── view_qimendunjia.js
│   │   ├── view_bazi.js
│   │   ├── view_6yao.js
│   │   └── ...
│   └── 3rd/                # 第三方库
│       ├── layui/          # 前端UI框架
│       ├── lunar-javascript/ # 农历算法库
│       ├── iztro/          # 紫微斗数库
│       ├── gojs/           # Canvas可视化
│       ├── jquery/         # DOM操作
│       └── marked/         # Markdown解析
├── css/
│   ├── paipan.css          # 排盘主样式
│   ├── qimen.css           # 奇门样式
│   ├── zw.css              # 紫微样式
│   ├── sj.css              # 数字吉凶样式
│   ├── yueli.css           # 月历样式
│   └── shizhudate.css      # 日期选择器样式
├── assets/
│   ├── 64gua/              # 六十四卦文本
│   └── books/              # 经典文献
│       ├── 医/             # 医学经典（伤寒杂病论、黄帝内经、千金翼方等）
│       ├── 山/             # 修行经典（太极拳、易筋经等）
│       ├── 命/             # 易学命理经典（滴天髓、穷通宝鉴、千里命稿等）
│       ├── 相/             # 相术经典（麻衣神相等）
│       ├── 卜/             # 易学卜卦经典（卜筮正宗、梅花易数等）
│       └── 相关经典/        # 其他经典
```

## 技术栈 Technology Stack

- **前端框架**: [Layui](https://layui.dev/)
- **农历算法**: [lunar-javascript](https://github.com/6tail/lunar-javascript)
- **Canvas可视化绘图**: [GoJS](https://gojs.net/)
- **DOM操作**: jQuery
- **Markdown解析**: marked
- **紫微斗数**: [iztro](https://github.com/SylarLong/iztro)

## 变更历史 History

本项目起源于2023年1月过年期间。有感于当时市面上没有一款用着顺手的排盘工具，于是趁假期写了一个八字排盘。这就是吉时雨排盘的前身。后来演变成多种术数的综合排盘工具。

[历史变更日志](changelogs.md)

## 赞助 Donate / Sponsor

如果这个项目对你有帮助，欢迎通过以下方式支持我：

If this project is helpful, consider supporting it:

<img src="PAY.JPG" width="250" title="可缩放图片">

## 授权 License

基于类似 MIT 许可条款，允许非商业用途；商业用途需事先获得书面授权。

Non-commercial use permitted based on MIT-style terms; commercial use requires prior written authorization.

## 联系作者 Contact Author

xianbo.chen@gmail.com
