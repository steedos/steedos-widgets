import * as _ from 'lodash';
import { isExpression, parseSingleExpression } from "./expression";
import { getUISchema } from "./objects";
import { i18next } from '../i18n'

import { StandardButtons } from '../standard/button'

const getGlobalData = () => {
    return {
        now: new Date(),
    };
};

export function getButtonVisibleOn(button){
    let visible= button.visible;

    if(button._visible){
        visible = button._visible;
    }

    if(_.isBoolean(visible)){
        visible = visible.toString();
    }

    if(visible){
        // if(visible.indexOf("Meteor.") > 0 || visible.indexOf("Creator.") > 0 || visible.indexOf("Session.") > 0){
        //     console.warn('无效的visible', visible)
        //     return 'false';
        // }
        if(visible.trim().startsWith('function')){
            visible = `(function(){try{const fun = ${visible}; return fun.apply({
                object: uiSchema
            }, [objectName, typeof _id === 'undefined' ? null: _id, typeof record === 'undefined' ? (typeof recordPermissions === 'undefined' ? {} : recordPermissions) : record.recordPermissions, data])}catch(e){console.error(e)}})()`
        }
    }

    if(button.type === 'amis_button'){
        let amisSchema = button.amis_schema;
        if(_.isString(amisSchema)){
            amisSchema = JSON.parse(amisSchema);
        }
        if(amisSchema && amisSchema.body && amisSchema.body.length > 0){
            const btn1 = amisSchema.body[0];
            if(_.hasIn(btn1, 'visibleOn')){
                /*  当含有“更多”按钮或者“下拉”箭头按钮时，单个按钮的visibleOn需要合并到 “更多”按钮或者“下拉”箭头按钮的 visibleOn 中，用||隔开。
                    visibleOn的格式需要保持一致； 不能是 js  和  ${xxx} 混合的表达式；
                    visibleOn的值需要是js格式，因为默认的编辑、删除等系统按钮的visibleOn的格式就是js格式（function(){}）; 
                */
                return btn1.visibleOn
            }   
        }
    }
    return visible;
}

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


export const standardButtonsTodo = {
    // 批量删除比较特殊, CRUD组件在外部无法触发批量操作action.
    standard_delete_many: function(){
        const {
            listViewId,
            uiSchema,
            scopeId
        } = this;
        const listViewRef = SteedosUI?.getRef(scopeId || listViewId).getComponentById(`listview_${uiSchema.name}`)
          
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


/**
 * 按钮显隐规则: 优先使用页面布局上的配置.
 * @param {*} uiSchema 
 * @param {*} ctx 
 * @returns 
 */
export const getButtons = (uiSchema, ctx) => {
    const disabledButtons = uiSchema.permissions && uiSchema.permissions.disabled_actions;
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
        return _.indexOf(disabledButtons, button.name) < 0 && button.name != 'standard_query';
    });
};

export const getListViewButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        return button.on == "list";
    });
    return listButtons;
};

export const getObjectDetailButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const detailButtons = _.filter(buttons, (button) => {
        return button.on == "record" || button.on == "record_only";
    });
    return _.sortBy(detailButtons, "sort");
};

export const getObjectDetailMoreButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const moreButtons = _.filter(buttons, (button) => {
        return button.on == "record_more" || button.on == "record_only_more";
    });
    return _.sortBy(moreButtons, "sort");
};

export const getListViewItemButtons = async (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        return button.on == "record" || button.on == "list_item" || button.on === 'record_more';
    });
    return listButtons;
}

