<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NoteModel;
use App\Models\NoteImageModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Exception;

class NoteController extends Controller
{
  // Lấy tất cả note đang hoạt động (có pagination)
  public function index(Request $request)
  {
    try {
      $userId = auth()->id();
      $perPage = $request->get('limit', 20);

      $notes = NoteModel::with('images')
        ->where('isDeleted', false)
        ->where('ownerId', $userId)
        ->orderByDesc('isPinned')
        ->orderByDesc('updatedAt')
        ->paginate($perPage);

      return response()->json($notes);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Lấy note trong thùng rác
  public function trash()
  {
    try {
      $userId = auth()->id();

      $trashNotes = NoteModel::with('images')
        ->where('isDeleted', true)
        ->where('ownerId', $userId)
        ->orderByDesc('deletedAt')
        ->get();

      return response()->json($trashNotes);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Xem chi tiết note theo id
  public function show($id)
  {
    try {
      $note = NoteModel::with('images')
        ->where('id', $id)
        ->where('ownerId', auth()->id()) // Bảo mật: Chỉ xem được note của mình
        ->first();

      if (!$note) {
        return response()->json(['message' => 'Note not found or access denied'], 404);
      }

      return response()->json($note);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Tạo note mới (tự động xử lý base64)
  public function store(Request $request)
  {
    try {
      // Validate input
      $request->validate([
        'title' => 'nullable|string',
        'content' => 'nullable|string',
      ]);

      // 1. Tạo note trước
      $note = NoteModel::create([
        'title' => $request->title ?? 'Untitled',
        'content' => '', // Tạm thời để trống để xử lý ảnh sau
        'isPinned' => $request->isPinned ?? false,
        'isDeleted' => false,
        'ownerId' => auth()->id(), // Lấy ID user đang login
      ]);

      // 2. Xử lý ảnh base64 (nếu có)
      $processedContent = $this->extractAndUploadImages($request->content, $note->id, $note->title);

      // 3. Update content đã xử lý
      $note->content = $processedContent;
      $note->save();

      // Load lại với images
      $note->load('images');

      return response()->json($note, 201);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Cập nhật note
  public function update(Request $request, $id)
  {
    try {
      $note = NoteModel::where('id', $id)->where('ownerId', auth()->id())->first();

      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

      // Xử lý ảnh base64 mới (nếu có)
      $currentTitle = $request->title ?? $note->title;
      $processedContent = $this->extractAndUploadImages($request->content ?? $note->content, $note->id, $currentTitle);

      $note->update([
        'title' => $currentTitle,
        'content' => $processedContent,
        'isPinned' => $request->isPinned ?? $note->isPinned,
      ]);

      $note->load('images');
      return response()->json($note);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Xóa mềm (chuyển vào thùng rác)
  public function destroy($id)
  {
    try {
      $note = NoteModel::where('id', $id)->where('ownerId', auth()->id())->first();
      if (!$note)
        return response()->json(['message' => 'Note not found'], 404);

      $note->update([
        'isDeleted' => true,
        'deletedAt' => now()
      ]);

      return response()->json(['message' => 'Note moved to trash']);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Khôi phục từ thùng rác
  public function restore($id)
  {
    try {
      $note = NoteModel::where('id', $id)->where('ownerId', auth()->id())->first();
      if (!$note)
        return response()->json(['message' => 'Note not found'], 404);

      $note->update([
        'isDeleted' => false,
        'deletedAt' => null
      ]);

      return response()->json(['message' => 'Note restored']);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Ghim hoặc bỏ ghim note
  public function pin($id)
  {
    try {
      $note = NoteModel::where('id', $id)->where('ownerId', auth()->id())->first();
      if (!$note)
        return response()->json(['message' => 'Note not found'], 404);

      $note->isPinned = !$note->isPinned;
      $note->save();

      return response()->json([
        'message' => $note->isPinned ? 'Note pinned' : 'Note unpinned',
        'note' => $note
      ]);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Xóa vĩnh viễn note
  public function forceDelete($id)
  {
    try {
      $note = NoteModel::where('id', $id)->where('ownerId', auth()->id())->first();
      if (!$note)
        return response()->json(['message' => 'Note not found'], 404);

      if (!$note->isDeleted) {
        return response()->json(['message' => 'Note must be in trash before deleting'], 400);
      }

      // Xóa file ảnh vật lý
      $images = $note->images;
      foreach ($images as $image) {
        $path = str_replace('/storage/', '', $image->imageUrl);
        if (Storage::disk('public')->exists($path)) {
          Storage::disk('public')->delete($path);
        }
        $image->delete();
      }

      $note->delete();

      return response()->json(['message' => 'Note permanently deleted']);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Tìm kiếm (Gộp chung search title và content vào một API cho gọn, Frontend gọi /search/title cũng đc)
  public function searchByTitle(Request $request)
  {
    try {
      $keyword = $request->get('keyword', '');
      $perPage = $request->get('limit', 20);
      $userId = auth()->id();

      $notes = NoteModel::with('images')
        ->where('isDeleted', false)
        ->where('ownerId', $userId)
        ->where(function ($query) use ($keyword) {
          $query->where('title', 'LIKE', "%{$keyword}%")
            ->orWhere('content', 'LIKE', "%{$keyword}%");
        })
        ->orderByDesc('isPinned')
        ->orderByDesc('updatedAt')
        ->paginate($perPage);

      return response()->json($notes);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // --- HÀM HELPER XỬ LÝ ẢNH (QUAN TRỌNG) ---
  private function extractAndUploadImages($content, $noteId, $noteTitle = 'note')
  {
    preg_match_all('/<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/i', $content, $matches);

    if (empty($matches[0])) {
      return $content;
    }

    foreach ($matches[0] as $index => $imgTag) {
      $extension = $matches[1][$index];
      $base64Data = $matches[2][$index];

      // 1. Clean Base64 String (Fix lỗi ảnh bị nát)
      $base64Data = str_replace(' ', '+', $base64Data);
      $imageData = base64_decode($base64Data);

      if ($imageData === false) {
        Log::error("Failed to decode image for note $noteId");
        continue;
      }

      // 2. SEO Friendly Filename
      $slug = Str::slug($noteTitle, '-');
      $filename = "vietnote-{$slug}-" . time() . "-{$index}.{$extension}";
      $path = 'note-images/' . $filename;

      // 3. Lưu file vào storage/app/public
      Storage::disk('public')->put($path, $imageData);

      // 4. Lưu đường dẫn tương đối (Relative Path) để Frontend tự xử lý Proxy
      $imageUrl = '/storage/' . $path;

      NoteImageModel::create([
        'noteId' => $noteId,
        'imageUrl' => $imageUrl,
        'uploadedAt' => now()
      ]);

      // 5. Thay thế thẻ img cũ bằng thẻ img mới có src chuẩn và alt SEO
      $newImgTag = sprintf(
        '<img src="%s" alt="Vietnote - %s" loading="lazy" style="max-width:100%%; height:auto; border-radius:8px; display:block; margin:10px auto;">',
        $imageUrl,
        htmlspecialchars($noteTitle)
      );

      // Replace chính xác
      $content = str_replace($imgTag, $newImgTag, $content);
    }

    return $content;
  }

  private function debugError(Exception $e)
  {
    return response()->json([
      'error' => $e->getMessage(),
      'file' => $e->getFile(),
      'line' => $e->getLine()
    ], 500);
  }
}
