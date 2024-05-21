import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  httpRequest(options: { method: string, url: string, data?: any, headers?: any, responseType?: any }): Promise<any> {
  // debugger
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let url = options.url;
    //xhr.withCredentials = true;


    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4) {
        if (xhr.status == 200) resolve(xhr.response);
        else
          reject(xhr);
        //resove(this.convertToIOptions(JSON.parse(xhr.response), municipality))
      }
      // else
      //   return reject(xhr);
    });



    xhr.open(options.method, url);
    //xhr.open("POST", url);
    //xhr.setRequestHeader('Authorization', 'Basic ZGVtbzpkZW1v');
    //options.contentType = options.contentType || "application/json";
    // if (options.contentType)
    //   xhr.setRequestHeader("Content-Type", options.contentType);


    if (options.headers) {
      let keys = Object.keys(options.headers);
      if (keys && keys.length)
        keys.map(key => {
          xhr.setRequestHeader(key, options.headers[key]);

        })

      if (options.responseType) {
        xhr.responseType = options.responseType

      }
    }

    // console.log("utils")
    // console.log(options.data)

    if (options.data) xhr.send(options.data);

    else
      xhr.send();
  })
}
}
