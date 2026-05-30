module.exports = {
  apps: [
    {
      name: 'ava-order-bot',
      script: 'src/index.js',
      instances: 1, // Bot Telegram HARUS single instance (webhook)
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,

      // Restart delay setelah crash
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '30s',

      // Graceful shutdown
      kill_timeout: 10000,
      wait_ready: false,
      listen_timeout: 10000,
    },
  ],
};
