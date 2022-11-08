/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-01 15:53:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-08 16:38:18
 * @Description: 
 */

import * as standardNew from '@/schema/standard_new.amis.js'
import * as standardEdit from '@/schema/standard_edit.amis.js'
import * as standardDelete from '@/schema/standard_delete.amis.js'
import * as standardImportData from '@/schema/standard_import_data.amis.js'
import * as standardOpenView from '@/schema/standard_open_view.amis.js'

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
            type: 'amis_button',
            // amis_schema: standardDelete.getSchema(uiSchema)
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