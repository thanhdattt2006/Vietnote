<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ThankYouMail extends Mailable
{
    use Queueable, SerializesModels;

    public $responseData; // Dữ liệu từ response của user

    /**
     * Khởi tạo mail với dữ liệu
     *
     * @param array $responseData - Data từ response (name, subject, content...)
     */
    public function __construct($responseData)
    {
        $this->responseData = $responseData;
    }

    /**
     * Build nội dung email
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('🎉 Cảm ơn bạn đã gửi phản hồi!')
            ->view('emails.thankyou') // ← Template HTML
            ->with([
                'name' => $this->responseData['name'],
                'subject' => $this->responseData['subject'],
                'content' => $this->responseData['content'],
            ]);
    }
}
