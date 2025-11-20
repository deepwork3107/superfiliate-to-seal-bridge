# Seal Node.js Bridge

A Node.js Express server that acts as a bridge between your application and the Seal Subscriptions API. This bridge provides secure, authenticated endpoints for managing subscriptions.

## Features

- 🔐 Bearer token authentication
- 📋 Get customer subscriptions by email
- ⏸️ Pause/resume subscriptions
- ❌ Cancel/reactivate subscriptions
- ⚡ Charge subscription immediately
- 📅 Reschedule subscription billing dates

## API Endpoints

### Health Check
```
GET /health
```
Returns: `{"ok": true}`

### Get Subscriptions
```
GET /api/subscriptions?email=customer@example.com
Headers: Authorization: Bearer YOUR_BRIDGE_BEARER
```

### Update Subscription
```
PUT /api/subscription/:id
Headers: Authorization: Bearer YOUR_BRIDGE_BEARER
Body: { "action": "pause" | "resume" | "cancel" | "reactivate" }
```

### Charge Subscription Now
```
PUT /api/subscription/:id/charge-now
Headers: Authorization: Bearer YOUR_BRIDGE_BEARER
Body: { "reset_schedule": true }
```

### Reschedule Subscription
```
PUT /api/subscription/:id/reschedule
Headers: Authorization: Bearer YOUR_BRIDGE_BEARER
Body: {
  "date": "2025-11-10",
  "time": "09:30",
  "timezone": "America/Chicago",
  "reset_schedule": true,
  "attempt_id": 123 (optional)
}
```

## Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deepwork3107/gorgias-to-seal-api-bridge.git
   cd gorgias-to-seal-api-bridge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env and add your tokens
   ```

4. **Start the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

5. **Test the health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
BRIDGE_BEARER=your_secure_bearer_token_here
SEAL_TOKEN=your_seal_api_token_here
PORT=3000
```

### Generating a Secure Bearer Token

```bash
openssl rand -hex 32
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- Render (Recommended)
- Railway
- Fly.io
- DigitalOcean App Platform
- Cloudways (VPS setup)

## Requirements

- Node.js 18 or higher
- npm or yarn

## Project Structure

```
seal-node-app/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── ecosystem.config.js   # PM2 configuration (for server deployment)
├── DEPLOYMENT.md         # Detailed deployment guide
└── README.md            # This file
```

## Security Notes

- Never commit `.env` file to git (already in `.gitignore`)
- Use strong, random tokens for `BRIDGE_BEARER`
- Keep your `SEAL_TOKEN` secure
- Use HTTPS in production

## License

ISC

