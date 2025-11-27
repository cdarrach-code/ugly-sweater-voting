// netlify/functions/getVotes.js
const { getStore } = require("@netlify/blobs");

const STORE_NAME = "ugly-sweater-votes";
const KEY = "votes";

function initData(existing) {
  if (!existing || typeof existing !== "object") {
    return { contestId: 1, adult: {}, child: {} };
  }
  return {
    contestId: Number(existing.contestId) || 1,
    adult: existing.adult || {},
    child: existing.child || {}
  };
}

exports.handler = async () => {
  try {
    const store = getStore(STORE_NAME);
    const existing = await store.get(KEY, { type: "json" });
    const data = initData(existing);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("getVotes error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load votes" })
    };
  }
};