// 由参考站点 https://nav.iowen.cn 采集整理，仅用于原型演示
export type NavSite = {
  id: string;
  name: string;
  url: string;
  desc: string;
  icon: string;
  tags: string[];
  views: string;
  likes: string;
  subs: string[];
};

export type NavBlock = {
  id: string;
  title: string;
  icon: string;
  subs: { id: string; label: string }[];
  siteIds: string[];
};

export const sites: NavSite[] = [
  {
    "id": "h139",
    "name": "H139网址导航",
    "url": "https://www.h139.com",
    "desc": "H139一站式全品类网址导航，聚合全网主流站点与小众宝藏资源，免注册无广告一键直达满足全场景上网需求。",
    "icon": "https://favicon.im/h139.com",
    "tags": [
      "常用推荐",
      "H139导航",
      "主题变色",
      "优秀模板"
    ],
    "views": "2.1K",
    "likes": "7",
    "subs": [
      "推荐"
    ]
  },
  {
    "id": "aitoolsnav",
    "name": "AIToolsNav",
    "url": "https://aitoolsnav.cn",
    "desc": "AIToolsNav致力于为用户精选和整理各类实用的人工智能工具，涵盖 AI 写作、AI 绘画、AI 编程、AI 视频、AI 办公、AI 设计、AI 音频 等多个领域。我们通过清晰的分类结构与持续更新的工具库，帮助创作者、开发者、自媒体从业者以及办公用户快速找到合适的AI工具，提升效率与创造力。",
    "icon": "https://favicon.im/aitoolsnav.cn",
    "tags": [
      "常用推荐",
      "用户演示"
    ],
    "views": "686",
    "likes": "3",
    "subs": [
      "推荐",
      "演示"
    ]
  },
  {
    "id": "6035",
    "name": "书签目录网",
    "url": "https://www.6035.com.cn",
    "desc": "书签目录网（6035.com.cn）是一个综合目录分类网站，致力于发现和分享互联网优质网站。我们提供详细的网站分类导航、最新的站长运营资讯，并欢迎广大站长提交自己的网站，免费申请收录，共同打造高质量的网络资源库。",
    "icon": "https://favicon.im/6035.com.cn",
    "tags": [
      "常用推荐",
      "用户演示"
    ],
    "views": "642",
    "likes": "1",
    "subs": [
      "推荐",
      "演示"
    ]
  },
  {
    "id": "iotheme",
    "name": "一为主题",
    "url": "https://www.iotheme.cn/?aff=120077",
    "desc": "iotheme 一为主题,高品质的WordPress主题,有导航主题,wp主题,一为api,热搜榜等主题服务",
    "icon": "https://favicon.im/iotheme.cn",
    "tags": [
      "常用推荐",
      "iotheme",
      "onenav",
      "wordpress"
    ],
    "views": "2K",
    "likes": "1",
    "subs": [
      "推荐"
    ]
  },
  {
    "id": "zt123",
    "name": "自媒体TOP导航",
    "url": "https://www.zt123.cn",
    "desc": "自媒体TOP导航 - 自媒体网络创业导航！",
    "icon": "https://favicon.im/zt123.cn",
    "tags": [
      "常用推荐",
      "用户演示",
      "Zt123.Cn",
      "一为导航"
    ],
    "views": "4.2K",
    "likes": "1",
    "subs": [
      "推荐",
      "演示"
    ]
  },
  {
    "id": "xiake",
    "name": "虾壳",
    "url": "https://xiake.pro",
    "desc": "GitHub下载加速网站，提供GitHub文件加速服务，支持API、Git以及Releases、 Archive、gist、raw.githubusercontent.com等文件代理加速下载",
    "icon": "https://favicon.im/xiake.pro",
    "tags": [
      "常用推荐",
      "站长工具",
      "GitHub下载加速"
    ],
    "views": "4.3K",
    "likes": "11",
    "subs": [
      "推荐",
      "站长"
    ]
  },
  {
    "id": "yunge",
    "name": "云鸽",
    "url": "https://yunge.in",
    "desc": "云鸽是一款方便、快速、安全的文件传输助手。让您可以在不同设备之间轻松共享文件，它提供了简单直观的界面和高速稳定的传输速度，无需下载或登录，非常适合在日常生活和工作中共享文件。",
    "icon": "https://favicon.im/yunge.in",
    "tags": [
      "发现产品",
      "常用推荐",
      "云鸽",
      "云鸽传送"
    ],
    "views": "3.2K",
    "likes": "16",
    "subs": [
      "推荐",
      "产品"
    ]
  },
  {
    "id": "xuanxiaoer",
    "name": "宣小二 媒体发稿平台",
    "url": "https://www.xuanxiaoer.com",
    "desc": "宣小二 媒体发稿平台，自媒体发稿平台，短视频矩阵发布平台，基于AI驱动的企业自助式投放平台。",
    "icon": "https://favicon.im/xuanxiaoer.com",
    "tags": [
      "发现产品",
      "常用推荐",
      "媒体发稿",
      "新闻发稿"
    ],
    "views": "1.4K",
    "likes": "0",
    "subs": [
      "推荐",
      "产品"
    ]
  },
  {
    "id": "urlzj",
    "name": "网址之家",
    "url": "https://www.urlzj.com",
    "desc": "打造有趣实用的高端网址导航！",
    "icon": "https://favicon.im/urlzj.com",
    "tags": [
      "常用推荐",
      "用户演示"
    ],
    "views": "357",
    "likes": "0",
    "subs": [
      "推荐",
      "演示"
    ]
  },
  {
    "id": "undraw",
    "name": "unDraw",
    "url": "https://undraw.co/illustrations",
    "desc": "免费可商用自定义颜色图表库",
    "icon": "https://favicon.im/undraw.co",
    "tags": [
      "图形创意",
      "常用推荐"
    ],
    "views": "7.9K",
    "likes": "13",
    "subs": [
      "推荐"
    ]
  },
  {
    "id": "pan",
    "name": "百度网盘",
    "url": "https://pan.baidu.com",
    "desc": "安全的个人云存储服务",
    "icon": "https://favicon.im/pan.baidu.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "pantayun",
    "name": "盘它云网盘",
    "url": "https://www.pantayun.com/invite/?code=s6ogv3",
    "desc": "盘它云网盘，空间存储服务平台",
    "icon": "https://favicon.im/pantayun.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "onedrive",
    "name": "OneDrive",
    "url": "https://onedrive.live.com",
    "desc": "OneDrive 个人云存储空间",
    "icon": "https://favicon.im/onedrive.live.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "weiyun",
    "name": "腾讯微云",
    "url": "https://www.weiyun.com",
    "desc": "腾讯智能云服务",
    "icon": "https://favicon.im/weiyun.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "google",
    "name": "Google云盘",
    "url": "https://www.google.com/drive",
    "desc": "轻松安全地访问您的所有内容",
    "icon": "https://favicon.im/google.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "cloud",
    "name": "天翼云盘",
    "url": "https://cloud.189.cn/web/login.html",
    "desc": "珍藏美好生活 家庭云",
    "icon": "https://favicon.im/cloud.189.cn",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "aliyundrive",
    "name": "阿里云盘",
    "url": "https://www.aliyundrive.com",
    "desc": "阿里云盘是一款速度快、不打扰、够安全、易于分享的个人网盘，欢迎你来体验。",
    "icon": "https://favicon.im/aliyundrive.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "115",
    "name": "115网盘",
    "url": "https://115.com",
    "desc": "115，一生相伴",
    "icon": "https://favicon.im/115.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "网盘"
    ]
  },
  {
    "id": "wpdaxue",
    "name": "WordPress大学",
    "url": "https://www.wpdaxue.com",
    "desc": "WordPress大学专注于wordpress建站教学,提供wordpress主题,wordpres",
    "icon": "https://favicon.im/wpdaxue.com",
    "tags": [
      "社区资讯",
      "Word",
      "wordpress",
      "WordPress主题"
    ],
    "views": "3.7K",
    "likes": "1",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "chanpin100",
    "name": "产品壹佰",
    "url": "http://www.chanpin100.com",
    "desc": "为产品经理爱好者提供最优质的产品资讯、原创内容和相关视频课程",
    "icon": "https://favicon.im/chanpin100.com",
    "tags": [
      "社区资讯"
    ],
    "views": "1.9K",
    "likes": "0",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "lieyunwang",
    "name": "猎云网",
    "url": "https://www.lieyunwang.com",
    "desc": "互联网创业项目推荐和创业创新资讯",
    "icon": "https://favicon.im/lieyunwang.com",
    "tags": [
      "社区资讯"
    ],
    "views": "1.5K",
    "likes": "2",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "digitaling",
    "name": "数英网",
    "url": "https://www.digitaling.com",
    "desc": "数字媒体及职业招聘网站",
    "icon": "https://favicon.im/digitaling.com",
    "tags": [
      "社区资讯"
    ],
    "views": "2.6K",
    "likes": "0",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "36kr",
    "name": "36kr",
    "url": "https://36kr.com",
    "desc": "创业资讯、科技新闻",
    "icon": "https://favicon.im/36kr.com",
    "tags": [
      "社区资讯"
    ],
    "views": "1.5K",
    "likes": "0",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "leiphone",
    "name": "雷锋网",
    "url": "https://www.leiphone.com",
    "desc": "人工智能和智能硬件领域的互联网科技媒体",
    "icon": "https://favicon.im/leiphone.com",
    "tags": [
      "社区资讯"
    ],
    "views": "1.6K",
    "likes": "0",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "ozss",
    "name": "最省事",
    "url": "https://www.ozss.com",
    "desc": "最省事聚集地是一个内容创作与分享社区，专注收集和分享负责任、有智趣、贴近生活的内容。",
    "icon": "https://favicon.im/ozss.com",
    "tags": [
      "社区资讯",
      "个人博客",
      "全媒体",
      "博主社区"
    ],
    "views": "33.7K",
    "likes": "22",
    "subs": [
      "资讯"
    ]
  },
  {
    "id": "meta",
    "name": "小众软件",
    "url": "https://meta.appinn.net",
    "desc": "在这里发现更多有趣的应用",
    "icon": "https://favicon.im/meta.appinn.net",
    "tags": [
      "发现产品"
    ],
    "views": "7.3K",
    "likes": "7",
    "subs": [
      "产品"
    ]
  },
  {
    "id": "today",
    "name": "Today",
    "url": "http://today.itjuzi.com",
    "desc": "为身边的新产品喝彩",
    "icon": "https://favicon.im/today.itjuzi.com",
    "tags": [
      "发现产品"
    ],
    "views": "1.3K",
    "likes": "0",
    "subs": [
      "产品"
    ]
  },
  {
    "id": "liqi",
    "name": "利器",
    "url": "https://liqi.io",
    "desc": "创造者和他们的工具",
    "icon": "https://favicon.im/liqi.io",
    "tags": [
      "发现产品"
    ],
    "views": "1.3K",
    "likes": "0",
    "subs": [
      "产品"
    ]
  },
  {
    "id": "sspai",
    "name": "少数派",
    "url": "https://sspai.com",
    "desc": "高品质数字消费指南",
    "icon": "https://favicon.im/sspai.com",
    "tags": [
      "发现产品"
    ],
    "views": "3.8K",
    "likes": "0",
    "subs": [
      "产品"
    ]
  },
  {
    "id": "producthunt",
    "name": "Producthunt",
    "url": "https://www.producthunt.com",
    "desc": "发现新鲜有趣的产品",
    "icon": "https://favicon.im/producthunt.com",
    "tags": [
      "发现产品",
      "常用推荐"
    ],
    "views": "4.8K",
    "likes": "6",
    "subs": [
      "产品"
    ]
  },
  {
    "id": "yydsok",
    "name": "以一当十影视导航",
    "url": "https://www.yydsok.com",
    "desc": "以一当十影视导航收集整理了全网最优质、最好用的免费电影网站目录、影视APP、电视盒子资源等，让你白嫖追剧看电影再也不用东奔西跑找网站了。",
    "icon": "https://favicon.im/yydsok.com",
    "tags": [
      "影音视听",
      "用户演示",
      "一当十电影",
      "电影导航"
    ],
    "views": "6.2K",
    "likes": "2",
    "subs": [
      "影音"
    ]
  },
  {
    "id": "mznav",
    "name": "名站导航",
    "url": "https://mznav.com",
    "desc": "名站导航(mznav.com)致力于打造国内最好的互联网上优质网站网址大全，收录了全网好用强大的网站网址和软件包括设计、开发、影视、AI、运营、生活、休闲、办公、工具、资源等超全面的网址和职业技巧内容，让您的上网体验更便捷更放心，努力成为简洁人人都在用的网址导航。",
    "icon": "https://favicon.im/mznav.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "jiafangbb",
    "name": "甲方导航",
    "url": "https://jiafangbb.com",
    "desc": "简洁的工作娱乐网址导航网站",
    "icon": "https://favicon.im/jiafangbb.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "qinggongju",
    "name": "轻工具导航",
    "url": "https://qinggongju.com",
    "desc": "轻工具导航站，一个专注收集分享优质免费资源网站的导航",
    "icon": "https://favicon.im/qinggongju.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "niba5",
    "name": "泥巴设计导航",
    "url": "http://niba5.com",
    "desc": "专为设计师打造的在线资源枢纽，致力于整合全球优质设计资源，提供高效便捷的一站式检索服务。让每位设计师都能在5秒内触达所需资源，释放创造力边界。",
    "icon": "https://favicon.im/niba5.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "wanlb",
    "name": "宝藏库",
    "url": "https://www.wanlb.com",
    "desc": "在这里，你可以分享你的宝藏，发现无限可能，与他人一起创造更美好的未来！",
    "icon": "https://favicon.im/wanlb.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "520dh",
    "name": "零导航",
    "url": "https://www.520dh.com",
    "desc": "干净好用的综合导航",
    "icon": "https://favicon.im/520dh.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "bokequan",
    "name": "博客圈",
    "url": "https://bokequan.cn",
    "desc": "“博客圈“致力于个人独立博客，是由段先森维护的非营利性、自愿加入的博客活动，按照地区分类。成立于2021年7月24日，在这里能够看到许许多多志同道合的友人。",
    "icon": "https://favicon.im/bokequan.cn",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "ruii6",
    "name": "睿导航网",
    "url": "https://www.ruii6.com",
    "desc": "精选实用网站与在线工具",
    "icon": "https://favicon.im/ruii6.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "演示"
    ]
  },
  {
    "id": "vanschneider",
    "name": "vanschneider",
    "url": "https://vanschneider.com/colors",
    "desc": "Color Claim was created in 2012 by Tobias van Schneider with the goal to collect & combine unique colors for my future projects.",
    "icon": "https://favicon.im/vanschneider.com",
    "tags": [
      "在线配色"
    ],
    "views": "5.5K",
    "likes": "2",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "klart",
    "name": "klart",
    "url": "https://klart.io/colors",
    "desc": "Beautiful colors and designs to your inbox every week",
    "icon": "https://favicon.im/klart.io",
    "tags": [
      "在线配色"
    ],
    "views": "3.4K",
    "likes": "8",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "trianglify",
    "name": "trianglify",
    "url": "https://trianglify.io",
    "desc": "Trianglify Generator",
    "icon": "https://favicon.im/trianglify.io",
    "tags": [
      "在线配色"
    ],
    "views": "2.6K",
    "likes": "0",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "flatuicolorpicker",
    "name": "flatui color picker",
    "url": "https://www.flatuicolorpicker.com",
    "desc": "Best Flat Colors For UI Design",
    "icon": "https://favicon.im/flatuicolorpicker.com",
    "tags": [
      "在线配色"
    ],
    "views": "2.5K",
    "likes": "1",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "color",
    "name": "Adobe Color CC",
    "url": "https://color.adobe.com/zh/create/color-wheel",
    "desc": "Create color schemes with the color wheel or browse thousands of color combinations from the Color community.",
    "icon": "https://favicon.im/color.adobe.com",
    "tags": [
      "在线配色",
      "常用推荐"
    ],
    "views": "8.2K",
    "likes": "4",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "colorhunt",
    "name": "colorhunt",
    "url": "https://www.colorhunt.co",
    "desc": "Beautiful Color Palettes",
    "icon": "https://favicon.im/colorhunt.co",
    "tags": [
      "在线配色"
    ],
    "views": "2.6K",
    "likes": "1",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "coolors",
    "name": "coolors",
    "url": "https://coolors.co",
    "desc": "The super fast color schemes generator!",
    "icon": "https://favicon.im/coolors.co",
    "tags": [
      "在线配色"
    ],
    "views": "3.6K",
    "likes": "2",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "flatuicolors",
    "name": "flatuicolors",
    "url": "https://flatuicolors.com",
    "desc": "Copy Paste Color Pallette from Flat UI Theme",
    "icon": "https://favicon.im/flatuicolors.com",
    "tags": [
      "在线配色"
    ],
    "views": "2.4K",
    "likes": "0",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "thedayscolor",
    "name": "thedayscolor",
    "url": "http://www.thedayscolor.com",
    "desc": "The daily color digest",
    "icon": "https://favicon.im/thedayscolor.com",
    "tags": [
      "在线配色"
    ],
    "views": "2K",
    "likes": "0",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "grabient",
    "name": "grabient",
    "url": "https://www.grabient.com",
    "desc": "2017 Grabient by unfold",
    "icon": "https://favicon.im/grabient.com",
    "tags": [
      "在线配色"
    ],
    "views": "2.4K",
    "likes": "1",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "webgradients",
    "name": "webgradients",
    "url": "https://webgradients.com",
    "desc": "WebGradients is a free collection of 180 linear gradients that you can use as content backdrops in any part of your website.",
    "icon": "https://favicon.im/webgradients.com",
    "tags": [
      "在线配色"
    ],
    "views": "2.2K",
    "likes": "1",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "webkul",
    "name": "Coolest",
    "url": "https://webkul.github.io/coolhue",
    "desc": "Coolest handpicked Gradient Hues for your next super ⚡ amazing stuff",
    "icon": "https://favicon.im/webkul.github.io",
    "tags": [
      "在线配色"
    ],
    "views": "2.1K",
    "likes": "1",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "cssgradient",
    "name": "CSS Gradient",
    "url": "https://cssgradient.io",
    "desc": "Curated gradients for designers and developers",
    "icon": "https://favicon.im/cssgradient.io",
    "tags": [
      "在线配色"
    ],
    "views": "990",
    "likes": "0",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "uigradients",
    "name": "uigradients",
    "url": "https://uigradients.com",
    "desc": "Beautiful colored gradients",
    "icon": "https://favicon.im/uigradients.com",
    "tags": [
      "在线配色"
    ],
    "views": "1.5K",
    "likes": "0",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "khroma",
    "name": "khroma",
    "url": "http://khroma.co/generator",
    "desc": "Khroma is the fastest way to discover, search, and save color combos you'll want to use.",
    "icon": "https://favicon.im/khroma.co",
    "tags": [
      "在线配色"
    ],
    "views": "968",
    "likes": "0",
    "subs": [
      "配色"
    ]
  },
  {
    "id": "aidhb",
    "name": "AI导航吧",
    "url": "https://www.aidhb.com",
    "desc": "AI神器大全导航网 收录了国内外5000+优质AI工具，包括AI写作、AI绘画、AI设计、AI客服、AI办公、AI营销、AI搜索、AI智能体、AI语音生成、AI视频生成、数字人等生成式人工智能工具。在这里，帮助用户快速提升工作效率和创作能力，AI领域的专家和初学者都能轻松找到心仪的AI工具和学习资源",
    "icon": "https://favicon.im/aidhb.com",
    "tags": [
      "站长工具",
      "AI写作",
      "AI客服",
      "AI绘画"
    ],
    "views": "345",
    "likes": "0",
    "subs": [
      "站长"
    ]
  },
  {
    "id": "v6",
    "name": "51LA数据统计",
    "url": "https://v6.51.la",
    "desc": "领先的数据统计服务商",
    "icon": "https://favicon.im/v6.51.la",
    "tags": [
      "站长工具",
      "数据统计",
      "站长工具"
    ],
    "views": "1.1K",
    "likes": "0",
    "subs": [
      "站长"
    ]
  },
  {
    "id": "shipin520",
    "name": "潮点网",
    "url": "https://shipin520.com",
    "desc": "530万版权素材放心下载",
    "icon": "https://favicon.im/shipin520.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "kuaipng",
    "name": "快图网",
    "url": "http://www.kuaipng.com",
    "desc": "快图网提供免费的PNG元素和高清背景图片素材免费下载",
    "icon": "https://favicon.im/kuaipng.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "stock",
    "name": "图虫图库",
    "url": "https://stock.tuchong.com",
    "desc": "海量图库,涵盖创意图片和矢量素材等",
    "icon": "https://favicon.im/stock.tuchong.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "sccnn",
    "name": "素材中国",
    "url": "http://www.sccnn.com",
    "desc": "免费素材共享平台",
    "icon": "https://favicon.im/sccnn.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "psefan",
    "name": "PS饭团网",
    "url": "http://psefan.com",
    "desc": "不一样的设计素材库！让自己的设计与众不同！",
    "icon": "https://favicon.im/psefan.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "lanrentuku",
    "name": "懒人图库",
    "url": "https://www.lanrentuku.com",
    "desc": "懒人图库专注于提供网页素材下载",
    "icon": "https://favicon.im/lanrentuku.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "nipic",
    "name": "昵图网",
    "url": "https://www.nipic.com",
    "desc": "原创素材共享平台",
    "icon": "https://favicon.im/nipic.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "90sheji",
    "name": "90设计",
    "url": "https://90sheji.com",
    "desc": "电商设计（淘宝美工）千图免费淘宝素材库",
    "icon": "https://favicon.im/90sheji.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "ooopic",
    "name": "我图网",
    "url": "https://www.ooopic.com",
    "desc": "我图网,提供图片素材及模板下载,专注正版设计作品交易",
    "icon": "https://favicon.im/ooopic.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "588ku",
    "name": "千库网",
    "url": "https://588ku.com",
    "desc": "免费png图片背景素材下载",
    "icon": "https://favicon.im/588ku.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "58pic",
    "name": "千图网",
    "url": "https://www.58pic.com",
    "desc": "专注免费设计素材下载的网站",
    "icon": "https://favicon.im/58pic.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "medialoot",
    "name": "Medialoot",
    "url": "https://medialoot.com",
    "desc": "Free &amp; Premium Design Resources &mdash; Medialoot",
    "icon": "https://favicon.im/medialoot.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "平面"
    ]
  },
  {
    "id": "instantlogosearch",
    "name": "Instant Logo Search",
    "url": "http://instantlogosearch.com",
    "desc": "Search & download thousands of logos instantly",
    "icon": "https://favicon.im/instantlogosearch.com",
    "tags": [
      "LOGO设计"
    ],
    "views": "2.4K",
    "likes": "0",
    "subs": [
      "logo"
    ]
  },
  {
    "id": "worldvectorlogo",
    "name": "World Vector Logo",
    "url": "https://worldvectorlogo.com",
    "desc": "Brand logos free to download",
    "icon": "https://favicon.im/worldvectorlogo.com",
    "tags": [
      "LOGO设计"
    ],
    "views": "1.9K",
    "likes": "0",
    "subs": [
      "logo"
    ]
  },
  {
    "id": "iosicongallery",
    "name": "iOS Icon Gallery",
    "url": "https://iosicongallery.com",
    "desc": "Showcasing beautiful icon designs from the iOS App Store",
    "icon": "https://favicon.im/iosicongallery.com",
    "tags": [
      "LOGO设计"
    ],
    "views": "1.3K",
    "likes": "0",
    "subs": [
      "logo"
    ]
  },
  {
    "id": "iconsfeed",
    "name": "Iconsfeed",
    "url": "http://www.iconsfeed.com",
    "desc": "Looking for iOS icon inspiration? We bring the iOS icons gallery to you.",
    "icon": "https://favicon.im/iconsfeed.com",
    "tags": [
      "LOGO设计"
    ],
    "views": "1.3K",
    "likes": "0",
    "subs": [
      "logo"
    ]
  },
  {
    "id": "isux",
    "name": "ISUX",
    "url": "https://isux.tencent.com",
    "desc": "腾讯社交用户体验设计部",
    "icon": "https://favicon.im/isux.tencent.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "eux",
    "name": "百度企业产品用户体验中心",
    "url": "http://eux.baidu.com",
    "desc": "百度企业产品用户体验中心",
    "icon": "https://favicon.im/eux.baidu.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "yfx",
    "name": "源分享",
    "url": "https://www.yfx.top",
    "desc": "源分享是一个专注于原创开发的平台,用心创造全新产品和专业的售后服务,为更多的个人站长推荐有价值的好东西!",
    "icon": "https://favicon.im/yfx.top",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "ztjun",
    "name": "WordPress主题君",
    "url": "https://www.ztjun.com",
    "desc": "精选免费WordPress主题模板下载",
    "icon": "https://favicon.im/ztjun.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "jelly",
    "name": "京东设计中心",
    "url": "https://jelly.jd.com",
    "desc": "京东设计中心",
    "icon": "https://favicon.im/jelly.jd.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "ued",
    "name": "百度用户体验中心",
    "url": "http://ued.baidu.com",
    "desc": "百度用户体验中心",
    "icon": "https://favicon.im/ued.baidu.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "mux",
    "name": "阿里妈妈",
    "url": "https://mux.alimama.com",
    "desc": "阿里妈妈营销研究和用户体验中心",
    "icon": "https://favicon.im/mux.alimama.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "tgideas",
    "name": "TGideas",
    "url": "https://tgideas.qq.com",
    "desc": "TGideas隶属于腾讯公司互动娱乐业务系统的专业推广类设计团队",
    "icon": "https://favicon.im/tgideas.qq.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "cdc",
    "name": "腾讯CDC",
    "url": "https://cdc.tencent.com",
    "desc": "腾讯CDC关注于互联网视觉设计、交互设计、用户研究、前端开发。",
    "icon": "https://favicon.im/cdc.tencent.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "niceui",
    "name": "nice design",
    "url": "http://www.niceui.cn",
    "desc": "nicedesign奈思设计是领先的用户体验设计与互联网品牌建设公司",
    "icon": "https://favicon.im/niceui.cn",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "eicoinc",
    "name": "eico design",
    "url": "https://eicoinc.com",
    "desc": "数字化咨询与产品专家",
    "icon": "https://favicon.im/eicoinc.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "design",
    "name": "Google Design",
    "url": "https://design.google",
    "desc": "Google Design",
    "icon": "https://favicon.im/design.google",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "团队"
    ]
  },
  {
    "id": "book",
    "name": "豆瓣读书",
    "url": "https://book.douban.com",
    "desc": "读书评分、书单与书评社区",
    "icon": "https://favicon.im/book.douban.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "weread",
    "name": "微信读书",
    "url": "https://weread.qq.com",
    "desc": "社交化阅读，海量出版书",
    "icon": "https://favicon.im/weread.qq.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "dedao",
    "name": "得到",
    "url": "https://www.dedao.cn",
    "desc": "知识服务与电子书",
    "icon": "https://favicon.im/dedao.cn",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "nlc",
    "name": "国家图书馆",
    "url": "http://www.nlc.cn",
    "desc": "国家数字图书馆公共资源",
    "icon": "https://favicon.im/nlc.cn",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "kongfz",
    "name": "孔夫子旧书网",
    "url": "https://www.kongfz.com",
    "desc": "古旧书与二手书交易",
    "icon": "https://favicon.im/kongfz.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "lifeweek",
    "name": "三联生活周刊",
    "url": "https://www.lifeweek.com.cn",
    "desc": "人文生活周刊与深度报道",
    "icon": "https://favicon.im/lifeweek.com.cn",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "owspace",
    "name": "单向空间",
    "url": "https://www.owspace.com",
    "desc": "独立书店与文化活动",
    "icon": "https://favicon.im/owspace.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "fanqienovel",
    "name": "番茄小说",
    "url": "https://fanqienovel.com",
    "desc": "免费小说阅读平台",
    "icon": "https://favicon.im/fanqienovel.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "zazhipu",
    "name": "杂志铺",
    "url": "https://www.zazhipu.com",
    "desc": "杂志订阅与在线阅读",
    "icon": "https://favicon.im/zazhipu.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "yeeyan",
    "name": "译言网",
    "url": "https://www.yeeyan.org",
    "desc": "译者社区与海外内容",
    "icon": "https://favicon.im/yeeyan.org",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "书籍"
    ]
  },
  {
    "id": "store",
    "name": "Steam",
    "url": "https://store.steampowered.com",
    "desc": "全球最大的 PC 游戏平台",
    "icon": "https://favicon.im/store.steampowered.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "apple",
    "name": "App Store",
    "url": "https://www.apple.com/app-store",
    "desc": "iOS 应用与游戏商店",
    "icon": "https://favicon.im/apple.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "apps",
    "name": "Microsoft Store",
    "url": "https://apps.microsoft.com",
    "desc": "Windows 应用与游戏商店",
    "icon": "https://favicon.im/apps.microsoft.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "iplaysoft",
    "name": "异次元软件",
    "url": "https://www.iplaysoft.com",
    "desc": "软件推荐与效率技巧",
    "icon": "https://favicon.im/iplaysoft.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "ghxi",
    "name": "果核剥壳",
    "url": "https://www.ghxi.com",
    "desc": "绿色软件与资源分享",
    "icon": "https://favicon.im/ghxi.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "coolapk",
    "name": "酷安",
    "url": "https://www.coolapk.com",
    "desc": "安卓应用与数码社区",
    "icon": "https://favicon.im/coolapk.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "gamersky",
    "name": "游民星空",
    "url": "https://www.gamersky.com",
    "desc": "游戏资讯与攻略",
    "icon": "https://favicon.im/gamersky.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "itch",
    "name": "itch.io",
    "url": "https://itch.io",
    "desc": "独立游戏发布平台",
    "icon": "https://favicon.im/itch.io",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "gog",
    "name": "GOG",
    "url": "https://www.gog.com",
    "desc": "无 DRM 正版游戏商店",
    "icon": "https://favicon.im/gog.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  },
  {
    "id": "humblebundle",
    "name": "Humble Bundle",
    "url": "https://www.humblebundle.com",
    "desc": "游戏与书籍慈善捆绑包",
    "icon": "https://favicon.im/humblebundle.com",
    "tags": [],
    "views": "0",
    "likes": "0",
    "subs": [
      "软件"
    ]
  }
];

