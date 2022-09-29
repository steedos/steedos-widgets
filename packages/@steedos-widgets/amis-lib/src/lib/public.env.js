import { map } from 'lodash';

const PUBLIC_ENV = {};

export const setEnv = (k, v)=>{
    PUBLIC_ENV[k] = v;
}

export const getEnv = (k) =>{
    return PUBLIC_ENV[k];
}

export const setEnvs = (data) =>{
    map(data, (v, k)=>{
        PUBLIC_ENV[k] = v;
    });
}

export const getEnvs = () =>{
    return PUBLIC_ENV;
}