import Head from "next/head";
import Link from "next/link";
import {
  useSession,
  getProviders,
  getCsrfToken,
  signIn,
} from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { useRouter } from "next/router";
import { XCircleIcon } from "@heroicons/react/solid";

import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { getRootUrl, setRootUrl } from "@steedos-widgets/amis-lib";

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
};
export default function Login({ providers = {}, csrfToken, rootUrl }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { callbackUrl = "/", error } = router.query;

  setRootUrl(rootUrl);
  
  if (typeof window !== "undefined" && session && callbackUrl) {
    router.push(callbackUrl);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Link href="/">
          <a>
            <Logo className="h-12 w-auto" />
          </a>
        </Link>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          登录您的账户
        </h2>
        <span className="mt-2 text-sm text-red-500">
          {error && errors[error] && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors[error]}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </span>
      </div>
      <div className="mt-4">
          {providers &&
            Object.values(providers).map((provider) => {
              if (provider.type === "credentials")
                return (
                  <form
                    method="post"
                    key={provider.name}
                    action="/api/auth/callback/credentials"
                    className="my-2 rounded-md shadow-sm"
                  >
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={csrfToken}
                    />
                    <input
                      placeholder="Domain"
                      name="domain"
                      type="text"
                      defaultValue={getRootUrl(rootUrl)}
                      required
                      className="hidden mb-2 focus:shadow-outline-blue sm:text-md relative block w-full appearance-none rounded-none rounded border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-300 focus:outline-none sm:leading-5"
                    />
                    <input
                      placeholder="邮箱、手机号、用户名"
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      className="focus:shadow-outline-blue sm:text-md relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-300 focus:outline-none sm:leading-5"
                      required
                    />
                    <input
                      placeholder="密码"
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="focus:shadow-outline-blue sm:text-md relative -mt-px block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-300 focus:outline-none sm:leading-5"
                      required
                    />
                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full rounded-full border border-transparent bg-sky-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      >
                        登录
                      </button>
                    </div>
                  </form>
                );
            })}
            
            <div className="pt-5">
              {providers &&
                Object.values(providers).map((provider) => {
                  if (provider.type === "oauth")
                    return (
                        <div key={provider.name} className="pt-5">
                          <button
                            onClick={() => signIn(provider.id)}
                            className="w-full rounded-full border border-transparent bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            使用 {provider.name} 登录
                          </button>
                        </div>
                    );
                })}
            </div>
      </div>
    </>
  );
}

Login.getLayout = function getLayout(page) {
  return {
    layout: AuthLayout,
    data: {}
  };
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const { callbackUrl = "/", error } = context.query;

  if (session && callbackUrl) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      rootUrl: process.env.STEEDOS_ROOT_URL,
      providers,
      csrfToken: csrfToken ? csrfToken : null,
    },
  };
}
