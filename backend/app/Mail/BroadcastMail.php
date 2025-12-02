<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BroadcastMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectContent;
    public $bodyContent;

    public function __construct($subject, $content)
    {
        $this->subjectContent = $subject;
        $this->bodyContent = $content;
    }

    public function build()
    {
        return $this->subject($this->subjectContent)
            ->view('emails.broadcast');
    }
}
