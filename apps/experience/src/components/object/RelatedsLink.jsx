/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-16 15:23:18
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-03 14:10:30
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from 'next/link';
import { FromNow } from "@/components/FromNow";
import { RecordRelatedListButtons } from '@/components/object/RecordRelatedListButtons'
import { isEmpty, defaultsDeep } from 'lodash'
import { Tab, Menu, Transition } from "@headlessui/react";
import { RelatedLink } from '@/components/object/RelatedLink'
import { getRelatedsCount } from '@steedos-widgets/amis-lib';

export const RelatedsLink = ({app_id, record_id, relateds, formFactor})=>{
    const [relatedsQueryInfo, setRelatedsQueryInfo] = useState({});
    useEffect(()=>{
        getRelatedsCount(record_id, relateds).then(res=>{
            setRelatedsQueryInfo(res);
        })
    }, [record_id, relateds]);
    return (<div className="divide-y">
        {relateds?.map((related) => {
            return (
              
                    <RelatedLink {...related}
                app_id={app_id}
                record_id={record_id}
                formFactor={formFactor}
                recordCount={relatedsQueryInfo[related.object_name]} ></RelatedLink>
            );
        })}
    </div>)
}