import React, { useState, useEffect, Fragment, useRef } from "react";

export function FromNow({date}){
    const [timer, setTimer] = useState();
    const [text, setText] = useState('');
    const fromNow = (date) => {
        return amisRequire("moment")(date).fromNow();
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