# ForwardWidgets

<p align="center">
  <img src="https://i.miji.bid/2025/05/08/a7472460007b57687f659b8727f52755.md.jpeg" alt="欢迎使用我的五折码" width="300px"/>
  <br>
  五折码：CHEAP.5
  <br>
  七折码：CHEAP
</p>

以下插件纯属个人爱好，侵删谢谢。

纯为爱发电，模块只是自己要用，然后顺便分享，如果真要打赏，可以支付宝发口令红包到我的tg私信机器人 https://t.me/ddjdd_bot ，感谢😊

### 一、豆瓣我看&豆瓣个性化推荐

<img src="https://i.miji.bid/2025/05/05/ee9c89a97e226fa0cebaae2990b13836.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/05/d1b4ddc054156a87ccd1a4bff8197b53.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/05/ffee8bded4b121831d1b8da95c047bb9.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/05/ad56685688d7cd354b6cfcbed97b3e09.jpeg" style="width:200px" />

其中用户ID和Cookie必填

#### 用户ID获取
<img src="https://i.miji.bid/2025/05/05/de6358e6a8cca3e890f51e5f385e5aaa.png" alt="de6358e6a8cca3e890f51e5f385e5aaa.png" border="0" />
我的豆瓣标签页中有显示用户ID

#### Cookie获取
最好用iPhone网页登陆豆瓣，然后用Loon或者Qx等工具抓包获取Cookie（不清楚Cookie多久失效，所以可能过一段时间需要重新获取填一次）

#### 增加豆瓣片单(TMDB版)
因为type为douban类型的items里依赖豆瓣数据里包含imdb_id，但很多综艺没有设置imdb_id，导致综艺片单识别到的只有个别，所以加了直接查询tmdb的版本

豆瓣的综艺title一般都包含第x季字样，所以用cleanTitle做了清理操作

修复下一页

增加doulist支持，并新增下拉选项片单[IMDB MOVIE TOP 250]/[IMDB TV TOP 250]/[意外结局电影]

#### 增加电影推荐(TMDB版)/剧集推荐(TMDB版)
（说明：由于用title查询TMDB，所以不一定能准确匹配正确影片）

#### 增加观影偏好(TMDB版)
又名`找电影/找电视`

应网友要求进行搬迁，详情请看issue：https://github.com/huangxd-/ForwardWidgets/issues/6

#### 新增豆瓣随机想看
从想看列表中无序抽取9个影片（如果想看列表很长，每次打开想看总是刚添加的几个影片显示在前面，增加随机机制，让用户每次从9个想看的影片中挑选一部进行观看）

#### 新增豆瓣影人作品
输入：演员姓名，可筛选，也可自定义，其中筛选类型以下几种，分别列举了50位
```shell
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
```
输出：所有该影人的作品
排序：评价/时间

#### 新增豆瓣首页轮播图(用于首页和apple tv topshelf)
从豆瓣热播电影/电视剧/综艺/动漫分别随机获取3个未在影院上映的影片，并乱序后返回总共12个影片

### 二、Trakt我看&Trakt个性化推荐

```shell
几点说明：
1. trakt.js之所以不用官方trakt api，是因为尝试后发现目前生成的token 24小时之后会过期，如果要继续使用，需用上一次返回的refresh_token重新生成，当前插件也没有好的保存方式
2. trakt看过里是包含看了一半的电视的，也就是说正在看的电视也会出现在 看过-电视 里
3. 尝试后发现当前ForwardWidget插件的数据模型里如果type是tmdb，貌似有数据会被缓存覆盖的问题，douban和imdb类型不存在该问题
```

<img src="https://i.miji.bid/2025/05/08/e7bae366ee0d96b8e4cd0fa809ef8d52.md.png" style="width:200px" /><img src="https://i.miji.bid/2025/05/08/63d7160f9ced06ff18de3be8723b884e.md.png" style="width:200px" />

其中用户名和Cookie必填

#### 用户名获取
在网页上登录你的Trakt，查看url如下 https://trakt.tv/users/xxxx/watchlist ，其中users后面跟的就是你的用户名，填了用户名后还是获取不到数据的请在Trakt设置里打开隐私开关

#### Cookie获取
最好用iPhone网页登陆Trakt，然后用Loon或者Qx等工具抓包获取Cookie（不清楚Cookie多久失效，所以可能过一段时间需要重新获取填一次），一般找_traktsession=xxxx长这样的Cookie

#### 新增Trakt随机想看
从想看列表中无序抽取9个影片（如果想看列表很长，每次打开想看总是刚添加的几个影片显示在前面，增加随机机制，让用户每次从9个想看的影片中挑选一部进行观看）

### 三、Trakt片单&Trakt追剧日历
`说明：追剧日历只是尝鲜版，j佬到时候应该会在APP内嵌追剧功能 :)`

