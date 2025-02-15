import { React, AmisRender } from '../components/AmisRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Auth',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};


export const Login = () => (
  <AmisRender schema = {{
    "type": "page",
    "body": [{
      "type": "form",
      "mode": "horizontal",
      "api": {
        "method": "post",
        "url": "/api/v6/auth/login",
        "adaptor": `
          localStorage.setItem("steedos:userId", payload._id);
          localStorage.setItem("steedos:spaceId", payload.space);
          localStorage.setItem("steedos:authToken", payload.auth_token);
          return payload;
        `,
        "requestAdaptor": `
          api.url = (api.data.b6Host || api.data.rootUrl) + "/api/v6/auth/login";
          localStorage.setItem("steedos:rootUrl", api.data.rootUrl); 
          localStorage.setItem("steedosB6Host", api.data.b6Host); 
          localStorage.setItem("steedosRootUrl", api.data.rootUrl); 
          localStorage.setItem("steedosUsername", api.data.username);
          console.log(api, context);
          return api;
        `
      },
      "messages": {
        "saveSuccess": "登录成功"
      },
      "body": [
        {
          "label": "Root URL",
          "type": "input-text",
          "name": "rootUrl",
          "placeholder": "请输入 Steedos Root URL",
          value: "${ls:steedosRootUrl}",
        },
        {
          "label": "B6 HOST",
          "type": "input-text",
          "name": "b6Host",
          "placeholder": "请输入 B6 Host，默认与Root URL相同",
          value: "${ls:steedosB6Host}",
        },
        {
          "label": "Email",
          "type": "input-text",
          "name": "username",
          "placeholder": "请输入邮箱",
          value: "${ls:steedosUsername}",
        },
        {
          "label": "Password",
          "type": "input-password",
          "name": "password",
        }
      ],
      "submitText": "Login",
      "title": "Login to Steedos"
    }]
  }}/>
)


export const Me = () => (
  <AmisRender schema = {{
    "type": "page",
    "body": [{
      "type": "form",
      "mode": "horizontal",
      "body": [
        {
          "label": "Root URL",
          "type": "static",
          "name": "rootUrl",
          "value": "${context.rootUrl}"
        },
        {
          "label": "Current User Id",
          "type": "static",
          "name": "context.userId",
          "value": "${context.userId}"
        },
        {
          "label": "Current Tenant Id",
          "type": "static",
          "name": "context.tenantId",
          "value": "${context.tenantId}"
        },
        {
          "label": "Current Auth Token",
          "type": "static",
          "name": "context.authToken",
          "value": "${context.authToken}"
        },
      ],
      "submitText": "Login",
      "title": "Login to Steedos"
    }]
  }}/>
)