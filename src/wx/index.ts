/// <reference path="../../typings/index.d.ts" />
import { SUCCESS } from '../constant/jsonCode';

const updateManager = wx.getUpdateManager()
/**
 * 检查是否有更新
 */
export function checkUpgrade({
  title = "更新提示",
  content = "新版本已经准备好，是否重启应用？"
}) {
  updateManager.onCheckForUpdate(function (res) {
    console.log((!res.hasUpdate ? "没" : "") + "有更新")
  })
  updateManager.onUpdateReady(_ => {
    wx.showModal({
      title,
      content,
      success: function (res) {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })
}
export const getUserLocation = () => {
  return new Promise((s, j) => {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        s({ latitude, longitude, speed, accuracy })
      },
      fail: res => {
        j(res)
      }
    })
  })
}
export const getSetting = () => {
  return new Promise((s, j) => {
    wx.getSetting({
      success(res) { s(res) },
      fail(res) { j(res) }
    })
  })
}
export const openSetting = () => {
  return new Promise((s, j) => {
    wx.openSetting({
      success(res) { s(res) },
      fail(res) { j(res) }
    })
  })
}

export const getLocationAuth = () => {
  return new Promise((s, j) => {
    getSetting().then((res: any) => {
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: "scope.userLocation",
          success: () => s(),
          fail: () => {
            openSetting().then((res: any) => {
              if (!res.authSetting['scope.userLocation']) {
                j();
              } else {
                s()
              }
            }).catch(res => j(res))
          },
        })
      } else {
        s()
      }
    }).catch(res => {
      j(res)
    })

  })

}
export const bwxCheckSession = () => {
  return new Promise((s, j) => {
    wx.checkSession({
      success() {
        s();
      },
      fail() {
        j();
      }
    })
  })
}
const bwxLogin = () => {
  return new Promise((s: (res: wx.LoginSuccessCallbackResult) => any, j) => {
    wx.login({
      success(res) {
        s(res)
      },
      fail(res) {
        j(res)
      },
    })
  })
}

const userLogin = (loginUrl: string, jsCode: string) => {
  return request({
    url: loginUrl,
    data: {
      jsCode,
    }
  })
}
const initSession = (loginUrl: string, ) => {
  return new Promise((s, j) => {
    wx.clearStorageSync();
    bwxLogin().then(res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      let jsCode = res.code;
      userLogin(loginUrl, jsCode).then((json: LoginReturnJson) => {
        wx.setStorageSync('session_secret', json.data.session_secret);
        s();
      }).catch(err => {
        j(err)
      })
    })
  })
}

const verifySession = (url: string, sessionSecret: string) => {
  return new Promise((s: (json: VerifySessionJson) => any, j) => {
    request({
      url,
      data: {
        sessionSecret,
      }
    })
      .then((json: VerifySessionJson) => s(json))
      .catch((err: RequestErr) => j(err))
  })
}

export const checkSession = (loginUrl: string, verifySessionUrl: string) => {
  return new Promise((s, j) => {
    bwxCheckSession().then(() => {
      let sessionSecret = wx.getStorageSync('session_secret')
      if (sessionSecret) {
        verifySession(verifySessionUrl, sessionSecret).then((json: VerifySessionJson) => {
          if (json.data.sessionExist === true) {
            wx.setStorageSync('sessionExist', true);
            s();
          } else {
            initSession(loginUrl).then(() => s()).catch(err => {
              console.log(err);
              wx.showModal({
                title: '提示',
                content: '初始化session失败 ' + err.msg,
              })
              j(err)
            });
          }
        }).catch((err: any) => {
          wx.showModal({
            title: '提示',
            content: '请求服务器错误 错误信息: ' + err.msg,
          })
          j(err)
        })
      } else {
        initSession(loginUrl).then(() => {
          console.log("初始化session 成功")
          s();
        }).catch(err => {
          console.log(err);
          wx.showModal({
            title: '提示',
            content: '初始化session失败 ' + err.msg,
          })
          j(err)
        });
      }
    }).catch(() => {
      initSession(loginUrl).then(() => s()).catch((err: any) => {
        console.log(err);
        wx.showModal({
          title: '提示',
          content: '初始化session失败 ' + err.msg,
        })
        j(err)
      })
    })
  })
}

export const request = ({ url, data = {}, method = "POST" }: jsbdk.RequestParam) => {
  let sessionSecret = wx.getStorageSync('session_secret');
  return new Promise((s: (json: any) => any, j) => {
    wx.request({
      url,
      data,
      method,
      header: {
        session: sessionSecret,
      },
      success: function (res) {
        if (typeof res.data === 'string') {
          return j({
            msg: '网络错误'
          });
        }
        if (res.data.code !== SUCCESS) {
          console.log('获取失败');
          console.log('错误信息为:\n' + res.data.msg);
          j({
            code: res.data.code,
            msg: res.data.msg
          });

        } else {
          s(res.data);
        }
      },
      fail: function (e) {
        console.log(e);
        j({
          msg: '网络错误'
        });
      }
    })
  })
}
export const bget = ({ url, data, method = "GET", }: jsbdk.RequestParam) => {
  return request({ url, data, method, })
}
export const bpost = ({ url, data, method = "POST", }: jsbdk.RequestParam) => {
  return request({ url, data, method, })
}
export const getUid = (url: string) => {
  return request({
    url,
  })
}

