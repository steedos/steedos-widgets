jest.mock('@steedos-widgets/amis-lib', () => ({
  getSteedosAuth: jest.fn(() => ({ userId: 'user-1' })),
  fetchAPI: jest.fn()
}), { virtual: true });

import { fetchAPI } from '@steedos-widgets/amis-lib';
import { getAttachmentOfficePreviewUrl } from '../attachment';

const OFFICE_VIEWER_URL = 'https://kk.example.test/onlinePreview?url=';
const SIGNED_URL = 'https://s3.example.test/bucket/key?X-Amz-Signature=abc';
const AUTH_TOKEN = 'secret-auth-token';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('getAttachmentOfficePreviewUrl', () => {
  test('exchanges the file id for a presigned url and builds the office viewer url', async () => {
    const fetcher = jest.fn().mockResolvedValue({ urls: [SIGNED_URL] });

    const url = await getAttachmentOfficePreviewUrl(
      { _id: 'file-1' },
      OFFICE_VIEWER_URL,
      fetcher
    );

    expect(fetcher).toHaveBeenCalledWith(
      '/api/v6/files/cfs.instances.filerecord/presigned-urls',
      {
        method: 'POST',
        body: JSON.stringify({ records: ['file-1'] })
      }
    );
    expect(url).toBe(OFFICE_VIEWER_URL + encodeURIComponent(SIGNED_URL));
  });

  test('rejects when the presigned url response is empty', async () => {
    const fetcher = jest.fn().mockResolvedValue({ urls: [null] });

    await expect(
      getAttachmentOfficePreviewUrl({ _id: 'file-1' }, OFFICE_VIEWER_URL, fetcher)
    ).rejects.toThrow();
  });
});

describe('previewAttachment office preview', () => {
  const file = { _id: 'file-1', original: { name: '测试.docx' } };

  const getDrawerIframe = (drawerProps) => {
    const wrapper = drawerProps.children;
    const container = wrapper.props.children;
    const children = [].concat(container.props.children);
    return children.find((child) => child && child.type === 'iframe');
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.Builder = {
      settings: {
        PUBLIC_OFFICE_VIEWER_URL: OFFICE_VIEWER_URL,
        context: { user: { authToken: AUTH_TOKEN } }
      }
    };
    global.SteedosUI = { Drawer: jest.fn() };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.Builder;
    delete global.SteedosUI;
    delete window.open;
  });

  test('opens the drawer with the presigned office viewer url and no auth token', async () => {
    fetchAPI.mockResolvedValue({ urls: [SIGNED_URL] });

    window.previewAttachment(file);
    await flushPromises();

    expect(fetchAPI).toHaveBeenCalledWith(
      '/api/v6/files/cfs.instances.filerecord/presigned-urls',
      {
        method: 'POST',
        body: JSON.stringify({ records: ['file-1'] })
      }
    );
    expect(SteedosUI.Drawer).toHaveBeenCalledTimes(1);

    const iframe = getDrawerIframe(SteedosUI.Drawer.mock.calls[0][0]);
    expect(iframe.props.src).toBe(OFFICE_VIEWER_URL + encodeURIComponent(SIGNED_URL));
    expect(iframe.props.src).not.toContain(AUTH_TOKEN);
  });

  test('opens the presigned office viewer url in a new window when configured', async () => {
    fetchAPI.mockResolvedValue({ urls: [SIGNED_URL] });
    Builder.settings.PUBLIC_OFFICE_PREVIEW_IN_NEW_WINDOW = 'true';
    const officeWindow = { location: { href: '' }, close: jest.fn() };
    window.open = jest.fn(() => officeWindow);

    window.previewAttachment(file);

    // 新窗口必须在用户点击的同步调用栈里打开，避免被弹窗拦截
    expect(window.open).toHaveBeenCalledWith('', '_blank');

    await flushPromises();

    expect(officeWindow.location.href).toBe(
      OFFICE_VIEWER_URL + encodeURIComponent(SIGNED_URL)
    );
    expect(SteedosUI.Drawer).not.toHaveBeenCalled();
  });

  test('falls back to the builtin docx viewer when the presigned request fails', async () => {
    fetchAPI.mockRejectedValue(new Error('boom'));

    window.previewAttachment(file);
    await flushPromises();

    expect(SteedosUI.Drawer).toHaveBeenCalledTimes(1);

    const wrapper = SteedosUI.Drawer.mock.calls[0][0].children;
    const content = wrapper.props.children;
    expect(content.props.mode).toBe('word');
    expect(content.props.src).toBe(
      window.location.origin
        + '/api/v6/files/cfs.instances.filerecord/file-1/'
        + encodeURIComponent('测试.docx')
    );
  });

  test('closes the pre-opened window when the presigned request fails', async () => {
    fetchAPI.mockRejectedValue(new Error('boom'));
    Builder.settings.PUBLIC_OFFICE_PREVIEW_IN_NEW_WINDOW = 'true';
    const officeWindow = { location: { href: '' }, close: jest.fn() };
    window.open = jest.fn(() => officeWindow);

    window.previewAttachment(file);
    await flushPromises();

    expect(officeWindow.close).toHaveBeenCalled();
  });
});
