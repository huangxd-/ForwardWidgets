/**
 * 弹幕示例模块
 * 给 module 指定 type 为 danmu 后，默认会携带以下参数：
 * tmdbId: TMDB ID，Optional
 * type: 类型，tv | movie
 * title: 标题
 * season: 季，电影时为空
 * episode: 集，电影时为空
 * link: 链接，Optional
 * videoUrl: 视频链接，Optional
 * commentId: 弹幕ID，Optional。在搜索到弹幕列表后实际加载时会携带
 * animeId: 动漫ID，Optional。在搜索到动漫列表后实际加载时会携带
 *
 */
WidgetMetadata = {
  id: "forward.auto.danmu",
  title: "自动链接弹幕",
  version: "1.0.22",
  requiredVersion: "0.0.2",
  description: "自动获取播放链接并从服务器获取弹幕【五折码：CHEAP.5;七折码：CHEAP】",
  author: "huangxd",
  site: "https://github.com/huangxd-/ForwardWidgets",
  globalParams: [
    {
      name: "danmu_server",
      title: "自定义服务器",
      type: "input",
      placeholders: [
        {
          title: "localhost",
          value: "http://127.0.0.1",
        },
        {
          title: "lyz05",
          value: "https://fc.lyz05.cn",
        },
        {
          title: "hls",
          value: "https://dmku.hls.one",
        },
        {
          title: "icu",
          value: "https://api.danmu.icu",
        },
        {
          title: "678",
          value: "https://se.678.ooo",
        },
        {
          title: "56uxi",
          value: "https://danmu.56uxi.com",
        },
        {
          title: "lxlad",
          value: "https://dm.lxlad.com",
        },
      ],
    },
    {
      name: "danmu_server_polling",
      title: "弹幕服务器轮询开关 (建议打开)",
      type: "enumeration",
      value: "true",
      enumOptions: [
        {
            title: "开",
            value: "true",
        },
        {
            title: "关",
            value: "false",
        },
      ],
    },
    {
      name: "skip360kan",
      title: "跳过360kan站点查询播放链接 (建议关闭)",
      type: "enumeration",
      value: "false",
      enumOptions: [
        {
            title: "关",
            value: "false",
        },
        {
            title: "开",
            value: "true",
        },
      ],
    },
    {
      name: "platform",
      title: "电影弹幕优先平台",
      type: "enumeration",
      value: "random",
      enumOptions: [
        {
            title: "随机",
            value: "random",
        },
        {
            title: "爱奇艺",
            value: "qiyi",
        },
        {
            title: "腾讯",
            value: "qq",
        },
        {
            title: "优酷",
            value: "youku",
        },
        {
            title: "芒果",
            value: "imgo",
        },
        {
            title: "哔哩哔哩",
            value: "bilibili1",
        },
      ],
    },
    {
      name: "vod_site",
      title: "兜底vod站点",
      type: "input",
      placeholders: [
        {
          title: "789",
          value: "https://www.caiji.cyou",
        },
        {
          title: "tfdh",
          value: "https://gctf.tfdh.top",
        },
        {
          title: "69mu",
          value: "https://www.69mu.cn",
        },
        {
          title: "xmm",
          value: "https://zy.xmm.hk",
        },
      ],
    },
    {
      name: "vod_site_polling",
      title: "兜底vod站点轮询开关 (建议打开)",
      type: "enumeration",
      value: "true",
      enumOptions: [
        {
            title: "开",
            value: "true",
        },
        {
            title: "关",
            value: "false",
        },
      ],
    },
    {
      name: "debug",
      title: "调试日志，是否开启前2分钟投放弹幕日志",
      type: "enumeration",
      value: "false",
      enumOptions: [
        {
            title: "关",
            value: "false",
        },
        {
            title: "开",
            value: "true",
        },
      ],
    },
    {
      name: "danmu_api_1",
      title: "danmu_api_1 (前面匹配不到的可以试试弹幕API，比如一些韩剧/美剧)",
      type: "input",
      placeholders: [
        {
          title: "示例",
          value: "https://{domain}/api/{token}",
        },
      ],
    },
    {
      name: "danmu_api_2",
      title: "danmu_api_2 (前面匹配不到的可以试试弹幕API，比如一些韩剧/美剧)",
      type: "input",
      placeholders: [
        {
          title: "示例",
          value: "https://{domain}/api/{token}",
        },
      ],
    },
    {
      name: "danmu_api_3",
      title: "danmu_api_3 (前面匹配不到的可以试试弹幕API，比如一些韩剧/美剧)",
      type: "input",
      placeholders: [
        {
          title: "示例",
          value: "https://{domain}/api/{token}",
        },
      ],
    },
    {
      name: "danmu_api_4",
      title: "danmu_api_4 (前面匹配不到的可以试试弹幕API，比如一些韩剧/美剧)",
      type: "input",
      placeholders: [
        {
          title: "示例",
          value: "https://{domain}/api/{token}",
        },
      ],
    },
    {
      name: "danmu_api_5",
      title: "danmu_api_5 (前面匹配不到的可以试试弹幕API，比如一些韩剧/美剧)",
      type: "input",
      placeholders: [
        {
          title: "示例",
          value: "https://{domain}/api/{token}",
        },
      ],
    },
    {
      name: "api_priority",
      title: "弹幕API优先 (开启后准确性可能没有通过链接匹配的高)",
      type: "enumeration",
      value: "false",
      enumOptions: [
        {
            title: "关",
            value: "false",
        },
        {
            title: "开",
            value: "true",
        },
      ],
    },
  ],
  modules: [
    {
      //id需固定为searchDanmu
      id: "searchDanmu",
      title: "搜索弹幕",
      functionName: "searchDanmu",
      type: "danmu",
      params: [],
    },
    {
      //id需固定为getComments
      id: "getComments",
      title: "获取弹幕",
      functionName: "getCommentsById",
      type: "danmu",
      params: [],
    },
  ],
};

function printFirst200Chars(data) {
  let dataToPrint;

  if (typeof data === 'string') {
    dataToPrint = data;  // 如果是字符串，直接使用
  } else if (Array.isArray(data)) {
    dataToPrint = JSON.stringify(data);  // 如果是数组，转为字符串
  } else if (typeof data === 'object') {
    dataToPrint = JSON.stringify(data);  // 如果是对象，转为字符串
  } else {
    console.error("Unsupported data type");
    return;
  }

  console.log(dataToPrint.slice(0, 200));  // 打印前200个字符
}

// md5.js 本地版本
function md5(message) {
  // --- UTF-8 转换 ---
  function toUtf8(str) {
    let utf8 = "";
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode < 0x80) {
        utf8 += String.fromCharCode(charCode);
      } else if (charCode < 0x800) {
        utf8 += String.fromCharCode(0xc0 | (charCode >> 6));
        utf8 += String.fromCharCode(0x80 | (charCode & 0x3f));
      } else {
        utf8 += String.fromCharCode(0xe0 | (charCode >> 12));
        utf8 += String.fromCharCode(0x80 | ((charCode >> 6) & 0x3f));
        utf8 += String.fromCharCode(0x80 | (charCode & 0x3f));
      }
    }
    return utf8;
  }

  message = toUtf8(message);

  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX, lY) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else return lResult ^ lX8 ^ lY8;
  }

  function F(x, y, z) { return (x & y) | (~x & z); }
  function G(x, y, z) { return (x & z) | (y & ~z); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | ~z); }

  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str) {
    const lMessageLength = str.length;
    const lNumberOfWords = (((lMessageLength + 8) >>> 6) + 1) * 16;
    const lWordArray = new Array(lNumberOfWords).fill(0);
    for (let i = 0; i < lMessageLength; i++) {
      lWordArray[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    }
    lWordArray[lMessageLength >> 2] |= 0x80 << ((lMessageLength % 4) * 8);
    lWordArray[lNumberOfWords - 2] = lMessageLength * 8;
    return lWordArray;
  }

  function wordToHex(lValue) {
    let wordToHexValue = "";
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255;
      let wordToHexValueTemp = "0" + lByte.toString(16);
      wordToHexValue += wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  }

  let x = convertToWordArray(message);
  let a = 0x67452301;
  let b = 0xEFCDAB89;
  let c = 0x98BADCFE;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    let AA = a, BB = b, CC = c, DD = d;

    // --- Round 1 ---
    a = FF(a, b, c, d, x[k + 0], 7, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], 12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], 22, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], 7, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], 17, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], 22, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], 12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], 17, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], 22, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], 7, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], 12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], 17, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], 22, 0x49B40821);

    // --- Round 2 ---
    a = GG(a, b, c, d, x[k + 1], 5, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], 9, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], 14, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], 20, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], 5, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], 14, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], 20, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], 5, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], 9, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], 14, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], 20, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], 5, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], 9, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], 14, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], 20, 0x8D2A4C8A);

    // --- Round 3 ---
    a = HH(a, b, c, d, x[k + 5], 4, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], 16, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], 23, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], 4, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], 11, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], 16, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], 23, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], 4, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], 11, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], 16, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], 23, 0x04881D05);
    a = HH(a, b, c, d, x[k + 9], 4, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], 11, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], 16, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], 23, 0xC4AC5665);

    // --- Round 4 ---
    a = II(a, b, c, d, x[k + 0], 6, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], 10, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], 15, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], 21, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], 6, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], 10, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], 15, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], 21, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], 6, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], 10, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], 15, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], 21, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], 6, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], 10, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], 15, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], 21, 0xEB86D391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

function escapeXmlText(str) {
  return str.replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}

function fixDTagContent(xmlStr) {
  return xmlStr.replace(/(<d [^>]*>)([\s\S]*?)(<\/d>)/g, function (match, startTag, textContent, endTag) {
    return startTag + escapeXmlText(textContent) + endTag;
  });
}

function buildQueryString(params) {
  let queryString = '';

  // 遍历 params 对象的每个属性
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      // 如果 queryString 已经有参数了，则添加 '&'
      if (queryString.length > 0) {
        queryString += '&';
      }

      // 将 key 和 value 使用 encodeURIComponent 编码，并拼接成查询字符串
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }
  }

  return queryString;
}

function time_to_second(time) {
  const parts = time.split(":").map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else {
    seconds = parts[0];
  }
  return seconds;
}

