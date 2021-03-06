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

  constructor(private userService:UserService,private rc:Router) { }

  ngOnInit(): void {
   
    this.userService.dataObservable.subscribe(
      res=>{
        if(res["message"]==='Cart-empty'){
          alert("User cart is empty")
        }
        else{
            this.products=res["products"]          
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
    //console.log(this.products[ind]);
    let details=username+'-'+ind;
    this.userService.deleteProductFromCart(details).subscribe(res=>{
      if(res["message"]==='Cart-empty'){
        alert("User cart is empty")
      }
      else{
        this.products=res["data"]  
        alert(res["message"])
        this.userService.updateDataObservable(res["data"])

          // alert("Product deleted")        
      }
    },err=>{
      console.log(err);
    });
  }
  getTotal(){
    for(let x in this.products){
      this.value+=this.products[x]["price"];
    }
  }
  sendOTP(){
    let username=localStorage.getItem("username");
    let v={username:username,price:this.value};
    this.userService.generateOTP(v).subscribe(res=>{
      if(res["message"]=="sent")
      alert("Successfully sent your OTP");
      
      else
      alert("Error");
    })    
  }

}
