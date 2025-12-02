<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AccountModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordOTP;
use Carbon\Carbon;

class AuthController extends Controller
{
  public function register(Request $request)
  {
    try {
      $validator = Validator::make($request->all(), [
        'username' => 'required|unique:Account,username|min:4',
        'password' => 'required|min:6',
        'name' => 'nullable|string|max:100',
        'age' => 'nullable|integer',
        'gender' => 'nullable|in:male,female,other'
      ]);

      if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
      }

      $user = AccountModel::create([
        'username' => $request->username,
        'password' => Hash::make($request->password),
        'name' => $request->name,
        'age' => $request->age,
        'gender' => $request->gender
      ]);

      // Tạo token Sanctum
      $token = $user->createToken('auth_token')->plainTextToken;

      return response()->json([
        'message' => 'Register success',
        'user' => $user,
        'token' => $token
      ]);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Đăng nhập
  public function login(Request $request)
  {
    try {
      $user = AccountModel::where('username', $request->username)->first();

      if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
      }

      // Tạo token Sanctum
      $token = $user->createToken('auth_token')->plainTextToken;

      return response()->json([
        'message' => 'Login success',
        'token' => $token,
        'user' => $user
      ]);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Đăng xuất
  public function logout(Request $request)
  {
    try {
      // Xóa token hiện tại
      $request->user()->currentAccessToken()->delete();

      return response()->json(['message' => 'Logged out successfully']);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Quên mật khẩu (mock)
  public function forgotPassword(Request $request)
  {
    try {
      // Validate email tồn tại
      $user = AccountModel::where('username', $request->username)->first(); // username là email
      if (!$user) {
        return response()->json(['message' => 'Không tìm thấy tài khoản với email này'], 404);
      }

      // Tạo mã OTP 6 số ngẫu nhiên
      $token = rand(100000, 999999);

      // Lưu vào bảng password_resets (Xóa token cũ nếu có trước)
      DB::table('password_reset_tokens')->where('email', $request->username)->delete();
      DB::table('password_reset_tokens')->insert([
        'email' => $request->username,
        'token' => $token, // Lưu thẳng token (hoặc hash nếu muốn bảo mật cực cao, ở đây lưu thô cho dễ check)
        'created_at' => Carbon::now()
      ]);

      // Gửi Email
      Mail::to($request->username)->send(new ResetPasswordOTP($token));

      return response()->json(['message' => 'Mã xác nhận đã được gửi vào email của bạn']);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }
  // 2. Xác thực mã OTP
  public function verifyOTP(Request $request)
  {
    try {
      $request->validate([
        'username' => 'required|email',
        'token' => 'required'
      ]);

      // Check trong DB (nhớ sửa tên bảng đúng với DB của ông)
      $record = DB::table('password_reset_tokens')
        ->where('email', $request->username)
        ->where('token', $request->token)
        ->first();

      if (!$record) {
        return response()->json(['message' => 'Mã xác nhận không đúng'], 400);
      }

      // Check hết hạn (ví dụ 15 phút)
      if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
        return response()->json(['message' => 'Mã đã hết hạn, vui lòng gửi lại'], 400);
      }

      return response()->json(['message' => 'Mã hợp lệ']);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // 3. Đặt lại mật khẩu (Check OTP + Đổi pass)
  public function resetPassword(Request $request)
  {
    try {
      $request->validate([
        'username' => 'required|email',
        'token' => 'required', // Mã OTP người dùng nhập
        'password' => 'required|min:6', // Mật khẩu mới
      ]);

      // Kiểm tra token trong DB
      $resetRecord = DB::table('password_reset_tokens')
        ->where('email', $request->username)
        ->where('token', $request->token)
        ->first();

      if (!$resetRecord) {
        return response()->json(['message' => 'Mã xác nhận không đúng'], 400);
      }

      // Kiểm tra hết hạn (ví dụ 15 phút)
      if (Carbon::parse($resetRecord->created_at)->addMinutes(15)->isPast()) {
        return response()->json(['message' => 'Mã xác nhận đã hết hạn'], 400);
      }

      // Token ngon -> Đổi mật khẩu user
      $user = AccountModel::where('username', $request->username)->first();
      $user->password = Hash::make($request->password);
      $user->save();

      // Xóa token đã dùng
      DB::table('password_reset_tokens')->where('email', $request->username)->delete();

      // Đăng nhập luôn cho user (Tạo token mới trả về)
      $newToken = $user->createToken('auth_token')->plainTextToken;

      return response()->json([
        'message' => 'Đổi mật khẩu thành công',
        'token' => $newToken,
        'user' => $user
      ]);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Redirect đến provider (Google, Github...)
  public function redirectToProvider($provider)
  {
    try {
      return Socialite::driver($provider)->stateless()->redirect();
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Callback xử lý provider
  public function handleProviderCallback($provider)
  {
    try {
      $socialUser = Socialite::driver($provider)->stateless()->user();

      $user = AccountModel::updateOrCreate(
        ['username' => $socialUser->email],
        [
          'name' => $socialUser->name ?? $socialUser->nickname,
          'password' => Hash::make(Str::random(16)),
        ]
      );

      $user->tokens()->delete();
      $token = $user->createToken('social-login')->plainTextToken;

      $frontendUrl = env('FRONTEND_URL', 'https://vietnote.vercel.app');
      return redirect($frontendUrl . '/auth/callback?token=' . $token . '&user=' . urlencode(json_encode($user)));
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }


  public function updateProfile(Request $request)
  {
    try {
      // Lấy user hiện tại đang đăng nhập (nhờ Sanctum Token)
      $user = $request->user();

      // Validate dữ liệu gửi lên
      $validator = Validator::make($request->all(), [
        'name' => 'nullable|string|max:100',
        'age' => 'nullable|integer|min:1|max:150', // Validate tuổi hợp lý tí :D
        'gender' => 'nullable|in:male,female,other' // Khớp với enum frontend
      ]);

      if ($validator->fails()) {
        return response()->json([
          'message' => 'Dữ liệu không hợp lệ',
          'errors' => $validator->errors()
        ], 422);
      }

      // Cập nhật vào DB (Bảng Account)
      $user->update([
        'name' => $request->name,
        'age' => $request->age,
        'gender' => $request->gender
      ]);

      return response()->json([
        'message' => 'Cập nhật hồ sơ thành công',
        'user' => $user // Trả về user mới để Frontend cập nhật lại state
      ]);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  public function changePassword(Request $request)
  {
    try {
      $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:6|different:current_password', // Mới phải khác cũ
      ]);

      $user = $request->user();

      // Kiểm tra mật khẩu cũ có đúng không
      if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['message' => 'Mật khẩu hiện tại không đúng'], 400);
      }

      // Cập nhật mật khẩu mới
      $user->password = Hash::make($request->new_password);
      $user->save();

      // (Tuỳ chọn) Xóa các token khác để đăng xuất thiết bị lạ, giữ lại thiết bị này
      // $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

      return response()->json(['message' => 'Đổi mật khẩu thành công']);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  public function deleteAccount(Request $request)
  {
    try {
      $user = $request->user();

      // 1. Xóa Token đăng nhập
      $user->tokens()->delete();

      // 2. Xóa dữ liệu liên quan (Nếu Database chưa set ON DELETE CASCADE)
      // Ví dụ: Xóa ảnh, xóa note... (Tùy logic DB của ông)
      // DB::table('Note')->where('ownerId', $user->id)->delete(); 

      // 3. Xóa User
      $user->delete();

      return response()->json(['message' => 'Tài khoản đã bị xóa vĩnh viễn']);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  private function debugError(Exception $e)
  {
    return response()->json([
      'error' => $e->getMessage(),
      'file' => $e->getFile(),
      'line' => $e->getLine(),
      'trace' => collect($e->getTrace())->take(3)
    ], 500);
  }
}
