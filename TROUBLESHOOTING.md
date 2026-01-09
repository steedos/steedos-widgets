# Troubleshooting Guide - 故障排查指南

本文档提供常见问题的诊断和解决方案。

## 目录

1. [开发环境问题](#开发环境问题)
2. [构建问题](#构建问题)
3. [组件集成问题](#组件集成问题)
4. [运行时问题](#运行时问题)
5. [性能问题](#性能问题)
6. [调试技巧](#调试技巧)

## 开发环境问题

### 问题 1: Node.js 版本不兼容

**症状**:
```bash
error package@x.x.x: The engine "node" is incompatible with this module.
```

**原因**: 项目要求 Node.js 18.x

**解决方案**:
```bash
# 检查 Node.js 版本
node --version

# 使用 nvm 切换版本
nvm install 18
nvm use 18

# 或使用 n
n 18
```

### 问题 2: Yarn 安装失败

**症状**:
```bash
error An unexpected error occurred: "EACCES: permission denied"
```

**解决方案**:
```bash
# 清除缓存
yarn cache clean

# 删除 node_modules 和 lockfile
rm -rf node_modules yarn.lock

# 重新安装
yarn install

# 如果仍有权限问题
sudo chown -R $(whoami) ~/.yarn
```

### 问题 3: Lerna 引导失败

**症状**:
```bash
lerna ERR! yarn install --mutex network:42424 exited 1
```

**解决方案**:
```bash
# 清理所有包的 node_modules
lerna clean -y

# 重新引导
yarn install

# 或单独在每个包中安装
cd packages/@steedos-widgets/package-name
yarn install
```

## 构建问题

### 问题 4: TypeScript 编译错误

**症状**:
```
error TS2304: Cannot find name 'React'.
```

**原因**: 缺少类型定义

**解决方案**:
```bash
# 安装 React 类型定义
yarn add -D @types/react @types/react-dom

# 检查 tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 问题 5: Rollup 打包失败

**症状**:
```
[!] Error: Could not resolve 'module-name' from src/index.ts
```

**原因**: 模块解析失败

**解决方案**:

```typescript
// rollup.config.ts

// 1. 确保安装了解析插件
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    commonjs()
  ]
};

// 2. 检查 external 配置
const external = [
  "react",
  "react-dom"
];

// 3. 如果是内部模块，检查导入路径
// ❌ 错误
import { Component } from 'components/Component';

// ✅ 正确
import { Component } from './components/Component';
```

### 问题 6: CSS 提取失败

**症状**:
```
[!] (plugin postcss) Error: You need to export a plugin in index.js
```

**解决方案**:
```typescript
// rollup.config.ts
import postcss from 'rollup-plugin-postcss';

export default {
  plugins: [
    postcss({
      extract: true,  // 提取 CSS
      plugins: [
        require('postcss-simple-vars')(),  // 注意括号
        require('postcss-nested')()
      ],
      // 添加其他选项
      minimize: true,
      sourceMap: false
    })
  ]
};
```

### 问题 7: 构建产物缺失

**症状**: `dist/` 目录没有生成文件

**诊断**:
```bash
# 检查构建命令
yarn build

# 查看详细输出
yarn build --verbose

# 检查 package.json scripts
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "yarn build-types && yarn build-rollup",
    "build-types": "tsc --emitDeclarationOnly",
    "build-rollup": "rollup -c rollup.config.ts"
  }
}
```

**解决方案**:
```bash
# 1. 确保 dist 目录已清理
yarn prebuild

# 2. 单独运行每个步骤
yarn build-types
yarn build-rollup

# 3. 检查 .gitignore 是否排除了 dist
# 确保 dist 不在 .gitignore 中（本地开发）
```

## 组件集成问题

### 问题 8: 组件未在编辑器中显示

**症状**: 组件在编辑器组件面板中看不到

**诊断步骤**:

```bash
# 1. 检查资产包 URL 是否可访问
curl http://127.0.0.1:8080/@steedos-widgets/package-name/dist/assets.json

# 2. 检查浏览器控制台
# 打开 DevTools -> Console，查看是否有加载错误

# 3. 检查全局变量
# 在浏览器控制台输入
window.BuilderMyWidget
window.BuilderMyWidgetMeta
```

**解决方案**:

```typescript
// 1. 确认 meta.ts 正确导出
// src/meta.ts
import MyWidget from "./metas/MyWidget";

const components = [MyWidget];
export default { components };

// 2. 检查 assets.json 配置
{
  "components": [{
    "exportName": "BuilderMyWidgetMeta",  // 与 rollup 配置一致
    "npm": {
      "package": "@steedos-widgets/my-widget"
    },
    "url": "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/meta.js"
  }]
}

// 3. 检查环境变量
// STEEDOS_PUBLIC_PAGE_ASSETURLS=http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/assets-dev.json
```

### 问题 9: 组件渲染错误

**症状**: 组件拖入画布后报错或不显示

**错误示例**:
```
TypeError: Cannot read property 'render' of undefined
```

**解决方案**:

```typescript
// 1. 检查组件导出
// src/components/MyWidget.tsx
export const MyWidget: React.FC<Props> = (props) => {
  // ...
};

// src/components/index.tsx
export * from './MyWidget';  // ✅ 使用命名导出
// 或
export { MyWidget } from './MyWidget';

// 2. 检查元数据中的 npm 配置
{
  npm: {
    package: "@steedos-widgets/my-widget",
    exportName: "MyWidget",
    destructuring: true  // ✅ 重要：使用解构导入
  }
}

// 3. 验证 UMD 导出
// 在浏览器控制台
window.BuilderMyWidget.MyWidget  // 应该返回组件
```

### 问题 10: 样式未生效

**症状**: 组件功能正常，但样式缺失

**诊断**:
```bash
# 1. 检查 CSS 文件是否生成
ls dist/*.css

# 2. 检查 assets.json 是否包含 CSS
cat dist/assets.json | grep ".css"

# 3. 检查浏览器 Network 面板
# 查看 CSS 文件是否成功加载
```

**解决方案**:

```typescript
// 1. 确保组件导入了样式
// src/components/MyWidget.tsx
import './MyWidget.css';

export const MyWidget = () => {
  return <div className="MyWidget">Content</div>;
};

// 2. 确保 Rollup 配置了 PostCSS
import postcss from 'rollup-plugin-postcss';

export default {
  plugins: [
    postcss({
      extract: true,  // ✅ 提取 CSS 到单独文件
      plugins: []
    })
  ]
};

// 3. 确保 assets.json 包含 CSS URL
{
  "packages": [{
    "urls": [
      "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/my-widget.umd.js",
      "http://127.0.0.1:8080/@steedos-widgets/my-widget/dist/my-widget.umd.css"  // ✅
    ]
  }]
}
```

## 运行时问题

### 问题 11: 属性未正确传递

**症状**: 组件收不到预期的 props

**调试**:
```typescript
export const MyWidget: React.FC<Props> = (props) => {
  // 打印所有 props
  console.log('MyWidget props:', props);
  
  return <div>...</div>;
};
```

**解决方案**:

```typescript
// 1. 检查 Schema 配置
{
  "type": "my-widget",
  "customProp": "value",  // ✅ 属性名与组件 props 一致
  "value": "${data.field}"  // ✅ 使用表达式引用数据
}

// 2. 检查元数据的 scaffold
{
  scaffold: {
    type: 'my-widget',
    customProp: 'default value'  // ✅ 默认值
  }
}

// 3. 检查 panelControls
{
  panelControls: [{
    type: 'input-text',
    name: 'customProp',  // ✅ name 对应 props 属性名
    label: 'Custom Property'
  }]
}
```

### 问题 12: 事件未触发

**症状**: onClick 等事件不响应

**解决方案**:

```typescript
// 1. 使用 Amis 事件系统
export const MyWidget: React.FC<any> = (props) => {
  const { dispatchEvent } = props;
  
  const handleClick = () => {
    // ✅ 触发 Amis 事件
    dispatchEvent('click', {
      data: props.data
    });
  };
  
  return <button onClick={handleClick}>Click</button>;
};

// 2. Schema 中配置事件
{
  "type": "my-widget",
  "onEvent": {
    "click": {
      "actions": [{
        "actionType": "toast",
        "args": { "msg": "Clicked!" }
      }]
    }
  }
}
```

### 问题 13: 数据更新不触发重渲染

**症状**: 数据变化了，但 UI 没更新

**解决方案**:

```typescript
// ❌ 错误：直接修改 state
const handleChange = () => {
  state.value = newValue;  // 不会触发重渲染
};

// ✅ 正确：使用 setState
const handleChange = () => {
  setState({ ...state, value: newValue });
};

// ✅ 使用 hooks
const [value, setValue] = useState(initialValue);
const handleChange = () => {
  setValue(newValue);
};

// ✅ 优化：使用 useCallback 避免重复创建
const handleChange = useCallback((newValue) => {
  setValue(newValue);
  onChange?.(newValue);
}, [onChange]);
```

## 性能问题

### 问题 14: 组件渲染缓慢

**症状**: 组件加载或交互时卡顿

**诊断**:
```typescript
// 使用 React DevTools Profiler
// 1. 打开 React DevTools
// 2. 切换到 Profiler 标签
// 3. 点击录制，进行操作
// 4. 停止录制，查看渲染时间

// 或在代码中添加性能标记
export const MyWidget: React.FC = (props) => {
  console.time('MyWidget render');
  
  // 组件逻辑
  
  console.timeEnd('MyWidget render');
  return <div>...</div>;
};
```

**解决方案**:

```typescript
// 1. 使用 React.memo
export const MyWidget = React.memo<Props>((props) => {
  // ...
}, (prevProps, nextProps) => {
  // 自定义比较，返回 true 表示不重渲染
  return prevProps.value === nextProps.value;
});

// 2. 使用 useMemo 缓存计算结果
const MyWidget: React.FC = (props) => {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(props.data);
  }, [props.data]);  // 只在 data 变化时重新计算
  
  return <div>{expensiveValue}</div>;
};

// 3. 使用 useCallback 缓存回调
const MyWidget: React.FC = (props) => {
  const handleClick = useCallback(() => {
    props.onClick?.(props.data);
  }, [props.onClick, props.data]);
  
  return <button onClick={handleClick}>Click</button>;
};

// 4. 虚拟滚动处理大列表
import { FixedSizeList } from 'react-window';

const MyList: React.FC = ({ items }) => (
  <FixedSizeList
    height={400}
    itemCount={items.length}
    itemSize={50}
  >
    {({ index, style }) => (
      <div style={style}>{items[index]}</div>
    )}
  </FixedSizeList>
);
```

### 问题 15: 包体积过大

**症状**: 打包后的文件很大，加载慢

**诊断**:
```bash
# 分析包体积
npx rollup-plugin-visualizer stats.html

# 查看文件大小
ls -lh dist/*.js
```

**解决方案**:

```typescript
// 1. 确保外部依赖正确配置
const external = [
  "react",
  "react-dom",
  "lodash",  // 不要打包常用库
  "antd"
];

// 2. 使用代码分割
const HeavyComponent = React.lazy(() => 
  import('./HeavyComponent')
);

// 3. 按需导入
// ❌ 导入整个库
import _ from 'lodash';

// ✅ 按需导入
import debounce from 'lodash/debounce';

// 4. 启用压缩
import { terser } from 'rollup-plugin-terser';

export default {
  plugins: [
    terser()  // 压缩代码
  ]
};
```

## 调试技巧

### 技巧 1: 使用浏览器开发工具

```javascript
// 1. 检查全局变量
window.BuilderMyWidget
window.BuilderMyWidgetMeta

// 2. 查看组件 props
// 在 React DevTools 中选中组件，然后在控制台
$r.props

// 3. 触发组件方法
$r.handleClick()

// 4. 查看组件 state
$r.state

// 5. 监听事件
monitorEvents(document.querySelector('.MyWidget'))
```

### 技巧 2: 添加调试信息

```typescript
export const MyWidget: React.FC<Props> = (props) => {
  // 开发模式下打印 props
  if (process.env.NODE_ENV === 'development') {
    console.group('MyWidget');
    console.log('props:', props);
    console.log('data:', props.data);
    console.groupEnd();
  }
  
  return <div>...</div>;
};
```

### 技巧 3: 使用 React DevTools

```bash
# 安装 React DevTools 浏览器扩展
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

# 使用 Profiler 分析性能
# 1. 打开 DevTools -> Components/Profiler
# 2. 录制交互
# 3. 查看渲染时间和原因
```

### 技巧 4: 源码映射

```typescript
// rollup.config.ts
export default {
  output: {
    sourcemap: true  // 生成源码映射
  }
};

// 在浏览器中可以看到原始 TypeScript 代码
```

### 技巧 5: 使用 debugger

```typescript
export const MyWidget: React.FC = (props) => {
  // 在需要调试的地方添加 debugger
  debugger;
  
  const value = computeValue(props.data);
  
  debugger;  // 可以添加多个断点
  
  return <div>{value}</div>;
};
```

## 常见错误代码

### Error: Cannot find module

```bash
# 原因：模块路径错误或未安装
# 解决：
yarn add module-name
# 或检查导入路径
```

### Error: Duplicate identifier

```bash
# 原因：类型定义冲突
# 解决：在 tsconfig.json 中添加
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Error: JSX element implicitly has type 'any'

```bash
# 原因：TypeScript 无法推断 JSX 类型
# 解决：安装 React 类型定义
yarn add -D @types/react
```

### Error: Module not found: Can't resolve 'css'

```bash
# 原因：缺少 CSS 加载器
# 解决：在 rollup.config.ts 中添加
import postcss from 'rollup-plugin-postcss';

plugins: [
  postcss({ extract: true })
]
```

## 获取帮助

### 内部资源
- 查看现有组件实现
- 参考 `packages/@steedos-widgets/antd`
- 阅读 README.md

### 外部资源
- [Amis 官方文档](https://aisuda.bce.baidu.com/amis/zh-CN/docs/index)
- [React 文档](https://react.dev/)
- [Rollup 文档](https://rollupjs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)

### 社区支持
- GitHub Issues
- Stack Overflow
- 华炎魔方社区

## 预防措施

### 开发前
1. ✅ 确认 Node.js 版本
2. ✅ 阅读相关文档
3. ✅ 查看示例代码
4. ✅ 了解构建流程

### 开发中
1. ✅ 经常测试构建
2. ✅ 使用版本控制
3. ✅ 编写清晰的代码注释
4. ✅ 遵循项目规范

### 发布前
1. ✅ 完整测试所有功能
2. ✅ 检查包体积
3. ✅ 验证浏览器兼容性
4. ✅ 更新文档

---

**注意**: 遇到问题时，先查看浏览器控制台和构建日志，它们通常会提供有用的错误信息。
