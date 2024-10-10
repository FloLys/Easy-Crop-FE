import { Component, OnInit } from "@angular/core";
import * as L from "leaflet";
import { HttpClient } from "@angular/common/http";
import { BackendService } from "../../services/backend.service";
import { WeatherService } from "../../services/weather.service";
import * as worldGeoJSON from "../../../assets/geojson/continents.geojson.json"; // Archivo GeoJSON para los continentes;
import { ChartOptions } from "chart.js";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "assets/leaflet/marker-icon-2x.png",
  iconUrl: "assets/leaflet/marker-icon.png",
  shadowUrl: "assets/leaflet/marker-shadow.png",
});

interface Crop {
  id: number;
  plant_name: string;
}

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  map: any;
  currentLat: number;
  currentLng: number;
  selectedLat: number;
  selectedLng: number;
  weatherData: any;
  currentMarker: any; // Variable para guardar el marcador de ubicación actual
  previousMarker: any;
  continentLayer: any;
  cropSize: number = 1; // Tamaño por defecto del radio en kilómetros
  circle: any; // Círculo que se dibujará en el mapa
  crops: Crop[] = [];
  selectedCrop: string = "";
  sow_date: string = "";
  formError: boolean = false;
  tomorrow: string;
  isCropPlanningActive: boolean = true;
  isSuccessVisible: boolean = false;
  successRate: number = 75; // Este valor puede cambiar según tus cálculos
  data: any;
  options: any;
  environmentalImpactData: any;
  harvestingDate: string; // Puedes calcular esta fecha según el tiempo de crecimiento
  chartData: any;
  chartOptions: ChartOptions;
  // Pie chart data
  pieChartData: any;
  pieChartOptions: any;

  jsonData = [
    {
      "Row Labels": "October 30, 2024",
      Flood: 389.5,
      Storms: 2411.5,
      Wildfire: 1280.5,
      Drought: "",
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "November 02, 2024",
      Flood: 2089.9,
      Storms: 3385.1,
      Wildfire: 532.2,
      Drought: "",
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "November 07, 2024",
      Flood: 3451.6,
      Storms: 3472.4,
      Wildfire: 86.5,
      Drought: "",
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "November 20, 2024",
      Flood: 5326.5,
      Storms: 3116.3,
      Wildfire: 13.5,
      Drought: "",
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "November 27, 2024",
      Flood: 6511.4,
      Storms: 2915.8,
      Wildfire: 10.6,
      Drought: "",
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "December 02, 2024",
      Flood: 9377.4,
      Storms: 2303.6,
      Wildfire: 25.1,
      Drought: 1905.3,
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "December 10, 2024",
      Flood: 9934.7,
      Storms: 1905.3,
      Wildfire: 36.8,
      Drought: 2915.8,
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "December 15, 2024",
      Flood: 11416,
      Storms: 1419.9,
      Wildfire: 34,
      Drought: 2411.5,
      Frost: "",
      "": "",
    },
    {
      "Row Labels": "December 20, 2024",
      Flood: 12909.4,
      Storms: 363.4,
      Wildfire: 27.4,
      Drought: 3385.1,
      Frost: "",
      "": "",
    },
  ];

  constructor(
    private backendService: BackendService,
    private weatherService: WeatherService,
    private http: HttpClient
  ) {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    this.tomorrow = tomorrowDate.toISOString().split("T")[0];
    this.getCrops();
  }

  ngOnInit() {
    this.getCurrentLocation()
      .then((position: any) => {
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
        this.loadMap();
        this.getWeatherData(this.currentLat, this.currentLng);
        // this.getChartData();
        this.setupPieChartData(); // Call new function
        this.setupChartData(); // Existing line chart setup

        // Establecer el radio y la ubicación inicial
        this.selectedLat = this.currentLat; // Inicializa la latitud seleccionada
        this.selectedLng = this.currentLng; // Inicializa la longitud seleccionada
        this.updateCircle(this.currentLat, this.currentLng, this.cropSize); // Inicializa el círculo
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

  // getChartData() {
  //   this.http.get<any[]>('http://serv.easycrop.pro/get-chart').subscribe(
  //     (data) => {
  //       this.jsonData = data;
  //       this.setupChartData();
  //     },
  //     (error) => {
  //       console.error('Error fetching chart data:', error);
  //     }
  //   );
  // }

  setupPieChartData() {
    // Data for the pie chart (Example - replace with your actual data)
    this.pieChartData = {
      datasets: [{
        data: [this.successRate, 100 - this.successRate],
        backgroundColor: ['#00920F', '#FF8800'],
      }]
    };

    this.pieChartOptions = {
      responsive: true,
      // maintainAspectRatio: false,
      title: {
        display: true,
        text: this.successRate,
        fontSize: 16
    },
    legend: {
        position: 'bottom'
    }
    };
  }

  setupChartData() {
    // Extrayendo las etiquetas
    const labels = this.jsonData.map((item) => item["Row Labels"]);

    // Obteniendo datos y asegurándonos de que son números
    const floodData = this.jsonData.map((item) =>
      this.getNumericValue(item.Flood)
    );
    const stormsData = this.jsonData.map((item) =>
      this.getNumericValue(item.Storms)
    );
    const wildfireData = this.jsonData.map((item) =>
      this.getNumericValue(item.Wildfire)
    );
    const droughtData = this.jsonData.map((item) =>
      this.getNumericValue(item.Drought)
    );

    // Normalizando los datos
    const maxFlood = Math.max(...floodData);
    const maxStorms = Math.max(...stormsData);
    const maxWildfire = Math.max(...wildfireData);
    const maxDrought = Math.max(...droughtData);

    const normalizedFloodData = floodData.map(
      (value) => (value / maxFlood) * 100
    );
    const normalizedStormsData = stormsData.map(
      (value) => (value / maxStorms) * 100
    );
    const normalizedWildfireData = wildfireData.map(
      (value) => (value / maxWildfire) * 100
    );
    const normalizedDroughtData = droughtData.map(
      (value) => (value / maxDrought) * 100
    );

    // Configurando los datos de la gráfica
    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: "Flood",
          data: normalizedFloodData,
          fill: false,
          borderColor: "#42A5F5",
          backgroundColor: "#42A5F5",
        },
        {
          label: "Storms",
          data: normalizedStormsData,
          fill: false,
          borderColor: "#FFA726",
          backgroundColor: "#FFA726",
        },
        {
          label: "Wildfire",
          data: normalizedWildfireData,
          fill: false,
          borderColor: "#66BB6A",
          backgroundColor: "#66BB6A",
        },
        {
          label: "Drought",
          data: normalizedDroughtData,
          fill: false,
          borderColor: "#AB47BC",
          backgroundColor: "#AB47BC",
        },
      ],
    };

    // Opciones para la gráfica
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false, // Esto permite que el gráfico se expanda
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Fechas",
          },
          ticks: {
            autoSkip: true, // Evita que las etiquetas se superpongan
            maxTicksLimit: 10, // Ajusta según tus necesidades
          },
        },
        y: {
          title: {
            display: true,
            text: "Porcentaje (%)",
          },
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20, // Ajusta el paso de las marcas en el eje Y
          },
        },
      },
    };
  }

  private getNumericValue(value: string | number): number {
    return typeof value === "number" ? value : 0; // Si no es número, retorna 0
  }

  getCrops() {
    this.http.get<any>("https://serv.easycrop.pro/plants_data").subscribe(
      (data) => {
        this.crops = data; // Asignar los cultivos completos
        console.log("Cultivos obtenidos:", data);
      },
      (error: any) => {
        console.error("Error al obtener los cultivos", error);
      }
    );
  }

  onSubmit() {
    if (this.selectedLat && this.selectedLng && this.weatherData && this.selectedCrop) {
      const selectedCropData = this.crops.find(crop => crop.plant_name.toLowerCase().trim() === this.selectedCrop.toLowerCase().trim());

      if (selectedCropData) {
        const payload = {
          latitude: this.selectedLat,
          longitude: this.selectedLng,
          weather: {
            temperature_2m: this.weatherData.data.find(
              (d: any) => d.parameter === "t_2m:C"
            )?.coordinates[0].dates[0].value,
            maxTemperature: this.weatherData.data.find(
              (d: any) => d.parameter === "t_max_2m_24h:C"
            )?.coordinates[0].dates[0].value,
            minTemperature: this.weatherData.data.find(
              (d: any) => d.parameter === "t_min_2m_24h:C"
            )?.coordinates[0].dates[0].value,
            windDirection: this.weatherData.data.find(
              (d: any) => d.parameter === "wind_dir_10m:d"
            )?.coordinates[0].dates[0].value,
            pressure: this.weatherData.data.find(
              (d: any) => d.parameter === "msl_pressure:hPa"
            )?.coordinates[0].dates[0].value,
            precip1h: this.weatherData.data.find(
              (d: any) => d.parameter === "precip_1h:mm"
            )?.coordinates[0].dates[0].value,
            precip24h: this.weatherData.data.find(
              (d: any) => d.parameter === "precip_24h:mm"
            )?.coordinates[0].dates[0].value,
            sunrise: this.weatherData.data.find(
              (d: any) => d.parameter === "sunrise:sql"
            )?.coordinates[0].dates[0].value,
            sunset: this.weatherData.data.find(
              (d: any) => d.parameter === "sunset:sql"
            )?.coordinates[0].dates[0].value,
          },
          plant_id: selectedCropData.id, // Asegúrate de que esta línea use el `plant_id` correcto
          km_radius: this.cropSize,
          sow_date: this.sow_date,
        };
        // Imprimir los cultivos disponibles para verificar su contenido
        console.log("Lista de cultivos disponibles:", this.crops);
        console.log("Valor seleccionado:", this.selectedCrop);

        this.backendService.sendLocation(payload).subscribe(
          response => {
            console.log('Location data sent successfully:', response);
            this.showSuccessMessage(); // Ensure this function exists
          },
          error => {
            console.error('Error sending location data:', error);
            this.formError = true;
            alert('Error submitting data. Please try again later.');
          }
        );
      } else {
        this.formError = true;
        return;
      }
    } else {
      this.formError = true;
    }
  }

  // onSubmit() {
  //   if (
  //     this.selectedLat &&
  //     this.selectedLng &&
  //     this.weatherData &&
  //     this.selectedCrop
  //   ) {
  //     // Imprimir los cultivos disponibles para verificar su contenido
  //     console.log("Lista de cultivos disponibles:", this.crops);
  //     console.log("Valor seleccionado:", this.selectedCrop);

  //     // Asegurarse de que tanto el nombre seleccionado como los nombres de la lista están formateados correctamente
  //     const selectedCropData = this.crops.find(
  //       (crop) =>
  //         crop.plant_name.toLowerCase().trim() ===
  //         this.selectedCrop.toLowerCase().trim()
  //     );

  //     if (selectedCropData) {
  //       console.log("Cultivo seleccionado:", selectedCropData);
  //       console.log("ID del cultivo seleccionado:", selectedCropData.id);

  //       // Si plant_id es undefined, verifica las propiedades disponibles
  //       console.log(
  //         "Propiedades del cultivo seleccionado:",
  //         Object.keys(selectedCropData)
  //       );
  //     } else {
  //       console.log("No se encontró el cultivo seleccionado");
  //       return; // Salir si no se encontró el cultivo
  //     }

  //     const payload = {
  //       latitude: this.selectedLat,
  //       longitude: this.selectedLng,
  //       weather: {
  //         temperature_2m: this.weatherData.data.find(
  //           (d: any) => d.parameter === "t_2m:C"
  //         )?.coordinates[0].dates[0].value,
  //         maxTemperature: this.weatherData.data.find(
  //           (d: any) => d.parameter === "t_max_2m_24h:C"
  //         )?.coordinates[0].dates[0].value,
  //         minTemperature: this.weatherData.data.find(
  //           (d: any) => d.parameter === "t_min_2m_24h:C"
  //         )?.coordinates[0].dates[0].value,
  //         windDirection: this.weatherData.data.find(
  //           (d: any) => d.parameter === "wind_dir_10m:d"
  //         )?.coordinates[0].dates[0].value,
  //         pressure: this.weatherData.data.find(
  //           (d: any) => d.parameter === "msl_pressure:hPa"
  //         )?.coordinates[0].dates[0].value,
  //         precip1h: this.weatherData.data.find(
  //           (d: any) => d.parameter === "precip_1h:mm"
  //         )?.coordinates[0].dates[0].value,
  //         precip24h: this.weatherData.data.find(
  //           (d: any) => d.parameter === "precip_24h:mm"
  //         )?.coordinates[0].dates[0].value,
  //         sunrise: this.weatherData.data.find(
  //           (d: any) => d.parameter === "sunrise:sql"
  //         )?.coordinates[0].dates[0].value,
  //         sunset: this.weatherData.data.find(
  //           (d: any) => d.parameter === "sunset:sql"
  //         )?.coordinates[0].dates[0].value,
  //       },
  //       plant_id: selectedCropData.id, // Asegúrate de que esta línea use el `plant_id` correcto
  //       km_radius: this.cropSize,
  //       sow_date: this.sow_date,
  //     };

  //     console.log("Payload a enviar:", payload);

  //     // Enviar el payload al backend
  //     this.backendService.sendLocation(payload).subscribe(
  //       (response) => {
  //         console.log("Location data sent successfully:", response);
  //         this.showSuccessMessage(); // Asegúrate de tener esta función definida
  //       },
  //       (error) => {
  //         console.log("Error sending location data:", error);
  //       }
  //     );
  //   } else {
  //     console.log("Completa los datos antes de enviar.");
  //   }
  // }
  
  showSuccessMessage() {
    this.isSuccessVisible = true;
    this.harvestingDate = this.calculateHarvestingDate(this.sow_date); // Calcula la fecha de cosecha

    // Configuración de los datos para el gráfico de éxito
    this.data = {
      datasets: [
        {
          data: [this.successRate, 100 - this.successRate],
          backgroundColor: ["#00920F", "#FF8800"],
        },
      ],
    };
  }

  calculateHarvestingDate(cropDate: string): string {
    const date = new Date(cropDate);
    // Aquí puedes ajustar el tiempo de crecimiento según el tipo de cultivo
    date.setDate(date.getDate() + 30); // Suponiendo un ciclo de cultivo de 30 días
    return date.toISOString().split("T")[0];
  }

  setActiveTab(tab: string) {
    this.isCropPlanningActive = tab === "cropPlanning";
  }

  loadMap() {
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    this.map = L.map("map", {
      center: [this.currentLat, this.currentLng],
      zoom: 13,
      minZoom: 2,
      maxZoom: 18,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
    });

    // Añadir la capa de mosaicos de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © OpenStreetMap contributors",
      noWrap: true,
    }).addTo(this.map);

    // Crear la capa de continentes y añadirla al mapa
    this.continentLayer = L.geoJSON(worldGeoJSON as any, {
      style: (feature) => ({
        color: "#000",
        weight: 2,
        fillColor: "green",
        fillOpacity: 0.7,
        zIndex: 1, // Establecer un zIndex más bajo
      }),
    }).addTo(this.map);

    this.map.on("zoomend", () => {
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

    this.updateCurrentMarker(); // Crea el marcador de ubicación actual

    this.map.on("click", (e: { latlng: { lat: any; lng: any } }) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.selectedLat = lat;
      this.selectedLng = lng;

      if (this.previousMarker) {
        this.map.removeLayer(this.previousMarker);
      }

      this.previousMarker = L.marker([lat, lng]).addTo(this.map).openPopup();

      this.getWeatherData(lat, lng);
      this.updateCircle(lat, lng, this.cropSize); // Actualiza el círculo al hacer clic
    });

    // Actualiza la ubicación actual al hacer clic en el marcador
    this.currentMarker.on("click", () => {
      this.getCurrentLocation()
        .then((position: any) => {
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.updateCurrentMarker(); // Actualiza el marcador
          this.getWeatherData(this.currentLat, this.currentLng);
        })
        .catch((error) => {
          console.log("Error getting location", error);
        });
    });
  }
  adjustSize(value: number) {
    if (this.cropSize + value >= 0) {
      this.cropSize += value;
      if (this.selectedLat && this.selectedLng) {
        this.updateCircle(this.selectedLat, this.selectedLng, this.cropSize);
      }
    }
  }

  updateCurrentMarker() {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    this.currentMarker = L.marker([this.currentLat, this.currentLng])
      .addTo(this.map)
      .bindPopup("Current Location")
      .openPopup();

    // Configurar el círculo de selección
    this.updateCircle(this.currentLat, this.currentLng, this.cropSize); // Actualiza el círculo al inicio
  }

  updateCircle(lat: number, lng: number, radius: number) {
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }

    this.circle = L.circle([lat, lng], {
      color: "blue",
      fillColor: "#30f",
      fillOpacity: 0.3,
      radius: radius * 1000, // Convertir a metros
    }).addTo(this.map);
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  getWeatherData(lat: number, lng: number) {
    this.weatherService.getWeather(lat, lng).subscribe(
      (data) => {
        this.weatherData = data;
        console.log("Weather data:", this.weatherData);
      },
      (error) => {
        console.error("Error fetching weather data:", error);
      }
    );
  }
}
