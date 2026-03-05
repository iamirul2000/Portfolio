<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Jobs\SendContactNotification;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\RateLimiter;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        // Rate limiting: 5 requests per hour per IP
        $key = 'contact-form:'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'error' => [
                    'message' => 'Too many requests. Please try again later.',
                    'retry_after' => $seconds,
                ],
            ], 429);
        }

        RateLimiter::hit($key, 3600); // 1 hour

        $message = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'new',
            'ip_address' => $request->ip(),
        ]);

        // Queue email notification
        SendContactNotification::dispatch($message);

        return response()->json([
            'data' => [
                'message' => "Thank you for your message. I'll get back to you soon!",
            ],
        ], 201);
    }
}
