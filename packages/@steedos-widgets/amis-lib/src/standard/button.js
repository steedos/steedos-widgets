/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:53:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-28 17:06:22
 * @Description: 
 */
import { i18next } from "../i18n";
import * as standardNew from '../schema/standard_new.amis.js'
import * as standardEdit from '../schema/standard_edit.amis.js'
import * as standardDelete from '../schema/standard_delete.amis.js'
import * as standardImportData from '../schema/standard_import_data.amis.js'
import * as standardOpenView from '../schema/standard_open_view.amis.js'

export const StandardButtons = {
    getStandardNew: async (uiSchema, ctx)=>{
        return {
            type: 'amis_button',
            amis_schema: await standardNew.getSchema(uiSchema, ctx)
        }
    },
    getStandardEdit: async (uiSchema, ctx)=>{
        return {
            type: 'amis_button',
            amis_schema: await standardEdit.getSchema(uiSchema, ctx)
        }
    },
    getStandardDelete: async (uiSchema, ctx)=>{
        return {
            type: 'amis_button',
            amis_schema: await standardDelete.getSchema(uiSchema, ctx)
        }
    },
    getStandardDeleteMany: async (uiSchema, ctx)=>{
        return {
            type: 'script',
            todo: function(){
                const {
                    appId,
                    objectName,
                    uiSchema
                } = this;
                const scopeId = this.scopeId || `amis-${appId}-${objectName}-listview`;
                const scope = this.scope || SteedosUI?.getRef(scopeId);
                const listViewRef = scope.getComponentById(`listview_${uiSchema.name}`);
                if(_.isEmpty(listViewRef.props.store.toJSON().selectedItems)){
                    listViewRef.handleAction({}, {
                        "actionType": "toast",
                        "toast": {
                            "items": [
                              {
                                "position": "top-right",
                                "body": i18next.t('frontend_delete_many_selected_required')
                              }
                            ]
                          }
                      })
                }else{
                    listViewRef.handleBulkAction(listViewRef.props.store.toJSON().selectedItems,[],{},listViewRef.props.bulkActions[0]);
                }
            }
        }
    },
    getStandardImportData: async (uiSchema, ctx)=>{
        return {
            type: 'amis_button',
            amis_schema: await standardImportData.getSchema(uiSchema, ctx)
        }
    },
    getStandardOpenView: async (uiSchema, ctx)=>{
        return {
            type: 'amis_button',
            amis_schema: await standardOpenView.getSchema(uiSchema, ctx)
        }
    }
}