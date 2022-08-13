import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  amountData = [];
  quantityData = [];
  data = [];
  constructor(private as:AdminService) { 

  }

  ngOnInit(): void {
    this.as.getRecommendedData().subscribe(res => {
      if (res['message'] == 'successful') {
        this.amountData = res['amount']
        this.quantityData = res['quantity']
        this.data=this.amountData
        console.log(this.amountData)
      }
    },error => {
      console.log(error);
    }
    )
  }
  getAmountData() {
    this.data=this.amountData
  }
  getQuantityData() {
    this.data=this.quantityData
  }

}
