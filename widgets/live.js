// 电视直播插件
WidgetMetadata = {
    id: "live",
    title: "直播(电视+网络)",
    detailCacheDuration: 60,
    modules: [
        {
            title: "直播(电视+网络)",
            requiresWebView: false,
            functionName: "loadLiveItems",
            cacheDuration: 21600,
            params: [
                {
                    name: "url",
                    title: "订阅链接",
                    type: "input",
                    description: "输入直播订阅链接地址",
                    placeholders: [
                        {
                            title: "Kimentanm",
                            value: "https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u"
                        },
                        {
                            title: "网络直播",
                            value: "https://tv.iill.top/m3u/Live"
                        },
                        {
                            title: "smart(港澳台)",
                            value: "https://smart.pendy.dpdns.org/m3u/merged_judy.m3u"
                        },
                        {
                            title: "YanG-Gather1",
                            value: "https://tv.iill.top/m3u/Gather"
                        },
                        {
                            title: "YanG-Gather2",
                            value: "https://raw.githubusercontent.com/YanG-1989/m3u/main/Gather.m3u"
                        },
                        {
                            title: "suxuang",
                            value: "https://bit.ly/suxuang-v4"
                        },
                        {
                            title: "PlutoTV-美国",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_US.m3u"
                        },
                        {
                            title: "PlutoTV-墨西哥",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_MX.m3u"
                        },
                        {
                            title: "PlutoTV-意大利",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_IT.m3u"
                        },
                        {
                            title: "PlutoTV-英国",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_GB.m3u"
                        },
                        {
                            title: "PlutoTV-法国",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_FR.m3u"
                        },
                        {
                            title: "PlutoTV-西班牙",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_ES.m3u"
                        },
                        {
                            title: "PlutoTV-德国",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_DE.m3u"
                        },
                        {
                            title: "PlutoTV-智利",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_CL.m3u"
                        },
                        {
                            title: "PlutoTV-加拿大",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_CA.m3u"
                        },
                        {
                            title: "PlutoTV-巴西",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_BR.m3u"
                        },
                        {
                            title: "PlutoTV-阿根廷",
                            value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_AR.m3u"
                        },
                        {
                            title: "全球",
                            value: "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8"
                        },
                        {
                            title: "IPTV1",
                            value: "https://raw.githubusercontent.com/skddyj/iptv/main/IPTV.m3u"
                        },
                        {
                            title: "IPTV2-CN",
                            value: "https://iptv-org.github.io/iptv/countries/cn.m3u"
                        },
                        {
                            title: "IPTV3",
                            value: "https://cdn.jsdelivr.net/gh/Guovin/iptv-api@gd/output/result.m3u"
                        },
                    ]
                },
                {
                    name: "group_filter",
                    title: "按组关键字过滤(选填)，如央视，会筛选出所有group-title中包含央视的频道",
                    type: "input",
                    description: "输入组关键字，如央视，会筛选出所有group-title中包含央视的频道",
                    placeholders: [
                        {
                            title: "全部",
                            value: "",
                        },
                        {
                            title: "央视&卫视",
                            value: ".*(央视|卫视).*",
                        },
                        {
                            title: "央视",
                            value: "央视",
                        },
                        {
                            title: "卫视",
                            value: "卫视",
                        },
                    ]
                },
                {
                    name: "name_filter",
                    title: "按频道名关键字过滤(选填)，如卫视，会筛选出所有频道名中包含卫视的频道",
                    type: "input",
                    description: "输入频道名关键字过滤(选填)，如卫视，会筛选出所有频道名中包含卫视的频道",
                    placeholders: [
                        {
                            title: "全部",
                            value: "",
                        },
                        {
                            title: "B站&虎牙&斗鱼",
                            value: ".*(B站|虎牙|斗鱼).*",
                        },
                        {
                            title: "英雄联盟",
                            value: "英雄联盟",
                        },
                        {
                            title: "王者荣耀",
                            value: "王者荣耀",
                        },
                        {
                            title: "绝地求生",
                            value: "绝地求生",
                        },
                        {
                            title: "和平精英",
                            value: "和平精英",
                        },
                    ]
                },
                {
                    name: "bg_color",
                    title: "台标背景色(只对源里不自带台标的起作用)",
                    type: "input",
                    description: "支持RGB颜色，如DCDCDC",
                    value: "DCDCDC",
                    placeholders: [
                        {
                            title: "亮灰色",
                            value: "DCDCDC",
                        },
                        {
                            title: "钢蓝",
                            value: "4682B4",
                        },
                        {
                            title: "浅海洋蓝",
                            value: "20B2AA",
                        },
                        {
                            title: "浅粉红",
                            value: "FFB6C1",
                        },
                        {
                            title: "小麦色",
                            value: "F5DEB3",
                        },
                    ]
                },
                {
                    name: "direction",
                    title: "台标优先显示方向",
                    type: "enumeration",
                    description: "台标优先显示方向，默认为竖向",
                    value: "V",
                    enumOptions: [
                        {title: "竖向", value: "V"},
                        {title: "横向", value: "H"},
                    ]
                },
            ],
        },
    ],
    version: "1.0.10",
    requiredVersion: "0.0.1",
    description: "解析直播订阅链接【五折码：CHEAP.5;七折码：CHEAP】",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};


