import React from 'react';
import PropTypes from 'prop-types';
/**
 * The Button component is the Lightning Design System Button component. The Button should be used for label buttons, icon buttons, or buttons that have both labels and icons.
 * Either a <code>label</code> or <code>assistiveText.icon</code> is required; see the Prop Details table below. For buttons that maintain selected/unselected states, use the <a href="#/button-stateful">ButtonStateful</a> component.
 * Although not listed in the prop table, all `aria-*`, `data-*` and `form*` props will be added to the `button` element if passed in.
 */
declare class Button extends React.Component<any> {
    static displayName: any;
    static propTypes: {
        /**
         * **Assistive text for accessibility.**
         * This object is merged with the default props object on every render.
         * * `icon`: Text that is visually hidden but read aloud by screenreaders to tell the user what the icon means. If the button has an icon and a visible label, you can omit the <code>assistiveText.icon</code> prop and use the <code>label</code> prop.
         */
        assistiveText: PropTypes.Requireable<PropTypes.InferProps<{
            icon: PropTypes.Requireable<string>;
        }>>;
        /**
         * Callback that passes in the DOM reference of the `<button>` DOM node within this component. Primary use is to allow `focus` to be called. You should still test if the node exists, since rendering is asynchronous. `buttonRef={(component) => { if(component) console.log(component); }}`
         */
        buttonRef: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * CSS classes to be added to button.
         */
        className: PropTypes.Requireable<string | object>;
        /**
         * Disables the button and adds disabled styling.
         */
        disabled: PropTypes.Requireable<boolean>;
        /**
         * Associates an icon button with another element on the page by changes the color of the SVG. Please reference <a href="http://www.lightningdesignsystem.com/components/buttons/#hint">Lightning Design System Buttons > Hint</a>.
         */
        hint: PropTypes.Requireable<boolean>;
        /**
         * Name of the icon category. Visit <a href="http://www.lightningdesignsystem.com/resources/icons">Lightning Design System Icons</a> to reference icon categories.
         */
        iconCategory: PropTypes.Requireable<string>;
        /**
         * CSS classes to be added to icon.
         */
        iconClassName: PropTypes.Requireable<string | object>;
        /**
         * Name of the icon. Visit <a href="http://www.lightningdesignsystem.com/resources/icons">Lightning Design System Icons</a> to reference icon names.
         */
        iconName: PropTypes.Requireable<string>;
        /**
         * Path to the icon. This will override any global icon settings.
         */
        iconPath: PropTypes.Requireable<string>;
        /**
         * If omitted, icon position is centered.
         */
        iconPosition: PropTypes.Requireable<string>;
        /**
         * Determines the size of the icon.
         */
        iconSize: PropTypes.Requireable<string>;
        /**
         * For icon variants, please reference <a href="http://www.lightningdesignsystem.com/components/buttons/#icon">Lightning Design System Icons</a>.
         */
        iconVariant: PropTypes.Requireable<string>;
        /**
         * Id string applied to button node.
         */
        id: PropTypes.Requireable<string>;
        /**
         * If true, button/icon is white. Meant for buttons or utility icons on dark backgrounds.
         */
        inverse: PropTypes.Requireable<boolean>;
        /**
         * Visible label on the button. If the button is an icon button with no label, you must use the <code>assistiveText.icon</code> prop.
         */
        label: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        /**
         * Triggered when focus is removed.
         */
        onBlur: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when the button is clicked.
         */
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when component is focused.
         */
        onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a key is pressed down
         */
        onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a key is pressed and released
         */
        onKeyPress: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a key is released
         */
        onKeyUp: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a mouse button is pressed down
         */
        onMouseDown: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a mouse arrow hovers
         */
        onMouseEnter: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a mouse arrow no longer hovers
         */
        onMouseLeave: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered when a mouse button is released
         */
        onMouseUp: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * Triggered to indicate that this component should receive focus.
         */
        onRequestFocus: PropTypes.Requireable<(...args: any[]) => any>;
        /**
         * If true, will trigger `onRequestFocus`.
         */
        requestFocus: PropTypes.Requireable<boolean>;
        /**
         * If true, button scales to 100% width on small form factors.
         */
        responsive: PropTypes.Requireable<boolean>;
        /**
         * Write <code>"-1"</code> if you don't want the user to tab to the button.
         */
        tabIndex: PropTypes.Requireable<string>;
        /**
         * Button type
         */
        type: PropTypes.Requireable<string>;
        /**
         * HTML title attribute
         */
        title: PropTypes.Requireable<string>;
        /**
         * [Deprecated] Tooltip on button. Button should be a child of `Tooltip` instead.
         */
        tooltip: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        /**
         * Different types of buttons
         */
        variant: PropTypes.Requireable<string>;
        /**
         * Custom styles to be passed to the component
         */
        style: PropTypes.Requireable<object>;
    };
    static defaultProps: {
        assistiveText: {
            icon: string;
        };
        disabled: boolean;
        hint: boolean;
        iconSize: string;
        responsive: boolean;
        type: string;
        variant: string;
    };
    constructor(props: any);
    getClassName: () => string;
    handleClick: (event: any) => void;
    renderIcon: (name: any) => JSX.Element;
    renderLabel: () => any;
    renderButton: () => JSX.Element;
    renderTooltip: () => JSX.Element;
    render(): JSX.Element;
}
export default Button;
