/**
 * amis-core v2.3.1
 * Copyright 2018-2022 fex
 */

/**
 * 将例如像 a.b.c 或 a[1].b 的字符串转换为路径数组
 *
 * @param string 要转换的字符串
 */
var keyToPath = function (string) {
    var result = [];
    if (string.charCodeAt(0) === '.'.charCodeAt(0)) {
        result.push('');
    }
    string.replace(new RegExp('[^.[\\]]+|\\[(?:([^"\'][^[]*)|(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g'), function (match, expression, quote, subString) {
        var key = match;
        if (quote) {
            key = subString.replace(/\\(\\)?/g, '$1');
        }
        else if (expression) {
            key = expression.trim();
        }
        result.push(key);
        return '';
    });
    return result;
};

export { keyToPath };
