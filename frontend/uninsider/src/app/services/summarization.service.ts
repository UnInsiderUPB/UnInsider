import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:4200/summarization'

@Injectable({
  providedIn: 'root'
})
export class SummarizationService {

  constructor(private http: HttpClient) { }

  initSummarizationModule() {
    return this.http.post(`${baseUrl}/init`, {});
  }

  getSummary(text: any) {
    const data = {'article': text}
    return this.http.post(`${baseUrl}/summarization`, data);
  }
}
