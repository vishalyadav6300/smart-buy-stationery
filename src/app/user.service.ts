import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    dataSource=new BehaviorSubject<any>(0)
    dataObservable=this.dataSource.asObservable();

    updateDataObservable(data){
       this.dataSource.next(data)
    }

    userLoginStatus=false;
    //inject http client object
    constructor(private hc:HttpClient) { 
      if(localStorage.getItem('username')!==null){
        this.userLoginStatus=true;
      }
    }
    createUser(userObj):Observable<any>{
      return  this.hc.post("/user/createuser",userObj)
    }

    loginUser(credentials):Observable<any>{
      if(credentials.type==="admin"){
        return  this.hc.post("/admin/login",credentials)
      }
      if(credentials.type==="user"){
        return  this.hc.post("/user/login",credentials)
      }
    
    }

    getUser(username):Observable<any>{
        return this.hc.get(`/user/getuser/${username}`)
    }

  deleteUser(){

  }

  updateUser(){

  }

  deleteProductFromCart(details):Observable<any>{
    return this.hc.delete(`/user/delete-from-cart/${details}`);
  }

  sendProductToUserCart(userProductObj):Observable<any>{
    return this.hc.post("/user/add-to-cart",userProductObj)
  }


  getProductsFromUserCart(username):Observable<any>{
    return this.hc.get(`/user/getproducts/${username}`)
  }

  transactions(details):Observable<any>{
    return this.hc.post('/user/insertBill',details);
  }
  
  sendPurchase(details):Observable<any>{
    return this.hc.post('/product/sendPurchasedItems',details);
  }

}
