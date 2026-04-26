# 简介 Introduction

吉时雨排盘一款综合性中国传统命理排盘工具，涵盖八字、奇门遁甲、六爻、梅花易数、大/小六壬、紫微斗数等多种术数体系。

在经体验地址：[https://ji.js.cn](https://ji.js.cn)

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
| 小六壬 | 小六壬排盘，支持时间起课和报数起课 |
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
│   ├── qimen.css           # 奇门、九宫样式
│   ├── zw.css              # 紫微样式
│   ├── sj.css              # 数字吉凶样式
│   ├── yueli.css           # 月历样式
│   └── shizhudate.css      # 四柱八字选择控件样式
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

## 项目架构 Project Architecture

```PlainText
┌──────────────────────────────────────────────────────────────┐
│                            入口层                             │
│                                                              │
│              index.html → setup.js → layui.use()             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        应用主控层                             │
│                                                              │
│          paipan.js   （路由 / 事件 / 参数解析）                 │
│          viewmgr.js  （视图管理）                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                          视图层                               │
│                                                              │
│          排盘视图 / 功能视图 / 系统视图（view_xxx）              │
│          component_basic_data（通用输入组件）                  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          算法层                              │
│                        （核心引擎）                           │
│                                                             │
│        八字 / 奇门 / 六爻 / 梅花 / 六壬 / 紫微 / 太乙            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                        第三方依赖                             │
│                                                              │
│   Layui / jQuery / lunar-javascript / GoJS / iztro           │
└──────────────────────────────────────────────────────────────┘
```

## 技术栈 Technology Stack

- **前端框架**: [Layui](https://layui.dev/) v2.13.0
  - 依赖其中的表单组件、弹窗、模板、模块加载等常用组件
- **农历算法**: [lunar-javascript](https://github.com/6tail/lunar-javascript)
  - 依赖其中的农历算法库，用于计算农历日期、干支历等
- **Canvas可视化绘图**: [GoJS](https://gojs.net/) v2.3.16
  - 依赖其中的Canvas可视化绘图库，用于绘制紫微斗数排盘
- **DOM操作**: [jQuery](https://github.com/jquery/jquery) v3.6.4
  - 依赖其中的DOM操作库，用于处理页面元素、事件绑定等常用操作
- **Markdown解析**: [marked](https://github.com/chjj/marked) v15.0.7
  - 依赖其中的Markdown解析库，用于将Markdown格式的文本转换为HTML格式
- **紫微斗数**: [iztro](https://github.com/SylarLong/iztro)
  - 依赖其中的紫微斗数库，用于计算紫微斗数排盘
- **日期选择插件** [Rolldate](https://github.com/weijhfly/rolldate) 3.1.0
  - 基于此插件进行了日期选择器的定制化，支持公、农历日期选择
  
  （**感谢以上所有第三方库的贡献者**）

## 项目历史 History

本项目起源于2023年1月过年期间。有感于当时市面上没有一款用着顺手的排盘工具，于是趁假期写了一个八字排盘。这就是吉时雨排盘的前身。后来演变成多种术数的综合排盘工具。

[历史变更日志](changelogs.md)

## 赞助 Donate / Sponsor

本项目数术算法在查阅大量经典文献的基础上，确保了算法的准确性与可靠性，作者为此投入了大量时间和精力。

如果这个项目对你有帮助，欢迎通过以下方式支持我：

This project's numerological algorithm has consulted a large number of classical texts, ensuring its accuracy and reliability. The author has invested a significant amount of time and effort into it.

If this project is helpful, consider supporting it:

<img src="PAY.JPG" width="200">

## 授权 License

[LICENSE](LICENSE)

基于 MIT 许可条款，允许非商业用途；商业用途需事先获得书面授权。

Non-commercial use permitted based on MIT-style terms; commercial use requires prior written authorization.

## 联系作者 Contact Author

可通过以下方式联系作者：

邮箱：
xianbo.chen@gmail.com

微信：
<img src="wechat.jpg" width="200">