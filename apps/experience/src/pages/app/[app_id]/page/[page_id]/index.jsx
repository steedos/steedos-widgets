/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-08 17:22:40
 * @Description:
 */
import dynamic from "next/dynamic";
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { getPage } from "@steedos-widgets/amis-lib";
import { PageRender } from "@/components/PageRender";

export default function Page(props) {
  const router = useRouter();
  const { app_id, page_id } = router.query;
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!page_id) return;
    getPage({type: 'app', pageId: page_id, appId: app_id, formFactor: props.formFactor}).then((data) => {
      setPage(data);
    });
  }, [app_id, page_id]);
  return (
    <>
      {page && page.schema && page.name === page_id && (
        <PageRender
          id={page_id}
          className="overflow-auto"
          router={router}
          schema={JSON.parse(page.schema)}
          assetUrls={[]}
        />
      )}
    </>
  );
}