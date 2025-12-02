<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Đảm bảo dòng này có api/*

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',                   // Cho Local
        'https://vietnote.vercel.app',  // Cho Vercel (Nhớ bỏ dấu / ở cuối)
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Quan trọng: Để frontend gửi được cookie/token

];
