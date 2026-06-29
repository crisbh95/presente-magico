// Analytics Wrapper
// This is a foundational layer for tracking product metrics (Unit Economics).
// Currently logs to console, but can be easily swapped for Mixpanel, PostHog, or Amplitude.

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export const trackEvent = (eventName: string, properties?: EventProperties) => {
  try {
    // 1. Console log for development visibility
    console.log(`[ANALYTICS] ${eventName}`, properties || {});

    // 2. Here you would plug in your actual provider:
    // if (window.posthog) posthog.capture(eventName, properties);
    // if (window.mixpanel) mixpanel.track(eventName, properties);
    
  } catch (err) {
    console.error('Falha ao rastrear evento', err);
  }
};

export const identifyUser = (userId: string, traits?: EventProperties) => {
  try {
    console.log(`[ANALYTICS] Identificado Usuário: ${userId}`, traits || {});
    // if (window.posthog) posthog.identify(userId, traits);
    // if (window.mixpanel) mixpanel.identify(userId);
  } catch (err) {
    console.error('Falha ao identificar usuário', err);
  }
};
