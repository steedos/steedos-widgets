/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-27 15:54:12
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-27 16:11:16
 * @Description: 
 */
import { message, notification, Button, Space} from 'antd';
import {Modal, Drawer} from './modal'
const SteedosUI = Object.assign({}, {
    Modal, 
    Drawer,
    refs: {},
    getRef(name){
      return SteedosUI.refs[name];
    },
    router: ()=>{
        // TODO
    },
    message,
    notification,
    components: {
      Button, Space
    }
})

if(typeof window != 'undefined' && !window.SteedosUI){
    window.SteedosUI = SteedosUI;
}