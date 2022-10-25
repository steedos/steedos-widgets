import _ from "lodash";
import { isExpression, parseSingleExpression } from "./expression";
import { getApi } from './converter/amis/graphql';
import config from "../config";
import { getUISchema } from "./objects";

const getGlobalData = () => {
    return {
        now: new Date(),
    };
};

export const getButtonVisible = (button, ctx) => {
    if (button._visible) {
        if (_.startsWith(_.trim(button._visible), "function")) {
            window.eval("var fun = " + button._visible);
            button.visible = fun;
        } else if (isExpression(button._visible)) {
            button.visible = (props) => {
                parseSingleExpression(
                    button._visible,
                    props.record,
                    "#",
                    getGlobalData(),
                    props.userSession
                );
            };
        }
    }
    if (_.isFunction(button.visible)) {
        try {
            return button.visible(ctx);
        } catch (error) {
            // console.error(`${button.name} visible error: ${error}`);
        }
    } else {
        return button.visible;
    }
};

// TODO
export const standardButtonsTodo = {
    standard_new: (event, props) => {
        const {
            appId,
            listViewId,
            uiSchema,
            formFactor,
            data,
            router,
            options = {},
        } = props;
        // router.push('/app/'+props.data.app_id+'/'+props.data.objectName+'/view/new');
        const type = config.listView.newRecordMode;
        SteedosUI?.Object.newRecord({
            onSubmitted: () => {
                SteedosUI.getRef(listViewId)
                    .getComponentByName(`page.listview_${uiSchema.name}`)
                    .handleAction({}, { actionType: "reload" });
            },
            onCancel: () => {
                SteedosUI.getRef(listViewId)
                    .getComponentByName(`page.listview_${uiSchema.name}`)
                    .handleAction({}, { actionType: "reload" });
            },
            appId: appId,
            formFactor: formFactor,
            name: SteedosUI.getRefId({ type: `${type}-form` }),
            title: `新建 ${uiSchema.label}`,
            objectName: uiSchema.name,
            data: data,
            recordId: "new",
            type,
            options: options,
            router,
        });
    },
    standard_edit: (event, props) => {
        const type = config.listView.newRecordMode;
        const {
            appId,
            recordId,
            uiSchema,
            formFactor,
            router,
            listViewId,
            options = {},
        } = props;
        SteedosUI?.Object.editRecord({
            appId: appId,
            name: SteedosUI.getRefId({ type: `${type}-form` }),
            title: `编辑 ${uiSchema.label}`,
            objectName: uiSchema.name,
            recordId: recordId,
            type,
            options: options,
            router,
            formFactor: formFactor,
            onSubmitted: () => {
                const detailScope = SteedosUI.getRef(
                    SteedosUI.getRefId({
                        type: "detail",
                        appId: appId,
                        name: uiSchema.name,
                    })
                );
                if(detailScope && detailScope.getComponentById(`detail_${recordId}`)){
                    detailScope.getComponentById(`detail_${recordId}`)
                        .reload();
                }else{
                    SteedosUI.getRef(listViewId)
                    .getComponentByName(`page.listview_${uiSchema.name}`)
                    .handleAction({}, { actionType: "reload" });
                }
            },
        });
    },
    standard_delete: (event, props) => { },
    standard_delete_many: (event, props)=>{
        const {
            listViewId,
            uiSchema,
        } = props;
        const listViewRef = SteedosUI?.getRef(listViewId).getComponentByName(`page.listview_${uiSchema.name}`)
          
        if(_.isEmpty(listViewRef.props.store.toJSON().selectedItems)){
            listViewRef.handleAction({}, {
                "actionType": "toast",
                "toast": {
                    "items": [
                      {
                        "position": "top-right",
                        "body": "请选择要删除的项"
                      }
                    ]
                  }
              })
        }else{
            listViewRef.handleBulkAction(listViewRef.props.store.toJSON().selectedItems,[],{},listViewRef.props.bulkActions[0]);
        }
    }
};

// TODO
const standardButtonsVisible = {
    standard_newVisible: (props) => { },
};

/**
 * 按钮显隐规则: 优先使用页面布局上的配置.
 * @param {*} uiSchema 
 * @param {*} ctx 
 * @returns 
 */
