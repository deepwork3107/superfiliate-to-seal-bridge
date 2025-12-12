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
        PORT: 3001, // Set port here - this will override .env file
        // dotenv will load .env file automatically
      },
      // Override .env PORT if it conflicts
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      // Use PM2's default log location or specify absolute paths
      // error_file: "./logs/err.log",
      // out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 50,
      min_uptime: "5s",
      max_memory_restart: "200M",
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true,
      // Prevent PM2 from killing the process too quickly
      wait_ready: false,
    },
  ],
};

