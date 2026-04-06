import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Select, Spin, Tag, Modal, Input, Empty, Button, Space } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { createObject } from '@steedos-widgets/amis-lib';

/**
 * 通过 GraphQL 获取指定对象的 UISchema (对象配置信息)
 */
async function fetchObjectSchema(objectApiName: string): Promise<any> {
  const query = `{object:objects(filters: [["name","=","${objectApiName}"]], top: 1){_id,name,label,icon,NAME_FIELD_KEY:name_field_key}}`;
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return data.data?.object?.[0] || null;
}

/**
 * 通过 GraphQL 搜索指定对象的记录
 */
async function defaultFetchRecords(
  objectApiName: string,
  nameFieldKey: string,
  keyword?: string,
  selectedIds?: string[],
  top: number = 50,
  skip: number = 0
): Promise<{ rows: any[]; count: number }> {
  let filters: any[] = [];

  if (keyword) {
    filters = [[[nameFieldKey, 'contains', keyword]]];
  }

  if (selectedIds && selectedIds.length > 0 && !keyword) {
    // When no keyword, exclude already selected to avoid duplicates in dropdown
    // (selected items are shown separately)
  }

  const filtersStr = filters.length > 0
    ? filters.map(f => typeof f === 'string' ? `"${f}"` : JSON.stringify(f)).join(',')
    : '';

  const query = `{rows:${objectApiName}(${filtersStr ? `filters: [${filtersStr}], ` : ''}top: ${top}, skip: ${skip}, sort: "created desc"){_id,${nameFieldKey}},count:${objectApiName}__count(${filtersStr ? `filters: [${filtersStr}]` : ''})}`;
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return {
    rows: data.data?.rows || [],
    count: data.data?.count || 0
  };
}

/**
 * 通过 GraphQL 根据 ID 获取记录详情
 */
async function fetchRecordsByIds(
  objectApiName: string,
  nameFieldKey: string,
  ids: string[]
): Promise<any[]> {
  if (!ids || ids.length === 0) return [];
  const idsStr = ids.map(id => `"${id}"`).join(',');
  const query = `{rows:${objectApiName}(filters: [["_id","in",[${idsStr}]]], top: ${ids.length}){_id,${nameFieldKey}}}`;
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return data.data?.rows || [];
}

interface RelatedRecordSelectorProps {
  value?: string | string[] | any | any[];
  onChange?: (value: any) => void;
  objectApiName?: string;
  nameFieldKey?: string;
  multiple?: boolean;
  valueFormat?: 'string' | 'object';
  placeholder?: string;
  style?: React.CSSProperties;
  dispatchEvent?: (eventName: string, data: any, ref: any) => Promise<void>;
  data?: any;
  clearable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  pageSize?: number;
  [key: string]: any;
}

