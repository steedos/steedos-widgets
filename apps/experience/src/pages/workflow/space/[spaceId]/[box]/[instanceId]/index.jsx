/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-16 14:22:52
 * @Description:
 */
import dynamic from "next/dynamic";
import Document, { Script, Head, Main, NextScript } from "next/document";
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { getViewSchema, getFormSchema, getObjectRelatedList } from "@steedos-widgets/amis-lib";
import { AmisRender } from "@/components/AmisRender";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Tab, Menu, Transition } from "@headlessui/react";

import { RecordHeader } from '@/components/object/RecordHeader';
import { RecordHeader as MobileRecordHeader } from '@/components/mobile/object/RecordHeader';
import { RecordRelateds } from '@/components/object/RecordRelateds';
import { getRecordPermissions } from '@steedos-widgets/amis-lib';
import { Loading } from '@/components/Loading';
import { Listview } from '@/components/object/Listview';
import { getFlowFormSchema } from '@/lib/workflow/flow';
import { getInstanceInfo } from '@/lib/workflow/instance';
import { AppLayout } from '@/components/AppLayout';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Record({formFactor}) {
  const router = useRouter();
  const { app_id, tab_id = 'instances', instanceId, box } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [schema, setSchema] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [record, setRecord] = useState(null);

  const doEditing = () => {
    if (!formFactor) {
      return;
    }
    editRecord(tab_id, instanceId, formFactor);
  };

  const doReadonly = () => {
    if (!formFactor) {
      return;
    }
    viewRecord(tab_id, instanceId, formFactor);
  };


  useEffect(()=>{
    getInstanceInfo({instanceId: instanceId, box: box}).then((res)=>{
      setRecord(res)
    })
    getRecordPermissions(tab_id, instanceId).then((res)=>{
      setPermissions(res)
    })
  }, [tab_id, instanceId])

  useEffect(()=>{
    if(record){
      getFlowFormSchema(record).then((schema)=>{
        setFormSchema(schema)
      })
    }
  }, [record])

  useEffect(() => {
    doReadonly();
  }, [router]);

  useEffect(() => {
    if (isEditing) {
      doEditing();
    } else {
      doReadonly();
    }
  }, [formFactor]);

  const viewRecord = (tab_id, record_id, formFactor) => {
    if (tab_id && record_id) {
      const p1 = getObjectRelatedList(app_id, tab_id, record_id, formFactor);
      const p2 = getViewSchema(tab_id, record_id, {
        recordId: record_id,
        tabId: tab_id,
        appId: app_id,
        formFactor: formFactor,
      });
      Promise.all([p1, p2]).then((values) => {
        const schema = values[1];
        setSchema(schema);
        setIsEditing(false);
      });
    }
  };
  const editRecord = (tab_id, record_id, formFactor) => {
    if (tab_id && record_id) {
      getFormSchema(tab_id, {
        recordId: record_id,
        tabId: tab_id,
        appId: app_id,
        formFactor: formFactor,
      }).then((data) => {
        setSchema(data);
        setIsEditing(true);
      });
    }
  };

  const Header = formFactor === "SMALL" ? MobileRecordHeader : RecordHeader;

  if (!schema) 
    return <><Loading/></>
  return (
    <div className="h-full grid grid-cols-3 grid-flow-row-dense">
      <div className="border-r"><Listview formFactor={formFactor} app_id={'approve_workflow'} tab_id={'instances'} listViewName={box}></Listview></div>
      <div className="col-span-2" >
        <div className="region-header bg-slate-50 static">
          {schema && <Header schema={schema} formFactor={formFactor} permissions={permissions} hiddenTitle={true}></Header>}
        </div>
        <div className="relative flex flex-1 flex-col region-main overflow-auto" id="instanceRoot" style={{
          height: "calc(100% - 60px)"
        }}>
          {formSchema && (
            <AmisRender  className="" id={`amis-root-workflow`} schema={formSchema} router={router} data={{
              ...record.approveValues,
              context: record,
            }} getModalContainer={()=>{
              return document.querySelector('#instanceRoot')
            }}></AmisRender>
          )}
        </div>
      </div>
   </div>
  );
}

export async function getServerSideProps(context) {
  const session = context.req.session || await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/app",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}


Record.getLayout = function getLayout(page) {
  return {
    layout: AppLayout,
    data: {
      app_id: 'approve_workflow', //TODO 此处应该是动态值
      tab_id: 'instances'
    }
  }
}