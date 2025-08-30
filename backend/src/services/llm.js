import OpenAI from "openai";
import config from "../config.js";

const client = new OpenAI({ apiKey: config.openAiKey });

/**
 * Step 1: Interpret user query (keywords, city, date, spelling correction)
 */
export async function interpretQuery(query) {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a query interpreter for an events search system. " +
            "Take user text, fix spelling, infer intent, and return a JSON object with {keywords, city?, date?}. " +
            "Only output valid JSON."
        },
        { role: "user", content: query }
      ],
      temperature: 0.2
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error("LLM interpret error:", err.message);
    return { keywords: query }; // fallback
  }
}

/**
 * Step 3: Summarize events conversationally
 */
export async function summarizeEvents(query, events) {
  try {
    const eventText = events
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} (${e.start || "No date"}) at ${e.location || "unknown location"}`
      )
      .join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly chatbot that summarizes event search results. " +
            "Speak naturally, like a helpful guide. Always include event names and times if possible."
        },
        {
          role: "user",
          content: `User asked: "${query}". Events found:\n${eventText}`
        }
      ],
      temperature: 0.6
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("LLM summarize error:", err.message);
    return "I found some events, but couldn’t summarize them nicely.";
  }
}
