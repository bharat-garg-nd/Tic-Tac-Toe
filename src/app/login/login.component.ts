import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = '';
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  login(){
    if(!this.name.trim()) {
      alert('Enter Name!');
      return;
    }
    this.auth.login(this.name);
    this.router.navigate(['/game']);
  }
}