export const siteById: Record<string, NavSite> = Object.fromEntries(sites.map((s) => [s.id, s]));

export const hotSiteIds: string[] = [
  "ozss",
  "color",
  "undraw",
  "meta",
  "yydsok",
  "vanschneider",
  "producthunt",
  "xiake",
  "zt123",
  "sspai"
];

export const blocks: NavBlock[] = [
  {
    "id": "recommend",
    "title": "常用推荐",
    "icon": "Sparkles",
    "subs": [],
    "siteIds": [
      "h139",
      "aitoolsnav",
      "6035",
      "iotheme",
      "zt123",
      "xiake",
      "yunge",
      "xuanxiaoer",
      "urlzj",
      "undraw"
    ]
  },
  {
    "id": "cloud",
    "title": "网盘云储",
    "icon": "Cloud",
    "subs": [],
    "siteIds": [
      "pan",
      "pantayun",
      "onedrive",
      "weiyun",
      "google",
      "cloud",
      "aliyundrive",
      "115"
    ]
  },
  {
    "id": "community",
    "title": "社区资讯",
    "icon": "MessagesSquare",
    "subs": [
      {
        "id": "资讯",
        "label": "科技资讯"
      },
      {
        "id": "产品",
        "label": "发现产品"
      },
      {
        "id": "影音",
        "label": "影音视听"
      }
    ],
    "siteIds": [
      "wpdaxue",
      "chanpin100",
      "lieyunwang",
      "digitaling",
      "36kr",
      "leiphone",
      "ozss",
      "yunge",
      "xuanxiaoer",
      "meta",
      "today",
      "liqi",
      "sspai",
      "producthunt",
      "yydsok"
    ]
  },
  {
    "id": "books",
    "title": "书籍期刊",
    "icon": "BookOpen",
    "subs": [],
    "siteIds": [
      "book",
      "weread",
      "dedao",
      "nlc",
      "kongfz",
      "lifeweek",
      "owspace",
      "fanqienovel",
      "zazhipu",
      "yeeyan"
    ]
  },
  {
    "id": "apps",
    "title": "软件游戏",
    "icon": "Gamepad2",
    "subs": [],
    "siteIds": [
      "store",
      "apple",
      "apps",
      "iplaysoft",
      "ghxi",
      "coolapk",
      "gamersky",
      "itch",
      "gog",
      "humblebundle"
    ]
  },
  {
    "id": "demo",
    "title": "用户演示",
    "icon": "FlaskConical",
    "subs": [],
    "siteIds": [
      "aitoolsnav",
      "mznav",
      "6035",
      "jiafangbb",
      "zt123",
      "qinggongju",
      "niba5",
      "wanlb",
      "520dh",
      "urlzj",
      "bokequan",
      "ruii6"
    ]
  },
  {
    "id": "tools",
    "title": "常用工具",
    "icon": "Wrench",
    "subs": [
      {
        "id": "配色",
        "label": "在线配色"
      },
      {
        "id": "站长",
        "label": "站长工具"
      },
      {
        "id": "插件",
        "label": "Chrome 插件"
      },
      {
        "id": "动效",
        "label": "交互动效"
      },
      {
        "id": "图形",
        "label": "图形创意"
      },
      {
        "id": "界面",
        "label": "界面设计"
      }
    ],
    "siteIds": [
      "vanschneider",
      "klart",
      "trianglify",
      "flatuicolorpicker",
      "color",
      "colorhunt",
      "coolors",
      "flatuicolors",
      "thedayscolor",
      "grabient",
      "webgradients",
      "webkul",
      "cssgradient",
      "uigradients",
      "khroma",
      "xiake",
      "aidhb",
      "v6"
    ]
  },
  {
    "id": "assets",
    "title": "素材资源",
    "icon": "Palette",
    "subs": [
      {
        "id": "平面",
        "label": "平面素材"
      },
      {
        "id": "logo",
        "label": "LOGO 设计"
      },
      {
        "id": "mockup",
        "label": "Mockup"
      },
      {
        "id": "ppt",
        "label": "PPT 资源"
      },
      {
        "id": "icon",
        "label": "图标素材"
      },
      {
        "id": "font",
        "label": "字体资源"
      },
      {
        "id": "photo",
        "label": "摄影图库"
      }
    ],
    "siteIds": [
      "shipin520",
      "kuaipng",
      "stock",
      "sccnn",
      "psefan",
      "lanrentuku",
      "nipic",
      "90sheji",
      "ooopic",
      "588ku",
      "58pic",
      "medialoot",
      "instantlogosearch",
      "worldvectorlogo",
      "iosicongallery",
      "iconsfeed"
    ]
  },
  {
    "id": "ued",
    "title": "UED 团队",
    "icon": "Users",
    "subs": [],
    "siteIds": [
      "isux",
      "eux",
      "yfx",
      "ztjun",
      "jelly",
      "ued",
      "mux",
      "tgideas",
      "cdc",
      "niceui",
      "eicoinc",
      "design"
    ]
  }
];

