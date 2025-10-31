
import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagChatService } from '../services/rag-chat-service';
import { RagChunk } from '../models/rag-chunk';

type Msg = { role: 'user' | 'assistant'; text: string };

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container">
    <div class="messages">
      <div *ngFor="let m of messages()"
           [class.user]="m.role==='user'"
           [class.assistant]="m.role==='assistant'">
        <pre>{{ m.text }}</pre>
      </div>
    </div>

    <form (ngSubmit)="send()" class="composer">
      <input [(ngModel)]="input" name="message" placeholder="Escribe tu mensaje..."
             autocomplete="off" required />
      <button type="submit">Enviar</button>
      <button type="button" (click)="stop()" [disabled]="!streaming()">Detener</button>
    </form>
  </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 0 auto; display:flex; flex-direction:column; height: 100dvh; }
    .messages { flex:1; overflow: auto; padding: 1rem; background: #0b0f14; color: #e9eef5; }
    .messages .user { text-align: right; }
    .messages .assistant { text-align: left; }
    pre { white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .composer { display:flex; gap:.5rem; padding:.5rem; background:#0b0f14; border-top: 1px solid #1e2630; }
    input { flex:1; padding:.5rem .75rem; background:#0f1520; border:1px solid #1e2630; color:#e9eef5; border-radius: .5rem; }
    button { padding:.5rem .75rem; border-radius:.5rem; border: 1px solid #1e2630; background:#111827; color:#e9eef5; }
  `]
})
export class ChatComponent {
  input = '';
  messages = signal<Msg[]>([]);
  streaming = signal(false);

  constructor(private chat: RagChatService) {}

  async send() {
    const text = this.input.trim();
    if (!text) return;
    this.input = '';

    // agrega mensaje del usuario y placeholder de asistente
    this.messages.update(arr => [...arr, { role: 'user', text }, { role: 'assistant', text: '' }]);

    const assistantIndex = this.messages().length - 1;
    this.streaming.set(true);

    this.chat.streamMessage(text).subscribe({
      next: (chunk: RagChunk) => {
        if (chunk.text) {
          const prev = this.messages()[assistantIndex]?.text ?? '';
          const updated = chunk.partial ? prev + chunk.text : (prev + chunk.text);
          this.messages.update(arr => {
            const copy = [...arr];
            copy[assistantIndex] = { role: 'assistant', text: updated };
            return copy;
          });
        }
        if (chunk.final) {
          this.streaming.set(false);
        }
      },
      error: (err) => {
        this.streaming.set(false);
        this.messages.update(arr => [
          ...arr,
          { role: 'assistant', text: `⚠️ Error: ${err?.message ?? err}` }
        ]);
      },
      complete: () => this.streaming.set(false),
    });
  }

  stop() {
    this.chat.stop();
    this.streaming.set(false);
  }
}
