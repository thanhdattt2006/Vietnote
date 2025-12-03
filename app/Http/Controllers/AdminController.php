<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AccountModel;
use App\Models\ResponseModel;
use App\Models\NoteModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\BroadcastMail;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
  // 1. STATS NÂNG CAO (Dashboard Widget & Chart)
  public function getStats()
  {
    try {
      $stats = Cache::remember('admin_dashboard_stats', 600, function () {

        // --- TOÀN BỘ LOGIC TÍNH TOÁN CŨ NHÉT VÀO ĐÂY ---
        $totalUsers = AccountModel::count();
        $totalNotes = NoteModel::count();
        $totalResponses = ResponseModel::count();

        $genderStats = AccountModel::select('gender', DB::raw('count(*) as total'))
          ->groupBy('gender')->get();
        $genderData = ['male' => 0, 'female' => 0, 'other' => 0];
        foreach ($genderStats as $stat) {
          $g = $stat->gender ?? 'other';
          $genderData[$g] = $stat->total;
        }

        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
          $date = Carbon::now()->subMonths($i);
          $yearNum = $date->year;
          $monthNum = $date->month;

          $userCount = AccountModel::whereYear('createdAt', $yearNum)
            ->whereMonth('createdAt', $monthNum)->count();
          $noteCount = NoteModel::whereYear('createdAt', $yearNum)
            ->whereMonth('createdAt', $monthNum)->count();

          $chartData[] = [
            'name' => $date->format('M'),
            'Users' => $userCount,
            'Notes' => $noteCount
          ];
        }

        // Trả về mảng dữ liệu để lưu vào Cache
        return [
          'total_users' => $totalUsers,
          'total_notes' => $totalNotes,
          'total_responses' => $totalResponses,
          'gender_stats' => $genderData,
          'growth_chart' => $chartData
        ];
      });

      return response()->json($stats);

    } catch (Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  // 2. LẤY USER (Kèm số lượng Note đã viết)
  public function getUsers(Request $request)
  {
    try {
      $query = AccountModel::query();

      // Tìm kiếm (Theo tên hoặc email)
      if ($request->has('keyword') && $request->keyword) {
        $k = $request->keyword;
        $query->where(function ($q) use ($k) {
          $q->where('username', 'LIKE', "%{$k}%")
            ->orWhere('name', 'LIKE', "%{$k}%");
        });
      }

      // withCount('notes'): Đếm số note của user mà không cần load hết note ra
      // Giúp Admin biết ông nào là "Khách hàng tiềm năng"
      $users = $query->withCount('notes')
        ->orderBy('createdAt', 'desc')
        ->paginate(10);

      return response()->json($users);
    } catch (Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  // 3. LẤY FEEDBACK
  public function getFeedbacks(Request $request)
  {
    try {
      $feedbacks = ResponseModel::orderBy('sentAt', 'desc')->paginate(10);
      return response()->json($feedbacks);
    } catch (Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  // 4. XÓA USER 
  public function deleteUser($id)
  {
    try {
      $user = AccountModel::find($id);
      if (!$user)
        return response()->json(['message' => 'User not found'], 404);
      if ($user->id === auth()->id())
        return response()->json(['message' => 'Không thể tự xóa mình'], 400);

      $user->tokens()->delete();
      $user->delete();

      return response()->json(['message' => 'Đã xóa User thành công']);
    } catch (Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  // 5. GỬI MAIL 
  public function sendBroadcast(Request $request)
  {
    try {
      $request->validate(['subject' => 'required', 'content' => 'required']);

      $users = AccountModel::select('username')->whereNotNull('username')->get();
      $count = 0;

      foreach ($users as $user) {
        if (filter_var($user->username, FILTER_VALIDATE_EMAIL)) {
          // Dùng queue() và delay 1 giờ
          Mail::to($user->username)
            ->queue(
              (new BroadcastMail($request->subject, $request->content))->delay(now()->addHour(1)) // <--- Sửa ở đây
            );
          $count++;
        }
      }

      // Trả về thành công ngay lập tức
      return response()->json(['message' => "Đã gửi $count email vào hàng đợi. Render Worker sẽ xử lý."]);

    } catch (Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  // 6. XÓA FEEDBACK
  public function deleteFeedback($id)
  {
    try {
      $feedback = ResponseModel::find($id);
      if (!$feedback)
        return response()->json(['message' => 'Feedback not found'], 404);

      $feedback->delete();
      return response()->json(['message' => 'Đã xóa phản hồi']);
    } catch (Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }
}
