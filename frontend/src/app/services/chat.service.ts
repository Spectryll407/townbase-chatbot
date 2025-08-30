import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

export interface ChatResponse {
  reply: string;
  events: {
    id: string;
    name: string;
    start: string;
    end?: string | null;
    url?: string | null;
    location?: string | null;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  askBot(query: string): Observable<ChatResponse> {
    let params = new HttpParams().set('query', query);
    return this.http.get<ChatResponse>(`${this.apiUrl}/chat`, { params });
  }
}
