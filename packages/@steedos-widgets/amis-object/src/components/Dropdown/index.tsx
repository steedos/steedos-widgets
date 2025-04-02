/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-14 09:31:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 11:17:16
 * @Description: 
 */
import { Dropdown, Spin, Tabs } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import React, { useState } from 'react';
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



export const SteedosDropdown = (props) => {
  const [open, setOpen] = useState(false);
  const { render, overlay, body, trigger = ['click'], placement = 'bottomRight', overlayClassName, className, data } = props; 

  const getOverlay = (render, overlaySchema, data) => {
    return (
      <div onClick={() => setOpen(false)}>
        <Spin delay={300} spinning={false}>
          <div className="bg-white shadow">
            {render('body', overlaySchema, data)}
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <>
    <HeaderDropdown
        placement = {placement}
        overlay={getOverlay(render, overlay, data)}
        trigger={trigger}
        className={className}
        overlayClassName={overlayClassName}
        open={open}
        onOpenChange={setOpen}
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
