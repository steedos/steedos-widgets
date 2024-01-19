import React, { useEffect, useRef } from 'react';


import Chart, {
  AdaptiveLayout,
  CommonSeriesSettings,
  Size,
  Tooltip,
} from 'devextreme-react/chart';

import PivotGrid, {
  FieldChooser,
} from 'devextreme-react/pivot-grid';

// 不要用 devextreme-react, rollup 编译报错
export const AmisPivotGrid = ( {
  data: amisData,
  config, 
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
      'PivotGrid',
      'data',
      dataFilter
    ) as any;
  }
  try {
    onDataFilter &&
      (configJSON =
        onDataFilter(configJSON, PivotGrid, amisData) || configJSON);
  } catch (e) {
    console.warn(e);
  }

  const customizeTooltip = (args) => {
    return {
      html: `${args.originalValue}`,
    };
  }
  
  const chartRef = useRef<Chart>(null);
  const pivotGridRef = useRef<PivotGrid>(null);

  useEffect(() => {
    pivotGridRef.current.instance.bindChart(chartRef.current.instance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });
  }, []);

  return (
    <React.Fragment>
      <Chart ref={chartRef}>
        <Size height={200} />
        <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
        <CommonSeriesSettings type="bar" />
        <AdaptiveLayout width={450} />
      </Chart>

      <PivotGrid
        // id="pivotgrid"
        allowSortingBySummary={true}
        allowFiltering={true}
        showBorders={true}
        showColumnTotals={false}
        showColumnGrandTotals={false}
        showRowTotals={false}
        showRowGrandTotals={false}
        ref={pivotGridRef}
        className={className}
        {...configJSON}
      >
        <FieldChooser enabled={true} height={400} />
      </PivotGrid>
    </React.Fragment>
  );
}