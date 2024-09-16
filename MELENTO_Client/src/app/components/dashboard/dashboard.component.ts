import { Component, OnInit } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { Assessment } from "../../models/assessment";
import { LocalStorageService } from "../../services/local-storage.service";
import { AssessmentService } from "../../services/assessment.service";
import { TraineeService } from "../../services/trainee.service";
import { AssessmentTrainees } from "../../models/assessmentTrainess";
import { Router } from "@angular/router";
import { AssessmentScoreService } from "../../services/assessment-score.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  arrAssessments: Assessment[] = [];
  loggedUserId: string = "";
  loggedUserRole: string = "";
  quantityMap = new Map();
  arrAssessmentTrainees: AssessmentTrainees[] = [];
  marks: number[] = [];
  assessmentIds: string[] = [];
  hasLoaded = false;

  pieChartOptions = {
    animationEnabled: true,
    title: {
      text: "Pass percentage",
    },
    data: [
      {
        type: "pie",
        startAngle: -90,
        indexLabel: "{name}: {y} %",
        yValueFormatString: "#,###.##'%'",
        dataPoints: [
          { y: 14.1, name: "Toys" },
        ],
      },
    ],
  };
  chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Progress across assessments",
    },
    axisX: {
      title: "assessment attempt",
      minimum: 0,
      maximum: 10,
      interval: 1,
    },
    axisY: {
      title: "Scores",
      // gridThickness: 0 // Removes horizontal grid lines
    },
    data: [
      {
        type: "line",
        toolTipContent:
          "<b>assessment attempt :</b> {x} <br/><b> score :</b> {y}",
        indexLabelFontSize: 16,
        dataPoints: [{ x: "0", y: 0 }],
      },
    ],
  };

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private assessmentService: AssessmentService,
    private traineeService: TraineeService,
    private assessmentScoreService: AssessmentScoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.assessmentScoreService.getAssessmentScore().subscribe((data) => {
      let attemptCount = 1;
      let passCount = 0 ; 
      data.forEach((d) => {
        if (String(d.traineeId) === this.loggedUserId) {
          this.chartOptions.data[0].dataPoints.push({
            x: String(attemptCount),
            y: d.score,
          });
          attemptCount += 1;
          if(d.score >= 5) passCount += 1 ; 
        }
      });

      this.chartOptions.data[0].dataPoints.shift();
      let passPercentage = (passCount / attemptCount) * 100 ; 
      let failPercentage = 100 - passPercentage ; 
      this.pieChartOptions.data[0].dataPoints.push({y:passPercentage , name:'Pass'}) ;
      this.pieChartOptions.data[0].dataPoints.push({y:failPercentage , name:'Fail'}) ;
      this.pieChartOptions.data[0].dataPoints.shift() ;
      this.hasLoaded = true;
    });
  }

  ngOnInit(): void {
    this.loggedUserId = this.localStorageService.getItem("loggedUserId") || "0";
    this.loggedUserRole = this.localStorageService.getItem("role") || "Trainee";

    if (this.loggedUserRole === "Admin") {
      this.fetchAssessmentsForAdmin();
    } else if (this.loggedUserRole === "Trainee") {
      this.fetchAssessmentsForTrainee();
    } else {
      this.fetchAssessmentsForOther();
    }
  }

  fetchAssessmentsForAdmin(): void {
    this.assessmentService.getAssessments().subscribe((data) => {
      this.arrAssessments = data;
      this.cdr.detectChanges();
    });
  }

  fetchAssessmentsForTrainee(): void {
    this.traineeService.getAssessmentTrainess().subscribe((data) => {
      this.arrAssessmentTrainees = data;
      this.arrAssessmentTrainees.forEach((asst) => {
        let q = asst.quantity;
        let aid = parseInt(asst.assessmentId);

        if (q > 0 && asst.traineeId === this.loggedUserId) {
          this.assessmentService.getAssessmentById(aid).subscribe((data) => {
            this.arrAssessments.push(data);
            this.quantityMap.set(asst.assessmentId, q);
            this.cdr.detectChanges();
          });
        }
      });
    });
    this.cdr.detectChanges();
  }

  fetchAssessmentsForOther(): void {
    this.assessmentService.getAssessments().subscribe((data) => {
      this.arrAssessments = data.filter(
        (assessment) => String(assessment.facultyId) === this.loggedUserId
      );
      this.cdr.detectChanges();
    });
  }

  displayDetails(aid: number, aName: string, aDescription: string): void {
    this.router.navigate(["viewDetails/" + aid]);
  }

  attemptAssessment(id: number) {
    this.router.navigate(["/attemptAssessment/" + id]);
  }
  onToggleChange(event: any, id: number): void {
    const isChecked = event.checked;
    console.log("Toggle changed for assessment", id, "Status:", isChecked);
    let newAssessment: Assessment;
    this.assessmentService.getAssessmentById(id).subscribe((data) => {
      newAssessment = data;
      newAssessment.isActive = isChecked;
      this.assessmentService
        .updateAssessmentById(id, newAssessment)
        .subscribe((data) => {
          console.log("assessment toggled");
        });
    });
    // window.location.reload();
    // Handle the toggle change event here
  }
}
