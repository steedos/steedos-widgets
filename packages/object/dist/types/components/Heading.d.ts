/// <reference types="react" />
export declare const Heading: (props: any) => JSX.Element;
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
            title: string;
            type: string;
            label: string;
            name: string;
        };
        previewSchema: {
            title: string;
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
        title: string;
    };
};
export default _default;
