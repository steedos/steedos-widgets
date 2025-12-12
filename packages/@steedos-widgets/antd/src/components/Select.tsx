import React, { useMemo } from 'react';
import { Select, SelectProps, Spin } from 'antd';

import './Select.css';

// 定义 Antd Select 的选项数据结构
interface OptionItem {
  label: React.ReactNode;
  value: string | number | undefined;
  disabled?: boolean;
  data?: any; 
}

// 扩展 Props 结构
interface AntdSelectProps extends React.ComponentProps<any> {
    value?: any;
    onChange: (value: any) => void;
    options?: any[];
    placeholder?: string;
    isLoading?: boolean;
    selectProps?: any; 
    classnames?: (...args: (string | false | null | undefined)[]) => string;
    render: (schema: any, props?: any, scope?: any) => React.ReactNode; 
    env: any;
    scope: any; 
}

const AntdSelect: React.FC<AntdSelectProps> = (props) => {
  const {
    value,
    onChange,
    options: amisOptions,
    placeholder = '请选择',
    isLoading = false,
    selectProps = {},
    required,
    disabled,
    classnames: cx,
    render, // Amis 渲染函数
    env,
    scope,
  } = props;
  
  // 获取用户输入的选项模板字符串 (optionTpl)
  const optionRenderTpl = selectProps.optionTpl; 
  // 获取用户输入的标签模板字符串 (labelTpl)
  const labelRenderTpl = selectProps.labelTpl; 
  
  // 【新增】安全地解构 selectProps，排除可能与组件内部或 options 冲突的属性
  const {
      // 排除模板属性
      optionTpl: excludedOptionTpl,
      labelTpl: excludedLabelTpl,
      // 【关键优化】排除 disabled，防止它禁用整个 Select (除非它来自组件根 props)
      disabled: excludedDisabled,
      // 排除其他可能冲突的属性（如 options, value, onChange 等）
      options: excludedOptions,
      value: excludedValue,
      onChange: excludedOnChange,
      // 捕获所有剩余的属性，用于透传给 Antd Select
      ...restSelectProps
  } = selectProps;

  // 1. 格式化选项 (略，保持不变) ...
  const antdOptions: OptionItem[] = useMemo(() => {
    return (amisOptions || []).map((item, index) => {
      
      const optionItem: OptionItem = {
        label: item.label,
        value: item.value,
        disabled: item.disabled, // disabled 在这里：控制单个选项的可用性
        data: item, 
      };

      if (optionRenderTpl && typeof optionRenderTpl === 'string') {
        
        optionItem.label = render(
          'body',
          { type: 'tpl', tpl: optionRenderTpl }, 
          { data: optionItem.data, key: index }
        );
      }
      
      return optionItem;
    });
  }, [amisOptions, optionRenderTpl, scope, env, render]);

  
  // 2. 实现 customLabelRender 函数 (略，保持不变) ...
  const customLabelRender = useMemo(() => {
    if (!labelRenderTpl || typeof labelRenderTpl !== 'string') {
      return undefined;
    }
    
    return (renderProps: { value: any; label: React.ReactNode; option: any }) => {
        const fullOption = antdOptions.find(opt => opt.value === renderProps.value);
        
        if (!fullOption) {
            return renderProps.label;
        }

        return render(
            'body',
            { type: 'tpl', tpl: labelRenderTpl }, 
            { data: fullOption.data, key: renderProps.value }
        );
    };
  }, [labelRenderTpl, antdOptions, render]);


  // 3. 处理 loading 状态 (略，保持不变) ...
  if (isLoading) {
    return (
      <Spin style={{ width: '100%', display: 'block' }} />
    );
  }

  // 4. 处理值变化 (略，保持不变) ...
  const handleChange = (newValue: any) => {
    onChange(newValue);
  };
  
  // 5. 渲染 Antd Select
  return (
    <div className={cx('AntdSelect-Wrapper', props.className)}>
      <Select
        value={value}
        onChange={handleChange}
        
        options={antdOptions}
        
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        allowClear
        style={{ width: '100%' }}
        
        labelRender={customLabelRender}
        
        // 【关键优化】展开剩余的 selectProps。
        // 由于我们已经在解构时排除了 disabled 等属性，
        // 这里的 {...restSelectProps} 包含了所有用户需要透传的 Antd Select 属性，
        // 同时避免了冲突。
        {...restSelectProps}
        
        // 如果您希望支持整个组件的 disabled，并且用户是通过 selectProps 传入的
        // 可以像下面这样，将排除掉的 excludedDisabled 重新作为根属性传入
        // disabled={excludedDisabled} // 仅在您确定要支持此用法时启用
      />
    </div>
  );
};

export { AntdSelect };