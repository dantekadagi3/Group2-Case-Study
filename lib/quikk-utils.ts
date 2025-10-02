import crypto from 'crypto';

export interface QuikkAuthParams {
  keyId: string;
  secret: string;
}

export function generateQuikkHeaders(params: QuikkAuthParams) {
 
  const timestamp = new Date().toUTCString();
  const toEncode = `date: ${timestamp}`;

  // Create HMAC signature using SHA256
  const hmac = crypto.createHmac('SHA256', params.secret)
    .update(toEncode)
    .digest();
  
  const encoded = Buffer.from(hmac).toString('base64');
  const urlEncoded = encodeURIComponent(encoded);

  // Construct Authorization header
  const authString = `keyId="${params.keyId}",algorithm="hmac-sha256",headers="date",signature="${urlEncoded}"`;

  console.log('[Quikk Auth] Request details:', {
    timestamp,
    toEncode,
    encoded,
    urlEncoded,
    authString
  });

  // Return headers object
  return {
    'Date': timestamp,
    'Content-Type': 'application/vnd.api+json',
    'Authorization': authString
  };
}

export function validateQuikkPayload(payload: any): boolean {
  try {
   
    const required = ['type', 'attributes'];
    for (const field of required) {
      if (!payload.data?.[field]) {
        console.error(`[Quikk Validation] Missing required field: ${field}`);
        return false;
      }
    }

    if (payload.data.type !== 'charge') {
      console.error(`[Quikk Validation] Invalid type: ${payload.data.type}`);
      return false;
    }

    // Validate attributes
    const attrs = payload.data.attributes;
    const requiredAttrs = ['amount', 'customer_type', 'customer_no', 'short_code', 'posted_at', 'reference'];
    for (const field of requiredAttrs) {
      if (attrs[field] === undefined || attrs[field] === null) {
        console.error(`[Quikk Validation] Missing required attribute: ${field}`);
        return false;
      }
    }

    // Validate attribute types
    if (typeof attrs.amount !== 'number' || attrs.amount <= 0) {
      console.error(`[Quikk Validation] Invalid amount: ${attrs.amount}`);
      return false;
    }
    if (attrs.customer_type !== 'msisdn') {
      console.error(`[Quikk Validation] Invalid customer_type: ${attrs.customer_type}`);
      return false;
    }
    if (!/^254[17][0-9]{8}$/.test(attrs.customer_no)) {
      console.error(`[Quikk Validation] Invalid customer_no: ${attrs.customer_no}`);
      return false;
    }
    if (typeof attrs.short_code !== 'string' || attrs.short_code.length === 0) {
      console.error(`[Quikk Validation] Invalid short_code: ${attrs.short_code}`);
      return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(attrs.posted_at)) {
      console.error(`[Quikk Validation] Invalid posted_at: ${attrs.posted_at}`);
      return false;
    }
    if (typeof attrs.reference !== 'string' || attrs.reference.length === 0) {
      console.error(`[Quikk Validation] Invalid reference: ${attrs.reference}`);
      return false;
    }
    if (attrs.category && !['CustomerPayBillOnline', 'CustomerBuyGoodsOnline'].includes(attrs.category)) {
      console.error(`[Quikk Validation] Invalid category: ${attrs.category}`);
      return false;
    }

    JSON.stringify(payload);
    return true;
  } catch (error) {
    console.error('[Quikk Validation] Payload validation failed:', error);
    return false;
  }
}