/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 17:34:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 15:37:36
 * @Description: 
 */
import React, { useState, useEffect, Fragment } from "react";
import { AmisRender } from "@/components/AmisRender";
import { getFormSchema } from "@/lib/objects";

export function Form({ appId, objectName, recordId, className, data }) {
    const [schema, setSchema] = useState(null);
    const [formFactor, setFormFactor] = useState(null);
    useEffect(() => {
        if (window.innerWidth < 768) {
          setFormFactor("SMALL");
        } else {
          setFormFactor("LARGE");
        }
      }, []);

      useEffect(() => {
        if (objectName && recordId) {
            getFormSchema(objectName, {
              recordId: recordId,
              tabId: objectName,
              appId: appId,
              formFactor: formFactor,
            }).then((data) => {
              setSchema(data);
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
