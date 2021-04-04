/**
 * 初始化路由
 * routes是来自 js/routes.js 里面的配置
 */
const router = new VueRouter({
  routes,
  linkActiveClass: 'cur',
  linkExactActiveClass: 'cur'
});


/**
 * 引入统计插件
 * @description 自 v2.1.0 版本开始，需要使用 .default 去激活插件
 */
Vue.use(cnzzAnalytics.default, {
  router: router,
  siteIdList: [
    11111,
    22222
  ],
  isDebug: true
});


/**
 * 初始化Vue
 */
const app = new Vue({
  el: '#app',
  router,
  data () {
    return {
      pageUrl: '',
      fromUrl: '',
      category: '',
      action: '',
      label: '',
      value: '',
      nodeId: '',

      // 也可以绑定一个钩子变量去使用
      cnzz: cnzzAnalytics.usePush()
    }
  },
  mounted () {
    this.cnzz.pv('/use-push-api/?from=mounted');
  },
  methods: {
    /**
     * 提交 pv
     * @description 支持两种推送方式
     */
    pv () {
      // 使用默认全局 API
      this.$pushCNZZ.pv(
        this.pageUrl,
        this.fromUrl
      );

      // 使用钩子 API
      // this.cnzz.pv(
      //   this.pageUrl,
      //   this.fromUrl
      // );
    },

    /**
     * 提交事件
     * @description 支持两种推送方式
     */
    event () {
      // 使用默认全局 API
      // this.$pushCNZZ.event(
      //   this.category,
      //   this.action,
      //   this.label,
      //   this.value,
      //   this.nodeId
      // );

      // 使用钩子 API
      this.cnzz.event(
        this.category,
        this.action,
        this.label,
        this.value,
        this.nodeId
      );
    }
  }
});
