# Superfiliate → Seal Bridge

A Node.js Express server that bridges Superfiliate webhooks to Seal Subscriptions API, automatically applying reward codes to active customer subscriptions.

## 🎯 Overview

This bridge service receives webhook events from Superfiliate when a customer is updated with a reward code, then automatically applies that discount code to the customer's active Seal subscription.

## ✨ Features

- Receives Superfiliate `customer_updated` webhooks
- Finds active Seal subscriptions by customer email
- Automatically applies reward codes to active subscriptions
- Comprehensive logging for debugging
- Error handling and validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Seal Subscriptions merchant account with API access
- Superfiliate account with webhook access
- A publicly accessible server/domain (for webhook endpoints)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/deepwork3107/superfiliate-to-seal-bridge.git
cd superfiliate-seal-bridge
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables:

```env
# Seal Subscriptions API Configuration
SEAL_MERCHANT_TOKEN=your_seal_merchant_token_here

# Server Configuration (optional)
PORT=3001
```

**Important:** 
- Replace `your_seal_merchant_token_here` with your actual Seal merchant token
- Never commit the `.env` file to version control (it's already in `.gitignore`)

### 4. Get Your Seal Merchant Token

1. Log in to your Seal Subscriptions merchant dashboard
2. Navigate to API settings/integrations
3. Generate or copy your merchant API token
4. Add it to your `.env` file

## 🔧 Configuration

### Server Port

By default, the server runs on port `3001`. You can change this by setting the `PORT` environment variable:

```env
PORT=8080
```

### Seal API Base URL

The Seal API base URL is hardcoded to:
```
https://app.sealsubscriptions.com/shopify/merchant/api
```

If you need to change this, edit `seal.js` and update the `SEAL_BASE` constant.

## 🏃 Running the Application

### Development Mode

```bash
node index.js
```

Or with npm:

```bash
npm start
```

You should see:
```
🚀 Server listening on port 3001
```

### Production Mode

For production, consider using a process manager like PM2:

#### Option 1: Using Ecosystem File (Recommended)

1. Make sure your `.env` file exists in the project root with `SEAL_MERCHANT_TOKEN` set
2. Start with the ecosystem config:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Option 2: Direct Start with Environment Variables

```bash
npm install -g pm2
pm2 start index.js --name superfiliate-seal-api --env production
pm2 save
pm2 startup
```

**Important:** When using PM2, ensure:
- The `.env` file exists in the same directory as `index.js`
- PM2 is started from the project root directory
- The `SEAL_MERCHANT_TOKEN` is set in your `.env` file

#### PM2 Management Commands

```bash
# View logs
pm2 logs superfiliate-seal-api

# Restart
pm2 restart superfiliate-seal-api

# Stop
pm2 stop superfiliate-seal-api

# Delete
pm2 delete superfiliate-seal-api

# Monitor
pm2 monit
```

## 📡 API Endpoints

### Health Check

**GET** `/`

Returns a simple status message confirming the server is running.

**Response:**
```
Superfiliate → Seal bridge is running ✅
```

### Webhook Endpoint

**POST** `/webhooks/superfiliate/customer_updated`

Receives webhook events from Superfiliate when a customer is updated.

**Expected Payload:**
```json
{
  "email": "customer@example.com",
  "reward_code": "DISCOUNT20"
}
```

**Response:**
- `200` - Success (even if no subscription found)
- `500` - Server error

## 🔗 Superfiliate Webhook Configuration

### Step 1: Deploy Your Server

Deploy this application to a publicly accessible server (e.g., Heroku, AWS, DigitalOcean, Railway, etc.).

### Step 2: Configure Webhook in Superfiliate

1. Log in to your Superfiliate dashboard
2. Navigate to **Settings** → **Webhooks** (or **Integrations**)
3. Click **Add Webhook** or **Create Webhook**
4. Configure the webhook:
   - **URL:** `https://YOUR_DOMAIN/webhooks/superfiliate/customer_updated`
   - **Topic/Event:** `customer_updated`
   - **Method:** `POST`
   - **Format:** `JSON`

### Step 3: Test the Webhook

You can test the webhook using curl:

```bash
curl -X POST https://YOUR_DOMAIN/webhooks/superfiliate/customer_updated \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "reward_code": "TEST20"
  }'
```

## 📁 Project Structure

```
superfiliate-seal-bridge/
├── index.js              # Main Express server and webhook handler
├── seal.js               # Seal API helper functions
├── package.json          # Node.js dependencies
├── package-lock.json     # Locked dependency versions
├── ecosystem.config.js   # PM2 configuration file
├── .env                  # Environment variables (not in git)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🔍 How It Works

1. **Webhook Received**: Superfiliate sends a `customer_updated` event to `/webhooks/superfiliate/customer_updated`
2. **Email Extraction**: The bridge extracts the customer's email and reward code from the payload
3. **Find Subscription**: Queries Seal API to find all subscriptions for that email
4. **Select Active**: Picks the first subscription with `status: "ACTIVE"`
5. **Apply Discount**: Applies the reward code to the active subscription via Seal API
6. **Logging**: Comprehensive logs are output for debugging

## 🐛 Troubleshooting

### Issue: "Missing SEAL_MERCHANT_TOKEN in .env" (PM2)

**Symptoms:** PM2 logs show `❌ Missing SEAL_MERCHANT_TOKEN in .env` repeatedly

**Solutions:**

1. **Verify `.env` file exists and contains the token:**
   ```bash
   cd /path/to/superfiliate-seal-bridge
   cat .env
   # Should show: SEAL_MERCHANT_TOKEN=your_actual_token_here
   ```

2. **Ensure PM2 is running from the correct directory:**
   ```bash
   # Stop the current PM2 process
   pm2 delete superfiliate-seal-api
   
   # Navigate to project directory
   cd /path/to/superfiliate-seal-bridge
   
   # Start using ecosystem file (recommended)
   pm2 start ecosystem.config.js
   
   # Or start directly with explicit path
   pm2 start index.js --name superfiliate-seal-api --cwd /path/to/superfiliate-seal-bridge
   ```

3. **Use ecosystem.config.js (Recommended):**
   The ecosystem file loads environment variables properly. Make sure to:
   ```bash
   pm2 delete superfiliate-seal-api
   pm2 start ecosystem.config.js
   ```

4. **Manually set environment variable in PM2:**
   ```bash
   pm2 delete superfiliate-seal-api
   pm2 start index.js --name superfiliate-seal-api --update-env --env production
   pm2 set superfiliate-seal-api SEAL_MERCHANT_TOKEN "your_token_here"
   pm2 restart superfiliate-seal-api
   ```

5. **Check PM2 working directory:**
   ```bash
   pm2 describe superfiliate-seal-api
   # Check the "cwd" field - it should point to your project directory
   ```

### Issue: "No active Seal subscription found"

**Possible causes:**
- Customer email doesn't match any Seal subscriptions
- Customer has no subscriptions in Seal
- All subscriptions are paused/cancelled
- Email format mismatch (case sensitivity, etc.)

**Solution:** Check the Seal dashboard to verify the customer has an active subscription with the exact email address.

### Issue: Webhook not receiving events

**Check:**
1. Server is running and accessible
2. Webhook URL is correctly configured in Superfiliate
3. Firewall/security groups allow incoming POST requests
4. Check server logs for incoming requests

### Issue: "Error fetching Seal subscriptions"

**Possible causes:**
- Invalid Seal merchant token
- Network connectivity issues
- Seal API is down
- Rate limiting

**Solution:** Verify your Seal token is correct and check Seal API status.

## 📝 Logging

The application provides detailed logging:

- `🔎` - Subscription lookup
- `✅` - Success operations
- `⚠️` - Warnings (missing data, no subscriptions)
- `❌` - Errors
- `=== SEAL API REQUEST ===` - Outgoing API requests
- `=== SEAL API RESPONSE ===` - API responses

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep your Seal merchant token secure
- Use HTTPS in production
- Consider adding webhook signature verification
- Rate limit webhook endpoints if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the Seal Subscriptions API documentation
- Check the Superfiliate webhook documentation

## 🔄 Version History

- **v1.0.0** - Initial release
  - Webhook handler for Superfiliate customer_updated events
  - Seal API integration for subscription lookup and discount application
  - Fixed nested payload structure handling