export type NavSidebarItem = { id: string; name: string; icon: string; children?: string[] };

export const sidebarItems: NavSidebarItem[] = [
  {
    "id": "recommend",
    "name": "常用推荐",
    "icon": "Sparkles"
  },
  {
    "id": "cloud",
    "name": "网盘云储",
    "icon": "Cloud"
  },
  {
    "id": "community",
    "name": "社区资讯",
    "icon": "MessagesSquare",
    "children": [
      "科技资讯",
      "发现产品",
      "影音视听"
    ]
  },
  {
    "id": "books",
    "name": "书籍期刊",
    "icon": "BookOpen"
  },
  {
    "id": "apps",
    "name": "软件游戏",
    "icon": "Gamepad2"
  },
  {
    "id": "demo",
    "name": "用户演示",
    "icon": "FlaskConical"
  },
  {
    "id": "tools",
    "name": "常用工具",
    "icon": "Wrench",
    "children": [
      "在线配色",
      "Chrome 插件",
      "交互动效",
      "图形创意",
      "在线工具",
      "界面设计"
    ]
  },
  {
    "id": "assets",
    "name": "素材资源",
    "icon": "Palette",
    "children": [
      "平面素材",
      "LOGO 设计",
      "Mockup",
      "PPT 资源",
      "Sketch 资源",
      "图标素材",
      "UI 资源",
      "字体资源",
      "摄影图库"
    ]
  },
  {
    "id": "ued",
    "name": "UED 团队",
    "icon": "Users"
  }
];

