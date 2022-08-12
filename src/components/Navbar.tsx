import { GlobalHeader } from '@/components/GlobalHeader'
import { AmisRender } from '@/components/AmisRender'
const schema = require('@/amis/global_header.amis.json');

export function Navbar({ navigation, selected, app, router }) {
  return (
    <>
    <AmisRender className="" id={`global_header`} schema={schema} router={router} data={{}}></AmisRender>
    {/* <GlobalHeader navigation={navigation} selected={selected} app={app}></GlobalHeader> */}
    </>
  )
}