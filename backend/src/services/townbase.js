import axios from "axios";
import config from "../config.js";

export async function fetchEvents(query, size = 5, language = "en") {
  try {
    const response = await axios.get(`${config.apiUrl}public/search`, {
      params: {
        apiKey: config.apiKey,
        type: "event",
        q: query,
        size,
        language
      }
    });
    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return [];
  }
}
