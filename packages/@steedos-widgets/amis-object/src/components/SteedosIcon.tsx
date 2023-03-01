

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-28 16:28:47
 * @Description: 
 */

import React, { useEffect, useState } from 'react'

export const SteedosIcon = (props) => {
    let { basePath, category = 'standard', className = '', containerClassName = '', colorVariant = 'default', inverse, name = 'account', size='medium', title, rootUrl = props.data?.context?.rootUrl || '' } = props;
    if(!basePath){
      basePath = '';
    }
    // const [svg, setSvg] = useState();

    // const xlinkHref = `${rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/${category}/${name}.svg#`; // `${rootUrl}/unpkg.com/@salesforce-ux/design-system/assets/icons/${category}/${name}.svg`
  
    // useEffect(()=>{
    //   fetch(xlinkHref).then((res)=>{
    //     console.log(`res=====`, res);
    //     if(res.status === 200){
    //       res.text().then((text)=>{
    //         console.log(`text`, text)
    //         setSvg((text as any))
    //       })
    //     }
    //   })
    // }, [xlinkHref])
    return <span className={`slds-icon_container slds-icon-${category}-${name} ${containerClassName}`}>
            <svg className={`slds-icon slds-icon_${size} slds-icon-text-${colorVariant} ${className}`}><use xlinkHref={`/assets/icons/${category}-sprite/svg/symbols.svg#${name}`}></use></svg>
          </span>
}