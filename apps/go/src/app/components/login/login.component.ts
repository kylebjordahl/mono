import { Component, OnInit } from '@angular/core';
import { GoService } from '../../services/go/go.service';

@Component({
  selector: 'go-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private go: GoService) {}

  async doLogin() {
    await this.go.login(this.username, this.password);
  }

  async doSignUp() {
    await this.go.signUp(this.username, this.password);
  }

  ngOnInit(): void {}
}
