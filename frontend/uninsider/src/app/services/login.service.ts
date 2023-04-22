import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  // Get current user which is logged in
  public getCurrentUser() {
    return this.http.get(`${baseUrl}/current-user`);
  }

  // Generate JWT token
  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/generate-token`, loginData);
  }

  // Login user by storing token in local storage
  public loginUser(token: any) {
    localStorage.setItem('token', token);
    return true;
  }

  // Check if user is logged in
  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null)
      return false;
    return true;
  }

  // Logout user
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  // Get token
  public getToken() {
    return localStorage.getItem('token');
  }

  // Set `userDetails` in local storage
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get `userDetails` from local storage
  public getUser() {
    let userStr = localStorage.getItem('user');
    if (userStr != null)
      return JSON.parse(userStr);
    this.logout();
    return null;
  }

  // Get `userRole`
  public getUserRole() {
    let user = this.getUser();
    return user.authorities[0].authority;
  }
}
