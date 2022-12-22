/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-14 09:31:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 11:17:16
 * @Description: 
 */
import { Dropdown, Spin, Tabs } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import React from 'react';
const { TabPane } = Tabs;
export type HeaderDropdownProps = {
  overlayClassName?: string;
  overlay: React.ReactNode | (() => React.ReactNode) | any;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown
    overlayClassName="header-dropdown"
    getPopupContainer={(target) => target.parentElement || document.body}
    {...restProps}
    arrow
  />
);

const getOverlay = (render, overlaySchema, data)=>{
  return <>
  <Spin delay={300} spinning={false} >
    <div className="bg-white shadow">
    {render('body', overlaySchema, {
      // data: data
        // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
    })}
    </div>
  </Spin>
</>
}

export const SteedosDropdown = (props) => {
  const { render, overlay, body, trigger = ['click'], placement = 'bottomRight', overlayClassName, className, data } = props; 
  return (
    <>
    <HeaderDropdown
        placement = {placement}
        overlay={getOverlay(render, overlay, data)}
        trigger={trigger}
        className={className}
        overlayClassName={overlayClassName}
      >
        <div>
        <>{render('body', body, {
          // data: data
        })}</>
        </div>
        </HeaderDropdown>
    </>
  );
}
