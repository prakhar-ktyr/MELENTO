import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './services/user.service';
import { LocalStorageService } from './services/local-storage.service';
import { User } from './models/user';
import { DarkModeService } from './services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'first';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private renderer: Renderer2, private darkModeService: DarkModeService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.darkModeService.getDarkMode()) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.userService.getUsers().subscribe((users: User[]) => {
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        this.localStorageService.setItem('username', `${user.firstName} ${user.lastName}`);
        this.localStorageService.setItem('role', user.role);
        console.log('Login successful');
        // Add navigation or any other actions after successful login
      } else {
        console.log('Invalid credentials');
      }
    });
  }
}
