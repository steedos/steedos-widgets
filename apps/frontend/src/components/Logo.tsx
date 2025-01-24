import { AmisRender } from "./AmisRender"

const Logo = () => {
    const  appId = 's3';
    return <AmisRender schema={{
        "columnClassName": "items-center flex pb-0",
        "body": [
            {
                "type": "steedos-logo",
                "showAppName": true,
                "appId": appId,
            }
        ],
        "md": "auto",
        "valign": "middle"
    }} data={{
        context: {
            rootUrl: "/backend",
            app: appId,
            appId: appId,
            app_id: appId,
            tenantId: "617a0127e410310030c0b95f",
            userId: "Tt4hK3NpmDr5WjxFx",
            authToken: "ea3cdc716fb0f9cb3b183f62a57194b640dbc9dbb923e2463f9d489dd84aff4fa7fac46a1a3eb675b7d6b4",
            user: {
                spaceId: "617a0127e410310030c0b95f",
                userId: "Tt4hK3NpmDr5WjxFx",
            }
        },
        app: appId,
        appId: appId,
        app_id: appId,
    }} env={{}}></AmisRender>
}

export default Logo;