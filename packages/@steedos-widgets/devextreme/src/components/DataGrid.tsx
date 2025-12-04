import React, { useEffect, useRef, useMemo } from 'react';

// 假设 UMD 脚本已加载，并获取全局的 DevExtreme DataGrid 构造函数
const DxDataGrid: any = (window as any).DevExpress?.ui?.dxDataGrid;
const DevExpress: any = (window as any).DevExpress;

if (!DxDataGrid) {
    console.warn("DevExtreme DataGrid UMD 模块未找到。请确保 UMD 脚本已正确加载。");
}

// 定义 props 接口
interface AmisDataGridProps {
  data: any; // 传入的数据源
  className?: string; 
  config?: object; // 基础配置
  // configAdaptor 可以是函数 (Function) 或字符串代码 (String)
  configAdaptor?: string;
  onConfigAdaptor?: (config: any, data: any) => any;
  [key: string]: any; // 允许其他 props
}

/**
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme DataGrid。
 */
export const AmisDataGrid = ( {
  data: amisData,
  className, 
  config,
  configAdaptor, 
  onConfigAdaptor, 
  ...props
} : AmisDataGridProps) => {
  
  // 1. DOM 引用：用于挂载 DataGrid
  const dataGridContainerRef = useRef<HTMLDivElement>(null);

  // 2. DevExtreme DataGrid 实例引用
  const dataGridInstanceRef = useRef<any>(null);

  // 3. 处理配置和数据过滤 (与 PivotGrid 保持一致的配置处理逻辑)
  const fullConfig = useMemo(() => {
    let baseConfig = config;
    
    // 统一处理 configAdaptor / onConfigAdaptor 逻辑
    let filterFn = onConfigAdaptor;

    if (!filterFn) {
        if (typeof configAdaptor === 'string') {
            // configAdaptor 是字符串，尝试创建函数
            try {
                // 使用 new Function 代替 eval，用于执行字符串代码
                // 函数签名: function(config, data)
                filterFn = new Function(
                    'config',
                    'data',
                    configAdaptor
                ) as any;
            } catch (e) {
                console.warn("configAdaptor 字符串函数创建失败:", e);
            }
        }
    }

    // 执行配置过滤函数（如果存在）
    try {
      if (filterFn) {
        // 使用执行结果，如果返回非空值，则覆盖 baseConfig
        // 注意：这里传递的是当前 baseConfig 和 amisData
        const newConfig = filterFn(baseConfig, amisData);
        if (newConfig) {
            baseConfig = newConfig;
        }
        // console.log("最终 DataGrid 配置:", newConfig); // 可选的调试信息
      }
    } catch (e) {
      console.warn("configAdaptor 执行错误:", e);
    }
    
    // 合并最终配置，并明确设置 dataSource
    const finalConfig = {
      // 默认设置：例如，启用条纹、列宽自适应
      showBorders: true,
      rowAlternationEnabled: true,
      columnAutoWidth: true,
      
      // 合并基础配置和外部传入的 props
      ...baseConfig,
      ...props, 
      
      // 明确设置 DataGrid 的数据源
      dataSource: amisData, 
    };

    return finalConfig;
  }, [configAdaptor, onConfigAdaptor, props, amisData, config]); // 依赖项包含所有配置和数据源

  // ==========================================
  // I. 挂载和实例化 (Mount)
  // ==========================================
  useEffect(() => {
    if (!DxDataGrid || !dataGridContainerRef.current) {
      return;
    }

    // --- 1. 实例化 DataGrid ---
    // fullConfig 已经包含了 dataSource
    const instance = new DxDataGrid(dataGridContainerRef.current, fullConfig);
    dataGridInstanceRef.current = instance;

    // ==========================================
    // II. 卸载 (Unmount) - 销毁实例
    // ==========================================
    return () => {
      if (dataGridInstanceRef.current) {
        // 销毁 DataGrid 实例
        dataGridInstanceRef.current.dispose();
        dataGridInstanceRef.current = null;
      }
    };
  }, []); // 仅在挂载时执行一次

  // ==========================================
  // III. 更新 (Update)
  // ==========================================
  useEffect(() => {
    const instance = dataGridInstanceRef.current;
    if (instance) {
      // 当配置或数据变化时，更新 DataGrid 实例的配置
      instance.option(fullConfig);
    }
  }, [fullConfig]); // 依赖于 fullConfig 变化

  // ==========================================
  // IV. 渲染
  // ==========================================
  return (
    <div 
      ref={dataGridContainerRef} 
      // DataGrid 容器
      style={{ width: '100%', height: '100%' }} // 默认 DataGrid 铺满父容器
      className={className} 
    />
  );
}