<?php

function detectOS($ua) {
    return match (true) {
        str_contains($ua, 'Windows') => 'Windows',
        str_contains($ua, 'Mac') => 'macOS',
        str_contains($ua, 'Android') => 'Android',
        str_contains($ua, 'iPhone') => 'iOS',
        str_contains($ua, 'Linux') => 'Linux',
        default => 'Unknown',
    };
}

function detectDevice($ua) {
    return str_contains($ua, 'Mobile') ? 'Mobile' : 'Desktop';
}

function anonymizeIP($ip){
    if(filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)){
        $parts = explode('.', $ip);
        $parts[3] = '0';
        return implode('.', $parts);
    }
    return $ip;
}