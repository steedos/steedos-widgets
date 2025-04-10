/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-10 21:54:04
 */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_CN } from '@ag-grid-community/locale';
import { DateTimeCellEditor, DateCellEditor, MultiSelectCellEditor, LookupCellEditor } from './cellEditor';
import { DateTimeFilter, LookupFilter } from './filter';
import { LookupCellRenderer } from './cellRenderer';

export const AmisAgGrid = (props: any) => {
  const {
    config: configJSON = null,
    data: amisData = {},
    className,
    dataFilter,
    onDataFilter: onDataFilterFun,
    style
  } = props;
  // console.log('AmisAgGrid===configJSON===', configJSON);
  const initConfig = Object.assign({ localeText: AG_GRID_LOCALE_CN }, configJSON || {});
  const [config, setConfig] = useState(initConfig);
  // 如果不增加dataFilterLoaded机制，组件传入的configJSON初始不是null的时候会造成后面的agGrid.createGrid执行两次出现两个grid
  const [dataFilterLoaded, setDataFilterLoaded] = useState(!!!(dataFilter || onDataFilterFun));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const agGrid = (window as any)["agGrid"];
  let onDataFilter: Function;

  if (typeof dataFilter === 'string') {
    onDataFilter = new Function('config', 'AgGrid', 'props', 'data', 'ref', 'return (async () => { ' + dataFilter + ' })()')
  }
  else if (onDataFilterFun) {
    onDataFilter = onDataFilterFun;
  }

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        if (onDataFilter) {
          const newConfig = await onDataFilter(config, agGrid, props, amisData, wrapperRef);
          if (!isCancelled) {
            setConfig(newConfig || config);
            setDataFilterLoaded(true);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  // useEffect(() => {
  //   if (dataFilterLoaded) {
  //     // (wrapperRef.current as any).props = props
  //     // agGrid && agGrid.createGrid(wrapperRef.current, config);
  //   }
  // }, [config, dataFilterLoaded])

  const components = useMemo<{
    [p: string]: any;
  }>(() => {
    if (!dataFilterLoaded) {
      return {}
    }
    return {
      ...config.components,
      agAmisDateTimeCellEditor: DateTimeCellEditor,
      agAmisDateCellEditor: DateCellEditor,
      agAmisMultiSelectCellEditor: MultiSelectCellEditor,
      agAmisLookupCellEditor: LookupCellEditor,
      agAmisDateTimeFilter: DateTimeFilter,
      agAmisLookupFilter: LookupFilter,
      agAmisLookupCellRenderer: LookupCellRenderer
    };
  }, [config, dataFilterLoaded]);

  if (!config) {
    return <>Loading...</>;
  }

  return (
    <div ref={wrapperRef} className={`${className} steedos-ag-grid ag-theme-quartz`} style={style} >
      {dataFilterLoaded && (
        <AgGridReact {...config} components={components} />
      )}
    </div>
  )
};
