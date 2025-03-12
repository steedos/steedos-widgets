/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-02-11 17:43:41
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-12 19:05:53
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

        // 为 amis 组件创建一个唯一的容器 ID
        const cellClassName = 'amis-ag-grid-cell-editor';
        const random = Math.random().toString(36).substring(2);
        this.containerId = `${cellClassName}-${random}`;
        this.eGui.id = this.containerId + '-wrapper';
        this.eGui.className = `${cellClassName}-wrapper`;

        // 创建一个子元素，作为 amis 组件的容器
        var containerDiv = document.createElement('div');
        containerDiv.id = this.containerId;
        containerDiv.className = cellClassName + ' amis-ag-grid-cell-editor-datetime';
        this.eGui.appendChild(containerDiv);
        let fieldConfig = (this.params as any).fieldConfig;

        this.cellFormId =  `cellForm__editor__datetime__${random}`;
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
                        amis: {
                            "popOverContainerSelector": `.steedos-airtable-grid`,//`#${this.eGui.id}`
                            // "closeOnSelect": false,// 不可以配置为false，否则会出现第一次点开控件时，点选日期后，输入框中小时值无故变成差8小时
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
        const renderAmis = (window as any).renderAmis;
        if (renderAmis) {
            renderAmis(`#${this.containerId}`, this.amisSchema, this.amisData);
            this.amisScope = (window as any).SteedosUI.refs[this.cellFormId];
        }
        else {
            const amis = amisRequire("amis/embed");
            // const env = this.amisEnv;
            const env = (window as any).BuilderAmisObject.AmisLib.getEvn();
            this.amisScope = amis.embed(`#${this.containerId}`, this.amisSchema, { data: this.amisData }, env);
        }
    }

    getValue(): any {
        // 从 amis 中获取当前数据
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