import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json()); // para leer JSON en POST

// ------- CONFIG ADK LOCAL -------
const ADK_BASE = process.env['ADK_BASE'] ?? 'http://localhost:8000';
const ADK_APP  = process.env['ADK_APP']  ?? 'rag_agent';
const ADK_USER = process.env['ADK_USER'] ?? 'user';

const BASE_APP = `${ADK_BASE.replace(/\/+$/, '')}/apps/${ADK_APP}/users/${ADK_USER}`;
const RUN_SSE  = `${ADK_BASE.replace(/\/+$/, '')}/run_sse`;

// ------- HELPERS -------
async function createSession(): Promise<string> {
  const r = await fetch(`${BASE_APP}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}), // igual que la Dev UI
  });
  if (!r.ok) throw new Error(await r.text());
  const data: any = await r.json();
  const id = data.session_id || data.id || data.name?.split?.('/')?.pop?.();
  if (!id) throw new Error('No pude inferir sessionId');
  return id;
}

// ------- API PROXY -------
// Crear sesión
app.post('/api/sessions', async (_req, res): Promise<void> => {
  try {
    const sessionId = await createSession();
    res.json({ sessionId });
    return;
  } catch (e: any) {
    res.status(500).send(e?.message ?? 'Error creando sesión');
    return;
  }
});

// Stream de chat usando /run_sse (new_message debe ser un objeto)
app.post('/api/streamQuery', async (req, res): Promise<void> => {
  try {
    let { sessionId, message } = req.body ?? {};
    console.log('[streamQuery] body recibido:', req.body);

    if (!message || !String(message).trim()) {
      res.status(400).send('message requerido');
      return;
    }
    if (!sessionId) {
      sessionId = await createSession();
      console.log('[streamQuery] nueva sessionId:', sessionId);
    }

    const RUN_SSE = `${ADK_BASE.replace(/\/+$/, '')}/run_sse`;

    // Variantes de "new_message" más comunes en ADK/Vertex:
    const candidateNewMessages = [
      // A) Formato Vertex "content": role + parts[].text
      { role: 'user', parts: [{ text: String(message) }] },

      // B) Formato con author + content.parts
      { author: 'user', content: { parts: [{ text: String(message) }] } },

      // C) Formato simple con text + role
      { text: String(message), role: 'user' },
    ];

    // Cabeceras SSE al navegador
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
      'X-Accel-Buffering': 'no',
    });

    let ok = false;
    for (const nm of candidateNewMessages) {
      const body = {
        app_name: ADK_APP,      // ej. rag_agent
        user_id: ADK_USER,      // ej. user
        session_id: sessionId,  // uuid de la sesión
        new_message: nm,        // <-- OBJETO (no string)
        relative_path: './',
      };

      console.log('[run_sse] POST', RUN_SSE, 'new_message keys:', Object.keys(nm));
      try {
        const upstream = await fetch(RUN_SSE, {
          method: 'POST',
          headers: {
            'Accept': 'text/event-stream',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!upstream.ok) {
          const txt = await upstream.text();
          console.warn(`[run_sse] ${upstream.status}:`, txt);
          // si sigue siendo 422, probamos la siguiente variante
          if (upstream.status === 422) continue;
          // otros códigos, devolvemos el error al cliente
          res.write(`data: ${JSON.stringify({ error: txt })}\n\n`);
          res.end();
          return;
        }

        if (!upstream.body) {
          res.write(`data: ${JSON.stringify({ error: 'Sin cuerpo de stream' })}\n\n`);
          res.end();
          return;
        }

        const reader = (upstream.body as ReadableStream<Uint8Array>).getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) res.write(Buffer.from(value));
        }
        ok = true;
        break;
      } catch (err: any) {
        console.warn('[run_sse] error:', err?.message);
        continue;
      }
    }

    if (!ok) {
      res.write(`data: ${JSON.stringify({
        error: 'El ADK aún rechaza new_message. Abre la Dev UI → Network → run_sse y copia el "Request Payload" exacto para igualarlo 1:1.',
      })}\n\n`);
    }
    res.end();
    return;
  } catch (e: any) {
    res.status(500).send(e?.message ?? 'Error interno en streamQuery');
    return;
  }
});



// ------- ESTÁTICOS & ANGULAR -------
app.use(
  express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }),
);

// ¡IMPORTANTE! /api va ANTES del handler SSR
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

// ------- BOOT -------
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`SSR server en http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
