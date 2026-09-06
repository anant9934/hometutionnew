import { Cashfree } from "cashfree-pg";
import { paiseToRupees } from "@/lib/utils/money";

export interface PaymentIntent {
  orderId: string;
  paymentSessionId: string;
  amountPaise: number;
}

export interface PaymentProvider {
  createPayment(
    amountPaise: number, 
    internalPaymentId: string, 
    customerId: string, 
    customerPhone: string,
    customerEmail: string
  ): Promise<PaymentIntent>;
  verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean;
}

// Initialize Cashfree
// @ts-expect-error - Cashfree types are inaccurate for v6
Cashfree.XClientId = process.env.CASHFREE_APP_ID || "";
// @ts-expect-error - Cashfree types are inaccurate for v6
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || "";
// @ts-expect-error - Cashfree types are inaccurate for v6
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === "PRODUCTION"
  // @ts-expect-error - Cashfree types are inaccurate for v6
  ? Cashfree.Environment.PRODUCTION
  // @ts-expect-error - Cashfree types are inaccurate for v6
  : Cashfree.Environment.SANDBOX;

export const CashfreeService: PaymentProvider = {
  async createPayment(amountPaise, internalPaymentId, customerId, customerPhone, customerEmail) {
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      throw new Error("Missing Cashfree credentials");
    }

    // Cashfree expects amount in Rupees, not Paise
    const orderAmount = paiseToRupees(amountPaise);

    const request = {
      order_amount: orderAmount,
      order_currency: "INR",
      order_id: internalPaymentId, // We use our internal payment.id as the Cashfree order_id
      customer_details: {
        customer_id: customerId.substring(0, 50), // Cashfree limit is 50 chars
        customer_phone: customerPhone || "9999999999", // Provide a fallback if student profile lacks phone
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/payment/callback?order_id=${internalPaymentId}`
      }
    };

    try {
      // @ts-expect-error - Cashfree types are inaccurate for v6
      const response = await Cashfree.PGCreateOrder("2023-08-01", request);
      
      if (!response.data || !response.data.payment_session_id) {
        throw new Error("Failed to retrieve payment session ID from Cashfree");
      }

      return {
        orderId: internalPaymentId,
        paymentSessionId: response.data.payment_session_id,
        amountPaise
      };
    } catch (error) {
      console.error("Cashfree Order Creation Failed:", error);
      throw new Error("Failed to create payment order");
    }
  },

  verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean {
    if (!process.env.CASHFREE_SECRET_KEY) return false;
    
    try {
      // @ts-expect-error - Cashfree types are inaccurate for v6
      return Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (error) {
      console.error("Webhook signature verification error:", error);
      return false;
    }
  }
};
