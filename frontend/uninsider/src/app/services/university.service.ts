import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import baseUrl from "./helper";

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  constructor(private http: HttpClient) { }

  // Add university
  public addUniversity(university: any) {
    return this.http.post(`${baseUrl}/university/`, university);
  }

  // Update university
  public updateUniversity(university: any) {
    return this.http.put(`${baseUrl}/university/`, university);
  }

  // Get all universities
  public getAllUniversities() {
    return this.http.get(`${baseUrl}/university/`);
  }

  // Get university by id
  public getUniversityById(id: number) {
    return this.http.get(`${baseUrl}/university/${id}`);
  }

  // Delete university by id
  public deleteUniversityById(id: number) {
    return this.http.delete(`${baseUrl}/university/${id}`);
  }
}
