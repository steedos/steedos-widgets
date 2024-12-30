
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Amis/Auth',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

const data = Builder.settings;

const env = {
  assetUrls: [
  ],
};

export const Login = () => {
  const schema = {
    "type": "page",
    "body": [{
      "type": "form",
      "mode": "horizontal",
      "api": {
        "method": "post",
        "url": "${context.rootUrl}/api/v6/auth/login",
        "adaptor": `
          localStorage.setItem("steedos:rootUrl", api.data.rootUrl);
          localStorage.setItem("steedos:userId", payload._id);
          localStorage.setItem("steedos:spaceId", payload.space);
          localStorage.setItem("steedos:authToken", payload.auth_token);
          return payload;
        `,
        "requestAdaptor": `
          localStorage.setItem("steedos:rootUrl", api.data.rootUrl); 
          return api;
        `
      },
      "body": [
        {
          "label": "Root URL",
          "type": "input-text",
          "name": "rootUrl",
          "placeholder": "请输入 Steedos Root URL"
        },
        {
          "label": "Email",
          "type": "input-text",
          "name": "username",
          "placeholder": "请输入邮箱"
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
  };
  return renderAmisSchema(schema, data, env);
}


export const Me = () => {
  const schema = {
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
  };
  return renderAmisSchema(schema, data, env);
}
