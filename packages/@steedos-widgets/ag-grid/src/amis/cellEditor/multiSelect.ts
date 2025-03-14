/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-12 19:05:49
 */
import { ICellEditorComp, ICellEditorParams, ISelectCellEditorParams } from 'ag-grid-community';
// import * as amis from 'amis';

// 定义类型以避免 TypeScript 的错误
declare const amisRequire: any;

export class AmisMultiSelectCellEditor implements ICellEditorComp {
    private eGui: HTMLElement;
    private name: string;
    private value: string;
    private amisScope: any;
    private containerId: string;
    private amisSchema: any;
    private amisData: any;
    private amisEnv: any;
    private params: ICellEditorParams;
    private cellFormId: string;

    init(params: ICellEditorParams): void {
        this.params = params;
        this.value = params.value;
        this.amisData = (this.params as any).context.amisData;
        this.amisEnv = (this.params as any).context.amisEnv;
        let fieldConfig = (this.params as any).fieldConfig;
        this.name = fieldConfig.name;
        this.setupGui();
    }

    setupGui(): void {
        // 创建编辑器的容器
        this.eGui = document.createElement('div');
        const minWidth = (this.params as any).minWidth;
        const originalWidth = this.params.column.getActualWidth();
        this.eGui.style.width = (originalWidth < minWidth ? minWidth : originalWidth) + 'px';
        this.eGui.style.height = '100%';

        const maxTagCount = Math.floor((originalWidth < minWidth ? minWidth : originalWidth) / 60);

        // 为 amis 组件创建一个唯一的容器 ID
        const cellClassName = 'amis-ag-grid-cell-editor';
        const random = Math.random().toString(36).substring(2);
        this.containerId = `${cellClassName}-${random}`;
        this.eGui.id = this.containerId + '-wrapper';
        this.eGui.className = `${cellClassName}-wrapper`;

        // 创建一个子元素，作为 amis 组件的容器
        var containerDiv = document.createElement('div');
        containerDiv.id = this.containerId;
        containerDiv.className = cellClassName + ' amis-ag-grid-cell-editor-select-multiple';
        this.eGui.appendChild(containerDiv);

        let fieldOptions = (this.params as unknown as ISelectCellEditorParams).values;
        fieldOptions = fieldOptions && fieldOptions.map(function (n: string) { return { label: n, value: n } }) || [];
        let fieldConfig = (this.params as any).fieldConfig;

        this.cellFormId =  `cellForm__editor__select-multiple__${random}`;
        // 定义 amis 的 schema
        this.amisSchema = {
            id: this.cellFormId,
            type: 'form',
            wrapWithPanel: false,
            body: [
                {
                    type: 'steedos-field',
                    // value: this.value,
                    config: Object.assign({}, fieldConfig, {
                        label: false,
                        type: 'select',
                        multiple: true,
                        options: fieldOptions,
                        amis: {
                            "popOverContainerSelector": `.steedos-airtable-grid`,//`#${this.eGui.id}`
                            "maxTagCount": maxTagCount,
                            "checkAll": true
                            // valuesNoWrap: true
                        }
                    })
                }
            ],
            data: {
                [this.name]: this.value
            }
        };

        // // 渲染 amis 组件
        // const amis = amisRequire("amis/embed");
        // // const root = document.getElementById(this.containerId);
        // console.log("===this.containerId===", this.containerId);
        // this.amisScope = amis.embed(`#${this.containerId}`, amisSchema);
    }

    getGui(): HTMLElement {
        return this.eGui;
    }

    afterGuiAttached?(): void {
        // 在元素被附加到 DOM 后，再调用 amis.embed
        const renderAmis = (window as any).renderAmis;
        if (renderAmis) {
            renderAmis(`#${this.containerId}`, this.amisSchema, this.amisData);
            this.amisScope = (window as any).SteedosUI.refs[this.cellFormId];

            // (window as any).Steedos.Page.render(`#${this.containerId}`, {
            //     name: "agGridCellEditor",
            //     render_engine: "amis",
            //     schema: this.amisSchema
            // }, this.amisData);
        }
        else {
            const amis = amisRequire("amis/embed");
            // const env = this.amisEnv;
            const env = (window as any).BuilderAmisObject.AmisLib.getEvn();
            this.amisScope = amis.embed(`#${this.containerId}`, this.amisSchema, { data: this.amisData }, env);
        }
    }

    getValue(): any {
        // // 从 amis 中获取当前数据
        const data = this.amisScope.getComponentById(this.cellFormId)?.getValues();
        return (data || {})[this.name];
    }

    destroy?(): void {
        // 销毁 amis 实例
        if (this.amisScope) {
            this.amisScope.unmount();
        }
    }

    isPopup?(): boolean {
        return false;
    }
}