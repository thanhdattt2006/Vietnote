# 🚀 Vietnote: Ứng Dụng Ghi Chú Fullstack (React + Laravel API)

**Tác giả:** Võ Cao Thành Đạt (Dave)

**Dự án cá nhân:** 11/2025 – 12/2025

**Live Demo:** https://vietnote.vercel.app

---

## 💡 Tổng quan Dự án

Vietnote là một ứng dụng ghi chú hiện đại được xây dựng trên kiến trúc **phân tách (Decoupled Architecture)**, tập trung vào hiệu năng (Performance) và trải nghiệm người dùng (UX) thông qua việc sử dụng các công nghệ tiên tiến nhất. Dự án này mô phỏng các thách thức của hệ thống API chuyên nghiệp trong môi trường Cloud.

## 🛠️ Công nghệ và Kiến trúc

| Thành phần | Công nghệ | Chi tiết và Mục đích |
| :--- | :--- | :--- |
| **Xác thực Ngoài** |	**Laravel Socialite** |	**Xử lý đăng nhập bằng tài khoản Google và GitHub.** |
| **Backend API** | **Laravel 11, Sanctum** | Cung cấp các RESTful API bảo mật. Sử dụng kiến trúc Repository/Service. |
| **Frontend UI** | **ReactJS, Vite** | Giao diện người dùng hiện đại, tốc độ cao (SPA). |
| **Database** | **MySQL (Aiven/Render)** | Cơ sở dữ liệu chính. |
| **Styling/UI** | **PrimeReact, Lucide, CSS Module** | Component hóa giao diện, hỗ trợ Dark Mode. |
| **Deployment (DevOps)** | **Render (Docker), Vercel/Netlify** | Triển khai Multi-service (API & Static Assets) qua Docker và CI/CD. |

---

## ✨ Các Tính năng Nổi bật & Tối ưu hóa

Dự án này vượt xa CRUD cơ bản với các tính năng và tối ưu hóa sau:

### 1. Hiệu năng & Kiến trúc (Architecture & Performance)

* **Tối ưu Loading (FOUC Fix):** Khắc phục lỗi nháy màn hình (FOUC/Flickering) khi chuyển Dark Mode bằng script chặn CSS Preload.
* **Tối ưu Tốc độ Load:** Tích hợp `LoadingOverlay` với `Promise.all` để tải nhiều dữ liệu cùng lúc, giúp Dashboard Admin phản hồi nhanh hơn.
* **Tối ưu UI:** Triển khai **Masonry Layout** cho ghi chú và fix lỗi mất focus input trong React.

### 2. Bảo mật & Xác thực (Security & Auth Flow)

* **Xác thực Token:** Sử dụng Laravel Sanctum (Bearer Token) cho toàn bộ API.
* **Luồng Đặt lại Mật khẩu Pro:** Triển khai quy trình 3 bước **OTP Multi-step Form** (Email $\rightarrow$ Verify Code $\rightarrow$ New Password) để tăng cường bảo mật và cải thiện UX (tránh lỗi Context Switching của link).
* **Quản trị Tài khoản:** Chức năng **Đổi mật khẩu** (yêu cầu Pass cũ), **Xóa tài khoản** (yêu cầu nhập xác nhận).
* **Check Quyền Hạn:** Triển khai **Custom Middleware** ở Backend để chặn truy cập Admin cho User thường.

---

## 📧 Thông tin liên hệ

Ông Võ Cao Thành Đạt (Dave)
* **Email:** thanhdattt2006@gmail.com
* **LinkedIn:** https://www.linkedin.com/in/th%C3%A0nh-%C4%91%E1%BA%A1t-619b37340/
