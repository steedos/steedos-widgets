/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-28 15:38:43
 * @Description: 
 */
import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router'
import { getViewSchema, getFormSchema, getObjectRelateds } from '@/lib/objects';
import { AmisRender } from '@/components/AmisRender'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Tab, Menu, Transition} from '@headlessui/react'
import { getObjectDetailButtons, getObjectDetailMoreButtons } from '@/lib/buttons';
import { Button } from '@/components/Object/Button'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Record({ }) {

    const router = useRouter()
    const { app_id, tab_id, record_id } = router.query
    const [isEditing, setIsEditing] = useState(false);
    const [schema, setSchema] = useState(null);
    const [relateds, setRelateds] = useState(null);
    const [formFactor, setFormFactor] = useState(null);

    const [buttons, setButtons] = useState(null);
    const [moreButtons, setMoreButtons] = useState(null);

    useEffect(()=>{
      if(window.innerWidth < 768){
        setFormFactor('SMALL')
      }else{
        setFormFactor('LARGE')
      }
    }, [])

    useEffect(() => {
        setIsEditing(false)
    }, [router]);

    useEffect(() => {
        if(record_id === 'new'){
            setIsEditing(true)
        }else{
            setIsEditing(false)
        }
    }, [record_id]);

    useEffect(() => {
        if(!formFactor){
            return ;
        }
        if(isEditing){
            editRecord(tab_id, record_id, formFactor)
        }else{
            viewRecord(tab_id, record_id, formFactor);
        }
    }, [tab_id, record_id, isEditing, formFactor]);

    useEffect(()=>{
        if(schema && schema.uiSchema){
          setButtons(getObjectDetailButtons(schema.uiSchema, {
            app_id: app_id,
            tab_id: tab_id,
            router: router,
          }))
          setMoreButtons(getObjectDetailMoreButtons(schema.uiSchema, {
            app_id: app_id,
            tab_id: tab_id,
            router: router,
          }))
        }
      },[schema])

    const viewRecord = (tab_id, record_id, formFactor)=>{
        if(tab_id && record_id){
            getViewSchema(tab_id, record_id, {formFactor: formFactor})
            .then((data) => {
                setSchema(data)
            });
            getObjectRelateds(app_id, tab_id, record_id, formFactor).then((data)=>{
                setRelateds(data)
            })
        }
    }

    const editRecord = (tab_id, record_id, formFactor) => {
        if(tab_id && record_id){
            getFormSchema(tab_id, {recordId: record_id, tabId: tab_id, appId: app_id, formFactor: formFactor})
            .then((data) => {
                setSchema(data)
            })
        }
    }

    const cancelClick = () => {
        if(record_id === 'new'){
            router.back()
        }else{
            setIsEditing(false)
        }
    }

    const editClick = ()=>{
        setIsEditing(true)
    }

    return (
        <>
            <div className="relative z-9 p-0 sm:p-4 sm:pb-0">
                <div className="space-y-4">
                    <div className="pointer-events-auto w-full sm:rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
                        <div className=''>
                            <div className="flex justify-between">
                                <div className="font-medium text-slate-900 text-base">{schema?.uiSchema?.label}</div>
                                <div className="flex flex-nowrap space-x-2 ml-6 fill-slate-400">
                                { schema?.uiSchema?.permissions?.allowEdit &&  !isEditing && <button onClick={editClick} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold sm:rounded-[2px] shadow focus:outline-none">编辑</button>}
                                {  isEditing && <button onClick={cancelClick} className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold sm:rounded-[2px] shadow focus:outline-none">取消</button>}

                                {buttons?.map((button)=>{
                                    return (
                                        <Button button={button} router={router} data={{
                                        app_id: app_id,
                                        tab_id: tab_id,
                                        object_name: schema.uiSchema.name,
                                        // _ref: listViewRef.current?.amisScope?.getComponentById("listview_project"),
                                        }}></Button>
                                    )
                                    })}
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                        <Menu.Button className="py-0.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold sm:rounded-[2px] shadow focus:outline-none ml-1">
                                            ...
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
                                        <Menu.Items className="z-10 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 sm:rounded-[2px] bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="px-1 py-1">
                                            {/* <Menu.Item>
                                                {({ active }) => (
                                                <Button
                                                    className={`${
                                                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                    } group flex w-full items-center sm:rounded-[2px] px-2 py-2 text-sm`}
                                                >
                                                    删除
                                                </Button>
                                                )}
                                            </Menu.Item> */}
                                            {moreButtons && moreButtons.map((button, index)=>{
                                                return <Menu.Item>
                                                {({ active }) => (
                                                <Button button={button}  router={router} data={{
                                                    app_id: app_id,
                                                    tab_id: tab_id,
                                                    object_name: schema.uiSchema.name,
                                                    // _ref: listViewRef.current?.amisScope?.getComponentById("listview_project"),
                                                  }}
                                                  className={`${
                                                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                    } border-0 hover:bg-slate-50 group flex w-full items-center sm:rounded-[2px] px-2 py-2 text-sm`}
                                                  ></Button>
                                                )}
                                            </Menu.Item>
                                            })}
                                            </div>
                                        </Menu.Items>
                                        </Transition>
                                    </Menu>
                                    </div>
                            </div>
                            <div className="mt-1 text-slate-700">TODO: 记录名称</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="relative mt-2 z-9 p-0 sm:p-4 sm:pt-0 border-b sm:border-b-0">
                <Tab.Group vertical={true}>
                    <Tab.List className="flex space-x-1 sm:rounded-t-xl bg-white p-2">
                        <Tab
                                key="detail"
                                className={({ selected }) =>
                                    classNames(
                                    'w-full max-w-[15rem] pb-2',
                                    '',
                                    selected
                                        ? 'border-b-2 border-sky-500'
                                        : ''
                                    )
                                }
                            >基本信息</Tab>
                        {relateds?.map((related)=>{
                            return (<Tab
                                key={related.tab_id}
                                className={({ selected }) =>
                                    classNames(
                                    'w-full max-w-[15rem] pb-2',
                                    '',
                                    selected
                                        ? 'border-b-2 border-sky-500'
                                        : ''
                                    )
                                }
                            >{related?.schema?.uiSchema?.label}</Tab>)
                        })}
                    </Tab.List>
                    <Tab.Panels className="mt-0">
                        <Tab.Panel key="detail"
                                className={classNames(
                                    'sm:rounded-b-xl bg-white',
                                    ''
                                  )}>
                        <AmisRender id={`${app_id}-${tab_id}-${record_id}`} schema={schema?.amisSchema || {}} router={router}></AmisRender>
                        </Tab.Panel>
                        {relateds?.map((related)=>{
                            return (
                                <Tab.Panel 
                                key={related.tab_id}
                                className={classNames(
                                    'sm:rounded-b-xl bg-white',
                                    ''
                                  )}>
                                    <AmisRender id={`amis-root-related-${related.object_name}-${related.foreign_key}`} schema={related?.schema.amisSchema || {}} router={router}></AmisRender>
                                </Tab.Panel>
                            )
                        })}
                    </Tab.Panels>
                </Tab.Group>
            </div>
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