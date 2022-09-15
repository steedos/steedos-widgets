export const AmisTabListSelect = async (props) => {
  console.log(`AmisTabListSelect props`, props)
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