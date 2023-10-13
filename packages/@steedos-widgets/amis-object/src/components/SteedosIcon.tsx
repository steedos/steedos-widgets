

/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-01 14:44:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-13 15:57:39
 * @Description: 
 */

import React, { useEffect, useState } from 'react'
import { Image, Avatar } from 'antd';
export const SteedosIcon = (props) => {
    let { alt,height,width, basePath, category = 'standard', className = '', containerClassName = '', colorVariant = 'default', inverse, name = 'account', size='medium', title, rootUrl = props.data?.context?.rootUrl || '' } = props;
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


    if(name.startsWith('http://') || name.startsWith('https://') || name.endsWith('.jpg') || name.endsWith('.png')){
      return <Image
        alt={alt}
        height={height}
        width={width}
        className={className}
        preview={false}
        src={name}
      />
    }

    if(name.indexOf('.') > -1){
      const foo = name.split('.');
      category = foo[0];
      name = foo[1];
    }

    return <span className={`slds-icon_container slds-icon-${category}-${name} ${containerClassName}`}>
            <svg className={`slds-icon slds-icon_${size} slds-icon-text-${colorVariant} ${className}`}><use xlinkHref={`/assets/icons/${category}-sprite/svg/symbols.svg#${name}`}></use></svg>
          </span>
}