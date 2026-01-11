<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ActivityLogger
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $ip = $request->ip();
        $ua = $request->userAgent();

        $geo = @json_decode(file_get_contents(
            "http://ip-api.com/json/{$ip}"
        ), true);

        $log = [
            "time" => now()->toDateTimeString(),
            "ip" => $ip,
            "country" => $geo["country"] ?? "Unknown",
            "city" => $geo["city"] ?? "Unknown",
            "os" => $this->os($ua),
            "device" => $this->device($ua),
            "action" => $request->method() . " " . $request->path(),
        ];

        $path = storage_path("app/activity/logs.json");
        $data = json_decode(file_get_contents($path), true);
        $data[] = $log;
        file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT));

        return $response;
    }

    private function os($ua)
    {
        return match (true) {
            str_contains($ua, "Windows") => "Windows",
            str_contains($ua, "Mac") => "macOS",
            str_contains($ua, "Linux") => "Linux",
            str_contains($ua, "Android") => "Android",
            str_contains($ua, "iPhone") => "iOS",
            default => "Unknown",
        };
    }

    private function device($ua)
    {
        return str_contains($ua, "Mobile") ? "Mobile" : "Desktop";
    }
}

