export const AmisSteedosObject = async (props = {className: null, body: null}) => {
    return {
      type: "container",
        className: props.className,
        body: props.body || []
      }
}