/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-11 15:49:29
 * @Description: 
 */
export function Logo(props) {
  return (
      <img
        className={props.className}
        src="/logo.png"
        alt="Steedos"
        {...props}
      />
  )
}
