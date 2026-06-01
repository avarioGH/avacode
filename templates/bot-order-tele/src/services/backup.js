'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const config = require('../config');
const { formatFileSize } = require('../utils/formatter');

/**
 * ================================================================
 * BACKUP SERVICE
 * ================================================================
 */

/**
 * Buat backup database
 * @returns {Promise<{filename, path, size}>}
 */
async function createBackup() {
  const backupDir = config.backup.dir;
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const filename = `backup-${timestamp}.sql`;
  const filePath = path.join(backupDir, filename);

  // Parse DATABASE_URL
  const dbUrl = new URL(config.database.url);
  const host = dbUrl.hostname;
  const port = dbUrl.port || '5432';
  const database = dbUrl.pathname.replace('/', '');
  const username = dbUrl.username;
  const password = dbUrl.password;

  const env = {
    ...process.env,
    PGPASSWORD: password,
  };

  try {
    execSync(
      `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f "${filePath}"`,
      { env, stdio: 'pipe' },
    );

    const stats = fs.statSync(filePath);
    const size = formatFileSize(stats.size);

    logger.info('Backup created', { filename, size: stats.size });

    // Bersihkan backup lama
    await cleanOldBackups();

    return { filename, path: filePath, size };
  } catch (error) {
    logger.error('Backup failed:', error.message);
    throw new Error(`Backup gagal: ${error.message}`);
  }
}

/**
 * Hapus backup yang lebih lama dari retention days
 */
async function cleanOldBackups() {
  const backupDir = config.backup.dir;
  const retentionMs = config.backup.retentionDays * 24 * 60 * 60 * 1000;

  try {
    const files = fs.readdirSync(backupDir);
    const now = Date.now();

    for (const file of files) {
      if (!file.startsWith('backup-') || !file.endsWith('.sql')) continue;
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > retentionMs) {
        fs.unlinkSync(filePath);
        logger.info('Old backup deleted', { file });
      }
    }
  } catch (error) {
    logger.error('cleanOldBackups error:', error.message);
  }
}

/**
 * List semua backup
 */
function listBackups() {
  const backupDir = config.backup.dir;
  if (!fs.existsSync(backupDir)) return [];

  const files = fs.readdirSync(backupDir)
    .filter((f) => f.startsWith('backup-') && f.endsWith('.sql'))
    .sort()
    .reverse();

  return files.map((file) => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    return {
      filename: file,
      path: filePath,
      size: formatFileSize(stats.size),
      createdAt: stats.mtime,
    };
  });
}

/**
 * Restore database dari file backup
 * @param {string} backupFilename
 */
async function restoreBackup(backupFilename) {
  const filePath = path.join(config.backup.dir, backupFilename);
  if (!fs.existsSync(filePath)) throw new Error('File backup tidak ditemukan');

  const dbUrl = new URL(config.database.url);
  const host = dbUrl.hostname;
  const port = dbUrl.port || '5432';
  const database = dbUrl.pathname.replace('/', '');
  const username = dbUrl.username;
  const password = dbUrl.password;

  const env = { ...process.env, PGPASSWORD: password };

  try {
    execSync(
      `psql -h ${host} -p ${port} -U ${username} -d ${database} -f "${filePath}"`,
      { env, stdio: 'pipe' },
    );
    logger.info('Database restored', { filename: backupFilename });
    return true;
  } catch (error) {
    logger.error('Restore failed:', error.message);
    throw new Error(`Restore gagal: ${error.message}`);
  }
}

module.exports = { createBackup, cleanOldBackups, listBackups, restoreBackup };
