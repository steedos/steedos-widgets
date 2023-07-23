import React from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import './ReactFlow.css';

import { createObject } from '@steedos-widgets/amis-lib';

const Flow = ({
  dispatchEvent, 
  config,
  ...props
}) => {
  console.log("Flow render start with config:", config);
  // 这里只要useReactFlow，就会造成Flow组件rend两次，即上面的日志会执行两次
  // 见：https://reactflow.dev/docs/guides/uncontrolled-flow/#updating-nodes-and-edges
  const reactFlowInstance = useReactFlow();
  setTimeout(() => {
    dispatchEvent('getInstance', { reactFlowInstance })
  }, 100);

  return (
    <ReactFlow {...config}>
      <Background />
      <Controls />
    </ReactFlow>
  )
};

export const AmisReactFlow = ({ 
  dispatchEvent: amisDispatchEvent, 
  wrapperClassName = "w-full h-full",
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
  console.log("AmisReactFlow render start with config:", config);
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

  return (
    <div className={"steedos-react-flow " + wrapperClassName}>
      <ReactFlowProvider>
        <Flow dispatchEvent={dispatchEvent} config={configJSON}></Flow>
      </ReactFlowProvider>
    </div>
  )
}