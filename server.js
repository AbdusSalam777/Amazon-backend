// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: ["https://shopsparrow.netlify.app"], 
  credentials: true
}));
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected 🚀");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  });

// ===== SCHEMAS =====
const Data_Schema1 = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

const Data_Schema2 = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  userId: String
});

const model_data = mongoose.model("datas", Data_Schema1);
const model_cart = mongoose.model("cart", Data_Schema2);

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.json({ message: "Server running 🚀" });
});

app.get("/get-data", async (req, res) => {
  try {
    const data = await model_data.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.post("/send-cart-data", async (req, res) => {
  try {
    const { image, name, price, userId } = req.body;
    await model_cart.create({ name, price, image, userId });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

app.get("/get-cart-data", async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await model_cart.find({ userId });
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ message: "Error fetching cart data" });
  }
});

app.delete("/delete-item", async (req, res) => {
  try {
    const { id, userId } = req.body;
    await model_cart.deleteOne({ _id: id, userId });
    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

app.delete("/clear-cart", async (req, res) => {
  try {
    const { userId } = req.body;
    await model_cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared from Database!" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
