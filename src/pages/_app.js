import '@/styles/globals.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { I18nProvider } from '@/contexts/I18nContext';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
