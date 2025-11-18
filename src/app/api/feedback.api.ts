import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FeedbackCreateDto {
  coment: string;
  rating: number;
  // si tu backend espera más campos, agrégalos aquí
  // userId?: number;
  // userName?: string;
  // sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackApi {

  private baseUrl = 'http://localhost:8081/feedback';

  constructor(private http: HttpClient) {}

  createFeedback(dto: FeedbackCreateDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }
}
