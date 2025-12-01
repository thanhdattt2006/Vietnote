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
        'name.max' => 'Tên không được vượt quá 100 ký tự',
        'gmail.required' => 'Gmail không được để trống',
        'gmail.email' => 'Gmail không đúng định dạng',
        'subject.required' => 'Tiêu đề không được để trống',
        'subject.max' => 'Tiêu đề không được vượt quá 255 ký tự',
        'content.required' => 'Nội dung không được để trống',
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

      // ========== BƯỚC 3: GỬI EMAIL CẢM ƠN ==========
      // Chuẩn bị dữ liệu để truyền vào email template
      $emailData = [
        'name' => $response->name,
        'subject' => $response->subject,
        'content' => $response->content,
      ];

      // Gửi mail (sync - gửi ngay lập tức)
      Mail::to($response->gmail)->send(new ThankYouMail($emailData));

      // ========== BƯỚC 4: TRẢ VỀ RESPONSE THÀNH CÔNG ==========
      return response()->json([
        'success' => true,
        'message' => 'Gửi phản hồi thành công! Email cảm ơn đã được gửi đến ' . $response->gmail,
        'data' => $response
      ], 201);

    } catch (\Exception $e) {
      // ========== XỬ LÝ LỖI ==========
      Log::error('Error creating response: ' . $e->getMessage());
      return response()->json([
        'success' => false,
        'message' => 'Lỗi khi gửi phản hồi hoặc email',
        'error' => $e->getMessage()
      ], 500);
    }
  }
}
