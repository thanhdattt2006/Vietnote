VIETNOTE: FULL-STACK DECOUPLED APPLICATION
Author: Vo Cao Thanh Dat (Dave)

<<<<<<< HEAD
**Tác giả:** Võ Cao Thành Đạt (Dave)  
**Thời gian thực hiện:** 11/2025 – 12/2025  
**Live Demo:** [https://vietnote.vercel.app](https://vietnote.vercel.app)
=======
Timeline: 11/2025 – 12/2025

Live Demo: https://vietnote.vercel.app

Backend Repository: [Link to your Backend repo if separate]
>>>>>>> a1c225bb8c444d846e4d0cc5c6578043b226a9bc

Project Overview
Vietnote is a modern note-taking platform built on a decoupled architecture, separating the React frontend from the Laravel API. The project focuses on high performance, secure authentication flows, and the challenges of deploying multi-service systems in a cloud environment.

Technical Stack
Frontend

<<<<<<< HEAD
Vietnote là một ứng dụng ghi chú hiện đại được xây dựng trên kiến trúc **phân tách (Decoupled Architecture)** giữa Client và Server. Ứng dụng tập trung vào hiệu năng (Performance) và trải nghiệm người dùng (UX) thông qua việc kết hợp các công nghệ tiên tiến nhất. Dự án mô phỏng cách thức vận hành và bảo mật của một hệ thống API chuyên nghiệp trong môi trường Cloud.

## 🛠️ Công nghệ & Kiến trúc

| Thành phần | Công nghệ | Chi tiết & Mục đích |
| :--- | :--- | :--- |
| **Backend API** | **Laravel 11, Sanctum** | Cung cấp các RESTful API bảo mật. Sử dụng kiến trúc Repository/Service Pattern. |
| **Xác thực Ngoại** | **Laravel Socialite** | Xử lý luồng đăng nhập nhanh bằng tài khoản Google và GitHub (OAuth2). |
| **Email & Dịch vụ** | **Resend (resend-laravel)** | Gửi email thông báo và mã xác thực OTP tự động. |
| **Lưu trữ File** | **AWS S3 (Flysystem)** | Tích hợp Cloud Storage để lưu trữ các tệp đính kèm. |
| **Frontend UI** | **ReactJS 18, Vite 5.4** | Xây dựng ứng dụng SPA (Single Page Application) với tốc độ phản hồi cao. |
| **Giao diện (UI/UX)** | **PrimeReact 10, PrimeFlex, Quill** | Component hóa giao diện, hỗ trợ Dark Mode và Rich Text Editor (Quill). |
| **Database** | **MySQL (Aiven/Render)** | Cơ sở dữ liệu quan hệ chính của hệ thống. |
| **Triển khai (DevOps)**| **Render (Docker), Vercel** | Triển khai tự động CI/CD cho cả API Backend và Static Assets Frontend. |
=======
ReactJS, Vite

Styling: PrimeReact, Lucide, CSS Modules

State Management: React Hooks & Context API
>>>>>>> a1c225bb8c444d846e4d0cc5c6578043b226a9bc

Backend

Laravel 11 (RESTful API)

<<<<<<< HEAD
### 1. Quản lý Ghi chú (Note Management)
- **Rich Text Editor:** Tạo, chỉnh sửa ghi chú với trình soạn thảo văn bản phong phú (React Quill).
- **Masonry Layout:** Hiển thị ghi chú dạng lưới (Grid 3x5) với khả năng phân trang (Pagination) mượt mà.
- **Thùng rác thông minh (Trash Bin):** Các ghi chú bị xóa sẽ nằm trong thùng rác và tự động bị **xóa vĩnh viễn sau 7 ngày**.
- **Hệ thống phản hồi:** Cho phép người dùng gửi ý kiến phản hồi kèm validate dữ liệu chặt chẽ.

### 2. Tối ưu Hiệu năng & Kiến trúc (Performance)
- **Tối ưu Loading (FOUC Fix):** Khắc phục triệt để lỗi nháy màn hình (Flash of Unstyled Content) khi chuyển đổi chế độ Dark/Light Mode bằng script chặn CSS Preload.
- **Xử lý Bất đồng bộ (Concurrent Fetching):** Tích hợp `Promise.all` cùng `LoadingOverlay` để tải nhiều luồng dữ liệu cùng lúc, giúp Admin Dashboard tải cực nhanh.
- **Tối ưu UX:** Tích hợp tính năng đa ngôn ngữ (Tiếng Việt/English với `i18next`) và sửa các lỗi mất focus input đặc thù trong React lifecycle.

### 3. Bảo mật & Xác thực (Security)
- **Xác thực Token:** Sử dụng Laravel Sanctum (Bearer Token) bảo vệ toàn bộ các endpoint API.
- **Luồng Đặt lại Mật khẩu Pro:** Triển khai quy trình **OTP Multi-step Form** 3 bước (Nhập Email -> Xác thực OTP -> Đổi Mật khẩu mới) ngay trên UI, giúp tăng trải nghiệm người dùng và tránh bị Context Switching do click link chuyển hướng.
- **Quản lý Tài khoản:** Đổi mật khẩu (yêu cầu mật khẩu cũ), Xóa tài khoản vĩnh viễn (yêu cầu xác nhận an toàn).
- **Phân quyền (RBAC):** Xây dựng Custom Middleware tại Backend để chặn hoàn toàn các truy cập trái phép từ User thường vào khu vực Admin.

---

## 📁 Cấu trúc Thư mục (Monorepo)

```text
Vietnote/
├── backend/                  # Laravel 11 API Server
│   ├── app/                  # Controllers, Models, Middleware, Services
│   ├── config/               # Cấu hình Sanctum, CORS, Auth, Resend
│   ├── database/             # Migrations và Seeders
│   ├── routes/               # Chứa các endpoint (api.php)
│   └── composer.json
│
├── frontend/                 # React 18 + Vite SPA Client
│   ├── src/
│   │   ├── api/              # Axios instance & cấu hình gọi API
│   │   ├── components/       # Các UI Component dùng chung
│   │   ├── contexts/         # ThemeContext, AuthContext...
│   │   ├── pages/            # Home, Trash, Feedback, Settings, Auth
│   │   ├── utils/            # File cấu hình i18n, helper functions
│   │   └── App.jsx           # Cấu hình Router chính
│   └── package.json
│
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt (Local Setup)

### 1. Cài đặt Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
*(Lưu ý: Bạn cần cấu hình các biến môi trường Database, Mail (Resend), AWS S3 và Socialite (Google/Github) trong file `.env` trước khi chạy).*

### 2. Cài đặt Frontend (React)
```bash
cd frontend
npm install
# Tạo file .env và thêm: VITE_API_URL=http://localhost:8000/api
npm run dev
```
*Truy cập ứng dụng tại địa chỉ: http://localhost:5173*
=======
Authentication: Laravel Sanctum (Token-based)

Social Auth: OAuth 2.0 (Google & GitHub via Laravel Socialite)

Database & Infrastructure

Database: MySQL (Hosted on Aiven)

Deployment: Docker on Render (API), Vercel (Frontend)
>>>>>>> a1c225bb8c444d846e4d0cc5c6578043b226a9bc

Connectivity: Cross-Origin Resource Sharing (CORS) management between distributed services.

Engineering Highlights & Problem Solving
This project serves as a practical exploration of performance optimization and infrastructure management.

<<<<<<< HEAD
**Ông Võ Cao Thành Đạt (Dave)**  
* **Email:** thanhdattt2006@gmail.com
* **LinkedIn:** [Thành Đạt](https://www.linkedin.com/in/th%C3%A0nh-%C4%91%E1%BA%A1t-619b37340/)
=======
1. Performance & UI Optimization
Loading Optimization: Eliminated Flash of Unstyled Content (FOUC) during theme transitions by implementing a CSS preload blocking script.

API Concurrency: Utilized Promise.all to fetch multiple data sources simultaneously for the Admin Dashboard, reducing initial load time significantly.

Masonry Layout: Implemented dynamic grid systems for variable-height notes to ensure a smooth user experience.

2. Security & Modern Auth Flows
OAuth 2.0 Integration: Implemented secure login via Google and GitHub.

Multi-step OTP Flow: Developed a 3-step password reset process (Email verification -> OTP validation -> Password update) to improve security over traditional link-based resets.

Access Control: Custom Middleware implemented on the backend to enforce strict role-based access control (RBAC).

3. Infrastructure Challenges
Cloud Deployment Logs: Successfully navigated the complexities of containerizing a Laravel application with Docker and debugging deployment logs on Render.

Environment Discrepancies: Identified and documented SMTP port restrictions in the production environment (Render/Vercel) which affected the mailing system. Currently researching API-based mailing providers (SendGrid/Mailgun) as a resolution.

Future Roadmap
Backend Refactoring: Migrating the entire backend architecture to Java Spring Boot to leverage strong typing and enterprise-grade dependency injection.

Persistence Strategy: Implementing Google Cloud Storage (GCS) for file uploads to transition towards a fully stateless architecture, bypassing the limitations of ephemeral storage on PaaS providers.
>>>>>>> a1c225bb8c444d846e4d0cc5c6578043b226a9bc