async function convertMobileToPcUrl(url) {
    /**
     * 将移动端页面 URL 转换为 PC 端页面 URL。
     * 支持爱奇艺、腾讯视频、优酷、芒果TV和哔哩哔哩。
     * @param {string} url - 移动端 URL
     * @returns {string} - PC 端 URL（匹配成功）、错误信息（匹配但解析失败）或原链接（不匹配）
     */

    // 爱奇艺 (iQIYI)
    if (url.includes('m.iqiyi.com')) {
        // 移动端示例: https://m.iqiyi.com/v_1ftv9n1m3bg.html
        // PC 端示例: https://www.iqiyi.com/v_1ftv9n1m3bg.html
        return url.replace('m.iqiyi.com', 'www.iqiyi.com');
    }

    // 腾讯视频 (Tencent Video)
    if (url.includes('m.v.qq.com')) {
        // 移动端示例: https://m.v.qq.com/x/m/play?cid=53q0eh78q97e4d1&vid=x00174aq5no&ptag=hippySearch&pageType=long
        // PC 端示例: https://v.qq.com/x/cover/53q0eh78q97e4d1/x00174aq5no.html
        const cidMatch = url.match(/cid=([a-zA-Z0-9]+)/);
        const vidMatch = url.match(/vid=([a-zA-Z0-9]+)/);
        if (cidMatch && vidMatch) {
            const cid = cidMatch[1];
            const vid = vidMatch[1];
            return `https://v.qq.com/x/cover/${cid}/${vid}.html`;
        } else if (vidMatch) {
            const vid = vidMatch[1];
            return `https://v.qq.com/x/page/${vid}.html`;
        }
        return "无法解析腾讯视频移动端 URL";
    }

    // 优酷 (Youku)
    if (url.includes('m.youku.com')) {
        // 移动端示例: https://m.youku.com/alipay_video/id_cbff0b0703e54d659628.html?spm=a2hww.12518357.drawer4.2
        // PC 端示例: https://v.youku.com/v_show/id_cbff0b0703e54d659628.html

        // 获取重定向location
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const regex = /https:\/\/v\.youku\.com\/v_show\/id_[A-Za-z0-9=]+\.html/g;
        const matches = response.data.match(regex); // 找到所有匹配的链接
        if (matches) {
            return matches[0];
        }

        return "无法解析优酷移动端 URL";
    }

    // 芒果TV (Mango TV)
    if (url.includes('m.mgtv.com')) {
        // 移动端示例: https://m.mgtv.com/b/771610/23300622.html?fpa=0&fpos=0
        // PC 端示例: https://www.mgtv.com/b/771610/23300622.html
        return url.replace('m.mgtv.com', 'www.mgtv.com').replace(/\?.*$/, '');
    }

    // 哔哩哔哩 (Bilibili)
    if (url.includes('m.bilibili.com')) {
        // 移动端示例: https://m.bilibili.com/bangumi/play/ep1231564
        // PC 端示例: https://www.bilibili.com/bangumi/play/ep1231564
        return url.replace('m.bilibili.com', 'www.bilibili.com');
    }

    // 不匹配任何支持的平台，直接返回原链接
    return url;
}

function convertToDanmakuXML(contents) {
  let danmus = []
  for (const content of contents) {
    const attributes = [
      content.timepoint,
      content.ct,
      content.size,
      content.color,
      content.unixtime,
      '0',
      content.uid,
      '26732601000067074',
      '1'
    ].join(',');
    danmus.push({
      p: attributes,
      m: content.content
    });
  }
  console.log("danmus:", danmus.length);
  return danmus;
}

async function fetchLocalhost(inputUrl) {
    console.log("开始从本地请求弹幕...", inputUrl);
    if (inputUrl.includes('.qq.com')) {
        return fetchTencentVideo(inputUrl);
    }
    if (inputUrl.includes('.iqiyi.com')) {
        return fetchIqiyi(inputUrl);
    }
    if (inputUrl.includes('.mgtv.com')) {
        return fetchMangoTV(inputUrl);
    }
    if (inputUrl.includes('.bilibili.com')) {
        return fetchBilibili(inputUrl);
    }
    if (inputUrl.includes('.youku.com')) {
        return fetchYouku(inputUrl);
    }
    return null;
}

