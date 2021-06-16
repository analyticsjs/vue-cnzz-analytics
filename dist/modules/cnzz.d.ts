declare class CNZZ {
  siteId: number
  isDebug: boolean
  constructor(siteId?: number, isDebug?: boolean)
  init(): void
  setAccount(): void
  trackPageview(pageUrl: string, fromUrl?: string): void
  trackEvent(
    category: string,
    action: string,
    label: string,
    value: number,
    nodeId: string
  ): void
}
export default CNZZ
