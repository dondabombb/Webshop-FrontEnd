import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ReUseModule} from "../re-use/re-use.module";

@Component({
  selector: 'app-login-screen',
  standalone: false,
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.scss'
})
export class LoginScreenComponent {
  error: string|null = null;
  emailRequiments: string = '^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$'
  constructor(private router: Router) {}

  async ngOnInit(){}

  loginForm = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.emailRequiments),
    ]),
    password: new FormControl(null, [
      Validators.required
    ]),
  });

  public async onSubmit(){
    this.error = null;
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    if(email == null || password == null){
      return;
    }

    if(!this.loginForm.valid){
      return;
    }

    this.router.navigateByUrl('')
  }
}
