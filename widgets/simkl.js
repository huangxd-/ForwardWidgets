// SIMKL 组件
// 说明：
// 1. 与 trakt.js 不同，SIMKL 直接走官方 JSON API，无需解析 HTML，返回数据里自带 imdb/tmdb，省去逐条抓详情页的步骤
// 2. SIMKL 的 access_token 官方声明 5 年有效（expires_in: 157680000），实际只有用户在 Connected Apps 主动解绑才会失效，所以基本填一次即可，无需像 trakt 那样频繁抓 cookie
// 3. 追剧/动漫日历走公共 CDN（data.simkl.in），不需要任何登录
// 4. 优先返回 imdb（type=imdb），仅当无 imdb 时回退 tmdb（type=tmdb + mediaType），以规避 README 中提到的 tmdb 缓存覆盖问题
WidgetMetadata = {
    id: "Simkl",
    title: "SIMKL我看&追剧日历",
    modules: [
        {
            title: "SIMKL我看",
            requiresWebView: false,
            functionName: "loadWatchlistItems",
            cacheDuration: 3600,
            params: [
                {
                    name: "client_id",
                    title: "Client ID",
                    type: "input",
                    description: "SIMKL应用的Client ID，前往 https://simkl.com/settings/developer/ 免费创建应用获取，未填写情况下接口不可用",
                },
                {
                    name: "access_token",
                    title: "Access Token",
                    type: "input",
                    description: "SIMKL的access_token（永久有效，除非主动解绑应用），需通过PIN/OAuth授权获取，未填写情况下接口不可用",
                },
                {
                    name: "type",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "全部",
                            value: "all",
                        },
                        {
                            title: "电影",
                            value: "movies",
                        },
                        {
                            title: "剧集",
                            value: "shows",
                        },
                        {
                            title: "动漫",
                            value: "anime",
                        },
                    ],
                },
                {
                    name: "status",
                    title: "状态",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "想看",
                            value: "plantowatch",
                        },
                        {
                            title: "在看",
                            value: "watching",
                        },
                        {
                            title: "看过",
                            value: "completed",
                        },
                        {
                            title: "搁置",
                            value: "hold",
                        },
                        {
                            title: "弃剧",
                            value: "dropped",
                        },
                        {
                            title: "随机想看(从想看列表中无序抽取9个影片)",
                            value: "random_plantowatch",
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
            title: "SIMKL追剧日历",
            requiresWebView: false,
            functionName: "loadCalendarItems",
            cacheDuration: 43200,
            params: [
                {
                    name: "type",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "动漫",
                            value: "anime",
                        },
                        {
                            title: "剧集",
                            value: "tv",
                        },
                    ],
                },
                {
                    name: "scope",
                    title: "范围",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "即将播出(今天起)",
                            value: "upcoming",
                        },
                        {
                            title: "全部",
                            value: "all",
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
            title: "SIMKL片单",
            requiresWebView: false,
            functionName: "loadListItems",
            cacheDuration: 43200,
            params: [
                {
                    name: "source",
                    title: "榜单",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "热门趋势",
                            value: "trending",
                        },
                        {
                            title: "全站最佳",
                            value: "best",
                        },
                    ],
                },
                {
                    name: "trending_type",
                    title: "类型",
                    type: "enumeration",
                    belongTo: {
                        paramName: "source",
                        value: ["trending"],
                    },
                    enumOptions: [
                        {
                            title: "电影",
                            value: "movies",
                        },
                        {
                            title: "剧集",
                            value: "tv",
                        },
                        {
                            title: "动漫",
                            value: "anime",
                        },
                    ],
                },
                {
                    name: "window",
                    title: "时间范围",
                    type: "enumeration",
                    belongTo: {
                        paramName: "source",
                        value: ["trending"],
                    },
                    enumOptions: [
                        {
                            title: "今日",
                            value: "today",
                        },
                        {
                            title: "本周",
                            value: "week",
                        },
                        {
                            title: "本月",
                            value: "month",
                        },
                    ],
                },
                {
                    name: "best_type",
                    title: "类型",
                    type: "enumeration",
                    belongTo: {
                        paramName: "source",
                        value: ["best"],
                    },
                    enumOptions: [
                        {
                            title: "剧集",
                            value: "tv",
                        },
                        {
                            title: "动漫",
                            value: "anime",
                        },
                    ],
                },
                {
                    name: "best_filter",
                    title: "排序",
                    type: "enumeration",
                    belongTo: {
                        paramName: "source",
                        value: ["best"],
                    },
                    enumOptions: [
                        {
                            title: "最多观看",
                            value: "watched",
                        },
                        {
                            title: "最高评分",
                            value: "voted",
                        },
                    ],
                },
                {
                    name: "client_id",
                    title: "Client ID",
                    type: "input",
                    belongTo: {
                        paramName: "source",
                        value: ["best"],
                    },
                    description: "SIMKL应用的Client ID，前往 https://simkl.com/settings/developer/ 免费创建应用获取。仅“全站最佳”需要（热门趋势无需登录）",
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
    ],
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "解析SIMKL想看、在看、看过、动漫/剧集追剧日历以及热门/最佳片单【30% off code：CHEAP】",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

const SIMKL_API = "https://api.simkl.com";
const SIMKL_CALENDAR = "https://data.simkl.in/calendar";
// 追剧日历与热门趋势均走公共 CDN（data.simkl.in），无需鉴权
const SIMKL_DISCOVER = "https://data.simkl.in/discover";
// app-name/app-version 为 SIMKL 推荐携带的标识参数
const SIMKL_APP_QUERY = "app-name=forward-widgets&app-version=1.0";
const PAGE_SIZE = 20;

// 公共 CDN 请求头（无需鉴权）
function publicHeaders() {
    return {
        "User-Agent": "forward-widgets/1.0",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    };
}

// 构造带鉴权的请求头
function buildHeaders(clientId, accessToken) {
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "forward-widgets/1.0",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    };
    if (clientId) {
        headers["simkl-api-key"] = clientId;
    }
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return headers;
}

// 在 url 上追加 client_id 以及 app 标识参数
function withQuery(url, clientId) {
    const sep = url.includes("?") ? "&" : "?";
    let query = SIMKL_APP_QUERY;
    if (clientId) {
        query += `&client_id=${encodeURIComponent(clientId)}`;
    }
    return `${url}${sep}${query}`;
}

// 统一解析 response.data（可能是字符串也可能是对象）
function parseData(data) {
    if (data == null) return null;
    return typeof data === "string" ? JSON.parse(data) : data;
}

// 把 SIMKL 的 ids 转换成 ForwardWidget 数据模型，优先 imdb，其次 tmdb
function buildMediaItem(ids, isMovie, title) {
    if (!ids) return null;
    if (ids.imdb) {
        return { id: ids.imdb, type: "imdb" };
    }
    const tmdb = ids.tmdb ?? ids.tmdb_id;
    if (tmdb) {
        return {
            id: tmdb,
            type: "tmdb",
            mediaType: isMovie ? "movie" : "tv",
            title: title,
        };
    }
    // 仅有 simkl/mal/anidb 等无法在 Forward 内解析，跳过
    return null;
}

async function enrichCalendarEntry(entry) {
    const tmdbId = entry.ids?.tmdb;
    const title = entry.title;
    if (!tmdbId || !title) return null;
    const tmdbResults = await Widget.tmdb.get('/search/multi', {
        params: {
            query: title,
            language: 'zh-CN',
        }
    });
    if (tmdbResults && tmdbResults.results) {
        const matched = tmdbResults.results.find(r => String(r.id) === String(tmdbId));
        if (matched) {
            const isMovie = matched.media_type !== 'tv';
            const displayTitle = matched.title || matched.name || title;
            return buildMediaItem(entry.ids, isMovie, displayTitle);
        }
    }
    return null;
}

// 按 page 切片（SIMKL 接口一次性返回全部，所以在本地分页）
function paginate(items, page) {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
}

// 按 id 去重，保持顺序
function dedupeById(items) {
    const seen = new Set();
    const result = [];
    for (const item of items) {
        if (!item || !item.id) continue;
        const key = `${item.type}:${item.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(item);
    }
    return result;
}

async function loadWatchlistItems(params = {}) {
    try {
        const page = params.page || 1;
        const clientId = params.client_id || "";
        const accessToken = params.access_token || "";
        const type = params.type || "shows";
        let status = params.status || "";

        if (!clientId) {
            throw new Error("必须提供 SIMKL Client ID");
        }
        if (!accessToken) {
            throw new Error("必须提供 SIMKL Access Token");
        }

        const random = status === "random_plantowatch";
        if (random) {
            status = "plantowatch";
            if (page > 1) {
                return [];
            }
        }

        let allItems = [];

        if (type === "all") {
            // 分别请求三种类型，合并结果
            const types = ["movies", "shows", "anime"];
            const requests = types.map(async (t) => {
                const url = withQuery(`${SIMKL_API}/sync/all-items/${t}/${status}`, clientId);
                const response = await Widget.http.get(url, {
                    headers: buildHeaders(clientId, accessToken),
                });
                const data = parseData(response.data);
                if (!data) return [];
                const list = data[t] || [];
                return list.map((entry) => {
                    const media = entry.movie || entry.show || {};
                    const isMovie = t === "movies" || (t === "anime" && entry.anime_type === "movie");
                    return buildMediaItem(media.ids, isMovie);
                }).filter(Boolean);
            });
            const results = await Promise.all(requests);
            allItems = results.flat();
        } else {
            const url = withQuery(`${SIMKL_API}/sync/all-items/${type}/${status}`, clientId);
            const response = await Widget.http.get(url, {
                headers: buildHeaders(clientId, accessToken),
            });
            const data = parseData(response.data);
            if (!data) {
                return [];
            }
            const list = data[type] || [];
            allItems = list.map((entry) => {
                const media = entry.movie || entry.show || {};
                const isMovie = type === "movies" || (type === "anime" && entry.anime_type === "movie");
                return buildMediaItem(media.ids, isMovie);
            }).filter(Boolean);
        }

        let items = dedupeById(allItems);

        if (random) {
            const shuffled = items.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(9, shuffled.length));
        }

        return paginate(items, page);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadCalendarItems(params = {}) {
    try {
        const page = params.page || 1;
        const type = params.type || "anime";
        const scope = params.scope || "upcoming";

        // 公共 CDN，无需鉴权
        const url = `${SIMKL_CALENDAR}/${type}.json`;
        const response = await Widget.http.get(url, {
            headers: publicHeaders(),
        });

        const data = parseData(response.data);
        if (!data || !Array.isArray(data)) {
            return [];
        }

        let list = data;

        // 仅保留今天及之后播出的内容（按日期字符串前缀比较即可）
        if (scope !== "all") {
            const todayStr = new Date().toISOString().slice(0, 10);
            list = list.filter((entry) => (entry.date || "").slice(0, 10) >= todayStr);
        }

        // 按播出日期升序
        list = list.sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

        // 先分页，只处理当前页的条目
        const pageItems = paginate(list, page);
    
        // 对当前页条目通过TMDB API获取媒体类型
        const itemsWithMediaType = await Promise.all(pageItems.map(async (entry) => {
            return enrichCalendarEntry(entry);
        }));
        
        let items = itemsWithMediaType.filter(Boolean);

        items = dedupeById(items);

        return items;
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

// 加载片单：热门趋势(公共CDN，条目自带imdb/tmdb) 或 全站最佳(需按simkl_id逐条解析)
async function loadListItems(params = {}) {
    try {
        const page = params.page || 1;
        const source = params.source || "trending";
        if (source === "best") {
            return await loadBestList(params, page);
        }
        return await loadTrendingList(params, page);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

// 热门趋势榜：data.simkl.in/discover/trending/{type}/{window}_100.json
// 条目自带 imdb/tmdb，可直接转换，无需鉴权
async function loadTrendingList(params, page) {
    const type = params.trending_type || "movies";     // movies / tv / anime
    const timeWindow = params.window || "week";         // today / week / month
    const url = `${SIMKL_DISCOVER}/trending/${type}/${timeWindow}_100.json`;
    const response = await Widget.http.get(url, {
        headers: publicHeaders(),
    });

    const data = parseData(response.data);
    if (!data || !Array.isArray(data)) {
        return [];
    }

    const isMovie = type === "movies";
    let items = data.map((entry) => buildMediaItem(entry.ids, isMovie)).filter(Boolean);
    items = dedupeById(items);
    return paginate(items, page);
}

// 全站最佳榜：/{type}/best/{filter}（token 非必需，仅需 client_id）
// 注意：该接口列表只返回 simkl_id（连 extended=full 也不给 imdb/tmdb），
// 需再用详情接口把“当前页”逐条解析出 imdb/tmdb。仅解析当前页(PAGE_SIZE 条)、并发请求，
// 配合 12h 缓存控制开销。best 仅支持 tv/anime（无电影）。
async function loadBestList(params, page) {
    const type = params.best_type || "tv";          // tv / anime
    const filter = params.best_filter || "watched"; // watched / voted
    const clientId = params.client_id || "";

    if (!clientId) {
        throw new Error("“全站最佳”需要提供 SIMKL Client ID");
    }

    const url = withQuery(`${SIMKL_API}/${type}/best/${filter}`, clientId);
    const response = await Widget.http.get(url, {
        headers: buildHeaders(clientId, ""),
    });

    const data = parseData(response.data);
    if (!data || !Array.isArray(data)) {
        return [];
    }

    // 先本地分页，只解析当前页的条目，避免一次性发起上百个详情请求
    const pageEntries = paginate(data, page);
    const resolved = await Promise.all(
        pageEntries.map((entry) => resolveBestEntry(type, entry, clientId))
    );
    return dedupeById(resolved.filter(Boolean));
}

// 把 best 条目的 simkl_id 通过详情接口解析成带 imdb/tmdb 的数据模型
async function resolveBestEntry(type, entry, clientId) {
    const ids = entry && entry.ids ? entry.ids : null;
    const simklId = ids ? (ids.simkl_id ?? ids.simkl) : null;
    if (!simklId) return null;
    try {
        const url = withQuery(`${SIMKL_API}/${type}/${simklId}?extended=full`, clientId);
        const response = await Widget.http.get(url, {
            headers: buildHeaders(clientId, ""),
        });
        const detail = parseData(response.data);
        const isMovie = !!detail && detail.type === "movie";
        return buildMediaItem(detail ? detail.ids : null, isMovie);
    } catch (error) {
        return null;
    }
}
