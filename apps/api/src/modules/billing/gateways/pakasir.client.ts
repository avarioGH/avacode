import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';

import { GatewayCheckoutRequest, GatewayCheckoutResponse, ParsedGatewayWebhook } from '../billing.types';

@Injectable()
export class PakasirClient {
  async createInvoice(request: GatewayCheckoutRequest): Promise<GatewayCheckoutResponse> {
    const apiKey = process.env.PAKASIR_API_KEY;
    const project = process.env.PAKASIR_PROJECT_SLUG;
    const method = request.channel ?? 'qris';

    if (!apiKey || !project) {
      return {
        gateway: 'PAKASIR',
        gatewayReference: `mock-pakasir-${randomUUID()}`,
        checkoutUrl: `https://pakasir.mock.local/pay/${request.invoiceNumber}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        rawPayload: {
          mock: true,
          invoiceNumber: request.invoiceNumber,
        },
      };
    }

    const response = await axios.post(
      `${process.env.PAKASIR_API_URL ?? 'https://app.pakasir.com/api'}/transactioncreate/${method}`,
      {
        project,
        order_id: request.invoiceNumber,
        amount: request.amount,
        api_key: apiKey,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const payment = response.data?.payment ?? {};

    return {
      gateway: 'PAKASIR',
      gatewayReference: String(payment.order_id ?? request.invoiceNumber),
      checkoutUrl: `https://app.pakasir.com/pay/${project}/${request.amount}?order_id=${request.invoiceNumber}`,
      qrCode: payment.payment_number,
      expiresAt: payment.expired_at ? new Date(payment.expired_at) : undefined,
      rawPayload: response.data,
    };
  }

  parseWebhook(payload: Record<string, unknown>): ParsedGatewayWebhook {
    return {
      invoiceNumber: String(payload.order_id ?? payload.invoice_number ?? ''),
      amount: payload.amount ? Number(payload.amount) : undefined,
      gatewayReference: String(payload.payment_id ?? payload.order_id ?? ''),
      status: String(payload.status ?? payload.payment_status ?? 'pending'),
      rawPayload: payload,
    };
  }
}
