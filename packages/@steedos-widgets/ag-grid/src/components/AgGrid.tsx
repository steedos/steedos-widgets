/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-12-26 16:18:44
 */
import React, { useEffect, useState, useRef } from 'react';
import { AG_GRID_LOCALE_CN } from '@ag-grid-community/locale';

export const AmisAgGrid = (props: any) => {
  const {
    config: configJSON = null,
    data: amisData = {},
    className,
    dataFilter,
    onDataFilter: onDataFilterFun,
    style
  } = props;
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
  else if(onDataFilterFun){
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

  useEffect(() => {
    if (dataFilterLoaded) {
      // (wrapperRef.current as any).props = props
      agGrid && agGrid.createGrid(wrapperRef.current, config);
    }
  }, [config, dataFilterLoaded])

  if (!config) {
    return <>Loading...</>;
  }

  return (
    <div ref={wrapperRef} className={`${className} steedos-ag-grid ag-theme-quartz`} style={style} />
  )
};
