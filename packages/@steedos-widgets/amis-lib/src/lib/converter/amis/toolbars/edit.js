import { newListview } from "./edit/newListview"
import { copyListview } from "./edit/copyListview"
import { renameListview } from "./edit/renameListview"
import { shareListview } from "./edit/shareListview"
import { filtersListview } from "./edit/filtersListview"
import { showListview } from "./edit/showListview"
import { sortListview } from "./edit/sortListview"
import { deleteListview } from "./edit/deleteListview"

export const edit = ()=>{
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