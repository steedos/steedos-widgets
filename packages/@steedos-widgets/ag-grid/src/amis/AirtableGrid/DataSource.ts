type LoadOptions = Record<string, any>;

interface DataSourceConfig {
  baseUrl: string;
  baseId: string;
  tableId: string;
  key: string;
  load: (loadOptions: LoadOptions) => Promise<any>;
  insert: (values: any) => Promise<any>;
  remove: (key: string) => Promise<any>;
  update: (key: string, values: any) => Promise<any>;
}

export class AirtableDataSource {
  private config: DataSourceConfig;

  constructor(config: DataSourceConfig) {
    this.config = config;
  }

  private getFullUrl() {
    return `${this.config.baseUrl}/${this.config.baseId}/${this.config.tableId}`;
  }

  public async load(loadOptions: LoadOptions) {
    return this.config.load(loadOptions);
  }

  public async insert(values: any) {
    return this.config.insert(values);
  }

  public async remove(key: string) {
    return this.config.remove(key);
  }

  public async update(key: string, values: any) {
    return this.config.update(key, values);
  }
}

/*
// Helper function to check if a value is not empty
function isNotEmpty(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

// Example usage
const customDataSource = new AirtableDataSource({
  baseUrl: 'https://api.airtable.com',
  baseId: 'yourBaseId',
  tableId: 'yourTableId',
  key: "_id",
  load: async function (loadOptions) {
    try {
      const params: Record<string, string> = {};

      [
        "filter",
        "group",
        "groupSummary",
        "parentIds",
        "requireGroupCount",
        "requireTotalCount",
        "searchExpr",
        "searchOperation",
        "searchValue",
        "select",
        "sort",
        "skip",
        "take",
        "totalSummary",
        "userData"
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params[i] = JSON.stringify(loadOptions[i]);
        }
      });

      const response = await fetch(this.getFullUrl() + '?' + new URLSearchParams(params), { credentials: 'include' });
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
      const response = await fetch(this.getFullUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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

  remove: async function (key) {
    try {
      const response = await fetch(this.getFullUrl() + '/' + encodeURIComponent(key), {
        method: "DELETE",
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
      const response = await fetch(this.getFullUrl() + '/' + encodeURIComponent(key), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
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
*/