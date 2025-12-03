/**
 * Configuración de PM2 para producción
 * 
 * Uso:
 *   pm2 start ecosystem.config.js
 *   pm2 restart ecosystem.config.js
 *   pm2 stop ecosystem.config.js
 *   pm2 logs fibertech
 */

module.exports = {
  apps: [
    {
      name: 'fibertech',
      script: 'npm',
      args: 'start',
      cwd: '/home/ec2-user/fibertech',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      merge_logs: true,
    },
  ],
}

