import {
  buildFlowTemplateFilesQuery,
  shouldShowFlowTemplateFiles,
  getFlowTemplateFilesService
} from '../attachment';

describe('workflow attachment template files', () => {
  const draftInstance = {
    box: 'draft',
    space: 'space-1',
    flow: { _id: 'flow-1' }
  };

  test('queries files uploaded on the flow record for draft instances', () => {
    expect(buildFlowTemplateFilesQuery(draftInstance)).toBe(
      'query{flowTemplateFiles:cfs_files_filerecord(filters: [["metadata.space","=","space-1"],["metadata.object_name","=","flows"],["metadata.record_id","=","flow-1"]]){ _id,original,metadata,uploadedAt}}'
    );
  });

  test('only draft instances with a flow id show the template file service', () => {
    expect(shouldShowFlowTemplateFiles(draftInstance)).toBe(true);
    expect(shouldShowFlowTemplateFiles({ ...draftInstance, box: 'inbox' })).toBe(false);
    expect(shouldShowFlowTemplateFiles({ ...draftInstance, flow: {} })).toBe(false);
  });

  test('service renders a template download dropdown beside the upload button', () => {
    const service = getFlowTemplateFilesService(draftInstance);

    expect(service.type).toBe('service');
    expect(service.api.requestAdaptor).toContain(buildFlowTemplateFilesQuery(draftInstance));
    expect(service.body[0].template).toContain('Templates');
    expect(service.body[0].template).toContain('/api/v6/files/download/cfs.files.filerecord/');
  });
});