export const getButtons = (uiSchema, ctx) => {
    const disabledButtons = uiSchema.permissions.disabled_actions;
    let buttons = _.sortBy(_.values(uiSchema.actions), "sort");
    if (_.has(uiSchema, "allow_customActions")) {
        buttons = _.filter(buttons, (button) => {
            return _.include(uiSchema.allow_customActions, button.name); // || _.include(_.keys(Creator.getObject('base').actions) || {}, button.name)
        });
    }
    if (_.has(uiSchema, "exclude_actions")) {
        buttons = _.filter(buttons, (button) => {
            return !_.include(uiSchema.exclude_actions, button.name);
        });
    }

    _.each(buttons, (button) => {
        button.objectName = uiSchema.name;
        if (
            ctx.isMobile &&
            ["record", "record_only"].indexOf(button.on) > -1 &&
            button.name != "standard_edit"
        ) {
            if (button.on == "record_only") {
                button.on = "record_only_more";
            } else {
                button.on = "record_more";
            }
        }
    });

    if (
        ctx.isMobile &&
        ["cms_files", "cfs.files.filerecord"].indexOf(uiSchema.name) > -1
    ) {
        _.map(buttons, (button) => {
            if (button.name === "standard_edit") {
                button.on = "record_more";
            }
            if (button.name === "download") {
                button.on = "record";
            }
        });
    }

    return _.filter(buttons, (button) => {
        return _.indexOf(disabledButtons, button.name) < 0;
    });
};

export const getListViewButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        if (button.on == "list") {
            return getButtonVisible(button, ctx);
        }
        return false;
    });
    // 如果是standard_new 且 _visible 中调用了 Steedos 函数, 则自动添加标准的新建功能
    const standardNew = _.find(buttons, (btn)=>{ return btn.name == 'standard_new'})
    if( uiSchema.name != 'cms_files' && uiSchema.permissions.allowCreate && standardNew && standardNew._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_new.visible.apply') > 0){
        listButtons.push({
            label: standardNew.label,
            name: standardNew.name,
            on: standardNew.on,
            type: standardNew.type,
            todo: (event)=>{
                return standardButtonsTodo.standard_new.call({}, event, {
                    listViewId: ctx.listViewId,
                    appId: ctx.app_id,
                    uiSchema: uiSchema,
                    formFactor: ctx.formFactor,
                    router: ctx.router,
                    data: ctx.data,
                    options: ctx.formFactor === 'SMALL' ? {
                        props: {
                          width: "100%",
                          style: {
                            width: "100%",
                          },
                          bodyStyle: { padding: "0px", paddingTop: "0px" },
                        }
                      } : null
                  })
            }
        }); 
    }
    return listButtons;
};

export const getObjectDetailButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const detailButtons = _.filter(buttons, (button) => {
        if (button.on == "record" || button.on == "record_only") {
            return getButtonVisible(button, ctx);
        }
        return false;
    });
    // 如果是standard_edit 且 _visible 中调用了 Steedos 函数, 则自动添加标准的编辑功能
    const standardEdit = _.find(buttons, (btn)=>{ return btn.name == 'standard_edit'})
    if(ctx.permissions?.allowEdit && standardEdit && standardEdit._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply') > 0){
        detailButtons.push({
            label: standardEdit.label,
            name: standardEdit.name,
            on: standardEdit.on,
            type: standardEdit.type,
            todo: (event)=>{
                return standardButtonsTodo.standard_edit.call({}, event, {
                    recordId: ctx.recordId,
                    appId: ctx.app_id,
                    uiSchema: uiSchema,
                    formFactor: ctx.formFactor,
                    router: ctx.router,
                    options: ctx.formFactor === 'SMALL' ? {
                        props: {
                          width: "100%",
                          style: {
                            width: "100%",
                          },
                          bodyStyle: { padding: "0px", paddingTop: "0px" },
                        }
                      } : null
                  })
            }
        })
    }

    return _.sortBy(detailButtons, "sort");
};

export const getObjectDetailMoreButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const moreButtons = _.filter(buttons, (button) => {
        if (button.on == "record_more" || button.on == "record_only_more") {
            return getButtonVisible(button, ctx);
        }
        return false;
    });

    // 如果是standard_delete 且 _visible 中调用了 Steedos 函数, 则自动添加标准的删除功能
    const standardDelete = _.find(buttons, (btn)=>{ return btn.name == 'standard_delete'})
    if(ctx.permissions?.allowDelete && standardDelete && standardDelete._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply') > 0){
        moreButtons.push({
            label: standardDelete.label,
            name: standardDelete.name,
            on: standardDelete.on,
            type: "amis_button",
            sort: standardDelete.sort,
            amis_schema: {
                type: "service",
                bodyClassName: 'p-0',
                body: [
                    {
                        type: "button",
                        label: '删除',
                        confirmText: "确定要删除此项目?",
                        className: 'border-none',
                        onEvent: {
                            click: {
                                actions: [
                                    {
                                      "args": {
                                        "api": {
                                            method: 'post',
                                            url: getApi(),
                                            requestAdaptor: `
                                                var deleteArray = [];
                                                 deleteArray.push(\`delete:${ctx.objectName}__delete(id: "${ctx.recordId}")\`);
                                                api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
                                                return api;
                                            `,
                                            headers: {
                                                Authorization: "Bearer ${context.tenantId},${context.authToken}"
                                            }
                                        },
                                        "messages": {
                                            "success": "删除成功",
                                            "failed": "删除失败"
                                        }
                                      },
                                      "actionType": "ajax"
                                    }
                                  ]
                            }
                        }
                    }
                ],
                regions: [
                  "body"
                ]
              }
        })
    }
    return _.sortBy(moreButtons, "sort");
};

