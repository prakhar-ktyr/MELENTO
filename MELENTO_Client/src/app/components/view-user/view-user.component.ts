import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
  arrUsers: User[] = [];
  constructor(private userService: UserService) {
    this.userService.getUsers().subscribe(data => {
      this.arrUsers = data;
      console.log(this.arrUsers);
    });
  }
}
