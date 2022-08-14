import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private hc:HttpClient) { }

  //to ad new product
  addNewProduct(newProduct):Observable<any>{
    console.log("new product",newProduct)
    return  this.hc.post("/product/add-product",newProduct)
    
  }

  //to read all products
  getProducts():Observable<any>{
      return this.hc.get('/product/getproducts');
  }

  getPaymentDetails():Observable<any>{
       return this.hc.get('/admin/transactiondetails');
  }

  updateTransaction(obj):Observable<any>{
    return this.hc.put('/admin/updateTrans',obj);
  }

  deleteProduct(product):Observable<any>{
    // console.log(product)
    return this.hc.delete(`/admin/delete-product/${product}`);
  }
  getStatusCount():Observable<any>{
       return this.hc.get('/admin/getStatusCount');
  }
  getProductUsers():Observable<any>{
       return this.hc.get('/admin/getProductUsers');
  }



  getRecommendedData(): Observable<any> {
    return this.hc.get('/product/recommendItems');
  }

  getPurchasedItems(): Observable<any> {
    return this.hc.get('/product/getPurchasedItems');
  }
}
