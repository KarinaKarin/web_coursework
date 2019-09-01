import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage = localStorage;

  constructor() { }

  public getObjectItem<T>(key: string): T | undefined {
    const value = this._storage.getItem(key);

    return value ? JSON.parse(value) : undefined;
  }

  public getStringItem(key: string): string | undefined {
    return this._storage.getItem(key);
  }

  public setObjectItem<T>(key: string, item: T): void {
    this._storage.setItem(key, JSON.stringify(item));
  }

  public setStringItem<T>(key: string, item: string): void {
    this._storage.setItem(key, item);
  }

  public removeItem(key: string): void {
    this._storage.removeItem(key);
  }
}
