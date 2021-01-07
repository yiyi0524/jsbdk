const localStorage = window.localStorage;
const ALL_TIME = -1;
type StorageKey = string | number;

export default {
  set: function (k: StorageKey, v: any, expire: number = ALL_TIME): void {
    const data = {
      val: v,
      expire,
    }
    if (data.expire !== ALL_TIME) {
      data.expire = new Date().getTime() + data.expire * 1000
    }
    if (typeof k === "number") {
      k = k.toString()
    }
    localStorage.setItem(k, JSON.stringify(data));
  },
  get: function (k: StorageKey) {
    let data, realData, now = new Date();
    try {
      if (typeof k === "number") {
        k = k.toString()
      }
      let res = localStorage.getItem(k)
      if (res === null) {
        return null
      } else {
        data = JSON.parse(res);
      }
    } catch (e) {
      return null
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
  has: function (k: string | number): boolean {
    return this.get(k) !== null;
  },
  remove: function (k: string | number) {
    if (typeof k === "number") {
      k = k.toString()
    }
    return localStorage.removeItem(k);
  },
  clear: function () {
    return localStorage.clear();
  },
}
