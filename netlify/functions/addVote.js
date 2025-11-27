// netlify/functions/addVote.js
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

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    body = {};
  }

  const adultName = (body.adultName || "").trim();
  const childName = (body.childName || "").trim();

  if (!adultName && !childName) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Please enter at least one sweater name." })
    };
  }

  try {
    const store = getStore(STORE_NAME);
    const existing = await store.get(KEY, { type: "json" });
    const data = initData(existing);

    if (adultName) {
      data.adult[adultName] = (data.adult[adultName] || 0) + 1;
    }
    if (childName) {
      data.child[childName] = (data.child[childName] || 0) + 1;
    }

    await store.setJSON(KEY, data);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("addVote error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to save vote" })
    };
  }
};