import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../../models/questions';
import { AssessmentService } from '../../services/assessment.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attendance } from '../../models/attendance';
import { AttendanceService } from '../../services/attendance.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessmentScore';
import { MatStepper } from '@angular/material/stepper';
import { TraineeService } from '../../services/trainee.service';
import { AssessmentTrainees } from '../../models/assessmentTrainess';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportsService } from '../../services/reports.service';
import { Report } from '../../models/report';
import { title } from 'process';

@Component({
  selector: 'app-attempt-assessment',
  templateUrl: './attempt-assessment.component.html',
  styleUrl: './attempt-assessment.component.scss',
})
export class AttemptAssessmentComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  message: string = 'Congratulations you have passed !';
  hasFinished: boolean = false;
  hasStarted: boolean = false;
  assessmentId: number = 0;
  arrQuestions: Question[] = [];
  questionForm!: FormArray;
  finalScore: number = -1;
  startTime: Date = new Date();
  loggedUserId: string = '';
  assessmentDuration: number = 0;
  marks: boolean[] = [];
  chartOptions = {
    title: {
      text: 'Marks distribution',
    },
    animationEnabled: true,
    axisY: {
      title: 'Scores',
      gridThickness: 0 // Removes horizontal grid lines
    },
    axisX: {
      title: 'Questions',
    },
    data: [
      {
        type: 'column',
        dataPoints: [{ label: 'Apple', y: 10 }],
      },
    ],
  };

  constructor(
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private assessmentService: AssessmentService,
    private attendanceService: AttendanceService,
    private assessmentScoreService: AssessmentScoreService,
    private traineeService: TraineeService,
    private reportService: ReportsService
  ) {
    this.loggedUserId = this.localStorageService.getItem('loggedUserId') || '0';

    this.activatedRoute.params.subscribe((params) => {
      this.assessmentId = params['id'];
    });
    this.assessmentService
      .getAssessmentById(this.assessmentId)
      .subscribe((data) => {
        this.arrQuestions = data.questions;
        this.assessmentDuration = Number(data.time);
        // console.log(data.questions) ;
        console.log(this.arrQuestions);
        this.questionForm = this.fb.array(
          this.arrQuestions.map(() =>
            this.fb.group({
              answer: ['', Validators.required],
            })
          )
        );
      });
  }
  ngOnInit(): void {}

  submitAnswers(): void {
    this.hasFinished = true;
    const answers = this.questionForm.value;
    console.log('Submitted answers:', answers);
    this.finalScore = this.getScore(answers);
    // if score less than 50% , then fail
    if (2 * this.finalScore < this.arrQuestions.length) {
      this.message = 'Sorry you have failed , better try next time !';
    }
    this.assessmentScoreService.getAssessmentScore().subscribe((data) => {
      let totalAssessmentScore = data.length;
      let as = new AssessmentScore(
        String(totalAssessmentScore + 1),
        this.assessmentId,
        parseInt(this.loggedUserId),
        this.finalScore
      );
      this.assessmentScoreService.postAssessmentScore(as).subscribe((data) => {
        console.log('Added assessment score');
      });
    });

    this.traineeService.getAssessmentTrainess().subscribe((data) => {
      let updateId = -1;
      let newAssessmentTrainee = new AssessmentTrainees('0', '0', '0', 0);
      data.forEach((ass) => {
        if (
          ass.assessmentId === String(this.assessmentId) &&
          ass.traineeId === this.loggedUserId
        ) {
          // let q = parseInt(ass.quantity);
          // ass.quantity = String(Math.max(q - 1, 0));
          ass.quantity -= 1 ; 
          updateId = Number(ass.id);
          newAssessmentTrainee = ass;
        }
      });
      // Add report
      let rid = 0 ;
      // this.reportService.getReportsCount() + 1;
      this.reportService.getReports().subscribe(data => {
        rid = data.length + 1 ; 
        let r = new Report(
          rid,
          String(this.assessmentId),
          this.loggedUserId,
          this.marks,
          `${this.finalScore}/${this.arrQuestions.length}`,
          new Date().toISOString().split('T')[0] 
        );
        this.reportService.addReport(r).subscribe((data) => {
          console.log('added report');
        });
        this.traineeService
          .updateAssessmentTraineeById(updateId, newAssessmentTrainee)
          .subscribe((data) => {
            console.log('Assessment quantity reduced');
          });
      })
    
    });
  }

  getScore(answers: any) {
    console.log(answers);
    let score: number = 0;
    for (let i = 0; i < this.arrQuestions.length; i++) {
      let ans = answers[i].answer;
      if (this.arrQuestions[i].type === 'true-false') {
        if (this.arrQuestions[i].correctAnswer === ans.toString()) {
          score += 1;
          this.chartOptions.data[0].dataPoints.push({
            label: `Q${i + 1}`,
            y: 1,
          });
          this.marks.push(true);
        } else {
          this.chartOptions.data[0].dataPoints.push({
            label: `Q${i + 1}`,
            y: 0,
          });
          this.marks.push(false);
        }
      } else {
        if (this.arrQuestions[i].correctAnswer === ans) {
          score += 1;
          this.chartOptions.data[0].dataPoints.push({
            label: `Q${i + 1}`,
            y: 1,
          });
          this.marks.push(true);
        } else {
          this.chartOptions.data[0].dataPoints.push({
            label: `Q${i + 1}`,
            y: 0,
          });
          this.marks.push(false);
        }
      }
    }
    this.chartOptions.data[0].dataPoints.shift();
    return score;
  }
  getFormGroup(index: number): FormGroup {
    return this.questionForm.at(index) as FormGroup;
  }

  startAssessment() {
    this.hasStarted = true;
    this.startTime = new Date();
    this.attendanceService.getAttendance().subscribe((data) => {
      let totalAttendance = data.length;
      console.log(totalAttendance);
      let newAttendance = new Attendance(
        String(totalAttendance + 1),
        this.loggedUserId,
        new Date(),
        'success'
      );
      this.attendanceService.addAttendance(newAttendance).subscribe((data) => {
        console.log('attendance added');
      });
    });
  }

  onTimeUp(): void {
    // Move to the last step and submit the form
    this.stepper.selectedIndex = this.stepper.steps.length - 1;
    if (!this.hasFinished) this.submitAnswers();
  }

  generateReport() {
    const data = document.getElementById('pdfContent');
    if (data) {
      html2canvas(data).then((canvas) => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Add whitespace at the top
        const position = 30; // 30 mm from the top

        // Add custom font size for content
        pdf.setFontSize(25);

        // Add an optional title or header
        pdf.text('Assessment Report', 10, 10); // (text, x, y)

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('assessment-report.pdf');
      });
    }
  }
}
