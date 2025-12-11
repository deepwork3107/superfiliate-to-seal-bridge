const path = require("path");

// Load .env file from the same directory as this config file
require("dotenv").config({ path: path.join(__dirname, ".env") });

module.exports = {
  apps: [
    {
      name: "superfiliate-seal-api",
      script: path.join(__dirname, "index.js"),
      instances: 1,
      exec_mode: "fork",
      watch: false,
      cwd: __dirname, // Set working directory to config file location
      env: {
        NODE_ENV: "production",
        SEAL_MERCHANT_TOKEN: process.env.SEAL_MERCHANT_TOKEN,
        PORT: process.env.PORT || 3000,
      },
      error_file: path.join(__dirname, "logs", "pm2-error.log"),
      out_file: path.join(__dirname, "logs", "pm2-out.log"),
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};

