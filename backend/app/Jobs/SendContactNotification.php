<?php

namespace App\Jobs;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendContactNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private ContactMessage $message
    ) {}

    public function handle(): void
    {
        Mail::raw(
            "New contact message from {$this->message->name}\n\n".
            "Email: {$this->message->email}\n".
            "Subject: {$this->message->subject}\n\n".
            "Message:\n{$this->message->message}",
            function ($mail) {
                $mail->to('amirul.iman698@gmail.com')
                    ->subject("Portfolio Contact: {$this->message->subject}")
                    ->replyTo($this->message->email, $this->message->name);
            }
        );
    }
}
