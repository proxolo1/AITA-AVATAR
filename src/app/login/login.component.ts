import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthService, private route: Router, private snackBar: MatSnackBar) { }
  loginData = {
    email: '',
    password: ''
  }
  ngOnInit(): void {
  }
  login() {
    localStorage.removeItem('chatHistory')
    this._authService.login(this.loginData).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this._authService.setToken(res.name);
        this.route.navigate(['/chat']);
      } else {
        this.snackBar.open(res.message, "Close")
      }

    })
  }

}
