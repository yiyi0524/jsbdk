var localStorage = window.localStorage;
var ALL_TIME = -1;
export default {
    set: function (k, v, expire) {
        if (expire === void 0) { expire = ALL_TIME; }
        var data = {
            val: v,
            expire: expire,
        };
        if (data.expire !== ALL_TIME) {
            data.expire = new Date().getTime() + data.expire * 1000;
        }
        if (typeof k === "number") {
            k = k.toString();
        }
        localStorage.setItem(k, JSON.stringify(data));
    },
    get: function (k) {
        var data, realData, now = new Date();
        try {
            if (typeof k === "number") {
                k = k.toString();
            }
            var res = localStorage.getItem(k);
            if (res === null) {
                return null;
            }
            else {
                data = JSON.parse(res);
            }
        }
        catch (e) {
            return null;
        }
        if (data === null) {
            return null;
        }
        realData = data.val;
        if (data.expire !== ALL_TIME && now > new Date(data.expire)) {
            this.remove(k);
            return null;
        }
        return realData;
    },
    has: function (k) {
        return this.get(k) !== null;
    },
    remove: function (k) {
        if (typeof k === "number") {
            k = k.toString();
        }
        return localStorage.removeItem(k);
    },
    clear: function () {
        return localStorage.clear();
    },
};
//# sourceMappingURL=LocalStorage.js.map