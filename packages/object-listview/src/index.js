export const Hello = (props) => {
    return (
    <div className='example-hello'>
      <div>Hello World！{props.title}</div>
      <div>{props.content}</div>
    </div>)
}