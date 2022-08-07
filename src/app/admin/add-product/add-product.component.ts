import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  //inject UserService object
  constructor(private adminService:AdminService) { }

  ngOnInit(): void {
    
  }

  file:File;

  selectFile(event){
     this.file= event.target.files[0]
    
  }
  onAddProduct(prodObj){
    console.log("prod obj",prodObj)
    let formData=new FormData();
    //add file
    formData.append("photo",this.file,this.file.name)
    //add userObj
    formData.append("prodObj",JSON.stringify(prodObj))
    this.adminService.addNewProduct(formData).subscribe(
      res=>{
          if(res.message=='New product added'){
            alert("New product added")
          }
          else{
            alert(res.message)
          }
      },
      err=>{
        console.log("err in adding rpoduct",err)
        alert("Something went wrong in adding product")
      }
    )   
  }

}
