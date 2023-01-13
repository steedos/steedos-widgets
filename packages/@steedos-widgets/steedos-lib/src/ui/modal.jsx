/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:36:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-13 14:37:26
 * @Description: 
 */
import React, { useState } from 'react';
import {createRoot} from 'react-dom';
import { has, assign } from 'lodash'
import { Modal as AntdModal, Drawer as AntdDrawer } from "antd"

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
    // TODO fix build error:   Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
    return React.createElement(Component, _extends({
      visible: isVisible,
      onCancel: close,
      onClose: close
    }, defProps, props))
  }
}

const newComponentRender = (prefix, Component)=>{
  return (props, container)=>{
    if(!props.name){
      props.name = `${prefix}-${props.name || 'default'}`;
    }
    if(!container){
      container = document.getElementById(`steedos-${prefix}-root-${props.name}`);
      if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', `steedos-${prefix}-root-${props.name}`);
        document.body.appendChild(container)
      }
    }
    const element = React.createElement(newFunctionComponent(Component), props);
    const root = createRoot(container);
    root.render(element);
  }
}

export const Modal = assign(newComponentRender('modal', AntdModal), {info: AntdModal.info, success: AntdModal.success, error: AntdModal.error, warning: AntdModal.warning, confirm: AntdModal.confirm});

export const Drawer = newComponentRender('drawer', AntdDrawer);
