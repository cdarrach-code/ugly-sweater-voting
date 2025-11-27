// netlify/functions/clearVotes.js
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

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const store = getStore(STORE_NAME);
    const existing = await store.get(KEY, { type: "json" });
    const data = initData(existing);

    const newData = {
      contestId: data.contestId + 1, // new round
      adult: {},
      child: {}
    };

    await store.setJSON(KEY, newData);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData)
    };
  } catch (err) {
    console.error("clearVotes error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to clear votes" })
    };
  }
};