/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-14 13:03:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-15 12:00:20
 * @Description: 
 */
import React, { useState, useEffect, Fragment, useRef } from "react";

export function FromNow({date}){
    const [timer, setTimer]: any = useState();
    const [text, setText]: any = useState('');
    const fromNow: any = (date) => {
        if((window as any).amisRequire){
            return (window as any).amisRequire("moment")(date).fromNow();
        }else if((window as any).moment){
            return (window as any).moment(date).fromNow();
        }else{
            console.error('not find moment')
        }
    };
    useEffect(()=>{
        if(timer){
            clearInterval(timer);
        }

        setText(fromNow(date))
        setTimer(setInterval(()=>{
            setText(fromNow(date))
        }, 1000 * 60))
    }, [date])
    return (<>
        {text}
    </>)
}