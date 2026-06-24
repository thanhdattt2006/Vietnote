# 📝 Vietnote Frontend Refactor TODO List

Danh sách các công việc cần thực hiện để biến mã nguồn hiện tại thành cấu trúc Enterprise chuẩn Senior. Đánh dấu `[x]` khi hoàn thành, `[/]` khi đang thực hiện.

## Phase 1: Setup Infrastructure & Libraries
- [ ] Cài đặt `@tanstack/react-query` và bọc `QueryClientProvider` ở `App.jsx`.
- [ ] Cài đặt `zustand` và tạo `useModalStore.js`, `useAuthStore.js` (hoặc nâng cấp Context hiện tại).
- [ ] Cài đặt `react-hook-form` và `yup` hoặc `zod`.
- [ ] Cấu hình Tailwind CSS (nếu chưa có) để chuẩn bị dọn dẹp Inline Styles.

## Phase 2: Architecture & Security Routing
- [ ] Refactor `AppRoutes.jsx`: Áp dụng `React.lazy()` và `<Suspense>` cho toàn bộ Pages.
- [ ] Refactor `AdminLayout.jsx`: Xóa inline CSS, thêm logic xác thực Token thật với API thay vì check LocalStorage.
- [ ] Refactor `MainLayout.jsx`: Chuyển logic bảo vệ route vào một component `<ProtectedRoute />` chuyên dụng.

## Phase 3: Component Decomposition & Data Fetching
- [ ] Tạo custom hooks: `useNotes.js`, `useAuth.js`.
- [ ] Đập bỏ God Component `HomePage.jsx` thành:
  - [ ] `NoteSearchBar.jsx`
  - [ ] `NoteEditorWidget.jsx`
  - [ ] `NoteGrid.jsx` & `NoteCard.jsx`
- [ ] Thay thế `useEffect` gọi API bằng `useQuery` và `useMutation` trong các trang.

## Phase 4: Forms & Cross-Tab Sync
- [ ] Áp dụng `React Hook Form` vào `AuthPage.jsx` để tự động validate (minLength, required) với `Yup`.
- [ ] Tách `GoogleIcon`, `GithubIcon` ra file components riêng.
- [ ] Bổ sung sự kiện `window.addEventListener('storage')` trong Auth để tự động đăng xuất trên nhiều Tab.

## Phase 5: UI & Final Polish
- [ ] Dọn dẹp toàn bộ file CSS rác, loại bỏ `style={{...}}` trong component.
- [ ] Triển khai tính năng gọi API Upload ảnh lên Cloudinary từ Frontend.
- [ ] Chạy audit lại hiệu năng (Lighthouse).
