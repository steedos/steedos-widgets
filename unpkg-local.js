const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// 使用 CORS 中间件
app.use(cors());

function parsePackagePath(urlPath) {
  // 去掉首个 '/'
  const parts = urlPath.slice(1).split('/');
  let packageName, version, filePath;

  if (parts[0].startsWith('@')) {
    // 当第一个元素以 '@' 开头时，说明是 scoped package
    // 比如 ["@builder6", "react"] -> @builder6/react
    // 或 ["@steedos-widgets", "amis@6.3.0-patch.3", "dist", ...]
    const scopedName = parts.slice(0, 2).join('/');  // @builder6/react 或 @steedos-widgets/amis@6.3.0-patch.3

    // 如果除了最开头的 '@' 外还存在第二个 '@'，才视为含有版本号
    const secondAtIndex = scopedName.indexOf('@', 1); // 从下标 1 开始再找一次 '@'
    if (secondAtIndex !== -1) {
      // 存在版本号
      packageName = scopedName.slice(0, secondAtIndex);  // 例如 @steedos-widgets/amis
      version = scopedName.slice(secondAtIndex + 1);     // 例如 6.3.0-patch.3
    } else {
      // 不存在版本号
      packageName = scopedName; // 例如 @builder6/react
      version = null;
    }
    filePath = parts.slice(2).join('/'); // 剩余部分作为文件路径
  } else {
    // 普通包
    // 比如 ["react@18.2.0", "umd", "react.development.js"]
    const atIndex = parts[0].lastIndexOf('@');
    if (atIndex !== -1) {
      packageName = parts[0].slice(0, atIndex);
      version = parts[0].slice(atIndex + 1);
    } else {
      packageName = parts[0];
      version = null;
    }
    filePath = parts.slice(1).join('/');
  }

  return { packageName, version, filePath };
}

// 处理请求
app.get('/*', (req, res) => {
  const { packageName, version, filePath } = parsePackagePath(req.path);

  try {
    // 使用 require.resolve 定位包，不包含版本信息
    if (!packageName) {
      return res.status(400).send('Invalid package name');
    }
    const packageMainPath = require.resolve(`${packageName}/package.json`);
    const packageDir = path.dirname(packageMainPath);

    // 若没有指定文件路径，则返回 package.json
    const targetFile = filePath || 'package.json';
    const fullPath = path.join(packageDir, targetFile);

    // 防止路径遍历攻击
    if (!fullPath.startsWith(packageDir)) {
      return res.status(400).send('Invalid path');
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).send('File not found');
    }

    res.sendFile(fullPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