export type NavPanel = { id: string; title: string; icon: string; tabs: { id: string; label: string }[]; siteIds: string[] };

export const panels: NavPanel[] = [
  {
    "id": "tools",
    "title": "常用工具",
    "icon": "Wrench",
    "tabs": [
      {
        "id": "配色",
        "label": "在线配色"
      },
      {
        "id": "站长",
        "label": "站长工具"
      }
    ],
    "siteIds": [
      "vanschneider",
      "klart",
      "trianglify",
      "flatuicolorpicker",
      "color",
      "colorhunt",
      "coolors",
      "flatuicolors",
      "thedayscolor",
      "grabient",
      "webgradients",
      "webkul",
      "cssgradient",
      "uigradients",
      "khroma",
      "xiake",
      "aidhb",
      "v6"
    ]
  },
  {
    "id": "assets",
    "title": "素材资源",
    "icon": "Palette",
    "tabs": [
      {
        "id": "平面",
        "label": "平面素材"
      },
      {
        "id": "logo",
        "label": "LOGO 设计"
      }
    ],
    "siteIds": [
      "shipin520",
      "kuaipng",
      "stock",
      "sccnn",
      "psefan",
      "lanrentuku",
      "nipic",
      "90sheji",
      "ooopic",
      "588ku",
      "58pic",
      "medialoot",
      "instantlogosearch",
      "worldvectorlogo",
      "iosicongallery",
      "iconsfeed"
    ]
  },
  {
    "id": "community",
    "title": "社区资讯",
    "icon": "MessagesSquare",
    "tabs": [],
    "siteIds": [
      "wpdaxue",
      "chanpin100",
      "lieyunwang",
      "digitaling",
      "36kr",
      "leiphone",
      "ozss",
      "yunge",
      "xuanxiaoer",
      "meta",
      "today",
      "liqi",
      "sspai",
      "producthunt",
      "yydsok"
    ]
  },
  {
    "id": "demo",
    "title": "用户演示",
    "icon": "FlaskConical",
    "tabs": [],
    "siteIds": [
      "aitoolsnav",
      "mznav",
      "6035",
      "jiafangbb",
      "zt123",
      "qinggongju",
      "niba5",
      "wanlb",
      "520dh",
      "urlzj",
      "bokequan",
      "ruii6"
    ]
  },
  {
    "id": "books",
    "title": "书籍期刊",
    "icon": "BookOpen",
    "tabs": [],
    "siteIds": [
      "book",
      "weread",
      "dedao",
      "nlc",
      "kongfz",
      "lifeweek",
      "owspace",
      "fanqienovel",
      "zazhipu",
      "yeeyan"
    ]
  },
  {
    "id": "apps",
    "title": "软件游戏",
    "icon": "Gamepad2",
    "tabs": [],
    "siteIds": [
      "store",
      "apple",
      "apps",
      "iplaysoft",
      "ghxi",
      "coolapk",
      "gamersky",
      "itch",
      "gog",
      "humblebundle"
    ]
  }
];
