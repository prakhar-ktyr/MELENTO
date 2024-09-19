import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
} from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ContentComponent } from "./components/content/content.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";
import { AboutusComponent } from "./components/aboutus/aboutus.component";
import { AssessmentsComponent } from "./components/assessments/assessments.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ContactusComponent } from "./components/contactus/contactus.component";
import { AddUserComponent } from "./components/add-user/add-user.component";
import { UpdateUserComponent } from "./components/update-user/update-user.component";
import { AddCourseComponent } from "./components/add-course/add-course.component";
import { LocalStorageService } from "./services/local-storage.service";
import { CreateAssessmentComponent } from "./components/create-assessment/create-assessment.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbar } from "@angular/material/toolbar";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ViewUserComponent } from "./components/view-user/view-user.component";
import { UpdateCourseComponent } from "./components/update-course/update-course.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CartComponent } from "./components/cart/cart.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ViewDetailsComponent } from "./components/view-details/view-details.component";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { AttemptAssessmentComponent } from "./components/attempt-assessment/attempt-assessment.component";
import { SearchPipe } from "./pipes/search.pipe";
import { MatRadioModule } from "@angular/material/radio";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { TimerComponent } from "./components/timer/timer.component";
import { ViewAttendanceComponent } from "./components/view-attendance/view-attendance.component";
import { UpdateAttendanceComponent } from "./components/update-attendance/update-attendance.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CreateCategoryComponent } from "./components/create-category/create-category.component";
import { UpdateCategoryComponent } from "./components/update-category/update-category.component";
import { UpdateAssessmentScoreComponent } from "./components/update-assessment-score/update-assessment-score.component";
import { ViewCourseComponent } from "./components/view-course/view-course.component";
import { ViewCategoryComponent } from "./components/view-category/view-category.component";
import { ViewAssessmentScoreComponent } from "./components/view-assessment-score/view-assessment-score.component";
import { FacultyComponent } from "./components/faculty/faculty.component";
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts";
import { BarChartComponent } from "./components/bar-chart/bar-chart.component";
import { ViewReportsComponent } from "./components/view-reports/view-reports.component";
import { UpdateReportsComponent } from "./components/update-reports/update-reports.component";
import { UpdateAssessmentComponent } from "./components/update-assessment/update-assessment.component";
import { ViewAssessmentComponent } from "./components/view-assessment/view-assessment.component";
import { LoginModalComponent } from "./components/login-modal/login-modal.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatBadgeModule } from "@angular/material/badge";
import { ReportComponent } from "./components/report/report.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  AuthInterceptor,
  httpInterceptorProvider,
} from "./interceptors/auth.interceptor";
import { SuccessComponent } from "./components/success/success.component";
import { CancelComponent } from "./components/cancel/cancel.component";
import { ViewTraineeComponent } from "./components/view-trainee/view-trainee.component";
import { ViewFacultyComponent } from "./components/view-faculty/view-faculty.component";

import { ToastrModule } from "ngx-toastr";

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    AboutusComponent,
    AssessmentsComponent,
    AdminComponent,
    ContactusComponent,
    AddUserComponent,
    UpdateUserComponent,
    AddCourseComponent,
    CreateAssessmentComponent,
    ViewUserComponent,
    UpdateCourseComponent,
    NavbarComponent,
    CartComponent,
    DashboardComponent,
    ViewDetailsComponent,
    TruncatePipe,
    AttemptAssessmentComponent,
    SearchPipe,
    NotFoundComponent,
    TimerComponent,
    ViewAttendanceComponent,
    UpdateAttendanceComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    UpdateAssessmentScoreComponent,
    ViewCourseComponent,
    ViewCategoryComponent,
    ViewAssessmentScoreComponent,
    FacultyComponent,
    BarChartComponent,
    ViewReportsComponent,
    UpdateReportsComponent,
    UpdateAssessmentComponent,
    ViewAssessmentComponent,
    LoginModalComponent,
    ReportComponent,
    SuccessComponent,
    CancelComponent,
    ViewTraineeComponent,
    ViewFacultyComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatToolbar,
    MatOptionModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule,
    MatRadioModule,
    MatSlideToggleModule,
    CanvasJSAngularChartsModule,
    MatDialogModule,
    MatBadgeModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      closeButton: true,
      progressBar:true 
    }),
  ],
  providers: [
    provideClientHydration(),
    LocalStorageService,
    provideAnimationsAsync(),
    // httpInterceptorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
