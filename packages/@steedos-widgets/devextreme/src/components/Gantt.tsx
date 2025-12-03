import React, { useEffect, useRef, useMemo } from 'react';
// 假设 UMD 脚本已加载，并获取全局的 DevExtreme dxGantt 构造函数
const DxGantt: any = (window as any).DevExpress?.ui?.dxGantt;

if (!DxGantt) {
    console.warn("DevExtreme Gantt UMD 模块未找到。请确保 UMD 脚本已正确加载。");
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
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme Gantt。
 */
export const AmisGantt = ( {
  data: amisData,
  config, 
  className, 
  ...props
} : any) => {
  
  // 1. DOM 引用：用于挂载 Gantt
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  // 2. DevExtreme 实例引用
  const ganttInstanceRef = useRef<any>(null);

  // 3. 处理配置和数据过滤，并构造完整的配置对象
  const fullConfig = useMemo(() => {
    let baseConfig = parseConfig(config);
    
    // 处理 dataFilter 逻辑 (与原代码保持一致)
    let onDataFilter = props.onDataFilter;
    const dataFilter = props.dataFilter;

    if (!onDataFilter && typeof dataFilter === 'string') {
      try {
        onDataFilter = new Function(
          'config',
          'Gantt',
          'data',
          dataFilter
        ) as any;
      } catch (e) {
        console.warn("DataFilter 函数创建失败:", e);
      }
    }

    try {
      // 注意：这里的 'Gantt' 应该指向 UMD 实例，即 DxGantt
      onDataFilter &&
        (baseConfig =
          onDataFilter(baseConfig, DxGantt, amisData) || baseConfig);
    } catch (e) {
      console.warn("DataFilter 执行错误:", e);
    }
    
    // --- 核心：将子组件配置合并到主配置对象中 ---
    
    const finalConfig = {
      // 默认/硬编码属性 (来自原 <Gantt> 标签的属性)
      taskListWidth: 500,
      scaleType: "weeks",
      height: 700,
      
      // 合并外部传入的配置
      ...baseConfig,
      ...props, 
      
      // 数据源配置 (需要明确设置，如果 amisData 包含了所有数据)
      // DevExtreme Gantt 需要分开设置任务、依赖、资源等数据源
      tasks: amisData?.tasks || [], 
      dependencies: amisData?.dependencies || [], 
      resources: amisData?.resources || [],
      resourceAssignments: amisData?.resourceAssignments || [],
      
      // UMD/JS 对象格式的子组件配置
      editing: {
        enabled: true
      },
      validation: {
        autoUpdateParentTasks: true
      },
      // 字段列配置
      columns: [
        { dataField: "title", caption: "Subject", width: 300 },
        { dataField: "start", caption: "Start Date" },
        { dataField: "end", caption: "End Date" },
      ],
      // 工具栏配置
      toolbar: {
        items: [
          { name: "undo" },
          { name: "redo" },
          { name: "separator" },
          { name: "collapseAll" },
          { name: "expandAll" },
          { name: "separator" },
          { name: "addTask" },
          { name: "deleteTask" },
          { name: "separator" },
          { name: "zoomIn" },
          { name: "zoomOut" },
        ]
      }
    };
    
    return finalConfig;
  }, [config, props, amisData]); // 依赖于原始 props 和数据

  // ==========================================
  // I. 挂载和实例化 (Mount)
  // ==========================================
  useEffect(() => {
    if (!DxGantt || !ganttContainerRef.current) {
      return;
    }

    // 实例化 DevExtreme Gantt，使用完整的配置对象
    const instance = new DxGantt(ganttContainerRef.current, fullConfig);
    ganttInstanceRef.current = instance;

    // ==========================================
    // II. 卸载 (Unmount) - 销毁实例
    // ==========================================
    return () => {
      if (ganttInstanceRef.current) {
        // 销毁实例以释放资源和事件处理程序
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
      className={className} 
      style={{ width: '100%', height: fullConfig.height || 700 }} // 设置高度
    />
  );
}