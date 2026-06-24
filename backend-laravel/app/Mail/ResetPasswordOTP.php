<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordOTP extends Mailable
{
    use Queueable, SerializesModels;

    public $token; // Biến chứa mã OTP

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function build()
    {
        // Gửi mã OTP trong email
        return $this->subject('Mã xác nhận đặt lại mật khẩu - Vietnote')
            ->view('emails.reset_password_otp');
    }
}
