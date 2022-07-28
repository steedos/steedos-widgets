/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-28 15:12:19
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/router'
import { getListSchema } from '@/lib/objects';
import { getListViewButtons, execute } from '@/lib/buttons';
import { unstable_getServerSession } from "next-auth/next"
import { AmisRender } from '@/components/AmisRender'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { values } from 'lodash';

import { Button } from '@/components/object/Button'

export default function Page ({}) {
  const [selected, setSelected] = useState();
  const router = useRouter()
  const { app_id, tab_id } = router.query
  const [schema, setSchema] = useState(null);
  const [formFactor, setFormFactor] = useState(null);
  const [buttons, setButtons] = useState(null);

  const listViewRef = useRef();

  window.listViewRef = listViewRef;

  useEffect(()=>{
    if(window.innerWidth < 768){
      setFormFactor('SMALL')
    }else{
      setFormFactor('LARGE')
    }
  }, [])

  useEffect(() => {
    if(!tab_id || !formFactor) return ;
    getListSchema(app_id, tab_id, selected?.name, {formFactor: formFactor})
      .then((data) => {
        if(!schema){
          setSelected(values(data.uiSchema?.list_views).length > 0 ? values(data.uiSchema.list_views)[0] : null)
        }
        console.log(`===============data`, data)
        setSchema(data)
      })
      
  }, [tab_id, selected, formFactor]);

  useEffect(()=>{
    if(schema && schema.uiSchema){
      setButtons(getListViewButtons(schema.uiSchema, {
        app_id: app_id,
        tab_id: tab_id,
        router: router,
      }))
    }
  },[schema])

  const newRecord = ()=>{
    router.push('/app/'+app_id+'/'+tab_id+'/view/new')
  }

  // const buttonClick = (button)=>{
  //   return execute(button, {
  //     app_id: app_id,
  //     tab_id: tab_id,
  //     router: router,
  //     uiSchema: schema.uiSchema,
  //   })
  // }

  return (
    <>
      <div className="relative z-9 sm:pb-0 border-b sm:border-b-0">
              <div className="relative space-y-4">
                  <div className="relative pointer-events-auto w-full px-3 text-[0.8125rem] leading-5">
                      <div className="flex justify-between">
                          <div className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">{schema?.uiSchema?.label}</div>
                          <div className="flex flex-nowrap space-x-2 ml-6 fill-slate-400">
                            {schema?.uiSchema?.permissions?.allowCreate && 
                              <button onClick={newRecord} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold sm:rounded-[2px] shadow focus:outline-none">新建</button>
                            }
                            {listViewRef.current && buttons?.map((button)=>{
                              return (
                                <Button button={button} router={router} data={{
                                  app_id: app_id,
                                  tab_id: tab_id,
                                  object_name: schema.uiSchema.name,
                                  // _ref: listViewRef.current?.amisScope?.getComponentById("listview_project"),
                                }}></Button>
                               )
                            })}
                          </div>
                      </div>
                      <Listbox value={selected} onChange={setSelected}>
                        <div className="relative mt-1 w-[1/2]">
                          <Listbox.Button className="min-w-[6rem] w-auto cursor-default py-2 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selected?.label}</span>
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
                                <Listbox.Option
                                  key={personIdx}
                                  className={({ active }) =>
                                    `cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={listView}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {listView.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                  </div>
              </div>
          </div>
      {schema?.amisSchema && <AmisRender className="" ref={listViewRef} id={`${app_id}-${tab_id}`} schema={schema?.amisSchema || {}} router={router}></AmisRender>}
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