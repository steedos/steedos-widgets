/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:53:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-07 17:09:07
 * @Description: 
 */

import * as standardNew from '@/schema/standard_new.amis.js'
import * as standardEdit from '@/schema/standard_edit.amis.js'
import * as standardDelete from '@/schema/standard_delete.amis.js'
import * as standardImportData from '@/schema/standard_import_data.amis.js'
import * as standardOpenView from '@/schema/standard_open_view.amis.js'

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
    },
    getStandardOpenView: (uiSchema)=>{
        return {
            type: 'amis_button',
            amis_schema: standardOpenView.getSchema(uiSchema)
        }
    }
}