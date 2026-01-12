'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-6 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">Cookie Consent</h3>
          <p className="text-gray-300 text-sm">
            We use essential cookies for authentication. By continuing to use this admin panel, you agree to our use of cookies. 
            Read our <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a> for more information.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDecline}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
