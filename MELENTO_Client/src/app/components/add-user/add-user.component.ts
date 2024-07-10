import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {

  userAddForm: FormGroup;
  users: User[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userAddForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      role: ['user', Validators.required],
      password: ['', Validators.required],
      address: this.fb.array([this.createAddress()])
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      houseNo: ['', Validators.required],
      street: ['', Validators.required],
      area: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', Validators.required]
    });
  }

  addAddress(): void {
    (this.userAddForm.get('address') as FormArray).push(this.createAddress());
  }

  get addressControls() {
    return (this.userAddForm.get('address') as FormArray).controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.userAddForm.get(controlName);
    return control!.invalid && (control!.touched || !control!.pristine);
  }

  isAddressInvalid(index: number, controlName: string): boolean {
    const control = (this.userAddForm.get('address') as FormArray).at(index).get(controlName);
    return control!.invalid && (control!.touched || !control!.pristine);
  }

  getMaxId(users: User[]): number {
    return users.reduce((max, user) => (parseInt(user.id) > max ? parseInt(user.id) : max), 0);
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const dob = new Date(control.value);
    if (dob > today) {
      return { 'invalidDate': true };
    }
    return null;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    let newUserId = 0 ; 
    this.userService.getUsers().subscribe(data => {
      newUserId = data.length + 1 ; 
      const tempUser: User = {
        id: newUserId.toString(),
        firstName: frmValue.firstName,
        lastName: frmValue.lastName,
        email: frmValue.email,
        phone: frmValue.mobile,
        dob: frmValue.dob,
        role: frmValue.role,
        password: frmValue.password,
        address: frmValue.address.map((addr: any, index: number) => ({
          id: index + 1,  // Giving unique address ids
          houseNo: addr.houseNo,
          street: addr.street,
          area: addr.area,
          city: addr.city,
          state: addr.state,
          country: addr.country,
          pincode: addr.pincode
        }))
      };
  
      this.userService.addUser(tempUser).subscribe(
        (data) => {
          console.log('User Added:' + data);
          this.loadUsers();  // Reload users to get the latest list
        },
        (err) => {
          console.log('Error:', err);
        }
      );
    })

   
  }
}
