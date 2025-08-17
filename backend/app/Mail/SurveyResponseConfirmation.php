<?php

namespace App\Mail;

use App\Models\SurveyResponse;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SurveyResponseConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $response;
    public $previewUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(SurveyResponse $response, string $previewUrl)
    {
        $this->response = $response;
        $this->previewUrl = $previewUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Merci pour votre participation - ' . $this->response->survey->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.survey-response-confirmation',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}