import {has, isArray} from 'lodash';

const ROOT_URL = process.env.NEXT_PUBLIC_STEEDOS_ROOT_URL

function getRedirectUrl(href = window.location.href){
	const redirect = href.replace("/steedos/sign-in", "").replace("/accounts/a/#/logout", "");
	const u = new URL(redirect);
	u.searchParams.delete('no_redirect');
	u.searchParams.delete('X-Space-Id');
	u.searchParams.delete('X-Auth-Token');
	u.searchParams.delete('X-User-Id');
	return u.toString();
}

export async function authValidate(){
    const data = await fetchAPI(`/api/v4/users/validate`, {method: 'POST', body: JSON.stringify({})})
    return data;
}

export function goLogin(){
    window.location.href = `${ROOT_URL}/accounts/a/#/login?redirect_uri=${getRedirectUrl()}`
}

export function goSignup(){
    window.location.href = `${ROOT_URL}/accounts/a/#/signup?redirect_uri=${getRedirectUrl()}`
}

export function goLogout(){
    removeAuthInfo()
    window.location.href = `${ROOT_URL}/accounts/a/#/logout?redirect_uri=${getRedirectUrl()}`
}

export function saveAuthInfo(userId, spaceId, authToken){
    localStorage.setItem("steedos:userId", userId);
    localStorage.setItem("steedos:spaceId", spaceId);
    localStorage.setItem("steedos:token", authToken);
}

export function saveAuthInfoFromQuery(query) {

  if(typeof window !== 'undefined' && query){
    if(has(query, 'X-Auth-Token') && has(query, 'X-Space-Id') && has(query, 'X-User-Id')){
      let authToken = query['X-Auth-Token'];
      if(isArray(authToken)){
        authToken = authToken[authToken.length-1]
      }
      let spaceId = query['X-Space-Id'];
      if(isArray(spaceId)){
        spaceId = spaceId[spaceId.length-1]
      }
      let userId = query['X-User-Id'];
      if(isArray(userId)){
        userId = userId[userId.length-1]
      }
      saveAuthInfo(userId, spaceId, authToken)
    }
  }
}

export function removeAuthInfo(){
    localStorage.removeItem("steedos:userId");
    localStorage.removeItem("steedos:spaceId");
    localStorage.removeItem("steedos:token");
}

export function getAuthorization(){
    try {
        let spaceId = localStorage.getItem('steedos:spaceId');
        let token = localStorage.getItem('steedos:token');

        if (window.location.search && !spaceId && !token) {
            var searchParams = new URLSearchParams(window.location.search);
            spaceId = searchParams.get('X-Space-Id');
            token = searchParams.get('X-Auth-Token');
        }
        if (!spaceId || !token) {
            return null;
        }
        return `Bearer ${spaceId},${token}`;
    } catch (error) {
        console.error(error)
    }
}

export async function fetchAPI(api, options = { credentials: 'include' }) {
    const headers = { 'Content-Type': 'application/json' }
    const AUTHORIZATION = getAuthorization()
    if (AUTHORIZATION) {
        headers[
            'Authorization'
        ] = AUTHORIZATION
    } else {
        throw new Error(401)
    }

    options.headers = Object.assign({}, headers, options.headers);

    const res = await fetch(`${ROOT_URL}${api}`, options)
    
    if(res.status === 401){
        throw new Error(401)
    }

    const json = await res.json()
    if (json.errors) {
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }
    return json
}