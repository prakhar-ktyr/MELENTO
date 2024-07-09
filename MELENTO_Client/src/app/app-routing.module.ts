import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { HomeComponent } from './components/home/home.component';
import { AssessmentsComponent } from './components/assessments/assessments.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './guards/adminguard';
import { CartComponent } from './components/cart/cart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';
import { AttemptAssessmentComponent } from './components/attempt-assessment/attempt-assessment.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FacultyComponent } from './components/faculty/faculty.component';
import { ReportComponent } from './components/report/report.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'assessments', component: AssessmentsComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'viewDetails/:id' , component:ViewDetailsComponent },
  { path: 'attemptAssessment/:id' , component:AttemptAssessmentComponent },
  { path: 'faculty', component: FacultyComponent },
  { path: 'report', component: ReportComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
