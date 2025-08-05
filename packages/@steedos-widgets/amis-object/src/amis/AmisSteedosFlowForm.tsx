export const AmisSteedosFlowForm = async (props = {className: null, body: null}) => {
    console.log('AmisSteedosFlowForm===>', {
      type: "container",
      className: props.className,
      body: props.body || []
    });
    return {
      type: "container",
      className: props.className,
      body: props.body || []
    }
}