async function fetchTencentVideo(inputUrl) {
  console.log("开始从本地请求腾讯视频弹幕...", inputUrl);

  // 弹幕 API 基础地址
  const api_danmaku_base = "https://dm.video.qq.com/barrage/base/";
  const api_danmaku_segment = "https://dm.video.qq.com/barrage/segment/";

  // 解析 URL 获取 vid
  let vid;
  // 1. 尝试从查询参数中提取 vid
  const queryMatch = inputUrl.match(/[?&]vid=([^&]+)/);
  if (queryMatch) {
    vid = queryMatch[1]; // 获取 vid 参数值
  } else {
    // 2. 从路径末尾提取 vid
    const pathParts = inputUrl.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    vid = lastPart.split('.')[0]; // 去除文件扩展名
  }

  console.log("vid:", vid);

  // 获取页面标题
  let res;
  try {
    res = await Widget.http.get(inputUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
  } catch (error) {
    console.error("请求页面失败:", error);
    return null;
  }

  // 使用正则表达式提取 <title> 标签内容
  const titleMatch = res.data.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].split("_")[0] : "未知标题";
  console.log("标题:", title);

  // 获取弹幕基础数据
  try {
    res = await Widget.http.get(api_danmaku_base + vid, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("请求弹幕基础数据失败:", error);
    return null;
  }

  // 先把 res.data 转成 JSON
  const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

  // 获取弹幕分段数据
  const promises = [];
  const segmentList = Object.values(data.segment_index);
  for (const item of segmentList) {
    promises.push(
      Widget.http.get(`${api_danmaku_segment}${vid}/${item.segment_name}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })
    );
  }

  console.log("弹幕分段数量:", promises.length);

  // 解析弹幕数据
  let contents = [];
  try {
    const results = await Promise.allSettled(promises);
    const datas = results
      .filter(result => result.status === "fulfilled")
      .map(result => result.value.data);

    for (let data of datas) {
      data = typeof data === "string" ? JSON.parse(data) : data;
      for (const item of data.barrage_list) {
        const content = {
            timepoint: 0,	// 弹幕发送时间（秒）
            ct: 1,	// 弹幕类型，1-3 为滚动弹幕、4 为底部、5 为顶端、6 为逆向、7 为精确、8 为高级
            size: 25,	//字体大小，25 为中，18 为小
            color: 16777215,	//弹幕颜色，RGB 颜色转为十进制后的值，16777215 为白色
            unixtime: Math.floor(Date.now() / 1000),	//Unix 时间戳格式
            uid: 0,		//发送人的 id
            content: "",
        };
        content.timepoint = item.time_offset / 1000;
        if (item.content_style?.color) {
          console.log("弹幕颜色:", JSON.stringify(item.content_style.color));
        }
        content.content = item.content;
        contents.push(content);
      }
    }
  } catch (error) {
    console.error("解析弹幕数据失败:", error);
    return null;
  }

  printFirst200Chars(contents);

  // 返回结果
  return convertToDanmakuXML(contents);
}

async function fetchIqiyi(inputUrl) {
  console.log("开始从本地请求爱奇艺弹幕...", inputUrl);

  // 弹幕 API 基础地址
  const api_decode_base = "https://pcw-api.iq.com/api/decode/";
  const api_video_info = "https://pcw-api.iqiyi.com/video/video/baseinfo/";
  const api_danmaku_base = "https://cmts.iqiyi.com/bullet/";

  // 解析 URL 获取 tvid
  let tvid;
  try {
    const idMatch = inputUrl.match(/v_(\w+)/);
    if (!idMatch) {
      console.error("无法从 URL 中提取 tvid");
      return null;
    }
    tvid = idMatch[1];
    console.log("tvid:", tvid);

    // 获取 tvid 的解码信息
    const decodeUrl = `${api_decode_base}${tvid}?platformId=3&modeCode=intl&langCode=sg`;
    let res = await Widget.http.get(decodeUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    tvid = data.data.toString();
    console.log("解码后 tvid:", tvid);
  } catch (error) {
    console.error("请求解码信息失败:", error);
    return null;
  }

  // 获取视频基础信息
  let title, duration, albumid, categoryid;
  try {
    const videoInfoUrl = `${api_video_info}${tvid}`;
    const res = await Widget.http.get(videoInfoUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    const videoInfo = data.data;
    title = videoInfo.name || videoInfo.tvName || "未知标题";
    duration = videoInfo.durationSec;
    albumid = videoInfo.albumId;
    categoryid = videoInfo.channelId || videoInfo.categoryId;
    console.log("标题:", title, "时长:", duration);
  } catch (error) {
    console.error("请求视频基础信息失败:", error);
    return null;
  }

  // 计算弹幕分段数量（每5分钟一个分段）
  const page = Math.ceil(duration / (60 * 5));
  console.log("弹幕分段数量:", page);

  // 构建弹幕请求
  const promises = [];
  for (let i = 0; i < page; i++) {
    const params = {
        rn: "0.0123456789123456",
        business: "danmu",
        is_iqiyi: "true",
        is_video_page: "true",
        tvid: tvid,
        albumid: albumid,
        categoryid: categoryid,
        qypid: "01010021010000000000",
    };
    let queryParams = buildQueryString(params);
    const api_url = `${api_danmaku_base}${tvid.slice(-4, -2)}/${tvid.slice(-2)}/${tvid}_300_${i + 1}.z?${queryParams.toString()}`;
    promises.push(
        // fetch(api_url, {
        //     method: 'GET',
        //     headers: {
        //         "Content-Type": "application/json",
        //         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        //     }
        // })
        // .then(async response => {
        //     if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        //     return response.arrayBuffer();
        // })
        // .catch(err => {
        //     console.error(`Fetch error for ${api_url}:`, err);
        //     return null;
        // })
        // Widget.http.get(`https://zlib-decompress.hxd.ip-ddns.com/?url=${api_url}`, {
        Widget.http.get(api_url, {
          headers: {
            "Accpet-Encoding": "gzip",
            "Content-Type": "application/xml",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          zlibMode: true
        })
    );
  }

  // 提取 XML 标签内容的辅助函数
  function extract(xml, tag) {
      const reg = new RegExp(`<${tag}>(.*?)</${tag}>`, "g");
      const res = xml.match(reg)?.map((x) => x.substring(tag.length + 2, x.length - tag.length - 3));
      return res || [];
  }

  // 解析弹幕数据
  let contents = [];
  try {
    const results = await Promise.allSettled(promises);
    const datas = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

    for (let data of datas) {
        console.log("piece data: ", printFirst200Chars(data));
        // let xml;
        // // 检查数据是否需要解压
        // if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
        //     // 使用 DecompressionStream 解压 zlib 数据
        //     const ds = new DecompressionStream("deflate"); // 修改为 zlib 的解压格式
        //     const stream = new Blob([data]).stream(); // 将 ArrayBuffer 或 Uint8Array 转换为 Blob 并创建流
        //     const decompressedStream = stream.pipeThrough(ds); // 解压流
        //     const reader = decompressedStream.getReader();
        //
        //     let result = "";
        //     while (true) {
        //         const { done, value } = await reader.read();
        //         if (done) break;
        //         result += new TextDecoder().decode(value); // 将解压的数据解码为文本
        //     }
        //     xml = result;
        // } else {
        //     // 如果数据已经是字符串，直接使用
        //     console.log("数据是未压缩的字符串，直接使用");
        //     xml = data.data;
        // }
        let xml = data.data;

        // 解析 XML 数据
        const danmaku = extract(xml, "content");
        const showTime = extract(xml, "showTime");
        const color = extract(xml, "color");
        const step = Math.ceil(danmaku.length * datas.length / 10000);

        for (let i = 0; i < danmaku.length; i += step) {
            const content = {
                timepoint: 0,	// 弹幕发送时间（秒）
                ct: 1,	// 弹幕类型，1-3 为滚动弹幕、4 为底部、5 为顶端、6 为逆向、7 为精确、8 为高级
                size: 25,	//字体大小，25 为中，18 为小
                color: 16777215,	//弹幕颜色，RGB 颜色转为十进制后的值，16777215 为白色
                unixtime: Math.floor(Date.now() / 1000),	//Unix 时间戳格式
                uid: 0,		//发送人的 id
                content: "",
            };
            content.timepoint = parseFloat(showTime[i]);
            content.color = parseInt(color[i], 16);
            content.content = danmaku[i];
            content.size = 25;
            contents.push(content);
        }
    }
  } catch (error) {
      console.error("解析弹幕数据失败:", error);
      return null;
  }

  printFirst200Chars(contents);

  // 返回结果
  return convertToDanmakuXML(contents);
}

async function fetchMangoTV(inputUrl) {
  console.log("开始从本地请求芒果TV弹幕...", inputUrl);

  // 弹幕和视频信息 API 基础地址
  const api_video_info = "https://pcweb.api.mgtv.com/video/info";
  const api_danmaku = "https://galaxy.bz.mgtv.com/rdbarrage";

  // 解析 URL 获取 cid 和 vid
  // 手动解析 URL（没有 URL 对象的情况下）
  const regex = /^(https?:\/\/[^\/]+)(\/[^?#]*)/;
  const match = inputUrl.match(regex);

  let path;
  if (match) {
    path = match[2].split('/').filter(Boolean);  // 分割路径并去掉空字符串
    console.log(path);
  } else {
    console.error('Invalid URL');
    return null;
  }
  const cid = path[path.length - 2];
  const vid = path[path.length - 1].split(".")[0];

  console.log("cid:", cid, "vid:", vid);

  // 获取页面标题和视频时长
  let res;
  try {
    const videoInfoUrl = `${api_video_info}?cid=${cid}&vid=${vid}`;
    res = await Widget.http.get(videoInfoUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
  } catch (error) {
    console.error("请求视频信息失败:", error);
    return null;
  }

  const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  const title = data.data.info.videoName;
  const time = data.data.info.time;
  console.log("标题:", title);

  // 计算弹幕分段请求
  const step = 60 * 1000; // 每60秒一个分段
  const end_time = time_to_second(time) * 1000; // 将视频时长转换为毫秒
  const promises = [];
  for (let i = 0; i < end_time; i += step) {
    const danmakuUrl = `${api_danmaku}?vid=${vid}&cid=${cid}&time=${i}`;
    promises.push(
      Widget.http.get(danmakuUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })
    );
  }

  console.log("弹幕分段数量:", promises.length);

  // 解析弹幕数据
  let contents = [];
  try {
    const results = await Promise.allSettled(promises);
    const datas = results
      .filter(result => result.status === "fulfilled")
      .map(result => result.value.data);

    for (const data of datas) {
      const dataJson = typeof data === "string" ? JSON.parse(data) : data;
      if (!dataJson.data.items) continue;
      for (const item of dataJson.data.items) {
        const content = {
            timepoint: 0,	// 弹幕发送时间（秒）
            ct: 1,	// 弹幕类型，1-3 为滚动弹幕、4 为底部、5 为顶端、6 为逆向、7 为精确、8 为高级
            size: 25,	//字体大小，25 为中，18 为小
            color: 16777215,	//弹幕颜色，RGB 颜色转为十进制后的值，16777215 为白色
            unixtime: Math.floor(Date.now() / 1000),	//Unix 时间戳格式
            uid: 0,		//发送人的 id
            content: "",
        };
        content.timepoint = item.time / 1000;
        content.content = item.content;
        content.uid = item.uid;
        contents.push(content);
      }
    }
  } catch (error) {
    console.error("解析弹幕数据失败:", error);
    return null;
  }

  printFirst200Chars(contents);

  // 返回结果
  return convertToDanmakuXML(contents);
}

async function fetchBilibili(inputUrl) {
  console.log("开始从本地请求B站弹幕...", inputUrl);

  // 弹幕和视频信息 API 基础地址
  const api_video_info = "https://api.bilibili.com/x/web-interface/view";
  const api_epid_cid = "https://api.bilibili.com/pgc/view/web/season";

  // 解析 URL 获取必要参数
  // 手动解析 URL（没有 URL 对象的情况下）
  const regex = /^(https?:\/\/[^\/]+)(\/[^?#]*)/;
  const match = inputUrl.match(regex);

  let path;
  if (match) {
    path = match[2].split('/').filter(Boolean);  // 分割路径并去掉空字符串
    path.unshift("");
    console.log(path);
  } else {
    console.error('Invalid URL');
    return null;
  }

  let title, danmakuUrl;

  // 普通投稿视频
  if (inputUrl.includes("video/")) {
    try {
      // 获取查询字符串部分（从 `?` 开始的部分）
      const queryString = inputUrl.split('?')[1];

      // 如果查询字符串存在，则查找参数 p
      let p = 1; // 默认值为 1
      if (queryString) {
          const params = queryString.split('&'); // 按 `&` 分割多个参数
          for (let param of params) {
            const [key, value] = param.split('='); // 分割每个参数的键值对
            if (key === 'p') {
              p = value || 1; // 如果找到 p，使用它的值，否则使用默认值
            }
          }
      }
      console.log("p: ", p);

      let videoInfoUrl;
      if (inputUrl.includes("BV")) {
        videoInfoUrl = `${api_video_info}?bvid=${path[2]}`;
      } else {
        videoInfoUrl = `${api_video_info}?aid=${path[2].substring(2)}`;
      }

      const res = await Widget.http.get(videoInfoUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (data.code !== 0) {
        console.error("获取普通投稿视频信息失败:", data.message);
        return null;
      }

      const cid = data.data.pages[p - 1].cid;
      danmakuUrl = `https://comment.bilibili.com/${cid}.xml`;
    } catch (error) {
      console.error("请求普通投稿视频信息失败:", error);
      return null;
    }

  // 番剧
  } else if (inputUrl.includes("bangumi/") && inputUrl.includes("ep")) {
    try {
      const epid = path.slice(-1)[0].slice(2);
      const epInfoUrl = `${api_epid_cid}?ep_id=${epid}`;

      const res = await Widget.http.get(epInfoUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (data.code !== 0) {
        console.error("获取番剧视频信息失败:", data.message);
        return null;
      }

      for (const episode of data.result.episodes) {
        if (episode.id == epid) {
          title = episode.share_copy;
          const cid = episode.cid;
          danmakuUrl = `https://comment.bilibili.com/${cid}.xml`;
          break;
        }
      }

      if (!danmakuUrl) {
        console.error("未找到匹配的番剧集信息");
        return null;
      }

    } catch (error) {
      console.error("请求番剧视频信息失败:", error);
      return null;
    }

  } else {
    console.error("不支持的B站视频网址，仅支持普通视频(av,bv)、剧集视频(ep)");
    return null;
  }

  const response = await Widget.http.get(danmakuUrl, {
    headers: {
      "Content-Type": "application/xml",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  return response.data;
}

async function fetchYouku(inputUrl) {
  console.log("开始从本地请求优酷弹幕...", inputUrl);

  // 弹幕和视频信息 API 基础地址
  const api_video_info = "https://openapi.youku.com/v2/videos/show.json";
  const api_danmaku = "https://acs.youku.com/h5/mopen.youku.danmu.list/1.0/";

  // 手动解析 URL（没有 URL 对象的情况下）
  const regex = /^(https?:\/\/[^\/]+)(\/[^?#]*)/;
  const match = inputUrl.match(regex);

  let path;
  if (match) {
    path = match[2].split('/').filter(Boolean);  // 分割路径并去掉空字符串
    path.unshift("");
    console.log(path);
  } else {
    console.error('Invalid URL');
    return null;
  }
  const video_id = path[path.length - 1].split(".")[0].slice(3);

  console.log("video_id:", video_id);

  // 获取页面标题和视频时长
  let res;
  try {
    const videoInfoUrl = `${api_video_info}?client_id=53e6cc67237fc59a&video_id=${video_id}&package=com.huawei.hwvplayer.youku&ext=show`;
    res = await Widget.http.get(videoInfoUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
      },
      allow_redirects: false
    });
  } catch (error) {
    console.error("请求视频信息失败:", error);
    return null;
  }

  const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  const title = data.title;
  const duration = data.duration;
  console.log("标题:", title, "时长:", duration);

  // 获取 cna 和 tk_enc
  let cna, _m_h5_tk_enc, _m_h5_tk;
  try {
    const cnaUrl = "https://log.mmstat.com/eg.js";
    const tkEncUrl = "https://acs.youku.com/h5/mtop.com.youku.aplatform.weakget/1.0/?jsv=2.5.1&appKey=24679788";
    const cnaRes = await Widget.http.get(cnaUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
      },
      allow_redirects: false
    });
    console.log("cnaRes: ", cnaRes);
    console.log("cnaRes.headers: ", cnaRes.headers);
    const etag = cnaRes.headers["etag"] || cnaRes.headers["Etag"];
    console.log("etag: ", etag);
    // const match = cnaRes.headers["set-cookie"].match(/cna=([^;]+)/);
    // cna = match ? match[1] : null;
    cna = etag.replace(/^"|"$/g, '');
    console.log("cna: ", cna);

    let tkEncRes;
    while (!tkEncRes) {
      tkEncRes = await Widget.http.get(tkEncUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        },
        allow_redirects: false
      });
    }
    console.log("tkEncRes: ", tkEncRes);
    console.log("tkEncRes.headers: ", tkEncRes.headers);
    const tkEncSetCookie = tkEncRes.headers["set-cookie"] || tkEncRes.headers["Set-Cookie"];
    console.log("tkEncSetCookie: ", tkEncSetCookie);

    // 获取 _m_h5_tk_enc
    const tkEncMatch = tkEncSetCookie.match(/_m_h5_tk_enc=([^;]+)/);
    _m_h5_tk_enc = tkEncMatch ? tkEncMatch[1] : null;

    // 获取 _m_h5_tkh
    const tkH5Match = tkEncSetCookie.match(/_m_h5_tk=([^;]+)/);
    _m_h5_tk = tkH5Match ? tkH5Match[1] : null;

    console.log("_m_h5_tk_enc:", _m_h5_tk_enc);
    console.log("_m_h5_tk:", _m_h5_tk);
  } catch (error) {
    console.error("获取 cna 或 tk_enc 失败:", error);
    return null;
  }

  // 计算弹幕分段请求
  const step = 60; // 每60秒一个分段
  const max_mat = Math.floor(duration / step) + 1;
  let contents = [];
  for (let mat = 0; mat < max_mat; mat++) {
    const msg = {
      ctime: Date.now(),
      ctype: 10004,
      cver: "v1.0",
      guid: cna,
      mat: mat,
      mcount: 1,
      pid: 0,
      sver: "3.1.0",
      type: 1,
      vid: video_id,
    };

    const str = JSON.stringify(msg);
    // const buff = Buffer.from(str, "utf-8");
    // const msg_b64encode = buff.toString("base64");
    // msg.msg = msg_b64encode;

    // 2. 处理 UTF-8 编码（替代 TextEncoder 和 Buffer）
    // 对于简单的 ASCII 字符串，btoa 可以直接处理
    // 如果需要支持 UTF-8 字符（例如中文），需要手动编码
    function utf8ToLatin1(str) {
      // 将 UTF-8 字符串转换为 Latin-1 可用的字符串
      // 浏览器 btoa 只能处理 Latin-1（0-255 字符码）
      let result = '';
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode > 255) {
          // 对于非 Latin-1 字符（如中文），可以用 encodeURIComponent 转义
          result += encodeURIComponent(str[i]);
        } else {
          result += str[i];
        }
      }
      return result;
    }

    function base64Encode(input) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let output = '';
      let buffer = 0;
      let bufferLength = 0;

      for (let i = 0; i < input.length; i++) {
        buffer = (buffer << 8) | input.charCodeAt(i);
        bufferLength += 8;

        while (bufferLength >= 6) {
          output += chars[(buffer >> (bufferLength - 6)) & 0x3F];
          bufferLength -= 6;
        }
      }

      if (bufferLength > 0) {
        output += chars[(buffer << (6 - bufferLength)) & 0x3F];
      }

      while (output.length % 4 !== 0) {
        output += '=';
      }

      return output;
    }

    // 3. 转为 Base64 编码
    const msg_b64encode = base64Encode(utf8ToLatin1(str));

    // 4. 将 Base64 编码存入 msg.msg
    msg.msg = msg_b64encode;
    msg.sign = md5(`${msg_b64encode}MkmC9SoIw6xCkSKHhJ7b5D2r51kBiREr`).toString().toLowerCase();

    const data = JSON.stringify(msg);
    const t = Date.now();
    const params = {
      jsv: "2.5.6",
      appKey: "24679788",
      t: t,
      sign: md5([_m_h5_tk.slice(0, 32), t, "24679788", data].join("&")).toString().toLowerCase(),
      api: "mopen.youku.danmu.list",
      v: "1.0",
      type: "originaljson",
      dataType: "jsonp",
      timeout: "20000",
      jsonpIncPrefix: "utility",
    };

    let queryString = buildQueryString(params);
    const url = `${api_danmaku}?${queryString}`;
    console.log("piece_url: ", url);

    try {
        const response = await Widget.http.post(url, buildQueryString({ data: data }), {
          headers: {
              "Cookie": `_m_h5_tk=${_m_h5_tk};_m_h5_tk_enc=${_m_h5_tk_enc};`,
              "Referer": "https://v.youku.com",
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
          },
          allow_redirects: false
        });

        if (response.data.data && response.data.data.result) {
          const result = JSON.parse(response.data.data.result);
          if (result.code === "-1") continue;
          const danmus = result.data.result;
          for (const danmu of danmus) {
            const content = {
                timepoint: 0,	// 弹幕发送时间（秒）
                ct: 1,	// 弹幕类型，1-3 为滚动弹幕、4 为底部、5 为顶端、6 为逆向、7 为精确、8 为高级
                size: 25,	//字体大小，25 为中，18 为小
                color: 16777215,	//弹幕颜色，RGB 颜色转为十进制后的值，16777215 为白色
                unixtime: Math.floor(Date.now() / 1000),	//Unix 时间戳格式
                uid: 0,		//发送人的 id
                content: "",
            };
            content.timepoint = danmu.playat / 1000;
            if (danmu.propertis?.color) {
              content.color = JSON.parse(danmu.propertis).color;
            }
            content.content = danmu.content;
            contents.push(content);
          }
        }
    } catch (error) {
        console.error("请求失败:", error.message); // 输出错误信息
        return null;
    }
  }

  printFirst200Chars(contents);

  // 返回结果
  return convertToDanmakuXML(contents);
}

// =====================
// 人人视频 配置 & 工具
// =====================
// ---------------------
// 通用工具
// ---------------------
function sortedQueryString(params = {}) {
  const normalized = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "boolean") normalized[k] = v ? "true" : "false";
    else if (v == null) normalized[k] = "";
    else normalized[k] = String(v);
  }

  // 获取对象的所有键并排序
  const keys = [];
  for (const key in normalized) {
    if (Object.prototype.hasOwnProperty.call(normalized, key)) {
      keys.push(key);
    }
  }
  keys.sort();

  // 构建键值对数组
  const pairs = [];
  for (const key of keys) {
    // 对键和值进行 URL 编码
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(normalized[key]);
    pairs.push(`${encodedKey}=${encodedValue}`);
  }

  // 用 & 连接所有键值对
  return pairs.join('&');
}

function updateQueryString(url, params) {
  // 解析 URL
  let baseUrl = url;
  let queryString = '';
  const hashIndex = url.indexOf('#');
  let hash = '';
  if (hashIndex !== -1) {
    baseUrl = url.substring(0, hashIndex);
    hash = url.substring(hashIndex);
  }
  const queryIndex = baseUrl.indexOf('?');
  if (queryIndex !== -1) {
    queryString = baseUrl.substring(queryIndex + 1);
    baseUrl = baseUrl.substring(0, queryIndex);
  }

  // 解析现有查询字符串为对象
  const queryParams = {};
  if (queryString) {
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      if (pair) {
        const [key, value = ''] = pair.split('=').map(decodeURIComponent);
        queryParams[key] = value;
      }
    }
  }

  // 更新参数
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      queryParams[key] = params[key];
    }
  }

  // 构建新的查询字符串
  const newQuery = [];
  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      newQuery.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      );
    }
  }

  // 拼接最终 URL
  return baseUrl + (newQuery.length ? '?' + newQuery.join('&') : '') + hash;
}

