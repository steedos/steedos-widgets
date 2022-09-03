/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-03 14:14:26
 * @Description:
 */
import dynamic from "next/dynamic";
import Document, { Script, Head, Main, NextScript } from "next/document";
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { getPage } from "@steedos-labs/amis-lib";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PageRender } from "@/components/PageRender";
import { setRootUrl } from "@steedos-labs/amis-lib";

export default function Page({ publicEnv }) {
  const router = useRouter();
  const { app_id, page_id } = router.query;
  const [page, setPage] = useState(null);

  if (typeof window !== "undefined") {
    Builder.set({ env: publicEnv });
    setRootUrl(publicEnv.STEEDOS_ROOT_URL);
  }

  useEffect(() => {
    if (!page_id) return;
    getPage(page_id, app_id).then((data) => {
      setPage(data);
    });
  }, [app_id, page_id]);

  return (
    <>
      {page && page.schema && (
        <PageRender
          id="amis-root"
          className="overflow-auto"
          router={router}
          schema={JSON.parse(page.schema)}
          assetUrls={[]}
        />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session =
    context.req.session ||
    (await unstable_getServerSession(context.req, context.res, authOptions));
  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/app",
        permanent: false,
      },
    };
  }

  // 临时方案, 还未找到合适的方式来处理前端默认配置
  return {
    props: {
      publicEnv: {
        STEEDOS_ROOT_URL: process.env.STEEDOS_ROOT_URL,
        STEEDOS_EXPERIENCE_ASSETURLS: process.env.STEEDOS_EXPERIENCE_ASSETURLS,
      },
    },
  };
}
