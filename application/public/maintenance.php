<?php declare(strict_types=1);
// default locale for maintenance translations
\define('DEFAULT_LOCALE', 'de');

// allow access for following ips
$allowedIPs = [
    '127.0.0.1'
];

// translations for maintenance
$translations = [
    //'en' => [
    //    'title' => 'Maintenance',
    //    'heading' => 'The page is currently down for maintenance',
    //    'description' => 'Sorry for any inconvenience caused. Please try again shortly.',
    //],
    'de' => [
        'title' => 'Wartungsarbeiten',
        'heading' => 'Die Seite wird derzeit gewartet',
        'description' => 'Wir bitten um Verständnis. Bitte versuche es in Kürze erneut.',
    ],
];

function isIpPermitted(string $remoteIp): bool
{
    global $allowedIPs;
    $domainRegEx = '/(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$)/';

    foreach ($allowedIPs as $allowedIp) {
        if (preg_match($domainRegEx, $allowedIp)) {
            $allowedIp = gethostbyname($allowedIp);
        }

        if ($allowedIp === $remoteIp) {
            return true;
        }
    }

    return false;
}

// check if ip is within allowed range
if (isIpPermitted($_SERVER['REMOTE_ADDR'])) {
    return false;
}

// get language
$lang = \substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);

// chose locale
$locale = \array_key_exists($lang, $translations) ? $lang : DEFAULT_LOCALE;

\header('Content-Type: text/html; charset=utf-8');
\http_response_code(503);

?><!doctype html>
<html lang="<?php echo $locale; ?>">
<head>
    <title><?php echo $translations[$locale]['title']; ?></title>
    <style type="text/css">
        body {
            background-color: #f1f1f1;
            font-family: Helvetica, Arial, sans-serif;
        }
        #main {
            margin: 50px auto;
            text-align: center;
        }
        .wrapper {
            margin: 0 auto;
            height: 100%;
            color: #666666;
        }
        .description {
            color: #999999;
        }
    </style>
</head>
<body>
    <div id="main">
        <div class="wrapper">
            <div class="text-container">
                <h1><?php echo $translations[$locale]['heading']; ?></h1>
                <div class="description"><?php echo $translations[$locale]['description']; ?></div>
            </div>
        </div>
    </div>
</body>
</html>
