export const AmisLogo = async (props) => {
    const { src = '/logo.png', className, imgClassName = 'block h-7 w-auto' } = props;
    return {
        "type": "tpl",
        className,
        "tpl": `<a href='/app' class='flex items-center '><img class='${imgClassName}' src='${src}'></a>`,
        "id": "u:2a8e7a359dff"
      };
}