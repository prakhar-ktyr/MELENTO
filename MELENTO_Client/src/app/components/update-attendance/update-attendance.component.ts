import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Attendance } from '../../models/attendance';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-update-attendance',
  templateUrl: './update-attendance.component.html',
  styleUrls: ['./update-attendance.component.scss']
})
export class UpdateAttendanceComponent implements OnInit {
  arrAttendance: Attendance[] = [];
  selectedId: number = 0;
  updateForm: FormGroup;
  selectedAttendance!: Attendance;
  maxDate: string = new Date().toISOString().split('.')[0]; // Get current date and time

  constructor(private fb: FormBuilder, private attendanceService: AttendanceService) {
    this.updateForm = this.fb.group({
      userId: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator]],
      status: ['', Validators.required]
    });

    this.selectedAttendance = new Attendance("0", "0", new Date(), "success");
  }

  ngOnInit(): void {
    this.attendanceService.getAttendance().subscribe(data => {
      this.arrAttendance = data;
    });
  }

  onSelectChange(event: any): void {
    const selectedId = event.target.value;
    this.selectedId = selectedId;
    this.attendanceService.getAttendanceById(selectedId).subscribe(data => {
      this.selectedAttendance = data;

      if (this.selectedAttendance) {
        this.updateForm.patchValue({
          userId: String(this.selectedAttendance.userId),
          date: this.selectedAttendance.date, // Format date for datetime-local input
          status: this.selectedAttendance.status
        });
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const obj = this.updateForm.value;
      const newAtt: Attendance = new Attendance(String(this.selectedId), obj.userId, new Date(obj.date), obj.status);
      this.attendanceService.updateAttendance(this.selectedId, newAtt).subscribe(data => {
        console.log("Attendance updated");
      });
    }
  }

  dateValidator(control: any) {
    const currentDate = new Date().toISOString().split('.')[0];
    return control.value > currentDate ? { invalidDate: true } : null;
  }
}
