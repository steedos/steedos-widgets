import Head from 'next/head'
import Layout from '../layouts/default'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Steedos</title>
      </Head>

      <main>
      </main>

    </div>
  )
}


Home.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}
