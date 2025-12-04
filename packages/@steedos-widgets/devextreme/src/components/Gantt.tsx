import React, { useEffect, useRef, useMemo } from 'react';

// 假设 UMD 脚本已加载，并获取全局的 DevExtreme Gantt 构造函数
const DxGantt: any = (window as any).DevExpress?.ui?.dxGantt;
const DevExpress: any = (window as any).DevExpress;

if (!DxGantt) {
    console.warn("DevExtreme Gantt UMD 模块未找到。请确保 UMD 脚本已正确加载。");
}

// 定义 props 接口
interface AmisGanttProps {
  // Gantt 组件通常需要一个包含任务数据的对象，
  // 结构可能更复杂 (tasks, resources, dependencies)
  data: any; 
  className?: string; 
  config?: object; 
  configAdaptor?: string;
  onConfigAdaptor?: (config: any, data: any) => any;
  [key: string]: any; 
}

/**
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme Gantt 图。
 */
export const AmisGantt = ( {
  data: amisData,
  className, 
  config,
  configAdaptor, 
  onConfigAdaptor, 
  ...props
} : AmisGanttProps) => {
  
  // 1. DOM 引用：用于挂载 Gantt 图
  const ganttContainerRef = useRef<HTMLDivElement>(null);

  // 2. DevExtreme Gantt 实例引用
  const ganttInstanceRef = useRef<any>(null);

  // 3. 处理配置和数据过滤 (保持与 DataGrid/PivotGrid 一致的逻辑)
  const fullConfig = useMemo(() => {
    let baseConfig = config;
    
    let filterFn = onConfigAdaptor;

    if (!filterFn) {
        if (typeof configAdaptor === 'string') {
            try {
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

    try {
      if (filterFn) {
        const newConfig = filterFn(baseConfig, amisData);
        if (newConfig) {
            baseConfig = newConfig;
        }
      }
    } catch (e) {
      console.warn("configAdaptor 执行错误:", e);
    }
    
    // DevExtreme Gantt 需要一个 height，通常设置为 100% 或固定值
    const finalConfig = {
      // 默认设置：例如，允许编辑、默认高度
      allowSelection: true,
      height: '100%', 
      
      ...baseConfig,
      ...props, 
      
      // Gantt 的数据源通常包含在 amisData 中，
      // 但我们需要将其作为配置的一部分传入。
      // DevExtreme Gantt 通常将数据源分为 tasks, dependencies, resources 等。
      // 为了与amisData适配，我们假设 amisData 包含了所有所需的数据配置。
      // 如果 amisData 是一个对象且包含 'tasks' 属性，则使用它。
      // 如果 amisData 是一个数组，则假设它是任务数据，并手动创建 dataSource.
      
      // 这是一个简化的假设，实际应用中可能需要更复杂的适配逻辑：
      tasks: Array.isArray(amisData) ? { dataSource: amisData } : props?.tasks,
      
      // 简化处理，将 amisData 直接映射到 tasks.dataSource，如果 amisData是数组
      ...(Array.isArray(amisData) && { 
        tasks: { dataSource: amisData } 
      }),
      // 如果不是数组，则假设任务、依赖、资源等配置都在 baseConfig/props 中
    };

    return finalConfig;
  }, [configAdaptor, onConfigAdaptor, props, amisData, config]);

  // ==========================================
  // I. 挂载和实例化 (Mount)
  // ==========================================
  useEffect(() => {
    if (!DxGantt || !ganttContainerRef.current) {
      return;
    }

    // --- 1. 实例化 Gantt ---
    const instance = new DxGantt(ganttContainerRef.current, fullConfig);
    ganttInstanceRef.current = instance;

    // ==========================================
    // II. 卸载 (Unmount) - 销毁实例
    // ==========================================
    return () => {
      if (ganttInstanceRef.current) {
        // 销毁 Gantt 实例
        ganttInstanceRef.current.dispose();
        ganttInstanceRef.current = null;
      }
    };
  }, []); // 仅在挂载时执行一次

  // ==========================================
  // III. 更新 (Update)
  // ==========================================
  useEffect(() => {
    const instance = ganttInstanceRef.current;
    if (instance) {
      // 当配置或数据变化时，更新 Gantt 实例的配置
      instance.option(fullConfig);
    }
  }, [fullConfig]); // 依赖于 fullConfig 变化

  // ==========================================
  // IV. 渲染
  // ==========================================
  return (
    <div 
      ref={ganttContainerRef} 
      // 必须设置高度，否则 Gantt 组件可能不显示
      style={{ width: '100%', height: '500px' }} // 默认给一个固定高度
      className={className} 
    />
  );
}