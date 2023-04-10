
/**
 * 
 * @param {*} rows rows内必须有value，parent，children
 * @returns 把扁平的数据转换为树状结构的数据
 * @options unfoldedNum默认展开层数，默认值为1
 */
export function getTreeOptions(rows, options) {

    const valueField = "value";
    const unfoldedNum = options?.unfoldedNum || 1;

    const treeRecords = [];
    const getChildren = (rows, childrenIds, childrenUnfoldedNum) => {
        if (!childrenIds) {
            return;
        }
        const children = _.filter(rows, (row) => {
            return _.includes(childrenIds, row[valueField])
        });
        _.each(children, (item) => {
            if (childrenUnfoldedNum >= 1) {
                item.unfolded = true;
                if (item["children"]) {
                    item["children"] = getChildren(rows, item["children"], childrenUnfoldedNum - 1)
                }
            } else {
                if (item["children"]) {
                    item["children"] = getChildren(rows, item["children"], childrenUnfoldedNum)
                }
            }

        })
        return children;
    }

    const getRoot = (rows) => {
        for (var i = 0; i < rows.length; i++) {
            rows[i].noParent = 0;
            rows[i].unfolded = false;//将所有节点的默认展开设置关闭
            if (!!rows[i]["parent"]) {
                let biaozhi = 1;
                for (var j = 0; j < rows.length; j++) {
                    if (rows[i]["parent"] == rows[j][valueField])
                        biaozhi = 0;
                }
                if (biaozhi == 1) rows[i].noParent = 1;
            } else rows[i].noParent = 1;
        }
    }
    getRoot(rows);

    _.each(rows, (row) => {
        if (row.noParent == 1) {
            if (unfoldedNum >= 1) {
                row.unfolded = true;
                treeRecords.push(Object.assign({}, row, { children: getChildren(rows, row["children"], unfoldedNum - 1) }));
            }else{
                treeRecords.push(Object.assign({}, row, { children: getChildren(rows, row["children"], unfoldedNum) }));
            }
        }
    });

    return treeRecords;
}