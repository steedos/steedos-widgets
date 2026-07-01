jest.mock('../converter/amis/fields/table', () => ({
  getApi: jest.fn(),
  getRecordPermissionsApi: jest.fn()
}));

jest.mock('../converter/amis/api', () => ({
  getSaveApi: jest.fn()
}));

jest.mock('../converter/amis/graphql', () => ({
  getApi: jest.fn()
}));

jest.mock('../page', () => ({
  getPage: jest.fn()
}));

import {
  getCalendarResourcesApi,
  getFullCalendarResourceOrder
} from '../converter/amis/calendar';

describe('getCalendarResourcesApi', () => {
  beforeEach(() => {
    global.getUISchemaSync = jest.fn(() => ({
      NAME_FIELD_KEY: 'name'
    }));
  });

  afterEach(() => {
    delete global.getUISchemaSync;
  });

  it('passes resources.sort to the resource list API', () => {
    const api = getCalendarResourcesApi(
      {
        fields: {
          room: {
            reference_to: 'meetingroom'
          }
        }
      },
      {
        groups: ['room'],
        resources: {
          sort: 'name desc'
        }
      }
    );

    expect(api.url).toContain('/api/v1/meetingroom?');
    expect(new URLSearchParams(api.url.split('?')[1]).get('sort')).toBe('name desc');
  });

  it('includes resource sort fields in returned resources', () => {
    const api = getCalendarResourcesApi(
      {
        fields: {
          room: {
            reference_to: 'meetingroom'
          }
        }
      },
      {
        groups: ['room'],
        resources: {
          sort: 'name desc'
        }
      }
    );

    const successCallback = jest.fn();
    api.adaptor(
      {
        data: {
          items: [
            {
              _id: 'demo_room_004',
              name: '视频会议室'
            }
          ]
        }
      },
      null,
      null,
      { successCallback }
    );

    expect(successCallback).toHaveBeenCalledWith([
      {
        id: 'demo_room_004',
        title: '视频会议室',
        name: '视频会议室'
      }
    ]);
  });
});

describe('getFullCalendarResourceOrder', () => {
  it('converts REST sort syntax to FullCalendar resourceOrder syntax', () => {
    expect(getFullCalendarResourceOrder('name desc')).toBe('-name');
    expect(getFullCalendarResourceOrder('name asc')).toBe('name');
    expect(getFullCalendarResourceOrder('region asc,name desc')).toBe('region,-name');
  });
});
