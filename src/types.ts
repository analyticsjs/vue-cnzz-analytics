import PushCNZZ from '@m/pushCNZZ'

export interface Options {
  router: any
  siteIdList: number[]
  isDebug: boolean
}

export interface Vue {
  prototype: any
  $pushCNZZ: PushCNZZ
  version: number | string
  config: any
}
