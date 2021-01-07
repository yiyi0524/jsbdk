/*
 * Author: buff <admin@buffge.com>
 * Created on : 2018-11-25, 13:58:18
 * QQ:1515888956
 */
"use strict";

import buffFetch, { Param as buffFetchParam } from './fetch';
import buffLocalStorage from './LocalStorage';

export function trim(str: string) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function isWxClient() {
    return /MicroMessenger/i.test(window.navigator.userAgent);
}
export async function request(baseUrl: string, url: string, body = {}, method = "POST",
    credentials: "include" | "omit" | "same-origin" = "include", headers: Record<string, string> = {}) {
    let param: buffFetchParam = {
        method,
        url: baseUrl + "/" + url,
        credentials,
        headers,
    }
    if (body! instanceof FormData) {
        param.body = body
    } else {
        if (param.headers) {
            param.headers = {
                ...headers,
            };
            param.headers['content-type'] = "application/json";
        }
        if (method !== 'GET' && method !== 'HEAD') {
            param.body = JSON.stringify(body);
        }
    }
    return buffFetch(param)
}
export const LocalStorage = buffLocalStorage;
