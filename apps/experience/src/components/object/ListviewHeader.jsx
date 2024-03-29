/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-03 16:46:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-14 10:32:37
 * @Description:
 */
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import {
  values,
  isFunction,
  isEmpty,
  defaultsDeep,
  filter as _filter,
  includes,
} from "lodash";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { ListButtons } from "@/components/object/ListButtons";
import { FromNow } from "@/components/FromNow";
import { SearchableFieldsFilter } from '@/components/object/SearchableFieldsFilter'

import { getDefaultRenderData } from '@/lib/amis'

export function ListviewHeader({ schema, onListviewChange, formFactor , app_id: appId,tab_id: tabId, listViewName, searchFieldsFilterProps}) {
//   const [selectedListView, setSelectedListView] = useState();
  const [showFieldsFilter, setShowFieldsFilter] = useState(false); //useState(_filter(values(schema.uiSchema.fields), (field) => { return field.searchable; }).length > 0);
  const [queryInfo, setQueryInfo] = useState();
  const [filter, setFilter] = useState();
  const router = useRouter();
  let { listview_id } = router.query;
  if(listViewName){
    listview_id = listViewName;
  }
  const app_id = router.query.app_id || appId;
  const tab_id = router.query.tab_id || tabId;
  const selectedListView = schema.uiSchema.list_views[listview_id]

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: schema?.uiSchema?.name,
  });
  useEffect(() => {
    if (schema) {
      return window.addEventListener("message", (event) => {
        const { data } = event;
        if (data.type === "listview.loaded") {
          if (schema) {
            setTimeout(() => {
              if (
                SteedosUI.getRef(listViewId) &&
                SteedosUI.getRef(listViewId).getComponentByName
              ) {
                const listViewRef = SteedosUI.getRef(
                  listViewId
                ).getComponentByName(`page.listview_${schema.uiSchema.name}`);
                setQueryInfo({
                  count: listViewRef?.props.data.count,
                  dataUpdatedAt: listViewRef?.props.dataUpdatedAt,
                });
              }
            }, 300);
          }
        }
      });
    //   if (!selectedListView) {
    //     setSelectedListView(schema.uiSchema.list_views[listview_id]);
    //   }
    }
  }, [schema]);

  const refreshList = (e) => {
    SteedosUI.getRef(listViewId)
      .getComponentByName(`page.listview_${schema.uiSchema.name}`)
      .handleAction({}, { actionType: "reload" });
  };
  
  useEffect(() => {
    if (!isEmpty(listview_id) && isFunction(onListviewChange)) {
      setFilter(null);
      setShowFieldsFilter(false);
      onListviewChange(selectedListView);
    }
  }, [listview_id]);

  const showFilter = () => {
    SteedosUI.ListView.showFilter(schema.uiSchema.name, {
      listView: selectedListView,
      data: {
        filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter, { listViewId })
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
              schema.amisSchema.data, 
              getDefaultRenderData(),
              { listViewId }
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

  const filterToggler = () => {
    // if(!showFieldsFilter){
    //     setShowFieldsFilter(true)
    // }
    setShowFieldsFilter(!showFieldsFilter)
  };

  const onChange = (value)=>{
    router.push(`/app/${app_id}/${tab_id}/grid/${value.name}`)
    // setSelectedListView
  }
  return (
  <>
    <div className="slds-page-header bg-transparent shadow-none rounded-none border-none">
      <div className="slds-page-header__row">
        <div className="slds-page-header__col-title">
          <div className="slds-media">
            <div className="slds-media__figure">
              <span className="slds-icon_container slds-icon-standard-opportunity">
                <svg
                  className="slds-icon slds-page-header__icon"
                  aria-hidden="true"
                >
                  <use
                    xlinkHref={`/assets/icons/standard-sprite/svg/symbols.svg#${schema.uiSchema.icon}`}
                  ></use>
                </svg>
              </span>
            </div>
            <div className="slds-media__body">
              <div className="slds-page-header__name">
                <div className="slds-page-header__name-title">
                  <div>
                    <span>{schema?.uiSchema?.label}</span>

                    <Listbox
                      value={selectedListView}
                      onChange={onChange}
                    >
                      <div className="relative ">
                        <Listbox.Button className="flex w-full cursor-default text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <div className="slds-page-header__title slds-truncate">
                            {selectedListView?.label ||
                              schema?.uiSchema?.list_views.all?.label}
                          </div>
                          <div className="slds-page-header__name-switcher">
                            <svg className="slds-icon slds-icon-text-default h-4 w-4 fill-black" aria-hidden="true"><use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use></svg>
                          </div>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {values(schema?.uiSchema?.list_views).map(
                              (listView, personIdx) => (
                                <Listbox.Option
                                  key={personIdx}
                                  value={listView}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-sky-100 text-sky-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                >
                                  <span
                                    className={`block truncate ${
                                      (selectedListView?.name
                                        ? selectedListView.name
                                        : "all") === listView.name
                                        ? "font-medium"
                                        : "font-normal"
                                    }`}
                                  >
                                    {listView.label}
                                  </span>
                                  {(selectedListView?.name
                                    ? selectedListView.name
                                    : "all") === listView.name ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </Listbox.Option>
                              )
                            )}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="slds-page-header__col-actions">
          <div className="slds-page-header__controls">
            <div className="slds-page-header__control steedos-listview-buttons">
              {/* <button onClick={filterToggler} className="slds-button slds-button_neutral">查询</button> */}
              {queryInfo && <ListButtons
                app_id={app_id}
                tab_id={tab_id}
                schema={schema}
                formFactor={formFactor}
              ></ListButtons>}
            </div>
          </div>
        </div>
      </div>
      {!schema.isCustom && (
      <div className="slds-page-header__row">
        <div className="slds-page-header__col-meta">
          {queryInfo && (
            <p className="slds-page-header__meta-text mb-0">
              {queryInfo.count} 项 •{" "}
              <FromNow date={queryInfo.dataUpdatedAt}></FromNow>
            </p>
          )}
        </div>
        <div className="slds-page-header__col-controls">
          <div className="slds-page-header__controls">
            <div className="slds-page-header__control">
              <button 
                onClick={filterToggler}
                className="slds-button slds-button_icon slds-button_icon-border-filled"
                title="Quick Search"
              >
                <svg className="slds-button__icon" aria-hidden="true">
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
                </svg>
                <span className="slds-assistive-text">Quick Search</span>
              </button>
            </div>
            {/* <div className="slds-page-header__control">
              <div className="slds-dropdown-trigger slds-dropdown-trigger_click">
                <button
                  className="slds-button slds-button_icon slds-button_icon-more"
                  aria-haspopup="true"
                  aria-expanded="false"
                  title="List View Controls"
                >
                  <svg className="slds-button__icon" aria-hidden="true">
                    <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#settings"></use>
                  </svg>
                  <svg
                    className="slds-button__icon slds-button__icon_x-small"
                    aria-hidden="true"
                  >
                    <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                  </svg>
                  <span className="slds-assistive-text">
                    List View Controls
                  </span>
                </button>
              </div>
            </div>
            <div className="slds-page-header__control">
              <div className="slds-dropdown-trigger slds-dropdown-trigger_click">
                <button
                  className="slds-button slds-button_icon slds-button_icon-more"
                  aria-haspopup="true"
                  aria-expanded="false"
                  title="Change view"
                >
                  <svg className="slds-button__icon" aria-hidden="true">
                    <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#table"></use>
                  </svg>
                  <svg
                    className="slds-button__icon slds-button__icon_x-small"
                    aria-hidden="true"
                  >
                    <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
                  </svg>
                  <span className="slds-assistive-text">Change view</span>
                </button>
              </div>
            </div>
            <div className="slds-page-header__control">
              <button
                className="slds-button slds-button_icon slds-button_icon-border-filled"
                title="Edit List"
              >
                <svg className="slds-button__icon" aria-hidden="true">
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                </svg>
                <span className="slds-assistive-text">Edit List</span>
              </button>
            </div> */}
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
              <ul className="slds-button-group-list mb-0">
                {/* <li>
                  <button
                    className="slds-button slds-button_icon slds-button_icon-border-filled"
                    title="Filter"
                    onClick={filterToggler}
                  >
                    <svg className="slds-button__icon" aria-hidden="true">
                      <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#filter"></use>
                    </svg>
                    <span className="slds-assistive-text">刷选</span>
                  </button>
                </li> */}
                <li>
                  <button
                    className="slds-button slds-button_icon slds-button_icon-border-filled"
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
      )}
    </div>

    <Transition
        as={Fragment}
        show={showFieldsFilter}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
      <div className="w-full px-4 py-4 bg-white b-t">
          <SearchableFieldsFilter schema={schema} appId={app_id} listViewId={listViewId} listViewName={listview_id} onClose = {()=>{
            if(showFieldsFilter){
                const scope = SteedosUI.getRef(listViewId);
                scope.getComponentByName(`page.listview_${schema.uiSchema.name}`).handleFilterReset();
                setShowFieldsFilter(false)
            }
          }} {...searchFieldsFilterProps}></SearchableFieldsFilter>
      </div>
      </Transition>
  </>
  );
}