export const getObjectRelatedListButtons = (uiSchema, ctx)=>{
    // const buttons = getButtons(uiSchema, ctx);
    // const relatedListButtons = _.filter(buttons, (button) => {
    //     if(button.objectName === 'cms_files'){
    //         // TODO:附件对象本身没有上传按钮，需要自定义
    //     }else{
    //         return button.name == "standard_new";
    //     }
    // });
    // return relatedListButtons;
    const buttons = getButtons(uiSchema, ctx);
    const listButtons = _.filter(buttons, (button) => {
        return button.on == "list";
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

        if(button.name == 'standard_edit' && (button.todo === 'standard_edit' &&  button.type != "amis_button")){ // && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply') > 0
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                ...await StandardButtons.getStandardEdit(uiSchema, ctx)
            };
        }
        if(objectName != 'cms_files' && button.name == 'standard_new' && (button.todo === 'standard_new' &&  button.type != "amis_button")){ //&& button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_new.visible.apply') > 0
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                ...await StandardButtons.getStandardNew(uiSchema, ctx)
            }
        }

        // 如果是standard_delete 且 _visible 中调用了 Steedos 函数, 则自动添加标准的删除功能
        if(button.name == 'standard_delete' && (button.todo === 'standard_delete' &&  button.type != "amis_button")){ // && button._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply') > 0
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                sort: button.sort,
                ...await StandardButtons.getStandardDelete(uiSchema, ctx)
            }
        }

        if(uiSchema.hasImportTemplates && button.name === 'standard_import_data'){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                sort: button.sort,
                ...await StandardButtons.getStandardImportData(uiSchema, ctx)
            }
        }

        if(button.name === 'standard_export_excel'){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                sort: button.sort,
                ...await StandardButtons.getStandardExportExcel(uiSchema, ctx)
            }
        }

        if(button.name === 'standard_open_view'){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                sort: button.sort,
                ...await StandardButtons.getStandardOpenView(uiSchema, ctx)
            }
        }

        if(button.name === 'standard_delete_many'){
            return {
                label: button.label,
                name: button.name,
                on: button.on,
                sort: button.sort,
                ...await StandardButtons.getStandardDeleteMany(uiSchema, ctx)
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
        const todoThis = {
            objectName: props.objectName, 
            object_name: props.objectName, 
            object: props.uiSchema, 
            record: props.record,
            recordId: props.recordId,
            record_id: props.recordId,
            ...props,
            action: button
        }
        return button.todo.apply(todoThis, [todoThis.objectName, todoThis.recordId]);
    }
};

export const executeButton = execute;


const getObjectDetailHeaderButtons = (objectSchema, recordId)=>{
    const { name } = objectSchema;
    const buttons = getObjectDetailButtons(objectSchema, {});
    const moreButtons = getObjectDetailMoreButtons(objectSchema, {
        recordId: recordId,
        objectName: name
    })
    let amisButtonsSchema = _.map(buttons, (button) => {
        return {
        type: 'steedos-object-button',
        name: button.name,
        objectName: button.objectName,
        visibleOn: getButtonVisibleOn(button),
        className: `button_${button.name}`
        }
    })
    let moreButtonsVisibleOn = '';
    let dropdownButtons = _.map(moreButtons, (button, index) => {
        if(index === 0){
            moreButtonsVisibleOn = getButtonVisibleOn(button);
        }else{
            moreButtonsVisibleOn = moreButtonsVisibleOn + ' || ' +getButtonVisibleOn(button);
        }
       
        return {
        type: 'steedos-object-button',
        name: button.name,
        objectName: button.objectName,
        visibleOn: getButtonVisibleOn(button),
        }
    })
    return {
        buttons: amisButtonsSchema,
        moreButtons: dropdownButtons,
        moreButtonsVisibleOn
    };
}

