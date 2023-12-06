export const AmisTabListSelect = async (props) => {
  // console.log(`AmisTabListSelect props`, props)
  const { $schema, data } = props;
  return {
    "type": "tabs",
    "source": $schema.source,
    "tabs": [
        {
            "title": "${tab_title}",
            "body": [
                {
                    "type": "list-select",
                    "name": "select",
                    "label": "",
                    "clearable": true,
                    "source": "${items}"
                }
            ]
        }
    ]
  }
}


// export const AmisTabListSelect = () => (
//   <AmisRender schema={{
//     type: 'page',
//     title: 'AmisTabListSelect',
//     "data": {
//       "arr": [
//         {
//           "tab_title": "收入",
//           "items": [
//             {
//               "label": "Option A1",
//               "value": "a1"
//             },
//             {
//               "label": "Option B1",
//               "value": "b1"
//             }
//           ]
//         },
//         {
//           "tab_title": "支出",
//           "items": [
//             {
//               "label": "Option A2",
//               "value": "a2"
//             },
//             {
//               "label": "Option B2",
//               "value": "b2"
//             }
//           ]
//         }
//       ]
//     },
//     body: {
//       type: 'amis-tab-list-select',
//       "source": "${arr}"
//     }
//   }}
//   assetUrls={process.env.STEEDOS_EXPERIENCE_ASSETURLS}
//   />
// )