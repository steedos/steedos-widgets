import {Icon} from '@salesforce/design-system-react'; 
import React from 'react';

import action from './IconAction'; 
import custom from './IconCustom'; 
import doctype from './IconDocType'; 
import standard from './IconStandard'; 
import utility from './IconUtility'; 

const inlineIcons: any = {
  action,
  custom,
  doctype,
  standard,
  utility
}
export const SteedosIcon = (props: any) => {
  const {category = 'standard', name, path, ...rest} = props
  const inlineData = inlineIcons[category][name.toLowerCase()]
  inlineData.viewBox = inlineIcons[category].viewBox;
  return <Icon 
    name = {name}
    category = {category}
    icon = {inlineData}
    {...props}/>
}