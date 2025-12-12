import React, { useMemo } from 'react';
import { Select, SelectProps, Spin } from 'antd';

import './Select.css';

// 定义 Antd Select 的选项数据结构
interface OptionItem {
  label: React.ReactNode;
  value: string | number | undefined;
  disabled?: boolean;
}

// 使用 Amis 的 FormItem HOC 包装，可以自动处理数据绑定
const AntdSelect: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    options: amisOptions,
    placeholder = '请选择',
    isLoading = false,
    selectProps = {},
    classnames: cx,
  } = props;
  
  // 1. 格式化选项：将 Amis 的 Options 转换为 Antd Select 的 Options
  // Amis Options 默认是 { label: string, value: any } 结构
  const antdOptions: OptionItem[] = useMemo(() => {
    return (amisOptions || []).map(item => ({
      label: item.label,
      value: item.value,
      disabled: item.disabled,
    }));
  }, [amisOptions]);
  
  // 2. 处理 loading 状态
  if (isLoading) {
    return (
      <Spin 
        style={{ width: '100%', display: 'block' }}
      />
    );
  }

  // 3. 处理值变化
  const handleChange = (newValue: any) => {
    // 关键：通过 props.onChange 将值回传给 Amis 表单
    onChange(newValue);
  };
  
  return (
    <div className={cx('AntdSelect-Wrapper', props.className)}>
      <Select
        // 绑定值和 onChange 事件
        value={value}
        onChange={handleChange}
        
        // 渲染选项
        options={antdOptions}
        
        // antd Select 默认属性
        placeholder={placeholder}
        allowClear
        style={{ width: '100%' }}
        
        // 允许传入其他 Select 属性覆盖默认值或添加额外功能（如 mode="multiple"）
        {...selectProps}
      />
    </div>
  );
};

export { AntdSelect };