"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlReq = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
function partition(str, radix) {
    let index = str.indexOf(radix);
    if (index < 0)
        return [str, ""];
    return [str.substring(0, index), str.substring(index + radix.length)];
}
function urlReq(url, method = "GET", body) {
    return new Promise((resolve, reject) => {
        let [protocol, fullPath] = url.indexOf("://") >= 0 ? partition(url, "://") : ["http", url];
        let [base, path] = partition(fullPath, "/");
        let [host, port] = partition(base, ":");
        let data = JSON.stringify(body);
        let headers;
        if (body !== undefined)
            headers = {
                "Content-Type": "application/json",
                "Content-Length": data.length,
            };
        let sender = protocol === "http" ? http_1.default : https_1.default;
        let req = sender.request({
            host,
            port,
            path: "/" + path,
            method,
            headers,
        }, (resp) => {
            let str = "";
            resp.on("data", (chunk) => (str += chunk));
            resp.on("end", () => resolve(str));
        });
        req.on("error", (e) => reject(e));
        if (data !== undefined)
            req.write(data);
        req.end();
    });
}
exports.urlReq = urlReq;