<img src="https://i.miji.bid/2025/05/12/d88147b5a3764acc1037a16ac736835b.png" style="width:200px" /><img src="https://i.miji.bid/2025/05/12/a918ef099ae6b3c0babb6ce2b6eb071d.png" style="width:200px" />

其中用户名/片单列表名/Cookie同上，另外追剧日历中新增参数开始日期/天数/排序方式

> 片单示例 
https://trakt.tv/users/giladg/lists/latest-4k-releases?sort=added,asc

```shell
用户名：giladg
片单列表名：latest-4k-releases
```

#### 排序依据
```shell
rank：排名算法
added：添加时间
title：标题
released：发布日期
runtime：内容时长
popularity：流行度
random：随机
```

#### 排序方向
asc：正序 or desc：反序

> Trakt追剧日历会将个人watched, collected, or watchlisted中的节目在日历中呈现，具体可查看 https://trakt.tv/calendars/my/shows-movies

#### 开始日期
填数字，0表示今天，-1表示昨天，1表示明天，插件内会自动转换成相应日期

#### 天数
填数字，表示从开始日期的n天内的时间区间，最大值33天

#### 排序方式
如有时间区间[2025-05-01, 2025-05-07]

日期升序：返回 从 2025-05-01 -> 2025-05-07 的节目信息

日期降序：返回 从 2025-05-07 -> 2025-05-01 的节目信息

### 四、豆瓣想看/已看数据迁移Trakt脚本

#### 使用教程
`说明：可能有部分会迁移失败`
1. 先将`douban2trakt.py`脚本中的几个必填参数填上
```shell
# 豆瓣用户ID
DOUBAN_USER_ID = ""
# TRAKT API APPS的Client ID，请前往 https://trakt.tv/oauth/applications/new 创建
TRAKT_CLIENT_ID = ""
# TRAKT抓包获取的x-csrf-token，需有增删改操作的接口才有
TRAKT_X_CSRF_TOKEN = ""
# TRAKT抓包获取的cookie
TRAKT_COOKIE = ""
```
2. 执行脚本
```shell
# 迁移想看列表
python douban2trakt.py --type watchlist
# 迁移已看列表和打分，因为豆瓣是5分制，Trakt是10分制，所以会做乘以2操作后打分
python douban2trakt.py --type watched
```

### 五、直播（电视+网络）
`只能说是尝鲜版，有挺多问题的，看j佬有没有时间优化下 :)`
```shell
没有统一ping，不知道哪些会超时，也没预览
没有分类显示的地方
小组件已经添加的情况下，没有搜索入口
#有些源播放会闪退，不知道是什么原因，可能是缓冲太大？#
#插件有缓存，如果不清缓存，会老是打开同一个时间点#
```
当前支持直播源内没有自带台标的情况下引用台名对应台标

<img src="https://i.miji.bid/2025/05/17/31b417b1edf82192b1edaa752aa18504.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/17/9685eb351a2c5892b647dbd9c33532f5.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/17/fe4ed1f17a9fb5e2b3808b4f6a0c7ae2.jpeg" style="width:600px" /><img src="https://i.miji.bid/2025/05/17/bc5bbe2a8efa99eba6ca0c72e4681a79.jpeg" style="width:600px" />

#### 订阅链接
内嵌了几个公开源，也可以自定义

新增PlutoTV源
```shell
PlutoTV-阿根廷 (Argentina)
PlutoTV-巴西 (Brazil)
PlutoTV-加拿大 (Canada)
PlutoTV-智利 (Chile)
PlutoTV-德国 (Germany)
PlutoTV-西班牙 (Spain)
PlutoTV-法国 (France)
PlutoTV-英国 (Great Britain)
PlutoTV-意大利 (Italy)
PlutoTV-墨西哥 (Mexico)
PlutoTV-美国 (United States)
```

#### 按组关键字过滤
一个订阅链接可能有上百上千个频道，可以按组名关键字筛选，至于有哪些组，需要自己打开订阅链接看下

增加了正则过滤，如`.*(央视|卫视).*`

#### 按频道名关键字过滤
一个订阅链接可能有上百上千个频道，可以按频道名称关键字筛选，至于有哪些频道，需要自己打开订阅链接看下

增加了正则过滤，如`.*(B站|虎牙|斗鱼).*`

### 六、雅图(每日放送+点播排行榜+评分排行榜)
<img src="https://i.miji.bid/2025/05/18/6c97648fe9aed6398c76c56b28bdd3e5.jpeg" style="width:200px" />

#### 每日放送
`说明：最新的数据只到今天以及前面m天的数据，可以参考官网 http://www.yatu.tv:2082/zuijin.asp `
```shell
类型：动漫/电影/电视剧
开始日期：n天前，0表示今天，-1表示昨天，以此类推
天数：从开始日期开始的后面m天的数据
```

