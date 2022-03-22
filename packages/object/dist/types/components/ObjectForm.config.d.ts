export declare const objectFormConfig: {
    name: string;
    inputs: ({
        name: string;
        type: string;
        friendlyName: string;
        defaultValue?: undefined;
    } | {
        name: string;
        type: string;
        friendlyName: string;
        defaultValue: string;
    })[];
    canHaveChildren: boolean;
};
declare const _default: {
    builderConfig: {
        name: string;
        inputs: {
            name: string;
            type: string;
        }[];
    };
    amisRenderConfig: {
        type: string;
        usage: string;
        weight: number;
        framework: string;
    };
    amisPluginConfig: {
        rendererName: string;
        name: string;
        description: string;
        tags: string[];
        icon: string;
        scaffold: {
            objectApiName: string;
            type: string;
            label: string;
            name: string;
        };
        previewSchema: {
            objectApiName: string;
            type: string;
        };
        panelTitle: string;
        panelControls: {
            type: string;
            name: string;
            label: string;
        }[];
    };
    name: string;
    label: string;
    inputs: {
        name: string;
        type: string;
    }[];
    amis: {
        weight: number;
        icon: string;
        tags: string[];
        panelTitle: string;
        panelControls: {
            type: string;
            name: string;
            label: string;
        }[];
    };
    previewSchema: {
        objectApiName: string;
    };
};
export default _default;
