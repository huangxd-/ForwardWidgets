// 雅图组件
WidgetMetadata = {
    id: "yatu",
    title: "雅图(每日放送+点播排行榜+评分排行榜)",
    modules: [
        {
            title: "每日放送",
            requiresWebView: false,
            functionName: "loadLatestItems",
            cacheDuration: 21600,
            params: [
                {
                    name: "genre",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "动漫",
                            value: "sin1",
                        },
                        {
                            title: "电影",
                            value: "sin2",
                        },
                        {
                            title: "电视剧",
                            value: "sin3",
                        },
                    ],
                },
                {
                    name: "start_date",
                    title: "开始日期：n天前（0表示今天，-1表示昨天）",
                    type: "input",
                    description: "0表示今天，-1表示昨天，未填写情况下接口不可用",
                    placeholders: [
                        {
                            title: "今天",
                            value: "0"
                        },
                        {
                            title: "昨天",
                            value: "-1"
                        },
                        {
                            title: "前天",
                            value: "-2"
                        },
                        {
                            title: "大前天",
                            value: "-3"
                        },
                    ]
                },
                {
                    name: "days",
                    title: "天数（从开始日期开始的后面m天的数据）",
                    type: "input",
                    description: "如：3，会返回从开始日期起的3天内的节目，未填写情况下接口不可用",
                    value: "1",
                    placeholders: [
                        {
                            title: "1",
                            value: "1"
                        },
                        {
                            title: "2",
                            value: "2"
                        },
                        {
                            title: "3",
                            value: "3"
                        },
                        {
                            title: "4",
                            value: "4"
                        },
                    ]
                },
            ],
        },
        {
            title: "点播排行榜",
            requiresWebView: false,
            functionName: "loadClickItems",
            cacheDuration: 21600,
            params: [
                {
                    name: "genre",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "连载动漫",
                            value: "dm-lz",
                        },
                        {
                            title: "剧场动漫",
                            value: "dm-jc",
                        },
                        {
                            title: "电影",
                            value: "dy",
                        },
                        {
                            title: "香港电影",
                            value: "dy-xianggan",
                        },
                        {
                            title: "欧美电影",
                            value: "dy-om",
                        },
                        {
                            title: "电视剧",
                            value: "tv",
                        },
                        {
                            title: "美剧",
                            value: "tv-meiju",
                        },
                        {
                            title: "综艺",
                            value: "tv-zy",
                        },
                    ],
                },
                {
                    name: "sort_by",
                    title: "时间",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "今日",
                            value: "db_lz1",
                        },
                        {
                            title: "本月",
                            value: "db_lz2",
                        },
                        {
                            title: "历史",
                            value: "db_lz3",
                        },
                    ],
                },
            ],
        },
        {
            title: "评分排行榜",
            requiresWebView: false,
            functionName: "loadScoreItems",
            cacheDuration: 86400,
            params: [
                {
                    name: "genre",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "动漫",
                            value: "p-dm",
                        },
                        {
                            title: "电影",
                            value: "p-dy",
                        },
                        {
                            title: "电视剧",
                            value: "p-tv",
                        },
                    ],
                },
                {
                    name: "sort_by",
                    title: "等级",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "非常好看",
                            value: "tv1",
                        },
                        {
                            title: "好看",
                            value: "tv2",
                        },
                        {
                            title: "一般",
                            value: "tv3",
                        },
                        {
                            title: "烂片",
                            value: "tv4",
                        },
                    ],
                },
            ],
        },
    ],
    version: "1.0.7",
    requiredVersion: "0.0.1",
    description: "解析雅图每日放送更新以及各类排行榜【五折码：CHEAP.5;七折码：CHEAP】",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

// 基础获取TMDB数据方法
async function fetchTmdbData(key, mediaType) {
    const tmdbResults = await Widget.tmdb.get(`/search/${mediaType}`, {
        params: {
            query: key,
            language: "zh_CN",
        }
    });
    //打印结果
    // console.log("搜索内容：" + key)
    // console.log("tmdbResults:" + JSON.stringify(tmdbResults, null, 2));
    // console.log("tmdbResults.total_results:" + tmdbResults.total_results);
    // console.log("tmdbResults.results[0]:" + tmdbResults.results[0]);
    return tmdbResults.results;
}

function normalizeYatuTitle(title) {
    const trimmedTitle = title.trim();
    return trimmedTitle.replace(/ *第[^季]*季(?:~[^季]+季)?| *\d+~\d+季| *\d+季/, '') || trimmedTitle;
}

