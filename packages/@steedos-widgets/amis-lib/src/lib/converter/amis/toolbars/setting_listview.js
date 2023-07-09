import { getNewListviewButtonSchema } from "./setting_listview/new"
import { getCopyListviewButtonSchema } from "./setting_listview/copy"
import { getRenameListviewButtonSchema } from "./setting_listview/rename"
import { getSetListviewShareButtonSchema } from "./setting_listview/share"
import { getSetListviewFiltersButtonSchema } from "./setting_listview/filters"
import { getSetListviewColumnsButtonSchema } from "./setting_listview/columns"
import { getSetListviewSortButtonSchema } from "./setting_listview/sort"
import { getDeleteListviewButtonSchema } from "./setting_listview/delete"
import { i18next } from "../../../../i18n"

export const getSettingListviewToolbarButtonSchema = ()=>{
    return {
        "type": "dropdown-button",
        "trigger": "click",
        "icon": "fa fa-cog",
        "tooltip": i18next.t('frontend_button_listview_control_tooltip'),
        "btnClassName": "antd-Button--iconOnly bg-white !p-2 rounded border-gray-300 text-gray-500",
        "align": "right",
        "visibleOn": "${!isLookup}",
        "buttons": [
          {
            "label": i18next.t('frontend_button_listview_control_label'),
            "children": [
              getNewListviewButtonSchema(),
              getCopyListviewButtonSchema(),
              getRenameListviewButtonSchema(),
              getSetListviewShareButtonSchema(),
              getSetListviewFiltersButtonSchema(),
              getSetListviewColumnsButtonSchema(),
              getSetListviewSortButtonSchema(),
              getDeleteListviewButtonSchema()
            ]
          }
        ]
    }
}