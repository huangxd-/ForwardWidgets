// 本插件从项目 https://github.com/huangxd-/danmu_api.git 一键导出，配置参数使用说明请参考该项目README

class URL {
  constructor(url, base) {
    if (base) {
      // 如果提供了基础URL，拼接相对路径
      if (url.startsWith('/')) {
        // 处理绝对路径形式
        const baseWithoutPath = base.replace(/\/[^\/]*$/, '');
        this._url = baseWithoutPath + url;
      } else if (url.startsWith('./') || !url.startsWith('http')) {
        // 处理相对路径
        const baseWithoutPath = base.replace(/\/[^\/]*$/, '');
        this._url = baseWithoutFile + '/' + url.replace('./', '');
      } else {
        this._url = url;
      }
    } else {
      this._url = url;
    }

    // 解析URL组件
    this.parseURL(this._url);
  }

  parseURL(url) {
    // 基础URL解析逻辑
    const match = url.match(/^([^:]+):\/\/([^\/]+)(.*)$/);
    if (match) {
      this.protocol = match[1] + ':';
      this.hostname = match[2];
      const pathAndQuery = match[3] || '';
      const queryIndex = pathAndQuery.indexOf('?');

      if (queryIndex !== -1) {
        this.pathname = pathAndQuery.substring(0, queryIndex);
        this.search = pathAndQuery.substring(queryIndex);
      } else {
        this.pathname = pathAndQuery;
        this.search = '';
      }
    } else {
      this.protocol = '';
      this.hostname = '';
      this.pathname = url;
      this.search = '';
    }
  }

  toString() {
    return this._url;
  }

  static createObjectURL(obj) {
    // 简单的模拟实现
    return 'blob:' + Date.now();
  }

  static revokeObjectURL(url) {
    // 简单的模拟实现
  }

  get href() {
    return this._url;
  }

  get origin() {
    return this.protocol + '//' + this.hostname;
  }

  get host() {
    return this.hostname;
  }

  get searchParams() {
    // 创建一个简单的SearchParams实现
    const paramsString = this.search.substring(1); // 移除开头的?
    const params = new (function() {
      const entries = {};
      if (paramsString) {
        paramsString.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key) {
            entries[decodeURIComponent(key)] = decodeURIComponent(value || '');
          }
        });
      }

      this.get = (name) => entries[name] || null;
      this.set = (name, value) => { entries[name] = value.toString(); };
      this.toString = () => Object.keys(entries).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(entries[key])
      ).join('&');
    })();
    return params;
  }
}

class AbortController {
  constructor() {
    this.signal = new AbortSignal();
  }

  abort() {
    this.signal.abort();
  }
}

class AbortSignal {
  constructor() {
    this.aborted = false;
    this.onabort = null;
    this.listeners = [];
  }

  abort() {
    if (this.aborted) return;

    this.aborted = true;

    // 触发所有监听器
    this.listeners.forEach(listener => {
      try {
        if (typeof listener === 'function') {
          listener({ type: 'abort' });
        } else if (listener && typeof listener.handleEvent === 'function') {
          listener.handleEvent({ type: 'abort' });
        }
      } catch (e) {
        // 忽略监听器中的错误
      }
    });

    // 触发onabort回调
    if (this.onabort) {
      try {
        this.onabort({ type: 'abort' });
      } catch (e) {
        // 忽略onabort回调中的错误
      }
    }
  }

  addEventListener(type, listener) {
    if (type === 'abort') {
      this.listeners.push(listener);
      // 如果已经中止，立即触发监听器
      if (this.aborted) {
        try {
          if (typeof listener === 'function') {
            listener({ type: 'abort' });
          } else if (listener && typeof listener.handleEvent === 'function') {
            listener.handleEvent({ type: 'abort' });
          }
        } catch (e) {
          // 忽略监听器中的错误
        }
      }
    }
  }

  removeEventListener(type, listener) {
    if (type === 'abort') {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    if (event.type === 'abort') {
      this.abort();
    }
  }
}

const { setTimeout: customSetTimeout, clearTimeout: customClearTimeout } = (function() {
  let timerId = 0;
  const timers = new Map();

  const setTimeoutFn = function(callback, delay = 0) {
    const id = ++timerId;

    if (typeof Promise !== 'undefined') {
      Promise.resolve().then(() => {
        if (timers.has(id)) {
          try {
            callback();
          } catch (e) {
            console.error('setTimeout error:', e);
          } finally {
            timers.delete(id);
          }
        }
      });
    } else {
      // 同步执行
      try {
        callback();
      } catch (e) {
        console.error('setTimeout error:', e);
      }
    }

    timers.set(id, { callback, delay, timestamp: Date.now() });
    return id;
  };

  const clearTimeoutFn = function(id) {
    return timers.delete(id);
  };

  return {
    setTimeout: setTimeoutFn,
    clearTimeout: clearTimeoutFn
  };
})();

const setTimeout = customSetTimeout;
const clearTimeout = customClearTimeout;

class Headers {
  constructor(init = {}) {
    this._headers = {};
    if (init instanceof Headers) {
      // 从另一个Headers实例初始化
      for (const [key, value] of init.entries()) {
        this.set(key, value);
      }
    } else if (Array.isArray(init)) {
      // 从键值对数组初始化
      for (const [key, value] of init) {
        this.set(key, value);
      }
    } else if (init && typeof init === 'object') {
      // 从对象初始化
      for (const [key, value] of Object.entries(init)) {
        this.set(key, value);
      }
    }
  }

  append(name, value) {
    name = name.toLowerCase();
    if (this._headers[name]) {
      this._headers[name] = this._headers[name] + ', ' + value;
    } else {
      this._headers[name] = value;
    }
  }

  delete(name) {
    delete this._headers[name.toLowerCase()];
  }

  get(name) {
    return this._headers[name.toLowerCase()] || null;
  }

  has(name) {
    return name.toLowerCase() in this._headers;
  }

  set(name, value) {
    this._headers[name.toLowerCase()] = String(value);
  }

  forEach(callback, thisArg) {
    for (const [name, value] of Object.entries(this._headers)) {
      callback.call(thisArg, value, name, this);
    }
  }

  *entries() {
    for (const [name, value] of Object.entries(this._headers)) {
      yield [name, value];
    }
  }

  *keys() {
    for (const name of Object.keys(this._headers)) {
      yield name;
    }
  }

  *values() {
    for (const value of Object.values(this._headers)) {
      yield value;
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  toJSON() {
    return { ...this._headers };
  }
}

class Response {
  constructor(body, init = {}) {
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Headers(init.headers || {});
    this.type = 'default';
    this.url = '';
    this.redirected = false;

    this._bodyUsed = false;
    if (body !== undefined && body !== null) {
      this._body = body;
    } else {
      this._body = '';
    }
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  get bodyUsed() {
    return this._bodyUsed;
  }

  _checkBodyUsed() {
    if (this._bodyUsed) {
      throw new TypeError('body stream already read');
    }
    this._bodyUsed = true;
  }

  async json() {
    this._checkBodyUsed();
    if (typeof this._body === 'string') {
      return JSON.parse(this._body);
    }
    return this._body;
  }

  async text() {
    this._checkBodyUsed();
    if (typeof this._body === 'string') {
      return this._body;
    }
    return String(this._body);
  }

  clone() {
    if (this._bodyUsed) {
      throw new TypeError('cannot clone a disturbed response');
    }
    const cloned = new Response(this._body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
    return cloned;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// danmu_api/configs/envs.js
var Envs = class {
  // 允许的源合并
  /**
   * 获取环境变量
   * @param {string} key 环境变量的键
   * @param {any} defaultValue 默认值
   * @param {'string' | 'number' | 'boolean'} type 类型
   * @returns {any} 转换后的值
   */
  static get(key, defaultValue, type = "string", encrypt = false) {
    let value;
    if (typeof this.env !== "undefined" && this.env[key]) {
      value = this.env[key];
      this.originalEnvVars.set(key, value);
    } else if (typeof process !== "undefined" && process.env?.[key]) {
      value = process.env[key];
      this.originalEnvVars.set(key, value);
    } else {
      value = defaultValue;
      this.originalEnvVars.set(key, "");
    }
    let parsedValue;
    switch (type) {
      case "number":
        parsedValue = Number(value);
        if (isNaN(parsedValue)) {
          throw new Error(`Environment variable ${key} must be a valid number`);
        }
        break;
      case "boolean":
        parsedValue = value === true || value === "true" || value === 1 || value === "1";
        break;
      case "string":
      default:
        parsedValue = String(value);
        break;
    }
    const finalValue = encrypt ? this.encryptStr(parsedValue) : parsedValue;
    this.accessedEnvVars.set(key, finalValue);
    return parsedValue;
  }
  /**
   * 设置环境变量
   * @param {string} key 环境变量的键
   * @param {any} value 值
   */
  static set(key, value) {
    if (typeof process !== "undefined") {
      process.env[key] = String(value);
    }
    this.accessedEnvVars.set(key, value);
  }
  /**
   * 基础加密函数 - 将字符串转换为星号
   * @param {string} str 输入字符串
   * @returns {string} 星号字符串
   */
  static encryptStr(str) {
    return "*".repeat(str.length);
  }
  /**
   * 解析 VOD 服务器配置
   * @returns {Array} 服务器列表
   */
  static resolveVodServers() {
    const defaultVodServers = "\u91D1\u8749@https://zy.jinchancaiji.com,789@https://www.caiji.cyou,\u542C\u98CE@https://gctf.tfdh.top";
    let vodServersConfig = this.get("VOD_SERVERS", defaultVodServers, "string");
    if (!vodServersConfig || vodServersConfig.trim() === "") {
      return [];
    }
    return vodServersConfig.split(",").map((s) => s.trim()).filter((s) => s.length > 0).map((item, index) => {
      if (item.includes("@")) {
        const [name, url] = item.split("@").map((s) => s.trim());
        return { name: name || `vod-${index + 1}`, url };
      }
      return { name: `vod-${index + 1}`, url: item };
    }).filter((server) => server.url && server.url.length > 0);
  }
  /**
   * 解析源排序
   * @returns {Array} 源排序数组
   */
  static resolveSourceOrder() {
    let sourceOrder = this.get("SOURCE_ORDER", "360,vod,renren,hanjutv", "string");
    const orderArr = sourceOrder.split(",").map((s) => s.trim()).filter((s) => this.ALLOWED_SOURCES.includes(s));
    this.accessedEnvVars.set("SOURCE_ORDER", orderArr);
    return orderArr.length > 0 ? orderArr : ["360", "vod", "renren", "hanjutv"];
  }
  /**
   * 解析平台排序
   * @returns {Array} 平台排序数组
   */
  static resolvePlatformOrder() {
    const orderArr = this.get("PLATFORM_ORDER", "", "string").split(",").map((s) => s.trim()).filter((s) => this.ALLOWED_PLATFORMS.includes(s));
    this.accessedEnvVars.set("PLATFORM_ORDER", orderArr);
    return orderArr.length > 0 ? [...orderArr, null] : [null];
  }
  /**
   * 解析源合并配置
   * 从环境变量 MERGE_SOURCE_PAIRS 获取配置
   * 支持使用分号或逗号分隔多组配置
   * 支持一主多从配置，第一个为主源，后续为副源
   * 格式示例: bilibili&animeko, dandan&animeko&bahamut
   * @returns {Array} 合并配置数组 [{primary: 'dandan', secondaries: ['animeko', 'bahamut']}, ...]
   */
  static resolveMergeSourcePairs() {
    const config = this.get("MERGE_SOURCE_PAIRS", "", "string");
    if (!config) return [];
    return config.split(/[,;]/).map((group) => {
      if (!group || !group.includes("&")) return null;
      const parts = group.split("&").map((s) => s.trim()).filter((s) => s);
      if (parts.length < 2) return null;
      const primary = parts[0];
      const secondaries = parts.slice(1);
      if (!this.MERGE_ALLOWED_SOURCES.includes(primary)) return null;
      const validSecondaries = secondaries.filter(
        (sec) => sec !== primary && this.MERGE_ALLOWED_SOURCES.includes(sec)
      );
      if (validSecondaries.length === 0) return null;
      return { primary, secondaries: validSecondaries };
    }).filter(Boolean);
  }
  /**
   * 解析剧集标题过滤正则
   * @description 过滤非正片内容，同时内置白名单防止误杀正片
   * @returns {RegExp} 过滤正则表达式
   */
  static resolveEpisodeTitleFilter() {
    const defaultFilter = (
      // [1] 基础物料与口语词防御，保护: 企划书, 预告犯, 被抢先了, 抢先一步, 化学反应, 一直拍, 单纯享
      "(\u7279\u522B|\u60CA\u559C|\u7EB3\u51C9)?\u4F01\u5212(?!(\u4E66|\u6848|\u90E8))|\u5408\u4F19\u4EBA\u624B\u8BB0|\u8D85\u524D(\u8425\u4E1A|vlog)?|\u901F\u89C8|vlog|(?<!(Chain|Chemical|Nuclear|\u8FDE\u9501|\u5316\u5B66|\u6838|\u751F\u5316|\u751F\u7406|\u5E94\u6FC0))reaction|(?<!(\u5355))\u7EAF\u4EAB|\u52A0\u66F4(\u7248|\u7BC7)?|\u62A2\u5148(\u770B|\u7248|\u96C6|\u7BC7)?|(?<!(\u88AB|\u4E89|\u8C01))\u62A2[\u5148\u9C9C](?!(\u4E00\u6B65|\u624B|\u653B|\u4E86|\u544A|\u8A00|\u673A|\u8BDD))|\u62A2\u9C9C|\u9884\u544A(?!(\u51FD|\u4FE1|\u4E66|\u72AF))|(?<!(\u6B7B\u4EA1|\u6050\u6016|\u7075\u5F02|\u602A\u8C08))\u82B1\u7D6E(\u72EC\u5BB6)?|(?<!(\u4E00|\u76F4))\u76F4\u62CD|(\u5236\u4F5C|\u62CD\u6444|\u5E55\u540E|\u82B1\u7D6E|\u672A\u64AD|\u72EC\u5BB6|\u6F14\u5458|\u5BFC\u6F14|\u4E3B\u521B|\u6740\u9752|\u63A2\u73ED|\u6536\u5B98|\u5F00\u64AD|\u5148\u5BFC|\u5F69\u86CB|NG|\u56DE\u987E|\u9AD8\u5149|\u4E2A\u4EBA|\u4E3B\u521B)\u7279\u8F91|(?<!(\u884C\u52A8|\u8BA1\u5212|\u6E38\u620F|\u4EFB\u52A1|\u5371\u673A|\u795E\u79D8|\u9EC4\u91D1))\u5F69\u86CB|(?<!(\u5ACC\u7591\u4EBA|\u8BC1\u4EBA|\u5BB6\u5C5E|\u5F8B\u5E08|\u8B66\u65B9|\u51F6\u624B|\u6B7B\u8005))\u4E13\u8BBF|(?<!(\u8BC1\u4EBA))\u91C7\u8BBF(?!(\u5438\u8840\u9B3C|\u9B3C))|(\u6B63\u5F0F|\u89D2\u8272|\u5148\u5BFC|\u6982\u5FF5|\u9996\u66DD|\u5B9A\u6863|\u5267\u60C5|\u52A8\u753B|\u5BA3\u4F20|\u4E3B\u9898\u66F2|\u5370\u8C61)[\\s\\.]*[Pp\uFF30\uFF50][Vv\uFF36\uFF56]|(?<!(\u9E26|\u96EA|\u7EB8|\u76F8|\u7167|\u56FE|\u540D|\u5927))\u7247\u82B1|(?<!(\u9000\u5C45|\u56DE\u5F52|\u8D70\u5411|\u8F6C\u6218|\u9690\u8EAB|\u85CF\u8EAB))\u5E55\u540E(?!(\u4E3B\u8C0B|\u4E3B\u4F7F|\u9ED1\u624B|\u771F\u51F6|\u73A9\u5BB6|\u8001\u677F|\u91D1\u4E3B|\u82F1\u96C4|\u529F\u81E3|\u63A8\u624B|\u5927\u4F6C|\u64CD\u7EB5|\u4EA4\u6613|\u7B56\u5212|\u535A\u5F08|BOSS|\u771F\u76F8))(\u6545\u4E8B|\u82B1\u7D6E|\u72EC\u5BB6)?|\u884D\u751F(?!(\u54C1|\u7269|\u517D))|\u756A\u5916(?!(\u5730|\u4EBA))|\u76F4\u64AD(\u966A\u770B|\u56DE\u987E)?|\u76F4\u64AD(?!(.*(\u4E8B\u4EF6|\u6740\u4EBA|\u81EA\u6740|\u8C0B\u6740|\u72AF\u7F6A|\u73B0\u573A|\u6E38\u620F|\u6311\u6218)))|\u672A\u64AD(\u7247\u6BB5)?|\u4F1A\u5458(\u4E13\u4EAB|\u52A0\u957F|\u5C0A\u4EAB|\u4E13\u5C5E|\u7248)?|(?<!(\u63D0\u53D6|\u5438\u6536|\u751F\u547D|\u9B54\u6CD5|\u4FEE\u62A4|\u7F8E\u767D))\u7CBE\u534E|\u770B\u70B9|\u901F\u770B|\u89E3\u8BFB(?!.*(\u5BC6\u6587|\u5BC6\u7801|\u5BC6\u7535|\u7535\u62A5|\u6863\u6848|\u4E66\u4FE1|\u9057\u4E66|\u7891\u6587|\u4EE3\u7801|\u4FE1\u53F7|\u6697\u53F7|\u8BAF\u606F|\u8C1C\u9898|\u4EBA\u5FC3|\u5507\u8BED|\u771F\u76F8|\u8C1C\u56E2|\u68A6\u5883))|(?<!(\u6848\u60C5|\u4EBA\u751F|\u6B7B\u524D|\u5386\u53F2|\u4E16\u7EAA))\u56DE\u987E|\u5F71\u8BC4|\u89E3\u8BF4|\u5410\u69FD|(?<!(\u5E74\u7EC8|\u5B63\u5EA6|\u5E93\u5B58|\u8D44\u4EA7|\u7269\u8D44|\u8D22\u52A1|\u6536\u83B7|\u6218\u5229))\u76D8\u70B9|\u62CD\u6444\u82B1\u7D6E|\u5236\u4F5C\u82B1\u7D6E|\u5E55\u540E\u82B1\u7D6E|\u672A\u64AD\u82B1\u7D6E|\u72EC\u5BB6\u82B1\u7D6E|\u82B1\u7D6E\u7279\u8F91|\u5148\u5BFC\u9884\u544A|\u7EC8\u6781\u9884\u544A|\u6B63\u5F0F\u9884\u544A|\u5B98\u65B9\u9884\u544A|\u5F69\u86CB\u7247\u6BB5|\u5220\u51CF\u7247\u6BB5|\u672A\u64AD\u7247\u6BB5|\u756A\u5916\u5F69\u86CB|\u7CBE\u5F69\u7247\u6BB5|\u7CBE\u5F69\u770B\u70B9|\u7CBE\u5F69\u96C6\u9526|\u770B\u70B9\u89E3\u6790|\u770B\u70B9\u9884\u544A|NG\u955C\u5934|NG\u82B1\u7D6E|\u756A\u5916\u7BC7|\u756A\u5916\u7279\u8F91|\u5236\u4F5C\u7279\u8F91|\u62CD\u6444\u7279\u8F91|\u5E55\u540E\u7279\u8F91|\u5BFC\u6F14\u7279\u8F91|\u6F14\u5458\u7279\u8F91|\u7247\u5C3E\u66F2|(?<!(\u751F\u547D|\u751F\u6D3B|\u60C5\u611F|\u7231\u60C5|\u4E00\u6BB5|\u5C0F|\u610F\u5916))\u63D2\u66F2|\u9AD8\u5149\u56DE\u987E|\u80CC\u666F\u97F3\u4E50|OST|\u97F3\u4E50MV|\u6B4C\u66F2MV|\u524D\u5B63\u56DE\u987E|\u5267\u60C5\u56DE\u987E|\u5F80\u671F\u56DE\u987E|\u5185\u5BB9\u603B\u7ED3|\u5267\u60C5\u76D8\u70B9|\u7CBE\u9009\u5408\u96C6|\u526A\u8F91\u5408\u96C6|\u6DF7\u526A\u89C6\u9891|\u72EC\u5BB6\u4E13\u8BBF|\u6F14\u5458\u8BBF\u8C08|\u5BFC\u6F14\u8BBF\u8C08|\u4E3B\u521B\u8BBF\u8C08|\u5A92\u4F53\u91C7\u8BBF|\u53D1\u5E03\u4F1A\u91C7\u8BBF|\u966A\u770B(\u8BB0)?|\u8BD5\u770B\u7248|\u77ED\u5267|\u7CBE\u7F16|(?<!(Love|Disney|One|C|Note|S\\d+|\\+|&|\\s))Plus|\u72EC\u5BB6\u7248|(?<!(\u5BFC\u6F14|\u52A0\u957F|\u5468\u5E74))\u7279\u522B\u7248(?!(\u56FE|\u753B))|\u77ED\u7247|(?<!(\u65B0\u95FB|\u7D27\u6025|\u4E34\u65F6|\u53EC\u5F00|\u7834\u574F|\u5927\u95F9|\u6F84\u6E05|\u9053\u6B49|\u65B0\u54C1|\u4EA7\u54C1|\u4E8B\u6545))\u53D1\u5E03\u4F1A|\u89E3\u5FE7\u5C40|\u8D70\u5FC3\u5C40|\u706B\u9505\u5C40|\u5DC5\u5CF0\u65F6\u523B|\u575E\u91CC\u90FD\u77E5\u9053|\u798F\u6301\u76EE\u6807\u575E\u6C11|\u798F\u5229(?!(\u9662|\u4F1A|\u4E3B\u4E49|\u8BFE))\u7BC7|(\u798F\u5229|\u52A0\u66F4|\u756A\u5916|\u5F69\u86CB|\u884D\u751F|\u7279\u522B|\u6536\u5B98|\u6E38\u620F|\u6574\u86CA|\u65E5\u5E38)\u7BC7|\u72EC\u5BB6(?!(\u8BB0\u5FC6|\u8BD5\u7231|\u62A5\u9053|\u79D8\u65B9|\u5360\u6709|\u5BA0\u7231|\u6069\u5BA0))|.{2,}(?<!(\u5E02|\u5206|\u8B66|\u603B|\u7701|\u536B|\u836F|\u653F|\u76D1|\u7ED3|\u5927|\u5F00|\u7834|\u5E03|\u50F5|\u56F0|\u9A97|\u8D4C|\u80DC|\u8D25|\u5B9A|\u4E71|\u5371|\u8FF7|\u8C1C|\u5165|\u6405|\u8BBE|\u4E2D|\u6B8B|\u5E73|\u548C|\u7EC8|\u53D8|\u5BF9|\u5B89|\u505A|\u4E66|\u753B|\u5BDF|\u52A1|\u6848|\u901A|\u4FE1|\u80B2|\u5546|\u8C61|\u6E90|\u4E1A|\u51B0))\u5C40(?!(\u957F|\u5EA7|\u52BF|\u9762|\u90E8|\u5185|\u5916|\u4E2D|\u9650|\u4FC3|\u6C14))|(?<!(\u91CD\u75C7|\u9694\u79BB|\u5B9E\u9A8C|\u5FC3\u7406|\u5BA1\u8BAF|\u5355\u5411|\u672F\u540E))\u89C2\u5BDF\u5BA4|\u4E0A\u73ED\u90A3\u70B9\u4E8B\u513F|\u5468top|\u8D5B\u6BB5|VLOG|(?<!(\u5927\u6848|\u8981\u6848|\u5211\u4FA6|\u4FA6\u67E5|\u7834\u6848|\u6863\u6848|\u98CE\u4E91|\u5386\u53F2|\u6218\u4E89|\u63A2\u6848|\u81EA\u7136|\u4EBA\u6587|\u79D1\u5B66|\u533B\u5B66|\u5730\u7406|\u5B87\u5B99|\u8D5B\u4E8B|\u4E16\u754C\u676F|\u5965\u8FD0))\u5168\u7EAA\u5F55|\u5F00\u64AD|\u5148\u5BFC|\u603B\u5BA3|\u5C55\u6F14|\u96C6\u9526|\u65C5\u884C\u65E5\u8BB0|\u7CBE\u5F69\u5206\u4EAB|\u5267\u60C5\u63ED\u79D8(?!(\u8005|\u4EBA))"
    );
    const customFilter = this.get("EPISODE_TITLE_FILTER", "", "string", false).trim();
    let keywords = customFilter || defaultFilter;
    this.accessedEnvVars.set("EPISODE_TITLE_FILTER", keywords);
    try {
      return new RegExp(`^(.*?)(?:${keywords})(.*?)$`, "i");
    } catch (error) {
      console.warn(`Invalid EPISODE_TITLE_FILTER format, using default.`);
      return new RegExp(`^(.*?)(?:${defaultFilter})(.*?)$`, "i");
    }
  }
  /**
   * 获取记录的原始环境变量 JSON
   * @returns {Map<any, any>} JSON 字符串
   */
  static getOriginalEnvVars() {
    return this.originalEnvVars;
  }
  /**
   * 解析剧名映射表
   * @returns {Map} 剧名映射表
   */
  static resolveTitleMappingTable() {
    const mappingStr = this.get("TITLE_MAPPING_TABLE", "", "string").trim();
    const mappingTable = /* @__PURE__ */ new Map();
    if (!mappingStr) {
      return mappingTable;
    }
    const pairs = mappingStr.split(";");
    for (const pair of pairs) {
      if (pair.includes("->")) {
        const [original, mapped] = pair.split("->").map((s) => s.trim());
        if (original && mapped) {
          mappingTable.set(original, mapped);
        }
      }
    }
    return mappingTable;
  }
  /**
   * 获取记录的环境变量 JSON
   * @returns {Map<any, any>} JSON 字符串
   */
  static getAccessedEnvVars() {
    return this.accessedEnvVars;
  }
  /**
   * 初始化环境变量
   * @param {Object} env 环境对象
   * @param {string} deployPlatform 部署平台
   * @returns {Object} 配置对象
   */
  static load(env = {}) {
    this.env = env;
    const envVarConfig = {
      // API配置
      "TOKEN": { category: "api", type: "text", description: "API\u8BBF\u95EE\u4EE4\u724C" },
      "ADMIN_TOKEN": { category: "api", type: "text", description: "\u7CFB\u7EDF\u7BA1\u7406\u8BBF\u95EE\u4EE4\u724C" },
      "RATE_LIMIT_MAX_REQUESTS": { category: "api", type: "number", description: "\u9650\u6D41\u914D\u7F6E\uFF1A1\u5206\u949F\u5185\u6700\u5927\u8BF7\u6C42\u6B21\u6570\uFF0C0\u8868\u793A\u4E0D\u9650\u6D41\uFF0C\u9ED8\u8BA43", min: 0, max: 50 },
      // 源配置
      "SOURCE_ORDER": { category: "source", type: "multi-select", options: this.ALLOWED_SOURCES, description: "\u6E90\u6392\u5E8F\u914D\u7F6E\uFF0C\u9ED8\u8BA4360,vod,renren,hanjutv" },
      "OTHER_SERVER": { category: "source", type: "text", description: "\u7B2C\u4E09\u65B9\u5F39\u5E55\u670D\u52A1\u5668\uFF0C\u9ED8\u8BA4https://api.danmu.icu" },
      "CUSTOM_SOURCE_API_URL": { category: "source", type: "text", description: "\u81EA\u5B9A\u4E49\u5F39\u5E55\u6E90API\u5730\u5740\uFF0C\u9ED8\u8BA4\u4E3A\u7A7A\uFF0C\u914D\u7F6E\u540E\u8FD8\u9700\u5728SOURCE_ORDER\u6DFB\u52A0custom\u6E90" },
      "VOD_SERVERS": { category: "source", type: "text", description: "VOD\u7AD9\u70B9\u914D\u7F6E\uFF0C\u683C\u5F0F\uFF1A\u540D\u79F0@URL,\u540D\u79F0@URL\uFF0C\u9ED8\u8BA4\u91D1\u8749@https://zy.jinchancaiji.com,789@https://www.caiji.cyou,\u542C\u98CE@https://gctf.tfdh.top" },
      "VOD_RETURN_MODE": { category: "source", type: "select", options: ["all", "fastest"], description: "VOD\u8FD4\u56DE\u6A21\u5F0F\uFF1Aall\uFF08\u6240\u6709\u7AD9\u70B9\uFF09\u6216 fastest\uFF08\u6700\u5FEB\u7684\u7AD9\u70B9\uFF09\uFF0C\u9ED8\u8BA4fastest" },
      "VOD_REQUEST_TIMEOUT": { category: "source", type: "number", description: "VOD\u8BF7\u6C42\u8D85\u65F6\u65F6\u95F4\uFF0C\u9ED8\u8BA410000", min: 5e3, max: 3e4 },
      "BILIBILI_COOKIE": { category: "source", type: "text", description: "B\u7AD9Cookie" },
      "YOUKU_CONCURRENCY": { category: "source", type: "number", description: "\u4F18\u9177\u5E76\u53D1\u914D\u7F6E\uFF0C\u9ED8\u8BA48", min: 1, max: 16 },
      "MERGE_SOURCE_PAIRS": { category: "source", type: "text", description: "\u6E90\u5408\u5E76\u914D\u7F6E\uFF0C\u914D\u7F6E\u540E\u5C06\u5BF9\u5E94\u6E90\u5408\u5E76\u540C\u65F6\u4E00\u8D77\u83B7\u53D6\u5F39\u5E55\u8FD4\u56DE\uFF0C\u652F\u6301\u591A\u6E90\u94FE\u5F0F\u5408\u5E76\uFF0C\u7B2C\u4E00\u4E2A\u4E3A\u4E3B\u6E90\u3002\n\u683C\u5F0F\uFF1A\u6E901&\u6E902&\u6E903\uFF0C\u591A\u7EC4\u7528\u9017\u53F7\u5206\u9694\u3002\n\u793A\u4F8B\uFF1Adandan&animeko&bahamut, bilibili&animeko\n\u76EE\u524D\u5141\u8BB8\u7684\u6E90\uFF1Atencent,youku,iqiyi,imgo,bilibili,sohu,leshi,xigua,renren,hanjutv,bahamut,dandan,animeko" },
      // 匹配配置
      "PLATFORM_ORDER": { category: "match", type: "multi-select", options: this.ALLOWED_PLATFORMS, description: "\u5E73\u53F0\u6392\u5E8F\u914D\u7F6E" },
      "EPISODE_TITLE_FILTER": { category: "match", type: "text", description: "\u5267\u96C6\u6807\u9898\u8FC7\u6EE4\u89C4\u5219" },
      "ENABLE_EPISODE_FILTER": { category: "match", type: "boolean", description: "\u96C6\u6807\u9898\u8FC7\u6EE4\u5F00\u5173" },
      "STRICT_TITLE_MATCH": { category: "match", type: "boolean", description: "\u4E25\u683C\u6807\u9898\u5339\u914D\u6A21\u5F0F" },
      "TITLE_TO_CHINESE": { category: "match", type: "boolean", description: "\u5916\u8BED\u6807\u9898\u8F6C\u6362\u4E2D\u6587\u5F00\u5173" },
      "TITLE_MAPPING_TABLE": { category: "match", type: "map", description: '\u5267\u540D\u6620\u5C04\u8868\uFF0C\u7528\u4E8E\u81EA\u52A8\u5339\u914D\u65F6\u66FF\u6362\u6807\u9898\u8FDB\u884C\u641C\u7D22\uFF0C\u683C\u5F0F\uFF1A\u539F\u59CB\u6807\u9898->\u6620\u5C04\u6807\u9898;\u539F\u59CB\u6807\u9898->\u6620\u5C04\u6807\u9898;... \uFF0C\u4F8B\u5982\uFF1A"\u5510\u671D\u8BE1\u4E8B\u5F55->\u5510\u671D\u8BE1\u4E8B\u5F55\u4E4B\u897F\u884C;\u56FD\u8272\u82B3\u534E->\u9526\u7EE3\u82B3\u534E"' },
      // 弹幕配置
      "BLOCKED_WORDS": { category: "danmu", type: "text", description: "\u5C4F\u853D\u8BCD\u5217\u8868" },
      "GROUP_MINUTE": { category: "danmu", type: "number", description: "\u5206\u949F\u5185\u5408\u5E76\u53BB\u91CD\uFF080\u8868\u793A\u4E0D\u53BB\u91CD\uFF09\uFF0C\u9ED8\u8BA41", min: 0, max: 30 },
      "DANMU_LIMIT": { category: "danmu", type: "number", description: "\u5F39\u5E55\u6570\u91CF\u9650\u5236\uFF0C\u5355\u4F4D\u4E3Ak\uFF0C\u5373\u5343\uFF1A\u9ED8\u8BA4 0\uFF0C\u8868\u793A\u4E0D\u9650\u5236\u5F39\u5E55\u6570", min: 0, max: 100 },
      "DANMU_SIMPLIFIED_TRADITIONAL": { category: "danmu", type: "select", options: ["default", "simplified", "traditional"], description: "\u5F39\u5E55\u7B80\u7E41\u4F53\u8F6C\u6362\u8BBE\u7F6E\uFF1Adefault\uFF08\u9ED8\u8BA4\u4E0D\u8F6C\u6362\uFF09\u3001simplified\uFF08\u7E41\u8F6C\u7B80\uFF09\u3001traditional\uFF08\u7B80\u8F6C\u7E41\uFF09" },
      "CONVERT_TOP_BOTTOM_TO_SCROLL": { category: "danmu", type: "boolean", description: "\u9876\u90E8/\u5E95\u90E8\u5F39\u5E55\u8F6C\u6362\u4E3A\u6D6E\u52A8\u5F39\u5E55" },
      "CONVERT_COLOR": { category: "danmu", type: "select", options: ["default", "white", "color"], description: "\u5F39\u5E55\u8F6C\u6362\u989C\u8272\u914D\u7F6E" },
      "DANMU_OUTPUT_FORMAT": { category: "danmu", type: "select", options: ["json", "xml"], description: "\u5F39\u5E55\u8F93\u51FA\u683C\u5F0F\uFF0C\u9ED8\u8BA4json" },
      "DANMU_PUSH_URL": { category: "danmu", type: "text", description: "\u5F39\u5E55\u63A8\u9001\u5730\u5740\uFF0C\u793A\u4F8B http://127.0.0.1:9978/action?do=refresh&type=danmaku&path= " },
      // 缓存配置
      "SEARCH_CACHE_MINUTES": { category: "cache", type: "number", description: "\u641C\u7D22\u7ED3\u679C\u7F13\u5B58\u65F6\u95F4(\u5206\u949F)\uFF0C\u9ED8\u8BA41", min: 1, max: 120 },
      "COMMENT_CACHE_MINUTES": { category: "cache", type: "number", description: "\u5F39\u5E55\u7F13\u5B58\u65F6\u95F4(\u5206\u949F)\uFF0C\u9ED8\u8BA41", min: 1, max: 120 },
      "REMEMBER_LAST_SELECT": { category: "cache", type: "boolean", description: "\u8BB0\u4F4F\u624B\u52A8\u9009\u62E9\u7ED3\u679C" },
      "MAX_LAST_SELECT_MAP": { category: "cache", type: "number", description: "\u8BB0\u4F4F\u4E0A\u6B21\u9009\u62E9\u6620\u5C04\u7F13\u5B58\u5927\u5C0F\u9650\u5236", min: 10, max: 1e3 },
      "UPSTASH_REDIS_REST_URL": { category: "cache", type: "text", description: "Upstash Redis\u8BF7\u6C42\u94FE\u63A5" },
      "UPSTASH_REDIS_REST_TOKEN": { category: "cache", type: "text", description: "Upstash Redis\u8BBF\u95EE\u4EE4\u724C" },
      // 系统配置
      "PROXY_URL": { category: "system", type: "text", description: "\u4EE3\u7406/\u53CD\u4EE3\u5730\u5740" },
      "TMDB_API_KEY": { category: "system", type: "text", description: "TMDB API\u5BC6\u94A5" },
      "LOG_LEVEL": { category: "system", type: "select", options: ["debug", "info", "warn", "error"], description: "\u65E5\u5FD7\u7EA7\u522B\u914D\u7F6E" },
      "DEPLOY_PLATFROM_ACCOUNT": { category: "system", type: "text", description: "\u90E8\u7F72\u5E73\u53F0\u8D26\u53F7ID" },
      "DEPLOY_PLATFROM_PROJECT": { category: "system", type: "text", description: "\u90E8\u7F72\u5E73\u53F0\u9879\u76EE\u540D\u79F0" },
      "DEPLOY_PLATFROM_TOKEN": { category: "system", type: "text", description: "\u90E8\u7F72\u5E73\u53F0\u8BBF\u95EE\u4EE4\u724C" },
      "NODE_TLS_REJECT_UNAUTHORIZED": { category: "system", type: "number", description: "\u5728\u5EFA\u7ACB HTTPS \u8FDE\u63A5\u65F6\u662F\u5426\u9A8C\u8BC1\u670D\u52A1\u5668\u7684 SSL/TLS \u8BC1\u4E66\uFF0C0\u8868\u793A\u5FFD\u7565\uFF0C\u9ED8\u8BA4\u4E3A1", min: 0, max: 1 }
    };
    return {
      vodAllowedPlatforms: this.VOD_ALLOWED_PLATFORMS,
      allowedPlatforms: this.ALLOWED_PLATFORMS,
      token: this.get("TOKEN", "87654321", "string", true),
      // token，默认为87654321
      adminToken: this.get("ADMIN_TOKEN", "", "string", true),
      // admin token，用于系统管理访问控制
      sourceOrderArr: this.resolveSourceOrder(),
      // 源排序
      otherServer: this.get("OTHER_SERVER", "https://api.danmu.icu", "string"),
      // 第三方弹幕服务器
      customSourceApiUrl: this.get("CUSTOM_SOURCE_API_URL", "", "string", true),
      // 自定义弹幕源API地址，默认为空，配置后还需在SOURCE_ORDER添加custom源
      vodServers: this.resolveVodServers(),
      // vod站点配置，格式：名称@URL,名称@URL
      vodReturnMode: this.get("VOD_RETURN_MODE", "fastest", "string").toLowerCase(),
      // vod返回模式：all（所有站点）或 fastest（最快的站点）
      vodRequestTimeout: this.get("VOD_REQUEST_TIMEOUT", "10000", "string"),
      // vod超时时间（默认10秒）
      bilibliCookie: this.get("BILIBILI_COOKIE", "", "string", true),
      // b站cookie
      youkuConcurrency: Math.min(this.get("YOUKU_CONCURRENCY", 8, "number"), 16),
      // 优酷并发配置
      mergeSourcePairs: this.resolveMergeSourcePairs(),
      // 源合并配置，用于将源合并获取
      platformOrderArr: this.resolvePlatformOrder(),
      // 自动匹配优选平台
      episodeTitleFilter: this.resolveEpisodeTitleFilter(),
      // 剧集标题正则过滤
      blockedWords: this.get("BLOCKED_WORDS", "", "string"),
      // 屏蔽词列表
      groupMinute: Math.min(this.get("GROUP_MINUTE", 1, "number"), 30),
      // 分钟内合并去重（默认 1，最大值30，0表示不去重）
      danmuLimit: this.get("DANMU_LIMIT", 0, "number"),
      // 等间隔采样限制弹幕总数，单位为k，即千：默认 0，表示不限制弹幕数，若改为5，弹幕总数在超过5000的情况下会将弹幕数控制在5000
      proxyUrl: this.get("PROXY_URL", "", "string", true),
      // 代理/反代地址
      danmuSimplifiedTraditional: this.get("DANMU_SIMPLIFIED_TRADITIONAL", "default", "string"),
      // 弹幕简繁体转换设置：default（默认不转换）、simplified（繁转简）、traditional（简转繁）
      danmuPushUrl: this.get("DANMU_PUSH_URL", "", "string"),
      // 代理/反代地址
      tmdbApiKey: this.get("TMDB_API_KEY", "", "string", true),
      // TMDB API KEY
      redisUrl: this.get("UPSTASH_REDIS_REST_URL", "", "string", true),
      // upstash redis url
      redisToken: this.get("UPSTASH_REDIS_REST_TOKEN", "", "string", true),
      // upstash redis url
      rateLimitMaxRequests: this.get("RATE_LIMIT_MAX_REQUESTS", 3, "number"),
      // 限流配置：时间窗口内最大请求次数（默认 3，0表示不限流）
      enableEpisodeFilter: this.get("ENABLE_EPISODE_FILTER", false, "boolean"),
      // 集标题过滤开关配置（默认 false，禁用过滤）
      logLevel: this.get("LOG_LEVEL", "info", "string"),
      // 日志级别配置（默认 info，可选值：error, warn, info）
      searchCacheMinutes: this.get("SEARCH_CACHE_MINUTES", 1, "number"),
      // 搜索结果缓存时间配置（分钟，默认 1）
      commentCacheMinutes: this.get("COMMENT_CACHE_MINUTES", 1, "number"),
      // 弹幕缓存时间配置（分钟，默认 1）
      convertTopBottomToScroll: this.get("CONVERT_TOP_BOTTOM_TO_SCROLL", false, "boolean"),
      // 顶部/底部弹幕转换为浮动弹幕配置（默认 false，禁用转换）
      convertColor: this.get("CONVERT_COLOR", "default", "string"),
      // 弹幕转换颜色配置，支持 default、white、color（默认 default，禁用转换）
      danmuOutputFormat: this.get("DANMU_OUTPUT_FORMAT", "json", "string"),
      // 弹幕输出格式配置（默认 json，可选值：json, xml）
      strictTitleMatch: this.get("STRICT_TITLE_MATCH", false, "boolean"),
      // 严格标题匹配模式配置（默认 false，宽松模糊匹配）
      titleToChinese: this.get("TITLE_TO_CHINESE", false, "boolean"),
      // 外语标题转换中文开关
      titleMappingTable: this.resolveTitleMappingTable(),
      // 剧名映射表，用于自动匹配时替换标题进行搜索
      rememberLastSelect: this.get("REMEMBER_LAST_SELECT", true, "boolean"),
      // 是否记住手动选择结果，用于match自动匹配时优选上次的选择（默认 true，记住）
      MAX_LAST_SELECT_MAP: this.get("MAX_LAST_SELECT_MAP", 100, "number"),
      // 记住上次选择映射缓存大小限制（默认 100）
      deployPlatformAccount: this.get("DEPLOY_PLATFROM_ACCOUNT", "", "string", true),
      // 部署平台账号ID配置（默认空）
      deployPlatformProject: this.get("DEPLOY_PLATFROM_PROJECT", "", "string", true),
      // 部署平台项目名称配置（默认空）
      deployPlatformToken: this.get("DEPLOY_PLATFROM_TOKEN", "", "string", true),
      // 部署平台项目名称配置（默认空）
      NODE_TLS_REJECT_UNAUTHORIZED: this.get("NODE_TLS_REJECT_UNAUTHORIZED", 1, "number"),
      // 在建立 HTTPS 连接时是否验证服务器的 SSL/TLS 证书，0表示忽略，默认为1
      envVarConfig
      // 环境变量分类和描述映射
    };
  }
};
__publicField(Envs, "env");
// 记录获取过的环境变量
__publicField(Envs, "originalEnvVars", /* @__PURE__ */ new Map());
__publicField(Envs, "accessedEnvVars", /* @__PURE__ */ new Map());
__publicField(Envs, "VOD_ALLOWED_PLATFORMS", ["qiyi", "bilibili1", "imgo", "youku", "qq", "sohu", "leshi", "xigua"]);
// vod允许的播放平台
__publicField(Envs, "ALLOWED_PLATFORMS", ["qiyi", "bilibili1", "imgo", "youku", "qq", "renren", "hanjutv", "bahamut", "dandan", "sohu", "leshi", "xigua", "animeko", "custom"]);
// 全部源允许的播放平台
__publicField(Envs, "ALLOWED_SOURCES", ["360", "vod", "tmdb", "douban", "tencent", "youku", "iqiyi", "imgo", "bilibili", "renren", "hanjutv", "bahamut", "dandan", "sohu", "leshi", "xigua", "animeko", "custom"]);
// 允许的源
__publicField(Envs, "MERGE_ALLOWED_SOURCES", ["tencent", "youku", "iqiyi", "imgo", "bilibili", "renren", "hanjutv", "bahamut", "dandan", "sohu", "leshi", "xigua", "animeko"]);

// danmu_api/configs/globals.js
var Globals = {
  // 缓存环境变量
  env: {},
  envs: {},
  originalEnvVars: {},
  accessedEnvVars: {},
  // 静态常量
  VERSION: "1.13.4",
  MAX_LOGS: 1e3,
  // 日志存储，最多保存 1000 行
  MAX_ANIMES: 100,
  // 运行时状态
  animes: [],
  episodeIds: [],
  episodeNum: 10001,
  // 全局变量，用于自增 ID
  logBuffer: [],
  requestHistory: /* @__PURE__ */ new Map(),
  // 记录每个 IP 地址的请求历史
  localCacheValid: false,
  // 本地缓存是否生效
  localCacheInitialized: false,
  // 本地缓存是否已初始化
  redisValid: false,
  // redis是否生效
  redisCacheInitialized: false,
  // redis 缓存是否已初始化
  lastSelectMap: /* @__PURE__ */ new Map(),
  // 存储查询关键字上次选择的animeId，用于下次match自动匹配时优先选择该anime
  lastHashes: {
    // 存储上一次各变量哈希值
    animes: null,
    episodeIds: null,
    episodeNum: null,
    lastSelectMap: null
  },
  searchCache: /* @__PURE__ */ new Map(),
  // 搜索结果缓存，存储格式：{ keyword: { results, timestamp } }
  commentCache: /* @__PURE__ */ new Map(),
  // 弹幕缓存，存储格式：{ videoUrl: { comments, timestamp } }
  deployPlatform: "",
  // 部署平台配置
  currentToken: "",
  // 标识当前可用token
  /**
   * 初始化全局变量，加载环境变量依赖
   * @param {Object} env 环境对象
   * @returns {Object} 全局配置对象
   */
  init(env = {}) {
    this.env = env;
    this.envs = Envs.load(this.env);
    this.originalEnvVars = Object.fromEntries(Envs.getOriginalEnvVars());
    this.accessedEnvVars = Object.fromEntries(Envs.getAccessedEnvVars());
    return this.getConfig();
  },
  /**
   * 重新初始化全局变量，加载环境变量依赖
   * @returns {Object} 全局配置对象
   */
  reInit() {
    this.envs = Envs.load(this.env);
    this.originalEnvVars = Object.fromEntries(Envs.getOriginalEnvVars());
    this.accessedEnvVars = Object.fromEntries(Envs.getAccessedEnvVars());
    return this.getConfig();
  },
  /**
   * 智能构建代理URL
   * 逻辑：专用反代/万能反代直接替换/拼接URL（无视平台）；正向代理走5321端口（仅本地Node有效）
   * @param {string} targetUrl 原始目标URL
   * @returns {string} 处理后的URL
   */
  makeProxyUrl(targetUrl) {
    const proxyConfig = this.envs.proxyUrl || "";
    if (!proxyConfig || !targetUrl) return targetUrl;
    const configs = proxyConfig.split(",").map((s) => s.trim()).filter((s) => s);
    let forwardProxy = null;
    let specificProxy = null;
    let universalProxy = null;
    let targetObj;
    try {
      targetObj = new URL(targetUrl);
    } catch (e) {
      return targetUrl;
    }
    const hostname = targetObj.hostname;
    for (const conf of configs) {
      if (conf.startsWith("bahamut@") && hostname.includes("gamer.com.tw")) {
        specificProxy = conf.substring(8);
        break;
      } else if (conf.startsWith("tmdb@") && hostname.includes("tmdb")) {
        specificProxy = conf.substring(5);
        break;
      } else if (conf.startsWith("bilibili@") && hostname.includes("bilibili")) {
        specificProxy = conf.substring(9);
        break;
      } else if (conf.startsWith("@") && !universalProxy) {
        universalProxy = conf.substring(1);
      } else if (!conf.includes("@") && !forwardProxy) {
        forwardProxy = conf;
      }
    }
    if (specificProxy) {
      try {
        const proxyObj = new URL(specificProxy);
        targetObj.protocol = proxyObj.protocol;
        targetObj.host = proxyObj.host;
        targetObj.port = proxyObj.port;
        if (proxyObj.pathname !== "/") {
          targetObj.pathname = proxyObj.pathname.replace(/\/$/, "") + targetObj.pathname;
        }
        return targetObj.toString();
      } catch (e) {
        return targetUrl;
      }
    }
    if (universalProxy) {
      const cleanProxy = universalProxy.replace(/\/$/, "");
      return `${cleanProxy}/${targetUrl}`;
    }
    if (forwardProxy) {
      return `http://127.0.0.1:5321/proxy?url=${encodeURIComponent(targetUrl)}`;
    }
    return targetUrl;
  },
  /**
   * 获取全局配置快照
   * @returns {Object} 当前全局配置
   */
  /**
   * 获取全局配置对象（单例，可修改）
   * @returns {Object} 全局配置对象本身
   */
  getConfig() {
    const self = this;
    return new Proxy({}, {
      get(target, prop) {
        if (prop in self.envs) {
          return self.envs[prop];
        }
        if (prop === "version") return self.VERSION;
        if (prop === "maxLogs") return self.MAX_LOGS;
        if (prop === "maxAnimes") return self.MAX_ANIMES;
        if (prop === "maxLastSelectMap") return self.MAX_LAST_SELECT_MAP;
        if (prop === "makeProxyUrl") return self.makeProxyUrl.bind(self);
        return self[prop];
      },
      set(target, prop, value) {
        if (prop in self.envs) {
          self.envs[prop] = value;
        } else {
          self[prop] = value;
        }
        return true;
      }
    });
  }
};
var globals = new Proxy({}, {
  get(target, prop) {
    return Globals.getConfig()[prop];
  },
  set(target, prop, value) {
    Globals.getConfig()[prop] = value;
    return true;
  },
  has(target, prop) {
    return prop in Globals.getConfig();
  },
  ownKeys(target) {
    return Reflect.ownKeys(Globals.getConfig());
  },
  getOwnPropertyDescriptor(target, prop) {
    return Object.getOwnPropertyDescriptor(Globals.getConfig(), prop);
  }
});

// danmu_api/utils/log-util.js
function log(level, ...args) {
  const levels = { error: 0, warn: 1, info: 2 };
  const currentLevelValue = levels[globals.logLevel] !== void 0 ? levels[globals.logLevel] : 1;
  if ((levels[level] || 0) > currentLevelValue) {
    return;
  }
  const processedArgs = args.map((arg) => {
    if (typeof arg === "object") {
      const jsonString = JSON.stringify(arg);
      return hideSensitiveInfo(jsonString);
    } else {
      return typeof arg === "string" ? hideSensitiveInfo(arg) : arg;
    }
  });
  const message = processedArgs.map((arg) => typeof arg === "object" ? JSON.stringify(arg) : arg).join(" ");
  const now = /* @__PURE__ */ new Date();
  const shanghaiTime = new Date(now.getTime() + 8 * 60 * 60 * 1e3);
  const timestamp = shanghaiTime.toISOString().replace("Z", "+08:00");
  globals.logBuffer.push({ timestamp, level, message });
  if (globals.logBuffer.length > globals.MAX_LOGS) globals.logBuffer.shift();
  console[level](...processedArgs);
}
function hideSensitiveInfo(message) {
  let processedMessage = message;
  if (globals.originalEnvVars && globals.accessedEnvVars) {
    for (const [envVar, originalValue] of Object.entries(globals.originalEnvVars)) {
      const accessedValue = globals.accessedEnvVars[envVar];
      if (originalValue && typeof originalValue === "string" && originalValue.length > 0 && accessedValue && typeof accessedValue === "string" && accessedValue.match(/^\*+$/) && accessedValue.length === originalValue.length) {
        const mask = "*".repeat(originalValue.length);
        const regex = new RegExp(originalValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        processedMessage = processedMessage.replace(regex, mask);
      }
    }
  }
  return processedMessage;
}

// danmu_api/utils/http-util.js
function linkSignal(externalSignal, internalController) {
  if (externalSignal) {
    if (externalSignal.aborted) {
      internalController.abort();
    } else {
      externalSignal.addEventListener("abort", () => {
        internalController.abort();
      }, { once: true });
    }
  }
}
async function httpGet(url, options = {}) {
  const maxRetries = parseInt(options.retries || "0", 10) || 0;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      log("info", `[\u8BF7\u6C42\u6A21\u62DF] \u7B2C ${attempt} \u6B21\u91CD\u8BD5: ${url}`);
      await new Promise((resolve) => setTimeout(resolve, Math.min(1e3 * Math.pow(2, attempt - 1), 5e3)));
    } else {
      log("info", `[\u8BF7\u6C42\u6A21\u62DF] HTTP GET: ${url}`);
    }
    const timeout = parseInt(globals.vodRequestTimeout || "5000", 10) || 5e3;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    linkSignal(options.signal, controller);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...options.headers
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data;
      if (options.base64Data) {
        log("info", "base64\u6A21\u5F0F");
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = "";
        const chunkSize = 32768;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          let chunk = uint8Array.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        data = btoa(binary);
      } else if (options.zlibMode) {
        log("info", "zlib\u6A21\u5F0F");
        const arrayBuffer = await response.arrayBuffer();
        const decompressionStream = new DecompressionStream("deflate");
        const decompressedStream = new Response(
          new Blob([arrayBuffer]).stream().pipeThrough(decompressionStream)
        );
        let decodedData;
        try {
          decodedData = await decompressedStream.text();
        } catch (e) {
          log("error", "[\u8BF7\u6C42\u6A21\u62DF] \u89E3\u538B\u7F29\u5931\u8D25", e);
          throw e;
        }
        data = decodedData;
      } else {
        data = await response.text();
      }
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        parsedData = data;
      }
      const headers = {};
      let setCookieValues = [];
      for (const [key, value] of response.headers.entries()) {
        if (key.toLowerCase() === "set-cookie") {
          setCookieValues.push(value);
        } else {
          headers[key] = value;
        }
      }
      if (setCookieValues.length > 0) {
        headers["set-cookie"] = setCookieValues.join(";");
      }
      if (attempt > 0) {
        log("info", `[\u8BF7\u6C42\u6A21\u62DF] \u91CD\u8BD5\u6210\u529F`);
      }
      return {
        data: parsedData,
        status: response.status,
        headers
      };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      if (options.signal?.aborted) {
        throw error;
      }
      if (error.name === "AbortError") {
        log("error", `[\u8BF7\u6C42\u6A21\u62DF] \u8BF7\u6C42\u8D85\u65F6:`, error.message);
        log("error", "\u8BE6\u7EC6\u8BCA\u65AD:");
        log("error", "- URL:", url);
        log("error", "- \u8D85\u65F6\u65F6\u95F4:", `${timeout}ms`);
        log("error", `- \u5F53\u524D\u5C1D\u8BD5: ${attempt + 1}/${maxRetries + 1}`);
      } else {
        log("error", `[\u8BF7\u6C42\u6A21\u62DF] \u8BF7\u6C42\u5931\u8D25:`, error.message);
        log("error", "\u8BE6\u7EC6\u8BCA\u65AD:");
        log("error", "- URL:", url);
        log("error", "- \u9519\u8BEF\u7C7B\u578B:", error.name);
        log("error", "- \u6D88\u606F:", error.message);
        log("error", `- \u5F53\u524D\u5C1D\u8BD5: ${attempt + 1}/${maxRetries + 1}`);
        if (error.cause) {
          log("error", "- \u7801:", error.cause.code);
          log("error", "- \u539F\u56E0:", error.cause.message);
        }
      }
      if (attempt < maxRetries) {
        log("info", `[\u8BF7\u6C42\u6A21\u62DF] \u51C6\u5907\u91CD\u8BD5...`);
        continue;
      }
    }
  }
  log("error", `[\u8BF7\u6C42\u6A21\u62DF] \u6240\u6709\u91CD\u8BD5\u5747\u5931\u8D25 (${maxRetries + 1} \u6B21\u5C1D\u8BD5)`);
  throw lastError;
}
async function httpPost(url, body, options = {}) {
  const maxRetries = parseInt(options.retries || "0", 10) || 0;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      log("info", `[\u8BF7\u6C42\u6A21\u62DF] \u7B2C ${attempt} \u6B21\u91CD\u8BD5: ${url}`);
      await new Promise((resolve) => setTimeout(resolve, Math.min(1e3 * Math.pow(2, attempt - 1), 5e3)));
    } else {
      log("info", `[\u8BF7\u6C42\u6A21\u62DF] HTTP POST: ${url}`);
    }
    const timeout = parseInt(globals.vodRequestTimeout || "5000", 10) || 5e3;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    linkSignal(options.signal, controller);
    const { headers = {}, params, allow_redirects = true } = options;
    const fetchOptions = {
      method: "POST",
      headers: {
        ...headers
      },
      body,
      signal: controller.signal
    };
    if (!allow_redirects) {
      fetchOptions.redirect = "manual";
    }
    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      const data = await response.text();
      if (!response.ok) {
        log("error", `[\u8BF7\u6C42\u6A21\u62DF] response data: `, data);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        parsedData = data;
      }
      if (attempt > 0) {
        log("info", `[\u8BF7\u6C42\u6A21\u62DF] \u91CD\u8BD5\u6210\u529F`);
      }
      return {
        data: parsedData,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      if (options.signal?.aborted) {
        throw error;
      }
      if (error.name === "AbortError") {
        log("error", `[\u8BF7\u6C42\u6A21\u62DF] \u8BF7\u6C42\u8D85\u65F6:`, error.message);
        log("error", "\u8BE6\u7EC6\u8BCA\u65AD:");
        log("error", "- URL:", url);
        log("error", "- \u8D85\u65F6\u65F6\u95F4:", `${timeout}ms`);
        log("error", `- \u5F53\u524D\u5C1D\u8BD5: ${attempt + 1}/${maxRetries + 1}`);
      } else {
        log("error", `[\u8BF7\u6C42\u6A21\u62DF] \u8BF7\u6C42\u5931\u8D25:`, error.message);
        log("error", "\u8BE6\u7EC6\u8BCA\u65AD:");
        log("error", "- URL:", url);
        log("error", "- \u9519\u8BEF\u7C7B\u578B:", error.name);
        log("error", "- \u6D88\u606F:", error.message);
        log("error", `- \u5F53\u524D\u5C1D\u8BD5: ${attempt + 1}/${maxRetries + 1}`);
        if (error.cause) {
          log("error", "- \u7801:", error.cause.code);
          log("error", "- \u539F\u56E0:", error.cause.message);
        }
      }
      if (attempt < maxRetries) {
        log("info", `[\u8BF7\u6C42\u6A21\u62DF] \u51C6\u5907\u91CD\u8BD5...`);
        continue;
      }
    }
  }
  log("error", `[\u8BF7\u6C42\u6A21\u62DF] \u6240\u6709\u91CD\u8BD5\u5747\u5931\u8D25 (${maxRetries + 1} \u6B21\u5C1D\u8BD5)`);
  throw lastError;
}
async function getPageTitle(url) {
  try {
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
      }
    });
    const html = response.data;
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
      return title;
    }
    return url;
  } catch (error) {
    log("error", `\u83B7\u53D6\u6807\u9898\u5931\u8D25: ${error.message}`);
    return url;
  }
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
function xmlResponse(data, status = 200) {
  if (typeof data !== "string" || !data.trim().startsWith("<?xml")) {
    throw new Error("Expected data to be an XML string starting with <?xml");
  }
  return new Response(data, {
    status,
    headers: {
      "Content-Type": "application/xml",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
function buildQueryString(params) {
  let queryString = "";
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      if (queryString.length > 0) {
        queryString += "&";
      }
      queryString += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    }
  }
  return queryString;
}
function sortedQueryString(params = {}) {
  const normalized = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "boolean") normalized[k] = v ? "true" : "false";
    else if (v == null) normalized[k] = "";
    else normalized[k] = String(v);
  }
  const keys = [];
  for (const key in normalized) {
    if (Object.prototype.hasOwnProperty.call(normalized, key)) {
      keys.push(key);
    }
  }
  keys.sort();
  const pairs = [];
  for (const key of keys) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(normalized[key]);
    pairs.push(`${encodedKey}=${encodedValue}`);
  }
  return pairs.join("&");
}
function updateQueryString(url, params) {
  let baseUrl = url;
  let queryString = "";
  const hashIndex = url.indexOf("#");
  let hash = "";
  if (hashIndex !== -1) {
    baseUrl = url.substring(0, hashIndex);
    hash = url.substring(hashIndex);
  }
  const queryIndex = baseUrl.indexOf("?");
  if (queryIndex !== -1) {
    queryString = baseUrl.substring(queryIndex + 1);
    baseUrl = baseUrl.substring(0, queryIndex);
  }
  const queryParams = {};
  if (queryString) {
    const pairs = queryString.split("&");
    for (const pair of pairs) {
      if (pair) {
        const [key, value = ""] = pair.split("=").map(decodeURIComponent);
        queryParams[key] = value;
      }
    }
  }
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      queryParams[key] = params[key];
    }
  }
  const newQuery = [];
  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      newQuery.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      );
    }
  }
  return baseUrl + (newQuery.length ? "?" + newQuery.join("&") : "") + hash;
}
function getPathname(url) {
  let pathnameStart = url.indexOf("//") + 2;
  if (pathnameStart === 1) pathnameStart = 0;
  const pathStart = url.indexOf("/", pathnameStart);
  if (pathStart === -1) return "/";
  const queryStart = url.indexOf("?", pathStart);
  const hashStart = url.indexOf("#", pathStart);
  let pathEnd = queryStart !== -1 ? queryStart : hashStart !== -1 ? hashStart : url.length;
  const pathname = url.substring(pathStart, pathEnd);
  return pathname || "/";
}
async function httpGetWithStreamCheck(url, options = {}, checkCallback) {
  const { headers = {}, sniffLimit } = options;
  const SNIFF_LIMIT = parseInt(sniffLimit || "32768", 10) || 32768;
  const timeout = parseInt(globals.vodRequestTimeout || "5000", 10) || 5e3;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  linkSignal(options.signal, controller);
  try {
    log("info", `[\u6D41\u5F0F\u8BF7\u6C42] HTTP GET: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reader = response.body.getReader ? response.body.getReader() : null;
    if (!reader) {
      log("warn", "[\u6D41\u5F0F\u8BF7\u6C42] \u73AF\u5883\u4E0D\u652F\u6301\u6D41\u5F0F\u8BFB\u53D6,\u56DE\u9000\u5230\u666E\u901A\u8BF7\u6C42");
      const text = await response.text();
      clearTimeout(timeoutId);
      if (checkCallback && !checkCallback(text.slice(0, SNIFF_LIMIT))) {
        log("info", "[\u6D41\u5F0F\u8BF7\u6C42] \u68C0\u6D4B\u5230\u65E0\u6548\u6570\u636E(\u56DE\u9000\u6A21\u5F0F),\u4E22\u5F03\u7ED3\u679C");
        return null;
      }
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
    let receivedLength = 0;
    let chunks = [];
    let isAborted = false;
    let checkBuffer = "";
    let stopChecking = false;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedLength += value.length;
      if (!stopChecking && checkCallback) {
        const chunkText = new TextDecoder("utf-8").decode(value, { stream: true });
        checkBuffer += chunkText;
        if (!checkCallback(checkBuffer)) {
          log("info", `[\u6D41\u5F0F\u8BF7\u6C42] \u55C5\u63A2\u5230\u65E0\u6548\u7279\u5F81(\u5DF2\u8BFB${receivedLength}\u5B57\u8282),\u7ACB\u5373\u7194\u65AD`);
          try {
            await reader.cancel("Stream aborted by user check");
          } catch (e) {
          }
          controller.abort();
          isAborted = true;
          break;
        }
        if (receivedLength > SNIFF_LIMIT) {
          stopChecking = true;
          checkBuffer = null;
        }
      }
      chunks.push(value);
    }
    clearTimeout(timeoutId);
    if (isAborted) return null;
    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    const resultText = new TextDecoder("utf-8").decode(chunksAll);
    try {
      return JSON.parse(resultText);
    } catch (e) {
      return resultText;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return null;
    }
    log("error", `[\u6D41\u5F0F\u8BF7\u6C42] \u5931\u8D25: ${error.message}`);
    return null;
  }
}

// danmu_api/utils/codec-util.js
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash >>> 0;
  }
  return hash.toString(16);
}
function serializeValue(key, value) {
  if (key === "lastSelectMap" && value instanceof Map) {
    return JSON.stringify(Object.fromEntries(value));
  }
  return JSON.stringify(value);
}
function md5(message) {
  function toUtf8(str) {
    let utf8 = "";
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode < 128) {
        utf8 += String.fromCharCode(charCode);
      } else if (charCode < 2048) {
        utf8 += String.fromCharCode(192 | charCode >> 6);
        utf8 += String.fromCharCode(128 | charCode & 63);
      } else {
        utf8 += String.fromCharCode(224 | charCode >> 12);
        utf8 += String.fromCharCode(128 | charCode >> 6 & 63);
        utf8 += String.fromCharCode(128 | charCode & 63);
      }
    }
    return utf8;
  }
  message = toUtf8(message);
  function rotateLeft(lValue, iShiftBits) {
    return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
  }
  function addUnsigned(lX, lY) {
    const lX4 = lX & 1073741824;
    const lY4 = lY & 1073741824;
    const lX8 = lX & 2147483648;
    const lY8 = lY & 2147483648;
    const lResult = (lX & 1073741823) + (lY & 1073741823);
    if (lX4 & lY4) return lResult ^ 2147483648 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 1073741824) return lResult ^ 3221225472 ^ lX8 ^ lY8;
      else return lResult ^ 1073741824 ^ lX8 ^ lY8;
    } else return lResult ^ lX8 ^ lY8;
  }
  function F(x2, y, z) {
    return x2 & y | ~x2 & z;
  }
  function G(x2, y, z) {
    return x2 & z | y & ~z;
  }
  function H(x2, y, z) {
    return x2 ^ y ^ z;
  }
  function I(x2, y, z) {
    return y ^ (x2 | ~z);
  }
  function FF(a2, b2, c2, d2, x2, s, ac) {
    a2 = addUnsigned(a2, addUnsigned(addUnsigned(F(b2, c2, d2), x2), ac));
    return addUnsigned(rotateLeft(a2, s), b2);
  }
  function GG(a2, b2, c2, d2, x2, s, ac) {
    a2 = addUnsigned(a2, addUnsigned(addUnsigned(G(b2, c2, d2), x2), ac));
    return addUnsigned(rotateLeft(a2, s), b2);
  }
  function HH(a2, b2, c2, d2, x2, s, ac) {
    a2 = addUnsigned(a2, addUnsigned(addUnsigned(H(b2, c2, d2), x2), ac));
    return addUnsigned(rotateLeft(a2, s), b2);
  }
  function II(a2, b2, c2, d2, x2, s, ac) {
    a2 = addUnsigned(a2, addUnsigned(addUnsigned(I(b2, c2, d2), x2), ac));
    return addUnsigned(rotateLeft(a2, s), b2);
  }
  function convertToWordArray(str) {
    const lMessageLength = str.length;
    const lNumberOfWords = ((lMessageLength + 8 >>> 6) + 1) * 16;
    const lWordArray = new Array(lNumberOfWords).fill(0);
    for (let i = 0; i < lMessageLength; i++) {
      lWordArray[i >> 2] |= str.charCodeAt(i) << i % 4 * 8;
    }
    lWordArray[lMessageLength >> 2] |= 128 << lMessageLength % 4 * 8;
    lWordArray[lNumberOfWords - 2] = lMessageLength * 8;
    return lWordArray;
  }
  function wordToHex(lValue) {
    let wordToHexValue = "";
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = lValue >>> lCount * 8 & 255;
      let wordToHexValueTemp = "0" + lByte.toString(16);
      wordToHexValue += wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  }
  let x = convertToWordArray(message);
  let a = 1732584193;
  let b = 4023233417;
  let c = 2562383102;
  let d = 271733878;
  for (let k = 0; k < x.length; k += 16) {
    let AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], 7, 3614090360);
    d = FF(d, a, b, c, x[k + 1], 12, 3905402710);
    c = FF(c, d, a, b, x[k + 2], 17, 606105819);
    b = FF(b, c, d, a, x[k + 3], 22, 3250441966);
    a = FF(a, b, c, d, x[k + 4], 7, 4118548399);
    d = FF(d, a, b, c, x[k + 5], 12, 1200080426);
    c = FF(c, d, a, b, x[k + 6], 17, 2821735955);
    b = FF(b, c, d, a, x[k + 7], 22, 4249261313);
    a = FF(a, b, c, d, x[k + 8], 7, 1770035416);
    d = FF(d, a, b, c, x[k + 9], 12, 2336552879);
    c = FF(c, d, a, b, x[k + 10], 17, 4294925233);
    b = FF(b, c, d, a, x[k + 11], 22, 2304563134);
    a = FF(a, b, c, d, x[k + 12], 7, 1804603682);
    d = FF(d, a, b, c, x[k + 13], 12, 4254626195);
    c = FF(c, d, a, b, x[k + 14], 17, 2792965006);
    b = FF(b, c, d, a, x[k + 15], 22, 1236535329);
    a = GG(a, b, c, d, x[k + 1], 5, 4129170786);
    d = GG(d, a, b, c, x[k + 6], 9, 3225465664);
    c = GG(c, d, a, b, x[k + 11], 14, 643717713);
    b = GG(b, c, d, a, x[k + 0], 20, 3921069994);
    a = GG(a, b, c, d, x[k + 5], 5, 3593408605);
    d = GG(d, a, b, c, x[k + 10], 9, 38016083);
    c = GG(c, d, a, b, x[k + 15], 14, 3634488961);
    b = GG(b, c, d, a, x[k + 4], 20, 3889429448);
    a = GG(a, b, c, d, x[k + 9], 5, 568446438);
    d = GG(d, a, b, c, x[k + 14], 9, 3275163606);
    c = GG(c, d, a, b, x[k + 3], 14, 4107603335);
    b = GG(b, c, d, a, x[k + 8], 20, 1163531501);
    a = GG(a, b, c, d, x[k + 13], 5, 2850285829);
    d = GG(d, a, b, c, x[k + 2], 9, 4243563512);
    c = GG(c, d, a, b, x[k + 7], 14, 1735328473);
    b = GG(b, c, d, a, x[k + 12], 20, 2368359562);
    a = HH(a, b, c, d, x[k + 5], 4, 4294588738);
    d = HH(d, a, b, c, x[k + 8], 11, 2272392833);
    c = HH(c, d, a, b, x[k + 11], 16, 1839030562);
    b = HH(b, c, d, a, x[k + 14], 23, 4259657740);
    a = HH(a, b, c, d, x[k + 1], 4, 2763975236);
    d = HH(d, a, b, c, x[k + 4], 11, 1272893353);
    c = HH(c, d, a, b, x[k + 7], 16, 4139469664);
    b = HH(b, c, d, a, x[k + 10], 23, 3200236656);
    a = HH(a, b, c, d, x[k + 13], 4, 681279174);
    d = HH(d, a, b, c, x[k + 0], 11, 3936430074);
    c = HH(c, d, a, b, x[k + 3], 16, 3572445317);
    b = HH(b, c, d, a, x[k + 6], 23, 76029189);
    a = HH(a, b, c, d, x[k + 9], 4, 3654602809);
    d = HH(d, a, b, c, x[k + 12], 11, 3873151461);
    c = HH(c, d, a, b, x[k + 15], 16, 530742520);
    b = HH(b, c, d, a, x[k + 2], 23, 3299628645);
    a = II(a, b, c, d, x[k + 0], 6, 4096336452);
    d = II(d, a, b, c, x[k + 7], 10, 1126891415);
    c = II(c, d, a, b, x[k + 14], 15, 2878612391);
    b = II(b, c, d, a, x[k + 5], 21, 4237533241);
    a = II(a, b, c, d, x[k + 12], 6, 1700485571);
    d = II(d, a, b, c, x[k + 3], 10, 2399980690);
    c = II(c, d, a, b, x[k + 10], 15, 4293915773);
    b = II(b, c, d, a, x[k + 1], 21, 2240044497);
    a = II(a, b, c, d, x[k + 8], 6, 1873313359);
    d = II(d, a, b, c, x[k + 15], 10, 4264355552);
    c = II(c, d, a, b, x[k + 6], 15, 2734768916);
    b = II(b, c, d, a, x[k + 13], 21, 1309151649);
    a = II(a, b, c, d, x[k + 4], 6, 4149444226);
    d = II(d, a, b, c, x[k + 11], 10, 3174756917);
    c = II(c, d, a, b, x[k + 2], 15, 718787259);
    b = II(b, c, d, a, x[k + 9], 21, 3951481745);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}
function parseDanmakuBase64(base64) {
  const bytes = base64ToBytes(base64);
  const elems = [];
  let offset = 0;
  while (offset < bytes.length) {
    const key = bytes[offset++];
    if (key !== 10) break;
    const [msgBytes, nextOffset] = readLengthDelimited(bytes, offset);
    offset = nextOffset;
    let innerOffset = 0;
    const elem = {};
    while (innerOffset < msgBytes.length) {
      const tag = msgBytes[innerOffset++];
      const fieldNumber = tag >> 3;
      const wireType = tag & 7;
      if (wireType === 0) {
        const [val, innerNext] = readVarint(msgBytes, innerOffset);
        innerOffset = innerNext;
        switch (fieldNumber) {
          case 1:
            elem.id = val;
            break;
          case 2:
            elem.progress = val;
            break;
          case 3:
            elem.mode = val;
            break;
          case 4:
            elem.fontsize = val;
            break;
          case 5:
            elem.color = val;
            break;
          case 8:
            elem.ctime = val;
            break;
          case 9:
            elem.weight = val;
            break;
          case 11:
            elem.pool = val;
            break;
          case 13:
            elem.attr = val;
            break;
          case 15:
            elem.like_num = val;
            break;
          case 17:
            elem.dm_type_v2 = val;
            break;
        }
      } else if (wireType === 2) {
        const [valBytes, innerNext] = readLengthDelimited(msgBytes, innerOffset);
        innerOffset = innerNext;
        switch (fieldNumber) {
          case 6:
            elem.midHash = utf8BytesToString(valBytes);
            break;
          case 7:
            elem.content = utf8BytesToString(valBytes);
            break;
          case 10:
            elem.action = utf8BytesToString(valBytes);
            break;
          case 12:
            elem.idStr = utf8BytesToString(valBytes);
            break;
          case 14:
            elem.animation = utf8BytesToString(valBytes);
            break;
          case 16:
            elem.color_v2 = utf8BytesToString(valBytes);
            break;
        }
      } else {
        const [_, innerNext] = readVarint(msgBytes, innerOffset);
        innerOffset = innerNext;
      }
    }
    elems.push(elem);
  }
  return elems;
}
function readVarint(bytes, offset) {
  let result = 0n;
  let shift = 0n;
  let pos = offset;
  while (true) {
    const b = bytes[pos++];
    result |= BigInt(b & 127) << shift;
    if ((b & 128) === 0) break;
    shift += 7n;
  }
  return [Number(result), pos];
}
function readLengthDelimited(bytes, offset) {
  const [length, newOffset] = readVarint(bytes, offset);
  const start2 = newOffset;
  const end2 = start2 + length;
  const slice = bytes.slice(start2, end2);
  return [slice, end2];
}
function convertToAsciiSum(sid) {
  let hash = 5381;
  for (let i = 0; i < sid.length; i++) {
    hash = hash * 33 ^ sid.charCodeAt(i);
  }
  hash = (hash >>> 0) % 9999999;
  return hash < 1e4 ? hash + 1e4 : hash;
}
var SBOX = [
  99,
  124,
  119,
  123,
  242,
  107,
  111,
  197,
  48,
  1,
  103,
  43,
  254,
  215,
  171,
  118,
  202,
  130,
  201,
  125,
  250,
  89,
  71,
  240,
  173,
  212,
  162,
  175,
  156,
  164,
  114,
  192,
  183,
  253,
  147,
  38,
  54,
  63,
  247,
  204,
  52,
  165,
  229,
  241,
  113,
  216,
  49,
  21,
  4,
  199,
  35,
  195,
  24,
  150,
  5,
  154,
  7,
  18,
  128,
  226,
  235,
  39,
  178,
  117,
  9,
  131,
  44,
  26,
  27,
  110,
  90,
  160,
  82,
  59,
  214,
  179,
  41,
  227,
  47,
  132,
  83,
  209,
  0,
  237,
  32,
  252,
  177,
  91,
  106,
  203,
  190,
  57,
  74,
  76,
  88,
  207,
  208,
  239,
  170,
  251,
  67,
  77,
  51,
  133,
  69,
  249,
  2,
  127,
  80,
  60,
  159,
  168,
  81,
  163,
  64,
  143,
  146,
  157,
  56,
  245,
  188,
  182,
  218,
  33,
  16,
  255,
  243,
  210,
  205,
  12,
  19,
  236,
  95,
  151,
  68,
  23,
  196,
  167,
  126,
  61,
  100,
  93,
  25,
  115,
  96,
  129,
  79,
  220,
  34,
  42,
  144,
  136,
  70,
  238,
  184,
  20,
  222,
  94,
  11,
  219,
  224,
  50,
  58,
  10,
  73,
  6,
  36,
  92,
  194,
  211,
  172,
  98,
  145,
  149,
  228,
  121,
  231,
  200,
  55,
  109,
  141,
  213,
  78,
  169,
  108,
  86,
  244,
  234,
  101,
  122,
  174,
  8,
  186,
  120,
  37,
  46,
  28,
  166,
  180,
  198,
  232,
  221,
  116,
  31,
  75,
  189,
  139,
  138,
  112,
  62,
  181,
  102,
  72,
  3,
  246,
  14,
  97,
  53,
  87,
  185,
  134,
  193,
  29,
  158,
  225,
  248,
  152,
  17,
  105,
  217,
  142,
  148,
  155,
  30,
  135,
  233,
  206,
  85,
  40,
  223,
  140,
  161,
  137,
  13,
  191,
  230,
  66,
  104,
  65,
  153,
  45,
  15,
  176,
  84,
  187,
  22
];
var RCON = [
  0,
  1,
  2,
  4,
  8,
  16,
  32,
  64,
  128,
  27,
  54
];
function xor(a, b) {
  const out = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] ^ b[i];
  return out;
}
function rotWord(word) {
  return Uint8Array.from([word[1], word[2], word[3], word[0]]);
}
function subWord(word) {
  return Uint8Array.from(word.map((b) => SBOX[b]));
}
function keyExpansion(key) {
  const Nk = 4, Nb = 4, Nr = 10;
  const w = new Array(Nb * (Nr + 1));
  for (let i = 0; i < Nk; i++) {
    w[i] = key.slice(4 * i, 4 * i + 4);
  }
  for (let i = Nk; i < Nb * (Nr + 1); i++) {
    let temp = w[i - 1];
    if (i % Nk === 0) temp = xor(subWord(rotWord(temp)), Uint8Array.from([RCON[i / Nk], 0, 0, 0]));
    w[i] = xor(w[i - Nk], temp);
  }
  return w;
}
function aesDecryptBlock(input, w) {
  const Nb = 4, Nr = 10;
  let state = new Uint8Array(input);
  state = addRoundKey(state, w.slice(Nr * Nb, (Nr + 1) * Nb));
  for (let round = Nr - 1; round >= 1; round--) {
    state = invShiftRows(state);
    state = invSubBytes(state);
    state = addRoundKey(state, w.slice(round * Nb, (round + 1) * Nb));
    state = invMixColumns(state);
  }
  state = invShiftRows(state);
  state = invSubBytes(state);
  state = addRoundKey(state, w.slice(0, Nb));
  return state;
}
function addRoundKey(state, w) {
  const out = new Uint8Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      out[r + 4 * c] = state[r + 4 * c] ^ w[c][r];
  return out;
}
function invSubBytes(state) {
  const INV_SBOX = new Array(256);
  for (let i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;
  return Uint8Array.from(state.map((b) => INV_SBOX[b]));
}
function invShiftRows(state) {
  const out = new Uint8Array(16);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      out[r + 4 * c] = state[r + 4 * ((c - r + 4) % 4)];
  return out;
}
function invMixColumns(state) {
  function mul(a, b) {
    let p = 0;
    for (let i = 0; i < 8; i++) {
      if (b & 1) p ^= a;
      let hi = a & 128;
      a = a << 1 & 255;
      if (hi) a ^= 27;
      b >>= 1;
    }
    return p;
  }
  const out = new Uint8Array(16);
  for (let c = 0; c < 4; c++) {
    const col = state.slice(4 * c, 4 * c + 4);
    out[4 * c + 0] = mul(col[0], 14) ^ mul(col[1], 11) ^ mul(col[2], 13) ^ mul(col[3], 9);
    out[4 * c + 1] = mul(col[0], 9) ^ mul(col[1], 14) ^ mul(col[2], 11) ^ mul(col[3], 13);
    out[4 * c + 2] = mul(col[0], 13) ^ mul(col[1], 9) ^ mul(col[2], 14) ^ mul(col[3], 11);
    out[4 * c + 3] = mul(col[0], 11) ^ mul(col[1], 13) ^ mul(col[2], 9) ^ mul(col[3], 14);
  }
  return out;
}
function aesDecryptECB(cipherBytes, keyBytes) {
  const w = keyExpansion(keyBytes);
  const blockSize = 16;
  const result = new Uint8Array(cipherBytes.length);
  for (let i = 0; i < cipherBytes.length; i += blockSize) {
    const block = cipherBytes.slice(i, i + blockSize);
    const decrypted = aesDecryptBlock(block, w);
    result.set(decrypted, i);
  }
  return result;
}
function pkcs7Unpad(data) {
  const pad = data[data.length - 1];
  return data.slice(0, data.length - pad);
}
function base64ToBytes(b64) {
  const binaryString = typeof atob === "function" ? atob(b64) : BufferBase64Decode(b64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function BufferBase64Decode(b64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = "";
  let buffer = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const c = b64.charAt(i);
    if (c === "=") break;
    const val = chars.indexOf(c);
    buffer = buffer << 6 | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      str += String.fromCharCode(buffer >> bits & 255);
    }
  }
  return str;
}
function utf8BytesToString(bytes) {
  let str = "";
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    if (b1 < 128) {
      str += String.fromCharCode(b1);
    } else if (b1 >= 192 && b1 < 224) {
      const b2 = bytes[i++];
      str += String.fromCharCode((b1 & 31) << 6 | b2 & 63);
    } else if (b1 >= 224 && b1 < 240) {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      str += String.fromCharCode((b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63);
    } else if (b1 >= 240) {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      const b4 = bytes[i++];
      const codepoint = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
      const cp = codepoint - 65536;
      str += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
    }
  }
  return str;
}
function stringToUtf8Bytes(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 | code >> 6);
      bytes.push(128 | code & 63);
    } else if (code < 55296 || code >= 57344) {
      bytes.push(224 | code >> 12);
      bytes.push(128 | code >> 6 & 63);
      bytes.push(128 | code & 63);
    } else {
      i++;
      const code2 = str.charCodeAt(i);
      const codePoint = 65536 + ((code & 1023) << 10 | code2 & 1023);
      bytes.push(240 | codePoint >> 18);
      bytes.push(128 | codePoint >> 12 & 63);
      bytes.push(128 | codePoint >> 6 & 63);
      bytes.push(128 | codePoint & 63);
    }
  }
  return new Uint8Array(bytes);
}
function aesDecryptBase64(cipherB64, keyStr) {
  try {
    const cipherBytes = base64ToBytes(cipherB64);
    const keyBytes = stringToUtf8Bytes(keyStr);
    const decryptedBytes = aesDecryptECB(cipherBytes, keyBytes);
    const unpadded = pkcs7Unpad(decryptedBytes);
    return utf8BytesToString(unpadded);
  } catch (e) {
    log("error", e);
    return null;
  }
}
function autoDecode(anything) {
  const text = typeof anything === "string" ? anything.trim() : JSON.stringify(anything ?? "");
  try {
    return JSON.parse(text);
  } catch {
  }
  const AES_KEY = "3b744389882a4067";
  const dec = aesDecryptBase64(text, AES_KEY);
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
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 | code >> 6);
      bytes.push(128 | code & 63);
    } else if (code < 65536) {
      bytes.push(224 | code >> 12);
      bytes.push(128 | code >> 6 & 63);
      bytes.push(128 | code & 63);
    }
  }
  return bytes;
}
function bytesToBase64(bytes) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let i;
  for (i = 0; i + 2 < bytes.length; i += 3) {
    result += chars[bytes[i] >> 2];
    result += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    result += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    result += chars[bytes[i + 2] & 63];
  }
  if (i < bytes.length) {
    result += chars[bytes[i] >> 2];
    if (i + 1 < bytes.length) {
      result += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
      result += chars[(bytes[i + 1] & 15) << 2];
      result += "=";
    } else {
      result += chars[(bytes[i] & 3) << 4];
      result += "==";
    }
  }
  return result;
}
function sha256(ascii) {
  function rightRotate(n, x) {
    return x >>> n | x << 32 - n;
  }
  let maxWord = Math.pow(2, 32);
  let words = [], asciiBitLength = ascii.length * 8;
  for (let i = 0; i < ascii.length; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << (3 - i) % 4 * 8;
  }
  words[ascii.length >> 2] |= 128 << (3 - ascii.length % 4) * 8;
  words[(ascii.length + 8 >> 6) * 16 + 15] = asciiBitLength;
  let w = new Array(64), hash = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ];
  const k = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  for (let j = 0; j < words.length; j += 16) {
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) w[i] = words[j + i] | 0;
      else {
        const s0 = rightRotate(7, w[i - 15]) ^ rightRotate(18, w[i - 15]) ^ w[i - 15] >>> 3;
        const s1 = rightRotate(17, w[i - 2]) ^ rightRotate(19, w[i - 2]) ^ w[i - 2] >>> 10;
        w[i] = w[i - 16] + s0 + w[i - 7] + s1 | 0;
      }
      const S1 = rightRotate(6, e) ^ rightRotate(11, e) ^ rightRotate(25, e);
      const ch = e & f ^ ~e & g;
      const temp1 = h + S1 + ch + k[i] + w[i] | 0;
      const S0 = rightRotate(2, a) ^ rightRotate(13, a) ^ rightRotate(22, a);
      const maj = a & b ^ a & c ^ b & c;
      const temp2 = S0 + maj | 0;
      h = g;
      g = f;
      f = e;
      e = d + temp1 | 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 | 0;
    }
    hash[0] = hash[0] + a | 0;
    hash[1] = hash[1] + b | 0;
    hash[2] = hash[2] + c | 0;
    hash[3] = hash[3] + d | 0;
    hash[4] = hash[4] + e | 0;
    hash[5] = hash[5] + f | 0;
    hash[6] = hash[6] + g | 0;
    hash[7] = hash[7] + h | 0;
  }
  const bytes = [];
  for (let h of hash) {
    bytes.push(h >> 24 & 255);
    bytes.push(h >> 16 & 255);
    bytes.push(h >> 8 & 255);
    bytes.push(h & 255);
  }
  return bytes;
}
function createHmacSha256(key, message) {
  const blockSize = 64;
  let keyBytes = str2bytes(key);
  if (keyBytes.length > blockSize) keyBytes = sha256(key);
  if (keyBytes.length < blockSize) keyBytes = keyBytes.concat(Array(blockSize - keyBytes.length).fill(0));
  const oKeyPad = keyBytes.map((b) => b ^ 92);
  const iKeyPad = keyBytes.map((b) => b ^ 54);
  const innerHash = sha256(String.fromCharCode(...iKeyPad) + message);
  const hmacBytes = sha256(String.fromCharCode(...oKeyPad) + String.fromCharCode(...innerHash));
  return bytesToBase64(hmacBytes);
}
function generateRandomSid() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
function generateSign(path2, timestamp, params, secretKey) {
  let signStr = path2 + "t" + timestamp;
  if (params) {
    const sortedKeys = Object.keys(params).sort();
    sortedKeys.forEach((key) => {
      signStr += key + params[key];
    });
  }
  signStr += secretKey;
  return md5(signStr);
}
function generateXCaSign(path2, timestamp, queryString, secretKey) {
  let signStr = `GET
*/*
gzip

x-ca-method:1
${path2}`;
  if (queryString) signStr += `?${queryString}`;
  return createHmacSha256(secretKey, signStr);
}
function fromCodePoint(codePoint) {
  if (codePoint <= 65535) {
    return String.fromCharCode(codePoint);
  }
  codePoint -= 65536;
  const highSurrogate = (codePoint >> 10) + 55296;
  const lowSurrogate = (codePoint & 1023) + 56320;
  return String.fromCharCode(highSurrogate, lowSurrogate);
}
function decodeHtmlEntities(str) {
  return str.replace(/&#(\d+);/g, (match, num) => {
    return fromCodePoint(parseInt(num, 10));
  }).replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return fromCodePoint(parseInt(hex, 16));
  });
}

// danmu_api/utils/redis-util.js
async function setRedisKey(key, value) {
  const serializedValue = serializeValue(key, value);
  const currentHash = simpleHash(serializedValue);
  if (globals.lastHashes[key] === currentHash) {
    log("info", `[redis] \u952E ${key} \u65E0\u53D8\u5316\uFF0C\u8DF3\u8FC7 SET \u8BF7\u6C42`);
    return { result: "OK" };
  }
  const url = `${globals.redisUrl}/set/${key}`;
  log("info", `[redis] \u5F00\u59CB\u53D1\u9001 SET \u8BF7\u6C42:`, url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${globals.redisToken}`,
        "Content-Type": "application/json"
      },
      body: serializedValue
    });
    const result = await response.json();
    globals.lastHashes[key] = currentHash;
    log("info", `[redis] \u952E ${key} \u66F4\u65B0\u6210\u529F`);
    return result;
  } catch (error) {
    log("error", `[redis] SET \u8BF7\u6C42\u5931\u8D25:`, error.message);
    log("error", "- \u9519\u8BEF\u7C7B\u578B:", error.name);
    if (error.cause) {
      log("error", "- \u7801:", error.cause.code);
      log("error", "- \u539F\u56E0:", error.cause.message);
    }
  }
}
async function runPipeline(commands) {
  const url = `${globals.redisUrl}/pipeline`;
  log("info", `[redis] \u5F00\u59CB\u53D1\u9001 PIPELINE \u8BF7\u6C42:`, url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${globals.redisToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commands)
      // commands 是一个数组，包含多个 Redis 命令
    });
    const result = await response.json();
    return result;
  } catch (error) {
    log("error", `[redis] Pipeline \u8BF7\u6C42\u5931\u8D25:`, error.message);
    log("error", "- \u9519\u8BEF\u7C7B\u578B:", error.name);
    if (error.cause) {
      log("error", "- \u7801:", error.cause.code);
      log("error", "- \u539F\u56E0:", error.cause.message);
    }
  }
}
async function updateRedisCaches() {
  try {
    log("info", "updateCaches start.");
    const commands = [];
    const updates = [];
    const variables = [
      { key: "animes", value: globals.animes },
      { key: "episodeIds", value: globals.episodeIds },
      { key: "episodeNum", value: globals.episodeNum },
      { key: "lastSelectMap", value: globals.lastSelectMap }
    ];
    for (const { key, value } of variables) {
      const serializedValue = key === "lastSelectMap" ? JSON.stringify(Object.fromEntries(value)) : JSON.stringify(value);
      const currentHash = simpleHash(serializedValue);
      if (currentHash !== globals.lastHashes[key]) {
        commands.push(["SET", key, serializedValue]);
        updates.push({ key, hash: currentHash });
      }
    }
    if (commands.length > 0) {
      log("info", `Updating ${commands.length} changed keys: ${updates.map((u) => u.key).join(", ")}`);
      const results = await runPipeline(commands);
      let successCount = 0;
      let failureCount = 0;
      if (Array.isArray(results)) {
        results.forEach((result, index) => {
          if (result && result.result === "OK") {
            successCount++;
          } else {
            failureCount++;
            log("warn", `Failed to update Redis key: ${updates[index]?.key}, result: ${JSON.stringify(result)}`);
          }
        });
      }
      if (failureCount === 0) {
        updates.forEach(({ key, hash }) => {
          globals.lastHashes[key] = hash;
        });
        log("info", `Redis update completed successfully: ${successCount} keys updated`);
      } else {
        log("warn", `Redis update partially failed: ${successCount} succeeded, ${failureCount} failed`);
      }
    } else {
      log("info", "No changes detected, skipping Redis update.");
    }
  } catch (error) {
    log("error", `updateRedisCaches failed: ${error.message}`, error.stack);
    log("error", `Error details - Name: ${error.name}, Cause: ${error.cause ? error.cause.message : "N/A"}`);
  }
}

// danmu_api/utils/common-util.js
function printFirst200Chars(data) {
  let dataToPrint;
  if (typeof data === "string") {
    dataToPrint = data;
  } else if (Array.isArray(data)) {
    dataToPrint = JSON.stringify(data);
  } else if (typeof data === "object") {
    dataToPrint = JSON.stringify(data);
  } else {
    log("error", "Unsupported data type");
    return;
  }
  log("info", dataToPrint.slice(0, 200));
}
var extractAnimeTitle = (str) => str.split("(")[0].trim();
function extractYear(animeTitle) {
  const match = animeTitle.match(/\((\d{4})\)/);
  return match ? parseInt(match[1]) : null;
}
function convertChineseNumber(chineseNumber) {
  if (/^\d+$/.test(chineseNumber)) {
    return Number(chineseNumber);
  }
  const digits = {
    // 简体
    "\u96F6": 0,
    "\u4E00": 1,
    "\u4E8C": 2,
    "\u4E09": 3,
    "\u56DB": 4,
    "\u4E94": 5,
    "\u516D": 6,
    "\u4E03": 7,
    "\u516B": 8,
    "\u4E5D": 9,
    // 繁体
    "\u58F9": 1,
    "\u8CB3": 2,
    "\u53C3": 3,
    "\u8086": 4,
    "\u4F0D": 5,
    "\u9678": 6,
    "\u67D2": 7,
    "\u634C": 8,
    "\u7396": 9
  };
  const units = {
    // 简体
    "\u5341": 10,
    "\u767E": 100,
    "\u5343": 1e3,
    // 繁体
    "\u62FE": 10,
    "\u4F70": 100,
    "\u4EDF": 1e3
  };
  let result = 0;
  let current = 0;
  let lastUnit = 1;
  for (let i = 0; i < chineseNumber.length; i++) {
    const char = chineseNumber[i];
    if (digits[char] !== void 0) {
      current = digits[char];
    } else if (units[char] !== void 0) {
      const unit = units[char];
      if (current === 0) current = 1;
      if (unit >= lastUnit) {
        result = current * unit;
      } else {
        result += current * unit;
      }
      lastUnit = unit;
      current = 0;
    }
  }
  if (current > 0) {
    result += current;
  }
  return result;
}
function normalizeSpaces(str) {
  if (!str) return "";
  return String(str).trim().replace(/\s+/g, "");
}
function strictTitleMatch(title, query) {
  if (!title || !query) return false;
  const t = normalizeSpaces(title);
  const q = normalizeSpaces(query);
  if (t === q) return true;
  const separators = [" ", "(", "\uFF08", ":", "\uFF1A", "-", "\u2014", "\xB7", "\u7B2C", "S", "s"];
  for (const sep of separators) {
    if (t.startsWith(q + sep)) return true;
  }
  return false;
}
function titleMatches(title, query) {
  if (globals.strictTitleMatch) {
    return strictTitleMatch(title, query);
  } else {
    const normalizedTitle = normalizeSpaces(title);
    const normalizedQuery = normalizeSpaces(query);
    return normalizedTitle.includes(normalizedQuery);
  }
}
function validateType(value, expectedType) {
  const fieldName = value?.constructor?.name;
  if (expectedType === "array") {
    if (!Array.isArray(value)) {
      throw new TypeError(`${value} \u5FC5\u987B\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u4F46\u4F20\u5165\u7684\u662F ${fieldName}`);
    }
  } else if (expectedType === "boolean") {
    if (typeof value !== "boolean" && typeof value !== "number") {
      throw new TypeError(`${value} \u5FC5\u987B\u662F boolean \u6216 number\uFF0C\u4F46\u4F20\u5165\u7684\u662F ${fieldName}`);
    }
  } else if (typeof value !== expectedType) {
    throw new TypeError(`${value} \u5FC5\u987B\u662F ${expectedType}\uFF0C\u4F46\u4F20\u5165\u7684\u662F ${fieldName}`);
  }
}

// danmu_api/models/dandan-model.js
var Anime = class _Anime {
  constructor({
    animeId = 111,
    bangumiId = "",
    animeTitle = "",
    type = "",
    typeDescription = "",
    imageUrl = "",
    startDate = "",
    episodeCount = 1,
    rating = 0,
    isFavorited = true,
    source = "",
    links = []
  } = {}) {
    validateType(animeId, "number");
    validateType(bangumiId, "string");
    validateType(animeTitle, "string");
    validateType(type, "string", "type");
    validateType(typeDescription, "string");
    validateType(imageUrl, "string");
    validateType(startDate, "string");
    validateType(episodeCount, "number");
    validateType(rating, "number");
    validateType(isFavorited, "boolean");
    validateType(source, "string");
    validateType(links, "array");
    this.links = links.map((linkData) => Link.fromJson(linkData));
    Object.assign(this, {
      animeId,
      bangumiId,
      animeTitle,
      type,
      typeDescription,
      imageUrl,
      startDate,
      episodeCount,
      rating,
      isFavorited,
      source
    });
  }
  // ---- 静态方法：从 JSON 创建 Anime 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    const links = (json.links || []).map((link) => Link.fromJson(link));
    return new _Anime({ ...json, links });
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return {
      ...this,
      // 将 this 中的其他属性直接展开
      links: this.links.map((link) => link.toJson())
      // 转换每个 link 为 JSON
    };
  }
};
var Link = class _Link {
  constructor({ name = "", url = "", title = "", id = 10001 } = {}) {
    validateType(name, "string");
    validateType(url, "string");
    validateType(title, "string");
    validateType(id, "number");
    Object.assign(this, { name, url, title, id });
  }
  // ---- 静态方法：从 JSON 创建 Link 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    return new _Link(json);
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return { ...this };
  }
};
var Episode = class {
  constructor({ episodeId = "", episodeTitle = "" } = {}) {
    this.episodeId = episodeId;
    this.episodeTitle = episodeTitle;
  }
};
Episode.prototype.toJson = function() {
  return {
    episodeId: this.episodeId,
    episodeTitle: this.episodeTitle
  };
};
var Season = class _Season {
  constructor({ id = "", airDate = "", name = "", episodeCount = 0 } = {}) {
    validateType(id, "string");
    validateType(airDate, "string");
    validateType(name, "string");
    validateType(episodeCount, "number");
    Object.assign(this, { id, airDate, name, episodeCount });
  }
  // ---- 静态方法：从 JSON 创建 Season 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    return new _Season(json);
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return { ...this };
  }
};
var BangumiEpisode = class _BangumiEpisode {
  constructor({
    seasonId = "",
    episodeId = 10001,
    episodeTitle = "",
    episodeNumber = "",
    airDate = ""
  } = {}) {
    validateType(seasonId, "string");
    validateType(episodeId, "number");
    validateType(episodeTitle, "string");
    validateType(episodeNumber, "string");
    validateType(airDate, "string");
    Object.assign(this, { seasonId, episodeId, episodeTitle, episodeNumber, airDate });
  }
  // ---- 静态方法：从 JSON 创建 BangumiEpisode 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    return new _BangumiEpisode(json);
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return { ...this };
  }
};
var Bangumi = class _Bangumi {
  constructor({
    animeId = 111,
    bangumiId = "",
    animeTitle = "",
    imageUrl = "",
    isOnAir = true,
    airDay = 1,
    isFavorited = true,
    rating = 0,
    type = "",
    typeDescription = "",
    seasons = [],
    episodes = []
  } = {}) {
    validateType(animeId, "number");
    validateType(bangumiId, "string");
    validateType(animeTitle, "string");
    validateType(imageUrl, "string");
    validateType(isOnAir, "boolean");
    validateType(airDay, "number");
    validateType(isFavorited, "boolean");
    validateType(rating, "number");
    validateType(type, "string");
    validateType(typeDescription, "string");
    validateType(seasons, "array");
    validateType(episodes, "array");
    const seasonInstances = seasons.map((seasonData) => Season.fromJson(seasonData));
    Object.assign(this, {
      animeId,
      bangumiId,
      animeTitle,
      imageUrl,
      isOnAir,
      airDay,
      isFavorited,
      rating,
      type,
      typeDescription,
      seasons: seasonInstances,
      episodes
    });
  }
  // ---- 静态方法：从 JSON 创建 Bangumi 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    const episodes = json.episodes.map((ep) => BangumiEpisode.fromJson(ep));
    return new _Bangumi({ ...json, episodes });
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return {
      ...this,
      seasons: this.seasons.map((season) => season.toJson()),
      // 转换每个 season 为 JSON
      episodes: this.episodes.map((ep) => ep.toJson())
      // 转换每个 episode 为 JSON
    };
  }
};
var SegmentListResponse = class _SegmentListResponse {
  constructor({ type = "", segmentList = [] } = {}) {
    validateType(type, "string");
    validateType(segmentList, "array");
    this.segmentList = segmentList.map((segmentData) => Segment.fromJson(segmentData));
    Object.assign(this, { type });
  }
  // ---- 静态方法：从 JSON 创建 SegmentListResponse 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    const segmentList = (json.segmentList || []).map((segment) => Segment.fromJson(segment));
    return new _SegmentListResponse({ ...json, segmentList });
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return {
      ...this,
      segmentList: this.segmentList.map((segment) => segment.toJson())
    };
  }
};
var Segment = class _Segment {
  constructor({ type, segment_start, segment_end, url, data, _m_h5_tk, _m_h5_tk_enc } = {}) {
    validateType(type, "string", "type");
    validateType(segment_start, "number", "segment_start");
    validateType(segment_end, "number", "segment_end");
    validateType(url, "string", "url");
    if (data !== void 0) validateType(data, "string", "data");
    if (_m_h5_tk !== void 0) validateType(_m_h5_tk, "string", "_m_h5_tk");
    if (_m_h5_tk_enc !== void 0) validateType(_m_h5_tk_enc, "string", "_m_h5_tk_enc");
    Object.assign(this, { type, segment_start, segment_end, url, data, _m_h5_tk, _m_h5_tk_enc });
  }
  // ---- 静态方法：从 JSON 创建 Segment 对象 ----
  static fromJson(json) {
    if (typeof json !== "object" || json === null) {
      throw new TypeError("fromJson \u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61");
    }
    return new _Segment(json);
  }
  // ---- 转换为纯 JSON ----
  toJson() {
    return { ...this };
  }
};

// danmu_api/utils/cache-util.js
var fs;
var path;
function isSearchCacheValid(keyword) {
  if (!globals.searchCache.has(keyword)) {
    return false;
  }
  const cached = globals.searchCache.get(keyword);
  const now = Date.now();
  const cacheAgeMinutes = (now - cached.timestamp) / (1e3 * 60);
  if (cacheAgeMinutes > globals.searchCacheMinutes) {
    globals.searchCache.delete(keyword);
    log("info", `Search cache for "${keyword}" expired after ${cacheAgeMinutes.toFixed(2)} minutes`);
    return false;
  }
  return true;
}
function getSearchCache(keyword) {
  if (isSearchCacheValid(keyword)) {
    log("info", `Using search cache for "${keyword}"`);
    return globals.searchCache.get(keyword).results;
  }
  return null;
}
function setSearchCache(keyword, results) {
  globals.searchCache.set(keyword, {
    results,
    timestamp: Date.now()
  });
  log("info", `Cached search results for "${keyword}" (${results.length} animes)`);
}
function isCommentCacheValid(videoUrl) {
  if (!globals.commentCache.has(videoUrl)) {
    return false;
  }
  const cached = globals.commentCache.get(videoUrl);
  const now = Date.now();
  const cacheAgeMinutes = (now - cached.timestamp) / (1e3 * 60);
  if (cacheAgeMinutes > globals.commentCacheMinutes) {
    globals.commentCache.delete(videoUrl);
    log("info", `Comment cache for "${videoUrl}" expired after ${cacheAgeMinutes.toFixed(2)} minutes`);
    return false;
  }
  return true;
}
function getCommentCache(videoUrl) {
  if (isCommentCacheValid(videoUrl)) {
    log("info", `Using comment cache for "${videoUrl}"`);
    return globals.commentCache.get(videoUrl).comments;
  }
  return null;
}
function setCommentCache(videoUrl, comments) {
  globals.commentCache.set(videoUrl, {
    comments,
    timestamp: Date.now()
  });
  log("info", `Cached comments for "${videoUrl}" (${comments.length} comments)`);
}
function addEpisode(url, title) {
  const existingEpisode = globals.episodeIds.find((episode) => episode.url === url && episode.title === title);
  if (existingEpisode) {
    log("info", `Episode with URL ${url} and title ${title} already exists in episodeIds, returning existing episode.`);
    return existingEpisode;
  }
  globals.episodeNum++;
  const newEpisode = { id: globals.episodeNum, url, title };
  globals.episodeIds.push(newEpisode);
  log("info", `Added to episodeIds: ${JSON.stringify(newEpisode)}`);
  return newEpisode;
}
function removeEpisodeByUrl(url) {
  const initialLength = globals.episodeIds.length;
  globals.episodeIds = globals.episodeIds.filter((episode) => episode.url !== url);
  const removedCount = initialLength - globals.episodeIds.length;
  if (removedCount > 0) {
    log("info", `Removed ${removedCount} episode(s) from episodeIds with URL: ${url}`);
    return true;
  }
  log("error", `No episode found in episodeIds with URL: ${url}`);
  return false;
}
function findUrlById(id) {
  const episode = globals.episodeIds.find((episode2) => episode2.id === id);
  if (episode) {
    log("info", `Found URL for ID ${id}: ${episode.url}`);
    return episode.url;
  }
  log("error", `No URL found for ID: ${id}`);
  return null;
}
function findTitleById(id) {
  const episode = globals.episodeIds.find((episode2) => episode2.id === id);
  if (episode) {
    log("info", `Found TITLE for ID ${id}: ${episode.title}`);
    return episode.title;
  }
  log("error", `No TITLE found for ID: ${id}`);
  return null;
}
function addAnime(anime) {
  anime = Anime.fromJson(anime);
  try {
    if (!anime.links || !Array.isArray(anime.links)) {
      log("error", `Invalid or missing links in anime: ${JSON.stringify(anime)}`);
      return false;
    }
    const newLinks = [];
    anime.links.forEach((link) => {
      if (link.url) {
        const episode = addEpisode(link.url, link.title);
        if (episode) {
          newLinks.push(episode);
        }
      } else {
        log("error", `Invalid link in anime, missing url: ${JSON.stringify(link)}`);
      }
    });
    const animeCopy = Anime.fromJson({ ...anime, links: newLinks });
    const existingAnimeIndex = globals.animes.findIndex((a) => a.animeId === anime.animeId);
    if (existingAnimeIndex !== -1) {
      globals.animes.splice(existingAnimeIndex, 1);
      log("info", `Removed old anime at index: ${existingAnimeIndex}`);
    }
    globals.animes.push(animeCopy);
    log("info", `Added anime to latest position: ${anime.animeId}`);
    if (globals.animes.length > globals.MAX_ANIMES) {
      const removeSuccess = removeEarliestAnime();
      if (!removeSuccess) {
        log("error", "Failed to remove earliest anime, but continuing");
      }
    }
    log("info", `animes: ${JSON.stringify(
      globals.animes,
      (key, value) => key === "links" ? value.length : value
    )}`);
    return true;
  } catch (error) {
    log("error", `addAnime failed: ${error.message}`);
    return false;
  }
}
function removeEarliestAnime() {
  if (globals.animes.length === 0) {
    log("error", "No animes to remove.");
    return false;
  }
  const removedAnime = globals.animes.shift();
  log("info", `Removed earliest anime: ${JSON.stringify(removedAnime)}`);
  if (removedAnime.links && Array.isArray(removedAnime.links)) {
    removedAnime.links.forEach((link) => {
      if (link.url) {
        removeEpisodeByUrl(link.url);
      }
    });
  }
  return true;
}
function storeAnimeIdsToMap(curAnimes, key) {
  const uniqueAnimeIds = /* @__PURE__ */ new Set();
  for (const anime of curAnimes) {
    uniqueAnimeIds.add(anime.animeId);
  }
  const oldValue = globals.lastSelectMap.get(key);
  const oldPrefer = oldValue?.prefer;
  const oldSource = oldValue?.source;
  if (globals.lastSelectMap.has(key)) {
    globals.lastSelectMap.delete(key);
  }
  globals.lastSelectMap.set(key, {
    animeIds: [...uniqueAnimeIds],
    ...oldPrefer !== void 0 && { prefer: oldPrefer, source: oldSource }
  });
  if (globals.lastSelectMap.size > globals.MAX_LAST_SELECT_MAP) {
    const firstKey = globals.lastSelectMap.keys().next().value;
    globals.lastSelectMap.delete(firstKey);
    log("info", `Removed earliest entry from lastSelectMap: ${firstKey}`);
  }
}
function findAnimeIdByCommentId(commentId) {
  for (const anime of globals.animes) {
    for (const link of anime.links) {
      if (link.id === commentId) {
        return [anime.animeId, anime.source];
      }
    }
  }
  return [null, null];
}
function setPreferByAnimeId(animeId, source) {
  for (const [key, value] of globals.lastSelectMap.entries()) {
    if (value.animeIds && value.animeIds.includes(animeId)) {
      value.prefer = animeId;
      value.source = source;
      globals.lastSelectMap.set(key, value);
      return key;
    }
  }
  return null;
}
function getDirname() {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  return path.join(process.cwd(), "danmu_api", "utils");
}
function writeCacheToFile(key, value) {
  const cacheFilePath = path.join(getDirname(), "..", "..", ".cache", `${key}`);
  fs.writeFileSync(cacheFilePath, JSON.stringify(value), "utf8");
}
async function updateLocalCaches() {
  try {
    log("info", "updateLocalCaches start.");
    const updates = [];
    const variables = [
      { key: "animes", value: globals.animes },
      { key: "episodeIds", value: globals.episodeIds },
      { key: "episodeNum", value: globals.episodeNum },
      { key: "lastSelectMap", value: globals.lastSelectMap }
    ];
    for (const { key, value } of variables) {
      const serializedValue = key === "lastSelectMap" ? JSON.stringify(Object.fromEntries(value)) : JSON.stringify(value);
      const currentHash = simpleHash(serializedValue);
      if (currentHash !== globals.lastHashes[key]) {
        writeCacheToFile(key, serializedValue);
        updates.push({ key, hash: currentHash });
      }
    }
    if (updates.length > 0) {
      log("info", `Updated local caches for keys: ${updates.map((u) => u.key).join(", ")}`);
      updates.forEach(({ key, hash }) => {
        globals.lastHashes[key] = hash;
      });
    } else {
      log("info", "No changes detected, skipping local cache update.");
    }
  } catch (error) {
    log("error", `updateLocalCaches failed: ${error.message}`, error.stack);
    log("error", `Error details - Name: ${error.name}, Cause: ${error.cause ? error.cause.message : "N/A"}`);
  }
}

// danmu_api/utils/zh-util.js
function charPYStr() {
  return "\u9515\u7691\u853C\u788D\u7231\u55F3\u5AD2\u7477\u66A7\u972D\u8C19\u94F5\u9E4C\u80AE\u8884\u5965\u5AAA\u9A9C\u9CCC\u575D\u7F62\u94AF\u6446\u8D25\u5457\u9881\u529E\u7ECA\u94A3\u5E2E\u7ED1\u9551\u8C24\u5265\u9971\u5B9D\u62A5\u9C8D\u9E28\u9F85\u8F88\u8D1D\u94A1\u72C8\u5907\u60EB\u9E4E\u8D32\u951B\u7EF7\u7B14\u6BD5\u6BD9\u5E01\u95ED\u835C\u54D4\u6ED7\u94CB\u7B5A\u8DF8\u8FB9\u7F16\u8D2C\u53D8\u8FA9\u8FAB\u82C4\u7F0F\u7B3E\u6807\u9AA0\u98D1\u98D9\u9556\u9573\u9CD4\u9CD6\u522B\u762A\u6FD2\u6EE8\u5BBE\u6448\u50A7\u7F24\u69DF\u6BA1\u8191\u9554\u9ACC\u9B13\u997C\u7980\u62E8\u94B5\u94C2\u9A73\u997D\u94B9\u9E41\u8865\u94B8\u8D22\u53C2\u8695\u6B8B\u60ED\u60E8\u707F\u9A96\u9EEA\u82CD\u8231\u4ED3\u6CA7\u5395\u4FA7\u518C\u6D4B\u607B\u5C42\u8BE7\u9538\u4FAA\u9497\u6400\u63BA\u8749\u998B\u8C17\u7F20\u94F2\u4EA7\u9610\u98A4\u5181\u8C04\u8C36\u8487\u5FCF\u5A75\u9AA3\u89C7\u7985\u9561\u573A\u5C1D\u957F\u507F\u80A0\u5382\u7545\u4F25\u82CC\u6005\u960A\u9CB3\u949E\u8F66\u5F7B\u7817\u5C18\u9648\u886C\u4F27\u8C0C\u6987\u789C\u9F80\u6491\u79F0\u60E9\u8BDA\u9A8B\u67A8\u67FD\u94D6\u94DB\u75F4\u8FDF\u9A70\u803B\u9F7F\u70BD\u996C\u9E31\u51B2\u51B2\u866B\u5BA0\u94F3\u7574\u8E0C\u7B79\u7EF8\u4FE6\u5E31\u96E0\u6A71\u53A8\u9504\u96CF\u7840\u50A8\u89E6\u5904\u520D\u7ECC\u8E70\u4F20\u948F\u75AE\u95EF\u521B\u6006\u9524\u7F0D\u7EAF\u9E51\u7EF0\u8F8D\u9F8A\u8F9E\u8BCD\u8D50\u9E5A\u806A\u8471\u56F1\u4ECE\u4E1B\u82C1\u9AA2\u679E\u51D1\u8F8F\u8E7F\u7A9C\u64BA\u9519\u9509\u9E7E\u8FBE\u54D2\u9791\u5E26\u8D37\u9A80\u7ED0\u62C5\u5355\u90F8\u63B8\u80C6\u60EE\u8BDE\u5F39\u6B9A\u8D55\u7605\u7BAA\u5F53\u6321\u515A\u8361\u6863\u8C20\u7800\u88C6\u6363\u5C9B\u7977\u5BFC\u76D7\u7118\u706F\u9093\u956B\u654C\u6DA4\u9012\u7F14\u7C74\u8BCB\u8C1B\u7EE8\u89CC\u955D\u98A0\u70B9\u57AB\u7535\u5DC5\u94BF\u766B\u9493\u8C03\u94EB\u9CB7\u8C0D\u53E0\u9CBD\u9489\u9876\u952D\u8BA2\u94E4\u4E22\u94E5\u4E1C\u52A8\u680B\u51BB\u5CBD\u9E2B\u7AA6\u728A\u72EC\u8BFB\u8D4C\u9540\u6E0E\u691F\u724D\u7B03\u9EE9\u953B\u65AD\u7F0E\u7C16\u5151\u961F\u5BF9\u603C\u9566\u5428\u987F\u949D\u7096\u8DB8\u593A\u5815\u94CE\u9E45\u989D\u8BB9\u6076\u997F\u8C14\u57A9\u960F\u8F6D\u9507\u9537\u9E57\u989A\u989B\u9CC4\u8BF6\u513F\u5C14\u9975\u8D30\u8FE9\u94D2\u9E38\u9C95\u53D1\u7F5A\u9600\u73D0\u77FE\u9492\u70E6\u8D29\u996D\u8BBF\u7EBA\u94AB\u9C82\u98DE\u8BFD\u5E9F\u8D39\u7EEF\u9544\u9CB1\u7EB7\u575F\u594B\u6124\u7CAA\u507E\u4E30\u67AB\u950B\u98CE\u75AF\u51AF\u7F1D\u8BBD\u51E4\u6CA3\u80A4\u8F90\u629A\u8F85\u8D4B\u590D\u8D1F\u8BA3\u5987\u7F1A\u51EB\u9A78\u7EC2\u7ECB\u8D59\u9EB8\u9C8B\u9CC6\u9486\u8BE5\u9499\u76D6\u8D45\u6746\u8D76\u79C6\u8D63\u5C34\u64C0\u7EC0\u5188\u521A\u94A2\u7EB2\u5C97\u6206\u9550\u777E\u8BF0\u7F1F\u9506\u6401\u9E3D\u9601\u94EC\u4E2A\u7EA5\u9549\u988D\u7ED9\u4E98\u8D53\u7EE0\u9CA0\u9F9A\u5BAB\u5DE9\u8D21\u94A9\u6C9F\u82DF\u6784\u8D2D\u591F\u8BDF\u7F11\u89CF\u86CA\u987E\u8BC2\u6BC2\u94B4\u9522\u9E2A\u9E44\u9E58\u5250\u6302\u9E39\u63B4\u5173\u89C2\u9986\u60EF\u8D2F\u8BD6\u63BC\u9E73\u9CCF\u5E7F\u72B7\u89C4\u5F52\u9F9F\u95FA\u8F68\u8BE1\u8D35\u523D\u5326\u523F\u59AB\u6867\u9C91\u9CDC\u8F8A\u6EDA\u886E\u7EF2\u9CA7\u9505\u56FD\u8FC7\u57DA\u5459\u5E3C\u6901\u8748\u94EA\u9A87\u97E9\u6C49\u961A\u7ED7\u9889\u53F7\u704F\u98A2\u9602\u9E64\u8D3A\u8BC3\u9616\u86CE\u6A2A\u8F70\u9E3F\u7EA2\u9EC9\u8BA7\u836D\u95F3\u9C8E\u58F6\u62A4\u6CAA\u6237\u6D52\u9E55\u54D7\u534E\u753B\u5212\u8BDD\u9A85\u6866\u94E7\u6000\u574F\u6B22\u73AF\u8FD8\u7F13\u6362\u5524\u75EA\u7115\u6DA3\u5942\u7F33\u953E\u9CA9\u9EC4\u8C0E\u9CC7\u6325\u8F89\u6BC1\u8D3F\u79FD\u4F1A\u70E9\u6C47\u8BB3\u8BF2\u7ED8\u8BD9\u835F\u54D5\u6D4D\u7F0B\u73F2\u6656\u8364\u6D51\u8BE8\u9984\u960D\u83B7\u8D27\u7978\u94AC\u956C\u51FB\u673A\u79EF\u9965\u8FF9\u8BA5\u9E21\u7EE9\u7F09\u6781\u8F91\u7EA7\u6324\u51E0\u84DF\u5242\u6D4E\u8BA1\u8BB0\u9645\u7EE7\u7EAA\u8BA6\u8BD8\u8360\u53FD\u54DC\u9AA5\u7391\u89CA\u9F51\u77F6\u7F81\u867F\u8DFB\u9701\u9C9A\u9CAB\u5939\u835A\u988A\u8D3E\u94BE\u4EF7\u9A7E\u90CF\u6D43\u94D7\u9553\u86F2\u6B7C\u76D1\u575A\u7B3A\u95F4\u8270\u7F04\u8327\u68C0\u78B1\u7877\u62E3\u6361\u7B80\u4FED\u51CF\u8350\u69DB\u9274\u8DF5\u8D31\u89C1\u952E\u8230\u5251\u996F\u6E10\u6E85\u6DA7\u8C0F\u7F23\u620B\u622C\u7751\u9E63\u7B15\u9CA3\u97AF\u5C06\u6D46\u848B\u6868\u5956\u8BB2\u9171\u7EDB\u7F30\u80F6\u6D47\u9A84\u5A07\u6405\u94F0\u77EB\u4FA5\u811A\u997A\u7F34\u7EDE\u8F7F\u8F83\u6322\u5CE4\u9E6A\u9C9B\u9636\u8282\u6D01\u7ED3\u8BEB\u5C4A\u7596\u988C\u9C92\u7D27\u9526\u4EC5\u8C28\u8FDB\u664B\u70EC\u5C3D\u52B2\u8346\u830E\u537A\u8369\u9991\u7F19\u8D46\u89D0\u9CB8\u60CA\u7ECF\u9888\u9759\u955C\u5F84\u75C9\u7ADE\u51C0\u522D\u6CFE\u8FF3\u5F2A\u80EB\u9753\u7EA0\u53A9\u65E7\u9604\u9E20\u9E6B\u9A79\u4E3E\u636E\u952F\u60E7\u5267\u8BB5\u5C66\u6989\u98D3\u949C\u9514\u7AAD\u9F83\u9E43\u7EE2\u9529\u954C\u96BD\u89C9\u51B3\u7EDD\u8C32\u73CF\u94A7\u519B\u9A8F\u76B2\u5F00\u51EF\u5240\u57B2\u5FFE\u607A\u94E0\u9534\u9F9B\u95F6\u94AA\u94D0\u9897\u58F3\u8BFE\u9A92\u7F02\u8F72\u94B6\u951E\u9894\u57A6\u6073\u9F88\u94FF\u62A0\u5E93\u88E4\u55BE\u5757\u4FA9\u90D0\u54D9\u810D\u5BBD\u72EF\u9ACB\u77FF\u65F7\u51B5\u8BD3\u8BF3\u909D\u5739\u7EA9\u8D36\u4E8F\u5CBF\u7AA5\u9988\u6E83\u532E\u8489\u6126\u8069\u7BD1\u9603\u951F\u9CB2\u6269\u9614\u86F4\u8721\u814A\u83B1\u6765\u8D56\u5D03\u5F95\u6D9E\u6FD1\u8D49\u7750\u94FC\u765E\u7C41\u84DD\u680F\u62E6\u7BEE\u9611\u5170\u6F9C\u8C30\u63FD\u89C8\u61D2\u7F06\u70C2\u6EE5\u5C9A\u6984\u6593\u9567\u8934\u7405\u9606\u9512\u635E\u52B3\u6D9D\u5520\u5D02\u94D1\u94F9\u75E8\u4E50\u9CD3\u956D\u5792\u7C7B\u6CEA\u8BD4\u7F27\u7BF1\u72F8\u79BB\u9CA4\u793C\u4E3D\u5389\u52B1\u783E\u5386\u6CA5\u96B6\u4FEA\u90E6\u575C\u82C8\u8385\u84E0\u5456\u9026\u9A8A\u7F21\u67A5\u680E\u8F79\u783A\u9502\u9E42\u75A0\u7C9D\u8DDE\u96F3\u9CA1\u9CE2\u4FE9\u8054\u83B2\u8FDE\u9570\u601C\u6D9F\u5E18\u655B\u8138\u94FE\u604B\u70BC\u7EC3\u8539\u5941\u6F4B\u740F\u6B93\u88E2\u88E3\u9CA2\u7CAE\u51C9\u4E24\u8F86\u8C05\u9B49\u7597\u8FBD\u9563\u7F2D\u948C\u9E69\u730E\u4E34\u90BB\u9CDE\u51DB\u8D41\u853A\u5EEA\u6AA9\u8F9A\u8E8F\u9F84\u94C3\u7075\u5CAD\u9886\u7EEB\u68C2\u86CF\u9CAE\u998F\u5218\u6D4F\u9A9D\u7EFA\u954F\u9E68\u9F99\u804B\u5499\u7B3C\u5784\u62E2\u9647\u830F\u6CF7\u73D1\u680A\u80E7\u783B\u697C\u5A04\u6402\u7BD3\u507B\u848C\u55BD\u5D5D\u9542\u7618\u8027\u877C\u9AC5\u82A6\u5362\u9885\u5E90\u7089\u63B3\u5364\u864F\u9C81\u8D42\u7984\u5F55\u9646\u5786\u64B8\u565C\u95FE\u6CF8\u6E0C\u680C\u6A79\u8F73\u8F82\u8F98\u6C07\u80EA\u9E2C\u9E6D\u823B\u9C88\u5CE6\u631B\u5B6A\u6EE6\u4E71\u8114\u5A08\u683E\u9E3E\u92AE\u62A1\u8F6E\u4F26\u4ED1\u6CA6\u7EB6\u8BBA\u56F5\u841D\u7F57\u903B\u9523\u7BA9\u9AA1\u9A86\u7EDC\u8366\u7321\u6CFA\u6924\u8136\u9559\u9A74\u5415\u94DD\u4FA3\u5C61\u7F15\u8651\u6EE4\u7EFF\u6988\u891B\u950A\u5452\u5988\u739B\u7801\u8682\u9A6C\u9A82\u5417\u551B\u5B37\u6769\u4E70\u9EA6\u5356\u8FC8\u8109\u52A2\u7792\u9992\u86EE\u6EE1\u8C29\u7F26\u9558\u98A1\u9CD7\u732B\u951A\u94C6\u8D38\u4E48\u6CA1\u9541\u95E8\u95F7\u4EEC\u626A\u7116\u61D1\u9494\u9530\u68A6\u772F\u8C1C\u5F25\u89C5\u5E42\u8288\u8C27\u7315\u7962\u7EF5\u7F05\u6E11\u817C\u9EFE\u5E99\u7F08\u7F2A\u706D\u60AF\u95FD\u95F5\u7F17\u9E23\u94ED\u8C2C\u8C1F\u84E6\u998D\u6B81\u9546\u8C0B\u4EA9\u94BC\u5450\u94A0\u7EB3\u96BE\u6320\u8111\u607C\u95F9\u94D9\u8BB7\u9981\u5185\u62DF\u817B\u94CC\u9CB5\u64B5\u8F87\u9CB6\u917F\u9E1F\u8311\u8885\u8042\u556E\u954A\u954D\u9667\u8616\u55EB\u989F\u8E51\u67E0\u72DE\u5B81\u62E7\u6CDE\u82CE\u549B\u804D\u94AE\u7EBD\u8113\u6D53\u519C\u4FAC\u54DD\u9A7D\u9495\u8BFA\u50A9\u759F\u6B27\u9E25\u6BB4\u5455\u6CA4\u8BB4\u6004\u74EF\u76D8\u8E52\u5E9E\u629B\u75B1\u8D54\u8F94\u55B7\u9E4F\u7EB0\u7F74\u94CD\u9A97\u8C1D\u9A88\u98D8\u7F25\u9891\u8D2B\u5AD4\u82F9\u51ED\u8BC4\u6CFC\u9887\u948B\u6251\u94FA\u6734\u8C31\u9564\u9568\u6816\u8110\u9F50\u9A91\u5C82\u542F\u6C14\u5F03\u8BAB\u8572\u9A90\u7EEE\u6864\u789B\u9880\u9883\u9CCD\u7275\u948E\u94C5\u8FC1\u7B7E\u8C26\u94B1\u94B3\u6F5C\u6D45\u8C34\u5811\u4F65\u8368\u60AD\u9A9E\u7F31\u6920\u94A4\u67AA\u545B\u5899\u8537\u5F3A\u62A2\u5AF1\u6A2F\u6217\u709D\u9516\u9535\u956A\u7F9F\u8DC4\u9539\u6865\u4E54\u4FA8\u7FD8\u7A8D\u8BEE\u8C2F\u835E\u7F32\u7857\u8DF7\u7A83\u60EC\u9532\u7BA7\u94A6\u4EB2\u5BDD\u9513\u8F7B\u6C22\u503E\u9877\u8BF7\u5E86\u63FF\u9CAD\u743C\u7A77\u8315\u86F1\u5DEF\u8D47\u866E\u9CC5\u8D8B\u533A\u8EAF\u9A71\u9F8B\u8BCE\u5C96\u9612\u89D1\u9E32\u98A7\u6743\u529D\u8BE0\u7EFB\u8F81\u94E8\u5374\u9E4A\u786E\u9615\u9619\u60AB\u8BA9\u9976\u6270\u7ED5\u835B\u5A06\u6861\u70ED\u97E7\u8BA4\u7EAB\u996A\u8F6B\u8363\u7ED2\u5D58\u877E\u7F1B\u94F7\u98A6\u8F6F\u9510\u86AC\u95F0\u6DA6\u6D12\u8428\u98D2\u9CC3\u8D5B\u4F1E\u6BF5\u7CC1\u4E27\u9A9A\u626B\u7F2B\u6DA9\u556C\u94EF\u7A51\u6740\u5239\u7EB1\u94E9\u9CA8\u7B5B\u6652\u917E\u5220\u95EA\u9655\u8D61\u7F2E\u8BAA\u59D7\u9A9F\u9490\u9CDD\u5892\u4F24\u8D4F\u57A7\u6B87\u89DE\u70E7\u7ECD\u8D4A\u6444\u6151\u8BBE\u538D\u6EE0\u7572\u7EC5\u5BA1\u5A76\u80BE\u6E17\u8BDC\u8C02\u6E16\u58F0\u7EF3\u80DC\u5E08\u72EE\u6E7F\u8BD7\u65F6\u8680\u5B9E\u8BC6\u9A76\u52BF\u9002\u91CA\u9970\u89C6\u8BD5\u8C25\u57D8\u83B3\u5F11\u8F7C\u8D33\u94C8\u9CA5\u5BFF\u517D\u7EF6\u67A2\u8F93\u4E66\u8D4E\u5C5E\u672F\u6811\u7AD6\u6570\u6445\u7EBE\u5E05\u95E9\u53CC\u8C01\u7A0E\u987A\u8BF4\u7855\u70C1\u94C4\u4E1D\u9972\u53AE\u9A77\u7F0C\u9536\u9E36\u8038\u6002\u9882\u8BBC\u8BF5\u64DE\u85AE\u998A\u98D5\u953C\u82CF\u8BC9\u8083\u8C21\u7A23\u867D\u968F\u7EE5\u5C81\u8C07\u5B59\u635F\u7B0B\u836A\u72F2\u7F29\u7410\u9501\u5522\u7743\u736D\u631E\u95FC\u94CA\u9CCE\u53F0\u6001\u949B\u9C90\u644A\u8D2A\u762B\u6EE9\u575B\u8C2D\u8C08\u53F9\u6619\u94BD\u952C\u9878\u6C64\u70EB\u50A5\u9967\u94F4\u9557\u6D9B\u7EE6\u8BA8\u97EC\u94FD\u817E\u8A8A\u9511\u9898\u4F53\u5C49\u7F07\u9E48\u9617\u6761\u7C9C\u9F86\u9CA6\u8D34\u94C1\u5385\u542C\u70C3\u94DC\u7EDF\u6078\u5934\u94AD\u79C3\u56FE\u948D\u56E2\u629F\u9893\u8715\u9968\u8131\u9E35\u9A6E\u9A7C\u692D\u7BA8\u9F0D\u889C\u5A32\u817D\u5F2F\u6E7E\u987D\u4E07\u7EA8\u7EFE\u7F51\u8F8B\u97E6\u8FDD\u56F4\u4E3A\u6F4D\u7EF4\u82C7\u4F1F\u4F2A\u7EAC\u8C13\u536B\u8BFF\u5E0F\u95F1\u6CA9\u6DA0\u73AE\u97EA\u709C\u9C94\u6E29\u95FB\u7EB9\u7A33\u95EE\u960C\u74EE\u631D\u8717\u6DA1\u7A9D\u5367\u83B4\u9F8C\u545C\u94A8\u4E4C\u8BEC\u65E0\u829C\u5434\u575E\u96FE\u52A1\u8BEF\u90AC\u5E91\u6003\u59A9\u9A9B\u9E49\u9E5C\u9521\u727A\u88AD\u4E60\u94E3\u620F\u7EC6\u9969\u960B\u73BA\u89CB\u867E\u8F96\u5CE1\u4FA0\u72ED\u53A6\u5413\u7856\u9C9C\u7EA4\u8D24\u8854\u95F2\u663E\u9669\u73B0\u732E\u53BF\u9985\u7FA1\u5BAA\u7EBF\u82CB\u83B6\u85D3\u5C98\u7303\u5A34\u9E47\u75EB\u869D\u7C7C\u8DF9\u53A2\u9576\u4E61\u8BE6\u54CD\u9879\u8297\u9977\u9AA7\u7F03\u98E8\u8427\u56A3\u9500\u6653\u5578\u54D3\u6F47\u9A81\u7EE1\u67AD\u7BAB\u534F\u631F\u643A\u80C1\u8C10\u5199\u6CFB\u8C22\u4EB5\u64B7\u7EC1\u7F2C\u950C\u8845\u5174\u9649\u8365\u51F6\u6C79\u9508\u7EE3\u9990\u9E3A\u865A\u5618\u987B\u8BB8\u53D9\u7EEA\u7EED\u8BE9\u987C\u8F69\u60AC\u9009\u7663\u7EDA\u8C16\u94C9\u955F\u5B66\u8C11\u6CF6\u9CD5\u52CB\u8BE2\u5BFB\u9A6F\u8BAD\u8BAF\u900A\u57D9\u6D54\u9C9F\u538B\u9E26\u9E2D\u54D1\u4E9A\u8BB6\u57AD\u5A05\u6860\u6C29\u9609\u70DF\u76D0\u4E25\u5CA9\u989C\u960E\u8273\u538C\u781A\u5F66\u8C1A\u9A8C\u53A3\u8D5D\u4FE8\u5156\u8C33\u6079\u95EB\u917D\u9B47\u990D\u9F39\u9E2F\u6768\u626C\u75A1\u9633\u75D2\u517B\u6837\u7080\u7476\u6447\u5C27\u9065\u7A91\u8C23\u836F\u8F7A\u9E5E\u9CD0\u7237\u9875\u4E1A\u53F6\u9765\u8C12\u90BA\u6654\u70E8\u533B\u94F1\u9890\u9057\u4EEA\u8681\u827A\u4EBF\u5FC6\u4E49\u8BE3\u8BAE\u8C0A\u8BD1\u5F02\u7ECE\u8BD2\u5453\u5CC4\u9974\u603F\u9A7F\u7F22\u8F76\u8D3B\u9487\u9552\u9571\u7617\u8223\u836B\u9634\u94F6\u996E\u9690\u94DF\u763E\u6A31\u5A74\u9E70\u5E94\u7F28\u83B9\u8424\u8425\u8367\u8747\u8D62\u9896\u8314\u83BA\u8426\u84E5\u6484\u5624\u6EE2\u6F46\u748E\u9E66\u763F\u988F\u7F42\u54DF\u62E5\u4F63\u75C8\u8E0A\u548F\u955B\u4F18\u5FE7\u90AE\u94C0\u72B9\u8BF1\u83B8\u94D5\u9C7F\u8206\u9C7C\u6E14\u5A31\u4E0E\u5C7F\u8BED\u72F1\u8A89\u9884\u9A6D\u4F1B\u4FE3\u8C00\u8C15\u84E3\u5D5B\u996B\u9608\u59AA\u7EA1\u89CE\u6B24\u94B0\u9E46\u9E6C\u9F89\u9E33\u6E0A\u8F95\u56ED\u5458\u5706\u7F18\u8FDC\u6A7C\u9E22\u9F0B\u7EA6\u8DC3\u94A5\u7CA4\u60A6\u9605\u94BA\u90E7\u5300\u9668\u8FD0\u8574\u915D\u6655\u97F5\u90D3\u82B8\u607D\u6120\u7EAD\u97EB\u6B92\u6C32\u6742\u707E\u8F7D\u6512\u6682\u8D5E\u74D2\u8DB1\u933E\u8D43\u810F\u9A75\u51FF\u67A3\u8D23\u62E9\u5219\u6CFD\u8D5C\u5567\u5E3B\u7BA6\u8D3C\u8C2E\u8D60\u7EFC\u7F2F\u8F67\u94E1\u95F8\u6805\u8BC8\u658B\u503A\u6BE1\u76CF\u65A9\u8F97\u5D2D\u6808\u6218\u7EFD\u8C35\u5F20\u6DA8\u5E10\u8D26\u80C0\u8D75\u8BCF\u948A\u86F0\u8F99\u9517\u8FD9\u8C2A\u8F84\u9E67\u8D1E\u9488\u4FA6\u8BCA\u9547\u9635\u6D48\u7F1C\u6862\u8F78\u8D48\u796F\u9E29\u6323\u7741\u72F0\u4E89\u5E27\u75C7\u90D1\u8BC1\u8BE4\u5CE5\u94B2\u94EE\u7B5D\u7EC7\u804C\u6267\u7EB8\u631A\u63B7\u5E1C\u8D28\u6EDE\u9A98\u6809\u6800\u8F75\u8F7E\u8D3D\u9E37\u86F3\u7D77\u8E2C\u8E2F\u89EF\u949F\u7EC8\u79CD\u80BF\u4F17\u953A\u8BCC\u8F74\u76B1\u663C\u9AA4\u7EA3\u7EC9\u732A\u8BF8\u8BDB\u70DB\u77A9\u5631\u8D2E\u94F8\u9A7B\u4F2B\u69E0\u94E2\u4E13\u7816\u8F6C\u8D5A\u556D\u9994\u989E\u6869\u5E84\u88C5\u5986\u58EE\u72B6\u9525\u8D58\u5760\u7F00\u9A93\u7F12\u8C06\u51C6\u7740\u6D4A\u8BFC\u956F\u5179\u8D44\u6E0D\u8C18\u7F01\u8F8E\u8D40\u7726\u9531\u9F87\u9CBB\u8E2A\u603B\u7EB5\u506C\u90B9\u8BF9\u9A7A\u9CB0\u8BC5\u7EC4\u955E\u94BB\u7F35\u8E9C\u9CDF\u7FF1\u5E76\u535C\u6C89\u4E11\u6DC0\u8FED\u6597\u8303\u5E72\u768B\u7845\u67DC\u540E\u4F19\u79F8\u6770\u8BC0\u5938\u91CC\u91CC\u51CC\u4E48\u9709\u637B\u51C4\u6266\u5723\u5C38\u62AC\u6D82\u6D3C\u5582\u6C61\u9528\u54B8\u874E\u5F5D\u6D8C\u6E38\u5401\u5FA1\u613F\u5CB3\u4E91\u7076\u624E\u672D\u7B51\u4E8E\u5FD7\u6CE8\u51CB\u8BA0\u8C2B\u90C4\u52D0\u51FC\u5742\u5785\u57B4\u57EF\u57DD\u82D8\u836C\u836E\u839C\u83BC\u83F0\u85C1\u63F8\u5412\u5423\u5494\u549D\u54B4\u5658\u567C\u56AF\u5E5E\u5C99\u5D74\u5F77\u5FBC\u72B8\u72CD\u9980\u9987\u9993\u9995\u6123\u61B7\u61D4\u4E2C\u6E86\u6EDF\u6EB7\u6F24\u6F74\u6FB9\u752F\u7E9F\u7ED4\u7EF1\u73C9\u67A7\u684A\u6849\u69D4\u6A65\u8F71\u8F77\u8D4D\u80B7\u80E8\u98DA\u7173\u7145\u7198\u610D\u6DFC\u781C\u78D9\u770D\u949A\u94B7\u94D8\u94DE\u9503\u950D\u950E\u950F\u9518\u951D\u952A\u952B\u953F\u9545\u954E\u9562\u9565\u9569\u9572\u7A06\u9E4B\u9E5B\u9E71\u75AC\u75B4\u75D6\u766F\u88E5\u8941\u8022\u98A5\u87A8\u9EB4\u9C85\u9C86\u9C87\u9C9E\u9CB4\u9CBA\u9CBC\u9CCA\u9CCB\u9CD8\u9CD9\u9792\u97B4\u9F44\u4E2C\u4E3A\u4EB8\u4F17\u4F2A\u4F59\u51A2\u51C0\u51CC\u51FC\u522C\u52CB\u52D0\u52DA\u5364\u53C6\u53C7\u542F\u5494\u54A4\u54B4\u54CC\u54D7\u551D\u5521\u5523\u553F\u556E\u5570\u5574\u5475\u567C\u56AF\u5785\u57A7\u57AF\u57B1\u57D9\u57DD\u5846\u5899\u58F8\u59AB\u59DC\u5A34\u5A73\u5C43\u5CBD\u5CC3\u5CE3\u5D04\u5D5A\u5D5B\u5D74\u5EBC\u5F5F\u5FA1\u610D\u616D\u61B7\u624E\u6266\u631C\u6326\u637B\u63F8\u65F8\u663D\u672D\u684A\u68BC\u68BE\u68C2\u69DA\u6A90\u6C61\u6C93\u6CA8\u6CA9\u6CB5\u6D49\u6D50\u6D55\u6D8C\u6DA2\u6E7F\u6E87\u6EEA\u6F24\u7145\u7173\u7198\u7266\u729F\u72CD\u72DD\u732C\u7399\u739A\u73B1\u73C9\u73CF\u73F0\u740E\u7487\u7572\u75B4\u7606\u7618\u766F\u772C\u7740\u7841\u7845\u7859\u785A\u7877\u78B9\u78D9\u794E\u79FE\u7B5C\u7B7E\u7B93\u7CC7\u7E9F\u7EAE\u7EB4\u7EBB\u7EBC\u7ED6\u7EE4\u7EE6\u7EEC\u7EF1\u7EF9\u7F0A\u7F10\u7F1E\u7F30\u7FD9\u7FDA\u80B7\u810F\u814C\u8158\u816D\u81DC\u8273\u8279\u8359\u839C\u83BC\u841A\u85C1\u866C\u8780\u87CF\u8885\u8886\u88AF\u88C8\u88E5\u8941\u8955\u89C3\u89CD\u8A5F\u8BB1\u8BBB\u8BC7\u8BD0\u8BEA\u8C1E\u8C25\u8C37\u8C6E\u8D20\u8D4D\u8D51\u8D52\u8D57\u8D5F\u8D6A\u8DD6\u8DF6\u8E0A\u8F6A\u8F80\u8F8C\u8F92\u90C1\u90C4\u9166\u9245\u9274\u948E\u9491\u9496\u9498\u94B5\u94BB\u94CF\u94DA\u94E6\u94FB\u9508\u950F\u951C\u9520\u9528\u9533\u953D\u9543\u9548\u9555\u955A\u9560\u9562\u956E\u9574\u95EC\u95F2\u95FF\u9607\u9613\u9618\u961B\u9655\u97B4\u97E8\u988B\u988E\u9892\u9895\u9899\u98A3\u98CF\u98D0\u98D4\u98D6\u98D7\u9964\u9965\u9966\u9973\u9978\u9979\u997B\u997E\u9982\u9983\u9989\u998C\u998E\u9A72\u9A83\u9A89\u9A8D\u9A8E\u9A94\u9A95\u9A99\u9AA6\u9C7D\u9C7E\u9C80\u9C84\u9C89\u9C8A\u9C8C\u9C8F\u9C93\u9C96\u9C97\u9C98\u9C99\u9C9D\u9CAA\u9CAC\u9CAF\u9CB9\u9CBE\u9CBF\u9CC0\u9CC1\u9CC2\u9CC8\u9CC9\u9CD1\u9CD2\u9CDB\u9CE0\u9CE1\u9CE3\u9E24\u9E27\u9E2E\u9E30\u9E34\u9E3B\u9E3C\u9E40\u9E47\u9E4D\u9E50\u9E52\u9E53\u9E54\u9E56\u9E5D\u9E5F\u9E60\u9E61\u9E62\u9E65\u9E6F\u9E72\u9E74\u9EE1\u9F0C\u9F17\u9F81\u9F82\u5FD7\u5236\u54A8\u53EA\u7CFB\u677E\u5C1D\u9762\u5E72\u62FC\u6076\u8D5E\u53D1\u50F5\u81F4\u5978\u83B7\u7EC3\u56DE\u7CFB\u8FF9\u53EA\u8F9F\u677F\u4F60";
}
function ftPYStr() {
  return "\u9312\u769A\u85F9\u7919\u611B\u566F\u5B21\u74A6\u66D6\u9744\u8AF3\u92A8\u9D6A\u9AAF\u8956\u5967\u5ABC\u9A41\u9C32\u58E9\u7F77\u9200\u64FA\u6557\u5504\u9812\u8FA6\u7D46\u9211\u5E6B\u7D81\u938A\u8B17\u525D\u98FD\u5BF6\u5831\u9B91\u9D07\u9F59\u8F29\u8C9D\u92C7\u72FD\u5099\u618A\u9D6F\u8CC1\u931B\u7E43\u7B46\u7562\u6583\u5E63\u9589\u84FD\u55F6\u6F77\u924D\u7BF3\u8E55\u908A\u7DE8\u8CB6\u8B8A\u8FAF\u8FAE\u8290\u7DF6\u7C69\u6A19\u9A43\u98AE\u98C6\u93E2\u9463\u9C3E\u9C49\u5225\u765F\u7015\u6FF1\u8CD3\u64EF\u5110\u7E7D\u6AB3\u6BAF\u81CF\u944C\u9AD5\u9B22\u9905\u7A1F\u64A5\u7F3D\u9251\u99C1\u9911\u9238\u9D53\u88DC\u923D\u8CA1\u53C3\u8836\u6B98\u615A\u6158\u71E6\u9A42\u9EF2\u84BC\u8259\u5009\u6EC4\u5EC1\u5074\u518A\u6E2C\u60FB\u5C64\u8A6B\u9364\u5115\u91F5\u6519\u647B\u87EC\u995E\u8B92\u7E8F\u93DF\u7522\u95E1\u986B\u56C5\u8AC2\u8B96\u8546\u61FA\u5B0B\u9A4F\u8998\u79AA\u9414\u5834\u5617\u9577\u511F\u8178\u5EE0\u66A2\u5000\u8407\u60B5\u95B6\u9BE7\u9214\u8ECA\u5FB9\u7868\u5875\u9673\u896F\u5096\u8AF6\u6AEC\u78E3\u9F54\u6490\u7A31\u61F2\u8AA0\u9A01\u68D6\u6A89\u92EE\u943A\u7661\u9072\u99B3\u6065\u9F52\u71BE\u98ED\u9D1F\u6C96\u885D\u87F2\u5BF5\u9283\u7587\u8E8A\u7C4C\u7DA2\u5114\u5E6C\u8B8E\u6AE5\u5EDA\u92E4\u96DB\u790E\u5132\u89F8\u8655\u82BB\u7D40\u8E95\u50B3\u91E7\u7621\u95D6\u5275\u6134\u9318\u7D9E\u7D14\u9D89\u7DBD\u8F1F\u9F6A\u8FAD\u8A5E\u8CDC\u9DBF\u8070\u8525\u56EA\u5F9E\u53E2\u84EF\u9A44\u6A05\u6E4A\u8F33\u8EA5\u7AC4\u651B\u932F\u92BC\u9E7A\u9054\u5660\u97C3\u5E36\u8CB8\u99D8\u7D3F\u64D4\u55AE\u9132\u64A3\u81BD\u619A\u8A95\u5F48\u6BAB\u8CE7\u7649\u7C1E\u7576\u64CB\u9EE8\u8569\u6A94\u8B9C\u78AD\u8960\u6417\u5CF6\u79B1\u5C0E\u76DC\u71FE\u71C8\u9127\u9419\u6575\u6ECC\u905E\u7DE0\u7CF4\u8A46\u8AE6\u7D88\u89BF\u93D1\u985B\u9EDE\u588A\u96FB\u5DD4\u923F\u7672\u91E3\u8ABF\u929A\u9BDB\u8ADC\u758A\u9C08\u91D8\u9802\u9320\u8A02\u92CC\u4E1F\u92A9\u6771\u52D5\u68DF\u51CD\u5D20\u9D87\u7AC7\u72A2\u7368\u8B80\u8CED\u934D\u7006\u6ADD\u7258\u7BE4\u9EF7\u935B\u65B7\u7DDE\u7C6A\u514C\u968A\u5C0D\u61DF\u9413\u5678\u9813\u920D\u71C9\u8E89\u596A\u58AE\u9438\u9D5D\u984D\u8A1B\u60E1\u9913\u8AE4\u580A\u95BC\u8EDB\u92E8\u9354\u9D9A\u984E\u9853\u9C77\u8A92\u5152\u723E\u990C\u8CB3\u9087\u927A\u9D2F\u9B9E\u767C\u7F70\u95A5\u743A\u792C\u91E9\u7169\u8CA9\u98EF\u8A2A\u7D21\u9201\u9B74\u98DB\u8AB9\u5EE2\u8CBB\u7DCB\u9428\u9BE1\u7D1B\u58B3\u596E\u61A4\u7CDE\u50E8\u8C50\u6953\u92D2\u98A8\u760B\u99AE\u7E2B\u8AF7\u9CF3\u7043\u819A\u8F3B\u64AB\u8F14\u8CE6\u5FA9\u8CA0\u8A03\u5A66\u7E1B\u9CE7\u99D9\u7D31\u7D3C\u8CFB\u9EA9\u9B92\u9C12\u91D3\u8A72\u9223\u84CB\u8CC5\u687F\u8D95\u7A08\u8D1B\u5C37\u641F\u7D3A\u5CA1\u525B\u92FC\u7DB1\u5D17\u6207\u93AC\u776A\u8AA5\u7E1E\u92EF\u64F1\u9D3F\u95A3\u927B\u500B\u7D07\u9398\u6F41\u7D66\u4E99\u8CE1\u7D86\u9BC1\u9F94\u5BAE\u978F\u8CA2\u9264\u6E9D\u830D\u69CB\u8CFC\u5920\u8A6C\u7DF1\u89AF\u8831\u9867\u8A41\u8F42\u9237\u932E\u9D23\u9D60\u9DBB\u526E\u639B\u9D30\u6451\u95DC\u89C0\u9928\u6163\u8CAB\u8A7F\u645C\u9E1B\u9C25\u5EE3\u7377\u898F\u6B78\u9F9C\u95A8\u8ECC\u8A6D\u8CB4\u528A\u532D\u528C\u5AAF\u6A9C\u9BAD\u9C56\u8F25\u6EFE\u889E\u7DC4\u9BC0\u934B\u570B\u904E\u581D\u54BC\u5E57\u69E8\u87C8\u927F\u99ED\u97D3\u6F22\u95DE\u7D4E\u9821\u865F\u705D\u9865\u95A1\u9DB4\u8CC0\u8A36\u95D4\u8823\u6A6B\u8F5F\u9D3B\u7D05\u9ECC\u8A0C\u8452\u958E\u9C5F\u58FA\u8B77\u6EEC\u6236\u6EF8\u9D98\u5629\u83EF\u756B\u5283\u8A71\u9A4A\u6A3A\u93F5\u61F7\u58DE\u6B61\u74B0\u9084\u7DE9\u63DB\u559A\u7613\u7165\u6E19\u5950\u7E6F\u9370\u9BC7\u9EC3\u8B0A\u9C09\u63EE\u8F1D\u6BC0\u8CC4\u7A62\u6703\u71F4\u532F\u8AF1\u8AA8\u7E6A\u8A7C\u8588\u5666\u6FAE\u7E62\u743F\u6689\u8477\u6E3E\u8AE2\u991B\u95BD\u7372\u8CA8\u798D\u9225\u944A\u64CA\u6A5F\u7A4D\u9951\u8DE1\u8B4F\u96DE\u7E3E\u7DDD\u6975\u8F2F\u7D1A\u64E0\u5E7E\u858A\u5291\u6FDF\u8A08\u8A18\u969B\u7E7C\u7D00\u8A10\u8A70\u85BA\u5630\u568C\u9A65\u74A3\u89AC\u9F4F\u78EF\u7F88\u8806\u8E8B\u973D\u9C6D\u9BFD\u593E\u83A2\u9830\u8CC8\u9240\u50F9\u99D5\u90DF\u6D79\u92CF\u93B5\u87EF\u6BB2\u76E3\u5805\u7B8B\u9593\u8271\u7DD8\u7E6D\u6AA2\u583F\u9E7C\u63C0\u64BF\u7C21\u5109\u6E1B\u85A6\u6ABB\u9452\u8E10\u8CE4\u898B\u9375\u8266\u528D\u991E\u6F38\u6FFA\u6F97\u8AEB\u7E11\u6214\u6229\u77BC\u9DBC\u7B67\u9C39\u97C9\u5C07\u6F3F\u8523\u69F3\u734E\u8B1B\u91AC\u7D73\u97C1\u81A0\u6F86\u9A55\u5B0C\u652A\u9278\u77EF\u50E5\u8173\u9903\u7E73\u7D5E\u8F4E\u8F03\u649F\u5DA0\u9DE6\u9BAB\u968E\u7BC0\u6F54\u7D50\u8AA1\u5C46\u7664\u981C\u9B9A\u7DCA\u9326\u50C5\u8B39\u9032\u6649\u71FC\u76E1\u52C1\u834A\u8396\u5DF9\u85CE\u9949\u7E09\u8D10\u89B2\u9BE8\u9A5A\u7D93\u9838\u975C\u93E1\u5F91\u75D9\u7AF6\u51C8\u5244\u6D87\u9015\u5F33\u811B\u975A\u7CFE\u5EC4\u820A\u9B2E\u9CE9\u9DF2\u99D2\u8209\u64DA\u92F8\u61FC\u5287\u8A4E\u5C68\u6AF8\u98B6\u9245\u92E6\u7AB6\u9F5F\u9D51\u7D79\u9308\u942B\u96CB\u89BA\u6C7A\u7D55\u8B4E\u73A8\u921E\u8ECD\u99FF\u76B8\u958B\u51F1\u5274\u584F\u613E\u6137\u93A7\u9347\u9F95\u958C\u9227\u92AC\u9846\u6BBC\u8AB2\u9A0D\u7DD9\u8EFB\u9233\u9301\u9837\u58BE\u61C7\u9F66\u93D7\u6473\u5EAB\u8932\u56B3\u584A\u5108\u9136\u5672\u81BE\u5BEC\u736A\u9AD6\u7926\u66E0\u6CC1\u8A86\u8A91\u913A\u58D9\u7E8A\u8CBA\u8667\u5DCB\u7ABA\u994B\u6F70\u5331\u8562\u6192\u8075\u7C23\u95AB\u9315\u9BE4\u64F4\u95CA\u8810\u881F\u81D8\u840A\u4F86\u8CF4\u5D0D\u5FA0\u6DF6\u7028\u8CDA\u775E\u9338\u7669\u7C5F\u85CD\u6B04\u6514\u7C43\u95CC\u862D\u703E\u8B95\u652C\u89BD\u61F6\u7E9C\u721B\u6FEB\u5D50\u6B16\u6595\u946D\u8964\u746F\u95AC\u92C3\u6488\u52DE\u6F87\u562E\u5D97\u92A0\u9412\u7646\u6A02\u9C33\u9433\u58D8\u985E\u6DDA\u8A84\u7E32\u7C6C\u8C8D\u96E2\u9BC9\u79AE\u9E97\u53B2\u52F5\u792B\u6B77\u701D\u96B8\u5137\u9148\u58E2\u85F6\u849E\u863A\u56A6\u9090\u9A6A\u7E2D\u6AEA\u6ADF\u8F62\u792A\u92F0\u9E1D\u7658\u7CF2\u8E92\u9742\u9C7A\u9C67\u5006\u806F\u84EE\u9023\u942E\u6190\u6F23\u7C3E\u6582\u81C9\u93C8\u6200\u7149\u7DF4\u861E\u5969\u7032\u7489\u6BAE\u8933\u895D\u9C31\u7CE7\u6DBC\u5169\u8F1B\u8AD2\u9B4E\u7642\u907C\u9410\u7E5A\u91D5\u9DEF\u7375\u81E8\u9130\u9C57\u51DC\u8CC3\u85FA\u5EE9\u6A81\u8F54\u8EAA\u9F61\u9234\u9748\u5DBA\u9818\u7DBE\u6B1E\u87F6\u9BEA\u993E\u5289\u700F\u9A2E\u7DB9\u93A6\u9DDA\u9F8D\u807E\u56A8\u7C60\u58DF\u650F\u96B4\u8622\u7027\u74CF\u6AF3\u6727\u7931\u6A13\u5A41\u645F\u7C0D\u50C2\u851E\u560D\u5D81\u93E4\u763A\u802C\u87BB\u9ACF\u8606\u76E7\u9871\u5EEC\u7210\u64C4\u9E75\u865C\u9B6F\u8CC2\u797F\u9304\u9678\u58DA\u64FC\u5695\u95AD\u7018\u6DE5\u6AE8\u6AD3\u8F64\u8F05\u8F46\u6C0C\u81DA\u9E15\u9DFA\u826B\u9C78\u5DD2\u6523\u5B7F\u7064\u4E82\u81E0\u5B4C\u6B12\u9E1E\u947E\u6384\u8F2A\u502B\u4F96\u6DEA\u7DB8\u8AD6\u5707\u863F\u7F85\u908F\u947C\u7C6E\u9A3E\u99F1\u7D61\u7296\u7380\u6FFC\u6B0F\u8161\u93CD\u9A62\u5442\u92C1\u4FB6\u5C62\u7E37\u616E\u6FFE\u7DA0\u6ADA\u8938\u92DD\u5638\u5ABD\u746A\u78BC\u879E\u99AC\u7F75\u55CE\u561C\u5B24\u69AA\u8CB7\u9EA5\u8CE3\u9081\u8108\u52F1\u779E\u9945\u883B\u6EFF\u8B3E\u7E35\u93DD\u9859\u9C3B\u8C93\u9328\u925A\u8CBF\u9EBC\u6C92\u9382\u9580\u60B6\u5011\u636B\u71DC\u61E3\u9346\u9333\u5922\u7787\u8B0E\u5F4C\u8993\u51AA\u7F8B\u8B10\u737C\u79B0\u7DBF\u7DEC\u6FA0\u9766\u9EFD\u5EDF\u7DF2\u7E46\u6EC5\u61AB\u95A9\u9594\u7DE1\u9CF4\u9298\u8B2C\u8B28\u9A40\u9943\u6B7F\u93CC\u8B00\u755D\u926C\u5436\u9209\u7D0D\u96E3\u6493\u8166\u60F1\u9B27\u9403\u8A25\u9912\u5167\u64EC\u81A9\u922E\u9BE2\u6506\u8F26\u9BF0\u91C0\u9CE5\u8526\u88CA\u8076\u5699\u9477\u93B3\u9689\u8617\u56C1\u9862\u8EA1\u6AB8\u7370\u5BE7\u64F0\u6FD8\u82E7\u5680\u8079\u9215\u7D10\u81BF\u6FC3\u8FB2\u5102\u5665\u99D1\u91F9\u8AFE\u513A\u7627\u6B50\u9DD7\u6BC6\u5614\u6F1A\u8B33\u616A\u750C\u76E4\u8E63\u9F90\u62CB\u76B0\u8CE0\u8F61\u5674\u9D6C\u7D15\u7F86\u9239\u9A19\u8ADE\u99E2\u98C4\u7E39\u983B\u8CA7\u5B2A\u860B\u6191\u8A55\u6F51\u9817\u91D9\u64B2\u92EA\u6A38\u8B5C\u93F7\u9420\u68F2\u81CD\u9F4A\u9A0E\u8C48\u555F\u6C23\u68C4\u8A16\u8604\u9A0F\u7DBA\u69BF\u78E7\u980E\u980F\u9C2D\u727D\u91EC\u925B\u9077\u7C3D\u8B19\u9322\u9257\u6F5B\u6DFA\u8B74\u5879\u50C9\u8541\u6173\u9A2B\u7E7E\u69E7\u9210\u69CD\u55C6\u58BB\u8594\u5F37\u6436\u5B19\u6AA3\u6227\u7197\u9306\u93D8\u93F9\u7FA5\u8E4C\u936C\u6A4B\u55AC\u50D1\u7FF9\u7AC5\u8A9A\u8B59\u854E\u7E70\u78FD\u8E7A\u7ACA\u611C\u9365\u7BCB\u6B3D\u89AA\u5BE2\u92DF\u8F15\u6C2B\u50BE\u9803\u8ACB\u6176\u64B3\u9BD6\u74CA\u7AAE\u7162\u86FA\u5DF0\u8CD5\u87E3\u9C0D\u8DA8\u5340\u8EC0\u9A45\u9F72\u8A58\u5D87\u95C3\u89B7\u9D1D\u9874\u6B0A\u52F8\u8A6E\u7DA3\u8F07\u9293\u537B\u9D72\u78BA\u95CB\u95D5\u6128\u8B93\u9952\u64FE\u7E5E\u8558\u5B08\u6A48\u71B1\u97CC\u8A8D\u7D09\u98EA\u8ED4\u69AE\u7D68\u5DB8\u8811\u7E1F\u92A3\u9870\u8EDF\u92B3\u8706\u958F\u6F64\u7051\u85A9\u98AF\u9C13\u8CFD\u5098\u6BFF\u7CDD\u55AA\u9A37\u6383\u7E45\u6F80\u55C7\u92AB\u7A61\u6BBA\u524E\u7D17\u93A9\u9BCA\u7BE9\u66EC\u91C3\u522A\u9583\u965C\u8D0D\u7E55\u8A15\u59CD\u9A38\u91E4\u9C54\u5891\u50B7\u8CDE\u5770\u6BA4\u89F4\u71D2\u7D39\u8CD2\u651D\u61FE\u8A2D\u5399\u7044\u756C\u7D33\u5BE9\u5B38\u814E\u6EF2\u8A75\u8AD7\u700B\u8072\u7E69\u52DD\u5E2B\u7345\u6FD5\u8A69\u6642\u8755\u5BE6\u8B58\u99DB\u52E2\u9069\u91CB\u98FE\u8996\u8A66\u8B1A\u5852\u8494\u5F12\u8EFE\u8CB0\u9230\u9C23\u58FD\u7378\u7DAC\u6A1E\u8F38\u66F8\u8D16\u5C6C\u8853\u6A39\u8C4E\u6578\u6504\u7D13\u5E25\u9582\u96D9\u8AB0\u7A05\u9806\u8AAA\u78A9\u720D\u9460\u7D72\u98FC\u5EDD\u99DF\u7DE6\u9376\u9DE5\u8073\u616B\u980C\u8A1F\u8AA6\u64FB\u85EA\u993F\u98BC\u93AA\u8607\u8A34\u8085\u8B16\u7A4C\u96D6\u96A8\u7D8F\u6B72\u8AB6\u5B6B\u640D\u7B4D\u84C0\u733B\u7E2E\u7463\u9396\u55E9\u8127\u737A\u64BB\u95E5\u9248\u9C28\u81FA\u614B\u9226\u9B90\u6524\u8CAA\u7671\u7058\u58C7\u8B5A\u8AC7\u5606\u66C7\u926D\u931F\u9807\u6E6F\u71D9\u513B\u9933\u940B\u93DC\u6FE4\u7D73\u8A0E\u97DC\u92F1\u9A30\u8B04\u92BB\u984C\u9AD4\u5C5C\u7DF9\u9D5C\u95D0\u689D\u7CF6\u9F60\u9C37\u8CBC\u9435\u5EF3\u807D\u70F4\u9285\u7D71\u615F\u982D\u9204\u79BF\u5716\u91F7\u5718\u6476\u9839\u86FB\u98E9\u812B\u9D15\u99B1\u99DD\u6A62\u7C5C\u9F09\u896A\u5AA7\u8183\u5F4E\u7063\u9811\u842C\u7D08\u7DB0\u7DB2\u8F1E\u97CB\u9055\u570D\u70BA\u6FF0\u7DAD\u8466\u5049\u507D\u7DEF\u8B02\u885B\u8AC9\u5E43\u95C8\u6E88\u6F7F\u744B\u97D9\u7152\u9BAA\u6EAB\u805E\u7D0B\u7A69\u554F\u95BF\u7515\u64BE\u8778\u6E26\u7AA9\u81E5\u8435\u9F77\u55DA\u93A2\u70CF\u8AA3\u7121\u856A\u5433\u5862\u9727\u52D9\u8AA4\u9114\u5EE1\u61AE\u5AF5\u9A16\u9D61\u9DA9\u932B\u72A7\u8972\u7FD2\u9291\u6232\u7D30\u993C\u9B29\u74BD\u89A1\u8766\u8F44\u5CFD\u4FE0\u72F9\u5EC8\u5687\u7864\u9BAE\u7E96\u8CE2\u929C\u9591\u986F\u96AA\u73FE\u737B\u7E23\u9921\u7FA8\u61B2\u7DDA\u83A7\u859F\u861A\u5CF4\u736B\u5AFB\u9DF4\u7647\u8814\u79C8\u8E9A\u5EC2\u9472\u9109\u8A73\u97FF\u9805\u858C\u9909\u9A64\u7DD7\u9957\u856D\u56C2\u92B7\u66C9\u562F\u5635\u701F\u9A4D\u7D83\u689F\u7C2B\u5354\u633E\u651C\u8105\u8AE7\u5BEB\u7009\u8B1D\u893B\u64F7\u7D32\u7E88\u92C5\u91C1\u8208\u9658\u6ECE\u5147\u6D36\u92B9\u7E61\u9948\u9D42\u865B\u5653\u9808\u8A31\u6558\u7DD2\u7E8C\u8A61\u980A\u8ED2\u61F8\u9078\u766C\u7D62\u8AFC\u9249\u93C7\u5B78\u8B14\u6FA9\u9C48\u52DB\u8A62\u5C0B\u99B4\u8A13\u8A0A\u905C\u5864\u6F6F\u9C58\u58D3\u9D09\u9D28\u555E\u4E9E\u8A1D\u57E1\u5A6D\u690F\u6C2C\u95B9\u7159\u9E7D\u56B4\u5DD6\u984F\u95BB\u8277\u53AD\u786F\u5F65\u8AFA\u9A57\u53B4\u8D17\u513C\u5157\u8B9E\u61E8\u9586\u91C5\u9B58\u995C\u9F34\u9D26\u694A\u63DA\u760D\u967D\u7662\u990A\u6A23\u716C\u7464\u6416\u582F\u9059\u7AAF\u8B20\u85E5\u8EFA\u9DC2\u9C29\u723A\u9801\u696D\u8449\u9768\u8B01\u9134\u66C4\u71C1\u91AB\u92A5\u9824\u907A\u5100\u87FB\u85DD\u5104\u61B6\u7FA9\u8A63\u8B70\u8ABC\u8B6F\u7570\u7E79\u8A52\u56C8\u5DA7\u98F4\u61CC\u9A5B\u7E0A\u8EFC\u8CBD\u91D4\u93B0\u943F\u761E\u8264\u852D\u9670\u9280\u98F2\u96B1\u92A6\u766E\u6AFB\u5B30\u9DF9\u61C9\u7E93\u7469\u87A2\u71DF\u7192\u8805\u8D0F\u7A4E\u584B\u9DAF\u7E08\u93A3\u6516\u56B6\u7005\u7020\u74D4\u9E1A\u766D\u9826\u7F4C\u55B2\u64C1\u50AD\u7670\u8E34\u8A60\u93DE\u512A\u6182\u90F5\u923E\u7336\u8A98\u8555\u92AA\u9B77\u8F3F\u9B5A\u6F01\u5A1B\u8207\u5DBC\u8A9E\u7344\u8B7D\u9810\u99AD\u50B4\u4FC1\u8ADB\u8AED\u8577\u5D33\u98EB\u95BE\u5AD7\u7D06\u89A6\u6B5F\u923A\u9D52\u9DF8\u9F6C\u9D1B\u6DF5\u8F45\u5712\u54E1\u5713\u7DE3\u9060\u6ADE\u9CF6\u9EFF\u7D04\u8E8D\u9470\u7CB5\u6085\u95B1\u925E\u9116\u52FB\u9695\u904B\u860A\u919E\u6688\u97FB\u9106\u8553\u60F2\u614D\u7D1C\u97DE\u6B9E\u6C33\u96DC\u707D\u8F09\u6522\u66AB\u8D0A\u74DA\u8DB2\u93E8\u8D13\u81DF\u99D4\u947F\u68D7\u8CAC\u64C7\u5247\u6FA4\u8CFE\u5616\u5E58\u7C00\u8CCA\u8B56\u8D08\u7D9C\u7E52\u8ECB\u9358\u9598\u67F5\u8A50\u9F4B\u50B5\u6C08\u76DE\u65AC\u8F3E\u5D84\u68E7\u6230\u7DBB\u8B6B\u5F35\u6F32\u5E33\u8CEC\u8139\u8D99\u8A54\u91D7\u87C4\u8F4D\u937A\u9019\u8B2B\u8F12\u9DD3\u8C9E\u91DD\u5075\u8A3A\u93AE\u9663\u6E5E\u7E1D\u6968\u8EEB\u8CD1\u798E\u9D06\u6399\u775C\u7319\u722D\u5E40\u7665\u912D\u8B49\u8ACD\u5D22\u9266\u931A\u7B8F\u7E54\u8077\u57F7\u7D19\u646F\u64F2\u5E5F\u8CEA\u6EEF\u9A2D\u6ADB\u6894\u8EF9\u8F0A\u8D04\u9DD9\u8784\u7E36\u8E93\u8E91\u89F6\u9418\u7D42\u7A2E\u816B\u773E\u937E\u8B05\u8EF8\u76BA\u665D\u9A5F\u7D02\u7E10\u8C6C\u8AF8\u8A85\u71ED\u77DA\u56D1\u8CAF\u9444\u99D0\u4F47\u6AE7\u9296\u5C08\u78DA\u8F49\u8CFA\u56C0\u994C\u9873\u6A01\u838A\u88DD\u599D\u58EF\u72C0\u9310\u8D05\u589C\u7DB4\u9A05\u7E0B\u8AC4\u6E96\u8457\u6FC1\u8AD1\u9432\u8332\u8CC7\u6F2C\u8AEE\u7DC7\u8F1C\u8CB2\u7725\u9319\u9F5C\u9BD4\u8E64\u7E3D\u7E31\u50AF\u9112\u8ACF\u9A36\u9BEB\u8A5B\u7D44\u93C3\u9246\u7E98\u8EA6\u9C52\u7FFA\u4E26\u8514\u6C88\u919C\u6FB1\u53E0\u9B25\u7BC4\u5E79\u81EF\u77FD\u6AC3\u5F8C\u5925\u7A2D\u5091\u8A23\u8A87\u88E1\u88CF\u6DE9\u9EBD\u9EF4\u649A\u6DD2\u6261\u8056\u5C4D\u64E1\u5857\u7AAA\u9935\u6C59\u9341\u9E79\u880D\u5F5C\u6E67\u904A\u7C72\u79A6\u9858\u5DBD\u96F2\u7AC8\u7D2E\u5284\u7BC9\u65BC\u8A8C\u8A3B\u96D5\u8A01\u8B7E\u90E4\u731B\u6C39\u962A\u58DF\u5816\u57B5\u588A\u6ABE\u8552\u8464\u84E7\u8493\u83C7\u69C1\u6463\u54A4\u551A\u54E2\u565D\u5645\u6485\u5288\u8B14\u8946\u5DB4\u810A\u4EFF\u50E5\u7341\u9E85\u9918\u9937\u994A\u9962\u695E\u6035\u61CD\u723F\u6F35\u7069\u6DF7\u6FEB\u7026\u6DE1\u5BE7\u7CF8\u7D5D\u7DD4\u7449\u6898\u68EC\u6848\u6A70\u6AEB\u8EF2\u8EE4\u8CEB\u8181\u8156\u98C8\u7CCA\u7146\u6E9C\u6E63\u6E3A\u78B8\u6EFE\u7798\u9208\u9255\u92E3\u92B1\u92E5\u92F6\u9426\u9427\u9369\u9340\u9343\u9307\u9384\u9387\u93BF\u941D\u9465\u9479\u9454\u7A6D\u9D93\u9DA5\u9E0C\u7667\u5C59\u7602\u81D2\u8947\u7E48\u802E\u986C\u87CE\u9EAF\u9B81\u9B83\u9B8E\u9BD7\u9BDD\u9BF4\u9C5D\u9BFF\u9C20\u9C35\u9C45\u97BD\u97DD\u9F47\u4E2C\u7232\u56B2\u8846\u50DE\u9918\u51A2\u6DE8\u51CC\u51FC\u5257\u52F3\u52D0\u52E9\u6EF7\u9749\u9746\u5553\u5494\u5412\u54B4\u54CC\u8B41\u55CA\u5562\u5523\u553F\u9F67\u56C9\u563D\u5475\u567C\u56AF\u58E0\u57A7\u58B6\u58CB\u58CE\u57DD\u58EA\u7246\u58FC\u5B00\u59DC\u5AFA\u5AFF\u5C53\u5D2C\u5DA8\u5DA2\u5DAE\u5D94\u5D5B\u5D74\u5ECE\u5F60\u5FA1\u610D\u6196\u61B7\u624E\u6266\u6397\u648F\u637B\u63F8\u6698\u66E8\u672D\u684A\u6AAE\u68F6\u6AFA\u6A9F\u6A90\u6C61\u6C93\u6E22\u6F59\u6CB5\u6EAE\u6EFB\u6FDC\u6D8C\u6EB3\u6EBC\u6F0A\u6FA6\u6F24\u7145\u7173\u7198\u729B\u729F\u72CD\u736E\u875F\u74B5\u7452\u7472\u73C9\u73CF\u74AB\u74A1\u7487\u7572\u75FE\u762E\u763B\u766F\u77D3\u7740\u785C\u7845\u78D1\u7904\u7906\u78B9\u78D9\u7995\u7A60\u7C39\u7C64\u7C59\u9931\u7CF9\u7D18\u7D1D\u7D35\u7D16\u7D70\u7D8C\u7D5B\u7DD3\u979D\u7DAF\u7E15\u7DDA\u7E17\u7E6E\u7FFD\u7FEC\u80B7\u9AD2\u9183\u8195\u9F76\u81E2\u8C54\u8279\u8598\u839C\u84F4\u8600\u85C1\u866F\u87BF\u8828\u5ACB\u8918\u894F\u890C\u8949\u8941\u8974\u898E\u89A5\u8B8B\u8A12\u8A29\u8A57\u8A56\u8B78\u8ADD\u8AE1\u8C37\u8C76\u8C9F\u9F4E\u8D14\u8CD9\u8CF5\u8D07\u8D6C\u8DD6\u8E82\u8E0A\u8ED1\u8F08\u8F2C\u8F40\u9B31\u90C4\u91B1\u9245\u9451\u91FA\u9212\u935A\u9203\u9262\u947D\u9276\u928D\u929B\u92D9\u93FD\u9417\u9321\u9329\u6774\u9348\u9360\u93A1\u939B\u9394\u93F0\u93D0\u9481\u9436\u945E\u9588\u9592\u95D3\u95CD\u95E0\u95D2\u95E4\u965D\u97B4\u97CD\u9832\u71B2\u982E\u9834\u9852\u7E87\u98BA\u98AD\u98B8\u98BB\u98C0\u98E3\u98E2\u98E5\u98FF\u9904\u990E\u990F\u9916\u9915\u991C\u9936\u9941\u993A\u99B9\u99F0\u9A6B\u9A02\u99F8\u9A0C\u9A4C\u9A24\u9A66\u9B5B\u9B62\u9B68\u9B7A\u9B8B\u9B93\u9B8A\u9B8D\u9BB3\u9BA6\u9C02\u9B9C\u9C60\u9BBA\u9BB6\u9BD2\u9BD5\u9C3A\u9C0F\u9C68\u9BF7\u9C2E\u9C03\u9C01\u9C42\u9C1F\u9C1C\u9C3C\u9C6F\u9C64\u9C63\u9CF2\u9DAC\u9D1E\u9D12\u9DFD\u9D34\u9D43\u9D50\u9DF3\u9D7E\u9D6E\u9D8A\u9D77\u9DEB\u9DA1\u9DCA\u9DB2\u9DB9\u9DBA\u9DC1\u9DD6\u9E07\u9E0F\u9E18\u9EF6\u9F02\u9780\u9F55\u9F57\u5FD7\u5236\u8AEE\u53EA\u7CFB\u9B06\u5690\u9762\u4E7E\u62FC\u5641\u8B9A\u9AEE\u6BAD\u7DFB\u59E6\u7A6B\u934A\u8FF4\u4FC2\u8E5F\u96BB\u95E2\u95C6\u59B3";
}
function traditionalized(cc) {
  let str = "";
  for (let i = 0; i < cc.length; i++) {
    if (charPYStr().indexOf(cc.charAt(i)) != -1)
      str += ftPYStr().charAt(charPYStr().indexOf(cc.charAt(i)));
    else
      str += cc.charAt(i);
  }
  return str;
}
function simplized(cc) {
  let str = "";
  for (let i = 0; i < cc.length; i++) {
    if (ftPYStr().indexOf(cc.charAt(i)) != -1)
      str += charPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)));
    else
      str += cc.charAt(i);
  }
  return str;
}
function isNonChinese(str) {
  const chineseRegex = /[\u4e00-\u9fff]/;
  return !chineseRegex.test(str);
}

// danmu_api/utils/danmu-util.js
function groupDanmusByMinute(filteredDanmus, n) {
  let sourceCount = 1;
  if (filteredDanmus.length > 0 && filteredDanmus[0].p) {
    const pStr = filteredDanmus[0].p;
    const match = pStr.match(/\[([^\]]*)\]$/);
    if (match && match[1]) {
      sourceCount = match[1].split(/[&＆]/).length;
    }
  }
  if (sourceCount > 1) {
    log("info", `[Smart Deduplication] Detected multi-source merged danmaku (${sourceCount} sources). Applying smart count adjustment.`);
  }
  if (n === 0 && sourceCount === 1) {
    return filteredDanmus.map((danmu) => ({
      ...danmu,
      t: danmu.t !== void 0 ? danmu.t : parseFloat(danmu.p.split(",")[0])
    }));
  }
  const groupedByTime = filteredDanmus.reduce((acc, danmu) => {
    const time = danmu.t !== void 0 ? danmu.t : parseFloat(danmu.p.split(",")[0]);
    const groupKey = n === 0 ? time.toFixed(2) : Math.floor(time / (n * 60));
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push({ ...danmu, t: time });
    return acc;
  }, {});
  const result = Object.keys(groupedByTime).map((key) => {
    const danmus = groupedByTime[key];
    const groupedByMessage = danmus.reduce((acc, danmu) => {
      const message = danmu.m.split(" X")[0].trim();
      if (!acc[message]) {
        acc[message] = {
          count: 0,
          earliestT: danmu.t,
          cid: danmu.cid,
          p: danmu.p
        };
      }
      acc[message].count += 1;
      acc[message].earliestT = Math.min(acc[message].earliestT, danmu.t);
      return acc;
    }, {});
    return Object.keys(groupedByMessage).map((message) => {
      const data = groupedByMessage[message];
      let displayCount = Math.round(data.count / sourceCount);
      if (displayCount < 1) displayCount = 1;
      return {
        cid: data.cid,
        p: data.p,
        // 仅当计算后的逻辑计数大于1时才显示 "x N"
        m: displayCount > 1 ? `${message} x ${displayCount}` : message,
        t: data.earliestT
      };
    });
  });
  return result.flat().sort((a, b) => a.t - b.t);
}
function limitDanmusByCount(filteredDanmus, danmuLimit) {
  if (danmuLimit === 0) {
    return filteredDanmus;
  }
  const targetCount = danmuLimit * 1e3;
  const totalCount = filteredDanmus.length;
  if (totalCount <= targetCount) {
    return filteredDanmus;
  }
  const interval = totalCount / targetCount;
  const result = [];
  for (let i = 0; i < targetCount; i++) {
    const index = Math.floor(i * interval);
    result.push(filteredDanmus[index]);
  }
  return result;
}
function convertToDanmakuJson(contents, platform) {
  let danmus = [];
  let cidCounter = 1;
  let items = [];
  if (typeof contents === "string") {
    items = [...contents.matchAll(/<d p="([^"]+)">([^<]+)<\/d>/g)].map((match) => ({
      p: match[1],
      m: match[2]
    }));
  } else if (contents && Array.isArray(contents.danmuku)) {
    const typeMap2 = { right: 1, top: 4, bottom: 5 };
    const hexToDecimal = (hex) => hex ? parseInt(hex.replace("#", ""), 16) : 16777215;
    items = contents.danmuku.map((item) => ({
      timepoint: item[0],
      ct: typeMap2[item[1]] !== void 0 ? typeMap2[item[1]] : 1,
      color: hexToDecimal(item[2]),
      content: item[4]
    }));
  } else if (Array.isArray(contents)) {
    items = contents;
  }
  if (!items.length) {
    return [];
  }
  for (const item of items) {
    let attributes, m;
    let time, mode, color;
    if ("progress" in item && "mode" in item && "content" in item) {
      time = (item.progress / 1e3).toFixed(2);
      mode = item.mode || 1;
      color = item.color || 16777215;
      m = item.content;
    } else if ("timepoint" in item) {
      time = parseFloat(item.timepoint).toFixed(2);
      mode = item.ct || 0;
      color = item.color || 16777215;
      m = item.content;
    } else {
      if (!("p" in item)) {
        continue;
      }
      const pValues = item.p.split(",");
      time = parseFloat(pValues[0]).toFixed(2);
      mode = pValues[1] || 0;
      if (pValues.length === 4) {
        color = pValues[2] || 16777215;
      } else if (pValues.length >= 8) {
        color = pValues[3] || 16777215;
      } else {
        color = pValues[3] || pValues[2] || 16777215;
      }
      m = item.m;
    }
    attributes = [
      time,
      mode,
      color,
      `[${platform}]`
    ].join(",");
    danmus.push({ p: attributes, m, cid: cidCounter++ });
  }
  const regexArray = globals.blockedWords.split(/(?<=\/),(?=\/)/).map((str) => {
    const pattern = str.trim();
    if (pattern.startsWith("/") && pattern.endsWith("/")) {
      try {
        return new RegExp(pattern.slice(1, -1));
      } catch (e) {
        log("error", `\u65E0\u6548\u7684\u6B63\u5219\u8868\u8FBE\u5F0F: ${pattern}`, e);
        return null;
      }
    }
    return null;
  }).filter((regex) => regex !== null);
  log("info", `\u539F\u59CB\u5C4F\u853D\u8BCD\u5B57\u7B26\u4E32: ${globals.blockedWords}`);
  const regexArrayToString = (array) => Array.isArray(array) ? array.map((regex) => regex.toString()).join("\n") : String(array);
  log("info", `\u5C4F\u853D\u8BCD\u5217\u8868: ${regexArrayToString(regexArray)}`);
  const filteredDanmus = danmus.filter((item) => {
    return !regexArray.some((regex) => regex.test(item.m));
  });
  log("info", `\u53BB\u91CD\u5206\u949F\u6570: ${globals.groupMinute}`);
  const groupedDanmus = groupDanmusByMinute(filteredDanmus, globals.groupMinute);
  let convertedDanmus = limitDanmusByCount(groupedDanmus, globals.danmuLimit);
  if (globals.convertTopBottomToScroll || globals.convertColor === "white" || globals.convertColor === "color") {
    let topBottomCount = 0;
    let colorCount = 0;
    convertedDanmus = convertedDanmus.map((danmu) => {
      const pValues = danmu.p.split(",");
      if (pValues.length < 3) return danmu;
      let mode = parseInt(pValues[1], 10);
      let color = parseInt(pValues[2], 10);
      let modified = false;
      if (globals.convertTopBottomToScroll && (mode === 4 || mode === 5)) {
        topBottomCount++;
        mode = 1;
        modified = true;
      }
      if (globals.convertColor === "white" && color !== 16777215) {
        colorCount++;
        color = 16777215;
        modified = true;
      }
      let colors = [
        16777215,
        16777215,
        16777215,
        16777215,
        16777215,
        16777215,
        16777215,
        16777215,
        16744319,
        16752762,
        16774799,
        9498256,
        8388564,
        8900346,
        14204888,
        16758465
      ];
      let randomColor = colors[Math.floor(Math.random() * colors.length)];
      if (globals.convertColor === "color" && color === 16777215 && color !== randomColor) {
        colorCount++;
        color = randomColor;
        modified = true;
      }
      if (modified) {
        const newP = [pValues[0], mode, color, ...pValues.slice(3)].join(",");
        return { ...danmu, p: newP };
      }
      return danmu;
    });
    if (topBottomCount > 0) {
      log("info", `[danmu convert] \u8F6C\u6362\u4E86 ${topBottomCount} \u6761\u9876\u90E8/\u5E95\u90E8\u5F39\u5E55\u4E3A\u6D6E\u52A8\u5F39\u5E55`);
    }
    if (colorCount > 0) {
      log("info", `[danmu convert] \u8F6C\u6362\u4E86 ${colorCount} \u6761\u5F39\u5E55\u989C\u8272`);
    }
  }
  if (globals.danmuSimplifiedTraditional === "traditional") {
    convertedDanmus = convertedDanmus.map((danmu) => ({
      ...danmu,
      m: traditionalized(danmu.m)
    }));
    log("info", `[danmu convert] \u8F6C\u6362\u4E86 ${convertedDanmus.length} \u6761\u5F39\u5E55\u4E3A\u7E41\u4F53\u5B57`);
  }
  log("info", `danmus_original: ${danmus.length}`);
  log("info", `danmus_filter: ${filteredDanmus.length}`);
  log("info", `danmus_group: ${groupedDanmus.length}`);
  log("info", `danmus_limit: ${convertedDanmus.length}`);
  log("info", "Top 5 danmus:", JSON.stringify(convertedDanmus.slice(0, 5), null, 2));
  return convertedDanmus;
}
function rgbToInt(color) {
  if (typeof color.r !== "number" || color.r < 0 || color.r > 255 || typeof color.g !== "number" || color.g < 0 || color.g > 255 || typeof color.b !== "number" || color.b < 0 || color.b > 255) {
    return -1;
  }
  return color.r * 256 * 256 + color.g * 256 + color.b;
}
function convertDanmuToXml(danmuData) {
  let xml = '<?xml version="1.0" ?>\n';
  xml += "<i>\n";
  const comments = danmuData.comments || [];
  if (Array.isArray(comments)) {
    for (const comment of comments) {
      const pValue = buildBilibiliDanmuP(comment);
      xml += '    <d p="' + escapeXmlAttr(pValue) + '">' + escapeXmlText(comment.m) + "</d>\n";
    }
  }
  xml += "</i>";
  return xml;
}
function generateDanmuId() {
  const timestamp = Date.now();
  const lastEightDigits = (timestamp % 1e8).toString().padStart(8, "0");
  const randomThreeDigits = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
  return lastEightDigits + randomThreeDigits;
}
function buildBilibiliDanmuP(comment) {
  const pValues = comment.p.split(",");
  const timeNum = parseFloat(pValues[0]) || 0;
  const time = timeNum.toFixed(1);
  const mode = pValues[1] || "1";
  const fontSize = "25";
  const color = pValues[2] || "16777215";
  const timestamp = "1751533608";
  const pool = "0";
  const userHash = "0";
  const danmuId = generateDanmuId();
  return `${time},${mode},${fontSize},${color},${timestamp},${pool},${userHash},${danmuId}`;
}
function escapeXmlAttr(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function escapeXmlText(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function formatDanmuResponse(danmuData, queryFormat) {
  let format = queryFormat || globals.danmuOutputFormat;
  format = format.toLowerCase();
  log("info", `[Format] Using format: ${format}`);
  if (format === "xml") {
    try {
      const xmlData = convertDanmuToXml(danmuData);
      return xmlResponse(xmlData);
    } catch (error) {
      log("error", `Failed to convert to XML: ${error.message}`);
      return jsonResponse(danmuData);
    }
  }
  return jsonResponse(danmuData);
}

// danmu_api/utils/tmdb-util.js
var TMDB_PENDING = /* @__PURE__ */ new Map();
async function tmdbApiGet(url, options = {}) {
  const tmdbApi = "https://api.tmdb.org/3/";
  const tartgetUrl = `${tmdbApi}${url}`;
  const nextUrl = globals.makeProxyUrl(tartgetUrl);
  try {
    const response = await Widget.http.get(nextUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      signal: options.signal
      // 透传中断信号
    });
    if (response.status != 200) return null;
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    log("error", "[TMDB] Api error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return null;
  }
}
async function searchTmdbTitles(title, mediaType = "multi", options = {}) {
  const {
    page = 1,
    // 起始页码
    maxPages = 3,
    // 最多获取几页结果
    signal = null
    // 中断信号
  } = options;
  if (options.page !== void 0) {
    const url = `search/${mediaType}?api_key=${globals.tmdbApiKey}&query=${encodeURIComponent(title)}&language=zh-CN&page=${page}`;
    return await tmdbApiGet(url, { signal });
  }
  const allResults = [];
  for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
    if (signal && signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const url = `search/${mediaType}?api_key=${globals.tmdbApiKey}&query=${encodeURIComponent(title)}&language=zh-CN&page=${currentPage}`;
    const response = await tmdbApiGet(url, { signal });
    if (!response || !response.data) {
      break;
    }
    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    if (!data.results || data.results.length === 0) {
      break;
    }
    allResults.push(...data.results);
    if (data.results.length < 20) {
      break;
    }
  }
  log("info", `[TMDB] \u5171\u83B7\u53D6\u5230 ${allResults.length} \u6761\u641C\u7D22\u7ED3\u679C\uFF08\u6700\u591A${maxPages}\u9875\uFF09`);
  return {
    data: {
      results: allResults
    },
    status: 200
  };
}
async function getTmdbJpDetail(mediaType, tmdbId, options = {}) {
  const url = `${mediaType}/${tmdbId}?api_key=${globals.tmdbApiKey}&language=ja-JP`;
  return await tmdbApiGet(url, options);
}
async function getTmdbExternalIds(mediaType, tmdbId, options = {}) {
  const url = `${mediaType}/${tmdbId}/external_ids?api_key=${globals.tmdbApiKey}`;
  return await tmdbApiGet(url, options);
}
async function getTmdbAlternativeTitles(mediaType, tmdbId, options = {}) {
  const url = `${mediaType}/${tmdbId}/alternative_titles?api_key=${globals.tmdbApiKey}`;
  return await tmdbApiGet(url, options);
}
function extractChineseTitleFromAlternatives(altData, mediaType) {
  if (!altData || !altData.data) return null;
  const titles = altData.data.results || altData.data.titles || [];
  if (!Array.isArray(titles) || titles.length === 0) {
    return null;
  }
  const priorityRegions = ["CN", "TW", "HK", "SG"];
  for (const region of priorityRegions) {
    const match = titles.find((t) => {
      const iso = t.iso_3166_1 || t.iso_639_1;
      const title = t.title || t.name || "";
      return iso === region && title && !isNonChinese(title);
    });
    if (match) {
      const chineseTitle = match.title || match.name;
      log("info", `[TMDB] \u4ECE\u522B\u540D\u4E2D\u627E\u5230\u4E2D\u6587\u6807\u9898 (${region}): ${chineseTitle}`);
      return chineseTitle;
    }
  }
  const anyChineseTitle = titles.find((t) => {
    const title = t.title || t.name || "";
    return title && !isNonChinese(title);
  });
  if (anyChineseTitle) {
    const title = anyChineseTitle.title || anyChineseTitle.name;
    log("info", `[TMDB] \u4ECE\u522B\u540D\u4E2D\u627E\u5230\u4E2D\u6587\u6807\u9898 (\u5176\u4ED6\u5730\u533A): ${title}`);
    return title;
  }
  return null;
}
async function getChineseTitleForResult(result, signal) {
  const resultTitle = result.name || result.title || "";
  if (!isNonChinese(resultTitle)) {
    return resultTitle;
  }
  log("info", `[TMDB] \u68C0\u6D4B\u5230\u975E\u4E2D\u6587\u6807\u9898 "${resultTitle}", \u5C1D\u8BD5\u83B7\u53D6\u4E2D\u6587\u522B\u540D`);
  const mediaType = result.media_type || (result.name ? "tv" : "movie");
  try {
    if (signal && signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const altResp = await getTmdbAlternativeTitles(mediaType, result.id, { signal });
    if (signal && signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    const chineseTitle = extractChineseTitleFromAlternatives(altResp, mediaType);
    if (chineseTitle) {
      log("info", `[TMDB] \u5C06\u4F7F\u7528\u4E2D\u6587\u522B\u540D\u8FDB\u884C\u76F8\u4F3C\u5339\u914D: ${chineseTitle}`);
      return chineseTitle;
    } else {
      log("info", `[TMDB] \u672A\u627E\u5230\u4E2D\u6587\u522B\u540D\uFF0C\u4F7F\u7528\u539F\u6807\u9898: ${resultTitle}`);
      return resultTitle;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    log("error", `[TMDB] \u83B7\u53D6\u522B\u540D\u5931\u8D25: ${error.message}`);
    return resultTitle;
  }
}
async function getTmdbJaOriginalTitle(title, signal = null, sourceLabel = "Unknown") {
  if (!globals.tmdbApiKey) {
    log("info", "[TMDB] \u672A\u914D\u7F6EAPI\u5BC6\u94A5\uFF0C\u8DF3\u8FC7TMDB\u641C\u7D22");
    return null;
  }
  const cleanTitle = cleanSearchQuery(title);
  if (cleanTitle !== title) {
    log("info", `[TMDB] \u4F18\u5316\u641C\u7D22\u5173\u952E\u8BCD: "${title}" -> "${cleanTitle}"`);
  }
  let task = TMDB_PENDING.get(cleanTitle);
  if (!task) {
    const masterController = new AbortController();
    const executeSearch = async () => {
      try {
        const backgroundSignal = masterController.signal;
        const isValidContent = (mediaInfo) => {
          const genreIds = mediaInfo.genre_ids || [];
          const genres = mediaInfo.genres || [];
          const allGenreIds = genreIds.length > 0 ? genreIds : genres.map((g) => g.id);
          const originalLanguage = mediaInfo.original_language || "";
          const ANIMATION_GENRE_ID = 16;
          if (allGenreIds.includes(ANIMATION_GENRE_ID)) {
            return { isValid: true, reason: "\u660E\u786E\u52A8\u753B\u7C7B\u578B(genre_id: 16)" };
          }
          if (originalLanguage === "ja") {
            return { isValid: true, reason: `\u539F\u59CB\u8BED\u8A00\u4E3A\u65E5\u8BED(ja),\u53EF\u80FD\u662F\u65E5\u5267/\u65E5\u5F71/\u65E5\u7EFC\u827A` };
          }
          return {
            isValid: false,
            reason: `\u975E\u52A8\u753B\u4E14\u975E\u65E5\u8BED\u5185\u5BB9(language: ${originalLanguage}, genres: ${allGenreIds.join(",")})`
          };
        };
        const validateResults = (results) => {
          if (!results || results.length === 0) {
            return {
              hasValid: false,
              validCount: 0,
              totalCount: 0,
              details: "\u641C\u7D22\u7ED3\u679C\u4E3A\u7A7A"
            };
          }
          let validCount = 0;
          const validItems = [];
          for (const item of results) {
            const validation = isValidContent(item);
            if (validation.isValid) {
              validCount++;
              const itemTitle = item.name || item.title || "\u672A\u77E5";
              validItems.push(`${itemTitle}(${validation.reason})`);
            }
          }
          return {
            hasValid: validCount > 0,
            validCount,
            totalCount: results.length,
            details: validCount > 0 ? `\u627E\u5230${validCount}\u4E2A\u7B26\u5408\u6761\u4EF6\u7684\u5185\u5BB9: ${validItems.slice(0, 3).join(", ")}${validCount > 3 ? "..." : ""}` : `\u6240\u6709${results.length}\u4E2A\u7ED3\u679C\u5747\u4E0D\u7B26\u5408\u6761\u4EF6(\u975E\u52A8\u753B\u4E14\u975E\u65E5\u8BED)`
          };
        };
        const similarity = (s1, s2) => {
          const normalize = (str) => {
            return str.toLowerCase().replace(/\s+/g, "").replace(/[：:、，。！？；""''（）【】《》]/g, "").trim();
          };
          const n1 = normalize(s1);
          const n2 = normalize(s2);
          if (n1 === n2) return 1;
          const shorter = n1.length < n2.length ? n1 : n2;
          const longer = n1.length >= n2.length ? n1 : n2;
          if (longer.includes(shorter) && shorter.length > 0) {
            const lengthRatio = shorter.length / longer.length;
            return 0.6 + lengthRatio * 0.3;
          }
          const longer2 = s1.length > s2.length ? s1 : s2;
          const shorter2 = s1.length > s2.length ? s2 : s1;
          if (longer2.length === 0) return 1;
          const editDistance2 = (str1, str2) => {
            str1 = str1.toLowerCase();
            str2 = str2.toLowerCase();
            const costs = [];
            for (let i = 0; i <= str1.length; i++) {
              let lastValue = i;
              for (let j = 0; j <= str2.length; j++) {
                if (i === 0) {
                  costs[j] = j;
                } else if (j > 0) {
                  let newValue = costs[j - 1];
                  if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                  }
                  costs[j - 1] = lastValue;
                  lastValue = newValue;
                }
              }
              if (i > 0) costs[str2.length] = lastValue;
            }
            return costs[str2.length];
          };
          return (longer2.length - editDistance2(longer2, shorter2)) / longer2.length;
        };
        log("info", `[TMDB] \u6B63\u5728\u641C\u7D22 (Shared Task): ${cleanTitle}`);
        if (backgroundSignal.aborted) throw new DOMException("Aborted", "AbortError");
        const respZh = await searchTmdbTitles(cleanTitle, "multi", { signal: backgroundSignal });
        if (!respZh || !respZh.data) {
          log("info", "[TMDB] TMDB\u641C\u7D22\u7ED3\u679C\u4E3A\u7A7A");
          return null;
        }
        const dataZh = typeof respZh.data === "string" ? JSON.parse(respZh.data) : respZh.data;
        if (!dataZh.results || dataZh.results.length === 0) {
          log("info", "[TMDB] TMDB\u672A\u627E\u5230\u4EFB\u4F55\u7ED3\u679C");
          return null;
        }
        const validationResult = validateResults(dataZh.results);
        if (!validationResult.hasValid) {
          log("info", `[TMDB] \u7C7B\u578B\u5224\u65AD\u672A\u901A\u8FC7,\u8DF3\u8FC7\u540E\u7EED\u641C\u7D22: ${validationResult.details}`);
          return null;
        }
        log("info", `[TMDB] \u7C7B\u578B\u5224\u65AD\u901A\u8FC7: ${validationResult.details}`);
        let bestMatch = null;
        let bestScore = -1;
        let bestMatchChineseTitle = null;
        let alternativeTitleFetchCount = 0;
        const MAX_ALTERNATIVE_FETCHES = 5;
        let skipAlternativeFetch = false;
        for (const result of dataZh.results) {
          const resultTitle = result.name || result.title || "";
          if (!resultTitle) continue;
          const directScore = similarity(cleanTitle, resultTitle);
          const originalTitle = result.original_name || result.original_title || "";
          const originalScore = originalTitle ? similarity(cleanTitle, originalTitle) : 0;
          const initialScore = Math.max(directScore, originalScore);
          if (initialScore === 1 && !skipAlternativeFetch) {
            skipAlternativeFetch = true;
            log("info", `[TMDB] \u5339\u914D\u68C0\u67E5 "${resultTitle}" - \u76F8\u4F3C\u5EA6: 100.00% (\u5B8C\u5168\u5339\u914D\uFF0C\u8DF3\u8FC7\u540E\u7EED\u6240\u6709\u522B\u540D\u641C\u7D22)`);
            if (initialScore > bestScore) {
              bestScore = initialScore;
              bestMatch = result;
              bestMatchChineseTitle = resultTitle;
            }
            continue;
          }
          let chineseTitle;
          let finalScore;
          if (skipAlternativeFetch || !isNonChinese(resultTitle)) {
            chineseTitle = resultTitle;
            finalScore = initialScore;
            if (skipAlternativeFetch && isNonChinese(resultTitle)) {
              log("info", `[TMDB] \u5339\u914D\u68C0\u67E5 "${resultTitle}" - \u76F8\u4F3C\u5EA6: ${(finalScore * 100).toFixed(2)}% (\u5DF2\u627E\u5230\u5B8C\u5168\u5339\u914D\uFF0C\u8DF3\u8FC7\u522B\u540D\u641C\u7D22)`);
            } else {
              log("info", `[TMDB] \u5339\u914D\u68C0\u67E5 "${resultTitle}" - \u76F8\u4F3C\u5EA6: ${(finalScore * 100).toFixed(2)}%`);
            }
          } else {
            if (alternativeTitleFetchCount < MAX_ALTERNATIVE_FETCHES) {
              try {
                chineseTitle = await getChineseTitleForResult(result, backgroundSignal);
                if (chineseTitle !== resultTitle) {
                  alternativeTitleFetchCount++;
                }
              } catch (error) {
                if (error.name === "AbortError") throw error;
                log("error", `[TMDB] \u5904\u7406\u7ED3\u679C\u5931\u8D25: ${error.message}`);
                chineseTitle = resultTitle;
              }
            } else {
              chineseTitle = resultTitle;
              log("info", `[TMDB] \u5DF2\u8FBE\u5230\u522B\u540D\u83B7\u53D6\u4E0A\u9650(${MAX_ALTERNATIVE_FETCHES})\uFF0C\u4F7F\u7528\u539F\u6807\u9898: ${resultTitle}`);
            }
            const finalDirectScore = similarity(cleanTitle, chineseTitle);
            finalScore = Math.max(finalDirectScore, originalScore);
            const displayInfo = chineseTitle !== resultTitle ? `"${resultTitle}" (\u522B\u540D: ${chineseTitle})` : `"${resultTitle}"`;
            log("info", `[TMDB] \u5339\u914D\u68C0\u67E5 ${displayInfo} - \u76F8\u4F3C\u5EA6: ${(finalScore * 100).toFixed(2)}%`);
            if (finalScore === 1 && !skipAlternativeFetch) {
              skipAlternativeFetch = true;
              log("info", `[TMDB] \u901A\u8FC7\u522B\u540D\u627E\u5230\u5B8C\u5168\u5339\u914D\uFF0C\u8DF3\u8FC7\u540E\u7EED\u6240\u6709\u522B\u540D\u641C\u7D22`);
            }
          }
          if (finalScore > bestScore) {
            bestScore = finalScore;
            bestMatch = result;
            bestMatchChineseTitle = chineseTitle;
          }
        }
        const MIN_SIMILARITY = 0.2;
        if (!bestMatch || bestScore < MIN_SIMILARITY) {
          log("info", `[TMDB] \u6700\u4F73\u5339\u914D\u76F8\u4F3C\u5EA6\u8FC7\u4F4E\u6216\u672A\u627E\u5230\u5339\u914D (${bestMatch ? (bestScore * 100).toFixed(2) + "%" : "N/A"}),\u8DF3\u8FC7`);
          return null;
        }
        log("info", `[TMDB] TMDB\u6700\u4F73\u5339\u914D: ${bestMatchChineseTitle}, \u76F8\u4F3C\u5EA6: ${(bestScore * 100).toFixed(2)}%`);
        const mediaType = bestMatch.media_type || (bestMatch.name ? "tv" : "movie");
        const detailResp = await getTmdbJpDetail(mediaType, bestMatch.id, { signal: backgroundSignal });
        let jaOriginalTitle;
        if (!detailResp || !detailResp.data) {
          jaOriginalTitle = bestMatch.name || bestMatch.title;
          log("info", `[TMDB] \u4F7F\u7528\u4E2D\u6587\u641C\u7D22\u7ED3\u679C\u6807\u9898: ${jaOriginalTitle}`);
        } else {
          const detail = typeof detailResp.data === "string" ? JSON.parse(detailResp.data) : detailResp.data;
          jaOriginalTitle = detail.original_name || detail.original_title || detail.name || detail.title;
          log("info", `[TMDB] \u627E\u5230\u65E5\u8BED\u539F\u540D: ${jaOriginalTitle}`);
        }
        return { title: jaOriginalTitle, cnAlias: bestMatchChineseTitle };
      } catch (error) {
        if (error.name === "AbortError") {
          log("info", `[TMDB] \u540E\u53F0\u641C\u7D22\u4EFB\u52A1\u5DF2\u5B8C\u5168\u7EC8\u6B62 (${cleanTitle})`);
          throw error;
        }
        log("error", "[TMDB] Background Search error:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        return null;
      }
    };
    task = {
      controller: masterController,
      refCount: 0,
      promise: executeSearch().finally(() => {
        TMDB_PENDING.delete(cleanTitle);
      })
    };
    TMDB_PENDING.set(cleanTitle, task);
    log("info", `[TMDB] \u542F\u52A8\u65B0\u641C\u7D22\u4EFB\u52A1: ${cleanTitle}`);
  } else {
    log("info", `[TMDB] \u52A0\u5165\u6B63\u5728\u8FDB\u884C\u7684\u641C\u7D22: ${cleanTitle} (${sourceLabel})`);
  }
  task.refCount++;
  const leaveTask = () => {
    const currentTask = TMDB_PENDING.get(cleanTitle);
    if (currentTask === task) {
      task.refCount--;
      if (task.refCount <= 0) {
        log("info", `[TMDB] \u6240\u6709\u8C03\u7528\u8005\u5DF2\u53D6\u6D88\uFF0C\u7EC8\u6B62\u540E\u53F0\u8BF7\u6C42: ${cleanTitle}`);
        task.controller.abort();
      }
    }
  };
  if (signal) {
    if (signal.aborted) {
      leaveTask();
      log("info", `[TMDB] \u641C\u7D22\u5DF2\u88AB\u4E2D\u65AD (Source: ${sourceLabel})`);
      return null;
    }
    signal.addEventListener("abort", leaveTask, { once: true });
  }
  try {
    const userAbortPromise = new Promise((_, reject) => {
      if (signal) {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      }
    });
    return await Promise.race([task.promise, userAbortPromise]);
  } catch (error) {
    if (error.name === "AbortError") {
      log("info", `[TMDB] \u641C\u7D22\u5DF2\u88AB\u4E2D\u65AD (Source: ${sourceLabel})`);
      return null;
    }
    log("error", `[TMDB] \u641C\u7D22\u5F02\u5E38: ${error.message}`);
    return null;
  }
}
var SUFFIX_PATTERNS = [
  /(\s+|^)(?:第)?(\d+|[一二三四五六七八九十]+)[季期部]/,
  /(\s+|^)season\s*\d+/i,
  /(\s+|^)s\d+/i,
  /(\s+|^)part\s*\d+/i,
  /(\s+|^)the\s+final\s+season/i,
  /(\s+|^)movie(?![a-z])/i,
  // 负向预查，防止误匹配单词内部
  /(\s+|^)film(?![a-z])/i,
  /(\s+|^)ova(?![a-z])/i,
  /(\s+|^)oad(?![a-z])/i,
  /(\s+|^)sp(?![a-z])/i,
  /[:：]\s*.+/,
  /[~～].+/,
  /\s+.*篇/,
  /.*外传/
];
var SEPARATOR_REGEX = /[ :：~～]/;
function detectSuffixStart(title) {
  let minIndex = title.length;
  for (const pattern of SUFFIX_PATTERNS) {
    const match = title.match(pattern);
    if (match && match.index !== void 0) {
      if (match.index < minIndex) {
        minIndex = match.index;
      }
    }
  }
  return minIndex;
}
function cleanSearchQuery(title) {
  const limit = detectSuffixStart(title);
  if (limit < title.length) {
    return title.substring(0, limit).trim();
  }
  return title;
}
function smartTitleReplace(animes, cnAlias) {
  if (!animes || animes.length === 0 || !cnAlias) return;
  log("info", `[TMDB] \u542F\u52A8\u667A\u80FD\u66FF\u6362\uFF0C\u76EE\u6807\u522B\u540D: "${cnAlias}"\uFF0C\u5F85\u5904\u7406\u6761\u76EE: ${animes.length}`);
  const baseTitles = animes.map((a) => {
    const t = a.org_title || a.title || "";
    const limit = detectSuffixStart(t);
    return t.substring(0, limit);
  });
  let lcp = "";
  if (baseTitles.length > 0) {
    const sorted = baseTitles.concat().sort();
    const a1 = sorted[0];
    const a2 = sorted[sorted.length - 1];
    let i = 0;
    while (i < a1.length && a1.charAt(i) === a2.charAt(i)) i++;
    lcp = a1.substring(0, i);
  }
  if (lcp && lcp.length > 1) {
    log("info", `[TMDB] \u8BA1\u7B97\u51FA\u6700\u957F\u516C\u5171\u524D\u7F00 (LCP): "${lcp}"`);
  }
  for (let i = 0; i < animes.length; i++) {
    const anime = animes[i];
    const originalTitle = anime.title || "";
    if (lcp && lcp.length > 1 && originalTitle.startsWith(lcp)) {
      const suffix = originalTitle.substring(lcp.length).trim();
      let newTitle;
      if (!suffix) {
        newTitle = cnAlias;
      } else if (suffix.match(/^[~～:：]/)) {
        newTitle = cnAlias + suffix;
      } else {
        newTitle = cnAlias + " " + suffix;
      }
      anime._displayTitle = newTitle;
      log("info", `[TMDB] [LCP\u6A21\u5F0F] "${originalTitle}" -> "${newTitle}"`);
    } else {
      const match = originalTitle.match(SEPARATOR_REGEX);
      if (match) {
        const suffix = originalTitle.substring(match.index);
        const newTitle = cnAlias + suffix;
        anime._displayTitle = newTitle;
        log("info", `[TMDB] [\u5206\u9694\u7B26\u6A21\u5F0F] "${originalTitle}" -> "${newTitle}"`);
      } else {
        anime._displayTitle = cnAlias;
        log("info", `[TMDB] [\u5168\u66FF\u6A21\u5F0F] "${originalTitle}" -> "${cnAlias}"`);
      }
    }
  }
}

// danmu_api/utils/merge-util.js
var MERGE_DELIMITER = "$$$";
var DISPLAY_CONNECTOR = "&";
function cleanText(text) {
  if (!text) return "";
  let clean = simplized(text);
  clean = clean.replace(/【.*?】/g, "");
  clean = clean.replace(/(\(|（)仅限.*?地区(\)|）)/g, "");
  clean = clean.replace(/[!！?？,，.。、~～]/g, " ");
  return normalizeSpaces(clean).toLowerCase().trim();
}
function removeParentheses(text) {
  if (!text) return "";
  return text.replace(/(\(|（).*?(\)|）)/g, "").trim();
}
function sanitizeUrl(urlStr) {
  if (!urlStr) return "";
  let clean = String(urlStr).split(MERGE_DELIMITER)[0].trim();
  if (clean.startsWith("//")) {
    return "https:" + clean;
  }
  const match = clean.match(/^([^:]+):(.+)$/);
  if (match) {
    const prefix = match[1].toLowerCase();
    const body = match[2];
    if (prefix === "http" || prefix === "https") {
      return clean;
    }
    if (/^https?:\/\//i.test(body)) {
      return body;
    }
    if (body.startsWith("//")) {
      return "https:" + body;
    }
    return body;
  }
  return clean;
}
function parseDate(dateStr) {
  if (!dateStr) return { year: null, month: null };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { year: null, month: null };
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1
  };
}
function editDistance(s1, s2) {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = [];
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[len1][len2];
}
function calculateDiceSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const set1 = new Set(s1.replace(/\s/g, ""));
  const set2 = new Set(s2.replace(/\s/g, ""));
  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;
  let intersection = 0;
  for (const char of set1) {
    if (set2.has(char)) {
      intersection++;
    }
  }
  return 2 * intersection / (set1.size + set2.size);
}
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = cleanText(str1);
  const s2 = cleanText(str2);
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) {
    const lenRatio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    return 0.8 + lenRatio * 0.2;
  }
  const distance = editDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  const editScore = maxLength === 0 ? 1 : 1 - distance / maxLength;
  const diceScore = calculateDiceSimilarity(s1, s2);
  return Math.max(editScore, diceScore);
}
function extractSeasonMarkers(title, typeDesc = "") {
  const markers = /* @__PURE__ */ new Set();
  const t = cleanText(title);
  const type = cleanText(typeDesc || "");
  const patterns = [
    { regex: /第(\d+)[季期]/, prefix: "S" },
    { regex: /season\s*(\d+)/, prefix: "S" },
    { regex: /s(\d+)/, prefix: "S" },
    { regex: /part\s*(\d+)/, prefix: "P" },
    { regex: /(ova|oad)/, val: "OVA" },
    { regex: /(剧场版|movie|film|电影)/, val: "MOVIE" },
    { regex: /(续篇|续集)/, val: "SEQUEL" },
    { regex: /sp/, val: "SP" },
    { regex: /[^0-9](\d)$/, prefix: "S" }
  ];
  patterns.forEach((p) => {
    const match = t.match(p.regex);
    if (match) {
      if (p.prefix) {
        markers.add(`${p.prefix}${parseInt(match[1])}`);
      } else {
        markers.add(p.val);
      }
    }
  });
  if (type.includes("\u5267\u573A\u7248") || type.includes("movie") || type.includes("film") || type.includes("\u7535\u5F71")) markers.add("MOVIE");
  if (type.includes("ova") || type.includes("oad")) markers.add("OVA");
  if (type.includes("sp") || type.includes("special")) markers.add("SP");
  const cnNums = { "\u4E00": 1, "\u4E8C": 2, "\u4E09": 3, "\u56DB": 4, "\u4E94": 5, "final": 99 };
  for (const [cn, num] of Object.entries(cnNums)) {
    if (t.includes(`\u7B2C${cn}\u5B63`)) markers.add(`S${num}`);
  }
  return markers;
}
function getStrictMediaType(title, typeDesc) {
  const fullText = (title + " " + (typeDesc || "")).toLowerCase();
  const hasMovie = fullText.includes("\u7535\u5F71");
  const hasTV = fullText.includes("\u7535\u89C6\u5267");
  if (hasMovie && !hasTV) return "MOVIE";
  if (hasTV && !hasMovie) return "TV";
  return null;
}
function checkMediaTypeMismatch(titleA, titleB, typeDescA, typeDescB, countA, countB) {
  const mediaA = getStrictMediaType(titleA, typeDescA);
  const mediaB = getStrictMediaType(titleB, typeDescB);
  if (!mediaA || !mediaB || mediaA === mediaB) return false;
  const hasValidCounts = countA > 0 && countB > 0;
  if (hasValidCounts) {
    const diff = Math.abs(countA - countB);
    if (diff > 5) {
      return true;
    }
    return false;
  }
  return true;
}
function checkSeasonMismatch(titleA, titleB, typeA, typeB) {
  const markersA = extractSeasonMarkers(titleA, typeA);
  const markersB = extractSeasonMarkers(titleB, typeB);
  if (markersA.size === 0 && markersB.size === 0) return false;
  if (markersA.size > 0 && markersB.size > 0) {
    for (const m of markersA) {
      if (m.startsWith("S") && !markersB.has(m) && Array.from(markersB).some((b) => b.startsWith("S"))) return true;
    }
    return false;
  }
  if (markersA.size !== markersB.size) {
    return true;
  }
  return false;
}
function hasSameSeasonMarker(titleA, titleB, typeA, typeB) {
  const markersA = extractSeasonMarkers(titleA, typeA);
  const markersB = extractSeasonMarkers(titleB, typeB);
  const seasonsA = Array.from(markersA).filter((m) => m.startsWith("S"));
  const seasonsB = Array.from(markersB).filter((m) => m.startsWith("S"));
  if (seasonsA.length > 0 && seasonsB.length > 0) {
    return seasonsA.some((sa) => seasonsB.includes(sa));
  }
  return false;
}
function checkDateMatch(dateA, dateB) {
  if (!dateA.year || !dateB.year) return 0;
  const yearDiff = Math.abs(dateA.year - dateB.year);
  if (yearDiff > 1) return -1;
  if (yearDiff === 0) {
    if (dateA.month && dateB.month) {
      const monthDiff = Math.abs(dateA.month - dateB.month);
      if (monthDiff > 2) return 0;
      return monthDiff === 0 ? 0.2 : 0.1;
    }
    return 0.1;
  }
  return 0;
}
function findSecondaryMatch(primaryAnime, secondaryList) {
  if (!secondaryList || secondaryList.length === 0) return null;
  const rawPrimaryTitle = primaryAnime.animeTitle || "";
  let primaryTitleForSim = rawPrimaryTitle.replace(/\(\d{4}\).*$/, "");
  primaryTitleForSim = primaryTitleForSim.replace(/【(电影|电视剧)】/g, "").trim();
  const primaryDate = parseDate(primaryAnime.startDate);
  const primaryCount = primaryAnime.episodeCount || (primaryAnime.links ? primaryAnime.links.length : 0);
  let bestMatch = null;
  let maxScore = 0;
  for (const secAnime of secondaryList) {
    const rawSecTitle = secAnime.animeTitle || "";
    const secDate = parseDate(secAnime.startDate);
    let secTitleForSim = rawSecTitle.replace(/\(\d{4}\).*$/, "");
    secTitleForSim = secTitleForSim.replace(/【(电影|电视剧)】/g, "").trim();
    const secCount = secAnime.episodeCount || (secAnime.links ? secAnime.links.length : 0);
    if (checkMediaTypeMismatch(rawPrimaryTitle, rawSecTitle, primaryAnime.typeDescription, secAnime.typeDescription, primaryCount, secCount)) {
      continue;
    }
    const isSeasonExactMatch = hasSameSeasonMarker(primaryTitleForSim, secTitleForSim, primaryAnime.typeDescription, secAnime.typeDescription);
    const dateScore = checkDateMatch(primaryDate, secDate);
    if (!isSeasonExactMatch && dateScore === -1) {
      continue;
    }
    if (checkSeasonMismatch(primaryTitleForSim, secTitleForSim, primaryAnime.typeDescription, secAnime.typeDescription)) {
      continue;
    }
    let scoreFull = calculateSimilarity(primaryTitleForSim, secTitleForSim);
    const baseA = removeParentheses(primaryTitleForSim);
    const baseB = removeParentheses(secTitleForSim);
    let scoreBase = calculateSimilarity(baseA, baseB);
    let score = Math.max(scoreFull, scoreBase);
    if (dateScore !== -1) {
      score += dateScore;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = secAnime;
    }
  }
  return maxScore >= 0.6 ? bestMatch : null;
}
function extractEpisodeInfo(title) {
  const t = cleanText(title || "");
  const isMovie = /剧场版|movie|film/i.test(t);
  let num = null;
  const isSpecial = /^(s|o|sp|special)\d/i.test(t);
  const strongPrefixMatch = t.match(/(?:ep|o|s|part|第)\s*(\d+(\.\d+)?)/i);
  if (strongPrefixMatch) {
    num = parseFloat(strongPrefixMatch[1]);
  } else {
    const weakPrefixMatch = t.match(/(?:^|\s)(\d+(\.\d+)?)(?:话|集|\s|$)/);
    if (weakPrefixMatch) {
      num = parseFloat(weakPrefixMatch[1]);
    }
  }
  return { isMovie, num, isSpecial };
}
function getSpecialEpisodeType(title) {
  if (!title) return null;
  const t = title.toLowerCase();
  if (t.includes("opening")) return "opening";
  if (t.includes("ending")) return "ending";
  if (t.includes("interview")) return "interview";
  if (t.includes("Bloopers")) return "Bloopers";
  return null;
}
function filterEpisodes(links, filterRegex) {
  if (!links) return [];
  if (!filterRegex) {
    return links.map((link, index) => ({ link, originalIndex: index }));
  }
  return links.map((link, index) => ({ link, originalIndex: index })).filter((item) => {
    const title = item.link.title || item.link.name || "";
    return !filterRegex.test(title);
  });
}
function findBestAlignmentOffset(primaryLinks, secondaryLinks) {
  if (primaryLinks.length === 0 || secondaryLinks.length === 0) return 0;
  let bestOffset = 0;
  let maxScore = -999;
  let minNormalA = null;
  let minNormalB = null;
  for (const item of primaryLinks) {
    const info = extractEpisodeInfo(item.link.title);
    if (info.num !== null && !info.isSpecial) {
      if (minNormalA === null || info.num < minNormalA) minNormalA = info.num;
    }
  }
  for (const item of secondaryLinks) {
    const info = extractEpisodeInfo(item.link.title);
    if (info.num !== null && !info.isSpecial) {
      if (minNormalB === null || info.num < minNormalB) minNormalB = info.num;
    }
  }
  const seasonShift = minNormalA !== null && minNormalB !== null ? minNormalA - minNormalB : null;
  const maxShift = Math.min(Math.max(primaryLinks.length, secondaryLinks.length), 15);
  for (let offset = -maxShift; offset <= maxShift; offset++) {
    let totalTextScore = 0;
    let rawTextScoreSum = 0;
    let matchCount = 0;
    let numericDiffs = /* @__PURE__ */ new Map();
    for (let i = 0; i < secondaryLinks.length; i++) {
      const pIndex = i + offset;
      if (pIndex >= 0 && pIndex < primaryLinks.length) {
        const titleA = primaryLinks[pIndex].link.title || "";
        const titleB = secondaryLinks[i].link.title || "";
        const infoA = extractEpisodeInfo(titleA);
        const infoB = extractEpisodeInfo(titleB);
        let pairScore = 0;
        if (infoA.isMovie !== infoB.isMovie) {
          pairScore -= 5;
        }
        const specialTypeA = getSpecialEpisodeType(titleA);
        const specialTypeB = getSpecialEpisodeType(titleB);
        if (specialTypeA || specialTypeB) {
          if (specialTypeA !== specialTypeB) {
            pairScore -= 10;
          } else {
            pairScore += 3;
          }
        }
        if (infoA.isSpecial === infoB.isSpecial) {
          pairScore += 3;
        }
        if (seasonShift !== null && !infoA.isSpecial && !infoB.isSpecial) {
          if (infoA.num - infoB.num === seasonShift) {
            pairScore += 5;
          }
        }
        const sim = calculateSimilarity(titleA, titleB);
        pairScore += sim;
        rawTextScoreSum += sim;
        if (infoA.num !== null && infoB.num !== null && infoA.num === infoB.num) {
          pairScore += 2;
        }
        totalTextScore += pairScore;
        if (infoA.num !== null && infoB.num !== null) {
          const diff = infoB.num - infoA.num;
          const diffKey = diff.toFixed(4);
          const count = numericDiffs.get(diffKey) || 0;
          numericDiffs.set(diffKey, count + 1);
        }
        matchCount++;
      }
    }
    if (matchCount > 0) {
      let finalScore = totalTextScore / matchCount;
      let maxFrequency = 0;
      for (const count of numericDiffs.values()) {
        if (count > maxFrequency) maxFrequency = count;
      }
      const consistencyRatio = maxFrequency / matchCount;
      const avgRawTextScore = rawTextScoreSum / matchCount;
      if (consistencyRatio > 0.6 && avgRawTextScore > 0.33) {
        finalScore += 2;
      }
      const coverageBonus = Math.min(matchCount * 0.15, 1.5);
      finalScore += coverageBonus;
      const zeroDiffCount = numericDiffs.get("0.0000") || 0;
      if (zeroDiffCount > 0) {
        finalScore += zeroDiffCount * 2;
      }
      if (finalScore > maxScore) {
        maxScore = finalScore;
        bestOffset = offset;
      }
    }
  }
  return maxScore > 0.3 ? bestOffset : 0;
}
function generateSafeMergedId(id1, id2, salt = "") {
  const str = `${id1}_${id2}_${salt}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1e9 + 1e9;
}
async function applyMergeLogic(curAnimes) {
  const groups = globals.mergeSourcePairs;
  if (!groups || groups.length === 0) return;
  log("info", `[Merge] \u542F\u52A8\u6E90\u5408\u5E76\u7B56\u7565\uFF0C\u914D\u7F6E: ${JSON.stringify(groups)}`);
  let epFilter = globals.episodeTitleFilter;
  if (epFilter && typeof epFilter === "string") {
    try {
      epFilter = new RegExp(epFilter, "i");
    } catch (e) {
      epFilter = null;
    }
  }
  const newMergedAnimes = [];
  const usedBaseAnimeIds = /* @__PURE__ */ new Set();
  const mergedSecondaryAnimes = /* @__PURE__ */ new Set();
  const generatedSignatures = /* @__PURE__ */ new Set();
  for (const { primary, secondaries } of groups) {
    const groupFingerprint = `${primary}&${secondaries.join("&")}`;
    const primaryItems = curAnimes.filter((a) => a.source === primary && !a._isMerged);
    if (primaryItems.length === 0) continue;
    for (const pAnime of primaryItems) {
      const cachedPAnime = globals.animes.find((a) => String(a.animeId) === String(pAnime.animeId));
      if (!cachedPAnime?.links) {
        log("warn", `[Merge] \u4E3B\u6E90\u6570\u636E\u4E0D\u5B8C\u6574\uFF0C\u8DF3\u8FC7: ${pAnime.animeTitle}`);
        continue;
      }
      const logTitleA = pAnime.animeTitle.replace(/\s*from\s+.*$/i, "");
      let derivedAnime = JSON.parse(JSON.stringify(cachedPAnime));
      const actualMergedSources = [];
      const contentSignatureParts = [pAnime.animeId];
      let hasMergedAny = false;
      for (const secSource of secondaries) {
        const secondaryItems = curAnimes.filter((a) => a.source === secSource && !a._isMerged);
        if (secondaryItems.length === 0) continue;
        const match = findSecondaryMatch(pAnime, secondaryItems);
        if (match) {
          const cachedMatch = globals.animes.find((a) => String(a.animeId) === String(match.animeId));
          if (!cachedMatch?.links) continue;
          const logTitleB = cachedMatch.animeTitle.replace(/\s*from\s+.*$/i, "");
          const filteredPLinksWithIndex = filterEpisodes(derivedAnime.links, epFilter);
          const filteredMLinksWithIndex = filterEpisodes(cachedMatch.links, epFilter);
          const offset = findBestAlignmentOffset(filteredPLinksWithIndex, filteredMLinksWithIndex);
          if (offset !== 0) {
            log("info", `[Merge] \u96C6\u6570\u81EA\u52A8\u5BF9\u9F50 (${secSource}): Offset=${offset} (P:${filteredPLinksWithIndex.length}, S:${filteredMLinksWithIndex.length})`);
          }
          derivedAnime.animeId = generateSafeMergedId(derivedAnime.animeId, match.animeId, groupFingerprint);
          derivedAnime.bangumiId = String(derivedAnime.animeId);
          let mergedCount = 0;
          const mappingEntries = [];
          const matchedPIndices = /* @__PURE__ */ new Set();
          for (let i = 0; i < filteredMLinksWithIndex.length; i++) {
            const pIndex = i + offset;
            const sourceLink = filteredMLinksWithIndex[i].link;
            const sTitleShort = sourceLink.name || sourceLink.title || `Index ${i}`;
            if (pIndex >= 0 && pIndex < derivedAnime.links.length) {
              const targetLink = derivedAnime.links[pIndex];
              const pTitleShort = targetLink.name || targetLink.title || `Index ${pIndex}`;
              const specialP = getSpecialEpisodeType(targetLink.title);
              const specialS = getSpecialEpisodeType(sourceLink.title);
              if (specialP !== specialS) {
                mappingEntries.push({
                  idx: pIndex,
                  text: `   [\u7565\u8FC7] ${pTitleShort} =/= ${sTitleShort} (\u7279\u6B8A\u96C6\u7C7B\u578B\u4E0D\u5339\u914D)`
                });
                continue;
              }
              const idB = sanitizeUrl(sourceLink.url);
              let currentUrl = targetLink.url;
              const secPart = `${secSource}:${idB}`;
              if (!currentUrl.includes(MERGE_DELIMITER)) {
                if (!currentUrl.startsWith(primary + ":")) {
                  currentUrl = `${primary}:${currentUrl}`;
                }
              }
              targetLink.url = `${currentUrl}${MERGE_DELIMITER}${secPart}`;
              mappingEntries.push({
                idx: pIndex,
                text: `   [\u5339\u914D] ${pTitleShort} <-> ${sTitleShort}`
              });
              matchedPIndices.add(pIndex);
              if (targetLink.title) {
                let sLabel = secSource;
                if (sourceLink.title) {
                  const sMatch = sourceLink.title.match(/^【([^】\d]+)(?:\d*)】/);
                  if (sMatch) sLabel = sMatch[1].trim();
                }
                targetLink.title = targetLink.title.replace(
                  /^【([^】]+)】/,
                  (match2, content) => `\u3010${content}${DISPLAY_CONNECTOR}${sLabel}\u3011`
                );
              }
              mergedCount++;
            } else {
              mappingEntries.push({
                idx: pIndex,
                text: `   [\u843D\u5355] (\u4E3B\u6E90\u8D8A\u754C) <-> ${sTitleShort}`
              });
            }
          }
          for (let j = 0; j < derivedAnime.links.length; j++) {
            if (!matchedPIndices.has(j)) {
              const targetLink = derivedAnime.links[j];
              const pTitleShort = targetLink.name || targetLink.title || `Index ${j}`;
              mappingEntries.push({
                idx: j,
                text: `   [\u843D\u5355] ${pTitleShort} <-> (\u526F\u6E90\u7F3A\u5931\u6216\u88AB\u7565\u8FC7)`
              });
            }
          }
          log("info", `[Merge] \u5173\u8054\u6210\u529F: [${primary}] ${logTitleA} <-> [${secSource}] ${logTitleB} (\u672C\u6B21\u5408\u5E76 ${mergedCount} \u96C6)`);
          if (mappingEntries.length > 0) {
            mappingEntries.sort((a, b) => a.idx - b.idx);
            log("info", `[Merge] [${secSource}] \u6620\u5C04\u8BE6\u60C5:
${mappingEntries.map((e) => e.text).join("\n")}`);
          }
          mergedSecondaryAnimes.add(match);
          hasMergedAny = true;
          actualMergedSources.push(secSource);
          contentSignatureParts.push(match.animeId);
        }
      }
      if (hasMergedAny) {
        const signature = contentSignatureParts.join("|");
        if (generatedSignatures.has(signature)) {
          log("info", `[Merge] \u68C0\u6D4B\u5230\u91CD\u590D\u7684\u5408\u5E76\u7ED3\u679C (Signature: ${signature})\uFF0C\u5DF2\u81EA\u52A8\u9690\u53BB\u5197\u4F59\u6761\u76EE\u3002`);
          continue;
        }
        generatedSignatures.add(signature);
        const joinedSources = actualMergedSources.join(DISPLAY_CONNECTOR);
        derivedAnime.animeTitle = derivedAnime.animeTitle.replace(`from ${primary}`, `from ${primary}${DISPLAY_CONNECTOR}${joinedSources}`);
        derivedAnime.source = primary;
        addAnime(derivedAnime);
        newMergedAnimes.push(derivedAnime);
        usedBaseAnimeIds.add(pAnime.animeId);
      }
    }
  }
  curAnimes.push(...newMergedAnimes);
  mergedSecondaryAnimes.forEach((item) => {
    item._isMerged = true;
  });
  for (let i = curAnimes.length - 1; i >= 0; i--) {
    const item = curAnimes[i];
    if (item._isMerged || usedBaseAnimeIds.has(item.animeId)) {
      curAnimes.splice(i, 1);
    }
  }
}
function mergeDanmakuList(listA, listB) {
  const final = [...listA || [], ...listB || []];
  const getTime = (item) => {
    if (!item) return 0;
    if (item.t !== void 0 && item.t !== null) return Number(item.t);
    if (item.p && typeof item.p === "string") {
      const pTime = parseFloat(item.p.split(",")[0]);
      return isNaN(pTime) ? 0 : pTime;
    }
    return 0;
  };
  final.sort((a, b) => {
    return getTime(a) - getTime(b);
  });
  return final;
}

// danmu_api/sources/base.js
var BaseSource = class {
  constructor() {
  }
  // 搜索关键字
  async search(keyword) {
    throw new Error("Method 'search' must be implemented");
  }
  // 获取剧集详情
  async getEpisodes(id) {
    throw new Error("Method 'Episodes' must be implemented");
  }
  // 处理animes结果，用数据模型Anime存储
  async handleAnimes(sourceAnimes, queryTitle, curAnimes, vodName) {
    throw new Error("Method 'handleAnimes' must be implemented");
  }
  // 获取某集的弹幕
  async getEpisodeDanmu(id) {
    throw new Error("Method 'getEpisodeDanmu' must be implemented");
  }
  // 获取某集的弹幕分片列表
  async getEpisodeDanmuSegments(id) {
    throw new Error("Method 'getEpisodeDanmuSegments' must be implemented");
  }
  // 获取某集的分片弹幕
  async getEpisodeSegmentDanmu(segment) {
    throw new Error("Method 'getEpisodeSegmentDanmu' must be implemented");
  }
  // 格式化弹幕
  formatComments(comments) {
    throw new Error("Method 'formatComments' must be implemented");
  }
  // 获取弹幕流水线方法(获取某集弹幕 -> 格式化弹幕 -> 弹幕处理，如去重/屏蔽字等)
  async getComments(id, sourceName, segmentFlag = false, progressCallback = null) {
    if (segmentFlag) {
      if (progressCallback) await progressCallback(5, `\u5F00\u59CB\u83B7\u53D6\u5F39\u5E55${sourceName}\u5F39\u5E55\u5206\u7247\u5217\u8868`);
      log("info", `\u5F00\u59CB\u83B7\u53D6\u5F39\u5E55${sourceName}\u5F39\u5E55\u5206\u7247\u5217\u8868`);
      return await this.getEpisodeDanmuSegments(id);
    }
    if (progressCallback) await progressCallback(5, `\u5F00\u59CB\u83B7\u53D6\u5F39\u5E55${sourceName}\u5F39\u5E55`);
    log("info", `\u5F00\u59CB\u83B7\u53D6\u5F39\u5E55${sourceName}\u5F39\u5E55`);
    const raw = await this.getEpisodeDanmu(id);
    if (progressCallback) await progressCallback(85, `\u539F\u59CB\u5F39\u5E55 ${raw.length} \u6761\uFF0C\u6B63\u5728\u89C4\u8303\u5316`);
    log("info", `\u539F\u59CB\u5F39\u5E55 ${raw.length} \u6761\uFF0C\u6B63\u5728\u89C4\u8303\u5316`);
    const formatted = this.formatComments(raw);
    if (progressCallback) await progressCallback(100, `\u5F39\u5E55\u5904\u7406\u5B8C\u6210\uFF0C\u5171 ${formatted.length} \u6761`);
    log("info", `\u5F39\u5E55\u5904\u7406\u5B8C\u6210\uFF0C\u5171 ${formatted.length} \u6761`);
    return convertToDanmakuJson(formatted, sourceName);
  }
  // 获取分片弹幕流水线方法(获取某集分片弹幕 -> 格式化弹幕 -> 弹幕处理，如去重/屏蔽字等)
  async getSegmentComments(segment, progressCallback = null) {
    if (progressCallback) await progressCallback(5, `\u5F00\u59CB\u83B7\u53D6\u5206\u7247\u5F39\u5E55${segment.type}\u5F39\u5E55`);
    log("info", `\u5F00\u59CB\u83B7\u53D6\u5206\u7247\u5F39\u5E55${segment.type}\u5F39\u5E55`);
    const raw = await this.getEpisodeSegmentDanmu(segment);
    if (progressCallback) await progressCallback(85, `\u539F\u59CB\u5206\u7247\u5F39\u5E55 ${raw.length} \u6761\uFF0C\u6B63\u5728\u89C4\u8303\u5316`);
    log("info", `\u539F\u59CB\u5206\u7247\u5F39\u5E55 ${raw.length} \u6761\uFF0C\u6B63\u5728\u89C4\u8303\u5316`);
    const formatted = this.formatComments(raw);
    if (progressCallback) await progressCallback(100, `\u5206\u7247\u5F39\u5E55\u5904\u7406\u5B8C\u6210\uFF0C\u5171 ${formatted.length} \u6761`);
    log("info", `\u5206\u7247\u5F39\u5E55\u5904\u7406\u5B8C\u6210\uFF0C\u5171 ${formatted.length} \u6761`);
    return convertToDanmakuJson(formatted, segment.type);
  }
  // 按年份降序排序并添加到curAnimes
  sortAndPushAnimesByYear(processedAnimes, curAnimes) {
    processedAnimes.filter((anime) => anime !== null).sort((a, b) => {
      const yearA = extractYear(a.animeTitle);
      const yearB = extractYear(b.animeTitle);
      if (yearA !== null && yearA !== void 0 && yearB !== null && yearB !== void 0) {
        if (yearB !== yearA) {
          return yearB - yearA;
        }
        const titleA = extractAnimeTitle(a.animeTitle);
        const titleB = extractAnimeTitle(b.animeTitle);
        return titleA.length - titleB.length;
      }
      if (yearA !== null && yearA !== void 0 && (yearB === null || yearB === void 0)) {
        return -1;
      }
      if ((yearA === null || yearA === void 0) && (yearB !== null && yearB !== void 0)) {
        return 1;
      }
      return 0;
    }).forEach((anime) => {
      const existingIndex = curAnimes.findIndex((a) => a.animeId === anime.animeId);
      if (existingIndex === -1) {
        curAnimes.push(anime);
      }
    });
  }
};

// danmu_api/utils/time-util.js
function generateValidStartDate(year) {
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
    return `${(/* @__PURE__ */ new Date()).getFullYear()}-01-01T00:00:00Z`;
  }
  return `${yearNum}-01-01T00:00:00Z`;
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

// danmu_api/sources/kan360.js
var Kan360Source = class extends BaseSource {
  // 查询360kan综艺详情
  async get360Zongyi(title, entId, site, year) {
    try {
      let links = [];
      for (let j = 0; j <= 10; j++) {
        const response = await Widget.http.get(
          `https://api.so.360kan.com/episodeszongyi?entid=${entId}&site=${site}&y=${year}&count=20&offset=${j * 20}`,
          {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
          }
        );
        const data = await response.data;
        log("info", `360kan zongyi response: ${JSON.stringify(data)}`);
        const episodeList = data.data.list;
        if (!episodeList) {
          break;
        }
        for (const episodeInfo of episodeList) {
          const epNumMatch = episodeInfo.name.match(/第(\d+)期([上中下])?/) || episodeInfo.period.match(/第(\d+)期([上中下])?/);
          let epNum = epNumMatch ? epNumMatch[1] : null;
          if (epNum && epNumMatch[2]) {
            epNum = epNumMatch[2] === "\u4E0A" ? `${epNum}.1` : epNumMatch[2] === "\u4E2D" ? `${epNum}.2` : `${epNum}.3`;
          }
          links.push({
            "name": episodeInfo.id,
            "url": episodeInfo.url,
            "title": `\u3010${site}\u3011 ${episodeInfo.name} ${episodeInfo.period}`,
            "sort": epNum || episodeInfo.sort || null
          });
        }
        log("info", `links.length: ${links.length}`);
      }
      links.sort((a, b) => {
        if (!a.sort || !b.sort) return 0;
        const aNum = parseFloat(a.sort);
        const bNum = parseFloat(b.sort);
        return aNum - bNum;
      });
      return links;
    } catch (error) {
      log("error", "get360Animes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async search(keyword) {
    try {
      const response = await Widget.http.get(
        `https://api.so.360kan.com/index?force_v=1&kw=${encodeURIComponent(keyword)}&from=&pageno=1&v_ap=1&tab=all`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        }
      );
      const data = response.data;
      log("info", `360kan response: ${JSON.stringify(data)}`);
      let tmpAnimes = [];
      if ("rows" in data.data.longData) {
        tmpAnimes = data.data.longData.rows;
      }
      log("info", `360kan animes.length: ${tmpAnimes.length}`);
      return tmpAnimes;
    } catch (error) {
      log("error", "get360Animes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[360kan] sourceAnimes is not a valid array");
      return [];
    }
    const process360Animes = await Promise.all(sourceAnimes.filter((anime) => titleMatches(anime.titleTxt, queryTitle)).map(async (anime) => {
      try {
        let links = [];
        if (anime.cat_name === "\u7535\u5F71") {
          for (const key of Object.keys(anime.playlinks)) {
            if (globals.vodAllowedPlatforms.includes(key)) {
              links.push({
                "name": key.toString(),
                "url": anime.playlinks[key],
                "title": `\u3010${key}\u3011 ${anime.titleTxt}(${anime.year})`
              });
            }
          }
        } else if (anime.cat_name === "\u7535\u89C6\u5267" || anime.cat_name === "\u52A8\u6F2B") {
          if (globals.vodAllowedPlatforms.includes(anime.seriesSite)) {
            for (let i = 0; i < anime.seriesPlaylinks.length; i++) {
              const item = anime.seriesPlaylinks[i];
              links.push({
                "name": (i + 1).toString(),
                "url": item.url,
                "title": `\u3010${anime.seriesSite}\u3011 \u7B2C${i + 1}\u96C6`
              });
            }
          }
        } else if (anime.cat_name === "\u7EFC\u827A") {
          const zongyiLinks = await Promise.all(
            Object.keys(anime.playlinks_year).map(async (site) => {
              if (globals.vodAllowedPlatforms.includes(site)) {
                const yearLinks = await Promise.all(
                  anime.playlinks_year[site].map(async (year) => {
                    return await this.get360Zongyi(anime.titleTxt, anime.id, site, year);
                  })
                );
                return yearLinks.flat();
              }
              return [];
            })
          );
          links = zongyiLinks.flat();
        }
        if (links.length > 0) {
          let transformedAnime = {
            animeId: Number(anime.id),
            bangumiId: String(anime.id),
            animeTitle: `${anime.titleTxt}(${anime.year})\u3010${anime.cat_name}\u3011from 360`,
            type: anime.cat_name,
            typeDescription: anime.cat_name,
            imageUrl: anime.cover,
            startDate: generateValidStartDate(anime.year),
            episodeCount: links.length,
            rating: 0,
            isFavorited: true,
            source: "360"
          };
          tmpAnimes.push(transformedAnime);
          addAnime({ ...transformedAnime, links });
          if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
        }
      } catch (error) {
        log("error", `[360kan] Error processing anime: ${error.message}`);
      }
    }));
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return process360Animes;
  }
  async getEpisodeDanmu(id) {
  }
  formatComments(comments) {
  }
};

// danmu_api/sources/vod.js
var VodSource = class extends BaseSource {
  // 查询vod站点影片信息
  async getVodAnimes(title, server, serverName) {
    try {
      const response = await Widget.http.get(
        `${server}/api.php/provide/vod/?ac=detail&wd=${title}&pg=1`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        }
      );
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        log("info", `\u8BF7\u6C42 ${serverName}(${server}) \u6210\u529F`);
        const data = response.data;
        log("info", `${serverName} response: \u2193\u2193\u2193`);
        printFirst200Chars(data);
        return { serverName, list: data.list };
      } else {
        log("info", `\u8BF7\u6C42 ${serverName}(${server}) \u6210\u529F\uFF0C\u4F46 response.data.list \u4E3A\u7A7A`);
        return { serverName, list: [] };
      }
    } catch (error) {
      log("error", `\u8BF7\u6C42 ${serverName}(${server}) \u5931\u8D25:`, {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return { serverName, list: [] };
    }
  }
  // 查询所有vod站点影片信息（返回所有结果）
  async getVodAnimesFromAllServersImpl(title, servers) {
    const promises = servers.map(
      (server) => this.getVodAnimes(title, server.url, server.name)
    );
    const results = await Promise.allSettled(promises);
    return results.filter((result) => result.status === "fulfilled").map((result) => result.value);
  }
  // 查询vod站点影片信息（返回最快的结果）
  async getVodAnimesFromFastestServer(title, servers, preferAnimeId = null, preferSource = null) {
    if (!servers || servers.length === 0) {
      return [];
    }
    const promises = servers.map(
      (server) => this.getVodAnimes(title, server.url, server.name)
    );
    let fastest;
    try {
      fastest = await Promise.race(promises);
    } catch (err) {
      log("error", `[VOD fastest mode] \u6240\u6709\u670D\u52A1\u5668\u76F4\u63A5\u629B\u9519`, err);
      return [];
    }
    const stringContainsPreferId = (result) => {
      if (!preferAnimeId || preferSource !== "vod") return true;
      const str = JSON.stringify(result)?.toLowerCase() || "";
      return str.includes(String(preferAnimeId).toLowerCase());
    };
    if (stringContainsPreferId(fastest) && fastest && fastest.list && fastest.list.length > 0) {
      log("info", `[VOD fastest mode] \u6700\u5FEB\u670D\u52A1\u5668 ${fastest.serverName}${preferSource === "vod" ? " \u5B57\u7B26\u4E32\u5305\u542B preferAnimeId \u2192 \u4F18\u5148\u4F7F\u7528" : ""}`);
      return [fastest];
    }
    log("info", `[VOD fastest mode] \u6700\u5FEB\u670D\u52A1\u5668 ${fastest.serverName} \u4E0D\u542B preferAnimeId\uFF0C\u7B49\u5F85\u5176\u4ED6\u670D\u52A1\u5668\u2026`);
    const allSettled = await Promise.allSettled(promises);
    if (preferAnimeId) {
      for (const settled of allSettled) {
        if (settled.status === "fulfilled" && stringContainsPreferId(settled.value) && settled.value && settled.value.list && settled.value.list.length > 0) {
          log("info", `[VOD fastest mode] \u627E\u5230\u5305\u542B preferAnimeId \u7684\u670D\u52A1\u5668: ${settled.value.serverName}`);
          return [settled.value];
        }
      }
      log("info", `[VOD fastest mode] \u6240\u6709\u670D\u52A1\u5668\u90FD\u4E0D\u5305\u542B preferAnimeId\uFF0C\u56DE\u9000\u5230\u201C\u771F\u6B63\u6709\u6570\u636E\u201D\u7684\u6700\u5FEB\u670D\u52A1\u5668`);
    }
    const validResults = allSettled.filter((r) => r.status === "fulfilled").map((r) => r.value).filter((result) => result && result.list && result.list.length > 0);
    if (validResults.length > 0) {
      const chosen = validResults[0];
      log("info", `[VOD fastest mode] \u4F7F\u7528\u6700\u5FEB\u6709\u6570\u636E\u7684\u670D\u52A1\u5668: ${chosen.serverName}`);
      return [chosen];
    }
    log("error", `[VOD fastest mode] \u6240\u6709\u670D\u52A1\u5668\u5747\u65E0\u6709\u6548\u6570\u636E`);
    return [];
  }
  async search(keyword, preferAnimeId = null, preferSource = null) {
    if (!globals.vodServers || globals.vodServers.length === 0) {
      return [];
    }
    if (globals.vodReturnMode === "fastest") {
      return await this.getVodAnimesFromFastestServer(keyword, globals.vodServers, preferAnimeId, preferSource);
    } else {
      return await this.getVodAnimesFromAllServersImpl(keyword, globals.vodServers);
    }
  }
  async getEpisodes(id) {
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes, vodName) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[VOD] sourceAnimes is not a valid array");
      return [];
    }
    const processVodAnimes = await Promise.all(sourceAnimes.filter((anime) => titleMatches(anime.vod_name, queryTitle)).map(async (anime) => {
      try {
        let vodPlayFromList = anime.vod_play_from.split("$$$");
        vodPlayFromList = vodPlayFromList.map((item) => {
          if (item === "mgtv") return "imgo";
          if (item === "bilibili") return "bilibili1";
          return item;
        });
        const vodPlayUrlList = anime.vod_play_url.split("$$$");
        const validIndices = vodPlayFromList.map((item, index) => globals.vodAllowedPlatforms.includes(item) ? index : -1).filter((index) => index !== -1);
        let links = [];
        let count = 0;
        for (const num of validIndices) {
          const platform = vodPlayFromList[num];
          const eps = vodPlayUrlList[num].split("#");
          for (const ep of eps) {
            const epInfo = ep.split("$");
            count++;
            links.push({
              "name": count.toString(),
              "url": epInfo[1],
              "title": `\u3010${platform}\u3011 ${epInfo[0]}`
            });
          }
        }
        if (links.length > 0) {
          let transformedAnime = {
            animeId: Number(anime.vod_id),
            bangumiId: String(anime.vod_id),
            animeTitle: `${anime.vod_name}(${anime.vod_year})\u3010${anime.type_name}\u3011from ${vodName}`,
            type: anime.type_name,
            typeDescription: anime.type_name,
            imageUrl: anime.vod_pic,
            startDate: generateValidStartDate(anime.vod_year),
            episodeCount: links.length,
            rating: 0,
            isFavorited: true,
            source: "vod"
          };
          tmpAnimes.push(transformedAnime);
          addAnime({ ...transformedAnime, links });
          if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
        }
      } catch (error) {
        log("error", `[VOD] Error processing anime: ${error.message}`);
      }
    }));
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processVodAnimes;
  }
  async getEpisodeDanmu(id) {
  }
  formatComments(comments) {
  }
};

// danmu_api/utils/douban-util.js
async function doubanApiGet(url) {
  const doubanApi = "https://m.douban.com/rexxar/api/v2";
  try {
    const response = await Widget.http.get(`${doubanApi}${url}`, {
      method: "GET",
      headers: {
        "Referer": "https://m.douban.com/movie/",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    if (response.status != 200) return null;
    return response;
  } catch (error) {
    log("error", "[DOUBAN] GET API error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return null;
  }
}
async function doubanApiPost(url, data = {}) {
  const doubanApi = "https://api.douban.com/v2";
  try {
    const response = await Widget.http.post(
      `${doubanApi}${url}`,
      JSON.stringify({ ...data, apikey: "0ac44ae016490db2204ce0a042db2916" }),
      {
        method: "GET",
        headers: {
          "Referer": "https://api.douban.com",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      }
    );
    if (response.status != 200) return null;
    return response;
  } catch (error) {
    log("error", "[DOUBAN] POST API error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return null;
  }
}
async function searchDoubanTitles(keyword, count = 20) {
  const url = `/search?q=${keyword}&start=0&count=${count}&type=movie`;
  return await doubanApiGet(url);
}
async function getDoubanDetail(doubanId) {
  const url = `/movie/${doubanId}?for_mobile=1`;
  return await doubanApiGet(url);
}
async function getDoubanInfoByImdbId(imdbId) {
  const url = `/movie/imdb/${imdbId}`;
  return await doubanApiPost(url);
}

// danmu_api/utils/imdb-util.js
async function imdbApiGet(url) {
  const imdbApi = "https://api.imdbapi.dev";
  try {
    const response = await Widget.http.get(`${imdbApi}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    if (response.status != 200) return null;
    return response;
  } catch (error) {
    log("error", "[IMDB] API error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return null;
  }
}
async function getImdbSeasons(imdbId) {
  const url = `/titles/${imdbId}/seasons`;
  return await imdbApiGet(url);
}
async function getImdbepisodes(imdbId, season) {
  const url = `/titles/${imdbId}/episodes?season=${season}`;
  return await imdbApiGet(url);
}

// danmu_api/sources/tmdb.js
var TmdbSource = class extends BaseSource {
  constructor(doubanSource2) {
    super("BaseSource");
    this.doubanSource = doubanSource2;
  }
  async _getDoubanInfo(finalImdbId, mediaType, doubanIds) {
    if (!finalImdbId) return;
    const doubanInfo = await getDoubanInfoByImdbId(finalImdbId);
    if (!doubanInfo || !doubanInfo?.data) return;
    const url = doubanInfo?.data?.id;
    if (url) {
      const parts = url.split("/");
      const doubanId = parts.pop();
      const typeName = mediaType === "movie" ? "\u7535\u5F71" : "\u7535\u89C6\u5267";
      if (doubanId) {
        doubanIds.push({
          layout: "subject",
          target_id: doubanId,
          type_name: typeName,
          target: { cover_url: doubanInfo.data?.image, title: doubanInfo.data?.alt_title }
        });
      }
    }
  }
  async getDoubanIdByTmdbId(mediaType, tmdbId) {
    try {
      const doubanIds = [];
      const response = await getTmdbExternalIds(mediaType, tmdbId);
      const imdbId = response.data?.imdb_id;
      if (!imdbId) return [];
      if (mediaType === "movie") {
        await this._getDoubanInfo(imdbId, mediaType, doubanIds);
      } else {
        const seasons = await getImdbSeasons(imdbId);
        log("info", "imdb seasons:", seasons.data.seasons);
        const seasonPromises = (seasons?.data?.seasons ?? []).map(async (season) => {
          let finalImdbId = imdbId;
          log("info", "imdb season:", season.season);
          try {
            if (Number(season.season) !== 1) {
              const episodes = await getImdbepisodes(imdbId, season.season);
              finalImdbId = episodes.data?.episodes.find((ep) => ep.episodeNumber === 1)?.id ?? "";
            }
            await this._getDoubanInfo(finalImdbId, mediaType, doubanIds);
          } catch (error) {
            log("error", `\u5904\u7406\u7B2C ${season.season} \u5B63\u5931\u8D25\uFF0C\u7EE7\u7EED\u6267\u884C\u5176\u4ED6\u5B63:`, error);
          }
        });
        await Promise.all(seasonPromises);
      }
      return doubanIds;
    } catch (error) {
      log("error", "getTmdbIds error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async search(keyword) {
    try {
      const response = await searchTmdbTitles(keyword);
      const data = response.data;
      let tmpAnimes = [];
      let tmdbItems = [];
      if (data?.results?.length > 0) {
        tmdbItems = data.results.filter((item) => (item.name || item.title) === keyword);
      }
      log("info", `tmdb items.length: ${tmdbItems.length}`);
      const doubanPromises = tmdbItems.map(async (tmdbItem) => {
        try {
          const doubanIds = await this.getDoubanIdByTmdbId(tmdbItem.media_type, tmdbItem.id);
          return doubanIds;
        } catch (error) {
          log("error", `\u83B7\u53D6 TMDB ID ${tmdbItem.id} \u7684\u8C46\u74E3 ID \u5931\u8D25\uFF0C\u7EE7\u7EED\u5904\u7406\u5176\u4ED6\u6761\u76EE:`, error);
          return [];
        }
      });
      const doubanResults = await Promise.all(doubanPromises);
      tmpAnimes = [...tmpAnimes, ...doubanResults.flat()];
      return tmpAnimes;
    } catch (error) {
      log("error", "getTmdbAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes, vodName) {
    return this.doubanSource.handleAnimes(sourceAnimes, queryTitle, curAnimes, vodName);
  }
  async getEpisodeDanmu(id) {
  }
  formatComments(comments) {
  }
};

// danmu_api/sources/douban.js
var DoubanSource = class extends BaseSource {
  constructor(tencentSource2, iqiyiSource2, youkuSource2, bilibiliSource2) {
    super("BaseSource");
    this.tencentSource = tencentSource2;
    this.iqiyiSource = iqiyiSource2;
    this.youkuSource = youkuSource2;
    this.bilibiliSource = bilibiliSource2;
  }
  async search(keyword) {
    try {
      const response = await searchDoubanTitles(keyword);
      const data = response.data;
      let tmpAnimes = [];
      if (data?.subjects?.items?.length > 0) {
        tmpAnimes = [...tmpAnimes, ...data.subjects.items];
      }
      if (data?.smart_box?.length > 0) {
        tmpAnimes = [...tmpAnimes, ...data.smart_box];
      }
      log("info", `douban animes.length: ${tmpAnimes.length}`);
      return tmpAnimes;
    } catch (error) {
      log("error", "getDoubanAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes, vodName) {
    const doubanAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Douban] sourceAnimes is not a valid array");
      return [];
    }
    const processDoubanAnimes = await Promise.allSettled(sourceAnimes.map(async (anime) => {
      try {
        if (anime?.layout !== "subject") return;
        const doubanId = anime.target_id;
        let animeType = anime?.type_name;
        if (animeType !== "\u7535\u5F71" && animeType !== "\u7535\u89C6\u5267") return;
        log("info", "doubanId: ", doubanId, anime?.target?.title, animeType);
        const response = await getDoubanDetail(doubanId);
        const results = [];
        for (const vendor of response.data?.vendors ?? []) {
          if (!vendor) {
            continue;
          }
          log("info", "vendor uri: ", vendor.uri);
          if (response.data?.genres.includes("\u771F\u4EBA\u79C0")) {
            animeType = "\u7EFC\u827A";
          } else if (response.data?.genres.includes("\u7EAA\u5F55\u7247")) {
            animeType = "\u7EAA\u5F55\u7247";
          } else if (animeType === "\u7535\u89C6\u5267" && response.data?.genres.includes("\u52A8\u753B") && response.data?.countries.some((country) => country.includes("\u4E2D\u56FD"))) {
            animeType = "\u56FD\u6F2B";
          } else if (animeType === "\u7535\u89C6\u5267" && response.data?.genres.includes("\u52A8\u753B") && response.data?.countries.includes("\u65E5\u672C")) {
            animeType = "\u65E5\u756A";
          } else if (animeType === "\u7535\u89C6\u5267" && response.data?.genres.includes("\u52A8\u753B")) {
            animeType = "\u52A8\u6F2B";
          } else if (animeType === "\u7535\u5F71" && response.data?.genres.includes("\u52A8\u753B")) {
            animeType = "\u52A8\u753B\u7535\u5F71";
          } else if (animeType === "\u7535\u5F71" && response.data?.countries.some((country) => country.includes("\u4E2D\u56FD"))) {
            animeType = "\u534E\u8BED\u7535\u5F71";
          } else if (animeType === "\u7535\u5F71") {
            animeType = "\u5916\u8BED\u7535\u5F71";
          } else if (animeType === "\u7535\u89C6\u5267" && response.data?.countries.some((country) => country.includes("\u4E2D\u56FD"))) {
            animeType = "\u56FD\u4EA7\u5267";
          } else if (animeType === "\u7535\u89C6\u5267" && response.data?.countries.some((country) => ["\u65E5\u672C", "\u97E9\u56FD"].includes(country))) {
            animeType = "\u65E5\u97E9\u5267";
          } else if (animeType === "\u7535\u89C6\u5267" && response.data?.countries.some(
            (country) => ["\u7F8E\u56FD", "\u82F1\u56FD", "\u52A0\u62FF\u5927", "\u6CD5\u56FD", "\u5FB7\u56FD", "\u610F\u5927\u5229", "\u897F\u73ED\u7259", "\u6FB3\u5927\u5229\u4E9A"].includes(country)
          )) {
            animeType = "\u6B27\u7F8E\u5267";
          }
          const tmpAnimes = [{
            title: response.data?.title,
            year: response.data?.year,
            type: animeType,
            imageUrl: anime?.target?.cover_url
          }];
          switch (vendor.id) {
            case "qq": {
              const cid = new URL(vendor.uri).searchParams.get("cid");
              if (cid) {
                tmpAnimes[0].provider = "tencent";
                tmpAnimes[0].mediaId = cid;
                await this.tencentSource.handleAnimes(tmpAnimes, response.data?.title, doubanAnimes);
              }
              break;
            }
            case "iqiyi": {
              const tvid = new URL(vendor.uri).searchParams.get("tvid");
              if (tvid) {
                tmpAnimes[0].provider = "iqiyi";
                tmpAnimes[0].mediaId = anime?.type_name === "\u7535\u5F71" ? `movie_${tvid}` : tvid;
                await this.iqiyiSource.handleAnimes(tmpAnimes, response.data?.title, doubanAnimes);
              }
              break;
            }
            case "youku": {
              const showId = new URL(vendor.uri).searchParams.get("showid");
              if (showId) {
                tmpAnimes[0].provider = "youku";
                tmpAnimes[0].mediaId = showId;
                await this.youkuSource.handleAnimes(tmpAnimes, response.data?.title, doubanAnimes);
              }
              break;
            }
            case "bilibili": {
              const seasonId = new URL(vendor.uri).pathname.split("/").pop();
              if (seasonId) {
                tmpAnimes[0].provider = "bilibili";
                tmpAnimes[0].mediaId = `ss${seasonId}`;
                await this.bilibiliSource.handleAnimes(tmpAnimes, response.data?.title, doubanAnimes);
              }
              break;
            }
          }
        }
        return results;
      } catch (error) {
        log("error", `[Douban] Error processing anime: ${error.message}`);
        return [];
      }
    }));
    this.sortAndPushAnimesByYear(doubanAnimes, curAnimes);
    return processDoubanAnimes;
  }
  async getEpisodeDanmu(id) {
  }
  formatComments(comments) {
  }
};

// danmu_api/sources/renren.js
var RenrenSource = class extends BaseSource {
  constructor() {
    super(...arguments);
    __publicField(this, "API_CONFIG", {
      SECRET_KEY: "cf65GPholnICgyw1xbrpA79XVkizOdMq",
      SEARCH_HOST: "api.qwdjapp.com",
      DRAMA_HOST: "api.zhimeisj.top",
      DANMU_HOST: "static-dm.qwdjapp.com",
      APP_VERSION: "10.31.2",
      USER_AGENT: "Mozilla/5.0 (Linux; Android 16; 23127PN0CC Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36 App/RRSPApp platform/android AppVersion/10.31.2"
    });
  }
  generateAppCommonHeaders(timestamp, sign, xCaSign = null) {
    const headers = {
      "User-Agent": this.API_CONFIG.USER_AGENT,
      "deviceId": "T2%2Bjh%2FnHhJkWEzPnQT2E0%2FEw865FTT0uL%2BiBwRa2ZdM%3D",
      "aliId": "aUzmLtnZIYoDAA9KyLdcLQpM",
      "umId": "53e0f078fa8474ae7ba412f766989b54od",
      "clientType": "android_rrsp_xb_XiaoMi",
      "t": timestamp.toString(),
      "sign": sign,
      "isAgree": "1",
      "cv": this.API_CONFIG.APP_VERSION,
      "ct": "android_rrsp_xb_XiaoMi",
      "pkt": "rrmj",
      "p": "Android",
      "wcode": "3",
      "et": "2",
      "uet": "1",
      "folding-screen": "1",
      "Accept": "application/json",
      "Accept-Encoding": "gzip",
      "Connection": "close"
    };
    if (xCaSign) {
      headers["x-ca-sign"] = xCaSign;
      headers["x-ca-method"] = "1";
    }
    return headers;
  }
  async searchAppContent(keyword, size = 15) {
    try {
      const timestamp = Date.now();
      const path2 = "/search/content";
      const queryParams = {
        keywords: keyword,
        size,
        search_after: "",
        order: "match",
        isAgeLimit: false
      };
      const sign = generateSign(path2, timestamp, queryParams, this.API_CONFIG.SECRET_KEY);
      const queryString = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v === null || v === void 0 ? "" : String(v))}`).join("&");
      const xCaSign = generateXCaSign(path2, timestamp, queryString, this.API_CONFIG.SECRET_KEY);
      const headers = this.generateAppCommonHeaders(timestamp, sign, xCaSign);
      headers["Host"] = this.API_CONFIG.SEARCH_HOST;
      headers["Origin"] = "https://d.rrsp.com.cn";
      headers["Referer"] = "https://d.rrsp.com.cn/";
      const resp = await Widget.http.get(`https://${this.API_CONFIG.SEARCH_HOST}${path2}?${queryString}`, {
        headers,
        retries: 1
      });
      if (!resp.data) return [];
      if (resp?.data?.code === "0001") return [];
      const list = resp?.data?.data?.searchDramaList || [];
      return list.map((item) => ({
        provider: "renren",
        mediaId: String(item.id),
        title: String(item.title || "").replace(/<[^>]+>/g, "").replace(/:/g, "\uFF1A"),
        type: "tv_series",
        season: null,
        year: item.year,
        imageUrl: item.cover,
        episodeCount: item.episodeTotal,
        currentEpisodeIndex: null
      }));
    } catch (error) {
      const msg = String(error?.message || "");
      const is418 = /status:\s*418\b/.test(msg);
      if (is418) {
        log("warn", "[Renren] /search/content \u88AB\u670D\u52A1\u7AEF\u62E6\u622A (418)\uFF0C\u5DF2\u964D\u7EA7\u4E3A\u5907\u7528\u641C\u7D22\u63A5\u53E3");
        return [];
      }
      log("error", "[Renren] searchAppContent error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getAppDramaDetail(dramaId, episodeSid = "") {
    try {
      if (!episodeSid) episodeSid = generateRandomSid();
      const timestamp = Date.now();
      const path2 = "/app/drama/page";
      const queryParams = {
        isAgeLimit: false,
        dramaId,
        episodeSid,
        quality: "SD",
        subtitle: 3,
        hsdrOpen: 1,
        hevcOpen: 1,
        tria4k: 1
      };
      const sign = generateSign(path2, timestamp, queryParams, this.API_CONFIG.SECRET_KEY);
      const queryString = Object.entries(queryParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
      const headers = this.generateAppCommonHeaders(timestamp, sign);
      headers["Host"] = this.API_CONFIG.DRAMA_HOST;
      headers["ignore"] = "false";
      const resp = await Widget.http.get(`https://${this.API_CONFIG.DRAMA_HOST}${path2}?${queryString}`, {
        headers,
        retries: 1
      });
      if (!resp.data) return null;
      return resp.data;
    } catch (error) {
      log("error", "[Renren] getAppDramaDetail error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return null;
    }
  }
  // ========== 弹幕API ==========
  async getAppDanmu(episodeSid) {
    try {
      const timestamp = Date.now();
      const path2 = `/v1/produce/danmu/emo/EPISODE/${episodeSid}`;
      const sign = generateSign(path2, timestamp, {}, this.API_CONFIG.SECRET_KEY);
      const xCaSign = generateXCaSign(path2, timestamp, "", this.API_CONFIG.SECRET_KEY);
      const headers = this.generateAppCommonHeaders(timestamp, sign, xCaSign);
      headers["Host"] = this.API_CONFIG.DANMU_HOST;
      const resp = await Widget.http.get(`https://${this.API_CONFIG.DANMU_HOST}${path2}`, {
        headers,
        retries: 1
      });
      if (!resp.data) return null;
      return resp.data;
    } catch (error) {
      log("error", "[Renren] getAppDanmu error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return null;
    }
  }
  parseRRSPPFields(pField) {
    const parts = String(pField).split(",");
    const num = (i, cast, dft) => {
      try {
        return cast(parts[i]);
      } catch {
        return dft;
      }
    };
    const timestamp = num(0, parseFloat, 0);
    const mode = num(1, (x) => parseInt(x, 10), 1);
    const size = num(2, (x) => parseInt(x, 10), 25);
    const color = num(3, (x) => parseInt(x, 10), 16777215);
    const userId = parts[6] || "";
    const contentId = parts[7] || `${timestamp}:${userId}`;
    return { timestamp, mode, size, color, userId, contentId };
  }
  generateSignature(method, aliId, ct, cv, timestamp, path2, sortedQuery, secret) {
    const signStr = `${method.toUpperCase()}
aliId:${aliId}
ct:${ct}
cv:${cv}
t:${timestamp}
${path2}?${sortedQuery}`;
    return createHmacSha256(secret, signStr);
  }
  buildSignedHeaders({ method, url, params = {}, deviceId, token }) {
    const ClientProfile = {
      client_type: "web_pc",
      client_version: "1.0.0",
      user_agent: "Mozilla/5.0",
      origin: "https://rrsp.com.cn",
      referer: "https://rrsp.com.cn/"
    };
    const pathname = getPathname(url);
    const qs = sortedQueryString(params);
    const nowMs = Date.now();
    const SIGN_SECRET = "ES513W0B1CsdUrR13Qk5EgDAKPeeKZY";
    const xCaSign = this.generateSignature(
      method,
      deviceId,
      ClientProfile.client_type,
      ClientProfile.client_version,
      nowMs,
      pathname,
      qs,
      SIGN_SECRET
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
      Referer: ClientProfile.referer
    };
  }
  async renrenHttpGet(url, { params = {}, headers = {} } = {}) {
    const u = updateQueryString(url, params);
    const resp = await Widget.http.get(u, {
      headers,
      retries: 1
    });
    return resp;
  }
  generateDeviceId() {
    return Math.random().toString(36).slice(2).toUpperCase();
  }
  async renrenRequest(method, url, params = {}) {
    const deviceId = this.generateDeviceId();
    const headers = this.buildSignedHeaders({ method, url, params, deviceId });
    const resp = await Widget.http.get(url + "?" + sortedQueryString(params), {
      headers,
      retries: 1
    });
    return resp;
  }
  async performNetworkSearch(keyword, { lockRef = null, lastRequestTimeRef = { value: 0 }, minInterval = 500 } = {}) {
    try {
      const url = `https://api.rrmj.plus/m-station/search/drama`;
      const params = {
        keywords: keyword,
        size: 20,
        order: "match",
        search_after: "",
        isExecuteVipActivity: true
      };
      if (lockRef) {
        while (lockRef.value) await new Promise((r) => setTimeout(r, 50));
        lockRef.value = true;
      }
      const now = Date.now();
      const dt = now - lastRequestTimeRef.value;
      if (dt < minInterval) await new Promise((r) => setTimeout(r, minInterval - dt));
      const resp = await this.renrenRequest("GET", url, params);
      lastRequestTimeRef.value = Date.now();
      if (lockRef) lockRef.value = false;
      if (!resp.data) return [];
      const decoded = autoDecode(resp.data);
      const list = decoded?.data?.searchDramaList || [];
      return list.map((item) => ({
        provider: "renren",
        mediaId: String(item.id),
        title: String(item.title || "").replace(/<[^>]+>/g, "").replace(/:/g, "\uFF1A"),
        type: "tv_series",
        season: null,
        year: item.year,
        imageUrl: item.cover,
        episodeCount: item.episodeTotal,
        currentEpisodeIndex: null
      }));
    } catch (error) {
      log("error", "[Renren] performNetworkSearch error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async search(keyword) {
    const parsedKeyword = { title: keyword, season: null };
    const searchTitle = parsedKeyword.title;
    const searchSeason = parsedKeyword.season;
    let allResults = [];
    if (allResults.length === 0) {
      log("info", "[Renren] APP \u641C\u7D22\u65E0\u7ED3\u679C\uFF0C\u964D\u7EA7\u5230\u7F51\u9875\u63A5\u53E3");
      const lock = { value: false };
      const lastRequestTime = { value: 0 };
      allResults = await this.performNetworkSearch(searchTitle, {
        lockRef: lock,
        lastRequestTimeRef: lastRequestTime,
        minInterval: 400
      });
    }
    if (searchSeason == null) return allResults;
    return allResults.filter((r) => r.season === searchSeason);
  }
  async getDetail(id) {
    const url = `https://api.rrmj.plus/m-station/drama/page`;
    const params = { hsdrOpen: 0, isAgeLimit: 0, dramaId: String(id), hevcOpen: 1 };
    const fallbackResp = await this.renrenRequest("GET", url, params);
    if (!fallbackResp.data) return null;
    const decoded = autoDecode(fallbackResp.data);
    return decoded?.data || null;
  }
  async getEpisodes(id) {
    const detail = await this.getDetail(id);
    if (!detail || !detail.episodeList) return [];
    let episodes = [];
    detail.episodeList.forEach((ep, idx) => {
      const sid = String(ep.sid || "").trim();
      if (!sid) return;
      const title = String(ep.title || `\u7B2C${String(idx + 1).padStart(2, "0")}\u96C6`);
      episodes.push({ sid, order: idx + 1, title });
    });
    return episodes.map((e) => ({
      provider: "renren",
      episodeId: e.sid,
      title: e.title,
      episodeIndex: e.order,
      url: null
    }));
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Renren] sourceAnimes is not a valid array");
      return [];
    }
    await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.mediaId);
          let links = [];
          for (const ep of eps) {
            links.push({
              "name": ep.episodeIndex.toString(),
              "url": ep.episodeId,
              "title": `\u3010${ep.provider}\u3011 ${ep.title}`
            });
          }
          if (links.length > 0) {
            let transformedAnime = {
              animeId: Number(anime.mediaId),
              bangumiId: String(anime.mediaId),
              animeTitle: `${anime.title}(${anime.year})\u3010${anime.type}\u3011from renren`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "renren"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) {
              removeEarliestAnime();
            }
          }
        } catch (error) {
          log("error", `[Renren] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return tmpAnimes;
  }
  async getEpisodeDanmu(id) {
    const ClientProfile = {
      user_agent: "Mozilla/5.0",
      origin: "https://rrsp.com.cn",
      referer: "https://rrsp.com.cn/"
    };
    const url = `https://static-dm.rrmj.plus/v1/produce/danmu/EPISODE/${id}`;
    const headers = {
      "Accept": "application/json",
      "User-Agent": ClientProfile.user_agent,
      "Origin": ClientProfile.origin,
      "Referer": ClientProfile.referer
    };
    const fallbackResp = await this.renrenHttpGet(url, { headers });
    if (!fallbackResp.data) return null;
    const data = autoDecode(fallbackResp.data);
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return null;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "[Renren] \u83B7\u53D6\u5F39\u5E55\u5206\u6BB5\u5217\u8868:", id);
    return new SegmentListResponse({
      "type": "renren",
      "segmentList": [{
        "type": "renren",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": id
      }]
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getEpisodeDanmu(segment.url);
  }
  formatComments(comments) {
    return comments.map((item) => {
      const text = String(item.d || "");
      const meta = this.parseRRSPPFields(item.p);
      return {
        cid: Number(meta.contentId),
        p: `${meta.timestamp.toFixed(2)},${meta.mode},${meta.color},[renren]`,
        m: text,
        t: meta.timestamp
      };
    });
  }
};

// danmu_api/sources/hanjutv.js
var HanjutvSource = class extends BaseSource {
  async search(keyword) {
    try {
      const resp = await Widget.http.get(`https://hxqapi.hiyun.tv/wapi/search/aggregate/search?keyword=${keyword}&scope=101&page=1`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!resp || !resp.data) {
        log("info", "hanjutvSearchresp: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.seriesData || !resp.data.seriesData.seriesList) {
        log("info", "hanjutvSearchresp: seriesData \u6216 seriesList \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `hanjutvSearchresp: ${JSON.stringify(resp.data.seriesData.seriesList)}`);
      let resList = [];
      for (const anime of resp.data.seriesData.seriesList) {
        const animeId = convertToAsciiSum(anime.sid);
        resList.push({ ...anime, animeId });
      }
      return resList;
    } catch (error) {
      log("error", "getHanjutvAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getDetail(id) {
    try {
      const resp = await Widget.http.get(`https://hxqapi.hiyun.tv/wapi/series/series/detail?sid=${id}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!resp || !resp.data) {
        log("info", "getHanjutvDetail: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.series) {
        log("info", "getHanjutvDetail: series \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `getHanjutvDetail: ${JSON.stringify(resp.data.series)}`);
      return resp.data.series;
    } catch (error) {
      log("error", "getHanjutvDetail error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      const resp = await Widget.http.get(`https://hxqapi.hiyun.tv/wapi/series/series/detail?sid=${id}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!resp || !resp.data) {
        log("info", "getHanjutvEposides: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.episodes) {
        log("info", "getHanjutvEposides: episodes \u4E0D\u5B58\u5728");
        return [];
      }
      const sortedEpisodes = resp.data.episodes.sort((a, b) => a.serialNo - b.serialNo);
      log("info", `getHanjutvEposides: ${JSON.stringify(sortedEpisodes)}`);
      return sortedEpisodes;
    } catch (error) {
      log("error", "getHanjutvEposides error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const cateMap = { 1: "\u97E9\u5267", 2: "\u7EFC\u827A", 3: "\u7535\u5F71", 4: "\u65E5\u5267", 5: "\u7F8E\u5267", 6: "\u6CF0\u5267", 7: "\u56FD\u4EA7\u5267" };
    function getCategory(key) {
      return cateMap[key] || "\u5176\u4ED6";
    }
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Hanjutv] sourceAnimes is not a valid array");
      return [];
    }
    const processHanjutvAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.name, queryTitle)).map(async (anime) => {
        try {
          const detail = await this.getDetail(anime.sid);
          const eps = await this.getEpisodes(anime.sid);
          let links = [];
          for (const ep of eps) {
            const epTitle = ep.title && ep.title.trim() !== "" ? `\u7B2C${ep.serialNo}\u96C6\uFF1A${ep.title}` : `\u7B2C${ep.serialNo}\u96C6`;
            links.push({
              "name": epTitle,
              "url": ep.pid,
              "title": `\u3010hanjutv\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            let transformedAnime = {
              animeId: anime.animeId,
              bangumiId: String(anime.animeId),
              animeTitle: `${anime.name}(${new Date(anime.updateTime).getFullYear()})\u3010${getCategory(detail.category)}\u3011from hanjutv`,
              type: getCategory(detail.category),
              typeDescription: getCategory(detail.category),
              imageUrl: anime.image.thumb,
              startDate: generateValidStartDate(new Date(anime.updateTime).getFullYear()),
              episodeCount: links.length,
              rating: detail.rank,
              isFavorited: true,
              source: "hanjutv"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Hanjutv] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processHanjutvAnimes;
  }
  async getEpisodeDanmu(id) {
    let allDanmus = [];
    let fromAxis = 0;
    const maxAxis = 1e8;
    try {
      while (fromAxis < maxAxis) {
        const resp = await Widget.http.get(`https://hxqapi.zmdcq.com/api/danmu/playItem/list?fromAxis=${fromAxis}&pid=${id}&toAxis=${maxAxis}`, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          },
          retries: 1
        });
        if (resp.data && resp.data.danmus) {
          allDanmus = allDanmus.concat(resp.data.danmus);
        }
        const nextAxis = resp.data.nextAxis || maxAxis;
        if (nextAxis >= maxAxis) {
          break;
        }
        fromAxis = nextAxis;
      }
      return allDanmus;
    } catch (error) {
      log("error", "fetchHanjutvEpisodeDanmu error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return allDanmus;
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u97E9\u5267TV\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    return new SegmentListResponse({
      "type": "hanjutv",
      "segmentList": [{
        "type": "hanjutv",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": id
      }]
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getEpisodeDanmu(segment.url);
  }
  formatComments(comments) {
    return comments.map((c) => ({
      cid: Number(c.did),
      p: `${(c.t / 1e3).toFixed(2)},${c.tp === 2 ? 5 : c.tp},${Number(c.sc)},[hanjutv]`,
      m: c.con,
      t: Math.round(c.t / 1e3)
    }));
  }
};

// danmu_api/sources/bahamut.js
var BahamutSource = class extends BaseSource {
  async search(keyword) {
    try {
      const traditionalizedKeyword = traditionalized(keyword);
      const tmdbSearchKeyword = keyword;
      const encodedKeyword = encodeURIComponent(traditionalizedKeyword);
      log("info", `[Bahamut] \u539F\u59CB\u641C\u7D22\u8BCD: ${keyword}`);
      log("info", `[Bahamut] \u5DF4\u54C8\u4F7F\u7528\u641C\u7D22\u8BCD: ${traditionalizedKeyword}`);
      const tmdbAbortController = new AbortController();
      const originalSearchPromise = (async () => {
        try {
          const targetUrl = `https://api.gamer.com.tw/mobile_app/anime/v1/search.php?kw=${encodedKeyword}`;
          const url = globals.makeProxyUrl(targetUrl);
          const originalResp = await Widget.http.get(url, {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Anime/2.29.2 (7N5749MM3F.tw.com.gamer.anime; build:972; iOS 26.0.0) Alamofire/5.6.4"
            }
          });
          if (originalResp && originalResp.data && originalResp.data.anime && originalResp.data.anime.length > 0) {
            tmdbAbortController.abort();
            const anime = originalResp.data.anime;
            for (const a of anime) {
              try {
                a._originalQuery = keyword;
                a._searchUsedTitle = traditionalizedKeyword;
              } catch (e) {
              }
            }
            log("info", `bahamutSearchresp (original): ${JSON.stringify(anime)}`);
            log("info", `[Bahamut] \u8FD4\u56DE ${anime.length} \u6761\u7ED3\u679C (source: original)`);
            return { success: true, data: anime, source: "original" };
          }
          log("info", `[Bahamut] \u539F\u59CB\u641C\u7D22\u6210\u529F\uFF0C\u4F46\u672A\u8FD4\u56DE\u4EFB\u4F55\u7ED3\u679C (source: original)`);
          return { success: false, source: "original" };
        } catch (error) {
          log("error", "[Bahamut] \u539F\u59CB\u641C\u7D22\u5931\u8D25:", {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          return { success: false, source: "original" };
        }
      })();
      const tmdbSearchPromise = (async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const tmdbResult2 = await getTmdbJaOriginalTitle(tmdbSearchKeyword, tmdbAbortController.signal, "Bahamut");
          if (!tmdbResult2 || !tmdbResult2.title) {
            log("info", "[Bahamut] TMDB\u8F6C\u6362\u672A\u8FD4\u56DE\u7ED3\u679C\uFF0C\u53D6\u6D88\u65E5\u8BED\u539F\u540D\u641C\u7D22");
            return { success: false, source: "tmdb" };
          }
          const { title: tmdbTitle, cnAlias } = tmdbResult2;
          log("info", `[Bahamut] \u4F7F\u7528\u65E5\u8BED\u539F\u540D\u8FDB\u884C\u641C\u7D22: ${tmdbTitle}`);
          const encodedTmdbTitle = encodeURIComponent(tmdbTitle);
          const targetUrl = `https://api.gamer.com.tw/mobile_app/anime/v1/search.php?kw=${encodedTmdbTitle}`;
          const tmdbSearchUrl = globals.makeProxyUrl(targetUrl);
          const tmdbResp = await Widget.http.get(tmdbSearchUrl, {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Anime/2.29.2 (7N5749MM3F.tw.com.gamer.anime; build:972; iOS 26.0.0) Alamofire/5.6.4"
            },
            signal: tmdbAbortController.signal
          });
          if (tmdbResp && tmdbResp.data && tmdbResp.data.anime && tmdbResp.data.anime.length > 0) {
            const anime = tmdbResp.data.anime;
            for (const a of anime) {
              try {
                a._originalQuery = keyword;
                a._searchUsedTitle = tmdbTitle;
                a._tmdbCnAlias = cnAlias;
              } catch (e) {
              }
            }
            log("info", `bahamutSearchresp (TMDB): ${JSON.stringify(anime)}`);
            log("info", `[Bahamut] \u8FD4\u56DE ${anime.length} \u6761\u7ED3\u679C (source: tmdb)`);
            return { success: true, data: anime, source: "tmdb" };
          }
          log("info", `[Bahamut] \u65E5\u8BED\u539F\u540D\u641C\u7D22\u6210\u529F\uFF0C\u4F46\u672A\u8FD4\u56DE\u4EFB\u4F55\u7ED3\u679C (source: tmdb)`);
          return { success: false, source: "tmdb" };
        } catch (error) {
          if (error.name === "AbortError") {
            log("info", "[Bahamut] \u539F\u59CB\u641C\u7D22\u6210\u529F\uFF0C\u4E2D\u65AD\u65E5\u8BED\u539F\u540D\u641C\u7D22");
            return { success: false, source: "tmdb", aborted: true };
          }
          throw error;
        }
      })();
      const [originalResult, tmdbResult] = await Promise.all([
        originalSearchPromise,
        tmdbSearchPromise
      ]);
      if (originalResult.success) {
        return originalResult.data;
      }
      if (tmdbResult.success) {
        return tmdbResult.data;
      }
      log("info", "[Bahamut] \u539F\u59CB\u641C\u7D22\u548C\u57FA\u4E8ETMDB\u7684\u641C\u7D22\u5747\u672A\u8FD4\u56DE\u4EFB\u4F55\u7ED3\u679C");
      return [];
    } catch (error) {
      log("error", "getBahamutAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      const targetUrl = `https://api.gamer.com.tw/anime/v1/video.php?videoSn=${id}`;
      const url = globals.makeProxyUrl(targetUrl);
      const resp = await Widget.http.get(url, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Anime/2.29.2 (7N5749MM3F.tw.com.gamer.anime; build:972; iOS 26.0.0) Alamofire/5.6.4"
        }
      });
      if (!resp || !resp.data) {
        log("info", "getBahamutEposides: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.data || !resp.data.data.video || !resp.data.data.anime) {
        log("info", "getBahamutEposides: video \u6216 anime \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `getBahamutEposides: ${JSON.stringify(resp.data.data)}`);
      return resp.data.data;
    } catch (error) {
      log("error", "getBahamutEposides error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    queryTitle = traditionalized(queryTitle);
    function bahamutTitleMatches(itemTitle, queryTitle2, searchUsedTitle) {
      if (!itemTitle) return false;
      const tItem = String(itemTitle);
      const q = String(queryTitle2 || "");
      const used = String(searchUsedTitle || "");
      if (globals.strictTitleMatch) {
        if (strictTitleMatch(tItem, q)) return true;
        if (used && strictTitleMatch(tItem, used)) return true;
        try {
          if (strictTitleMatch(tItem, traditionalized(q))) return true;
          if (strictTitleMatch(tItem, simplized(q))) return true;
          if (used) {
            if (strictTitleMatch(tItem, traditionalized(used))) return true;
            if (strictTitleMatch(tItem, simplized(used))) return true;
          }
        } catch (e) {
        }
        return false;
      }
      const normalizedItem = normalizeSpaces(tItem);
      const normalizedQ = normalizeSpaces(q);
      const normalizedUsed = used ? normalizeSpaces(used) : "";
      if (normalizedItem.includes(normalizedQ)) return true;
      if (normalizedUsed && normalizedItem.includes(normalizedUsed)) return true;
      try {
        if (normalizedItem.includes(normalizeSpaces(traditionalized(q)))) return true;
        if (normalizedItem.includes(normalizeSpaces(simplized(q)))) return true;
        if (normalizedUsed) {
          if (normalizedItem.includes(normalizeSpaces(traditionalized(used)))) return true;
          if (normalizedItem.includes(normalizeSpaces(simplized(used)))) return true;
        }
      } catch (e) {
      }
      try {
        if (normalizedItem.toLowerCase().includes(normalizedQ.toLowerCase())) return true;
        if (normalizedUsed && normalizedItem.toLowerCase().includes(normalizedUsed.toLowerCase())) return true;
      } catch (e) {
      }
      return false;
    }
    const arr = Array.isArray(sourceAnimes) ? sourceAnimes : [];
    const filtered = arr.filter((item) => {
      const itemTitle = item.title || "";
      const usedSearchTitle = item._searchUsedTitle || item._originalQuery || "";
      if (item._searchUsedTitle && item._searchUsedTitle !== queryTitle) {
        log("info", `[Bahamut] TMDB\u7ED3\u679C\u76F4\u63A5\u4FDD\u7559: ${itemTitle}`);
        return true;
      }
      return bahamutTitleMatches(itemTitle, queryTitle, usedSearchTitle);
    });
    const cnAlias = filtered.length > 0 ? filtered[0]._tmdbCnAlias : null;
    smartTitleReplace(filtered, cnAlias);
    const processBahamutAnimes = await Promise.all(filtered.map(async (anime) => {
      try {
        const epData = await this.getEpisodes(anime.video_sn);
        const detail = epData.video;
        let eps = null;
        if (epData.anime.episodes) {
          eps = epData.anime.episodes["0"] || Object.values(epData.anime.episodes)[0];
        }
        let links = [];
        if (eps && Array.isArray(eps)) {
          for (const ep of eps) {
            const epTitle = `\u7B2C${ep.episode}\u96C6`;
            links.push({
              "name": ep.episode.toString(),
              "url": ep.videoSn.toString(),
              "title": `\u3010bahamut\u3011 ${epTitle}`
            });
          }
        }
        if (links.length > 0) {
          let yearMatch = (anime.info || "").match(/(\d{4})/);
          const displayTitle = anime._displayTitle || simplized(anime.title);
          let transformedAnime = {
            animeId: anime.video_sn,
            bangumiId: String(anime.video_sn),
            animeTitle: `${displayTitle}(${(anime.info.match(/(\d{4})/) || [null])[0]})\u3010\u52A8\u6F2B\u3011from bahamut`,
            type: "\u52A8\u6F2B",
            typeDescription: "\u52A8\u6F2B",
            imageUrl: anime.cover,
            startDate: generateValidStartDate(new Date(epData.anime.seasonStart).getFullYear()),
            episodeCount: links.length,
            rating: detail.rating,
            isFavorited: true,
            source: "bahamut"
          };
          tmpAnimes.push(transformedAnime);
          addAnime({ ...transformedAnime, links });
          if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
        }
      } catch (error) {
        log("error", `[Bahamut] Error processing anime: ${error.message}`);
      }
    }));
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processBahamutAnimes;
  }
  async getEpisodeDanmu(id) {
    let danmus = [];
    try {
      const targetUrl = `https://api.gamer.com.tw/anime/v1/danmu.php?geo=TW%2CHK&videoSn=${id}`;
      const url = globals.makeProxyUrl(targetUrl);
      const resp = await Widget.http.get(url, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Anime/2.29.2 (7N5749MM3F.tw.com.gamer.anime; build:972; iOS 26.0.0) Alamofire/5.6.4"
        },
        retries: 1
      });
      if (resp.data && resp.data.data && resp.data.data.danmu) {
        danmus = resp.data.data.danmu;
      }
      return danmus;
    } catch (error) {
      log("error", "fetchBahamutEpisodeDanmu error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return danmus;
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u5DF4\u54C8\u59C6\u7279\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    return new SegmentListResponse({
      "type": "bahamut",
      "segmentList": [{
        "type": "bahamut",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": id
      }]
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getEpisodeDanmu(segment.url);
  }
  formatComments(comments) {
    const positionToMode = { 0: 1, 1: 5, 2: 4 };
    return comments.map((c) => ({
      cid: Number(c.sn),
      p: `${Math.round(c.time / 10).toFixed(2)},${positionToMode[c.position] || c.tp},${parseInt(c.color.slice(1), 16)},[bahamut]`,
      // 根据 globals.danmuSimplifiedTraditional 控制是否繁转简
      m: globals.danmuSimplifiedTraditional === "simplified" ? simplized(c.text) : c.text,
      t: Math.round(c.time / 10)
    }));
  }
};

// danmu_api/sources/dandan.js
var DandanSource = class extends BaseSource {
  async search(keyword) {
    try {
      const resp = await Widget.http.get(`https://api.danmaku.weeblify.app/ddp/v1?path=/v2/search/anime?keyword=${keyword}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `LogVar Danmu API/${globals.version}`
        }
      });
      if (!resp || !resp.data) {
        log("info", "dandanSearchresp: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.animes) {
        log("info", "dandanSearchresp: seriesData \u6216 seriesList \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `dandanSearchresp: ${JSON.stringify(resp.data.animes)}`);
      return resp.data.animes;
    } catch (error) {
      log("error", "getDandanAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      const resp = await Widget.http.get(`https://api.danmaku.weeblify.app/ddp/v1?path=/v2/bangumi/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `LogVar Danmu API/${globals.version}`
        }
      });
      if (!resp || !resp.data) {
        log("info", "getDandanEposides: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.bangumi && !resp.data.bangumi.episodes) {
        log("info", "getDandanEposides: episodes \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `getDandanEposides: ${JSON.stringify(resp.data.bangumi.episodes)}`);
      return resp.data.bangumi.episodes;
    } catch (error) {
      log("error", "getDandanEposides error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Dandan] sourceAnimes is not a valid array");
      return [];
    }
    const processDandanAnimes = await Promise.all(
      sourceAnimes.map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.animeId);
          let links = [];
          for (const ep of eps) {
            const epTitle = ep.episodeTitle && ep.episodeTitle.trim() !== "" ? `${ep.episodeTitle}` : `\u7B2C${ep.episodeNumber}\u96C6`;
            links.push({
              "name": epTitle,
              "url": ep.episodeId.toString(),
              "title": `\u3010dandan\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            let transformedAnime = {
              animeId: anime.animeId,
              bangumiId: String(anime.animeId),
              animeTitle: `${anime.animeTitle}(${new Date(anime.startDate).getFullYear()})\u3010${anime.typeDescription}\u3011from dandan`,
              type: anime.type,
              typeDescription: anime.typeDescription,
              imageUrl: anime.imageUrl,
              startDate: anime.startDate,
              episodeCount: links.length,
              rating: anime.rating,
              isFavorited: true,
              source: "dandan"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Dandan] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processDandanAnimes;
  }
  async getEpisodeDanmu(id) {
    let allDanmus = [];
    try {
      const resp = await Widget.http.get(`https://api.danmaku.weeblify.app/ddp/v1?path=%2Fv2%2Fcomment%2F${id}%3Ffrom%3D0%26withRelated%3Dtrue%26chConvert%3D0`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        retries: 1
      });
      if (resp.data && resp.data.comments) {
        allDanmus = resp.data.comments;
      }
      return allDanmus;
    } catch (error) {
      log("error", "fetchDandanEpisodeDanmu error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return allDanmus;
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u5F39\u5F39play\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    return new SegmentListResponse({
      "type": "dandan",
      "segmentList": [{
        "type": "dandan",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": id
      }]
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getEpisodeDanmu(segment.url);
  }
  formatComments(comments) {
    return comments.map((c) => ({
      cid: c.cid,
      p: `${c.p.replace(/([A-Za-z]+)([0-9a-fA-F]{6})/, (_, platform, hexColor) => {
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        const decimalColor = r * 256 * 256 + g * 256 + b;
        return `${platform}${decimalColor}`;
      })}`,
      // 根据 globals.danmuSimplifiedTraditional 控制是否繁转简
      m: globals.danmuSimplifiedTraditional === "simplified" ? simplized(c.m) : c.m
    }));
  }
};

// danmu_api/sources/custom.js
var CustomSource = class extends BaseSource {
  async search(keyword) {
    try {
      const resp = await Widget.http.get(`${globals.customSourceApiUrl}/api/v2/search/anime?keyword=${keyword}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!resp || !resp.data) {
        log("info", "customSourceSearchresp: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.animes) {
        log("info", "customSourceSearchresp: seriesData \u6216 seriesList \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `customnSourceSearchresp: ${JSON.stringify(resp.data.animes)}`);
      return resp.data.animes;
    } catch (error) {
      log("error", "getCustomSourceAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      const resp = await Widget.http.get(`${globals.customSourceApiUrl}/api/v2/bangumi/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (!resp || !resp.data) {
        log("info", "getCustomSourceEposides: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.bangumi || !resp.data.bangumi.episodes) {
        log("info", `getCustomSourceEposides: episodes \u4E0D\u5B58\u5728. Response: ${JSON.stringify(resp.data)}`);
        return [];
      }
      log("info", `getCustomSourceEposides: ${JSON.stringify(resp.data.bangumi.episodes)}`);
      return resp.data.bangumi.episodes;
    } catch (error) {
      log("error", "getCustomSourceEposides error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Custom Source] sourceAnimes is not a valid array");
      return [];
    }
    const processCustomSourceAnimes = await Promise.all(
      sourceAnimes.map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.bangumiId);
          let links = [];
          for (const ep of eps) {
            const epTitle = ep.episodeTitle && ep.episodeTitle.trim() !== "" ? `${ep.episodeTitle}` : `\u7B2C${ep.episodeNumber}\u96C6`;
            links.push({
              "name": epTitle,
              "url": ep.episodeId.toString(),
              "title": `\u3010custom\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            let transformedAnime = {
              animeId: anime.animeId,
              bangumiId: String(anime.bangumiId),
              animeTitle: `${anime.animeTitle}(${new Date(anime.startDate).getFullYear()})\u3010${anime.typeDescription}\u3011from custom`,
              type: anime.type,
              typeDescription: anime.typeDescription,
              imageUrl: anime.imageUrl,
              startDate: anime.startDate,
              episodeCount: links.length,
              rating: anime.rating,
              isFavorited: true,
              source: "custom"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Custom Source] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processCustomSourceAnimes;
  }
  async getEpisodeDanmu(id) {
    let allDanmus = [];
    try {
      const resp = await Widget.http.get(`${globals.customSourceApiUrl}/api/v2/comment/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        retries: 1
      });
      if (resp.data && resp.data.comments) {
        allDanmus = resp.data.comments;
      }
      return allDanmus;
    } catch (error) {
      log("error", "fetchCustomSourceEpisodeDanmu error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return allDanmus;
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6Custom Source\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    return new SegmentListResponse({
      "type": "custom",
      "segmentList": [{
        "type": "custom",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": id
      }]
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getEpisodeDanmu(segment.url);
  }
  formatComments(comments) {
    return comments.map((c) => ({
      cid: c.cid,
      p: `${c.p.replace(/([A-Za-z]+)([0-9a-fA-F]{6})/, (_, platform, hexColor) => {
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        const decimalColor = r * 256 * 256 + g * 256 + b;
        return `${platform}${decimalColor}`;
      })}`,
      // 根据 globals.danmuSimplifiedTraditional 控制是否繁转简
      m: globals.danmuSimplifiedTraditional === "simplified" ? simplized(c.m) : c.m
    }));
  }
};

// danmu_api/sources/tencent.js
var TencentSource = class extends BaseSource {
  /**
   * 过滤腾讯视频搜索项
   * @param {Object} item - 搜索项
   * @param {string} keyword - 搜索关键词
   * @returns {Object|null} 过滤后的结果
   */
  filterTencentSearchItem(item, keyword) {
    if (!item.videoInfo || !item.doc) {
      return null;
    }
    const videoInfo = item.videoInfo;
    const mediaId = item.doc.id;
    if (!videoInfo.year || videoInfo.year === 0) {
      return null;
    }
    if (videoInfo.subTitle === "\u5168\u7F51\u641C" || videoInfo.playFlag === 2) {
      return null;
    }
    let title = videoInfo.title.replace(/<em>/g, "").replace(/<\/em>/g, "");
    if (!title || !mediaId) {
      return null;
    }
    const contentType = videoInfo.typeName;
    if (contentType.includes("\u77ED\u5267")) {
      return null;
    }
    const allowedTypes = ["\u7535\u89C6\u5267", "\u52A8\u6F2B", "\u7535\u5F71", "\u7EAA\u5F55\u7247", "\u7EFC\u827A", "\u7EFC\u827A\u8282\u76EE"];
    if (!allowedTypes.includes(contentType)) {
      return null;
    }
    const allSites = (videoInfo.playSites || []).concat(videoInfo.episodeSites || []);
    if (allSites.length > 0 && !allSites.some((site) => site.enName === "qq")) {
      return null;
    }
    if (contentType === "\u7535\u5F71") {
      const nonFormalKeywords = ["\u82B1\u7D6E", "\u5F69\u86CB", "\u5E55\u540E", "\u72EC\u5BB6", "\u89E3\u8BF4", "\u7279\u8F91", "\u63A2\u73ED", "\u62CD\u6444", "\u5236\u4F5C", "\u5BFC\u6F14", "\u8BB0\u5F55", "\u56DE\u987E", "\u76D8\u70B9", "\u6DF7\u526A", "\u89E3\u6790", "\u62A2\u5148"];
      if (nonFormalKeywords.some((kw) => title.includes(kw))) {
        return null;
      }
    }
    const episodeCount = contentType === "\u7535\u5F71" ? 1 : videoInfo.subjectDoc ? videoInfo.subjectDoc.videoNum : 0;
    return {
      provider: "tencent",
      mediaId,
      title,
      type: contentType,
      // 使用中文类型,与360/vod保持一致
      year: videoInfo.year,
      imageUrl: videoInfo.imgUrl,
      episodeCount
    };
  }
  async search(keyword) {
    try {
      log("info", `[Tencent] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const searchUrl = "https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2";
      const payload = {
        version: "25071701",
        clientType: 1,
        filterValue: "",
        uuid: "0379274D-05A0-4EB6-A89C-878C9A460426",
        query: keyword,
        retry: 0,
        pagenum: 0,
        isPrefetch: true,
        pagesize: 30,
        queryFrom: 0,
        searchDatakey: "",
        transInfo: "",
        isneedQc: true,
        preQid: "",
        adClientInfo: "",
        extraInfo: {
          multi_terminal_pc: "1",
          themeType: "1",
          sugRelatedIds: "{}",
          appVersion: ""
        }
      };
      const headers = {
        "Content-Type": "application/json",
        "Origin": "https://v.qq.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": `https://v.qq.com/x/search/?q=${encodeURIComponent(keyword)}&stag=&smartbox_ab=`,
        "H38": "220496a1fb1498325e9be6d938",
        "H42": "335a00a80ab9bbbef56793d8e7a97e87b9341dee34ebd83d61afc0cdb303214caaece3",
        "Uk": "8e91af25d3af99d0f0640327e7307666",
        "Cookie": "tvfe_boss_uuid=ee8f05103d59226f; pgv_pvid=3155633511; video_platform=2; ptag=v_qq_com; main_login=qq"
      };
      const response = await Widget.http.post(searchUrl, JSON.stringify(payload), { headers });
      if (!response || !response.data) {
        log("info", "[Tencent] \u641C\u7D22\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (data.ret !== 0) {
        log("error", `[Tencent] API\u8FD4\u56DE\u9519\u8BEF: ${data.msg} (ret: ${data.ret})`);
        return [];
      }
      let itemList = [];
      if (data.data && data.data.areaBoxList) {
        for (const box of data.data.areaBoxList) {
          if (box.boxId === "MainNeed" && box.itemList) {
            log("info", `[Tencent] \u4ECE MainNeed box \u627E\u5230 ${box.itemList.length} \u4E2A\u9879\u76EE`);
            itemList = box.itemList;
            break;
          }
        }
      }
      if (itemList.length === 0 && data.data && data.data.normalList && data.data.normalList.itemList) {
        log("info", "[Tencent] MainNeed box \u672A\u627E\u5230\uFF0C\u4F7F\u7528 normalList");
        itemList = data.data.normalList.itemList;
      }
      if (itemList.length === 0) {
        log("info", "[Tencent] \u641C\u7D22\u65E0\u7ED3\u679C");
        return [];
      }
      const results = [];
      for (const item of itemList) {
        const filtered = this.filterTencentSearchItem(item, keyword);
        if (filtered) {
          results.push(filtered);
        }
      }
      log("info", `[Tencent] \u641C\u7D22\u627E\u5230 ${results.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return results;
    } catch (error) {
      log("error", "[Tencent] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      log("info", `[Tencent] \u83B7\u53D6\u5206\u96C6\u5217\u8868: cid=${id}`);
      const episodesUrl = "https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vversion_name=8.2.96&vversion_platform=2";
      const payload = {
        has_cache: 1,
        page_params: {
          req_from: "web_vsite",
          page_id: "vsite_episode_list",
          page_type: "detail_operation",
          id_type: "1",
          page_size: "",
          cid: id,
          vid: "",
          lid: "",
          page_num: "",
          page_context: `cid=${id}&detail_page_type=1&req_from=web_vsite&req_from_second_type=&req_type=0`,
          detail_page_type: "1"
        }
      };
      const headers = {
        "Content-Type": "application/json",
        "Origin": "https://v.qq.com",
        "Referer": `https://v.qq.com/x/cover/${id}.html`,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Accept": "application/json",
        "Accept-Language": "zh-CN,zh;q=0.9"
      };
      const response = await Widget.http.post(episodesUrl, JSON.stringify(payload), { headers });
      if (!response || !response.data) {
        log("info", "[Tencent] \u5206\u96C6\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (data.ret !== 0) {
        log("error", `[Tencent] \u5206\u96C6API\u8FD4\u56DE\u9519\u8BEF: ret=${data.ret}`);
        return [];
      }
      let tabs = [];
      if (data.data && data.data.module_list_datas) {
        for (const moduleListData of data.data.module_list_datas) {
          for (const moduleData of moduleListData.module_datas) {
            if (moduleData.module_params && moduleData.module_params.tabs) {
              try {
                tabs = JSON.parse(moduleData.module_params.tabs);
                break;
              } catch (e) {
                log("error", "[Tencent] \u89E3\u6790tabs\u5931\u8D25:", e.message);
              }
            }
          }
          if (tabs.length > 0) break;
        }
      }
      const allEpisodes = [];
      if (tabs.length === 0) {
        log("info", "[Tencent] \u672A\u627E\u5230\u5206\u9875\u4FE1\u606F,\u5C1D\u8BD5\u4ECE\u521D\u59CB\u54CD\u5E94\u4E2D\u63D0\u53D6\u5206\u96C6");
        if (data.data && data.data.module_list_datas) {
          for (const moduleListData of data.data.module_list_datas) {
            for (const moduleData of moduleListData.module_datas) {
              if (moduleData.item_data_lists && moduleData.item_data_lists.item_datas) {
                for (const item of moduleData.item_data_lists.item_datas) {
                  if (item.item_params && item.item_params.vid && item.item_params.is_trailer !== "1") {
                    allEpisodes.push({
                      vid: item.item_params.vid,
                      title: item.item_params.title,
                      unionTitle: item.item_params.union_title || item.item_params.title
                    });
                  }
                }
              }
            }
          }
        }
        if (allEpisodes.length === 0) {
          log("info", "[Tencent] \u521D\u59CB\u54CD\u5E94\u4E2D\u4E5F\u672A\u627E\u5230\u5206\u96C6\u4FE1\u606F");
          return [];
        }
        log("info", `[Tencent] \u4ECE\u521D\u59CB\u54CD\u5E94\u4E2D\u63D0\u53D6\u5230 ${allEpisodes.length} \u96C6`);
      } else {
        log("info", `[Tencent] \u627E\u5230 ${tabs.length} \u4E2A\u5206\u9875`);
        for (const tab of tabs) {
          if (!tab.page_context) continue;
          const tabPayload = {
            has_cache: 1,
            page_params: {
              req_from: "web_vsite",
              page_id: "vsite_episode_list",
              page_type: "detail_operation",
              id_type: "1",
              page_size: "",
              cid: id,
              vid: "",
              lid: "",
              page_num: "",
              page_context: tab.page_context,
              detail_page_type: "1"
            }
          };
          const tabResponse = await Widget.http.post(episodesUrl, JSON.stringify(tabPayload), { headers });
          if (!tabResponse || !tabResponse.data) continue;
          const tabData = typeof tabResponse.data === "string" ? JSON.parse(tabResponse.data) : tabResponse.data;
          if (tabData.ret !== 0 || !tabData.data) continue;
          if (tabData.data.module_list_datas) {
            for (const moduleListData of tabData.data.module_list_datas) {
              for (const moduleData of moduleListData.module_datas) {
                if (moduleData.item_data_lists && moduleData.item_data_lists.item_datas) {
                  for (const item of moduleData.item_data_lists.item_datas) {
                    if (item.item_params && item.item_params.vid && item.item_params.is_trailer !== "1") {
                      allEpisodes.push({
                        vid: item.item_params.vid,
                        title: item.item_params.title,
                        unionTitle: item.item_params.union_title || item.item_params.title
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      log("info", `[Tencent] \u5171\u83B7\u53D6 ${allEpisodes.length} \u96C6`);
      return allEpisodes;
    } catch (error) {
      log("error", "[Tencent] \u83B7\u53D6\u5206\u96C6\u51FA\u9519:", error.message);
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Tencent] sourceAnimes is not a valid array");
      return [];
    }
    const processTencentAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.mediaId);
          let links = [];
          for (let i = 0; i < eps.length; i++) {
            const ep = eps[i];
            const epTitle = ep.unionTitle || ep.title || `\u7B2C${i + 1}\u96C6`;
            const fullUrl = `https://v.qq.com/x/cover/${anime.mediaId}/${ep.vid}.html`;
            links.push({
              "name": (i + 1).toString(),
              "url": fullUrl,
              "title": `\u3010qq\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            let transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year})\u3010${anime.type}\u3011from tencent`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "tencent"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Tencent] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processTencentAnimes;
  }
  // 提取vid的公共函数
  extractVid(id) {
    let vid2 = id;
    if (typeof id === "string" && (id.startsWith("http") || id.includes("vid="))) {
      const queryMatch = id.match(/[?&]vid=([^&]+)/);
      if (queryMatch) {
        vid2 = queryMatch[1];
      } else {
        const pathParts = id.split("/");
        const lastPart = pathParts[pathParts.length - 1];
        vid2 = lastPart.split(".")[0];
      }
    }
    return vid2;
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u817E\u8BAF\u89C6\u9891\u5F39\u5E55...", id);
    let vid2 = this.extractVid(id);
    log("info", `vid: ${vid2}`);
    let res;
    try {
      res = await Widget.http.get(id, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
    } catch (error) {
      log("error", "\u8BF7\u6C42\u9875\u9762\u5931\u8D25:", error);
      return [];
    }
    const titleMatch = res.data.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].split("_")[0] : "\u672A\u77E5\u6807\u9898";
    log("info", `\u6807\u9898: ${title}`);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const promises = [];
    for (const segment of segmentList) {
      promises.push(
        httpGet(segment.url, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          },
          retries: 1
        })
      );
    }
    let contents = [];
    try {
      const results = await Promise.allSettled(promises);
      const datas = results.filter((result) => result.status === "fulfilled").map((result) => {
        if (result.value && result.value.data) {
          return result.value.data;
        }
        return null;
      }).filter((data) => data !== null);
      datas.forEach((data) => {
        data = typeof data === "string" ? JSON.parse(data) : data;
        contents.push(...data.barrage_list);
      });
    } catch (error) {
      log("error", "\u89E3\u6790\u5F39\u5E55\u6570\u636E\u5931\u8D25:", error);
      return [];
    }
    printFirst200Chars(contents);
    return contents;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u817E\u8BAF\u89C6\u9891\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    const api_danmaku_base = "https://dm.video.qq.com/barrage/base/";
    const api_danmaku_segment = "https://dm.video.qq.com/barrage/segment/";
    let vid2 = this.extractVid(id);
    log("info", `\u83B7\u53D6\u5F39\u5E55\u5206\u6BB5\u5217\u8868 - vid: ${vid2}`);
    let res;
    try {
      res = await Widget.http.get(api_danmaku_base + vid2, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
    } catch (error) {
      if (error.response?.status === 404) {
        return new SegmentListResponse({
          "type": "qq",
          "segmentList": []
        });
      }
      log("error", "\u8BF7\u6C42\u5F39\u5E55\u57FA\u7840\u6570\u636E\u5931\u8D25:", error);
      return new SegmentListResponse({
        "type": "qq",
        "segmentList": []
      });
    }
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    const segmentList = [];
    const segmentItems = Object.values(data.segment_index);
    for (const item of segmentItems) {
      segmentList.push({
        "type": "qq",
        "segment_start": (() => {
          const start2 = Number(item.segment_start) || 0;
          return start2 / 1e3;
        })(),
        "segment_end": (() => {
          const end2 = Number(item.segment_name.split("/").pop()) || 0;
          return end2 / 1e3;
        })(),
        "url": `${api_danmaku_segment}${vid2}/${item.segment_name}`
      });
    }
    return new SegmentListResponse({
      "type": "qq",
      "segmentList": segmentList
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    try {
      const response = await Widget.http.get(segment.url, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        const parsedData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        contents.push(...parsedData.barrage_list);
      }
      return contents;
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5206\u7247\u5F39\u5E55\u5931\u8D25:", error);
      return [];
    }
  }
  formatComments(comments) {
    return comments.map((item) => {
      const content = {
        timepoint: item.time_offset / 1e3,
        ct: 1,
        size: 25,
        color: 16777215,
        unixtime: Math.floor(Date.now() / 1e3),
        uid: 0,
        content: item.content
      };
      if (item.content_style && item.content_style !== "") {
        try {
          const content_style = JSON.parse(item.content_style);
          if (content_style.gradient_colors && content_style.gradient_colors.length > 0) {
            content.color = parseInt(content_style.gradient_colors[0].replace("#", ""), 16);
          } else if (content_style.color && content_style.color !== "ffffff") {
            content.color = parseInt(content_style.color.replace("#", ""), 16);
          }
          if (content_style.position === 2) {
            content.ct = 5;
          } else if (content_style.position === 3) {
            content.ct = 4;
          }
        } catch (e) {
        }
      }
      return content;
    });
  }
};

// danmu_api/sources/iqiyi.js
var _IqiyiSource = class _IqiyiSource extends BaseSource {
  /**
   * 搜索爱奇艺内容
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<Array>} 搜索结果数组
   */
  async search(keyword) {
    try {
      log("info", `[iQiyi] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const params = {
        key: keyword,
        current_page: "1",
        mode: "1",
        source: "input",
        suggest: "",
        pcv: "13.074.22699",
        version: "13.074.22699",
        pageNum: "1",
        pageSize: "25",
        pu: "",
        u: "f6440fc5d919dca1aea12b6aff56e1c7",
        scale: "200",
        token: "",
        userVip: "0",
        conduit: "",
        vipType: "-1",
        os: "",
        osShortName: "win10",
        dataType: "",
        appMode: "",
        ad: JSON.stringify({ "lm": 3, "azd": 1000000000951, "azt": 733, "position": "feed" }),
        adExt: JSON.stringify({ "r": "2.1.5-ares6-pure" })
      };
      const queryString = buildQueryString(params);
      const url = `https://mesh.if.iqiyi.com/portal/lw/search/homePageV3?${queryString}`;
      const response = await Widget.http.get(url, {
        headers: {
          "accept": "*/*",
          "origin": "https://www.iqiyi.com",
          "referer": "https://www.iqiyi.com/",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response || !response.data) {
        log("info", "[iQiyi] \u641C\u7D22\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (!data.data || !data.data.templates) {
        log("info", "[iQiyi] \u641C\u7D22\u65E0\u7ED3\u679C");
        return [];
      }
      const results = [];
      const templates = data.data.templates;
      for (const template of templates) {
        let albumsToProcess = [];
        if (template.template === 112 && template.intentAlbumInfos) {
          log("debug", `[iQiyi] \u627E\u5230\u610F\u56FE\u5361\u7247 (template 112)\uFF0C\u5904\u7406 ${template.intentAlbumInfos.length} \u4E2A\u7ED3\u679C`);
          albumsToProcess = template.intentAlbumInfos;
        } else if ([101, 102, 103].includes(template.template) && template.albumInfo) {
          log("debug", `[iQiyi] \u627E\u5230\u666E\u901A\u7ED3\u679C\u5361\u7247 (template ${template.template})`);
          albumsToProcess = [template.albumInfo];
        }
        for (const album of albumsToProcess) {
          const filtered = this._filterIqiyiSearchItem(album, keyword);
          if (filtered) {
            results.push(filtered);
          }
        }
      }
      log("info", `[iQiyi] \u641C\u7D22\u627E\u5230 ${results.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return results;
    } catch (error) {
      log("error", "[iQiyi] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  /**
   * 过滤爱奇艺搜索项
   * @param {Object} album - 搜索结果专辑信息
   * @param {string} keyword - 搜索关键词
   * @returns {Object|null} 过滤后的结果
   */
  _filterIqiyiSearchItem(album, keyword) {
    if (!album.title) {
      return null;
    }
    if (album.btnText === "\u5916\u7AD9\u4ED8\u8D39\u64AD\u653E") {
      log("debug", `[iQiyi] \u8FC7\u6EE4\u6389\u5916\u7AD9\u4ED8\u8D39\u64AD\u653E\u5185\u5BB9: ${album.title}`);
      return null;
    }
    const channel = album.channel || "";
    let mediaType = "\u7535\u89C6\u5267";
    if (channel.includes("\u7535\u5F71")) {
      mediaType = "\u7535\u5F71";
    } else if (channel.includes("\u52A8\u6F2B")) {
      mediaType = "\u52A8\u6F2B";
    } else if (channel.includes("\u7EFC\u827A")) {
      mediaType = "\u7EFC\u827A";
    } else if (channel.includes("\u7EAA\u5F55\u7247")) {
      mediaType = "\u7EAA\u5F55\u7247";
    } else if (channel.includes("\u7535\u89C6\u5267")) {
      mediaType = "\u7535\u89C6\u5267";
    } else {
      return null;
    }
    if (mediaType === "\u7535\u5F71") {
      const qipuId = album.qipuId || album.playQipuId;
      if (!qipuId) {
        log("debug", `[iQiyi] \u7535\u5F71\u7F3A\u5C11 qipuId: ${album.title}`);
        return null;
      }
      let year2 = null;
      if (album.year) {
        const yearStr = album.year.value || album.year.name;
        if (yearStr && typeof yearStr === "string" && yearStr.length === 4 && /^\d{4}$/.test(yearStr)) {
          year2 = parseInt(yearStr);
        }
      }
      const cleanedTitle2 = album.title.replace(/<[^>]+>/g, "").replace(/:/g, "\uFF1A");
      return {
        provider: "iqiyi",
        mediaId: `movie_${qipuId}`,
        // 使用特殊前缀标识电影
        title: cleanedTitle2,
        type: mediaType,
        year: year2,
        imageUrl: album.img || album.imgH,
        episodeCount: 1,
        // 电影只有1集
        _qipuId: qipuId
        // 保存原始 qipuId 供后续使用
      };
    }
    const url = album.pageUrl;
    if (!url) {
      log("debug", `[iQiyi] \u975E\u7535\u5F71\u5185\u5BB9\u7F3A\u5C11 pageUrl: ${album.title}`);
      return null;
    }
    const linkIdMatch = url.match(/v_(\w+?)\.html/);
    if (!linkIdMatch) {
      log("debug", `[iQiyi] \u65E0\u6CD5\u4ECE pageUrl \u63D0\u53D6 link_id: ${url}`);
      return null;
    }
    const linkId = linkIdMatch[1];
    let year = null;
    if (album.year) {
      const yearStr = album.year.value || album.year.name;
      if (yearStr && typeof yearStr === "string" && yearStr.length === 4 && /^\d{4}$/.test(yearStr)) {
        year = parseInt(yearStr);
      }
    }
    let episodeCount = null;
    if (album.videos && album.videos.length > 0) {
      episodeCount = album.videos.length;
    } else if (album.subscriptContent) {
      const countMatch = album.subscriptContent.match(/(?:更新至|全|共)\s*(\d+)\s*(?:集|话|期)/);
      if (countMatch) {
        episodeCount = parseInt(countMatch[1]);
      } else {
        const simpleMatch = album.subscriptContent.trim().match(/^(\d+)$/);
        if (simpleMatch) {
          episodeCount = parseInt(simpleMatch[1]);
        }
      }
    }
    const cleanedTitle = album.title.replace(/<[^>]+>/g, "").replace(/:/g, "\uFF1A");
    return {
      provider: "iqiyi",
      mediaId: linkId,
      title: cleanedTitle,
      type: mediaType,
      year,
      imageUrl: album.img || album.imgH,
      episodeCount
    };
  }
  /**
   * 获取分集列表
   * @param {string} id - 视频 ID (link_id 或 movie_qipuId)
   * @returns {Promise<Array>} 分集列表
   */
  async getEpisodes(id) {
    try {
      log("info", `[iQiyi] \u83B7\u53D6\u5206\u96C6\u5217\u8868: media_id=${id}`);
      if (id.startsWith("movie_")) {
        const qipuId = id.substring(6);
        log("info", `[iQiyi] \u7535\u5F71\u7C7B\u578B\uFF0C\u8C03\u7528 base_info API \u83B7\u53D6\u89C6\u9891ID: qipuId=${qipuId}`);
        const videoId = await this._getMovieVideoId(qipuId);
        if (!videoId) {
          log("error", `[iQiyi] \u65E0\u6CD5\u83B7\u53D6\u7535\u5F71\u7684\u89C6\u9891ID: qipuId=${qipuId}`);
          return [];
        }
        log("info", `[iQiyi] \u7535\u5F71\u89C6\u9891ID: ${videoId}`);
        return [{
          id: videoId,
          title: "\u6B63\u7247",
          order: 1,
          link: `https://www.iqiyi.com/v_${videoId}.html`
        }];
      }
      const entityId = /^\d+$/.test(id) ? id : this._videoIdToEntityId(id);
      if (!entityId) {
        log("error", `[iQiyi] \u65E0\u6CD5\u5C06 media_id '${id}' \u8F6C\u6362\u4E3A entity_id`);
        return [];
      }
      const params = {
        entity_id: entityId,
        device_id: "qd5fwuaj4hunxxdgzwkcqmefeb3ww5hx",
        auth_cookie: "",
        user_id: "0",
        vip_type: "-1",
        vip_status: "0",
        conduit_id: "",
        pcv: "13.082.22866",
        app_version: "13.082.22866",
        ext: "",
        app_mode: "standard",
        scale: "100",
        timestamp: String(Date.now()),
        src: "pca_tvg",
        os: "",
        ad_ext: '{"r":"2.2.0-ares6-pure"}'
      };
      params.sign = this._createSign(params);
      const queryString = buildQueryString(params);
      const url = `https://www.iqiyi.com/prelw/tvg/v2/lw/base_info?${queryString}`;
      const response = await Widget.http.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.iqiyi.com/"
        }
      });
      if (!response || !response.data) {
        log("error", "[iQiyi] \u83B7\u53D6\u5206\u96C6\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (data.status_code !== 0 || !data.data || !data.data.template) {
        log("error", `[iQiyi] API \u8FD4\u56DE\u9519\u8BEF\uFF0Cstatus_code: ${data.status_code}`);
        return [];
      }
      const allEpisodes = [];
      const tabs = data.data.template.tabs || [];
      if (tabs.length === 0) {
        log("info", "[iQiyi] \u672A\u627E\u5230\u5206\u96C6\u6807\u7B7E\u9875");
        return [];
      }
      const blocks = tabs[0].blocks || [];
      let foundEpisodes = false;
      for (const block of blocks) {
        if (block.bk_type === "video_list" && block.data?.data) {
          log("debug", `[iQiyi] \u627E\u5230 video_list \u7C7B\u578B\u7684\u5206\u96C6\u6570\u636E\u5757, bk_id: ${block.bk_id}`);
          if (!block.tag || !block.tag.includes("episodes")) {
            log("debug", `[iQiyi] \u8DF3\u8FC7\u975E\u5206\u96C6\u5757: ${block.bk_id}`);
            continue;
          }
          foundEpisodes = true;
          const dataGroups = block.data.data;
          if (!Array.isArray(dataGroups)) {
            log("warn", "[iQiyi] data.data \u4E0D\u662F\u6570\u7EC4\uFF0C\u8DF3\u8FC7\u6B64\u5757");
            continue;
          }
          for (const group of dataGroups) {
            if (!group.videos || !Array.isArray(group.videos)) continue;
            for (const videoGroup of group.videos) {
              if (!videoGroup.data || !Array.isArray(videoGroup.data)) continue;
              for (const epData of videoGroup.data) {
                if (epData.content_type !== 1) continue;
                const playUrl = epData.play_url || "";
                const tvidMatch = playUrl.match(/tvid=(\d+)/);
                if (!tvidMatch) continue;
                const tvid = tvidMatch[1];
                let title = epData.short_display_name || epData.title || "\u672A\u77E5\u5206\u96C6";
                const subtitle = epData.subtitle;
                if (subtitle && !title.includes(subtitle)) {
                  title = `${title} ${subtitle}`;
                }
                const order = epData.album_order;
                const pageUrl = epData.page_url;
                if (tvid && title && pageUrl) {
                  allEpisodes.push({
                    id: tvid,
                    title,
                    order: order !== void 0 ? order : allEpisodes.length,
                    link: pageUrl
                  });
                }
              }
            }
          }
        } else if (block.bk_type === "album_episodes" && block.data?.data) {
          log("debug", "[iQiyi] \u627E\u5230 album_episodes \u7C7B\u578B\u7684\u5206\u96C6\u6570\u636E\u5757");
          foundEpisodes = true;
          const episodeGroups = block.data.data;
          for (const group of episodeGroups) {
            let videosData = group.videos;
            if (typeof videosData === "string") {
              log("info", `[iQiyi] \u53D1\u73B0\u5206\u5B63URL\uFF0C\u6B63\u5728\u83B7\u53D6: ${videosData}`);
              try {
                const seasonResponse = await Widget.http.get(videosData);
                videosData = typeof seasonResponse.data === "string" ? JSON.parse(seasonResponse.data) : seasonResponse.data;
              } catch (error) {
                log("error", `[iQiyi] \u83B7\u53D6\u5206\u5B63\u6570\u636E\u5931\u8D25: ${error.message}`);
                continue;
              }
            }
            if (videosData && typeof videosData === "object" && videosData.feature_paged) {
              for (const pageKey in videosData.feature_paged) {
                const pagedList = videosData.feature_paged[pageKey];
                for (const epData of pagedList) {
                  if (epData.content_type !== 1) continue;
                  const playUrl = epData.play_url || "";
                  const tvidMatch = playUrl.match(/tvid=(\d+)/);
                  if (!tvidMatch) continue;
                  const tvid = tvidMatch[1];
                  let title = epData.short_display_name || epData.title || "\u672A\u77E5\u5206\u96C6";
                  const subtitle = epData.subtitle;
                  if (subtitle && !title.includes(subtitle)) {
                    title = `${title} ${subtitle}`;
                  }
                  const order = epData.album_order;
                  const pageUrl = epData.page_url;
                  if (tvid && title && order && pageUrl) {
                    allEpisodes.push({
                      id: tvid,
                      title,
                      order,
                      link: pageUrl
                    });
                  }
                }
              }
            }
          }
        }
      }
      if (!foundEpisodes) {
        log("info", "[iQiyi] \u672A\u627E\u5230\u5206\u96C6\u6570\u636E\u5757");
        return [];
      }
      const uniqueEpisodes = Array.from(
        new Map(allEpisodes.map((ep) => [ep.id, ep])).values()
      );
      uniqueEpisodes.sort((a, b) => a.order - b.order);
      log("info", `[iQiyi] \u6210\u529F\u83B7\u53D6 ${uniqueEpisodes.length} \u4E2A\u5206\u96C6`);
      return uniqueEpisodes;
    } catch (error) {
      log("error", "[iQiyi] \u83B7\u53D6\u5206\u96C6\u51FA\u9519:", error.message);
      return [];
    }
  }
  /**
   * 获取电影的视频ID（从 qipuId 获取正确的 video_id）
   * @param {string} qipuId - 电影的 qipuId
   * @returns {Promise<string|null>} 视频ID
   */
  async _getMovieVideoId(qipuId) {
    try {
      const params = {
        entity_id: qipuId,
        device_id: "qd5fwuaj4hunxxdgzwkcqmefeb3ww5hx",
        auth_cookie: "",
        user_id: "0",
        vip_type: "-1",
        vip_status: "0",
        conduit_id: "",
        pcv: "13.103.23529",
        app_version: "13.103.23529",
        ext: "",
        app_mode: "standard",
        scale: "125",
        timestamp: String(Date.now()),
        src: "pca_tvg",
        os: "",
        ad_ext: '{"r":"2.5.0-ares6-pure"}'
      };
      params.sign = this._createSign(params);
      const queryString = buildQueryString(params);
      const url = `https://mesh.if.iqiyi.com/tvg/v2/lw/base_info?${queryString}`;
      log("debug", `[iQiyi] \u8BF7\u6C42\u7535\u5F71\u8BE6\u60C5: ${url}`);
      const response = await Widget.http.get(url, {
        headers: {
          "accept": "*/*",
          "origin": "https://www.iqiyi.com",
          "referer": "https://www.iqiyi.com/",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response || !response.data) {
        log("error", "[iQiyi] base_info API \u54CD\u5E94\u4E3A\u7A7A");
        return null;
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (data.data && data.data.base_data) {
        const baseData = data.data.base_data;
        if (baseData.share_url) {
          const match = baseData.share_url.match(/v_(\w+)\.html/);
          if (match) {
            const videoId = match[1];
            log("info", `[iQiyi] \u4ECE share_url \u63D0\u53D6\u89C6\u9891ID: ${videoId}`);
            return videoId;
          }
        }
        if (baseData.page_url) {
          const match = baseData.page_url.match(/v_(\w+)\.html/);
          if (match) {
            const videoId = match[1];
            log("info", `[iQiyi] \u4ECE page_url \u63D0\u53D6\u89C6\u9891ID: ${videoId}`);
            return videoId;
          }
        }
      }
      log("error", "[iQiyi] base_info API \u54CD\u5E94\u4E2D\u672A\u627E\u5230\u89C6\u9891ID");
      log("debug", `[iQiyi] \u54CD\u5E94\u6570\u636E\u7ED3\u6784: ${JSON.stringify(data).substring(0, 1e3)}...`);
      return null;
    } catch (error) {
      log("error", `[iQiyi] \u83B7\u53D6\u7535\u5F71\u89C6\u9891ID\u65F6\u51FA\u9519: ${error.message}`);
      return null;
    }
  }
  /**
   * 将 video_id 转换为 entity_id
   * @param {string} videoId - 视频 ID
   * @returns {string|null} entity_id
   */
  _videoIdToEntityId(videoId) {
    try {
      const base36Decoded = parseInt(videoId, 36);
      const xorResult = this._xorOperation(base36Decoded);
      const finalResult = xorResult < 9e5 ? 100 * (xorResult + 9e5) : xorResult;
      return String(finalResult);
    } catch (error) {
      log("error", `[iQiyi] \u5C06 video_id '${videoId}' \u8F6C\u6362\u4E3A entity_id \u65F6\u51FA\u9519: ${error.message}`);
      return null;
    }
  }
  /**
   * 异或运算
   * @param {number} num - 输入数字
   * @returns {number} 异或结果
   */
  _xorOperation(num) {
    const numBinary = num.toString(2);
    const keyBinary = _IqiyiSource.XOR_KEY.toString(2);
    const numBits = numBinary.split("").reverse();
    const keyBits = keyBinary.split("").reverse();
    const resultBits = [];
    const maxLen = Math.max(numBits.length, keyBits.length);
    for (let i = 0; i < maxLen; i++) {
      const numBit = i < numBits.length ? numBits[i] : "0";
      const keyBit = i < keyBits.length ? keyBits[i] : "0";
      if (numBit === "1" && keyBit === "1") {
        resultBits.push("0");
      } else if (numBit === "1" || keyBit === "1") {
        resultBits.push("1");
      } else {
        resultBits.push("0");
      }
    }
    const resultBinary = resultBits.reverse().join("");
    return resultBinary ? parseInt(resultBinary, 2) : 0;
  }
  /**
   * 为 API 生成签名
   * @param {Object} params - 请求参数
   * @returns {string} MD5 签名
   */
  _createSign(params) {
    const cleanParams = {};
    for (const key in params) {
      if (key !== "sign") {
        cleanParams[key] = params[key];
      }
    }
    const sortedKeys = Object.keys(cleanParams).sort();
    const paramParts = [];
    for (const key of sortedKeys) {
      const value = cleanParams[key] === null || cleanParams[key] === void 0 ? "" : cleanParams[key];
      paramParts.push(`${key}=${value}`);
    }
    const paramString = paramParts.join("&");
    const signString = `${paramString}&${_IqiyiSource.KEY_NAME}=${_IqiyiSource.SECRET_KEY}`;
    return md5(signString).toUpperCase();
  }
  /**
   * 处理搜索结果并格式化为 DanDanPlay 格式
   * @param {Array} sourceAnimes - 搜索结果数组
   * @param {string} queryTitle - 搜索关键词
   * @param {Array} curAnimes - 当前动漫列表
   * @returns {Promise<void>}
   */
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[iQiyi] sourceAnimes is not a valid array");
      return [];
    }
    const processIqiyiAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.mediaId);
          const links = [];
          for (const ep of eps) {
            const fullUrl = ep.link || `https://www.iqiyi.com/v_${anime.mediaId}.html`;
            links.push({
              "name": ep.order.toString(),
              "url": fullUrl,
              "title": `\u3010qiyi\u3011 ${ep.title}`
            });
          }
          if (links.length > 0) {
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            const transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year || "N/A"})\u3010${anime.type}\u3011from iqiyi`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "iqiyi"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) {
              removeEarliestAnime();
            }
          }
        } catch (error) {
          log("error", `[iQiyi] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processIqiyiAnimes;
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u7231\u5947\u827A\u5F39\u5E55...", id);
    let res;
    try {
      res = await Widget.http.get(id, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
    } catch (error) {
      log("error", "\u8BF7\u6C42\u9875\u9762\u5931\u8D25:", error);
      return [];
    }
    const titleMatch = res.data.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].split("_")[0] : "\u672A\u77E5\u6807\u9898";
    log("info", `\u6807\u9898: ${title}`);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const promises = [];
    for (const segment of segmentList) {
      promises.push(this.getEpisodeSegmentDanmu(segment));
    }
    let contents = [];
    try {
      const results = await Promise.allSettled(promises);
      const datas = results.filter((result) => result.status === "fulfilled").map((result) => result.value).filter((data) => data !== null);
      datas.forEach((data) => {
        contents.push(...data);
      });
    } catch (error) {
      log("error", "\u89E3\u6790\u5F39\u5E55\u6570\u636E\u5931\u8D25:", error);
      return [];
    }
    printFirst200Chars(contents);
    return contents;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u7231\u5947\u827A\u89C6\u9891\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    const api_decode_base = "https://pcw-api.iq.com/api/decode/";
    const api_video_info = "https://pcw-api.iqiyi.com/video/video/baseinfo/";
    let tvid;
    try {
      const idMatch = id.match(/v_(\w+)/);
      if (!idMatch) {
        log("error", "\u65E0\u6CD5\u4ECE URL \u4E2D\u63D0\u53D6 tvid");
        return new SegmentListResponse({
          "type": "qiyi",
          "segmentList": []
        });
      }
      tvid = idMatch[1];
      log("info", `tvid: ${tvid}`);
      const decodeUrl = `${api_decode_base}${tvid}?platformId=3&modeCode=intl&langCode=sg`;
      let res = await Widget.http.get(decodeUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      tvid = data.data.toString();
      log("info", `\u89E3\u7801\u540E tvid: ${tvid}`);
    } catch (error) {
      log("error", "\u8BF7\u6C42\u89E3\u7801\u4FE1\u606F\u5931\u8D25:", error);
      return new SegmentListResponse({
        "type": "qiyi",
        "segmentList": []
      });
    }
    let duration, albumid, categoryid;
    try {
      const videoInfoUrl = `${api_video_info}${tvid}`;
      const res = await Widget.http.get(videoInfoUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      const videoInfo = data.data;
      duration = videoInfo.durationSec;
      albumid = videoInfo.albumId;
      categoryid = videoInfo.channelId || videoInfo.categoryId;
      log("info", `\u65F6\u957F: ${duration}`);
    } catch (error) {
      log("error", "\u8BF7\u6C42\u89C6\u9891\u57FA\u7840\u4FE1\u606F\u5931\u8D25:", error);
      return new SegmentListResponse({
        "type": "qiyi",
        "segmentList": []
      });
    }
    const page = Math.ceil(duration / (60 * 5));
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${page}`);
    const segmentList = [];
    for (let i = 0; i < page; i++) {
      const params = {
        rn: "0.0123456789123456",
        business: "danmu",
        is_iqiyi: "true",
        is_video_page: "true",
        tvid,
        albumid,
        categoryid,
        qypid: "010102101000000000"
      };
      let queryParams = buildQueryString(params);
      const api_url = `https://cmts.iqiyi.com/bullet/${tvid.slice(-4, -2)}/${tvid.slice(-2)}/${tvid}_300_${i + 1}.z?${queryParams.toString()}`;
      segmentList.push({
        "type": "qiyi",
        "segment_start": i * 5 * 60,
        // 每段5分钟
        "segment_end": Math.min((i + 1) * 5 * 60, duration),
        "url": api_url
      });
    }
    return new SegmentListResponse({
      "type": "qiyi",
      "segmentList": segmentList
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    try {
      let extract = function(xml, tag) {
        const reg = new RegExp(`<${tag}>(.*?)</${tag}>`, "g");
        const res = xml.match(reg)?.map((x) => x.substring(tag.length + 2, x.length - tag.length - 3));
        return res || [];
      };
      const response = await Widget.http.get(segment.url, {
        headers: {
          "Accpet-Encoding": "gzip",
          "Content-Type": "application/xml",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        zlibMode: true,
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        const xml = response.data;
        const danmaku = extract(xml, "content");
        const showTime = extract(xml, "showTime");
        const color = extract(xml, "color");
        contents.push(...danmaku.map((content, i) => ({
          content,
          showTime: showTime[i],
          color: color[i]
        })));
      }
      return contents;
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5206\u7247\u5F39\u5E55\u5931\u8D25:", error);
      return [];
    }
  }
  formatComments(comments) {
    return comments.map((item) => {
      const content = {
        timepoint: 0,
        // 弹幕发送时间（秒）
        ct: 1,
        // 弹幕类型，1-3 为滚动弹幕、4 为底部、5 为顶端、6 为逆向、7 为精确、8 为高级
        size: 25,
        //字体大小，25 为中，18 为小
        color: 16777215,
        //弹幕颜色，RGB 颜色转为十进制后的值，16777215 为白色
        unixtime: Math.floor(Date.now() / 1e3),
        //Unix 时间戳格式
        uid: 0,
        //发送人的 id
        content: ""
      };
      content.timepoint = parseFloat(item["showTime"]);
      content.color = parseInt(item["color"], 16);
      content.content = decodeHtmlEntities(item["content"]);
      content.size = 25;
      return content;
    });
  }
};
// 爱奇艺 API 签名相关常量
__publicField(_IqiyiSource, "XOR_KEY", 129125665826668);
__publicField(_IqiyiSource, "SECRET_KEY", "howcuteitis");
__publicField(_IqiyiSource, "KEY_NAME", "secret_key");
var IqiyiSource = _IqiyiSource;

// danmu_api/sources/mango.js
var MangoSource = class extends BaseSource {
  // 处理 v2_color 对象的转换逻辑
  transformV2Color(v2_color) {
    const DEFAULT_COLOR_INT = -1;
    if (!v2_color) {
      return DEFAULT_COLOR_INT;
    }
    const leftColor = rgbToInt(v2_color.color_left);
    const rightColor = rgbToInt(v2_color.color_right);
    if (leftColor === -1 && rightColor === -1) {
      return DEFAULT_COLOR_INT;
    }
    if (leftColor === -1) {
      return rightColor;
    }
    if (rightColor === -1) {
      return leftColor;
    }
    return Math.floor((leftColor + rightColor) / 2);
  }
  /**
   * 从类型字符串中提取标准化的媒体类型
   * @param {string} typeStr - API 返回的类型字符串
   * @returns {string} 标准化的媒体类型
   */
  _extractMediaType(typeStr) {
    const type = (typeStr || "").toLowerCase();
    if (type.includes("\u7535\u5F71") || type.includes("movie")) {
      return "\u7535\u5F71";
    }
    if (type.includes("\u52A8\u6F2B") || type.includes("\u52A8\u753B") || type.includes("anime")) {
      return "\u52A8\u6F2B";
    }
    if (type.includes("\u7EFC\u827A") || type.includes("\u771F\u4EBA\u79C0") || type.includes("variety")) {
      return "\u7EFC\u827A";
    }
    if (type.includes("\u7EAA\u5F55\u7247") || type.includes("documentary")) {
      return "\u7EAA\u5F55\u7247";
    }
    if (type.includes("\u7535\u89C6\u5267") || type.includes("\u5267\u96C6") || type.includes("drama") || type.includes("tv")) {
      return "\u7535\u89C6\u5267";
    }
    return "\u7535\u89C6\u5267";
  }
  async search(keyword) {
    try {
      log("info", `[Mango] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const encodedKeyword = encodeURIComponent(keyword);
      const searchUrl = `https://mobileso.bz.mgtv.com/msite/search/v2?q=${encodedKeyword}&pc=30&pn=1&sort=-99&ty=0&du=0&pt=0&corr=1&abroad=0&_support=10000000000000000`;
      const response = await Widget.http.get(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
          "Referer": "https://www.mgtv.com/"
        }
      });
      if (!response || !response.data) {
        log("info", "[Mango] \u641C\u7D22\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (!data.data || !data.data.contents) {
        log("info", "[Mango] \u641C\u7D22\u65E0\u7ED3\u679C");
        return [];
      }
      const results = [];
      for (const content of data.data.contents) {
        if (content.type !== "media") {
          continue;
        }
        for (const item of content.data) {
          if (item.source !== "imgo") {
            continue;
          }
          const urlMatch = item.url ? item.url.match(/\/b\/(\d+)/) : null;
          if (!urlMatch) {
            continue;
          }
          const mediaId = urlMatch[1];
          const cleanedTitle = item.title ? item.title.replace(/<[^>]+>/g, "").replace(/:/g, "\uFF1A") : "";
          const yearMatch = item.desc && item.desc[0] ? item.desc[0].match(/[12][890][0-9][0-9]/) : null;
          const year = yearMatch ? parseInt(yearMatch[0]) : null;
          const typeMatch = item.desc && item.desc[0] ? item.desc[0].split("/")[0].replace("\u7C7B\u578B:", "").trim() : "";
          const mediaType = this._extractMediaType(typeMatch);
          results.push({
            provider: "imgo",
            mediaId,
            title: cleanedTitle,
            type: mediaType,
            year,
            imageUrl: item.img || null,
            episodeCount: item.videoCount || null
          });
        }
      }
      log("info", `[Mango] \u641C\u7D22\u627E\u5230 ${results.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return results;
    } catch (error) {
      log("error", "[Mango] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      log("info", `[Mango] \u83B7\u53D6\u5206\u96C6\u5217\u8868: collection_id=${id}`);
      let allEpisodes = [];
      let month = "";
      let pageIndex = 0;
      let totalPages = 1;
      while (pageIndex < totalPages) {
        const url = `https://pcweb.api.mgtv.com/variety/showlist?allowedRC=1&collection_id=${id}&month=${month}&page=1&_support=10000000`;
        const response = await Widget.http.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.mgtv.com/"
          }
        });
        if (!response || !response.data) {
          log("info", "[Mango] \u672A\u627E\u5230\u5206\u96C6\u4FE1\u606F");
          break;
        }
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        if (!data.data || !data.data.list) {
          log("info", "[Mango] \u5206\u96C6\u5217\u8868\u4E3A\u7A7A");
          break;
        }
        if (data.data.list && data.data.list.length > 0) {
          allEpisodes.push(...data.data.list.filter((ep) => ep.src_clip_id === id));
        }
        if (pageIndex === 0) {
          totalPages = data.data.tab_m && data.data.tab_m.length > 0 ? data.data.tab_m.length : 1;
          log("info", `[Mango] \u68C0\u6D4B\u5230 ${totalPages} \u4E2A\u6708\u4EFD\u5206\u9875`);
        }
        pageIndex++;
        if (pageIndex < totalPages && data.data.tab_m && data.data.tab_m[pageIndex]) {
          month = data.data.tab_m[pageIndex].m;
        }
      }
      const mangoBlacklist = /^(.*?)(抢先(看|版)|加更(版)?|花絮|预告|特辑|(特别|惊喜|纳凉)?企划|彩蛋|专访|幕后(花絮)?|直播|纯享|未播|衍生|番外|合伙人手记|会员(专享|加长)|片花|精华|看点|速看|解读|reaction|超前营业|超前(vlog)?|陪看(记)?|.{3,}篇|影评)(.*?)$/i;
      const episodes = allEpisodes.filter((ep) => {
        const fullTitle = `${ep.t2 || ""} ${ep.t1 || ""}`.trim();
        if (ep.isnew === "2") {
          log("debug", `[Mango] \u8FC7\u6EE4\u9884\u544A\u7247: ${fullTitle}`);
          return false;
        }
        if (mangoBlacklist.test(fullTitle)) {
          log("debug", `[Mango] \u9ED1\u540D\u5355\u8FC7\u6EE4: ${fullTitle}`);
          return false;
        }
        return true;
      });
      const processedEpisodes = this._processVarietyEpisodes(episodes);
      log("info", `[Mango] \u5171\u83B7\u53D6 ${processedEpisodes.length} \u96C6`);
      return processedEpisodes;
    } catch (error) {
      log("error", "[Mango] \u83B7\u53D6\u5206\u96C6\u51FA\u9519:", error.message);
      return [];
    }
  }
  /**
   * 获取电影正片
   * @param {string} mediaId - 媒体ID
   * @returns {Object|null} 电影正片信息
   */
  async _getMovieEpisode(mediaId) {
    try {
      log("info", `[Mango] \u83B7\u53D6\u7535\u5F71\u6B63\u7247: collection_id=${mediaId}`);
      const url = `https://pcweb.api.mgtv.com/variety/showlist?allowedRC=1&collection_id=${mediaId}&month=&page=1&_support=10000000`;
      const response = await Widget.http.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.mgtv.com/"
        }
      });
      if (!response || !response.data) {
        log("info", "[Mango] \u672A\u627E\u5230\u7535\u5F71\u4FE1\u606F");
        return null;
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (!data.data || !data.data.list || data.data.list.length === 0) {
        log("info", "[Mango] \u7535\u5F71\u5217\u8868\u4E3A\u7A7A");
        return null;
      }
      let mainFeature = data.data.list.find((ep) => ep.isIntact === "1");
      if (!mainFeature) {
        mainFeature = data.data.list.find((ep) => ep.isnew !== "2");
      }
      if (!mainFeature) {
        mainFeature = data.data.list[0];
      }
      log("info", `[Mango] \u627E\u5230\u7535\u5F71\u6B63\u7247: ${mainFeature.t3 || mainFeature.t1 || "\u6B63\u7247"}`);
      return mainFeature;
    } catch (error) {
      log("error", "[Mango] \u83B7\u53D6\u7535\u5F71\u6B63\u7247\u51FA\u9519:", error.message);
      return null;
    }
  }
  /**
   * 处理综艺分集，智能过滤和排序
   * @param {Array} rawEpisodes - 原始分集数据
   * @returns {Array} 处理后的分集列表
   */
  _processVarietyEpisodes(rawEpisodes) {
    if (!rawEpisodes || rawEpisodes.length === 0) {
      return [];
    }
    log("debug", `[Mango] \u7EFC\u827A\u5904\u7406\u5F00\u59CB\uFF0C\u539F\u59CB\u5206\u96C6\u6570: ${rawEpisodes.length}`);
    const hasQiFormat = rawEpisodes.some((ep) => {
      const fullTitle = `${ep.t2 || ""} ${ep.t1 || ""}`.trim();
      return /第\d+期/.test(fullTitle);
    });
    log("debug", `[Mango] \u7EFC\u827A\u683C\u5F0F\u5206\u6790: \u6709\u671F\u6570\u683C\u5F0F=${hasQiFormat}`);
    const episodeInfos = [];
    const qiInfoMap = /* @__PURE__ */ new Map();
    for (const ep of rawEpisodes) {
      const fullTitle = `${ep.t2 || ""} ${ep.t1 || ""}`.trim();
      if (hasQiFormat) {
        const qiUpMidDownMatch = fullTitle.match(/第(\d+)期([上中下])/);
        const qiPureMatch = fullTitle.match(/第(\d+)期/);
        const hasUpMidDown = /第\d+期[上中下]/.test(fullTitle);
        if (qiUpMidDownMatch) {
          const qiNum = qiUpMidDownMatch[1];
          const upMidDown = qiUpMidDownMatch[2];
          const qiUpMidDownText = `\u7B2C${qiNum}\u671F${upMidDown}`;
          const afterUpMidDown = fullTitle.substring(fullTitle.indexOf(qiUpMidDownText) + qiUpMidDownText.length);
          const hasInvalidSuffix = /^(加更|会员版|纯享版|特别版|独家版|Plus|\+|花絮|预告|彩蛋|抢先|精选|未播|回顾|特辑|幕后)/.test(afterUpMidDown);
          if (!hasInvalidSuffix) {
            qiInfoMap.set(ep, [parseInt(qiNum), upMidDown]);
            episodeInfos.push(ep);
            log("debug", `[Mango] \u7EFC\u827A\u4FDD\u7559\u4E0A\u4E2D\u4E0B\u683C\u5F0F: ${fullTitle}`);
          } else {
            log("debug", `[Mango] \u7EFC\u827A\u8FC7\u6EE4\u4E0A\u4E2D\u4E0B\u683C\u5F0F+\u540E\u7F00: ${fullTitle}`);
          }
        } else if (qiPureMatch && !hasUpMidDown && !/会员版|纯享版|特别版|独家版|加更|Plus|\+|花絮|预告|彩蛋|抢先|精选|未播|回顾|特辑|幕后|访谈|采访|混剪|合集|盘点|总结|删减|未播放|NG|番外|片段|看点|精彩|制作|导演|演员|拍摄|片尾曲|插曲|主题曲|背景音乐|OST|音乐|歌曲/.test(fullTitle)) {
          const qiNum = qiPureMatch[1];
          qiInfoMap.set(ep, [parseInt(qiNum), ""]);
          episodeInfos.push(ep);
          log("debug", `[Mango] \u7EFC\u827A\u4FDD\u7559\u6807\u51C6\u671F\u6570: ${fullTitle}`);
        } else {
          log("debug", `[Mango] \u7EFC\u827A\u8FC7\u6EE4\u975E\u6807\u51C6\u671F\u6570\u683C\u5F0F: ${fullTitle}`);
        }
      } else {
        if (fullTitle.includes("\u5E7F\u544A") || fullTitle.includes("\u63A8\u5E7F")) {
          log("debug", `[Mango] \u8DF3\u8FC7\u5E7F\u544A\u5185\u5BB9: ${fullTitle}`);
          continue;
        }
        episodeInfos.push(ep);
        log("debug", `[Mango] \u7EFC\u827A\u4FDD\u7559\u539F\u59CB\u6807\u9898: ${fullTitle}`);
      }
    }
    if (hasQiFormat) {
      episodeInfos.sort((a, b) => {
        const infoA = qiInfoMap.get(a) || [0, ""];
        const infoB = qiInfoMap.get(b) || [0, ""];
        if (infoA[0] !== infoB[0]) {
          return infoA[0] - infoB[0];
        }
        const orderMap = { "": 0, "\u4E0A": 1, "\u4E2D": 2, "\u4E0B": 3 };
        return (orderMap[infoA[1]] || 0) - (orderMap[infoB[1]] || 0);
      });
    } else {
      episodeInfos.sort((a, b) => {
        const getEpisodeNumber = (ep) => {
          const fullTitle = `${ep.t2 || ""} ${ep.t1 || ""}`.trim();
          const match = fullTitle.match(/第(\d+)集/);
          return match ? parseInt(match[1]) : 999999;
        };
        const numA = getEpisodeNumber(a);
        const numB = getEpisodeNumber(b);
        if (numA === 999999 && numB === 999999) {
          const timeA = a.ts || "0";
          const timeB = b.ts || "0";
          return timeA.localeCompare(timeB);
        }
        return numA - numB;
      });
    }
    log("debug", `[Mango] \u7EFC\u827A\u5904\u7406\u5B8C\u6210\uFF0C\u8FC7\u6EE4\u540E\u5206\u96C6\u6570: ${episodeInfos.length}`);
    return episodeInfos;
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Mango] sourceAnimes is not a valid array");
      return [];
    }
    const processMangoAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          if (anime.type === "\u7535\u5F71") {
            const movieEpisode = await this._getMovieEpisode(anime.mediaId);
            if (!movieEpisode) {
              return;
            }
            const fullUrl = `https://www.mgtv.com/b/${anime.mediaId}/${movieEpisode.video_id}.html`;
            const episodeTitle = movieEpisode.t3 || movieEpisode.t1 || "\u6B63\u7247";
            const links2 = [{
              "name": "1",
              "url": fullUrl,
              "title": `\u3010imgo\u3011 ${episodeTitle}`
            }];
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            let transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year || "N/A"})\u3010${anime.type}\u3011from imgo`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year),
              episodeCount: 1,
              rating: 0,
              isFavorited: true,
              source: "imgo"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links: links2 });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
            return;
          }
          const eps = await this.getEpisodes(anime.mediaId);
          let links = [];
          for (let i = 0; i < eps.length; i++) {
            const ep = eps[i];
            const fullUrl = `https://www.mgtv.com/b/${anime.mediaId}/${ep.video_id}.html`;
            const episodeTitle = `${ep.t2 || ""} ${ep.t1 || ""}`.trim();
            links.push({
              "name": String(i + 1),
              "url": fullUrl,
              "title": `\u3010imgo\u3011 ${episodeTitle}`
            });
          }
          if (links.length > 0) {
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            let transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year || "N/A"})\u3010${anime.type}\u3011from imgo`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "imgo"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Mango] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processMangoAnimes;
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u8292\u679CTV\u5F39\u5E55...", id);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const promises = [];
    for (const segment of segmentList) {
      promises.push(
        httpGet(segment.url, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          },
          retries: 1
        })
      );
    }
    let contents = [];
    try {
      const results = await Promise.allSettled(promises);
      const datas = results.filter((result) => result.status === "fulfilled").map((result) => {
        if (result.value && result.value.data) {
          return result.value.data;
        }
        return null;
      }).filter((data) => data !== null);
      datas.forEach((data) => {
        data = typeof data === "string" ? JSON.parse(data) : data;
        if (data.data?.items) {
          contents.push(...data.data.items);
        }
      });
    } catch (error) {
      log("error", "\u89E3\u6790\u5F39\u5E55\u6570\u636E\u5931\u8D25:", error);
      return [];
    }
    printFirst200Chars(contents);
    return contents;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u8292\u679CTV\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    const api_video_info = "https://pcweb.api.mgtv.com/video/info";
    const api_ctl_barrage = "https://galaxy.bz.mgtv.com/getctlbarrage";
    const api_rd_barrage = "https://galaxy.bz.mgtv.com/rdbarrage";
    const regex = /^(https?:\/\/[^\/]+)(\/[^?#]*)/;
    const match = id.match(regex);
    let path2;
    if (match) {
      path2 = match[2].split("/").filter(Boolean);
    } else {
      log("error", "Invalid URL");
      return new SegmentListResponse({
        "type": "imgo",
        "segmentList": []
      });
    }
    const cid = path2[path2.length - 2];
    const vid2 = path2[path2.length - 1].split(".")[0];
    log("info", `\u83B7\u53D6\u5F39\u5E55\u5206\u6BB5\u5217\u8868 - cid: ${cid}, vid: ${vid2}`);
    let res;
    try {
      const videoInfoUrl = `${api_video_info}?cid=${cid}&vid=${vid2}`;
      res = await Widget.http.get(videoInfoUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
    } catch (error) {
      if (error.response?.status === 404) {
        return new SegmentListResponse({
          "type": "imgo",
          "segmentList": []
        });
      }
      log("error", "\u8BF7\u6C42\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
      return new SegmentListResponse({
        "type": "imgo",
        "segmentList": []
      });
    }
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    const time = data.data.info.time;
    let useNewApi = true;
    try {
      const ctlBarrageUrl = `${api_ctl_barrage}?version=8.1.39&abroad=0&uuid=&os=10.15.7&platform=0&mac=&vid=${vid2}&pid=&cid=${cid}&ticket=`;
      const res2 = await Widget.http.get(ctlBarrageUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      const ctlBarrage = typeof res2.data === "string" ? JSON.parse(res2.data) : res2.data;
      if (!ctlBarrage.data || !ctlBarrage.data.cdn_list || !ctlBarrage.data.cdn_version) {
        log("warn", `\u65B0API\u7F3A\u5C11\u5FC5\u8981\u5B57\u6BB5\uFF0C\u8FD4\u56DE\u7A7A\u5206\u6BB5\u5217\u8868`);
        useNewApi = false;
      }
      const segmentList = [];
      if (!useNewApi) {
        const step = 60;
        const end_time = time_to_second(time);
        for (let i = 0; i < end_time; i += step) {
          segmentList.push({
            "type": "imgo",
            "segment_start": i,
            // 每段开始时间（秒）
            "segment_end": Math.min(i + step, time_to_second(time)),
            // 每段结束时间（秒）
            "url": `${api_rd_barrage}?vid=${vid2}&cid=${cid}&time=${i * 1e3}`
            // 每段弹幕URL
          });
        }
      } else {
        const totalSegments = Math.ceil(time_to_second(time) / 60);
        const cdnList = ctlBarrage.data.cdn_list.split(",")[0];
        const cdnVersion = ctlBarrage.data.cdn_version;
        for (let i = 0; i < totalSegments; i++) {
          segmentList.push({
            "type": "imgo",
            "segment_start": i * 60,
            // 每段开始时间（秒）
            "segment_end": Math.min((i + 1) * 60, time_to_second(time)),
            // 每段结束时间（秒）
            "url": `https://${cdnList}/${cdnVersion}/${i}.json`
            // 每段弹幕URL
          });
        }
      }
      return new SegmentListResponse({
        "type": "imgo",
        "segmentList": segmentList
      });
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5F39\u5E55\u5206\u6BB5\u6570\u636E\u5931\u8D25:", error);
      return new SegmentListResponse({
        "type": "imgo",
        "segmentList": []
      });
    }
  }
  async getEpisodeSegmentDanmu(segment) {
    try {
      const response = await Widget.http.get(segment.url, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        const parsedData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        if (parsedData.data?.items) {
          contents.push(...parsedData.data.items);
        }
      }
      return contents;
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5206\u7247\u5F39\u5E55\u5931\u8D25:", error);
      return [];
    }
  }
  formatComments(comments) {
    return comments.map((item) => {
      const content = {
        timepoint: 0,
        // 弹幕发送时间（秒）
        ct: 1,
        // 弹幕类型，1-3 为滚动弹幕、4 为底部、5 为顶端、6 为逆向、7 为精确、8 为高级
        size: 25,
        //字体大小，25 为中，18 为小
        color: 16777215,
        //弹幕颜色，RGB 颜色转为十进制后的值，16777215 为白色
        unixtime: Math.floor(Date.now() / 1e3),
        //Unix 时间戳格式
        uid: 0,
        //发送人的 id
        content: ""
      };
      if (item?.v2_color) {
        content.color = this.transformV2Color(item?.v2_color);
      }
      if (item?.v2_position) {
        if (item?.v2_position === 1) {
          content.ct = 5;
        } else if (item?.v2_position === 2) {
          content.ct = 4;
        }
      }
      content.timepoint = item.time / 1e3;
      content.content = item.content;
      content.uid = item.uid;
      return content;
    });
  }
};

// danmu_api/sources/bilibili.js
var _BilibiliSource = class _BilibiliSource extends BaseSource {
  // 解析 b23.tv 短链接
  async resolveB23Link(shortUrl) {
    try {
      log("info", `\u6B63\u5728\u89E3\u6790 b23.tv \u77ED\u94FE\u63A5: ${shortUrl}`);
      const timeout = parseInt(globals.vodRequestTimeout);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await Widget.http.get(shortUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        signal: controller.signal,
        redirect: "follow"
      });
      clearTimeout(timeoutId);
      const finalUrl = response.url;
      if (finalUrl && finalUrl !== shortUrl) {
        log("info", `b23.tv \u77ED\u94FE\u63A5\u5DF2\u89E3\u6790\u4E3A: ${finalUrl}`);
        return finalUrl;
      }
      log("error", "\u65E0\u6CD5\u89E3\u6790 b23.tv \u77ED\u94FE\u63A5");
      return shortUrl;
    } catch (error) {
      log("error", "\u89E3\u6790 b23.tv \u77ED\u94FE\u63A5\u5931\u8D25:", error);
      return shortUrl;
    }
  }
  /**
   * 获取 WBI mixin key（带缓存）
   */
  async _getWbiMixinKey() {
    const now = Math.floor(Date.now() / 1e3);
    const cache = _BilibiliSource.WBI_MIXIN_KEY_CACHE;
    if (cache.key && now - cache.timestamp < _BilibiliSource.WBI_MIXIN_KEY_CACHE_TTL) {
      return cache.key;
    }
    log("info", "[Bilibili] WBI mixin key \u5DF2\u8FC7\u671F\u6216\u4E0D\u5B58\u5728\uFF0C\u6B63\u5728\u83B7\u53D6\u65B0\u7684...");
    try {
      const navResp = await Widget.http.get("https://api.bilibili.com/x/web-interface/nav", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.bilibili.com/",
          "Cookie": globals.bilibliCookie || ""
        }
      });
      const data = typeof navResp.data === "string" ? JSON.parse(navResp.data) : navResp.data;
      if (data.code !== 0) {
        log("error", "[Bilibili] \u83B7\u53D6 WBI \u5BC6\u94A5\u5931\u8D25:", data.message);
        return "dba4a5925b345b4598b7452c75070bca";
      }
      const wbiImg = data.data?.wbi_img || {};
      const imgUrl = wbiImg.img_url || "";
      const subUrl = wbiImg.sub_url || "";
      const imgKey = imgUrl.split("/").pop()?.split(".")[0] || "";
      const subKey = subUrl.split("/").pop()?.split(".")[0] || "";
      const mixinKey = _BilibiliSource.WBI_MIXIN_KEY_TABLE.map((i) => (imgKey + subKey)[i]).join("").substring(0, 32);
      cache.key = mixinKey;
      cache.timestamp = now;
      log("info", "[Bilibili] \u6210\u529F\u83B7\u53D6\u65B0\u7684 WBI mixin key");
      return mixinKey;
    } catch (error) {
      log("error", "[Bilibili] \u83B7\u53D6 WBI \u5BC6\u94A5\u5931\u8D25:", error.message);
      return "dba4a5925b345b4598b7452c75070bca";
    }
  }
  /**
   * 对参数进行 WBI 签名
   */
  _getWbiSignedParams(params, mixinKey) {
    const signedParams = { ...params };
    signedParams.wts = Math.floor(Date.now() / 1e3);
    const sortedKeys = Object.keys(signedParams).sort();
    const queryParts = sortedKeys.map((key) => {
      const value = signedParams[key] ?? "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    const query = queryParts.join("&");
    const signedQuery = query + mixinKey;
    const wRid = md5(signedQuery);
    signedParams.w_rid = wRid;
    return signedParams;
  }
  /**
   * 按类型搜索
   */
  async _searchByType(keyword, searchType, mixinKey) {
    try {
      log("info", `[Bilibili] \u641C\u7D22\u7C7B\u578B '${searchType}'\uFF0C\u5173\u952E\u8BCD '${keyword}'`);
      const searchParams = { keyword, search_type: searchType };
      const signedParams = this._getWbiSignedParams(searchParams, mixinKey);
      const queryString = Object.keys(signedParams).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(signedParams[key])}`).join("&");
      const url = `https://api.bilibili.com/x/web-interface/wbi/search/type?${queryString}`;
      const response = await Widget.http.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.bilibili.com/",
          "Cookie": globals.bilibliCookie || ""
        }
      });
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (data.code !== 0 || !data.data?.result) {
        log("info", `[Bilibili] \u7C7B\u578B '${searchType}' \u65E0\u7ED3\u679C (Code: ${data.code})`);
        return [];
      }
      const results = [];
      for (const item of data.data.result) {
        const mediaId = item.season_id ? `ss${item.season_id}` : item.bvid ? `bv${item.bvid}` : "";
        if (!mediaId) continue;
        const mediaType = this._extractMediaType(item.season_type_name);
        const episodeCount = mediaType === "\u7535\u5F71" ? 1 : item.ep_size || 0;
        let year = null;
        try {
          if (item.pubdate) {
            if (typeof item.pubdate === "number") {
              year = new Date(item.pubdate * 1e3).getFullYear();
            } else if (typeof item.pubdate === "string" && item.pubdate.length >= 4) {
              year = parseInt(item.pubdate.substring(0, 4));
            }
          } else if (item.pubtime) {
            year = new Date(item.pubtime * 1e3).getFullYear();
          }
        } catch (e) {
        }
        const cleanedTitle = (item.title || "").replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, (match) => {
          const entities = { "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": '"', "&#39;": "'" };
          return entities[match] || match;
        }).replace(/:/g, "\uFF1A").trim();
        const cleanedOrgTitle = (item.org_title || "").replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, (match) => {
          const entities = { "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": '"', "&#39;": "'" };
          return entities[match] || match;
        }).trim();
        const resultItem = {
          provider: "bilibili",
          mediaId,
          title: cleanedTitle,
          org_title: cleanedOrgTitle,
          type: mediaType,
          year,
          imageUrl: item.cover || null,
          episodeCount
        };
        if (item.eps && item.eps.length > 0) {
          resultItem._eps = item.eps;
        }
        results.push(resultItem);
      }
      log("info", `[Bilibili] \u7C7B\u578B '${searchType}' \u627E\u5230 ${results.length} \u4E2A\u7ED3\u679C`);
      return results;
    } catch (error) {
      log("error", `[Bilibili] \u641C\u7D22\u7C7B\u578B '${searchType}' \u5931\u8D25:`, error.message);
      return [];
    }
  }
  /**
   * 从 season_type_name 提取媒体类型
   * B站 API 返回的类型包括：电影、番剧、国创、纪录片、综艺、电视剧等
   * @param {string} seasonTypeName - API 返回的 season_type_name
   * @returns {string} 标准化的媒体类型
   */
  _extractMediaType(seasonTypeName) {
    const typeName = (seasonTypeName || "").toLowerCase();
    if (typeName.includes("\u7535\u5F71") || typeName.includes("movie")) {
      return "\u7535\u5F71";
    }
    if (typeName.includes("\u756A\u5267") || typeName.includes("\u56FD\u521B") || typeName.includes("\u52A8\u6F2B") || typeName.includes("anime")) {
      return "\u52A8\u6F2B";
    }
    if (typeName.includes("\u7EAA\u5F55\u7247") || typeName.includes("documentary")) {
      return "\u7EAA\u5F55\u7247";
    }
    if (typeName.includes("\u7EFC\u827A") || typeName.includes("variety")) {
      return "\u7EFC\u827A";
    }
    if (typeName.includes("\u7535\u89C6\u5267") || typeName.includes("\u5267\u96C6") || typeName.includes("drama") || typeName.includes("tv")) {
      return "\u7535\u89C6\u5267";
    }
    return "\u7535\u89C6\u5267";
  }
  async search(keyword) {
    try {
      log("info", `[Bilibili] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const mixinKey = await this._getWbiMixinKey();
      const searchTypes = ["media_bangumi", "media_ft"];
      const searchPromises = searchTypes.map((type) => this._searchByType(keyword, type, mixinKey));
      const tasks = [...searchPromises];
      if (this._hasBilibiliProxy()) {
        log("info", `[Bilibili] \u68C0\u6D4B\u5230\u4EE3\u7406\u914D\u7F6E\uFF0C\u542F\u7528\u6E2F\u6FB3\u53F0\u5E76\u884C\u641C\u7D22`);
        tasks.push(this._searchOversea(keyword));
      }
      const results = await Promise.all(tasks);
      const allResults = results.flat();
      const uniqueResults = [];
      const seenIds = /* @__PURE__ */ new Set();
      for (const item of allResults) {
        if (!seenIds.has(item.mediaId)) {
          seenIds.add(item.mediaId);
          uniqueResults.push(item);
        }
      }
      log("info", `[Bilibili] \u641C\u7D22\u5B8C\u6210\uFF0C\u627E\u5230 ${uniqueResults.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return uniqueResults;
    } catch (error) {
      log("error", "[Bilibili] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  /**
   * 获取番剧分集列表
   */
  async _getPgcEpisodes(seasonId) {
    let rawEpisodes = [];
    const apis = [
      `https://api.bilibili.com/pgc/view/web/season?season_id=${seasonId}`,
      `https://api.bilibili.com/pgc/web/season/section?season_id=${seasonId}`
    ];
    for (const url of apis) {
      try {
        const response = await Widget.http.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.bilibili.com/",
            "Cookie": globals.bilibliCookie || ""
          }
        });
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        if (data.code === 0 && data.result) {
          rawEpisodes = data.result.main_section?.episodes || data.result.episodes || [];
          if (rawEpisodes.length > 0) break;
        }
      } catch (e) {
      }
    }
    if (rawEpisodes.length === 0) {
      log("error", `[Bilibili] \u83B7\u53D6\u756A\u5267\u5206\u96C6\u5931\u8D25 (season_id=${seasonId}): \u6240\u6709\u63A5\u53E3\u5747\u65E0\u6570\u636E`);
      return [];
    }
    const episodes = rawEpisodes.map((ep, index) => ({
      vid: `${ep.aid},${ep.cid}`,
      id: ep.id,
      title: (ep.show_title || ep.long_title || ep.title || `\u7B2C${index + 1}\u96C6`).trim(),
      link: `https://www.bilibili.com/bangumi/play/ep${ep.id}`
    }));
    log("info", `[Bilibili] \u83B7\u53D6\u5230 ${episodes.length} \u4E2A\u756A\u5267\u5206\u96C6`);
    return episodes;
  }
  /**
   * 获取普通视频分集列表
   */
  async _getUgcEpisodes(bvid) {
    try {
      const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
      const response = await Widget.http.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://www.bilibili.com/",
          "Cookie": globals.bilibliCookie || ""
        }
      });
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (data.code !== 0 || !data.data) {
        log("error", `[Bilibili] \u83B7\u53D6\u89C6\u9891\u5206\u96C6\u5931\u8D25 (bvid=${bvid}):`, data.message);
        return [];
      }
      const pages = data.data.pages || [];
      if (pages.length === 0) {
        log("info", `[Bilibili] \u89C6\u9891 bvid=${bvid} \u65E0\u5206\u96C6\u6570\u636E`);
        return [];
      }
      const episodes = pages.map((page, index) => ({
        vid: `${data.data.aid},${page.cid}`,
        id: page.cid,
        title: (page.part || `P${page.page}`).trim(),
        link: `https://www.bilibili.com/video/${bvid}?p=${page.page}`
      }));
      log("info", `[Bilibili] \u83B7\u53D6\u5230 ${episodes.length} \u4E2A\u89C6\u9891\u5206\u96C6`);
      return episodes;
    } catch (error) {
      log("error", `[Bilibili] \u83B7\u53D6\u89C6\u9891\u5206\u96C6\u51FA\u9519 (bvid=${bvid}):`, error.message);
      return [];
    }
  }
  async getEpisodes(id) {
    if (id.startsWith("ss")) {
      const seasonId = id.substring(2);
      return await this._getPgcEpisodes(seasonId);
    } else if (id.startsWith("bv")) {
      const bvid = id.substring(2);
      return await this._getUgcEpisodes(bvid);
    }
    log("error", `[Bilibili] \u4E0D\u652F\u6301\u7684 ID \u683C\u5F0F: ${id}`);
    return [];
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Bilibili] sourceAnimes is not a valid array");
      return [];
    }
    const cnAlias = sourceAnimes.length > 0 ? sourceAnimes[0]._tmdbCnAlias : null;
    smartTitleReplace(sourceAnimes, cnAlias);
    const processPromises = sourceAnimes.filter((anime) => anime.isOversea || titleMatches(anime.title, queryTitle) || anime.org_title && titleMatches(anime.org_title, queryTitle)).map(async (anime) => {
      try {
        let links = [];
        const isIncomplete = anime.checkMore?.content?.includes("\u67E5\u770B\u5168\u90E8");
        if (anime._eps && anime._eps.length > 0 && !isIncomplete) {
          links = anime._eps.map((ep, index) => {
            let realVal;
            if (anime.isOversea && ep.position) {
              realVal = ep.position.toString();
            } else {
              realVal = ep.index_title || ep.index || (index + 1).toString();
            }
            const epIndex = ep.title || ep.index_title || realVal;
            const longTitle = ep.long_title || "";
            let displayTitle2 = /^\d+(\.\d+)?$/.test(epIndex) ? `\u7B2C${epIndex}\u8BDD` : epIndex;
            if (longTitle && longTitle !== epIndex) displayTitle2 += ` ${longTitle}`;
            const epId = ep.id || ep.param;
            let linkUrl = `https://www.bilibili.com/bangumi/play/ep${epId}?season_id=${anime.mediaId.substring(2)}`;
            if (anime.isOversea) linkUrl += "&area=hkmt";
            return {
              name: realVal,
              url: linkUrl,
              title: `\u3010bilibili1\u3011 ${displayTitle2.trim()}`
            };
          });
          links.sort((a, b) => {
            const numA = parseFloat(a.name);
            const numB = parseFloat(b.name);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return 0;
          });
          log("info", `[Bilibili] \u76F4\u63A5\u4F7F\u7528\u641C\u7D22\u7ED3\u679C\u4E2D\u7684 ${links.length} \u96C6\u5206\u96C6`);
        } else {
          const eps = await this.getEpisodes(anime.mediaId);
          if (eps.length === 0) {
            log("info", `[Bilibili] ${anime.title} \u65E0\u5206\u96C6\uFF0C\u8DF3\u8FC7`);
            return;
          }
          links = eps.map((ep, index) => {
            let linkUrl = ep.link + `?season_id=${anime.mediaId.substring(2)}`;
            if (anime.isOversea) linkUrl += "&area=hkmt";
            return {
              name: `${index + 1}`,
              url: linkUrl,
              title: `\u3010bilibili1\u3011 ${ep.title}`
            };
          });
        }
        if (links.length === 0) return;
        const numericAnimeId = convertToAsciiSum(anime.mediaId);
        const displayTitle = anime._displayTitle || simplized(anime.title);
        const transformedAnime = {
          animeId: numericAnimeId,
          bangumiId: anime.mediaId,
          animeTitle: `${displayTitle}(${anime.year || "N/A"})\u3010${anime.type}\u3011from bilibili`,
          type: anime.type,
          typeDescription: anime.type,
          imageUrl: anime.imageUrl,
          startDate: generateValidStartDate(anime.year),
          episodeCount: links.length,
          rating: 0,
          isFavorited: true,
          source: "bilibili"
        };
        tmpAnimes.push(transformedAnime);
        addAnime({ ...transformedAnime, links });
        if (globals.animes.length > globals.MAX_ANIMES) {
          removeEarliestAnime();
        }
      } catch (error) {
        log("error", `[Bilibili] \u5904\u7406 ${anime.title} \u5931\u8D25:`, error.message);
      }
    });
    await Promise.all(processPromises);
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return tmpAnimes;
  }
  // 提取视频信息的公共方法
  async _extractVideoInfo(id) {
    log("info", "\u63D0\u53D6B\u7AD9\u89C6\u9891\u4FE1\u606F...", id);
    const api_video_info = "https://api.bilibili.com/x/web-interface/view";
    const api_epid_cid = "https://api.bilibili.com/pgc/view/web/season";
    const regex = /^(https?:\/\/[^\/]+)(\/[^?#]*)/;
    const match = id.match(regex);
    let path2;
    if (match) {
      path2 = match[2].split("/").filter(Boolean);
      path2.unshift("");
      log("info", path2);
    } else {
      log("error", "Invalid URL");
      return null;
    }
    let cid, aid, duration, title;
    if (id.includes("video/")) {
      try {
        const queryString = id.split("?")[1];
        let p = 1;
        if (queryString) {
          const params = queryString.split("&");
          for (let param of params) {
            const [key, value] = param.split("=");
            if (key === "p") {
              p = value || 1;
            }
          }
        }
        log("info", `p: ${p}`);
        let videoInfoUrl;
        if (id.includes("BV")) {
          videoInfoUrl = `${api_video_info}?bvid=${path2[2]}`;
        } else {
          aid = path2[2].substring(2);
          videoInfoUrl = `${api_video_info}?aid=${path2[2].substring(2)}`;
        }
        const res = await Widget.http.get(videoInfoUrl, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });
        const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        if (data.code !== 0) {
          log("error", "\u83B7\u53D6\u666E\u901A\u6295\u7A3F\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", data.message);
          return null;
        }
        duration = data.data.duration;
        cid = data.data.pages[p - 1].cid;
      } catch (error) {
        log("error", "\u8BF7\u6C42\u666E\u901A\u6295\u7A3F\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
        return null;
      }
    } else if (id.includes("bangumi/") && id.includes("ep")) {
      try {
        const epid = path2.slice(-1)[0].slice(2);
        const urlParams = id.split("?")[1] || "";
        let seasonId = null, isOversea = false;
        urlParams.split("&").forEach((p) => {
          const [k, v] = p.split("=");
          if (k === "season_id") seasonId = v;
          if (k === "area" && v === "hkmt") isOversea = true;
        });
        let success = false;
        if (!isOversea) {
          const res = await Widget.http.get(`${api_epid_cid}?ep_id=${epid}`, {
            headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" }
          });
          const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          if (data.code === 0 && data.result) {
            const ep = data.result.episodes.find((e) => e.id == epid);
            if (ep) {
              cid = ep.cid;
              duration = ep.duration / 1e3;
              title = ep.share_copy;
              success = true;
            }
          }
        }
        if ((!success || isOversea) && seasonId && this._hasBilibiliProxy()) {
          try {
            const proxyUrl = this._makeProxyUrl(`https://api.bilibili.com/pgc/view/web/season?season_id=${seasonId}`);
            const res = await Widget.http.get(proxyUrl, { headers: { "Cookie": globals.bilibliCookie || "", "User-Agent": "Mozilla/5.0" } });
            const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            if (data.code === 0 && data.result) {
              const ep = (data.result.episodes || data.result.main_section?.episodes || []).find((e) => e.id == epid);
              if (ep) {
                cid = ep.cid;
                aid = ep.aid;
                duration = ep.duration / 1e3;
                title = ep.long_title;
                success = true;
              }
            }
          } catch (e) {
          }
          if (!success) {
            try {
              const res = await Widget.http.get(`https://api.bilibili.com/pgc/web/season/section?season_id=${seasonId}`, { headers: { "User-Agent": "Mozilla/5.0", "Cookie": globals.bilibliCookie || "" } });
              const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
              if (data.code === 0 && data.result?.main_section?.episodes) {
                const ep = data.result.main_section.episodes.find((e) => e.id == epid);
                if (ep) {
                  cid = ep.cid;
                  aid = ep.aid;
                  duration = ep.duration ? ep.duration / 1e3 : 0;
                  title = ep.long_title;
                  success = true;
                }
              }
            } catch (e) {
            }
          }
        }
        if (!cid) {
          log("error", "\u672A\u627E\u5230\u5339\u914D\u7684\u756A\u5267\u96C6\u4FE1\u606F");
          return null;
        }
        if (!duration && duration !== 0) duration = 0;
      } catch (error) {
        log("error", "\u8BF7\u6C42\u756A\u5267\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
        return null;
      }
    } else if (id.includes("bangumi/") && id.includes("ss")) {
      try {
        const ssid = path2.slice(-1)[0].slice(2).split("?")[0];
        const ssInfoUrl = `${api_epid_cid}?season_id=${ssid}`;
        log("info", `\u83B7\u53D6\u756A\u5267\u4FE1\u606F: season_id=${ssid}`);
        const res = await Widget.http.get(ssInfoUrl, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });
        const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        if (data.code !== 0) {
          log("error", "\u83B7\u53D6\u756A\u5267\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", data.message);
          return null;
        }
        if (!data.result.episodes || data.result.episodes.length === 0) {
          log("error", "\u756A\u5267\u6CA1\u6709\u53EF\u7528\u7684\u96C6\u6570");
          return null;
        }
        const firstEpisode = data.result.episodes[0];
        cid = firstEpisode.cid;
        duration = firstEpisode.duration / 1e3;
        title = firstEpisode.share_copy;
        log("info", `\u4F7F\u7528\u7B2C\u4E00\u96C6: ${title}, cid=${cid}`);
      } catch (error) {
        log("error", "\u8BF7\u6C42\u756A\u5267\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
        return null;
      }
    } else {
      log("error", "\u4E0D\u652F\u6301\u7684B\u7AD9\u89C6\u9891\u7F51\u5740\uFF0C\u4EC5\u652F\u6301\u666E\u901A\u89C6\u9891(av,bv)\u3001\u5267\u96C6\u89C6\u9891(ep,ss)");
      return null;
    }
    log("info", `\u63D0\u53D6\u89C6\u9891\u4FE1\u606F\u5B8C\u6210: cid=${cid}, aid=${aid}, duration=${duration}`);
    return { cid, aid, duration, title };
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42B\u7AD9\u5F39\u5E55...", id);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const BATCH_SIZE = 6;
    let contents = [];
    for (let i = 0; i < segmentList.length; i += BATCH_SIZE) {
      const batch = segmentList.slice(i, i + BATCH_SIZE);
      const promises = batch.map((segment) => this.getEpisodeSegmentDanmu(segment).then((d) => ({ status: "ok", value: d })).catch((e) => ({ status: "err", error: e })));
      const results = await Promise.all(promises);
      let stop = false;
      for (const res of results) {
        if (res.status === "ok" && res.value) {
          contents.push(...res.value);
        } else {
          log("info", "[Bilibili] \u6355\u83B7\u5230\u5206\u6BB5\u8BF7\u6C42\u51FA\u9519\uFF0C\u8BF4\u660E\u8BF7\u6C42\u5B8C\u6BD5\uFF0C\u505C\u6B62\u540E\u7EED\u8BF7\u6C42");
          stop = true;
        }
      }
      if (stop) break;
    }
    return contents;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6B\u7AD9\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    const videoInfo = await this._extractVideoInfo(id);
    if (!videoInfo) {
      return new SegmentListResponse({
        "type": "bilibili1",
        "segmentList": []
      });
    }
    const { cid, aid, duration } = videoInfo;
    log("info", `\u89C6\u9891\u4FE1\u606F: cid=${cid}, aid=${aid}, duration=${duration}`);
    if (duration <= 0) {
      log("info", "[Bilibili] \u672A\u83B7\u53D6\u5230\u7CBE\u51C6\u65F6\u957F\uFF0C\u4F7F\u7528\u9884\u8BBE 36 \u5206\u6BB5");
    }
    const maxLen = duration > 0 ? Math.floor(duration / 360) + 1 : 36;
    log("info", `maxLen: ${maxLen}`);
    const segmentList = [];
    for (let i = 0; i < maxLen; i += 1) {
      let danmakuUrl;
      if (aid) {
        danmakuUrl = `https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=${cid}&pid=${aid}&segment_index=${i + 1}`;
      } else {
        danmakuUrl = `https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=${cid}&segment_index=${i + 1}`;
      }
      segmentList.push({
        "type": "bilibili1",
        "segment_start": i * 360,
        "segment_end": (i + 1) * 360,
        "url": danmakuUrl
      });
    }
    return new SegmentListResponse({
      "type": "bilibili1",
      "segmentList": segmentList
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    try {
      const response = await Widget.http.get(segment.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Cookie": globals.bilibliCookie
        },
        base64Data: true,
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        contents = parseDanmakuBase64(response.data);
      }
      return contents;
    } catch (error) {
      throw error;
    }
  }
  formatComments(comments) {
    if (globals.danmuSimplifiedTraditional === "simplified") {
      return comments.map((c) => {
        if (c.m) c.m = simplized(c.m);
        return c;
      });
    }
    return comments;
  }
  // 构建代理URL
  _makeProxyUrl(targetUrl) {
    return globals.makeProxyUrl(targetUrl);
  }
  // 检查是否配置了B站专用代理
  _hasBilibiliProxy() {
    return (globals.proxyUrl || "").split(",").some((p) => {
      const t = p.trim();
      return t.startsWith("bilibili@") || t.startsWith("@");
    });
  }
  // APP接口专用 URL 编码
  _javaUrlEncode(str) {
    return encodeURIComponent(str).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
  }
  // 港澳台代理搜索请求
  async _searchOverseaRequest(keyword, label = "Original", signal = null) {
    const rawCookie = globals.bilibliCookie || "";
    const akMatch = rawCookie.match(/([0-9a-fA-F]{32})/);
    const proxy = (globals.proxyUrl || "").includes("bilibili@") || (globals.proxyUrl || "").includes("@");
    if (!proxy) return [];
    if (akMatch) {
      log("info", `[Bilibili-Proxy][${label}] \u68C0\u6D4B\u5230 Access Key\uFF0C\u542F\u7528 APP \u7AEF\u63A5\u53E3\u6A21\u5F0F...`);
      try {
        const params = { keyword, type: 7, area: "tw", mobi_app: "android", platform: "android", build: "8140200", ts: Math.floor(Date.now() / 1e3), appkey: _BilibiliSource.APP_KEY, access_key: akMatch[1], disable_rcmd: 1 };
        const qs = Object.keys(params).sort().map((k) => `${k}=${this._javaUrlEncode(String(params[k]))}`).join("&");
        const sign = md5(qs + _BilibiliSource.APP_SEC);
        const target = `https://app.bilibili.com/x/v2/search/type?${qs}&sign=${sign}`;
        const url = globals.makeProxyUrl(target);
        const data = await this._fetchAppSearchWithStream(url, { "User-Agent": "Mozilla/5.0 Android", "X-From-Biliroaming": "1.0.0" }, label, signal);
        if (data && data.code === 0) {
          return (data.data?.items || data.data || []).filter((i) => i.goto !== "recommend_tips" && i.area !== "\u6F2B\u6E38" && i.badge !== "\u516C\u544A").map((i) => ({
            provider: "bilibili",
            mediaId: i.season_id ? `ss${i.season_id}` : i.uri.match(/season\/(\d+)/)?.[1] ? `ss${i.uri.match(/season\/(\d+)/)[1]}` : "",
            title: (i.title || "").replace(/<[^>]+>/g, "").trim(),
            type: "\u52A8\u6F2B",
            year: i.ptime ? new Date(i.ptime * 1e3).getFullYear() : null,
            imageUrl: i.cover || i.pic || "",
            episodeCount: 0,
            _eps: i.episodes || i.episodes_new,
            checkMore: i.check_more,
            isOversea: true
          })).filter((i) => i.mediaId);
        }
        if (data && data.code !== 0) log("warn", `[Bilibili-Proxy] App \u63A5\u53E3\u8FD4\u56DE\u9519\u8BEF Code ${data.code}: ${data.message}`);
      } catch (e) {
        if (e.name === "AbortError") throw e;
        log("error", `[Bilibili-Proxy] App \u63A5\u53E3\u8BF7\u6C42\u5F02\u5E38: ${e.message}`);
      }
      log("info", `[Bilibili-Proxy] App \u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF0C\u81EA\u52A8\u964D\u7EA7\u81F3 Web \u63A5\u53E3...`);
    } else {
      log("info", `[Bilibili-Proxy][${label}] \u672A\u68C0\u6D4B\u5230 Access Key\uFF0C\u542F\u7528 Web \u7AEF\u63A5\u53E3\u6A21\u5F0F...`);
    }
    try {
      const params = { keyword, search_type: "media_bangumi", area: "tw", page: 1, order: "totalrank", __refresh__: true, _timestamp: Date.now() };
      const qs = Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");
      const target = `https://api.bilibili.com/x/web-interface/search/type?${qs}`;
      const url = globals.makeProxyUrl(target);
      const res = await Widget.http.get(url, {
        headers: { "User-Agent": "Mozilla/5.0", "Cookie": globals.bilibliCookie || "", "X-From-Biliroaming": "1.0.0" },
        signal
      });
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (data.code !== 0) {
        log("warn", `[Bilibili-Proxy] Web \u63A5\u53E3\u8FD4\u56DE\u9519\u8BEF Code ${data.code}: ${data.message}`);
        return [];
      }
      if (data.data?.result) {
        return data.data.result.filter((i) => i.url?.includes("bilibili.com") && !i.areas?.includes("\u6F2B\u6E38")).map((i) => ({
          provider: "bilibili",
          mediaId: i.season_id ? `ss${i.season_id}` : "",
          title: (i.title || "").replace(/<[^>]+>/g, "").trim(),
          type: this._extractMediaType(i.season_type_name),
          year: i.pubtime ? new Date(i.pubtime * 1e3).getFullYear() : null,
          imageUrl: i.cover || null,
          episodeCount: i.ep_size || 0,
          _eps: i.eps,
          isOversea: true
        })).filter((i) => i.mediaId);
      }
    } catch (e) {
      if (e.name === "AbortError") throw e;
      log("error", `[Bilibili-Proxy] Web \u63A5\u53E3\u8BF7\u6C42\u5F02\u5E38: ${e.message}\uFF08\u5982\u679C\u662F-500/-502\u8BF4\u660E\u53EA\u662F\u98CE\u63A7\uFF09`);
    }
    return [];
  }
  // 综合港澳台搜索入口
  async _searchOversea(keyword) {
    const tmdbAbortController = new AbortController();
    const t1 = this._searchOverseaRequest(keyword, "Original").then((r) => {
      if (r.length) tmdbAbortController.abort();
      r.forEach((i) => i._originalQuery = keyword);
      return r;
    }).catch(() => []);
    const t2 = globals.tmdbApiKey ? new Promise((r) => setTimeout(r, 100)).then(async () => {
      const tmdbResult = await getTmdbJaOriginalTitle(keyword, tmdbAbortController.signal, "Bilibili");
      if (tmdbResult && tmdbResult.title && tmdbResult.title !== keyword) {
        const { title: tmdbTitle, cnAlias } = tmdbResult;
        const results = await this._searchOverseaRequest(tmdbTitle, "TMDB", tmdbAbortController.signal);
        results.forEach((r) => {
          r._originalQuery = keyword;
          r._searchUsedTitle = tmdbTitle;
          r._tmdbCnAlias = cnAlias;
        });
        return results;
      }
      return [];
    }).catch(() => []) : Promise.resolve([]);
    return (await Promise.all([t1, t2])).flat();
  }
  // APP搜索流式嗅探，针对 B 站港澳台无结果时返回的大体积推荐数据
  async _fetchAppSearchWithStream(url, headers, label, signal) {
    if (typeof httpGetWithStreamCheck !== "function") return null;
    let trusted = false;
    let isNoResult = false;
    const result = await Widget.http.getWithStreamCheck(url, {
      headers,
      sniffLimit: 8192,
      signal
    }, (chunk) => {
      if (trusted) return true;
      if (chunk.includes('"goto":"recommend_tips"') || chunk.includes("\u6682\u65E0\u641C\u7D22\u7ED3\u679C")) {
        log("info", `[Bilibili-Proxy][${label}] \u55C5\u63A2\u5230\u65E0\u6548\u6570\u636E\uFF0C\u4E2D\u65AD`);
        isNoResult = true;
        return false;
      }
      if (chunk.includes('"season_id"') || chunk.includes('"episodes"')) trusted = true;
      return true;
    });
    if (isNoResult) {
      return { code: 0, data: { items: [] } };
    }
    return result;
  }
};
// WBI 签名相关常量
__publicField(_BilibiliSource, "WBI_MIXIN_KEY_CACHE", { key: null, timestamp: 0 });
__publicField(_BilibiliSource, "WBI_MIXIN_KEY_CACHE_TTL", 3600);
// 缓存1小时
__publicField(_BilibiliSource, "WBI_MIXIN_KEY_TABLE", [
  46,
  47,
  18,
  2,
  53,
  8,
  23,
  32,
  15,
  50,
  10,
  31,
  58,
  3,
  45,
  35,
  27,
  43,
  5,
  49,
  33,
  9,
  42,
  19,
  29,
  28,
  14,
  39,
  12,
  38,
  41,
  13,
  37,
  48,
  7,
  16,
  24,
  55,
  40,
  61,
  26,
  17,
  0,
  1,
  60,
  51,
  30,
  4,
  22,
  25,
  54,
  21,
  56,
  59,
  6,
  63,
  57,
  62,
  11,
  36,
  20,
  34,
  44,
  52
]);
// APP 签名相关常量 (Android 粉版 - 港澳台搜索用)
__publicField(_BilibiliSource, "APP_KEY", "1d8b6e7d45233436");
__publicField(_BilibiliSource, "APP_SEC", "560c52ccd288fed045859ed18bffd973");
var BilibiliSource = _BilibiliSource;

// danmu_api/sources/youku.js
var YoukuSource = class extends BaseSource {
  convertYoukuUrl(url) {
    const vidMatch = url.match(/vid=([^&]+)/);
    if (!vidMatch || !vidMatch[1]) {
      return null;
    }
    const vid2 = vidMatch[1];
    return `https://v.youku.com/v_show/id_${vid2}.html`;
  }
  /**
   * 过滤优酷搜索项
   * @param {Object} component - 搜索组件
   * @param {string} keyword - 搜索关键词
   * @returns {Object|null} 过滤后的结果
   */
  filterYoukuSearchItem(component, keyword) {
    const commonData = component.commonData;
    if (!commonData || !commonData.titleDTO) {
      return null;
    }
    if (commonData.isYouku !== 1 && commonData.hasYouku !== 1) {
      return null;
    }
    const title = commonData.titleDTO.displayName;
    const skipKeywords = ["\u4E2D\u914D\u7248", "\u62A2\u5148\u770B", "\u975E\u6B63\u7247", "\u89E3\u8BFB", "\u63ED\u79D8", "\u8D4F\u6790", "\u300A"];
    if (skipKeywords.some((kw) => title.includes(kw))) {
      return null;
    }
    const yearMatch = commonData.feature.match(/[12][890][0-9][0-9]/);
    const year = yearMatch ? parseInt(yearMatch[0]) : null;
    let cleanedTitle = title.replace(/<[^>]+>/g, "").replace(/【.+?】/g, "").trim().replace(/:/g, "\uFF1A");
    let mediaType = "\u7535\u89C6\u5267";
    const cats = (commonData.cats || "").toLowerCase();
    const feature = (commonData.feature || "").toLowerCase();
    if (cats.includes("\u52A8\u6F2B") || cats.includes("anime")) {
      mediaType = "\u52A8\u6F2B";
    } else if (cats.includes("\u7535\u5F71") || cats.includes("movie")) {
      mediaType = "\u7535\u5F71";
    } else if (cats.includes("\u7535\u89C6\u5267") || cats.includes("drama")) {
      mediaType = "\u7535\u89C6\u5267";
    } else if (cats.includes("\u7EFC\u827A") || cats.includes("variety")) {
      mediaType = "\u7EFC\u827A";
    } else if (feature.includes("\u52A8\u6F2B")) {
      mediaType = "\u52A8\u6F2B";
    } else if (feature.includes("\u7535\u5F71")) {
      mediaType = "\u7535\u5F71";
    } else if (feature.includes("\u7535\u89C6\u5267")) {
      mediaType = "\u7535\u89C6\u5267";
    } else if (feature.includes("\u7EFC\u827A")) {
      mediaType = "\u7EFC\u827A";
    }
    return {
      provider: "youku",
      mediaId: commonData.showId,
      title: cleanedTitle,
      type: mediaType,
      year,
      imageUrl: commonData.posterDTO ? commonData.posterDTO.vThumbUrl : null,
      episodeCount: commonData.episodeTotal,
      cats: commonData.cats
      // 保存分类信息用于后续判断
    };
  }
  async search(keyword) {
    try {
      log("info", `[Youku] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const encodedKeyword = encodeURIComponent(keyword);
      const encodedUA = encodeURIComponent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
      const searchUrl = `https://search.youku.com/api/search?keyword=${encodedKeyword}&userAgent=${encodedUA}&site=1&categories=0&ftype=0&ob=0&pg=1`;
      const response = await Widget.http.get(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "application/json",
          "Referer": "https://www.youku.com/"
        }
      });
      if (!response || !response.data) {
        log("info", "[Youku] \u641C\u7D22\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (!data.pageComponentList) {
        log("info", "[Youku] \u641C\u7D22\u65E0\u7ED3\u679C");
        return [];
      }
      const results = [];
      for (const component of data.pageComponentList) {
        const filtered = this.filterYoukuSearchItem(component, keyword);
        if (filtered) {
          results.push(filtered);
        }
      }
      log("info", `[Youku] \u641C\u7D22\u627E\u5230 ${results.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return results;
    } catch (error) {
      log("error", "[Youku] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      log("info", `[Youku] \u83B7\u53D6\u5206\u96C6\u5217\u8868: show_id=${id}`);
      const pageSize = 100;
      const firstPage = await this._getEpisodesPage(id, 1, pageSize);
      if (!firstPage || !firstPage.videos || firstPage.videos.length === 0) {
        log("info", "[Youku] \u672A\u627E\u5230\u5206\u96C6\u4FE1\u606F");
        return [];
      }
      let allEpisodes = [...firstPage.videos];
      const totalCount = firstPage.total;
      if (totalCount > pageSize) {
        const totalPages = Math.ceil(totalCount / pageSize);
        log("info", `[Youku] \u68C0\u6D4B\u5230 ${totalCount} \u4E2A\u5206\u96C6\uFF0C\u5C06\u5E76\u53D1\u8BF7\u6C42 ${totalPages} \u9875`);
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(this._getEpisodesPage(id, page, pageSize));
        }
        const results = await Promise.allSettled(pagePromises);
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result.status === "fulfilled" && result.value && result.value.videos) {
            allEpisodes.push(...result.value.videos);
          } else if (result.status === "rejected") {
            log("error", `[Youku] \u83B7\u53D6\u5206\u96C6\u9875\u9762 ${i + 2} \u5931\u8D25:`, result.reason);
          }
        }
        log("info", `[Youku] \u5E76\u53D1\u83B7\u53D6\u5B8C\u6210\uFF0C\u5171\u83B7\u53D6 ${allEpisodes.length} \u4E2A\u5206\u96C6`);
      }
      log("info", `[Youku] \u5171\u83B7\u53D6 ${allEpisodes.length} \u96C6`);
      return allEpisodes;
    } catch (error) {
      log("error", "[Youku] \u83B7\u53D6\u5206\u96C6\u51FA\u9519:", error.message);
      return [];
    }
  }
  async _getEpisodesPage(showId, page, pageSize) {
    const url = `https://openapi.youku.com/v2/shows/videos.json?client_id=53e6cc67237fc59a&package=com.huawei.hwvplayer.youku&ext=show&show_id=${showId}&page=${page}&count=${pageSize}`;
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    if (!response || !response.data) {
      return null;
    }
    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    return data;
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Youku] sourceAnimes is not a valid array");
      return [];
    }
    const processYoukuAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.mediaId);
          const mediaType = this._extractMediaType(anime.cats, anime.type);
          const formattedEps = this._processAndFormatEpisodes(eps, mediaType);
          let links = [];
          for (const ep of formattedEps) {
            const fullUrl = ep.link || `https://v.youku.com/v_show/id_${ep.vid}.html`;
            links.push({
              "name": ep.episodeIndex.toString(),
              "url": fullUrl,
              "title": `\u3010youku\u3011 ${ep.title}`
            });
          }
          if (links.length > 0) {
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            let transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year || "N/A"})\u3010${anime.type}\u3011from youku`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "youku"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Youku] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processYoukuAnimes;
  }
  /**
   * 处理和格式化分集列表
   * @param {Array} rawEpisodes - 原始分集数据
   * @param {string} mediaType - 媒体类型 (variety/movie/drama/anime)
   * @returns {Array} 格式化后的分集列表
   */
  _processAndFormatEpisodes(rawEpisodes, mediaType = "variety") {
    let filteredEpisodes = [...rawEpisodes];
    const formattedEpisodes = filteredEpisodes.map((ep, index) => {
      const episodeIndex = index + 1;
      const title = this._formatEpisodeTitle(ep, episodeIndex, mediaType);
      return {
        vid: ep.id,
        title,
        episodeIndex,
        link: ep.link
      };
    });
    return formattedEpisodes;
  }
  /**
   * 根据媒体类型格式化分集标题
   * @param {Object} ep - 分集对象
   * @param {number} episodeIndex - 分集索引
   * @param {string} mediaType - 媒体类型
   * @returns {string} 格式化后的标题
   */
  _formatEpisodeTitle(ep, episodeIndex, mediaType) {
    let cleanDisplayName = ep.displayName || ep.title;
    const datePattern = /^(?:\d{2,4}-\d{2}-\d{2}|\d{2}-\d{2})\s*(?=(?:第\d+期))|^(?:\d{2,4}-\d{2}-\d{2}|\d{2}-\d{2})\s*:\s*/;
    cleanDisplayName = cleanDisplayName.replace(datePattern, "").trim();
    if (mediaType === "movie") {
      return cleanDisplayName;
    }
    if (mediaType === "variety") {
      const periodMatch = cleanDisplayName.match(/第(\d+)期/);
      if (periodMatch) {
        return `\u7B2C${periodMatch[1]}\u671F ${ep.published?.split(" ")[0] ?? ""} ${cleanDisplayName}`;
      } else {
        return `\u7B2C${episodeIndex}\u671F ${ep.published?.split(" ")[0] ?? ""} ${cleanDisplayName}`;
      }
    }
    if (/^第\d+集/.test(cleanDisplayName)) {
      return cleanDisplayName;
    } else {
      return `\u7B2C${episodeIndex}\u96C6 ${cleanDisplayName}`;
    }
  }
  /**
   * 从分类信息中提取媒体类型（参考 Python 版本的 _extract_media_type_from_response）
   * @param {string} cats - 分类字符串
   * @param {string} feature - 特征字符串
   * @returns {string} 媒体类型 (variety/movie/anime/drama)
   */
  _extractMediaType(cats, feature) {
    const catsLower = (cats || "").toLowerCase();
    const featureLower = (feature || "").toLowerCase();
    if (catsLower.includes("\u7EFC\u827A") || catsLower.includes("variety")) {
      return "variety";
    } else if (catsLower.includes("\u7535\u5F71") || catsLower.includes("movie")) {
      return "movie";
    } else if (catsLower.includes("\u52A8\u6F2B") || catsLower.includes("anime")) {
      return "anime";
    } else if (catsLower.includes("\u7535\u89C6\u5267") || catsLower.includes("drama")) {
      return "drama";
    }
    if (featureLower.includes("\u7EFC\u827A")) {
      return "variety";
    } else if (featureLower.includes("\u7535\u5F71")) {
      return "movie";
    } else if (featureLower.includes("\u52A8\u6F2B")) {
      return "anime";
    } else if (featureLower.includes("\u7535\u89C6\u5267")) {
      return "drama";
    }
    return "drama";
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u4F18\u9177\u5F39\u5E55...", id);
    if (!id) {
      return [];
    }
    const segmentListResponse = await this.getEpisodeDanmuSegments(id);
    const segmentList = segmentListResponse.segmentList;
    let contents = [];
    const concurrency = globals.youkuConcurrency;
    const segments = [...segmentList];
    for (let i = 0; i < segments.length; i += concurrency) {
      const batch = segments.slice(i, i + concurrency).map(async (segment) => {
        const response = await Widget.http.post(segment.url, buildQueryString({ data: segment.data }), {
          headers: {
            "Cookie": `_m_h5_tk=${segment._m_h5_tk};_m_h5_tk_enc=${segment._m_h5_tk_enc};`,
            "Referer": "https://v.youku.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
          },
          allow_redirects: false,
          retries: 1
        });
        const results = [];
        if (response.data?.data && response.data.data.result) {
          const result = JSON.parse(response.data.data.result);
          if (result.code !== "-1") {
            results.push(...result.data.result);
          }
        }
        return results;
      });
      try {
        const settled = await Promise.allSettled(batch);
        for (const s of settled) {
          if (s.status === "fulfilled" && Array.isArray(s.value)) {
            contents = contents.concat(s.value);
          }
        }
      } catch (e) {
        log("error", "\u4F18\u9177\u5206\u6BB5\u6279\u91CF\u8BF7\u6C42\u5931\u8D25:", e.message);
      }
    }
    printFirst200Chars(contents);
    return contents;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u4F18\u9177\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    if (!id) {
      return new SegmentListResponse({
        "type": "youku",
        "segmentList": []
      });
    }
    if (id.includes("youku.com/video?vid")) {
      id = this.convertYoukuUrl(id);
    }
    const api_video_info = "https://openapi.youku.com/v2/videos/show.json";
    const api_danmaku = "https://acs.youku.com/h5/mopen.youku.danmu.list/1.0/";
    const regex = /^(https?:\/\/[^\/]+)(\/[^?#]*)/;
    const match = id.match(regex);
    let path2;
    if (match) {
      path2 = match[2].split("/").filter(Boolean);
      path2.unshift("");
      log("info", path2);
    } else {
      log("error", "Invalid URL");
      return [];
    }
    const video_id = path2[path2.length - 1].split(".")[0].slice(3);
    log("info", `video_id: ${video_id}`);
    let res;
    try {
      const videoInfoUrl = `${api_video_info}?client_id=53e6cc67237fc59a&video_id=${video_id}&package=com.huawei.hwvplayer.youku&ext=show`;
      res = await Widget.http.get(videoInfoUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
        },
        allow_redirects: false
      });
    } catch (error) {
      log("error", "\u8BF7\u6C42\u89C6\u9891\u4FE1\u606F\u5931\u8D25:", error);
      return [];
    }
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    const title = data.title;
    const duration = data.duration;
    log("info", `\u6807\u9898: ${title}, \u65F6\u957F: ${duration}`);
    let cna, _m_h5_tk_enc, _m_h5_tk;
    try {
      const cnaUrl = "https://log.mmstat.com/eg.js";
      const tkEncUrl = "https://acs.youku.com/h5/mtop.com.youku.aplatform.weakget/1.0/?jsv=2.5.1&appKey=24679788";
      const cnaRes = await Widget.http.get(cnaUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
        },
        allow_redirects: false
      });
      log("info", `cnaRes: ${JSON.stringify(cnaRes)}`);
      log("info", `cnaRes.headers: ${JSON.stringify(cnaRes.headers)}`);
      const etag = cnaRes.headers["etag"] || cnaRes.headers["Etag"];
      log("info", `etag: ${etag}`);
      cna = etag.replace(/^"|"$/g, "");
      log("info", `cna: ${cna}`);
      let tkEncRes;
      while (!tkEncRes) {
        tkEncRes = await Widget.http.get(tkEncUrl, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
          },
          allow_redirects: false
        });
      }
      log("info", `tkEncRes: ${JSON.stringify(tkEncRes)}`);
      log("info", `tkEncRes.headers: ${JSON.stringify(tkEncRes.headers)}`);
      const tkEncSetCookie = tkEncRes.headers["set-cookie"] || tkEncRes.headers["Set-Cookie"];
      log("info", `tkEncSetCookie: ${tkEncSetCookie}`);
      const tkEncMatch = tkEncSetCookie.match(/_m_h5_tk_enc=([^;]+)/);
      _m_h5_tk_enc = tkEncMatch ? tkEncMatch[1] : null;
      const tkH5Match = tkEncSetCookie.match(/_m_h5_tk=([^;]+)/);
      _m_h5_tk = tkH5Match ? tkH5Match[1] : null;
      log("info", `_m_h5_tk_enc: ${_m_h5_tk_enc}`);
      log("info", `_m_h5_tk: ${_m_h5_tk}`);
    } catch (error) {
      log("error", "\u83B7\u53D6 cna \u6216 tk_enc \u5931\u8D25:", error);
      return [];
    }
    const step = 60;
    const max_mat = Math.floor(duration / step) + 1;
    let segmentList = [];
    const requestOneMat = async (mat) => {
      const msg = {
        ctime: Date.now(),
        ctype: 10004,
        cver: "v1.0",
        guid: cna,
        mat,
        mcount: 1,
        pid: 0,
        sver: "3.1.0",
        type: 1,
        vid: video_id
      };
      const str = JSON.stringify(msg);
      function utf8ToLatin1(str2) {
        let result = "";
        for (let i = 0; i < str2.length; i++) {
          const charCode = str2.charCodeAt(i);
          if (charCode > 255) {
            result += encodeURIComponent(str2[i]);
          } else {
            result += str2[i];
          }
        }
        return result;
      }
      function base64Encode(input) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let output = "";
        let buffer = 0;
        let bufferLength = 0;
        for (let i = 0; i < input.length; i++) {
          buffer = buffer << 8 | input.charCodeAt(i);
          bufferLength += 8;
          while (bufferLength >= 6) {
            output += chars[buffer >> bufferLength - 6 & 63];
            bufferLength -= 6;
          }
        }
        if (bufferLength > 0) {
          output += chars[buffer << 6 - bufferLength & 63];
        }
        while (output.length % 4 !== 0) {
          output += "=";
        }
        return output;
      }
      const msg_b64encode = base64Encode(utf8ToLatin1(str));
      msg.msg = msg_b64encode;
      msg.sign = md5(`${msg_b64encode}MkmC9SoIw6xCkSKHhJ7b5D2r51kBiREr`).toString().toLowerCase();
      const data2 = JSON.stringify(msg);
      const t = Date.now();
      const params = {
        jsv: "2.5.6",
        appKey: "24679788",
        t,
        sign: md5([_m_h5_tk.slice(0, 32), t, "24679788", data2].join("&")).toString().toLowerCase(),
        api: "mopen.youku.danmu.list",
        v: "1.0",
        type: "originaljson",
        dataType: "jsonp",
        timeout: "20000",
        jsonpIncPrefix: "utility"
      };
      const queryString = buildQueryString(params);
      const url = `${api_danmaku}?${queryString}`;
      log("info", `piece_url: ${url}`);
      return {
        "type": "youku",
        "segment_start": mat * step,
        "segment_end": Math.min((mat + 1) * step, duration),
        "url": url,
        "data": data2,
        "_m_h5_tk": _m_h5_tk,
        "_m_h5_tk_enc": _m_h5_tk_enc
      };
    };
    const mats = Array.from({ length: max_mat }, (_, i) => i);
    for (let i = 0; i < mats.length; i++) {
      const result = await requestOneMat(mats[i]);
      segmentList.push(result);
    }
    return new SegmentListResponse({
      "type": "youku",
      "segmentList": segmentList
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u4F18\u9177\u5206\u6BB5\u5F39\u5E55...", segment.url);
    const response = await Widget.http.post(segment.url, buildQueryString({ data: segment.data }), {
      headers: {
        "Cookie": `_m_h5_tk=${segment._m_h5_tk};_m_h5_tk_enc=${segment._m_h5_tk_enc};`,
        "Referer": "https://v.youku.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
      },
      allow_redirects: false,
      retries: 1
    });
    const results = [];
    if (response.data?.data && response.data.data.result) {
      const result = JSON.parse(response.data.data.result);
      if (result.code !== "-1") {
        results.push(...result.data.result);
      }
    }
    return results;
  }
  formatComments(comments) {
    return comments.map((item) => {
      const content = {
        timepoint: 0,
        ct: 1,
        size: 25,
        color: 16777215,
        unixtime: Math.floor(Date.now() / 1e3),
        uid: 0,
        content: ""
      };
      content.timepoint = item.playat / 1e3;
      const prop = JSON.parse(item.propertis);
      if (prop?.color) {
        content.color = typeof prop.color === "string" ? parseInt(prop.color, 10) : prop.color;
      }
      if (prop?.pos) {
        const pos = prop.pos;
        if (pos === 1) content.ct = 5;
        else if (pos === 2) content.ct = 4;
      }
      content.content = item.content;
      return content;
    });
  }
};

// danmu_api/sources/sohu.js
var SohuSource = class extends BaseSource {
  constructor() {
    super();
    this.positionMap = {
      1: 1,
      // 滚动弹幕
      4: 5,
      // 顶部弹幕
      5: 4
      // 底部弹幕
    };
  }
  /**
   * 过滤搜狐视频搜索项
   * @param {Object} item - 搜索项
   * @param {string} keyword - 搜索关键词
   * @returns {Object|null} 过滤后的结果
   */
  filterSohuSearchItem(item, keyword) {
    if (!item.aid || !item.album_name) {
      return null;
    }
    let title = item.album_name.replace("<<<", "").replace(">>>", "");
    let categoryName = null;
    if (item.meta && item.meta.length >= 2) {
      const metaText = item.meta[0].txt;
      const parts = metaText.split("|");
      if (parts.length > 0) {
        categoryName = parts[0].trim();
      }
    }
    return {
      mediaId: String(item.aid),
      title,
      type: categoryName,
      year: item.year || null,
      imageUrl: item.ver_big_pic || null,
      episodeCount: item.total_video_count || 0
    };
  }
  async search(keyword) {
    try {
      log("info", `[Sohu] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const params = {
        "key": keyword,
        "type": "1",
        "page": "1",
        "page_size": "20",
        "user_id": "",
        "tabsChosen": "0",
        "poster": "4",
        "tuple": "6",
        "extSource": "1",
        "show_star_detail": "3",
        "pay": "1",
        "hl": "3",
        "uid": String(Math.floor(Date.now() * 1e3)),
        "passport": "",
        "plat": "-1",
        "ssl": "0"
      };
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": "https://so.tv.sohu.com/",
        "Origin": "https://so.tv.sohu.com"
      };
      const searchUrl = `https://m.so.tv.sohu.com/search/pc/keyword?${buildQueryString(params)}`;
      const response = await Widget.http.get(searchUrl, { headers });
      if (!response || !response.data) {
        log("info", "[Sohu] \u641C\u7D22\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      if (!data.data || !data.data.items) {
        log("info", "[Sohu] \u641C\u7D22\u54CD\u5E94\u4E2D\u65E0\u6570\u636E");
        return [];
      }
      const results = [];
      for (const item of data.data.items) {
        const filtered = this.filterSohuSearchItem(item, keyword);
        if (filtered) {
          results.push(filtered);
        }
      }
      log("info", `[Sohu] \u641C\u7D22\u627E\u5230 ${results.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return results;
    } catch (error) {
      log("error", "[Sohu] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      log("info", `[Sohu] \u83B7\u53D6\u5206\u96C6\u5217\u8868: media_id=${id}`);
      let videosData = null;
      const params = {
        "playlistid": id,
        "api_key": "f351515304020cad28c92f70f002261c"
      };
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://tv.sohu.com/"
      };
      const playlistUrl = `https://pl.hd.sohu.com/videolist?${buildQueryString(params)}`;
      const response = await Widget.http.get(playlistUrl, { headers, timeout: 15e3 });
      if (!response || !response.data) {
        log("info", "[Sohu] \u5206\u96C6\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      let data = response.data;
      if (typeof data === "string" && data.startsWith("jsonp")) {
        const start2 = data.indexOf("(") + 1;
        const end2 = data.lastIndexOf(")");
        if (start2 > 0 && end2 > start2) {
          const jsonStr = data.substring(start2, end2);
          data = JSON.parse(jsonStr);
        } else {
          log("error", "\u641C\u72D0\u89C6\u9891: \u65E0\u6CD5\u89E3\u6790JSONP\u54CD\u5E94");
          return [];
        }
      } else if (typeof data === "string") {
        data = JSON.parse(data);
      }
      videosData = data.videos || [];
      if (!videosData || videosData.length === 0) {
        log("warning", `\u641C\u72D0\u89C6\u9891: \u672A\u627E\u5230\u5206\u96C6\u5217\u8868 (media_id=${id})`);
        return [];
      }
      const episodes = [];
      for (let i = 0; i < videosData.length; i++) {
        const video = videosData[i];
        let vid2, title, url;
        if (typeof video === "object") {
          vid2 = String(video.vid || "");
          title = video.video_name || `\u7B2C${i + 1}\u96C6`;
          url = video.url_html5 || "";
        } else {
          vid2 = String(video.vid || video.vid || "");
          title = video.name || video.video_name || `\u7B2C${i + 1}\u96C6`;
          url = video.pageUrl || video.url_html5 || "";
        }
        if (url && url.startsWith("http://")) {
          url = url.replace("http://", "https://");
        }
        const episode = {
          vid: vid2,
          title,
          url,
          episodeId: `${vid2}:${id}`
          // vid:aid
        };
        episodes.push(episode);
      }
      log("info", `[Sohu] \u6210\u529F\u83B7\u53D6 ${episodes.length} \u4E2A\u5206\u96C6 (media_id=${id})`);
      return episodes;
    } catch (error) {
      log("error", "[Sohu] \u83B7\u53D6\u5206\u96C6\u51FA\u9519:", error.message);
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Sohu] sourceAnimes is not a valid array");
      return [];
    }
    const processSohuAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.mediaId);
          let links = [];
          for (let i = 0; i < eps.length; i++) {
            const ep = eps[i];
            const epTitle = ep.title || `\u7B2C${i + 1}\u96C6`;
            const fullUrl = `https://tv.sohu.com/item/${anime.mediaId}.html`;
            links.push({
              "name": (i + 1).toString(),
              "url": `${ep.url}`,
              "title": `\u3010sohu\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            let transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year || (/* @__PURE__ */ new Date()).getFullYear()})\u3010${anime.type}\u3011from sohu`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year || (/* @__PURE__ */ new Date()).getFullYear()),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "sohu"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Sohu] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processSohuAnimes;
  }
  // 提取vid和aid的公共函数
  async extractVidAndAid(id) {
    let vid2;
    let aid = "0";
    const resp = await Widget.http.get(id, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const match = resp.data.match(/vid="(\d+)"/);
    if (match) {
      vid2 = match[1];
    }
    aid = resp.data.match(/id="aid"[^>]*value=['"](\d+)['"]/)?.[1];
    if (!aid) {
      aid = resp.data.match(/playlistId="(\d+)"/)?.[1];
    }
    return { vid: vid2, aid };
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u641C\u72D0\u89C6\u9891\u5F39\u5E55...", id);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const MAX_CONCURRENT = 10;
    const allComments = [];
    for (let i = 0; i < segmentList.length; i += MAX_CONCURRENT) {
      const batch = segmentList.slice(i, i + MAX_CONCURRENT);
      const batchPromises = batch.map((segment) => this.getDanmuSegment(segment));
      const batchResults = await Promise.allSettled(batchPromises);
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        const segment = batch[j];
        const start2 = segment.segment_start;
        const end2 = segment.segment_end;
        if (result.status === "fulfilled") {
          const comments = result.value;
          if (comments && comments.length > 0) {
            allComments.push(...comments);
          } else if (start2 > 600) {
            break;
          }
        } else {
          log("error", `\u83B7\u53D6\u5F39\u5E55\u6BB5\u5931\u8D25 (${start2}-${end2}s):`, result.reason.message);
        }
      }
      if (i + MAX_CONCURRENT < segmentList.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    if (allComments.length === 0) {
      log("info", `\u641C\u72D0\u89C6\u9891: \u8BE5\u89C6\u9891\u6682\u65E0\u5F39\u5E55\u6570\u636E (vid=${id})`);
      return [];
    }
    printFirst200Chars(allComments);
    return allComments;
  }
  async getDanmuSegment(segment) {
    try {
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "Referer": "https://tv.sohu.com/"
      };
      const response = await Widget.http.get(segment.url, { headers, timeout: 1e4 });
      if (!response || !response.data) {
        log("error", `\u641C\u72D0\u89C6\u9891: \u5F39\u5E55\u6BB5\u54CD\u5E94\u4E3A\u7A7A (${segment.segment_start}-${segment.segment_end}s)`);
        return [];
      }
      try {
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        const comments = data.info?.comments || [];
        if (comments && comments.length > 0) {
          log("info", `\u641C\u72D0\u89C6\u9891: \u83B7\u53D6\u5230 ${comments.length} \u6761\u5F39\u5E55 (${segment.segment_start}-${segment.segment_end}s)`);
        }
        return comments || [];
      } catch (error) {
        log("error", `\u641C\u72D0\u89C6\u9891: \u89E3\u6790\u5F39\u5E55\u54CD\u5E94\u5931\u8D25: ${error.message}`);
        return [];
      }
    } catch (error) {
      log("error", `\u641C\u72D0\u89C6\u9891: \u83B7\u53D6\u5F39\u5E55\u6BB5\u5931\u8D25 (vid=${vid}, ${start}-${end}s): ${error.message}`);
      return [];
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u641C\u72D0\u89C6\u9891\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    const { vid: vid2, aid } = await this.extractVidAndAid(id);
    const maxTime = 10800;
    const segmentDuration = 300;
    const segments = [];
    for (let start2 = 0; start2 < maxTime; start2 += segmentDuration) {
      const end2 = start2 + segmentDuration;
      segments.push({
        "type": "sohu",
        "segment_start": start2,
        "segment_end": end2,
        "url": `https://api.danmu.tv.sohu.com/dmh5/dmListAll?act=dmlist_v2&vid=${vid2}&aid=${aid}&pct=2&time_begin=${start2}&time_end=${end2}&dct=1&request_from=h5_js`
      });
    }
    return new SegmentListResponse({
      "type": "sohu",
      "segmentList": segments
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    try {
      const response = await Widget.http.get(segment.url, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        const parsedData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        contents.push(...parsedData.info?.comments || []);
      }
      return contents;
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5206\u7247\u5F39\u5E55\u5931\u8D25:", error);
      return [];
    }
  }
  formatComments(comments) {
    return comments.map((comment) => {
      try {
        let color = 16777215;
        if (comment.t && comment.t.c) {
          const colorValue = comment.t.c;
          if (typeof colorValue === "string" && colorValue.startsWith("#")) {
            color = parseInt(colorValue.substring(1), 16);
          } else {
            color = parseInt(String(colorValue), 16);
          }
        }
        const vtime = comment.v || 0;
        const timestamp = Math.floor(parseFloat(comment.created || Date.now() / 1e3));
        const uid = comment.uid || "";
        const danmuId = comment.i || "";
        let position = 1;
        if (comment.t && comment.t.p) {
          position = this.positionMap[comment.t.p] || 1;
        }
        const pString = `${vtime},1,25,${color},${timestamp},0,${uid},${danmuId}`;
        return {
          cid: String(danmuId),
          p: pString,
          m: comment.c || "",
          t: parseFloat(vtime)
        };
      } catch (error) {
        log("error", `\u683C\u5F0F\u5316\u5F39\u5E55\u5931\u8D25: ${error.message}, \u5F39\u5E55\u6570\u636E:`, comment);
        return null;
      }
    }).filter((comment) => comment !== null);
  }
};

// danmu_api/sources/leshi.js
var typeMap = {
  "tv": "\u7535\u89C6\u5267",
  "movie": "\u7535\u5F71",
  "cartoon": "\u52A8\u6F2B",
  "comic": "\u52A8\u6F2B"
};
var LeshiSource = class extends BaseSource {
  constructor() {
    super();
    this.positionMap = {
      4: 1,
      // 滚动弹幕
      3: 4,
      // 底部弹幕
      1: 5,
      // 顶部弹幕
      2: 1
      // 其他 -> 滚动
    };
  }
  /**
   * 过滤乐视网搜索项
   * @param {Object} item - 搜索项
   * @param {string} keyword - 搜索关键词
   * @returns {Object|null} 过滤后的结果
   */
  filterLeshiSearchItem(item, keyword) {
    if (!item.pid || !item.title) {
      return null;
    }
    let title = item.title;
    const resultType = typeMap[item.type] || "\u7535\u89C6\u5267";
    return {
      mediaId: String(item.pid),
      title,
      type: resultType,
      year: item.year || null,
      imageUrl: item.imageUrl || null,
      episodeCount: item.episodeCount || 0
    };
  }
  async search(keyword) {
    try {
      log("info", `[Leshi] \u5F00\u59CB\u641C\u7D22: ${keyword}`);
      const params = {
        "wd": keyword,
        "from": "pc",
        "ref": "click",
        "click_area": "search_button",
        "query": keyword,
        "is_default_query": "0",
        "module": "search_rst_page"
      };
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://so.le.com/",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin"
      };
      const searchUrl = `https://so.le.com/s?${buildQueryString(params)}`;
      const response = await Widget.http.get(searchUrl, { headers, timeout: 15e3 });
      if (!response || !response.data) {
        log("info", "[Leshi] \u641C\u7D22\u54CD\u5E94\u4E3A\u7A7A");
        return [];
      }
      const htmlContent = response.data;
      log("debug", `[Leshi] \u641C\u7D22\u8BF7\u6C42\u6210\u529F\uFF0C\u54CD\u5E94\u957F\u5EA6: ${htmlContent.length} \u5B57\u7B26`);
      const results = [];
      const pattern = /<div class="So-detail[^"]*"[^>]*data-info="({.*?})"[^>]*>/g;
      let match;
      const matches = [];
      while ((match = pattern.exec(htmlContent)) !== null) {
        matches.push(match);
      }
      log("debug", `[Leshi] \u4ECEHTML\u4E2D\u627E\u5230 ${matches.length} \u4E2A data-info \u5757`);
      for (const match2 of matches) {
        try {
          let dataInfoStr = match2[1];
          log("debug", `[Leshi] \u63D0\u53D6\u5230 data-info \u539F\u59CB\u5B57\u7B26\u4E32: ${dataInfoStr.substring(0, 200)}...`);
          dataInfoStr = dataInfoStr.replace(/'/g, '"');
          dataInfoStr = dataInfoStr.replace(/([{,])(\w+):/g, '$1"$2":');
          const dataInfo = JSON.parse(dataInfoStr);
          log("debug", `[Leshi] \u6210\u529F\u89E3\u6790 data-info\uFF0Cpid=${dataInfo.pid}, type=${dataInfo.type}`);
          let pid = dataInfo.pid || "";
          const mediaTypeStr = dataInfo.type || "";
          const total = dataInfo.total || "0";
          if (!pid) {
            continue;
          }
          const start_pos = match2.index;
          const endPatterns = ["</div>\n	</div>", "</div>\n</div>", "</div></div>"];
          let end_pos = -1;
          for (const endPattern of endPatterns) {
            const pos = htmlContent.indexOf(endPattern, start_pos);
            if (pos !== -1) {
              end_pos = pos;
              break;
            }
          }
          if (end_pos === -1) {
            const nextMatch = htmlContent.indexOf('<div class="So-detail', start_pos + 100);
            if (nextMatch !== -1) {
              end_pos = nextMatch;
            } else {
              continue;
            }
          }
          const htmlBlock = htmlContent.substring(start_pos, end_pos);
          let title = "";
          const h1TitleMatch = /<h1>[\s\S]*?<a[^>]*title="([^"]*)"[^>]*>/.exec(htmlBlock);
          if (h1TitleMatch && h1TitleMatch[1]) {
            title = h1TitleMatch[1].trim();
          }
          if (!title && dataInfo.keyWord) {
            const keywordMatch = /(.*?)(?:\d{4})?(?:电影|电视剧|综艺)?$/.exec(dataInfo.keyWord);
            if (keywordMatch && keywordMatch[1]) {
              title = keywordMatch[1].replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").trim();
            }
          }
          if (!title) {
            const linkTitleMatch = /<a[^>]*title="([^"]*?)[^0-9\u4e00-\u9fa5][^"]*"/.exec(htmlBlock);
            if (linkTitleMatch && linkTitleMatch[1]) {
              title = linkTitleMatch[1].trim();
            }
          }
          if (!title) {
            log("info", `[Leshi] \u672A\u627E\u5230\u6807\u9898\uFF0C\u5C1D\u8BD5\u4ECE\u5176\u4ED6\u6765\u6E90\u83B7\u53D6`);
          }
          const imgMatch = /<img[^>]*(?:src|data-src|alt)="([^"]+)"/.exec(htmlBlock);
          let imageUrl = imgMatch ? imgMatch[1] : "";
          let year = null;
          let yearMatch = /<b>年份：<\/b>.*?>(\d{4})<\/a>/.exec(htmlBlock);
          if (!yearMatch) {
            yearMatch = /<b>上映时间：<\/b>.*?>(\d{4})<\/a>/.exec(htmlBlock);
          }
          if (!yearMatch) {
            yearMatch = /_y(\d{4})_/.exec(htmlBlock);
          }
          if (!yearMatch) {
            yearMatch = /(\d{4})/.exec(dataInfo.keyWord || "");
          }
          if (yearMatch) {
            year = parseInt(yearMatch[1]);
          }
          const resultType = typeMap[mediaTypeStr] || "\u7535\u89C6\u5267";
          const episodeCount = total && /^\d+$/.test(total) ? parseInt(total) : 0;
          const result = {
            mediaId: pid,
            title,
            type: resultType,
            year,
            imageUrl: imageUrl && imageUrl.startsWith("http") ? imageUrl : imageUrl ? `https:${imageUrl}` : null,
            episodeCount
          };
          results.push(result);
          log("debug", `[Leshi] \u89E3\u6790\u6210\u529F - ${title} (pid=${pid}, type=${resultType}, episodes=${episodeCount})`);
        } catch (e) {
          log("warning", `[Leshi] \u89E3\u6790\u641C\u7D22\u7ED3\u679C\u9879\u5931\u8D25: ${e}`);
          continue;
        }
      }
      if (results.length > 0) {
        log("info", `[Leshi] \u7F51\u7EDC\u641C\u7D22 '${keyword}' \u5B8C\u6210\uFF0C\u627E\u5230 ${results.length} \u4E2A\u6709\u6548\u7ED3\u679C\u3002`);
        log("info", `[Leshi] \u641C\u7D22\u7ED3\u679C\u5217\u8868:`);
        for (const r of results) {
          log("info", `  - ${r.title} (ID: ${r.mediaId}, \u7C7B\u578B: ${r.type}, \u5E74\u4EFD: ${r.year})`);
        }
      } else {
        log("info", `[Leshi] \u7F51\u7EDC\u641C\u7D22 '${keyword}' \u5B8C\u6210\uFF0C\u627E\u5230 0 \u4E2A\u7ED3\u679C\u3002`);
      }
      return results;
    } catch (error) {
      log("error", "[Leshi] \u641C\u7D22\u51FA\u9519:", error.message);
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      log("info", `[Leshi] \u83B7\u53D6\u5206\u96C6\u5217\u8868: media_id=${id}`);
      const urlsToTry = [
        `https://www.le.com/tv/${id}.html`,
        `https://www.le.com/comic/${id}.html`,
        `https://www.le.com/playlet/${id}.html`,
        `https://www.le.com/movie/${id}.html`
      ];
      let htmlContent = null;
      for (const url of urlsToTry) {
        try {
          const response = await Widget.http.get(url, { timeout: 1e4 });
          if (response && response.data && response.status === 200) {
            htmlContent = response.data;
            log("debug", `\u6210\u529F\u83B7\u53D6\u9875\u9762: ${url}`);
            break;
          }
        } catch (e) {
          log("debug", `\u5C1D\u8BD5URL\u5931\u8D25 ${url}: ${e}`);
          continue;
        }
      }
      if (!htmlContent) {
        log("error", `\u65E0\u6CD5\u83B7\u53D6\u4F5C\u54C1\u9875\u9762: media_id=${id}`);
        return [];
      }
      const twxjContainerMatch = /<div class="show_cnt twxj-[^"]*">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/.exec(htmlContent);
      if (twxjContainerMatch) {
        log("debug", `\u627E\u5230\u56FE\u6587\u9009\u96C6\u5BB9\u5668`);
        return this.parseEpisodesFromHtml(twxjContainerMatch[0], id);
      }
      const sjxjContainerMatch = /<div class="show_cnt sjxj-[^"]*">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/.exec(htmlContent);
      if (sjxjContainerMatch) {
        log("debug", `\u627E\u5230\u6570\u5B57\u9009\u96C6\u5BB9\u5668`);
        return this.parseEpisodesFromHtml(sjxjContainerMatch[0], id);
      }
      log("debug", `\u672A\u627E\u5230\u7279\u5B9A\u9009\u96C6\u5BB9\u5668\uFF0C\u5C1D\u8BD5\u67E5\u627E\u7B2C\u4E00\u96C6\u89C6\u9891\u5217\u8868...`);
      const firstVideoListMatch = /<div class="show_play first_videolist[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/.exec(htmlContent);
      if (firstVideoListMatch) {
        const containerHtml = firstVideoListMatch[0];
        return this.parseEpisodesFromHtml(containerHtml, id);
      }
      log("error", `\u65E0\u6CD5\u627E\u5230\u5267\u96C6\u5217\u8868\u5BB9\u5668: media_id=${id}`);
      const regex = /https:\/\/www\.le\.com\/ptv\/vplay\/(\d+)\.html/g;
      const matches = htmlContent.matchAll(regex);
      const episodes = [];
      for (const match of matches) {
        const videoId = match[1];
        const url = match[0];
        const episode = {
          vid: videoId,
          title: `\u7B2C${episodes.length + 1}\u96C6`,
          url,
          episodeId: `${videoId}:${id}`
          // vid:aid
        };
        episodes.push(episode);
      }
      if (episodes.length > 0) {
        log("info", `[Leshi] \u4ECEHTML\u5185\u5BB9\u4E2D\u5339\u914D\u5230 ${episodes.length} \u4E2A\u5267\u96C6\u94FE\u63A5`);
        return episodes;
      }
      return [];
    } catch (error) {
      log("error", "[Leshi] \u83B7\u53D6\u5206\u96C6\u51FA\u9519:", error.message);
      return [];
    }
  }
  parseEpisodesFromHtml(htmlContent, mediaId) {
    try {
      const episodeContainerRegex = /<div class="col_4"[^>]*>[\s\S]*?<\/div>/g;
      const containerMatches = htmlContent.match(episodeContainerRegex);
      if (!containerMatches || containerMatches.length === 0) {
        log("debug", `\u5728HTML\u4E2D\u672A\u627E\u5230\u5267\u96C6\u5BB9\u5668div.col_4\uFF0C\u5C1D\u8BD5\u67E5\u627Edl.dl_temp\u5143\u7D20`);
        const episodeRegex = /<dl class="dl_temp">[\s\S]*?<\/dl>/g;
        const matches = htmlContent.match(episodeRegex);
        if (!matches || matches.length === 0) {
          log("debug", `\u5728HTML\u4E2D\u672A\u627E\u5230\u5267\u96C6\u5143\u7D20\uFF0C\u5C1D\u8BD5\u66F4\u5E7F\u6CDB\u7684\u9009\u62E9\u5668`);
          const broaderRegex = /<dl[^>]*class="[^"]*dl_temp[^"]*"[^>]*>[\s\S]*?<\/dl>/g;
          const broaderMatches = htmlContent.match(broaderRegex);
          if (!broaderMatches || broaderMatches.length === 0) {
            log("error", `\u65E0\u6CD5\u4ECEHTML\u4E2D\u89E3\u6790\u5230\u4EFB\u4F55\u5267\u96C6: media_id=${mediaId}`);
            return [];
          }
          return this.extractEpisodes(broaderMatches, mediaId);
        }
        return this.extractEpisodes(matches, mediaId);
      }
      const dlElements = [];
      for (const container of containerMatches) {
        const dlMatch = /<dl class="dl_temp">[\s\S]*?<\/dl>/.exec(container);
        if (dlMatch) {
          dlElements.push(dlMatch[0]);
        }
      }
      if (dlElements.length === 0) {
        log("error", `\u4ECE\u5BB9\u5668\u4E2D\u672A\u80FD\u63D0\u53D6\u5230\u4EFB\u4F55dl.dl_temp\u5143\u7D20: media_id=${mediaId}`);
        return [];
      }
      return this.extractEpisodes(dlElements, mediaId);
    } catch (error) {
      log("error", `[Leshi] \u89E3\u6790\u5267\u96C6HTML\u5931\u8D25: ${error.message}`);
      return [];
    }
  }
  extractEpisodes(episodeElements, mediaId) {
    const episodes = [];
    for (const element of episodeElements) {
      try {
        const linkMatch = /<a[^>]+href="(\/\/www\.le\.com\/ptv\/vplay\/(\d+)\.html)"[^>]*>/.exec(element);
        if (!linkMatch) {
          log("debug", `\u8DF3\u8FC7\u65E0\u6CD5\u89E3\u6790\u94FE\u63A5\u7684\u5267\u96C6\u5143\u7D20`);
          continue;
        }
        const fullUrl = linkMatch[1];
        const videoId = linkMatch[2];
        const absoluteUrl = `https:${fullUrl}`;
        let title = "";
        const titleMatch = /<dt class="d_tit">[\s\n\r]*<a[^>]*title="([^"]*)"[^>]*>([^<]*)<\/a>/.exec(element);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        } else if (titleMatch && titleMatch[2]) {
          title = titleMatch[2].trim();
        } else {
          const altTitleMatch = /<a[^>]*title="([^"]*)"[^>]*>[\s\S]*?<dt class="d_tit">/.exec(element) || /<dt class="d_tit">[\s\S]*?<a[^>]*title="([^"]*)"/.exec(element);
          if (altTitleMatch && altTitleMatch[1]) {
            title = altTitleMatch[1].trim();
          } else {
            const ddMatch = /<dd class="d_cnt"[^>]*>([^<]*)/.exec(element);
            if (ddMatch && ddMatch[1]) {
              title = ddMatch[1].trim();
            } else {
              const linkTextMatch = /<a[^>]*title="[^"]*"[^>]*>([^<]*)/.exec(element);
              if (linkTextMatch && linkTextMatch[1]) {
                title = linkTextMatch[1].trim();
              }
            }
          }
        }
        if (!title) {
          const episodeNumMatch = /第(\d+)集|(\d+)(?:\s*预告)?/.exec(element);
          if (episodeNumMatch) {
            const num = episodeNumMatch[1] || episodeNumMatch[2];
            title = `\u7B2C${num}\u96C6`;
          } else {
            title = `\u7B2C${episodes.length + 1}\u96C6`;
          }
        }
        const isPreview = /预告|Preview|preview/.test(title);
        if (isPreview) {
          log("debug", `\u8DF3\u8FC7\u9884\u544A\u7247: ${title}`);
          continue;
        }
        const episode = {
          vid: videoId,
          title,
          url: absoluteUrl,
          episodeId: `${videoId}:${mediaId}`
          // vid:aid
        };
        episodes.push(episode);
      } catch (e) {
        log("warning", `[Leshi] \u89E3\u6790\u5355\u4E2A\u5267\u96C6\u5931\u8D25: ${e.message}`);
        continue;
      }
    }
    log("info", `[Leshi] \u6210\u529F\u89E3\u6790\u5267\u96C6\u5217\u8868: media_id=${mediaId}, \u5171 ${episodes.length} \u96C6`);
    return episodes;
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Leshi] sourceAnimes is not a valid array");
      return [];
    }
    const processLeshiAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.title, queryTitle)).map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.mediaId);
          let links = [];
          for (let i = 0; i < eps.length; i++) {
            const ep = eps[i];
            const epTitle = ep.title || `\u7B2C${i + 1}\u96C6`;
            links.push({
              "name": (i + 1).toString(),
              "url": `${ep.url}`,
              "title": `\u3010leshi\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            const numericAnimeId = convertToAsciiSum(anime.mediaId);
            let transformedAnime = {
              animeId: numericAnimeId,
              bangumiId: anime.mediaId,
              animeTitle: `${anime.title}(${anime.year || (/* @__PURE__ */ new Date()).getFullYear()})\u3010${anime.type}\u3011from leshi`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.imageUrl,
              startDate: generateValidStartDate(anime.year || (/* @__PURE__ */ new Date()).getFullYear()),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "leshi"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Leshi] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processLeshiAnimes;
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u4E50\u89C6\u7F51\u5F39\u5E55...", id);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const MAX_CONCURRENT = 10;
    const allComments = [];
    for (let i = 0; i < segmentList.length; i += MAX_CONCURRENT) {
      const batch = segmentList.slice(i, i + MAX_CONCURRENT);
      const batchPromises = batch.map((segment) => this.getDanmuSegment(segment));
      const batchResults = await Promise.allSettled(batchPromises);
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        const segment = batch[j];
        const start2 = segment.segment_start;
        const end2 = segment.segment_end;
        if (result.status === "fulfilled") {
          const comments = result.value;
          if (comments && comments.length > 0) {
            allComments.push(...comments);
          } else if (start2 > 600) {
            break;
          }
        } else {
          log("error", `\u83B7\u53D6\u5F39\u5E55\u6BB5\u5931\u8D25 (${start2}-${end2}s):`, result.reason.message);
        }
      }
      if (i + MAX_CONCURRENT < segmentList.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    if (allComments.length === 0) {
      log("info", `\u4E50\u89C6\u7F51: \u8BE5\u89C6\u9891\u6682\u65E0\u5F39\u5E55\u6570\u636E (vid=${id})`);
      return [];
    }
    printFirst200Chars(allComments);
    return allComments;
  }
  async getDanmuSegment(segment) {
    try {
      const response = await Widget.http.get(segment.url, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        const data = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
        const jsonMatch = /vjs_\d+\((.*)\)/.exec(data);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[1]);
          if (jsonData.code === 200 && jsonData.data) {
            contents.push(...jsonData.data.list || []);
          }
        }
      }
      return contents;
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5206\u7247\u5F39\u5E55\u5931\u8D25:", error);
      return [];
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u4E50\u89C6\u7F51\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    let videoId = id;
    const match = id.match(/\/vplay\/(\d+)\.html/);
    if (match) {
      videoId = match[1];
    }
    const duration = await this.getVideoDuration(videoId);
    const segments = [];
    for (let i = 0; i < Math.ceil(duration / 300); i++) {
      const startTime = i * 300;
      const endTime = Math.min((i + 1) * 300, duration);
      segments.push({
        "type": "leshi",
        "segment_start": startTime,
        "segment_end": endTime,
        "url": `https://hd-my.le.com/danmu/list?vid=${videoId}&start=${startTime}&end=${endTime}&callback=vjs_${Date.now()}`
      });
    }
    log("info", `\u4E50\u89C6\u7F51: \u89C6\u9891\u65F6\u957F ${duration}\u79D2\uFF0C\u5206\u4E3A ${segments.length} \u4E2A\u65F6\u95F4\u6BB5`);
    return new SegmentListResponse({
      "type": "leshi",
      "segmentList": segments
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getDanmuSegment(segment);
  }
  async getVideoDuration(videoId) {
    try {
      const response = await Widget.http.get(`https://www.le.com/ptv/vplay/${videoId}.html`, { timeout: 1e4 });
      if (!response || !response.data) {
        log("warning", `\u4E50\u89C6\u7F51: \u83B7\u53D6\u89C6\u9891\u65F6\u957F\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u503C2400\u79D2`);
        return 2400;
      }
      const durationMatch = /duration['"]?\s*:\s*['"]?(\d{2}):(\d{2}):(\d{2})['"]?|duration['"]?\s*:\s*['"]?(\d{2}):(\d{2})['"]?|duration['"]?\s*:\s*(\d+)['"]?/.exec(response.data);
      if (durationMatch) {
        if (durationMatch[1] && durationMatch[2] && durationMatch[3]) {
          const hours = parseInt(durationMatch[1]);
          const minutes = parseInt(durationMatch[2]);
          const seconds = parseInt(durationMatch[3]);
          return hours * 3600 + minutes * 60 + seconds;
        } else if (durationMatch[4] && durationMatch[5]) {
          const minutes = parseInt(durationMatch[4]);
          const seconds = parseInt(durationMatch[5]);
          return minutes * 60 + seconds;
        } else if (durationMatch[6]) {
          const seconds = parseInt(durationMatch[6]);
          return seconds;
        }
      }
      return 2400;
    } catch (e) {
      log("warning", `\u83B7\u53D6\u89C6\u9891\u65F6\u957F\u5931\u8D25: ${e}\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u503C2400\u79D2`);
      return 2400;
    }
  }
  formatComments(comments) {
    return comments.map((comment) => {
      try {
        const position = this.positionMap[parseInt(comment.position)] || 1;
        const timeVal = parseFloat(comment.start || 0);
        const colorHex = comment.color || "FFFFFF";
        const color = parseInt(colorHex, 16);
        const danmuId = comment.id || comment._id || "";
        const content = comment.txt || "";
        const pString = `${timeVal.toFixed(2)},${position},25,${color},[${this.constructor.name.toLowerCase()}]`;
        return {
          cid: String(danmuId),
          p: pString,
          m: content,
          t: Math.round(timeVal * 100) / 100
        };
      } catch (error) {
        log("error", `\u683C\u5F0F\u5316\u5F39\u5E55\u5931\u8D25: ${error.message}, \u5F39\u5E55\u6570\u636E:`, comment);
        return null;
      }
    }).filter((comment) => comment !== null);
  }
};

// danmu_api/sources/xigua.js
var XiguaSource = class _XiguaSource extends BaseSource {
  static get DEFAULT_PARAMS() {
    return {
      aid: "6383",
      browser_language: "zh-CN",
      browser_name: "Chrome",
      browser_online: "true",
      browser_platform: "Win32",
      browser_version: "143.0.0.0",
      channel: "channel_pc_web",
      cookie_enabled: "true",
      count: "5",
      cpu_core_num: "8",
      device_memory: "8",
      device_platform: "webapp",
      disable_rs: "0",
      downlink: "10",
      effective_type: "4g",
      enable_history: "1",
      engine_name: "Blink",
      engine_version: "143.0.0.0",
      from_group_id: "",
      is_filter_search: "0",
      keyword: "",
      list_type: "",
      need_filter_settings: "1",
      offset: "0",
      os_name: "Windows",
      os_version: "10",
      pc_client_type: "1",
      pc_libra_divert: "Windows",
      pc_search_top_1_params: '{"enable_ai_search_top_1":1}',
      platform: "PC",
      query_correct_type: "1",
      round_trip_time: "50",
      screen_height: "1000",
      screen_width: "1500",
      search_channel: "aweme_general",
      search_source: "search_history",
      support_dash: "1",
      support_h265: "1",
      uifid: "5bdad390e71fd6e6e69e3cafe6018169c2447c8bc0b8484cc0f203a274f99fdb768a8c316d9404279513fcca88f12e4acf3daf31b4c0934dcd4d46cd5920c9d89bf45649141617920d4cdb2f3fdda79ac60881104f74e9b14137002479d35d2fd5e856ea254237dc0354a8b6ace97e28f2691a588ec6473fa26738653822bf3d5351084975e04ed4a489cf56fe39c626b0a45ade1ab50aeb053a0dd5bc5c8de1",
      update_version_code: "0",
      version_code: "190600",
      version_name: "19.6.0",
      webid: "7596462376888731182",
      msToken: "0l5NrxqxQknMMk-jYG9YLxmAGb2EuNqXAR6hI6PBKHT900nrwhVgUr2Qsx34KjMmSRbr0SovUrGe_ZsMGOd9h9COVa_sX-L9prlQ2gbXTiN5IM8OZrLz244mGWcsGN1MrAwlEf_yZGJdAhqM3dHgY-IzlCvb6pt-d0R3F6al1BE72jxhrgnJoQ==",
      a_bogus: "xjURkz77ddR5FdFtmKO6HIQlwe2MNB8y0qT2W9VP7OYycHea7YPQ/NtDnoLtJVVU0mpzhedHBdBAGnxc0tXTZq9pzmkfuEwbFUQ99uvLMqNgTFkmLr8LewszKw0F0cTwl5cREARRIs0r2d5AVrIYlpIae5FqQYYdbrq6dZzbb9AxdSjH9xdXtBLAYqg="
    };
  }
  static get DEFAULT_HEADERS() {
    return {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "priority": "u=1, i",
      "referer": "https://www.douyin.com/",
      "sec-ch-ua": `"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": `"Windows"`,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0 Safari/537.36",
      "cookie": "hevc_supported=true; theme=%22light%22; enter_pc_once=1; UIFID_TEMP=5bdad390e71fd6e6e69e3cafe6018169c2447c8bc0b8484cc0f203a274f99fdb326bf4acda898300593c7e1f623bbba6500fe7dcbd7580d07a0e68fae95833a2f13084b12c6516e48ba9dd9ac43afcbe; douyin.com; device_web_cpu_core=8; device_web_memory_size=8; architecture=amd64; dy_swidth=1500; dy_sheight=1000; s_v_web_id=verify_mkivx1g8_9KjTnLMj_TDJH_4fz2_8ToU_y8BzctbKlL1r; odin_tt=41ae383e3bd114cabe012357d66de720f737aa8e393883e9d4b2c99ced2439c5a7b54adc3acaa44b77a6433841f9ad26c4b81619621774ab36f28a176791898336ffb503984b2cf1c9c7f6b4459ea044; strategyABtestKey=%221768689261.175%22; passport_csrf_token=ed476f2b5f5e931e1e17614c5cde4d9f; passport_csrf_token_default=ed476f2b5f5e931e1e17614c5cde4d9f; fpk1=U2FsdGVkX1/JAy5WNCrhFBjMkHT7B/7RlpR7d+vVcwXZczWmM9lcMBs5CwLEsScBe7Dsatiu6TIin3dMn36ujA==; fpk2=89db729cfcdc129111f017b0e7ac324a; __security_mc_1_s_sdk_crypt_sdk=edb86c34-4aca-ac4b; bd_ticket_guard_client_web_domain=2; is_dash_user=1; __ac_nonce=0696c0e7100ef6667155b; __ac_signature=_02B4Z6wo00f01VLtuUQAAIDC30UAzY-BQSlSzb3AAD3b83; UIFID=5bdad390e71fd6e6e69e3cafe6018169c2447c8bc0b8484cc0f203a274f99fdb768a8c316d9404279513fcca88f12e4acf3daf31b4c0934dcd4d46cd5920c9d89bf45649141617920d4cdb2f3fdda79ac60881104f74e9b14137002479d35d2fd5e856ea254237dc0354a8b6ace97e28f2691a588ec6473fa26738653822bf3d5351084975e04ed4a489cf56fe39c626b0a45ade1ab50aeb053a0dd5bc5c8de1; download_guide=%221%2F20260118%2F0%22; IsDouyinActive=true; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1500%2C%5C%22screen_height%5C%22%3A1000%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A8%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCT29LQnc3cGI1UDA3SXVjSGF3Q1VzdWJIbTNKQW9iRzBoc3JkUmEyVTZ3d3NSbXhaTm1hL0c0N0JpSTQyc0JDaW0xQXBValJWZVBCV0RralIzRm5rd3M9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; bd_ticket_guard_client_data_v2=eyJyZWVfcHVibGljX2tleSI6IkJPb0tCdzdwYjVQMDdJdWNIYXdDVXN1YkhtM0pBb2JHMGhzcmRSYTJVNnd3c1JteFpObWEvRzQ3QmlJNDJzQkNpbTFBcFVqUlZlUEJXRGtqUjNGbmt3cz0iLCJyZXFfY29udGVudCI6InNlY190cyIsInJlcV9zaWduIjoiaUZHdTNQNWhVM1p4bTE3cTlkUmJVbllZVUpjSGJGb2E2eHR6RnZNOVBYOD0iLCJzZWNfdHMiOiIjSHhKR3JqV1k5Q0tDVUdnL0M4b1d1ZGlYaVRxdHQxRDAxRmw4cDQ2T1lMVXkxWHp6a0tDeVBkRGVGV3NxIn0%3D; ttwid=1%7CFWlhAsF-KoGxsgQ9EqefnyQvtJIYKld-ph__Q9cOo1s%7C1768689835%7C35d17bdcfb25121d74d9ab3c196dbbf8c4b018635513ea702dae85eee8ab6ebc; biz_trace_id=5228a940; sdk_source_info=7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e5927666d776a686028607d71606b766c6a6b3f2a2a6a6f646363756d67636861646c66616e646d6b686c6d6c7566696860756a6e2a767164716c662a6f762a726a776e6077762b686c6b2b6f765927295927666d776a686028607d71606b766c6a6b3f2a2a6a6b607568647563676f6a6d6b60626168636d6b617560636f6e7575676f6e682a76682b6706b6169602b6f76592758272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e582729277672715a646971273f2763646976602729277f6b5a666475273f2763646976602729276d6a6e5a6b6a716c273f2763646976602729276c6b6f5a7f6367273f27636469766027292771273f2733323531313d3c3d333d33234272927676c715a75776a716a666a69273f2763646976602778; bit_env=fhHsgC-D59fxwo1htOX9PqtjoLeQTGMPs2xSgYg3wgjDYNIPeyod0n9nJjPeUCICSQo38bu_1StrlP84kRKr27KShE047uVirtsW_9dyC7WalmzVk515ngDsuKgRvMry5oMQBd__NcymHfpIupKQeULTWwmserVKe-FaoX_nKu95PXEaxodj84i13Z7zaMPwjw5P558BGuTNiwYXBGeB7vbu4joQzz6o8LV-wimw_E-GgYi1W-9b01g9p9UV4wLh3ifbqyXmat3Uiub2d9T9PWFnQe2HEWdNjD3dGqXbi4D59lI4UopPnF99x4uJ_BNQF_-jY_eT6aML11ViPnTrZgGrhfq62UxsMWdj3MtrPGyK1C0MvWd4O-SqKUOMpImcAmqI2UGj1RCiX6q1_YCxTUP0SnqZcAYccCHWKEgdxVvmKIhjXBXtGFaCUd9nCPhXlaASWXPtw1pcim1RVIZLGngLSGnOYF4lhcQ0qFpRXAeWgwHSBEHGXPxglAJb6IxW; gulu_source_res=eyJwX2luIjoiMzRlYjBiNWI5YTNlY2RkMjY3ZGQzOTBkNjhjMjk1MGIzMjY2YmUyMDc3MWViYmZlMTIzNDM4ZDMxZmNkYTVjOCJ9; passport_auth_mix_state=sf4nq687herp6h2dofu6564iq8n4yc6kkgsnkhk53xivv6ux; home_can_add_dy_2_desktop=%221%22"
    };
  }
  async search(keyword) {
    try {
      const searchUrl = `https://m.ixigua.com/s/${keyword}`;
      const searchResp = await Widget.http.get(searchUrl, {
        headers: {
          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1"
        }
      });
      const html = searchResp.data;
      const animes = [];
      const sectionRegex = /<section class="search-section">[\s\S]*?<h2 class="search-section-title">[\s\S]*?相关视频[\s\S]*?<\/h2>[\s\S]*?<div class="s-long-video-card">([\s\S]*?)<\/div><\/div><\/div>/;
      const sectionMatch = html.match(sectionRegex);
      if (sectionMatch) {
        const sectionContent = sectionMatch[1];
        const videoRegex = /<div class="s-long-video">[\s\S]*?(?=<div class="s-long-video">|$)/g;
        const videoCards = sectionContent.match(videoRegex) || [];
        videoCards.forEach((card) => {
          const urlMatch = card.match(/href="(\/video\/\d+)"/);
          const url = urlMatch ? `https://m.ixigua.com${urlMatch[1]}` : "";
          const titleMatch = card.match(/<h3 class="s-long-video-info-title">[\s\S]*?title="([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : "";
          const imgMatch = card.match(/<img src="([^"]+)"/);
          let img = imgMatch ? imgMatch[1] : "";
          if (img && img.startsWith("//")) {
            img = "https:" + img;
          }
          img = img.replace(/&amp;/g, "&");
          const typeYearMatch = card.match(/<p>([^<]+\/[^<]+\/\d{4})<\/p>/);
          let type = "";
          let year = "";
          if (typeYearMatch) {
            const parts = typeYearMatch[1].split("/");
            type = parts[0] || "";
            year = parts[2] || "";
          }
          if (url && title) {
            animes.push({
              name: title,
              type,
              year,
              img,
              url
            });
          }
        });
      } else {
        log("info", "xiguaSearchresp: \u76F8\u5173\u89C6\u9891\u7684section \u4E0D\u5B58\u5728");
        return [];
      }
      log("info", `xiguaSearchresp: ${JSON.stringify(animes)}`);
      return animes;
    } catch (error) {
      log("error", "getXiguaAnimes error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getDetail(id) {
    try {
      const albumId = id.split("/").pop();
      const detailQueryString = buildQueryString({ ..._XiguaSource.DEFAULT_PARAMS, episode_id: albumId });
      const detailUrl = `https://www.douyin.com/aweme/v1/web/long/video/detail/?${detailQueryString}`;
      const resp = await Widget.http.get(detailUrl, {
        headers: _XiguaSource.DEFAULT_HEADERS
      });
      if (!resp || !resp.data) {
        log("info", "getXiguaDetail: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      if (!resp.data.aweme_detail) {
        log("info", "getXiguaDetail: aweme_detail \u4E0D\u5B58\u5728");
        return [];
      }
      return resp.data.aweme_detail;
    } catch (error) {
      log("error", "getXiguaDetail error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async getEpisodes(id) {
    try {
      const detailUrl = `https://m.ixigua.com/video/${id}`;
      const detailResp = await Widget.http.get(detailUrl, {
        headers: {
          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1"
        }
      });
      if (!detailResp || !detailResp.data) {
        log("info", "getXiguaEposides: \u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      const episodesMatch = detailResp.data.match(/"episodes_list"\s*:\s*(\[[\s\S]*?\})\s*\]/);
      if (episodesMatch) {
        try {
          const episodesJsonStr = episodesMatch[0].replace(/"episodes_list"\s*:\s*/, "");
          const episodes = JSON.parse(episodesJsonStr);
          const playlistUrls = episodes.map((ep) => ({
            seq_num: ep.seq_num,
            title: ep.title || `\u7B2C${ep.seq_num}\u96C6`,
            url: `https://m.ixigua.com/video/${ep.gid}`,
            gid: ep.gid,
            cover_image_url: ep.cover_image_url
          }));
          return playlistUrls;
        } catch (e) {
          log("error", "\u89E3\u6790episodes_list\u5931\u8D25:", e);
        }
      } else {
        log("info", "getXiguaEposides: episodes_list \u4E0D\u5B58\u5728");
        return [];
      }
    } catch (error) {
      log("error", "getXiguaEposides error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      log("error", "[Xigua] sourceAnimes is not a valid array");
      return [];
    }
    const processXiguaAnimes = await Promise.all(
      sourceAnimes.filter((s) => titleMatches(s.name, queryTitle)).map(async (anime) => {
        try {
          const albumId = anime.url.split("/").pop();
          const eps = await this.getEpisodes(albumId);
          let links = [];
          for (const ep of eps) {
            const epTitle = ep.title;
            links.push({
              "name": epTitle,
              "url": ep.url,
              "title": `\u3010xigua\u3011 ${epTitle}`
            });
          }
          if (links.length > 0) {
            let transformedAnime = {
              animeId: convertToAsciiSum(albumId),
              bangumiId: String(albumId),
              animeTitle: `${anime.name}(${anime.year})\u3010${anime.type}\u3011from xigua`,
              type: anime.type,
              typeDescription: anime.type,
              imageUrl: anime.img,
              startDate: generateValidStartDate(anime.year),
              episodeCount: links.length,
              rating: 0,
              isFavorited: true,
              source: "xigua"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Xigua] Error processing anime: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processXiguaAnimes;
  }
  async getEpisodeDanmu(id) {
    log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u897F\u74DC\u89C6\u9891\u5F39\u5E55...", id);
    const segmentResult = await this.getEpisodeDanmuSegments(id);
    if (!segmentResult || !segmentResult.segmentList || segmentResult.segmentList.length === 0) {
      return [];
    }
    const segmentList = segmentResult.segmentList;
    log("info", `\u5F39\u5E55\u5206\u6BB5\u6570\u91CF: ${segmentList.length}`);
    const MAX_CONCURRENT = 100;
    const allComments = [];
    for (let i = 0; i < segmentList.length; i += MAX_CONCURRENT) {
      const batch = segmentList.slice(i, i + MAX_CONCURRENT);
      const batchPromises = batch.map((segment) => this.getEpisodeSegmentDanmu(segment));
      const batchResults = await Promise.allSettled(batchPromises);
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        const segment = batch[j];
        const start2 = segment.segment_start;
        const end2 = segment.segment_end;
        if (result.status === "fulfilled") {
          const comments = result.value;
          if (comments && comments.length > 0) {
            allComments.push(...comments);
          }
        } else {
          log("error", `\u83B7\u53D6\u5F39\u5E55\u6BB5\u5931\u8D25 (${start2}-${end2}s):`, result.reason.message);
        }
      }
      if (i + MAX_CONCURRENT < segmentList.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    if (allComments.length === 0) {
      log("info", `\u897F\u74DC\u89C6\u9891: \u8BE5\u89C6\u9891\u6682\u65E0\u5F39\u5E55\u6570\u636E (vid=${id})`);
      return [];
    }
    printFirst200Chars(allComments);
    return allComments;
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u897F\u74DC\u89C6\u9891\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    const awemeDetail = await this.getDetail(id);
    const awemeId = awemeDetail?.aweme_id;
    const duration = awemeDetail?.duration;
    log("info", "awemeId:", awemeId);
    log("info", "duration:", duration);
    const segmentDuration = 32e3;
    const segmentList = [];
    for (let i = 0; i < duration; i += segmentDuration) {
      const segmentStart = i;
      const segmentEnd = Math.min(i + segmentDuration, duration);
      segmentList.push({
        "type": "xigua",
        "segment_start": segmentStart,
        "segment_end": segmentEnd,
        "url": awemeId
      });
    }
    return new SegmentListResponse({
      "type": "xigua",
      "segmentList": segmentList
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    try {
      const danmuQueryString = buildQueryString({
        ..._XiguaSource.DEFAULT_PARAMS,
        group_id: segment.url,
        item_id: segment.url,
        start_time: segment.segment_start
      });
      const danmuUrl = `https://www.douyin.com/aweme/v1/web/danmaku/get_v2/?${danmuQueryString}`;
      const response = await Widget.http.get(danmuUrl, {
        headers: _XiguaSource.DEFAULT_HEADERS,
        retries: 1
      });
      let contents = [];
      if (response && response.data) {
        const parsedData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        const danmakuList = parsedData.danmaku_list ?? [];
        contents.push(...danmakuList);
      }
      return contents;
    } catch (error) {
      log("error", "\u8BF7\u6C42\u5206\u7247\u5F39\u5E55\u5931\u8D25:", error);
      return [];
    }
  }
  formatComments(comments) {
    return comments.map((c) => ({
      cid: Number(c.danmaku_id),
      p: `${(c.offset_time / 1e3).toFixed(2)},1,16777215,[xigua]`,
      m: c.text,
      t: Math.round(c.offset_time / 1e3)
    }));
  }
};
var xigua_default = XiguaSource;

// danmu_api/sources/animeko.js
var AnimekoSource = class extends BaseSource {
  /**
   * 获取标准 HTTP 请求头
   * @returns {Object} 请求头对象
   */
  get headers() {
    return {
      "Content-Type": "application/json",
      "User-Agent": `huangxd-/danmu_api/${globals.version}(https://github.com/huangxd-/danmu_api)`
    };
  }
  /**
   * 搜索动画条目
   * 使用 Bangumi V0 POST 接口进行搜索，并进行后置过滤和关系检测
   * @param {string} keyword 搜索关键词
   * @returns {Promise<Array>} 转换后的搜索结果列表
   */
  async search(keyword) {
    try {
      const searchKeyword = keyword.replace(/[._]/g, " ").replace(/\s+/g, " ").trim();
      log("info", `[Animeko] \u5F00\u59CB\u641C\u7D22 (V0): ${searchKeyword}`);
      const searchUrl = `https://api.bgm.tv/v0/search/subjects?limit=5`;
      const payload = {
        keyword: searchKeyword,
        filter: {
          type: [2]
          // 2 代表动画类型
        }
      };
      const resp = await Widget.http.post(searchUrl, JSON.stringify(payload), {
        headers: this.headers
      });
      if (!resp || !resp.data) {
        log("info", "[Animeko] \u641C\u7D22\u8BF7\u6C42\u5931\u8D25\u6216\u65E0\u6570\u636E\u8FD4\u56DE");
        return [];
      }
      let resultsList = resp.data.data || [];
      if (resultsList.length === 0) {
        log("info", "[Animeko] \u672A\u627E\u5230\u76F8\u5173\u6761\u76EE");
        return [];
      }
      resultsList = this.filterSearchResults(resultsList, keyword);
      if (resultsList.length === 0) {
        log("info", "[Animeko] \u8FC7\u6EE4\u540E\u65E0\u5339\u914D\u7ED3\u679C");
        return [];
      }
      if (resultsList.length > 1) {
        resultsList = await this.checkRelationsAndModifyTitles(resultsList);
      }
      log("info", `[Animeko] \u641C\u7D22\u5B8C\u6210\uFF0C\u627E\u5230 ${resultsList.length} \u4E2A\u6709\u6548\u7ED3\u679C`);
      return this.transformResults(resultsList);
    } catch (error) {
      log("error", "[Animeko] Search error:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return [];
    }
  }
  /**
   * 从文本中提取明确的季度数字
   * @param {string} text 标题文本
   * @returns {number|null} 季度数字，未找到返回 null
   */
  getExplicitSeasonNumber(text) {
    if (!text) return null;
    const cleanText2 = simplized(text);
    const arabicMatch = cleanText2.match(/(?:^|\s|\[|\(|（|【)(?:Season|S|第)\s*(\d+)(?:\s*季|期|部|Season|\]|\)|）|】)?/i);
    if (arabicMatch && arabicMatch[1]) {
      return parseInt(arabicMatch[1], 10);
    }
    const cnNums = { "\u4E00": 1, "\u4E8C": 2, "\u4E09": 3, "\u56DB": 4, "\u4E94": 5, "\u516D": 6, "\u4E03": 7, "\u516B": 8, "\u4E5D": 9, "\u5341": 10 };
    const cnMatch = cleanText2.match(/第([一二三四五六七八九十]+)[季期部]/);
    if (cnMatch && cnNums[cnMatch[1]]) {
      return cnNums[cnMatch[1]];
    }
    return null;
  }
  /**
   * 移除字符串中的标点符号、特殊符号和空白字符
   * 兼容不支持 Unicode 属性转义的 Node.js 版本
   * @param {string} str 输入字符串
   * @returns {string} 清理后的字符串
   */
  removePunctuationAndSymbols(str) {
    if (!str) return "";
    return str.replace(/[\s\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E\u2000-\u206F\u3000-\u3003\u3008-\u301F\u3030-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF60\uFFE0-\uFFE6\uFF61-\uFF65\u2190-\u21FF\u2600-\u27BF]+/g, "");
  }
  /**
   * 过滤搜索结果
   * 包含基础相似度过滤和智能季度匹配逻辑
   * @param {Array} list 原始 API 返回结果列表
   * @param {string} keyword 用户搜索关键词
   * @returns {Array} 过滤后的结果列表
   */
  filterSearchResults(list, keyword) {
    const threshold = 0.8;
    const normalize = (str) => {
      if (!str) return "";
      return this.removePunctuationAndSymbols(simplized(str).toLowerCase());
    };
    const normalizedKeyword = normalize(keyword);
    const candidates = list.filter((item) => {
      const titles = /* @__PURE__ */ new Set();
      if (item.name) titles.add(item.name);
      if (item.name_cn) titles.add(item.name_cn);
      if (item.infobox && Array.isArray(item.infobox)) {
        item.infobox.forEach((info) => {
          if (info.key === "\u522B\u540D" && Array.isArray(info.value)) {
            info.value.forEach((v) => {
              if (v.v) titles.add(v.v);
            });
          }
          if (info.key === "\u4E2D\u6587\u540D" && typeof info.value === "string") {
            titles.add(info.value);
          }
        });
      }
      let maxScore = 0;
      for (const t of titles) {
        const normalizedTitle = normalize(t);
        const score = this.calculateSimilarity(normalizedKeyword, normalizedTitle);
        if (score > maxScore) maxScore = score;
      }
      return maxScore >= threshold;
    });
    if (candidates.length === 0) return [];
    const targetSeason = this.getExplicitSeasonNumber(keyword);
    if (targetSeason !== null && targetSeason > 1) {
      log("info", `[Animeko] \u68C0\u6D4B\u5230\u6307\u5B9A\u5B63\u5EA6\u641C\u7D22: \u7B2C ${targetSeason} \u5B63`);
      const strictMatches = candidates.filter((item) => {
        const seasonInName = this.getExplicitSeasonNumber(item.name);
        const seasonInCn = this.getExplicitSeasonNumber(item.name_cn);
        const itemSeason = seasonInName !== null ? seasonInName : seasonInCn !== null ? seasonInCn : 1;
        return itemSeason === targetSeason;
      });
      if (strictMatches.length > 0) {
        return strictMatches;
      }
      log("info", `[Animeko] \u672A\u627E\u5230\u7B2C ${targetSeason} \u5B63\u5BF9\u5E94\u6761\u76EE\uFF0C\u56DE\u9000\u81F3\u6700\u4F18\u7ED3\u679C`);
      return [candidates[0]];
    }
    return candidates;
  }
  /**
   * 计算字符串相似度
   * 结合包含关系与编辑距离算法
   * @param {string} s1 字符串1
   * @param {string} s2 字符串2
   * @returns {number} 相似度得分 (0.0 - 1.0)
   */
  calculateSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) {
      const lenRatio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
      return 0.8 + lenRatio * 0.2;
    }
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];
    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
    }
    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }
  /**
   * 检查标题是否包含明确的季度或类型标识
   * @param {string} title 标题文本
   * @returns {boolean} 是否包含明确标识
   */
  hasExplicitSeasonInfo(title) {
    if (!title) return false;
    const patterns = [
      /第\s*[0-9一二三四五六七八九十]+\s*[季期部]/i,
      // 第2季
      /Season\s*\d+/i,
      // Season 2
      /S\d+/i,
      // S2
      /Part\s*\d+/i,
      // Part 2
      /OVA/i,
      /OAD/i,
      /剧场版|Movie|Film/i,
      /续篇|续集/i,
      /SP/i,
      /(?<!\d)\d+$/,
      // 末尾数字
      /\S+篇/i,
      // 篇章标识 (如: 柱训练篇)
      /\S+章/i,
      /Act\s*\d+/i,
      /Phase\s*\d+/i
    ];
    return patterns.some((p) => p.test(title));
  }
  /**
   * 批量检查条目关系并修正标题
   * 对于检测到的续作或衍生关系，在标题后追加标识
   * @param {Array} list 条目列表
   * @returns {Promise<Array>} 修正后的列表
   */
  async checkRelationsAndModifyTitles(list) {
    const checkLimit = Math.min(list.length, 3);
    for (let i = 0; i < checkLimit; i++) {
      for (let j = 0; j < checkLimit; j++) {
        if (i === j) continue;
        const subjectA = list[i];
        const subjectB = list[j];
        const nameA = subjectA.name_cn || subjectA.name;
        const nameB = subjectB.name_cn || subjectB.name;
        if (nameB.includes(nameA) && nameB.length > nameA.length) {
          if (this.hasExplicitSeasonInfo(nameB)) {
            continue;
          }
          const relations = await this.getSubjectRelations(subjectA.id);
          const relationInfo = relations.find((r) => r.id === subjectB.id);
          if (relationInfo) {
            log("info", `[Animeko] \u68C0\u6D4B\u5230\u5173\u7CFB: [${nameA}] -> ${relationInfo.relation} -> [${nameB}]`);
            const targetRelations = ["\u7EED\u96C6", "\u756A\u5916\u7BC7", "\u4E3B\u7EBF\u6545\u4E8B", "\u524D\u4F20", "\u4E0D\u540C\u6F14\u7ECE", "\u884D\u751F"];
            if (targetRelations.includes(relationInfo.relation)) {
              let mark = relationInfo.relation;
              if (mark === "\u7EED\u96C6") mark = "\u7EED\u7BC7";
              subjectB._relation_mark = `(${mark})`;
            }
          }
        }
      }
    }
    return list;
  }
  /**
   * 获取指定条目的关联条目列表
   * @param {number} subjectId 条目 ID
   * @returns {Promise<Array>} 关联条目数组
   */
  async getSubjectRelations(subjectId) {
    try {
      const url = `https://api.bgm.tv/v0/subjects/${subjectId}/subjects`;
      const resp = await Widget.http.get(url, { headers: this.headers });
      if (!resp || !resp.data || !Array.isArray(resp.data)) return [];
      return resp.data.filter((item) => item.type === 2).map((item) => ({
        id: item.id,
        name: item.name_cn || item.name,
        relation: item.relation
      }));
    } catch (e) {
      log("warn", `[Animeko] \u83B7\u53D6\u5173\u7CFB\u5931\u8D25 ID:${subjectId}: ${e.message}`);
      return [];
    }
  }
  /**
   * 将 API 结果转换为统一的数据格式
   * @param {Array} results API 原始结果
   * @returns {Array} 转换后的数据
   */
  transformResults(results) {
    return results.map((item) => {
      let typeDesc = "\u52A8\u6F2B";
      if (item.platform) {
        switch (item.platform) {
          case "TV":
            typeDesc = "TV\u52A8\u753B";
            break;
          case "Web":
            typeDesc = "Web\u52A8\u753B";
            break;
          case "OVA":
            typeDesc = "OVA";
            break;
          case "Movie":
            typeDesc = "\u5267\u573A\u7248";
            break;
          default:
            typeDesc = item.platform;
        }
      }
      const titleSuffix = item._relation_mark ? ` ${item._relation_mark}` : "";
      return {
        id: item.id,
        name: item.name,
        name_cn: (item.name_cn || item.name) + titleSuffix,
        images: item.images,
        air_date: item.date,
        score: item.score,
        typeDescription: typeDesc
      };
    });
  }
  /**
   * 获取剧集列表
   * Bangumi API 限制单次 limit=200，需循环获取完整列表
   * @param {number} subjectId 条目 ID
   * @returns {Promise<Array>} 剧集数组
   */
  async getEpisodes(subjectId) {
    let allEpisodes = [];
    let offset = 0;
    const limit = 200;
    try {
      while (true) {
        const url = `https://api.bgm.tv/v0/episodes?subject_id=${subjectId}&limit=${limit}&offset=${offset}`;
        const resp = await Widget.http.get(url, {
          headers: this.headers
        });
        if (!resp || !resp.data || !Array.isArray(resp.data.data)) {
          if (offset === 0) {
            log("info", `[Animeko] Subject ${subjectId} \u65E0\u5267\u96C6\u6570\u636E\u6216\u54CD\u5E94\u5F02\u5E38`);
          }
          break;
        }
        const currentBatch = resp.data.data;
        if (currentBatch.length === 0) {
          break;
        }
        allEpisodes = allEpisodes.concat(currentBatch);
        if (currentBatch.length === limit) {
          log("info", `[Animeko] ID:${subjectId} \u6B63\u52A0\u8F7D\u66F4\u591A\u5267\u96C6 (\u5F53\u524D\u5DF2\u83B7: ${allEpisodes.length})`);
        }
        if (currentBatch.length < limit) {
          break;
        }
        offset += limit;
        if (offset > 1600) {
          log("warn", `[Animeko] ID:${subjectId} \u5267\u96C6\u6570\u91CF\u8D85\u8FC7\u5B89\u5168\u9650\u5236(1600)\uFF0C\u505C\u6B62\u7FFB\u9875`);
          break;
        }
      }
      return allEpisodes;
    } catch (error) {
      log("error", "[Animeko] GetEpisodes error:", {
        message: error.message,
        id: subjectId,
        offset
      });
      return [];
    }
  }
  /**
   * 处理并存储番剧及剧集信息
   * @param {Array} sourceAnimes 搜索到的番剧列表
   * @param {string} queryTitle 原始查询标题
   * @param {Array} curAnimes 当前缓存的番剧列表
   */
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
    const tmpAnimes = [];
    if (!sourceAnimes || !Array.isArray(sourceAnimes)) {
      if (sourceAnimes) log("error", "[Animeko] sourceAnimes is not a valid array");
      return [];
    }
    const processAnimekoAnimes = await Promise.all(
      sourceAnimes.map(async (anime) => {
        try {
          const eps = await this.getEpisodes(anime.id);
          let links = [];
          let effectiveStartDate = anime.air_date || "";
          if (Array.isArray(eps)) {
            eps.sort((a, b) => (a.sort || 0) - (b.sort || 0));
            for (const ep of eps) {
              if (ep.type !== 0) continue;
              if (!effectiveStartDate && ep.airdate) {
                effectiveStartDate = ep.airdate;
              }
              const epNum = ep.sort || ep.ep;
              const epName = ep.name_cn || ep.name || "";
              const fullTitle = `EP${epNum} ${epName}`.trim();
              links.push({
                "name": `${epNum}`,
                "url": ep.id.toString(),
                "title": `\u3010animeko\u3011 ${fullTitle}`
              });
            }
          }
          if (links.length > 0) {
            const yearStr = effectiveStartDate ? new Date(effectiveStartDate).getFullYear() : "";
            let transformedAnime = {
              animeId: anime.id,
              bangumiId: String(anime.id),
              animeTitle: `${anime.name_cn || anime.name}(${yearStr})\u3010${anime.typeDescription || "\u52A8\u6F2B"}\u3011from animeko`,
              type: "\u52A8\u6F2B",
              typeDescription: anime.typeDescription || "\u52A8\u6F2B",
              imageUrl: anime.images ? anime.images.common || anime.images.large : "",
              startDate: effectiveStartDate,
              episodeCount: links.length,
              rating: anime.score || 0,
              isFavorited: true,
              source: "animeko"
            };
            tmpAnimes.push(transformedAnime);
            addAnime({ ...transformedAnime, links });
            if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
          }
        } catch (error) {
          log("error", `[Animeko] Error processing anime ${anime.id}: ${error.message}`);
        }
      })
    );
    this.sortAndPushAnimesByYear(tmpAnimes, curAnimes);
    return processAnimekoAnimes;
  }
  /**
   * 获取完整弹幕列表
   * 支持自动降级：Global -> CN
   * @param {string} episodeId 剧集 ID 或 完整 API URL
   * @returns {Promise<Array>} 弹幕数组
   */
  async getEpisodeDanmu(episodeId) {
    let realId = String(episodeId).trim();
    if (realId.includes("/")) {
      const parts = realId.split("/");
      realId = parts[parts.length - 1];
    }
    if (realId.includes("?")) {
      realId = realId.split("?")[0];
    }
    if (!realId) {
      log("error", "[Animeko] \u65E0\u6548\u7684 episodeId");
      return [];
    }
    const HOST_GLOBAL = "https://danmaku-global.myani.org";
    const HOST_CN = "https://danmaku-cn.myani.org";
    const fetchDanmu = async (hostUrl) => {
      const targetUrl = `${hostUrl}/v1/danmaku/${realId}`;
      try {
        const resp = await Widget.http.get(targetUrl, { headers: this.headers });
        if (!resp || !resp.data) return null;
        const body = resp.data;
        if (body.danmakuList) return body.danmakuList;
        return null;
      } catch (error) {
        log("warn", `[Animeko] \u8BF7\u6C42\u8282\u70B9\u5931\u8D25: ${hostUrl} - ${error.message}`);
        return null;
      }
    };
    let danmuList = await fetchDanmu(HOST_GLOBAL);
    if (!danmuList) {
      log("info", `[Animeko] Global \u8282\u70B9\u83B7\u53D6\u5931\u8D25/\u65E0\u6570\u636E\uFF0C\u964D\u7EA7\u5C1D\u8BD5 CN \u8282\u70B9... ID:${realId}`);
      danmuList = await fetchDanmu(HOST_CN);
    }
    if (danmuList) {
      log("info", `[Animeko] \u6210\u529F\u83B7\u53D6\u5F39\u5E55\uFF0C\u5171 ${danmuList.length} \u6761`);
      return danmuList;
    }
    log("error", "[Animeko] \u6240\u6709\u8282\u70B9\u5C1D\u8BD5\u5747\u5931\u8D25\uFF0C\u65E0\u6CD5\u83B7\u53D6\u5F39\u5E55");
    return [];
  }
  /**
   * 获取分段弹幕列表定义
   * 使用完整的 API URL 填充 url 字段，以通过 format 校验
   */
  async getEpisodeDanmuSegments(id) {
    return new SegmentListResponse({
      "type": "animeko",
      "segmentList": [{
        "type": "animeko",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": String(id)
      }]
    });
  }
  /**
   * 获取具体分片的弹幕数据
   * 标准实现：返回原始数据，格式化交由父类统一处理
   */
  async getEpisodeSegmentDanmu(segment) {
    const url = (segment.url || "").trim();
    if (!url) return [];
    return this.getEpisodeDanmu(url);
  }
  /**
   * 格式化弹幕为标准格式
   * @param {Array} comments 原始弹幕数据
   * @returns {Array} 格式化后的弹幕
   */
  formatComments(comments) {
    if (!Array.isArray(comments)) return [];
    const locationMap = { "NORMAL": 1, "TOP": 5, "BOTTOM": 4 };
    return comments.filter((item) => item && item.danmakuInfo).map((item) => {
      const info = item.danmakuInfo;
      const time = (Number(info.playTime) / 1e3).toFixed(2);
      const mode = locationMap[info.location] || 1;
      const color = info.color === -1 ? 16777215 : info.color;
      const text = globals.danmuSimplifiedTraditional === "simplified" ? simplized(info.text) : info.text;
      return {
        cid: item.id,
        p: `${time},${mode},${color},[animeko]`,
        m: text
      };
    });
  }
};

// danmu_api/sources/other.js
var OtherSource = class extends BaseSource {
  async search(keyword) {
  }
  async getEpisodes(id) {
  }
  async handleAnimes(sourceAnimes, queryTitle, curAnimes) {
  }
  async getEpisodeDanmu(id) {
    try {
      const response = await Widget.http.get(
        `${globals.otherServer}/?url=${id}&ac=dm`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        }
      );
      log("info", `danmu response from ${globals.otherServer}: \u2193\u2193\u2193`);
      printFirst200Chars(response.data);
      return response.data;
    } catch (error) {
      log("error", `\u8BF7\u6C42 ${globals.otherServer} \u5931\u8D25:`, error);
      return [];
    }
  }
  async getEpisodeDanmuSegments(id) {
    log("info", "\u83B7\u53D6\u7B2C\u4E09\u65B9\u670D\u52A1\u5668\u5F39\u5E55\u5206\u6BB5\u5217\u8868...", id);
    return new SegmentListResponse({
      "type": "other_server",
      "segmentList": [{
        "type": "other_server",
        "segment_start": 0,
        "segment_end": 3e4,
        "url": id
      }]
    });
  }
  async getEpisodeSegmentDanmu(segment) {
    return this.getEpisodeDanmu(segment.url);
  }
  formatComments(comments) {
    return comments;
  }
};

// danmu_api/apis/dandan-api.js
var kan360Source = new Kan360Source();
var vodSource = new VodSource();
var renrenSource = new RenrenSource();
var hanjutvSource = new HanjutvSource();
var bahamutSource = new BahamutSource();
var dandanSource = new DandanSource();
var customSource = new CustomSource();
var tencentSource = new TencentSource();
var youkuSource = new YoukuSource();
var iqiyiSource = new IqiyiSource();
var mangoSource = new MangoSource();
var bilibiliSource = new BilibiliSource();
var sohuSource = new SohuSource();
var leshiSource = new LeshiSource();
var xiguaSource = new xigua_default();
var animekoSource = new AnimekoSource();
var otherSource = new OtherSource();
var doubanSource = new DoubanSource(tencentSource, iqiyiSource, youkuSource, bilibiliSource);
var tmdbSource = new TmdbSource(doubanSource);
var PENDING_DANMAKU_REQUESTS = /* @__PURE__ */ new Map();
function matchSeason(anime, queryTitle, season) {
  const normalizedAnimeTitle = normalizeSpaces(anime.animeTitle);
  const normalizedQueryTitle = normalizeSpaces(queryTitle);
  if (normalizedAnimeTitle.includes(normalizedQueryTitle)) {
    const title = normalizedAnimeTitle.split("(")[0].trim();
    if (title.startsWith(normalizedQueryTitle)) {
      const afterTitle = title.substring(normalizedQueryTitle.length).trim();
      if (afterTitle === "" && season === 1) {
        return true;
      }
      const seasonIndex = afterTitle.match(/\d+/);
      if (seasonIndex && seasonIndex[0] === season.toString()) {
        return true;
      }
      const chineseNumber = afterTitle.match(/[一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+/);
      if (chineseNumber && convertChineseNumber(chineseNumber[0]) === season) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}
async function searchAnime(url, preferAnimeId = null, preferSource = null) {
  const queryTitle = url.searchParams.get("keyword");
  log("info", `Search anime with keyword: ${queryTitle}`);
  if (queryTitle === "") {
    return jsonResponse({
      errorCode: 0,
      success: true,
      errorMessage: "",
      animes: []
    });
  }
  const cachedResults = getSearchCache(queryTitle);
  if (cachedResults !== null) {
    return jsonResponse({
      errorCode: 0,
      success: true,
      errorMessage: "",
      animes: cachedResults
    });
  }
  const curAnimes = [];
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?$/;
  if (urlRegex.test(queryTitle)) {
    const tmpAnime = Anime.fromJson({
      "animeId": 111,
      "bangumiId": "string",
      "animeTitle": queryTitle,
      "type": "type",
      "typeDescription": "string",
      "imageUrl": "string",
      "startDate": "2025-08-08T13:25:11.189Z",
      "episodeCount": 1,
      "rating": 0,
      "isFavorited": true
    });
    let platform = "unknown";
    if (queryTitle.includes(".qq.com")) {
      platform = "qq";
    } else if (queryTitle.includes(".iqiyi.com")) {
      platform = "qiyi";
    } else if (queryTitle.includes(".mgtv.com")) {
      platform = "imgo";
    } else if (queryTitle.includes(".youku.com")) {
      platform = "youku";
    } else if (queryTitle.includes(".bilibili.com")) {
      platform = "bilibili1";
    }
    const pageTitle = await getPageTitle(queryTitle);
    const links = [{
      "name": "\u624B\u52A8\u89E3\u6790\u94FE\u63A5\u5F39\u5E55",
      "url": queryTitle,
      "title": `\u3010${platform}\u3011 ${pageTitle}`
    }];
    curAnimes.push(tmpAnime);
    addAnime(Anime.fromJson({ ...tmpAnime, links }));
    if (globals.animes.length > globals.MAX_ANIMES) removeEarliestAnime();
    if (globals.localCacheValid && curAnimes.length !== 0) {
      await updateLocalCaches();
    }
    if (globals.redisValid && curAnimes.length !== 0) {
      await updateRedisCaches();
    }
    return jsonResponse({
      errorCode: 0,
      success: true,
      errorMessage: "",
      animes: curAnimes
    });
  }
  try {
    log("info", `Search sourceOrderArr: ${globals.sourceOrderArr}`);
    const requestPromises = globals.sourceOrderArr.map((source) => {
      if (source === "360") return kan360Source.search(queryTitle);
      if (source === "vod") return vodSource.search(queryTitle, preferAnimeId, preferSource);
      if (source === "tmdb") return tmdbSource.search(queryTitle);
      if (source === "douban") return doubanSource.search(queryTitle);
      if (source === "renren") return renrenSource.search(queryTitle);
      if (source === "hanjutv") return hanjutvSource.search(queryTitle);
      if (source === "bahamut") return bahamutSource.search(queryTitle);
      if (source === "dandan") return dandanSource.search(queryTitle);
      if (source === "custom") return customSource.search(queryTitle);
      if (source === "tencent") return tencentSource.search(queryTitle);
      if (source === "youku") return youkuSource.search(queryTitle);
      if (source === "iqiyi") return iqiyiSource.search(queryTitle);
      if (source === "imgo") return mangoSource.search(queryTitle);
      if (source === "bilibili") return bilibiliSource.search(queryTitle);
      if (source === "sohu") return sohuSource.search(queryTitle);
      if (source === "leshi") return leshiSource.search(queryTitle);
      if (source === "xigua") return xiguaSource.search(queryTitle);
      if (source === "animeko") return animekoSource.search(queryTitle);
    });
    const results = await Promise.all(requestPromises);
    const resultData = {};
    globals.sourceOrderArr.forEach((source, index) => {
      resultData[source] = results[index];
    });
    const {
      vod: animesVodResults,
      360: animes360,
      tmdb: animesTmdb,
      douban: animesDouban,
      renren: animesRenren,
      hanjutv: animesHanjutv,
      bahamut: animesBahamut,
      dandan: animesDandan,
      custom: animesCustom,
      tencent: animesTencent,
      youku: animesYouku,
      iqiyi: animesIqiyi,
      imgo: animesImgo,
      bilibili: animesBilibili,
      sohu: animesSohu,
      leshi: animesLeshi,
      xigua: animesXigua,
      animeko: animesAnimeko
    } = resultData;
    for (const key of globals.sourceOrderArr) {
      if (key === "360") {
        await kan360Source.handleAnimes(animes360, queryTitle, curAnimes);
      } else if (key === "vod") {
        if (animesVodResults && Array.isArray(animesVodResults)) {
          for (const vodResult of animesVodResults) {
            if (vodResult && vodResult.list && vodResult.list.length > 0) {
              await vodSource.handleAnimes(vodResult.list, queryTitle, curAnimes, vodResult.serverName);
            }
          }
        }
      } else if (key === "tmdb") {
        await tmdbSource.handleAnimes(animesTmdb, queryTitle, curAnimes);
      } else if (key === "douban") {
        await doubanSource.handleAnimes(animesDouban, queryTitle, curAnimes);
      } else if (key === "renren") {
        await renrenSource.handleAnimes(animesRenren, queryTitle, curAnimes);
      } else if (key === "hanjutv") {
        await hanjutvSource.handleAnimes(animesHanjutv, queryTitle, curAnimes);
      } else if (key === "bahamut") {
        await bahamutSource.handleAnimes(animesBahamut, queryTitle, curAnimes);
      } else if (key === "dandan") {
        await dandanSource.handleAnimes(animesDandan, queryTitle, curAnimes);
      } else if (key === "custom") {
        await customSource.handleAnimes(animesCustom, queryTitle, curAnimes);
      } else if (key === "tencent") {
        await tencentSource.handleAnimes(animesTencent, queryTitle, curAnimes);
      } else if (key === "youku") {
        await youkuSource.handleAnimes(animesYouku, queryTitle, curAnimes);
      } else if (key === "iqiyi") {
        await iqiyiSource.handleAnimes(animesIqiyi, queryTitle, curAnimes);
      } else if (key === "imgo") {
        await mangoSource.handleAnimes(animesImgo, queryTitle, curAnimes);
      } else if (key === "bilibili") {
        await bilibiliSource.handleAnimes(animesBilibili, queryTitle, curAnimes);
      } else if (key === "sohu") {
        await sohuSource.handleAnimes(animesSohu, queryTitle, curAnimes);
      } else if (key === "leshi") {
        await leshiSource.handleAnimes(animesLeshi, queryTitle, curAnimes);
      } else if (key === "xigua") {
        await xiguaSource.handleAnimes(animesXigua, queryTitle, curAnimes);
      } else if (key === "animeko") {
        await animekoSource.handleAnimes(animesAnimeko, queryTitle, curAnimes);
      }
    }
  } catch (error) {
    log("error", "\u53D1\u751F\u9519\u8BEF:", error);
  }
  if (globals.mergeSourcePairs.length > 0) {
    await applyMergeLogic(curAnimes);
  }
  storeAnimeIdsToMap(curAnimes, queryTitle);
  if (globals.enableEpisodeFilter) {
    const validAnimes = [];
    for (const anime of curAnimes) {
      const animeTitle = anime.animeTitle || "";
      if (globals.episodeTitleFilter.test(animeTitle)) {
        log("info", `[searchAnime] Anime ${anime.animeId} filtered by name: ${animeTitle}`);
        continue;
      }
      const animeData = globals.animes.find((a) => a.animeId === anime.animeId);
      if (animeData && animeData.links) {
        let episodesList = animeData.links.map((link, index) => ({
          episodeId: link.id,
          episodeTitle: link.title,
          episodeNumber: index + 1
        }));
        episodesList = episodesList.filter((episode) => {
          return !globals.episodeTitleFilter.test(episode.episodeTitle);
        });
        log("info", `[searchAnime] Anime ${anime.animeId} filtered episodes: ${episodesList.length}/${animeData.links.length}`);
        if (episodesList.length > 0) {
          validAnimes.push(anime);
        }
      }
    }
    curAnimes.length = 0;
    curAnimes.push(...validAnimes);
  }
  if (globals.localCacheValid && curAnimes.length !== 0) {
    await updateLocalCaches();
  }
  if (globals.redisValid && curAnimes.length !== 0) {
    await updateRedisCaches();
  }
  if (curAnimes.length > 0) {
    setSearchCache(queryTitle, curAnimes);
  }
  return jsonResponse({
    errorCode: 0,
    success: true,
    errorMessage: "",
    animes: curAnimes
  });
}
async function getBangumi(path2) {
  const idParam = path2.split("/").pop();
  const animeId = parseInt(idParam);
  let anime;
  if (!isNaN(animeId)) {
    anime = globals.animes.find((a) => a.animeId.toString() === animeId.toString());
  }
  if (!anime) {
    anime = globals.animes.find((a) => a.bangumiId === idParam);
  }
  if (!anime) {
    log("error", `Anime with ID ${idParam} not found`);
    return jsonResponse(
      { errorCode: 404, success: false, errorMessage: "Anime not found", bangumi: null },
      404
    );
  }
  log("info", `Fetched details for anime ID: ${idParam}`);
  let episodesList = [];
  for (let i = 0; i < anime.links.length; i++) {
    const link = anime.links[i];
    episodesList.push({
      seasonId: `season-${anime.animeId}`,
      episodeId: link.id,
      episodeTitle: `${link.title}`,
      episodeNumber: `${i + 1}`,
      airDate: anime.startDate
    });
  }
  if (globals.enableEpisodeFilter) {
    episodesList = episodesList.filter((episode) => {
      return !globals.episodeTitleFilter.test(episode.episodeTitle);
    });
    log("info", `[getBangumi] Episode filter enabled. Filtered episodes: ${episodesList.length}/${anime.links.length}`);
    if (episodesList.length === 0) {
      log("warn", `[getBangumi] No valid episodes after filtering for anime ID ${idParam}`);
      return jsonResponse(
        { errorCode: 404, success: false, errorMessage: "No valid episodes after filtering", bangumi: null },
        404
      );
    }
    episodesList = episodesList.map((episode, index) => ({
      ...episode,
      episodeNumber: `${index + 1}`
    }));
  }
  const bangumi = Bangumi.fromJson({
    animeId: anime.animeId,
    bangumiId: anime.bangumiId,
    animeTitle: anime.animeTitle,
    imageUrl: anime.imageUrl,
    isOnAir: true,
    airDay: 1,
    isFavorited: anime.isFavorited,
    rating: anime.rating,
    type: anime.type,
    typeDescription: anime.typeDescription,
    seasons: [
      {
        id: `season-${anime.animeId}`,
        airDate: anime.startDate,
        name: "Season 1",
        episodeCount: anime.episodeCount
      }
    ],
    episodes: episodesList
  });
  return jsonResponse({
    errorCode: 0,
    success: true,
    errorMessage: "",
    bangumi
  });
}
async function fetchMergedComments(url) {
  const parts = url.split(MERGE_DELIMITER);
  const sourceNames = parts.map((part) => part.split(":")[0]).filter(Boolean);
  const sourceTag = sourceNames.join("\uFF06");
  log("info", `[Merge] \u5F00\u59CB\u83B7\u53D6 [${sourceTag}] \u805A\u5408\u5F39\u5E55...`);
  const cached = getCommentCache(url);
  if (cached) {
    log("info", `[Merge] \u547D\u4E2D\u7F13\u5B58 [${sourceTag}]\uFF0C\u8FD4\u56DE ${cached.length} \u6761`);
    return cached;
  }
  const stats = {};
  const tasks = parts.map(async (part) => {
    const firstColonIndex = part.indexOf(":");
    if (firstColonIndex === -1) return [];
    const sourceName = part.substring(0, firstColonIndex);
    const realId = part.substring(firstColonIndex + 1);
    if (!sourceName || !realId) return [];
    const pendingKey = `${sourceName}:${realId}`;
    if (PENDING_DANMAKU_REQUESTS.has(pendingKey)) {
      log("info", `[Merge] \u590D\u7528\u6B63\u5728\u8FDB\u884C\u7684\u8BF7\u6C42: ${pendingKey}`);
      try {
        const list = await PENDING_DANMAKU_REQUESTS.get(pendingKey);
        return list || [];
      } catch (e) {
        return [];
      }
    }
    const fetchTask = (async () => {
      let sourceInstance = null;
      if (sourceName === "renren") sourceInstance = renrenSource;
      else if (sourceName === "hanjutv") sourceInstance = hanjutvSource;
      else if (sourceName === "bahamut") sourceInstance = bahamutSource;
      else if (sourceName === "dandan") sourceInstance = dandanSource;
      else if (sourceName === "tencent") sourceInstance = tencentSource;
      else if (sourceName === "youku") sourceInstance = youkuSource;
      else if (sourceName === "iqiyi") sourceInstance = iqiyiSource;
      else if (sourceName === "imgo") sourceInstance = mangoSource;
      else if (sourceName === "bilibili") sourceInstance = bilibiliSource;
      else if (sourceName === "sohu") sourceInstance = sohuSource;
      else if (sourceName === "leshi") sourceInstance = leshiSource;
      else if (sourceName === "xigua") sourceInstance = xiguaSource;
      else if (sourceName === "animeko") sourceInstance = animekoSource;
      if (sourceInstance) {
        try {
          const raw = await sourceInstance.getEpisodeDanmu(realId);
          const formatted = sourceInstance.formatComments(raw);
          stats[sourceName] = formatted.length;
          return formatted;
        } catch (e) {
          log("error", `[Merge] \u83B7\u53D6 ${sourceName} \u5931\u8D25: ${e.message}`);
          stats[sourceName] = 0;
          return [];
        }
      }
      return [];
    })();
    PENDING_DANMAKU_REQUESTS.set(pendingKey, fetchTask);
    try {
      return await fetchTask;
    } finally {
      PENDING_DANMAKU_REQUESTS.delete(pendingKey);
    }
  });
  const results = await Promise.all(tasks);
  let mergedList = [];
  results.forEach((list) => {
    mergedList = mergeDanmakuList(mergedList, list);
  });
  const statDetails = Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join(", ");
  log("info", `[Merge] \u805A\u5408\u539F\u59CB\u6570\u636E\u5B8C\u6210: \u603B\u8BA1 ${mergedList.length} \u6761 (${statDetails})`);
  return convertToDanmakuJson(mergedList, sourceTag);
}
async function getComment(path2, queryFormat, segmentFlag) {
  const commentId = parseInt(path2.split("/").pop());
  let url = findUrlById(commentId);
  let title = findTitleById(commentId);
  let plat = title ? (title.match(/【(.*?)】/) || [null])[0]?.replace(/[【】]/g, "") : null;
  log("info", "comment url...", url);
  log("info", "comment title...", title);
  log("info", "comment platform...", plat);
  if (!url) {
    log("error", `Comment with ID ${commentId} not found`);
    return jsonResponse({ count: 0, comments: [] }, 404);
  }
  log("info", `Fetched comment ID: ${commentId}`);
  const cachedComments = getCommentCache(url);
  if (cachedComments !== null) {
    const responseData2 = { count: cachedComments.length, comments: cachedComments };
    return formatDanmuResponse(responseData2, queryFormat);
  }
  log("info", "\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u5F39\u5E55...", url);
  let danmus = [];
  if (url && url.includes(MERGE_DELIMITER)) {
    danmus = await fetchMergedComments(url);
  } else {
    if (url.includes(".qq.com")) {
      danmus = await tencentSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".iqiyi.com")) {
      danmus = await iqiyiSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".mgtv.com")) {
      danmus = await mangoSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".bilibili.com") || url.includes("b23.tv")) {
      if (url.includes("b23.tv")) {
        url = await bilibiliSource.resolveB23Link(url);
      }
      danmus = await bilibiliSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".youku.com")) {
      danmus = await youkuSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".sohu.com")) {
      danmus = await sohuSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".le.com")) {
      danmus = await leshiSource.getComments(url, plat, segmentFlag);
    } else if (url.includes(".douyin.com") || url.includes(".ixigua.com")) {
      danmus = await xiguaSource.getComments(url, plat, segmentFlag);
    }
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
    if (!urlPattern.test(url)) {
      if (plat === "renren") {
        danmus = await renrenSource.getComments(url, plat, segmentFlag);
      } else if (plat === "hanjutv") {
        danmus = await hanjutvSource.getComments(url, plat, segmentFlag);
      } else if (plat === "bahamut") {
        danmus = await bahamutSource.getComments(url, plat, segmentFlag);
      } else if (plat === "dandan") {
        danmus = await dandanSource.getComments(url, plat, segmentFlag);
      } else if (plat === "custom") {
        danmus = await customSource.getComments(url, plat, segmentFlag);
      } else if (plat === "animeko") {
        danmus = await animekoSource.getComments(url, plat, segmentFlag);
      }
    }
    if ((!danmus || danmus.length === 0) && urlPattern.test(url)) {
      danmus = await otherSource.getComments(url, "other_server", segmentFlag);
    }
  }
  const [animeId, source] = findAnimeIdByCommentId(commentId);
  if (animeId && source) {
    setPreferByAnimeId(animeId, source);
    if (globals.localCacheValid && animeId) {
      writeCacheToFile("lastSelectMap", JSON.stringify(Object.fromEntries(globals.lastSelectMap)));
    }
    if (globals.redisValid && animeId) {
      setRedisKey("lastSelectMap", globals.lastSelectMap).catch((e) => log("error", "Redis set error", e));
    }
  }
  if (!segmentFlag) {
    if (danmus && danmus.comments) danmus = danmus.comments;
    if (!Array.isArray(danmus)) danmus = [];
    if (danmus.length > 0) {
      setCommentCache(url, danmus);
    }
  }
  const responseData = { count: danmus.length, comments: danmus };
  return formatDanmuResponse(responseData, queryFormat);
}
async function getSegmentComment(segment, queryFormat) {
  try {
    let url = segment.url;
    let platform = segment.type;
    if (!url || typeof url !== "string") {
      log("error", "Missing or invalid url parameter");
      return jsonResponse(
        { errorCode: 400, success: false, errorMessage: "Missing or invalid url parameter", count: 0, comments: [] },
        400
      );
    }
    url = url.trim();
    log("info", `Processing segment comment request for URL: ${url}`);
    const cachedComments = getCommentCache(url);
    if (cachedComments !== null) {
      const responseData2 = {
        errorCode: 0,
        success: true,
        errorMessage: "",
        count: cachedComments.length,
        comments: cachedComments
      };
      return formatDanmuResponse(responseData2, queryFormat);
    }
    log("info", `\u5F00\u59CB\u4ECE\u672C\u5730\u8BF7\u6C42\u5206\u6BB5\u5F39\u5E55... URL: ${url}`);
    let danmus = [];
    if (platform === "qq") {
      danmus = await tencentSource.getSegmentComments(segment);
    } else if (platform === "qiyi") {
      danmus = await iqiyiSource.getSegmentComments(segment);
    } else if (platform === "imgo") {
      danmus = await mangoSource.getSegmentComments(segment);
    } else if (platform === "bilibili1") {
      danmus = await bilibiliSource.getSegmentComments(segment);
    } else if (platform === "youku") {
      danmus = await youkuSource.getSegmentComments(segment);
    } else if (platform === "sohu") {
      danmus = await sohuSource.getSegmentComments(segment);
    } else if (platform === "leshi") {
      danmus = await leshiSource.getSegmentComments(segment);
    } else if (platform === "xigua") {
      danmus = await xiguaSource.getSegmentComments(segment);
    } else if (platform === "hanjutv") {
      danmus = await hanjutvSource.getSegmentComments(segment);
    } else if (platform === "bahamut") {
      danmus = await bahamutSource.getSegmentComments(segment);
    } else if (platform === "renren") {
      danmus = await renrenSource.getSegmentComments(segment);
    } else if (platform === "dandan") {
      danmus = await dandanSource.getSegmentComments(segment);
    } else if (platform === "animeko") {
      danmus = await animekoSource.getSegmentComments(segment);
    } else if (platform === "custom") {
      danmus = await customSource.getSegmentComments(segment);
    } else if (platform === "other_server") {
      danmus = await otherSource.getSegmentComments(segment);
    }
    log("info", `Successfully fetched ${danmus.length} segment comments from URL`);
    if (danmus.length > 0) {
      setCommentCache(url, danmus);
    }
    const responseData = {
      errorCode: 0,
      success: true,
      errorMessage: "",
      count: danmus.length,
      comments: danmus
    };
    return formatDanmuResponse(responseData, queryFormat);
  } catch (error) {
    log("error", `Failed to process segment comment request: ${error.message}`);
    return jsonResponse(
      { errorCode: 500, success: false, errorMessage: "Internal server error", count: 0, comments: [] },
      500
    );
  }
}

// forward/forward-widget.js
var wv = true ? "1.13.4" : Globals.VERSION;
WidgetMetadata = {
  id: "forward.auto.danmu2",
  title: "\u81EA\u52A8\u94FE\u63A5\u5F39\u5E55v2",
  version: wv,
  requiredVersion: "0.0.2",
  description: "\u81EA\u52A8\u83B7\u53D6\u64AD\u653E\u94FE\u63A5\u5E76\u4ECE\u670D\u52A1\u5668\u83B7\u53D6\u5F39\u5E55\u3010\u4E94\u6298\u7801\uFF1ACHEAP.5;\u4E03\u6298\u7801\uFF1ACHEAP\u3011",
  author: "huangxd",
  site: "https://github.com/huangxd-/ForwardWidgets",
  globalParams: [
    // 源配置
    {
      name: "sourceOrder",
      title: "\u6E90\u6392\u5E8F\u914D\u7F6E\uFF0C\u9ED8\u8BA4'360,vod,renren,hanjutv'\uFF0C\u53EF\u9009['360', 'vod', 'tmdb', 'douban', 'tencent', 'youku', 'iqiyi', 'imgo', 'bilibili', 'sohu', 'leshi', 'xigua', 'renren', 'hanjutv', 'bahamut', 'dandan', 'custom']",
      type: "input",
      placeholders: [
        {
          title: "\u914D\u7F6E1",
          value: "tencent,iqiyi,imgo,bilibili,youku,renren,hanjutv"
        },
        {
          title: "\u914D\u7F6E2",
          value: "douban,360,vod,renren,hanjutv"
        },
        {
          title: "\u914D\u7F6E3",
          value: "360,vod,renren,hanjutv"
        },
        {
          title: "\u914D\u7F6E4",
          value: "vod,360,renren,hanjutv,bahamut,dandan"
        }
      ]
    },
    {
      name: "otherServer",
      title: "\u7B2C\u4E09\u65B9\u5F39\u5E55\u670D\u52A1\u5668\uFF0C\u9ED8\u8BA4https://api.danmu.icu",
      type: "input",
      placeholders: [
        {
          title: "icu",
          value: "https://api.danmu.icu"
        },
        {
          title: "lyz05",
          value: "https://fc.lyz05.cn"
        },
        {
          title: "hls",
          value: "https://dmku.hls.one"
        },
        {
          title: "678",
          value: "https://se.678.ooo"
        },
        {
          title: "56uxi",
          value: "https://danmu.56uxi.com"
        },
        {
          title: "lxlad",
          value: "https://dm.lxlad.com"
        }
      ]
    },
    {
      name: "customSourceApiUrl",
      title: "\u81EA\u5B9A\u4E49\u5F39\u5E55\u6E90API\u5730\u5740\uFF0C\u9ED8\u8BA4\u4E3A\u7A7A\uFF0C\u914D\u7F6E\u540E\u8FD8\u9700\u5728SOURCE_ORDER\u6DFB\u52A0custom\u6E90",
      type: "input",
      placeholders: [
        {
          title: "\u81EA\u5B9A\u4E49",
          value: ""
        }
      ]
    },
    {
      name: "vodServers",
      title: "VOD\u7AD9\u70B9\u914D\u7F6E\uFF0C\u683C\u5F0F\uFF1A\u540D\u79F0@URL,\u540D\u79F0@URL\uFF0C\u9ED8\u8BA4\u91D1\u8749'https://zy.jinchancaiji.com,789@https://www.caiji.cyou,\u542C\u98CE@https://gctf.tfdh.top'",
      type: "input",
      placeholders: [
        {
          title: "\u914D\u7F6E1",
          value: "\u91D1\u8749@https://zy.jinchancaiji.com,789@https://www.caiji.cyou,\u542C\u98CE@https://gctf.tfdh.top"
        },
        {
          title: "\u914D\u7F6E2",
          value: "\u91D1\u8749@https://zy.jinchancaiji.com"
        },
        {
          title: "\u914D\u7F6E3",
          value: "\u91D1\u8749@https://zy.jinchancaiji.com,789@https://www.caiji.cyou"
        },
        {
          title: "\u914D\u7F6E4",
          value: "\u91D1\u8749@https://zy.jinchancaiji.com,\u542C\u98CE@https://gctf.tfdh.top"
        }
      ]
    },
    {
      name: "vodReturnMode",
      title: "VOD\u8FD4\u56DE\u6A21\u5F0F\uFF1Aall\uFF08\u6240\u6709\u7AD9\u70B9\uFF09\u6216 fastest\uFF08\u6700\u5FEB\u7684\u7AD9\u70B9\uFF09\uFF0C\u9ED8\u8BA4fastest",
      type: "input",
      placeholders: [
        {
          title: "fastest",
          value: "fastest"
        },
        {
          title: "all",
          value: "all"
        }
      ]
    },
    {
      name: "vodRequestTimeout",
      title: "VOD\u8BF7\u6C42\u8D85\u65F6\u65F6\u95F4\uFF0C\u9ED8\u8BA410000",
      type: "input",
      placeholders: [
        {
          title: "10s",
          value: "10000"
        },
        {
          title: "15s",
          value: "15000"
        },
        {
          title: "20s",
          value: "20000"
        }
      ]
    },
    {
      name: "bilibiliCookie",
      title: "B\u7AD9Cookie\uFF08\u586B\u5165\u540E\u80FD\u6293\u53D6b\u7AD9\u5B8C\u6574\u5F39\u5E55\uFF09",
      type: "input",
      placeholders: [
        {
          title: "\u793A\u4F8B",
          value: "SESSDATA=xxxx"
        }
      ]
    },
    // 匹配配置
    {
      name: "platformOrder",
      title: "\u5E73\u53F0\u4F18\u9009\u914D\u7F6E\uFF0C\u53EF\u9009['qiyi', 'bilibili1', 'imgo', 'youku', 'qq', 'sohu', 'leshi, 'xigua', 'renren', 'hanjutv', 'bahamut', 'dandan', 'custom']",
      type: "input",
      placeholders: [
        {
          title: "\u914D\u7F6E1",
          value: "qq,qiyi,imgo,bilibili1,youku,sohu,leshi,xigua,renren,hanjutv,bahamut,dandan,custom"
        },
        {
          title: "\u914D\u7F6E2",
          value: "bilibili1,qq,qiyi,imgo"
        },
        {
          title: "\u914D\u7F6E3",
          value: "dandan,bilibili1,bahamut"
        },
        {
          title: "\u914D\u7F6E4",
          value: "imgo,qiyi,qq,youku,bilibili1"
        }
      ]
    },
    {
      name: "episodeTitleFilter",
      title: "\u5267\u96C6\u6807\u9898\u8FC7\u6EE4\u89C4\u5219",
      type: "input",
      placeholders: [
        {
          title: "\u793A\u4F8B",
          value: "(\u7279\u522B|\u60CA\u559C|\u7EB3\u51C9)?\u4F01\u5212|\u5408\u4F19\u4EBA\u624B\u8BB0|\u8D85\u524D(\u8425\u4E1A|vlog)?|\u901F\u89C8|vlog|reaction|\u7EAF\u4EAB|\u52A0\u66F4(\u7248|\u7BC7)?|\u62A2\u5148(\u770B|\u7248|\u96C6|\u7BC7)?|\u62A2\u9C9C|\u9884\u544A|\u82B1\u7D6E(\u72EC\u5BB6)?|\u7279\u8F91|\u5F69\u86CB|\u4E13\u8BBF|\u5E55\u540E(\u6545\u4E8B|\u82B1\u7D6E|\u72EC\u5BB6)?|\u76F4\u64AD(\u966A\u770B|\u56DE\u987E)?|\u672A\u64AD(\u7247\u6BB5)?|\u884D\u751F|\u756A\u5916|\u4F1A\u5458(\u4E13\u4EAB|\u52A0\u957F|\u5C0A\u4EAB|\u4E13\u5C5E|\u7248)?|\u7247\u82B1|\u7CBE\u534E|\u770B\u70B9|\u901F\u770B|\u89E3\u8BFB|\u5F71\u8BC4|\u89E3\u8BF4|\u5410\u69FD|\u76D8\u70B9|\u62CD\u6444\u82B1\u7D6E|\u5236\u4F5C\u82B1\u7D6E|\u5E55\u540E\u82B1\u7D6E|\u672A\u64AD\u82B1\u7D6E|\u72EC\u5BB6\u82B1\u7D6E|\u82B1\u7D6E\u7279\u8F91|\u5148\u5BFC\u9884\u544A|\u7EC8\u6781\u9884\u544A|\u6B63\u5F0F\u9884\u544A|\u5B98\u65B9\u9884\u544A|\u5F69\u86CB\u7247\u6BB5|\u5220\u51CF\u7247\u6BB5|\u672A\u64AD\u7247\u6BB5|\u756A\u5916\u5F69\u86CB|\u7CBE\u5F69\u7247\u6BB5|\u7CBE\u5F69\u770B\u70B9|\u7CBE\u5F69\u56DE\u987E|\u7CBE\u5F69\u96C6\u9526|\u770B\u70B9\u89E3\u6790|\u770B\u70B9\u9884\u544A|NG\u955C\u5934|NG\u82B1\u7D6E|\u756A\u5916\u7BC7|\u756A\u5916\u7279\u8F91|\u5236\u4F5C\u7279\u8F91|\u62CD\u6444\u7279\u8F91|\u5E55\u540E\u7279\u8F91|\u5BFC\u6F14\u7279\u8F91|\u6F14\u5458\u7279\u8F91|\u7247\u5C3E\u66F2|\u63D2\u66F2|\u9AD8\u5149\u56DE\u987E|\u80CC\u666F\u97F3\u4E50|OST|\u97F3\u4E50MV|\u6B4C\u66F2MV|\u524D\u5B63\u56DE\u987E|\u5267\u60C5\u56DE\u987E|\u5F80\u671F\u56DE\u987E|\u5185\u5BB9\u603B\u7ED3|\u5267\u60C5\u76D8\u70B9|\u7CBE\u9009\u5408\u96C6|\u526A\u8F91\u5408\u96C6|\u6DF7\u526A\u89C6\u9891|\u72EC\u5BB6\u4E13\u8BBF|\u6F14\u5458\u8BBF\u8C08|\u5BFC\u6F14\u8BBF\u8C08|\u4E3B\u521B\u8BBF\u8C08|\u5A92\u4F53\u91C7\u8BBF|\u53D1\u5E03\u4F1A\u91C7\u8BBF|\u91C7\u8BBF|\u966A\u770B(\u8BB0)?|\u8BD5\u770B\u7248|\u77ED\u5267|\u7CBE\u7F16|Plus|\u72EC\u5BB6\u7248|\u7279\u522B\u7248|\u77ED\u7247|\u53D1\u5E03\u4F1A|\u89E3\u5FE7\u5C40|\u8D70\u5FC3\u5C40|\u706B\u9505\u5C40|\u5DC5\u5CF0\u65F6\u523B|\u575E\u91CC\u90FD\u77E5\u9053|\u798F\u6301\u76EE\u6807\u575E\u6C11|.{3,}\u7BC7|(?!.*(\u5165\u5C40|\u7834\u51B0\u5C40|\u505A\u5C40)).{2,}\u5C40|\u89C2\u5BDF\u5BA4|\u4E0A\u73ED\u90A3\u70B9\u4E8B\u513F|\u5468top|\u8D5B\u6BB5|\u76F4\u62CD|REACTION|VLOG|\u5168\u7EAA\u5F55|\u5F00\u64AD|\u5148\u5BFC|\u603B\u5BA3|\u5C55\u6F14|\u96C6\u9526|\u65C5\u884C\u65E5\u8BB0|\u7CBE\u5F69\u5206\u4EAB|\u5267\u60C5\u63ED\u79D8"
        }
      ]
    },
    {
      name: "enableEpisodeFilter",
      title: "\u96C6\u6807\u9898\u8FC7\u6EE4\u5F00\u5173\uFF0C\u662F\u5426\u5728\u624B\u52A8\u9009\u62E9\u63A5\u53E3\u4E2D\u542F\u7528\u96C6\u6807\u9898\u8FC7\u6EE4\uFF0C\u9ED8\u8BA4false",
      type: "input",
      placeholders: [
        {
          title: "false",
          value: "false"
        },
        {
          title: "true",
          value: "true"
        }
      ]
    },
    {
      name: "strictTitleMatch",
      title: "\u4E25\u683C\u6807\u9898\u5339\u914D\u6A21\u5F0F\uFF0C\u9ED8\u8BA4false",
      type: "input",
      placeholders: [
        {
          title: "false",
          value: "false"
        },
        {
          title: "true",
          value: "true"
        }
      ]
    },
    {
      name: "titleMappingTable",
      title: '\u5267\u540D\u6620\u5C04\u8868\uFF0C\u7528\u4E8E\u81EA\u52A8\u5339\u914D\u65F6\u66FF\u6362\u6807\u9898\u8FDB\u884C\u641C\u7D22\uFF0C\u683C\u5F0F\uFF1A\u539F\u59CB\u6807\u9898->\u6620\u5C04\u6807\u9898;\u539F\u59CB\u6807\u9898->\u6620\u5C04\u6807\u9898;... \uFF0C\u4F8B\u5982\uFF1A"\u5510\u671D\u8BE1\u4E8B\u5F55->\u5510\u671D\u8BE1\u4E8B\u5F55\u4E4B\u897F\u884C;\u56FD\u8272\u82B3\u534E->\u9526\u7EE3\u82B3\u534E"',
      type: "input",
      placeholders: [
        {
          title: "\u6620\u5C04\u8868\u793A\u4F8B",
          value: "\u539F\u59CB\u6807\u9898->\u6620\u5C04\u6807\u9898;\u539F\u59CB\u6807\u9898->\u6620\u5C04\u6807\u9898"
        }
      ]
    },
    // 弹幕配置
    {
      name: "blockedWords",
      title: "\u5C4F\u853D\u8BCD\u5217\u8868",
      type: "input",
      placeholders: [
        {
          title: "\u793A\u4F8B",
          value: "/.{20,}/,/^\\d{2,4}[-/.]\\d{1,2}[-/.]\\d{1,2}([\u65E5\u53F7.]*)?$/,/^(?!\u54C8+$)([a-zA-Z\u4E00-\u9FA5])\\1{2,}/,/[0-9]+\\.*[0-9]*\\s*(w|\u4E07)+\\s*(\\+|\u4E2A|\u4EBA|\u5728\u770B)+/,/^[a-z]{6,}$/,/^(?:qwertyuiop|asdfghjkl|zxcvbnm)$/,/^\\d{5,}$/,/^(\\d)\\1{2,}$/,/\\d{1,4}/,/(20[0-3][0-9])/,/(0?[1-9]|1[0-2])\u6708/,/\\d{1,2}[.-]\\d{1,2}/,/[@#&$%^*+\\|/\\-_=<>\xB0\u25C6\u25C7\u25A0\u25A1\u25CF\u25CB\u2605\u2606\u25BC\u25B2\u2665\u2666\u2660\u2663\u2460\u2461\u2462\u2463\u2464\u2465\u2466\u2467\u2468\u2469]/,/[\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\\d]+\u5237/,/\u7B2C[\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\\d]+/,/(\u5168\u4F53\u6210\u5458|\u62A5\u5230|\u62A5\u9053|\u6765\u5566|\u7B7E\u5230|\u5237|\u6253\u5361|\u6211\u5728|\u6765\u4E86|\u8003\u53E4|\u7231\u4E86|\u6316\u575F|\u7559\u5FF5|\u4F60\u597D|\u56DE\u6765|\u54E6\u54E6|\u91CD\u6E29|\u590D\u4E60|\u91CD\u5237|\u518D\u770B|\u5728\u770B|\u524D\u6392|\u6C99\u53D1|\u6709\u4EBA\u770B|\u677F\u51F3|\u672B\u6392|\u6211\u8001\u5A46|\u6211\u8001\u516C|\u6485\u4E86|\u540E\u6392|\u5468\u76EE|\u91CD\u770B|\u5305\u517B|DVD|\u540C\u4E0A|\u540C\u6837|\u6211\u4E5F\u662F|\u4FFA\u4E5F|\u7B97\u6211|\u7231\u8C46|\u6211\u5BB6\u7231\u8C46|\u6211\u5BB6\u54E5\u54E5|\u52A0\u6211|\u4E09\u8FDE|\u5E01|\u65B0\u4EBA|\u5165\u5751|\u8865\u5267|\u51B2\u4E86|\u786C\u4E86|\u770B\u5B8C|\u8214\u5C4F|\u4E07\u4EBA|\u725B\u903C|\u715E\u7B14|\u50BB\u903C|\u5367\u69FD|tm|\u554A\u8FD9|\u54C7\u54E6)/"
        }
      ]
    },
    {
      name: "groupMinute",
      title: "\u5408\u5E76\u53BB\u91CD\u5206\u949F\u6570\uFF0C\u8868\u793A\u6309n\u5206\u949F\u5206\u7EC4\u540E\u5BF9\u5F39\u5E55\u5408\u5E76\u53BB\u91CD",
      type: "input",
      placeholders: [
        {
          title: "1\u5206\u949F",
          value: "1"
        },
        {
          title: "2\u5206\u949F",
          value: "2"
        },
        {
          title: "5\u5206\u949F",
          value: "5"
        },
        {
          title: "10\u5206\u949F",
          value: "10"
        },
        {
          title: "20\u5206\u949F",
          value: "20"
        },
        {
          title: "30\u5206\u949F",
          value: "30"
        }
      ]
    },
    {
      name: "danmuLimit",
      title: "\u5F39\u5E55\u6570\u91CF\u9650\u5236\uFF0C\u5355\u4F4D\u4E3Ak\uFF0C\u5373\u5343\uFF1A\u9ED8\u8BA40\uFF0C\u8868\u793A\u4E0D\u9650\u5236\u5F39\u5E55\u6570",
      type: "input",
      placeholders: [
        {
          title: "\u4E0D\u9650\u5236",
          value: "0"
        },
        {
          title: "10k",
          value: "10"
        },
        {
          title: "8k",
          value: "8"
        },
        {
          title: "6k",
          value: "6"
        },
        {
          title: "4k",
          value: "4"
        },
        {
          title: "2k",
          value: "2"
        }
      ]
    },
    {
      name: "danmuSimplifiedTraditional",
      title: "\u5F39\u5E55\u7B80\u7E41\u4F53\u8F6C\u6362\u8BBE\u7F6E\uFF1Adefault\uFF08\u9ED8\u8BA4\u4E0D\u8F6C\u6362\uFF09\u3001simplified\uFF08\u7E41\u8F6C\u7B80\uFF09\u3001traditional\uFF08\u7B80\u8F6C\u7E41\uFF09",
      type: "input",
      placeholders: [
        {
          title: "\u4E0D\u8F6C\u6362",
          value: "default"
        },
        {
          title: "\u7E41\u8F6C\u7B80",
          value: "simplified"
        },
        {
          title: "\u7B80\u8F6C\u7E41",
          value: "traditional"
        }
      ]
    },
    {
      name: "convertTopBottomToScroll",
      title: "\u9876\u90E8/\u5E95\u90E8\u5F39\u5E55\u8F6C\u6362\u4E3A\u6D6E\u52A8\u5F39\u5E55\uFF0C\u9ED8\u8BA4false",
      type: "input",
      placeholders: [
        {
          title: "false",
          value: "false"
        },
        {
          title: "true",
          value: "true"
        }
      ]
    },
    {
      name: "convertColor",
      title: "\u5F39\u5E55\u8F6C\u6362\u989C\u8272\u914D\u7F6E\uFF0C\u9ED8\u8BA4default\uFF08\u4E0D\u8F6C\u6362\uFF09",
      type: "input",
      placeholders: [
        {
          title: "\u4E0D\u8F6C\u6362",
          value: "default"
        },
        {
          title: "\u767D\u8272",
          value: "white"
        },
        {
          title: "\u968F\u673A\u989C\u8272(\u5305\u62EC\u767D\u8272)",
          value: "color"
        }
      ]
    },
    // 系统配置
    {
      name: "proxyUrl",
      title: "\u4EE3\u7406/\u53CD\u4EE3\u5730\u5740\uFF0C\u76EE\u524D\u53EA\u5BF9\u5DF4\u54C8\u59C6\u7279\u548CTMDB API\u751F\u6548",
      type: "input",
      placeholders: [
        {
          title: "\u5982\u679C\u6DFB\u52A0\u4E86\u5DF4\u54C8\u6E90\u4E14\u8BBF\u95EE\u4E0D\u4E86\uFF0C\u8BF7\u586B\u5199",
          value: ""
        },
        {
          title: "\u6B63\u5E38\u4EE3\u7406\u793A\u4F8B",
          value: "http://127.0.0.1:7890"
        },
        {
          title: "\u4E07\u80FD\u53CD\u4EE3\u793A\u4F8B",
          value: "@http://127.0.0.1"
        },
        {
          title: "\u7279\u5B9A\u53CD\u4EE3\u793A\u4F8B1",
          value: "bahamut@http://127.0.0.1"
        },
        {
          title: "\u7279\u5B9A\u53CD\u4EE3\u793A\u4F8B2",
          value: "tmdb@http://127.0.0.1"
        }
      ]
    },
    {
      name: "tmdbApiKey",
      title: "TMDB API\u5BC6\u94A5\uFF0C\u76EE\u524D\u53EA\u5BF9\u5DF4\u54C8\u59C6\u7279\u751F\u6548\uFF0C\u914D\u7F6E\u540E\u5E76\u884C\u4ECETMDB\u83B7\u53D6\u65E5\u8BED\u539F\u540D\u641C\u7D22\u5DF4\u54C8",
      type: "input",
      placeholders: [
        {
          title: "\u5982\u679C\u6DFB\u52A0\u4E86\u5DF4\u54C8\u6E90\uFF0C\u60F3\u81EA\u52A8\u83B7\u53D6\u65E5\u8BED\u539F\u540D\u641C\u7D22\u5DF4\u54C8\uFF0C\u8BF7\u586B\u5199",
          value: ""
        },
        {
          title: "\u793A\u4F8B",
          value: "a1b2xxxxxxxxxxxxxxxxxxx"
        }
      ]
    }
  ],
  modules: [
    {
      id: "searchDanmu",
      title: "\u641C\u7D22\u5F39\u5E55",
      functionName: "searchDanmu",
      type: "danmu",
      params: []
    },
    {
      id: "getDetail",
      title: "\u83B7\u53D6\u8BE6\u60C5",
      functionName: "getDetailById",
      type: "danmu",
      params: []
    },
    {
      id: "getComments",
      title: "\u83B7\u53D6\u5F39\u5E55",
      functionName: "getCommentsById",
      type: "danmu",
      params: []
    },
    {
      id: "getDanmuWithSegmentTime",
      title: "\u83B7\u53D6\u6307\u5B9A\u65F6\u523B\u5F39\u5E55",
      functionName: "getDanmuWithSegmentTime",
      type: "danmu",
      params: []
    }
  ]
};
if (typeof window !== "undefined") {
  window.WidgetMetadata = WidgetMetadata;
}
var globals2;
async function initGlobals(sourceOrder, otherServer, customSourceApiUrl, vodServers, vodReturnMode, vodRequestTimeout, bilibiliCookie, platformOrder, episodeTitleFilter, enableEpisodeFilter, strictTitleMatch2, titleMappingTable, blockedWords, groupMinute, danmuLimit, danmuSimplifiedTraditional, convertTopBottomToScroll, convertColor, proxyUrl, tmdbApiKey) {
  const env = {};
  if (sourceOrder !== void 0) env.SOURCE_ORDER = sourceOrder;
  if (otherServer !== void 0) env.OTHER_SERVER = otherServer;
  if (customSourceApiUrl !== void 0) env.CUSTOM_SOURCE_API_URL = customSourceApiUrl;
  if (vodServers !== void 0) env.VOD_SERVERS = vodServers;
  if (vodReturnMode !== void 0) env.VOD_RETURN_MODE = vodReturnMode;
  if (vodRequestTimeout !== void 0) env.VOD_REQUEST_TIMEOUT = vodRequestTimeout;
  if (bilibiliCookie !== void 0) env.BILIBILI_COOKIE = bilibiliCookie;
  if (platformOrder !== void 0) env.PLATFORM_ORDER = platformOrder;
  if (episodeTitleFilter !== void 0) env.EPISODE_TITLE_FILTER = episodeTitleFilter;
  if (enableEpisodeFilter !== void 0) env.ENABLE_EPISODE_FILTER = enableEpisodeFilter;
  if (strictTitleMatch2 !== void 0) env.STRICT_TITLE_MATCH = strictTitleMatch2;
  if (titleMappingTable !== void 0) env.TITLE_MAPPING_TABLE = titleMappingTable;
  if (blockedWords !== void 0) env.BLOCKED_WORDS = blockedWords;
  if (groupMinute !== void 0) env.GROUP_MINUTE = groupMinute;
  if (danmuLimit !== void 0) env.DANMU_LIMIT = danmuLimit;
  if (danmuSimplifiedTraditional !== void 0) env.DANMU_SIMPLIFIED_TRADITIONAL = danmuSimplifiedTraditional;
  if (convertTopBottomToScroll !== void 0) env.CONVERT_TOP_BOTTOM_TO_SCROLL = convertTopBottomToScroll;
  if (convertColor !== void 0) env.CONVERT_COLOR = convertColor;
  if (proxyUrl !== void 0) env.PROXY_URL = proxyUrl;
  if (tmdbApiKey !== void 0) env.TMDB_API_KEY = tmdbApiKey;
  if (!globals2) {
    globals2 = Globals.init(env);
  }
  await getCaches();
  return globals2;
}
async function getCaches() {
  if (globals2.animes.length === 0) {
    log("info", "getCaches start.");
    const [kv_animes, kv_episodeIds, kv_episodeNum, kv_logBuffer, kv_lastSelectMap] = await Promise.all([
      Widget.storage.get("animes"),
      Widget.storage.get("episodeIds"),
      Widget.storage.get("episodeNum"),
      Widget.storage.get("logBuffer"),
      Widget.storage.get("lastSelectMap")
    ]);
    globals2.animes = kv_animes ? typeof kv_animes === "string" ? JSON.parse(kv_animes) : kv_animes : globals2.animes;
    globals2.episodeIds = kv_episodeIds ? typeof kv_episodeIds === "string" ? JSON.parse(kv_episodeIds) : kv_episodeIds : globals2.episodeIds;
    globals2.episodeNum = kv_episodeNum ? typeof kv_episodeNum === "string" ? JSON.parse(kv_episodeNum) : kv_episodeNum : globals2.episodeNum;
    globals2.logBuffer = kv_logBuffer ? typeof kv_logBuffer === "string" ? JSON.parse(kv_logBuffer) : kv_logBuffer : globals2.logBuffer;
    if (kv_lastSelectMap) {
      const parsed = typeof kv_lastSelectMap === "string" ? JSON.parse(kv_lastSelectMap) : kv_lastSelectMap;
      globals2.lastSelectMap = new Map(
        Array.isArray(parsed) ? parsed : Object.entries(parsed)
      );
    }
  }
}
async function updateCaches() {
  log("info", "updateCaches start.");
  await Promise.all([
    Widget.storage.set("animes", globals2.animes),
    Widget.storage.set("episodeIds", globals2.episodeIds),
    Widget.storage.set("episodeNum", globals2.episodeNum),
    Widget.storage.set("logBuffer", globals2.logBuffer),
    Widget.storage.set("lastSelectMap", JSON.stringify(Object.fromEntries(globals2.lastSelectMap)))
  ]);
}
var PREFIX_URL = "http://localhost:9321";
async function searchDanmu(params) {
  const {
    tmdbId,
    type,
    title,
    season,
    link,
    videoUrl,
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch: strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  } = params;
  await initGlobals(
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  );
  const response = await searchAnime(new URL(`${PREFIX_URL}/api/v2/search/anime?keyword=${title}`));
  const resJson = await response.json();
  const curAnimes = resJson.animes;
  let animes = [];
  if (curAnimes && curAnimes.length > 0) {
    animes = curAnimes;
    if (season) {
      const matchedAnimes = [];
      const nonMatchedAnimes = [];
      animes.forEach((anime) => {
        if (matchSeason(anime, title, season) && !(anime.animeTitle.includes("\u7535\u5F71") || anime.animeTitle.includes("movie"))) {
          matchedAnimes.push(anime);
        } else {
          nonMatchedAnimes.push(anime);
        }
      });
      matchedAnimes.sort((a, b) => {
        const aLength = a.animeTitle.split("(")[0].length;
        const bLength = b.animeTitle.split("(")[0].length;
        return aLength - bLength;
      });
      animes = [...matchedAnimes, ...nonMatchedAnimes];
    } else {
      const matchedAnimes = [];
      const nonMatchedAnimes = [];
      animes.forEach((anime) => {
        if (anime.animeTitle.includes("\u7535\u5F71") || anime.animeTitle.includes("movie")) {
          matchedAnimes.push(anime);
        } else {
          nonMatchedAnimes.push(anime);
        }
      });
      matchedAnimes.sort((a, b) => {
        const aLength = a.animeTitle.split("(")[0].length;
        const bLength = b.animeTitle.split("(")[0].length;
        return aLength - bLength;
      });
      animes = [...matchedAnimes, ...nonMatchedAnimes];
    }
  }
  log("info", "animes: ", animes);
  await updateCaches();
  return {
    animes
  };
}
async function getDetailById(params) {
  const {
    animeId,
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch: strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  } = params;
  await initGlobals(
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  );
  const response = await getBangumi(`${PREFIX_URL}/api/v2/bangumi/${animeId}`);
  const resJson = await response.json();
  log("info", "bangumi", resJson);
  await updateCaches();
  return resJson.bangumi.episodes;
}
async function getCommentsById(params) {
  const {
    commentId,
    link,
    videoUrl,
    season,
    episode,
    tmdbId,
    type,
    title,
    segmentTime,
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch: strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  } = params;
  await initGlobals(
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  );
  if (commentId) {
    const storeKey = season && episode ? `${tmdbId}.${season}.${episode}` : `${tmdbId}`;
    const commentIdKey = `${storeKey}.${commentId}`;
    const segmentList = Widget.storage.get(storeKey);
    const lastCommentId = Widget.storage.get(commentIdKey);
    log("info", "storeKey:", storeKey);
    log("info", "commentIdKey:", commentIdKey);
    log("info", "commentId:", commentId);
    log("info", "lastCommentId:", lastCommentId);
    log("info", "segmentList:", segmentList);
    if (lastCommentId === commentId && segmentList) {
      return await getDanmuWithSegmentTime({
        segmentTime,
        tmdbId,
        season,
        episode,
        otherServer,
        customSourceApiUrl,
        vodServers,
        bilibiliCookie,
        sourceOrder,
        blockedWords,
        groupMinute,
        vodReturnMode,
        vodRequestTimeout,
        platformOrder,
        episodeTitleFilter,
        enableEpisodeFilter,
        strictTitleMatch: strictTitleMatch2,
        titleMappingTable,
        danmuLimit,
        danmuSimplifiedTraditional,
        convertTopBottomToScroll,
        convertColor,
        proxyUrl,
        tmdbApiKey
      });
    } else {
      Widget.storage.remove(storeKey);
      Widget.storage.remove(commentIdKey);
    }
    const response = await getComment(`${PREFIX_URL}/api/v2/comment/${commentId}`, "json", true);
    const resJson = await response.json();
    log("info", "segmentList:", resJson.comments.segmentList);
    Widget.storage.set(storeKey, resJson.comments.segmentList);
    Widget.storage.set(commentIdKey, commentId);
    console.log("segmentList", resJson.comments.segmentList);
    await updateCaches();
    return resJson.comments.segmentList;
  }
  return null;
}
async function getDanmuWithSegmentTime(params) {
  const {
    segmentTime,
    tmdbId,
    season,
    episode,
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch: strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  } = params;
  await initGlobals(
    sourceOrder,
    otherServer,
    customSourceApiUrl,
    vodServers,
    vodReturnMode,
    vodRequestTimeout,
    bilibiliCookie,
    platformOrder,
    episodeTitleFilter,
    enableEpisodeFilter,
    strictTitleMatch2,
    titleMappingTable,
    blockedWords,
    groupMinute,
    danmuLimit,
    danmuSimplifiedTraditional,
    convertTopBottomToScroll,
    convertColor,
    proxyUrl,
    tmdbApiKey
  );
  const storeKey = season && episode ? `${tmdbId}.${season}.${episode}` : `${tmdbId}`;
  const segmentList = Widget.storage.get(storeKey);
  if (segmentList) {
    const segment = segmentList.find((item) => {
      const start2 = Number(item.segment_start);
      const end2 = Number(item.segment_end);
      const time = Number(segmentTime);
      return time >= start2 && time < end2;
    });
    log("info", "segment:", segment);
    const response = await getSegmentComment(segment);
    const resJson = await response.json();
    await updateCaches();
    return resJson;
  }
  return null;
}

