/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var ButtonGroupSelect = require('./Form/ButtonGroupSelect.js');
var amisCore = require('amis-core');

/** @class */ ((function (_super) {
    tslib.__extends(ButtonGroupRenderer, _super);
    function ButtonGroupRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonGroupRenderer = tslib.__decorate([
        amisCore.Renderer({
            type: 'button-group'
        })
    ], ButtonGroupRenderer);
    return ButtonGroupRenderer;
})(ButtonGroupSelect["default"]));

exports["default"] = ButtonGroupSelect["default"];
