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
          <link rel="stylesheet" href="/amis.css" />
          <link rel="stylesheet" href="/assets/styles/salesforce-lightning-design-system.min.css" />

        </Head>
        <body className='antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
          <link rel="stylesheet" href="https://unpkg.com/amis@2.1.0/lib/themes/antd.css" />
          <link rel="stylesheet" href="https://unpkg.com/amis@2.1.0/lib/helper.css" />
          <link rel="stylesheet" href="https://unpkg.com/amis@2.1.0/sdk/iconfont.css" />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
