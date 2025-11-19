import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FeedbackCreateDto {
  coment: string;
  rating: number;
  chat_session: string;
  
}
export interface FeedbackStatsDto {
  total: number;

  promoters: number;
  passives: number;
  detractors: number;

  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
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
    getMonthlyStats(year: number, month: number): Observable<FeedbackStatsDto> {
    return this.http.get<FeedbackStatsDto>(`${this.baseUrl}/stats`, {
      params: { year, month }
    });
  }
}
