import { useEffect, useState } from 'react';

// 1100px 以下不再把 1920 画布等比缩进去：800 宽会缩到约 0.42，正文只剩 5px。
// 笔记本布局也关闭大屏缩放，由 CSS 制定列数。
export const PHONE_MEDIA_QUERY = '(max-width: 1100px)';

// 类目名只有在绘图区很窄时才倾斜。800 宽的堆叠图仍然放得下横排文字。
export const NARROW_CHART_QUERY = '(max-width: 560px)';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export function useUnscaledLayout() {
  return useMediaQuery('(max-width: 1440px)');
}

export function usePhoneLayout() {
  return useMediaQuery(PHONE_MEDIA_QUERY);
}

export function useNarrowChart() {
  return useMediaQuery(NARROW_CHART_QUERY);
}
