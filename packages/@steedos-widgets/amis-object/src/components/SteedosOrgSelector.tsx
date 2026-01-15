import React, { useEffect, useState, useRef } from 'react';
import { TreeSelect, Spin } from 'antd';
import type { TreeSelectProps } from 'antd';
import { createObject } from '@steedos-widgets/amis-lib';

// 支持服务端检索的部门树数据获取方法
async function defaultFetchDeptTree(parentId?: string, keyword?: string): Promise<any[]> {
  if (keyword) {
    // 服务端检索
    const query = `{rows:organizations(filters: [["name","contains","${keyword}"]], top: 100, skip: 0, sort: "sort_no desc"){_id,space,name,fullname,sort_no,_display:_ui{sort_no},parent,children}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const rows = data.data?.rows || [];
    return rows.map(org => ({
      title: org.name,
      fullname: org.fullname,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined,
      defer: org.defer,
      parentId: org.parent
    }));
  } else if (!parentId) {
    // 获取第一层
    const res = await fetch('/service/api/organizations/root');
    const data = await res.json();
    const rows = data.data?.rows || data.rows || [];
    return rows.map(org => ({
      title: org.name,
      fullname: org.fullname,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined,
      defer: org.defer,
      parentId: org.parent
    }));
  } else {
    // 获取子层
    const query = `{rows:organizations(filters: [["parent","=","${parentId}"]], top: 5000, skip: 0, sort: "sort_no desc"){_id,space,name,fullname,sort_no,_display:_ui{sort_no},parent,children}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const rows = data.data?.rows || [];
    return rows.map(org => ({
      title: org.name,
      fullname: org.fullname,
      value: String(org._id),
      key: String(org._id),
      isLeaf: !(Array.isArray(org.children) && org.children.length > 0),
      children: undefined,
      defer: org.defer,
      parentId: org.parent
    }));
  }
}

// 从树数据中查找节点
function findNodeInTree(treeData: any[], key: string): any {
  for (const node of treeData) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

// 通过GraphQL查询获取节点的完整路径
async function getNodeFullPath(nodeId: string, nodeName: string): Promise<string> {
  try {
    // 查询节点的parent
    const query = `{node:organizations(filters: [["_id","=","${nodeId}"]], top: 1){_id,name,fullname}}`;
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const node = data.data?.node?.[0];
    if (!node) return nodeName;
    
    if (node.fullname) return node.fullname;
    
    const pathParts = [node.name];
    let currentParent = node.parent;
    while (currentParent) {
      pathParts.unshift(currentParent.name);
      currentParent = currentParent.parent;
    }
    return pathParts.join(' / ');
  } catch {
    return nodeName;
  }
}

interface DeptGroupSelectorProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  fetchDeptTree?: (parentId?: string, keyword?: string) => Promise<any[]>; // [{ title, value, key, isLeaf }]
  style?: React.CSSProperties;
  dispatchEvent?: (eventName: string, data: any, ref: any) => void;
  onEvent,
  data?: any;
}

export const SteedosOrgSelector: React.FC<DeptGroupSelectorProps> = (props) => {
  const {
    value,
    onChange,
    multiple = false,
    placeholder = '请选择部门/分组',
    fetchDeptTree = defaultFetchDeptTree,
    style,
    dispatchEvent,
    data,
  } = props
  const [treeData, setTreeData] = useState<any[]>([]);
  const ref: any = useRef();
  const [loading, setLoading] = useState(false);
  const [labelMap, setLabelMap] = useState<Map<string, string>>(new Map());
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  console.log('SteedosOrgSelector. dispatchEvent', dispatchEvent)
  useEffect(() => {
    setLoading(true);
    fetchDeptTree()
      .then(data => {
        setTreeData(data);
        // 默认展开第一层
        const firstLevelKeys = data.map((item: any) => String(item.key));
        setExpandedKeys(firstLevelKeys);
        // 为所有节点构建路径
        const enrichWithPath = (nodes: any[], parentPath = ''): any[] => {
          return nodes.map(node => {
            const nodePath = node.fullname || (parentPath ? `${parentPath} / ${node.title}` : node.title);
            return {
              ...node,
              pathLabel: nodePath,
              children: node.children ? enrichWithPath(node.children, nodePath) : undefined
            };
          });
        };
        const enrichedData = enrichWithPath(data);
        setTreeData(enrichedData);
        // 初始化路径标签
        const newLabelMap = new Map<string, string>();
        const buildPaths = (nodes: any[]) => {
          nodes.forEach(node => {
            newLabelMap.set(node.key, node.pathLabel);
            if (node.children) buildPaths(node.children);
          });
        };
        buildPaths(enrichedData);
        setLabelMap(newLabelMap);
      })
      .finally(() => setLoading(false));
  }, [fetchDeptTree]);

  // 监听value变化，补充显示名称
  useEffect(() => {
    const values = Array.isArray(value) ? value : (value ? [String(value)] : []);
    if (values.length === 0) return;

    // 检查哪些ID在当前treeData中找不到
    const findPlainNode = (nodes: any[], key: string): boolean => {
      for (const node of nodes) {
        if (node.key === key) return true;
        if (node.children && findPlainNode(node.children, key)) return true;
      }
      return false;
    };

    const missingIds = values.filter(id => !findPlainNode(treeData, String(id)));

    if (missingIds.length > 0) {
      // 这里的逻辑稍微有点问题：treeData 可能会在加载中
      const query = `{rows:organizations(filters: [["_id","in",${JSON.stringify(missingIds)}]], top: 500){_id,name,fullname}}`;
      
      fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      .then(res => res.json())
      .then(async data => {
        const rows = data.data?.rows || [];
        const newNodes = rows.map((org: any) => {
          return {
            title: org.name,
            fullname: org.fullname,
            value: String(org._id),
            key: String(org._id),
            isLeaf: true, 
            pathLabel: org.fullname || org.name,
            isExtra: true
          };
        });
        
        if (newNodes.length > 0) {
            setTreeData(prev => {
                // 再次检查去重，防止并发更新导致重复
                const currentKeys = new Set();
                const traverse = (nodes: any[]) => {
                    nodes.forEach(n => {
                        currentKeys.add(n.key);
                        if(n.children) traverse(n.children);
                    });
                }
                traverse(prev);
                
                const validNewNodes = newNodes.filter((n: any) => !currentKeys.has(n.key));
                if (validNewNodes.length === 0) return prev;
                return [...prev, ...validNewNodes];
            });
            // 同时也更新 labelMap
            setLabelMap(prev => {
                const next = new Map(prev);
                newNodes.forEach((n: any) => next.set(n.key, n.pathLabel));
                return next;
            });
        }
      });
    }
  }, [value, treeData]);

  // 递归更新树节点
  const updateTreeData = (list: any[], key: string, children: any[]): any[] =>
    list.map(node => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });


  // 懒加载子节点
  const onLoadData: TreeSelectProps['loadData'] = async (node) => {
    if (node.children) return;
    setLoading(true);
    const children = await fetchDeptTree(String(node.key));
    setTreeData(origin => {
      // 修复：加载子节点时，检查是否已经存在于根节点（isExtra），如果存在则移除根节点的临时节点，防止key重复
      const childrenKeys = new Set(children.map((c: any) => c.key));
      const filteredOrigin = origin.filter(item => !(item.isExtra && childrenKeys.has(item.key)));
      
      const updated = updateTreeData(filteredOrigin, String(node.key), children);
      // 为新加载的子节点添加路径标签
      const parentPath = node.pathLabel || node.title;
      const enrichedChildren = children.map(child => ({
        ...child,
        pathLabel: child.fullname || `${parentPath} / ${child.title}`
      }));
      const finalData = updateTreeData(filteredOrigin, String(node.key), enrichedChildren);
      // 更新labelMap
      const newLabelMap = new Map(labelMap);
      enrichedChildren.forEach(child => {
        newLabelMap.set(child.key, child.pathLabel);
      });
      setLabelMap(newLabelMap);
      return finalData;
    });
    setLoading(false);
  };

  // 服务端检索（带防抖）
  const onSearch = (searchValue: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!searchValue) {
      // 清空搜索词，恢复初始树
      setLoading(true);
      fetchDeptTree()
        .then(data => {
          const enrichWithPath = (nodes: any[], parentPath = ''): any[] => {
            return nodes.map(node => {
              const nodePath = parentPath ? `${parentPath} / ${node.title}` : node.title;
              return {
                ...node,
                pathLabel: nodePath,
                children: node.children ? enrichWithPath(node.children, nodePath) : undefined
              };
            });
          };
          const enrichedData = enrichWithPath(data);
          setTreeData(enrichedData);
          const newLabelMap = new Map<string, string>();
          const buildPaths = (nodes: any[]) => {
            nodes.forEach(node => {
              newLabelMap.set(node.key, node.pathLabel);
              if (node.children) buildPaths(node.children);
            });
          };
          buildPaths(enrichedData);
          setLabelMap(newLabelMap);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const result = await fetchDeptTree(undefined, searchValue);
      // 为搜索结果添加路径标签
      const enrichedResult = result.map(node => ({
        ...node,
        pathLabel: node.fullname || node.title
      }));
      setTreeData(enrichedResult);
      // 更新搜索结果的labelMap
      const newLabelMap = new Map<string, string>();
      enrichedResult.forEach(node => {
        newLabelMap.set(node.key, node.pathLabel);
      });
      setLabelMap(newLabelMap);
      setLoading(false);
    }, 300);
  };

  // 处理节点展开
  const onTreeExpand: TreeSelectProps['onTreeExpand'] = (keys) => {
    setExpandedKeys(keys.map(k => String(k)));
  };

  // 处理选择变化，显示全路径
  const handleChange = async (val: any, label: any, extra: any) => {
    console.log(`handleChange`, onChange, val);

    // 适配 treeCheckStrictly 模式，提取 value
    let selectedValues = val;
    if (multiple && val) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && 'value' in val[0]) {
        selectedValues = val.map((item: any) => item.value);
      } else if (Array.isArray(val)) {
        selectedValues = val;
      } else if (typeof val === 'object' && 'value' in val) {
         // 单选且开启 strict (虽然这里multiple=true才会开启strict)
         selectedValues = val.value;
      }
    }

    if (onChange || dispatchEvent) {
      const triggerChange = async (newVal: any) => {
        /**
         * 为了解决3.2 dispatchevent不生效的问题, https://github.com/baidu/amis/issues/7488
         * dispatchEvent时第三个参数传入的current的data为undefined会报错
         */
        const rendererEvent: any = await dispatchEvent?.('change', newVal ? createObject(data, { value: newVal }) : data, ref.current);
        console.log(`rendererEvent`, rendererEvent, ref.current)
        if (rendererEvent?.prevented) {
          return;
        }

        onChange?.(newVal);
      };

      // 如果是从搜索结果选中的，需要补充完整路径
      if (Array.isArray(selectedValues)) {
        Promise.all(selectedValues.map(async v => {
          const existingPath = labelMap.get(String(v));
          if (!existingPath || !existingPath.includes('/')) {
            // 如果没有完整路径，从服务端获取
            const node = findNodeInTree(treeData, String(v));
            if (node) {
              const fullPath = await getNodeFullPath(String(v), node.title);
              const newLabelMap = new Map(labelMap);
              newLabelMap.set(String(v), fullPath);
              setLabelMap(newLabelMap);
              return fullPath;
            }
          }
          return existingPath;
        })).then(paths => {
          triggerChange(selectedValues);
        });
      } else if (selectedValues) {
        const existingPath = labelMap.get(String(selectedValues));
        if (!existingPath || !existingPath.includes('/')) {
          // 如果没有完整路径，从服务端获取
          const node = findNodeInTree(treeData, String(selectedValues));
          if (node) {
            getNodeFullPath(String(selectedValues), node.title).then(fullPath => {
              const newLabelMap = new Map(labelMap);
              newLabelMap.set(String(selectedValues), fullPath);
              setLabelMap(newLabelMap);
              triggerChange(selectedValues);
            });
          } else {
            triggerChange(selectedValues);
          }
        } else {
          triggerChange(selectedValues);
        }
      } else {
        await triggerChange(selectedValues);
      }
    }
  };

  const element = (
    <Spin spinning={loading} className='steedos-org-selector'>
      <TreeSelect
        treeData={treeData}
        value={multiple ? (Array.isArray(value) ? value : (value ? [value] : [])).map(v => ({ value: String(v), label: labelMap.get(String(v)) || v })) : value}
        onChange={handleChange}
        treeCheckable={multiple}
        showCheckedStrategy={multiple ? undefined : TreeSelect.SHOW_PARENT}
        placeholder={placeholder}
        style={{ minWidth: 280, ...style }}
        loadData={onLoadData}
        treeDefaultExpandAll={false}
        treeExpandedKeys={expandedKeys}
        onTreeExpand={onTreeExpand}
        allowClear
        multiple={multiple}
        treeCheckStrictly={multiple}
        treeLine
        styles={{ popup: { root: { minWidth: 400, maxWidth: 450, maxHeight: 700, overflow: 'auto', zIndex: 3000 } } }}
        treeNodeLabelProp="pathLabel"
        showSearch
        onSearch={onSearch}
        filterTreeNode={false}
        maxTagCount="responsive"
        listHeight={600}
      />
    </Spin>
  );

  ref.current = element;

  ref.current.props = {
    ...ref.current.props,
    ...props
  }

  return element;
};