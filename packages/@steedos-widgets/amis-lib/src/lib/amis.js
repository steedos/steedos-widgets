/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-13 11:31:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-27 10:34:59
 * @Description:
 */
import { each, find, isArray, isEmpty } from 'lodash';

const RegisterRenders = [];

const normalizeLink = (to, location = window.location) => {
  to = to || "";

  if (to && to[0] === "#") {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === "?") {
    to = location.pathname + to;
  }

  const idx = to.indexOf("?");
  const idx2 = to.indexOf("#");
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
    ? to.substring(0, idx2)
    : to;
  let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : "";
  let hash = ~idx2 ? to.substring(idx2) : location.hash;

  if (!pathname) {
    pathname = location.pathname;
  } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
    let relativeBase = location.pathname;
    const paths = relativeBase.split("/");
    paths.pop();
    let m;
    while ((m = /^\.\.?\//.exec(pathname))) {
      if (m[0] === "../") {
        paths.pop();
      }
      pathname = pathname.substring(m[0].length);
    }
    pathname = paths.concat(pathname).join("/");
  }

  return pathname + search + hash;
};

export const amisRootClick = (router, e) => {
  if (e.target.nodeName.toLocaleLowerCase() === "a" && e.target.href) {
    e.preventDefault();
    router.push(e.target.href);
  }
};

export const getEvn = (router)=>{
  return {
    theme: "antd",
    notify: (type, msg)=>{
      if(msg.props?.schema.tpl){
        SteedosUI.message[type](msg.props?.schema.tpl)
      }else if(typeof msg == 'string'){
        SteedosUI.message[type](msg)
      }else{
        console.warn('notify', type, msg)
      }
    },
    confirm: (msg)=>{
      return new Promise((resolve, reject)=>{
        return SteedosUI.Modal.confirm({
          title: msg,
          onOk: ()=>{
            resolve(true);
          },
          okText: "确认",
          cancelText: "取消"
        })
      })
    },
    jumpTo: (to, action) => {
      if (to === "goBack") {
        return window.history.back();
      }

      to = normalizeLink(to);

      if (action && action.actionType === "url") {
        action.blank === true ? window.open(to) : router.push(to);
        return;
      }

      // 主要是支持 nav 中的跳转
      if (action && to && action.target) {
        window.open(to, action.target);
        return;
      }
      if (/^https?:\/\//.test(to)) {
        window.location.replace(to);
      } else {
        router.push(to);
      }
    }
  }
}

export const registerRenders = (assets)=>{
  if(!isEmpty(assets) && isArray(assets)){
    let amisLib = amisRequire('amis');

    const registerMap = {
      renderer: amisLib.Renderer,
      formitem: amisLib.FormItem,
      options: amisLib.OptionsControl,
    };
    
    let amisReact = amisRequire('react');
    each(assets, (asset)=>{
      // 防止组件重复注册
      if(!find(RegisterRenders, (componentName)=>{ return componentName === asset.componentName})){
        let Component = Builder.components.find(item => item.name === asset.componentName);
        let AmisWrapper = Component.class
        if(asset.componentType === 'amisSchema'){
          AmisWrapper = (props)=>{
            const { body, render } = props
            const [schema, setSchema] = amisReact.useState(null);
            amisReact.useEffect(()=>{
              const result = Component.class(props);
              if(result && result.then && typeof result.then === 'function'){
                result.then((data)=>{
                  setSchema(data);
                })
              }else{
                setSchema(result)
              }
            }, [])
            return amisReact.createElement(amisReact.Fragment, null, amisReact.createElement(amisReact.Fragment, null, schema && render ? render('body', schema) : ''), amisReact.createElement(amisReact.Fragment, null, render ? render('body', body) : ''));
          }
        }

        // 注册amis渲染器
        if (!registerMap[asset.usage]) {
          console.error(
            `${consoleTag}自定义组件注册失败，不存在${asset.usage}自定义组件类型。`,
          );
        } else {
          registerMap[asset.usage]({
            test: new RegExp(`(^|\/)${asset.type}`),
            type: asset.type,
            weight: asset.weight,
            autoVar: true,
          })(AmisWrapper);
          // 记录当前创建的amis自定义组件
          console.info('注册了一个自定义amis组件:', {
            type: asset.type,
            weight: asset.weight,
            component: AmisWrapper,
            framework: asset.framework,
            usage: asset.usage,
          });
        }
        // amisLib.Renderer({
        //   test: new RegExp(`(^|\/)${asset.type}`)
        // })(AmisWrapper);
        RegisterRenders.push(asset.componentName)
      }
    })
  }
}

export const amisRender = (root, schema, data = {}, env = {}, options) => {
  let amis = amisRequire("amis/embed");
  const { router, assets } = options;
  registerRenders(assets);
  return amis.embed(root, schema, data, Object.assign(getEvn(router), env));
};
