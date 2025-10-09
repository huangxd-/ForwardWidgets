// 豆瓣片单组件
WidgetMetadata = {
  id: "douban",
  title: "豆瓣我看&豆瓣个性化推荐",
  modules: [
    {
      title: "豆瓣我看",
      requiresWebView: false,
      functionName: "loadInterestItems",
      cacheDuration: 3600,
      params: [
        {
          name: "user_id",
          title: "用户ID",
          type: "input",
          description: "未填写情况下接口不可用",
        },
        {
          name: "status",
          title: "状态",
          type: "enumeration",
          enumOptions: [
            {
              title: "想看",
              value: "mark",
            },
            {
              title: "在看",
              value: "doing",
            },
            {
              title: "看过",
              value: "done",
            },
            {
              title: "随机想看(从想看列表中无序抽取9个影片)",
              value: "random_mark",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "豆瓣个性化推荐",
      requiresWebView: false,
      functionName: "loadSuggestionItems",
      cacheDuration: 43200,
      params: [
        {
          name: "cookie",
          title: "用户Cookie",
          type: "input",
          description: "未填写情况下非个性化推荐；可手机登陆网页版后，通过loon，Qx等软件抓包获取Cookie",
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          enumOptions: [
            {
              title: "电影",
              value: "movie",
            },
            {
              title: "电视",
              value: "tv",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "豆瓣片单(TMDB版)",
      requiresWebView: false,
      functionName: "loadCardItems",
      cacheDuration: 43200,
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "豆瓣片单地址",
          placeholders: [
            {
              title: "豆瓣热门电影",
              value: "https://m.douban.com/subject_collection/movie_hot_gaia",
            },
            {
              title: "热播新剧",
              value: "https://m.douban.com/subject_collection/tv_hot",
            },
            {
              title: "热播综艺",
              value: "https://m.douban.com/subject_collection/show_hot",
            },
            {
              title: "热播动漫",
              value: "https://m.douban.com/subject_collection/tv_animation",
            },
            {
              title: "影院热映",
              value: "https://m.douban.com/subject_collection/movie_showing",
            },
            {
              title: "实时热门电影",
              value: "https://m.douban.com/subject_collection/movie_real_time_hotest",
            },
            {
              title: "实时热门电视",
              value: "https://m.douban.com/subject_collection/tv_real_time_hotest",
            },
            {
              title: "豆瓣 Top 250",
              value: "https://m.douban.com/subject_collection/movie_top250",
            },
            {
              title: "一周电影口碑榜",
              value: "https://m.douban.com/subject_collection/movie_weekly_best",
            },
            {
              title: "华语口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly",
            },
            {
              title: "全球口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_global_best_weekly",
            },
            {
              title: "国内综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_chinese_best_weekly",
            },
            {
              title: "全球综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_global_best_weekly",
            },
            {
              title: "第97届奥斯卡",
              value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank",
            },
            {
              title: "IMDB MOVIE TOP 250",
              value: "https://m.douban.com/doulist/1518184",
            },
            {
              title: "IMDB TV TOP 250",
              value: "https://m.douban.com/doulist/41573512",
            },
            {
              title: "意外结局电影",
              value: "https://m.douban.com/doulist/11324",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "电影推荐(TMDB版)",
      requiresWebView: false,
      functionName: "loadRecommendMovies",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "全部",
              value: "all",
            },
            {
              title: "热门电影",
              value: "热门",
            },
            {
              title: "最新电影",
              value: "最新",
            },
            {
              title: "豆瓣高分",
              value: "豆瓣高分",
            },
            {
              title: "冷门佳片",
              value: "冷门佳片",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["热门", "最新", "豆瓣高分", "冷门佳片"],
          },
          enumOptions: [
            {
              title: "全部",
              value: "全部",
            },
            {
              title: "华语",
              value: "华语",
            },
            {
              title: "欧美",
              value: "欧美",
            },
            {
              title: "韩国",
              value: "韩国",
            },
            {
              title: "日本",
              value: "日本",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "剧集推荐(TMDB版)",
      requiresWebView: false,
      functionName: "loadRecommendShows",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "全部",
              value: "all",
            },
            {
              title: "热门剧集",
              value: "tv",
            },
            {
              title: "热门综艺",
              value: "show",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["tv"],
          },
          enumOptions: [
            {
              title: "综合",
              value: "tv",
            },
            {
              title: "国产剧",
              value: "tv_domestic",
            },
            {
              title: "欧美剧",
              value: "tv_american",
            },
            {
              title: "日剧",
              value: "tv_japanese",
            },
            {
              title: "韩剧",
              value: "tv_korean",
            },
            {
              title: "动画",
              value: "tv_animation",
            },
            {
              title: "纪录片",
              value: "tv_documentary",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["show"],
          },
          enumOptions: [
            {
              title: "综合",
              value: "show",
            },
            {
              title: "国内",
              value: "show_domestic",
            },
            {
              title: "国外",
              value: "show_foreign",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "观影偏好(TMDB版)",
      description: "根据个人偏好推荐影视作品",
      requiresWebView: false,
      functionName: "getPreferenceRecommendations",
      cacheDuration: 86400,
      params: [
        {
          name: "mediaType",
          title: "类别",
          type: "enumeration",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" },
          ]
        },
        {
          name: "movieGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["movie"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "动作", value: "动作" },
            { title: "科幻", value: "科幻" },
            { title: "动画", value: "动画" },
            { title: "悬疑", value: "悬疑" },
            { title: "犯罪", value: "犯罪" },
            { title: "音乐", value: "音乐" },
            { title: "历史", value: "历史" },
            { title: "奇幻", value: "奇幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "战争", value: "战争" },
            { title: "西部", value: "西部" },
            { title: "歌舞", value: "歌舞" },
            { title: "传记", value: "传记" },
            { title: "武侠", value: "武侠" },
            { title: "纪录片", value: "纪录片" },
            { title: "短片", value: "短片" },
          ]
        },
        {
          name: "tvModus",
          title: "形式",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["tv"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "电视剧", value: "电视剧" },
            { title: "综艺", value: "综艺" },
          ]
        },
        {
          name: "tvGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "tvModus",
            value: ["电视剧"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "悬疑", value: "悬疑" },
            { title: "动画", value: "动画" },
            { title: "武侠", value: "武侠" },
            { title: "古装", value: "古装" },
            { title: "家庭", value: "家庭" },
            { title: "犯罪", value: "犯罪" },
            { title: "科幻", value: "科幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "历史", value: "历史" },
            { title: "战争", value: "战争" },
            { title: "动作", value: "动作" },
            { title: "冒险", value: "冒险" },
            { title: "传记", value: "传记" },
            { title: "剧情", value: "剧情" },
            { title: "奇幻", value: "奇幻" },
            { title: "惊悚", value: "惊悚" },
            { title: "灾难", value: "灾难" },
            { title: "歌舞", value: "歌舞" },
            { title: "音乐", value: "音乐" },
          ]
        },
        {
          name: "zyGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "tvModus",
            value: ["综艺"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "真人秀", value: "真人秀" },
            { title: "脱口秀", value: "脱口秀" },
            { title: "音乐", value: "音乐" },
            { title: "歌舞", value: "歌舞" },
          ]
        },
        {
          name: "region",
          title: "地区",
          type: "enumeration",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "华语", value: "华语" },
            { title: "欧美", value: "欧美" },
            { title: "韩国", value: "韩国" },
            { title: "日本", value: "日本" },
            { title: "中国大陆", value: "中国大陆" },
            { title: "中国香港", value: "中国香港" },
            { title: "中国台湾", value: "中国台湾" },
            { title: "美国", value: "美国" },
            { title: "英国", value: "英国" },
            { title: "法国", value: "法国" },
            { title: "德国", value: "德国" },
            { title: "意大利", value: "意大利" },
            { title: "西班牙", value: "西班牙" },
            { title: "印度", value: "印度" },
            { title: "泰国", value: "泰国" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020年代", value: "2020年代" },
            { title: "2010年代", value: "2010年代" },
            { title: "2000年代", value: "2000年代" },
            { title: "90年代", value: "90年代" },
            { title: "80年代", value: "80年代" },
            { title: "70年代", value: "70年代" },
            { title: "60年代", value: "60年代" },
            { title: "更早", value: "更早" },
          ]
        },
        {
          name: "platform",
          title: "平台",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["tv"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "腾讯视频", value: "腾讯视频" },
            { title: "爱奇艺", value: "爱奇艺" },
            { title: "优酷", value: "优酷" },
            { title: "湖南卫视", value: "湖南卫视" },
            { title: "Netflix", value: "Netflix" },
            { title: "HBO", value: "HBO" },
            { title: "BBC", value: "BBC" },
            { title: "NHK", value: "NHK" },
            { title: "CBS", value: "CBS" },
            { title: "NBC", value: "NBC" },
            { title: "tvN", value: "tvN" },
          ],
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "综合排序", value: "T" },
            { title: "近期热度", value: "U" },
            { title: "首映时间", value: "R" },
            { title: "高分优选", value: "S" }
          ]
        },
        {
          name: "tags",
          title: "自定义标签",
          type: "input",
          description: "设置自定义标签，例如：丧尸,推理",
          value: "",
          placeholders: [
            {
              title: "空",
              value: "",
            },
            {
              title: "推理,悬疑",
              value: "推理,悬疑",
            },
            {
              title: "cult",
              value: "cult",
            },
            {
              title: "经典",
              value: "经典",
            },
            {
              title: "动作",
              value: "动作",
            },
            {
              title: "喜剧",
              value: "喜剧",
            },
            {
              title: "惊悚",
              value: "惊悚",
            },
            {
              title: "穿越",
              value: "穿越",
            },
            {
              title: "儿童",
              value: "儿童",
            },
            {
              title: "战争",
              value: "战争",
            },
          ]
        },
        {
          name: "rating",
          title: "评分",
          type: "input",
          description: "设置最低评分过滤，例如：6",
          placeholders: [
            {
              title: "0",
              value: "0",
            },
            {
              title: "1",
              value: "1",
            },
            {
              title: "2",
              value: "2",
            },
            {
              title: "3",
              value: "3",
            },
            {
              title: "4",
              value: "4",
            },
            {
              title: "5",
              value: "5",
            },
            {
              title: "6",
              value: "6",
            },
            {
              title: "7",
              value: "7",
            },
            {
              title: "8",
              value: "8",
            },
            {
              title: "9",
              value: "9",
            },
          ]
        },
        {
          name: "offset",
          title: "起始位置",
          type: "offset"
        }
      ]
    },
    {
      title: "豆瓣影人作品",
      requiresWebView: false,
      functionName: "loadActorItems",
      cacheDuration: 604800,
      params: [
        {
          name: "input_type",
          title: "输入类型",
          type: "enumeration",
          value: "select",
          enumOptions: [
            { title: "筛选", value: "select" },
            { title: "自定义", value: "customize" },
          ],
        },
        {
          name: "name_type",
          title: "影人类型",
          type: "enumeration",
          value: "cn_actor",
          belongTo: {
            paramName: "input_type",
            value: ["select"],
          },
          enumOptions: [
            { title: "国内男演员", value: "cn_actor" },
            { title: "国内女演员", value: "cn_actress" },
            { title: "港台男演员", value: "ht_actor" },
            { title: "港台女演员", value: "ht_actress" },
            { title: "日韩男演员", value: "jk_actor" },
            { title: "日韩女演员", value: "jk_actress" },
            { title: "欧美男演员", value: "ea_actor" },
            { title: "欧美女演员", value: "ea_actress" },
            { title: "国内导演", value: "cn_director" },
            { title: "国外导演", value: "fr_director" },
          ],
        },
        {
          name: "cn_actor_select",
          title: "筛选国内男演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["cn_actor"],
          },
          enumOptions: [
            {"title":"黄渤","value":"黄渤"}, {"title":"徐峥","value":"徐峥"}, {"title":"王宝强","value":"王宝强"},
            {"title":"吴京","value":"吴京"}, {"title":"张译","value":"张译"}, {"title":"沈腾","value":"沈腾"},
            {"title":"葛优","value":"葛优"}, {"title":"邓超","value":"邓超"}, {"title":"陈道明","value":"陈道明"},
            {"title":"张国立","value":"张国立"}, {"title":"姜文","value":"姜文"}, {"title":"孙红雷","value":"孙红雷"},
            {"title":"黄晓明","value":"黄晓明"}, {"title":"陈坤","value":"陈坤"}, {"title":"胡歌","value":"胡歌"},
            {"title":"张涵予","value":"张涵予"}, {"title":"刘烨","value":"刘烨"}, {"title":"吴秀波","value":"吴秀波"},
            {"title":"李晨","value":"李晨"}, {"title":"冯绍峰","value":"冯绍峰"}, {"title":"黄轩","value":"黄轩"},
            {"title":"段奕宏","value":"段奕宏"}, {"title":"王凯","value":"王凯"}, {"title":"雷佳音","value":"雷佳音"},
            {"title":"杨洋","value":"杨洋"}, {"title":"肖战","value":"肖战"}, {"title":"王一博","value":"王一博"},
            {"title":"易烊千玺","value":"易烊千玺"}, {"title":"朱一龙","value":"朱一龙"}, {"title":"张若昀","value":"张若昀"},
            {"title":"李现","value":"李现"}, {"title":"任嘉伦","value":"任嘉伦"}, {"title":"靳东","value":"靳东"},
            {"title":"廖凡","value":"廖凡"}, {"title":"潘粤明","value":"潘粤明"}, {"title":"马天宇","value":"马天宇"},
            {"title":"林更新","value":"林更新"}, {"title":"佟大为","value":"佟大为"}, {"title":"陈赫","value":"陈赫"},
            {"title":"杜淳","value":"杜淳"}, {"title":"冯远征","value":"冯远征"}, {"title":"王志文","value":"王志文"},
            {"title":"李保田","value":"李保田"}, {"title":"陈宝国","value":"陈宝国"}, {"title":"张丰毅","value":"张丰毅"},
            {"title":"朱亚文","value":"朱亚文"}, {"title":"陈晓","value":"陈晓"}, {"title":"于和伟","value":"于和伟"},
            {"title":"张嘉译","value":"张嘉译"}, {"title":"王学圻","value":"王学圻"}, {"title":"濮存昕","value":"濮存昕"}
          ],
        },
        {
          name: "cn_actress_select",
          title: "筛选国内女演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["cn_actress"],
          },
          enumOptions: [
            {"title":"巩俐","value":"巩俐"}, {"title":"章子怡","value":"章子怡"}, {"title":"周迅","value":"周迅"},
            {"title":"范冰冰","value":"范冰冰"}, {"title":"李冰冰","value":"李冰冰"}, {"title":"赵薇","value":"赵薇"},
            {"title":"汤唯","value":"汤唯"}, {"title":"刘亦菲","value":"刘亦菲"}, {"title":"杨幂","value":"杨幂"},
            {"title":"杨颖","value":"杨颖"}, {"title":"倪妮","value":"倪妮"}, {"title":"舒淇","value":"舒淇"},
            {"title":"孙俪","value":"孙俪"}, {"title":"姚晨","value":"姚晨"}, {"title":"高圆圆","value":"高圆圆"},
            {"title":"刘涛","value":"刘涛"}, {"title":"马伊琍","value":"马伊琍"}, {"title":"宋佳","value":"宋佳"},
            {"title":"蒋雯丽","value":"蒋雯丽"}, {"title":"徐静蕾","value":"徐静蕾"}, {"title":"闫妮","value":"闫妮"},
            {"title":"海清","value":"海清"}, {"title":"袁泉","value":"袁泉"}, {"title":"周冬雨","value":"周冬雨"},
            {"title":"马思纯","value":"马思纯"}, {"title":"赵丽颖","value":"赵丽颖"}, {"title":"杨紫","value":"杨紫"},
            {"title":"迪丽热巴","value":"迪丽热巴"}, {"title":"谭松韵","value":"谭松韵"}, {"title":"佟丽娅","value":"佟丽娅"},
            {"title":"江疏影","value":"江疏影"}, {"title":"刘诗诗","value":"刘诗诗"}, {"title":"白百何","value":"白百何"},
            {"title":"梅婷","value":"梅婷"}, {"title":"张静初","value":"张静初"}, {"title":"陈数","value":"陈数"},
            {"title":"殷桃","value":"殷桃"}, {"title":"王丽坤","value":"王丽坤"}, {"title":"李小冉","value":"李小冉"},
            {"title":"秦海璐","value":"秦海璐"}, {"title":"童蕾","value":"童蕾"}, {"title":"颜丙燕","value":"颜丙燕"},
            {"title":"俞飞鸿","value":"俞飞鸿"}, {"title":"曾黎","value":"曾黎"}, {"title":"张子枫","value":"张子枫"},
            {"title":"关晓彤","value":"关晓彤"}, {"title":"李沁","value":"李沁"}, {"title":"张天爱","value":"张天爱"},
            {"title":"宋茜","value":"宋茜"}, {"title":"古力娜扎","value":"古力娜扎"}, {"title":"王鸥","value":"王鸥"}
          ],
        },
        {
          name: "ht_actor_select",
          title: "筛选港台男演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["ht_actor"],
          },
          enumOptions: [
            {"title":"周润发","value":"周润发"}, {"title":"梁朝伟","value":"梁朝伟"}, {"title":"刘德华","value":"刘德华"},
            {"title":"成龙","value":"成龙"}, {"title":"李连杰","value":"李连杰"}, {"title":"张家辉","value":"张家辉"},
            {"title":"古天乐","value":"古天乐"}, {"title":"甄子丹","value":"甄子丹"}, {"title":"刘青云","value":"刘青云"},
            {"title":"任达华","value":"任达华"}, {"title":"吴镇宇","value":"吴镇宇"}, {"title":"黄秋生","value":"黄秋生"},
            {"title":"林家栋","value":"林家栋"}, {"title":"余文乐","value":"余文乐"}, {"title":"谢霆锋","value":"谢霆锋"},
            {"title":"郭富城","value":"郭富城"}, {"title":"曾志伟","value":"曾志伟"}, {"title":"吕良伟","value":"吕良伟"},
            {"title":"林保怡","value":"林保怡"}, {"title":"欧阳震华","value":"欧阳震华"}, {"title":"张卫健","value":"张卫健"},
            {"title":"周杰伦","value":"周杰伦"}, {"title":"金城武","value":"金城武"}, {"title":"阮经天","value":"阮经天"},
            {"title":"彭于晏","value":"彭于晏"}, {"title":"霍建华","value":"霍建华"}, {"title":"钟汉良","value":"钟汉良"},
            {"title":"陈柏霖","value":"陈柏霖"}, {"title":"王大陆","value":"王大陆"}, {"title":"柯震东","value":"柯震东"},
            {"title":"吴慷仁","value":"吴慷仁"}, {"title":"蓝正龙","value":"蓝正龙"}, {"title":"张孝全","value":"张孝全"},
            {"title":"凤小岳","value":"凤小岳"}, {"title":"刘冠廷","value":"刘冠廷"}, {"title":"郑人硕","value":"郑人硕"},
            {"title":"林哲熹","value":"林哲熹"}, {"title":"许光汉","value":"许光汉"}, {"title":"邱泽","value":"邱泽"},
            {"title":"明道","value":"明道"}, {"title":"贺军翔","value":"贺军翔"}, {"title":"周渝民","value":"周渝民"},
            {"title":"言承旭","value":"言承旭"}, {"title":"汪东城","value":"汪东城"}, {"title":"陈奕迅","value":"陈奕迅"},
            {"title":"张震","value":"张震"}, {"title":"王力宏","value":"王力宏"}, {"title":"林志颖","value":"林志颖"},
            {"title":"苏有朋","value":"苏有朋"}, {"title":"吴彦祖","value":"吴彦祖"}
          ],
        },
        {
          name: "ht_actress_select",
          title: "筛选港台女演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["ht_actress"],
          },
          enumOptions: [
            {"title":"张曼玉","value":"张曼玉"}, {"title":"林青霞","value":"林青霞"}, {"title":"钟楚红","value":"钟楚红"},
            {"title":"梅艳芳","value":"梅艳芳"}, {"title":"王祖贤","value":"王祖贤"}, {"title":"杨采妮","value":"杨采妮"},
            {"title":"张艾嘉","value":"张艾嘉"}, {"title":"舒淇","value":"舒淇"}, {"title":"郑秀文","value":"郑秀文"},
            {"title":"杨千嬅","value":"杨千嬅"}, {"title":"蔡卓妍","value":"蔡卓妍"}, {"title":"钟欣潼","value":"钟欣潼"},
            {"title":"吴君如","value":"吴君如"}, {"title":"莫文蔚","value":"莫文蔚"}, {"title":"李若彤","value":"李若彤"},
            {"title":"朱茵","value":"朱茵"}, {"title":"佘诗曼","value":"佘诗曼"}, {"title":"宣萱","value":"宣萱"},
            {"title":"陈慧琳","value":"陈慧琳"}, {"title":"林依晨","value":"林依晨"}, {"title":"陈乔恩","value":"陈乔恩"},
            {"title":"杨丞琳","value":"杨丞琳"}, {"title":"张钧甯","value":"张钧甯"}, {"title":"桂纶镁","value":"桂纶镁"},
            {"title":"徐若瑄","value":"徐若瑄"}, {"title":"谢欣颖","value":"谢欣颖"}, {"title":"柯佳嬿","value":"柯佳嬿"},
            {"title":"陈意涵","value":"陈意涵"}, {"title":"白歆惠","value":"白歆惠"}, {"title":"简嫚书","value":"简嫚书"},
            {"title":"曾之乔","value":"曾之乔"}, {"title":"郭采洁","value":"郭采洁"}, {"title":"夏于乔","value":"夏于乔"},
            {"title":"安心亚","value":"安心亚"}, {"title":"赖雅妍","value":"赖雅妍"}, {"title":"许玮甯","value":"许玮甯"},
            {"title":"谢盈萱","value":"谢盈萱"}, {"title":"严艺文","value":"严艺文"}, {"title":"王净","value":"王净"},
            {"title":"陈妍希","value":"陈妍希"}, {"title":"张榕容","value":"张榕容"}, {"title":"林心如","value":"林心如"},
            {"title":"安以轩","value":"安以轩"}, {"title":"徐熙媛","value":"徐熙媛"}, {"title":"邓丽欣","value":"邓丽欣"},
            {"title":"胡杏儿","value":"胡杏儿"}, {"title":"叶璇","value":"叶璇"}, {"title":"温碧霞","value":"温碧霞"},
            {"title":"赵雅芝","value":"赵雅芝"}, {"title":"米雪","value":"米雪"}
          ],
        },
        {
          name: "jk_actor_select",
          title: "筛选日韩男演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["jk_actor"],
          },
          enumOptions: [
            {"title":"木村拓哉","value":"木村拓哉"}, {"title":"山田孝之","value":"山田孝之"}, {"title":"福山雅治","value":"福山雅治"},
            {"title":"李敏镐","value":"李敏镐"}, {"title":"宋仲基","value":"宋仲基"}, {"title":"孔刘","value":"孔刘"},
            {"title":"佐藤健","value":"佐藤健"}, {"title":"菅田将晖","value":"菅田将晖"}, {"title":"冈田准一","value":"岡田准一"},
            {"title":"朴叙俊","value":"朴叙俊"}, {"title":"李钟硕","value":"李钟硕"}, {"title":"金秀贤","value":"金秀贤"},
            {"title":"小栗旬","value":"小栗旬"}, {"title":"松坂桃李","value":"松坂桃李"}, {"title":"中村伦也","value":"中村倫也"},
            {"title":"姜栋元","value":"姜栋元"}, {"title":"李秉宪","value":"李秉宪"}, {"title":"池昌旭","value":"池昌旭"},
            {"title":"生田斗真","value":"生田斗真"}, {"title":"高桥一生","value":"高橋一生"}, {"title":"绫野刚","value":"綾野剛"},
            {"title":"宋康","value":"宋康"}, {"title":"车银优","value":"车银优"}, {"title":"南柱赫","value":"南柱赫"},
            {"title":"山崎贤人","value":"山崎賢人"}, {"title":"吉泽亮","value":"吉沢亮"}, {"title":"竹内凉真","value":"竹内涼真"},
            {"title":"玄彬","value":"玄彬"}, {"title":"李栋旭","value":"李栋旭"}, {"title":"丁海寅","value":"丁海寅"},
            {"title":"妻夫木聪","value":"妻夫木聡"}, {"title":"洼田正孝","value":"窪田正孝"}, {"title":"田中圭","value":"田中圭"},
            {"title":"朴海镇","value":"朴海镇"}, {"title":"金汎","value":"金汎"}, {"title":"安孝燮","value":"安孝燮"},
            {"title":"三浦春马","value":"三浦春馬"}, {"title":"志尊淳","value":"志尊淳"}, {"title":"町田启太","value":"町田啓太"},
            {"title":"刘亚仁","value":"刘亚仁"}, {"title":"金永光","value":"金永光"}, {"title":"李俊昊","value":"李俊昊"},
            {"title":"长谷川博己","value":"長谷川博己"}, {"title":"坂口健太郎","value":"坂口健太郎"}, {"title":"中川大志","value":"中川大志"},
            {"title":"崔岷植","value":"崔岷植"}, {"title":"宋承宪","value":"宋承宪"}, {"title":"金南佶","value":"金南佶"},
            {"title":"渡边谦","value":"渡辺謙"}, {"title":"染谷将太","value":"染谷将太"}
          ],
        },
        {
          name: "jk_actress_select",
          title: "筛选日韩女演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["jk_actress"],
          },
          enumOptions: [
            {"title":"长泽雅美","value":"长泽雅美"}, {"title":"新垣结衣","value":"新垣结衣"}, {"title":"石原里美","value":"石原里美"},
            {"title":"全智贤","value":"全智贤"}, {"title":"宋慧乔","value":"宋慧乔"}, {"title":"韩孝周","value":"韩孝周"},
            {"title":"绫濑遥","value":"绫濑遥"}, {"title":"深田恭子","value":"深田恭子"}, {"title":"户田惠梨香","value":"户田惠梨香"},
            {"title":"朴信惠","value":"朴信惠"}, {"title":"金泰希","value":"金泰希"}, {"title":"李英爱","value":"李英爱"},
            {"title":"有村架纯","value":"有村架纯"}, {"title":"桥本环奈","value":"桥本环奈"}, {"title":"广濑铃","value":"广濑铃"},
            {"title":"李知恩","value":"李知恩"}, {"title":"裴秀智","value":"裴秀智"}, {"title":"申敏儿","value":"申敏儿"},
            {"title":"北川景子","value":"北川景子"}, {"title":"吉高由里子","value":"吉高由里子"}, {"title":"永野芽郁","value":"永野芽郁"},
            {"title":"林允儿","value":"林允儿"}, {"title":"徐睿知","value":"徐睿知"}, {"title":"金所泫","value":"金所泫"},
            {"title":"满岛光","value":"满岛光"}, {"title":"黑木华","value":"黑木华"}, {"title":"清野菜名","value":"清野菜名"},
            {"title":"孙艺珍","value":"孙艺珍"}, {"title":"孔孝真","value":"孔孝真"}, {"title":"金高银","value":"金高银"},
            {"title":"上白石萌音","value":"上白石萌音"}, {"title":"波瑠","value":"波瑠"}, {"title":"多部未华子","value":"多部未华子"},
            {"title":"韩智敏","value":"韩智敏"}, {"title":"朴宝英","value":"朴宝英"}, {"title":"金智媛","value":"金智媛"},
            {"title":"松隆子","value":"松隆子"}, {"title":"安藤樱","value":"安藤樱"}, {"title":"二阶堂富美","value":"二阶堂富美"},
            {"title":"文彩元","value":"文彩元"}, {"title":"李圣经","value":"李圣经"}, {"title":"高雅拉","value":"高雅拉"},
            {"title":"小松菜奈","value":"小松菜奈"}, {"title":"土屋太凤","value":"土屋太凤"}, {"title":"滨边美波","value":"滨边美波"},
            {"title":"姜受延","value":"姜受延"}, {"title":"金惠秀","value":"金惠秀"}, {"title":"罗美兰","value":"罗美兰"},
            {"title":"高畑充希","value":"高畑充希"}, {"title":"森七菜","value":"森七菜"}
          ],
        },
        {
          name: "ea_actor_select",
          title: "筛选欧美男演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["ea_actor"],
          },
          enumOptions: [
            {"title":"莱昂纳多·迪卡普里奥","value":"莱昂纳多·迪卡普里奥"}, {"title":"布拉德·皮特","value":"布拉德·皮特"}, {"title":"汤姆·汉克斯","value":"汤姆·汉克斯"},
            {"title":"罗伯特·德尼罗","value":"罗伯特·德尼罗"}, {"title":"丹泽尔·华盛顿","value":"丹泽尔·华盛顿"}, {"title":"约翰尼·德普","value":"约翰尼·德普"},
            {"title":"休·杰克曼","value":"休·杰克曼"}, {"title":"克里斯蒂安·贝尔","value":"克里斯蒂安·贝尔"}, {"title":"克里斯·海姆斯沃斯","value":"克里斯·海姆斯沃斯"},
            {"title":"马特·达蒙","value":"马特·达蒙"}, {"title":"瑞安·高斯林","value":"瑞安·高斯林"}, {"title":"杰克·吉伦哈尔","value":"杰克·吉伦哈尔"},
            {"title":"汤姆·哈迪","value":"汤姆·哈迪"}, {"title":"基努·里维斯","value":"基努·里维斯"}, {"title":"威尔·史密斯","value":"威尔·史密斯"},
            {"title":"乔治·克鲁尼","value":"乔治·克鲁尼"}, {"title":"本·阿弗莱克","value":"本·阿弗莱克"}, {"title":"马克·沃尔伯格","value":"马克·沃尔伯格"},
            {"title":"丹尼尔·戴-刘易斯","value":"丹尼尔·戴-刘易斯"}, {"title":"安东尼·霍普金斯","value":"安东尼·霍普金斯"}, {"title":"加里·奥德曼","value":"加里·奥德曼"},
            {"title":"克里斯·埃文斯","value":"克里斯·埃文斯"}, {"title":"罗伯特·唐尼","value":"罗伯特·唐尼"}, {"title":"马克·鲁法洛","value":"马克·鲁法洛"},
            {"title":"詹姆斯·麦卡沃伊","value":"詹姆斯·麦卡沃伊"}, {"title":"迈克尔·法斯宾德","value":"迈克尔·法斯宾德"}, {"title":"蒂莫西·柴勒梅德","value":"蒂莫西·柴勒梅德"},
            {"title":"汤姆·霍兰德","value":"汤姆·霍兰德"}, {"title":"扎克·埃夫隆","value":"扎克·埃夫隆"}, {"title":"瑞安·雷诺兹","value":"瑞安·雷诺兹"},
            {"title":"布兰登·弗雷泽","value":"布兰登·弗雷泽"}, {"title":"科林·法瑞尔","value":"科林·法瑞尔"}, {"title":"伊万·麦克格雷格","value":"伊万·麦克格雷格"},
            {"title":"休·格兰特","value":"休·格兰特"}, {"title":"裘德·洛","value":"裘德·洛"}, {"title":"马修·麦康纳","value":"马修·麦康纳"},
            {"title":"杰瑞德·莱托","value":"杰瑞德·莱托"}, {"title":"西蒙·佩吉","value":"西蒙·佩吉"}, {"title":"本尼迪克特·康伯巴奇","value":"本尼迪克特·康伯巴奇"},
            {"title":"艾迪·雷德梅恩","value":"艾迪·雷德梅恩"}, {"title":"查宁·塔图姆","value":"查宁·塔图姆"}, {"title":"克里斯·派恩","value":"克里斯·派恩"},
            {"title":"利亚姆·尼森","value":"利亚姆·尼森"}, {"title":"布莱德利·库珀","value":"布莱德利·库珀"}, {"title":"乔纳·希尔","value":"乔纳·希尔"},
            {"title":"威尔·法瑞尔","value":"威尔·法瑞尔"}, {"title":"保罗·路德","value":"保罗·路德"}, {"title":"詹姆斯·弗兰科","value":"詹姆斯·弗兰科"},
            {"title":"安塞尔·埃尔戈特","value":"安塞尔·埃尔戈特"}, {"title":"乔什·布洛林","value":"乔什·布洛林"}
          ],
        },
        {
          name: "ea_actress_select",
          title: "筛选欧美女演员",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["ea_actress"],
          },
          enumOptions: [
            {"title":"梅丽尔·斯特里普","value":"梅丽尔·斯特里普"}, {"title":"凯特·布兰切特","value":"凯特·布兰切特"}, {"title":"安吉丽娜·朱莉","value":"安吉丽娜·朱莉"},
            {"title":"娜塔莉·波特曼","value":"娜塔莉·波特曼"}, {"title":"斯嘉丽·约翰逊","value":"斯嘉丽·约翰逊"}, {"title":"詹妮弗·劳伦斯","value":"詹妮弗·劳伦斯"},
            {"title":"艾玛·斯通","value":"艾玛·斯通"}, {"title":"安妮·海瑟薇","value":"安妮·海瑟薇"}, {"title":"艾米·亚当斯","value":"艾米·亚当斯"},
            {"title":"朱莉娅·罗伯茨","value":"朱莉娅·罗伯茨"}, {"title":"桑德拉·布洛克","value":"桑德拉·布洛克"}, {"title":"凯拉·奈特莉","value":"凯拉·奈特莉"},
            {"title":"杰西卡·查斯坦","value":"杰西卡·查斯坦"}, {"title":"玛格特·罗比","value":"玛格特·罗比"}, {"title":"查理兹·塞隆","value":"查理兹·塞隆"},
            {"title":"瑞茜·威瑟斯彭","value":"瑞茜·威瑟斯彭"}, {"title":"妮可·基德曼","value":"妮可·基德曼"}, {"title":"凯特·温斯莱特","value":"凯特·温斯莱特"},
            {"title":"朱迪·丹奇","value":"朱迪·丹奇"}, {"title":"海伦·米伦","value":"海伦·米伦"}, {"title":"弗兰西丝·麦克多蒙德","value":"弗兰西丝·麦克多蒙德"},
            {"title":"艾玛·沃特森","value":"艾玛·沃特森"}, {"title":"西尔莎·罗南","value":"西尔莎·罗南"}, {"title":"赞达亚","value":"赞达亚"},
            {"title":"艾米莉·布朗特","value":"艾米莉·布朗特"}, {"title":"罗莎蒙德·派克","value":"罗莎蒙德·派克"}, {"title":"奥利维娅·科尔曼","value":"奥利维娅·科尔曼"},
            {"title":"格温妮斯·帕特洛","value":"格温妮斯·帕特洛"}, {"title":"米歇尔·威廉姆斯","value":"米歇尔·威廉姆斯"}, {"title":"克里斯汀·斯图尔特","value":"克里斯汀·斯图尔特"},
            {"title":"布丽·拉尔森","value":"布丽·拉尔森"}, {"title":"蕾切尔·麦克亚当斯","value":"蕾切尔·麦克亚当斯"}, {"title":"艾丽西亚·维坎德","value":"艾丽西亚·维坎德"},
            {"title":"凯莉·穆里根","value":"凯莉·穆里根"}, {"title":"维奥拉·戴维斯","value":"维奥拉·戴维斯"}, {"title":"奥克塔维娅·斯宾瑟","value":"奥克塔维娅·斯宾瑟"},
            {"title":"黛安·基顿","value":"黛安·基顿"}, {"title":"苏珊·萨兰登","value":"苏珊·萨兰登"}, {"title":"梅丽莎·麦卡西","value":"梅丽莎·麦卡西"},
            {"title":"蒂尔达·斯文顿","value":"蒂尔达·斯文顿"}, {"title":"劳拉·邓恩","value":"劳拉·邓恩"}, {"title":"蕾妮·齐薇格","value":"蕾妮·齐薇格"},
            {"title":"安娜·肯德里克","value":"安娜·肯德里克"}, {"title":"珍妮弗·康纳利","value":"珍妮弗·康纳利"}, {"title":"克莱尔·芙伊","value":"克莱尔·芙伊"},
            {"title":"艾米丽·莫迪默","value":"艾米丽·莫迪默"}, {"title":"凯瑟琳·泽塔-琼斯","value":"凯瑟琳·泽塔-琼斯"}, {"title":"伊丽莎白·班克斯","value":"伊丽莎白·班克斯"},
            {"title":"弗洛伦丝·皮尤","value":"弗洛伦丝·皮尤"}, {"title":"玛丽昂·歌迪亚","value":"玛丽昂·歌迪亚"}
          ],
        },
        {
          name: "cn_director_select",
          title: "筛选国内导演",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["cn_director"],
          },
          enumOptions: [
            {"title":"张艺谋","value":"张艺谋"}, {"title":"陈凯歌","value":"陈凯歌"}, {"title":"冯小刚","value":"冯小刚"},
            {"title":"王家卫","value":"王家卫"}, {"title":"李安","value":"李安"}, {"title":"姜文","value":"姜文"},
            {"title":"徐克","value":"徐克"}, {"title":"吴宇森","value":"吴宇森"}, {"title":"杜琪峰","value":"杜琪峰"},
            {"title":"周星驰","value":"周星驰"}, {"title":"宁浩","value":"宁浩"}, {"title":"陈思诚","value":"陈思诚"},
            {"title":"贾樟柯","value":"贾樟柯"}, {"title":"侯孝贤","value":"侯孝贤"}, {"title":"杨德昌","value":"杨德昌"},
            {"title":"许鞍华","value":"许鞍华"}, {"title":"谢晋","value":"谢晋"}, {"title":"张一白","value":"张一白"},
            {"title":"管虎","value":"管虎"}, {"title":"陆川","value":"陆川"}, {"title":"韩寒","value":"韩寒"},
            {"title":"徐峥","value":"徐峥"}, {"title":"陈可辛","value":"陈可辛"}, {"title":"林超贤","value":"林超贤"},
            {"title":"乌尔善","value":"乌尔善"}, {"title":"郭帆","value":"郭帆"}, {"title":"路阳","value":"路阳"},
            {"title":"饺子","value":"饺子"}, {"title":"田晓鹏","value":"田晓鹏"}, {"title":"王晶","value":"王晶"},
            {"title":"郑保瑞","value":"郑保瑞"}, {"title":"刘伟强","value":"刘伟强"}, {"title":"唐季礼","value":"唐季礼"},
            {"title":"闫非","value":"闫非"}, {"title":"彭大魔","value":"彭大魔"}, {"title":"曹保平","value":"曹保平"},
            {"title":"尔冬升","value":"尔冬升"}, {"title":"韩延","value":"韩延"}, {"title":"大鹏","value":"大鹏"},
            {"title":"薛晓路","value":"薛晓路"}, {"title":"郭子健","value":"郭子健"}, {"title":"丁晟","value":"丁晟"},
            {"title":"陈正道","value":"陈正道"}, {"title":"彭浩翔","value":"彭浩翔"}, {"title":"高群书","value":"高群书"},
            {"title":"刘若英","value":"刘若英"}, {"title":"李芳芳","value":"李芳芳"}, {"title":"陈嘉上","value":"陈嘉上"},
            {"title":"苏伦","value":"苏伦"}, {"title":"顾长卫","value":"顾长卫"}
          ],
        },
        {
          name: "fr_director_select",
          title: "筛选国外导演",
          type: "enumeration",
          belongTo: {
            paramName: "name_type",
            value: ["fr_director"],
          },
          enumOptions: [
            {"title":"斯蒂文·斯皮尔伯格","value":"斯蒂文·斯皮尔伯格"}, {"title":"马丁·斯科塞斯","value":"马丁·斯科塞斯"}, {"title":"克里斯托弗·诺兰","value":"克里斯托弗·诺兰"},
            {"title":"昆汀·塔伦蒂诺","value":"昆汀·塔伦蒂诺"}, {"title":"詹姆斯·卡梅隆","value":"詹姆斯·卡梅隆"}, {"title":"伍迪·艾伦","value":"伍迪·艾伦"},
            {"title":"大卫·芬奇","value":"大卫·芬奇"}, {"title":"蒂姆·伯顿","value":"蒂姆·伯顿"}, {"title":"雷德利·斯科特","value":"雷德利·斯科特"},
            {"title":"阿尔弗雷德·希区柯克","value":"阿尔弗雷德·希区柯克"}, {"title":"斯坦利·库布里克","value":"斯坦利·库布里克"}, {"title":"弗朗西斯·福特·科波拉","value":"弗朗西斯·福特·科波拉"},
            {"title":"黑泽明","value":"黑泽明"}, {"title":"小津安二郎","value":"小津安二郎"}, {"title":"是枝裕和","value":"是枝裕和"},
            {"title":"奉俊昊","value":"奉俊昊"}, {"title":"朴赞郁","value":"朴赞郁"}, {"title":"李沧东","value":"李沧东"},
            {"title":"奥逊·威尔斯","value":"奥逊·威尔斯"}, {"title":"乔治·卢卡斯","value":"乔治·卢卡斯"}, {"title":"盖·里奇","value":"盖·里奇"},
            {"title":"韦斯·安德森","value":"韦斯·安德森"}, {"title":"保罗·托马斯·安德森","value":"保罗·托马斯·安德森"}, {"title":"达米恩·查泽雷","value":"达米恩·查泽雷"},
            {"title":"阿方索·卡隆","value":"阿方索·卡隆"}, {"title":"吉尔莫·德尔·托罗","value":"吉尔莫·德尔·托罗"}, {"title":"亚历杭德罗·冈萨雷斯·伊纳里图","value":"亚历杭德罗·冈萨雷斯·伊纳里图"},
            {"title":"科恩兄弟","value":"科恩兄弟"}, {"title":"朗·霍华德","value":"朗·霍华德"}, {"title":"克林特·伊斯特伍德","value":"克林特·伊斯特伍德"},
            {"title":"英格玛·伯格曼","value":"英格玛·伯格曼"}, {"title":"费德里科·费里尼","value":"费德里科·费里尼"}, {"title":"维托里奥·德·西卡","value":"维托里奥·德·西卡"},
            {"title":"吕克·贝松","value":"吕克·贝松"}, {"title":"让-吕克·戈达尔","value":"让-吕克·戈达尔"}, {"title":"弗朗索瓦·特吕弗","value":"弗朗索瓦·特吕弗"},
            {"title":"拉斯·冯·提尔","value":"拉斯·冯·提尔"}, {"title":"托马斯·温特伯格","value":"托马斯·温特伯格"}, {"title":"迈克尔·哈内克","value":"迈克尔·哈内克"},
            {"title":"贝托鲁奇","value":"贝托鲁奇"}, {"title":"安德烈·塔可夫斯基","value":"安德烈·塔可夫斯基"}, {"title":"谢尔盖·爱森斯坦","value":"谢尔盖·爱森斯坦"},
            {"title":"阿基·考里斯马基","value":"阿基·考里斯马基"}, {"title":"阿斯哈·法哈蒂","value":"阿斯哈·法哈蒂"}, {"title":"巴兹·鲁赫曼","value":"巴兹·鲁赫曼"},
            {"title":"彼得·杰克逊","value":"彼得·杰克逊"}, {"title":"丹尼斯·维伦纽瓦","value":"丹尼斯·维伦纽瓦"}, {"title":"格蕾塔·葛韦格","value":"格蕾塔·葛韦格"},
            {"title":"乔丹·皮尔","value":"乔丹·皮尔"}, {"title":"斯派克·李","value":"斯派克·李"}
          ],
        },
        {
          name: "name_customize",
          title: "自定义姓名",
          type: "input",
          belongTo: {
            paramName: "input_type",
            value: ["customize"],
          },
          description: "自定义姓名，支持模糊搜索",
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          value: "vote",
          enumOptions: [
            { title: "评价排序", value: "vote" },
            { title: "时间排序", value: "time" },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "豆瓣影人作品(平铺选择版)",
      requiresWebView: false,
      functionName: "loadActorItems",
      cacheDuration: 604800,
      params: [
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          value: "vote",
          enumOptions: [
            { title: "评价排序", value: "vote" },
            { title: "时间排序", value: "time" },
          ],
        },
        {
          name: "actor_select",
          title: "筛选影人",
          type: "enumeration",
          belongTo: {
            paramName: "sort_by",
            value: ["vote", "time"],
          },
          enumOptions: [
            {"title":"黄渤","value":"黄渤"}, {"title":"徐峥","value":"徐峥"}, {"title":"王宝强","value":"王宝强"},
            {"title":"吴京","value":"吴京"}, {"title":"张译","value":"张译"}, {"title":"沈腾","value":"沈腾"},
            {"title":"葛优","value":"葛优"}, {"title":"邓超","value":"邓超"}, {"title":"陈道明","value":"陈道明"},
            {"title":"张国立","value":"张国立"}, {"title":"姜文","value":"姜文"}, {"title":"孙红雷","value":"孙红雷"},
            {"title":"黄晓明","value":"黄晓明"}, {"title":"陈坤","value":"陈坤"}, {"title":"胡歌","value":"胡歌"},
            {"title":"张涵予","value":"张涵予"}, {"title":"刘烨","value":"刘烨"}, {"title":"吴秀波","value":"吴秀波"},
            {"title":"李晨","value":"李晨"}, {"title":"冯绍峰","value":"冯绍峰"}, {"title":"黄轩","value":"黄轩"},
            {"title":"段奕宏","value":"段奕宏"}, {"title":"王凯","value":"王凯"}, {"title":"雷佳音","value":"雷佳音"},
            {"title":"杨洋","value":"杨洋"}, {"title":"肖战","value":"肖战"}, {"title":"王一博","value":"王一博"},
            {"title":"易烊千玺","value":"易烊千玺"}, {"title":"朱一龙","value":"朱一龙"}, {"title":"张若昀","value":"张若昀"},
            {"title":"李现","value":"李现"}, {"title":"任嘉伦","value":"任嘉伦"}, {"title":"靳东","value":"靳东"},
            {"title":"廖凡","value":"廖凡"}, {"title":"潘粤明","value":"潘粤明"}, {"title":"马天宇","value":"马天宇"},
            {"title":"林更新","value":"林更新"}, {"title":"佟大为","value":"佟大为"}, {"title":"陈赫","value":"陈赫"},
            {"title":"杜淳","value":"杜淳"}, {"title":"冯远征","value":"冯远征"}, {"title":"王志文","value":"王志文"},
            {"title":"李保田","value":"李保田"}, {"title":"陈宝国","value":"陈宝国"}, {"title":"张丰毅","value":"张丰毅"},
            {"title":"朱亚文","value":"朱亚文"}, {"title":"陈晓","value":"陈晓"}, {"title":"于和伟","value":"于和伟"},
            {"title":"张嘉译","value":"张嘉译"}, {"title":"王学圻","value":"王学圻"}, {"title":"濮存昕","value":"濮存昕"},
            {"title":"巩俐","value":"巩俐"}, {"title":"章子怡","value":"章子怡"}, {"title":"周迅","value":"周迅"},
            {"title":"范冰冰","value":"范冰冰"}, {"title":"李冰冰","value":"李冰冰"}, {"title":"赵薇","value":"赵薇"},
            {"title":"汤唯","value":"汤唯"}, {"title":"刘亦菲","value":"刘亦菲"}, {"title":"杨幂","value":"杨幂"},
            {"title":"杨颖","value":"杨颖"}, {"title":"倪妮","value":"倪妮"}, {"title":"舒淇","value":"舒淇"},
            {"title":"孙俪","value":"孙俪"}, {"title":"姚晨","value":"姚晨"}, {"title":"高圆圆","value":"高圆圆"},
            {"title":"刘涛","value":"刘涛"}, {"title":"马伊琍","value":"马伊琍"}, {"title":"宋佳","value":"宋佳"},
            {"title":"蒋雯丽","value":"蒋雯丽"}, {"title":"徐静蕾","value":"徐静蕾"}, {"title":"闫妮","value":"闫妮"},
            {"title":"海清","value":"海清"}, {"title":"袁泉","value":"袁泉"}, {"title":"周冬雨","value":"周冬雨"},
            {"title":"马思纯","value":"马思纯"}, {"title":"赵丽颖","value":"赵丽颖"}, {"title":"杨紫","value":"杨紫"},
            {"title":"迪丽热巴","value":"迪丽热巴"}, {"title":"谭松韵","value":"谭松韵"}, {"title":"佟丽娅","value":"佟丽娅"},
            {"title":"江疏影","value":"江疏影"}, {"title":"刘诗诗","value":"刘诗诗"}, {"title":"白百何","value":"白百何"},
            {"title":"梅婷","value":"梅婷"}, {"title":"张静初","value":"张静初"}, {"title":"陈数","value":"陈数"},
            {"title":"殷桃","value":"殷桃"}, {"title":"王丽坤","value":"王丽坤"}, {"title":"李小冉","value":"李小冉"},
            {"title":"秦海璐","value":"秦海璐"}, {"title":"童蕾","value":"童蕾"}, {"title":"颜丙燕","value":"颜丙燕"},
            {"title":"俞飞鸿","value":"俞飞鸿"}, {"title":"曾黎","value":"曾黎"}, {"title":"张子枫","value":"张子枫"},
            {"title":"关晓彤","value":"关晓彤"}, {"title":"李沁","value":"李沁"}, {"title":"张天爱","value":"张天爱"},
            {"title":"宋茜","value":"宋茜"}, {"title":"古力娜扎","value":"古力娜扎"}, {"title":"王鸥","value":"王鸥"},
            {"title":"周润发","value":"周润发"}, {"title":"梁朝伟","value":"梁朝伟"}, {"title":"刘德华","value":"刘德华"},
            {"title":"成龙","value":"成龙"}, {"title":"李连杰","value":"李连杰"}, {"title":"张家辉","value":"张家辉"},
            {"title":"古天乐","value":"古天乐"}, {"title":"甄子丹","value":"甄子丹"}, {"title":"刘青云","value":"刘青云"},
            {"title":"任达华","value":"任达华"}, {"title":"吴镇宇","value":"吴镇宇"}, {"title":"黄秋生","value":"黄秋生"},
            {"title":"林家栋","value":"林家栋"}, {"title":"余文乐","value":"余文乐"}, {"title":"谢霆锋","value":"谢霆锋"},
            {"title":"郭富城","value":"郭富城"}, {"title":"曾志伟","value":"曾志伟"}, {"title":"吕良伟","value":"吕良伟"},
            {"title":"林保怡","value":"林保怡"}, {"title":"欧阳震华","value":"欧阳震华"}, {"title":"张卫健","value":"张卫健"},
            {"title":"周杰伦","value":"周杰伦"}, {"title":"金城武","value":"金城武"}, {"title":"阮经天","value":"阮经天"},
            {"title":"彭于晏","value":"彭于晏"}, {"title":"霍建华","value":"霍建华"}, {"title":"钟汉良","value":"钟汉良"},
            {"title":"陈柏霖","value":"陈柏霖"}, {"title":"王大陆","value":"王大陆"}, {"title":"柯震东","value":"柯震东"},
            {"title":"吴慷仁","value":"吴慷仁"}, {"title":"蓝正龙","value":"蓝正龙"}, {"title":"张孝全","value":"张孝全"},
            {"title":"凤小岳","value":"凤小岳"}, {"title":"刘冠廷","value":"刘冠廷"}, {"title":"郑人硕","value":"郑人硕"},
            {"title":"林哲熹","value":"林哲熹"}, {"title":"许光汉","value":"许光汉"}, {"title":"邱泽","value":"邱泽"},
            {"title":"明道","value":"明道"}, {"title":"贺军翔","value":"贺军翔"}, {"title":"周渝民","value":"周渝民"},
            {"title":"言承旭","value":"言承旭"}, {"title":"汪东城","value":"汪东城"}, {"title":"陈奕迅","value":"陈奕迅"},
            {"title":"张震","value":"张震"}, {"title":"王力宏","value":"王力宏"}, {"title":"林志颖","value":"林志颖"},
            {"title":"苏有朋","value":"苏有朋"}, {"title":"吴彦祖","value":"吴彦祖"},{"title":"张曼玉","value":"张曼玉"},
            {"title":"林青霞","value":"林青霞"}, {"title":"钟楚红","value":"钟楚红"}, {"title":"米雪","value":"米雪"},
            {"title":"梅艳芳","value":"梅艳芳"}, {"title":"王祖贤","value":"王祖贤"}, {"title":"杨采妮","value":"杨采妮"},
            {"title":"张艾嘉","value":"张艾嘉"}, {"title":"舒淇","value":"舒淇"}, {"title":"郑秀文","value":"郑秀文"},
            {"title":"杨千嬅","value":"杨千嬅"}, {"title":"蔡卓妍","value":"蔡卓妍"}, {"title":"钟欣潼","value":"钟欣潼"},
            {"title":"吴君如","value":"吴君如"}, {"title":"莫文蔚","value":"莫文蔚"}, {"title":"李若彤","value":"李若彤"},
            {"title":"朱茵","value":"朱茵"}, {"title":"佘诗曼","value":"佘诗曼"}, {"title":"宣萱","value":"宣萱"},
            {"title":"陈慧琳","value":"陈慧琳"}, {"title":"林依晨","value":"林依晨"}, {"title":"陈乔恩","value":"陈乔恩"},
            {"title":"杨丞琳","value":"杨丞琳"}, {"title":"张钧甯","value":"张钧甯"}, {"title":"桂纶镁","value":"桂纶镁"},
            {"title":"徐若瑄","value":"徐若瑄"}, {"title":"谢欣颖","value":"谢欣颖"}, {"title":"柯佳嬿","value":"柯佳嬿"},
            {"title":"陈意涵","value":"陈意涵"}, {"title":"白歆惠","value":"白歆惠"}, {"title":"简嫚书","value":"简嫚书"},
            {"title":"曾之乔","value":"曾之乔"}, {"title":"郭采洁","value":"郭采洁"}, {"title":"夏于乔","value":"夏于乔"},
            {"title":"安心亚","value":"安心亚"}, {"title":"赖雅妍","value":"赖雅妍"}, {"title":"许玮甯","value":"许玮甯"},
            {"title":"谢盈萱","value":"谢盈萱"}, {"title":"严艺文","value":"严艺文"}, {"title":"王净","value":"王净"},
            {"title":"陈妍希","value":"陈妍希"}, {"title":"张榕容","value":"张榕容"}, {"title":"林心如","value":"林心如"},
            {"title":"安以轩","value":"安以轩"}, {"title":"徐熙媛","value":"徐熙媛"}, {"title":"邓丽欣","value":"邓丽欣"},
            {"title":"胡杏儿","value":"胡杏儿"}, {"title":"叶璇","value":"叶璇"}, {"title":"温碧霞","value":"温碧霞"},
            {"title":"赵雅芝","value":"赵雅芝"}, {"title":"木村拓哉","value":"木村拓哉"}, {"title":"山田孝之","value":"山田孝之"},
            {"title":"李敏镐","value":"李敏镐"}, {"title":"宋仲基","value":"宋仲基"}, {"title":"孔刘","value":"孔刘"},
            {"title":"佐藤健","value":"佐藤健"}, {"title":"菅田将晖","value":"菅田将晖"}, {"title":"冈田准一","value":"岡田准一"},
            {"title":"朴叙俊","value":"朴叙俊"}, {"title":"李钟硕","value":"李钟硕"}, {"title":"金秀贤","value":"金秀贤"},
            {"title":"小栗旬","value":"小栗旬"}, {"title":"松坂桃李","value":"松坂桃李"}, {"title":"中村伦也","value":"中村倫也"},
            {"title":"姜栋元","value":"姜栋元"}, {"title":"李秉宪","value":"李秉宪"}, {"title":"池昌旭","value":"池昌旭"},
            {"title":"生田斗真","value":"生田斗真"}, {"title":"高桥一生","value":"高橋一生"}, {"title":"绫野刚","value":"綾野剛"},
            {"title":"宋康","value":"宋康"}, {"title":"车银优","value":"车银优"}, {"title":"南柱赫","value":"南柱赫"},
            {"title":"山崎贤人","value":"山崎賢人"}, {"title":"吉泽亮","value":"吉沢亮"}, {"title":"竹内凉真","value":"竹内涼真"},
            {"title":"玄彬","value":"玄彬"}, {"title":"李栋旭","value":"李栋旭"}, {"title":"丁海寅","value":"丁海寅"},
            {"title":"妻夫木聪","value":"妻夫木聡"}, {"title":"洼田正孝","value":"窪田正孝"}, {"title":"田中圭","value":"田中圭"},
            {"title":"朴海镇","value":"朴海镇"}, {"title":"金汎","value":"金汎"}, {"title":"安孝燮","value":"安孝燮"},
            {"title":"三浦春马","value":"三浦春馬"}, {"title":"志尊淳","value":"志尊淳"}, {"title":"町田启太","value":"町田啓太"},
            {"title":"刘亚仁","value":"刘亚仁"}, {"title":"金永光","value":"金永光"}, {"title":"李俊昊","value":"李俊昊"},
            {"title":"长谷川博己","value":"長谷川博己"}, {"title":"坂口健太郎","value":"坂口健太郎"}, {"title":"中川大志","value":"中川大志"},
            {"title":"崔岷植","value":"崔岷植"}, {"title":"宋承宪","value":"宋承宪"}, {"title":"金南佶","value":"金南佶"},
            {"title":"渡边谦","value":"渡辺謙"}, {"title":"染谷将太","value":"染谷将太"}, {"title":"福山雅治","value":"福山雅治"},
            {"title":"长泽雅美","value":"长泽雅美"}, {"title":"新垣结衣","value":"新垣结衣"}, {"title":"石原里美","value":"石原里美"},
            {"title":"全智贤","value":"全智贤"}, {"title":"宋慧乔","value":"宋慧乔"}, {"title":"韩孝周","value":"韩孝周"},
            {"title":"绫濑遥","value":"绫濑遥"}, {"title":"深田恭子","value":"深田恭子"}, {"title":"户田惠梨香","value":"户田惠梨香"},
            {"title":"朴信惠","value":"朴信惠"}, {"title":"金泰希","value":"金泰希"}, {"title":"李英爱","value":"李英爱"},
            {"title":"有村架纯","value":"有村架纯"}, {"title":"桥本环奈","value":"桥本环奈"}, {"title":"广濑铃","value":"广濑铃"},
            {"title":"李知恩","value":"李知恩"}, {"title":"裴秀智","value":"裴秀智"}, {"title":"申敏儿","value":"申敏儿"},
            {"title":"北川景子","value":"北川景子"}, {"title":"吉高由里子","value":"吉高由里子"}, {"title":"永野芽郁","value":"永野芽郁"},
            {"title":"林允儿","value":"林允儿"}, {"title":"徐睿知","value":"徐睿知"}, {"title":"金所泫","value":"金所泫"},
            {"title":"满岛光","value":"满岛光"}, {"title":"黑木华","value":"黑木华"}, {"title":"清野菜名","value":"清野菜名"},
            {"title":"孙艺珍","value":"孙艺珍"}, {"title":"孔孝真","value":"孔孝真"}, {"title":"金高银","value":"金高银"},
            {"title":"上白石萌音","value":"上白石萌音"}, {"title":"波瑠","value":"波瑠"}, {"title":"多部未华子","value":"多部未华子"},
            {"title":"韩智敏","value":"韩智敏"}, {"title":"朴宝英","value":"朴宝英"}, {"title":"金智媛","value":"金智媛"},
            {"title":"松隆子","value":"松隆子"}, {"title":"安藤樱","value":"安藤樱"}, {"title":"二阶堂富美","value":"二阶堂富美"},
            {"title":"文彩元","value":"文彩元"}, {"title":"李圣经","value":"李圣经"}, {"title":"高雅拉","value":"高雅拉"},
            {"title":"小松菜奈","value":"小松菜奈"}, {"title":"土屋太凤","value":"土屋太凤"}, {"title":"滨边美波","value":"滨边美波"},
            {"title":"姜受延","value":"姜受延"}, {"title":"金惠秀","value":"金惠秀"}, {"title":"罗美兰","value":"罗美兰"},
            {"title":"高畑充希","value":"高畑充希"}, {"title":"森七菜","value":"森七菜"}, {"title":"莱昂纳多·迪卡普里奥","value":"莱昂纳多·迪卡普里奥"},
            {"title":"罗伯特·德尼罗","value":"罗伯特·德尼罗"}, {"title":"丹泽尔·华盛顿","value":"丹泽尔·华盛顿"}, {"title":"约翰尼·德普","value":"约翰尼·德普"},
            {"title":"休·杰克曼","value":"休·杰克曼"}, {"title":"克里斯蒂安·贝尔","value":"克里斯蒂安·贝尔"}, {"title":"克里斯·海姆斯沃斯","value":"克里斯·海姆斯沃斯"},
            {"title":"马特·达蒙","value":"马特·达蒙"}, {"title":"瑞安·高斯林","value":"瑞安·高斯林"}, {"title":"杰克·吉伦哈尔","value":"杰克·吉伦哈尔"},
            {"title":"汤姆·哈迪","value":"汤姆·哈迪"}, {"title":"基努·里维斯","value":"基努·里维斯"}, {"title":"威尔·史密斯","value":"威尔·史密斯"},
            {"title":"乔治·克鲁尼","value":"乔治·克鲁尼"}, {"title":"本·阿弗莱克","value":"本·阿弗莱克"}, {"title":"马克·沃尔伯格","value":"马克·沃尔伯格"},
            {"title":"丹尼尔·戴-刘易斯","value":"丹尼尔·戴-刘易斯"}, {"title":"安东尼·霍普金斯","value":"安东尼·霍普金斯"}, {"title":"加里·奥德曼","value":"加里·奥德曼"},
            {"title":"克里斯·埃文斯","value":"克里斯·埃文斯"}, {"title":"罗伯特·唐尼","value":"罗伯特·唐尼"}, {"title":"马克·鲁法洛","value":"马克·鲁法洛"},
            {"title":"詹姆斯·麦卡沃伊","value":"詹姆斯·麦卡沃伊"}, {"title":"迈克尔·法斯宾德","value":"迈克尔·法斯宾德"}, {"title":"蒂莫西·柴勒梅德","value":"蒂莫西·柴勒梅德"},
            {"title":"汤姆·霍兰德","value":"汤姆·霍兰德"}, {"title":"扎克·埃夫隆","value":"扎克·埃夫隆"}, {"title":"瑞安·雷诺兹","value":"瑞安·雷诺兹"},
            {"title":"布兰登·弗雷泽","value":"布兰登·弗雷泽"}, {"title":"科林·法瑞尔","value":"科林·法瑞尔"}, {"title":"伊万·麦克格雷格","value":"伊万·麦克格雷格"},
            {"title":"休·格兰特","value":"休·格兰特"}, {"title":"裘德·洛","value":"裘德·洛"}, {"title":"马修·麦康纳","value":"马修·麦康纳"},
            {"title":"杰瑞德·莱托","value":"杰瑞德·莱托"}, {"title":"西蒙·佩吉","value":"西蒙·佩吉"}, {"title":"本尼迪克特·康伯巴奇","value":"本尼迪克特·康伯巴奇"},
            {"title":"艾迪·雷德梅恩","value":"艾迪·雷德梅恩"}, {"title":"查宁·塔图姆","value":"查宁·塔图姆"}, {"title":"克里斯·派恩","value":"克里斯·派恩"},
            {"title":"利亚姆·尼森","value":"利亚姆·尼森"}, {"title":"布莱德利·库珀","value":"布莱德利·库珀"}, {"title":"乔纳·希尔","value":"乔纳·希尔"},
            {"title":"威尔·法瑞尔","value":"威尔·法瑞尔"}, {"title":"保罗·路德","value":"保罗·路德"}, {"title":"詹姆斯·弗兰科","value":"詹姆斯·弗兰科"},
            {"title":"安塞尔·埃尔戈特","value":"安塞尔·埃尔戈特"}, {"title":"乔什·布洛林","value":"乔什·布洛林"},  {"title":"布拉德·皮特","value":"布拉德·皮特"},
            {"title":"汤姆·汉克斯","value":"汤姆·汉克斯"},{"title":"梅丽尔·斯特里普","value":"梅丽尔·斯特里普"}, {"title":"凯特·布兰切特","value":"凯特·布兰切特"},
            {"title":"娜塔莉·波特曼","value":"娜塔莉·波特曼"}, {"title":"斯嘉丽·约翰逊","value":"斯嘉丽·约翰逊"}, {"title":"詹妮弗·劳伦斯","value":"詹妮弗·劳伦斯"},
            {"title":"艾玛·斯通","value":"艾玛·斯通"}, {"title":"安妮·海瑟薇","value":"安妮·海瑟薇"}, {"title":"艾米·亚当斯","value":"艾米·亚当斯"},
            {"title":"朱莉娅·罗伯茨","value":"朱莉娅·罗伯茨"}, {"title":"桑德拉·布洛克","value":"桑德拉·布洛克"}, {"title":"凯拉·奈特莉","value":"凯拉·奈特莉"},
            {"title":"杰西卡·查斯坦","value":"杰西卡·查斯坦"}, {"title":"玛格特·罗比","value":"玛格特·罗比"}, {"title":"查理兹·塞隆","value":"查理兹·塞隆"},
            {"title":"瑞茜·威瑟斯彭","value":"瑞茜·威瑟斯彭"}, {"title":"妮可·基德曼","value":"妮可·基德曼"}, {"title":"凯特·温斯莱特","value":"凯特·温斯莱特"},
            {"title":"朱迪·丹奇","value":"朱迪·丹奇"}, {"title":"海伦·米伦","value":"海伦·米伦"}, {"title":"弗兰西丝·麦克多蒙德","value":"弗兰西丝·麦克多蒙德"},
            {"title":"艾玛·沃特森","value":"艾玛·沃特森"}, {"title":"西尔莎·罗南","value":"西尔莎·罗南"}, {"title":"赞达亚","value":"赞达亚"},
            {"title":"艾米莉·布朗特","value":"艾米莉·布朗特"}, {"title":"罗莎蒙德·派克","value":"罗莎蒙德·派克"}, {"title":"奥利维娅·科尔曼","value":"奥利维娅·科尔曼"},
            {"title":"格温妮斯·帕特洛","value":"格温妮斯·帕特洛"}, {"title":"米歇尔·威廉姆斯","value":"米歇尔·威廉姆斯"}, {"title":"克里斯汀·斯图尔特","value":"克里斯汀·斯图尔特"},
            {"title":"布丽·拉尔森","value":"布丽·拉尔森"}, {"title":"蕾切尔·麦克亚当斯","value":"蕾切尔·麦克亚当斯"}, {"title":"艾丽西亚·维坎德","value":"艾丽西亚·维坎德"},
            {"title":"凯莉·穆里根","value":"凯莉·穆里根"}, {"title":"维奥拉·戴维斯","value":"维奥拉·戴维斯"}, {"title":"奥克塔维娅·斯宾瑟","value":"奥克塔维娅·斯宾瑟"},
            {"title":"黛安·基顿","value":"黛安·基顿"}, {"title":"苏珊·萨兰登","value":"苏珊·萨兰登"}, {"title":"梅丽莎·麦卡西","value":"梅丽莎·麦卡西"},
            {"title":"蒂尔达·斯文顿","value":"蒂尔达·斯文顿"}, {"title":"劳拉·邓恩","value":"劳拉·邓恩"}, {"title":"蕾妮·齐薇格","value":"蕾妮·齐薇格"},
            {"title":"安娜·肯德里克","value":"安娜·肯德里克"}, {"title":"珍妮弗·康纳利","value":"珍妮弗·康纳利"}, {"title":"克莱尔·芙伊","value":"克莱尔·芙伊"},
            {"title":"艾米丽·莫迪默","value":"艾米丽·莫迪默"}, {"title":"凯瑟琳·泽塔-琼斯","value":"凯瑟琳·泽塔-琼斯"}, {"title":"伊丽莎白·班克斯","value":"伊丽莎白·班克斯"},
            {"title":"弗洛伦丝·皮尤","value":"弗洛伦丝·皮尤"}, {"title":"玛丽昂·歌迪亚","value":"玛丽昂·歌迪亚"}, {"title":"安吉丽娜·朱莉","value":"安吉丽娜·朱莉"},
            {"title":"张艺谋","value":"张艺谋"}, {"title":"陈凯歌","value":"陈凯歌"}, {"title":"冯小刚","value":"冯小刚"},
            {"title":"王家卫","value":"王家卫"}, {"title":"李安","value":"李安"}, {"title":"姜文","value":"姜文"},
            {"title":"徐克","value":"徐克"}, {"title":"吴宇森","value":"吴宇森"}, {"title":"杜琪峰","value":"杜琪峰"},
            {"title":"周星驰","value":"周星驰"}, {"title":"宁浩","value":"宁浩"}, {"title":"陈思诚","value":"陈思诚"},
            {"title":"贾樟柯","value":"贾樟柯"}, {"title":"侯孝贤","value":"侯孝贤"}, {"title":"杨德昌","value":"杨德昌"},
            {"title":"许鞍华","value":"许鞍华"}, {"title":"谢晋","value":"谢晋"}, {"title":"张一白","value":"张一白"},
            {"title":"管虎","value":"管虎"}, {"title":"陆川","value":"陆川"}, {"title":"韩寒","value":"韩寒"},
            {"title":"徐峥","value":"徐峥"}, {"title":"陈可辛","value":"陈可辛"}, {"title":"林超贤","value":"林超贤"},
            {"title":"乌尔善","value":"乌尔善"}, {"title":"郭帆","value":"郭帆"}, {"title":"路阳","value":"路阳"},
            {"title":"饺子","value":"饺子"}, {"title":"田晓鹏","value":"田晓鹏"}, {"title":"王晶","value":"王晶"},
            {"title":"郑保瑞","value":"郑保瑞"}, {"title":"刘伟强","value":"刘伟强"}, {"title":"唐季礼","value":"唐季礼"},
            {"title":"闫非","value":"闫非"}, {"title":"彭大魔","value":"彭大魔"}, {"title":"曹保平","value":"曹保平"},
            {"title":"尔冬升","value":"尔冬升"}, {"title":"韩延","value":"韩延"}, {"title":"大鹏","value":"大鹏"},
            {"title":"薛晓路","value":"薛晓路"}, {"title":"郭子健","value":"郭子健"}, {"title":"丁晟","value":"丁晟"},
            {"title":"陈正道","value":"陈正道"}, {"title":"彭浩翔","value":"彭浩翔"}, {"title":"高群书","value":"高群书"},
            {"title":"刘若英","value":"刘若英"}, {"title":"李芳芳","value":"李芳芳"}, {"title":"陈嘉上","value":"陈嘉上"},
            {"title":"苏伦","value":"苏伦"}, {"title":"顾长卫","value":"顾长卫"}, {"title":"斯蒂文·斯皮尔伯格","value":"斯蒂文·斯皮尔伯格"},
            {"title":"昆汀·塔伦蒂诺","value":"昆汀·塔伦蒂诺"}, {"title":"詹姆斯·卡梅隆","value":"詹姆斯·卡梅隆"}, {"title":"伍迪·艾伦","value":"伍迪·艾伦"},
            {"title":"大卫·芬奇","value":"大卫·芬奇"}, {"title":"蒂姆·伯顿","value":"蒂姆·伯顿"}, {"title":"雷德利·斯科特","value":"雷德利·斯科特"},
            {"title":"阿尔弗雷德·希区柯克","value":"阿尔弗雷德·希区柯克"}, {"title":"斯坦利·库布里克","value":"斯坦利·库布里克"}, {"title":"弗朗西斯·福特·科波拉","value":"弗朗西斯·福特·科波拉"},
            {"title":"黑泽明","value":"黑泽明"}, {"title":"小津安二郎","value":"小津安二郎"}, {"title":"是枝裕和","value":"是枝裕和"},
            {"title":"奉俊昊","value":"奉俊昊"}, {"title":"朴赞郁","value":"朴赞郁"}, {"title":"李沧东","value":"李沧东"},
            {"title":"奥逊·威尔斯","value":"奥逊·威尔斯"}, {"title":"乔治·卢卡斯","value":"乔治·卢卡斯"}, {"title":"盖·里奇","value":"盖·里奇"},
            {"title":"韦斯·安德森","value":"韦斯·安德森"}, {"title":"保罗·托马斯·安德森","value":"保罗·托马斯·安德森"}, {"title":"达米恩·查泽雷","value":"达米恩·查泽雷"},
            {"title":"阿方索·卡隆","value":"阿方索·卡隆"}, {"title":"吉尔莫·德尔·托罗","value":"吉尔莫·德尔·托罗"}, {"title":"亚历杭德罗·冈萨雷斯·伊纳里图","value":"亚历杭德罗·冈萨雷斯·伊纳里图"},
            {"title":"科恩兄弟","value":"科恩兄弟"}, {"title":"朗·霍华德","value":"朗·霍华德"}, {"title":"克林特·伊斯特伍德","value":"克林特·伊斯特伍德"},
            {"title":"英格玛·伯格曼","value":"英格玛·伯格曼"}, {"title":"费德里科·费里尼","value":"费德里科·费里尼"}, {"title":"维托里奥·德·西卡","value":"维托里奥·德·西卡"},
            {"title":"吕克·贝松","value":"吕克·贝松"}, {"title":"让-吕克·戈达尔","value":"让-吕克·戈达尔"}, {"title":"弗朗索瓦·特吕弗","value":"弗朗索瓦·特吕弗"},
            {"title":"拉斯·冯·提尔","value":"拉斯·冯·提尔"}, {"title":"托马斯·温特伯格","value":"托马斯·温特伯格"}, {"title":"迈克尔·哈内克","value":"迈克尔·哈内克"},
            {"title":"贝托鲁奇","value":"贝托鲁奇"}, {"title":"安德烈·塔可夫斯基","value":"安德烈·塔可夫斯基"}, {"title":"谢尔盖·爱森斯坦","value":"谢尔盖·爱森斯坦"},
            {"title":"阿基·考里斯马基","value":"阿基·考里斯马基"}, {"title":"阿斯哈·法哈蒂","value":"阿斯哈·法哈蒂"}, {"title":"巴兹·鲁赫曼","value":"巴兹·鲁赫曼"},
            {"title":"彼得·杰克逊","value":"彼得·杰克逊"}, {"title":"丹尼斯·维伦纽瓦","value":"丹尼斯·维伦纽瓦"}, {"title":"格蕾塔·葛韦格","value":"格蕾塔·葛韦格"},
            {"title":"乔丹·皮尔","value":"乔丹·皮尔"}, {"title":"斯派克·李","value":"斯派克·李"}, {"title":"马丁·斯科塞斯","value":"马丁·斯科塞斯"},
            {"title":"克里斯托弗·诺兰","value":"克里斯托弗·诺兰"},
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "豆瓣首页轮播图(用于首页和apple tv topshelf)",
      requiresWebView: false,
      functionName: "loadCarouselItems",
      description: "从豆瓣热播电影/电视剧/综艺/动漫分别随机获取3个未在影院上映的影片，并乱序后返回总共12个影片",
      cacheDuration: 3600,
    },
  ],
  version: "1.0.20",
  requiredVersion: "0.0.1",
  description: "解析豆瓣想看、在看、已看以及根据个人数据生成的个性化推荐【五折码：CHEAP.5;七折码：CHEAP】",
  author: "huangxd",
  site: "https://github.com/huangxd-/ForwardWidgets"
};

async function fetchDoubanPage(user_id, status, start, count) {
  const url = `https://m.douban.com/rexxar/api/v2/user/${user_id}/interests?status=${status}&start=${start}&count=${count}`;

  try {
    const response = await Widget.http.get(url, {
      headers: {
        Referer: `https://m.douban.com/mine/movie`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    console.log("请求结果:", response.data);

    if (response.data && response.data.interests) {
      const items = response.data.interests;
      return [...new Set(
        items
          .filter((item) => item.subject.id != null)
          .map((item) => item.subject.id)
      )].map((id) => ({
        id,
        type: "douban",
      }));
    }
    return [];
  } catch (error) {
    console.error("获取页面数据失败:", error);
    return [];
  }
}

async function loadInterestItems(params = {}) {
  const page = params.page;
  const user_id = params.user_id || "";
  let status = params.status || "";
  const random = status === "random_mark";
  if (random) {
      status = "mark";
  }
  const count = random ? 50 : 20;
  const start = (page - 1) * count

  if (random) {
    if (page > 1) {
      return [];
    }
    // 获取所有页数据并随机抽取10个item
    let allDoubanIds = [];
    let currentStart = start;

    while (true) {
      const doubanIds = await fetchDoubanPage(user_id, status, currentStart, count);
      allDoubanIds = [...allDoubanIds, ...doubanIds];

      if (doubanIds.length < count) {
        break;
      }

      currentStart += count;
    }

    // 随机抽取10个item
    const shuffled = allDoubanIds.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(9, shuffled.length));
  } else {
    // 获取单页数据
    return await fetchDoubanPage(user_id, status, start, count);
  }
}

async function loadSuggestionItems(params = {}) {
  const page = params.page;
  const cookie = params.cookie || "";
  const type = params.type || "";
  const count = 20
  const start = (page - 1) * count
  const ckMatch = cookie.match(/ck=([^;]+)/);
  const ckValue = ckMatch ? ckMatch[1] : null;
  let url = `https://m.douban.com/rexxar/api/v2/${type}/suggestion?start=${start}&count=${count}&new_struct=1&with_review=1&ck=${ckValue}`;
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://m.douban.com/movie`,
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.items) {
    const items = response.data.items;
    const doubanIds = items.filter((item) => item.id != null).map((item) => ({
      id: item.id,
      type: "douban",
    }));
    return doubanIds;
  }
  return [];
}

// 基础获取TMDB数据方法
async function fetchTmdbData(key, mediaType) {
    const tmdbResults = await Widget.tmdb.get(`/search/${mediaType}`, {
        params: {
            query: key,
            language: "zh",
        }
    });
    //打印结果
    // console.log("搜索内容：" + key)
    if (!tmdbResults) {
      return [];
    }
    console.log("tmdbResults:" + JSON.stringify(tmdbResults, null, 2));
    // console.log("tmdbResults.total_results:" + tmdbResults.total_results);
    // console.log("tmdbResults.results[0]:" + tmdbResults.results[0]);
    return tmdbResults.results;
}

function cleanTitle(title) {
    // 特殊替换（最先）
    if (title === "歌手" || title.startsWith("歌手·") || title.match(/^歌手\d{4}$/)) {
        return "我是歌手";
    }

    // 删除括号及其中内容
    title = title.replace(/[（(【\[].*?[）)】\]]/g, '');

    // 删除季数、期数、part等
    const patterns = [
        /[·\-:]\s*[^·\-:]+季/,                // “·慢享季”
        /第[^季]*季/,                        // “第X季”
        /(?:Part|Season|Series)\s*\d+/i,     // “Part 2”
        /\d{4}/,                             // 年份
        /(?:\s+|^)\d{1,2}(?:st|nd|rd|th)?(?=\s|$)/i,  // “2nd”
        /(?<=[^\d\W])\d+\s*$/,               // 数字结尾
        /[·\-:].*$/,                         // 冒号、点之后内容
    ];
    for (let pattern of patterns) {
        title = title.replace(pattern, '');
    }

    // 删除结尾修饰词（但不能把整句删了）
    const tailKeywords = ['前传', '后传', '外传', '番外篇', '番外', '特别篇', '剧场版', 'SP', '最终季', '完结篇', '完结', '电影', 'OVA', '后篇'];
    for (let kw of tailKeywords) {
        title = title.replace(new RegExp(`${kw}$`), '');
    }

    title = title.trim();

    // 对“多个词”的情况，仅保留第一个“主标题”（如“沧元图2 元初山” → “沧元图”）
    // 使用中文词语边界分割
    const parts = title.split(/\s+/);
    if (parts.length > 1) {
        // 保留第一个部分，剔除数字
        return parts[0].replace(/\d+$/, '');
    } else {
        return title.replace(/\d+$/, '');
    }
}

async function handleOriginalTitle(doubanId, tmdbDatas) {
  const response = await Widget.http.get(`https://m.douban.com/rexxar/api/v2/subject/${doubanId}`, {
    headers: {
      Referer: `https://movie.douban.com/explore`,
      "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if (!response || !response.data) {
    throw new Error("获取影片数据失败");
  }

  let oriTitle = response.data.type === "tv" ? cleanTitle(response.data.original_title) : response.data.original_title;
  console.log("oriTitle: ", oriTitle, " ; type: ", response.data.type);

  if (tmdbDatas.length !== 0) {
    // 遍历 tmdbDatas，寻找匹配的元素
    for (let i = 0; i < tmdbDatas.length; i++) {
      if ((oriTitle === tmdbDatas[i].title || oriTitle === tmdbDatas[i].name)) {
        return tmdbDatas[i];
      }
    }
  }

  return null;
}

async function fetchImdbItems(scItems) {
  const promises = scItems.map(async (scItem) => {
    // 模拟API请求
    if (!scItem || !scItem.title) {
      return null;
    }
    let title = scItem.type === "tv" ? cleanTitle(scItem.title) : scItem.title;
    console.log("title: ", title, " ; type: ", scItem.type);
    const tmdbDatas = await fetchTmdbData(title, scItem.type)

    if (tmdbDatas.length !== 0) {
      let matchedItem = null;

      // 遍历 tmdbDatas，寻找匹配的元素
      for (let i = 0; i < tmdbDatas.length; i++) {
        const dateStr =
          scItem.type === "tv"
            ? tmdbDatas[i].first_air_date
            : scItem.type === "movie"
            ? tmdbDatas[i].release_date
            : scItem.type === "multi"
            ? tmdbDatas[i].first_air_date || tmdbDatas[i].release_date
            : undefined;

        const tmdbYear = dateStr ? dateStr.split("-")[0] : undefined;
        if ((scItem.title === tmdbDatas[i].title || scItem.title === tmdbDatas[i].name) && scItem.year == tmdbYear) {
          matchedItem = tmdbDatas[i];
          break; // 找到第一个匹配项后立即跳出循环
        }
      }

      if (!matchedItem) {
        matchedItem = await handleOriginalTitle(scItem.id, tmdbDatas);
      }

      // 如果找到匹配项，使用该项，否则返回第一个元素
      const itemToReturn = matchedItem || tmdbDatas[0];

      return {
        id: itemToReturn.id,
        type: "tmdb",
        title: itemToReturn.title ?? itemToReturn.name,
        description: itemToReturn.overview,
        releaseDate: itemToReturn.release_date ?? itemToReturn.first_air_date,
        backdropPath: itemToReturn.backdrop_path,
        posterPath: itemToReturn.poster_path,
        rating: itemToReturn.vote_average,
        mediaType: scItem.type !== "multi" ? scItem.type : itemToReturn.media_type,
      };
    } else {
      return null;
    }
  });

  // 等待所有请求完成
  const items = (await Promise.all(promises)).filter(Boolean);

  // 去重：保留第一次出现的 title
  const seenTitles = new Set();
  const uniqueItems = items.filter((item) => {
    if (seenTitles.has(item.title)) {
      return false;
    }
    seenTitles.add(item.title);
    return true;
  });

  return uniqueItems;
}

// 解析豆瓣片单
async function loadCardItems(params = {}) {
  try {
    console.log("开始解析豆瓣片单...");
    console.log("参数:", params);
    // 获取片单 URL
    const url = params.url;
    if (!url) {
      console.error("缺少片单 URL");
      throw new Error("缺少片单 URL");
    }
    // 验证 URL 格式
    if (url.includes("douban.com/doulist/")) {
      return loadDefaultList(params);
    } else if (url.includes("douban.com/subject_collection/")) {
      return loadSubjectCollection(params);
    }
  } catch (error) {
    console.error("解析豆瓣片单失败:", error);
    throw error;
  }
}

async function loadDefaultList(params = {}) {
  const url = params.url;
  // 提取片单 ID
  const listId = url.match(/doulist\/(\d+)/)?.[1];
  console.debug("片单 ID:", listId);
  if (!listId) {
    console.error("无法获取片单 ID");
    throw new Error("无法获取片单 ID");
  }

  const page = params.page;
  const count = 25
  const start = (page - 1) * count
  // 构建片单页面 URL
  const pageUrl = `https://m.douban.com/rexxar/api/v2/doulist/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;

  console.log("请求片单页面:", pageUrl);
  // 发送请求获取片单页面
  const response = await Widget.http.get(pageUrl, {
    headers: {
      Referer: `https://movie.douban.com/explore`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if (!response || !response.data) {
    throw new Error("获取片单数据失败");
  }

  console.log("请求结果:", response.data);

  if (response.data && response.data.items) {
    const scItems = response.data.items.map(item => ({
      title: item.title,
      type: item.type,
      id: item.target_id,
      year: new Date(item.create_time).getFullYear()
    }));

    console.log("scItems:", scItems);

    const items = await fetchImdbItems(scItems);

    console.log(items)

    return items;
  }
  return [];
}

async function loadItemsFromApi(params = {}) {
  const url = params.url;
  console.log("请求 API 页面:", url);
  const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://m.douban.com/subject_collection/${listId}/`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.subject_collection_items) {
    const scItems = response.data.subject_collection_items;

    const items = await fetchImdbItems(scItems);

    console.log(items)

    return items;
  }
  return [];
}

async function loadSubjectCollection(params = {}) {
  const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
  console.debug("合集 ID:", listId);
  if (!listId) {
    console.error("无法获取合集 ID");
    throw new Error("无法获取合集 ID");
  }

  const page = params.page;
  const count = 20
  const start = (page - 1) * count
  let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
  if (params.type) {
    pageUrl += `&type=${params.type}`;
  }
  params.url = pageUrl;
  return await loadItemsFromApi(params);
}

async function loadRecommendMovies(params = {}) {
  return await loadRecommendItems(params, "movie");
}

async function loadRecommendShows(params = {}) {
  return await loadRecommendItems(params, "tv");
}

async function loadRecommendItems(params = {}, type = "movie") {
  const page = params.page;
  const count = 20
  const start = (page - 1) * count
  const category = params.category || "";
  const categoryType = params.type || "";
  let url = `https://m.douban.com/rexxar/api/v2/subject/recent_hot/${type}?start=${start}&limit=${count}&category=${category}&type=${categoryType}`;
  if (category == "all") {
    url = `https://m.douban.com/rexxar/api/v2/${type}/recommend?refresh=0&start=${start}&count=${count}&selected_categories=%7B%7D&uncollect=false&score_range=0,10&tags=`;
  }
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://movie.douban.com/${type}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.items) {
    const recItems = response.data.items;

    const items = await fetchImdbItems(recItems);

    console.log(items)

    return items;
  }
  return [];
}

// 观影偏好
async function getPreferenceRecommendations(params = {}) {
    try {
        const rating = params.rating || "0";
        if (!/^\d$/.test(String(rating))) throw new Error("评分必须为 0～9 的整数");

        const selectedCategories = {
            "类型": params.movieGenre || params.tvGenre || params.zyGenre || "",
            "地区": params.region || "",
            "形式": params.tvModus || "",
        };
        console.log("selectedCategories: ", selectedCategories);

        const tags_sub = [];
        if (params.movieGenre) tags_sub.push(params.movieGenre);
        if (params.tvModus && !params.tvGenre && !params.zyGenre) tags_sub.push(params.tvModus);
        if (params.tvModus && params.tvGenre) tags_sub.push(params.tvGenre);
        if (params.tvModus && params.zyGenre) tags_sub.push(params.zyGenre);
        if (params.region) tags_sub.push(params.region);
        if (params.year) tags_sub.push(params.year);
        if (params.platform) tags_sub.push(params.platform);
        if (params.tags) {
          const customTagsArray = params.tags.split(',').filter(tag => tag.trim() !== '');
          tags_sub.push(...customTagsArray);
        }
        console.log("tags_sub: ", tags_sub);

        const limit = 20;
        const offset = Number(params.offset);
        const url = `https://m.douban.com/rexxar/api/v2/${params.mediaType}/recommend?refresh=0&start=${offset}&count=${Number(offset) + limit}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=${rating},10&tags=${encodeURIComponent(tags_sub.join(","))}&sort=${params.sort_by}`;

        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://movie.douban.com/explore"
            }
        });

        if (!response.data?.items?.length) throw new Error("未找到匹配的影视作品");

        const validItems = response.data.items.filter(item => item.card === "subject");

        if (!validItems.length) throw new Error("未找到有效的影视作品");

        const items = await fetchImdbItems(validItems);

        console.log(items)

        return items;
    } catch (error) {
        throw error;
    }
}

