import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  enquiryForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient , private emailService : EmailService) {
    this.enquiryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  isInvalid(controlName: string): boolean {
    const control = this.enquiryForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  onSubmit(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      return;
    }
    console.log(this.enquiryForm.value) ; 
    const {name , email , message} = this.enquiryForm.value ; 
    console.log(name , email , message) ; 
    const info = {
      name : name ,
      email : email , 
      message : message 
    }
    this.emailService.sendEmail(info).subscribe(data => {
      console.log('Email sent successfully') ; 
    })

  }
}