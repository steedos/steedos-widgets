import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Select, Spin } from 'antd';

interface RelatedInstance {
  _id: string;
  name: string;
}

interface AntdRelatedInstancesProps {
  instanceId?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  rootUrl?: string;
  tenantId?: string;
  authToken?: string;
  placeholder?: string;
  disabled?: boolean;
  classnames?: (...args: (string | false | null | undefined)[]) => string;
  env?: any;
  data?: any;
}

const AntdRelatedInstances: React.FC<AntdRelatedInstancesProps> = (props) => {
  const {
    value,
    onChange,
    rootUrl,
    tenantId,
    authToken,
    placeholder = 'Please select',
    disabled,
    classnames: cx,
    env,
    data: amisData,
  } = props;

  const [options, setOptions] = useState<RelatedInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAuthHeader = useCallback((): string => {
    const tid = tenantId || (amisData && amisData.context && amisData.context.tenantId) || (env && env.session && env.session.tenantId) || '';
    const token = authToken || (amisData && amisData.context && amisData.context.authToken) || (env && env.session && env.session.authToken) || '';
    return `Bearer ${tid},${token}`;
  }, [tenantId, authToken, amisData, env]);

  const getGraphqlUrl = useCallback((): string => {
    const root = rootUrl || (amisData && amisData.context && amisData.context.rootUrl) || (env && env.session && env.session.rootUrl) || '';
    return `${root}/graphql`;
  }, [rootUrl, amisData, env]);

  const fetchInstances = useCallback(async (keywords?: string) => {
    setLoading(true);
    try {
      const query = `{
        rows: instances__getRelatedInstances(keywords: ${JSON.stringify(keywords || '')}, pageNo: 1, pageSize: 20) {
          _id
          name
        }
      }`;

      const response = await fetch(getGraphqlUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      const rows: RelatedInstance[] = (result && result.data && result.data.rows) || [];
      setOptions(rows);
    } catch (e) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [getGraphqlUrl, getAuthHeader]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const handleSearch = useCallback((keywords: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchInstances(keywords);
    }, 300);
  }, [fetchInstances]);

  const handleChange = useCallback((newValue: string[]) => {
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  const selectOptions = options.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  return (
    <div className={cx ? cx('AntdRelatedInstances-Wrapper') : undefined}>
      <Select
        mode="multiple"
        showSearch
        filterOption={false}
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder={placeholder}
        disabled={disabled}
        loading={loading}
        notFoundContent={loading ? <Spin size="small" /> : undefined}
        options={selectOptions}
        style={{ width: '100%' }}
        allowClear
      />
    </div>
  );
};

export { AntdRelatedInstances };
