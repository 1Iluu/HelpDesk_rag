import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RagChunk } from '../models/rag-chunk';

@Injectable({ providedIn: 'root' })
export class RagChatService {
  // Configura esto a tu backend proxy (ver sección 4)
  private baseUrl = '/api';

  private sessionId = signal<string | null>(null);
  private controller: AbortController | null = null;

  async ensureSession(): Promise<string> {
    const current = this.sessionId();
    if (current) return current;

    const res = await fetch(`${this.baseUrl}/sessions`, { method: 'POST' });
    if (!res.ok) throw new Error('No se pudo crear sesión');
    const data = await res.json() as { sessionId: string };
    this.sessionId.set(data.sessionId);
    return data.sessionId;
  }

  /**
   * Envía el mensaje del usuario y entrega chunks en tiempo real.
   * Devuelve un Observable<RagChunk>.
   */
  streamMessage(message: string): Observable<RagChunk> {
    return new Observable<RagChunk>(observer => {
      const run = async () => {
        const sessionId = await this.ensureSession();
        this.controller?.abort();                     // cancela stream previo si existía
        this.controller = new AbortController();

        const payload = { sessionId, message };
        const res = await fetch(`${this.baseUrl}/streamQuery`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
          signal: this.controller.signal,
        });
        if (!res.ok || !res.body) {
          observer.error(new Error('No se pudo abrir el stream'));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const pump = async (): Promise<void> => {
          const { value, done } = await reader.read();
          if (done) {
            observer.next({ text: '', partial: false, final: true });
            observer.complete();
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          // Los eventos SSE se separan por \n\n
          let idx;
          while ((idx = buffer.indexOf('\n\n')) >= 0) {
            const rawEvent = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            // Solo procesamos líneas data:
            const dataLines = rawEvent
              .split('\n')
              .filter(l => l.startsWith('data:'))
              .map(l => l.slice(5).trim());

            if (!dataLines.length) continue;

            const joined = dataLines.join('\n');
            if (joined === '[DONE]') {
              observer.next({ text: '', partial: false, final: true });
              observer.complete();
              return;
            }

            try {
              const evt = JSON.parse(joined);
              // Normaliza texto (distintos runtimes colocan el texto en lugares diferentes)
              const text =
                evt.text ??
                evt.delta ??
                evt?.content?.text ??
                evt?.content?.parts?.[0]?.text ??
                '';

              const partial =
                evt.partial ?? evt.is_partial ?? evt.delta !== undefined;

              observer.next({
                text,
                partial,
                role: evt.author ?? 'model',
                final: false,
                raw: evt,
              });
            } catch {
              // evento de ping/keepalive u otro formato: lo ignoramos
            }
          }

          await pump();
        };

        pump().catch(err => observer.error(err));
      };

      run();

      // teardown
      return () => {
        this.controller?.abort();
      };
    });
  }

  stop() {
    this.controller?.abort();
  }
}