function getPathname(url) {
  // 查找路径的起始位置（跳过协议和主机部分）
  let pathnameStart = url.indexOf('//') + 2;
  if (pathnameStart === 1) pathnameStart = 0; // 如果没有协议部分
  const pathStart = url.indexOf('/', pathnameStart);
  if (pathStart === -1) return '/'; // 如果没有路径，返回默认根路径
  const queryStart = url.indexOf('?', pathStart);
  const hashStart = url.indexOf('#', pathStart);
  // 确定路径的结束位置（查询字符串或片段之前）
  let pathEnd = queryStart !== -1 ? queryStart : (hashStart !== -1 ? hashStart : url.length);
  const pathname = url.substring(pathStart, pathEnd);
  return pathname || '/';
}

function generateSignature(method, aliId, ct, cv, timestamp, path, sortedQuery, secret) {
  const signStr = `${method.toUpperCase()}\naliId:${aliId}\nct:${ct}\ncv:${cv}\nt:${timestamp}\n${path}?${sortedQuery}`;
  return createHmacSha256(secret, signStr);
}

function buildSignedHeaders({ method, url, params = {}, deviceId, token }) {
  const ClientProfile = {
    client_type: "web_pc",
    client_version: "1.0.0",
    user_agent: "Mozilla/5.0",
    origin: "https://rrsp.com.cn",
    referer: "https://rrsp.com.cn/",
  };
  const pathname = getPathname(url);
  const qs = sortedQueryString(params);
  const nowMs = Date.now();
  const SIGN_SECRET = "ES513W0B1CsdUrR13Qk5EgDAKPeeKZY";
  const xCaSign = generateSignature(
    method, deviceId, ClientProfile.client_type, ClientProfile.client_version,
    nowMs, pathname, qs, SIGN_SECRET
  );
  return {
    clientVersion: ClientProfile.client_version,
    deviceId,
    clientType: ClientProfile.client_type,
    t: String(nowMs),
    aliId: deviceId,
    umid: deviceId,
    token: token || "",
    cv: ClientProfile.client_version,
    ct: ClientProfile.client_type,
    uet: "9",
    "x-ca-sign": xCaSign,
    Accept: "application/json",
    "User-Agent": ClientProfile.user_agent,
    Origin: ClientProfile.origin,
    Referer: ClientProfile.referer,
  };
}

// ====================== AES-128-ECB 完整实现 ======================

// S盒
const SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

// 轮常量
const RCON = [
  0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36
];

// 字节异或
function xor(a,b) {
  const out = new Uint8Array(a.length);
  for(let i=0;i<a.length;i++) out[i]=a[i]^b[i];
  return out;
}

// 字循环左移
function rotWord(word){
  return Uint8Array.from([word[1],word[2],word[3],word[0]]);
}

// 字节代换
function subWord(word){
  return Uint8Array.from(word.map(b=>SBOX[b]));
}

// 扩展密钥 16 字节 -> 176 字节
function keyExpansion(key) {
  const Nk = 4, Nb=4, Nr=10;
  const w = new Array(Nb*(Nr+1));
  for(let i=0;i<Nk;i++){
    w[i] = key.slice(4*i,4*i+4);
  }
  for(let i=Nk;i<Nb*(Nr+1);i++){
    let temp = w[i-1];
    if(i%Nk===0) temp = xor(subWord(rotWord(temp)), Uint8Array.from([RCON[i/Nk],0,0,0]));
    w[i]=xor(w[i-Nk],temp);
  }
  return w;
}

// AES-128 解密单块 (16 字节)
function aesDecryptBlock(input, w) {
  const Nb=4, Nr=10;
  let state = new Uint8Array(input);
  state = addRoundKey(state, w.slice(Nr*Nb,(Nr+1)*Nb));
  for(let round=Nr-1;round>=1;round--){
    state = invShiftRows(state);
    state = invSubBytes(state);
    state = addRoundKey(state, w.slice(round*Nb,(round+1)*Nb));
    state = invMixColumns(state);
  }
  state = invShiftRows(state);
  state = invSubBytes(state);
  state = addRoundKey(state, w.slice(0,Nb));
  return state;
}

// AES 辅助函数
function addRoundKey(state, w){
  const out = new Uint8Array(16);
  for(let c=0;c<4;c++)
    for(let r=0;r<4;r++)
      out[r+4*c]=state[r+4*c]^w[c][r];
  return out;
}

function invSubBytes(state){
  const INV_SBOX = new Array(256);
  for(let i=0;i<256;i++) INV_SBOX[SBOX[i]]=i;
  return Uint8Array.from(state.map(b=>INV_SBOX[b]));
}

function invShiftRows(state){
  const out = new Uint8Array(16);
  for(let r=0;r<4;r++)
    for(let c=0;c<4;c++)
      out[r+4*c]=state[r+4*((c-r+4)%4)];
  return out;
}

function invMixColumns(state){
  function mul(a,b){
    let p=0;
    for(let i=0;i<8;i++){
      if(b&1) p^=a;
      let hi=(a&0x80);
      a=(a<<1)&0xFF;
      if(hi) a^=0x1b;
      b>>=1;
    }
    return p;
  }
  const out = new Uint8Array(16);
  for(let c=0;c<4;c++){
    const col = state.slice(4*c,4*c+4);
    out[4*c+0]=mul(col[0],0x0e)^mul(col[1],0x0b)^mul(col[2],0x0d)^mul(col[3],0x09);
    out[4*c+1]=mul(col[0],0x09)^mul(col[1],0x0e)^mul(col[2],0x0b)^mul(col[3],0x0d);
    out[4*c+2]=mul(col[0],0x0d)^mul(col[1],0x09)^mul(col[2],0x0e)^mul(col[3],0x0b);
    out[4*c+3]=mul(col[0],0x0b)^mul(col[1],0x0d)^mul(col[2],0x09)^mul(col[3],0x0e);
  }
  return out;
}

// ====================== ECB 模式解密 ======================
function aesDecryptECB(cipherBytes, keyBytes){
  const w = keyExpansion(keyBytes);
  const blockSize = 16;
  const result = new Uint8Array(cipherBytes.length);
  for(let i=0;i<cipherBytes.length;i+=blockSize){
    const block = cipherBytes.slice(i,i+blockSize);
    const decrypted = aesDecryptBlock(block,w);
    result.set(decrypted,i);
  }
  return result;
}

// ====================== PKCS#7 去填充 ======================
function pkcs7Unpad(data){
  const pad = data[data.length-1];
  return data.slice(0,data.length-pad);
}

// ====================== Base64 解码 ======================
function base64ToBytes(b64) {
  // 先把 Base64 字符串转换成普通字符
  const binaryString = (typeof atob === 'function')
    ? atob(b64) // 浏览器环境
    : BufferBase64Decode(b64); // Node / React Native 自定义

  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 自定义 Base64 解码函数
function BufferBase64Decode(b64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = '';
  let buffer = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const c = b64.charAt(i);
    if (c === '=') break;
    const val = chars.indexOf(c);
    buffer = (buffer << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      str += String.fromCharCode((buffer >> bits) & 0xFF);
    }
  }
  return str;
}

// ====================== 主函数 ======================
// Uint8Array UTF-8 解码成字符串，替代 TextDecoder
function utf8BytesToString(bytes) {
  let str = "";
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    if (b1 < 0x80) {
      str += String.fromCharCode(b1);
    } else if (b1 >= 0xc0 && b1 < 0xe0) {
      const b2 = bytes[i++];
      str += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
    } else if (b1 >= 0xe0 && b1 < 0xf0) {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      str += String.fromCharCode(((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f));
    } else if (b1 >= 0xf0) {
      // surrogate pair
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      const b4 = bytes[i++];
      const codepoint = ((b1 & 0x07) << 18) |
                        ((b2 & 0x3f) << 12) |
                        ((b3 & 0x3f) << 6) |
                        (b4 & 0x3f);
      const cp = codepoint - 0x10000;
      str += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
    }
  }
  return str;
}

