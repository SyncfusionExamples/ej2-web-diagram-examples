import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LayoutNode } from '../types/layout.types';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly API_URL = 'http://localhost:5000/api/layout';

  constructor(private http: HttpClient) {}

  fetchLayoutData(): Observable<LayoutNode[]> {
    return this.http.get<LayoutNode[]>(this.API_URL);
  }
}