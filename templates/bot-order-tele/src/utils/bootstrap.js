'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');

function ensureDir(targetPath) {
  if (!targetPath) return;
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
}

function ensureFileParent(filePath) {
  if (!filePath) return;
  ensureDir(path.dirname(filePath));
}

function prepareRuntime() {
  ensureFileParent(config.session.dbPath);
  ensureDir(config.logging.dir);
  ensureDir(config.backup.dir);
}

module.exports = {
  prepareRuntime,
};
