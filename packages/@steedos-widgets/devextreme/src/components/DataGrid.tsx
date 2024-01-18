import React, { useEffect, useRef } from 'react';

import {
  DataGrid
} from 'devextreme-react/data-grid';

import { createObject } from '@steedos-widgets/amis-lib';

// 不要用 devextreme-react, rollup 编译报错
export const AmisDataGrid = ( {config, className, ...props} ) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  }, [])

  return (
    <DataGrid
      className={className}
      {...config}>
    </DataGrid>
  )
}