async function getActorId(name) {
    // 构建搜索建议API URL
    const apiUrl = `https://movie.douban.com/j/subject_suggest?q=${name}`;
    console.log("请求API:", apiUrl);

    // 发送请求获取JSON数据
    const response = await Widget.http.get(apiUrl, {
        headers: {
            Referer: "https://movie.douban.com/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        }
    });

    if (!response || !response.data) {
        throw new Error("获取API数据失败");
    }

    console.log("搜索页面数据:", response.data);

    // 筛选并提取演员ID
    const actorSuggestions = response.data.filter(item => item.type === "celebrity");
    if (actorSuggestions.length > 0) {
        const firstActorId = actorSuggestions[0].id;
        console.log("第一个演员的ID:", firstActorId);
        return firstActorId;
    } else {
        console.log("没有找到演员ID");
        return null;
    }
}

// 解析影人作品
async function loadActorItems(params = {}) {
  const page = params.page;
  const actor_select = params.actor_select || "";
  const input_type = params.input_type || "";
  const name_type = params.name_type || "";
  const cn_actor = params.cn_actor_select || "";
  const cn_actress = params.cn_actress_select || "";
  const ht_actor = params.ht_actor_select || "";
  const ht_actress = params.ht_actress_select || "";
  const jk_actor = params.jk_actor_select || "";
  const jk_actress = params.jk_actress_select || "";
  const ea_actor = params.ea_actor_select || "";
  const ea_actress = params.ea_actress_select || "";
  const cn_director = params.cn_director_select || "";
  const fr_director = params.fr_director_select || "";
  const name_customize = params.name_customize || "";
  const sort_by = params.sort_by || "";
  const count = 50
  const start = (page - 1) * count

  const nameTypeDict = {
            'cn_actor': cn_actor,
            'cn_actress': cn_actress,
            'ht_actor': ht_actor,
            'ht_actress': ht_actress,
            'jk_actor': jk_actor,
            'jk_actress': jk_actress,
            'ea_actor': ea_actor,
            'ea_actress': ea_actress,
            'cn_director': cn_director,
            'fr_director': fr_director,
        };
  let actor;
  if (input_type === "select") {
    actor = nameTypeDict[name_type]
  } else {
    actor = name_customize
  }

  if (actor_select) {
    actor = actor_select
  }

  console.log(cn_actor, cn_actress, ht_actor, ht_actress, jk_actor, jk_actress, ea_actor, ea_actress, cn_director, fr_director, name_customize);
  console.log("actor:", actor);

  if (!actor) {
    console.error("缺少演员姓名");
    throw new Error("缺少演员姓名");
  }

  console.log("开始解析豆瓣影人...");
  const actorId = await getActorId(actor);

  if (!actorId) {
    console.error("解析豆瓣影人ID失败");
    throw new Error("解析豆瓣影人ID失败");
  }

  let url = `https://m.douban.com/rexxar/api/v2/celebrity/${actorId}/works?start=${start}&count=${count}&sort=${sort_by}`;
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://m.douban.com/movie`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.works) {
    const works = response.data.works;
    const doubanIds = works.filter((work) => work.work.id != null).map((work) => ({
      id: work.work.id,
      type: "douban",
    }));
    return doubanIds;
  }
  return [];
}

// 获取豆瓣首页轮播图
async function loadCarouselItems(params = {}) {
    const response = await Widget.http.get(`https://gist.githubusercontent.com/huangxd-/5ae61c105b417218b9e5bad7073d2f36/raw/douban_carousel.json`, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    console.log("请求结果:", response.data);

    return response.data;
}
