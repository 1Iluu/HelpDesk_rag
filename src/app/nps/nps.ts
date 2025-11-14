import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-nps',
  imports: [CommonModule],
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
        <div class="flex items-center gap-4"></div>
      </header>

      <!-- Overall rating + barras -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 lg:col-span-2">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 class="text-text-light dark:text-text-dark text-xl font-semibold">Overall Rating</h3>
            <div class="flex flex-wrap items-center gap-2">
              <button class="h-9 px-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">7 Days</button>
              <button class="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark text-sm text-text-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark">1 Month</button>
              <div class="relative">
                <div class="flex items-center h-9 w-full cursor-pointer rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark pl-3 pr-2 text-left text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span class="material-symbols-outlined !text-xl mr-2">calendar_today</span>
                  <span class="flex-1">Custom Range</span>
                  <span class="material-symbols-outlined !text-xl ml-2">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-5">
            <!-- Excellent 50% -->
            <div class="flex items-center gap-4">
              <div class="flex items-center w-48 text-base">
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="ml-3 text-text-light dark:text-text-dark font-medium">Excellent</span>
              </div>
              <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
                <div class="bg-promoter h-4 rounded-full" [style.width.%]="50"></div>
              </div>
              <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">50%</div>
            </div>

            <!-- Very Good 25% -->
            <div class="flex items-center gap-4">
              <div class="flex items-center w-48 text-base">
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-promoter !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="ml-3 text-text-light dark:text-text-dark font-medium">Very Good</span>
              </div>
              <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
                <div class="bg-promoter h-4 rounded-full" [style.width.%]="25"></div>
              </div>
              <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">25%</div>
            </div>

            <!-- Good 15% -->
            <div class="flex items-center gap-4">
              <div class="flex items-center w-48 text-base">
                <span class="material-symbols-outlined text-passive !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-passive !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-passive !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="ml-3 text-text-light dark:text-text-dark font-medium">Good</span>
              </div>
              <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
                <div class="bg-passive h-4 rounded-full" [style.width.%]="15"></div>
              </div>
              <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">15%</div>
            </div>

            <!-- Bad 7% -->
            <div class="flex items-center gap-4">
              <div class="flex items-center w-48 text-base">
                <span class="material-symbols-outlined text-detractor !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-detractor !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="ml-3 text-text-light dark:text-text-dark font-medium">Bad</span>
              </div>
              <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
                <div class="bg-detractor h-4 rounded-full" [style.width.%]="7"></div>
              </div>
              <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">7%</div>
            </div>

            <!-- Very Bad 3% -->
            <div class="flex items-center gap-4">
              <div class="flex items-center w-48 text-base">
                <span class="material-symbols-outlined text-detractor !text-2xl" style="font-variation-settings:'FILL' 1">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="material-symbols-outlined text-border-light dark:text-border-dark !text-2xl">star</span>
                <span class="ml-3 text-text-light dark:text-text-dark font-medium">Very Bad</span>
              </div>
              <div class="flex-1 bg-background-light dark:bg-background-dark rounded-full h-4">
                <div class="bg-detractor h-4 rounded-full" [style.width.%]="3"></div>
              </div>
              <div class="w-20 text-right text-text-light dark:text-text-dark font-semibold text-lg">3%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donuts + NPS score -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:col-span-2">
        <!-- Promoters -->
        <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
          <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">Promoters</h3>
          <div class="relative w-32 h-32">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path class="text-background-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
              <path class="text-promoter" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="75, 100" stroke-linecap="round" stroke-width="3"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-text-dark">75%</span>
              <span class="text-sm text-text-secondary-dark">150</span>
            </div>
          </div>
        </div>

        <!-- Passives -->
        <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
          <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">Passives</h3>
          <div class="relative w-32 h-32">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path class="text-background-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
              <path class="text-passive" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="15, 100" stroke-linecap="round" stroke-width="3"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-text-dark">15%</span>
              <span class="text-sm text-text-secondary-dark">30</span>
            </div>
          </div>
        </div>

        <!-- Detractors -->
        <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
          <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">Detractors</h3>
          <div class="relative w-32 h-32">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path class="text-background-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
              <path class="text-detractor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="10, 100" stroke-linecap="round" stroke-width="3"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-text-dark">10%</span>
              <span class="text-sm text-text-secondary-dark">20</span>
            </div>
          </div>
        </div>

        <!-- NPS Score -->
        <div class="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 flex flex-col items-center justify-center">
          <h3 class="text-text-light dark:text-text-dark text-lg font-semibold mb-4">NPS Score</h3>
          <div class="relative w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
            <span class="text-5xl font-bold text-primary">65</span>
          </div>
          <p class="text-center text-text-secondary-dark text-sm mt-4">Based on 200 responses</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class NPS {}


