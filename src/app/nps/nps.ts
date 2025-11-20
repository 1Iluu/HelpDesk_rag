import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackApi, FeedbackStatsDto } from '../api/feedback.api';
@Component({
  standalone: true,
  selector: 'app-nps',
  imports: [CommonModule,FormsModule],
  host: { class: 'flex flex-col flex-1 min-h-0' },
  template: `
  <!-- Área scrolleable de la página -->
<div class="flex-1 min-h-0 overflow-y-auto">
  <div class="p-8 space-y-6">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">
          NPS Metrics Dashboard
        </h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark">
          Real-time analysis of customer satisfaction.
        </p>
      </div>

      <!-- Filtro por mes -->
      <div class="flex items-center gap-3">
        <div class="flex flex-col">
          <label class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Month</label>
          <select
            class="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm text-text-light dark:text-text-secondary-dark"
            [(ngModel)]="selectedMonth"
            (ngModelChange)="onMonthOrYearChange()">
            <option *ngFor="let m of months" [value]="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Year</label>
          <select
            class="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm text-text-light dark:text-text-secondary-dark"
            [(ngModel)]="selectedYear"
            (ngModelChange)="onMonthOrYearChange()">
            <option *ngFor="let y of years" [value]="y">
              {{ y }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <div *ngIf="loading()" class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
      Loading metrics...
    </div>
    <div *ngIf="error()" class="text-sm text-red-500">
      {{ error() }}
    </div>

    <!-- Overall rating + barras -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" *ngIf="!loading()">
      <div class="flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 lg:col-span-2">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 class="text-text-light dark:text-text-dark text-xl font-semibold">Overall Rating</h3>
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Total responses: {{ total }}
          </p>
        </div>

        <div class="space-y-5">
          <!-- Excellent (5 stars) -->
          <div class="flex items-center gap-4">
            <div class="flex items-center w-48 text-base">
              <span *ngFor="let s of [1,2,3,4,5]" class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">
                star
              </span>
              <span class="ml-3 text-text-light dark:text-text-dark font-medium">Excellent</span>
            </div>
            <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
              <div class="bg-promoter h-4 rounded-full" [style.width.%]="getRatingPercentage(5)"></div>
            </div>
            <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">
              {{ getRatingPercentage(5) | number:'1.0-0' }}%
            </div>
          </div>

          <!-- Very Good (4 stars) -->
          <div class="flex items-center gap-4">
            <div class="flex items-center w-48 text-base">
              <span *ngFor="let s of [1,2,3,4]" class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">
                star
              </span>
              <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">
                star
              </span>
              <span class="ml-3 text-text-light dark:text-text-dark font-medium">Very Good</span>
            </div>
            <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
              <div class="bg-promoter h-4 rounded-full" [style.width.%]="getRatingPercentage(4)"></div>
            </div>
            <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">
              {{ getRatingPercentage(4) | number:'1.0-0' }}%
            </div>
          </div>

          <!-- Good (3 stars) -->
          <div class="flex items-center gap-4">
            <div class="flex items-center w-48 text-base">
              <span *ngFor="let s of [1,2,3]" class="material-symbols-outlined text-passive !text-2xl" style="font-variation-settings:'FILL' 1">
                star
              </span>
              <span *ngFor="let s of [1,2]" class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">
                star
              </span>
              <span class="ml-3 text-text-light dark:text-text-dark font-medium">Good</span>
            </div>
            <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
              <div class="bg-passive h-4 rounded-full" [style.width.%]="getRatingPercentage(3)"></div>
            </div>
            <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">
              {{ getRatingPercentage(3) | number:'1.0-0' }}%
            </div>
          </div>

          <!-- Bad (2 stars) -->
          <div class="flex items-center gap-4">
            <div class="flex items-center w-48 text-base">
              <span *ngFor="let s of [1,2]" class="material-symbols-outlined text-detractor !text-2xl" style="font-variation-settings:'FILL' 1">
                star
              </span>
              <span *ngFor="let s of [1,2,3]" class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">
                star
              </span>
              <span class="ml-3 text-text-light dark:text-text-dark font-medium">Bad</span>
            </div>
            <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
              <div class="bg-detractor h-4 rounded-full" [style.width.%]="getRatingPercentage(2)"></div>
            </div>
            <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">
              {{ getRatingPercentage(2) | number:'1.0-0' }}%
            </div>
          </div>

          <!-- Very Bad (1 star) -->
          <div class="flex items-center gap-4">
            <div class="flex items-center w-48 text-base">
              <span class="material-symbols-outlined text-detractor !text-2xl" style="font-variation-settings:'FILL' 1">
                star
              </span>
              <span *ngFor="let s of [1,2,3,4]" class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">
                star
              </span>
              <span class="ml-3 text-text-light dark:text-text-dark font-medium">Very Bad</span>
            </div>
            <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
              <div class="bg-detractor h-4 rounded-full" [style.width.%]="getRatingPercentage(1)"></div>
            </div>
            <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">
              {{ getRatingPercentage(1) | number:'1.0-0' }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Donuts + NPS score -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:col-span-2" *ngIf="!loading()">
      <!-- Promoters -->
      <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
        <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">Promoters</h3>
        <div class="relative w-32 h-32">
          <svg class="w-full h-full" viewBox="0 0 36 36">
            <path class="text-background-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
            <path class="text-promoter"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  [attr.stroke-dasharray]="promotersPercentage + ', 100'"
                  stroke-linecap="round"
                  stroke-width="3"></path>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-text-dark">
              {{ promotersPercentage | number:'1.0-0' }}%
            </span>
            <span class="text-sm text-text-secondary-dark">
              {{ stats()?.promoters || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Passives -->
      <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
        <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">Passives</h3>
        <div class="relative w-32 h-32">
          <svg class="w-full h-full" viewBox="0 0 36 36">
            <path class="text-background-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
            <path class="text-passive"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  [attr.stroke-dasharray]="passivesPercentage + ', 100'"
                  stroke-linecap="round"
                  stroke-width="3"></path>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-text-dark">
              {{ passivesPercentage | number:'1.0-0' }}%
            </span>
            <span class="text-sm text-text-secondary-dark">
              {{ stats()?.passives || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Detractors -->
      <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
        <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">Detractors</h3>
        <div class="relative w-32 h-32">
          <svg class="w-full h-full" viewBox="0 0 36 36">
            <path class="text-background-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
            <path class="text-detractor"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  [attr.stroke-dasharray]="detractorsPercentage + ', 100'"
                  stroke-linecap="round"
                  stroke-width="3"></path>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-text-dark">
              {{ detractorsPercentage | number:'1.0-0' }}%
            </span>
            <span class="text-sm text-text-secondary-dark">
              {{ stats()?.detractors || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- NPS Score -->
      <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
        <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">NPS Score</h3>
        <div class="relative w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
          <span class="text-5xl font-bold text-primary">{{ npsScore }}</span>
        </div>
        <p class="text-center text-text-secondary-dark text-sm mt-4">
          Based on {{ total }} responses
        </p>
      </div>
    </div>
  </div>
</div>


  `
})

