/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-10-25 09:17:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-05 17:56:58
 * @Description: 
 */


export const StandardObjects = {
    Base: {
        Actions: {
            standard_query: {
                visible: (objectName, recordId, record_permissions)=>{
                    // if(recordId){
                    //     return false;
                    // }
                    // return true;
                    return false;
                }
            },
            standard_new: {
                visible: function (objectName, recordId, record_permissions) {
                    if(objectName === 'cms_files' || objectName === 'instances'){
                        return false;
                    }
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
            standard_import_data: {
                visible: function (object_name, record_id, record_permissions) {
                    const { object } = this;
                    if (record_permissions) {
                        return record_permissions["allowCreate"] && object.hasImportTemplates
                    }
                }
            },
            // TODO
            standard_approve: {
                visible: function (object_name, record_id, record_permissions) {
                    return false;
                }
            },
            // TODO
            standard_view_instance:{
                visible: function (object_name, record_id, record_permissions) {
                    return false;
                }
            },
            // TODO
            standard_submit_for_approval: {
                visible: function (object_name, record_id, record_permissions) {
                    return (window as any).Steedos.ProcessManager.allowSubmit.apply(this, [object_name, record_id]);
                },
                todo: function (object_name, record_id) {
                    return (window as any).Steedos.ProcessManager.submit.apply(this, [object_name, record_id]);
                }
            },
            standard_follow: {
                visible: function (object_name, record_id, record_permissions) {
                    return false;
                }
            },
            standard_delete_many:{
                visible: function (object_name, record_id, record_permissions) {
                    // TODO: 简易处理。  记录页：相关子表右上角的批量删除按钮隐藏
                    if (RegExp("\\w+/view/\\w+").test(location.pathname)) {
                        return false;
                    }
                   if (record_permissions) {
                       return record_permissions["allowDelete"];
                   }
                }
            }
        }
    }
}