import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Address } from '../../models/address';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  userAddForm: FormGroup;
  arrUsers: User[] = [];
  idUpdated: string = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userAddForm = this.fb.group({
      id: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      dob: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      address: this.fb.array([this.createAddress()])
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.arrUsers = users;
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      houseNo: [0, Validators.required],
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
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  isAddressInvalid(index: number, controlName: string): boolean {
    const control = (this.userAddForm.get('address') as FormArray).at(index).get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const tempUser: User = {
      id: frmValue.id,
      firstName: frmValue.firstName,
      lastName: frmValue.lastName,
      email: frmValue.email,
      phone: frmValue.mobile,
      dob: frmValue.dob,
      role: frmValue.role,
      password: frmValue.password,
      address: frmValue.address.map((addr: any) => ({
        id: addr.id || '0',
        houseNo: addr.houseNo,
        street: addr.street,
        area: addr.area,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        pincode: addr.pincode
      }))
    };

    this.userService.updateUser(tempUser).subscribe(
      (response: User[]) => {
        console.log('User updated successfully', response);
      },
      (error: any) => {
        console.error('Error adding user', error);
      }
    );
  }

  onChangeType(evt: any): void {
    console.log(evt.target.value);

    var idObtained = evt.target.value;
    this.idUpdated = idObtained.split(':')[1].trim();
    console.log(this.idUpdated);

    for (var i = 0; i < this.arrUsers.length; i++) {
      if (Number(this.idUpdated )=== Number(this.arrUsers[i].id)) {
        this.userAddForm.patchValue({
          id: this.arrUsers[i].id,
          firstName: this.arrUsers[i].firstName,
          lastName: this.arrUsers[i].lastName,
          email: this.arrUsers[i].email,
          mobile: this.arrUsers[i].phone,
          dob: this.arrUsers[i].dob,
          role: this.arrUsers[i].role,
          password: this.arrUsers[i].password
        });

        var addressArray = this.arrUsers[i].address;
        var addressArrayLength = addressArray.length;
        console.log(addressArrayLength);

        for (var j = 0; j < addressArrayLength; j++) {
          if (j == 0) {
            this.userAddForm.patchValue({
              address: [
                {
                  id: addressArray[j].id,
                  houseNo: addressArray[j].houseNo,
                  street: addressArray[j].street,
                  area: addressArray[j].area,
                  city: addressArray[j].city,
                  state: addressArray[j].state,
                  country: addressArray[j].country,
                  pincode: addressArray[j].pincode
                }
              ]
            });
          } else {
            (this.userAddForm.get('address') as FormArray).push(this.createAddress());
            this.userAddForm.patchValue({
              address: [
                {
                  id: addressArray[j].id,
                  houseNo: addressArray[j].houseNo,
                  street: addressArray[j].street,
                  area: addressArray[j].area,
                  city: addressArray[j].city,
                  state: addressArray[j].state,
                  country: addressArray[j].country,
                  pincode: addressArray[j].pincode
                }
              ]
            });
          }
        }
      }
    }
  }
}
