import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SupportTicketDto {
  idTicket?: number; 
  chatSessionId?: string; 
  chatSession?: { id: string }; 
  chatHistory: string;
  aiSummary: string;
  status?: string; // Opcional para recibir "OPEN" o "CLOSED" del backend
  createdAt?: string; // Opcional para mostrar la fecha si quieres
  userId: number; 
}

@Injectable({
  providedIn: 'root'
})
export class TicketApi {
  private baseUrl = 'https://helpdesk-backend-42011032546.us-east1.run.app/tickets';
  //private baseUrl = 'http://localhost:8081/tickets';

  constructor(private http: HttpClient) {}

  escalarTicket(dto: SupportTicketDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/escalate`, dto);
  }


  getTickets(): Observable<SupportTicketDto[]> {
    return this.http.get<SupportTicketDto[]>(this.baseUrl);
  }

  // Para cambiar el estado del ticket a resuelto
  cerrarTicket(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/close`, {});
  }
}