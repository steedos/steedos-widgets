/**
 * amis v2.2.0
 * Copyright 2018-2022 baidu
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var amisCore = require('amis-core');
var amisUi = require('amis-ui');
require('./preset.js');
require('./renderers/Action.js');
require('./renderers/Alert.js');
require('./renderers/App.js');
require('./renderers/Avatar.js');
require('./renderers/Remark.js');
require('./renderers/ButtonGroup.js');
require('./renderers/Form/ButtonToolbar.js');
require('./renderers/Breadcrumb.js');
require('./renderers/DropDownButton.js');
require('./renderers/Calendar.js');
require('./renderers/Collapse.js');
require('./renderers/CollapseGroup.js');
require('./renderers/Color.js');
require('./renderers/CRUD.js');
require('./renderers/CRUD2.js');
require('./renderers/Pagination.js');
require('./renderers/Cards.js');
require('./renderers/Card.js');
require('./renderers/Card2.js');
require('./renderers/Custom.js');
require('./renderers/Date.js');
require('./renderers/Dialog.js');
require('./renderers/Divider.js');
require('./renderers/Each.js');
require('./renderers/Flex.js');
require('./renderers/Form/Control.js');
require('./renderers/Form/Hidden.js');
require('./renderers/Form/InputText.js');
require('./renderers/Form/InputTag.js');
require('./renderers/Form/InputNumber.js');
require('./renderers/Form/Textarea.js');
require('./renderers/Form/Checkboxes.js');
require('./renderers/Form/Checkbox.js');
require('./renderers/Form/InputCity.js');
require('./renderers/Form/ChartRadios.js');
require('./renderers/Form/InputRating.js');
require('./renderers/Form/Switch.js');
require('./renderers/Form/Radios.js');
require('./renderers/Form/JSONSchema.js');
require('./renderers/Form/JSONSchemaEditor.js');
require('./renderers/Form/ListSelect.js');
require('./renderers/Form/LocationPicker.js');
require('./renderers/Form/Select.js');
require('./renderers/Form/Static.js');
require('./renderers/Form/InputDate.js');
require('./renderers/Form/InputDateRange.js');
require('./renderers/Form/InputFormula.js');
require('./renderers/Form/InputRepeat.js');
require('./renderers/Form/InputTree.js');
require('./renderers/Form/TreeSelect.js');
require('./renderers/Form/InputImage.js');
require('./renderers/Form/InputFile.js');
require('./renderers/Form/UUID.js');
require('./renderers/Form/MatrixCheckboxes.js');
require('./renderers/Form/InputMonthRange.js');
require('./renderers/Form/InputQuarterRange.js');
require('./renderers/Form/InputYearRange.js');
require('./renderers/Form/InputRange.js');
require('./renderers/Form/InputArray.js');
require('./renderers/Form/Combo.js');
require('./renderers/Form/ConditionBuilder.js');
require('./renderers/Form/InputSubForm.js');
require('./renderers/Form/InputExcel.js');
require('./renderers/Form/InputRichText.js');
require('./renderers/Form/Editor.js');
require('./renderers/Form/DiffEditor.js');
require('./renderers/Form/InputColor.js');
require('./renderers/Form/ChainedSelect.js');
require('./renderers/Form/NestedSelect.js');
require('./renderers/Form/Transfer.js');
require('./renderers/Form/TransferPicker.js');
require('./renderers/Form/InputTable.js');
require('./renderers/Form/Picker.js');
require('./renderers/Form/IconPicker.js');
require('./renderers/Form/Formula.js');
require('./renderers/Form/FieldSet.js');
require('./renderers/Form/TabsTransfer.js');
require('./renderers/Form/TabsTransferPicker.js');
require('./renderers/Form/Group.js');
require('./renderers/Form/InputGroup.js');
require('./renderers/Form/UserSelect.js');
require('./renderers/Grid.js');
require('./renderers/Grid2D.js');
require('./renderers/HBox.js');
require('./renderers/VBox.js');
require('./renderers/Image.js');
require('./renderers/Images.js');
require('./renderers/List.js');
require('./renderers/Log.js');
require('./renderers/Operation.js');
require('./renderers/Page.js');
require('./renderers/PaginationWrapper.js');
require('./renderers/Panel.js');
require('./renderers/Plain.js');
require('./renderers/Property.js');
require('./renderers/Portlet.js');
require('./renderers/Spinner.js');
require('./renderers/Table/index.js');
require('./renderers/Tabs.js');
require('./renderers/Tpl.js');
require('./renderers/Mapping.js');
require('./renderers/Progress.js');
require('./renderers/Status.js');
require('./renderers/Json.js');
require('./renderers/Link.js');
require('./renderers/Wizard.js');
require('./renderers/Chart.js');
require('./renderers/Container.js');
require('./renderers/SearchBox.js');
require('./renderers/Service.js');
require('./renderers/SparkLine.js');
require('./renderers/Video.js');
require('./renderers/Audio.js');
require('./renderers/Nav.js');
require('./renderers/Tasks.js');
require('./renderers/Drawer.js');
require('./renderers/Wrapper.js');
require('./renderers/IFrame.js');
require('./renderers/BarCode.js');
require('./renderers/QRCode.js');
require('./renderers/Icon.js');
require('./renderers/Carousel.js');
require('./renderers/AnchorNav.js');
require('./renderers/Steps.js');
require('./renderers/Timeline.js');
require('./renderers/Markdown.js');
require('./renderers/TableView.js');
require('./renderers/Code.js');
require('./renderers/WebComponent.js');
require('./renderers/GridNav.js');
require('./renderers/TooltipWrapper.js');
require('./renderers/Tag.js');
require('./renderers/Table2/index.js');
require('./compat.js');
require('./schemaExtend.js');
var IconPickerIcons = require('./renderers/Form/IconPickerIcons.js');



Object.defineProperty(exports, 'ICONS', {
	enumerable: true,
	get: function () { return IconPickerIcons.ICONS; }
});
exports.setIconVendor = IconPickerIcons.setIconVendor;
Object.keys(amisCore).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return amisCore[k]; }
	});
});
Object.keys(amisUi).forEach(function (k) {
	if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return amisUi[k]; }
	});
});
