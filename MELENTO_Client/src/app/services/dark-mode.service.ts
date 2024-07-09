import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkMode: boolean = false;

  constructor() {
    this.isDarkMode = this.getDarkModeFromLocalStorage();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setDarkModeInLocalStorage(this.isDarkMode);
  }

  getDarkMode(): boolean {
    return this.isDarkMode;
  }

  private getDarkModeFromLocalStorage(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  }

  private setDarkModeInLocalStorage(isDarkMode: boolean): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode.toString());
    }
  }
}
