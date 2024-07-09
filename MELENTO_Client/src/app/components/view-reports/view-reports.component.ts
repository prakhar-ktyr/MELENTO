import { Component, OnInit } from '@angular/core';
import { Report } from '../../models/report';
import { ReportsService } from '../../services/reports.service';
declare var bootstrap: any;

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss']
})
export class ViewReportsComponent implements OnInit {
  arrReports: Report[] = [];
  selectedReport: Report | null = null;

  constructor(private reportService: ReportsService) { }

  ngOnInit(): void {
    this.reportService.getReports().subscribe(data => {
      this.arrReports = data;
    });
  }

  openModal(report: Report) {
    this.selectedReport = report;
    const modalElement = document.getElementById('barChartModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
