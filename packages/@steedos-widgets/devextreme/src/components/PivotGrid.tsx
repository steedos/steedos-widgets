import React, { useEffect, useRef, useMemo } from 'react';

// 假设 UMD 脚本已加载，并获取全局的 DevExtreme 构造函数
const DxPivotGrid: any = (window as any).DevExpress?.ui?.dxPivotGrid;
const DxChart: any = (window as any).DevExpress?.viz?.dxChart;
const DevExpress: any = (window as any).DevExpress;

if (!DxPivotGrid || !DxChart) {
    console.warn("DevExtreme PivotGrid 或 Chart UMD 模块未找到。请确保 UMD 脚本已正确加载。");
}

// 定义 props 接口，方便类型提示（可选）
interface AmisPivotGridProps {
  data: any;
  className?: string; 
  config?: object;
  // configAdaptor 可以是函数 (Function) 或字符串代码 (String)
  configAdaptor?: string;
  onConfigAdaptor?: (DevExpress: any, data: any) => any;
  [key: string]: any; // 允许其他 props
}

/**
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme PivotGrid 和 Chart。
 */
export const AmisPivotGrid = ( {
  data: amisData,
  className, 
  config,
  configAdaptor, // 解构出来以便统一处理
  onConfigAdaptor, // 解构出来以便统一处理
  ...props
} : AmisPivotGridProps) => {
  
  // 1. DOM 引用：用于挂载 PivotGrid 和 Chart
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const pivotGridContainerRef = useRef<HTMLDivElement>(null);

  // 2. DevExtreme 实例引用
  const chartInstanceRef = useRef<any>(null);
  const pivotGridInstanceRef = useRef<any>(null);

  // 3. 处理配置和数据过滤 (优化后的逻辑)
  const fullConfig = useMemo(() => {
    let baseConfig = config;
    
    // 统一处理 configAdaptor / onConfigAdaptor 逻辑
    let filterFn = onConfigAdaptor;

    if (!filterFn) {
        if (typeof configAdaptor === 'string') {
            // configAdaptor 是字符串，尝试创建函数
            try {
                // 使用 new Function 代替 eval，用于执行字符串代码
                filterFn = new Function(
                    'config',
                    'data',
                    configAdaptor
                ) as any;
            } catch (e) {
                console.warn("DataFilter 字符串函数创建失败:", e);
            }
        }
    }

    // 执行数据过滤函数（如果存在）
    try {
      if (filterFn) {
        // 使用执行结果，如果返回非空值，则覆盖 baseConfig
        const newConfig = filterFn(baseConfig, amisData);
        if (newConfig) {
            baseConfig = newConfig;
        }
        console.log("最终 PivotGrid 配置:", newConfig);
      }
    } catch (e) {
      console.warn("DataFilter 执行错误:", e);
    }
    
    // 合并最终配置，并明确设置 dataSource
    const finalConfig = {
      ...baseConfig,
      ...props, // 合并剩余的 props 中的配置项
    };

    return finalConfig;
  }, [configAdaptor, onConfigAdaptor, props, amisData]); // 依赖项包含所有配置和数据源

  // ==========================================
  // I. 挂载和实例化 (Mount)
  // ==========================================
  useEffect(() => {
    if (!DxPivotGrid || !DxChart || !pivotGridContainerRef.current || !chartContainerRef.current) {
      return;
    }

    // --- 1. 实例化 PivotGrid ---
    const pivotGridConfig = {
      // 保持原组件中的默认配置，除非被 fullConfig 覆盖
      allowSortingBySummary: true,
      allowFiltering: true,
      showBorders: true,
      showColumnTotals: false,
      showColumnGrandTotals: false,
      showRowTotals: false,
      showRowGrandTotals: false,
      ...fullConfig,
    };
    
    // 注意：这里使用 pivotGridConfig 而非 fullConfig
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
      // Chart 实例的配置可以从 fullConfig 中获取，但为了保持示例简洁，使用默认配置
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
        // 移除 id="pivotgrid" 以更符合 React 最佳实践（除非 DevExtreme 严格依赖它）
        style={{ width: '100%' }}
        // className={className} // 保持外部 div 上的 className 即可
      />
    </div>
  );
}