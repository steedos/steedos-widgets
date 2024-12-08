
export const amisConfig: any = {
    name: 'Steedos:Amis',
    static: true,
    image:
      'https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F682efef23ace49afac61748dd305c70a',
    inputs: [
      {
        name: 'schema',
        type: 'javascript',
        required: true,
        defaultValue: `{
          "type": "page",
          "title": "标题",
          "body": "Hello World!"
        }`,
        code: true,
      },
      {
        name: 'data',
        type: 'javascript',
        required: true,
        defaultValue: `{}`,
        code: true,
      },
    ],
    canHaveChildren: false,
  }