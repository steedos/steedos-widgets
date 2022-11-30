const axios = require('axios');
import { unstable_getServerSession } from "next-auth/next"

import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async function handler(req, res) {

  const session = await unstable_getServerSession(req, res, authOptions)
  console.log(session.accessToken)
  const result = await axios({
    url: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
    method: 'GET',
    headers: { 
      "Authorization": `Bearer ${session.accessToken}` 
    }
  });
  res.status(200).json({ status: 'ok', user: result.data, session })

}