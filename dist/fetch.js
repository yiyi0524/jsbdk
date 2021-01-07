var SUCCESS = 0x0;
var DEFAULT_ERROR = -1;
export default (function (param) {
    return new Promise(function (s, j) {
        window.fetch(param.url, param)
            .then(function (resp) {
            if (resp.ok) {
                resp.json().then(function (json) {
                    if (json.code === SUCCESS) {
                        s(json);
                    }
                    else {
                        j(json);
                    }
                }).catch(function (err) {
                    j({
                        code: DEFAULT_ERROR,
                        msg: '返回值不是正确的json格式',
                        err: err,
                    });
                });
            }
            else {
                j({
                    code: DEFAULT_ERROR,
                    msg: "HttpCode " + resp.status + " " + resp.statusText,
                });
            }
        }).catch(function (err) {
            j({
                code: DEFAULT_ERROR,
                msg: err,
                err: err,
            });
        });
    });
});
//# sourceMappingURL=fetch.js.map