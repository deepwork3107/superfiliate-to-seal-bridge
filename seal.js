const axios = require("axios");

const SEAL_BASE = "https://app.sealsubscriptions.com/shopify/merchant/api";

// Helper function to get and validate token
function getSealToken() {
  const token = process.env.SEAL_MERCHANT_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SEAL_MERCHANT_TOKEN in environment variables. Please set it in your .env file or PM2 environment."
    );
  }
  return token;
}

// ===============================
//  GET SUBSCRIPTIONS BY EMAIL
// ===============================
async function getSubscriptionsByEmail(email) {
  const SEAL_TOKEN = getSealToken();
  const url = `${SEAL_BASE}/subscriptions?query=${encodeURIComponent(email)}`;

  // Minimal logging: show that we are calling Seal for this email

  try {
    const res = await axios.get(url, {
      headers: {
        "X-Seal-Token": SEAL_TOKEN,
        Accept: "application/json",
      },
    });

    // Minimal logging: show status code only
    console.log(`✅ Seal: subscriptions fetch succeeded (status ${res.status})`);
    return res.data;
  } catch (err) {
    console.error(
      "❌ Seal: error fetching subscriptions",
      "status:",
      err.response?.status,
      "message:",
      err.message
    );
    throw err;
  }
}

// ===============================
//  PICK ACTIVE SUBSCRIPTION
// ===============================
function pickActiveSubscriptionId(subscriptionsResponse) {
  // Handle nested payload structure: resp.payload.subscriptions
  const subscriptions = subscriptionsResponse?.payload?.subscriptions || [];
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return null;
  }

  // Find the first active subscription
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "ACTIVE"
  );

  if (!activeSubscription) {
    return null;
  }

  // Return the subscription ID of the active subscription
  return activeSubscription.id;
}

// ===============================
//  APPLY DISCOUNT TO SUBSCRIPTION
// ===============================
async function applyDiscountCodeToSubscription(subscriptionId, discountCode) {
  const SEAL_TOKEN = getSealToken();
  const url = `${SEAL_BASE}/subscription-discount-code`;

  const body = {
    subscription_id: Number(subscriptionId),
    action: "apply",
    discount_code: discountCode,
  };

  // Minimal logging: show that we are applying a code
  

  try {
    const res = await axios.put(url, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Seal-Token": SEAL_TOKEN,
      },
    });

    console.log(
      `✅ Seal: successfully applied discount code ${discountCode} to subscription ${subscriptionId} (status ${res.status})`
    );
  } catch (err) {
    console.error(
      "❌ Seal: error applying discount code",
      "status:",
      err.response?.status,
      "message:",
      err.message
    );
    throw err;
  }
}

// EXPORTS
module.exports = {
  getSubscriptionsByEmail,
  pickActiveSubscriptionId,
  applyDiscountCodeToSubscription,
};
