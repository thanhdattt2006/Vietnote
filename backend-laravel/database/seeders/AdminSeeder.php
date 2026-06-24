<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\AccountModel;
use App\Models\NoteModel;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // 1. Tạo tài khoản ADMIN (để ông test trang Admin)
        $admin = AccountModel::create([
            'username' => 'thanhdattt2006@gmail.com',
            'password' => Hash::make('123456Abcxyz'), // Mật khẩu luôn phải Hash
            'name' => 'Admin Dave',
            'age' => 19,
            'gender' => 'male',
            'role' => 'admin', // Quan trọng: Role admin
            'createdAt' => now()
        ]);

        // 2. Tạo tài khoản USER THƯỜNG (để ông test trang User)
        $user = AccountModel::create([
            'username' => 'user1', // Để đăng nhập test
            'password' => Hash::make('123456'),
            'name' => 'Võ Cao Thành Đạt',
            'age' => 19,
            'gender' => 'male',
            'role' => 'user',
            'createdAt' => now()
        ]);

        // 3. Tạo vài Note mẫu cho thằng User1 (để vào Home là thấy có bài ngay)
        NoteModel::create([
            'title' => 'Chào mừng đến với Vietnote',
            'content' => '<p>Đây là ghi chú đầu tiên của bạn.</p>',
            'isPinned' => true,
            'isDeleted' => false,
            'ownerId' => $user->id, // Gán cho user1
            'createdAt' => now(),
            'updatedAt' => now()
        ]);

        NoteModel::create([
            'title' => 'Việc cần làm hôm nay',
            'content' => '<ul><li>Code Backend</li><li>Fix Bug Frontend</li><li>Đi ngủ sớm</li></ul>',
            'isPinned' => false,
            'isDeleted' => false,
            'ownerId' => $user->id,
            'createdAt' => now(),
            'updatedAt' => now()
        ]);

        // 4. Tạo 1 Note trong thùng rác để test Trash
        NoteModel::create([
            'title' => 'Ghi chú đã xóa',
            'content' => 'Cái này nằm trong thùng rác nè',
            'isPinned' => false,
            'isDeleted' => true, // Đã xóa
            'deletedAt' => now(),
            'ownerId' => $user->id,
            'createdAt' => now()->subDays(1),
            'updatedAt' => now()
        ]);
    }
}
