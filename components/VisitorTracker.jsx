'use client'
import { useEffect, useCallback } from 'react';

export default function VisitorTracker() {
  const trackVisitor = useCallback(async () => {
    // Check if user has accepted cookies
    const consentCookie = document.cookie.split('; ').find(c => c.startsWith('cookie_consent='));
    if (!consentCookie || !consentCookie.includes('accepted')) {
      return;
    }

    // Check if visitor already has tracking cookie
    const visitorCookie = document.cookie.split('; ').find(c => c.startsWith('visitor_id='));
    const isReturning = !!visitorCookie;
    
    let visitorId;
    if (visitorCookie) {
      visitorId = visitorCookie.split('=')[1];
    } else {
      visitorId = crypto.randomUUID();
      // Set cookie for 1 year
      document.cookie = `visitor_id=${visitorId}; path=/; max-age=31536000; SameSite=Lax`;
    }

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          isReturning,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });
    } catch (e) {
      console.error('Visitor tracking failed:', e);
    }
  }, []);

  useEffect(() => {
    // Track on initial load if consent already given
    trackVisitor();

    // Listen for consent event
    window.addEventListener('cookieConsentGiven', trackVisitor);
    
    return () => window.removeEventListener('cookieConsentGiven', trackVisitor);
  }, [trackVisitor]);

  return null;
}
