import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-transcation',
  templateUrl: './transcation.component.html',
  styleUrls: ['./transcation.component.css']
})
export class TranscationComponent implements OnInit {

  transactions=[];
  products=[];
  price=0;
  constructor(private as:AdminService) { }

  ngOnInit(): void {
    this.as.getPaymentDetails().subscribe(res=>{
      if(res['message']==="Not data")
      alert("No data");
      else
        this.transactions = res['data'];
      this.transactions.reverse();
      console.log(this.transactions);
    })
  }

  OnClicked1(ind){
      if(window.confirm("Are you sure??"))
      {
        this.transactions[ind]['status']="Delivered";
        this.as.updateTransaction(this.transactions[ind]).subscribe(res=>{
          alert("Updated successfully!!");
        },
        err=>{
          console.log("error");
        }
        )
      }
  }

  OnClicked2(ind){
      if(window.confirm("Are you sure??"))
      {
        this.transactions[ind]['status'] = "Rejected";
         this.as.updateTransaction(this.transactions[ind]).subscribe(res=>{
          alert("Updated successfully!!");
        },
        err=>{
          console.log("error");
        }
        )
      }
  }
  
  OnClicked3(ind){

            this.price=this.transactions[ind]['price']
        
            for(let x in this.transactions[ind]['purchased'])
              this.products.push(this.transactions[ind]['purchased'][x])

      
        
      }
  onClicked4(ind){
    let obj={
      username:this.transactions[ind]['username']
      ,token:this.transactions[ind]['token']
    }
    this.as.sendEmail(obj).subscribe(res=>{
      alert(res['message']);
    },err=>{console.log(err)})
  }
   
}
