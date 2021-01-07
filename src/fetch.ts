const SUCCESS = 0x0;
const DEFAULT_ERROR = -1;
export interface Param extends RequestInit {
  url: string,
}
interface ApiReturnJson {
  code: number,
  data?: object,
  msg?: string,
  count?: number,
  page?: number,
  limit?: number,
}
export default (param: Param) => {
  return new Promise((s, j) => {
    window.fetch(param.url, param)
      .then(resp => {
        if (resp.ok) {
          resp.json().then((json: ApiReturnJson) => {
            if (json.code === SUCCESS) {
              s(json)
            } else {
              j(json)
            }
          }).catch(err => {
            j({
              code: DEFAULT_ERROR,
              msg: '返回值不是正确的json格式',
              err,
            })
          })
        } else {
          j({
            code: DEFAULT_ERROR,
            msg: `HttpCode ${resp.status} ${resp.statusText}`,
          })
        }
      }).catch(err => {
        j({
          code: DEFAULT_ERROR,
          msg: err,
          err,
        })
      })

  })
}
