import _ from 'lodash';
import { isExpression, parseSingleExpression } from './expression';

const getGlobalData = ()=>{
    return {
        now: new Date()
    }
}

const isVisible = (button, ctx)=>{
    if(button._visible){
        if(_.startsWith(_.trim(button._visible), 'function')){
            window.eval("var fun = " + button._visible);
            button.visible = fun;
        }else if(isExpression(button._visible)){
            button.visible = (props)=>{
                parseSingleExpression(button._visible, props.record, "#", getGlobalData(), props.userSession)
            }
        }
    }
    if(_.isFunction(button.visible)){
        try {
            return button.visible(ctx)
        } catch (error) {
            // console.error(`${button.name} visible error: ${error}`);
        }
    }else{
        return button.visible;
    }
}

// TODO
export const standardButtonsTodo = {
    standard_new: (event, props)=>{
        props.router.push('/app/'+props.data.app_id+'/'+props.data.objectName+'/view/new')
    },
    standard_edit: (event, props)=>{

    },
    standard_delete:(event, props)=>{

    }
}

// TODO
const standardButtonsVisible = {
    standard_newVisible: (props)=>{

    }
}

export const getButtons = (uiSchema, ctx) => {
    const disabledButtons = uiSchema.permissions.disabled_actions
	let buttons = _.sortBy(_.values(uiSchema.actions) , 'sort');
    if(_.has(uiSchema, 'allow_customActions')){
        buttons = _.filter(buttons, (button)=>{
            return _.include(uiSchema.allow_customActions, button.name) // || _.include(_.keys(Creator.getObject('base').actions) || {}, button.name)
        })
    }
    if(_.has(uiSchema, 'exclude_actions')){
        buttons = _.filter(buttons, (button)=>{
            return !_.include(uiSchema.exclude_actions, button.name)
        })
    }

    _.each(buttons, (button)=>{
        if(ctx.isMobile && ["record", "record_only"].indexOf(button.on) > -1 && button.name != 'standard_edit'){
            if(button.on == "record_only"){
                button.on = 'record_only_more'
            }else{
                button.on = 'record_more'
            }
        }
    })

    if(ctx.isMobile && ["cms_files", "cfs.files.filerecord"].indexOf(uiSchema.name) > -1){
        _.map(buttons, (button)=>{
            if(button.name === 'standard_edit'){
                button.on = 'record_more'
            }
            if(button.name === 'download'){
                button.on = 'record'
            }
        })
    }

    return _.filter(buttons, (button)=>{
        return _.indexOf(disabledButtons, button.name) < 0;
    })

}

export const getListViewButtons = (uiSchema, ctx) => {
    const buttons = getButtons(uiSchema, ctx);
    return _.filter(buttons, (button)=>{
        if(button.on == 'list'){
            return isVisible(button, ctx)
        }
        return false;
    })

}

export const getObjectDetailButtons = (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    return _.filter(buttons, (button)=>{
        if(button.on == "record" || button.on == "record_only"){
            return isVisible(button, ctx)
        }
        return false;
    })
}

export const getObjectDetailMoreButtons = (uiSchema, ctx)=>{
    const buttons = getButtons(uiSchema, ctx);
    return _.filter(buttons, (button)=>{
        if(button.on == "record_more" || button.on == "record_only_more"){
            return isVisible(button, ctx)
        }
        return false;
    })
}


export const execute = (button, props)=>{
    if(!button.todo){
        return; //TODO 弹出提示未配置todo
    }

    if(_.isString(button.todo)){
        if(_.startsWith(_.trim(button.todo), 'function')){
            window.eval("var fun = " + button.todo);
            button.todo = fun;
        }
    }
    if(_.isFunction(button.todo)){
        return button.todo.apply({}, [props])
    }
}