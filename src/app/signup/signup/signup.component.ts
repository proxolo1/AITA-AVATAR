import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private _authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }
  signUpData = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  }
  ngOnInit(): void {
  }
  signup() {
    this._authService.signUp(this.signUpData).subscribe(res => {
      if (res.status == 200) {
        this.router.navigate(['']);
      } else {
        this.snackBar.open(res.message, 'close')
      }

    })
  }
}


