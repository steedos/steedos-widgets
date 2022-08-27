import _ from "lodash";
import { isExpression, parseSingleExpression } from "./expression";
import { getApi } from '@/lib/converter/amis/graphql';
import config from "@/config";

const getGlobalData = () => {
    return {
        now: new Date(),
    };
};

const isVisible = (button, ctx) => {
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
        SteedosUI.Object.newRecord({
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
            options = {},
        } = props;
        SteedosUI.Object.editRecord({
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
                SteedosUI.getRef(
                    SteedosUI.getRefId({
                        type: "detail",
                        appId: appId,
                        name: uiSchema.name,
                    })
                )
                    .getComponentById(`detail_${recordId}`)
                    .reload();
            },
        });
    },
    standard_delete: (event, props) => { },
    standard_delete_many: (event, props)=>{
        const {
            listViewId,
            uiSchema,
        } = props;
        const listViewRef = SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${uiSchema.name}`)
          
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
    return _.filter(buttons, (button) => {
        if (button.on == "list") {
            return isVisible(button, ctx);
        }
        return false;
    });
};

export const getObjectDetailButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    return _.filter(buttons, (button) => {
        if (button.on == "record" || button.on == "record_only") {
            return isVisible(button, ctx);
        }
        return false;
    });
};

export const getObjectDetailMoreButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    const moreButtons = _.filter(buttons, (button) => {
        if (button.on == "record_more" || button.on == "record_only_more") {
            return isVisible(button, ctx);
        }
        return false;
    });

    // 如果是standard_delete 且 _visible 中调用了 Steedos 函数, 则自动添加标注的删除功能
    const standardDelete = _.find(buttons, (btn)=>{ return btn.name == 'standard_delete'})
    if(standardDelete && standardDelete._visible.indexOf('Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply') > 0){
        moreButtons.push({
            label: "删除",
            name: "standard_delete",
            on: "record_more",
            type: "amis_action",
            todo: "standard_delete",
            confirmText: "确定要删除此项目?",
            amis_actions: [
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
        })
    }
    return moreButtons;
};

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
