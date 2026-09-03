<?php

namespace App\Http\Controllers;

use App\Services\AssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssistantController extends Controller
{
    protected AssistantService $assistant;

    public function __construct(AssistantService $assistant)
    {
        $this->assistant = $assistant;
    }

    public function index(): Response
    {
        return Inertia::render('assistant/index', [
            'suggestions' => [
                'How much did we spend on security?',
                'Which AMCs expire next month?',
                'How much maintenance is outstanding?',
                'Show open complaints.',
                'What is the occupancy rate?',
                'How many members do we have?',
                'How many vehicles are registered?',
                'How many staff are active?',
                'How much have we collected this period?',
            ],
        ]);
    }

    public function ask(Request $request): JsonResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:1000'],
        ]);

        $result = $this->assistant->answer($data['question'], active_society_id());

        return response()->json($result);
    }
}
