/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:36:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-27 16:06:27
 * @Description: 
 */
import React, { useState } from "react"
import ReactDOM from "react-dom";
import { has, assign } from 'lodash'
import { Modal as AntdModal, Drawer as AntdDrawer } from "antd"

const newFunctionComponent = (Component)=>{
  return (props)=>{
    // const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    const defProps = {
      width: "70%",
      style: {
        width: "70%",
        maxWidth: "950px",
        minWidth: "480px",
      }
    };
  
    const show = () => {
      setIsVisible(true);
    };
  
    const close = () => {
      setIsVisible(false);
    }
  
    if(!has(props, 'ref')){
      window.SteedosUI.refs[props.name]= {
        show: show,
        close: close,
        // ref: ref
      }
    }
    
    return (
      <Component  visible={isVisible} onCancel={close} onClose={close} {...defProps} {...props}></Component> //ref={ref}
    )
  }
}

const newComponentRender = (prefix, Component)=>{
  return (props, root)=>{
    if(!props.name){
      props.name = `${prefix}-${props.name || 'default'}`;
    }
    if(!root){
      root = document.getElementById(`steedos-${prefix}-root-${props.name}`);
      if (!root) {
        root = document.createElement('div');
        root.setAttribute('id', `steedos-${prefix}-root-${props.name}`);
        document.body.appendChild(root)
      }
    }
    const element = React.createElement(newFunctionComponent(Component), props);
    ReactDOM.render(element, root);
    return window.SteedosUI.getRef(props.name);
  }
}

export const Modal = assign(newComponentRender('modal', AntdModal), {info: AntdModal.info, success: AntdModal.success, error: AntdModal.error, warning: AntdModal.warning, confirm: AntdModal.confirm});

export const Drawer = newComponentRender('drawer', AntdDrawer);
