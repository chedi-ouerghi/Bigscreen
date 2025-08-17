<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merci pour votre participation</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f4f6f8;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: #fff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 600;
        }
        .content {
            padding: 25px 30px;
            font-size: 16px;
            line-height: 1.6;
        }
        .highlight {
            background: #f1f5ff;
            padding: 8px 12px;
            border-left: 4px solid #007bff;
            margin: 15px 0;
            border-radius: 4px;
            font-weight: 500;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #007bff;
            color: white;
            font-size: 16px;
            text-decoration: none;
            border-radius: 6px;
            margin: 25px 0;
            font-weight: 500;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            font-size: 13px;
            color: #6c757d;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">

        <!-- HEADER -->
        <div class="header">
            <h1>Merci pour votre participation</h1>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <p>Bonjour,</p>

            <p>Nous vous remercions d'avoir pris le temps de répondre à notre sondage :</p>
            
            <div class="highlight">
                {{ $response->survey->title }}
            </div>

            <p>Vos réponses ont été enregistrées avec succès. Vous pouvez consulter votre formulaire à tout moment grâce à votre lien personnel.</p>

            <p style="text-align: center;">
                <a href="{{ $previewUrl }}" class="button">Voir mes réponses</a>
            </p>

            <p>🔒 Ce lien est unique, sécurisé, et ne permet d'accéder qu'à vos propres réponses.</p>

            <p>Pour toute question ou information complémentaire, notre équipe reste à votre disposition.</p>

            <p>Cordialement,<br>
            <strong>L'équipe Bigscreen</strong></p>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </div>

    </div>
</body>
</html>
