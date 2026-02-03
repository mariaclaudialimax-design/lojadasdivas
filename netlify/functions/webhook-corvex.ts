import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with SERVICE KEY (Backend only)
// NEVER use the anon key here as we need to bypass RLS for writes
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export const handler = async (event: any) => {
  // 1. Method Validation
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 2. Auth/Signature Validation (Simplified for this example)
  // In production, verify Corvex's `x-corvex-signature` header using your secret.
  const authHeader = event.headers['authorization'];
  // if (authHeader !== process.env.CORVEX_WEBHOOK_SECRET) ...

  if (!supabase) {
    console.error('Supabase not configured in backend');
    return { statusCode: 500, body: 'Database Error' };
  }

  try {
    const payload = JSON.parse(event.body);

    // 3. Extract Data from Payload
    // Adjust these fields based on Corvex's actual JSON structure
    const {
      id: external_id,
      customer,
      items,
      amount_total,
      status,
      metadata // Assuming we passed event_id in metadata or query params reflected here
    } = payload;

    // Only process paid orders
    if (status !== 'paid' && status !== 'approved') {
        return { statusCode: 200, body: 'Ignored: Not paid' };
    }

    const event_id = metadata?.event_id || payload.event_id; // Retrieve deduplication ID

    // 4. Create Order in DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .upsert({
        external_id: String(external_id),
        customer_name: customer.name,
        customer_email: customer.email,
        total_price: amount_total,
        status: 'paid',
        items: items,
        event_id: event_id
      }, { onConflict: 'external_id' })
      .select()
      .single();

    if (orderError) throw orderError;

    // 5. Update Inventory & Log
    for (const item of items) {
        // Find product by SKU or ID
        // const { error } = await supabase.rpc('decrement_stock', { p_id: item.product_id, qty: item.quantity });
        
        // Log movement
        await supabase.from('inventory_logs').insert({
            product_id: item.product_id, // Ensure this maps to your 'products' table ID
            change_amount: -item.quantity,
            reason: 'sale',
            order_id: order.id
        });
    }

    // 6. Queue Server-Side Event for CAPI (Purchase)
    // This allows us to respond fast to the webhook and handle Meta API cleanly in a background job
    if (event_id) {
        await supabase.from('server_events').insert({
            event_name: 'purchase',
            event_id: event_id,
            status: 'pending',
            payload: {
                user_data: {
                    em: customer.email, // Should be hashed in the processing function, or here
                    ph: customer.phone,
                    fn: customer.first_name,
                    ln: customer.last_name
                },
                custom_data: {
                    currency: 'BRL',
                    value: amount_total,
                    content_ids: items.map((i: any) => i.product_id),
                    order_id: order.id
                }
            }
        });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order processed successfully' }),
    };

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};