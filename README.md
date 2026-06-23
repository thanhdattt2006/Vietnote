# 🚀 Vietnote: Fullstack Note-Taking Application (React + Laravel API)

**Author:** Vo Cao Thanh Dat (Dave)  
**Timeline:** 11/2025 – 12/2025  
**Live Demo:** [https://vietnote.vercel.app](https://vietnote.vercel.app)

> **Project Status:** 🚀 The project is currently pending production deployment on a dedicated physical server (not a VPS) to ensure maximum API performance and data security.

---

## 💡 Project Overview

Vietnote is a modern, high-performance note-taking application built on a **Decoupled Architecture** separating the Client and Server. The application focuses heavily on performance and user experience (UX) by combining cutting-edge technologies. This project simulates the operation and security challenges of a professional API system within a Cloud environment.

## 🛠️ Technology Stack & Architecture

| Component | Technology | Description & Purpose |
| :--- | :--- | :--- |
| **Backend API** | **Laravel 11, Sanctum** | Provides secure RESTful APIs utilizing the Repository/Service Pattern. |
| **External Auth** | **Laravel Socialite** | Handles quick login flows via Google and GitHub accounts (OAuth2). |
| **Email & Services** | **Resend (resend-laravel)** | Automatically sends notification emails and OTP verification codes. |
| **File Storage** | **AWS S3 (Flysystem)** | Integrates Cloud Storage for saving file attachments securely. |
| **Frontend UI** | **ReactJS 18, Vite 5.4** | Builds a highly responsive SPA (Single Page Application). |
| **UI/UX & Styling** | **PrimeReact 10, PrimeFlex, Quill** | Component-based UI with built-in Dark Mode and Rich Text Editor (Quill) support. |
| **Database** | **MySQL (Aiven/Render)** | The primary relational database for the system. |
| **Deployment (DevOps)**| **Render (Docker), Vercel** | Automated CI/CD deployment for both the Backend API and Frontend Static Assets. |

---

## ✨ Key Features & Optimizations

### 1. Note Management
- **Rich Text Editor:** Create and edit notes using a feature-rich text editor (React Quill).
- **Masonry Layout:** Display notes in a grid format (3x5) with smooth pagination capabilities.
- **Smart Trash Bin:** Deleted notes are moved to a Trash Bin and are **permanently deleted automatically after 7 days**.
- **Feedback System:** Allows users to submit feedback with strict data validation.

### 2. Architecture & Performance Optimizations
- **Loading Optimization (FOUC Fix):** Completely resolved the Flash of Unstyled Content (FOUC) flickering issue when toggling Dark/Light Mode using CSS Preload blocking scripts.
- **Concurrent Fetching:** Integrated `Promise.all` alongside `LoadingOverlay` to fetch multiple data streams concurrently, making the Admin Dashboard load exceptionally fast.
- **UX Enhancements:** Added Multi-language support (English/Vietnamese via `i18next`) and fixed input focus loss bugs specific to the React lifecycle.

### 3. Security & Authentication
- **Token-based Auth:** Uses Laravel Sanctum (Bearer Token) to protect all API endpoints.
- **Pro Password Reset Flow:** Implemented a 3-step **OTP Multi-step Form** (Enter Email -> Verify OTP -> Change Password) directly on the UI, improving user experience and avoiding context switching caused by link redirects.
- **Account Management:** Features to Change Password (requires old password) and Permanently Delete Account (requires strict confirmation).
- **Role-Based Access Control (RBAC):** Built Custom Middleware on the Backend to completely block unauthorized access from standard users to the Admin area.

---

## 📁 Directory Structure (Monorepo)

```text
Vietnote/
├── backend/                  # Laravel 11 API Server
│   ├── app/                  # Controllers, Models, Middleware, Services
│   ├── config/               # Sanctum, CORS, Auth, Resend Configurations
│   ├── database/             # Migrations and Seeders
│   ├── routes/               # Contains API endpoints (api.php)
│   └── composer.json
│
├── frontend/                 # React 18 + Vite SPA Client
│   ├── src/
│   │   ├── api/              # Axios instance & API configurations
│   │   ├── components/       # Shared UI Components
│   │   ├── contexts/         # ThemeContext, AuthContext, etc.
│   │   ├── pages/            # Home, Trash, Feedback, Settings, Auth
│   │   ├── utils/            # i18n configurations and helper functions
│   │   └── App.jsx           # Main Router configuration
│   └── package.json
│
└── README.md
```

---

## 🚀 Local Setup Instructions

### 1. Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
*(Note: You must configure the environment variables for Database, Mail (Resend), AWS S3, and Socialite (Google/Github) in your `.env` file before running).*

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
# Create a .env file and add: VITE_API_URL=http://localhost:8000/api
npm run dev
```
*Access the application at: http://localhost:5173*

---

## 📧 Contact Information

**Vo Cao Thanh Dat (Dave)**  
* **Email:** thanhdattt2006@gmail.com
* **LinkedIn:** [Thành Đạt](https://www.linkedin.com/in/th%C3%A0nh-%C4%91%E1%BA%A1t-619b37340/)
