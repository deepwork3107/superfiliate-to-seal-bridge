# Deployment Guide - Seal Node.js Bridge

This guide covers deploying the Seal Node.js Bridge application to various hosting platforms.

## Prerequisites

- Node.js 18+ installed
- Environment variables configured (see `.env.example`)
- Git repository set up

## Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BRIDGE_BEARER` | Bearer token for API authentication | Yes |
| `SEAL_TOKEN` | Seal Subscriptions API token | Yes |
| `PORT` | Server port (default: 3000) | No |

---

## Option 1: Render (Recommended - Easiest)

Render is great for Node.js apps with free tier and easy deployment.

### Steps:

1. **Sign up** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `deepwork3107/gorgias-to-seal-api-bridge`
   - Select the repository

3. **Configure the service:**
   - **Name:** `seal-bridge` (or your preferred name)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

4. **Add Environment Variables:**
   - Go to "Environment" tab
   - Add:
     - `BRIDGE_BEARER` = your bearer token
     - `SEAL_TOKEN` = your Seal API token
     - `PORT` = 3000 (or let Render assign automatically)
   - `NODE_ENV` = production

5. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically deploy from your GitHub repo
   - Your app will be live at: `https://seal-bridge.onrender.com`

6. **Health Check:**
   - Test: `https://your-app.onrender.com/health`
   - Should return: `{"ok":true}`

---

## Option 2: Railway

Railway offers simple deployment with automatic HTTPS.

### Steps:

1. **Sign up** at [railway.app](https://railway.app)

2. **Create a new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure:**
   - Railway auto-detects Node.js apps
   - Add environment variables:
     - `BRIDGE_BEARER`
     - `SEAL_TOKEN`
     - `PORT` (optional)

4. **Deploy:**
   - Railway automatically deploys
   - You'll get a URL like: `https://your-app.up.railway.app`

---

## Option 3: Fly.io

Good for global distribution and low latency.

### Steps:

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Launch app:**
   ```bash
   fly launch
   ```
   - Follow prompts to create `fly.toml`

4. **Set secrets:**
   ```bash
   fly secrets set BRIDGE_BEARER=your_token
   fly secrets set SEAL_TOKEN=your_seal_token
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

---

## Option 4: Cloudways (Your Current Platform)

**Note:** Cloudways is primarily optimized for PHP. For Node.js, you have two options:

### Option 4a: Use Cloudways Node.js Support (If Available)

1. **In the Cloudways interface:**
   - Change "PHP Version" dropdown to **"Node.js"** (not "php Custom App")
   - Select Node.js version (18+ recommended)

2. **After server creation:**
   - Connect via SSH
   - Navigate to your application directory
   - Clone your repository:
     ```bash
     git clone https://github.com/deepwork3107/gorgias-to-seal-api-bridge.git
     cd gorgias-to-seal-api-bridge
     ```

3. **Install dependencies:**
   ```bash
     npm install --production
     ```

4. **Create `.env` file:**
   ```bash
   nano .env
   ```
   Add your environment variables:
   ```
   BRIDGE_BEARER=your_token
   SEAL_TOKEN=your_seal_token
   PORT=3000
   ```

5. **Install PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   ```

6. **Start the application:**
   ```bash
   pm2 start server.js --name seal-bridge
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx (if needed):**
   - Cloudways usually handles this, but you may need to configure reverse proxy
   - Point domain/subdomain to `http://localhost:3000`

### Option 4b: Use Cloudways VPS with Manual Setup

1. **Create a Basic VPS:**
   - Select DigitalOcean/Vultr/Linode
   - Choose Basic type, 2GB RAM minimum
   - Launch server

2. **SSH into server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and setup:**
   ```bash
   git clone https://github.com/deepwork3107/gorgias-to-seal-api-bridge.git
   cd gorgias-to-seal-api-bridge
   npm install --production
   ```

6. **Configure environment:**
   ```bash
   nano .env
   # Add your environment variables
   ```

7. **Start with PM2:**
   ```bash
   pm2 start server.js --name seal-bridge
   pm2 save
   pm2 startup
   ```

8. **Configure firewall:**
   ```bash
   sudo ufw allow 3000/tcp
   ```

---

## Option 5: DigitalOcean App Platform (Recommended for Production)

Simple deployment directly from GitHub.

### Steps:

1. **Sign up** at [digitalocean.com](https://digitalocean.com)

2. **Create App:**
   - Go to "Apps" → "Create App"
   - Connect GitHub repository

3. **Configure:**
   - **Source:** Your GitHub repo
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **HTTP Port:** 3000

4. **Environment Variables:**
   - Add `BRIDGE_BEARER`, `SEAL_TOKEN`, `PORT`

5. **Deploy:**
   - Click "Create Resources"
   - Automatic deployment starts

---

## Post-Deployment Checklist

- [ ] Test health endpoint: `GET /health`
- [ ] Test subscriptions endpoint with authentication
- [ ] Verify environment variables are set correctly
- [ ] Set up monitoring/uptime checks
- [ ] Configure domain (optional)
- [ ] Set up SSL/HTTPS (usually automatic on these platforms)

## Testing Your Deployment

```bash
# Health check
curl https://your-domain.com/health

# Test with authentication (replace YOUR_BEARER_TOKEN)
curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
     https://your-domain.com/api/subscriptions?email=test@example.com
```

## Troubleshooting

### App won't start:
- Check environment variables are set
- Verify Node.js version (18+)
- Check logs: `pm2 logs` or platform logs

### 401 Unauthorized:
- Verify `BRIDGE_BEARER` is set correctly
- Check Authorization header format: `Bearer <token>`

### Connection errors to Seal API:
- Verify `SEAL_TOKEN` is correct
- Check network/firewall settings

## Recommended: Render or Railway

For this Node.js application, I **highly recommend Render or Railway** because:
- ✅ Optimized for Node.js
- ✅ Free tier available
- ✅ Automatic HTTPS/SSL
- ✅ Easy GitHub integration
- ✅ Automatic deployments on push
- ✅ Built-in monitoring

Cloudways is better for PHP applications, but can work for Node.js with manual setup.

