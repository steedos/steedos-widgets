/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-16 09:31:31
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-16 09:40:16
 * @Description: 
 */
import React, { useEffect, useState } from 'react'
import { Badge } from 'antd';

export const SteedosBadge = (props) => {
    const { body, render, count, color, dot, offset, overflowCount, showZero, size, status, text, title } = props;   
    return <Badge count={count} color={color} dot={dot} offset={offset} overflowCount={overflowCount} showZero={showZero} size={size} status={status} text={text} title={title}>{render('body', body, {
      })}</Badge>
}
