<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail; // ← Import Mail facade
use App\Models\ResponseModel;
use App\Mail\ThankYouMail; // ← Import Mailable class

class ResponseController extends Controller
{
  public function store(Request $request)
  {
    try {
      // ========== BƯỚC 1: VALIDATE INPUT ==========
      $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:100',
        'gmail' => 'required|email|max:255',
        'subject' => 'required|string|max:255',
        'content' => 'required|string',
      ], [
        'name.required' => 'Tên không được để trống',
        'gmail.required' => 'Gmail không được để trống',
        'content.required' => 'Nội dung không được để trống',
        // ... (Các message khác)
      ]);

      // Nếu validate fail → Trả về lỗi 422
      if ($validator->fails()) {
        return response()->json([
          'success' => false,
          'message' => 'Dữ liệu không hợp lệ',
          'errors' => $validator->errors()
        ], 422);
      }

      // ========== BƯỚC 2: LƯU VÀO DATABASE ==========
      $response = ResponseModel::create([
        'name' => $request->name,
        'gmail' => $request->gmail,
        'subject' => $request->subject,
        'content' => $request->content,
        'sentAt' => now(),
      ]);

      // ========== BƯỚC 3: GỬI EMAIL CẢM ƠN (ASYNC/QUEUE) ==========
      // Chuyển sang queue() để giải phóng server ngay lập tức (Xử lý hiệu năng)
      try {
        // Ông phải đảm bảo ThankYouMail đã implement ShouldQueue
        Mail::to($response->gmail)->queue(new ThankYouMail($response->toArray()));
      } catch (\Exception $e) {
        // Log lỗi mail nhưng vẫn trả về thành công vì Feedback đã được lưu vào DB
        Log::error('Failed to dispatch ThankYouMail: ' . $e->getMessage());
      }

      // ========== BƯỚC 4: TRẢ VỀ RESPONSE THÀNH CÔNG NHANH ==========
      return response()->json([
        'success' => true,
        'message' => 'Gửi phản hồi thành công! Email cảm ơn đang được xử lý.',
        'data' => $response
      ], 201);

    } catch (\Exception $e) {
      Log::error('Error creating response: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Lỗi khi gửi phản hồi',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}
