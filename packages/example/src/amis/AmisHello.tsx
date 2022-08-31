export const AmisHello = ({title, body}) => {
  return {
    "type": "service",
    "body": [
      {
        "type": "panel",
        "title": "Hello ${title}",
        "body": [
          {
            "type": "tpl",
            "tpl": "内容",
            "inline": false,
            "id": "u:43e9c9279437"
          }
        ],
        "id": "u:75671fc7430c"
      }
    ],
    "id": "u:73601cf76024",
    "data": {
      "title": "World"
    }
  }
}

AmisHello.meta = {

}