/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 16:25:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 18:06:08
 * @Description: 
 */
import React, { useState, useEffect } from 'react';
const axios = require('axios');

const STEEDOS_ROOT_URL = process.env.STEEDOS_ROOT_URL
const STEEDOS_API_KEY = process.env.STEEDOS_API_KEY

import { SiteLayout } from '@/components/site/SiteLayout'

export default function Page({page, site_slug, page_slug}) {

  useEffect(() => {
    if(!page || !page.schema) return ;
    const amisJSON = JSON.parse(page.schema)
    let amis = amisRequire('amis/embed');
    let amisScoped = amis.embed(
      '#root', 
      amisJSON,
      {
        theme: 'antd'
      }
    );
  }, []);

  return (
    <>
        <div id="root" class="page-wrapper"></div>
    </>
  )
}


export async function getServerSideProps({
    params,
    locale,
    locales,
    preview,
  }) {
  
  const { site_slug, page_slug } = params;
  const slug = page_slug.join('/')
  
  const result = await axios({
    url: `${STEEDOS_ROOT_URL}/graphql`,
    method: 'post',
    data: {
      query: `{
        site_pages (filters: [["site_slug", "=", "${site_slug}"], ["slug", "=", "${slug}"]]) {
          _id
          name
          slug
          schema
        }
      }`,
    },
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer apikey,${STEEDOS_API_KEY}` 
    }
  });
  const page = result?.data?.data?.site_pages[0] || {}

  return {
    props: {
      site_slug,
      page_slug,
      page,
    },
  }
}


// export async function getStaticPaths() {
//   const result = await axios({
//     url: `${STEEDOS_ROOT_URL}/graphql`,
//     method: 'post',
//     data: {
//       query: `{
//         site_pages {
//           name
//           slug
//           site__expand {
//             name
//             slug
//           }
//         }
//       }`,
//     },
//     headers: { 
//       "Content-Type": "application/json", 
//       "Authorization": `Bearer apikey,${STEEDOS_API_KEY}` 
//     }
//   });

//   const pages = result?.data?.data?.site_pages || []
//   // Get the paths we want to pre-render based on posts
//   const paths = pages.map((page) => ({
//     params: { 
//       site_slug: page.site__expand.slug,
//       page_slug: page.slug.split('/') 
//     },
//   }))

//   return { paths, fallback: 'blocking' }
// }


Page.getLayout = function getLayout(page) {
  return {
    layout: SiteLayout,
    data: {}
  }
}