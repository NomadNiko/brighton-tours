'use client'
import { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';

async function trackVisitor() {
  // Generate or get visitor ID
  let visitorCookie = document.cookie.split('; ').find(c => c.startsWith('visitor_id='));
  let visitorId;
  
  if (visitorCookie) {
    visitorId = visitorCookie.split('=')[1];
  } else {
    visitorId = crypto.randomUUID();
    document.cookie = `visitor_id=${visitorId}; path=/; max-age=31536000; SameSite=Lax`;
  }

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }),
    });
  } catch (e) {
    console.error('Visitor tracking failed:', e);
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split('; ').find(c => c.startsWith('cookie_consent='));
    if (!consent) {
      setVisible(true);
    } else if (consent.includes('accepted')) {
      // Already accepted - track visitor on page load
      trackVisitor();
    }
  }, []);

  const acceptCookies = () => {
    document.cookie = 'cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax';
    setVisible(false);
    // Track visitor immediately after accepting
    trackVisitor();
  };

  const declineCookies = () => {
    document.cookie = 'cookie_consent=declined; path=/; max-age=31536000; SameSite=Lax';
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 relative">
        <div className="flex-1 pr-8 md:pr-0">
          <p className="text-white font-medium mb-1">We use cookies 🍪</p>
          <p className="text-slate-300 text-sm">
            We use cookies to track website visits and improve your experience. This helps us understand how visitors use our site for marketing purposes.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={declineCookies}
            className="flex-1 md:flex-none px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg text-sm font-medium transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Accept
          </button>
        </div>
        <button
          onClick={declineCookies}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
