import React, { useEffect, useRef } from 'react';

// 假设 UMD 脚本已加载，并且 DevExpress.ui.dxDataGrid 可用
// 注意：移除了不必要的 import DevExpress from './DevExpress';
// 明确定义 DevExtreme Grid UMD 类的类型（简单起见，使用 any，实际应用中建议导入 DevExtreme 类型）
const DxDataGrid: any = (window as any).DevExpress?.ui?.dxDataGrid; 

if (!DxDataGrid) {
    console.warn("DevExtreme DataGrid UMD 模块未找到。请确保 UMD 脚本已正确加载。");
}

/**
 * React 包装组件，用于渲染 UMD 格式的 DevExtreme DataGrid。
 * @param {object} props - 组件属性，包括 Grid 配置、数据等。
 */
export const AmisDataGrid = (props: any) => {
  const {
    // config 是外部传入的静态配置
    config = {},
    // amisData 可能是需要实时更新的数据源
    data: amisData, 
    // 其他不属于 DevExtreme 配置的属性
    className,
    dataFilter, 
    // 剩下的属性被认为是 DevExtreme 的配置
    ...restConfig
  } = props;

  // 1. 使用 useRef 创建一个 DOM 引用，用于挂载 Grid
  const gridContainerRef = useRef<HTMLDivElement>(null);
  // 2. 使用 useRef 存储 DevExtreme Grid 实例
  const gridInstanceRef = useRef<any>(null); // 存储 DevExtreme 实例

  // 构建完整的 DevExtreme 配置对象
  const fullConfig = {
    ...config,
    ...restConfig,
  };

  // ==========================================
  // 组件挂载时 (Mount) - 实例化 Grid
  // ==========================================
  useEffect(() => {
      if (!DxDataGrid || !gridContainerRef.current) {
          return;
      }

      // 实例化 DevExtreme DataGrid，使用完整的配置对象
      const instance = new DxDataGrid(gridContainerRef.current, fullConfig);
      gridInstanceRef.current = instance;

      // ==========================================
      // 组件卸载时 (Unmount) - 销毁 Grid 实例
      // ==========================================
      return () => {
          if (gridInstanceRef.current) {
              // 销毁实例以释放资源和事件处理程序
              gridInstanceRef.current.dispose();
              gridInstanceRef.current = null;
          }
      };
      // 依赖项 `fullConfig` 在此处会导致组件反复实例化和销毁，
      // 所以我们只依赖于 UMD 模块和容器引用。
  }, []); 

  // ==========================================
  // Props 更新时 (Update) - 更新 Grid 配置
  // 仅在 Grid 实例存在时调用 .option()
  // ==========================================
  useEffect(() => {
      const instance = gridInstanceRef.current;
      if (instance) {
          // 使用 instance.option() 方法更新 Grid 的配置
          // 注意：这将会触发 DevExtreme 的内部更新机制，比手动检查每个属性更有效率。
          instance.option(fullConfig);
      }
      // 依赖于完整的配置对象。
      // 注意: 由于 fullConfig 是在每次渲染时创建的新对象，它作为依赖项会导致每次 props 变化时执行更新。
      // 对于 DataGrid 来说，这是处理配置和数据变化的必要方式。
  }, [fullConfig]); 
  
  return (
        <div 
          ref={gridContainerRef} 
          className={className} // 将 className 传递给容器 div
          // 可以在 config 或 restConfig 中控制样式，但此处为了示例保持了硬编码样式
          style={{ width: '100%', height: '400px' }} 
        />
    );
};