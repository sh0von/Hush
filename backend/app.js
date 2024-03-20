const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const MessageSchema = new mongoose.Schema({
  name: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  loveCount: { type: Number, default: 0 },
});
const Message = mongoose.model("Message", MessageSchema);

app.use(bodyParser.json());

app.delete("/api/messages/:id", async (req, res) => {
  const messageId = req.params.id;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await message.remove();

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/messages/:id/love", async (req, res) => {
  const messageId = req.params.id;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    message.loveCount++;
    await message.save();
    res.json({
      message: "Message loved successfully",
      loveCount: message.loveCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/messages", async (req, res) => {
  const { name, message } = req.body;
  try {
    const newMessage = new Message({ name, message });
    await newMessage.save();
    res.status(201).json({ message: "Message added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(
      messages.map(({ _id, name, message, timestamp, loveCount }) => ({
        _id,
        name,
        message,
        timestamp,
        loveCount,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
