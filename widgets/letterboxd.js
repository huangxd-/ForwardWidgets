WidgetMetadata = {
    id: "Letterboxd",
    title: "Letterboxd电影爱好者平台",
    modules: [
        {
            id: "letterboxdList",
            title: "Letterboxd片单",
            requiresWebView: false,
            functionName: "loadListItems",
            cacheDuration: 86400,
            params: [
                {
                    name: "input_type",
                    title: "输入类型",
                    type: "enumeration",
                    value: "select",
                    enumOptions: [
                        {title: "筛选", value: "select"},
                        {title: "自定义", value: "customize"},
                    ],
                },
                {
                    name: "list_select",
                    title: "片单完整URL",
                    type: "enumeration",
                    description: "如：https://letterboxd.com/crew/list/2024-highest-rated-films/",
                    belongTo: {
                        paramName: "input_type",
                        value: ["select"],
                    },
                    enumOptions: [
                        {
                            title: "250部最佳叙事长片",
                            value: "https://letterboxd.com/dave/list/official-top-250-narrative-feature-films/"
                        },
                        {
                            title: "Letterboxd上粉丝最多的电影",
                            value: "https://letterboxd.com/jack/list/official-top-250-films-with-the-most-fans/"
                        },
                        {
                            title: "百万观看俱乐部",
                            value: "https://letterboxd.com/alexanderh/list/letterboxd-one-million-watched-club/"
                        },
                        {
                            title: "250部最佳纪录片",
                            value: "https://letterboxd.com/jack/list/official-top-250-documentary-films/"
                        },
                        {
                            title: "女性导演250部最佳电影",
                            value: "https://letterboxd.com/jack/list/women-directors-the-official-top-250-narrative/"
                        },
                        {
                            title: "黑人导演100部最佳电影",
                            value: "https://letterboxd.com/jack/list/black-directors-the-official-top-100-narrative/"
                        },
                        {
                            title: "100部最佳动画长片",
                            value: "https://letterboxd.com/lifeasfiction/list/letterboxd-100-animation/"
                        },
                        {
                            title: "250部最佳恐怖片",
                            value: "https://letterboxd.com/darrencb/list/letterboxds-top-250-horror-films/"
                        },
                        {
                            title: "250部最佳科幻片",
                            value: "https://letterboxd.com/chris_coke/list/letterboxds-top-250-science-fiction-films/"
                        },
                        {
                            title: "100部最佳西部片",
                            value: "https://letterboxd.com/clintarantino/list/letterboxds-top-100-western-films/"
                        },
                        {
                            title: "250部最佳国际电影",
                            value: "https://letterboxd.com/brsan/list/letterboxds-top-250-international-films/"
                        },
                        {
                            title: "100部最佳默片",
                            value: "https://letterboxd.com/brsan/list/letterboxds-top-100-silent-films/"
                        },
                        {
                            title: "100部最佳叙事迷你剧",
                            value: "https://letterboxd.com/slinkyman/list/letterboxds-top-250-highest-rated-narrative/"
                        },
                        {
                            title: "100部最佳纪录迷你剧",
                            value: "https://letterboxd.com/slinkyman/list/letterboxds-top-100-highest-rated-documentary/"
                        },
                        {
                            title: "250部最佳短片",
                            value: "https://letterboxd.com/slinkyman/list/letterboxds-top-250-highest-rated-short-films/"
                        },
                        {
                            title: "奥斯卡最佳影片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-best-picture/"
                        },
                        {
                            title: "戛纳电影节金棕榈奖",
                            value: "https://letterboxd.com/festival_cannes/list/70-years-of-the-palme-dor-70-ans-de-la-palme/"
                        },
                        {
                            title: "英国电影学院奖最佳影片",
                            value: "https://letterboxd.com/bafta/list/all-bafta-best-film-award-winners/"
                        },
                        {
                            title: "金球奖最佳剧情片",
                            value: "https://letterboxd.com/edd_gosbender/list/golden-globe-award-for-best-motion-picture/"
                        },
                        {
                            title: "金球奖最佳音乐/喜剧片",
                            value: "https://letterboxd.com/edd_gosbender/list/golden-globe-award-for-best-motion-picture-1/"
                        },
                        {
                            title: "独立精神奖最佳影片",
                            value: "https://letterboxd.com/steffensneil11/list/independent-spirit-award-for-best-film/"
                        },
                        {
                            title: "柏林电影节金熊奖",
                            value: "https://letterboxd.com/socas/list/golden-bear-goldener-bar/"
                        },
                        {
                            title: "威尼斯电影节金狮奖",
                            value: "https://letterboxd.com/hieusmile/list/golden-lion-venice-films-festival/"
                        },
                        {
                            title: "多伦多电影节观众奖",
                            value: "https://letterboxd.com/lise/list/tiff-audience-award-winners/"
                        },
                        {
                            title: "Letterboxd四大最爱访谈",
                            value: "https://letterboxd.com/andregps/list/letterboxd-four-favorites-interviews/"
                        },
                        {
                            title: "Letterboxd彩蛋",
                            value: "https://letterboxd.com/frozenpandaman/list/letterboxd-easter-eggs/"
                        },
                        {
                            title: "成人电影大合集",
                            value: "https://letterboxd.com/jlalibs/list/official-letterboxd-adult-film-megalist/"
                        },
                        {
                            title: "标准收藏",
                            value: "https://letterboxd.com/jbutts15/list/the-complete-criterion-collection/"
                        },
                        {
                            title: "Shout! Factory",
                            value: "https://letterboxd.com/callifrax/list/a-semi-complete-catalogue-of-shout-scream/"
                        },
                        {
                            title: "Arrow Video",
                            value: "https://letterboxd.com/backfish/list/arrow-video/"
                        },
                        {
                            title: "A24电影列表",
                            value: "https://letterboxd.com/a24/list/every-a24-film/"
                        },
                        {
                            title: "NEON电影列表",
                            value: "https://letterboxd.com/zincalloy23/list/neon/"
                        },
                        {
                            title: "MUBI电影列表",
                            value: "https://letterboxd.com/mubi/list/mubi-releases/"
                        },
                        {
                            title: "罗杰·伊伯特的伟大电影",
                            value: "https://letterboxd.com/dvideostor/list/roger-eberts-great-movies/"
                        },
                        {
                            title: "哈佛电影博士项目",
                            value: "https://letterboxd.com/pileofcrowns/list/harvard-film-phd-program-narrative-films/"
                        },
                        {
                            title: "美国国会图书馆国家电影登记处",
                            value: "https://letterboxd.com/elvisisking/list/the-complete-library-of-congress-national/"
                        },
                        {
                            title: "IMDb前250名",
                            value: "https://letterboxd.com/dave/list/imdb-top-250/"
                        },
                        {
                            title: "全球影史票房榜",
                            value: "https://letterboxd.com/matthew/list/all-time-worldwide-box-office/"
                        },
                        {
                            title: "美国影史调整后本土票房榜（美国总票房）",
                            value: "https://letterboxd.com/matthew/list/box-office-mojo-all-time-domestic-adjusted/"
                        },
                        {
                            title: "死前必看的1001部电影（2024版）",
                            value: "https://letterboxd.com/gubarenko/list/1001-movies-you-must-see-before-you-die-2024/"
                        },
                        {
                            title: "死前必看的1001部电影（所有版本）",
                            value: "https://letterboxd.com/royhsmith/list/1001-movies-you-must-see-before-you-die-2003/"
                        },
                        {
                            title: "AFI前100名（2007版）",
                            value: "https://letterboxd.com/afi/list/afis-100-years100-movies-10th-anniversary/"
                        },
                        {
                            title: "AFI前100名（1998版）",
                            value: "https://letterboxd.com/krisde/list/afi-top-100/"
                        },
                        {
                            title: "视与听伟大电影（影评人榜）",
                            value: "https://letterboxd.com/bfi/list/sight-and-sounds-greatest-films-of-all-time/"
                        },
                        {
                            title: "视与听伟大电影（导演榜）",
                            value: "https://letterboxd.com/bfi/list/sight-and-sounds-directors-100-greatest-films/"
                        },
                        {
                            title: "他们在拍电影，不是吗？前1000名（历史所有时期）",
                            value: "https://letterboxd.com/thisisdrew/list/they-shoot-pictures-dont-they-1000-greatest-6/"
                        },
                        {
                            title: "他们在拍电影，不是吗？前1000名（21世纪）",
                            value: "https://letterboxd.com/georgealexandru/list/greatest-films-the-2025-tspdt-edition-they-2/"
                        },
                        {
                            title: "美国编剧工会101部最伟大剧本（21世纪）",
                            value: "https://letterboxd.com/oneohtrix/list/writers-guild-of-america-101-greatest-screenplays/"
                        },
                        {
                            title: "2024年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2024-highest-rated-films/"
                        },
                        {
                            title: "2023年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2023-highest-rated-films/"
                        },
                        {
                            title: "2022年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2022-highest-rated-films/"
                        },
                        {
                            title: "2021年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2021-highest-rated-films/"
                        },
                        {
                            title: "2020年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2020-highest-rated-films/"
                        },
                        {
                            title: "2019年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2019-highest-rated-films/"
                        },
                        {
                            title: "2018年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2018-highest-rated-films/"
                        },
                        {
                            title: "2017年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2017-highest-rated-films/"
                        },
                        {
                            title: "2016年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2016-highest-rated-films/"
                        },
                        {
                            title: "2015年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2015-highest-rated-films/"
                        },
                        {
                            title: "2014年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2014-highest-rated-films/"
                        },
                        {
                            title: "2013年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2013-highest-rated-films/"
                        },
                        {
                            title: "2012年最高评分电影",
                            value: "https://letterboxd.com/crew/list/2012-highest-rated-films/"
                        },
                        {
                            title: "2020年代中期最高评分电影",
                            value: "https://letterboxd.com/crew/list/midway-2020s-highest-rated-films/"
                        },
                        {
                            title: "2010年代最高评分电影",
                            value: "https://letterboxd.com/crew/list/the-2010s-top-250-narrative-features/"
                        },
                        {
                            title: "韦斯·安德森——最爱",
                            value: "https://letterboxd.com/mlkarasek/list/wes-andersons-favorite-films/"
                        },
                        {
                            title: "阿里·艾斯特——当代最爱",
                            value: "https://letterboxd.com/mgamber/list/ari-asters-favorite-films/"
                        },
                        {
                            title: "英格玛·伯格曼——最爱",
                            value: "https://letterboxd.com/brsan/list/ingmar-bergmans-favorite-films/"
                        },
                        {
                            title: "奉俊昊——最爱",
                            value: "https://letterboxd.com/gpu/list/bong-joon-hos-favorites/"
                        },
                        {
                            title: "索菲亚·科波拉——最爱",
                            value: "https://letterboxd.com/mlkarasek/list/sofia-coppolas-favorite-films/"
                        },
                        {
                            title: "吉尔莫·德尔·托罗——推荐",
                            value: "https://letterboxd.com/ben_macdonald/list/guillermo-del-toros-twitter-film-recommendations/"
                        },
                        {
                            title: "克莱尔·德尼——最爱",
                            value: "https://letterboxd.com/zachzeidenberg/list/claire-denis-favorite-films/"
                        },
                        {
                            title: "罗伯特·艾格斯——最爱的恐怖片",
                            value: "https://letterboxd.com/radbradh/list/robert-eggers-favorite-horror-films/"
                        },
                        {
                            title: "大卫·芬奇——最爱",
                            value: "https://letterboxd.com/abdurrhmknkl/list/david-finchers-favorite-films/"
                        },
                        {
                            title: "格蕾塔·葛韦格——提及",
                            value: "https://letterboxd.com/nataliaivonica/list/greta-gerwig-talked-about-these-films/"
                        },
                        {
                            title: "斯坦利·库布里克——最爱",
                            value: "https://letterboxd.com/jeffroskull/list/stanley-kubricks-100-favorite-filmsthat-we/"
                        },
                        {
                            title: "黑泽明——最爱",
                            value: "https://letterboxd.com/michaelj/list/akira-kurosawas-100-favorite-movies/"
                        },
                        {
                            title: "斯派克·李——重要电影",
                            value: "https://letterboxd.com/theodo/list/spike-lees-95-essential-films-all-aspiring/"
                        },
                        {
                            title: "杰里米·索尔尼尔——最爱",
                            value: "https://letterboxd.com/crew/list/jeremy-saulnier-favorite-films/"
                        },
                        {
                            title: "昆汀·塔伦蒂诺——最爱",
                            value: "https://letterboxd.com/zachaigley/list/quentin-tarantinos-199-favorite-films/"
                        },
                        {
                            title: "阿涅斯·瓦尔达——最爱",
                            value: "https://letterboxd.com/otisbdriftwood/list/agnes-vardas-favorite-films/"
                        },
                        {
                            title: "亚历克斯·温特——50部B面和稀有作品",
                            value: "https://letterboxd.com/crew/list/alex-winters-50-b-sides-and-rarities/"
                        },
                        {
                            title: "埃德加·赖特——1000部最爱",
                            value: "https://letterboxd.com/crew/list/edgar-wrights-1000-favorite-movies/"
                        }
                    ],
                },
                {
                    name: "url_customize",
                    title: "自定义片单",
                    type: "input",
                    belongTo: {
                        paramName: "input_type",
                        value: ["customize"],
                    },
                    description: "自定义片单，如：https://letterboxd.com/crew/list/2024-highest-rated-films/",
                },
                {
                    name: "sort_by",
                    title: "排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        {
                            title: "默认排序",
                            value: "default",
                        },
                        {
                            title: "反序",
                            value: "reverse",
                        },
                        {
                            title: "名称",
                            value: "name",
                        },
                        {
                            title: "流行度",
                            value: "popular",
                        },
                        {
                            title: "随机",
                            value: "shuffle",
                        },
                        {
                            title: "最后添加",
                            value: "added",
                        },
                        {
                            title: "最早添加",
                            value: "added-earliest",
                        },
                        {
                            title: "最新发行",
                            value: "release",
                        },
                        {
                            title: "最早发行",
                            value: "release-earliest",
                        },
                        {
                            title: "最高评分",
                            value: "rating",
                        },
                        {
                            title: "最低评分",
                            value: "rating-lowest",
                        },
                        {
                            title: "最短时长",
                            value: "shortest",
                        },
                        {
                            title: "最长时长",
                            value: "longest",
                        },
                    ],
                },
                {
                    name: "genre",
                    title: "类型",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        {
                            title: "所有类型",
                            value: "default",
                        },
                        {
                            title: "动作",
                            value: "action",
                        },
                        {
                            title: "冒险",
                            value: "adventure",
                        },
                        {
                            title: "动画",
                            value: "animation",
                        },
                        {
                            title: "喜剧",
                            value: "comedy",
                        },
                        {
                            title: "犯罪",
                            value: "crime",
                        },
                        {
                            title: "纪录片",
                            value: "documentary",
                        },
                        {
                            title: "戏剧",
                            value: "drama",
                        },
                        {
                            title: "家庭",
                            value: "family",
                        },
                        {
                            title: "奇幻",
                            value: "fantasy",
                        },
                        {
                            title: "历史",
                            value: "history",
                        },
                        {
                            title: "恐怖",
                            value: "horror",
                        },
                        {
                            title: "音乐",
                            value: "music",
                        },
                        {
                            title: "神秘",
                            value: "mystery",
                        },
                        {
                            title: "浪漫",
                            value: "romance",
                        },
                        {
                            title: "科幻",
                            value: "science-fiction",
                        },
                        {
                            title: "惊悚",
                            value: "thriller",
                        },
                        {
                            title: "电视电影",
                            value: "tv-movie",
                        },
                        {
                            title: "战争",
                            value: "war",
                        },
                        {
                            title: "西部",
                            value: "western",
                        }
                    ],
                },
                {
                    name: "decade",
                    title: "年代",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        {
                            title: "所有年代",
                            value: "default",
                        },
                        {
                            title: "2020年代",
                            value: "2020s",
                        },
                        {
                            title: "2010年代",
                            value: "2010s",
                        },
                        {
                            title: "2000年代",
                            value: "2000s",
                        },
                        {
                            title: "1990年代",
                            value: "1990s",
                        },
                        {
                            title: "1980年代",
                            value: "1980s",
                        },
                        {
                            title: "1970年代",
                            value: "1970s",
                        },
                        {
                            title: "1960年代",
                            value: "1960s",
                        },
                        {
                            title: "1950年代",
                            value: "1950s",
                        },
                        {
                            title: "1940年代",
                            value: "1940s",
                        },
                        {
                            title: "1930年代",
                            value: "1930s",
                        },
                        {
                            title: "1920年代",
                            value: "1920s",
                        },
                        {
                            title: "1910年代",
                            value: "1910s",
                        },
                        {
                            title: "1900年代",
                            value: "1900s",
                        },
                        {
                            title: "1890年代",
                            value: "1890s",
                        },
                        {
                            title: "1880年代",
                            value: "1880s",
                        },
                        {
                            title: "1870年代",
                            value: "1870s",
                        }
                    ],
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
    ],
    version: "1.0.1",
    requiredVersion: "0.0.1",
    description: "解析Letterboxd片单内的影片【五折码：CHEAP.5;七折码：CHEAP】",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