export const getListViewItemButtons = async (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        return button.on == "record" || button.on == "list_item" || button.on === 'record_more';
    });
    return listButtons;
}

/**
 * 由此函数负责内置按钮的转换
 * @param {*} objectName 
 * @param {*} buttonName 
 * @param {*} ctx 
 * @returns 
 */
export const getButton = async (objectName, buttonName, ctx)=>{
    const uiSchema = await getUISchema(objectName);
    const { props } = ctx;
    if(uiSchema){
        const buttons = await getButtons(uiSchema, ctx);
        const button = _.find(buttons, (button)=>{
            return button.name === buttonName
        });

        if(!button){
            return ;
        }

        if(button.name == 'standard_edit' && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply') > 0){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                type: button.type,
                todo: (event)=>{
                    return standardButtonsTodo.standard_edit.call({}, event, {
                        recordId: ctx.recordId,
                        appId: ctx.app_id,
                        uiSchema: uiSchema,
                        formFactor: ctx.formFactor,
                        router: ctx.router,
                        listViewId: ctx.listViewId,
                        options: ctx.formFactor === 'SMALL' ? {
                            props: {
                              width: "100%",
                              style: {
                                width: "100%",
                              },
                              bodyStyle: { padding: "0px", paddingTop: "0px" },
                            }
                          } : null
                      })
                }
            };
        }

        if(objectName != 'cms_files' && button.name == 'standard_new' && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_new.visible.apply') > 0){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                type: button.type,
                todo: (event)=>{
                    return standardButtonsTodo.standard_new.call({}, event, {
                        listViewId: ctx.listViewId,
                        appId: ctx.app_id,
                        uiSchema: uiSchema,
                        formFactor: ctx.formFactor,
                        router: ctx.router,
                        data: ctx.data,
                        options: ctx.formFactor === 'SMALL' ? {
                            props: {
                              width: "100%",
                              style: {
                                width: "100%",
                              },
                              bodyStyle: { padding: "0px", paddingTop: "0px" },
                            }
                          } : null
                      })
                }
            }
        }

        // 如果是standard_delete 且 _visible 中调用了 Steedos 函数, 则自动添加标准的删除功能
        if(button.name == 'standard_delete' && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply') > 0){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                type: "amis_button",
                sort: button.sort,
                amis_schema: {
                    type: "service",
                    bodyClassName: 'p-0',
                    body: [
                        {
                            type: "button",
                            label: '删除',
                            confirmText: "确定要删除此项目?",
                            className: props.className,
                            onEvent: {
                                click: {
                                    actions: [
                                        {
                                        "args": {
                                            "api": {
                                                method: 'post',
                                                url: getApi(),
                                                requestAdaptor: `
                                                    var deleteArray = [];
                                                    deleteArray.push(\`delete:${ctx.objectName}__delete(id: "${ctx.recordId}")\`);
                                                    api.data = {query: \`mutation{\${deleteArray.join(',')}}\`};
                                                    return api;
                                                `,
                                                headers: {
                                                    Authorization: "Bearer ${context.tenantId},${context.authToken}"
                                                }
                                            },
                                            "messages": {
                                                "success": "删除成功",
                                                "failed": "删除失败"
                                            }
                                        },
                                        "actionType": "ajax"
                                        },
                                        {
                                            "componentId": "",
                                            "args": {
                                              "url": `/app/${ctx.appId}/${ctx.objectName}`,
                                              blank: false,
                                            },
                                            "actionType": "url"
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    regions: [
                    "body"
                    ]
                }
            }
        }
        return button;

    }
}

export const execute = (button, props) => {
    if (!button.todo) {
        return; //TODO 弹出提示未配置todo
    }

    if (_.isString(button.todo)) {
        if (_.startsWith(_.trim(button.todo), "function")) {
            window.eval("var fun = " + button.todo);
            button.todo = fun;
        }
    }
    if (_.isFunction(button.todo)) {
        return button.todo.apply({}, [props]);
    }
};

export const executeButton = execute;
