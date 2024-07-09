import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit{
  @Input() marks:boolean[] = [] ;  
  chartOptions = {} ; 

  constructor(){
  }
  ngOnInit(): void {
    let options =  {
      title: {
        text: 'Marks distribution',
      },
      animationEnabled: true,
      data: [
        {
          type: 'column',
          dataPoints: [
            { label: 'Apple', y: 10 },
          ],
        },
      ],
    };

    for(let i = 0 ; i < this.marks.length ; i++){
      if(this.marks[i]){
        options.data[0].dataPoints.push({label:`Q${i + 1}` , y:1}) ;
      }
      else{
        options.data[0].dataPoints.push({label:`Q${i + 1}` , y:0}) ;
      }
    }
    options.data[0].dataPoints.shift() ;
    this.chartOptions = options ;
    console.log(this.chartOptions);
  }
}
