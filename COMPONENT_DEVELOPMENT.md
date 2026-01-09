# Component Development Guide - 组件开发详细指南

本文档详细说明如何在 Steedos Widgets 项目中开发新的组件包。

## 目录

1. [创建新组件包](#创建新组件包)
2. [组件实现规范](#组件实现规范)
3. [元数据配置详解](#元数据配置详解)
4. [资产包配置](#资产包配置)
5. [Rollup 配置](#rollup-配置)
6. [完整示例](#完整示例)

## 创建新组件包

### 1. 创建包目录结构

```bash
cd packages/@steedos-widgets
mkdir my-widget
cd my-widget

# 创建标准目录结构
mkdir -p src/components
mkdir -p src/metas
```

### 2. 创建 package.json

```json
{
  "name": "@steedos-widgets/my-widget",
  "private": false,
  "version": "6.10.51",
  "main": "dist/my-widget.cjs.js",
  "module": "dist/my-widget.esm.js",
  "unpkg": "dist/my-widget.umd.js",
  "typings": "dist/my-widget.d.ts",
  "files": ["dist"],
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "yarn build-types && yarn build-rollup",
    "build-types": "tsc --emitDeclarationOnly --declaration --declarationDir dist/types",
    "build-rollup": "rollup -c rollup.config.ts"
  },
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "devDependencies": {
    "@rollup/plugin-babel": "^5.3.1",
    "@rollup/plugin-commonjs": "^29.0.0",
    "@rollup/plugin-node-resolve": "^13.1.3",
    "@rollup/plugin-typescript": "^8.4.0",
    "@types/react": "^18.0.8",
    "@types/react-dom": "^18.0.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "rollup": "^2.79.2",
    "rollup-plugin-postcss": "^4.0.2",
    "rollup-plugin-terser": "^7.0.2"
  },
  "dependencies": {
    // 组件特定依赖
  }
}
```

### 3. 创建 tsconfig.json

```json
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declarationDir": "./dist/types"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

## 组件实现规范

### 基础组件模板

```typescript
// src/components/MyWidget.tsx
import React, { useState, useCallback, useMemo } from 'react';
import './MyWidget.css';

/**
 * 组件属性接口
 * 
 * @property value - 组件值
 * @property onChange - 值变化回调
 * @property disabled - 是否禁用
 * @property placeholder - 占位符文本
 */
export interface MyWidgetProps {
  // 基础属性
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  placeholder?: string;
  
  // Amis 相关属性
  render?: (schema: any, props?: any, scope?: any) => React.ReactNode;
  env?: any;
  scope?: any;
  data?: any;
  
  // 自定义属性
  customProp?: string;
  
  // 样式相关
  className?: string;
  style?: React.CSSProperties;
  classnames?: (...args: any[]) => string;
}

/**
 * MyWidget 组件
 * 
 * 这是一个示例组件，展示了标准的组件结构
 */
export const MyWidget: React.FC<MyWidgetProps> = (props) => {
  const {
    value,
    onChange,
    disabled = false,
    placeholder = '请输入',
    customProp,
    className,
    style,
    classnames: cx,
    render,
    env,
    scope,
    data
  } = props;
  
  // 内部状态
  const [internalState, setInternalState] = useState('');
  
  // 处理器使用 useCallback 优化
  const handleChange = useCallback((newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);
  
  // 计算属性使用 useMemo 优化
  const computedValue = useMemo(() => {
    return value || internalState;
  }, [value, internalState]);
  
  // 组件类名组合
  const wrapperClass = cx ? cx('MyWidget-Wrapper', className) : className;
  
  return (
    <div className={wrapperClass} style={style}>
      <input
        type="text"
        value={computedValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
      {customProp && <span>{customProp}</span>}
    </div>
  );
};

// 默认导出（可选）
export default MyWidget;
```

### 高级组件模式

#### 1. 支持 Amis 模板渲染

```typescript
import React from 'react';

export interface TemplateWidgetProps {
  items?: any[];
  itemTemplate?: string;
  render?: (schema: any, props?: any, scope?: any) => React.ReactNode;
  scope?: any;
}

export const TemplateWidget: React.FC<TemplateWidgetProps> = (props) => {
  const { items = [], itemTemplate, render, scope } = props;
  
  return (
    <div className="template-widget">
      {items.map((item, index) => {
        // 如果有自定义模板，使用 Amis 渲染
        if (itemTemplate && render) {
          return (
            <div key={index}>
              {render(
                'item',
                { type: 'tpl', tpl: itemTemplate },
                { data: item, index }
              )}
            </div>
          );
        }
        
        // 默认渲染
        return <div key={index}>{JSON.stringify(item)}</div>;
      })}
    </div>
  );
};
```

#### 2. 表单字段组件

```typescript
import React from 'react';

export interface FormFieldProps {
  // 表单相关
  name?: string;
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  
  // 验证相关
  required?: boolean;
  validations?: any;
  validationErrors?: any;
  
  // Amis 表单接口
  formStore?: any;
  addHook?: (fn: Function, type: string) => void;
  removeHook?: (fn: Function, type: string) => void;
}

export const FormField: React.FC<FormFieldProps> = (props) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    validationErrors
  } = props;
  
  const hasError = validationErrors && validationErrors[name];
  
  return (
    <div className="form-field">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        name={name}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className={hasError ? 'has-error' : ''}
      />
      {hasError && (
        <div className="error-message">{validationErrors[name]}</div>
      )}
    </div>
  );
};
```

#### 3. 异步数据加载组件

```typescript
import React, { useState, useEffect } from 'react';

export interface AsyncWidgetProps {
  source?: string;
  api?: string;
  env?: {
    fetcher: (config: any) => Promise<any>;
  };
  render?: (schema: any, props?: any, scope?: any) => React.ReactNode;
}

export const AsyncWidget: React.FC<AsyncWidgetProps> = (props) => {
  const { source, api, env, render } = props;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!source && !api) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let result;
        
        if (env?.fetcher) {
          // 使用 Amis fetcher
          result = await env.fetcher({
            url: source || api,
            method: 'get'
          });
        } else {
          // 使用 fetch
          const response = await fetch(source || api);
          result = await response.json();
        }
        
        setData(result.data || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [source, api, env]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;
  
  return (
    <div className="async-widget">
      {render ? render('body', data, { data }) : JSON.stringify(data)}
    </div>
  );
};
```

### 组件样式指南

#### CSS 文件结构

```css
/* src/components/MyWidget.css */

/* 1. 根容器样式 */
.MyWidget-Wrapper {
  display: block;
  width: 100%;
  padding: 8px;
}

/* 2. 子元素样式 */
.MyWidget-Input {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 11px;
  font-size: 14px;
  line-height: 1.5715;
  transition: all 0.3s;
}

.MyWidget-Input:focus {
  border-color: #40a9ff;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 3. 状态样式 */
.MyWidget-Input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.MyWidget-Input.error {
  border-color: #ff4d4f;
}

/* 4. 响应式样式 */
@media (max-width: 768px) {
  .MyWidget-Wrapper {
    padding: 4px;
  }
}
```

## 元数据配置详解

### 完整元数据模板

```typescript
// src/metas/MyWidget.tsx

/**
 * 组件元数据配置
 * 用于在 Amis 编辑器中注册组件
 */

// 获取国际化函数（如果需要）
const t = (window as any).steedosI18next?.t || ((key: string, defaultValue: string) => defaultValue);

const config: any = {
  // ========== 基础配置 ==========
  
  /**
   * 组件类型
   * - 'amisSchema': 纯 Schema 组件（无自定义渲染）
   * - 'react': React 自定义渲染器
   */
  componentType: 'react',
  
  /**
   * 组件分组
   * 决定组件在编辑器中显示在哪个分类下
   */
  group: t('widgets-meta:group_custom', '自定义组件'),
  
  /**
   * 组件唯一标识
   * 必须全局唯一
   */
  componentName: "MyWidget",
  
  /**
   * 组件显示名称
   */
  title: t('widgets-meta:my-widget_title', '我的组件'),
  
  /**
   * 组件文档地址
   */
  docUrl: "https://docs.example.com/my-widget",
  
  /**
   * 组件截图
   */
  screenshot: "",
  
  /**
   * NPM 包信息
   */
  npm: {
    package: "@steedos-widgets/my-widget",
    version: "{{version}}",  // 自动替换为当前版本
    exportName: "MyWidget",
    main: "",
    destructuring: true,  // 是否使用解构导入
    subName: ""
  },
  
  /**
   * 组件预览配置
   * 用于编辑器中的快速预览
   */
  preview: {
    placeholder: "请输入内容",
    customProp: "示例值"
  },
  
  /**
   * 适用的页面类型
   */
  targets: [
    "steedos__RecordPage",  // 记录详情页
    "steedos__AppPage",     // 应用页面
    "steedos__HomePage"     // 首页
  ],
  
  /**
   * 支持的微页面引擎
   */
  engines: ["amis"],
  
  /**
   * Amis 渲染器配置
   */
  amis: {
    name: 'my-widget',  // 渲染器名称（type）
    icon: "fa fa-cube"  // FontAwesome 图标
  }
};

export default {
  ...config,
  
  // ========== Snippets 配置 ==========
  /**
   * 组件代码片段
   * 定义如何在编辑器中插入组件
   */
  snippets: [
    {
      title: config.title,
      screenshot: config.screenshot,
      schema: {
        componentName: config.componentName,
        props: config.preview
      }
    }
  ],
  
  // ========== Amis 编辑器集成配置 ==========
  amis: {
    /**
     * 渲染器配置
     */
    render: {
      type: config.amis.name,
      usage: "renderer",  // 或 "formitem" (表单字段)
      weight: 1,
      framework: "react"
    },
    
    /**
     * 编辑器插件配置
     */
    plugin: {
      // 基础信息
      rendererName: config.amis.name,
      $schema: '/schemas/UnkownSchema.json',
      name: config.title,
      description: config.title,
      tags: [config.group],
      order: -9999,  // 排序权重（越小越靠前）
      icon: config.amis.icon,
      
      /**
       * 脚手架配置
       * 定义组件的默认结构
       */
      scaffold: {
        type: config.amis.name,
        placeholder: '请输入内容',
        customProp: '默认值'
      },
      
      /**
       * 预览 Schema
       * 在组件列表中的预览
       */
      previewSchema: {
        type: config.amis.name,
        placeholder: 'Preview'
      },
      
      /**
       * 属性面板标题
       */
      panelTitle: '我的组件设置',
      
      /**
       * 属性面板控件配置
       * 定义组件的可配置属性
       */
      panelControls: [
        {
          type: 'tabs',
          tabs: [
            // ========== 常规设置 ==========
            {
              title: '常规',
              body: [
                {
                  type: 'input-text',
                  name: 'placeholder',
                  label: '占位符',
                  description: '输入框占位文本'
                },
                {
                  type: 'switch',
                  name: 'disabled',
                  label: '禁用',
                  value: false
                },
                {
                  type: 'input-text',
                  name: 'customProp',
                  label: '自定义属性',
                  description: '组件特定的自定义属性'
                }
              ]
            },
            
            // ========== 高级设置 ==========
            {
              title: '高级',
              body: [
                {
                  type: 'input-text',
                  name: 'className',
                  label: '自定义 CSS 类',
                  description: '添加自定义样式类'
                },
                {
                  type: 'textarea',
                  name: 'customTemplate',
                  label: '自定义模板',
                  description: '使用 Amis 模板语法',
                  language: 'html'
                }
              ]
            },
            
            // ========== 数据设置 ==========
            {
              title: '数据',
              body: [
                {
                  type: 'input-text',
                  name: 'source',
                  label: '数据源 API',
                  description: '远程数据源地址'
                },
                {
                  type: 'combo',
                  name: 'items',
                  label: '静态数据',
                  multiple: true,
                  multiLine: true,
                  items: [
                    {
                      type: 'input-text',
                      name: 'label',
                      label: '显示文本'
                    },
                    {
                      type: 'input-text',
                      name: 'value',
                      label: '值'
                    }
                  ]
                }
              ]
            },
            
            // ========== 样式设置 ==========
            {
              title: '样式',
              body: [
                {
                  type: 'select',
                  name: 'size',
                  label: '尺寸',
                  options: [
                    { label: '小', value: 'small' },
                    { label: '默认', value: 'default' },
                    { label: '大', value: 'large' }
                  ],
                  value: 'default'
                },
                {
                  type: 'input-color',
                  name: 'color',
                  label: '颜色'
                },
                {
                  type: 'input-number',
                  name: 'width',
                  label: '宽度',
                  min: 0,
                  max: 1000
                }
              ]
            },
            
            // ========== 事件设置 ==========
            {
              title: '事件',
              body: [
                {
                  type: 'ae-eventControl',
                  name: 'onEvent',
                  label: '事件动作配置'
                }
              ]
            }
          ]
        }
      ],
      
      /**
       * 区域配置
       * 定义组件的可编辑区域
       */
      regions: [
        {
          key: 'body',
          label: '内容区',
          placeholder: '拖拽组件到这里'
        }
      ],
      
      /**
       * 条件面板显示
       * 根据组件状态动态显示/隐藏面板
       */
      panelControlsCreator: (context: any) => {
        // 动态生成面板控件
        return [];
      }
    }
  }
};
```

### 面板控件类型参考

```typescript
// 常用控件类型

// 文本输入
{
  type: 'input-text',
  name: 'fieldName',
  label: '标签',
  placeholder: '占位符',
  description: '帮助文本',
  required: true,
  visibleOn: 'this.someField === "value"'  // 条件显示
}

// 数字输入
{
  type: 'input-number',
  name: 'count',
  label: '数量',
  min: 0,
  max: 100,
  step: 1
}

// 开关
{
  type: 'switch',
  name: 'enabled',
  label: '启用',
  value: false,
  onText: '开',
  offText: '关'
}

// 下拉选择
{
  type: 'select',
  name: 'mode',
  label: '模式',
  options: [
    { label: '模式一', value: 'mode1' },
    { label: '模式二', value: 'mode2' }
  ],
  value: 'mode1'
}

// 多选
{
  type: 'checkboxes',
  name: 'features',
  label: '功能',
  options: [
    { label: '功能 A', value: 'a' },
    { label: '功能 B', value: 'b' }
  ]
}

// 单选
{
  type: 'radios',
  name: 'type',
  label: '类型',
  options: [
    { label: '类型 A', value: 'a' },
    { label: '类型 B', value: 'b' }
  ]
}

// 颜色选择
{
  type: 'input-color',
  name: 'bgColor',
  label: '背景色'
}

// 日期选择
{
  type: 'input-date',
  name: 'startDate',
  label: '开始日期',
  format: 'YYYY-MM-DD'
}

// 文本域
{
  type: 'textarea',
  name: 'description',
  label: '描述',
  minRows: 3,
  maxRows: 10
}

// 代码编辑器
{
  type: 'editor',
  name: 'code',
  label: '代码',
  language: 'javascript'  // 或 'json', 'html', 'css'
}

// 组合输入（数组）
{
  type: 'combo',
  name: 'items',
  label: '列表项',
  multiple: true,
  multiLine: true,
  items: [
    { type: 'input-text', name: 'label', label: '标签' },
    { type: 'input-text', name: 'value', label: '值' }
  ]
}

// 分组
{
  type: 'fieldset',
  title: '分组标题',
  collapsable: true,
  body: [
    // 内部控件
  ]
}
```

## 资产包配置

### src/assets.json

```json
{
  "packages": [
    {
      "package": "third-party-lib",
      "urls": [
        "https://unpkg.com/third-party-lib@1.0.0/dist/lib.min.js",
        "https://unpkg.com/third-party-lib@1.0.0/dist/lib.min.css"
      ],
      "library": "ThirdPartyLib"
    },
    {
      "package": "@steedos-widgets/my-widget",
      "urls": [
        "https://unpkg.com/@steedos-widgets/my-widget@{{version}}/dist/my-widget.umd.js",
        "https://unpkg.com/@steedos-widgets/my-widget@{{version}}/dist/my-widget.umd.css"
      ],
      "library": "BuilderMyWidget"
    }
  ],
  "components": [
    {
      "exportName": "BuilderMyWidgetMeta",
      "npm": {
        "package": "@steedos-widgets/my-widget"
      },
      "url": "https://unpkg.com/@steedos-widgets/my-widget@{{version}}/dist/meta.js",
      "urls": {
        "default": "https://unpkg.com/@steedos-widgets/my-widget@{{version}}/dist/meta.js",
        "design": "https://unpkg.com/@steedos-widgets/my-widget@{{version}}/dist/meta.js"
      }
    }
  ]
}
```

### src/assets-dev.json (开发环境)

```json
{
  "packages": [
    {
      "package": "@steedos-widgets/my-widget",
      "urls": [
        "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/my-widget.umd.js",
        "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/my-widget.umd.css"
      ],
      "library": "BuilderMyWidget"
    }
  ],
  "components": [
    {
      "exportName": "BuilderMyWidgetMeta",
      "npm": {
        "package": "@steedos-widgets/my-widget"
      },
      "url": "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/meta.js",
      "urls": {
        "default": "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/meta.js",
        "design": "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/meta.js"
      }
    }
  ]
}
```

## Rollup 配置

### rollup.config.ts

```typescript
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';

require('dotenv-flow').config();

const pkg = require('./package.json');

// UMD 导出的全局变量名
const exportName = 'BuilderMyWidget';

// 外部依赖（不打包进组件）
const external = [
  "react",
  "react-dom",
  "lodash",
  "amis-core"
];

// 外部依赖的全局变量映射
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'lodash': '_',
  'amis-core': 'AmisCore'
};

// 基础配置
const options = {
  input: `src/index.ts`,
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    nodeResolve(),
    json(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    commonjs(),
    postcss({
      extract: true,  // 提取 CSS 到单独文件
      plugins: [
        require('postcss-simple-vars'),
        require('postcss-nested')
      ],
    }),
  ],
};

export default [
  // UMD 构建（主要输出）
  {
    ...options,
    external,
    output: [
      {
        file: pkg.unpkg,
        name: exportName,
        format: 'umd',
        sourcemap: false,
        strict: false,
        intro: 'const global = window;',
        globals,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [['@babel/preset-env', { modules: 'umd' }]],
          })
        ]
      },
    ],
  },
  
  // Meta 构建
  {
    input: `src/meta.ts`,
    plugins: [
      typescript(),
      {
        name: 'assets',
        generateBundle(outputOptions, bundle) {
          // 构建 assets.json
          const assets = require('./src/assets.json');
          const assetsJson = JSON.stringify(assets, null, 4)
            .replace(/\{\{version\}\}/g, pkg.version);
          
          this.emitFile({
            type: 'asset',
            fileName: 'assets.json',
            source: assetsJson
          });
          
          // 构建 assets-dev.json
          const assetsDev = require('./src/assets-dev.json');
          const assetsDevJson = JSON.stringify(assetsDev, null, 4);
          
          this.emitFile({
            type: 'asset',
            fileName: 'assets-dev.json',
            source: assetsDevJson
          });
        }
      }
    ],
    output: [
      {
        file: 'dist/meta.js',
        name: 'BuilderMyWidgetMeta',
        format: 'umd',
        sourcemap: false,
        globals: {
          'react': 'React'
        }
      }
    ]
  }
];
```

## 完整示例

参考 `packages/@steedos-widgets/antd` 包作为完整示例：

1. **组件实现**: `src/components/Select.tsx`
2. **元数据配置**: `src/metas/Select.tsx`
3. **组件导出**: `src/index.ts`
4. **元数据导出**: `src/meta.ts`
5. **资产包配置**: `src/assets.json`
6. **Rollup 配置**: `rollup.config.ts`
7. **包配置**: `package.json`
8. **TypeScript 配置**: `tsconfig.json`

## 测试和验证

### 1. 本地构建

```bash
cd packages/@steedos-widgets/my-widget
yarn build
```

### 2. 启动本地服务

```bash
# 在项目根目录
yarn unpkg
```

### 3. 配置华炎魔方

```bash
STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/assets-dev.json
```

### 4. 验证组件

- 在页面编辑器中查看组件是否出现
- 测试组件的属性配置
- 验证组件的运行时行为

## 常见问题

### 1. 组件未显示

- 检查 `assets.json` URL 是否正确
- 检查浏览器控制台错误
- 验证全局变量是否导出：`window.BuilderMyWidget`

### 2. 样式未生效

- 确认 CSS 文件已导入
- 检查 `assets.json` 是否包含 CSS URL
- 验证 PostCSS 配置

### 3. TypeScript 错误

- 安装缺失的类型定义
- 检查 `tsconfig.json` 配置
- 为第三方库添加类型声明

## 下一步

1. 阅读 [Amis 官方文档](https://aisuda.bce.baidu.com/amis/zh-CN/docs/index)
2. 研究现有组件包的实现
3. 开发自己的组件
4. 提交 Pull Request

---

**提示**: 开发过程中遇到问题，请参考现有的组件包实现，或查阅 Amis 官方文档。
