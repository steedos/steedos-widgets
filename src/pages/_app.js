/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 15:30:24
 * @Description: 
 */
import { SessionProvider } from "next-auth/react"
import 'focus-visible';
import '@/styles/tailwind.css';
import '@/styles/amis.css';
import 'antd/dist/antd.css'
import { AppLayout } from '@/components/AppLayout';
import '@/components/functions';
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const Layout = Component.getLayout ? Component.getLayout() : AppLayout;
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}
