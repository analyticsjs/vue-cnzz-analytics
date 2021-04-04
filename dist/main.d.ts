export declare function usePush(): {
    pv: (pageUrl: string, fromUrl?: string) => void;
    event: (category: string, action: string, label: string, value: number, nodeId: string) => void;
};
export default function install(Vue: Vue, { router, siteIdList, isDebug }: Partial<Options>): boolean;
