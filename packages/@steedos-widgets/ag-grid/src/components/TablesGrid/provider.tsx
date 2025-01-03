/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 18:58:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-01-03 15:38:06
 */
import React, { createContext, useContext, ReactNode } from 'react';
import {
  ColDef,
} from "ag-grid-community";
// import { AmisAgGrid } from './AgGrid';

// type TablesGridProviderProps = {
//   getColumns: () => ColDef[];
//   getRows: (params: any) => void; 
// };

// export const TablesGridProvider: React.FC<TablesGridProviderProps> = (props) => {
//   const {
//     getColumns,
//     getRows,
//   } = props;
//   // console.log('AmisAgGrid===configJSON===', configJSON);
//   // const initConfig = Object.assign({ localeText: AG_GRID_LOCALE_CN }, configJSON || {});
//   // const [config, setConfig] = useState(initConfig);
//   // 如果不增加dataFilterLoaded机制，组件传入的configJSON初始不是null的时候会造成后面的agGrid.createGrid执行两次出现两个grid
//   const [dataFilterLoaded, setDataFilterLoaded] = useState(!!!(dataFilter || onDataFilterFun));
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   return (
//     <AmisAgGrid
//       ref={wrapperRef}
//       {...props}
//     />)
// };




// type TablesGridContextType = {
//   getColumns: () => ColDef[];
//   getRows: (params: any) => void; // Replace `any` with the actual type if available
// };

// const defaultValue: TablesGridContextType = {
//   getColumns: () => [],
//   getRows: (params: any) => {},
// };

// const TablesGridContext = createContext<TablesGridContextType>(defaultValue);

// export const TablesGridProvider = ({ children }: { children: React.ReactNode }) => {
//   const getColumns = (): ColDef[] => {
//     // Define your columns here
//     return [];
//   };

//   const getRows = (params: any): void => {
//     // Implement your logic to fetch rows here
//   };

//   return (
//     <TablesGridContext.Provider value={{ getColumns, getRows }}>
//       {children}
//     </TablesGridContext.Provider>
//   );
// };

type TableMetaProps = {
  _id: string;
  label: string;
  fields: any[];
  [key: string]: any;
};

interface TablesGridContextProps {
  getTableMeta: () => Promise<TableMetaProps>;
  getColumnDefs: () => ColDef[];
  getRows: (params: any) => void;
}


// const defaultValue: TablesGridContextProps = {
//   getTableMeta: () => { return {} },
//   getColumns: () => [],
//   getRows: (params: any) => {}
// };

// 创建上下文
export const TablesGridContext = createContext<TablesGridContextProps | undefined>(undefined);

// 定义 TablesGridProvider 的 props 类型
interface TablesGridProviderProps {
  children: ReactNode;
  getTableMeta: () => Promise<TableMetaProps>;
  getColumnDefs?: () => ColDef[];
  getRows: (params: any) => {};
}

// 定义 TablesGridProvider 组件
export const TablesGridProvider: React.FC<TablesGridProviderProps> = ({ children, getTableMeta, getColumnDefs, getRows }) => {
  return (
    <TablesGridContext.Provider value={{ getTableMeta, getColumnDefs, getRows }}>
      {children}
    </TablesGridContext.Provider>
  );
};

// Custom hook to use the TablesGridContext
export const useTablesGridContext = () => {
  return useContext(TablesGridContext);
};



