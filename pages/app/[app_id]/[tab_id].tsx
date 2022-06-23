import Layout from '../../../layouts/default'


export default function Page () {
    return (
        <div>App Content</div>
    )
}


Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }
  