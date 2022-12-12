/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-12 14:45:01
 * @Description: 
 */
import CredentialsProvider from "next-auth/providers/credentials";
import { endsWith } from 'lodash'
import crypto from 'crypto';
export default CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Password",
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "" },
      password: {  label: "Password", type: "password" },
      domain: {  label: "Domain", type: "text" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      let user = null;
      try {
        let domain = credentials.domain;

        if(endsWith(domain, '/')){
          domain = domain.substring(0, domain.length-1)
        }

        let loginInfo = {email: credentials.email}
        if(new RegExp('^[0-9]{11}$').test(credentials.email)){
          loginInfo = {mobile: credentials.email}
        }else if(credentials.email.indexOf("@") < 0){
          loginInfo = {username: credentials.email}
        }

        const res = await fetch(`${domain}/accounts/password/login`, {
          method: 'POST',
          body: JSON.stringify({ user: loginInfo, password: crypto.createHash('sha256').update(credentials.password).digest('hex') }) 
        })
        const json = await res.json();
        
        if(!json.user){
          return null
        }
        user = {
          space: json.space,
          token: json.token,
          ...json.user
        }
      } catch (e) {console.log(e)}
      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  })