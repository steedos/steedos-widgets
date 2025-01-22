import { AmisRender } from "../../components/AmisRender"

interface AppShowProps {
    // Define the expected prop types here (if any)
}

export const AppShow = (props: AppShowProps) => {
    console.log(`props`, props)
    return <AmisRender schema = {{
        type: 'steedos-object-form',
        objectApiName: 'space_users',
        "mode": "edit",
        "enableInitApi": false,
        "className": "",
        recordId: 'zT7rgJNvjeqHCk6n4',
      
      }} data ={{}} env = {{}} />
}