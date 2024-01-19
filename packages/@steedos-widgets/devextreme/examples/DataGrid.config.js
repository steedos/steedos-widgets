let collapsed = false;
const year = 2023;

return {
  dataSource: {
    store: {
      type: 'odata',
      version: 2,
      url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
      key: 'Id',
      beforeSend(request) {
        request.params.startDate = `2023-05-10`;
        request.params.endDate = `2023-5-15`;
      },
    },
  },
  paging: {
    pageSize: 10,
  },
  pager: {
    showPageSizeSelector: true,
    allowedPageSizes: [10, 25, 50, 100],
  },
  remoteOperations: false,
  searchPanel: {
    visible: true,
      highlightCaseSensitive: true,
    },
  groupPanel: { visible: true },
  grouping: {
    autoExpandAll: false,
  },
  allowColumnReordering: true,
  rowAlternationEnabled: true,
  showBorders: true,
  width: '100%',
  columns: [
    {
      dataField: 'Product',
      groupIndex: 0,
    },
    {
      dataField: 'Amount',
      caption: 'Sale Amount',
      dataType: 'number',
      format: 'currency',
      alignment: 'right',
    },
    {
      dataField: 'Discount',
      caption: 'Discount %',
      dataType: 'number',
      format: 'percent',
      alignment: 'right',
      allowGrouping: false,
      cssClass: 'bullet',
    },
    {
      dataField: 'SaleDate',
      dataType: 'date',
    },
    {
      dataField: 'Region',
      dataType: 'string',
    },
    {
      dataField: 'Sector',
      dataType: 'string',
    },
    {
      dataField: 'Channel',
      dataType: 'string',
    },
    {
      dataField: 'Customer',
      dataType: 'string',
      width: 150,
    },
  ],
  onContentReady(e) {
    if (!collapsed) {
      collapsed = true;
      e.component.expandRow(['EnviroCare']);
    }
  },
}