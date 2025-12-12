module.exports = {
  apps: [
    {
      name: "superfiliate-seal-bridge",
      script: "./index.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        // Load from .env file - PM2 will read it automatically if dotenv is used
      },
      env_file: ".env",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "200M",
    },
  ],
};

