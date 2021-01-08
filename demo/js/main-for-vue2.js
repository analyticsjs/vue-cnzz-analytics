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
 */
Vue.use(cnzzAnalytics, {
  router: router,
  siteIdList: [
    11111,
    22222,
    33333
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
      category: '',
      action: '',
      label: '',
      value: ''
    }
  },
  mounted () {
  },
  methods: {
    pv () {
      this.$pushCNZZ.pv(this.pageUrl);
    },
    event () {
      this.$pushCNZZ.event(
        this.category,
        this.action,
        this.label,
        this.value
      );
    }
  }
});