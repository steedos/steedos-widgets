import clsx from 'clsx'
import Document, { Html, Head, Main, NextScript } from 'next/document'

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
        </Head>
        <body className='flex h-full flex-col'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