function createYatuParser(data) {
    if (Widget.html && typeof Widget.html.load === 'function') {
        const $ = Widget.html.load(data);
        return {
            root: null,
            select(context, selector) {
                return context ? $(context).find(selector).toArray() : $(selector).toArray();
            },
            text(element) {
                return element ? $(element).text().trim() : '';
            },
            attr(element, attrName) {
                return element ? ($(element).attr(attrName) || '') : '';
            },
        };
    }

    if (!Widget.dom || typeof Widget.dom.parse !== 'function') {
        throw new Error('当前环境缺少 HTML 解析能力：需要 Widget.html.load 或 Widget.dom.parse');
    }

    const docId = Widget.dom.parse(data);
    return {
        root: docId,
        select(context, selector) {
            return Widget.dom.select(context ?? docId, selector);
        },
        text(element) {
            return element ? Widget.dom.text(element).trim() : '';
        },
        attr(element, attrName) {
            return element ? (Widget.dom.attr(element, attrName) || '') : '';
        },
    };
}

function getFirstMatchedElement(parser, context, selectors) {
    for (const selector of selectors) {
        const elements = parser.select(context, selector);
        if (elements && elements.length > 0) {
            return elements[0];
        }
    }
    return null;
}

function parseYatuDate(value, today) {
    const text = (value || '').trim();
    const baseDate = new Date(today);

    if (/^\d{1,2}:\d{2}:\d{2}$/.test(text)) {
        return baseDate;
    }

    if (text === '昨天') {
        baseDate.setDate(baseDate.getDate() - 1);
        return baseDate;
    }

    if (text === '前天') {
        baseDate.setDate(baseDate.getDate() - 2);
        return baseDate;
    }

    const dateMatch = text.match(/^(\d{2,4})\/(\d{1,2})(?:\/(\d{1,2}))?/);
    if (!dateMatch) {
        return null;
    }

    let year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3] || 1);

    if (year < 100) {
        const currentYear = today.getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        year = year <= (currentYear % 100) ? century + year : century - 100 + year;
    }

    const parsedDate = new Date(year, month - 1, day);
    return isNaN(parsedDate) ? null : parsedDate;
}

function getItemInfos(data, startDateInput, days, genre) {
    let parser = createYatuParser(data);

    let table = getFirstMatchedElement(parser, parser.root, [`table#${genre}`, `#${genre}`]);

    if (!table) {
        console.error(`没有解析到相应table`);
        return [];
    }

    let tdElements = parser.select(table, 'td');

    let today = new Date();

    let results = [];

    tdElements.forEach(td => {
        // Get all text content within the td
        let tdContent = parser.text(td);

        let spanTexts = parser.select(td, 'span').map(span => parser.text(span));
        let timeText = spanTexts.find(text => /^\d{1,2}:\d{2}:\d{2}$/.test(text) || text === '昨天' || text === '前天' || /^\d{2,4}\/\d{1,2}(?:\/\d{1,2})?/.test(text)) || '';

        // Extract the link and title from the <a> tag
        let linkEl = parser.select(td, 'a')[0];
        let linkHref = parser.attr(linkEl, 'href');
        let linkText = parser.text(linkEl);

        // Extract the episode information from the span (if exists)
        let episodeSpan = parser.select(td, 'span:not([style])')[0];
        let episodeText = parser.text(episodeSpan);

        if (linkText && timeText) {
            results.push({
                title: normalizeYatuTitle(linkText),
                link: linkHref,
                episodes: episodeText,
                time: timeText,
                fullContent: tdContent
            });
        }
    });

    today.setHours(0, 0, 0, 0); // 规范化时间

    // 计算开始和结束日期
    let startDate = new Date(today);
    startDate.setDate(today.getDate() + Number(startDateInput));
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Number(days) - 1);
    endDate.setHours(0, 0, 0, 0);

    // 过滤结果
    return results.filter(item => {
        const itemDate = parseYatuDate(item.time, today);
        if (!itemDate) {
            return false;
        }

        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate;
    });
}

