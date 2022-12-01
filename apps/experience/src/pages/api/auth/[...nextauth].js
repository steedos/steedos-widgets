/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-19 16:02:57
 * @Description: 
 */

import NextAuth from "next-auth"
import { caching } from 'cache-manager';

import KeycloakProvider from "@/lib/auth/KeycloakProvider";
import CredentialsProvider from "@/lib/auth/CredentialsProvider";
const axios = require('axios');
const querystring = require('querystring');
const STEEDOS_ROOT_URL = process.env.STEEDOS_ROOT_URL;
const OIDC_API = '/api/global/auth/oidc/login';
const VALIDATE_API = '/api/setup/validate';

let cache = null;

const getCache = async () => {

  if (!cache) {
    cache = await caching('memory', {
      ttl: 60 * 60 * 1000 /*milliseconds*/,
    });
  }

  return cache;

}

const loginSteedosByOIDC = async (accessToken)=>{
  const projectRootUrl = STEEDOS_ROOT_URL;
  const rest =  await axios({
    url: `${projectRootUrl}${OIDC_API}`,
    method: 'post',
    data: {
      accessToken,
    },
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` }
  });
  return rest.data
}

const getSteedosToken = async (space, token)=>{

  let steedosSession = await (await getCache()).get(`steedos-session/${space}/${token}`);
  if (!steedosSession) {
    const rest =  await axios({
      url: `${STEEDOS_ROOT_URL}${VALIDATE_API}`,
      method: 'post',
      data: {
        utcOffset: 8
      },
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${space},${token}` }
    });
    steedosSession = rest.data;
    await (await getCache()).set(`steedos-session/${space}/${token}`, steedosSession);
  }

  return steedosSession;
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: process.env.STEEDOS_IDENTITY_OIDC_ENABLED ? [
    CredentialsProvider,
    KeycloakProvider
  ] : [
    CredentialsProvider
  ],
  callbacks: {
    async jwt(props) {
      const { token, account, user } = props;

      // Persist the OAuth access_token to the token right after signin
      if (account && user && user.email) {

        if (account.provider === 'keycloak') {
          const loginResult = await loginSteedosByOIDC(account.access_token);
          
          user.space = loginResult.space;
          user.token = loginResult.token;
        }

        const token = {
          user,
        }

        return token
      }

      return token;
    }, 

    async session({ session, token, user }) {

      session.user = token.user
      session.error = token.error
      session.steedos = await getSteedosToken(session.user.space, session.user.token);

      session.publicEnv ={
        STEEDOS_ROOT_URL: process.env.STEEDOS_ROOT_URL,
        STEEDOS_EXPERIENCE_ASSETURLS: process.env.STEEDOS_EXPERIENCE_ASSETURLS,
      }

      return session
    }
  },
  events:{
    async signOut(token, session){
    }
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions)