import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance: any = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;
  
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    console.warn("Razorpay keys missing. Razorpay functionality will be disabled.");
    return null;
  }
  
  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });
  return razorpayInstance;
};

export const createRazorpayOrder = async (amount: number, receiptId: string) => {
  const instance = getRazorpayInstance();
  if (!instance) throw new Error("Razorpay not configured");

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: receiptId,
  };

  try {
    const order = await instance.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) return false;

  const text = orderId + "|" + paymentId;
  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(text)
    .digest("hex");

  return generated_signature === signature;
};
