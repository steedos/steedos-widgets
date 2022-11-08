/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-14 15:03:42
 * @Description: 
 */
import { CallToAction } from '@/components/home/CallToAction'
import { Hero } from '@/components/home/Hero'
import { HomeLayout } from '@/components/HomeLayout'

export default function Home() {
  return (
    <>
      <div>
        <Hero />
        <CallToAction />
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return {
    layout: HomeLayout,
    data: {}
  }
}