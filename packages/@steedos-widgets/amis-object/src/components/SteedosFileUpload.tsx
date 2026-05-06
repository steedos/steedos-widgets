import React, { useState, useRef } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface SteedosFileUploadProps {
  /** 上传接口 URL */
  action?: string;
  /** 额外的请求头 */
  headers?: Record<string, string>;
  /** 上传时附带的额外 formData 参数 */
  extraData?: Record<string, string>;
  /** 是否支持多文件 */
  multiple?: boolean;
  /** 最大文件数量 */
  maxCount?: number;
  /** 按钮文字 */
  btnLabel?: string;
  /** 标签 */
  label?: string;
  /** 上传成功回调 */
  onUploadSuccess?: (file: UploadFile, response: any) => void;
  /** 上传失败回调 */
  onUploadError?: (file: UploadFile, error: any) => void;
  /** amis 相关 props */
  dispatchEvent?: (eventName: string, data: any, ref: any) => Promise<any>;
  data?: any;
  name?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

export const SteedosFileUpload: React.FC<SteedosFileUploadProps> = (props) => {
  const {
    action = '',
    headers = {},
    extraData = {},
    multiple = true,
    maxCount = 10,
    btnLabel = '上传附件',
    label,
    onUploadSuccess,
    onUploadError,
    dispatchEvent,
    data,
    name,
    style,
    className,
    disabled = false,
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const ref = useRef<any>({ props });
  ref.current = { props };
  // 追踪正在上传的文件数量，确保所有文件上传完成后再触发刷新
  const pendingCountRef = useRef<number>(0);

  const handleChange: UploadProps['onChange'] = (info) => {
    // 更新文件列表：保留正在上传的文件
    const uploadingFiles = info.fileList.filter(f => f.status === 'uploading');
    setFileList(uploadingFiles);

    if (info.file.status === 'done') {
      const response = info.file.response;
      message.success(`${info.file.name} 上传成功`);
      pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);

      if (onUploadSuccess) {
        onUploadSuccess(info.file, response);
      }

      // 只有所有文件都上传完成后才触发 amis 事件（刷新列表）
      if (pendingCountRef.current === 0) {
        if (dispatchEvent) {
          dispatchEvent('uploadSuccess', {
            file: info.file,
            response: response,
          }, ref.current);
        }
        setFileList([]);
      }

    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
      pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);

      if (dispatchEvent) {
        dispatchEvent('uploadError', {
          file: info.file,
          error: info.file.error,
        }, ref.current);
      }

      if (onUploadError) {
        onUploadError(info.file, info.file.error);
      }

      // 如果所有文件都完成了（包含失败的），也清空列表
      if (pendingCountRef.current === 0) {
        setFileList([]);
      }
    }
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file, fileListToUpload) => {
    // 批量选择文件时，beforeUpload 对每个文件都会调用一次
    // 但 fileListToUpload 参数包含本次选择的全部文件（仅首次调用时计数）
    pendingCountRef.current += 1;
    return true;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: action,
    headers: headers,
    data: extraData,
    multiple: multiple,
    maxCount: maxCount,
    fileList: fileList,
    onChange: handleChange,
    beforeUpload: beforeUpload,
    showUploadList: false, // 不显示文件列表（附件列表由外部 liquid 模板渲染）
    disabled: disabled,
  };

  return (
    <div className={`${className || ''} steedos-file-upload`}>
      {label && <span className="antd-List-heading">{label}</span>}
      <Upload {...uploadProps}>
        <a className={`mx-4 antd-Button antd-Button--default antd-Button--size-default ${disabled ? ' is-disabled' : ''}`}>
          <UploadOutlined />
          <span>{btnLabel}</span>
        </a>
      </Upload>
    </div>
  );
};
