import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHash, randomUUID } from 'crypto';

import { GatewayCheckoutRequest, GatewayCheckoutResponse, ParsedGatewayWebhook } from '../billing.types';

@Injectable()
export class PaydisiniClient {
  async createInvoice(request: GatewayCheckoutRequest): Promise<GatewayCheckoutResponse> {
    const apiKey = process.env.PAYDISINI_API_KEY;
    const serviceId = request.channel ?? process.env.PAYDISINI_SERVICE_ID ?? '11';
    const validTime = 3600;

    if (!apiKey) {
      return {
        gateway: 'PAYDISINI',
        gatewayReference: `mock-paydisini-${randomUUID()}`,
        checkoutUrl: `https://pay.mock.local/${request.invoiceNumber}`,
        expiresAt: new Date(Date.now() + validTime * 1000),
        rawPayload: {
          mock: true,
          invoiceNumber: request.invoiceNumber,
        },
      };
    }

    const signature = createHash('md5')
      .update(`${apiKey}${request.invoiceNumber}${serviceId}${request.amount}${validTime}NewTransaction`)
      .digest('hex');

    const payload = new URLSearchParams({
      key: apiKey,
      request: 'new',
      unique_code: request.invoiceNumber,
      service: serviceId,
      amount: String(request.amount),
      note: request.invoiceNumber,
      valid_time: String(validTime),
      customer_email: request.customerEmail,
      type_fee: process.env.PAYDISINI_TYPE_FEE ?? '2',
      signature,
    });

    const response = await axios.post(
      process.env.PAYDISINI_API_URL ?? 'https://api.paydisini.co.id/v1/',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const data = response.data?.data ?? {};

    return {
      gateway: 'PAYDISINI',
      gatewayReference: String(data.pay_id ?? request.invoiceNumber),
      checkoutUrl: data.checkout_url_beta ?? data.checkout_url,
      qrCode: data.qr_content ?? data.qrcode_url,
      expiresAt: data.expired ? new Date(data.expired) : undefined,
      rawPayload: response.data,
    };
  }

  parseWebhook(payload: Record<string, unknown>): ParsedGatewayWebhook {
    const apiKey = process.env.PAYDISINI_API_KEY;
    const invoiceNumber = String(payload.unique_code ?? payload.invoice_number ?? '');
    const signature = String(payload.signature ?? '');

    if (!invoiceNumber) {
      throw new Error('Missing Paydisini invoice number.');
    }

    if (apiKey) {
      const expectedSignature = createHash('md5')
        .update(`${apiKey}${invoiceNumber}CallbackStatus`)
        .digest('hex');

      if (signature && signature !== expectedSignature) {
        throw new Error('Invalid Paydisini callback signature.');
      }
    }

    return {
      invoiceNumber,
      gatewayReference: String(payload.pay_id ?? ''),
      status: String(payload.status ?? 'pending'),
      rawPayload: payload,
    };
  }
}
