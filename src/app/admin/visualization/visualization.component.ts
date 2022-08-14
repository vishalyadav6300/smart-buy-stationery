import { Component, OnInit } from '@angular/core';


import { Chart, registerables } from 'chart.js';
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})


export class VisualizationComponent implements OnInit {
    amountData = [];
    quantityData = [];
    data = [];
  labelsData = [];
    
  constructor(private as:AdminService) { }

  async ngOnInit(): Promise<void> {
  
    this.as.getRecommendedData().subscribe(res => {
        if (res['message'] == 'successful') {
          this.amountData = res['amount']
          this.quantityData = res['quantity']
          //this.data=this.amountData
          //console.log(this.amountData[0]['quantity'])
          for (let x = 0; x < Math.min(this.amountData.length, 6);x++) {
            this.labelsData.push( this.amountData[x]['productname'])
          }
          
        }
      },error => {
        console.log(error);
      }
      )
    


this.as.getPurchasedItems().subscribe(res=>{
    if(res["message"]=='successful')
    {
        this.data=res['items']
        //console.log(this.data);
    }
},
error=>{
    console.log(error);
}

)
    Chart.register(...registerables);
  
    let myChart = new Chart("myChart", {
        type: 'pie',
        data: {
          
            labels: [],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                      display: true,
                      text: 'amount'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'price'
                    }
                  }
            }
      }
        
    });
    console.log(this.labelsData)

     await asyncFunction(myChart,this.labelsData)

  }
  

}

async function asyncFunction(my,la){
  const list=[]
 setTimeout(function(){
   for (const x in la) {
    my.data.labels.push(la[x])
   }
   my.update()
 }, 1000); // 2 seconds timeout
}

