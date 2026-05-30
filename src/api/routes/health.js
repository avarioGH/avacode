'use strict';

const express = require('express');
const router = express.Router();
const prisma = require('../../database/client');

router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({ status: 'error', error: 'Database unavailable' });
  }
});

module.exports = router;
