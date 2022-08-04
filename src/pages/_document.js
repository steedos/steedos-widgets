/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-02 20:17:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-04 10:32:47
 * @Description: 
 */
import clsx from 'clsx'
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
          <script src="https://unpkg.com/amis@2.1.0/sdk/sdk.js"></script>

        </Head>
        <body className='antialiased text-slate-900 dark:text-slate-400 bg-white dark:bg-slate-900'>
          <link rel="stylesheet" href="https://unpkg.com/amis@2.1.0/lib/themes/antd.css" />
          <link rel="stylesheet" href="/assets/styles/salesforce-lightning-design-system.min.css" />
          <link rel="stylesheet" href="https://unpkg.com/amis@2.1.0/lib/helper.css" />
          <link rel="stylesheet" href="https://unpkg.com/amis@2.1.0/sdk/iconfont.css" />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
