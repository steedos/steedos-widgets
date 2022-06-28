import Head from 'next/head'
import Link from 'next/link'
import { useSession, getProviders, signIn } from "next-auth/react"

import { useRouter } from 'next/router';
import { XCircleIcon } from '@heroicons/react/solid'

import { AuthLayout } from '@/components/AuthLayout'
import { Input } from '@/components/Input'
import { Logo } from '@/components/Logo'

const errors = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  default: "Unable to sign in.",
}
export default function Login({providers={}}) {
  console.log(providers)

  const { data: session } = useSession()
  const router = useRouter();
  const { callbackUrl, error } = router.query
  
  if (typeof window !== 'undefined' && session && callbackUrl) {
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
          <p className="mt-2 text-sm text-red-500">
            {error && errors[error] && (
              <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errors[error]}</h3>
                </div>
              </div>
            </div>
            )}
          </p>
        </div>
        <div className="mt-6">
          <div className="">

          {providers && Object.values(providers).map((provider) => {
            if (provider.type === "credentials") 
            return (
              <form action="#" method="POST" className="space-y-4">
                <input
                  placeholder="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
                  required
                />
                <input
                  placeholder="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
                  required
                />
                <div className="pt-2">
                  <button
                    onClick={() => signIn('credentials')}
                    className="w-full rounded-full border border-transparent bg-sky-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )
          })}

          <div className="pt-5">
            <hr className="my-5"/>
            {providers && Object.values(providers).map((provider) => {
              if (provider.type === "oauth") 
              return (
                <>
                  <div key={provider.name} className="pt-5"> 
                    <button
                      onClick={() => signIn(provider.id)}
                      className="w-full rounded-full border border-transparent bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Sign in with {provider.name}
                    </button>
                  </div>
                </>
              )
            })}
          </div>
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