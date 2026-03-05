<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;

class DashboardController extends Controller
{
    public function index()
    {
        $projectsCount = Project::count();
        $experiencesCount = Experience::count();
        $skillsCount = Skill::count();
        $unreadMessagesCount = ContactMessage::where('status', 'new')->count();

        $recentMessages = ContactMessage::where('status', 'new')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'subject', 'created_at', 'status']);

        return response()->json([
            'data' => [
                'projects_count' => $projectsCount,
                'experiences_count' => $experiencesCount,
                'skills_count' => $skillsCount,
                'unread_messages_count' => $unreadMessagesCount,
                'recent_messages' => $recentMessages,
            ],
        ]);
    }
}
