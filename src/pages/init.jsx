/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-09 18:15:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-10 16:33:50
 * @Description:
 */
import { AuthLayout } from '@/components/AuthLayout'
import { setRootUrl } from '@/lib/steedos.client.js';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Init({}) {
  const onSubmit = (e)=>{
    e.preventDefault();
    if(e.target.company.value){
        setRootUrl(e.target.company.value);
        window.location.href = `${e.target.company.value}/accounts/a/#/login?redirect_uri=${window.location.origin}/app`
    }
    return false
  }

  return (
    <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <svg
          className="absolute left-full transform translate-x-1/2"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <svg
          className="absolute right-full bottom-0 transform -translate-x-1/2"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">初始化</h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            描述信息....
          </p>
        </div>
        <div className="mt-12">
          <form method="POST" className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" onSubmit={onSubmit}>
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              服务器地址
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="company"
                  id="company"
                  autoComplete="organization"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-1 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                继续
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


Init.getLayout = function getLayout(page) {
    return AuthLayout
  }