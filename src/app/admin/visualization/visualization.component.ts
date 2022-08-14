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
  priceData = [];
    data = [];
    quantitytop6=[];
    quantitybottom6=[];
    quantitylabeltop6 = [];
  quantitylabelbottom6 = [];
  amounttop6=[];
    amountbottom6=[];
    amountlabeltop6 = [];
  amountlabelbottom6 = [];
  pricetop6=[];
    pricebottom6=[];
    pricelabeltop6 = [];
  pricelabelbottom6 = [];
  

    
  constructor(private as:AdminService) { }

  async ngOnInit(): Promise<void> {
  
    this.as.getRecommendedData().subscribe(res => {
        if (res['message'] == 'successful') {
          this.amountData = res['amount']
          this.quantityData = res['quantity']
          this.priceData=res['price']

          for (let x = 0; x < Math.min(this.quantityData.length, 6);x++) {
            this.quantitylabeltop6.push( this.quantityData[x]['productname'])
            this.quantitytop6.push(this.quantityData[x]['quantity'])
            this.quantitylabelbottom6.push(this.quantityData[this.quantityData.length-1-x]['productname'])
            this.quantitybottom6.push(this.quantityData[this.quantityData.length-1-x]['quantity'])
            
          }
          for (let x = 0; x < Math.min(this.amountData.length, 6);x++) {
            this.amountlabeltop6.push( this.amountData[x]['productname'])
            this.amounttop6.push(this.amountData[x]['totalAmount'])
            this.amountlabelbottom6.push(this.amountData[this.amountData.length-1-x]['productname'])
            this.amountbottom6.push(this.amountData[this.amountData.length-1-x]['totalAmount'])
            
          }
          for (let x = 0; x < Math.min(this.priceData.length, 6);x++) {
            this.pricelabeltop6.push( this.priceData[x]['productname'])
            this.pricetop6.push(this.priceData[x]['price'])
            this.pricelabelbottom6.push(this.priceData[this.priceData.length-1-x]['productname'])
            this.pricebottom6.push(this.priceData[this.priceData.length-1-x]['price'])
            
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

     await asyncFunction(myChart,this.quantitylabeltop6,this.quantitytop6)

    this.piechartbottom6()
    this.barcharTop()
    this.barcharBottom()
    this.linecharTop()
    this.linecharBottom()

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
  
  async barcharTop() {

     Chart.register(...registerables);
  
        let myChart = new Chart("barChartTop", {
            type: 'bar',
            data: {
              
                labels: [],
                datasets: [{
                    label: 'Bar Chart Showing Top 6 Total Sold Prices of Items',
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
                          text: 'Total Sold Price'
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
    
         await asyncFunction(myChart,this.amountlabeltop6,this.amounttop6)

  }
  async barcharBottom() {

     Chart.register(...registerables);
  
        let myChart = new Chart("barChartBottom", {
            type: 'bar',
            data: {
              
                labels: [],
                datasets: [{
                    label: 'Bar Chart Showing Least 6 Total Sold Prices of Items',
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
                          text: 'Total Sold Price'
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
    
         await asyncFunction(myChart,this.amountlabelbottom6,this.amountbottom6)

  }
  async linecharTop() {

     Chart.register(...registerables);
  
        let myChart = new Chart("lineChartTop", {
            type: 'line',
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
                          text: 'Total Sold Price'
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
    
         await asyncFunction(myChart,this.pricelabeltop6,this.pricetop6)

  }
  async linecharBottom() {

     Chart.register(...registerables);
  
        let myChart = new Chart("lineChartBottom", {
            type: 'line',
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
                          text: 'Total Sold Price'
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
    
         await asyncFunction(myChart,this.pricelabelbottom6,this.pricebottom6)

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

