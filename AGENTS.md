# 🤖 System Instructions for AI Agent (Vietnote Project)

## 1. Core Directives & Anti-Hallucination

- **READ BEFORE WRITE:** Always analyze the existing code logic before writing a refactored version.
- **NO HALLUCINATION:** Do not invent non-existent APIs. The backend uses Laravel Sanctum, Resend, and MySQL. Stick strictly to `axiosClient.js` for all backend communication.
- **NO PLACEHOLDERS:** Never write lazy comments like `// ... existing code`. Provide 100% complete, fully implemented, copy-pasteable files.

## 2. Frontend Architecture Standards & Tech Stack

- **Tech Stack:** React 18, Vite, TanStack Query (React Query) for data fetching, Zustand for global state, React Router v6 for navigation, React Hook Form + Yup for forms.
- **Cloudinary Integration:** Images pasted in the Editor must be uploaded to Cloudinary directly from the Frontend. The Backend will only receive the standard HTML `<img>` tag with the Cloudinary URL.
- **UI & Styling:** Use Tailwind CSS utility classes. DO NOT use inline styles (`style={{...}}`) except for dynamic height/width calculations.

## 3. Project Structure Convention (Bắt buộc tuân theo)

```text
src/
├── api/          # axiosClient.js + service gọi API chia theo module
│   ├── axiosClient.js
│   ├── authApi.js
│   ├── noteApi.js
│   └── ...
├── components/   # chia theo feature, KHÔNG để chung 1 đống
│   ├── notes/
│   ├── auth/
│   └── common/   # button, input, loading overlay... dùng chung toàn app
├── hooks/        # custom hooks (useNotes.js, useAuth.js)
├── stores/       # zustand stores
├── pages/        # page-level component, được lazy load trong AppRoutes.jsx
├── routes/       # AppRoutes.jsx, ProtectedRoute.jsx
└── utils/        # helper function thuần (formatDate, validators...)
```

_Nếu cần tạo file/folder mới mà không khớp cấu trúc trên, AI Agent phải dừng và hỏi trước, không tự bịa cấu trúc riêng._

## 4. Naming Convention

| Loại file          | Convention                 | Ví dụ                  |
| :----------------- | :------------------------- | :--------------------- |
| Component          | PascalCase                 | `NoteCard.jsx`         |
| Custom hook        | camelCase, prefix `use`    | `useNotes.js`          |
| Zustand store      | camelCase, prefix `use`    | `useAuthStore.js`      |
| API service        | camelCase, suffix `Api`    | `noteApi.js`           |
| Util function file | camelCase                  | `formatDate.js`        |
| CSS module         | kebab-case + `.module.css` | `note-card.module.css` |

_Biến và function trong code: `camelCase`. Constant cố định (enum, config): `UPPER_SNAKE_CASE`._

## 5. API Contract Lock (Chống AI tự bịa response)

- Nếu phát hiện `axiosClient.js` hoặc API hiện tại thiếu endpoint hoặc response shape không đủ cho UI cần dùng:
  - **KHÔNG** tự bịa field giả lập, không tự đoán shape JSON trả về.
  - Phải dừng lại, ghi rõ trong output: `// ⚠️ CẦN BACKEND BỔ SUNG: <mô tả endpoint/field thiếu>` và hỏi lại user trước khi viết tiếp phần liên quan.
- Mọi gọi API mới phải đi qua `axiosClient.js` (interceptor xử lý token/refresh đã setup sẵn ở đó). Không tạo instance axios mới trong component.

## 6. Error & Loading State Convention

- **Loading:** Dùng chung component `<LoadingOverlay />` đã có. Không tự tạo spinner/skeleton riêng cho từng component trừ khi có yêu cầu cụ thể.
- **Error:** Dùng toast để hiển thị lỗi. Không dùng `alert()` hoặc `console.log` để báo lỗi cho user.
- **React Query config chung:**
  - Khởi tạo 1 `queryClient` duy nhất ở `App.jsx` với `staleTime`, `retry` mặc định hợp lý (ví dụ `staleTime: 1000 * 60`, `retry: 1`).
  - Chỉ override config riêng cho từng `useQuery` khi có lý do rõ ràng (data real-time, cache lâu...), và phải comment lý do tại sao override.

## 7. Refactor Safety Rule & Git Commit

- **Refactor Safety:** Khi refactor 1 component/feature cũ, **PHẢI giữ nguyên hành vi (behavior)** hiện tại trừ khi `TODO.md` yêu cầu thay đổi logic rõ ràng. Refactor = đổi cấu trúc code, KHÔNG đổi tính năng nếu không được yêu cầu. Trước khi xóa file/component cũ, phải xác nhận không còn nơi nào import nó.
- **Git Commit Convention:** Theo chuẩn Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`. Message ngắn gọn, mô tả đúng phạm vi thay đổi.

## 8. Rule

**Luôn git status trước để xem tình hình trước khi commit**
**Luôn commit chuẩn doanh nghiệp bằng tiếng Anh**
