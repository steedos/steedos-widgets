/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-16 09:31:31
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 09:42:15
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { Badge } from 'antd';

export const SteedosBadgeRibbon = (props) => {
    const { body, render, color, placement = 'end', text= 'Badge.Ribbon' } = props;   
    
    return <Badge.Ribbon color={color} placement={placement} text={text}>{render('body', body, {
      })}</Badge.Ribbon>
}
