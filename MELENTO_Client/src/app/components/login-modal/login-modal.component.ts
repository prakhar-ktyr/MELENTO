import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../models/user';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.userService.getUsers().subscribe((users: User[]) => {
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        this.localStorageService.setItem('username', `${user.firstName} ${user.lastName}`);
        this.localStorageService.setItem('role', user.role);
        this.localStorageService.setItem('loggedUserId', user.id);
        console.log('Login successful');
        this.router.navigate(['/dashboard']); 
      } else {
        console.log('Invalid credentials');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
