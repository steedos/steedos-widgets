/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:53:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-02 10:34:25
 * @Description: 
 */

import * as standardNew from '@/schema/standard_new.amis.js'
import * as standardEdit from '@/schema/standard_edit.amis.js'
import * as standardDelete from '@/schema/standard_delete.amis.js'
import * as standardImportData from '@/schema/standard_import_data.amis.js'

export const StandardButtons = {
    getStandardNew: (uiSchema)=>{
        return {
            type: 'amis_button',
            amis_schema: standardNew.getSchema(uiSchema)
        }
    },
    getStandardEdit: (uiSchema)=>{
        return {
            type: 'amis_button',
            amis_schema: standardEdit.getSchema(uiSchema)
        }
    },
    getStandardDelete: (uiSchema)=>{
        return {
            type: 'amis_button',
            amis_schema: standardDelete.getSchema(uiSchema)
        }
    },
    getStandardDeleteMany: (uiSchema)=>{
        return {
            type: 'amis_button',
            // amis_schema: standardDelete.getSchema(uiSchema)
        }
    },
    getStandardImportData: (uiSchema)=>{
        return {
            type: 'amis_button',
            amis_schema: standardImportData.getSchema(uiSchema)
        }
    }
}