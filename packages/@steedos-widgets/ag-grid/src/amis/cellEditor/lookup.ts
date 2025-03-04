/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-04 15:48:45
 */
import { ICellEditorComp, ICellEditorParams } from 'ag-grid-community';
// import * as amis from 'amis';

// 定义类型以避免 TypeScript 的错误
declare const amisRequire: any;

export class AmisLookupCellEditor implements ICellEditorComp {
    private eGui: HTMLElement;
    private name: string;
    private value: string;
    private amisScope: any;
    private containerId: string;
    private amisSchema: any;
    private amisData: any;
    private amisEnv: any;
    private params: ICellEditorParams;

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

        // 为 amis 组件创建一个唯一的容器 ID
        const cellClassName = 'amis-ag-grid-cell-editor';
        this.containerId = `${cellClassName}-${Math.random().toString(36).substring(2)}`;
        this.eGui.id = this.containerId + '-wrapper';
        this.eGui.className = `${cellClassName}-wrapper`;

        // 创建一个子元素，作为 amis 组件的容器
        var containerDiv = document.createElement('div');
        containerDiv.id = this.containerId;
        containerDiv.className = cellClassName + ' amis-ag-grid-cell-editor-lookup';
        this.eGui.appendChild(containerDiv);

        let fieldConfig = (this.params as any).fieldConfig;

        // 定义 amis 的 schema
        this.amisSchema = {
            id: 'cellForm',
            type: 'form',
            wrapWithPanel: false,
            // debug: true,
            body: [
                {
                    type: 'steedos-field',
                    // value: this.value,
                    config: Object.assign({}, fieldConfig, {
                        label: false
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
        const amis = amisRequire("amis/embed");
        // const env = this.amisEnv;
        const env = (window as any).BuilderAmisObject.AmisLib.getEvn();
        this.amisScope = amis.embed(`#${this.containerId}`, this.amisSchema, { data: this.amisData }, env);
    }

    getValue(): any {
        // 从 amis 中获取当前数据
        const data = this.amisScope.getComponentById('cellForm')?.getValues();
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