// 同时替换 TextEncoder
function stringToUtf8Bytes(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6));
      bytes.push(0x80 | (code & 0x3f));
    } else if (code < 0xd800 || code >= 0xe000) {
      bytes.push(0xe0 | (code >> 12));
      bytes.push(0x80 | ((code >> 6) & 0x3f));
      bytes.push(0x80 | (code & 0x3f));
    } else {
      // surrogate pair
      i++;
      const code2 = str.charCodeAt(i);
      const codePoint = 0x10000 + (((code & 0x3ff) << 10) | (code2 & 0x3ff));
      bytes.push(0xf0 | (codePoint >> 18));
      bytes.push(0x80 | ((codePoint >> 12) & 0x3f));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

// 修改后的 aesDecryptBase64
function aesDecryptBase64(cipherB64, keyStr) {
  try {
    const cipherBytes = base64ToBytes(cipherB64);
    const keyBytes = stringToUtf8Bytes(keyStr);
    const decryptedBytes = aesDecryptECB(cipherBytes, keyBytes);
    const unpadded = pkcs7Unpad(decryptedBytes);
    return utf8BytesToString(unpadded);
  } catch (e) {
    // postDebugInfo({
    //     "错误类型": "自动解码失败",
    //     "错误信息": e.message,
    //     "错误详情": e.stack || e.toString()
    // });
    console.error(e);
    return null;
  }
}

function autoDecode(anything) {
  const text = typeof anything === "string" ? anything.trim() : JSON.stringify(anything ?? "");
  try {
    return JSON.parse(text);
  } catch {}

  const AES_KEY = "3b744389882a4067"; // 直接传字符串
  const dec = aesDecryptBase64(text, AES_KEY); // aesDecryptBase64 内会 TextEncoder.encode
  if (dec != null) {
    try {
      return JSON.parse(dec);
    } catch {
      return dec;
    }
  }
  return text;
}

function str2bytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6));
            bytes.push(0x80 | (code & 0x3f));
        } else if (code < 0x10000) {
            bytes.push(0xe0 | (code >> 12));
            bytes.push(0x80 | ((code >> 6) & 0x3f));
            bytes.push(0x80 | (code & 0x3f));
        }
    }
    return bytes;
}

// ===================== Base64 编码 =====================
function bytesToBase64(bytes) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i;
    for (i = 0; i + 2 < bytes.length; i += 3) {
        result += chars[bytes[i] >> 2];
        result += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        result += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        result += chars[bytes[i + 2] & 63];
    }
    if (i < bytes.length) {
        result += chars[bytes[i] >> 2];
        if (i + 1 < bytes.length) {
            result += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            result += chars[(bytes[i + 1] & 15) << 2];
            result += '=';
        } else {
            result += chars[(bytes[i] & 3) << 4];
            result += '==';
        }
    }
    return result;
}

// ===================== SHA256 算法 =====================
// 纯 JS SHA256，返回字节数组
function sha256(ascii) {
    function rightRotate(n, x) { return (x >>> n) | (x << (32 - n)); }

    let maxWord = Math.pow(2, 32);
    let words = [], asciiBitLength = ascii.length * 8;

    for (let i = 0; i < ascii.length; i++) {
        words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i) % 4 * 8);
    }

    words[ascii.length >> 2] |= 0x80 << ((3 - ascii.length % 4) * 8);
    words[((ascii.length + 8) >> 6) * 16 + 15] = asciiBitLength;

    let w = new Array(64), hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const k = [
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
        0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
        0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
        0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
        0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
        0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];

    for (let j = 0; j < words.length; j += 16) {
        let a = hash[0], b = hash[1], c = hash[2], d = hash[3],
            e = hash[4], f = hash[5], g = hash[6], h = hash[7];

        for (let i = 0; i < 64; i++) {
            if (i < 16) w[i] = words[j + i] | 0;
            else {
                const s0 = rightRotate(7, w[i-15]) ^ rightRotate(18, w[i-15]) ^ (w[i-15]>>>3);
                const s1 = rightRotate(17, w[i-2]) ^ rightRotate(19, w[i-2]) ^ (w[i-2]>>>10);
                w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
            }
            const S1 = rightRotate(6, e) ^ rightRotate(11, e) ^ rightRotate(25, e);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
            const S0 = rightRotate(2, a) ^ rightRotate(13, a) ^ rightRotate(22, a);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) | 0;

            h = g; g = f; f = e; e = (d + temp1) | 0;
            d = c; c = b; b = a; a = (temp1 + temp2) | 0;
        }

        hash[0] = (hash[0] + a) | 0;
        hash[1] = (hash[1] + b) | 0;
        hash[2] = (hash[2] + c) | 0;
        hash[3] = (hash[3] + d) | 0;
        hash[4] = (hash[4] + e) | 0;
        hash[5] = (hash[5] + f) | 0;
        hash[6] = (hash[6] + g) | 0;
        hash[7] = (hash[7] + h) | 0;
    }

    // 转为字节数组
    const bytes = [];
    for (let h of hash) {
        bytes.push((h >> 24) & 0xFF);
        bytes.push((h >> 16) & 0xFF);
        bytes.push((h >> 8) & 0xFF);
        bytes.push(h & 0xFF);
    }
    return bytes;
}

// ===================== HMAC-SHA256 =====================
function createHmacSha256(key, message) {
    const blockSize = 64; // 512 bit
    let keyBytes = str2bytes(key);
    if (keyBytes.length > blockSize) keyBytes = sha256(key);
    if (keyBytes.length < blockSize) keyBytes = keyBytes.concat(Array(blockSize - keyBytes.length).fill(0));

    const oKeyPad = keyBytes.map(b => b ^ 0x5c);
    const iKeyPad = keyBytes.map(b => b ^ 0x36);

    const innerHash = sha256(String.fromCharCode(...iKeyPad) + message);
    const hmacBytes = sha256(String.fromCharCode(...oKeyPad) + String.fromCharCode(...innerHash));

    return bytesToBase64(hmacBytes);
}

async function httpGet(url, { params = {}, headers = {} } = {}) {
  const u = updateQueryString(url, params)
  const resp = await Widget.http.get(u, {
      headers: headers,
  });
  return resp;
}

// =====================
// RenrenScraper 类
// =====================
// ---------------------
// 工具方法
// ---------------------
function generateDeviceId() {
  return (Math.random().toString(36).slice(2)).toUpperCase();
}

async function renrenRequest(method, url, params = {}) {
  const deviceId = generateDeviceId();
  const headers = buildSignedHeaders({ method, url, params, deviceId });
  const resp = await Widget.http.get(url + "?" + sortedQueryString(params), {
      headers: headers,
  });
  return resp;
}

// ---------------------
// 搜索
// ---------------------
async function search(keyword, episodeInfo = null) {
  const parsedKeyword = { title: keyword, season: null }; // 简化 parse_search_keyword
  const searchTitle = parsedKeyword.title;
  const searchSeason = parsedKeyword.season;

  const lock = { value: false };
  const lastRequestTime = { value: 0 };
  let allResults = await performNetworkSearch(searchTitle, episodeInfo, { lockRef: lock, lastRequestTimeRef: lastRequestTime, minInterval: 400 });

  if (searchSeason == null) return allResults;

  // 按 season 过滤
  return allResults.filter(r => r.season === searchSeason);
}

async function performNetworkSearch(
  keyword,
  episodeInfo = null,
  {
    lockRef = null,
    lastRequestTimeRef = { value: 0 },  // 调用方传引用
    minInterval = 500                   // 默认节流间隔（毫秒）
  } = {}
) {
  const url = `https://api.rrmj.plus/m-station/search/drama`;
  const params = { keywords: keyword, size: 20, order: "match", search_after: "", isExecuteVipActivity: true };

  // 🔒 锁逻辑（可选）
  if (lockRef) {
    while (lockRef.value) await new Promise(r => setTimeout(r, 50));
    lockRef.value = true;
  }

  // ⏱️ 节流逻辑（依赖 lastRequestTimeRef）
  const now = Date.now();
  const dt = now - lastRequestTimeRef.value;
  if (dt < minInterval) await new Promise(r => setTimeout(r, minInterval - dt));

  const resp = await renrenRequest("GET", url, params);
  lastRequestTimeRef.value = Date.now(); // 更新引用

  if (lockRef) lockRef.value = false;

  if (!resp.data) return [];

  const decoded = autoDecode(resp.data);
  const list = decoded?.data?.searchDramaList || [];
  return list.map((item, idx) => ({
    provider: "renren",
    mediaId: String(item.id),
    title: String(item.title || "").replace(/<[^>]+>/g, "").replace(/:/g, "："),
    type: "tv_series",
    season: null,
    year: item.year,
    imageUrl: item.cover,
    episodeCount: item.episodeTotal,
    currentEpisodeIndex: episodeInfo?.episode ?? null,
  }));
}

// ---------------------
// URL信息提取
// ---------------------
async function getInfoFromUrl(url) {
  const m = String(url).match(/\/v\/(\d+)/);
  if (!m) return null;
  const dramaId = m[1];
  const detail = await fetchDramaDetail(dramaId);
  if (!detail) return null;
  const titleClean = String(detail.dramaInfo.title).replace(/<[^>]+>/g,"").replace(/:/g,"：");
  const searchResults = await search(titleClean);
  const bestMatch = searchResults.find(r=>r.mediaId===dramaId);
  if (bestMatch && !bestMatch.episodeCount) bestMatch.episodeCount = (detail.episodeList?.length || 0);
  if (bestMatch) return bestMatch;
  return {
    provider: "renren",
    mediaId: dramaId,
    title: titleClean,
    type: "tv_series",
    season: null,
    episodeCount: (detail.episodeList?.length || null)
  };
}

function getIdFromUrl(url) {
  const m = String(url).match(/\/v\/\d+\/(\d+)/);
  return m ? m[1] : null;
}

function formatEpisodeIdForComments(providerEpisodeId) {
  return String(providerEpisodeId);
}

async function fetchDramaDetail(dramaId) {
  const url = `https://api.rrmj.plus/m-station/drama/page`;
  const params = { hsdrOpen:0,isAgeLimit:0,dramaId:String(dramaId),hevcOpen:1 };
  const resp = await renrenRequest("GET", url, params);
  if (!resp.data) return null;
  const decoded = autoDecode(resp.data);
  return decoded?.data || null;
}

async function _episodeCountFromSid(dramaId) {
  const detail = await fetchDramaDetail(dramaId);
  if (!detail || !detail.episodeList) return null;
  return detail.episodeList.filter(ep => String(ep.sid).trim()).length;
}

async function getEpisodes(mediaId, targetEpisodeIndex=null, dbMediaType=null) {
  const detail = await fetchDramaDetail(mediaId);
  if (!detail || !detail.episodeList) return [];

  let episodes = [];
  detail.episodeList.forEach((ep, idx)=>{
    const sid = String(ep.sid || "").trim();
    if(!sid) return;
    const title = String(ep.title || `第${idx+1}`.padStart(2,"0")+"集");
    episodes.push({ sid, order: idx+1, title });
  });

  if(targetEpisodeIndex) episodes = episodes.filter(e=>e.order===targetEpisodeIndex);

  return episodes.map(e=>({
    provider: "renren",
    episodeId: e.sid,
    title: e.title,
    episodeIndex: e.order,
    url: null
  }));
}

