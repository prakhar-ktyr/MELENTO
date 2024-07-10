import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Assessment } from '../../models/assessment';
import { LocalStorageService } from '../../services/local-storage.service';
import { AssessmentService } from '../../services/assessment.service';
import { TraineeService } from '../../services/trainee.service';
import { AssessmentTrainees } from '../../models/assessmentTrainess';
import { Router } from '@angular/router';
import { AssessmentScoreService } from '../../services/assessment-score.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  arrAssessments: Assessment[] = [];
  loggedUserId: string = "";
  loggedUserRole: string = "";
  quantityMap = new Map();
  arrAssessmentTrainees: AssessmentTrainees[] = [];
  marks :number [] = [] ; 
  assessmentIds:string[] = [] ; 
  chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Progress across assessments"
    },
    axisX: {
      title:"assessment id" ,
      minimum: 0,
      maximum: 20,
      interval: 1
    },
    axisY: {
      title: "Scores",
      // gridThickness: 0 // Removes horizontal grid lines
  },
    data: [{        
      type: "scatter",
      toolTipContent: "<b>assessment id :</b> {x} <br/><b> score :</b> {y}",
          indexLabelFontSize: 16,
      dataPoints: [
        {x:"0",y:0}

      ]
    }]
  } ;


  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private assessmentService: AssessmentService,
    private traineeService: TraineeService,
    private assessmentScoreService:AssessmentScoreService,
    private cdr: ChangeDetectorRef
  ) {

    this.assessmentScoreService.getAssessmentScore().subscribe(data =>{
      data.forEach(d => {
        if(String(d.traineeId) === this.loggedUserId){
          this.marks.push(d.score) ; 
          this.assessmentIds.push(String(d.assessmentId)); 
        }
      })

      for(let i = 0 ; i < this.marks.length ; i++){
        this.chartOptions.data[0].dataPoints.push({x : this.assessmentIds[i] , y : this.marks[i]}) ; 
      }
      this.chartOptions.data[0].dataPoints.shift() ; 
    })
  }

  ngOnInit(): void {
    this.loggedUserId = this.localStorageService.getItem("loggedUserId") || "0";
    this.loggedUserRole = this.localStorageService.getItem("role") || "trainee";

    if (this.loggedUserRole === 'Admin') {
      this.fetchAssessmentsForAdmin();
    } else if (this.loggedUserRole === 'Trainee') {
      this.fetchAssessmentsForTrainee();
    } else {
      this.fetchAssessmentsForOther();
    }
    
    
  }

  fetchAssessmentsForAdmin(): void {
    this.assessmentService.getAssessments().subscribe(data => {
      this.arrAssessments = data;
      this.cdr.detectChanges();
    });
  }

  fetchAssessmentsForTrainee(): void {
    this.traineeService.getAssessmentTrainess().subscribe(data => {
      this.arrAssessmentTrainees = data;
      this.arrAssessmentTrainees.forEach((asst) => {
        let q = asst.quantity ; 
        let aid = parseInt(asst.assessmentId ); 
        
        if(q > 0 && asst.traineeId === this.loggedUserId){
          let a : Assessment ; 
          this.assessmentService.getAssessmentById(aid).subscribe((data) => {
            this.arrAssessments.push(data) ; 
            this.quantityMap.set(asst.assessmentId , q) ;
            this.cdr.detectChanges();
          })
        }
      })
    });

    this.assessmentScoreService.getAssessmentScore().subscribe(data =>{
      data.forEach(d => {
        if(String(d.traineeId) === this.loggedUserId){
          this.marks.push(d.score) ; 
          this.assessmentIds.push(String(d.assessmentId)); 
        }
      })

      for(let i = 0 ; i < this.marks.length ; i++){
        this.chartOptions.data[0].dataPoints.push({x : this.assessmentIds[i] , y : this.marks[i]}) ; 
      }
      this.chartOptions.data[0].dataPoints.shift() ; 
    })
    this.cdr.detectChanges();
  }

  fetchAssessmentsForOther(): void {
    this.assessmentService.getAssessments().subscribe(data => {
      this.arrAssessments = data.filter(assessment => String(assessment.facultyId) === this.loggedUserId);
      this.cdr.detectChanges();
    });
  }

  displayDetails(aid: number, aName: string, aDescription: string): void {
    this.router.navigate(["viewDetails/" + aid]);
  }

  attemptAssessment(id:number){
    this.router.navigate(['/attemptAssessment/' + id])
  }
  onToggleChange(event: any, id: number): void {
    const isChecked = event.checked;
    console.log('Toggle changed for assessment', id, 'Status:', isChecked);
    let newAssessment:Assessment ; 
    this.assessmentService.getAssessmentById(id).subscribe(data => {
      newAssessment = data ; 
      newAssessment.isActive = isChecked ;
      this.assessmentService.updateAssessmentById(id , newAssessment).subscribe(data => {
        console.log("assessment toggled")
      })
    })
    window.location.reload()
    // Handle the toggle change event here
  }
}
