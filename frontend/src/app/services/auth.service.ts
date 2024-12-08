import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  //if token exist it will return true.

  public isAuthenticated():boolean{
    const token = localStorage.getItem('token');
    // console.log("token::comig::",token)
    if(!token){
      this.router.navigate(['/'])
      return false
    }else{
      return true
    }
  }
}