// ---------------------
// 弹幕
// ---------------------
async function fetchEpisodeDanmu(sid) {
  const ClientProfile = {
    user_agent: "Mozilla/5.0",
    origin: "https://rrsp.com.cn",
    referer: "https://rrsp.com.cn/",
  };
  const url = `https://static-dm.rrmj.plus/v1/produce/danmu/EPISODE/${sid}`;
  const headers = {
    "Accept": "application/json",
    "User-Agent": ClientProfile.user_agent,
    "Origin": ClientProfile.origin,
    "Referer": ClientProfile.referer,
  };
  const resp = await httpGet(url, { headers });
  if (!resp.data) return null;
  const data = autoDecode(resp.data);
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return null;
}

function parseRRSPPFields(pField) {
  const parts = String(pField).split(",");
  const num = (i, cast, dft) => { try { return cast(parts[i]); } catch { return dft; } };
  const timestamp = num(0, parseFloat, 0);
  const mode = num(1, x=>parseInt(x,10),1);
  const size = num(2, x=>parseInt(x,10),25);
  const color = num(3, x=>parseInt(x,10),16777215);
  const userId = parts[6] || "";
  const contentId = parts[7] || `${timestamp}:${userId}`;
  return { timestamp, mode, size, color, userId, contentId };
}

function formatComments(items) {
  const unique = {};
  for(const it of items){
    const text = String(it.d||"");
    const meta = parseRRSPPFields(it.p);
    if(!unique[meta.contentId]) unique[meta.contentId] = { content: text, ...meta };
  }

  const grouped = {};
  for(const c of Object.values(unique)){
    if(!grouped[c.content]) grouped[c.content] = [];
    grouped[c.content].push(c);
  }

  const processed = [];
  for(const [content, group] of Object.entries(grouped)){
    if(group.length===1) processed.push(group[0]);
    else{
      const first = group.reduce((a,b)=>a.timestamp<b.timestamp?a:b);
      processed.push({...first, content:`${first.content} X${group.length}`});
    }
  }

  return processed.map(c=>({
    cid: c.contentId,
    p: `${c.timestamp.toFixed(2)},${c.mode},${c.color},["renren"]`,
    m: c.content,
    t: c.timestamp
  }));
}

async function getRenRenComments(episodeId, progressCallback=null){
  if(progressCallback) await progressCallback(5,"开始获取弹幕人人弹幕");
  console.log("开始获取弹幕人人弹幕");
  const raw = await fetchEpisodeDanmu(episodeId);
  if(progressCallback) await progressCallback(85,`原始弹幕 ${raw.length} 条，正在规范化`);
  console.log(`原始弹幕 ${raw.length} 条，正在规范化`);
  const formatted = formatComments(raw);
  if(progressCallback) await progressCallback(100,`弹幕处理完成，共 ${formatted.length} 条`);
  console.log(`弹幕处理完成，共 ${formatted.length} 条`);
  return formatted;
}

