<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // 1. Đăng ký alias cho Admin (Code cũ ông đã có)
        $middleware->alias([
            'admin' => CheckAdmin::class,
        ]);

        // 2. 👇 THÊM ĐOẠN NÀY ĐỂ TẮT CSRF CHO API
        $middleware->validateCsrfTokens(except: [
            'api/*',           // Tắt cho tất cả route bắt đầu bằng /api
            'login',           // Tắt cho route login (nếu ông lỡ để ở web.php)
            'register',        // Tắt cho register
            'logout',          // Tắt cho logout
            'admin/*',         // Tắt cho cụm admin
            'http://localhost:3000/*' // (Optional) Cho phép nguồn từ React
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