#### 点播排行榜
```shell
类型：连载动漫/剧场动漫/电影/香港电影/欧美电影/电视剧/美剧/综艺
时间：今日/本月/历史
```

#### 评分排行榜
```shell
类型：动漫/电影/电视剧
等级：非常好看/好看/一般/烂片
```

### 七、追剧日历(今/明日播出、各项榜单、今日推荐)
<img src="https://i.miji.bid/2025/05/30/be043310fe0e0beefd21a9b92535a4fe.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/30/961b5c41d77f208ce2556738bc84e60d.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/30/7cd063207fad2ff2f873fcd007c5083e.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/30/923ddad8c2e563f09a406b59635056a7.jpeg" style="width:200px" />

#### 今/明日播出
```shell
类型：今日播出剧集/今日播出番剧/今日播出国漫/今日播出综艺/明日播出剧集/明日播出番剧/明日播出国漫/明日播出综艺
```

#### 播出周历
```shell
类型：剧集/番剧/国漫/综艺
周几：全部/周一/周二/周三/周四/周五/周六/周日
```

#### 各项榜单
```shell
类型：现正热播/人气 Top 10/新剧雷达/热门国漫/已收官好剧/华语热门/本季新番
地区：国产剧/日剧/英美剧/番剧/韩剧/港台剧
```

#### 今日推荐

### 八、Letterboxd电影爱好者平台
<img src="https://i.mji.rip/2025/07/19/d73d1ab4bc8df0ba2abbcd5928dfd3fc.jpeg" style="width:200px" /><img src="https://i.mji.rip/2025/07/19/97e62a26dbe2e2284265d2b654644005.jpeg" style="width:200px" />

#### Letterboxd片单
默认内置了80+片单，支持平铺筛选，可自定义
```shell
排序：默认排序/反序/名称/流行度/随机/最后添加/最早添加/最新发行/最早发行/最高评分/最低评分/最短时长/最长时长
类型：所有类型/动作/冒险/动画/喜剧/犯罪/纪录片/戏剧/家庭/奇幻/历史/恐怖/音乐/神秘/浪漫/科幻/惊悚/电视电影/战争/西部
年代：所有年代/2020年代/2010年代/2000年代/1990年代/1980年代/1970年代/1960年代/1950年代/1940年代/1930年代/1920年代/1910年代/1900年代/1890年代/1880年代/1870年代
```

### 九、手动链接弹幕（已合并到自动链接弹幕）
<img src="https://i.mji.rip/2025/08/09/0034f3549373679f895b69e4f29d6293.jpeg" style="width:400px" />

使用方法请前往 https://t.me/ForwardWidgets/288 观看

#### 自定义服务器
从哪个服务器获取弹幕，默认是http://127.0.0.1
```shell
http://127.0.0.1
https://fc.lyz05.cn
https://danmu.56uxi.com
https://dmku.hls.one
https://api.danmu.icu
https://se.678.ooo
https://dm.lxlad.com
```

弹幕服务器新增localhost http://127.0.0.1 ，弹幕下载会直接请求各平台（搬迁修改自 https://github.com/lyz05/danmaku ），支持爱优腾芒哔，相对原来直接请求三方弹幕服务器会相对更稳定一点

~~其中爱平台下载弹幕的时候需要zlib解压，fw的widget.http.get不支持返回arrayBuffer，没找到好的解决办法，所以当前先用cloudflare转了一下，worker.js如下~~：
```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Extract URL from query parameter
    const url = new URL(request.url).searchParams.get('url');
    if (!url) {
      return new Response('Missing URL parameter', { status: 400 });
    }

    // Fetch the compressed data from the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(`Failed to fetch URL: ${response.statusText}`, { status: response.status });
    }

    // Get the response body as an ArrayBuffer
    const compressedData = await response.arrayBuffer();

    // Decompress the zlib-compressed data
    const decompressedData = await decompress(compressedData);

    // Convert decompressed data to text
    const text = new TextDecoder().decode(decompressedData);

    // Return the decompressed data
    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

// Decompress zlib data using Web Crypto API
async function decompress(data) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(data));
      controller.close();
    }
  });

  const decompressedStream = stream.pipeThrough(new DecompressionStream('deflate'));
  const reader = decompressedStream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // Combine chunks into a single Uint8Array
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}
```

