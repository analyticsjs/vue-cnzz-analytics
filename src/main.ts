import PushCNZZ from '@m/pushCNZZ'
import getVueVersion from '@m/getVueVersion'

/**
 * 全局的数据
 */
const __GLOBAL__ = {
  pushCNZZ: {} as PushCNZZ
}

/**
 * 暴露 Hooks
 * @description 解决 Vue 3.0 使用全局变量很麻烦的问题
 * @example
 * import { usePush } from 'vue-cnzz-analytics'
 * const cnzz = usePush();
 * cnzz.pv('/');
 */
export function usePush () {
  // 提交 pv
  function pv (pageUrl: string, fromUrl?: string) {
    return __GLOBAL__.pushCNZZ.pv(pageUrl, fromUrl);
  }

  // 提交事件
  function event (category: string, action: string, label: string, value: number, nodeId: string) {
    return __GLOBAL__.pushCNZZ.event(category, action, label, value, nodeId);
  }

  return {
    pv,
    event
  }
}

/**
 * 定义插件
 */
export default function install (Vue: Vue, { router, siteIdList, isDebug = false }: Partial<Options>) {

  /**
   * 一些环境和参数的检查
   */
  if ( typeof document === 'undefined' || typeof window === 'undefined' ) {
    return false;
  }

  if ( !router ) {
    throw new Error('[vue-cnzz-analytics] Must pass a Vue-Router instance to vue-cnzz-analytics.');
  }

  if ( !siteIdList ) {
    throw new Error('[vue-cnzz-analytics] Missing tracking domain ID, add at least one of cnzz analytics.');
  }

  /**
   * 挂载推送的方法
   */
  const pushCNZZ = new PushCNZZ(siteIdList, isDebug);
  __GLOBAL__.pushCNZZ = pushCNZZ;

  /**
   * 挂载全局变量到 Vue 上
   * 获取Vue版本（获取失败则默认为2）
   */
  const VUE_VERSION: number = getVueVersion(Vue) || 2;
  switch (VUE_VERSION) {
    case 2:
      Vue.prototype.$pushCNZZ = pushCNZZ;
      break;
    case 3:
      Vue.config.globalProperties.$pushCNZZ = pushCNZZ;
      break;
  }

  /**
   * 部署站点并初始化
   */
  if ( siteIdList && Array.isArray(siteIdList) ) {
    pushCNZZ.init();
  }

  /**
   * 路由切换时执行PV上报
   */
  router.afterEach( (to: To) => {
    // 获取要上报的链接（当前版本不需要拼接了）
    const PAGE_URL: string = window.location.href;

    // 上报数据
    pushCNZZ.pv(PAGE_URL);
  });
}
