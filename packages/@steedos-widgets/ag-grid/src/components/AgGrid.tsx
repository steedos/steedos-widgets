import React, { useEffect, useRef } from 'react';
import { createGrid } from 'ag-grid-community';

import { createObject } from '@steedos-widgets/amis-lib';

// 不要用 ag-grid-react, rollup 编译报错
export const AmisAgGrid = ( {config, className, ...props} ) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const agGrid = (window as any)["agGrid"]
  useEffect(() => {
    agGrid && agGrid.createGrid(wrapperRef.current, config);
  }, [])

  return (
    <div ref={wrapperRef} className={`${className} ag-theme-quartz`}/>
  )
}