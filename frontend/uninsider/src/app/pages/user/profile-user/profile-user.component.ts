import { Component } from '@angular/core';
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent {
  user = this.login.getUser();

  constructor(private login:LoginService) {
  }

  ngOnInit():void {
    this.user = this.login.getUser();
  }
}
