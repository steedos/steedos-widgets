import React, { useEffect, useRef } from 'react';

import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation,
} from 'devextreme-react/gantt';

import './Gantt.css';

// 不要用 devextreme-react, rollup 编译报错
export const AmisGantt = ( {
  data: amisData,
  config, 
  className, 
  ...props
} ) => {
  
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
      'Gantt',
      'data',
      dataFilter
    ) as any;
  }
  try {
    onDataFilter &&
      (configJSON =
        onDataFilter(configJSON, Gantt, amisData) || configJSON);
  } catch (e) {
    console.warn(e);
  }
  useEffect(() => {
  }, [])

  return (
    <Gantt
      taskListWidth={500}
      scaleType="weeks"
      height={700}
      className={className}
      {...configJSON}>

      <Toolbar>
        <Item name="undo" />
        <Item name="redo" />
        <Item name="separator" />
        <Item name="collapseAll" />
        <Item name="expandAll" />
        <Item name="separator" />
        <Item name="addTask" />
        <Item name="deleteTask" />
        <Item name="separator" />
        <Item name="zoomIn" />
        <Item name="zoomOut" />
      </Toolbar>

      <Column dataField="title" caption="Subject" width={300} />
      <Column dataField="start" caption="Start Date" />
      <Column dataField="end" caption="End Date" />

      <Validation autoUpdateParentTasks />
      <Editing enabled />
    </Gantt>
  )
}