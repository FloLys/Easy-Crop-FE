import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  getWeather(lat: number, lon: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {}

  getWeatherFromMeteomatics(lat: number, lon: number): Observable<any> {
    const username = 'tcs_irigoyen_leandro';
    const password = 'WBs23p36Vf';
    
    const validDateTime = '2024-10-04T00:00:00Z'; // Fecha y hora de ejemplo
    const parameters = [
      'wind_speed_10m:ms',
      'wind_dir_10m:d',
      't_2m:C',
      't_max_2m_24h:C',
      't_min_2m_24h:C',
      'msl_pressure:hPa',
      'precip_1h:mm',
      'precip_24h:mm',
      'sunrise:sql',
      'sunset:sql'
    ].join(',');

    const location = `${lat},${lon}`; // Coordenadas
    const format = 'json'; // Formato de respuesta

    const url = `https://api.meteomatics.com/${validDateTime}/${parameters}/${location}/${format}`;

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(username + ':' + password)}`
    });

    return this.http.get(url, { headers });
  }
}
