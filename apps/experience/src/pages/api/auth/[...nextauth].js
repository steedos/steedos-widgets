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

let steedosSessionCache = null;

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

  if (!steedosSessionCache) {
    steedosSessionCache = await caching('memory', {
      ttl: 60 * 60 * 1000 /*milliseconds*/,
    });
  }

  let steedosSession = await steedosSessionCache.get(`${space}/${token}`);
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
    await steedosSessionCache.set(`${space}/${token}`, steedosSession);
  }

  return steedosSession;
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
 async function refreshAccessToken(token) {
  try {
    const url =
      `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`

    const response = await axios.post(url, 
      querystring.stringify({
        client_id: process.env.KEYCLOAK_ID,
        client_secret: process.env.KEYCLOAK_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })
    )

    const refreshedTokens = response.data
    
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
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
      if (account && user) {
        const token = {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          provider: account.provider,
          user,
        }

        if (account.provider === 'keycloak') {
          const loginResult = await loginSteedosByOIDC(account.access_token);
          
          user.space = loginResult.space;
          user.token = loginResult.token;
        }


        return token
      }

      if (token.provider != 'keycloak') 
        return token

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    }, 

    async session({ session, token, user }) {

      session.user = token.user
      session.accessToken = token.accessToken
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