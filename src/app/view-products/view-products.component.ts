import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  products=[];
  currentUser;
  constructor(private adminService:AdminService,private userService:UserService) { }

  ngOnInit(): void {
    this.currentUser=localStorage.getItem("username")
    this.adminService.getProducts().subscribe(
      res=>{
        this.products=res.message;
      },
      err=>{
        console.log("err in reading products ",err)
        console.log("Something went wrong in reading products")
      }
    )
  }



  //product selected by user
  onProductSelect(productObject){
   
    let username=localStorage.getItem("username")

    let newUserProductObj={username,productObject}

   this.userService.sendProductToUserCart(newUserProductObj).subscribe(
     res=>{
       alert(res['message'])
       this.userService.updateDataObservable(res.latestCartObj)
     },
     err=>{
       console.log("err in posting product to cart ",err)
       alert("Something wrong in adding product to cart...")
     }
   )

  }

}
