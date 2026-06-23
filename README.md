# 🚀 Vietnote: Ứng Dụng Ghi Chú Fullstack (React + Laravel API)

**Tác giả:** Võ Cao Thành Đạt (Dave)  
**Thời gian thực hiện:** 11/2025 – 12/2025  
**Live Demo:** [https://vietnote.vercel.app](https://vietnote.vercel.app)

---

## 💡 Tổng quan Dự án

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

---

## ✨ Các Tính năng Nổi bật & Tối ưu hóa

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

---

## 📧 Thông tin liên hệ

**Ông Võ Cao Thành Đạt (Dave)**  
* **Email:** thanhdattt2006@gmail.com
* **LinkedIn:** [Thành Đạt](https://www.linkedin.com/in/th%C3%A0nh-%C4%91%E1%BA%A1t-619b37340/)
