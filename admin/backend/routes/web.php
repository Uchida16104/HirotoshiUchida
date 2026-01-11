<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

Route::get('/track', function (\Illuminate\Http\Request $request) {
    $ip = anonymizeIP($request->ip());
    $ua = $request->userAgent();
    $geo = @json_decode(file_get_contents("http://ip-api.com/json/{$ip}"), true);

    $action = $request->query('action', 'page_view'); // click / scroll / email
    $section = $request->query('section') ?? null;
    $emailStatus = $request->query('email') ?? null;

    $log = [
        'timestamp' => now()->format('Y-m-d H:i:s'),
        'ip' => $ip,
        'country' => $geo['country'] ?? 'Unknown',
        'city' => $geo['city'] ?? 'Unknown',
        'os' => detectOS($ua),
        'device' => detectDevice($ua),
        'action' => $action,
        'section' => $section,
        'email_status' => $emailStatus,
        'path' => $request->headers->get('referer') ?? 'direct'
    ];

    $file = storage_path('app/activity.json');
    if (!file_exists($file)) file_put_contents($file, json_encode([]));
    $data = json_decode(file_get_contents($file), true);
    $data[] = $log;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

    return response()->noContent();
});

Route::get('/stream', function () {
    return Response::stream(function () {
        while(true){
            echo "data: " . file_get_contents(storage_path('app/activity.json')) . "\n\n";
            ob_flush(); flush();
            sleep(1);
        }
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
        'Connection' => 'keep-alive'
    ]);
});

