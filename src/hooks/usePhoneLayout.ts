import { useEffect, useState } from 'react';

// 1100px 以下不再把 1920 画布等比缩进去：800 宽会缩到约 0.42，正文只剩 5px。
// 1366 和 1920 仍走大屏缩放。
export const PHONE_MEDIA_QUERY = '(max-width: 1100px)';

export function usePhoneLayout() {
  const [phone, setPhone] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(PHONE_MEDIA_QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(PHONE_MEDIA_QUERY);
    const update = () => setPhone(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return phone;
}
