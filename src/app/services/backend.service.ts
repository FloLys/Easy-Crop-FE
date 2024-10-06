import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  sendData(dataToSend: { latitude: number; longitude: number; cropSize: number; weatherData: any; }) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  sendLocation(payload: any): Observable<any> {
    return this.http.post('http://34.69.23.77/weather_growth_analytic', payload);
  }

  
}
