import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-usercart',
  templateUrl: './usercart.component.html',
  styleUrls: ['./usercart.component.css']
})
export class UsercartComponent implements OnInit {

  userCartObj;
  products=[];
  value=0;
  count=[];

  constructor(private userService:UserService,private rc:Router) { }

  ngOnInit(): void {
    
    this.userService.dataObservable.subscribe(
      res=>{
        if(res["message"]==='Cart-empty'){
          alert("User cart is empty")
        }
        else{
            this.products=res["products"]   
            for(let i=0;i<this.products.length;i++){
              this.count.push(1);
              
            }
        }
      },
      err=>{
        console.log("err in reading cart",err)
        alert("Something went wrong in fetching cart items..")
      }
    )
  }

  

  OnClicked(ind){

    let username=localStorage.getItem("username");
    let details=username+'-'+ind;
    this.userService.deleteProductFromCart(details).subscribe(res=>{
      if(res["message"]==='Cart-empty'){
        alert("User cart is empty")
      }
      else{
        this.products=res["data"]  
        alert(res["message"])
        this.userService.updateDataObservable(res["data"])     
      }
    },err=>{
      console.log(err);
    });
  }
  getTotal() {
    for(let i=0;i<this.products.length;i++){
      this.products["quantity"]=this.count[i];
    }
    this.value=0
    for (let x in this.products) {
      this.value += (this.products[x]["price"]*this.count[x]);
    }
    
  }

  sendToTransaction(){
    let username=localStorage.getItem("username");
    let v={username:username,price:this.value,status:"on progress",purchased:this.products};
    this.userService.transactions(v).subscribe(res=>{
      if(res["message"]=="sent")
      {
        let token=document.getElementById("token")
        token.style.visibility="visible"
        token.innerText="Token : "+res["token"]
      }
      
      else
      alert("Error");
    })   
    
    // this.sendToPurchase()

  }

  sendToPurchase(){
    for(let i=0;i<this.products.length;i++){
      this.products[i]["quantity"]=this.count[i];
    }
    this.userService.sendPurchase(this.products).subscribe(res=>{
      alert(res["message"])
    })
    this.sendToTransaction()
  }
  
  
  increment(ind) {
    this.count[ind]++;

 }
 decrement(ind) {
    this.count[ind]--;
 }

}
