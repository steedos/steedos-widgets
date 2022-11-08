export async function getObjectHeader(objectSchema) {
  return {
    "type": "wrapper",
    "body": [
      {
        "type": "grid",
        "columns": [
          {
            "body": [
              {
                "type": "grid",
                "columns": [
                  {
                    "body": {
                      "type": "tpl",
                      "className": "block",
                      "tpl": `<p><img class=\"slds-icon_small slds-icon_container slds-icon-standard-${objectSchema.icon}\" src=\"\${context.rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/standard/${objectSchema.icon}.svg\" /></p>`
                    },
                    "md": "auto",
                    "className": "",
                    "columnClassName": "flex justify-center items-center"
                  },
                  {
                    "body": [
                      {
                        "type": "tpl",
                        "tpl": `${objectSchema.label}(\${count ? count : 0})`,
                        "inline": false,
                        "wrapperComponent": "",
                        "className": "leading-none",
                        "style": {
                          "fontFamily": "",
                          "fontSize": 13,
                          "fontWeight": "bold"
                        }
                      }
                    ],
                    "md": "",
                    "valign": "middle",
                    "columnClassName": "p-l-xs"
                  }
                ]
              }
            ],
            "md": 9
          },
          {
            "body": [
              // 头部内容区
            ]
          }
        ]
      }
    ],
    "size": "xs",
    "className": "bg-white p-t-sm p-b-sm p-l"
  };
}