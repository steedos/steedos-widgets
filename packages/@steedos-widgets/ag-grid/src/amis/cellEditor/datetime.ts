/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-04 12:01:27
 */
import { ICellEditorComp, ICellEditorParams } from 'ag-grid-community';
// import * as amis from 'amis';

// 定义类型以避免 TypeScript 的错误
declare const amisRequire: any;

export class AmisDateTimeCellEditor implements ICellEditorComp {
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
        this.containerId = 'amis-editor-' + Math.random().toString(36).substring(2);
        this.eGui.id = this.containerId + '-container';

        // 创建一个子元素，作为 amis 组件的容器
        var containerDiv = document.createElement('div');
        containerDiv.id = this.containerId;
        this.eGui.appendChild(containerDiv);
        let fieldConfig = (this.params as any).fieldConfig;

        // 定义 amis 的 schema
        this.amisSchema = {
            id: 'cellForm',
            type: 'form',
            wrapWithPanel: false,
            body: [
                {
                    type: 'steedos-field',
                    // value: this.value,
                    config: Object.assign({}, fieldConfig, {
                        label: false,
                        amis: {
                            "popOverContainerSelector": `#${this.eGui.id}`,
                            "closeOnSelect": false,
                            // "embed": true
                        }
                    })
                }
            ],
            data: {
                [this.name]: this.value
            }
        };
    }

    getGui(): HTMLElement {
        return this.eGui;
    }

    afterGuiAttached?(): void {
        // 在元素被附加到 DOM 后，再调用 amis.embed
        const amis = amisRequire("amis/embed");
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
        return true;
    }
}