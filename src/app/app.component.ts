import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

export interface DayInfo {
  day: string;
  date: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  times: string[] = [
    '08:00 - 13:00',
    '13:00 - 18:00',
    '18:00 - 23:00',
    '23:00 - 08:00',
  ];
  schedule: { [key: string]: string } = {};
  currentDate: Date = new Date(new Date().getFullYear(), 2);
  daysInMonth: DayInfo[] = [];

  constructor() {
    this.generateDaysInMonth();
  }

  private generateDaysInMonth(): void {
    const year: number = this.currentDate.getFullYear();
    const month: number = this.currentDate.getMonth();
    const numberOfDays: number = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = Array.from({ length: numberOfDays }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        day: date.toLocaleString('sv-SE', { weekday: 'long' }),
        date: this.formatDate(date),
      };
    });
  }

  private formatDate(date: Date): string {
    const dayName: string = date.toLocaleString('sv-SE', { weekday: 'long' });
    const monthName: string = date.toLocaleString('sv-SE', { month: 'long' });
    const dayNumber: number = date.getDate();
    return `<b>${dayName}</b> <br/> ${dayNumber} ${monthName}`;
  }

  selectCell(date: string, time: string): void {
    const key: string = this.createScheduleKey(date, time);
    this.schedule[key] = this.schedule[key] === 'M' ? '' : 'M';
  }

  getName(date: string, time: string): string {
    return this.schedule[this.createScheduleKey(date, time)] || '';
  }

  goToNextMonth(): void {
    this.changeMonth(1);
  }

  goToPreviousMonth(): void {
    if (this.currentDate.getMonth() > 2) {
      this.changeMonth(-1);
    }
  }

  private changeMonth(delta: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.generateDaysInMonth();
  }

  private createScheduleKey(date: string, time: string): string {
    return `${date}_${time}`;
  }

  get showPreviousMonthButton(): boolean {
    return this.currentDate.getMonth() > 2;
  }

  get previousMonthName(): string {
    return this.getMonthName(-1);
  }

  get nextMonthName(): string {
    return this.getMonthName(1);
  }

  private getMonthName(delta: number): string {
    let adjustedDate: Date = new Date(this.currentDate);
    adjustedDate.setMonth(adjustedDate.getMonth() + delta);
    const monthName: string = adjustedDate.toLocaleString('sv-SE', {
      month: 'long',
    });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }
}
