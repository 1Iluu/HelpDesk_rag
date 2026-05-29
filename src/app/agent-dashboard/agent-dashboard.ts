import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketApi, SupportTicketDto } from '../api/ticket.api';

@Component({
  standalone: true,
  selector: 'app-agent-dashboard',
  imports: [CommonModule],
  host: { class: 'flex flex-col flex-1 min-h-0' },
  template: `
    <div class="flex-1 flex flex-col min-h-0 bg-[#f6f7f8] dark:bg-[#0d131a]">
      <header class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 h-16 bg-white dark:bg-[#111a22]">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h2>
        <button (click)="loadTickets()" class="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:text-primary">
          <span class="material-symbols-outlined text-xl">refresh</span>
        </button>
      </header>

      <section class="flex-1 min-h-0 p-6 overflow-auto">
        <div class="bg-white dark:bg-[#111a22] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tickets Escalados</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Gestiona las solicitudes de soporte técnico que requieren atención humana.</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th class="px-6 py-4 font-medium">Ticket ID</th>
                  <th class="px-6 py-4 font-medium">Session ID</th>
                  <th class="px-6 py-4 font-medium w-1/2">Resumen de IA</th>
                  <th class="px-6 py-4 font-medium">Estado</th>
                  <th class="px-6 py-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                <tr *ngFor="let t of tickets()" class="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td class="px-6 py-4 text-gray-900 dark:text-gray-300">#{{ t.idTicket }}</td>
                  <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{{ (t.chatSession?.id || t.chatSessionId || '').substring(0, 8) }}...</td>
                  <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ t.aiSummary }}</td>
                  <td class="px-6 py-4">
                    <span [ngClass]="t.status === 'OPEN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'" 
                          class="px-2.5 py-1 rounded-full text-xs font-medium">
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button *ngIf="t.status === 'OPEN'" (click)="cerrarTicket(t.idTicket!)" 
                            class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">
                      Resolver
                    </button>
                    <span *ngIf="t.status !== 'OPEN'" class="text-gray-400 text-xs material-symbols-outlined">check_circle</span>
                  </td>
                </tr>
                <tr *ngIf="tickets().length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No hay tickets pendientes. ¡Buen trabajo! 
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>
    </div>
  `
})
export class AgentDashboardComponent implements OnInit {
  tickets = signal<SupportTicketDto[]>([]);

  constructor(private ticketApi: TicketApi) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketApi.getTickets().subscribe({
      next: (data) => {
        // Ordenamos para que los abiertos salgan primero
        data.sort((a, b) => (a.status === 'OPEN' ? -1 : 1));
        this.tickets.set(data);
      },
      error: (err) => console.error('Error cargando tickets', err)
    });
  }

  cerrarTicket(id: number) {
    if(confirm('¿Estás seguro de marcar este ticket como resuelto?')) {
      this.ticketApi.cerrarTicket(id).subscribe({
        next: () => {
          this.loadTickets(); // Recargamos la tabla
        },
        error: (err) => console.error('Error cerrando ticket', err)
      });
    }
  }
}