function extractLetterboxdUrlsFromResponse(responseData, minNum, maxNum) {
    // 创建Cheerio实例解析HTML
    let $ = Widget.html.load(responseData);

    // 定位所有包含data-target-link属性的影片容器div
    // 选择器匹配：li.poster-container 下的 div.film-poster（包含data-target-link属性）
    let filmContainers = $('li.posteritem div.react-component[data-target-link]');

    if (!filmContainers.length) {
        throw new Error("未找到包含data-target-link属性的电影容器");
    }

    // 提取并去重URL（从data-target-link属性获取，拼接完整域名）
    let letterboxdUrls = Array.from(new Set(
        filmContainers
            .map((i, el) => {
                // 获取data-target-link属性值（影片相对路径）
                const targetLink = $(el).data('target-link') || $(el).attr('data-target-link');
                // 过滤无效链接（确保路径以/film/开头，符合Letterboxd影片页规则）
                if (!targetLink || !targetLink.startsWith('/film/')) {
                    console.warn(`无效的影片链接属性值：${targetLink}`);
                    return null;
                }
                return `https://letterboxd.com${targetLink}`;
            })
            .get()
            .filter(Boolean) // 移除null值
    ));

    // 处理边界情况，确保索引在有效范围内
    const start = Math.max(0, minNum - 1);
    const end = Math.min(maxNum, letterboxdUrls.length);
    return letterboxdUrls.slice(start, end);
}

