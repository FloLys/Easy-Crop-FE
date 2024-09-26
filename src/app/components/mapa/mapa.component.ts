import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { BackendService } from '../../services/backend.service';
import { WeatherService } from '../../services/weather.service';

// Sobrescribir las opciones de íconos predeterminados de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  map: any;
  currentLat: number;
  currentLng: number;
  selectedLat: number;
  selectedLng: number;
  weatherData: any;
  previousMarker: any; // Variable para almacenar el marcador anterior

  constructor(private backendService: BackendService, private weatherService: WeatherService) {}

  ngOnInit() {
    this.getCurrentLocation().then((position: any) => {
      this.currentLat = position.coords.latitude;
      this.currentLng = position.coords.longitude;
      this.loadMap();
      this.getWeatherData(this.currentLat, this.currentLng);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  // Cargar el mapa con la ubicación actual
  loadMap() {
    this.map = L.map('map').setView([this.currentLat, this.currentLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.currentLat, this.currentLng]).addTo(this.map)
      .bindPopup('You are here')
      .openPopup();

    // Escuchar clics en el mapa para seleccionar una ubicación
    this.map.on('click', (e: { latlng: { lat: any; lng: any; }; }) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.selectedLat = lat;
      this.selectedLng = lng;

      // Eliminar el marcador anterior si existe
      if (this.previousMarker) {
        this.map.removeLayer(this.previousMarker);
      }

      // Agregar el nuevo marcador
      this.previousMarker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`Selected location: ${lat}, ${lng}`)
        .openPopup();

      // Obtener el clima para la ubicación seleccionada
      this.getWeatherData(lat, lng);
    });
  }

  // Obtener la ubicación actual usando la API de Geolocation
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      } else {
        reject('Geolocation not supported');
      }
    });
  }

  // Obtener datos climáticos para las coordenadas dadas
  getWeatherData(lat: number, lon: number) {
    this.weatherService.getWeather(lat, lon).subscribe(data => {
      this.weatherData = data;
      console.log('Weather Data:', this.weatherData);
    }, error => {
      console.log('Error getting weather data', error);
    });
  }

  // Enviar la ubicación seleccionada junto con los datos climáticos al backend
  sendSelectedLocation() {
    if (this.selectedLat && this.selectedLng && this.weatherData) {
      const payload = {
        latitude: this.selectedLat,
        longitude: this.selectedLng,
        weather: {
          temperature: this.weatherData.main.temp,
          humidity: this.weatherData.main.humidity,
          windSpeed: this.weatherData.wind.speed,
          windDirection: this.weatherData.wind.deg
        }
      };

      this.backendService.sendLocation(payload).subscribe(
        response => console.log('Location and weather sent successfully'),
        error => console.log('Error sending data', error)
      );
    }
  }
}
