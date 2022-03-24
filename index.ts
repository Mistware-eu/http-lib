import http from "http";
import https from "https";
import { OutgoingHttpHeaders } from "http2";

function partition(str: string, radix: string) {
  let index = str.indexOf(radix);
  if (index < 0) return [str, ""];
  return [str.substring(0, index), str.substring(index + radix.length)];
}

export function urlReq(
  url: string,
  method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT" = "GET",
  body?: any
) {
  return new Promise<string>((resolve, reject) => {
    let [protocol, fullPath] =
      url.indexOf("://") >= 0 ? partition(url, "://") : ["http", url];
    let [base, path] = partition(fullPath, "/");
    let [host, port] = partition(base, ":");
    let data = JSON.stringify(body);
    let headers: OutgoingHttpHeaders | undefined;
    if (body !== undefined)
      headers = {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      };
    let sender = protocol === "http" ? http : https;
    let req = sender.request(
      {
        host,
        port,
        path: "/" + path,
        method,
        headers,
      },
      (resp) => {
        let str = "";
        resp.on("data", (chunk) => (str += chunk));
        resp.on("end", () => resolve(str));
      }
    );
    req.on("error", (e) => reject(e));
    if (data !== undefined) req.write(data);
    req.end();
  });
}
