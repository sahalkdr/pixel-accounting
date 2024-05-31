

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  httpRequest(options: { method: string, url: string, data?: any, headers?: any, responseType?: any }): Promise<any> {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(options.method, options.url, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (error) {
              resolve(xhr.responseText);
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText
            });
          }
        }
      };

      if (options.headers) {
        for (let key in options.headers) {
          if (options.headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, options.headers[key]);
          }
        }
      }

      if (options.responseType) {
        xhr.responseType = options.responseType;
      }

      if (options.data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(options.data));
      } else {
        xhr.send();
      }
    });
  }
}