export class NPS implements OnInit {
  stats = signal<FeedbackStatsDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // filtro por mes
  selectedMonth: number;
  selectedYear: number;
  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  years: number[] = [];

  constructor(private feedbackApi: FeedbackApi) {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();
    this.years = [now.getFullYear(), now.getFullYear() - 1];
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.error.set(null);

    this.feedbackApi.getMonthlyStats(this.selectedYear, this.selectedMonth)
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudieron cargar las métricas.');
          this.loading.set(false);
        }
      });
  }

  onMonthOrYearChange(): void {
    this.loadStats();
  }

  // helpers

  get total(): number {
    return this.stats()?.total ?? 0;
  }

  private safePercent(count: number): number {
    if (!this.total) return 0;
    return (count * 100) / this.total;
  }

  get promotersPercentage(): number {
    return this.safePercent(this.stats()?.promoters ?? 0);
  }

  get passivesPercentage(): number {
    return this.safePercent(this.stats()?.passives ?? 0);
  }

  get detractorsPercentage(): number {
    return this.safePercent(this.stats()?.detractors ?? 0);
  }

  getRatingCount(stars: number): number {
    const s = this.stats();
    if (!s) return 0;
    switch (stars) {
      case 1: return s.rating1;
      case 2: return s.rating2;
      case 3: return s.rating3;
      case 4: return s.rating4;
      case 5: return s.rating5;
      default: return 0;
    }
  }

  getRatingPercentage(stars: number): number {
    return this.safePercent(this.getRatingCount(stars));
  }

  // NPS = %Promoters - %Detractors
  get npsScore(): number {
    if (!this.total) return 0;
    return Math.round(this.promotersPercentage - this.detractorsPercentage);
  }
}
