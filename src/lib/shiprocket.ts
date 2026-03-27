import axios from 'axios';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export const getShiprocketToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    cachedToken = response.data.token;
    // Token usually valid for 10 days, let's refresh every 9 days
    tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error("Error getting Shiprocket token:", error);
    throw error;
  }
};

export const createShiprocketOrder = async (order: any) => {
  const token = await getShiprocketToken();
  
  try {
    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      {
        order_id: order.order_number,
        order_date: new Date(order.created_at).toISOString().split('T')[0],
        pickup_location: "Primary", // Should be configured in Shiprocket
        billing_customer_name: order.customer_name,
        billing_last_name: "",
        billing_address: order.shipping_address.address,
        billing_city: order.shipping_address.city,
        billing_pincode: order.shipping_address.pincode,
        billing_state: order.shipping_address.state,
        billing_country: "India",
        billing_email: order.customer_email,
        billing_phone: order.customer_phone,
        shipping_is_billing: true,
        order_items: order.items.map((item: any) => ({
          name: item.name,
          sku: item.sku || item.id,
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: "Prepaid",
        sub_total: order.total_amount,
        length: 10, // Default dimensions
        width: 10,
        height: 10,
        weight: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      order_id: response.data.order_id,
      shipment_id: response.data.shipment_id,
    };
  } catch (error) {
    console.error("Error creating Shiprocket order:", error);
    throw error;
  }
};

export const trackShipment = async (awb: string) => {
  const token = await getShiprocketToken();
  
  try {
    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error tracking shipment:", error);
    throw error;
  }
};
