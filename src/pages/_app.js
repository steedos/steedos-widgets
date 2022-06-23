
import { saveAuthInfoFromQuery } from '@/lib/steedos.client';

export default function MyApp({ Component, pageProps, router }) {
  saveAuthInfoFromQuery(router.query)
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
