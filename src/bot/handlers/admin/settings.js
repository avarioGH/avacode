'use strict';

const settingsService = require('../../../services/settings');
const kb = require('../../../utils/keyboard');
const logger = require('../../../utils/logger');

/**
 * ================================================================
 * ADMIN SETTINGS HANDLER
 * ================================================================
 */

async function showSettingsPanel(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  await safeEdit(ctx, '⚙️ <b>Pengaturan Bot</b>\n\nPilih yang ingin diubah:', {
    parse_mode: 'HTML',
    ...kb.adminSettingsPanel(),
  });
}

async function promptEditSetting(ctx, settingKey, label, currentValue) {
  ctx.session = ctx.session || {};
  ctx.session.adminAction = { type: 'edit_setting', settingKey };

  await safeEdit(ctx,
    `⚙️ <b>Edit ${label}</b>\n\nNilai saat ini:\n<code>${currentValue || '-'}</code>\n\nMasukkan nilai baru:`,
    { parse_mode: 'HTML', ...kb.backButton('adm:settings') },
  );
}

async function handleShopName(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const current = await settingsService.get('shopName');
  await promptEditSetting(ctx, 'shopName', 'Nama Toko', current);
}

async function handleShopDesc(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const current = await settingsService.get('shopDesc');
  await promptEditSetting(ctx, 'shopDesc', 'Deskripsi Toko', current);
}

async function handleBannerUrl(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const current = await settingsService.get('bannerUrl');
  await promptEditSetting(ctx, 'bannerUrl', 'URL Banner', current);
}

async function handleReferralBonus(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const current = await settingsService.get('referralBonus');
  await promptEditSetting(ctx, 'referralBonus', 'Bonus Referral (Rp)', current);
}

async function handleContactUrl(ctx) {
  await ctx.answerCbQuery().catch(() => {});
  const current = await settingsService.get('contactUrl');
  await promptEditSetting(ctx, 'contactUrl', 'URL Kontak Admin', current);
}

async function handleSettingInput(ctx) {
  const session = ctx.session?.adminAction;
  if (!session || session.type !== 'edit_setting') return false;

  const value = ctx.message.text.trim();
  const key = session.settingKey;
  ctx.session.adminAction = null;

  await settingsService.set(key, value);

  const labels = {
    shopName: 'Nama Toko',
    shopDesc: 'Deskripsi Toko',
    bannerUrl: 'URL Banner',
    referralBonus: 'Bonus Referral',
    contactUrl: 'URL Kontak Admin',
  };

  await ctx.reply(
    `✅ <b>${labels[key] || key}</b> berhasil diperbarui!\n\nNilai baru: <code>${value}</code>`,
    { parse_mode: 'HTML' },
  );

  return true;
}

async function safeEdit(ctx, text, options) {
  try { await ctx.editMessageText(text, options); } catch { await ctx.reply(text, options); }
}

module.exports = {
  showSettingsPanel,
  handleShopName,
  handleShopDesc,
  handleBannerUrl,
  handleReferralBonus,
  handleContactUrl,
  handleSettingInput,
};