async function loadLiveItems(params = {}) {
    try {
        const url = params.url || "";
        const groupFilter = params.group_filter || "";
        const nameFilter = params.name_filter || "";
        const bgColor = params.bg_color || "";
        const direction = params.direction || "";

        if (!url) {
            throw new Error("必须提供电视直播订阅链接");
        }

        // 从URL获取M3U内容
        const response = await this.fetchM3UContent(url);
        if (!response) return [];

        // 获取台标数据
        const iconList = await this.fetchIconList(url);

        // 解析M3U内容
        const items = parseM3UContent(response, iconList, bgColor, direction);

        // 应用过滤器
        const filteredItems = items.filter(item => {
            // 组过滤（支持正则表达式）
            const groupMatch = !groupFilter || (() => {
                try {
                    // 尝试将输入作为正则表达式解析
                    const regex = new RegExp(groupFilter, 'i');
                    return regex.test(item.metadata?.group || '');
                } catch (e) {
                    // 若解析失败则回退到普通字符串包含检查（大小写无关）
                    return (item.metadata?.group?.toLowerCase() || '').includes(groupFilter.toLowerCase());
                }
            })();

            // 名称过滤（支持正则表达式）
            const nameMatch = !nameFilter || (() => {
                try {
                    // 尝试将输入作为正则表达式解析
                    const regex = new RegExp(nameFilter, 'i');
                    return regex.test(item.title || '');
                } catch (e) {
                    // 若解析失败则回退到普通字符串包含检查（大小写无关）
                    return (item.title?.toLowerCase() || '').includes(nameFilter.toLowerCase());
                }
            })();

            // 只有当两个条件都满足时才返回 true
            return groupMatch && nameMatch;
        });

        // 获取过滤后的总数
        const totalCount = filteredItems.length;

        // 为每个频道的标题添加 (x/y) 标记
        return filteredItems.map((item, index) => ({
            ...item,
            title: `${item.title} (${index + 1}/${totalCount})`
        }));
    } catch (error) {
        console.error(`解析电视直播链接时出错: ${error.message}`);
        return [];
    }
}


async function fetchM3UContent(url) {
    try {
        const response = await Widget.http.get(url, {
            headers: {
                'User-Agent': 'AptvPlayer/1.4.6',
            }
        });

        console.log("请求结果:", response.data);

        if (response.data && response.data.includes("#EXTINF")) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error(`获取M3U内容时出错: ${error.message}`);
        return null;
    }
}


