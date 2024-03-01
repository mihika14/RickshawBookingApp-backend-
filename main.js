const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

require("./models/DriverData");
const DriverData = mongoose.model("Registereddrivers");

app.use(express.json());

app.post("/registerdriver", async (req, res) => {
  const { name, email, password, telno, age } = req.body;
  try {
    const oldUser = await DriverData.find({ email });
    if (oldUser.length > 0) {
      return res.json({ error: "User exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await DriverData.create({
      name,
      email,
      password: hashedPassword,
      telno,
      age,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/logindriver", async (req, res) => {
  const { email, password } = req.body;
  const driver = await DriverData.findOne({ email });
  if (!driver) {
    return res.json({ error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, driver.password);
  if (isPasswordValid) {
    const token = jwt.sign({ driverId: DriverData._id }, JWT_SECRET);
    return res.status(201).json({ status: "ok", token });
  }
});

app.get("/driverdetails", async (req, res) => {
  try {
    const driverDetails = await DriverData.find();

    res.json(driverDetails);
  } catch (error) {
    console.error("Error fetching Driver detatils:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch Driver details" });
  }
});

require("./models/DriverLocation");
const DriverCoordinatesTime = mongoose.model("LocationDrivers");

app.post("/driverlocationandtime", async (req, res) => {
  try {
    const { name,latitude, longitude, startTiming, endTiming } = req.body;
    const newLocationTime = new DriverCoordinatesTime({
      name,
      latitude,
      longitude,
      startTiming,
      endTiming,
    });

    await newLocationTime.save();

    res.json({
      status: "ok",
      message: "Location and timings stored successfully",
    });
  } catch (error) {
    console.error("Error storing location and timings:", error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to store location and timings",
      });
  }
});

app.get("/fetchdriverlocationTime", async (req, res) => {
  try {
    const coordinatesTime = await DriverCoordinatesTime.find();

    res.json(coordinatesTime);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch coordinates" });
  }
});


require("./models/CustomerData");
const CustomerData = mongoose.model("RegisteredCustomers");

app.post("/registeruser", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const oldUser = await CustomerData.findOne({ email });
    if (oldUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await CustomerData.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ status: "ok" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;
  const customer = await CustomerData.findOne({ email });
  if (!customer) {
    return res.json({ error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, customer.password);
  if (isPasswordValid) {
    const token = jwt.sign({ customerId: CustomerData._id }, JWT_SECRET);
    return res.status(201).json({ status: "ok", token });
  }
});

require("./models/CustomerLocation");
const CustomerCoordinatesTime = mongoose.model("LocationCustomer");

app.post('/customerlocationTime' , async(req,res)=> {
  try {
  const { latitude, longitude, Timing } = req.body;
  const CustomernewLocationTime = new CustomerCoordinatesTime({
    latitude,
    longitude,
    Timing,
  });

  await CustomernewLocationTime.save();

  res.json({
    status: "ok",
    message: "Location and timings stored successfully",
  });
} catch (error) {
  console.error("Error storing location and timings:", error);
  res
    .status(500)
    .json({
      status: "error",
      message: "Failed to store location and timings",
    });
}
});

app.get("/fetchCustomerLocation", async (req, res) => {
  try {
    const CustomercoordinatesTime = await CustomerCoordinatesTime.find();

    res.json(CustomercoordinatesTime);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch coordinates" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on PORT 5000");
});
