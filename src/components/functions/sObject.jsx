import { Form } from '@/components/object/Form'
import { Button, Space} from 'antd';
import { isFunction, each, isEmpty } from 'lodash';
import { fetchAPI, getSteedosAuth } from '@/lib/steedos.client.js';
import { getUISchema } from '@/lib/objects.js'

const editRecordHandle = (props)=>{
    const { appId, name, title, objectName, recordId, type, options, router, refId, data, onSubmitted, onCancel } = props;
    if(type === 'modal'){
        SteedosUI.Modal(Object.assign({
            name: name,
            title: title,
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false, // 禁止 esc 关闭
            // footer: null,
            cancelText: '取消',
            okText: '确定',
            onOk: (e)=>{
                const scope = SteedosUI.getRef(SteedosUI.getRefId({type: `form`, appId: appId, name: objectName}));
                const form = scope.getComponentByName(`page_edit_${recordId}.form_edit_${recordId}`);
                form.handleAction({}, { type: "submit" }).then((data)=>{
                    if(data){
                        SteedosUI.getRef(name).close();
                        if(isFunction(onSubmitted)){
                            onSubmitted(e, data)
                        }
                    }
                })
            },
            onCancel: (e)=>{
                SteedosUI.getRef(name).close();
                if(isFunction(onCancel)){
                    onCancel(e)
                }
            },
            bodyStyle: {padding: "0px", paddingTop: "12px"},
            children: <Form appId={appId} objectName={objectName} recordId={recordId} data={data}></Form>
        }, options?.props));
    }else if(type === 'drawer'){
        SteedosUI.Drawer(Object.assign({
            name: name,
            title: title,
            destroyOnClose: true,
            maskClosable: false,
            footer: null,
            bodyStyle: {padding: "0px", paddingTop: "12px"},
            children: <Form appId={appId} objectName={objectName} recordId={recordId} data={data}></Form>,
            mask: false,
            size: 'large',
            style: null,
            extra: (
            <Space>
                <Button onClick={(e)=>{
                    SteedosUI.getRef(name).close();
                    if(isFunction(onCancel)){
                        onCancel(e)
                    }
                }}>取消</Button>
                <Button type='primary' onClick={(e)=>{
                    const scope = SteedosUI.getRef(SteedosUI.getRefId({type: `form`, appId: appId, name: objectName}));
                    const form = scope.getComponentByName(`page_edit_${recordId}.form_edit_${recordId}`);
                    form.handleAction({}, { type: "submit" }).then((data)=>{
                        if(data){
                            SteedosUI.getRef(name).close();
                            if(isFunction(onSubmitted)){
                                onSubmitted(e, data)
                            }
                        }
                    })
                }}>确认</Button>
            </Space>)
        }, options?.props))
    }else{
        router.push(`/app/${appId}/${objectName}/view/new`)
    }
}

const getGraphqlFieldsQuery = (fields)=>{
    const fieldsName = ['_id'];
    fields.push('record_permissions');
    //TODO 此处需要考虑相关对象查询
    each(fields, (fieldName)=>{
        if(fieldName.indexOf('.') > -1){
            fieldName = fieldName.split('.')[0]
        }
        fieldsName.push(`${fieldName}`)
    })
    return `${fieldsName.join(' ')}`;
}

const getFindOneQuery = (objectName, id, fields)=>{
    objectName = objectName.replace(/\./g, '_');
    const queryFields = getGraphqlFieldsQuery(fields);
    let queryOptions = ''
    let alias = "record";
    
    const queryOptionsArray = [`id: "${id}"`];
    
    if(queryOptionsArray.length > 0){
        queryOptions = `(${queryOptionsArray.join(',')})`
    }

    return `{${alias}:${objectName}__findOne${queryOptions}{${queryFields}}}`
}

export const SObject = {
    //TODO 清理router参数传递
    newRecord: (props)=>{
        return editRecordHandle(props)
    },
    editRecord: (props)=>{
        return editRecordHandle(props)
    },
    getRecord: async (objectName, recordId, fields)=>{
        const result = await fetchAPI('/graphql', {
            method: 'post',
            body: JSON.stringify({
                query: getFindOneQuery(objectName, recordId, fields)
            })
        })
        return result.data.record;
    }
}