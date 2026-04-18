// 图片模块声明
declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module 'autofit.js' {
  interface AutofitConfig {
    el?: string;           // 选择器，默认 "body"
    dw?: number;           // 设计稿宽度，默认 1920
    dh?: number;           // 设计稿高度，默认 1080
    resize?: boolean;      // 是否监听 resize，默认 true
    ignore?: string[];     // 忽略缩放的元素
    transition?: number;   // 过渡时间，默认 0
    delay?: number;        // 延迟，默认 0
    limit?: number;        // 缩放阈值，默认 0.1
    cssMode?: string;      // css缩放方式，默认 "scale"
    allowScroll?: boolean; // 是否允许滚动，默认 false
  }

  interface Autofit {
    init: (config: AutofitConfig) => void;
    off: () => void;
  }

  const autofit: Autofit;
  export default autofit;
}
