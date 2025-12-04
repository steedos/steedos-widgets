import React, { useEffect, useRef, useMemo } from 'react';

// 假设 UMD 脚本已加载，并获取全局的 DevExtreme Scheduler 构造函数
const DxScheduler: any = (window as any).DevExpress?.ui?.dxScheduler;
const DevExpress: any = (window as any).DevExpress;

if (!DxScheduler) {
    console.warn("DevExtreme Scheduler UMD 模块未找到。请确保 UMD 脚本已正确加载。");
}

// 定义 props 接口
interface AmisSchedulerProps {
  // Scheduler 组件需要一个包含日程事件数据的数组
  data: any; 
  className?: string; 
  config?: object; // 基础配置
  configAdaptor?: string;
  onConfigAdaptor?: (config: any, data: any) => any;
  [key: string]: any; 
}

/**
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme Scheduler 日程表。
 */
export const AmisScheduler = ( {
  data: amisData,
  className, 
  config,
  configAdaptor, 
  onConfigAdaptor, 
  ...props
} : AmisSchedulerProps) => {
  
  // 1. DOM 引用：用于挂载 Scheduler
  const schedulerContainerRef = useRef<HTMLDivElement>(null);

  // 2. DevExtreme Scheduler 实例引用
  const schedulerInstanceRef = useRef<any>(null);

  // 3. 处理配置和数据过滤
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
    
    // Scheduler 的关键配置，例如数据源、当前日期、视图等
    const finalConfig = {
      // 默认设置：
      // 设置数据源为传入的 amisData
      dataSource: amisData, 
      // 默认视图：Day
      currentView: 'Day', 
      // 默认日期：当前日期
      currentDate: new Date(),
      // 默认允许编辑
      editing: true, 
      height: '100%', 
      
      ...baseConfig,
      ...props, 
    };

    return finalConfig;
  }, [configAdaptor, onConfigAdaptor, props, amisData, config]);

  // ==========================================
  // I. 挂载和实例化 (Mount)
  // ==========================================
  useEffect(() => {
    if (!DxScheduler || !schedulerContainerRef.current) {
      return;
    }

    // --- 1. 实例化 Scheduler ---
    // fullConfig 已经包含了 dataSource
    const instance = new DxScheduler(schedulerContainerRef.current, fullConfig);
    schedulerInstanceRef.current = instance;

    // ==========================================
    // II. 卸载 (Unmount) - 销毁实例
    // ==========================================
    return () => {
      if (schedulerInstanceRef.current) {
        // 销毁 Scheduler 实例
        schedulerInstanceRef.current.dispose();
        schedulerInstanceRef.current = null;
      }
    };
  }, []); // 仅在挂载时执行一次

  // ==========================================
  // III. 更新 (Update)
  // ==========================================
  useEffect(() => {
    const instance = schedulerInstanceRef.current;
    if (instance) {
      // 当配置或数据变化时，更新 Scheduler 实例的配置
      instance.option(fullConfig);
    }
  }, [fullConfig]); // 依赖于 fullConfig 变化

  // ==========================================
  // IV. 渲染
  // ==========================================
  return (
    <div 
      ref={schedulerContainerRef} 
      // 必须设置高度，否则组件可能不显示
      style={{ width: '100%', height: '600px' }} // 默认给一个固定高度
      className={className} 
    />
  );
}