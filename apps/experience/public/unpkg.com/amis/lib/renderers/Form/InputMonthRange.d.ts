/// <reference types="react" />
import InputDateRange, { DateRangeControlSchema } from './InputDateRange';
/**
 * MonthRange 月范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/month-range
 */
export interface MonthRangeControlSchema extends Omit<DateRangeControlSchema, 'type'> {
    type: 'input-month-range';
}
export default class MonthRangeControl extends InputDateRange {
    render(): JSX.Element;
}
export declare class MonthRangeControlRenderer extends MonthRangeControl {
    static defaultProps: {
        format: string;
        inputFormat: string;
        joinValues: boolean;
        delimiter: string;
        timeFormat: string;
        ranges: string;
        animation: boolean;
    };
}
