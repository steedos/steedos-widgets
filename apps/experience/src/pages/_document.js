/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-02 20:17:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-12 17:40:55
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
          <script src="https://unpkg.steedos.cn/amis@2.3.0/sdk/sdk.js"></script>
          <script src="https://unpkg.steedos.cn/lodash/lodash.min.js"></script>
          <script src="https://unpkg.steedos.cn/moment/min/moment.min.js"></script>
          <link rel="stylesheet" href="https://unpkg.steedos.cn/@salesforce-ux/design-system@2.19.0/assets/styles/salesforce-lightning-design-system.min.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@2.3.0/lib/themes/antd.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@2.3.0/lib/helper.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@2.3.0/sdk/iconfont.css" />
          <link rel="stylesheet" href="https://unpkg.steedos.cn/@fortawesome/fontawesome-free@6.2.0/css/all.min.css" />

        </Head>
        <body className='antialiased text-black bg-gray-50'>
          
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
