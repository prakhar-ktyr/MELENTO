import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  enquiryForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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

    this.http.post('http://localhost:3000/send-email', this.enquiryForm.value).subscribe(
      (response) => {
        console.log('Email sent successfully', response);
        alert('Your enquiry has been sent successfully.');
        this.enquiryForm.reset();
      },
      (error) => {
        console.error('Error sending email', error);
        alert('There was an error sending your enquiry. Please try again later.');
      }
    );
  }
}