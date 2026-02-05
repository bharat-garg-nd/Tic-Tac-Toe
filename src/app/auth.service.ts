import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: string | null = null;
  constructor() {
    this.user = localStorage.getItem('user');
  }
  login(name: string){
    this.user = name;
    localStorage.setItem('user', name);
  }
  logout(){
    this.user = null;
    localStorage.removeItem('user');
  }
  isLoggedIn(): boolean{
    return this.user != null;
  }
  getUser(): string | null{
    return this.user;
  }
}
