// functions/safepay-tracker/src/main.js
import Safepay from "@sfpy/node-core";

export default async ({ req, res, log, error }) => {
  // only accept POST requests
  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" }, 405);
  }

  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    return res.json({ error: "amount and orderId are required" }, 400);
  }

  try {
    // connect to SafePay using secret keys stored in Appwrite env variables
    const safepay = Safepay(process.env.SAFEPAY_SECRET_KEY, {
      authType: "secret",
      host: "https://sandbox.api.getsafepay.com", // change to https://api.getsafepay.com for production
    });

    // create a payment session — like getting a token to start paying
    const response = await safepay.payments.session.setup({
      merchant_api_key: process.env.SAFEPAY_API_KEY,
      intent: "CYBERSOURCE",
      mode: "payment",
      currency: "PKR",
      amount: amount * 100, // SafePay wants amount in paisas e.g. Rs.10 = 1000 paisas
      metadata: { order_id: orderId },
    });

    log("✅ Tracker created:", response.tracker.token);

    // send the token back to the app
    return res.json({
      tracker: response.tracker.token,
      clientSecret: response.tracker.client_secret,
      deviceDataCollectionJWT: response.tracker.device_data_collection_jwt,
      deviceDataCollectionURL: response.tracker.device_data_collection_url,
    });

  } catch (err) {
    error("❌ SafePay error:", err);
    return res.json({ error: "Failed to create tracker" }, 500);
  }
};