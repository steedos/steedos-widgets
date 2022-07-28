/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 13:28:52
 * @Description: 
 */
import { CallToAction } from '@/components/home/CallToAction'
import { Hero } from '@/components/home/Hero'
import { HomeLayout } from '@/components/HomeLayout'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <CallToAction />
      </main>
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return HomeLayout
}