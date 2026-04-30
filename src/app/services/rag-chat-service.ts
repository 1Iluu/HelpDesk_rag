import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RagChunk } from '../models/rag-chunk';

@Injectable({ providedIn: 'root' })
export class RagChatService {

  // 1. CAMBIO: Apuntamos directo a tu servidor Python manual
  //private pythonBaseUrl = ' https://rag-agent-python-1097661750103.us-east1.run.app';
  private pythonBaseUrl = 'http://localhost:8000';

  private sessionId = signal<string | null>(null);
  private controller: AbortController | null = null;

  // Nota: Como el servidor manual no tiene endpoint /sessions,
  // generamos un ID local o simplemente retornamos uno dummy por ahora.
  async ensureSession(): Promise<string> {
    const current = this.sessionId();
    if (current) return current;

    // Generamos uno localmente para no romper la lógica del front
    const newId = crypto.randomUUID();
    this.sessionId.set(newId);
    return newId;
  }

  /**
   * Envía el mensaje del usuario y entrega chunks en tiempo real.
   * 2. CAMBIO: Ahora recibe el 'role' para saber a qué puerta ir.
   */
  streamMessage(message: string, role: string): Observable<RagChunk> {
    return new Observable<RagChunk>(observer => {
      const run = async () => {
        // Obtenemos sesión (local)
        await this.ensureSession();

        this.controller?.abort();
        this.controller = new AbortController();

        // Si es Admin -> /admin/run_sse
        // Si es Cliente -> /client/run_sse
        const pathPrefix = (role === 'ROLEAdmin') ? '/admin' : '/client';
        const endpoint = `${this.pythonBaseUrl}${pathPrefix}/run_sse`;

        console.log(`🚀 Enviando a: ${endpoint}`);

        const payload = {
          new_message: {
             text: message
          }
        };

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            signal: this.controller.signal,
          });

          if (!res.ok) {
            throw new Error(`Error del servidor (${res.status}): ${res.statusText}`);
          }

          if (!res.body) {
             throw new Error('El servidor no devolvió cuerpo de respuesta');
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

            // Procesamos el formato SSE manual: "data: {...} \n\n"
            let idx;
            while ((idx = buffer.indexOf('\n\n')) >= 0) {
              const rawEvent = buffer.slice(0, idx);
              buffer = buffer.slice(idx + 2);

              const dataLines = rawEvent
                .split('\n')
                .filter(l => l.startsWith('data:'))
                .map(l => l.slice(5).trim());

              if (!dataLines.length) continue;

              const joined = dataLines.join('\n');

              // Señal de fin
              if (joined === '[DONE]') {
                observer.next({ text: '', partial: false, final: true });
                observer.complete();
                return;
              }

              try {
                const evt = JSON.parse(joined);
                // Extraemos el texto del JSON { "text": "..." }
                const text = evt.text ?? '';

                observer.next({
                  text,
                  partial: true,
                  role: 'model',
                  final: false,
                  raw: evt,
                });
              } catch (e) {
                console.warn('Error parseando chunk JSON:', joined);
              }
            }

            await pump();
          };

          await pump();
        } catch (err: any) {
          // Si se canceló manualmente (abort), no es un error grave
          if (err.name === 'AbortError') return;
          observer.error(err);
        }
      };

      run();

      return () => {
        this.controller?.abort();
      };
    });
  }

  stop() {
    this.controller?.abort();
  }
}
