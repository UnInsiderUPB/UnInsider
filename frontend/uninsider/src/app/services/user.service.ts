import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import baseUrl from "./helper";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  // Add user
  public addUser(user: any) {
    return this.http.post(`${baseUrl}/user/`, user);
  }

  // Update user
  public updateUser(user: any) {
    return this.http.put(`${baseUrl}/user/`, user);
  }

  // Update user role
  public updateUserRole(username: string, role: string) {
    return this.http.put(`${baseUrl}/user/${username}/role/${role}`, null);
  }

  // Get all users
  public getAllUsers() {
    return this.http.get(`${baseUrl}/user/`);
  }
}
