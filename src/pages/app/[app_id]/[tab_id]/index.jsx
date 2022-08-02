/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-02 11:28:38
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@/lib/objects';
import { unstable_getServerSession } from "next-auth/next"
import { AmisRender } from '@/components/AmisRender'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { values } from 'lodash';

import { ListButtons } from '@/components/object/ListButtons'

export default function Page (props) {
  const [selectedListView, setSelectedListView] = useState();
  const router = useRouter();
  const { app_id, tab_id } = router.query
  const [schema, setSchema] = useState();
  const [formFactor, setFormFactor] = useState(null);

  useEffect(()=>{
    if(window.innerWidth < 768){
      setFormFactor('SMALL')
    }else{
      setFormFactor('LARGE')
    }
  }, [])

  useEffect(() => {
    setSelectedListView(undefined)
  }, [tab_id]);

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListSchema(app_id, tab_id, tab_id === schema?.uiSchema?.name ? selectedListView?.name : undefined, {formFactor: formFactor})
      .then((data) => {
        setSchema(data)
      })
  }, [tab_id, selectedListView, formFactor]);
  return (
    <>
      <div className="relative z-9 sm:pb-0 border-b sm:border-b-0">
              <div className="relative space-y-4">
                  <div className="relative pointer-events-auto w-full px-3 text-[0.8125rem] leading-5">
                      <div className="flex justify-between">
                          <div className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">{schema?.uiSchema?.label}</div>
                          <div className="flex flex-nowrap space-x-2 ml-6 fill-slate-400">
                            <ListButtons app_id={app_id} tab_id={tab_id} schema={schema}></ListButtons>
                          </div>
                      </div>
                      <Listbox value={selectedListView} onChange={setSelectedListView}>
                        <div className="relative mt-1 w-[1/2]">
                          <Listbox.Button className="relative w-full cursor-default py-2 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selectedListView?.label || schema?.uiSchema?.list_views.all?.label}</span>
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
                            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {values(schema?.uiSchema?.list_views).map((listView, personIdx) => (
                                    <Listbox.Option key={personIdx} value={listView} className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                  }>
                                   
                                        <span
                                          className={`block truncate ${
                                            (selectedListView?.name ? selectedListView.name : 'all') === listView.name ? 'font-medium' : 'font-normal'
                                          }`}
                                        >
                                          {listView.label}
                                        </span>
                                        {(selectedListView?.name ? selectedListView.name : 'all') === listView.name ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                    </Listbox.Option>
                              ))}
                            </Listbox.Options>
                            </Transition>
                        </div>
                        
                      </Listbox>
                      
                  </div>
              </div>
          </div>
      {schema?.amisSchema && schema?.uiSchema.name === tab_id && <AmisRender className="px-3" id={SteedosUI.getRefId({type: 'listview', appId: app_id, name: schema.uiSchema.name})} schema={schema?.amisSchema || {}} router={router}></AmisRender>}
    </>
  )
}


export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/app',
        permanent: false,
      },
    }
  }
  return {
    props: { },
  }
}