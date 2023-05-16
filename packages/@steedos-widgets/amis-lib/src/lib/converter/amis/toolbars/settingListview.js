import { newListview } from "./settingListview/newListview"
import { copyListview } from "./settingListview/copyListview"
import { renameListview } from "./settingListview/renameListview"
import { shareListview } from "./settingListview/shareListview"
import { filtersListview } from "./settingListview/filtersListview"
import { showListview } from "./settingListview/showListview"
import { sortListview } from "./settingListview/sortListview"
import { deleteListview } from "./settingListview/deleteListview"

export const settingListview = ()=>{
    return {
        "type": "dropdown-button",
        "trigger": "click",
        "icon": "fa fa-cog",
        "btnClassName": "antd-Button--iconOnly bg-white p-2 rounded border-gray-300 text-gray-500",
        "align": "right",
        "visibleOn": "${!isLookup}",
        "buttons": [
          {
            "label": "列表视图操作",
            "children": [
              newListview(),
              copyListview(),
              renameListview(),
              shareListview(),
              filtersListview(),
              showListview(),
              sortListview(),
              deleteListview()
            ]
          }
        ]
    }
}