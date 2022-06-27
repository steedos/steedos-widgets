import Head from 'next/head'
import Link from 'next/link'
import { useSession, getProviders, signIn } from "next-auth/react"
import { useRouter } from 'next/router';

import { AuthLayout } from '@/components/AuthLayout'
import { Input } from '@/components/Input'
import { Logo } from '@/components/Logo'

export default function Login({providers}) {
  const { data: session } = useSession()
  const router = useRouter();
  const { callbackUrl = '/' } = router.query
  
  if (typeof window !== 'undefined' && session) {
    router.push(callbackUrl);
  }

  return (
    <>
      <Head>
        <title>Sign In - Steedos</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <a>
              <Logo className="mb-2 h-10 w-auto" />
            </a>
          </Link>
          <h2 className="mt-6 text-lg font-semibold text-gray-900">
          Sign in to your account
          </h2>
          {/* <p className="mt-2 text-sm text-gray-700">
            点击以下按钮登录您的账户
          </p> */}
        </div>
        <div className="mt-10">
          <div className="mt-6">
            {/* <form action="#" method="POST" className="space-y-7">
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
              <div className="pt-1">
              </div>
            </form> */}

          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id)}
                className="w-full rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
          </div>
        </div>
      </AuthLayout>
    </>
  )
}


export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}