const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

const dbName="VIC-EM";
const client = new MongoClient(
"mongodb+srv://heroreal5385:5WkvwFmjRJueBz9L@cluster0.7wtz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

async function connectToMongo() {
  try {
    client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToMongo();


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post("/bookingData", async (req, res) => {
  const { selectedCenter, startDate, time, plateNo, brand, selectedServices, name, email,carModel, year } = req.body;
  const bookingInfo = {
    name: name,
    email: email,
    selectedCenter:selectedCenter,
    date: startDate,
    time: time,
    plateNo:plateNo,
    brand:brand,
    selectedServices:selectedServices,
    carModel:carModel,
    year:year
  };
  const db = client.db(dbName);
  const collection = db.collection("BookingData");
  await collection.insertOne(bookingInfo);
});
app.get("/bookingData", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("BookingData");
    // Retrieve data from MongoDB
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/deleteBooking", async (req, res) => {
  const { id,price } = req.body; // Get the id from the request body

  try {
    const db = client.db(dbName);
    const collection = db.collection("BookingData");

    // Update the booking document by setting the action to "deleted"
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Filter by the document's _id
      { $set: { action: "deleted", price:price } } // Set the action to "deleted"
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Booking marked as deleted." });
    } else {
      res.status(404).json({ message: "Booking not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the booking." });
  }
});

const port =  3000;
app.listen(port, () => {
  console.log(`Server is running on 3000`);
});