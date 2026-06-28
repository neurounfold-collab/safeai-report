<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$allowedOrigins = [
    'https://safeai.report',
    'https://www.safeai.report',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

/**
 * @param mixed $value
 */
function sanitizeField($value, int $maxLength = 500): string
{
    if (!is_string($value) && !is_numeric($value)) {
        return '';
    }

    $clean = trim(strip_tags((string) $value));
    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $clean) ?? '';

    if (mb_strlen($clean) > $maxLength) {
        $clean = mb_substr($clean, 0, $maxLength);
    }

    return $clean;
}

/**
 * @param mixed $value
 */
function sanitizeMessage($value, int $maxLength = 5000): string
{
    return sanitizeField($value, $maxLength);
}

/**
 * @param mixed $value
 */
function sanitizeEmail($value): string
{
    $email = sanitizeField($value, 254);
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';
}

function respond(bool $success, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

/**
 * @param array<string, mixed> $payload
 */
function isDoctoralResearchLog(array $payload): bool
{
    if (isset($payload['observations']) && is_array($payload['observations'])) {
        return true;
    }

    return isset($payload['session']);
}

/**
 * @param mixed $value
 */
function formatResearchLogScalar($value): string
{
    if (is_bool($value)) {
        return $value ? 'true' : 'false';
    }

    if ($value === null) {
        return 'null';
    }

    if (is_scalar($value)) {
        return (string) $value;
    }

    $encoded = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    return is_string($encoded) ? $encoded : '';
}

/**
 * @param array<string, mixed> $section
 */
function buildResearchLogSectionRows(array $section, callable $escape): string
{
    $rows = '';

    foreach ($section as $key => $value) {
        $label = $escape((string) $key);
        $formatted = formatResearchLogScalar($value);

        if (str_contains($formatted, "\n")) {
            $rows .= '<tr><td colspan="2" style="padding:12px 14px;border-bottom:1px solid #e8edf2;background:#f8fafc;">'
                . '<div style="font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#5a6b7d;margin-bottom:6px;">'
                . $label
                . '</div>'
                . '<pre style="margin:0;font-family:Consolas,Monaco,monospace;font-size:12px;line-height:1.5;color:#1a2b3c;white-space:pre-wrap;word-break:break-word;">'
                . $escape($formatted)
                . '</pre></td></tr>';
            continue;
        }

        $rows .= '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;width:220px;">'
            . $label
            . '</td><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:13px;font-family:Consolas,Monaco,monospace;">'
            . $escape($formatted)
            . '</td></tr>';
    }

    return $rows;
}

/**
 * @param array<string, mixed> $payload
 */
function buildResearchLogHtmlBody(array $payload, string $timestamp, callable $escape): string
{
    $meta = is_array($payload['meta'] ?? null) ? $payload['meta'] : [];
    $session = is_array($payload['session'] ?? null) ? $payload['session'] : [];
    $aggregates = is_array($payload['aggregates'] ?? null) ? $payload['aggregates'] : [];
    $observations = is_array($payload['observations'] ?? null) ? $payload['observations'] : [];

    $observationRows = '';

    foreach ($observations as $index => $observation) {
        if (!is_array($observation)) {
            continue;
        }

        $observationRows .= '<tr>'
            . '<td style="padding:8px 10px;border-bottom:1px solid #e8edf2;font-size:12px;font-family:Consolas,Monaco,monospace;color:#1a2b3c;">'
            . $escape((string) ($index + 1))
            . '</td>'
            . '<td style="padding:8px 10px;border-bottom:1px solid #e8edf2;font-size:12px;font-family:Consolas,Monaco,monospace;color:#1a2b3c;">'
            . $escape(formatResearchLogScalar($observation['questionId'] ?? ''))
            . '</td>'
            . '<td style="padding:8px 10px;border-bottom:1px solid #e8edf2;font-size:12px;font-family:Consolas,Monaco,monospace;color:#1a2b3c;">'
            . $escape(formatResearchLogScalar($observation['chosenIndex'] ?? ''))
            . '</td>'
            . '<td style="padding:8px 10px;border-bottom:1px solid #e8edf2;font-size:12px;font-family:Consolas,Monaco,monospace;color:#1a2b3c;">'
            . $escape(formatResearchLogScalar($observation['correctness'] ?? ''))
            . '</td>'
            . '<td style="padding:8px 10px;border-bottom:1px solid #e8edf2;font-size:12px;font-family:Consolas,Monaco,monospace;color:#1a2b3c;">'
            . $escape(formatResearchLogScalar($observation['timeSpentMs'] ?? ''))
            . '</td>'
            . '</tr>';
    }

    if ($observationRows === '') {
        $observationRows = '<tr><td colspan="5" style="padding:12px 14px;color:#5a6b7d;font-size:13px;">No observation records supplied.</td></tr>';
    }

    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body style="margin:0;padding:24px;background:#0b1120;font-family:Segoe UI,Helvetica,Arial,sans-serif;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #1e293b;border-radius:8px;overflow:hidden;">'
        . '<tr><td style="padding:24px 24px 12px;background:#0f172a;color:#e2e8f0;">'
        . '<div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.75;">safeAI.report Research Instrument</div>'
        . '<div style="font-size:20px;font-weight:700;margin-top:6px;color:#5eead4;">Doctoral Telemetry Research Log</div>'
        . '<div style="font-size:13px;opacity:0.85;margin-top:4px;">Anonymous Article 4 Compliance Dataset Entry</div>'
        . '</td></tr>'
        . '<tr><td style="padding:8px 24px 0;color:#64748b;font-size:12px;">Ingested ' . $escape($timestamp) . '</td></tr>'
        . '<tr><td style="padding:16px 24px 8px;">'
        . '<div style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#334155;margin-bottom:8px;">Instrument Metadata</div>'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8edf2;border-radius:6px;overflow:hidden;">'
        . buildResearchLogSectionRows($meta, $escape)
        . '</table></td></tr>'
        . '<tr><td style="padding:8px 24px;">'
        . '<div style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#334155;margin-bottom:8px;">Session Telemetry</div>'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8edf2;border-radius:6px;overflow:hidden;">'
        . buildResearchLogSectionRows($session, $escape)
        . '</table></td></tr>'
        . '<tr><td style="padding:8px 24px;">'
        . '<div style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#334155;margin-bottom:8px;">Aggregate Metrics</div>'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8edf2;border-radius:6px;overflow:hidden;">'
        . buildResearchLogSectionRows($aggregates, $escape)
        . '</table></td></tr>'
        . '<tr><td style="padding:8px 24px 24px;">'
        . '<div style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#334155;margin-bottom:8px;">Scenario Observations</div>'
        . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8edf2;border-radius:6px;overflow:hidden;">'
        . '<tr>'
        . '<th style="padding:8px 10px;border-bottom:1px solid #cbd5e1;background:#f1f5f9;font-size:11px;text-align:left;color:#475569;">#</th>'
        . '<th style="padding:8px 10px;border-bottom:1px solid #cbd5e1;background:#f1f5f9;font-size:11px;text-align:left;color:#475569;">Question ID</th>'
        . '<th style="padding:8px 10px;border-bottom:1px solid #cbd5e1;background:#f1f5f9;font-size:11px;text-align:left;color:#475569;">Chosen Index</th>'
        . '<th style="padding:8px 10px;border-bottom:1px solid #cbd5e1;background:#f1f5f9;font-size:11px;text-align:left;color:#475569;">Correctness</th>'
        . '<th style="padding:8px 10px;border-bottom:1px solid #cbd5e1;background:#f1f5f9;font-size:11px;text-align:left;color:#475569;">Time (ms)</th>'
        . '</tr>'
        . $observationRows
        . '</table></td></tr>'
        . '<tr><td style="padding:0 24px 24px;color:#64748b;font-size:11px;line-height:1.5;">'
        . 'De-identified doctoral research packet — no candidate PII transmitted. Routed through the sovereign safeAI.report mail gateway.'
        . '</td></tr>'
        . '</table></body></html>';
}

/**
 * @param array<string, mixed> $payload
 */
function deliverDoctoralResearchLog(array $payload): void
{
    $timestamp = gmdate('Y-m-d H:i:s') . ' UTC';
    $escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $mailSubject = 'DATASET_LOG: Anonymous Article 4 Telemetry Entry';
    $htmlBody = buildResearchLogHtmlBody($payload, $timestamp, $escape);

    $recipient = 'support@safeai.report';
    $fromAddress = 'noreply@safeai.report';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: safeAI.report Research Log <' . $fromAddress . '>',
        'Reply-To: ' . $fromAddress,
        'X-Mailer: safeAI.report/1.0',
        'X-Priority: 3',
        'X-safeAI-Packet-Type: doctoral-research-log',
    ];

    $mailSent = mail($recipient, $mailSubject, $htmlBody, implode("\r\n", $headers));

    if (!$mailSent) {
        respond(false, 'Research log delivery failed', 500);
    }

    respond(true, 'Research log ingested successfully');
}

