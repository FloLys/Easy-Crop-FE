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
  greenLayer: any; // Capa verde para el territorio
  zoomThreshold = 10; // Nivel de zoom para cambiar la capa

  constructor(private backendService: BackendService, private weatherService: WeatherService) {}

  ngOnInit() {
    this.getCurrentLocation().then((position: any) => {
      this.currentLat = position.coords.latitude;
      this.currentLng = position.coords.longitude;
      this.loadMap();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadMap() {
    // Inicializar el mapa
    this.map = L.map('map').setView([this.currentLat, this.currentLng], 13);

    // Añadir capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    // Añadir marcador en la ubicación actual
    L.marker([this.currentLat, this.currentLng]).addTo(this.map)
      .bindPopup('You are here')
      .openPopup();

    // Cargar la capa GeoJSON de las áreas terrestres
    this.loadLandGeoJSON();

    // Escuchar el evento 'zoomend' para aplicar o remover la capa verde
    this.map.on('zoomend', () => {
      this.handleZoomChange();
    });

    // Inicialmente controlar el zoom para ver si se debe agregar la capa verde
    this.handleZoomChange();
  }

  // Cargar el GeoJSON de áreas terrestres
  loadLandGeoJSON() {
    // Este es un ejemplo simplificado. Reemplaza 'landGeoJsonData' con tus datos GeoJSON reales.
    const landGeoJsonData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-130, 50],  // Coordenadas de un polígono representando tierra
                [-120, 50],
                [-120, 40],
                [-130, 40],
                [-130, 50]
              ]
            ]
          },
          properties: { name: "North America" }
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [0, 60],    // Coordenadas de otro polígono
                [10, 60],
                [10, 50],
                [0, 50],
                [0, 60]
              ]
            ]
          },
          properties: { name: "Northern Europe" }
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-10, 30],
                [10, 30],
                [10, 20],
                [-10, 20],
                [-10, 30]  // Un polígono en el mar Mediterráneo
              ]
            ]
          },
          properties: { name: "Mediterranean Area" }
        }
      ]
    };
    

    this.greenLayer = L.geoJSON(landGeoJsonData, {
      style: {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
      }
    });
  }

  // Controlar el cambio de zoom
  handleZoomChange() {
    const zoomLevel = this.map.getZoom();
    console.log('Current Zoom Level:', zoomLevel);

    if (zoomLevel <= this.zoomThreshold) {
      // Añadir la capa verde si el zoom es bajo
      if (!this.map.hasLayer(this.greenLayer)) {
        this.greenLayer.addTo(this.map);
      }
    } else {
      // Remover la capa verde si el zoom es alto
      if (this.map.hasLayer(this.greenLayer)) {
        this.map.removeLayer(this.greenLayer);
      }
    }
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

