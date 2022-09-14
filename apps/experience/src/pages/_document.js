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
          <script src="/unpkg.com/amis/sdk/sdk.js"></script>
          <script src="/unpkg.com/lodash/lodash.min.js"></script>
          <script src="/unpkg.com/moment/min/moment.min.js"></script>
          <link rel="stylesheet" href="/unpkg.com/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css" />
          <link rel="stylesheet" href="/unpkg.com/amis/lib/themes/antd.css" />
          <link rel="stylesheet" href="/unpkg.com/amis/lib/helper.css" />
          <link rel="stylesheet" href="/unpkg.com/amis/sdk/iconfont.css" />
          <link rel="stylesheet" href="/unpkg.com/fontawesome/fontawesome.css" />

        </Head>
        <body className='antialiased text-black bg-white'>
          
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
