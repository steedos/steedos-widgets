/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-02-25 10:41:01
 */
import { ICellEditorComp, ICellEditorParams } from 'ag-grid-community';
// import * as amis from 'amis';

// 定义类型以避免 TypeScript 的错误
declare const amisRequire: any;

export class AmisMultiSelectCellEditor implements ICellEditorComp {
    private eGui: HTMLElement;
    private value: string;
    private amisScope: any;
    private containerId: string;
    private amisSchema: any;

    init(params: ICellEditorParams): void {
        this.value = params.value;
        this.setupGui();
    }

    setupGui(): void {
        // 创建编辑器的容器
        this.eGui = document.createElement('div');
        this.eGui.style.width = '100%';
        this.eGui.style.height = '100%';

        // 为 amis 组件创建一个唯一的容器 ID
        this.containerId = 'amis-editor-' + Math.random().toString(36).substring(2);
        this.eGui.id = this.containerId + '-container';
        console.log("===this.eGui.id===", this.eGui.id);

        // 创建一个子元素，作为 amis 组件的容器
        var containerDiv = document.createElement('div');
        containerDiv.id = this.containerId;
        this.eGui.appendChild(containerDiv);

        // 定义 amis 的 schema
        this.amisSchema = {
            id: 'cellForm',
            type: 'form',
            wrapWithPanel: false,
            body: [
                {
                    type: 'select',
                    name: 'cellValue',
                    value: this.value,
                    multiple: true,
                    "options": [
                        {
                            "label": "A",
                            "value": "a"
                        },
                        {
                            "label": "B",
                            "value": "b"
                        },
                        {
                            "label": "C",
                            "value": "c"
                        }
                    ],
                    "popOverContainerSelector": `#${this.eGui.id}`
                }
            ]
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
        const env = (window as any).BuilderAmisObject.AmisLib.getEvn();
        this.amisScope = amis.embed(`#${this.containerId}`, this.amisSchema, {}, env);
    }

    getValue(): any {
        // 从 amis 中获取当前数据
        const data = this.amisScope.getComponentById('cellForm')?.getValues();
        return data?.cellValue;
    }

    destroy?(): void {
        // 销毁 amis 实例
        if (this.amisScope) {
            this.amisScope.unmount();
        }
    }

    isPopup?(): boolean {
        return true;
    }
}