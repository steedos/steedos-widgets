# API Reference - API 参考文档

本文档详细说明 Steedos Widgets 项目中的关键 API、接口和配置选项。

## 目录

1. [组件 Props API](#组件-props-api)
2. [Amis 集成 API](#amis-集成-api)
3. [元数据配置 API](#元数据配置-api)
4. [资产包配置 API](#资产包配置-api)
5. [构建配置 API](#构建配置-api)

## 组件 Props API

### 基础 Props

所有组件应该支持的基础属性：

```typescript
interface BaseComponentProps {
  /**
   * 组件的 CSS 类名
   */
  className?: string;
  
  /**
   * 组件的内联样式
   */
  style?: React.CSSProperties;
  
  /**
   * Amis classnames 工具函数
   * 用于条件性地组合 CSS 类名
   * 
   * @example
   * const className = classnames('base-class', {
   *   'active': isActive,
   *   'disabled': isDisabled
   * });
   */
  classnames?: (...args: (string | Record<string, boolean> | false | null | undefined)[]) => string;
  
  /**
   * 组件是否禁用
   */
  disabled?: boolean;
  
  /**
   * 组件是否只读
   */
  readonly?: boolean;
  
  /**
   * 组件的唯一标识
   */
  id?: string;
}
```

### 表单字段 Props

表单字段组件应该实现的接口：

```typescript
interface FormFieldProps extends BaseComponentProps {
  /**
   * 字段名称
   */
  name?: string;
  
  /**
   * 字段标签
   */
  label?: string;
  
  /**
   * 字段值
   */
  value?: any;
  
  /**
   * 值变化回调
   * @param value - 新的值
   */
  onChange?: (value: any) => void;
  
  /**
   * 失去焦点回调
   */
  onBlur?: () => void;
  
  /**
   * 获得焦点回调
   */
  onFocus?: () => void;
  
  /**
   * 是否必填
   */
  required?: boolean;
  
  /**
   * 占位符文本
   */
  placeholder?: string;
  
  /**
   * 验证规则
   */
  validations?: {
    [key: string]: any;
  };
  
  /**
   * 验证错误信息
   */
  validationErrors?: {
    [key: string]: string;
  };
  
  /**
   * 描述文本
   */
  description?: string;
  
  /**
   * 表单存储对象
   * Amis 表单提供
   */
  formStore?: any;
  
  /**
   * 添加表单钩子
   */
  addHook?: (fn: Function, type: string) => void;
  
  /**
   * 移除表单钩子
   */
  removeHook?: (fn: Function, type: string) => void;
}
```

### Amis 渲染器 Props

与 Amis 集成的组件会接收的特殊属性：

```typescript
interface AmisRendererProps extends BaseComponentProps {
  /**
   * Amis 渲染函数
   * 用于渲染子 Schema
   * 
   * @param region - 区域名称
   * @param schema - 要渲染的 Schema
   * @param props - 传递给渲染器的属性
   * @returns React 节点
   * 
   * @example
   * render('body', {
   *   type: 'tpl',
   *   tpl: '<div>${name}</div>'
   * }, { data: item })
   */
  render?: (
    region: string,
    schema: any,
    props?: any
  ) => React.ReactNode;
  
  /**
   * Amis 环境对象
   * 包含 fetcher, notify 等工具
   */
  env?: {
    /**
     * 数据请求函数
     */
    fetcher: (config: {
      url: string;
      method?: string;
      data?: any;
      headers?: Record<string, string>;
    }) => Promise<any>;
    
    /**
     * 通知函数
     */
    notify: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
    
    /**
     * 确认对话框
     */
    confirm: (msg: string) => Promise<boolean>;
    
    /**
     * Alert 对话框
     */
    alert: (msg: string) => void;
    
    /**
     * 其他环境配置
     */
    [key: string]: any;
  };
  
  /**
   * 数据作用域
   * 包含当前上下文的所有数据
   */
  data?: Record<string, any>;
  
  /**
   * 组件作用域
   * 包含组件方法和状态
   */
  scope?: any;
  
  /**
   * 触发事件
   * 
   * @param eventName - 事件名称
   * @param eventData - 事件数据
   * @param callback - 回调函数
   * 
   * @example
   * dispatchEvent('click', {
   *   data: { id: 1 }
   * });
   */
  dispatchEvent?: (
    eventName: string,
    eventData?: any,
    callback?: (result: any) => void
  ) => void;
}
```

### 数据源 Props

支持数据加载的组件接口：

```typescript
interface DataSourceProps {
  /**
   * 静态数据源
   */
  items?: any[];
  
  /**
   * API 数据源
   * 可以是字符串 URL 或 API 配置对象
   */
  source?: string | {
    url: string;
    method?: 'get' | 'post' | 'put' | 'delete';
    data?: any;
    headers?: Record<string, string>;
    sendOn?: string;  // 条件发送
    adaptor?: string;  // 数据适配器
  };
  
  /**
   * 数据适配器
   * 在数据返回后进行转换
   * 
   * @example
   * dataAdaptor: "return { items: payload.data.list }"
   */
  dataAdaptor?: string;
  
  /**
   * 是否正在加载
   */
  loading?: boolean;
  
  /**
   * 加载错误
   */
  error?: Error | string;
}
```

## Amis 集成 API

### 注册渲染器

```typescript
/**
 * 注册 Amis 渲染器
 * 
 * @param config - 渲染器配置
 * @returns 渲染器类装饰器
 */
function Renderer(config: {
  /**
   * 渲染器类型
   * 对应 Schema 中的 type 字段
   */
  type: string;
  
  /**
   * 使用场景
   * - renderer: 普通渲染器
   * - formitem: 表单字段
   */
  usage?: 'renderer' | 'formitem';
  
  /**
   * 权重
   * 多个渲染器类型相同时，权重高的优先
   */
  weight?: number;
  
  /**
   * 框架类型
   */
  framework?: 'react' | 'vue';
  
  /**
   * 是否自动处理值变化
   */
  autoVar?: boolean;
}): ClassDecorator;

/**
 * 使用示例
 */
@Renderer({
  type: 'my-widget',
  usage: 'formitem',
  weight: 1,
  framework: 'react'
})
class MyWidgetRenderer extends React.Component {
  render() {
    return <MyWidget {...this.props} />;
  }
}
```

### 注册编辑器插件

```typescript
/**
 * 注册编辑器插件
 * 
 * @param plugin - 插件类
 */
function registerEditorPlugin(plugin: typeof BasePlugin): void;

/**
 * 基础插件类
 */
class BasePlugin {
  /**
   * 渲染器名称
   */
  rendererName: string;
  
  /**
   * 插件名称
   */
  name: string;
  
  /**
   * 插件描述
   */
  description?: string;
  
  /**
   * 插件标签
   */
  tags?: string[];
  
  /**
   * 图标
   */
  icon?: string;
  
  /**
   * 排序权重
   */
  order?: number;
  
  /**
   * 脚手架
   * 组件的默认 Schema
   */
  scaffold?: Record<string, any>;
  
  /**
   * 预览 Schema
   */
  previewSchema?: Record<string, any>;
  
  /**
   * 属性面板标题
   */
  panelTitle?: string;
  
  /**
   * 属性面板控件
   */
  panelControls?: any[];
  
  /**
   * 区域配置
   */
  regions?: Array<{
    key: string;
    label: string;
    placeholder?: string;
  }>;
  
  /**
   * 构建数据 Schema
   */
  buildDataSchemas?(node: any, region: string): any;
  
  /**
   * 构建编辑器面板
   */
  buildEditorPanel?(context: any): any;
}
```

## 元数据配置 API

### ComponentMeta 接口

```typescript
/**
 * 组件元数据配置
 */
interface ComponentMeta {
  /**
   * 组件类型
   * - amisSchema: 纯 Schema 组件
   * - react: React 自定义渲染器
   */
  componentType?: 'amisSchema' | 'react';
  
  /**
   * 组件分组
   * 决定在编辑器中的分类
   */
  group: string;
  
  /**
   * 组件唯一标识
   */
  componentName: string;
  
  /**
   * 组件显示名称
   */
  title: string;
  
  /**
   * 文档地址
   */
  docUrl?: string;
  
  /**
   * 截图
   */
  screenshot?: string;
  
  /**
   * NPM 包信息
   */
  npm: {
    /**
     * 包名称
     */
    package: string;
    
    /**
     * 版本
     * 使用 {{version}} 占位符
     */
    version: string;
    
    /**
     * 导出名称
     */
    exportName: string;
    
    /**
     * 主文件路径
     */
    main?: string;
    
    /**
     * 是否使用解构导入
     */
    destructuring?: boolean;
    
    /**
     * 子导出名称
     */
    subName?: string;
  };
  
  /**
   * 预览配置
   */
  preview?: Record<string, any>;
  
  /**
   * 适用的页面类型
   */
  targets?: string[];
  
  /**
   * 支持的引擎
   */
  engines?: string[];
  
  /**
   * Amis 配置
   */
  amis?: {
    /**
     * 渲染器名称
     */
    name: string;
    
    /**
     * 图标
     */
    icon?: string;
  };
  
  /**
   * 代码片段
   */
  snippets?: Array<{
    title: string;
    screenshot?: string;
    schema: Record<string, any>;
  }>;
  
  /**
   * 属性定义
   */
  props?: Array<{
    name: string;
    propType: string;
    description?: string;
    defaultValue?: any;
  }>;
}
```

### PanelControl 类型

属性面板控件配置：

```typescript
/**
 * 面板控件联合类型
 */
type PanelControl = 
  | TextControl
  | NumberControl
  | SwitchControl
  | SelectControl
  | TabsControl
  | FieldSetControl
  | ComboControl
  | EditorControl;

/**
 * 文本输入控件
 */
interface TextControl {
  type: 'input-text';
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  visibleOn?: string;
  value?: string;
}

/**
 * 数字输入控件
 */
interface NumberControl {
  type: 'input-number';
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  value?: number;
}

/**
 * 开关控件
 */
interface SwitchControl {
  type: 'switch';
  name: string;
  label: string;
  onText?: string;
  offText?: string;
  value?: boolean;
}

/**
 * 下拉选择控件
 */
interface SelectControl {
  type: 'select';
  name: string;
  label: string;
  options: Array<{
    label: string;
    value: any;
  }>;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  value?: any;
}

/**
 * 标签页控件
 */
interface TabsControl {
  type: 'tabs';
  tabs: Array<{
    title: string;
    body: PanelControl[];
  }>;
}

/**
 * 字段集控件
 */
interface FieldSetControl {
  type: 'fieldset';
  title: string;
  collapsable?: boolean;
  collapsed?: boolean;
  body: PanelControl[];
}

/**
 * 组合控件
 */
interface ComboControl {
  type: 'combo';
  name: string;
  label: string;
  multiple?: boolean;
  multiLine?: boolean;
  items: PanelControl[];
  scaffold?: Record<string, any>;
}

/**
 * 代码编辑器控件
 */
interface EditorControl {
  type: 'editor';
  name: string;
  label: string;
  language?: 'javascript' | 'json' | 'html' | 'css' | 'typescript';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}
```

## 资产包配置 API

### Assets.json 结构

```typescript
/**
 * 资产包配置
 */
interface AssetsConfig {
  /**
   * 包配置
   */
  packages: PackageConfig[];
  
  /**
   * 组件配置
   */
  components: ComponentConfig[];
}

/**
 * 包配置
 */
interface PackageConfig {
  /**
   * NPM 包名
   */
  package: string;
  
  /**
   * 资源 URL 列表
   * 通常包含 JS 和 CSS 文件
   */
  urls: string[];
  
  /**
   * UMD 全局变量名
   */
  library: string;
}

/**
 * 组件配置
 */
interface ComponentConfig {
  /**
   * 元数据导出名称
   */
  exportName: string;
  
  /**
   * NPM 包信息
   */
  npm: {
    package: string;
  };
  
  /**
   * 元数据文件 URL
   */
  url: string;
  
  /**
   * 不同场景的 URL
   */
  urls: {
    /**
     * 默认 URL
     */
    default: string;
    
    /**
     * 设计器 URL
     */
    design: string;
  };
}
```

## 构建配置 API

### Rollup 配置选项

```typescript
/**
 * Rollup 配置
 */
interface RollupConfig {
  /**
   * 入口文件
   */
  input: string | string[];
  
  /**
   * 输出配置
   */
  output: OutputConfig | OutputConfig[];
  
  /**
   * 外部依赖
   */
  external?: string[] | ((id: string) => boolean);
  
  /**
   * 插件
   */
  plugins?: Plugin[];
  
  /**
   * 监听选项
   */
  watch?: {
    include?: string | string[];
    exclude?: string | string[];
  };
}

/**
 * 输出配置
 */
interface OutputConfig {
  /**
   * 输出文件路径
   */
  file?: string;
  
  /**
   * 输出目录
   */
  dir?: string;
  
  /**
   * 输出格式
   */
  format: 'cjs' | 'es' | 'esm' | 'umd' | 'iife';
  
  /**
   * UMD/IIFE 全局变量名
   */
  name?: string;
  
  /**
   * 是否生成 sourcemap
   */
  sourcemap?: boolean | 'inline' | 'hidden';
  
  /**
   * 外部依赖的全局变量映射
   */
  globals?: Record<string, string>;
  
  /**
   * 输出插件
   */
  plugins?: Plugin[];
  
  /**
   * 入口代码
   */
  intro?: string;
  
  /**
   * 结尾代码
   */
  outro?: string;
}
```

### TypeScript 配置选项

```typescript
/**
 * tsconfig.json 配置
 */
interface TSConfig {
  /**
   * 编译选项
   */
  compilerOptions: {
    /**
     * 目标 ES 版本
     */
    target?: 'ES3' | 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ES2018' | 'ES2019' | 'ES2020' | 'ESNext';
    
    /**
     * 模块系统
     */
    module?: 'CommonJS' | 'AMD' | 'UMD' | 'ES6' | 'ES2015' | 'ES2020' | 'ESNext' | 'None';
    
    /**
     * JSX 处理
     */
    jsx?: 'preserve' | 'react' | 'react-jsx' | 'react-jsxdev' | 'react-native';
    
    /**
     * 输出目录
     */
    outDir?: string;
    
    /**
     * 根目录
     */
    rootDir?: string;
    
    /**
     * 声明文件输出目录
     */
    declarationDir?: string;
    
    /**
     * 是否生成声明文件
     */
    declaration?: boolean;
    
    /**
     * 是否只生成声明文件
     */
    emitDeclarationOnly?: boolean;
    
    /**
     * 是否跳过库检查
     */
    skipLibCheck?: boolean;
    
    /**
     * ES 模块互操作
     */
    esModuleInterop?: boolean;
  };
  
  /**
   * 包含的文件
   */
  include?: string[];
  
  /**
   * 排除的文件
   */
  exclude?: string[];
}
```

## 环境变量

```bash
# 资产包 URL
# 多个 URL 用逗号分隔
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/antd/dist/assets-dev.json,http://127.0.0.1:8080/@steedos-widgets/amis-object/dist/assets-dev.json

# unpkg 地址（可选）
# 默认为 https://unpkg.com
STEEDOS_UNPKG_URL=https://unpkg.com

# 开发服务器端口（可选）
# 默认为 8080
PORT=8080
```

## 命令行 API

### Lerna 命令

```bash
# 引导所有包
lerna bootstrap

# 清理所有 node_modules
lerna clean

# 运行所有包的脚本
lerna run <script>

# 并行运行
lerna run --parallel <script>

# 发布包
lerna publish

# 查看变更的包
lerna changed

# 执行命令
lerna exec -- <command>
```

### Yarn 命令

```bash
# 安装依赖
yarn install

# 添加依赖
yarn add <package>

# 添加开发依赖
yarn add -D <package>

# 在工作区添加依赖
yarn workspace <workspace-name> add <package>

# 运行脚本
yarn <script>

# 在工作区运行脚本
yarn workspace <workspace-name> <script>
```

## 总结

本 API 参考文档涵盖了：

1. **组件接口**: 定义组件 Props 的标准接口
2. **Amis 集成**: 渲染器和编辑器插件 API
3. **元数据配置**: 组件元数据的完整结构
4. **资产包配置**: assets.json 的格式规范
5. **构建配置**: Rollup 和 TypeScript 配置选项

使用这些 API 可以确保组件的一致性和可维护性。
