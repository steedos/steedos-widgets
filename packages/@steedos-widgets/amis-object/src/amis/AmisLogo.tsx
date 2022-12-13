export const AmisLogo = async (props) => {
    const { src = '/logo.png' } = props;
    return {
        "type": "tpl",
        "tpl": "<a href='/app' class='flex items-center'><img class='block h-7 w-auto'src="+src+"/></a>",
        "id": "u:2a8e7a359dff"
      };
}