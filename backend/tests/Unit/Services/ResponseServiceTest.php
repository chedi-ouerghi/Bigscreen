<?php

namespace Tests\Unit\Services;

use App\Models\Question;
use App\Models\Survey;
use App\Services\ResponseService;
use App\Services\TokenService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Mockery;

class ResponseServiceTest extends TestCase
{
    use RefreshDatabase;

    private ResponseService $responseService;
    private TokenService $tokenService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tokenService = Mockery::mock(TokenService::class);
        $this->responseService = new ResponseService($this->tokenService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_create_response_stores_survey_response_with_answers(): void
    {
        // Create a survey with questions
        $survey = Survey::factory()->create();
        $question1 = Question::factory()->create(['survey_id' => $survey->id]);
        $question2 = Question::factory()->create(['survey_id' => $survey->id]);

        // Mock the token service
        $mockToken = 'mock-uuid-token';
        $this->tokenService->shouldReceive('generate')
            ->once()
            ->andReturn($mockToken);

        // Create mock request
        $request = new Request();
        $request->server->set('REMOTE_ADDR', '127.0.0.1');
        $request->headers->set('User-Agent', 'PHPUnit Test Browser');

        // Prepare test data
        $data = [
            'email' => 'test@example.com',
            'answers' => [
                [
                    'question_id' => $question1->id,
                    'answer_text' => 'Test answer 1'
                ],
                [
                    'question_id' => $question2->id,
                    'answer_text' => 'Test answer 2'
                ]
            ]
        ];

        // Create the response
        $response = $this->responseService->createResponse($survey, $data, $request);

        // Assert response was created correctly
        $this->assertDatabaseHas('survey_responses', [
            'survey_id' => $survey->id,
            'email' => 'test@example.com',
            'response_token' => $mockToken,
            'ip_address' => '127.0.0.1'
        ]);

        // Assert answers were created
        $this->assertCount(2, $response->answers);
        $this->assertDatabaseHas('answers', [
            'response_id' => $response->id,
            'question_id' => $question1->id,
            'answer_text' => 'Test answer 1'
        ]);
        $this->assertDatabaseHas('answers', [
            'response_id' => $response->id,
            'question_id' => $question2->id,
            'answer_text' => 'Test answer 2'
        ]);
    }

    public function test_create_response_with_empty_answers(): void
    {
        // Create a survey
        $survey = Survey::factory()->create();

        // Mock the token service
        $mockToken = 'mock-uuid-token';
        $this->tokenService->shouldReceive('generate')
            ->once()
            ->andReturn($mockToken);

        // Create mock request
        $request = new Request();
        $request->server->set('REMOTE_ADDR', '127.0.0.1');
        $request->headers->set('User-Agent', 'PHPUnit Test Browser');

        // Prepare test data with no answers
        $data = [
            'email' => 'test@example.com',
            'answers' => []
        ];

        // Create the response
        $response = $this->responseService->createResponse($survey, $data, $request);

        // Assert response was created correctly
        $this->assertDatabaseHas('survey_responses', [
            'survey_id' => $survey->id,
            'email' => 'test@example.com',
            'response_token' => $mockToken
        ]);

        // Assert no answers were created
        $this->assertCount(0, $response->answers);
    }
}
