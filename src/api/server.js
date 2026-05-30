'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const config = require('../config');
const logger = require('../utils/logger');

const webhookRouter = require('./routes/webhook');
const paymentRouter = require('./routes/payment');
const healthRouter = require('./routes/health');

/**
 * ================================================================
 * EXPRESS SERVER
 * ================================================================
 */
function createServer(bot) {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors({ origin: false })); // No CORS needed for webhook
  app.use(compression());

  // Body parsers
  app.use('/api/payment', express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (req) => req.path === '/health',
  }));

  // ============================================================
  // ROUTES
  // ============================================================

  // Health check
  app.use('/health', healthRouter);

  // Telegram webhook
  app.use('/webhook', webhookRouter(bot));

  // Payment callbacks
  app.use('/api/payment', paymentRouter(bot));

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    logger.error('Express error:', { error: err.message, path: req.path });
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

module.exports = { createServer };
