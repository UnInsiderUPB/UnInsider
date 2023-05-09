import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:4200/guidelines'

@Injectable({
  providedIn: 'root'
})
export class GuidelinesService {

  constructor(private http: HttpClient) { }

  getLanguage(text: any) {
    const data = {'text': text}
    return this.http.post(`${baseUrl}/language`, data);
  }

  getProfanityWords(text: any) {
    const data = {'text': text}
    return this.http.post(`${baseUrl}/profanity`, data);
  }
}