export const SteedosRelatedRecordSelector: React.FC<RelatedRecordSelectorProps> = (props) => {
  const {
    name,
    value,
    onChange,
    objectApiName = '',
    nameFieldKey: nameFieldKeyProp,
    multiple = true,
    valueFormat = 'string',
    placeholder = '请选择相关记录',
    style,
    dispatchEvent,
    data,
    clearable = true,
    readonly = false,
    disabled = false,
    pageSize = 50,
  } = props;

  const ref = useRef<any>(null);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [resolvedNameFieldKey, setResolvedNameFieldKey] = useState<string>(nameFieldKeyProp || 'name');
  const [objectLabel, setObjectLabel] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchVersionRef = useRef(0);
  const [selectedRecords, setSelectedRecords] = useState<Map<string, string>>(new Map());
  const [initializing, setInitializing] = useState(false);

  // Extract ID from value (supports both string and object format)
  const extractId = useCallback((v: any): string => {
    if (v && typeof v === 'object' && '_id' in v) return String(v._id);
    if (v && typeof v === 'object' && 'id' in v) return String(v.id);
    return String(v);
  }, []);

  // Get current selected IDs from value
  const getSelectedIds = useCallback((): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(extractId);
    return [extractId(value)];
  }, [value, extractId]);

  // Resolve object schema to get nameFieldKey
  useEffect(() => {
    if (!objectApiName) return;
    if (nameFieldKeyProp) {
      setResolvedNameFieldKey(nameFieldKeyProp);
      return;
    }
    fetchObjectSchema(objectApiName).then(schema => {
      if (schema) {
        if (schema.NAME_FIELD_KEY) {
          setResolvedNameFieldKey(schema.NAME_FIELD_KEY);
        }
        if (schema.label) {
          setObjectLabel(schema.label);
        }
      }
    });
  }, [objectApiName, nameFieldKeyProp]);

  // Initialize selected records from value
  useEffect(() => {
    if (!objectApiName || !resolvedNameFieldKey) return;
    const ids = getSelectedIds();
    if (ids.length === 0) {
      setSelectedRecords(new Map());
      return;
    }

    // Check which IDs are missing from the map
    const missingIds = ids.filter(id => !selectedRecords.has(id));
    if (missingIds.length === 0) return;

    setInitializing(true);
    fetchRecordsByIds(objectApiName, resolvedNameFieldKey, missingIds).then(records => {
      setSelectedRecords(prev => {
        const next = new Map(prev);
        records.forEach(r => {
          next.set(r._id, r[resolvedNameFieldKey] || r._id);
        });
        return next;
      });
      setInitializing(false);
    }).catch(() => setInitializing(false));
  }, [value, objectApiName, resolvedNameFieldKey]);

  // Load records (initial or search)
  const loadRecords = useCallback(async (keyword?: string) => {
    if (!objectApiName || !resolvedNameFieldKey) return;
    setLoading(true);
    try {
      const result = await defaultFetchRecords(
        objectApiName,
        resolvedNameFieldKey,
        keyword,
        getSelectedIds(),
        pageSize
      );
      const newOptions = result.rows.map(r => ({
        label: r[resolvedNameFieldKey] || r._id,
        value: r._id
      }));
      setOptions(newOptions);
      // Update selected records map with fetched data
      setSelectedRecords(prev => {
        const next = new Map(prev);
        result.rows.forEach(r => {
          next.set(r._id, r[resolvedNameFieldKey] || r._id);
        });
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [objectApiName, resolvedNameFieldKey, pageSize, getSelectedIds]);

  // Load initial options when dropdown opens
  const handleDropdownVisibleChange = useCallback((open: boolean) => {
    if (open) {
      loadRecords();
    } else {
      setSearchKeyword('');
    }
  }, [loadRecords]);

  // Debounced search
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    const currentVersion = ++searchVersionRef.current;
    searchTimeoutRef.current = setTimeout(async () => {
      if (searchVersionRef.current !== currentVersion) return;
      await loadRecords(keyword || undefined);
    }, 300);
  }, [loadRecords]);

  // Trigger change event
  const triggerChange = useCallback(async (newValue: any) => {
    const eventPatch: any = { value: newValue };
    if (dispatchEvent) {
      const rendererEvent: any = await dispatchEvent(
        'change',
        newValue ? createObject(data || {}, eventPatch) : data,
        ref.current
      );
      if (rendererEvent?.prevented) return;
    }
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange, dispatchEvent, data]);

  // Handle selection change
  const handleChange = useCallback(async (selectedValues: any) => {
    if (multiple) {
      const ids = Array.isArray(selectedValues) ? selectedValues : (selectedValues ? [selectedValues] : []);
      if (valueFormat === 'object') {
        const objectValues = ids.map(id => ({
          _id: id,
          [resolvedNameFieldKey]: selectedRecords.get(id) || id
        }));
        await triggerChange(objectValues);
      } else {
        await triggerChange(ids);
      }
    } else {
      if (!selectedValues) {
        await triggerChange(null);
      } else if (valueFormat === 'object') {
        await triggerChange({
          _id: selectedValues,
          [resolvedNameFieldKey]: selectedRecords.get(selectedValues) || selectedValues
        });
      } else {
        await triggerChange(selectedValues);
      }
    }
  }, [multiple, valueFormat, resolvedNameFieldKey, selectedRecords, triggerChange]);

  // Build current value for Select
  const getCurrentValue = useCallback(() => {
    const ids = getSelectedIds();
    if (multiple) {
      return ids;
    }
    return ids.length > 0 ? ids[0] : undefined;
  }, [getSelectedIds, multiple]);

  // Build options including selected records that may not be in current search results
  const getMergedOptions = useCallback(() => {
    const optionMap = new Map<string, string>();
    // Add search results
    options.forEach(opt => optionMap.set(opt.value, opt.label));
    // Add selected records that might not be in current search results
    const ids = getSelectedIds();
    ids.forEach(id => {
      if (!optionMap.has(id) && selectedRecords.has(id)) {
        optionMap.set(id, selectedRecords.get(id)!);
      }
    });
    return Array.from(optionMap.entries()).map(([value, label]) => ({ value, label }));
  }, [options, getSelectedIds, selectedRecords]);

  if (!objectApiName) {
    return <div style={{ color: '#999' }}>请配置 objectApiName 属性</div>;
  }

  const element = (
    <Select
      mode={multiple ? 'multiple' : undefined}
      showSearch
      allowClear={clearable}
      placeholder={placeholder}
      style={{ minWidth: 200, width: '100%', ...style }}
      value={getCurrentValue()}
      onChange={handleChange}
      onSearch={handleSearch}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      filterOption={false}
      loading={loading || initializing}
      notFoundContent={loading ? <Spin size="small" /> : <Empty description="无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      options={getMergedOptions()}
      maxTagCount="responsive"
      disabled={disabled || readonly}
      optionFilterProp="label"
    />
  );

  ref.current = element;

  return element;
};
