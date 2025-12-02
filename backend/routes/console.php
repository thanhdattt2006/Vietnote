<?php
use Illuminate\Support\Facades\Schedule;
use App\Models\NoteModel;

// Tự động dọn rác mỗi ngày lúc 00:00
Schedule::call(function () {
    // Xóa vĩnh viễn các note đã nằm trong thùng rác quá 30 ngày
    $deleted = NoteModel::where('isDeleted', true)
        ->where('deletedAt', '<', now()->subDays(30))
        ->delete(); // Vì model này không dùng SoftDeletes của Laravel (ông tự build logic isDeleted), nên lệnh delete() này sẽ xóa row khỏi DB luôn nếu không config gì thêm. 
    // Nhưng để chắc ăn là xóa vĩnh viễn với logic của ông (forceDelete logic custom), ông nên query lấy ID rồi xóa:

    $oldTrash = NoteModel::where('isDeleted', true)
        ->where('deletedAt', '<', now()->subDays(30))
        ->get();

    foreach ($oldTrash as $note) {
        // Xóa ảnh liên quan (nếu cần logic xóa ảnh)
        // ... (Logic xóa ảnh ông có thể copy từ AdminController::deleteUser sang model boot hoặc observer, nhưng ở đây xóa row DB trước cho gọn)
        $note->delete();
    }

})->daily();