async function fetchTmdbData(id, type) {
    const tmdbResult = await Widget.tmdb.get(`/${type}/${id}`, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    //打印结果
    // console.log("搜索内容：" + key)
    if (!tmdbResult) {
        console.log("搜索内容失败：", `/${type}/${id}`);
        return null;
    }
    console.log("tmdbResults:" + JSON.stringify(tmdbResult, null, 2));
    // console.log("tmdbResults.total_results:" + tmdbResults.total_results);
    // console.log("tmdbResults.results[0]:" + tmdbResults.results[0]);
    return tmdbResult;
}

async function getPlayurls(title, tmdbInfo, type, season) {
  let queryTitle = title;

  const response = await Widget.http.get(
    `https://api.so.360kan.com/index?force_v=1&kw=${queryTitle}&from=&pageno=1&v_ap=1&tab=all`,
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 15,
    }
  );

  if (!response) {
    throw new Error("获取数据失败");
  }

  const data = response.data;
  console.log("360kan response:", data);

  // 检查API返回状态
  if (data.msg !== "ok") {
    throw new Error(data.errorMessage || "API调用失败");
  }

  // 开始过滤数据
  let animes = [];
  const longData = data.data.longData;
  if (longData.rows && longData.rows.length > 0) {
    animes = longData.rows.filter((anime) => {
      if ((anime.cat_name === "电视剧" || anime.cat_name === "动漫") && type === "tv" && tmdbInfo.type !== "Reality") {
        return true;
      } else if (anime.cat_name === "综艺" && type === "tv" && tmdbInfo.type === "Reality") {
        return true;
      } else if (anime.cat_name === "电影" && type === "movie") {
        return true;
      } else {
        return false;
      }
    });
    if (season && tmdbInfo.type !== "Reality") {
      // filter season
      const matchedAnimes = animes.filter((anime) => {
        if (!anime.seriesPlaylinks || anime.seriesPlaylinks.length === 0) {
          return false;
        }
        let anime_title = anime.title.replace(/<\/b>·<b>/g, '');

        if (anime_title.includes(queryTitle) && anime.titleTxt.charAt(0) === queryTitle.charAt(0)) {
          // use space to split animeTitle
          let titleParts = anime_title.split("</b>");
          console.log(titleParts);
          if (titleParts.length > 1) {
            let seasonPart = titleParts[1];
            // match number from seasonPart
            let seasonIndex = seasonPart.match(/\d+/);
            if (seasonIndex && String(seasonIndex[0]) === String(season)) {
              return true;
            }
            // match chinese number
            let chineseNumber = seasonPart.match(/[一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+/);
            if (chineseNumber && String(convertChineseNumber(chineseNumber[0])) === String(season)) {
              return true;
            }
            // match season 1 and no seasonPart
            if (String(season) === "1" && seasonPart === "") {
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      });
      animes = matchedAnimes;
    }
    if (season && tmdbInfo.type === "Reality") {
      const matchedAnimes = animes.filter((anime) => {
        if (anime.cat_name !== "综艺") {
          return false;
        }
        return true;
      });
      animes = matchedAnimes;
    }
  }

  console.log("animes.length:", animes.length);

  if (animes.length >= 1 && tmdbInfo.type !== "Reality") {
    const tmdbYear = type === "tv" ? tmdbInfo.first_air_date.split("-")[0] : tmdbInfo.release_date.split("-")[0];

    animes = animes.filter(anime => anime.year == tmdbYear);
  }

  return animes;
}

async function searchDanmu(params) {
  const { tmdbId, type, title, season, link, videoUrl, danmu_server } = params;

  // const animes = await getPlayurls(title, tmdbId, type, season);

  return {
    animes: [
      {
        "animeId": 1223,
        "bangumiId": "string",
        "animeTitle": title,
        "type": "tvseries",
        "typeDescription": "string",
        "imageUrl": "string",
        "startDate": "2025-08-08T13:25:11.189Z",
        "episodeCount": 12,
        "rating": 0,
        "isFavorited": true
      }
    ]
  };
}

function convertChineseNumber(chineseNumber) {
  // 如果是阿拉伯数字，直接转换
  if (/^\d+$/.test(chineseNumber)) {
    return Number(chineseNumber);
  }

  // 中文数字映射（简体+繁体）
  const digits = {
    // 简体
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9,
    // 繁体
    '壹': 1, '貳': 2, '參': 3, '肆': 4, '伍': 5,
    '陸': 6, '柒': 7, '捌': 8, '玖': 9
  };

  // 单位映射（简体+繁体）
  const units = {
    // 简体
    '十': 10, '百': 100, '千': 1000,
    // 繁体
    '拾': 10, '佰': 100, '仟': 1000
  };

  let result = 0;
  let current = 0;
  let lastUnit = 1;

  for (let i = 0; i < chineseNumber.length; i++) {
    const char = chineseNumber[i];

    if (digits[char] !== undefined) {
      // 数字
      current = digits[char];
    } else if (units[char] !== undefined) {
      // 单位
      const unit = units[char];

      if (current === 0) current = 1;

      if (unit >= lastUnit) {
        // 更大的单位，重置结果
        result = current * unit;
      } else {
        // 更小的单位，累加到结果
        result += current * unit;
      }

      lastUnit = unit;
      current = 0;
    }
  }

  // 处理最后的个位数
  if (current > 0) {
    result += current;
  }

  return result;
}

function convertYoukuUrl(url) {
  // 使用正则表达式提取 vid 参数
  const vidMatch = url.match(/vid=([^&]+)/);
  if (!vidMatch || !vidMatch[1]) {
    return null; // 如果没有找到 vid 参数，返回 null
  }

  const vid = vidMatch[1];
  // 构造新的 URL
  return `https://v.youku.com/v_show/id_${vid}.html`;
}

function generateDanmaku(message, count) {
  const comments = [];
  const baseP = "1,1,25,16777215,1754803089,0,0,26732601000067074,1"; // 原始 p 字符串

  for (let i = 0; i < count; i++) {
    // 增加 cid
    const cid = i;

    // 修改 p 的第一位数字，加 5
    const pParts = baseP.split(',');
    pParts[0] = (parseInt(pParts[0], 10) + i * 5).toString(); // 每次增加 i * 5
    const updatedP = pParts.join(',');

    // 使用传入的 m 参数
    const m = message;

    // 生成每个弹幕对象
    comments.push({
      cid: cid,
      p: updatedP,
      m: m
    });
  }

  return {
    count: comments.length,
    comments: comments
  };
}


function printParams(seriesName, episodeName, airDate, runtime, premiereDate, season, episode, tmdbId) {
    /*
    seriesName: 歌手
    episodeName: 第13期：荣耀汇聚终极一战
    airDate: 2025-08-08
    runtime: 12360
    premiereDate: 08/08 08:00
    season: 10
    episode: 13
    tmdbId: 107467
    */
    const comments = [];
    comments.push({
        cid: 0,
        p: "1,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `seriesName: ${seriesName}`
    });
    comments.push({
        cid: 0,
        p: "6,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `episodeName: ${episodeName}`
    });
    comments.push({
        cid: 0,
        p: "11,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `airDate: ${airDate}`
    });
    comments.push({
        cid: 0,
        p: "16,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `runtime: ${runtime}`
    });
    comments.push({
        cid: 0,
        p: "21,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `premiereDate: ${premiereDate}`
    });
    comments.push({
        cid: 0,
        p: "26,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `season: ${season}`
    });
    comments.push({
        cid: 0,
        p: "31,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `episode: ${episode}`
    });
    comments.push({
        cid: 0,
        p: "36,1,25,16777215,1754803089,0,0,26732601000067074,1",
        m: `tmdbId: ${tmdbId}`
    });
    return {
        count: 8,
        comments: comments
    };
}

async function getDanmuFromUrl(danmu_server, playUrl, debug, danmu_server_polling) {
    const danmu_server_list = [
        "http://127.0.0.1",
        "https://fc.lyz05.cn",
        "https://dmku.hls.one",
        "https://api.danmu.icu",
        "https://se.678.ooo",
        "https://danmu.56uxi.com",
        "https://dm.lxlad.com",
    ];

    // 统一的请求函数
    async function fetchDanmu(server) {
        if (server === "http://127.0.0.1") {
            let res = await fetchLocalhost(playUrl);
            // 弹幕中有特殊字符会导致弹幕消失
            // res = fixDTagContent(res);

            // const fs = require("fs");
            //
            // // 写入到文件，用于调试
            // fs.writeFileSync("output.xml", res, "utf-8");
            //
            // console.log("已成功写入 output.xml");

            const danmuCount = parseDanmuku(res);
            return danmuCount >= 5 ? res : null; // 如果弹幕数大于等于 5，返回弹幕数据
        }
        try {
            const response = await Widget.http.get(
                `${server}/?url=${playUrl}&ac=dm`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    },
                    timeout: 15,
                }
            );

            console.log(`danmu response from ${server}: ↓↓↓`);
            printFirst200Chars(response.data);

            const danmuCount = parseDanmuku(response.data);
            return danmuCount >= 5 ? response.data : null; // 如果弹幕数大于等于 5，返回弹幕数据
        } catch (error) {
            console.error(`请求 ${server} 失败:`, error);
            return null;  // 如果请求失败，返回 null
        }
    }

    // 先查询传入的 danmu_server
    let result = await fetchDanmu(danmu_server);
    printFirst200Chars(result);
    if (result) return result;

    // 如果传入的 danmu_server 不满足条件，查询 danmu_server_list 中的其他服务器
    if (danmu_server_polling === "true") {
        for (let server of danmu_server_list) {
            if (server === danmu_server) continue;  // 如果是传入的 danmu_server，跳过

            result = await fetchDanmu(server);
            if (result) return result;  // 如果获取到有效弹幕，返回弹幕数据
        }
    }

    // 如果遍历完所有服务器都没有获得有效弹幕，返回默认错误信息
    const count = debug === "true" ? 24 : 1;
    return generateDanmaku(`【自动链接弹幕】：弹幕服务器异常，轮询后还是未获得到有效弹幕`, count);
}

// 用于在手机上调试打印
function postDebugInfo(content) {
  Widget.http.post("http://192.168.123.31:8080", content, {
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
    },
  });
}

async function getDanmuFromRenRen(title, tmdbInfo, type, season, episode, episodeName) {
  const results = await search(title);
  console.log("人人视频搜索结果：", results);

  let animes = results.filter(s => s.title.includes(title));

  // postDebugInfo({"animes": animes});

  let tmdbYear;
  if (animes.length >= 1) {
      if (type === "tv") {
          const targetSeason = tmdbInfo.seasons.find(s => s.season_number === Number(season));
          if (!targetSeason) {
              return null;
          }
          tmdbYear = targetSeason.air_date.split("-")[0]
      } else {
          tmdbYear = tmdbInfo.release_date.split("-")[0]
      }
      console.log("tmdbYear: ", tmdbYear);

      animes = animes.filter(anime => anime.year == tmdbYear);
  }

  if (animes.length === 0) {
      return null;
  }

  if(animes.length > 0){
    const eps = await getEpisodes(animes[0].mediaId);
    console.log("人人视频分集：", eps);
    // postDebugInfo({"eps": eps});

    if (eps.length === 0) {
      return null;
    }

    if (type === "tv" && eps.length < episode) {
      return null;
    }

    let episodeNum = type === "tv" ? episode-1 : 0;

    const danmus = await getRenRenComments(eps[episodeNum].episodeId);
    console.log("弹幕前10：", danmus.slice(0,10));

    return danmus;
  }
}

async function getCommentsById(params) {
  const { danmu_server, danmu_server_polling, platform, vod_site, vod_site_polling, debug, commentId, seriesName,
      episodeName, airDate, runtime, premiereDate, link, videoUrl, season, episode, tmdbId, type, title,
    danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5, api_priority, skip360kan } = params;

  // 测试参数值
  // return printParams(seriesName, episodeName, airDate, runtime, premiereDate, season, episode, tmdbId);

  // 手动链接弹幕模块逻辑迁移到这
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?$/;
  if (urlRegex.test(title)) {
      console.log("原始播放链接：", title);
      const url = await convertMobileToPcUrl(title);
      if (urlRegex.test(title)) {
          console.log("转换后播放链接：", url);
          return await getDanmuFromUrl(danmu_server, url, debug, danmu_server_polling);
      }
  }

  if (typeof tmdbId === 'undefined') {
    const count = debug === "true" ? 24 : 1;
    return generateDanmaku("【自动链接弹幕】：参数tmdbId为undefined", count);
  }

  let playUrl = null;
  let playUrlList = [];

  const tmdbInfo = await fetchTmdbData(tmdbId, type);

  if (api_priority === "true") {
      const result = await getDanmuFromAPI(title, tmdbInfo, type, season, episode, episodeName, airDate,
          danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5);
      if (result) {
        return result;
      }
  }

  let animes = [];
  if (skip360kan !== "true") {
    animes = await getPlayurls(title, tmdbInfo, type, season);
  }
  console.log("animes.length:", animes.length);

  if (animes.length === 0) {
    playUrl = await getPlayurlFromVod(title, tmdbInfo, type, season, episode, episodeName, airDate, platform, vod_site, vod_site_polling);
    if (playUrl) {
        return await getDanmuFromUrl(danmu_server, playUrl, debug, danmu_server_polling);
    }
    if (!playUrl && api_priority === "false") {
        const renrenDanmu = await getDanmuFromRenRen(title, tmdbInfo, type, season, episode, episodeName);
        if (renrenDanmu) {
          return renrenDanmu;
        }
    }
    if (!playUrl && api_priority === "false") {
        const result = await getDanmuFromAPI(title, tmdbInfo, type, season, episode, episodeName, airDate,
            danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5);
        if (result) {
          return result;
        }
    }
    if (!playUrl) {
        const count = debug === "true" ? 24 : 1;
        return generateDanmaku("【自动链接弹幕】：相关站点没有找到这部影视剧", count);
    }
  }

  if (tmdbInfo.type !== "Reality") {
      console.log("anime: ", animes[0]);

      if (type === "tv") {
        if (episode - 1 >= 0 && episode - 1 < animes[0].seriesPlaylinks.length) {
            playUrl = animes[0].seriesPlaylinks[episode - 1].url;
        } else {
            playUrl = await getPlayurlFromVod(title, tmdbInfo, type, season, episode, episodeName, airDate, platform, vod_site, vod_site_polling);
            if (playUrl) {
                return await getDanmuFromUrl(danmu_server, playUrl, debug, danmu_server_polling);
            }
            if (!playUrl && api_priority === "false") {
                const renrenDanmu = await getDanmuFromRenRen(title, tmdbInfo, type, season, episode, episodeName);
                if (renrenDanmu) {
                  return renrenDanmu;
                }
            }
            if (!playUrl && api_priority === "false") {
                const result = await getDanmuFromAPI(title, tmdbInfo, type, season, episode, episodeName, airDate,
                    danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5);
                if (result) {
                  return result;
                }
            }
            if (!playUrl) {
                const count = debug === "true" ? 24 : 1;
                return generateDanmaku("【自动链接弹幕】：没有找到该集弹幕", count);
            }
        }
      } else {
        // 获取所有平台名称
        if (platform === "random" || !animes[0].playlinks[platform]) {
          const allowedPlatforms = ["qiyi", "bilibili1", "imgo", "youku", "qq"];
          // 随机选择一个平台
          const filteredLinks = Object.keys(animes[0].playlinks).filter(platform => allowedPlatforms.includes(platform));
          const randomPlatform = filteredLinks[Math.floor(Math.random() * filteredLinks.length)];
          console.log(`Random platform: ${randomPlatform}`);
          // 获取对应平台的链接
          playUrl = animes[0].playlinks[randomPlatform];
        } else {
          console.log(`Selected platform: ${platform}`);
          playUrl = animes[0].playlinks[platform];
        }
      }
  } else {
      if (!episodeName) {
          playUrl = await getPlayurlFromVod(title, tmdbInfo, type, season, episode, episodeName, airDate, platform, vod_site, vod_site_polling);
          if (playUrl) {
              return await getDanmuFromUrl(danmu_server, playUrl, debug, danmu_server_polling);
          }
          if (!playUrl && api_priority === "false") {
              const renrenDanmu = await getDanmuFromRenRen(title, tmdbInfo, type, season, episode, episodeName);
              if (renrenDanmu) {
                return renrenDanmu;
              }
          }
          if (!playUrl && api_priority === "false") {
              const result = await getDanmuFromAPI(title, tmdbInfo, type, season, episode, episodeName, airDate,
                  danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5);
              if (result) {
                return result;
              }
          }
          if (!playUrl) {
              const count = debug === "true" ? 24 : 1;
              return generateDanmaku("【自动链接弹幕】：该集综艺没有集标题，匹配不了", count);
          }
      }
      // 如果存在airDate，则先获取airDate的年份，并通过年份获取所有年份相关的集信息
      let airYear = null;
      if (airDate && airDate !== "" && /^\d{4}-\d{2}-\d{2}$/.test(airDate)) {
          airYear = airDate.split("-")[0];
      }
      console.log("airYear: ", airYear);
      for (let i = 0; i < animes.length; i++) {
          for (const key of Object.keys(animes[i].playlinks_year)) {
            for (const year of animes[i].playlinks_year[key]) {
                if (!airYear || year === Number(airYear)) {
                    console.log(`键: ${key}, 年份: ${year}`);
                    for (let j = 0; j <= 10; j++) {
                        const response = await Widget.http.get(
                            `https://api.so.360kan.com/episodeszongyi?entid=${animes[i].id}&site=${key}&y=${year}&count=20&offset=${j*20}`,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                                },
                                timeout: 15,
                            }
                        );

                        const data = response.data;
                        console.log("360kan zongyi response:", data);

                        // 检查API返回状态
                        if (data.msg !== "ok") {
                            throw new Error(data.errorMessage || "API调用失败");
                        }

                        const episodeList = data.data.list;
                        if (!episodeList) {
                            break;
                        }
                        for (const episodeInfo of episodeList) {
                            if (airDate && episodeInfo.pubdate === airDate) {
                                playUrlList.push(episodeInfo);
                            }
                            if (episodeInfo.name === episodeName) {
                                playUrl = episodeInfo.url;
                                break
                            }
                        }
                        if (playUrl) {
                            break
                        }
                    }
                }
                if (playUrl) {
                    break
                }
            }
            if (playUrl) {
                break
            }
        }
        if (playUrl) {
            break
        }
      }
  }

  if (!playUrl && playUrlList.length !== 0) {
      playUrl = playUrlList[0].url;
  }

  console.log("playUrl: ", playUrl);

  if (!playUrl) {
      playUrl = await getPlayurlFromVod(title, tmdbInfo, type, season, episode, episodeName, airDate, platform, vod_site, vod_site_polling);
      if (playUrl) {
          return await getDanmuFromUrl(danmu_server, playUrl, debug, danmu_server_polling);
      }
      if (!playUrl && api_priority === "false") {
          const renrenDanmu = await getDanmuFromRenRen(title, tmdbInfo, type, season, episode, episodeName);
          if (renrenDanmu) {
            return renrenDanmu;
          }
      }
      if (!playUrl && api_priority === "false") {
          const result = await getDanmuFromAPI(title, tmdbInfo, type, season, episode, episodeName, airDate,
              danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5);
          if (result) {
            return result;
          }
      }
      if (!playUrl) {
          const count = debug === "true" ? 24 : 1;
          return generateDanmaku("【自动链接弹幕】：没有获取到相应播放链接！", count);
      }
  }

  // 处理302场景
  // https://v.youku.com/video?vid=XNjQ4MTIwOTE2NA==&tpa=dW5pb25faWQ9MTAyMjEzXzEwMDAwNl8wMV8wMQ需要转成https://v.youku.com/v_show/id_XNjQ4MTIwOTE2NA==.html
  if (playUrl.includes("youku.com/video?vid")) {
      playUrl = convertYoukuUrl(playUrl);
  }

  return await getDanmuFromUrl(danmu_server, playUrl, debug, danmu_server_polling);
}

