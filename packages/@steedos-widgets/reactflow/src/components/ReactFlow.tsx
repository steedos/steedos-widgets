import React, { useCallback, useRef } from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider, useReactFlow, useNodesState, useEdgesState, updateEdge, addEdge, useOnSelectionChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './ReactFlow.css';

import { createObject } from '@steedos-widgets/amis-lib';

const Flow = ({
  dispatchEvent, 
  config,
  backgroundConfig,
  ...props
}) => {
  console.log("Flow render start with config:", config);
  // 这里只要useReactFlow，就会造成Flow组件rend两次，即上面的日志会执行两次
  // 见：https://reactflow.dev/docs/guides/uncontrolled-flow/#updating-nodes-and-edges
  const edgeUpdateSuccessful = useRef(true);
  const reactFlowInstance = useReactFlow();
  // const [nodes, setNodes, onNodesChange] = useNodesState(config.nodes || config.defaultNodes);
  const [nodes, setNodes] = useNodesState(config.nodes || config.defaultNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(config.edges || config.defaultEdges);
  const [edges, setEdges] = useEdgesState(config.edges || config.defaultEdges);
  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    dispatchEvent('nodesChange', {  changes, nodes, setNodes, edges, setEdges, applyNodeChanges, reactFlowInstance });
  }, [setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    dispatchEvent('edgesChange', {  changes, nodes, setNodes, edges, setEdges, applyEdgeChanges, reactFlowInstance });
  }, [setEdges]);

  const onEdgeUpdateStart = useCallback(() => {
    // edgeUpdateSuccessful.current = false;
    dispatchEvent('edgeUpdateStart', { edgeUpdateSuccessful });
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    // 这里实现移动连线到其他节点上
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
    dispatchEvent('edgeUpdate', {  oldEdge, newConnection, setEdges, updateEdge, edgeUpdateSuccessful, reactFlowInstance });
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    // edgeUpdateSuccessful.current = true;
      dispatchEvent('edgeUpdateEnd', { _, edge, edgeUpdateSuccessful, reactFlowInstance });
  }, []);
  
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      dispatchEvent('selectionChange', { nodes, setNodes, edges, setEdges, reactFlowInstance });
    },
  });

  setTimeout(() => {
    dispatchEvent('getInstance', { reactFlowInstance })
  }, 100);

  return (
    <ReactFlow { ...config } 
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
      onEdgeUpdateStart={onEdgeUpdateStart} onEdgeUpdate={onEdgeUpdate} onEdgeUpdateEnd={onEdgeUpdateEnd}
    >
      {backgroundConfig === false ? null : <Background {...backgroundConfig}/>}
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
  backgroundConfig,
  ...props }
) => {
  if(!props.data){
    // 为了解决3.2 dispatchevent不生效的问题, https://github.com/baidu/amis/issues/7488
    // 如果data为undefined，dispatchEvent时第三个参数传入的current的data为undefined会报错
    props.data = {}
  }
  const reactFlowRef: any = useRef();
  console.log("AmisReactFlow render start with config:", config, backgroundConfig);
  let configJSON = {}
  if (typeof config === 'string') {
    try {
      configJSON = JSON.parse(config);
    } catch(e) {console.log(e)}
  }
  if (typeof config === 'object') {
    configJSON = config
  }

  let backgroundConfigJSON = {}
  if (typeof backgroundConfig === 'string') {
    try {
      backgroundConfigJSON = JSON.parse(backgroundConfig);
    } catch(e) {console.log(e)}
  }else if (typeof backgroundConfig === 'object') {
    backgroundConfigJSON = backgroundConfig;
  }else if(backgroundConfig === false){
    backgroundConfigJSON = false;
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
      value ? createObject(amisData, value) : amisData,
      //为了解决3.2 dispatchevent不生效的问题, https://github.com/baidu/amis/issues/7488
      reactFlowRef.current
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

  let flow = (
    <ReactFlowProvider {...props}>
      <div className={"steedos-react-flow " + wrapperClassName}>
        <Flow dispatchEvent={dispatchEvent} config={configJSON} backgroundConfig={backgroundConfigJSON}></Flow>
      </div>
    </ReactFlowProvider>
  )

  // 为了解决3.2 dispatchevent不生效的问题, https://github.com/baidu/amis/issues/7488
  // dispatchEvent时第三个参数传入的current必须是一个带props属性的对象，不可以是一个dom标签
  reactFlowRef.current = flow;

  return flow;
}