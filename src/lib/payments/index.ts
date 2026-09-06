/* eslint-disable @typescript-eslint/no-unused-vars */
// Phase 1: Service Abstraction Foundation
// Cashfree is NOT fully implemented in Phase 1

export interface PaymentIntent {
  orderId: string;
  paymentSessionId: string;
  amount: number;
}

export interface PaymentProvider {
  createPayment(amount: number, currency: string, customerId: string): Promise<PaymentIntent>;
  verifyPayment(orderId: string): Promise<boolean>;
  getPaymentStatus(orderId: string): Promise<string>;
  refundPayment(orderId: string, amount?: number): Promise<boolean>;
}

/**
 * Placeholder implementation for Phase 2.
 * Do not expose Cashfree credentials to client.
 */
export const CashfreeService: PaymentProvider = {
  async createPayment(amount, currency, customerId) {
    if (!process.env.CASHFREE_SECRET_KEY) {
      throw new Error("Missing Cashfree credentials");
    }
    // Implementation deferred to Phase 2
    return {
      orderId: `order_${Date.now()}`,
      paymentSessionId: "mock_session_id",
      amount
    };
  },
  
  async verifyPayment(orderId) {
    return true; // Mock
  },
  
  async getPaymentStatus(orderId) {
    return "SUCCESS"; // Mock
  },

  async refundPayment(orderId, amount) {
    return true; // Mock
  }
};
