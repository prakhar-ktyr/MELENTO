import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-view-trainee',
  templateUrl: './view-trainee.component.html',
  styleUrls: ['./view-trainee.component.scss']
})
export class ViewTraineeComponent implements OnInit {
  arrUsers: User[] = [];
  trainees: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.arrUsers = data;
      this.trainees = this.arrUsers.filter(user => user.role === 'Trainee');
    });
  }
}