function extractAndFormatDate(episodeKey) {
    // 检查 YYYYMMDD 格式（如 20220612）
    const yyyymmddRegex = /^\d{8}/;
    // 检查 YYYY-MM-DD 格式（如 2014-01-03）
    const yyyy_mm_ddRegex = /^\d{4}-\d{2}-\d{2}/;

    let dateStr = null;

    // 优先检查 YYYYMMDD 格式
    if (yyyymmddRegex.test(episodeKey)) {
        dateStr = episodeKey.slice(0, 8);
        // 转换为 YYYY-MM-DD
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    // 检查 YYYY-MM-DD 格式
    else if (yyyy_mm_ddRegex.test(episodeKey)) {
        dateStr = episodeKey.slice(0, 10);
        // 已经是正确格式，直接返回
        return dateStr;
    }

    // 如果没有找到有效日期格式，返回 null
    return null;
}

async function getPlayurlFromVod(title, tmdbInfo, type, season, episode, episodeName, airDate, platform, vod_site, vod_site_polling) {
  let response;
  const vod_sites = ["https://www.caiji.cyou", "https://gctf.tfdh.top", "https://www.69mu.cn", "https://zy.xmm.hk"];

  // 定义一个异步函数来处理单个请求
  async function tryRequest(site, title) {
      try {
        const response = await Widget.http.get(
          `${site}/api.php/provide/vod/?ac=detail&wd=${title}&pg=1`,
          {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 15,
          }
        );
        // 检查 response.data.list 是否存在且长度大于 0
        if (response && response.data && response.data.list && response.data.list.length > 0) {
          console.log(`请求 ${site} 成功`);
          return response;
        } else {
          console.log(`请求 ${site} 成功，但 response.data.list 为空`);
          return null;
        }
      } catch (error) {
        console.error(`请求 ${site} 失败:`, error.message);
        return null;
      }
  }

  // 主逻辑
  async function fetchVodData(vod_site, title) {
      // 首先尝试用户指定的 vod_site
      response = await tryRequest(vod_site, title);
      if (response) {
        return response;
      }

      if (vod_site_polling === "false") {
          return null;
      }

      // 过滤掉用户指定的 vod_site
      const filteredSites = vod_sites.filter(site => site !== vod_site);

      // 如果没有其他服务器，返回 null
      if (filteredSites.length === 0) {
        console.error("没有其他服务器可尝试");
        return null;
      }

      // 轮询剩余的服务器
      for (const site of filteredSites) {
        response = await tryRequest(site, title);
        if (response) {
          return response; // 找到有效响应，立即返回
        }
      }

      // 所有服务器都尝试失败或返回空列表
      console.error("所有服务器请求失败或返回空列表");
      return null;
  }

  response = await fetchVodData(vod_site, title);

  if (!response) {
      return null;
  }

  const data = response.data;
  console.log("vod response: ↓↓↓");
  printFirst200Chars(data);

  // 开始过滤数据
  let animes = [];
  if (data.list && data.list.length > 0) {
    animes = data.list.filter((anime) => {
      if ((anime.type_name === "电视剧" || anime.type_name === "动漫" || anime.type_name === "连续剧" || anime.type_name === "少儿"
          || anime.type_name.includes("剧") || anime.type_name.includes("国创")
      ) && type === "tv" && tmdbInfo.type !== "Reality") {
        return true;
      } else if (anime.type_name === "综艺" && type === "tv" && tmdbInfo.type === "Reality") {
        return true;
      } else if ((anime.type_name === "电影" || anime.type_name.includes("电影") || anime.type_name.includes("片")) && type === "movie") {
        return true;
      } else {
        return false;
      }
    });
  }

  console.log("animes.length:", animes.length);

  let tmdbYear;
  if (animes.length >= 1) {
      if (type === "tv") {
          const targetSeason = tmdbInfo.seasons.find(s => s.season_number === Number(season));
          if (!targetSeason) {
              return null;
          }
          tmdbYear = targetSeason.air_date.split("-")[0]
      } else {
          tmdbYear = tmdbInfo.release_date.split("-")[0]
      }
      console.log("tmdbYear: ", tmdbYear);

      animes = animes.filter(anime => anime.vod_year == tmdbYear);
  }

  if (animes.length === 0) {
      return null;
  }

  const anime = animes[0];
  if (!anime.vod_play_url || anime.vod_play_url === "") {
      return null;
  }

  let playUrl = null;

  let vodPlayFromList = anime.vod_play_from.split("$$$")
  vodPlayFromList = vodPlayFromList.map(item => {
      if (item === "mgtv") {
        return "imgo"; // 将mgtv替换为imgo
      } else if (item === "bilibili") {
        return "bilibili1"; // 将bilibili替换为bilibili1
      } else {
        return item; // 其他情况保持原值
      }
  });

  const vodPlayUrlList = anime.vod_play_url.split("$$$")
  let platformIndex = -1;
  if (platform === "random" || !vodPlayFromList.includes(platform)) {
      // 允许的平台列表
      const allowedPlatforms = ["qiyi", "bilibili1", "imgo", "youku", "qq"];

      // Step 1: 过滤出在allowedPlatforms中的元素，并保持它们在vodPlayFromList中的原始索引
      const validIndices = vodPlayFromList
          .map((item, index) => allowedPlatforms.includes(item) ? index : -1)
          .filter(index => index !== -1);

      // Step 2: 从有效的索引中随机选择一个
      if (validIndices.length > 0) {
          platformIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
          const randomPlatform = vodPlayFromList[platformIndex];
          console.log(`Randomly selected platform: ${randomPlatform} (Index: ${platformIndex})`);
      } else {
          return null;
      }
  } else {
      console.log(`Selected platform: ${platform}`);
      platformIndex = vodPlayFromList.indexOf(platform);
  }
  if (type === "movie") {
      playUrl = vodPlayUrlList[platformIndex].split("#")[0].split("$")[1];
  } else {
      const episodeList = vodPlayUrlList[platformIndex].split("#");
      if (tmdbInfo.type !== "Reality") {
          if (episode - 1 >= 0 && episode - 1 < episodeList.length) {
              playUrl = episodeList[episode - 1].split("$")[1];
          } else {
              return null;
          }
      } else {
          for (const episodeInfo of episodeList) {
              const episodeKey = episodeInfo.split("$")[0];
              const episodeDate = extractAndFormatDate(episodeKey);
              console.log(episodeKey, episodeDate);
              if (episodeDate && airDate && episodeDate === airDate) {
                  playUrl = episodeInfo.split("$")[1];
                  break;
              }
              if (episodeKey === episodeName || episodeName.includes(episodeKey)) {
                  playUrl = episodeInfo.split("$")[1];
                  break;
              }
          }
      }
  }

  return playUrl;
}

function parseDanmuku(responseData) {
  let danmukuArray = [];
  let length = 0;

  try {
    // 检测是否为 XML 格式（基于字符串开头）
    if (typeof responseData === 'string' && (responseData.trim().startsWith('<?xml') || responseData.trim().startsWith('<'))) {
      // 处理 XML 格式
      // 使用正则表达式匹配所有 <d> 标签以计算总数
      const danmukuRegex = /<d p="([^"]+)">([^<]+)<\/d>/g;
      const allDanmuku = responseData.match(danmukuRegex) || [];
      length = allDanmuku.length;

      // 提取前 10 条弹幕
      let count = 0;
      let match;
      danmukuRegex.lastIndex = 0; // 重置正则索引
      while ((match = danmukuRegex.exec(responseData)) !== null && count < 10) {
        const attr = match[1]; // p 属性值
        const content = match[2]; // 弹幕内容
        const [time, type, fontSize, color, sender, ...others] = attr.split(','); // 解析属性
        danmukuArray.push({
          time: parseFloat(time),
          content: content,
          type: parseInt(type),
          color: `#${parseInt(color).toString(16).padStart(6, '0')}`,
          fontSize: parseInt(fontSize)
        });
        count++;
      }
    } else {
      // 处理 JSON 格式
      const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
      const danmukuList = data.danmuku || data; // 支持 { danmuku: [...] } 或直接 [...] 格式
      length = danmukuList.length;
      danmukuArray = danmukuList.slice(0, 10); // 提取前 10 条
    }

    // 输出前 10 条弹幕
    console.log('前 10 条弹幕:', danmukuArray);
    console.log('获取到弹幕总数:', length);
    return length;
  } catch (error) {
    console.error('解析弹幕失败:', error);
    return 0;
  }
}

async function getDanmuFromAPI(title, tmdbInfo, type, season, episode, episodeName, airDate,
                               danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5) {
  const danmu_apis = [danmu_api_1, danmu_api_2, danmu_api_3, danmu_api_4, danmu_api_5];
  let queryTitle = title;

  for (let danmu_api of danmu_apis) {
    if (!danmu_api) {
      continue
    }
    // 搜索title
    let response;
    try {
      response = await Widget.http.get(
        `${danmu_api}/api/v2/search/anime?keyword=${queryTitle}`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          timeout: 15,
        }
      );
    } catch (error) {
      console.error('API调用失败:', error);
      continue;
    }

    if (!response) {
      console.error("获取数据失败");
      continue;
    }

    const data = response.data;

    // 检查API返回状态
    if (!data.success) {
      console.error(data.errorMessage || "API调用失败");
      continue;
    }

    // 开始过滤数据
    let animes = [];
    if (data.animes && data.animes.length > 0) {
      animes = data.animes.filter((anime) => {
        if (
          (anime.type === "tvseries" || anime.type === "web") &&
          type === "tv"
        ) {
          return true;
        } else if (anime.type === "movie" && type === "movie") {
          return true;
        } else {
          return false;
        }
      });
      if (season) {
        // filter season
        const matchedAnimes = animes.filter((anime) => {
          if (anime.animeTitle.includes(queryTitle)) {
            // use space to split animeTitle
            let titleParts = anime.animeTitle.split(" ");
            if (titleParts.length > 1) {
              let seasonPart = titleParts[1];
              // match number from seasonPart
              let seasonIndex = seasonPart.match(/\d+/);
              if (seasonIndex && seasonIndex[0] === season) {
                return true;
              }
              // match chinese number
              let chineseNumber = seasonPart.match(/[一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+/);
              if (chineseNumber && convertChineseNumber(chineseNumber[0]) === season) {
                return true;
              }
            }
            return false;
          } else {
            return false;
          }
        });
        if (matchedAnimes.length > 0) {
          animes = matchedAnimes;
        }
        console.log(animes);
      }
    }

    if (animes.length === 0) {
      continue;
    }

    const animeId = animes[0].bangumiId;

    // 查询集数
    const response_detail = await Widget.http.get(
      `${danmu_api}/api/v2/bangumi/${animeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 15,
      }
    );

    if (!response_detail) {
      console.error("获取数据失败");
      continue;
    }

    let commentId;

    if (type === "movie") {
        commentId = response_detail.data.bangumi.episodes[0].episodeId;
    } else {
        const episodeList = response_detail.data.bangumi.episodes;
        if (tmdbInfo.type !== "Reality") {
            if (episode - 1 >= 0 && episode - 1 < episodeList.length) {
                commentId = episodeList[episode - 1].episodeId;
            }
        } else {
            for (const episodeInfo of episodeList) {
                console.log("episodeTitle: ", episodeInfo.episodeTitle);
                if (episodeInfo.episodeTitle === episodeName || episodeName.includes(episodeInfo.episodeTitle)) {
                    commentId = episodeInfo.episodeId;
                    break;
                }
            }
        }
    }

    // 获取弹幕
    if (commentId) {
      // 调用弹弹play弹幕API - 使用Widget.http.get
      const response_danmu = await Widget.http.get(
        `${danmu_api}/api/v2/comment/${commentId}?withRelated=true&chConvert=1`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          timeout: 15,
        }
      );

      if (!response_danmu) {
        console.error("获取数据失败");
        continue;
      }
      return response_danmu.data;
    }
  }
  return null;
}
