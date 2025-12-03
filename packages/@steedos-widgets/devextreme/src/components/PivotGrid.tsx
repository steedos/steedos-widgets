import React, { useEffect, useRef, useMemo } from 'react';

// 假设 UMD 脚本已加载，并获取全局的 DevExtreme 构造函数
const DxPivotGrid: any = (window as any).DevExpress?.ui?.dxPivotGrid;
const DxChart: any = (window as any).DevExpress?.viz?.dxChart;

if (!DxPivotGrid || !DxChart) {
    console.warn("DevExtreme PivotGrid 或 Chart UMD 模块未找到。请确保 UMD 脚本已正确加载。");
}

// 帮助函数：安全地解析配置
const parseConfig = (config: any) => {
    if (typeof config === 'string') {
        try {
            return JSON.parse(config);
        } catch(e) {
            console.warn("配置解析失败:", e);
            return {};
        }
    }
    return typeof config === 'object' && config !== null ? config : {};
};

/**
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme PivotGrid 和 Chart。
 */
export const AmisPivotGrid = ( {
  data: amisData,
  config, 
  className, 
  ...props
} : any) => {
  
  // 1. DOM 引用：用于挂载 PivotGrid 和 Chart
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const pivotGridContainerRef = useRef<HTMLDivElement>(null);

  // 2. DevExtreme 实例引用
  const chartInstanceRef = useRef<any>(null);
  const pivotGridInstanceRef = useRef<any>(null);

  // 3. 处理配置和数据过滤 (逻辑与原代码保持一致)
  const [configJSON, fullConfig] = useMemo(() => {
    let baseConfig = parseConfig(config);
    
    // 处理 dataFilter 逻辑
    let onDataFilter = props.onDataFilter;
    const dataFilter = props.dataFilter;

    if (!onDataFilter && typeof dataFilter === 'string') {
      try {
        // 使用 new Function 代替 eval，用于执行字符串代码
        onDataFilter = new Function(
          'config',
          'PivotGrid',
          'data',
          dataFilter
        ) as any;
      } catch (e) {
        console.warn("DataFilter 函数创建失败:", e);
      }
    }

    try {
      onDataFilter &&
        (baseConfig =
          onDataFilter(baseConfig, DxPivotGrid, amisData) || baseConfig);
    } catch (e) {
      console.warn("DataFilter 执行错误:", e);
    }
    
    // 合并最终配置，并明确设置 dataSource
    const finalConfig = {
      ...baseConfig,
      ...props, // 合并 props 中的配置项
      dataSource: amisData, // 确保数据源被设置
    };

    return [baseConfig, finalConfig];
  }, [config, props, amisData]);


  // ==========================================
  // I. 挂载和实例化 (Mount)
  // ==========================================
  useEffect(() => {
    if (!DxPivotGrid || !DxChart || !pivotGridContainerRef.current || !chartContainerRef.current) {
      return;
    }

    // --- 1. 实例化 PivotGrid ---
    const pivotGridConfig = {
      ...fullConfig,
      // 保持原组件中的默认配置，除非被 fullConfig 覆盖
      allowSortingBySummary: true,
      allowFiltering: true,
      showBorders: true,
      showColumnTotals: false,
      showColumnGrandTotals: false,
      showRowTotals: false,
      showRowGrandTotals: false,
      // 在 UMD 模式下，通常将 FieldChooser 的配置直接写在主配置中
      fieldChooser: fullConfig.fieldChooser || { enabled: true, height: 400 },
    };
    
    const pivotInstance = new DxPivotGrid(pivotGridContainerRef.current, pivotGridConfig);
    pivotGridInstanceRef.current = pivotInstance;

    // --- 2. 实例化 Chart ---
    const chartConfig = {
      size: { height: 200 },
      tooltip: { 
        enabled: true, 
        customizeTooltip: (args: any) => ({ html: `${args.originalValue}` }) 
      },
      commonSeriesSettings: { type: 'bar' },
      adaptiveLayout: { width: 450 },
      // Chart 实例需要在配置中引用 PivotGrid 的数据源，但 bindChart 会处理这个
    };

    const chartInstance = new DxChart(chartContainerRef.current, chartConfig);
    chartInstanceRef.current = chartInstance;

    // --- 3. 关联 PivotGrid 和 Chart (核心步骤) ---
    // 使用 PivotGrid 实例的 bindChart 方法进行关联
    pivotInstance.bindChart(chartInstance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });


    // ==========================================
    // II. 卸载 (Unmount) - 销毁实例
    // ==========================================
    return () => {
      if (pivotGridInstanceRef.current) {
        // 销毁 PivotGrid 实例
        pivotGridInstanceRef.current.dispose();
        pivotGridInstanceRef.current = null;
      }
      if (chartInstanceRef.current) {
        // 销毁 Chart 实例
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []); // 仅在挂载时执行一次

  // ==========================================
  // III. 更新 (Update)
  // ==========================================
  useEffect(() => {
    const pivotInstance = pivotGridInstanceRef.current;
    if (pivotInstance) {
      // 当配置或数据变化时，更新 PivotGrid 实例的配置
      // 由于 Chart 是通过 bindChart 关联到 PivotGrid 的，
      // 只需要更新 PivotGrid 的配置，Chart 会自动更新。
      pivotInstance.option(fullConfig);
    }
  }, [fullConfig]); // 依赖于 fullConfig 变化

  // ==========================================
  // IV. 渲染
  // ==========================================
  return (
    <div className={className}>
      {/* Chart 容器 */}
      <div 
        ref={chartContainerRef} 
        style={{ width: '100%', height: '200px' }} 
      />

      {/* PivotGrid 容器 */}
      <div
        ref={pivotGridContainerRef}
        id="pivotgrid" // 保持 id 属性，虽然在 React 中不推荐，但保留以防 DevExtreme 内部逻辑依赖
        style={{ width: '100%' }}
        className={className}
      />
    </div>
  );
}