/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 17:10:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 15:56:49
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { Button, Space} from 'antd';
import { isEmpty, isFunction } from "lodash";
import { conditionsToFilters, filtersToConditions } from '@/components/functions/amis'
import { getSteedosAuth, fetchAPI } from "@/lib/steedos.client";
import { getUISchema } from '@/lib/objects'

const filtersAmisSchema = require('@/amis/listview_filters.amis.json')

const canSaveFilter = (listView)=>{
    if(listView._id && listView.owner === getSteedosAuth()?.userId){
        return true;
    }else{
        return false;
    }
}

const saveFilters = async (listView, filters)=>{
    const api = '/api/listview/filters';
    await fetchAPI(api, {
        method: 'post',
        body: JSON.stringify({
            id: listView._id,
            filters: filters
        })
    });
    await getUISchema(listView.object_name, true)
}

export const ListView = {
    showFilter: (objectName, {listView, data, props, onFilterChange})=>{
        const pageName = `${objectName}-list-filter`;
        const amisScopeId = `amis-${pageName}`;
        const canSave = canSaveFilter(listView);
        if(data.filters){
            data.filters = filtersToConditions(data.filters)
        }
        SteedosUI.Drawer(Object.assign({
            name: pageName,
            title: '过滤器',
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {padding: "0px", paddingTop: "12px"},
            children: <AmisRender
                id={amisScopeId}
                schema={filtersAmisSchema}
                data={{data: Object.assign({}, data, {objectName: objectName})}}
                ></AmisRender>,
            mask: false,
            width: 550,
            style: null,
            extra: (
            <Space>
                <Button onClick={(e)=>{
                    SteedosUI.getRef(pageName).close();
                }}>取消</Button>
                <Button type='primary' onClick={async (e)=>{
                    const formValues = SteedosUI.getRef(amisScopeId).getComponentById("filtersForm").getValues()
                    const filters = conditionsToFilters(formValues.filters);
                    if(canSave){
                        saveFilters(listView, filters)
                    }
                    if(isFunction(onFilterChange)){
                        onFilterChange(filters)
                    }
                    SteedosUI.getRef(pageName).close();
                }}>{canSave ? '保存' : '应用'}</Button>
                
            </Space>)
        }, props))
    },
    getVisibleFilter: (listView, userFilter)=>{
        if(userFilter){
            return userFilter;
        };
        const canSave = canSaveFilter(listView);
        if(canSave){
            return listView.filters;
        }
    },
    getQueryFilter: (listView, userFilter)=>{
        const canSave = canSaveFilter(listView);
        if(canSave){
            return getVisibleFilter(listView, userFilter);
        }else{
            if(isEmpty(userFilter)){
                return listView.filters;
            }else{
                return [listView.filters, 'and', userFilter];
            }
        }
    }
}