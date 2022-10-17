/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-17 17:26:19
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { AmisRender } from "@/components/AmisRender";
import { getFormSchema } from "@steedos-widgets/amis-lib";

export function Form({ appId, objectName, recordId, className, data, formFactor }) {
    const [schema, setSchema] = useState(null);
      useEffect(() => {
        if (formFactor && objectName && recordId) {
            getFormSchema(objectName, {
              recordId: recordId,
              tabId: objectName,
              appId: appId,
              formFactor: formFactor,
            }).then((result) => {
              setSchema(result);
            });
          }
      }, [formFactor]);
    return (
        <>
            {schema && 
             <AmisRender
             id={SteedosUI.getRefId({type: 'form', appId: appId, name: objectName})}
             schema={schema.amisSchema}
             data={data}
             className={className}
             ></AmisRender>
            }
        </>
    );
}
