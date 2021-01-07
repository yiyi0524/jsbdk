declare namespace Jsbdk {
  type StorageKey = string | number
  const ALL_TIME = -1
  interface LoginReturnJson {
    data: {
      code: number
      session_secret: string
    }
  }
  interface VerifySessionJson {
    data: {
      sessionExist: boolean
    }
  }
  interface RequestParam {
    baseUrl: string
    url: string
    data?: any
    body?: any
    method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "string"
    credentials?: "include"
  }
  interface RequestErr {
    code: number
    msg?: string
  }
  interface JsonRes<T = any> {
    code: number
    data: T
    msg: string
    count: number
  }
  interface userLocationInfo {
    latitude: string
    longitude: string
    speed: string
    accuracy: string
  }
  namespace wx {
    /**
     * 检查更新
     */
    function checkUpgrade(title?: string, content?: string): void
    // function getUserLocation(): Promise<userLocationInfo | wx.GeneralCallbackResult>;
  }
  function trim(str: string): string
  function request<T = any>(
    baseUrl: string,
    url: string,
    body?: any,
    method?: string,
    credentials?: "include" | "omit" | "same-origin",
    headers?: Record<string, string>,
  ): Promise<JsonRes<T>>
  namespace LocalStorage {
    function set(k: StorageKey, v: any, expire: number): void
    function get(k: StorageKey): any
    function has(k: string | number): boolean
    function remove(k: string | number): void
    function clear(): void
  }
}
export = Jsbdk
export as namespace jsbdk
