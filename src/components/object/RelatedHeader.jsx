/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 11:09:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-19 10:36:54
 * @Description:
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from 'next/link';
import { FromNow } from "@/components/FromNow";
import { RecordRelatedListButtons } from '@/components/object/RecordRelatedListButtons'
import { isEmpty, defaultsDeep } from 'lodash'
import { Tab, Menu, Transition } from "@headlessui/react";

export const RelatedHeader = ({app_id, foreign_key, masterObjectName, object_name, record_id, schema, record, masterObjectUISchema, formFactor}) => {
    const [queryInfo, setQueryInfo] = useState();
    const [filter, setFilter] = useState();
    const listViewId = SteedosUI.getRefId({type: 'related_list', appId: app_id, name: `${object_name}-${foreign_key}`})
    useEffect(() => {
          window.addEventListener("message", (event) => {
            const { data } = event;
            if (data.type === "listview.loaded") {
                setTimeout(() => {
                  if (
                    SteedosUI.getRef(listViewId) &&
                    SteedosUI.getRef(listViewId).getComponentByName
                  ) {
                    const listViewRef = SteedosUI.getRef(
                      listViewId
                    ).getComponentByName(`page.listview_${object_name}`);
                    setQueryInfo({
                      count: listViewRef.props.data.count
                    });
                  }
                }, 300);
            }
          });
      }, []);

      const refreshList = (e) => {
        SteedosUI.getRef(listViewId)
          .getComponentByName(`page.listview_${object_name}`)
          .handleAction({}, { actionType: "reload" });
      };
      const selectedListView = schema.uiSchema.list_views.all;
      const showFilter = () => {
        SteedosUI.ListView.showFilter(schema.uiSchema.name, {
          listView: selectedListView,
          data: {
            filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter),
          },
          onFilterChange: (filter) => {
            const scope = SteedosUI.getRef(listViewId);
            // amis updateProps 的 callback 2.1.0版本存在不执行的bug ,先通过延迟刷新.
            scope.updateProps(
              {
                data: defaultsDeep(
                  {
                    filter: SteedosUI.ListView.getQueryFilter(
                      selectedListView,
                      filter
                    ),
                  },
                  schema.amisSchema.data
                ),
              },
              () => {
                refreshList();
                setFilter(filter);
              }
            );
            setTimeout(() => {
              refreshList();
              setFilter(filter);
            }, 300);
          },
        });
      };
      const batchDelete = ()=>{
        const listViewRef = SteedosUI.getRef(listViewId).getComponentByName(`page.listview_${object_name}`)
      if(_.isEmpty(listViewRef.props.store.toJSON().selectedItems)){
          listViewRef.handleAction({}, {
              "actionType": "toast",
              "toast": {
                  "items": [
                    {
                      "position": "top-right",
                      "body": "请选择要删除的项"
                    }
                  ]
                }
            })
      }else{
          listViewRef.handleBulkAction(listViewRef.props.store.toJSON().selectedItems,[],{},listViewRef.props.bulkActions[0]);
      }
    }
  return (
    <div className="slds-page-header slds-page-header_related-list bg-white shadow-none border-none p-0 pb-4">
      <div className="slds-page-header__row">
        <div className="slds-page-header__col-title">
          <nav role="navigation" aria-label="Breadcrumbs">
            <ol className="slds-breadcrumb slds-list_horizontal">
              <li className="slds-breadcrumb__item">
                <Link href={`/app/${app_id}/${masterObjectName}`}>
                    <a >{masterObjectUISchema.label}</a>
                </Link>
              </li>
              <li className="slds-breadcrumb__item">
                <Link href={`/app/${app_id}/${masterObjectName}/view/${record_id}`}>
                <a >{record[masterObjectUISchema.NAME_FIELD_KEY]}</a>
                </Link>
              </li>
            </ol>
          </nav>
          <div className="slds-media">
            <div className="slds-media__body">
              <div className="slds-page-header__name">
                <div className="slds-page-header__name-title">
                  <h1>
                    <span
                      className="slds-page-header__title slds-truncate"
                      title="Contacts (will truncate)"
                    >
                      {schema?.uiSchema?.label}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="slds-page-header__col-actions">
          <div className="slds-page-header__controls">
            <div className="slds-page-header__control">
              <ul
                className="slds-button-group-list"
                id="button-group-page-header-actions"
              >
                <RecordRelatedListButtons formFactor={formFactor} foreign_key={foreign_key} record_id={record_id} refId={listViewId} app_id={app_id} tab_id={object_name} object_name={object_name} masterObjectName={masterObjectName} schema={schema}>
                </RecordRelatedListButtons>

                <li>
                      <Menu
                        as="div"
                        className="slds-dropdown-trigger slds-dropdown-trigger_click"
                      >
                        <div>
                          <Menu.Button className="slds-button slds-button_icon-border-filled slds-button_last">
                          <div>
                            <svg
                            focusable="false"
                            data-key="down"
                            aria-hidden="true"
                            className="slds-button__icon"
                            >
                            <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                            </svg>
                        </div>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:rounded-[2px]">
                            <div className="">
                                <Menu.Item >
                                {schema?.uiSchema?.permissions?.allowDelete && 
                                    <button onClick={batchDelete} className="slds-dropdown__item group flex w-full items-center border-0 px-2 py-2">删除</button>
                                }
                                </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </li>

                {/* <li>
                  <button className="slds-button slds-button_neutral" type="button">
                    Add Contact
                  </button>
                </li>
                <li>
                  <div
                    className="slds-dropdown-trigger slds-dropdown-trigger_click"
                    id="page-header-related-list-add-contact-dropdown"
                  >
                    <button
                      className="slds-button slds-button_icon-border-filled ignore-click-page-header-related-list-add-contact-dropdown"
                      type="button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <svg
                        aria-hidden="true"
                        className="slds-button__icon"
                        viewBox="0 0 52 52"
                      >
                        <path d="M8.3 14h35.4c1 0 1.7 1.3.9 2.2L27.3 37.4c-.6.8-1.9.8-2.5 0L7.3 16.2c-.7-.9-.1-2.2 1-2.2z"></path>
                      </svg>
                      <span className="slds-assistive-text">More Options</span>
                    </button>
                  </div>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="slds-page-header__row">
        <div className="slds-page-header__col-meta">
        {queryInfo && (
            <p className="slds">
              {queryInfo.count} 项 •{" "}
              <FromNow date={queryInfo.dataUpdatedAt}></FromNow>
            </p>
          )}
        </div>
        <div className="slds-page-header__col-controls">
          <div className="slds-page-header__controls">
            <div className="slds-page-header__control">
              <button
                className="slds-button slds-button_icon slds-button_icon-border-filled"
                title="Refresh List"
                onClick={refreshList}
              >
                <svg className="slds-button__icon" aria-hidden="true">
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#refresh"></use>
                </svg>
                <span className="slds-assistive-text">Refresh List</span>
              </button>
            </div>
            <div className="slds-page-header__control">
              <ul
                className="slds-button-group-list"
                id="button-group-page-header-controls"
              >
                <li>
                  <button
                    className="slds-button slds-button_icon-border-filled"
                    type="button"
                    onClick={showFilter}
                  >
                    <svg className="slds-button__icon" aria-hidden="true">
                      <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#filterList"></use>
                    </svg>
                    <span className="slds-assistive-text">过滤器</span>
                    {!isEmpty(filter) && (
                      <span className="slds-notification-badge slds-incoming-notification slds-show-notification min-h-[0.5rem] min-w-[0.5rem]"></span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
