import React from 'react'

import './Hello.less'

export const Hello = ({title = 'World', body, render}) => {
  return (
  <div className='amis-object-hello'>
    <div>Hello {title}!</div>
    {body ? (
      <div className="container">
        {render('body', body, {
          // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
        })}
      </div>
    ) : null}
  </div>)
}