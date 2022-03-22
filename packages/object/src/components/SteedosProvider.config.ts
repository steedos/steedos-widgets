export const steedosProviderConfig = {
    name: 'Steedos:SteedosProvider',
    inputs: [
      { name: 'objectApiName', type: 'text', friendlyName: "Object Api Name" },
      { name: 'recordId', type: 'text', friendlyName: "Record ID" },
      { name: 'mode', type: 'text', friendlyName: "Mode", defaultValue: "edit" }, 
    ],
    canHaveChildren: true
  };
  