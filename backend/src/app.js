import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Townbase Chatbot API 🚀" });
});

export default app;
