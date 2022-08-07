import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  userObj;

  count;
  constructor(private hc:HttpClient,private us:UserService) { }

  ngOnInit(): void {
    //get user data from local storage
    this.userObj= JSON.parse(localStorage.getItem("userObj"))
    //get userCartObj from API
    this.us.getProductsFromUserCart(this.userObj.username).subscribe(
      res=>{
        if(res.message==='Cart-empty'){
          this.us.updateDataObservable(0)
        }
        else{
          this.us.updateDataObservable(res.message)
        }
        this.us.dataObservable.subscribe(prodObj=>{
           if(prodObj==0){
              this.count=0;
           }
           else{
             this.count=prodObj.products.length;
           }
        })
      }
    )


  }


  

}
