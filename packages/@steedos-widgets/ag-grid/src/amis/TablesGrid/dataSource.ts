/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-01-06 09:34:22
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-03-03 17:11:33
 */

import { AirtableDataSource } from '../AirtableGrid';

// Helper function to check if a value is not empty
function isNotEmpty(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

export const getDataSource = ({ baseUrl, baseId, tableId, key = "_id", context = {} }) => {
  return new AirtableDataSource({
    baseUrl: baseUrl,
    baseId: baseId,
    tableId: tableId,
    key: key,
    context,
    getFullUrl(): string {
      return `${this.baseUrl}/api/v6/tables/${this.baseId}/${this.tableId}`;
    },
    load: async function (loadOptions) {
      try {
        const context = this.context;
        const params: Record<string, string> = {};

        [
          // "filter",
          // "group",
          // "groupSummary",
          // "parentIds",
          // "requireGroupCount",
          // "requireTotalCount",
          // "searchExpr",
          // "searchOperation",
          // "searchValue",
          // "select",
          // "sort",
          // "skip",
          // "take",
          // "totalSummary",
          // "userData",
          "skip",
          "top",
          "filters",
          "sort",
          "expands",
        ].forEach((i) => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            if (i === "filters") {
              params[i] = JSON.stringify(loadOptions[i]);
            } else {
              params[i] = loadOptions[i];
            }
          }
        });

        const response = await fetch(this.getFullUrl() + '?' + new URLSearchParams(params), {
          credentials: 'include',
          "headers": {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${context.tenantId},${context.authToken}`
          }
        });
        if (!response.ok) throw new Error("Data loading error");
        const data = await response.json();

        return {
          data: data.data,
          totalCount: data.totalCount,
          summary: data.summary,
          groupCount: data.groupCount,
        };
      } catch (error) {
        throw new Error("Data loading error");
      }
    },

    insert: async function (values) {
      try {
        const context = this.context;
        const response = await fetch(this.getFullUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${context.tenantId},${context.authToken}`
          },
          body: JSON.stringify(values),
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Insertion failed");
        return await response.json();
      } catch (error) {
        throw new Error("Insertion failed");
      }
    },

    remove: async function (keys) {
      try {
        const context = this.context;
        const response = await fetch(this.getFullUrl(), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${context.tenantId},${context.authToken}`
          },
          body: JSON.stringify({ records: keys }),
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Deletion failed");
        return await response.json();
      } catch (error) {
        throw new Error("Deletion failed");
      }
    },

    update: async function (key, values) {
      try {
        const context = this.context;
        const response = await fetch(this.getFullUrl() + '/' + encodeURIComponent(key), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${context.tenantId},${context.authToken}`
          },
          body: JSON.stringify(values),
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Update failed");
        return await response.json();
      } catch (error) {
        throw new Error("Update failed");
      }
    }
  });
}
