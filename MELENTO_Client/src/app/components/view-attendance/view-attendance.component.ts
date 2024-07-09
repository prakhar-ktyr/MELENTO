import { Component } from '@angular/core';
import { Attendance } from '../../models/attendance';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrl: './view-attendance.component.scss'
})
export class ViewAttendanceComponent {
  arrAttendance:Attendance[] = [] ; 
  constructor(private attendanceService:AttendanceService){
    this.attendanceService.getAttendance().subscribe(data => {
      this.arrAttendance = data ; 
    })
  }
}
