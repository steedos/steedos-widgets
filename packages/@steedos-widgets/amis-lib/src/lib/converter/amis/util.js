/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-18 15:22:51
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