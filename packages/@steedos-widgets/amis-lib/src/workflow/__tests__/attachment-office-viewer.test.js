jest.mock('@steedos-widgets/amis-lib', () => ({
  getSteedosAuth: jest.fn(() => ({ userId: 'user-1' }))
}), { virtual: true });

import {
  ensureAmisOfficeViewerPackageUrls,
  getAttachmentPdfPreviewUrl,
  getAmisOfficeViewerWordContainerClass
} from '../attachment';

describe('workflow attachment Office Viewer package URLs', () => {
  const androidDingTalkUserAgent = [
    'Mozilla/5.0 (Linux; Android 12)',
    'AppleWebKit/537.36 Mobile Safari/537.36',
    'AliApp(DingTalk/8.3.41)'
  ].join(' ');

  const createWindow = ({
    userAgent = androidDingTalkUserAgent,
    width = 360
  } = {}) => {
    let resourceMap = null;
    const sdkScript = {
      src: 'http://192.168.1.61:8443/unpkg/@steedos-widgets/amis@6.3.0-patch.8/sdk/sdk.js'
    };
    const windowLike = {
      innerWidth: width,
      location: {
        href: 'http://192.168.1.61:8443/app/approve_workflow/'
      },
      navigator: { userAgent },
      URL,
      document: {
        querySelector(selector) {
          expect(selector).toBe(
            'script[src*="/@steedos-widgets/amis@"][src*="/sdk/sdk.js"]'
          );
          return sdkScript;
        }
      },
      amis: {
        require: {
          resourceMap(value) {
            resourceMap = value;
          }
        }
      }
    };

    return {
      windowLike,
      getResourceMap: () => resourceMap
    };
  };

  test('maps AMIS Office Viewer packages to the parser-loaded SDK directory in Android DingTalk', () => {
    const { windowLike, getResourceMap } = createWindow();

    expect(ensureAmisOfficeViewerPackageUrls(windowLike)).toBe(true);
    expect(getResourceMap()).toEqual({
      res: {},
      pkg: {
        '5aae26c-p4': {
          url: '/unpkg/@steedos-widgets/amis@6.3.0-patch.8/sdk/papaparse.js',
          type: 'js'
        },
        '5aae26c-p12': {
          url: '/unpkg/@steedos-widgets/amis@6.3.0-patch.8/sdk/charts.js',
          type: 'js'
        },
        '5aae26c-p13': {
          url: '/unpkg/@steedos-widgets/amis@6.3.0-patch.8/sdk/office-viewer.js',
          type: 'js'
        }
      }
    });
  });

  test.each([
    ['desktop DingTalk', 'Mozilla/5.0 (Macintosh) AliApp(DingTalk/8.3.41)', 1440],
    ['ordinary Android browser', 'Mozilla/5.0 (Linux; Android 12) Chrome/100 Mobile', 360]
  ])('does not change package URLs in %s', (_label, userAgent, width) => {
    const { windowLike, getResourceMap } = createWindow({ userAgent, width });

    expect(ensureAmisOfficeViewerPackageUrls(windowLike)).toBe(false);
    expect(getResourceMap()).toBeNull();
  });

  test.each([
    ['Android DingTalk', androidDingTalkUserAgent],
    ['ordinary Android browser', 'Mozilla/5.0 (Linux; Android 12) Chrome/100 Mobile']
  ])('left-aligns an oversized Word page in narrow %s', (_label, userAgent) => {
    const windowLike = createWindow({ userAgent, width: 360 }).windowLike;

    expect(getAmisOfficeViewerWordContainerClass(windowLike)).toContain(
      'justify-start'
    );
    expect(getAmisOfficeViewerWordContainerClass(windowLike)).not.toContain(
      'justify-center'
    );
  });

  test.each([
    ['iPhone Safari', 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1', 390],
    ['desktop DingTalk', 'Mozilla/5.0 (Macintosh) AliApp(DingTalk/8.3.41)', 1440],
    ['desktop Chrome', 'Mozilla/5.0 (Macintosh) Chrome/126 Safari/537.36', 1440]
  ])('keeps the centered Word layout in %s', (_label, userAgent, width) => {
    const windowLike = createWindow({ userAgent, width }).windowLike;

    expect(getAmisOfficeViewerWordContainerClass(windowLike)).toContain(
      'justify-center'
    );
  });

  test('uses the configured same-origin PDF.js viewer in narrow Android DingTalk', () => {
    const { windowLike } = createWindow();
    const fileUrl = [
      'http://192.168.1.61:8443/api/v6/files/',
      'cfs.instances.filerecord/file-1/%E6%B5%8B%E8%AF%95.pdf'
    ].join('');
    const viewerBaseUrl =
      '/js/pdfviewer/web/viewer.html?rangeChunkSize=1024&file=';

    expect(
      getAttachmentPdfPreviewUrl(fileUrl, windowLike, viewerBaseUrl)
    ).toBe(
      `/js/pdfviewer/web/viewer.html?rangeChunkSize=1024&file=${encodeURIComponent(fileUrl)}`
    );
  });

  test('keeps the raw PDF URL in a narrow ordinary Android browser', () => {
    const { windowLike } = createWindow({
      userAgent: 'Mozilla/5.0 (Linux; Android 12) Chrome/100 Mobile',
      width: 360
    });
    const fileUrl =
      'http://192.168.1.61:8443/api/v6/files/sample.pdf';
    const viewerBaseUrl =
      '/js/pdfviewer/web/viewer.html?rangeChunkSize=1024&file=';

    expect(
      getAttachmentPdfPreviewUrl(fileUrl, windowLike, viewerBaseUrl)
    ).toBe(fileUrl);
  });

  test.each([
    ['desktop DingTalk', 'Mozilla/5.0 (Macintosh) AliApp(DingTalk/8.3.41)', 1440],
    ['iPhone DingTalk', 'Mozilla/5.0 (iPhone) AliApp(DingTalk/8.3.41)', 390]
  ])('keeps the raw PDF URL in %s', (_label, userAgent, width) => {
    const { windowLike } = createWindow({ userAgent, width });
    const fileUrl = 'http://192.168.1.61:8443/api/v6/files/sample.pdf';

    expect(
      getAttachmentPdfPreviewUrl(
        fileUrl,
        windowLike,
        '/js/pdfviewer/web/viewer.html?rangeChunkSize=1024&file='
      )
    ).toBe(fileUrl);
  });

  test.each([
    ['missing viewer configuration', undefined, 'http://192.168.1.61:8443/api/v6/files/sample.pdf'],
    ['cross-origin viewer', 'https://viewer.example.test/viewer.html?file=', 'http://192.168.1.61:8443/api/v6/files/sample.pdf'],
    ['cross-origin file', '/js/pdfviewer/web/viewer.html?file=', 'https://files.example.test/sample.pdf']
  ])('falls back to the raw PDF URL for %s', (_label, viewerBaseUrl, fileUrl) => {
    const { windowLike } = createWindow();

    expect(
      getAttachmentPdfPreviewUrl(fileUrl, windowLike, viewerBaseUrl)
    ).toBe(fileUrl);
  });
});
