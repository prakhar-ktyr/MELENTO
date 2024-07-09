import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private authStatusSubject: BehaviorSubject<boolean>;
  public authStatus$: Observable<boolean>;

  constructor() {
    const isLoggedIn = this.isLocalStorageAvailable() && !!localStorage.getItem('username');
    this.authStatusSubject = new BehaviorSubject<boolean>(isLoggedIn);
    this.authStatus$ = this.authStatusSubject.asObservable();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
      if (key === 'username') {
        this.authStatusSubject.next(true);
      }
    }
  }

  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
      if (key === 'username') {
        this.authStatusSubject.next(false);
      }
    }
  }

  clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
      this.authStatusSubject.next(false);
    }
  }
}
