const axios = require("axios");

const SEAL_TOKEN = process.env.SEAL_MERCHANT_TOKEN;
const SEAL_BASE = "https://app.sealsubscriptions.com/shopify/merchant/api";

if (!SEAL_TOKEN) {
  console.error("❌ Missing SEAL_MERCHANT_TOKEN in .env");
  process.exit(1);
}

// LOG HELPER
function logRequest(method, url, info = {}) {
  console.log(`\n=== SEAL API REQUEST ===`);
  console.log(`➡️ Method: ${method}`);
  console.log(`➡️ URL: ${url}`);
  if (info.params) console.log(`➡️ Params:`, info.params);
  if (info.data) console.log(`➡️ Body:`, info.data);
  console.log(`=========================\n`);
}

function logResponse(code, data) {
  console.log(`=== SEAL API RESPONSE ===`);
  console.log(`⬅️ Status: ${code}`);
  console.log(`⬅️ Data:`, JSON.stringify(data, null, 2));
  console.log(`==========================\n`);
}

function logError(err) {
  console.log(`\n❌ SEAL API ERROR ❌`);
  console.log("Status:", err.response?.status);
  console.log("Data:", err.response?.data);
  console.log("Message:", err.message);
  console.log("=========================\n");
}

// ===============================
//  GET SUBSCRIPTIONS BY EMAIL
// ===============================
async function getSubscriptionsByEmail(email) {
  const url = `${SEAL_BASE}/subscriptions?query=${encodeURIComponent(email)}`;

  logRequest("GET", url, { params: { email } });

  try {
    const res = await axios.get(url, {
      headers: {
        "X-Seal-Token": SEAL_TOKEN,
        Accept: "application/json",
      },
    });

    logResponse(res.status, res.data);
    return res.data;
  } catch (err) {
    logError(err);
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
    console.log("⚠️ No subscriptions found for customer");
    return null;
  }

  // Find the first active subscription
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "ACTIVE"
  );

  if (!activeSubscription) {
    console.log("⚠️ No active subscriptions found.");
    return null;
  }

  // Return the subscription ID of the active subscription
  console.log(`ℹ️ Selected active subscription ID: ${activeSubscription.id}`);
  return activeSubscription.id;
}

// ===============================
//  APPLY DISCOUNT TO SUBSCRIPTION
// ===============================
async function applyDiscountCodeToSubscription(subscriptionId, discountCode) {
  const url = `${SEAL_BASE}/subscription-discount-code`;

  const body = {
    subscription_id: Number(subscriptionId),
    action: "apply",
    discount_code: discountCode,
  };

  logRequest("PUT", url, { data: body });

  try {
    const res = await axios.put(url, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Seal-Token": SEAL_TOKEN,
      },
    });

    logResponse(res.status, res.data);

    console.log(
      `✅ Successfully applied discount code ${discountCode} to subscription ${subscriptionId}`
    );
  } catch (err) {
    logError(err);
    throw err;
  }
}

// EXPORTS
module.exports = {
  getSubscriptionsByEmail,
  pickActiveSubscriptionId,
  applyDiscountCodeToSubscription,
};
