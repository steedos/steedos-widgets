/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 16:37:30
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
      console.log(`authorize============`)
      // Add logic here to look up the user from the credentials supplied
      let user = null;
      try {
        console.log(`fetch ${credentials.domain}/accounts/password/login`)

        let domain = credentials.domain;

        if(endsWith(domain, '/')){
          domain = domain.substring(0, domain.length-1)
      }

        const res = await fetch(`${domain}/accounts/password/login`, {
          method: 'POST',
          body: JSON.stringify({ user: {email: credentials.email}, password: crypto.createHash('sha256').update(credentials.password).digest('hex') }) 
        })
        const json = await res.json();
        if(!json.user){
          return null
        }
        user = {
          id: json.user.id,
          name: json.user.name,
          local: json.user.local,
          email: json.user.email,
          utcOffset: json.user.utcOffset,
          steedos: {
            space: json.space,
            token: json.token,
            userId: json.user.id,
            name: json.user.name
          }
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