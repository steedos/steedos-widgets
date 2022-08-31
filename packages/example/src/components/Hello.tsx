import React from 'react'

import './Hello.less'

export const Hello = (props: any) => {
  return (<div className='example-hello'>
    <div>Hello World！{props.title}</div>
    <div>{props.content}</div>
  </div>)
}