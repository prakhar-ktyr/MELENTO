// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-update-reports',
//   templateUrl: './update-reports.component.html',
//   styleUrl: './update-reports.component.scss'
// })
// export class UpdateReportsComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Report } from '../../models/report';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-update-reports',
  templateUrl: './update-reports.component.html',
  styleUrls: ['./update-reports.component.scss']
})
export class UpdateReportsComponent implements OnInit {
  updateForm: FormGroup;
  reports: Report[] = []; // This should be fetched from your service
  selectedReport: Report = new Report(0 , "0" , "0" , [] , "0", "");

  constructor(private fb: FormBuilder , private reportService : ReportsService) {
    // Initialize the form
    this.updateForm = this.fb.group({
      id: ['', Validators.required],
      assessmentId: ['', Validators.required],
      userId: ['', Validators.required],
      marks: ['', Validators.required],
      score: ['', Validators.required]
    });

    this.reportService.getReports().subscribe(data => {
      this.reports = data ; 
      console.log(this.reports) ; 
    })
  }

  ngOnInit(): void {
    // Fetch reports from your service and assign to this.reports
  }

  onSelectReport(evt:any): void {
    let id = evt.target.value ; 
    this.selectedReport ; 
    for(let i = 0 ; i < this.reports.length ; i++){
      if(this.reports[i].id === id){
        this.selectedReport = this.reports[i] ;
      }
    }
    if (this.selectedReport) {
      this.updateForm.patchValue({
        assessmentId: this.selectedReport.assessmentId,
        userId: this.selectedReport.userId,
        marks: this.selectedReport.marks.join(', '), // Convert to a string
        score: this.selectedReport.score
      });
    }
  }

  onUpdate(): void {
    if (this.updateForm.valid) {
      const updatedReport = {
        id: this.updateForm.value.id,
        assessmentId: this.updateForm.value.assessmentId,
        userId: this.updateForm.value.userId,
        marks: this.updateForm.value.marks.split(',').map((mark: string) => mark.trim() === 'true'), // Convert back to boolean array
        score: this.updateForm.value.score
      };
      console.log('Updated Report:', updatedReport);
      // Handle update logic here (e.g., send the updated report to the server)
    }
  }
}