$rawBody = file_get_contents('php://input');

if ($rawBody === false || $rawBody === '') {
    respond(false, 'Empty request body', 400);
}

$payload = json_decode($rawBody, true);

if (!is_array($payload)) {
    respond(false, 'Invalid JSON payload', 400);
}

if (isDoctoralResearchLog($payload)) {
    deliverDoctoralResearchLog($payload);
}

$institutionName = sanitizeField($payload['institution_name'] ?? '');
$contactPerson = sanitizeField($payload['contact_person'] ?? '');
$selectedTier = sanitizeField($payload['selected_tier'] ?? '');
$domainContext = sanitizeField($payload['domain_context'] ?? '', 1000);

$email = sanitizeEmail($payload['email'] ?? '');
$message = sanitizeMessage($payload['message'] ?? '');
$subjectLine = sanitizeField($payload['subject'] ?? '', 200);
$category = sanitizeField($payload['category'] ?? '', 100);
$formSource = sanitizeField($payload['form_source'] ?? '', 100);

if ($institutionName === '' || $contactPerson === '' || $selectedTier === '' || $domainContext === '') {
    respond(false, 'Required intake fields are missing', 422);
}

if ($subjectLine === '') {
    $mailSubject = 'safeAI.report Intake — ' . $selectedTier;
} elseif (stripos($subjectLine, 'safeAI.report') === 0) {
    $mailSubject = $subjectLine;
} else {
    $mailSubject = 'safeAI.report Intake — ' . $subjectLine;
}

