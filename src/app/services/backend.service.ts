import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  sendLocation(payload: any): Observable<any> {
    return this.http.post('34.134.224.247', payload);
  }

  
}
