# 🛠️ Vietnote Backend Refactor (Laravel ➡️ Spring Boot) TODO List

Dưới đây là lộ trình chuẩn chỉ từ A-Z để đập bỏ Laravel và xây dựng lại bằng **Spring Boot 3.x (Java 21)**. Đánh dấu `[x]` khi hoàn thành, `[/]` khi đang thực hiện.

---

## Phase 1: Project Setup & Dependencies 📦
- [x] Khởi tạo dự án qua Spring Initializr (Maven, Java 21).
- [x] Khai báo các Dependencies bắt buộc trong `pom.xml`:
  - **Core & DB:**
    - `spring-boot-starter-web` (REST APIs)
    - `spring-boot-starter-data-jpa` (Hibernate/ORM)
    - `mysql-connector-j` (MySQL Driver)
    - `spring-boot-starter-validation` (Validate DTO)
    - `org.projectlombok:lombok` (Giảm boilerplate)
  - **Security & Auth:**
    - `spring-boot-starter-security`
    - `spring-boot-starter-oauth2-client` (Thay thế Socialite)
    - `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` (Xử lý JWT Token)
  - **Mail & Queue:**
    - `spring-boot-starter-mail` (Gửi Email OTP)
- [x] Cấu hình `application.yml` (Kết nối DB, JWT Secret, Google/Github Client IDs).
- [x] Cấu hình Naming Strategy trong `application.yml` để giữ nguyên chuẩn `camelCase` của Database cũ:
  `spring.jpa.hibernate.naming.physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl`

---

## Phase 2: Database Entities & Repositories 🗄️
- [ ] Tạo Entity `User`: Map với bảng `Account` cũ, bỏ field password required, thêm `provider` và `provider_id`.
- [ ] Tạo Entity `Note`: 
  - Khai báo `@ManyToOne` với `User`.
  - 🪄 Thêm `@SQLDelete(sql = "UPDATE Note SET isDeleted = true, deletedAt = CURRENT_TIMESTAMP WHERE id=?")`
  - 🪄 Thêm `@Where(clause = "isDeleted = false")` để tự động giả lập Soft Delete.
- [ ] Tạo Entity `NoteImage`, `Feedback`, `OtpToken`.
- [ ] Tạo các interface Repository extends `JpaRepository` (`UserRepository`, `NoteRepository`,...).

---

## Phase 3: Security & OAuth2 Architecture (Khó Nhất) 🔐
- [ ] Viết `JwtService`: Chứa logic sinh Token (generateToken), giải mã (extractUsername), và kiểm tra hạn (isTokenValid).
- [ ] Viết `JwtAuthenticationFilter`: Kế thừa `OncePerRequestFilter` để móc token từ header `Authorization: Bearer <token>` và set `SecurityContextHolder`.
- [ ] Cấu hình `SecurityFilterChain`:
  - Cho phép public các API: `/api/auth/**`, `/oauth2/**`.
  - Chặn tất cả các API còn lại (bắt buộc có Token).
- [ ] Tích hợp OAuth2 Login (Google/Github):
  - Custom `OAuth2UserService` để tự động lưu User mới vào DB nếu chưa tồn tại.
  - Custom `OAuth2AuthenticationSuccessHandler` để tự sinh JWT Token và redirect về Frontend (`http://localhost:5173/auth/callback?token=...`).

---

## Phase 4: Core Business Logic (Services) ⚙️
- [ ] Viết `AuthService`:
  - Hàm `register(DTO)` & `login(DTO)`.
  - Hàm `forgotPassword()`: Sinh OTP lưu vào bảng `OtpToken`, kích hoạt `@Async` gửi mail (chống block luồng).
  - Hàm `verifyOtp()` & `resetPassword()`.
- [ ] Viết `NoteService`:
  - Các hàm CRUD: `createNote`, `updateNote`, `deleteToTrash`, `restoreFromTrash`, `forceDelete`.
  - Áp dụng `Pageable` của Spring Data JPA để xử lý Phân trang (Pagination) và Search thay vì tự code thủ công.
- [ ] Mở tính năng Đa luồng: Thêm `@EnableAsync` vào hàm `main` để cho phép gửi mail OTP chạy ngầm (giống cơ chế Queue delay của Laravel).

---

## Phase 5: REST Controllers & Exception Handling 🌐
- [ ] Tạo `AuthController`: `/api/auth/login`, `/register`, `/forgot-password`, `/reset-password`.
- [ ] Tạo `NoteController`: `/api/notes`, `/api/notes/{id}`, `/api/notes/{id}/pin`, `/api/notes/trash`.
- [ ] Tạo `AdminController`: Dùng `@PreAuthorize("hasRole('ADMIN')")` để chặn quyền (Thay thế cho Middleware cũ).
- [ ] Tạo `GlobalExceptionHandler` (`@RestControllerAdvice`): 
  - Gom toàn bộ lỗi `MethodArgumentNotValidException` (lỗi Validate form) và trả về format JSON chuẩn (`{ errors: ... }`).
  - Xử lý lỗi 404 (EntityNotFoundException) trả về `{ message: "Not Found" }`.

---

## Phase 6: Cloudinary Refactor & Final Audit ☁️
- [ ] Thống nhất luồng Cloudinary với Frontend: Backend sẽ KHÔNG CẦN xử lý Base64, Regex hay File IO nữa. API `createNote` chỉ nhận chuỗi HTML thuần chứa link ảnh từ Frontend đẩy xuống.
- [ ] Viết API xóa rác Cloudinary (Optional): Khi Note bị xóa vĩnh viễn (`forceDelete`), Backend lấy `cloudinary_public_id` để gọi API của Cloudinary xóa ảnh, tránh tốn dung lượng rác.
- [ ] Chạy Postman Test toàn bộ API để đối chiếu với Laravel cũ.
