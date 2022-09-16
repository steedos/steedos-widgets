/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-16 15:05:06
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
import { Listview } from '@/components/object/Listview';
import { AppLayout } from '@/components/AppLayout';

export default function Record({formFactor}) {
  const router = useRouter();
  const { tab_id = 'instances', box } = router.query;

  return (
    <div className="h-full grid grid-cols-3 grid-flow-row-dense">
      <div className="border-r"><Listview formFactor={formFactor} app_id={'approve_workflow'} tab_id={tab_id} listViewName={box}></Listview></div>
      <div className="col-span-2" >
        
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