#### 各大平台播放链接输入示例
```shell
https://www.bilibili.com/video/av170001
https://www.mgtv.com/b/336727/8087768.html
https://v.qq.com/x/cover/53q0eh78q97e4d1/x00174aq5no.html
https://v.youku.com/v_show/id_XNTE5NjUxNjUyOA==.html
https://www.iqiyi.com/v_bb6gsxzz78.html
https://ani.gamer.com.tw/animeVideo.php?sn=41645
```
目前已兼容手机端网页url
```shell
https://m.bilibili.com/bangumi/play/ep1231564
https://m.mgtv.com/b/771610/23300622.html
https://m.v.qq.com/x/m/play?cid=53q0eh78q97e4d1&vid=x00174aq5no
https://m.youku.com/alipay_video/id_cbff0b0703e54d659628.html
https://m.iqiyi.com/v_1ftv9n1m3bg.html
```

### 十、自动链接弹幕
<img src="https://i.mji.rip/2025/08/10/dac88bcdb1f00111db3e5163de3fc550.jpeg" style="width:400px" /><img src="https://i.mji.rip/2025/08/12/bdf3b7637bdcf2c0a1f56b352e453f24.jpeg" style="width:400px" />

会自动获取平台播放链接并根据链接下载弹幕（目前主要适配了电视剧和电影以及综艺）

实在自动获取不到的就蒜鸟，手动也不是不可以，或者反馈下我tg机器人 https://t.me/ddjdd_bot

综艺是根据集发布日期和集标题匹配的播放链接，所以如果emby刮削不准确或者360kan平台没有该综艺都会匹配不到

<p align="center">
  <img src="https://i.mji.rip/2025/09/01/71cfa802abb8f5589b687bc836aa4aff.png" alt="弹幕下载流程图" width="500px"/>
  <br>
  弹幕下载流程图
</p>

#### 自定义弹幕服务器
从哪个服务器获取弹幕，默认是http://127.0.0.1
```shell
http://127.0.0.1
https://fc.lyz05.cn
https://danmu.56uxi.com
https://dmku.hls.one
https://api.danmu.icu
https://se.678.ooo
https://dm.lxlad.com
```

弹幕服务器新增localhost http://127.0.0.1 ，弹幕下载会直接请求各平台（搬迁修改自 https://github.com/lyz05/danmaku ），支持爱优腾芒哔，外加人人，相对原来直接请求三方弹幕服务器会相对更稳定一点

其中爱平台下载弹幕的时候需要zlib解压，fw的widget.http.get不支持返回arrayBuffer，没找到好的解决办法，所以当前先用cloudflare转了一下

#### 弹幕分片请求开关
弹幕服务器localhost增加分片请求

#### 弹幕服务器轮询开关
设置的弹幕服务器下载弹幕失败的情况下轮询其他弹幕服务器

#### 跳过360kan站点查询开关
默认关闭，打开的情况下会跳过360kan站点查询，直接请求vod站点

#### 电影弹幕优先平台
新增电影弹幕优先平台，用于控制从哪个平台下载电影弹幕，默认随机，且如果指定的平台在返回数据中不存在，则随机

#### vod采集站点
从vod站点拿播放信息用于补充360kan缺失影片的问题

#### vod采集站点轮询开关
设置的vod站点搜索信息失败的情况下轮询其他剩余站点

#### debug开关
新增debug开关，默认关闭，打开的状态下会在开头2分钟内打印错误日志弹幕

#### 弹幕API
支持5个弹幕API填写，弹幕链接获取失败后，会依次轮询弹幕API，以获取韩剧/美剧等

#### 弹幕API优先开关
优先请求弹幕API获取弹幕 (开启后准确性可能没有通过链接匹配的高)

### 各插件刷新时间列表
```shell
【豆瓣】
豆瓣我看：1小时
豆瓣个性化推荐：12小时
豆瓣片单(TMDB版)：12小时
电影推荐(TMDB版)：24小时
剧集推荐(TMDB版)：24小时
观影偏好(TMDB版)：24小时
豆瓣影人作品：1周
豆瓣首页轮播图：1小时

【trakt】
trakt我看：1小时
trakt个性化推荐：12小时
trakt片单：24小时
trakt追剧日历：12小时

【直播(电视+网络)】
订阅链接：6小时
详情页：60秒

【雅图(每日放送+点播排行榜+评分排行榜)】
每日放送：6小时
点播排行榜：6小时
评分排行榜：24小时

【追剧日历(今/明日播出、周历、各项榜单、今日推荐)】
今日播出：6小时
明日播出：6小时
播出周历：6小时
今日推荐：12小时
各项榜单：24小时
地区榜单：24小时

【Letterboxd电影爱好者平台】
Letterboxd片单：24小时
```

### Forward图标库自助上传
请跳转项目：[PicStoreJson](https://github.com/huangxd-/PicStoreJson)

### 📈项目 Star 数增长趋势
#### Star History
[![Star History Chart](https://api.star-history.com/svg?repos=huangxd-/ForwardWidgets&type=Date)](https://www.star-history.com/#huangxd-/ForwardWidgets&Date)
