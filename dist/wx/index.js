import { SUCCESS } from '../constant/jsonCode';
var updateManager = wx.getUpdateManager();
export function checkUpgrade(_a) {
    var _b = _a.title, title = _b === void 0 ? "更新提示" : _b, _c = _a.content, content = _c === void 0 ? "新版本已经准备好，是否重启应用？" : _c;
    updateManager.onCheckForUpdate(function (res) {
        console.log((!res.hasUpdate ? "没" : "") + "有更新");
    });
    updateManager.onUpdateReady(function (_) {
        wx.showModal({
            title: title,
            content: content,
            success: function (res) {
                if (res.confirm) {
                    updateManager.applyUpdate();
                }
            }
        });
    });
}
export var getUserLocation = function () {
    return new Promise(function (s, j) {
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                var speed = res.speed;
                var accuracy = res.accuracy;
                s({ latitude: latitude, longitude: longitude, speed: speed, accuracy: accuracy });
            },
            fail: function (res) {
                j(res);
            }
        });
    });
};
export var getSetting = function () {
    return new Promise(function (s, j) {
        wx.getSetting({
            success: function (res) { s(res); },
            fail: function (res) { j(res); }
        });
    });
};
export var openSetting = function () {
    return new Promise(function (s, j) {
        wx.openSetting({
            success: function (res) { s(res); },
            fail: function (res) { j(res); }
        });
    });
};
export var getLocationAuth = function () {
    return new Promise(function (s, j) {
        getSetting().then(function (res) {
            if (!res.authSetting['scope.userLocation']) {
                wx.authorize({
                    scope: "scope.userLocation",
                    success: function () { return s(); },
                    fail: function () {
                        openSetting().then(function (res) {
                            if (!res.authSetting['scope.userLocation']) {
                                j();
                            }
                            else {
                                s();
                            }
                        }).catch(function (res) { return j(res); });
                    },
                });
            }
            else {
                s();
            }
        }).catch(function (res) {
            j(res);
        });
    });
};
export var bwxCheckSession = function () {
    return new Promise(function (s, j) {
        wx.checkSession({
            success: function () {
                s();
            },
            fail: function () {
                j();
            }
        });
    });
};
var bwxLogin = function () {
    return new Promise(function (s, j) {
        wx.login({
            success: function (res) {
                s(res);
            },
            fail: function (res) {
                j(res);
            },
        });
    });
};
var userLogin = function (loginUrl, jsCode) {
    return request({
        url: loginUrl,
        data: {
            jsCode: jsCode,
        }
    });
};
var initSession = function (loginUrl) {
    return new Promise(function (s, j) {
        wx.clearStorageSync();
        bwxLogin().then(function (res) {
            var jsCode = res.code;
            userLogin(loginUrl, jsCode).then(function (json) {
                wx.setStorageSync('session_secret', json.data.session_secret);
                s();
            }).catch(function (err) {
                j(err);
            });
        });
    });
};
var verifySession = function (url, sessionSecret) {
    return new Promise(function (s, j) {
        request({
            url: url,
            data: {
                sessionSecret: sessionSecret,
            }
        })
            .then(function (json) { return s(json); })
            .catch(function (err) { return j(err); });
    });
};
export var checkSession = function (loginUrl, verifySessionUrl) {
    return new Promise(function (s, j) {
        bwxCheckSession().then(function () {
            var sessionSecret = wx.getStorageSync('session_secret');
            if (sessionSecret) {
                verifySession(verifySessionUrl, sessionSecret).then(function (json) {
                    if (json.data.sessionExist === true) {
                        wx.setStorageSync('sessionExist', true);
                        s();
                    }
                    else {
                        initSession(loginUrl).then(function () { return s(); }).catch(function (err) {
                            console.log(err);
                            wx.showModal({
                                title: '提示',
                                content: '初始化session失败 ' + err.msg,
                            });
                            j(err);
                        });
                    }
                }).catch(function (err) {
                    wx.showModal({
                        title: '提示',
                        content: '请求服务器错误 错误信息: ' + err.msg,
                    });
                    j(err);
                });
            }
            else {
                initSession(loginUrl).then(function () {
                    console.log("初始化session 成功");
                    s();
                }).catch(function (err) {
                    console.log(err);
                    wx.showModal({
                        title: '提示',
                        content: '初始化session失败 ' + err.msg,
                    });
                    j(err);
                });
            }
        }).catch(function () {
            initSession(loginUrl).then(function () { return s(); }).catch(function (err) {
                console.log(err);
                wx.showModal({
                    title: '提示',
                    content: '初始化session失败 ' + err.msg,
                });
                j(err);
            });
        });
    });
};
export var request = function (_a) {
    var url = _a.url, _b = _a.data, data = _b === void 0 ? {} : _b, _c = _a.method, method = _c === void 0 ? "POST" : _c;
    var sessionSecret = wx.getStorageSync('session_secret');
    return new Promise(function (s, j) {
        wx.request({
            url: url,
            data: data,
            method: method,
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
                }
                else {
                    s(res.data);
                }
            },
            fail: function (e) {
                console.log(e);
                j({
                    msg: '网络错误'
                });
            }
        });
    });
};
export var bget = function (_a) {
    var url = _a.url, data = _a.data, _b = _a.method, method = _b === void 0 ? "GET" : _b;
    return request({ url: url, data: data, method: method, });
};
export var bpost = function (_a) {
    var url = _a.url, data = _a.data, _b = _a.method, method = _b === void 0 ? "POST" : _b;
    return request({ url: url, data: data, method: method, });
};
export var getUid = function (url) {
    return request({
        url: url,
    });
};
//# sourceMappingURL=index.js.map