/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-01-18 15:12:41
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-05-20 13:46:41
 */
/**
 * 生成符合标准uuid格式的36位满足唯一性的随机串
 * @returns uuid
 */
export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
        (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}