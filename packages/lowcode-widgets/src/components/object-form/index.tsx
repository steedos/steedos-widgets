export { ObjectForm } from '@steedos-ui/builder-object';

export type ObjectFormProps = {
  /**
   * 类型
   */
  mode?: "read" | "edit";
  objectApiName: 'string';
  recordId?: 'string';
}