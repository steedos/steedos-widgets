import React from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './ReactFlow.css';

import { createObject } from '@steedos-widgets/amis-lib';

export const AmisReactFlow = ({ 
  dispatchEvent: amisDispatchEvent, 
  wrapperClassName,
  data: amisData,
  env,
  store,
  topStore,
  rootStore,
  scope,
  id,
  render,
  getValue,
  setValue,
  value,
  config,
  ...props }
) => {
  let configJSON = {}
  if (typeof config === 'string') {
    try {
      configJSON = JSON.parse(config);
    } catch(e) {console.log(e)}
  }
  if (typeof config === 'object') {
    configJSON = config
  }


  let onDataFilter = props.onDataFilter;
  const dataFilter = props.dataFilter;

  if (!onDataFilter && typeof dataFilter === 'string') {
    onDataFilter = new Function(
      'config',
      'ReactFlow',
      'data',
      dataFilter
    ) as any;
  }
  try {
    onDataFilter &&
      (configJSON =
        onDataFilter(configJSON, (window as any).ReactFlow, amisData) || configJSON);
  } catch (e) {
    console.warn(e);
  }

  const dispatchEvent = async (action: string, value?: object) => {

    if (!amisDispatchEvent) return;

    const rendererEvent = await amisDispatchEvent(
      action,
      value ? createObject(amisData, value) : amisData
    );

    return rendererEvent?.prevented ?? false;
  }

  const handleGetEvents = (fetchInfo, successCallback, failureCallback)=> {
    // fix：控件初始 render 的时候，dispatchEvent未生效
    setTimeout(()=>{
      dispatchEvent('getEvents', {fetchInfo, successCallback, failureCallback})
    }, 100);
    
  };

  const handleSelect = (event)=> {
    dispatchEvent('select', event)
  };

  const handleEventsSet = (event)=> {
    dispatchEvent('eventsSet', event)
  };

  const handleEventClick = (event)=> {
    dispatchEvent('eventClick', event)
  };

  const handleEventAdd = (event)=> {
    dispatchEvent('eventAdd', event)
  };

  const handleEventChange = (event)=> {
    dispatchEvent('eventChange', event)
  };

  const handleEventRemove = (event)=> {
    dispatchEvent('eventRemove', event)
  };

  // forceEventDuration属性设置为true修正了把全天事件拖动变更到非全天事件时end为空造成的事件在画布上看不到的问题。

  return (
    <div className={wrapperClassName}>
      <ReactFlow {...configJSON}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}