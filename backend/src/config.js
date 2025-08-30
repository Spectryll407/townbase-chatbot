import dotenv from "dotenv";
dotenv.config();

export default {
  apiUrl: process.env.API_URL,
  apiKey: process.env.API_KEY,
  port: process.env.PORT || 8000,
  openAiKey: process.env.OPENAI_API_KEY
};