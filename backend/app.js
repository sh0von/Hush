const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://minarsvn:Minar909@cluster0.pad3few.mongodb.net/anonymous?retryWrites=true&w=majority", {
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
});
const Message = mongoose.model("Message", MessageSchema);

app.use(bodyParser.json());

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
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
