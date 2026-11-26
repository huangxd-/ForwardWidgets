#!/usr/bin/env node
/**
 * 追剧日历插件自检脚本
 *
 * 用途：追剧日历的数据源是第三方 App 的腾讯云 COS 桶（带 Referer 防盗链），
 * 源站随时可能收紧策略或改动 JSON 结构。本脚本用真实的 HTTP 请求跑一遍
 * 全部模块，快速区分是「防盗链又变了」还是「解析结构变了」。
 *
 * 用法：
 *   node scripts/check_zhuijurili.js
 *
 * 退出码：0 全部模块有数据；1 有模块取不到数据或抛错。
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WIDGET_PATH = path.resolve(__dirname, "../widgets/zhuijurili.js");

// 走 COS 的分类（今日播出/明日播出/今日推荐/各项榜单/地区榜单）
const COS_SORTS = [
    "今天播出的剧集",
    "今天播出的番剧",
    "明天播出的剧集",
    "明天播出的番剧",
    "今日推荐",
    "现正热播",
    "人气 Top 10",
    "新剧雷达",
    "热门国漫",
    "已收官好剧",
    "华语热门",
    "本季新番",
    "国产剧",
    "日剧",
    "英美剧",
    "番剧",
    "韩剧",
    "港台剧",
];

// 走 gist 的播出周历
const WEEK_FILES = ["juji_week.json", "fanju_week.json", "guoman_week.json", "zongyi_week.json"];

/** 真实 HTTP 请求，非 2xx 直接抛错（与 Widget.http 的报错形态对齐） */
async function realHttpGet(url, options = {}) {
    const response = await fetch(url, { headers: options.headers || {} });
    const text = await response.text();
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text.replace(/\s+/g, " ").slice(0, 120)}`);
    }
    // 真实运行时 Widget.http 会把 JSON 解析成对象，这里保持一致
    try {
        return { data: JSON.parse(text) };
    } catch (error) {
        return { data: text };
    }
}

/** 忽略防盗链的桩：模拟源站把白名单改掉之后的行为 */
async function alwaysForbiddenHttpGet(url) {
    throw new Error(`HTTP 403: Forbidden (${url.slice(0, 60)}…)`);
}

function createStubTmdb() {
    return {
        async get(apiPath) {
            const segments = String(apiPath).split("/").filter(Boolean);
            const id = Number(segments[segments.length - 1]) || 1;
            const isMovie = segments[0] === "movie";
            return {
                id,
                title: isMovie ? `桩标题 ${id}` : undefined,
                name: isMovie ? undefined : `桩标题 ${id}`,
                overview: "自检桩数据",
                release_date: isMovie ? "2026-01-01" : undefined,
                first_air_date: isMovie ? undefined : "2026-01-01",
                backdrop_path: "/stub-backdrop.jpg",
                poster_path: "/stub-poster.jpg",
                vote_average: 8.0,
            };
        },
    };
}

function loadWidget(httpGet) {
    const logs = [];
    const sandbox = {
        console: {
            log: (...args) => logs.push(["log", ...args]),
            warn: (...args) => logs.push(["warn", ...args]),
            error: (...args) => logs.push(["error", ...args]),
        },
        Widget: { http: { get: httpGet }, tmdb: createStubTmdb() },
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(WIDGET_PATH, "utf8"), sandbox, { filename: WIDGET_PATH });
    return { sandbox, logs };
}

async function run() {
    const { sandbox, logs } = loadWidget(realHttpGet);
    const results = [];
    let failed = 0;

    console.log(`插件文件：${path.relative(process.cwd(), WIDGET_PATH)}`);
    console.log(`插件版本：${sandbox.WidgetMetadata && sandbox.WidgetMetadata.version}`);
    console.log("");

    for (const sort_by of COS_SORTS) {
        const label = `${sort_by}`.padEnd(14, " ");
        try {
            const items = await sandbox.fetchDefaultData(sort_by);
            const count = Array.isArray(items) ? items.length : 0;
            if (count === 0) failed += 1;
            results.push({ label, count, error: count === 0 ? "返回 0 条" : "" });
        } catch (error) {
            failed += 1;
            results.push({ label, count: 0, error: error.message });
        }
    }

    for (const file of WEEK_FILES) {
        const label = `周历 ${file}`.padEnd(14, " ");
        try {
            const items = await sandbox.fetchWeekData("All", file);
            const count = Array.isArray(items) ? items.length : 0;
            if (count === 0) failed += 1;
            results.push({ label, count, error: count === 0 ? "返回 0 条" : "" });
        } catch (error) {
            failed += 1;
            results.push({ label, count: 0, error: error.message });
        }
    }

    for (const row of results) {
        const mark = row.count > 0 ? "✅" : "❌";
        console.log(`${mark} ${row.label} ${String(row.count).padStart(4)} 条${row.error ? "  ← " + row.error : ""}`);
    }

    // 模拟防盗链变更：确认报错文案是给用户看的，而不是裸 403
    const { sandbox: brokenSandbox } = loadWidget(alwaysForbiddenHttpGet);
    let friendly = false;
    let message = "";
    try {
        await brokenSandbox.fetchDefaultData("今天播出的剧集");
    } catch (error) {
        message = error.message;
        friendly = message.includes("防盗链策略可能已变更") && message.includes("issues/16");
    }
    console.log("");
    console.log(
        friendly
            ? "✅ 防盗链失效时的报错文案正常"
            : `❌ 防盗链失效时的报错文案不合格：${message}`
    );
    if (!friendly) failed += 1;

    const errors = logs.filter(entry => entry[0] === "error");
    if (errors.length > 0) {
        console.log("");
        console.log("插件内部 error 日志：");
        errors.slice(0, 5).forEach(entry => console.log("  " + entry.slice(1).join(" ")));
    }

    console.log("");
    console.log(failed === 0 ? "全部模块正常。" : `${failed} 项异常。`);
    process.exitCode = failed === 0 ? 0 : 1;
}

run().catch(error => {
    console.error("自检脚本自身出错：", error);
    process.exitCode = 1;
});
