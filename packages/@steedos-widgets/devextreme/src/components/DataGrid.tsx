import React, { useEffect, useState } from 'react';

import DevExpress from './DevExpress';

export const AmisDataGrid = (props: any) => {
  const {
    config: configJSON = null,
    data: amisData,
    className,
    dataFilter
  } = props;

  const [config, setConfig] = useState(configJSON);

  let onDataFilter = null;
  
  if (typeof dataFilter === 'string') {

    onDataFilter = new Function('config', 'DevExpress', 'data', 'return (async () => { ' + dataFilter + ' })()')
  }

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        if (onDataFilter) {
          const newConfig = await onDataFilter(config, DevExpress, amisData);
          if (!isCancelled) {
            setConfig(newConfig || config);
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

  if (!config) {
    return <>Loading...</>;
  }

  return (
    <DevExpress.DataGrid
      className={className}
      {...config}
    />
  );
};
