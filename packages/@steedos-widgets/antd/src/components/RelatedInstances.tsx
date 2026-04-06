import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface RelatedInstance {
  _id: string;
  name: string;
  flow_name?: string;
  submit_date?: string;
  submitter?: string;
  _display?: {
    submit_date?: string | { objectName?: string; value?: string; label?: string };
    submitter?: string | { objectName?: string; value?: string; label?: string };
  };
}

interface AntdRelatedInstancesProps {
  instanceId?: string;
  value?: any[];
  onChange?: (value: string[]) => void;
  rootUrl?: string;
  tenantId?: string;
  authToken?: string;
  placeholder?: string;
  disabled?: boolean;
  classnames?: (...args: (string | false | null | undefined)[]) => string;
  env?: any;
  data?: any;
  pageSize?: number;
  /** 默认过滤月数，默认6个月 */
  filterMonths?: number;
}

const AntdRelatedInstances: React.FC<AntdRelatedInstancesProps> = (props) => {
  const {
    value,
    onChange,
    rootUrl,
    tenantId,
    authToken,
    placeholder = '搜索申请单',
    disabled,
    classnames: cx,
    env,
    data: amisData,
    pageSize = 20,
    filterMonths = 6,
  } = props;

  // 归一化 value：可能是 string[] 或 {_id, name}[] 对象数组
  const normalizeValue = useCallback((val: any[]): string[] => {
    if (!val || !Array.isArray(val)) return [];
    return val.map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item._id) return item._id;
      return String(item);
    });
  }, []);

  // 从对象数组中提取名称映射
  const extractNamesFromValue = useCallback((val: any[]): Record<string, string> => {
    if (!val || !Array.isArray(val)) return {};
    const map: Record<string, string> = {};
    val.forEach((item) => {
      if (typeof item === 'object' && item._id && item.name) {
        map[item._id] = item.name;
      }
    });
    return map;
  }, []);

  const [items, setItems] = useState<RelatedInstance[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 缓存已选项信息，翻页后仍可展示
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, string>>(() => extractNamesFromValue(value));
  // 内部管理选中状态，不完全依赖外部 value
  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => normalizeValue(value));

  const getAuthHeader = useCallback((): string => {
    const tid = tenantId || (amisData && amisData.context && amisData.context.tenantId) || (env && env.session && env.session.tenantId) || '';
    const token = authToken || (amisData && amisData.context && amisData.context.authToken) || (env && env.session && env.session.authToken) || '';
    return `Bearer ${tid},${token}`;
  }, [tenantId, authToken, amisData, env]);

  const getGraphqlUrl = useCallback((): string => {
    const root = rootUrl || (amisData && amisData.context && amisData.context.rootUrl) || (env && env.session && env.session.rootUrl) || '';
    return `${root}/graphql`;
  }, [rootUrl, amisData, env]);

  const buildDateFilters = useCallback((): string => {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(start.getMonth() - filterMonths);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const startStr = start.toISOString();
    const endStr = end.toISOString();
    return `[["submit_date","between",["${startStr}","${endStr}"]]]`;
  }, [filterMonths]);

  const fetchInstances = useCallback(async (searchKeywords: string, page: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const filters = buildDateFilters();
      const query = `
        query{
            rows: instances__getRelatedInstances(keywords: ${JSON.stringify(searchKeywords)}, top: ${pageSize}, skip: ${skip}, filters: ${filters}){
                 _id,
    name,
    flow_name,
    submit_date,
    submitter
    _display:_ui{
      submit_date,
      submitter
    }
            },
            count: instances__getRelatedInstances__count(filters: ${filters}, keywords: ${JSON.stringify(searchKeywords)})
            }
    `;

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
      const count: number = (result && result.data && result.data.count) || 0;
      setItems(rows);
      setTotal(count);
      // 缓存当前页项的名称
      setSelectedItemsMap((prev) => {
        const next = { ...prev };
        rows.forEach((r) => { next[r._id] = r.name; });
        return next;
      });
    } catch (e) {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [getGraphqlUrl, getAuthHeader, pageSize, buildDateFilters]);

  useEffect(() => {
    fetchInstances(keywords, currentPage);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchInstances('', 1);
  }, [fetchInstances]);

  const handleSearch = useCallback((searchValue: string) => {
    setKeywords(searchValue);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchInstances(searchValue, 1);
    }, 300);
  }, [fetchInstances]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchInstances(keywords, page);
  }, [fetchInstances, keywords]);

  // 外部 value 变化时同步到内部
  useEffect(() => {
    if (value !== undefined) {
      const keys = normalizeValue(value);
      setSelectedKeys(keys);
      const names = extractNamesFromValue(value);
      if (Object.keys(names).length > 0) {
        setSelectedItemsMap((prev) => ({ ...prev, ...names }));
      }
    }
  }, [value, normalizeValue, extractNamesFromValue]);

  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  const updateSelection = useCallback((next: string[]) => {
    setSelectedKeys(next);
    if (onChange) {
      onChange(next);
    }
  }, [onChange]);

  const handleToggle = useCallback((id: string) => {
    if (disabled) return;
    const next = selectedSet.has(id)
      ? selectedKeys.filter((v) => v !== id)
      : [...selectedKeys, id];
    updateSelection(next);
  }, [selectedKeys, disabled, selectedSet, updateSelection]);

  const handleRemoveSelected = useCallback((id: string) => {
    if (disabled) return;
    const next = selectedKeys.filter((v) => v !== id);
    updateSelection(next);
  }, [selectedKeys, disabled, updateSelection]);

  const getDisplayValue = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'object') {
      if (field.label) return field.label;
      if (field.name) return field.name;
      return '';
    }
    return String(field);
  };

  const columns: ColumnsType<RelatedInstance> = [
    {
      title: '申请单',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '流程',
      dataIndex: 'flow_name',
      key: 'flow_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '提交人',
      key: 'submitter',
      width: 100,
      render: (_: any, record: RelatedInstance) =>
        getDisplayValue(record._display?.submitter) || getDisplayValue(record.submitter),
    },
    {
      title: '提交日期',
      key: 'submit_date',
      width: 160,
      render: (_: any, record: RelatedInstance) =>
        getDisplayValue(record._display?.submit_date) || getDisplayValue(record.submit_date),
    },
  ];

  const selectedTags = selectedKeys.map((id) => ({
    id,
    name: selectedItemsMap[id] || id,
  }));

  return (
    <div className={cx ? cx('AntdRelatedInstances-Wrapper') : undefined}>
      {selectedTags.length > 0 && (
        <div style={{ marginBottom: 8, lineHeight: '28px' }}>
          <span style={{ marginRight: 8, color: '#666', fontSize: 13 }}>已选 {selectedTags.length} 项:</span>
          {selectedTags.map((item) => (
            <Tag
              key={item.id}
              closable={!disabled}
              onClose={() => handleRemoveSelected(item.id)}
              style={{ marginBottom: 4 }}
            >
              {item.name}
            </Tag>
          ))}
        </div>
      )}
      <Input.Search
        placeholder={placeholder}
        allowClear
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 8 }}
        disabled={disabled}
      />
      <Table<RelatedInstance>
        rowKey="_id"
        columns={columns}
        dataSource={items}
        loading={loading}
        size="small"
        scroll={{ y: 350 }}
        locale={{ emptyText: '暂无数据' }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => {
            updateSelection(keys as string[]);
          },
          getCheckboxProps: () => ({ disabled }),
        }}
        onRow={(record) => ({
          onClick: () => handleToggle(record._id),
          style: { cursor: disabled ? 'default' : 'pointer' },
        })}
        pagination={total > pageSize ? {
          size: 'small',
          current: currentPage,
          pageSize,
          total,
          onChange: handlePageChange,
          showSizeChanger: false,
        } : false}
      />
    </div>
  );
};

export { AntdRelatedInstances };
