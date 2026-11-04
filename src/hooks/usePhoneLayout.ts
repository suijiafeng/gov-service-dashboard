import { useEffect, useState } from 'react';

export const PHONE_MEDIA_QUERY = '(max-width: 767px)';

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
