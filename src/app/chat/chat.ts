import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagChatService } from '../services/rag-chat-service';
import { RagChunk } from '../models/rag-chunk';

type Msg = { role: 'user' | 'assistant'; text: string };

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  host: { class: 'flex flex-col flex-1 min-h-0' },
  template: `
    <div class="flex-1 flex flex-col min-h-0">
      <header
        class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 h-16 bg-white dark:bg-[#111a22]">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Chatbot</h2>
        <button
          class="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800">
          <span class="material-symbols-outlined text-xl">notifications</span>
        </button>
      </header>

      <section class="flex-1 min-h-0 p-6 flex flex-col">
        <div
          class="flex-1 min-h-0 bg-white dark:bg-[#111a22] rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col">
          <div
            class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Chat Session
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Session ID: 1a2b3c-4d5e-6f7g
              </p>
            </div>

            <button
              (click)="openFeedback()"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50">
              <span class="material-symbols-outlined text-base">star</span>
              <span>Feedback</span>
            </button>
          </div>

          <div class="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
            <ng-container *ngIf="messages().length; else emptyState">
              <div
                *ngFor="let m of messages()"
                class="flex items-end gap-3"
                [ngClass]="m.role === 'user'
                    ? 'flex-row-reverse justify-start'
                    : 'flex-row justify-start'">
                <div
                  *ngIf="m.role === 'assistant'"
                  class="bg-center bg-cover rounded-full w-10 h-10 border border-gray-200 dark:border-gray-700"
                  style="background-image:url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDDMfLTIq8NNsO5wHR_mxvRqi19WGMizrbCvE6lAxL3P9Gu633ywXnwJtfPPrATPNRul0YZ99wTZCHDQCs9hHufljxZ71MZyYhcJYD7slJGg9NqFQFX0o_bFX7MMNln63l9dY3K3QEKIq430dJRxgx56W0PJwE5avUKU0h_uYx3ePzWKePsWXKQWmLDd8QerQAkrWQ5mdDyEXmvMwtfTnxt49m_9z5Tm9leu15pE4dlhMoeihJveoXRWQsd0pJ90C4cZjh1P1hvJ8');"></div>

                <div
                  class="flex flex-col gap-1 max-w-[80%]"
                  [ngClass]="m.role === 'user' ? 'items-end' : 'items-start'">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ m.role === 'user' ? 'You' : 'Help Desk AI' }}
                  </p>

                  <p
                    class="text-sm rounded-lg px-4 py-2.5 whitespace-pre-wrap"
                    [ngClass]="m.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200'">
                    {{ m.text }}
                  </p>
                </div>
              </div>
            </ng-container>

            <ng-template #emptyState>
              <div
                class="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 gap-2">
                <span class="material-symbols-outlined text-4xl mb-2"
                  >support_agent</span
                >
                <p class="text-sm">Empieza la conversación con tu asistente.</p>
                <p class="text-xs">Escribe tu primera pregunta abajo</p>
              </div>
            </ng-template>
          </div>

          <form
            class="flex items-center p-4 gap-3 border-t border-gray-200 dark:border-gray-800"
            (ngSubmit)="send()">
            <label class="flex flex-col min-w-40 h-12 flex-1">
              <div class="flex w-full items-stretch rounded-lg h-full">
                <input
                  class="form-input flex-1 rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 h-full px-4 rounded-r-none border-r-0 text-sm"
                  placeholder="Ask a question..."
                  autocomplete="off"
                  name="message"
                  [(ngModel)]="input" />

                <div
                  class="flex items-center justify-center pr-2 rounded-r-lg bg-gray-100 dark:bg-gray-800/50 gap-1">
                  <button
                    type="button"
                    class="flex items-center justify-center h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-primary"
                    *ngIf="!streaming()">
                    <span class="material-symbols-outlined">attach_file</span>
                  </button>

                  <button
                    type="button"
                    class="flex items-center justify-center h-8 w-8 text-red-500 hover:text-red-400"
                    *ngIf="streaming()"
                    (click)="stop()">
                    <span class="material-symbols-outlined">stop_circle</span>
                  </button>

                  <button
                    type="submit"
                    class="min-w-[84px] rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium flex gap-2 items-center justify-center disabled:opacity-60"
                    [disabled]="!input.trim() || streaming()">
                    <span class="truncate">Send</span>
                    <span class="material-symbols-outlined text-base">
                      {{ streaming() ? 'sync' : 'send' }}
                    </span>
                  </button>
                </div>
              </div>
            </label>
          </form>
        </div>
      </section>
    </div>

    <ng-container *ngIf="showFeedbackModal()">
      <div
        (click)="closeFeedback()"
        class="fixed inset-0 z-40 bg-black/50 dark:bg-black/70">
      </div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

        <div class="w-full max-w-lg rounded-xl bg-[#f6f7f8] dark:bg-[#111a22] shadow-2xl dark:shadow-black/50 overflow-hidden">

          <div class="flex items-start justify-between border-b border-gray-200 dark:border-gray-800 p-6">
            <div class="flex flex-col gap-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Rate your experience</h1>
              <p class="text-base text-gray-500 dark:text-gray-400">How was your interaction with the Help Desk AI?</p>
            </div>
            <button (click)="closeFeedback()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <span class="material-symbols-outlined !text-2xl">close</span>
            </button>
          </div>

          <div class="p-6">
            <div class="flex flex-col gap-6">
              <label class="flex flex-col w-full">
                <p class="pb-2 text-base font-medium text-gray-900 dark:text-white">Your feedback</p>
                <textarea class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#192633] p-4 text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30" placeholder="Tell us what you liked or what could be improved..." rows="4"></textarea>
              </label>

              <div>
                <p class="pb-4 text-base font-medium text-gray-900 dark:text-white">Overall rating</p>
                <div class="grid grid-cols-5 gap-3 text-center">
                  <div class="flex cursor-pointer flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                    <span class="material-symbols-outlined !text-3xl text-red-500">star</span>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Very bad</p>
                  </div>
                  <div class="flex cursor-pointer flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                    <span class="material-symbols-outlined !text-3xl text-red-500">star</span>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Bad</p>
                  </div>
                  <div class="flex cursor-pointer flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
                    <span class="material-symbols-outlined !text-3xl filled text-yellow-400">star</span>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Good</p>
                  </div>
                  <div class="flex cursor-pointer flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">
                    <span class="material-symbols-outlined !text-3xl text-green-500">star</span>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Very good</p>
                  </div>
                  <div class="flex cursor-pointer flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">
                    <span class="material-symbols-outlined !text-3xl text-green-500">star</span>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Excellent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-row-reverse items-center justify-start gap-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20 p-6">
            <button class="rounded-lg bg-primary px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-primary/90">
              Submit
            </button>
            <button
              type="button"
              (click)="closeFeedback()"
              class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-5 py-2.5 text-base font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800/50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class ChatComponent {
  input = '';
  messages = signal<Msg[]>([]);
  streaming = signal(false);

  showFeedbackModal = signal(false);

  constructor(private chat: RagChatService) {}

  openFeedback() {
    this.showFeedbackModal.set(true);
  }

  closeFeedback() {
    this.showFeedbackModal.set(false);
  }

  async send() {
    const text = this.input.trim();
    if (!text) return;

    this.input = '';

    // agrega mensaje del usuario y placeholder de asistente
    this.messages.update((arr) => [
      ...arr,
      { role: 'user', text },
      { role: 'assistant', text: '' },
    ]);

    const assistantIndex = this.messages().length - 1;
    this.streaming.set(true);

    this.chat.streamMessage(text).subscribe({
      next: (chunk: RagChunk) => {
        if (chunk.text) {
          const prev = this.messages()[assistantIndex]?.text ?? '';
          const updated = prev + chunk.text;

          this.messages.update((arr) => {
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
        this.messages.update((arr) => [
          ...arr,
          {
            role: 'assistant',
            text: `Error: ${err?.message ?? err}`,
          },
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
