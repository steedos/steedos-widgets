/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-02 20:17:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-07 13:33:48
 * @Description: 
 */
import Document, { Html, Head, Main, Script, NextScript } from 'next/document'

export default class MyDocument extends Document {

  render() {
    return (
      <Html
        className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
        lang="en"
      >
        <Head>
          <link rel="icon" href="/favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="application-name" content="Steedos" />
  
          <meta name="theme-color" content="#ffffff" />
          <script src="https://unpkg.steedos.cn/lodash/lodash.min.js"></script>
          <script src="https://unpkg.steedos.cn/moment/min/moment.min.js"></script>
          <script src="https://unpkg.steedos.cn/jquery@3.6.2/dist/jquery.min.js"></script>

          <link rel="stylesheet" href="/tailwind-base.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@2.5.2/lib/themes/antd.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@2.5.2/lib/helper.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@2.5.2/sdk/iconfont.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/@fortawesome/fontawesome-free@6.2.0/css/all.min.css" />

          {process.env.NODE_ENV !== 'production' && (
            <>
              <link rel="stylesheet" href="https://cdn.tailwindcss.com" />
            </>
          )}

        </Head>
        <body className='antialiased text-black'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
