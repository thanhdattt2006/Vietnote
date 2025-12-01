# Vietnote - Ứng Dụng Ghi Chú

Ứng dụng ghi chú đơn giản và hiện đại được xây dựng với ReactJS, Vite, và PrimeReact.

## 🚀 Tính Năng

- ✅ Tạo, chỉnh sửa, xóa ghi chú với trình soạn thảo rich text (Quill)
- ✅ Hiển thị ghi chú dạng grid (3 cột x 5 dòng, phân trang)
- ✅ Thùng rác với tự động xóa sau 7 ngày
- ✅ Hệ thống phản hồi người dùng
- ✅ Dark/Light mode tự động theo hệ thống
- ✅ Đa ngôn ngữ (Tiếng Việt/English)
- ✅ Responsive design
- ✅ Lưu trữ local với localStorage

## 🛠️ Công Nghệ

- **React 18.3** - UI Library
- **Vite 5.4** - Build Tool
- **React Router 6** - Routing
- **PrimeReact 10** - UI Components
- **PrimeIcons** - Icon Library
- **PrimeFlex** - CSS Utility
- **Quill 2.0** - Rich Text Editor
- **i18next** - Internationalization

## 📦 Cài Đặt

### 1. Tạo project với Vite

```bash
npm create vite@latest vietnote -- --template react
cd vietnote
```

### 2. Cài đặt dependencies

```bash
npm install react-router-dom primereact primeicons primeflex quill i18next react-i18next
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### 4. Build production

```bash
npm run build
```

## 📁 Cấu Trúc Thư Mục

```
vietnote/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── notes/
│   │       ├── NoteCard.jsx
│   │       └── NoteDetailDialog.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── localization/
│   │   ├── en.json
│   │   └── vi.json
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── TrashPage.jsx
│   │   ├── FeedbackPage.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/
│   │   └── i18n.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Giao Diện

### Layout

- **Navbar**: 240px cố định bên trái với menu điều hướng
- **Content**: Khu vực chính hiển thị nội dung
- **Footer**: Thông tin bản quyền

### Trang Chủ (Home)

- Form tạo/chỉnh sửa ghi chú với Editor (Quill)
- Grid hiển thị tối đa 15 ghi chú (3x5)
- Phân trang tự động
- Click vào note để xem chi tiết trong Dialog

### Thùng Rác (Trash)

- Hiển thị thông báo: "Ghi chú sẽ tự động xóa sau 7 ngày"
- Nút "Xóa Tất Cả" để dọn sạch thùng rác
- Mỗi note hiển thị số ngày còn lại
- Nút khôi phục và xóa vĩnh viễn

### Phản Hồi (Feedback)

- Dropdown chọn lý do phản hồi
- Textarea nhập nội dung
- Nút gửi với validation

### Cài Đặt (Settings)

- Chuyển đổi ngôn ngữ (Vi/En)
- Chuyển đổi theme (Light/Dark)
- Thông tin ứng dụng

## 🌐 Đa Ngôn Ngữ

Ứng dụng hỗ trợ 2 ngôn ngữ:

- 🇻🇳 Tiếng Việt (Mặc định)
- 🇬🇧 English

Ngôn ngữ được lưu trong localStorage và tự động khôi phục khi truy cập lại.

## 🎨 Theme

- **Light Mode**: Lara Light Blue
- **Dark Mode**: Lara Dark Blue

Theme tự động nhận diện từ hệ thống và lưu preference trong localStorage.

## 💾 Lưu Trữ Dữ Liệu

Tất cả dữ liệu được lưu trong localStorage:

- `notes`: Danh sách ghi chú
- `trash`: Ghi chú đã xóa
- `feedbacks`: Phản hồi người dùng
- `theme`: Light/Dark preference
- `language`: Ngôn ngữ đã chọn

## 👨‍💻 Developer

**Võ Cao Thành Đạt aka Dave**

---

© 2025 Vietnote - All rights reserved
