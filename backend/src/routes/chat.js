import express from "express";
import { fetchEvents } from "../services/townbase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { query, size = 5, language = "en" } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const events = await fetchEvents(query, size, language);

  if (!events.length) {
    return res.json({
      reply: "Sorry, I couldn’t find any events for that.",
      events: []
    });
  }

  // Clean structured response
  const formatted = events.map(e => ({
    id: e._id,
    name: e.name || "Untitled event",
    start: e.start || "No date",
    end: e.end || null,
    url: e.url || null,
    location: e.locations?.[0]?.address || null
  }));

  return res.json({
    reply: `Found ${formatted.length} events for "${query}"`,
    events: formatted
  });
});

export default router;
