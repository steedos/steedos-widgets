/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-20 12:42:58
 */
import React, { useEffect, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_CN } from '@ag-grid-community/locale';
import { DateTimeCellEditor, MultiSelectCellEditor, LookupCellEditor } from './cellEditor';


import { ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';

// LicenseManager.setLicenseKey('your License Key');

// Register all enterprise features
ModuleRegistry.registerModules([AllEnterpriseModule]);

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

  useEffect(() => {
    if (dataFilterLoaded) {
      // (wrapperRef.current as any).props = props
      config.columnDefs.forEach((columnDef: any) => {
        const fieldType = columnDef.cellEditorParams?.fieldConfig.type;
        if (fieldType === 'datetime') {
          columnDef.cellEditor = DateTimeCellEditor;
        }
        else if (fieldType === 'select-multiple') {
          columnDef.cellEditor = MultiSelectCellEditor;
        }
        else if (fieldType === 'lookup') {
          columnDef.cellEditor = LookupCellEditor;
        }
      });
      // agGrid && agGrid.createGrid(wrapperRef.current, config);
    }
  }, [config, dataFilterLoaded])

  if (!config) {
    return <>Loading...</>;
  }

  return (
    <div ref={wrapperRef} className={`${className} steedos-ag-grid ag-theme-quartz`} style={style} >
      {dataFilterLoaded && (
        <AgGridReact {...config} />
      )}
    </div>
  )
};
