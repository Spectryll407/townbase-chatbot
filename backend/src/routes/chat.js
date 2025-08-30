import express from "express";
import { fetchEvents } from "../services/townbase.js";
import { interpretQuery, summarizeEvents } from "../services/llm.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query is required" });

  // Step 1: LLM interprets query
  const interpreted = await interpretQuery(query);
  console.log("Interpreted query:", interpreted);

  // Step 2: Fetch events
  const events = await fetchEvents(interpreted.keywords);

  if (!events.length) {
    return res.json({
      reply: `Sorry, I couldn’t find events for "${interpreted.keywords}".`,
      events: []
    });
  }

  // Clean events for frontend
  const formatted = events.map(e => ({
    id: e._id,
    name: e.name || "Untitled",
    start: e.start || "No date",
    url: e.url || "",
    location: e.locations?.[0]?.address || ""
  }));

  // Step 3: LLM summarizes results
  const summary = await summarizeEvents(query, formatted);

  return res.json({
    reply: summary,
    events: formatted
  });
});

export default router;
