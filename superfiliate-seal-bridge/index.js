// index.js
require("dotenv").config();
const express = require("express");

// Our Seal helper functions
const {
  getSubscriptionsByEmail,
  pickActiveSubscriptionId,
  applyDiscountCodeToSubscription,
} = require("./seal");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Simple health check
 */
app.get("/", (req, res) => {
  res.send("Superfiliate → Seal bridge is running ✅");
});

/**
 * Helper: find active Seal subscription for a given email
 */
async function findSealSubscriptionIdByEmail(email) {
  try {
    const resp = await getSubscriptionsByEmail(email);
    const subscriptionId = pickActiveSubscriptionId(resp);
    console.log("🔎 Seal subscription for", email, "=>", subscriptionId);

    return subscriptionId;
  } catch (err) {
    console.error("❌ Error fetching Seal subscriptions for", email, err);
    return null;
  }
}

/**
 * Superfiliate "customer_updated" webhook
 * Configure this URL in Superfiliate as:
 *  POST https://YOUR_DOMAIN/webhooks/superfiliate/customer_updated
 *  topic: "customer_updated"
 */
app.post("/webhooks/superfiliate/customer_updated", async (req, res) => {
  try {
    const event = req.body;
    console.log("Superfiliate webhook received: event", event);

    // Adjust keys if their payload uses different names
    const email = event.email;
    const rewardCode = event.reward_code;

    if (!email || !rewardCode) {
      console.warn(
        "⚠️ Missing email or reward code in webhook payload:",
        JSON.stringify(event)
      );
      return res.sendStatus(200);
    }

    console.log(`➡️ customer_updated for ${email}, rewardCode = ${rewardCode}`);

    // 1) Find active Seal subscription for this email
    const subscriptionId = await findSealSubscriptionIdByEmail(email);

    if (!subscriptionId) {
      console.warn(
        `⚠️ No active Seal subscription found for email ${email}. Not applying code.`
      );
      return res.sendStatus(200);
    }

    // 2) Apply the Superfiliate reward code to that subscription
    await applyDiscountCodeToSubscription(subscriptionId, rewardCode);

    console.log(
      `✅ Applied reward code ${rewardCode} to subscription ${subscriptionId} for ${email}`
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(
      "❌ Error handling Superfiliate customer_updated webhook:",
      err
    );
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
