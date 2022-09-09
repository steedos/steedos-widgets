/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

var tslib = require('tslib');
var amisCore = require('amis-core');
require('../Table/index.js');
var QuickEdit = require('../QuickEdit.js');
var Copyable = require('../Copyable.js');
var PopOver = require('../PopOver.js');
var TableCell = require('../Table/TableCell.js');

/** @class */ ((function (_super) {
    tslib.__extends(CellFieldRenderer, _super);
    function CellFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CellFieldRenderer.defaultProps = tslib.__assign(tslib.__assign({}, TableCell.TableCell.defaultProps), { wrapperComponent: 'div' });
    CellFieldRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'cell-field',
            name: 'cell-field'
        }),
        PopOver.HocPopOver(),
        Copyable.HocCopyable(),
        QuickEdit.HocQuickEdit()
    ], CellFieldRenderer);
    return CellFieldRenderer;
})(TableCell.TableCell));
