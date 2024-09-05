export const AmisSteedosFieldGroup = async (props = {title: null, body: null}) => {
    console.log(`props===>`, props)
    return {
        type: "fieldSet",
        title: props.title || "分组",
        collapsable: true,
        body: props.body?.length > 0 ? props.body : [{type: 'sfield-text', "label": '文本', amis: {}}]
      }
}