const getDropdown = (dropdownButtons)=>{
    const dropdown = {
        "type": "dropdown-button",
        "icon": "fa fa-angle-down",
        "size": "sm",
        "hideCaret": true,
        "className": "mr-0 steedos-mobile-header-drop-down",
        "closeOnClick": true,
        "menuClassName": "buttons-drawer fixed bg-none border-0 shadow-none",
        "align": "right",
        "body": [
            {
                "type": "action",
                "style": {
                    "z-index": 1,
                    "background": "var(--Drawer-overlay-bg)",
                    "height": "100%",
                    "width": "100%",
                    "padding": "0",
                    "margin": "0",
                    "border-radius": "0"
                }
            },
            {
                "type": "wrapper",
                "style": {
                    "position": "fixed",
                    "bottom": 0,
                    "z-index": 2,
                    "width": "100vw",
                    "left": "0",
                    "padding": "0",
                    "background": "white",
                    "box-shadow": "0 -10px 10px -10px rgba(0, 0, 0, 0.2)"
                },
                "body": [
                    {
                        "type": "flex",
                        "justify": "space-between",
                        "items": [
                            {
                                "type": "tpl",
                                "tpl": "操作",
                                "style": {
                                    "padding": "4px 12px",
                                    "align-items": "center",
                                    "display": "flex"
                                }
                            },
                            {
                                "type": "action",
                                "label": "",
                                "icon": "fa fa-times",
                                "level": "link",
                                "style": {
                                    "color": "black"
                                },
                            }
                        ],
                        "style": {
                            "padding-top": "0.5rem",
                            "padding-bottom": "0.5rem",
                            "border-bottom": "var(--Drawer-content-borderWidth) solid var(--Drawer-header-borderColor)"
                        }
                    },
                    {
                        "type": "wrapper",
                        "body": [
                            {
                                "type": "button-group",
                                "id": "u:fd837823be5b",
                                "vertical": true,
                                "tiled": true,
                                "buttons": dropdownButtons,
                                "className": "w-full overflow-auto",
                                "btnClassName": "w-full",
                                "size": "lg"
                            }
                        ],
                        "style": {
                            "padding": "0",
                            "overflow": "auto",
                            "max-height": "70vh"
                        }
                    }

                ]
            }
        ]
    }

    return dropdown;
}

export const getObjectDetailButtonsSchemas = (objectSchema, recordId, ctx)=>{
    const { buttons, moreButtons, moreButtonsVisibleOn } = getObjectDetailHeaderButtons(objectSchema, recordId);
    if(ctx.formFactor === 'SMALL'){
        const dropdownButtons = [
            ..._.map(buttons, (button) => {
                button.className += ' w-full';
                return button;
            }),
            ..._.map(moreButtons, (button) => {
                button.className += ' w-full';
                return button;
            })
        ];

        let phoneMoreButtonsVisibleOn = '';
        _.forEach(dropdownButtons, (button, index) => {
            if(index === 0){
                phoneMoreButtonsVisibleOn = button.visibleOn;
            }else{
                phoneMoreButtonsVisibleOn = phoneMoreButtonsVisibleOn + ' || ' + button.visibleOn;
            }
        })

        return [getDropdown(dropdownButtons)];
    }else{
        if(moreButtons.length > 0){
            const dropdownButtonsSchema = {
                type: "steedos-dropdown-button",
                label: "",
                buttons: moreButtons,
                "overlayClassName": "border rounded !min-w-[160px]",
                className: 'slds-icon ml-1',
                visibleOn: moreButtonsVisibleOn
            }
            buttons.push(dropdownButtonsSchema);
        }
        return buttons;
    }
}


export const getObjectListViewButtonsSchemas = (objectSchema, ctx)=>{
    const buttons = getListViewButtons(objectSchema, ctx);
    if(ctx.formFactor === 'SMALL'){
        const dropdownButtons = _.map(buttons, (button)=>{
            return {
                type: 'steedos-object-button',
                name: button.name,
                objectName: button.objectName,
                visibleOn: getButtonVisibleOn(button),
                className: `button_${button.name} w-full`
            }
        });
        return getDropdown(dropdownButtons);
    }else{
        return _.map(buttons, (button) => {
            return {
            type: 'steedos-object-button',
            name: button.name,
            objectName: button.objectName,
            visibleOn: getButtonVisibleOn(button),
            className: `button_${button.name}`
            }
        });
    }
}

export const getObjectRecordDetailRelatedListButtonsSchemas = (objectSchema, ctx)=>{
    const buttons = getObjectRelatedListButtons(objectSchema, ctx);
    if(ctx.formFactor === 'SMALL'){
        const dropdownButtons = _.map(buttons, (button)=>{
            return {
                type: 'steedos-object-button',
                name: button.name,
                objectName: button.objectName,
                visibleOn: getButtonVisibleOn(button),
                className: `button_${button.name} w-full`
            }
        });
        return [getDropdown(dropdownButtons)];
    }else{
        return _.map(buttons, (button) => {
            return {                                                                                                                                                                                                                                                                                                                                                                    
                type: 'steedos-object-button',
                name: button.name,
                objectName: button.objectName,
                visibleOn: getButtonVisibleOn(button),
                className: `button_${button.name}`
            }
        });
    }
}