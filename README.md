# Easy Crop

### 2024 NASA Space Apps Challenge
[Leveraging Earth Observation Data for Informed Agricultural Decision-Making](https://www.spaceappschallenge.org/nasa-space-apps-2024/challenges/leveraging-earth-observation-data-for-informed-agricultural-decision-making/)

## Project Overview

**Easy Crop** is an AI-powered tool designed to help farmers and agronomists plan their harvests months in advance by utilizing satellite-based data and AI-driven predictions. It leverages modern technology to address critical agricultural challenges like drought and water reservation by providing detailed visual insights into a harvest’s success rate and possible environmental impacts.

![images/logo.png](https://github.com/FloLys/Easy-Crop-FE/blob/main/001.PNG)

By filling out the planning form, users receive personalized insights into crop management, supported by a collaborative community that enhances the AI model through real-world inputs. **Easy Crop** brings precision agriculture to the forefront, helping users optimize their harvests and contribute to a global agricultural community.

Key features include:
- **AI-Powered Harvest Planning:** Based on real-time weather data and historical satellite information.
- **Community-Driven Inputs:** Farmers can share their experiences to improve AI models, benefiting the entire agricultural community.
- **Advanced Data Visualizations:** Personalized charts and analytics help maximize crop yield and minimize environmental impacts.

---

## Demo
https://youtu.be/nGBcgimZ-OQ

## Figma Presentation
[https://www.figma.com/proto/LI3BLToJqEtOgNLxj5Mdxx/Easy-Crop-NASA](https://www.figma.com/proto/LI3BLToJqEtOgNLxj5Mdxx/Easy-Crop-NASA?page-id=0%3A1&node-id=213-4747&node-type=canvas&viewport=-1958%2C559%2C0.24&t=lJrSQGozRY5TAIib-1&scaling=contain&content-scaling=fixed&starting-point-node-id=213%3A4747)

## Final Project Code:
**Frontend GitHub Repository:** [https://github.com/FloLys/Easy-Crop-FE](https://github.com/FloLys/Easy-Crop-FE)\
**Backend GitHub Repository:** [https://github.com/asenges/EasyCropBackend](https://github.com/asenges/EasyCropBackend)


## User Flow Manual

1. **Crop Planning:** Users input their crop type, location, and planting schedule. Easy Crop then generates predictions on potential yields and environmental factors, such as droughts or water shortages.
2. **Soil and Climate Analytics:** Through detailed charts and data, farmers can assess how weather and soil conditions will affect their crops.
3. **Agro Community Integration:** A platform feature that allows users to share their insights, benefiting the AI model and fostering a supportive network of farmers and agronomists.

![imagn/3.png](https://github.com/FloLys/Easy-Crop-FE/blob/main/3.png) 

(this is only a visual reference)

### Predictive Model Infrastructure
- **Azure Machine Learning:** Used to power predictive models by receiving real-time weather data and historical information sourced from NASA satellites (MODIS sensors). The system is fully integrated with **Azure Blob Storage** for optimal data management and visualization.

### Frontend Technologies:
- **Ionic** (mobile UI framework)
- **Angular** (frontend development)

### Backend Technologies:
- **Google Cloud** (hosting)
- **Python** (backend language)
- **MySQL** (database management)

### APIs for Data Integration:
- **Meteomatics** (weather data API)
- **Planetary Computer API** (NASA MODIS sensors)
- **OpenAI API** (AI-driven model predictions for crop conditions)

---

## Technological Infrastructure

- **Frontend Framework:** Built using **Ionic** and **Angular** for responsive, mobile-friendly UI.
- **Backend Architecture:** Powered by **Google Cloud** and **Python**, ensuring scalability and reliability.
- **Database Systems:** We use **MySQL** hosted on **Google Cloud** for fast, secure data storage and retrieval.

---

## Future Features

- **Irrigation Recommendations:** The AI will suggest personalized watering schedules based on crop type, soil moisture levels, and real-time weather data.
- **Problem Detection:** Satellite imagery and real-time sensor data will be analyzed to detect potential crop health issues early on, allowing for timely intervention.

---

## Use of Artificial Intelligence

Our AI models utilize data from multiple APIs and the **Azure Machine Learning** platform to generate real-time insights. These models integrate:
- **Meteomatics Weather Data API**
- **Ideal Weather for Crops (OpenAI)**
- **Planetary Computer API** (MODIS satellite sensor data)

The result is a powerful tool that delivers accurate, actionable predictions to help optimize harvest outcomes.

![images/002.PNG](https://github.com/FloLys/Easy-Crop-FE/blob/main/002.PNG)

---

## Space Agency Data

The **Easy Crop** project relies on data from NASA’s **MODIS sensors**, processed via the **Planetary Computer API**. This satellite data is essential for predicting crop success rates and potential environmental challenges, ensuring our tool is both scientifically grounded and practical for real-world application.



---

## References

- **[Microsoft Azure](https://azure.microsoft.com/)**
- **[Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/)**
- **[Azure Machine Learning](https://azure.microsoft.com/en-us/products/machine-learning)**
- **[Meteomatics](https://www.meteomatics.com/)**
- **[Ionic](https://ionicframework.com/)**
- **[Angular](https://angular.dev/)**
- **[PrimeNg](https://primeng.org/)**
- **[Google Cloud](https://cloud.google.com/)**
- **[Python](https://www.python.org/)**
- **[MySQL](https://www.mysql.com/)**
- **[OpenAI ChatGPT](https://openai.com/)**
- **[Figma](https://www.figma.com/)**
- **[Flourish](https://flourish.studio/)** (for visual data representation)
- **[Narakeet](https://www.narakeet.com/)** (for demo voice audio)


## Authors

Florencia Mestre - https://github.com/flolys/ \
Leandro Irigoyen - https://github.com/leandroirigoyen \
Alejandro Senges - https://github.com/asenges/ \
Bogdan Gavriles - https://github.com/gavriles/ 
