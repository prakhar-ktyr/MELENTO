import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { AssessmentService } from "../../services/assessment.service";
import { Assessment } from "../../models/assessment";
import { Address } from "../../models/address";
import { CartService } from "../../services/cart.service";
import { DarkModeService } from "../../services/dark-mode.service";
import { Renderer2 } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  isDarkMode: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoggedIn: boolean = false;
  searchTerm: string = "";
  arrAssessments: Assessment[] = [];
  arrUsers: User[] = [];
  userRole: string = "";
  today: string = new Date().toISOString().split("T")[0];
  newAssessmentCount: number = 0;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private assessmentService: AssessmentService,
    private cartService: CartService,
    private darkModeService: DarkModeService,
    private renderer: Renderer2 , 
    private toastr : ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });

    this.registerForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: ["", Validators.required],
        dob: ["", [Validators.required, this.dateValidator]],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        address: this.fb.array([this.createAddress()]),
      },
      { validators: this.passwordMatchValidator }
    );

    this.cartService.getCheckout().subscribe((data) => {
      this.newAssessmentCount += data;
    });
  }

  ngOnInit(): void {
    this.localStorageService.authStatus$.subscribe((status) => {
      this.isLoggedIn = status;
      this.userRole = this.localStorageService.getItem("role") || "";
    });

    this.assessmentService
      .getAssessments()
      .subscribe((assessments: Assessment[]) => {
        this.arrAssessments = assessments;
      });
    //this.loadUsers();

    this.isDarkMode = this.darkModeService.getDarkMode();
  }

  get isAdmin(): boolean {
    return this.userRole === "Admin";
  }

  get isFaculty(): boolean {
    return this.userRole === "Faculty";
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.arrUsers = users;
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      houseNo: ["", Validators.required],
      street: ["", Validators.required],
      area: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      pincode: ["", Validators.required],
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeService.toggleDarkMode();
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, "dark-mode");
    } else {
      this.renderer.removeClass(document.body, "dark-mode");
    }
  }

  addAddress(): void {
    (this.registerForm.get("address") as FormArray).push(this.createAddress());
  }

  get addressControls() {
    return (this.registerForm.get("address") as FormArray).controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control!.invalid && (control!.touched || !control!.pristine);
  }

  isRegisterInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control!.invalid && (control!.touched || !control!.pristine);
  }

  isAddressInvalid(index: number, controlName: string): boolean {
    const control = (this.registerForm.get("address") as FormArray)
      .at(index)
      .get(controlName);
    return control!.invalid && (control!.touched || !control!.pristine);
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.userService
      .userAuth({ email: email, password: password })
      .subscribe((data) => {
        const user = data.user;
        const token = data.token;
        console.log("user inside client userauth ", user);
        if (user && token) {
          console.log("Got user and token");
          this.localStorageService.setItem("token", token);
          this.localStorageService.setItem(
            "username",
            `${user.firstName} ${user.lastName}`
          );
          this.localStorageService.setItem("role", user.role);
          this.localStorageService.setItem("loggedUserId", user._id);
          this.isLoggedIn = true;
          this.userRole = user.role;
          this.toastr.success("Login successful") ; 
          this.router.navigate(["/dashboard"]);
        } else {
          console.log("Invalid credentials");
          this.toastr.error("Invalid Credentials") ; 
        }
      } , (err) => {
        this.toastr.error("Invalid Credentials") ; 
      });
  }

  logout(): void {
    this.localStorageService.clear();
    this.isLoggedIn = false;
    this.userRole = "";
    console.log("Logout successful");
    this.router.navigate(["/home"]);
  }

  onSearch(): void {
    const filteredAssessments = this.arrAssessments.filter((assessment) =>
      assessment.assessmentName
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
    if (filteredAssessments.length > 0) {
      this.router.navigate([`viewDetails/${filteredAssessments[0].id}`]);
    } else {
      console.log("Assessment not found");
    }
  }

  getMaxId(users: User[]): number {
    return users.reduce(
      (max, user) => (parseInt(user.id) > max ? parseInt(user.id) : max),
      0
    );
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    if (control.value && new Date(control.value) > new Date()) {
      return { invalidDate: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    if (group.get("password")?.value !== group.get("confirmPassword")?.value) {
      return { mismatch: true };
    }
    return null;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    //const newUserId = this.getMaxId(this.arrUsers) + 1;
    this.userService.getUsersNotLoggedIn().subscribe((data) => {
      console.log("called get users not logged in", data);
      let newUserId = data.length + 1;
      console.log(newUserId);
      const newUser: User = {
        id: newUserId.toString(),
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        dob: this.registerForm.value.dob,
        role: "Trainee",
        password: this.registerForm.value.password,
        address: this.registerForm.value.address.map(
          (addr: any, index: number) => ({
            id: index + 1,
            houseNo: addr.houseNo,
            street: addr.street,
            area: addr.area,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            pincode: addr.pincode,
          })
        ),
      };

      this.userService.addUser(newUser).subscribe(
        (data) => {
          this.toastr.success("Registration successful") ; 
          console.log("User registered successfully:", data);
          this.loadUsers();
        },
        (err) => {
          this.toastr.error("Registration failed") ; 
          console.log("Error registering user:", err);
        }
      );
    });
  }
}
