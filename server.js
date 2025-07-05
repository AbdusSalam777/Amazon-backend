const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

//MongoDB connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connecting to MongoDB . . .");
    console.log("MongoDB connected 🚀");
  })
  .catch((error) => {
    console.log("Error connecting MongoDB ❌");
  });

const Data_Schema1 = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

const Data_Schema2 = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  userId: String
});

const model_data = new mongoose.model("datas", Data_Schema1);
const model_cart = new mongoose.model("cart", Data_Schema2);

//Routing
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.get("/get-data", async (req, res) => {
  const data = await model_data.find();
  res.send(data);
});

app.post("/send-cart-data", async (req, res) => {
  const { image, name, price , userId } = req.body;
  await model_cart.create({
    name: name,
    price: price,
    image: image,
    userId: userId
  });
  res.status(200).json({ message: "Success" });
});

app.get("/get-cart-data", async (req, res) => {
   const { userId } = req.query;
  try {
    const data = await model_cart.find({ userId });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/delete-item", async (req, res) => {
  const { id, userId } = req.body;
  try {
    await model_cart.deleteOne({ _id: id, userId });
    res.status(200).json({ message: "Item delete successfully !" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/clear-cart", async (req, res) => {
  const { userId } = req.body;
  try {
    await model_cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared from Database !" });
  } catch (error) {
    console.log(error);
  }
});

//listen Server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
