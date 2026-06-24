<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NoteModel;
use App\Models\NoteImageModel;
use Illuminate\Support\Facades\Storage;
use Exception;

class NoteImageController extends Controller
{
  // Lấy tất cả ảnh của 1 note
  public function index($noteId)
  {
    try {
      $note = NoteModel::find($noteId);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

      $images = NoteImageModel::where('noteId', $noteId)
        ->orderBy('uploadedAt', 'desc')
        ->get();

      return response()->json($images);
    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Upload ảnh cho note (form-data)
  public function store(Request $request, $noteId)
  {
    try {
      // Validate note tồn tại
      $note = NoteModel::find($noteId);
      if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
      }

      // Validate file ảnh
      $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120' // Max 5MB
      ]);

      // Lưu file vào storage/app/public/note-images
      $image = $request->file('image');
      $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
      $path = $image->storeAs('note-images', $filename, 'public');

      // Lưu vào database
      $noteImage = NoteImageModel::create([
        'noteId' => $noteId,
        'imageUrl' => '/storage/' . $path,
        'uploadedAt' => now()
      ]);

      return response()->json([
        'message' => 'Image uploaded successfully',
        'image' => $noteImage
      ], 201);

    } catch (Exception $e) {
      return $this->debugError($e);
    }
  }

  // Xóa ảnh
  public function destroy($imageId)
  {
    try {
      $image = NoteImageModel::find($imageId);
      if (!$image) {
        return response()->json(['message' => 'Image not found'], 404);
      }

      // Xóa file vật lý
      $path = str_replace('/storage/', '', $image->imageUrl);
      if (Storage::disk('public')->exists($path)) {
        Storage::disk('public')->delete($path);
      }

      // Xóa record trong DB
      $image->delete();

      return response()->json(['message' => 'Image deleted successfully']);

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
