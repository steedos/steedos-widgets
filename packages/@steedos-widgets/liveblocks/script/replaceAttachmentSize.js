const fs = require('fs');
const path = require('path');


// 定义要替换的原始行和新的行
const oldLine = 'var ATTACHMENT_PART_SIZE = 5 * 1024 * 1024;';
const newLine = 'var ATTACHMENT_PART_SIZE = 50 * 1024 * 1024;';

// 读取文件
const replaceAttachmentSize = (filePath)=>{
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('读取文件时出错:', err);
            return;
        }
    
        // 检查文件内容是否包含要替换的行
        if (!data.includes(oldLine)) {
            console.log('原始行未找到，无需替换。');
            return;
        }
    
        // 替换指定行
        const updatedData = data.replace(oldLine, newLine);
    
        // 写回文件
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('写入文件时出错:', err);
                return;
            }
            console.log('成功替换 ATTACHMENT_PART_SIZE 的值。');
        });
    });
}

replaceAttachmentSize(path.join(__dirname, '..', '..', '..', '..', 'node_modules', '@liveblocks', 'core', 'dist', 'index.js'));
replaceAttachmentSize(path.join(__dirname, '..', '..', '..', '..', 'node_modules', '@liveblocks', 'core', 'dist', 'index.mjs'));