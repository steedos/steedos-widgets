import clsx from 'clsx'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }


  render() {
    return (
      <Html lang="en">
        <Head>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="application-name" content="Steedos" />
  
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body
          className='antialiased text-slate-500 bg-white'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