async function fetchImdbIdsFromLetterboxdUrls(letterboxdUrls) {
    let imdbIdPromises = letterboxdUrls.map(async (url) => {
        try {
            let detailResponse = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            });

            // 使用 Widget.html.load 解析详情页
            let $ = Widget.html.load(detailResponse.data);
            let imdbLinkEl = $('a[data-track-action="IMDb"]').first();

            if (!imdbLinkEl.length) return null;

            let href = imdbLinkEl.attr('href');
            let match = href.match(/title\/(tt\d+)/);

            return match ? `${match[1]}` : null;
        } catch {
            return null; // 忽略单个失败请求
        }
    });

    let imdbIds = [...new Set(
        (await Promise.all(imdbIdPromises))
            .filter(Boolean)
            .map((item) => item)
    )].map((id) => ({
        id,
        type: "imdb",
    }));
    console.log("请求imdbIds:", imdbIds);
    return imdbIds;
}

async function fetchLetterboxdData(url, headers = {}, minNum, maxNum) {
    try {
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                ...headers,
            },
        });

        console.log("请求结果:", response.data);

        let letterboxdUrls = extractLetterboxdUrlsFromResponse(response.data, minNum, maxNum);

        return await fetchImdbIdsFromLetterboxdUrls(letterboxdUrls);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadListItems(params = {}) {
    try {
        const page = params.page;
        const inputType = params.input_type || "";
        const listSelect = params.list_select || "";
        const urlCustomize = params.url_customize || "";
        const sortBy = params.sort_by || "default";
        const genre = params.genre || "default";
        const decade = params.decade || "default";
        const count = 20;
        const minNum = ((page - 1) % 5) * count + 1;
        const maxNum = ((page - 1) % 5) * count + 20;
        const letterboxdPage = Math.floor((page - 1) / 5) + 1;

        let listUrl;
        if (inputType === "select") {
            listUrl = listSelect
        } else {
            listUrl = urlCustomize
        }

        if (!listUrl) {
            throw new Error("必须提供 Letterboxd 片单完整URL");
        }

        // 确保 URL 以斜杠结尾，然后附加页面和排序参数
        let baseUrl = listUrl.endsWith('/') ? listUrl : `${listUrl}/`;
        let url = `${baseUrl}page/${letterboxdPage}/`;
        if (decade !== "default") {
            url += `decade/${decade}/`;
        }
        if (genre !== "default") {
            url += `genre/${genre}/`;
        }
        if (sortBy !== "default") {
            url += `by/${sortBy}/`;
        }

        return await fetchLetterboxdData(url, {}, minNum, maxNum);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}