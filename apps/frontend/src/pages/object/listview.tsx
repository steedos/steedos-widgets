import { AmisRender } from "../../components/AmisRender";
import { useParams } from 'react-router-dom';
export const ObjectListView = () => {
  const { appId, objectName } = useParams();
  return (
    <AmisRender schema = {{
      type: 'page',
      body: {
        "type": "steedos-page-object-control",
        "name": "steedosPageObjectControl",
        "data": {
          objectName: objectName,
          pageType: 'list'
        }
      },
      data: {
        objectName: objectName,
        pageType: 'list'
      }
    }} data ={{
        context: {
          rootUrl: "/backend",
          app: appId,
          appId: appId,
          app_id: appId,
          tenantId:"617a0127e410310030c0b95f",
          userId:"Tt4hK3NpmDr5WjxFx",
          authToken: "ea3cdc716fb0f9cb3b183f62a57194b640dbc9dbb923e2463f9d489dd84aff4fa7fac46a1a3eb675b7d6b4",
          user: {
            spaceId: "617a0127e410310030c0b95f",
            userId:"Tt4hK3NpmDr5WjxFx",
          }
        },
        app: appId,
        appId: appId,
        app_id: appId,
    }} env = {{}} />
  );
};