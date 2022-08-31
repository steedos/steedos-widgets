export const AmisHello = ({title, body}) => {
  return {
    "type": "service",
    "body": [
      {
        "type": "panel",
        "title": "Hello ${title}",
        "body": body,
        "id": "u:75671fc7430c"
      }
    ],
    "id": "u:73601cf76024",
    "data": {
      "title": title
    }
  }
}

AmisHello.meta = {

}