async function loadLatestItems(params = {}) {
    try {
        const genre = params.genre || "";
        const startDateInput = params.start_date ?? "";
        const days = params.days ?? "";

        if (!genre || startDateInput === "" || days === "") {
            throw new Error("必须提供分类、开始日期、天数");
        }

        const mediaTypeDict = {
            sin1: 'tv',
            sin2: 'movie',
            sin3: 'tv',
        };

        const response = await Widget.http.get("https://gist.githubusercontent.com/huangxd-/28a30eac8051ccb05a43c6f49a117286/raw/zuijin.asp", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const itemInfos = getItemInfos(response.data, startDateInput, days, genre);

        const promises = itemInfos.map(async (itemInfo) => {
            // 模拟API请求
            const tmdbDatas = await fetchTmdbData(itemInfo.title, mediaTypeDict[genre])

            if (tmdbDatas.length !== 0) {
                return {
                    id: tmdbDatas[0].id,
                    type: "tmdb",
                    title: tmdbDatas[0].title ?? tmdbDatas[0].name,
                    description: tmdbDatas[0].overview,
                    releaseDate: tmdbDatas[0].release_date ?? tmdbDatas[0].first_air_date,
                    backdropPath: tmdbDatas[0].backdrop_path,
                    posterPath: tmdbDatas[0].poster_path,
                    rating: tmdbDatas[0].vote_average,
                    mediaType: mediaTypeDict[genre],
                };
            } else {
                return null;
            }
        });

        // 等待所有请求完成
        const items = (await Promise.all(promises)).filter(Boolean);

        return items;
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

function getClickItemInfos(data, typ) {
    let parser = createYatuParser(data);

    let table = getFirstMatchedElement(parser, parser.root, [`table#${typ}`, `#${typ}`]);

    if (!table) {
        console.error(`没有解析到相应table`);
        return [];
    }

    return [...new Set(
        Array.from(
            parser.select(table, 'a[target="_blank"]')
        ).map(a => normalizeYatuTitle(parser.text(a))).filter(Boolean)
    )];
}

async function fetchFinalItems(genre, typ, mediaTypeDict, suffixDict) {
    const response = await Widget.http.get(`https://gist.githubusercontent.com/huangxd-/28a30eac8051ccb05a43c6f49a117286/raw/${genre}.${suffixDict[genre]}`, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    const itemInfos = getClickItemInfos(response.data, typ);

    const promises = itemInfos.map(async (title) => {
        // 模拟API请求
        const tmdbDatas = await fetchTmdbData(title, mediaTypeDict[genre])

        if (tmdbDatas.length !== 0) {
            return {
                id: tmdbDatas[0].id,
                type: "tmdb",
                title: tmdbDatas[0].title ?? tmdbDatas[0].name,
                description: tmdbDatas[0].overview,
                releaseDate: tmdbDatas[0].release_date ?? tmdbDatas[0].first_air_date,
                backdropPath: tmdbDatas[0].backdrop_path,
                posterPath: tmdbDatas[0].poster_path,
                rating: tmdbDatas[0].vote_average,
                mediaType: mediaTypeDict[genre],
            };
        } else {
            return null;
        }
    });

    // 等待所有请求完成
    const items = (await Promise.all(promises)).filter(Boolean);

    return items;
}

async function loadClickItems(params = {}) {
    try {
        const genre = params.genre || "";
        const typ = params.sort_by || "";

        if (!genre || !typ) {
            throw new Error("必须提供分类、时间");
        }

        const mediaTypeDict = {
            'dm-lz': 'tv',
            'dm-jc': 'movie',
            'dy': 'movie',
            'dy-xianggan': 'movie',
            'dy-om': 'movie',
            'tv': 'tv',
            'tv-meiju': 'tv',
            'tv-zy': 'tv',
        };

        const suffixDict = {
            'dm-lz': 'htm',
            'dm-jc': 'htm',
            'dy': 'htm',
            'dy-xianggan': 'html',
            'dy-om': 'htm',
            'tv': 'htm',
            'tv-meiju': 'html',
            'tv-zy': 'htm',
        };

        return await fetchFinalItems(genre, typ, mediaTypeDict, suffixDict);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadScoreItems(params = {}) {
    try {
        const genre = params.genre || "";
        const typ = params.sort_by || "";

        if (!genre || !typ) {
            throw new Error("必须提供分类、等级");
        }

        const mediaTypeDict = {
            'p-dm': 'tv',
            'p-dy': 'movie',
            'p-tv': 'tv',
        };

        const suffixDict = {
            'p-dm': 'htm',
            'p-dy': 'htm',
            'p-tv': 'htm',
        };

        return await fetchFinalItems(genre, typ, mediaTypeDict, suffixDict);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}
