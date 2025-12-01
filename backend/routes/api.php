<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\NoteImageController;
use App\Http\Controllers\ResponseController;

/*
|--------------------------------------------------------------------------
| API Routes - Vietnote
|--------------------------------------------------------------------------
*/

// ========================================================================
// 1. PUBLIC ROUTES (Ai cũng gọi được, không cần Token)
// ========================================================================

// Test check server
Route::get('/test', function () {
    return response()->json(['status' => 'ok', 'time' => now()]);
});

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);

// OAuth (Google, Github...)
Route::get('auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// Feedback (Cho phép khách gửi)
Route::post('/responses', [ResponseController::class, 'store']);

// Public Image Viewing (Nếu muốn xem ảnh mà không cần login)
Route::get('/notes/{id}/images', [NoteImageController::class, 'index']);


// ========================================================================
// 2. PROTECTED ROUTES (Phải có Token mới vào được - Khu vực cấm)
// ========================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- User & Profile ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/account/update', [AuthController::class, 'updateProfile']); // fix lỗi Settings page

    // --- Notes (CRUD Cơ bản) ---
    Route::get('/notes', [NoteController::class, 'index']);          // Lấy danh sách
    Route::post('/notes', [NoteController::class, 'store']);         // Tạo mới
    Route::get('/notes/trash', [NoteController::class, 'trash']);            // Xem thùng rác
    Route::get('/notes/search/title', [NoteController::class, 'searchByTitle']); // --- Search (Tìm kiếm trong danh sách của mình) ---
    Route::get('/notes/{id}', [NoteController::class, 'show']);      // Xem chi tiết (Đã move vào đây để check ownerId)
    Route::put('/notes/{id}', [NoteController::class, 'update']);    // Sửa
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);// Xóa mềm

    // --- Notes (Chức năng nâng cao) ---
    Route::post('/notes/{id}/restore', [NoteController::class, 'restore']);  // Khôi phục
    Route::post('/notes/{id}/pin', [NoteController::class, 'pin']);          // Ghim
    Route::delete('/notes/{id}/force', [NoteController::class, 'forceDelete']); // Xóa vĩnh viễn

    // Route::get('/notes/search/content', [NoteController::class, 'searchByContent']); // Mở ra nếu cần

    // --- Note Images ---
    Route::post('/notes/{id}/images', [NoteImageController::class, 'store']);
    Route::delete('/images/{id}', [NoteImageController::class, 'destroy']);

});
