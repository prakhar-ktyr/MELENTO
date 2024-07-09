import { Component } from '@angular/core';
import { ExcelExportService } from '../../services/excel-export.service';
import { ReportsService } from '../../services/reports.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Report } from '../../models/report';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  assessmentScores: Report[] = [];
  loggedUserId: string;

  constructor(
    private excelExportService: ExcelExportService,
    private reportsService: ReportsService,
    private localStorageService: LocalStorageService
  ) {
    this.loggedUserId = this.localStorageService.getItem('loggedUserId') || '0';
    this.loadReports();
  }

  loadReports(): void {
    this.reportsService.getReports().subscribe((data: Report[]) => {
      this.assessmentScores = data;
    });
  }

  generateReport(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredScores = this.assessmentScores.filter(score => {
      const scoreDate = new Date(score.date);
      return scoreDate >= start && scoreDate <= end && score.userId === this.loggedUserId;
    });

    const reportData = filteredScores.map(score => {
      return {
        AssessmentId: score.assessmentId,
        TraineeId: score.userId,
        Score: score.score,
        Date: score.date
      };
    });

    this.excelExportService.exportAsExcelFile(reportData, 'TraineePerformanceReport');
  }
}
