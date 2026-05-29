import { Injectable, signal } from '@angular/core';

// Exportamos tu tipo Msg para usarlo aquí
export type Msg = { role: 'user' | 'assistant'; text: string };

@Injectable({
  providedIn: 'root' 
})
export class ChatStateService {
  // Mudamos la memoria del chat para acá
  messages = signal<Msg[]>([]);
  streaming = signal(false);
  sessionId = crypto.randomUUID();
  
  isSessionRegistered = false; 

  constructor() { }
}