'use strict';

const prisma = require('../../database/client');
const logger = require('../../utils/logger');

/**
 * ================================================================
 * PAYMENT SERVICE — SALDO INTERNAL
 * ================================================================
 */

/**
 * Proses pembayaran menggunakan saldo internal
 * @param {Object} params
 */
async function pay({ transaction, user }) {
  const amount = parseFloat(transaction.finalAmount);
  const balance = parseFloat(user.balance);

  if (balance < amount) {
    throw new Error(
      `Saldo tidak mencukupi. Saldo kamu: Rp${balance.toLocaleString('id-ID')}, ` +
      `dibutuhkan: Rp${amount.toLocaleString('id-ID')}`,
    );
  }

  return prisma.$transaction(async (tx) => {
    // Kurangi saldo
    await tx.user.update({
      where: { id: user.id },
      data: { balance: { decrement: amount } },
    });

    // Update payment
    const payment = await tx.payment.upsert({
      where: { transactionId: transaction.id },
      update: {
        status: 'PAID',
        paidAt: new Date(),
        gateway: 'balance',
      },
      create: {
        transactionId: transaction.id,
        userId: user.id,
        gateway: 'balance',
        amount,
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Update transaksi ke PAID
    await tx.transaction.update({
      where: { id: transaction.id },
      data: { status: 'PAID' },
    });

    logger.info('Balance payment success', {
      transactionId: transaction.id,
      userId: user.id,
      amount,
    });

    return payment;
  });
}

/**
 * Proses deposit saldo menggunakan saldo internal (tidak relevan, tapi untuk konsistensi)
 */
async function deposit({ userId, amount }) {
  return prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } },
  });
}

module.exports = { pay, deposit };
