/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-03 16:46:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-25 17:11:15
 * @Description:
 */
import { Listbox, Menu, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import {
  values,
  isFunction,
  isEmpty,
  defaultsDeep,
  filter as _filter,
  includes,
  concat,
} from "lodash";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { Button } from "@/components/object/Button";
import { FromNow } from "@/components/FromNow";
import { standardButtonsTodo } from '@/lib/buttons';
import { getListViewButtons } from '@/lib/buttons';

export function ListviewHeader({ schema, onListviewChange, formFactor }) {
  //   const [selectedListView, setSelectedListView] = useState();
  const [buttons, setButtons] = useState(null);
  const [showFieldsFilter, setShowFieldsFilter] = useState(false);
  const [queryInfo, setQueryInfo] = useState();
  const [filter, setFilter] = useState();
  const router = useRouter();
  const { app_id, tab_id, listview_id } = router.query;

  const selectedListView = schema.uiSchema.list_views[listview_id];

  const listViewId = SteedosUI.getRefId({
    type: "listview",
    appId: app_id,
    name: schema?.uiSchema?.name,
  });
  useEffect(() => {
    if (schema) {
      if(schema && schema.uiSchema){
        setButtons(getListViewButtons(schema.uiSchema, {
            app_id: app_id,
            tab_id: tab_id,
            router: router,
          }))
      }
      window.addEventListener("message", (event) => {
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
                  count: listViewRef.props.data.count,
                  dataUpdatedAt: listViewRef.props.dataUpdatedAt,
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
      onListviewChange(selectedListView);
    }
  }, [listview_id]);

  const showFilter = () => {
    SteedosUI.ListView.showFilter(schema.uiSchema.name, {
      listView: selectedListView,
      data: {
        filters: SteedosUI.ListView.getVisibleFilter(selectedListView, filter),
      },
      props: {
        width: "100%",
        style: {
          width: "100%",
        },
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

  const filterToggler = () => {
    if (!showFieldsFilter) {
      setShowFieldsFilter(true);
    }
  };

  const onChange = (value) => {
    router.push(
      SteedosUI.Router.getObjectListViewPath({
        formFactor,
        appId: app_id,
        objectName: tab_id,
        listViewName: value.name,
      })
    );
  };

  const moreButtons =[ 
  {
    label: '新建',
    name: 'new',
    todo: (event)=>{
      const listViewId = SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema?.uiSchema?.name});
      standardButtonsTodo.standard_new.call({}, event, {
          listViewId,
          appId: app_id,
          uiSchema: schema.uiSchema,
          formFactor: formFactor,
          router: router,
          options: {
            props: {
              width: "100%",
              style: {
                width: "100%",
              },
              bodyStyle: { padding: "0px", paddingTop: "0px" },
            },
          }
      })
    }
  }
]

  return (
    <div className="slds-page-header relative rounded-none">
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
                    <Listbox value={selectedListView} onChange={onChange}>
                      <div className="relative w-[1/2]">
                        <Listbox.Button className="relative w-full cursor-default pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <span className="slds-page-header__title slds-truncate">
                            {selectedListView?.label ||
                              schema?.uiSchema?.list_views.all?.label}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <SelectorIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
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
                                        ? "bg-sky-50 text-sky-900"
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
                    {queryInfo && (
                      <p className="slds-page-header__meta-text mb-0">
                        {queryInfo.count} 项 •{" "}
                        <FromNow date={queryInfo.dataUpdatedAt}></FromNow>
                      </p>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div className="slds-page-header__col-actions">
          <div className="slds-page-header__controls space-x-4">
            <div className="slds-page-header__control">
              <button
                className="slds-icon slds-icon-text-default slds-icon_x-small"
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
              <ul className="slds-button-group-list mb-0">
                <li>
                  <button
                    className="slds-icon slds-icon-text-default slds-icon_x-small"
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
                    {concat(moreButtons, buttons)?.map((button, index) => {
                      return (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <Button
                              button={button}
                              inMore={true}
                              data={{
                                app_id: app_id,
                                tab_id: tab_id,
                                object_name: schema.uiSchema.name,
                              }}
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              } slds-dropdown__item group flex w-full items-center border-0 px-2 py-2`}
                            ></Button>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
