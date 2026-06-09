# 🏋️ Community Gym Analysis and Prediction System

## Overview

Community Gym Analysis and Prediction System is a machine learning–powered web application developed for **2N Sports & Fitness** to streamline gym management and provide personalized fitness recommendations. The platform combines member management features with predictive analytics to help users make informed fitness decisions based on their health and fitness parameters.

The system enables gym members to register, manage their profiles, explore membership plans, track fitness progress, and receive customized recommendations for diet, exercise routines, and equipment usage. Administrators can efficiently manage member records, monitor progress, and maintain engagement through a centralized dashboard.

## Key Features

* User and Admin Authentication
* Member Registration and Management
* Membership Plan Management
* Fitness Progress Tracking
* Personalized Diet Recommendations
* Personalized Exercise Recommendations
* Equipment Usage Recommendations
* Admin Dashboard for Member Analytics
* Feedback and Review Management
* Database Integration for Persistent Storage
* Real-time Prediction through Flask APIs

## Machine Learning Pipeline

The recommendation engine is built using supervised machine learning techniques. Multiple algorithms including Logistic Regression, Decision Tree, and Random Forest were evaluated. Based on comparative analysis, Random Forest was selected as the final model due to its superior performance and ability to capture complex relationships among fitness-related features.

### Input Features

* Age
* Gender
* Height
* Weight
* BMI
* Fitness Goals
* Activity Level
* Health Parameters

### Prediction Outputs

* Diet Plan Recommendations
* Exercise Recommendations
* Equipment Recommendations

## Dataset

A hybrid fitness dataset containing **15,000+ records** was created by combining anonymized gym data from **2N Sports & Fitness**, publicly available Kaggle datasets, and additional fitness-related data from web sources. The dataset includes demographic, health, and fitness attributes used for model training and evaluation.

## Model Performance

### Random Forest Accuracy

* Diet Recommendation: **94.69%**
* Exercise Recommendation: **99.62%**
* Equipment Recommendation: **94.96%**

## Technology Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask

### Machine Learning

* Scikit-learn
* Pandas
* NumPy

### Database

* SQLite / Database Integration

### Deployment & Utilities

* Pickle
* REST APIs
* Jupyter Notebook

## Impact

This project contributes to the digital transformation of fitness centers by integrating machine learning with gym management operations. It supports personalized fitness guidance, improves operational efficiency, and enhances member engagement through data-driven recommendations.

## SDG Alignment

* SDG 3: Good Health and Well-being
* SDG 9: Industry, Innovation and Infrastructure
* SDG 4: Quality Education

## Sponsor

**2N Sports & Fitness**


