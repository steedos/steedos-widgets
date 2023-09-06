/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-06 18:59:40
 * @Description: 
 */
import { getRootUrl } from "../../steedos.client";

export function getSvgUrl(source, name) {
    var foo, url;
    foo = name != null ? name.split(".") : void 0;
    if (foo && foo.length > 1) {
      source = foo[0];
      if (!(source != null ? source.endsWith("-sprite") : void 0)) {
        source += "-sprite";
      }
      name = foo[1];
    }
    url = "/assets/icons/" + source + "/svg/symbols.svg#" + name;
    return `${getRootUrl()}${url}`;
}

export function getContrastColor(bgColor) {
  var backgroundColor = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(backgroundColor.substr(0, 2), 16);
  var g = parseInt(backgroundColor.substr(2, 2), 16);
  var b = parseInt(backgroundColor.substr(4, 2), 16);
  var brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? "#ffffff" : "#000000";
}

export function getLookupListView(refObjectConfig) {
  const listNameAll = "all";
  const listNameLookup = "lookup";
  let listViewAll, listViewLookup;

  _.each(
    refObjectConfig.list_views,
    (view, name) => {
      if (name === listNameAll) {
        listViewAll = view;
        if(!listViewAll.name){
          listViewAll.name = name;
        }
      }
      else if (name === listNameLookup) {
        listViewLookup = view;
        if(!listViewLookup.name){
          listViewLookup.name = name;
        }
      }
    }
  );
  let listView = listViewLookup || listViewAll;
  return listView;
}