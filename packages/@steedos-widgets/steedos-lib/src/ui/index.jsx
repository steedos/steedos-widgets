/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-01 13:58:36
 * @Description: 
 */
import { message, notification, Button, Space} from 'antd';
import {Modal, Drawer} from './modal'
import { SObject } from './sObject';
import { ListView } from './listView';
import { Router } from './router';
import { render } from './render';
import { downloadFile, previewFile } from './file';

export const SteedosUI = Object.assign({}, {
    render: render,
    Router,
    ListView,
    Object: SObject,
    Modal, 
    Drawer,
    refs: {},
    getRef(name){
      return SteedosUI.refs[name];
    },
    router:{
      // TODO: 简易处理
      go: (action, to)=>{
        const {type, objectName, recordId } = action || {};
        const router = window.FlowRouter;
  
        if(to){
          if(router){
            return router.go(to);
          }
          /* TODO: 补充处于nextjs环境下的跳转
          else if(){
            return router.push(to);
          }
          */
          else{
            return window.open(to);
          }
        }
  
        if(router){
          router.reload();
        }else{
          console.warn('暂不支持自动跳转', action)
        }
      },
      reload: ()=>{
        console.log('reload')
      }
    },
    message,
    notification,
    components: {
      Button, Space
    },
    getRefId: ({type, appId, name})=>{
      switch (type) {
        case 'listview':
          return `amis-${appId}-${name}-listview`;
        case 'form':
          return `amis-${appId}-${name}-form`;
        case 'detail':
          return `amis-${appId}-${name}-detail`;
        default:
          return `amis-${appId}-${name}-${type}`;
      }
    },
    downloadFile,
    previewFile,
    reloadRecord: ()=>{
      if(window.FlowRouter){
        return window.FlowRouter.reload();
      }else{
        // TODO 调用steedos object form 的 reload action
      }
    }
})