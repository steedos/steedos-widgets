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
const SteedosIcon = (props: any) => {
  const {category = 'standard', name, path, ...rest} = props
  const inlineData = name?inlineIcons[category][name.toLowerCase()]:null
  if (inlineData)
    inlineData.viewBox = inlineIcons[category].viewBox;
  return <Icon 
    {...props}
    name = {name}
    category = {category}
    icon = {inlineData}
   />
}

export default SteedosIcon