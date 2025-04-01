/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-01 14:00:19
 */

import React from 'react';
import { CustomCellRendererProps } from 'ag-grid-react';
import { isArray } from "lodash";

export const LookupCellRenderer = (props: CustomCellRendererProps & {
    fieldConfig?: any;
}) => {
    const { context, eGridCell, column, fieldConfig, value, valueFormatted } = props;

    let valueFormattedArray: string[] = [];
    let labelFormattedArray: string[] = [];
    if (value) {
        if (isArray(value)) {
            valueFormattedArray = value;
            labelFormattedArray = valueFormatted.split(',');
        } else {
            valueFormattedArray = [value];
            labelFormattedArray = [valueFormatted];
        }
    }

    return (
        <div className='amis-ag-grid-cell-renderer amis-ag-grid-cell-renderer-lookup' style={{
            width: '100%',
            height: '100%'
        }}>
            {labelFormattedArray.map((item, index) => {
                return (
                    <a key={index} href={`/app/-/${fieldConfig.reference_to}/view/${valueFormattedArray[index]}`}
                        target="_blank" className={index > 0 ? "ml-2" : ""}
                    >
                        {item}
                    </a>
                )
            })}
        </div>
    )
}