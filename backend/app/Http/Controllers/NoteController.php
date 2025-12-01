<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NoteModel;
use App\Models\NoteImageModel;
use Illuminate\Support\Facades\Storage;
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
        ->where('isDeleted', false)
        ->first();

      if (!$note) {
        return response()->json(['message' => 'Note not found or deleted'], 404);
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
      // Tạo note trước
      $note = NoteModel::create([
        'title' => $request->title,
        'content' => '',
        'isPinned' => $request->isPinned ?? false,
        'isDeleted' => false,
        'ownerId' => auth()->id(),
      ]);

      // Xử lý ảnh base64 (nếu có)
      $processedContent = $this->extractAndUploadImages($request->content, $note->id);

      // Update content đã xử lý
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
      $note = NoteModel::find($id);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

      // Xử lý ảnh base64 mới (nếu có)
      $processedContent = $this->extractAndUploadImages($request->content ?? $note->content, $note->id);

      $note->update([
        'title' => $request->title ?? $note->title,
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
      $note = NoteModel::find($id);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

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
      $note = NoteModel::find($id);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

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
      $note = NoteModel::find($id);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

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

  // Xóa vĩnh viễn note (chỉ xóa note trong trash)
  public function forceDelete($id)
  {
    try {
      $note = NoteModel::find($id);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

      // Kiểm tra note phải ở trong trash (isDeleted = true)
      if (!$note->isDeleted) {
        return response()->json([
          'message' => 'Note must be in trash before permanently deleting'
        ], 400);
      }

      // Xóa tất cả ảnh liên quan trước
      $images = $note->images;
      foreach ($images as $image) {
        // Xóa file vật lý
        $path = str_replace('/storage/', '', $image->imageUrl);
        if (Storage::disk('public')->exists($path)) {
          Storage::disk('public')->delete($path);
        }
        // Xóa record trong DB
        $image->delete();
      }

      // Xóa note vĩnh viễn
      $note->delete();

      return response()->json(['message' => 'Note permanently deleted']);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Tìm theo title
  public function searchByTitle(Request $request)
  {
    try {
      $keyword = $request->get('keyword', '');
      $perPage = $request->get('limit', 20);

      if (empty($keyword)) {
        return response()->json([
          'message' => 'Keyword is required',
          'data' => []
        ], 400);
      }

      $notes = NoteModel::with('images')
        ->where('isDeleted', false)
        ->where('title', 'LIKE', "%{$keyword}%")
        ->orderByDesc('isPinned')
        ->orderByDesc('updatedAt')
        ->paginate($perPage);

      return response()->json($notes);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Tìm theo content
  public function searchByContent(Request $request)
  {
    try {
      $keyword = $request->get('keyword', '');
      $perPage = $request->get('limit', 20);

      if (empty($keyword)) {
        return response()->json([
          'message' => 'Keyword is required',
          'data' => []
        ], 400);
      }

      $notes = NoteModel::with('images')
        ->where('isDeleted', false)
        ->where('content', 'LIKE', "%{$keyword}%")
        ->orderByDesc('isPinned')
        ->orderByDesc('updatedAt')
        ->paginate($perPage);

      return response()->json($notes);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Tìm cả title và content
  public function search(Request $request)
  {
    try {
      $keyword = $request->get('keyword', '');
      $perPage = $request->get('limit', 20);

      if (empty($keyword)) {
        return response()->json([
          'message' => 'Keyword is required',
          'data' => []
        ], 400);
      }

      $notes = NoteModel::with('images')
        ->where('isDeleted', false)
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

  // Hàm helper: Tách base64 ra file, lưu vào NoteImage
  private function extractAndUploadImages($content, $noteId)
  {
    // Tìm tất cả ảnh base64
    preg_match_all('/<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/i', $content, $matches);

    if (empty($matches[0])) {
      return $content; // Không có ảnh base64
    }

    foreach ($matches[0] as $index => $imgTag) {
      $extension = $matches[1][$index]; // png, jpeg, jpg...
      $base64Data = $matches[2][$index];

      // Decode base64
      $imageData = base64_decode($base64Data);

      // Tạo tên file unique
      $filename = time() . '_' . uniqid() . '.' . $extension;
      $path = 'note-images/' . $filename;

      // Lưu file
      Storage::disk('public')->put($path, $imageData);

      // Tạo URL
      $imageUrl = asset('storage/' . $path);

      // Lưu vào database NoteImage
      NoteImageModel::create([
        'noteId' => $noteId,
        'imageUrl' => $imageUrl,
        'uploadedAt' => now()
      ]);

      // Thay thế base64 bằng URL trong content
      $newImgTag = str_replace('data:image/' . $extension . ';base64,' . $base64Data, $imageUrl, $imgTag);
      $content = str_replace($imgTag, $newImgTag, $content);
    }

    return $content;
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
