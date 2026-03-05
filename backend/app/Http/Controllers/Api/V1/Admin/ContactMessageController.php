<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $messages = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return ContactMessageResource::collection($messages);
    }

    public function show(ContactMessage $contactMessage)
    {
        // Mark as read when viewing
        if ($contactMessage->status === 'new') {
            $contactMessage->update(['status' => 'read']);
        }

        return new ContactMessageResource($contactMessage);
    }

    public function updateStatus(Request $request, ContactMessage $contactMessage)
    {
        $request->validate([
            'status' => ['required', 'in:new,read'],
        ]);

        $contactMessage->update(['status' => $request->status]);

        return new ContactMessageResource($contactMessage);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->noContent();
    }
}
