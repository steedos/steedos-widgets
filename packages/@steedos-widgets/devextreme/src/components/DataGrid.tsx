import React, { useEffect, useRef } from 'react';

import {
  DataGrid
} from 'devextreme-react/data-grid';

import { createObject } from '@steedos-widgets/amis-lib';

// 不要用 devextreme-react, rollup 编译报错
export const AmisDataGrid = ( {
  data: amisData,
  config, 
  dataSource, 
  keyExpr = "_id",
  className, 
  ...props
} ) => {
  
  let configJSON = {}
  if (typeof config === 'string') {
    try {
      configJSON = JSON.parse(config);
    } catch(e) {console.log(e)}
  }
  if (typeof config === 'object') {
    configJSON = config
  }


  let onDataFilter = props.onDataFilter;
  const dataFilter = props.dataFilter;

  if (!onDataFilter && typeof dataFilter === 'string') {
    onDataFilter = new Function(
      'config',
      'DataGrid',
      'data',
      dataFilter
    ) as any;
  }
  try {
    onDataFilter &&
      (configJSON =
        onDataFilter(configJSON, DataGrid, amisData) || configJSON);
  } catch (e) {
    console.warn(e);
  }
  useEffect(() => {
  }, [])

  return (
    <DataGrid
      className={className}
      dataSource={dataSource}
      keyExpr={keyExpr}
      {...configJSON}>
    </DataGrid>
  )
}