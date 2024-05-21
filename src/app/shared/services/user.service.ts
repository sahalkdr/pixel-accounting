import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiSerice: ApiService) { }

  public userDetils: {username: string, password: string, token: string} = {username: "", password: "", token:""};

  async login(username:string, password: string){
    let payload = {
      "page": "1",
      "itemsPerPage":10
  }
   let loginResponse = await this.apiSerice.httpRequest({method:"POST", url:"https://artroots.uk/dev/api/getcategories.php", data:JSON.stringify(payload)})
    return loginResponse;
  }

  
}
