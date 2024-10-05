import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BackendService } from '../../services/backend.service';
import { WeatherService } from '../../services/weather.service';
import * as worldGeoJSON from '../../../assets/geojson/continents.geojson.json'; // Archivo GeoJSON para los continentes

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any;
  currentLat: number;
  currentLng: number;
  selectedLat: number;
  selectedLng: number;
  weatherData: any;
  previousMarker: any;
  continentLayer: any;

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
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    this.map = L.map('map', {
      center: [this.currentLat, this.currentLng],
      zoom: 13,
      minZoom: 2,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
      noWrap: true
    }).addTo(this.map);

    // Crear la capa de continentes
    this.continentLayer = L.geoJSON((worldGeoJSON as any), {
      style: (feature) => ({
        color: '#000',
        weight: 2,
        fillColor: 'green',
        fillOpacity: 0.7
      })
    });

    this.map.on('zoomend', () => {
      const zoomLevel = this.map.getZoom();
      if (zoomLevel <= 10) {
        if (!this.map.hasLayer(this.continentLayer)) {
          this.continentLayer.addTo(this.map);
        }
      } else {
        if (this.map.hasLayer(this.continentLayer)) {
          this.map.removeLayer(this.continentLayer);
        }
      }
    });

    L.marker([this.currentLat, this.currentLng]).addTo(this.map)
      .bindPopup('You are here')
      .openPopup();

    this.map.on('click', (e: { latlng: { lat: any; lng: any; }; }) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.selectedLat = lat;
      this.selectedLng = lng;

      if (this.previousMarker) {
        this.map.removeLayer(this.previousMarker);
      }

      this.previousMarker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`Selected location: ${lat}, ${lng}`)
        .openPopup();

      this.getWeatherData(lat, lng);
    });
  }

  // Obtener la ubicación actual
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

  // Obtener datos climáticos
  getWeatherData(lat: number, lon: number) {
    this.weatherService.getWeatherFromMeteomatics(lat, lon).subscribe(data => {
      this.weatherData = data;
      console.log('Weather Data:', this.weatherData);

      const windSpeed = this.weatherData.data.find((d: any) => d.parameter === 'wind_speed_10m:ms')?.coordinates[0].dates[0].value;
      const windDirection = this.weatherData.data.find((d: any) => d.parameter === 'wind_dir_10m:d')?.coordinates[0].dates[0].value;
      const temperature = this.weatherData.data.find((d: any) => d.parameter === 't_2m:C')?.coordinates[0].dates[0].value;
      const maxTemperature = this.weatherData.data.find((d: any) => d.parameter === 't_max_2m_24h:C')?.coordinates[0].dates[0].value;
      const minTemperature = this.weatherData.data.find((d: any) => d.parameter === 't_min_2m_24h:C')?.coordinates[0].dates[0].value;
      const pressure = this.weatherData.data.find((d: any) => d.parameter === 'msl_pressure:hPa')?.coordinates[0].dates[0].value;
      const precip1h = this.weatherData.data.find((d: any) => d.parameter === 'precip_1h:mm')?.coordinates[0].dates[0].value;
      const precip24h = this.weatherData.data.find((d: any) => d.parameter === 'precip_24h:mm')?.coordinates[0].dates[0].value;
      const sunrise = this.weatherData.data.find((d: any) => d.parameter === 'sunrise:sql')?.coordinates[0].dates[0].value;
      const sunset = this.weatherData.data.find((d: any) => d.parameter === 'sunset:sql')?.coordinates[0].dates[0].value;

      console.log('Wind Speed (10m):', windSpeed);
      console.log('Wind Direction (10m):', windDirection);
      console.log('Temperature (2m):', temperature);
      console.log('Max Temperature (24h):', maxTemperature);
      console.log('Min Temperature (24h):', minTemperature);
      console.log('Pressure (MSL):', pressure);
      console.log('Precipitation (1h):', precip1h);
      console.log('Precipitation (24h):', precip24h);
      console.log('Sunrise:', new Date(sunrise).toLocaleTimeString());
      console.log('Sunset:', new Date(sunset).toLocaleTimeString());

    }, error => {
      console.log('Error getting weather data', error);
    });
  }

  // Enviar ubicación seleccionada
  sendSelectedLocation() {
    if (this.selectedLat && this.selectedLng && this.weatherData) {
      const temperature = this.weatherData.data.find((d: any) => d.parameter === 't_2m:C')?.coordinates[0].dates[0].value;
      const maxTemperature = this.weatherData.data.find((d: any) => d.parameter === 't_max_2m_24h:C')?.coordinates[0].dates[0].value;
      const minTemperature = this.weatherData.data.find((d: any) => d.parameter === 't_min_2m_24h:C')?.coordinates[0].dates[0].value;
      const windSpeed = this.weatherData.data.find((d: any) => d.parameter === 'wind_speed_10m:ms')?.coordinates[0].dates[0].value;
      const windDirection = this.weatherData.data.find((d: any) => d.parameter === 'wind_dir_10m:d')?.coordinates[0].dates[0].value;
      const pressure = this.weatherData.data.find((d: any) => d.parameter === 'msl_pressure:hPa')?.coordinates[0].dates[0].value;
      const precip1h = this.weatherData.data.find((d: any) => d.parameter === 'precip_1h:mm')?.coordinates[0].dates[0].value;
      const precip24h = this.weatherData.data.find((d: any) => d.parameter === 'precip_24h:mm')?.coordinates[0].dates[0].value;
      const sunrise = this.weatherData.data.find((d: any) => d.parameter === 'sunrise:sql')?.coordinates[0].dates[0].value;
      const sunset = this.weatherData.data.find((d: any) => d.parameter === 'sunset:sql')?.coordinates[0].dates[0].value;

      const payload = {
        latitude: this.selectedLat,
        longitude: this.selectedLng,
        weather: {
          temperature,
          maxTemperature,
          minTemperature,
          windSpeed,
          windDirection,
          pressure,
          precip1h,
          precip24h,
          sunrise,
          sunset
        }
      };

      this.backendService.sendLocation(payload).subscribe(
        response => console.log('Location and weather sent successfully'),
        error => console.log('Error sending data', error)
      );
    }
  }
}
