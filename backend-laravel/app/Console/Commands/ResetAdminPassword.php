<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AccountModel;
use Illuminate\Support\Facades\Hash;

class ResetAdminPassword extends Command
{
    // 1. Tên lệnh để gõ trong terminal
    protected $signature = 'admin:reset {username} {password}';

    // 2. Mô tả lệnh
    protected $description = 'Reset mật khẩu cho tài khoản bất kỳ (Bỏ qua OTP)';

    public function handle()
    {
        $username = $this->argument('username');
        $password = $this->argument('password');

        $this->info("Đang tìm tài khoản: $username ...");

        // Tìm user
        $user = AccountModel::where('username', $username)->first();

        if (!$user) {
            $this->error("❌ Không tìm thấy tài khoản nào có username là: $username");
            return;
        }

        // Cưỡng chế đổi mật khẩu
        $user->password = Hash::make($password);
        $user->save();

        // Xóa hết token cũ để đá văng các phiên đăng nhập khác (Bảo mật)
        $user->tokens()->delete();

        $this->info("✅ Xong! Mật khẩu cho [$username] đã đổi thành [$password].");
        $this->info("User đã bị đăng xuất khỏi mọi thiết bị.");
    }
}
