import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  sendLocation(payload: any): Observable<any> {
    return this.http.post('http://34.69.23.77/add_location', payload);
  }

  
}
