# Easy Crop

### 2024 NASA Space Apps Challenge
[https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/easy-crop](https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/easy-crop)
## Project Overview

**Easy Crop** is an AI-powered tool designed to help farmers and agronomists plan their harvests months in advance by utilizing satellite-based data and AI-driven predictions. It leverages modern technology to address critical agricultural challenges like drought and water reservation by providing detailed visual insights into a harvest’s success rate and possible environmental impacts.

![images/logo.png](https://github.com/FloLys/Easy-Crop-FE/blob/main/001.PNG)

By filling out the planning form, users receive personalized insights into crop management, supported by a collaborative community that enhances the AI model through real-world inputs. **Easy Crop** brings precision agriculture to the forefront, helping users optimize their harvests and contribute to a global agricultural community.

---

## Project Details

### High-Level Summary

We recognize the current climate crisis and the pressing issue of declining water resources worldwide. That’s why we created **Easy Crop**, an innovative solution using AI and NASA satellite data to empower farmers with actionable insights months before their harvest.

Key features include:
- **AI-Powered Harvest Planning:** Based on real-time weather data and historical satellite information.
- **Community-Driven Inputs:** Farmers can share their experiences to improve AI models, benefiting the entire agricultural community.
- **Advanced Data Visualizations:** Personalized charts and analytics help maximize crop yield and minimize environmental impacts.


---

## Demo

**Final Project Code:**  
GitHub Repository: [https://github.com/FloLys/Easy-Crop-FE](https://github.com/FloLys/Easy-Crop-FE)
https://youtu.be/nGBcgimZ-OQ
---

## How It Works

### User Flow
1. **Crop Planning:** Users input their crop type, location, and planting schedule. Easy Crop then generates predictions on potential yields and environmental factors, such as droughts or water shortages.
2. **Soil and Climate Analytics:** Through detailed charts and data, farmers can assess how weather and soil conditions will affect their crops.
3. **Agro Community Integration:** A platform feature that allows users to share their insights, benefiting the AI model and fostering a supportive network of farmers and agronomists.

![imagn/3.png](https://github.com/FloLys/Easy-Crop-FE/blob/main/3.png)

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

- **Ionic**
- **Angular**
- **Google Cloud**
- **Python**
- **MySQL**
- **Meteomatics API**
- **MODIS Planetary Computer**
- **Azure Machine Learning**
- **OpenAI API**
- **Flourish** (for visual data representation)

