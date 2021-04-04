/*!
 * name: vue-cnzz-analytics
 * version: v2.1.0
 * author: chengpeiquan
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.cnzzAnalytics = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __spreadArray(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

      return to;
    }

    var CNZZ = (function () {
        function CNZZ(siteId, isDebug) {
            if (siteId === void 0) { siteId = 0; }
            if (isDebug === void 0) { isDebug = false; }
            this.siteId = siteId;
            this.isDebug = isDebug;
        }
        CNZZ.prototype.init = function () {
            window._czc = window._czc ? window._czc : [];
            var SCRIPT = document.createElement('script');
            SCRIPT['async'] = true;
            SCRIPT['src'] = "https://s9.cnzz.com/z_stat.php?id=" + this.siteId + "&web_id=" + this.siteId;
            document.querySelector('head').appendChild(SCRIPT);
            if (this.isDebug) {
                console.log("[vue-cnzz-analytics] siteId load done.\nsiteId:    " + this.siteId);
            }
        };
        CNZZ.prototype.setAccount = function () {
            window._czc.push(['_setAccount', this.siteId]);
        };
        CNZZ.prototype.trackPageview = function (pageUrl, fromUrl) {
            if (!pageUrl || typeof pageUrl !== 'string') {
                pageUrl = '/';
            }
            if (pageUrl.includes('http')) {
                var PAGE_CUT = pageUrl.split('/');
                var HOST_NAME = PAGE_CUT[0] + "//" + PAGE_CUT[2];
                pageUrl = pageUrl.replace(HOST_NAME, '');
            }
            if (!fromUrl || (fromUrl && typeof fromUrl !== 'string')) {
                fromUrl = '';
            }
            if (typeof fromUrl === 'string' && !fromUrl.includes('http')) {
                fromUrl = '';
            }
            this.setAccount();
            if (fromUrl) {
                window._czc.push(['_trackPageview', pageUrl, fromUrl]);
            }
            else {
                window._czc.push(['_trackPageview', pageUrl]);
            }
            if (this.isDebug) {
                console.log("[vue-cnzz-analytics] track pv done.\nsiteId:    " + this.siteId + "\npageUrl:   " + pageUrl + "\nfromUrl:   " + fromUrl);
            }
        };
        CNZZ.prototype.trackEvent = function (category, action, label, value, nodeId) {
            if (typeof category !== 'string' || typeof action !== 'string' || !category || !action) {
                throw new Error('[vue-cnzz-analytics] Missing necessary category and operation information, and must be of type string.');
            }
            if (!label || typeof label !== 'string') {
                label = '';
            }
            if (!Number(value)) {
                value = 0;
            }
            if (!nodeId || typeof nodeId !== 'string') {
                nodeId = '';
            }
            this.setAccount();
            if (nodeId) {
                window._czc.push(['_trackEvent', category, action, label, value, nodeId]);
            }
            else {
                window._czc.push(['_trackEvent', category, action, label, value]);
            }
            if (this.isDebug) {
                console.log("[vue-cnzz-analytics] track event done.\nsiteId:   " + this.siteId + "\ncategory: " + category + "\naction:   " + action + "\nlabel:    " + label + "\nvalue:    " + value + "\nnodeId:   " + nodeId);
            }
        };
        return CNZZ;
    }());

    var PushCNZZ = (function () {
        function PushCNZZ(siteIdList, isDebug) {
            this.siteIdList = __spreadArray([], siteIdList);
            this.isDebug = isDebug;
        }
        PushCNZZ.prototype.init = function () {
            var _this = this;
            this.siteIdList.forEach(function (siteId) {
                var SITE = new CNZZ(siteId, _this.isDebug);
                SITE.init();
            });
        };
        PushCNZZ.prototype.pv = function (pageUrl, fromUrl) {
            var _this = this;
            this.siteIdList.forEach(function (siteId) {
                var SITE = new CNZZ(siteId, _this.isDebug);
                SITE.trackPageview(pageUrl, fromUrl);
            });
        };
        PushCNZZ.prototype.event = function (category, action, label, value, nodeId) {
            var _this = this;
            this.siteIdList.forEach(function (siteId) {
                var SITE = new CNZZ(siteId, _this.isDebug);
                SITE.trackEvent(category, action, label, value, nodeId);
            });
        };
        return PushCNZZ;
    }());

    var getVueVersion = function (Vue) {
        var version = 2;
        var VUE_VERSION = String(Vue.version);
        if (VUE_VERSION.slice(0, 2) === '2.') {
            version = 2;
        }
        if (VUE_VERSION.slice(0, 2) === '3.') {
            version = 3;
        }
        return version;
    };

    var __GLOBAL__ = {
        pushCNZZ: {}
    };
    function usePush() {
        function pv(pageUrl, fromUrl) {
            return __GLOBAL__.pushCNZZ.pv(pageUrl, fromUrl);
        }
        function event(category, action, label, value, nodeId) {
            return __GLOBAL__.pushCNZZ.event(category, action, label, value, nodeId);
        }
        return {
            pv: pv,
            event: event
        };
    }
    function install(Vue, _a) {
        var router = _a.router, siteIdList = _a.siteIdList, _b = _a.isDebug, isDebug = _b === void 0 ? false : _b;
        if (typeof document === 'undefined' || typeof window === 'undefined') {
            return false;
        }
        if (!router) {
            throw new Error('[vue-cnzz-analytics] Must pass a Vue-Router instance to vue-cnzz-analytics.');
        }
        if (!siteIdList) {
            throw new Error('[vue-cnzz-analytics] Missing tracking domain ID, add at least one of cnzz analytics.');
        }
        var pushCNZZ = new PushCNZZ(siteIdList, isDebug);
        __GLOBAL__.pushCNZZ = pushCNZZ;
        var VUE_VERSION = getVueVersion(Vue) || 2;
        switch (VUE_VERSION) {
            case 2:
                Vue.prototype.$pushCNZZ = pushCNZZ;
                break;
            case 3:
                Vue.config.globalProperties.$pushCNZZ = pushCNZZ;
                break;
        }
        if (siteIdList && Array.isArray(siteIdList)) {
            pushCNZZ.init();
        }
        router.afterEach(function (to) {
            var PAGE_URL = window.location.href;
            pushCNZZ.pv(PAGE_URL);
        });
    }

    exports.default = install;
    exports.usePush = usePush;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue-cnzz-analytics.js.map
