/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-05-10 22:08:05
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-05-12 13:39:53
 */

/**
 * 递归children找到listview-filter-form
 * @param {*} scope amis scope,在事件中值为event.context.scoped
 * @param {*} type 组件类型，比如form/button
 * @param {*} options
 * @param {*} options.name 组件名称，非必填，未填写时只匹配组件type
 * @param {*} options.direction 递归查找方向，up表示往parent逐层递归查找，down表示往children逐层递归查找，默认值为up
 * @returns 返回scope中找到的amis组件
 */
export function getClosestAmisComponentByType(scope, type, options) {
    if (!options) {
        options = {};
    }
    let name = options.name;
    let direction = options.direction || "up";
    let re = scope.getComponents().find(function (n) {
        return n.props.type === type && (!name || n.props.name === name);
    });
    if (re) {
        return re;
    }
    else if (direction === "down") {
        if (scope.children && scope.children.length) {
            for (let i = 0; i < scope.children.length; i++) {
                re = getClosestAmisComponentByType(scope.children[i], type, options);
                if (re) {
                    break;
                }
            }
            return re;
        }

    }
    else if (direction === "up") {
        if (scope.parent) {
            return getClosestAmisComponentByType(scope.parent, type, options);
        }
    }
}

/**
 * 判断是否crud顶部的搜索栏设置了非空的过滤条件
 * @param {*} formValues filterFormValues，crud顶部的搜索栏表单项值
 * @returns boolean
 */
export function isFilterFormValuesEmpty(formValues) {
    let isEmpty = true;
    let filterFormValues = _.pickBy(formValues, function (n, k) {
        return /^__searchable__/g.test(k);
    });
    if (!_.isEmpty(filterFormValues)) {
        const omitedEmptyFormValue = _.omitBy(filterFormValues, function (n) {
            return _.isNil(n)
                || (_.isObject(n) && _.isEmpty(n))
                || (_.isArray(n) && _.isEmpty(n.filter(function (item) { return !_.isNil(item) })))
                || (_.isString(n) && n.length === 0);
        });
        // 有过滤条件时自动展开搜索栏
        if (!_.isEmpty(omitedEmptyFormValue)) {
            isEmpty = false;
        }
    }
    return isEmpty;
}