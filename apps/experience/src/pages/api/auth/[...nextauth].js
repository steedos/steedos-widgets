/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-19 16:02:57
 * @Description: 
 */

import NextAuth from "next-auth"
import KeycloakProvider from "@/lib/auth/KeycloakProvider";
import CredentialsProvider from "@/lib/auth/CredentialsProvider";
const axios = require('axios');
const jwt = require("jsonwebtoken")
const STEEDOS_ROOT_URL = process.env.STEEDOS_ROOT_URL
const JWT_API = '/accounts/jwt/login';
const VALIDATE_API = '/api/setup/validate';
const STEEDOS_TOKENS = {};
const STEEDOS_SESSIONS = {};

const getJWTToken = (user)=>{
  const jwtPayload = {
    iss: process.env.NEXTAUTH_URL,
    sub: "steedos-nextjs-amis",
    profile: {
      email: user.email,
      ...user      
    }
  };

  return jwt.sign(
    jwtPayload,
    process.env.STEEDOS_IDENTITY_JWT_SECRET,
    {
      expiresIn: 60
    }
  );
}

const loginSteedosProject = async (user)=>{
  if(STEEDOS_TOKENS[user.email]){
    return STEEDOS_TOKENS[user.email];
  }
  const projectRootUrl = STEEDOS_ROOT_URL;
  const rest =  await axios({
    url: `${projectRootUrl}${JWT_API}`,
    method: 'get',
    data: {},
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getJWTToken(user)}` }
  });
  STEEDOS_TOKENS[user.email] = rest.data;
  return STEEDOS_TOKENS[user.email];
}

const validateSteedosToken = async (user)=>{
  if(STEEDOS_SESSIONS[user.email]){
    return STEEDOS_SESSIONS[user.email];
  }
  const rest =  await axios({
    url: `${STEEDOS_ROOT_URL}${VALIDATE_API}`,
    method: 'post',
    data: {
      utcOffset: 8
    },
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user.space},${user.token}` }
  });
  STEEDOS_SESSIONS[user.email] = rest.data;
  return STEEDOS_SESSIONS[user.email];
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
      // if (account) {
      //   token.accessToken = account.access_token
      // }
      if(user && user.steedos){
        token.steedos = user.steedos;
      }
      return token
    }, 
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken
      if(session.user){
        if(token && token.steedos){
          session.steedos = token.steedos;
        }else{
          const loginResult = await loginSteedosProject(session.user);
          if(loginResult.space && loginResult.token){
            session.steedos = {
              space: loginResult.space,
              token: loginResult.token,
              userId: loginResult.user?.id,
              name: loginResult.user?.name,
              email: session.user.email
            }
          }
        }
        const steedosSession = await validateSteedosToken(session.steedos);
        session.steedos = Object.assign(steedosSession, {token: steedosSession.authToken});
      }

      session.publicEnv ={
        STEEDOS_ROOT_URL: process.env.STEEDOS_ROOT_URL,
        STEEDOS_EXPERIENCE_ASSETURLS: process.env.STEEDOS_EXPERIENCE_ASSETURLS,
      }

      return session
    }
  },
  events:{
    async signOut(token, session){
      delete STEEDOS_TOKENS[token.token.email];
      delete STEEDOS_SESSIONS[token.token.email];
    }
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions)