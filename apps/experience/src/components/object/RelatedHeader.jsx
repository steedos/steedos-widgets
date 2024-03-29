/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 11:09:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-07 14:26:31
 * @Description:
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from 'next/link';
import { FromNow } from "@/components/FromNow";
import { RecordRelatedListButtons } from '@/components/object/RecordRelatedListButtons'
import { isEmpty, defaultsDeep } from 'lodash'
import { Tab, Menu, Transition } from "@headlessui/react";

export const RelatedHeader = ({app_id, foreign_key, masterObjectName, object_name, record_id, schema, record = {}, masterObjectUISchema = {}, formFactor}) => {
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
            filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter, { listViewId }),
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
    <div className="slds-page-header slds-page-header_related-list bg-transparent shadow-none border-none p-0">
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
            <div className="slds-page-header__control steedos-related-buttons">
                <RecordRelatedListButtons formFactor={formFactor} foreign_key={foreign_key} record_id={record_id} refId={listViewId} app_id={app_id} tab_id={object_name} object_name={object_name} masterObjectName={masterObjectName} schema={schema}>
                </RecordRelatedListButtons>
                <button onClick={batchDelete} className="antd-Button antd-Button--default">删除</button>
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
            <div className="slds-page-header__control hidden">
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
