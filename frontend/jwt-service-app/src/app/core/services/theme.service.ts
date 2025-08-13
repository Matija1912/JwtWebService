import {Injectable, OnInit} from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  constructor() {
  }

  private currentTheme: Theme = 'light';

  init() {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    this.setTheme(savedTheme ? savedTheme : 'light');
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    const root = document.documentElement;
    if (this.currentTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

}
