/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-16 18:11:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 18:17:20
 * @Description: 
 */
import * as React from "react"
import ReactDOM from "react-dom";

const withModalWrap = (component: React.FunctionComponent, provideProps) => {
  return (props: any) => {
    const ModalComponent = component;
    return React.createElement(ModalComponent, props);
  }
}
export const render = (component: React.FunctionComponent, componentProps: any, container: any, provideProps: any = {} ) => {
    const wrapComponent: any = withModalWrap(component, provideProps);
    const contentEle = React.createElement(wrapComponent,{
        ...componentProps
      });
    return ReactDOM.render(contentEle, container);
}