import { AmisRender } from '@/components/AmisRender'
const schema = require('@/amis/app_launcher.amis.json');

export const AppLauncher = ({router})=>{
    return (
        <AmisRender className="" id={`app_launcher`} schema={schema} router={router}></AmisRender>
    )
}