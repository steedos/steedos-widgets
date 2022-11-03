/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 11:09:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-25 13:07:35
 * @Description:
 */
import React, { useState, useEffect, Fragment, useRef } from "react";
import Link from 'next/link';
import { FromNow } from "@/components/FromNow";
import { RecordRelatedListButtons } from '@/components/object/RecordRelatedListButtons'
import { Tab, Menu, Transition } from "@headlessui/react";

export const RelatedHeader = ({app_id, foreign_key, masterObjectName, object_name, record_id, schema, record, masterObjectUISchema, formFactor}) => {
    const [queryInfo, setQueryInfo] = useState();
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
                

                <li>
                      <Menu
                        as="div"
                        className="slds-dropdown-trigger slds-dropdown-trigger_click"
                      >
                                               <div>
                          <Menu.Button className="border-0">
                          <div>
                          <svg
                          className="slds-icon slds-icon-text-default slds-icon_x-small"
                          aria-hidden="true"
                        >
                          <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#threedots_vertical"></use>
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
                                <RecordRelatedListButtons formFactor={formFactor} inMore={true} foreign_key={foreign_key} record_id={record_id} refId={listViewId} app_id={app_id} tab_id={object_name} object_name={object_name} masterObjectName={masterObjectName} schema={schema}>
                                </RecordRelatedListButtons>
                                <Menu.Item >
                                {schema?.uiSchema?.permissions?.allowDelete && 
                                    <button onClick={batchDelete} className="slds-dropdown__item group flex w-full items-center border-0 px-2 py-1">删除</button>
                                }
                                </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </li>
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
      </div>
    </div>
  );
};
