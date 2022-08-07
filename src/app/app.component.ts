import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // inject userservice obj
  constructor(public us:UserService){}

  userLogout(){
    localStorage.clear();
    this.us.userLoginStatus=false;
  }
}
