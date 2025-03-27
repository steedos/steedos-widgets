const fs = require('fs');
const path = require('path');

// 定义要替换的目标字符串及其替换值
const replacements = {
    "var IS_IOS = typeof navigator !== 'undefined' && typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;": "var IS_IOS = false;",
    "var IS_APPLE = typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent);": "var IS_APPLE = false;"
};

/**
 * 读取文件内容，替换指定的字符串，并写回文件
 * @param {string} filePath - 文件路径
 */
function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`读取文件出错: ${filePath}`, err);
            return;
        }

        let updatedData = data;
        let hasReplacements = false;

        // 遍历所有需要替换的字符串
        for (const [original, replacement] of Object.entries(replacements)) {
            if (updatedData.includes(original)) {
                updatedData = updatedData.split(original).join(replacement);
                console.log(`替换 "${original}" 为 "${replacement}" 在文件: ${filePath}`);
                hasReplacements = true;
            }
        }

        // 如果有更新，写回文件
        if (hasReplacements) {
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error(`写入文件出错: ${filePath}`, err);
                } else {
                    console.log(`已更新文件: ${filePath}`);
                }
            });
        }
    });
}

// 开始处理
processFile(path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'slate-react', 'dist', 'index.es.js'));
processFile(path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'slate-react', 'dist', 'index.js'));
processFile(path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'slate-react', 'dist', 'slate-react.js'));