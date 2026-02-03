
import { Product } from '../types';

// Generate a UUID v4 for the Event ID
export const generateEventId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get or Create a unique Session ID for the user
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = generateEventId();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// --- STANDARD EVENTS ---

export const trackViewContent = (product: Product) => {
  const eventId = generateEventId();
  
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [product.id],
      content_name: product.title,
      value: product.price,
      currency: 'BRL'
    }, { eventID: eventId });
  }

  // TODO: Add GA4 event here
  console.log(`[Tracking] ViewContent: ${product.title} (ID: ${eventId})`);
};

export const trackAddToCart = (product: Product, size: string) => {
  const eventId = generateEventId();
  
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_type: 'product',
      content_ids: [product.id],
      content_name: product.title,
      value: product.price,
      currency: 'BRL',
      variant: size
    }, { eventID: eventId });
  }
  
  console.log(`[Tracking] AddToCart: ${product.title} (ID: ${eventId})`);
};

export const trackInitiateCheckout = (product: Product, checkoutUrl: string): string => {
  // We generate the ID here and RETURN it so it can be attached to the URL
  const eventId = generateEventId();
  
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_type: 'product',
      content_ids: [product.id],
      num_items: 1,
      value: product.price,
      currency: 'BRL'
    }, { eventID: eventId });
  }

  console.log(`[Tracking] InitiateCheckout: ${product.title} (ID: ${eventId})`);
  return eventId;
};