$timestamp = gmdate('Y-m-d H:i:s') . ' UTC';

$escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$optionalRows = '';

if ($email !== '') {
    $optionalRows .= '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;width:180px;">Reply Email</td>'
        . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">'
        . '<a href="mailto:' . $escape($email) . '" style="color:#0b5fff;text-decoration:none;">' . $escape($email) . '</a></td></tr>';
}

if ($subjectLine !== '') {
    $optionalRows .= '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;">Subject</td>'
        . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">' . $escape($subjectLine) . '</td></tr>';
}

if ($category !== '') {
    $optionalRows .= '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;">Category</td>'
        . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">' . $escape($category) . '</td></tr>';
}

if ($formSource !== '') {
    $optionalRows .= '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;">Form Source</td>'
        . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">' . $escape($formSource) . '</td></tr>';
}

$messageBlock = '';

if ($message !== '') {
    $messageBlock = '<tr><td colspan="2" style="padding:16px 14px;color:#1a2b3c;font-size:14px;line-height:1.6;background:#f8fafc;">'
        . '<div style="font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#5a6b7d;margin-bottom:8px;">Message</div>'
        . nl2br($escape($message))
        . '</td></tr>';
}

$htmlBody = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body style="margin:0;padding:24px;background:#f4f7fa;font-family:Segoe UI,Helvetica,Arial,sans-serif;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dde5ed;border-radius:8px;overflow:hidden;">'
    . '<tr><td style="padding:24px 24px 12px;background:#0b1f33;color:#ffffff;">'
    . '<div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">safeAI.report</div>'
    . '<div style="font-size:20px;font-weight:600;margin-top:6px;">Institutional Lead Intake</div>'
    . '<div style="font-size:13px;opacity:0.85;margin-top:4px;">EU AI Act Article 4 Compliance Inquiry</div>'
    . '</td></tr>'
    . '<tr><td style="padding:8px 24px 0;color:#5a6b7d;font-size:12px;">Received ' . $escape($timestamp) . '</td></tr>'
    . '<tr><td style="padding:16px 24px 24px;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8edf2;border-radius:6px;overflow:hidden;">'
    . '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;width:180px;">Institution</td>'
    . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;font-weight:600;">' . $escape($institutionName) . '</td></tr>'
    . '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;">Contact Person</td>'
    . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">' . $escape($contactPerson) . '</td></tr>'
    . '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;">Selected Tier</td>'
    . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">' . $escape($selectedTier) . '</td></tr>'
    . '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#5a6b7d;font-size:13px;">Domain Context</td>'
    . '<td style="padding:10px 14px;border-bottom:1px solid #e8edf2;color:#1a2b3c;font-size:14px;">' . $escape($domainContext) . '</td></tr>'
    . $optionalRows
    . $messageBlock
    . '</table></td></tr>'
    . '<tr><td style="padding:0 24px 24px;color:#8a97a6;font-size:11px;line-height:1.5;">'
    . 'This message was routed through the sovereign safeAI.report mail gateway on Hostinger. '
    . 'Origin-validated intake — no third-party relay.'
    . '</td></tr>'
    . '</table></body></html>';

$recipient = 'support@safeai.report';
$fromAddress = 'noreply@safeai.report';
$replyTo = $email !== '' ? $email : $fromAddress;

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: safeAI.report Intake <' . $fromAddress . '>',
    'Reply-To: ' . $replyTo,
    'X-Mailer: safeAI.report/1.0',
    'X-Priority: 3',
];

$mailSent = mail($recipient, $mailSubject, $htmlBody, implode("\r\n", $headers));

if (!$mailSent) {
    respond(false, 'Mail delivery failed', 500);
}

respond(true, 'Intake submitted successfully');