async function fetchIconList() {
    try {
        const response = await Widget.http.get("https://api.github.com/repos/fanmingming/live/contents/tv", {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        console.log("请求结果:", response.data);

        const iconList = response.data.map(item => item.name.replace('.png', ''));

        console.log("iconList:", iconList); // ["4K电影"]

        return iconList;
    } catch (error) {
        console.error(`获取台标数据时出错: ${error.message}`);
        return [];
    }
}


function parseM3UContent(content, iconList, bgColor, direction) {
    if (!content || !content.trim()) return [];

    const lines = content.split(/\r?\n/);
    const items = [];
    let currentItem = null;

    // 正则表达式用于匹配M3U标签和属性
    const extInfRegex = /^#EXTINF:(-?\d+)(.*),(.*)$/;
    const groupRegex = /group-title="([^"]+)"/;
    const tvgNameRegex = /tvg-name="([^"]+)"/;
    const tvgLogoRegex = /tvg-logo="([^"]+)"/;
    const tvgIdRegex = /tvg-id="([^"]+)"/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 跳过空行和注释行
        if (!line || line.startsWith('#EXTM3U')) continue;

        // 匹配#EXTINF行
        if (line.startsWith('#EXTINF:')) {
            const match = line.match(extInfRegex);
            if (match) {
                const duration = match[1];
                const attributes = match[2];
                const title = match[3].trim();

                // 提取属性
                const groupMatch = attributes.match(groupRegex);
                const tvgNameMatch = attributes.match(tvgNameRegex);
                const tvgLogoMatch = attributes.match(tvgLogoRegex);
                const tvgIdMatch = attributes.match(tvgIdRegex);

                const group = groupMatch ? groupMatch[1] : '未分类';
                const tvgName = tvgNameMatch ? tvgNameMatch[1] : title;
                const cover = tvgLogoMatch ? tvgLogoMatch[1] : '';
                const tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

                // 创建新的直播项目
                currentItem = {
                    duration,
                    title,
                    group,
                    tvgName,
                    tvgId,
                    cover,
                    url: null
                };
            }
        }
        // 匹配直播URL行
        else if (currentItem && line && !line.startsWith('#')) {
            const url = line;
            console.log(currentItem.title);
            // const icon = iconList.includes(currentItem.title)
            //     ? `https://live.fanmingming.cn/tv/${currentItem.title}.png`
            //     : "";
            if (!bgColor) {
                bgColor = "DCDCDC";
            }
            const posterIcon = iconList.includes(currentItem.title)
                ? `https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,w-bw_mul_3.5,h-bh_mul_3,bg-${bgColor},lfo-center,l-image,i-${currentItem.title}.png,lfo-center,l-end,l-end/${currentItem.title}.png`
                : "";
            console.log("posterIcon:", posterIcon);
            const backdropIcon = iconList.includes(currentItem.title)
                ? `https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,w-bw_mul_1.5,h-bh_mul_4,bg-${bgColor},lfo-center,l-image,i-${currentItem.title}.png,lfo-center,l-end,l-end/${currentItem.title}.png`
                : "";
            console.log("backdropIcon:", backdropIcon);

            // 构建最终的项目对象
            const item = {
                id: url,
                type: "url",
                title: currentItem.title,
                // posterPath: posterIcon || currentItem.cover || "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png",
                backdropPath: backdropIcon || currentItem.cover || "https://i.miji.bid/2025/05/17/c4a0703b68a4d2313a27937d82b72b6a.png",
                previewUrl: "", // 直播通常没有预览URL
                link: url,
                playerType: "system",
                // 额外的元数据
                metadata: {
                    group: currentItem.group,
                    tvgName: currentItem.tvgName,
                    tvgId: currentItem.tvgId
                }
            };
            if (!direction || direction === "V") {
                item['posterPath'] = posterIcon || currentItem.cover || "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png";
            }

            items.push(item);
            currentItem = null; // 重置当前项目
        }
    }

    return items;
}


async function loadDetail(link) {
    let videoUrl = link;
    let childItems = []

    // const formats = ['m3u8', 'mp4', 'mp3', 'flv', 'avi', 'mov', 'wmv', 'webm', 'ogg', 'mkv', 'ts'];
    // if (!formats.some(format => link.includes(format))) {
    //     // 获取重定向location
    //     const url = `https://redirect-check.hxd.ip-ddns.com/redirect-check?url=${link}`;
    //
    //     const response = await Widget.http.get(url, {
    //         headers: {
    //             "User-Agent": "AptvPlayer/1.4.6",
    //         },
    //     });
    //
    //     console.log(response.data)
    //
    //     if (response.data && response.data.location && formats.some(format => response.data.location.includes(format))) {
    //         videoUrl = response.data.location;
    //     }
    //
    //     if (response.data && response.data.error && response.data.error.includes("超时")) {
    //         const hint_item = {
    //             id: videoUrl,
    //             type: "url",
    //             title: "超时/上面直播不可用",
    //             posterPath: "https://i.miji.bid/2025/05/17/561121fb0ba6071d4070627d187b668b.png",
    //             backdropPath: "https://i.miji.bid/2025/05/17/561121fb0ba6071d4070627d187b668b.png",
    //             link: videoUrl,
    //             playerType: "system",
    //         };
    //         childItems = [hint_item]
    //     }
    // }

    const item = {
        id: link,
        type: "detail",
        videoUrl: videoUrl,
        customHeaders: {
            "Referer": link,
            "User-Agent": "AptvPlayer/1.4.6",
        },
        playerType: "system",
        childItems: childItems,
    };

    return item;
}
