import { GlobalHeader } from '@/components/GlobalHeader'

export function Navbar({ navigation, selected, app }) {
  return (
    <>
    <GlobalHeader navigation={navigation} selected={selected} app={app}></GlobalHeader>
    </>
  )
}