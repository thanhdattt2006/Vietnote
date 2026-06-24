<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra 1: Đã đăng nhập chưa?
        // Kiểm tra 2: Cột 'role' có phải là 'admin' không?
        if (!$request->user() || $request->user()->role !== 'admin') {
            // Nếu không phải admin -> Trả về lỗi 403 Forbidden
            return response()->json(['message' => 'Bạn không có quyền truy cập Admin (Forbidden)'], 403);
        }

        return $next($request);
    }
}
