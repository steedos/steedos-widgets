/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-04 17:10:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-20 10:25:48
 * @Description: 
 */
import { AmisRender } from "@/components/AmisRender";
import { Button, Space} from 'antd';
import { isEmpty, isFunction } from "lodash";
import { conditionsToFilters, filtersToConditions } from '@steedos-widgets/amis-lib'
import { getSteedosAuth, fetchAPI } from "@steedos-widgets/amis-lib";
import { getUISchema } from '@steedos-widgets/amis-lib'

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
            title: '高级过滤',
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {padding: "0px", paddingTop: "12px"},
            children: <AmisRender
                id={amisScopeId}
                schema={filtersAmisSchema}
                data={Object.assign({}, data, {objectName: objectName})}
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
    getVisibleFilter: (listView, userFilter, ctx)=>{
        let listViewId = ctx && ctx.listViewId;
        if (!userFilter && listViewId) { 
          // 没有的话从本地存储中取
          const listViewPropsStoreKey = location.pathname + "/crud/" + listViewId;
          let localListViewProps = localStorage.getItem(listViewPropsStoreKey);
          localListViewProps = JSON.parse(localListViewProps);
          if (localListViewProps) {
            userFilter = localListViewProps.filter;
          }
        }
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
            return ListView.getVisibleFilter(listView, userFilter);
        }else{
            if(isEmpty(userFilter)){
                return listView.filters;
            }else{
                return [listView.filters, 'and', userFilter];
            }
        }
    }
}