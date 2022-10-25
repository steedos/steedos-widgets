/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-25 09:17:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-25 09:21:52
 * @Description: 
 */


export const StandardObjects = {
    Base: {
        Actions: {
            standard_query: {
                visible: (objectName, recordId, record_permissions)=>{
                    if(recordId){
                        return false;
                    }
                    return true;
                }
            },
            standard_new: {
                visible: function (objectName, recordId, record_permissions) {
                    if (record_permissions) {
                        return record_permissions["allowCreate"];
                    }
                }
            },
            standard_edit:{
                visible: function (object_name, record_id, record_permissions) {
                    if (record_permissions) {
                        return record_permissions["allowEdit"];
                    }
                }
            },
            standard_delete:{
                visible: function (object_name, record_id, record_permissions) {
                    if (record_permissions) {
                        return record_permissions["allowDelete"];
                    }
                }
            },
            // TODO
            // standard_delete_many:{
            //     visible: function (object_name, record_id, record_permissions) {
            //         if(Session.get('record_id')){
            //             return false;
            //         }
            //         var object = Creator.getObject(object_name);
            //         var perms = object && object.permissions.get();
            //         return perms && perms["allowDelete"];
            //     },
            //     todo: function () {
            //         var object_name = this.object_name;
            //         var list_view_id = Session.get("list_view_id") || "all";
            //         var listViewName = "listview_" + object_name + "_" + list_view_id;
            //         Creator.executeAction(object_name, {todo: 'standard_delete'}, null, null, listViewName);
            //     }
            // }
        }
    }
}