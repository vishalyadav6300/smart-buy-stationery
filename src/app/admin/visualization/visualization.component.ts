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
    quantitytop6=[];
    quantitybottom6=[];
  quantitylabeltop6 = [];
  quantitylabelbottom6=[];

    
  constructor(private as:AdminService) { }

  async ngOnInit(): Promise<void> {
  
    this.as.getRecommendedData().subscribe(res => {
        if (res['message'] == 'successful') {
          this.amountData = res['amount']
          this.quantityData = res['quantity']
          //this.data=this.amountData
          //console.log(this.amountData[0]['quantity'])
          for (let x = 0; x < Math.min(this.amountData.length, 6);x++) {
            this.quantitylabeltop6.push( this.amountData[x]['productname'])
            this.quantitytop6.push(this.amountData[x]['quantity'])
            this.quantitylabelbottom6.push(this.amountData[this.amountData.length-1-x]['productname'])
            this.quantitybottom6.push(this.amountData[this.amountData.length-1-x]['quantity'])
            
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
                data: [],
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
                      text: 'quantity'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'products'
                    }
                  }
            }
      }
        
    });
    console.log(this.quantitylabeltop6)

     await asyncFunction(myChart,this.quantitylabeltop6,this.quantitytop6)

      this.piechartbottom6()

  }
    async piechartbottom6() {

        Chart.register(...registerables);
  
        let myChart = new Chart("myChartbottom6", {
            type: 'pie',
            data: {
              
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
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
                          text: 'quantity'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'products'
                        }
                      }
                }
          }
            
        });
        //console.log(this.quantitylabeltop6)
    
         await asyncFunction(myChart,this.quantitylabelbottom6,this.quantitybottom6)


            }
  

}

async function asyncFunction(my,la,va){
  const list=[]
 setTimeout(function(){
   for (const x in la) {
    my.data.labels.push(la[x])
    my.data.datasets[0].data.push(va[x])


   }
   my.update()
 }, 1000); // 2 seconds timeout


}

