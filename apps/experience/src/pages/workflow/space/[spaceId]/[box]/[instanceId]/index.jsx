/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-11 14:10:02
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
import { RecordRelateds } from '@/components/object/RecordRelateds';
import { getRecordPermissions } from '@steedos-widgets/amis-lib';
import { Loading } from '@/components/Loading';
import { InstancesListview } from '@/components/object/InstancesListview';
import { getFlowFormSchema } from '@/lib/workflow/flow';
import { getInstanceInfo } from '@/lib/workflow/instance';
import { AppLayout } from '@/components/AppLayout';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Record({formFactor}) {
  const router = useRouter();
  const { app_id= 'approve_workflow', tab_id = 'instances', instanceId, box } = router.query;
  const [schema, setSchema] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [record, setRecord] = useState(null);

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

  useEffect(()=>{
    getViewSchema(tab_id, instanceId, {
      recordId: instanceId,
      tabId: tab_id,
      appId: app_id,
      formFactor: formFactor,
    }).then((res)=>{
      setSchema(res)
    })
  }, [tab_id, instanceId])
  
  return (
    <div className="h-full flex instance-scope">
      <div className="flex-1 w-32 border-r"><InstancesListview bulkActions={false} formFactor={formFactor} app_id={app_id} tab_id={tab_id} listViewName={box}></InstancesListview></div>
      <div className="flex-1 w-64" >
        {
          record != undefined && <div className="region-header bg-slate-50 static">
          {schema && <RecordHeader app_id={app_id} tab_id={tab_id} record_id={record._id} record={record} schema={schema} formFactor={formFactor} permissions={permissions} hiddenTitle={true} className="p-2"></RecordHeader>}
        </div>
        }
        <div className="relative flex flex-1 flex-col region-main overflow-auto border-t" id="instanceRoot" style={{
          height: "calc(100% - 60px)"
        }}>
          { record === undefined && <>
            Not Find Instance
          </>}
          <div className="" id="instanceRootModalContainer"></div>
          {record != undefined && formSchema && (
            <AmisRender  className="h-full" id={`amis-root-workflow`} schema={formSchema} router={router} data={{
              submit_date: record.submit_date,
              applicant: record.applicant,
              applicant_name: record.applicant_name,
              related_instances: record.related_instances,
              historyApproves: record.historyApproves,
              app_id,
              box,
              ...record.approveValues,
              context: record,
            }} getModalContainer={()=>{
              return document.querySelector('#instanceRootModalContainer')
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