import { PaymentGateway } from '@prisma/client';

export interface GatewayCheckoutRequest {
  invoiceNumber: string;
  amount: number;
  channel?: string;
  customerEmail: string;
}

export interface GatewayCheckoutResponse {
  gateway: PaymentGateway;
  gatewayReference: string;
  checkoutUrl?: string;
  qrCode?: string;
  expiresAt?: Date;
  rawPayload: unknown;
}

export interface ParsedGatewayWebhook {
  invoiceNumber: string;
  gatewayReference?: string;
  amount?: number;
  status: string;
  rawPayload: unknown;
}
